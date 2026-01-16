import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { qdrant, OLLAMA_URL, COLLECTION_NAME } from './config/database.js';

// Config
const CORPUS_DIR = './corpus';

async function ensureCollection() {
    try {
        const collection = await qdrant.getCollection(COLLECTION_NAME);
        console.log(`📚 Collection "${COLLECTION_NAME}" existe avec ${collection.points_count} points`);

        if (collection.points_count > 0 || collection.config.params.vectors.size !== 768) {
            console.log(`🗑️ Suppression de la collection "${COLLECTION_NAME}"...`);
            await qdrant.deleteCollection(COLLECTION_NAME);
            console.log(`✅ Collection supprimée`);
        }

    } catch (err) {
        // Collection n'existe pas, on continue
    }

    try {
        console.log(`📚 Création de la collection "${COLLECTION_NAME}"...`);
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: {
                size: 768, // Taille pour nomic-embed-text
                distance: 'Cosine'
            }
        });
        console.log(`✅ Collection "${COLLECTION_NAME}" créée`);
    } catch (err) {
        console.error('Erreur création collection:', err.message);
    }
}

async function indexCorpus() {
    //  Créer la collection si elle n'existe pas
    await ensureCollection();

    console.log('📂 Lecture du corpus...');
    const files = fs.readdirSync(CORPUS_DIR).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
        console.log('⚠️ Aucun fichier .json trouvé dans le dossier corpus/');
        return;
    }

    for (const file of files) {
        const filePath = path.join(CORPUS_DIR, file);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const doc = JSON.parse(rawData);

        if (!doc.text || typeof doc.text !== 'string') {
            console.warn(`⚠️ Skipping ${file} - missing or invalid "text" field.`);
            continue;
        }

        try {
            console.log(`🔄 Indexation de ${file}...`);

            // Generate embedding with Ollama
            const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nomic-embed-text',
                    prompt: doc.text
                })
            });

            const data = await response.json();
            const vector = data.embedding;
            const id = randomUUID();

            const point = {
                id,
                vector,
                payload: {
                    text: doc.text,
                    title: doc.title || 'Inconnu',
                    author: doc.author || 'Anonyme',
                    date: doc.date || 'Non précisée',
                    category: doc.category || 'Divers',
                    tags: doc.tags || [],
                    source: file
                }
            };

            await qdrant.upsert(COLLECTION_NAME, {
                wait: true,
                points: [point],
            });

            console.log(`✅ Fichier ${file} indexé avec succès`);
        } catch (err) {
            console.error(`❌ Erreur lors de l'indexation de ${file} :`, err?.response?.data || err.message);
        }
    }

    console.log('🏁 Indexation terminée.');
}

indexCorpus().then(() => console.log('✅ Indexation terminée avec succès.')).catch(console.error);
