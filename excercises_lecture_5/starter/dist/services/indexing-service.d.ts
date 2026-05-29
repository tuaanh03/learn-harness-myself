import { AppStatus, Chunk } from '../shared/types';
import { PersistenceService } from './persistence-service';
export declare class IndexingService {
    private persistence;
    constructor(persistence: PersistenceService);
    /** Start indexing documents. If documentId is provided, index only that document. */
    startIndexing(documentId?: string): Promise<AppStatus>;
    /** Get current indexing status. */
    getStatus(): AppStatus;
    /** Get all chunks for a document. */
    getChunksForDocument(documentId: string): Chunk[];
    /** Get all chunks across all documents. */
    getAllChunks(): Chunk[];
    /** Split a document into chunks of ~500 characters at paragraph boundaries. */
    private chunkDocument;
    private splitOversizedParagraph;
    private createChunk;
    private countWords;
    private readDocuments;
    private writeDocuments;
    private readIndexMeta;
}
//# sourceMappingURL=indexing-service.d.ts.map