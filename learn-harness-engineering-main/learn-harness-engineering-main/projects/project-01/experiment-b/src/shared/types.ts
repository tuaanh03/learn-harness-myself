/** Cross-boundary type definitions shared between main, preload, and renderer. */

export interface Document {
  id: string;
  title: string;
  filename: string;
  storedFilename?: string;
  importedAt: string;
  size: number;
  status: 'imported' | 'indexing' | 'indexed' | 'error';
  chunks?: number;
}

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
  metadata: Record<string, string>;
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  excerpt: string;
}

export interface QAResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
  timestamp: string;
}

export interface QAHistory {
  question: string;
  response: QAResponse;
}

export interface AppStatus {
  documentsLoaded: number;
  indexStatus: 'idle' | 'indexing' | 'ready' | 'error';
  lastActivity: string;
}

export interface IndexStatus {
  status: AppStatus['indexStatus'];
  currentIndexed: number;
  totalDocuments: number;
  lastIndexed: string | null;
}

export interface IndexManifest {
  documents: Record<string, string[]>;
  lastIndexed: string | null;
}

export interface KnowledgeBaseApi {
  documents: {
    list: () => Promise<Document[]>;
    import: (filePath: string) => Promise<Document>;
    selectImport: () => Promise<Document[]>;
    get: (id: string) => Promise<Document | null>;
    delete: (id: string) => Promise<boolean>;
  };
  indexing: {
    start: (documentId?: string) => Promise<IndexStatus>;
    status: () => Promise<IndexStatus>;
    chunks: (documentId: string) => Promise<Chunk[]>;
  };
  qa: {
    ask: (question: string) => Promise<QAResponse>;
    history: () => Promise<QAHistory[]>;
  };
  app: {
    status: () => Promise<AppStatus>;
  };
}

/** IPC channel names -- single source of truth. */
export const IPC_CHANNELS = {
  // Document operations
  LIST_DOCUMENTS: 'documents:list',
  IMPORT_DOCUMENT: 'documents:import',
  SELECT_IMPORT_DOCUMENTS: 'documents:select-import',
  GET_DOCUMENT: 'documents:get',
  DELETE_DOCUMENT: 'documents:delete',

  // Indexing
  START_INDEXING: 'indexing:start',
  GET_INDEXING_STATUS: 'indexing:status',
  GET_CHUNKS: 'indexing:chunks',

  // Q&A
  ASK_QUESTION: 'qa:ask',
  GET_HISTORY: 'qa:history',

  // App status
  GET_STATUS: 'app:status',
} as const;
