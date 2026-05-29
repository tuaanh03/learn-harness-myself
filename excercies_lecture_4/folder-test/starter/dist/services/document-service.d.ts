import { Document } from '../shared/types';
export declare class DocumentService {
    private documents;
    /** List all imported documents. */
    listDocuments(): Document[];
    /** Import a file for the current application session. */
    importDocument(filePath: string): Document;
    /** Get a single document by ID. */
    getDocument(id: string): Document | null;
    /** Update a document's metadata. */
    updateDocument(id: string, updates: Partial<Document>): Document | null;
    /** Delete a document by ID. */
    deleteDocument(id: string): boolean;
}
//# sourceMappingURL=document-service.d.ts.map