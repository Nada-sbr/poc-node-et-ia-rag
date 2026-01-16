import { OLLAMA_URL } from './config/database.js';

console.log('OLLAMA_URL:', OLLAMA_URL);
console.log('fetch type:', typeof fetch);

async function test() {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: 'test'
            })
        });

        const data = await response.json();
        console.log('Success!', data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
