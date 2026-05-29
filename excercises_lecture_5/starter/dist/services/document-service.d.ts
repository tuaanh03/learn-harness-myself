import { Document } from '../shared/types';
import { PersistenceService } from './persistence-service';
export declare class DocumentService {
    private persistence;
    constructor(persistence: PersistenceService);
    /** List all imported documents. */
    listDocuments(): Document[];
    /** Import a file from the given path. */
    importDocument(filePath: string): Document;
    /** Get a single document by ID. */
    getDocument(id: string): Document | null;
    /** Get the text content of a document. */
    getDocumentContent(id: string): string | null;
    /** Update a document's metadata. */
    updateDocument(id: string, updates: Partial<Document>): Document | null;
    /** Delete a document by ID. Removes content and metadata. */
    deleteDocument(id: string): boolean;
    /** Check whether the persistence layer has stored data. */
    hasPersistedData(): boolean;
    private withMetadata;
    private extractMetadata;
    private getFileType;
    private deleteFileIfPresent;
    private removeFromIndexMeta;
}
//# sourceMappingURL=document-service.d.ts.map