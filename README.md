# RAG Chat Bot avec Ollama

Un chatbot intelligent qui répond à vos questions en cherchant dans vos documents, **100% gratuit et local** grâce à Ollama.
<img width="1793" height="1787" alt="image" src="https://github.com/user-attachments/assets/2546c539-451d-4d69-a861-366119c264c2" />



##  Fonctionnalités

-  **IA Locale** : Utilise Ollama (Llama 3.2) - aucun coût, aucune limite
-  **Recherche Sémantique** : Trouve les informations pertinentes dans vos documents
-  **Base Vectorielle** : Qdrant pour une recherche ultra-rapide
-  **Docker** : Déploiement en un clic
-  **Privé** : Vos données ne quittent jamais votre machine

##  Démarrage rapide

### 1. Prérequis
- Docker & Docker Compose
- 4GB de RAM minimum (pour les modèles Ollama)

### 2. Cloner le projet
```bash
git clone https://github.com/votre-username/poc-node-et-ia-rag.git
cd poc-node-et-ia-rag
```

### 3. Lancer l'application
```bash
docker compose up --build -d
```

**Première fois** : Ollama va télécharger les modèles (~2.3GB). Cela peut prendre 5-10 minutes.

### 4. Télécharger les modèles IA
```bash
docker compose exec ollama ollama pull nomic-embed-text
docker compose exec ollama ollama pull llama3.2
```

### 5. Indexer les documents
```bash
docker compose exec nodeapp npm run index
```

### 6. Utiliser l'application
- **Chat** : http://localhost:3000
- **Qdrant Dashboard** : http://localhost:6333/dashboard

##  Ajouter des documents au corpus

1. Ajoutez vos fichiers `.json` dans `backend/corpus/`
2. Format requis :
```json
{
  "title": "Titre du document",
  "author": "Auteur",
  "date": "2024-01-01",
  "category": "Catégorie",
  "tags": ["tag1", "tag2"],
  "text": "Contenu complet du document..."
}
```
3. Relancez l'indexer :
```bash
docker compose exec nodeapp npm run index
```

## 🛠️ Stack technique

- **Backend** : Node.js + Express
- **IA Embeddings** : Ollama (nomic-embed-text, 768 dimensions)
- **IA Chat** : Ollama (Llama 3.2)
- **Base Vectorielle** : Qdrant
- **Conteneurisation** : Docker

##  Architecture

```
Question utilisateur
    ↓
Génération d'embedding (Ollama)
    ↓
Recherche vectorielle (Qdrant)
    ↓
Récupération du contexte pertinent
    ↓
Génération de réponse (Llama 3.2)
    ↓
Affichage avec sources
```

##  Comparaison avec OpenAI

| Critère | OpenAI | Ollama (ce projet) |
|---------|--------|-------------------|
| Coût | ~0.002$/1K tokens | **Gratuit** |
| Vitesse | Rapide | Rapide (après téléchargement) |
| Privacité | Données envoyées | **100% local** |
| Limites | Rate limits | **Aucune** |
| Connexion | Internet requis | **Fonctionne hors ligne** |

##  Commandes utiles

```bash
# Voir les logs
docker compose logs -f nodeapp

# Redémarrer l'application
docker compose restart nodeapp

# Arrêter tout
docker compose down

# Supprimer les volumes (réinitialisation complète)
docker compose down -v

# Lister les modèles Ollama installés
docker compose exec ollama ollama list

# Télécharger un nouveau modèle
docker compose exec ollama ollama pull <model-name>
```

##  Dépannage

### L'application ne trouve pas de résultats
- Vérifiez que les documents sont bien indexés : `docker compose exec nodeapp npm run index`
- Assurez-vous que votre question est en rapport avec le contenu des documents

### Ollama est lent
- Première utilisation : les modèles se téléchargent (~2.3GB)
- Assurez-vous d'avoir au moins 4GB de RAM disponible

### Erreur "Cannot connect to Ollama"
- Vérifiez que le conteneur Ollama est démarré : `docker compose ps`
- Redémarrez : `docker compose restart ollama`

##  Licence

MIT - Voir [LICENSE](LICENSE)

##  Crédits

- [Ollama](https://ollama.ai/) - IA locale
- [Qdrant](https://qdrant.tech/) - Base vectorielle
- [Node.js](https://nodejs.org/) - Runtime JavaScript
