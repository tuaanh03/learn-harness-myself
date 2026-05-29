import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '../shared/types';

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md']);

export class DocumentService {
  private documents: Document[] = [];

  /** List all imported documents. */
  listDocuments(): Document[] {
    return [...this.documents];
  }

  /** Import a file for the current application session. */
  importDocument(filePath: string): Document {
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

    const doc: Document = {
      id: uuidv4(),
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
  getDocument(id: string): Document | null {
    return this.documents.find(d => d.id === id) ?? null;
  }

  /** Update a document's metadata. */
  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return null;

    this.documents[index] = { ...this.documents[index], ...updates };
    return this.documents[index];
  }

  /** Delete a document by ID. */
  deleteDocument(id: string): boolean {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return false;

    this.documents.splice(index, 1);
    return true;
  }
}
