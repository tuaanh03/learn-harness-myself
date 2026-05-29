import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Document, IndexManifest } from '../shared/types';
import { PersistenceService } from './persistence-service';

const DOCUMENTS_META = 'documents-meta.json';
const INDEX_META = 'index/index-meta.json';
const LEGACY_INDEX_META = 'index-meta.json';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md']);

function isIndexManifest(value: IndexManifest | Record<string, string[]>): value is IndexManifest {
  return 'documents' in value && 'lastIndexed' in value && !Array.isArray(value.documents);
}

export class DocumentService {
  private persistence: PersistenceService;

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
  }

  /** List all imported documents. */
  listDocuments(): Document[] {
    const docs = this.persistence.readJson<Document[]>(DOCUMENTS_META);
    return docs ?? [];
  }

  /** Import a file from the given path. */
  importDocument(filePath: string): Document {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const filename = path.basename(filePath);
    const extension = path.extname(filename).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      throw new Error('Only .txt and .md documents can be imported.');
    }

    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      throw new Error('Only files can be imported.');
    }
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('Documents must be 10 MB or smaller.');
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const id = uuidv4();
    const storedFilename = `${id}${extension}`;

    const doc: Document = {
      id,
      title: filename.replace(/\.[^.]+$/, ''),
      filename,
      storedFilename,
      importedAt: new Date().toISOString(),
      size: stats.size,
      status: 'imported',
    };

    this.persistence.copyFileToDocuments(filePath, storedFilename);

    // Store content for indexing
    this.persistence.writeText(`content/${doc.id}.txt`, content);

    // Update metadata
    const docs = this.listDocuments();
    docs.push(doc);
    this.persistence.writeJson(DOCUMENTS_META, docs);

    return doc;
  }

  /** Get a single document by ID. */
  getDocument(id: string): Document | null {
    const docs = this.listDocuments();
    return docs.find(d => d.id === id) ?? null;
  }

  /** Get the text content of a document. */
  getDocumentContent(id: string): string | null {
    return this.persistence.readText(`content/${id}.txt`);
  }

  /** Update a document's metadata. */
  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const docs = this.listDocuments();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return null;

    docs[index] = { ...docs[index], ...updates };
    this.persistence.writeJson(DOCUMENTS_META, docs);
    return docs[index];
  }

  /** Delete a document by ID. */
  deleteDocument(id: string): boolean {
    const docs = this.listDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) return false;

    this.persistence.deleteFromDocuments(doc.storedFilename ?? doc.filename);
    this.persistence.delete(`content/${id}.txt`);
    this.persistence.delete(`chunks/${id}.json`);

    const updated = docs.filter(d => d.id !== id);
    this.persistence.writeJson(DOCUMENTS_META, updated);

    const index = this.readIndexManifest();
    delete index.documents[id];
    this.persistence.writeJson(INDEX_META, index);
    return true;
  }

  private readIndexManifest(): IndexManifest {
    const stored = this.persistence.readJson<IndexManifest | Record<string, string[]>>(INDEX_META)
      ?? this.persistence.readJson<IndexManifest | Record<string, string[]>>(LEGACY_INDEX_META);
    if (stored && isIndexManifest(stored)) {
      return stored;
    }
    return { documents: stored ?? {}, lastIndexed: null };
  }
}
