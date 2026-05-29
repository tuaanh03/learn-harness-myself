"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexingService = void 0;
const uuid_1 = require("uuid");
const INDEX_META = 'index/index-meta.json';
const LEGACY_INDEX_META = 'index-meta.json';
const CHUNKS_DIR = 'chunks';
const TARGET_CHUNK_SIZE = 500;
class IndexingService {
    constructor(persistence) {
        this.persistence = persistence;
    }
    /** Start indexing documents. If documentId is provided, index only that document. */
    async startIndexing(documentId) {
        const docs = this.readDocuments();
        const chunksMeta = this.readIndexMeta();
        const targetDocs = documentId ? docs.filter(doc => doc.id === documentId) : docs;
        if (documentId && targetDocs.length === 0) {
            return { ...this.getStatus(), indexStatus: 'error' };
        }
        for (const doc of targetDocs) {
            if (!documentId && chunksMeta[doc.id])
                continue;
            doc.status = 'indexing';
            const content = this.persistence.readText(`content/${doc.id}.txt`);
            if (content === null) {
                doc.status = 'error';
                continue;
            }
            const chunks = this.chunkDocument(doc.id, content);
            this.persistence.writeJson(`${CHUNKS_DIR}/${doc.id}.json`, chunks);
            chunksMeta[doc.id] = chunks.map(chunk => chunk.id);
            doc.status = 'indexed';
            doc.chunks = chunks.length;
        }
        this.writeDocuments(docs);
        this.persistence.writeJson(INDEX_META, chunksMeta);
        return this.getStatus();
    }
    /** Get current indexing status. */
    getStatus() {
        const docs = this.readDocuments();
        const chunksMeta = this.readIndexMeta();
        const currentIndexed = docs.filter(doc => Object.prototype.hasOwnProperty.call(chunksMeta, doc.id)).length;
        const totalDocuments = docs.length;
        const erroredDocuments = docs.filter(doc => doc.status === 'error').length;
        const pendingDocuments = Math.max(totalDocuments - currentIndexed - erroredDocuments, 0);
        const indexedChunks = docs.reduce((sum, doc) => sum + (chunksMeta[doc.id]?.length ?? 0), 0);
        const indexStatus = erroredDocuments > 0
            ? 'error'
            : totalDocuments > 0 && currentIndexed === totalDocuments
                ? 'ready'
                : currentIndexed > 0
                    ? 'indexing'
                    : 'idle';
        return {
            documentsLoaded: totalDocuments,
            indexStatus,
            lastActivity: new Date().toISOString(),
            currentIndexed,
            totalDocuments,
            pendingDocuments,
            erroredDocuments,
            indexedChunks,
        };
    }
    /** Get all chunks for a document. */
    getChunksForDocument(documentId) {
        return this.persistence.readJson(`${CHUNKS_DIR}/${documentId}.json`) ?? [];
    }
    /** Get all chunks across all documents. */
    getAllChunks() {
        const chunksMeta = this.readIndexMeta();
        const docIds = new Set(this.readDocuments().map(doc => doc.id));
        const allChunks = [];
        for (const docId of Object.keys(chunksMeta)) {
            if (!docIds.has(docId))
                continue;
            const chunks = this.getChunksForDocument(docId);
            allChunks.push(...chunks);
        }
        return allChunks;
    }
    /** Split a document into chunks of ~500 characters at paragraph boundaries. */
    chunkDocument(documentId, content) {
        const chunks = [];
        const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
        if (!normalized)
            return chunks;
        const paragraphs = normalized
            .split(/\n\s*\n/)
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0);
        let buffer = [];
        let bufferLength = 0;
        let chunkIndex = 0;
        for (const paragraph of paragraphs) {
            for (const part of this.splitOversizedParagraph(paragraph)) {
                const separatorLength = buffer.length > 0 ? 2 : 0;
                if (bufferLength > 0 && bufferLength + separatorLength + part.length > TARGET_CHUNK_SIZE) {
                    chunks.push(this.createChunk(documentId, chunkIndex++, buffer.join('\n\n')));
                    buffer = [];
                    bufferLength = 0;
                }
                buffer.push(part);
                bufferLength += (buffer.length > 1 ? 2 : 0) + part.length;
            }
        }
        if (buffer.length > 0) {
            chunks.push(this.createChunk(documentId, chunkIndex, buffer.join('\n\n')));
        }
        return chunks;
    }
    splitOversizedParagraph(paragraph) {
        if (paragraph.length <= TARGET_CHUNK_SIZE) {
            return [paragraph];
        }
        const parts = [];
        const words = paragraph.split(/\s+/).filter(word => word.length > 0);
        let buffer = '';
        for (const word of words) {
            if (word.length > TARGET_CHUNK_SIZE) {
                if (buffer) {
                    parts.push(buffer);
                    buffer = '';
                }
                for (let start = 0; start < word.length; start += TARGET_CHUNK_SIZE) {
                    parts.push(word.slice(start, start + TARGET_CHUNK_SIZE));
                }
                continue;
            }
            const next = buffer ? `${buffer} ${word}` : word;
            if (next.length > TARGET_CHUNK_SIZE && buffer) {
                parts.push(buffer);
                buffer = word;
            }
            else {
                buffer = next;
            }
        }
        if (buffer) {
            parts.push(buffer);
        }
        return parts;
    }
    createChunk(documentId, index, content) {
        return {
            id: (0, uuid_1.v4)(),
            documentId,
            content,
            index,
            metadata: {
                charCount: String(content.length),
                wordCount: String(this.countWords(content)),
            },
        };
    }
    countWords(content) {
        const trimmed = content.trim();
        return trimmed ? trimmed.split(/\s+/).length : 0;
    }
    readDocuments() {
        return this.persistence.readJson('documents-meta.json') ?? [];
    }
    writeDocuments(docs) {
        this.persistence.writeJson('documents-meta.json', docs);
    }
    readIndexMeta() {
        return (this.persistence.readJson(INDEX_META) ??
            this.persistence.readJson(LEGACY_INDEX_META) ??
            {});
    }
}
exports.IndexingService = IndexingService;
//# sourceMappingURL=indexing-service.js.map