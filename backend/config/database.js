import dotenv from 'dotenv';
import { QdrantClient } from '@qdrant/js-client-rest';

dotenv.config();

// Configuration Qdrant
export const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://vectordb:6333'
});

// Configuration Ollama
export const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama:11434';

// Constants
export const COLLECTION_NAME = 'corpus';
export const VECTOR_SIZE = 768; // nomic-embed-text dimensions
