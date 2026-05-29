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
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md']);
class DocumentService {
    constructor() {
        this.documents = [];
    }
    /** List all imported documents. */
    listDocuments() {
        return [...this.documents];
    }
    /** Import a file for the current application session. */
    importDocument(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const filename = path.basename(filePath);
        const extension = path.extname(filename).toLowerCase();
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            throw new Error('Only files can be imported.');
        }
        if (!SUPPORTED_EXTENSIONS.has(extension)) {
            throw new Error('Only .txt and .md files are supported.');
        }
        if (stats.size > MAX_DOCUMENT_SIZE) {
            throw new Error('Files must be 10 MB or smaller.');
        }
        const doc = {
            id: (0, uuid_1.v4)(),
            title: filename.replace(/\.[^.]+$/, ''),
            filename,
            importedAt: new Date().toISOString(),
            size: stats.size,
            status: 'imported',
        };
        this.documents.push(doc);
        return doc;
    }
    /** Get a single document by ID. */
    getDocument(id) {
        return this.documents.find(d => d.id === id) ?? null;
    }
    /** Update a document's metadata. */
    updateDocument(id, updates) {
        const index = this.documents.findIndex(d => d.id === id);
        if (index === -1)
            return null;
        this.documents[index] = { ...this.documents[index], ...updates };
        return this.documents[index];
    }
    /** Delete a document by ID. */
    deleteDocument(id) {
        const index = this.documents.findIndex(d => d.id === id);
        if (index === -1)
            return false;
        this.documents.splice(index, 1);
        return true;
    }
}
exports.DocumentService = DocumentService;
//# sourceMappingURL=document-service.js.map