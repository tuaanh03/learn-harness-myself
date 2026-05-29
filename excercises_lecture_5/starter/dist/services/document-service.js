"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const DOCUMENTS_META = 'documents-meta.json';
const INDEX_META = 'index/index-meta.json';
const LEGACY_INDEX_META = 'index-meta.json';
class DocumentService {
    constructor(persistence) {
        this.persistence = persistence;
    }
    /** List all imported documents. */
    listDocuments() {
        const docs = this.persistence.readJson(DOCUMENTS_META);
        return docs?.map(doc => this.withMetadata(doc)) ?? [];
    }
    /** Import a file from the given path. */
    importDocument(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const filename = path.basename(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);
        const doc = {
            id: (0, uuid_1.v4)(),
            title: filename.replace(/\.[^.]+$/, ''),
            filename,
            importedAt: new Date().toISOString(),
            size: stats.size,
            metadata: this.extractMetadata(filename, content),
            status: 'imported',
        };
        // Copy file to data directory
        this.persistence.copyFileToDocuments(filePath, filename);
        // Store content for indexing and viewing
        this.persistence.writeText(`content/${doc.id}.txt`, content);
        // Update metadata
        const docs = this.listDocuments();
        docs.push(doc);
        this.persistence.writeJson(DOCUMENTS_META, docs);
        return doc;
    }
    /** Get a single document by ID. */
    getDocument(id) {
        const docs = this.listDocuments();
        return docs.find(d => d.id === id) ?? null;
    }
    /** Get the text content of a document. */
    getDocumentContent(id) {
        return this.persistence.readText(`content/${id}.txt`);
    }
    /** Update a document's metadata. */
    updateDocument(id, updates) {
        const docs = this.listDocuments();
        const index = docs.findIndex(d => d.id === id);
        if (index === -1)
            return null;
        docs[index] = { ...docs[index], ...updates };
        this.persistence.writeJson(DOCUMENTS_META, docs);
        return docs[index];
    }
    /** Delete a document by ID. Removes content and metadata. */
    deleteDocument(id) {
        const docs = this.listDocuments();
        const doc = docs.find(d => d.id === id);
        if (!doc)
            return false;
        // Remove file from documents directory
        this.persistence.deleteFromDocuments(doc.filename);
        // Remove stored content
        const contentPath = path.join(this.persistence.getDataDir(), 'content', `${id}.txt`);
        if (fs.existsSync(contentPath)) {
            fs.unlinkSync(contentPath);
        }
        this.deleteFileIfPresent(path.join(this.persistence.getDataDir(), 'chunks', `${id}.json`));
        this.removeFromIndexMeta(INDEX_META, id);
        this.removeFromIndexMeta(LEGACY_INDEX_META, id);
        // Update metadata
        const updated = docs.filter(d => d.id !== id);
        this.persistence.writeJson(DOCUMENTS_META, updated);
        return true;
    }
    /** Check whether the persistence layer has stored data. */
    hasPersistedData() {
        return this.persistence.exists(DOCUMENTS_META);
    }
    withMetadata(doc) {
        const metadata = doc.metadata;
        if (metadata) {
            return { ...doc, metadata };
        }
        const content = this.persistence.readText(`content/${doc.id}.txt`) ?? '';
        return {
            ...doc,
            metadata: this.extractMetadata(doc.filename, content),
        };
    }
    extractMetadata(filename, content) {
        const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const trimmed = normalized.trim();
        return {
            wordCount: trimmed ? trimmed.split(/\s+/).length : 0,
            lineCount: normalized.length > 0 ? normalized.split('\n').length : 0,
            fileType: this.getFileType(filename),
        };
    }
    getFileType(filename) {
        return path.extname(filename).toLowerCase() === '.md' ? 'markdown' : 'text';
    }
    deleteFileIfPresent(filePath) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    removeFromIndexMeta(relativePath, id) {
        const meta = this.persistence.readJson(relativePath);
        if (!meta || !Object.prototype.hasOwnProperty.call(meta, id))
            return;
        const updated = { ...meta };
        delete updated[id];
        this.persistence.writeJson(relativePath, updated);
    }
}
exports.DocumentService = DocumentService;
//# sourceMappingURL=document-service.js.map