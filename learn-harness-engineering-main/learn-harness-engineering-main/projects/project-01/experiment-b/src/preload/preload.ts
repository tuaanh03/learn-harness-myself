import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, KnowledgeBaseApi } from '../shared/types';

const api: KnowledgeBaseApi = {
  documents: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.LIST_DOCUMENTS),
    import: (filePath: string) => ipcRenderer.invoke(IPC_CHANNELS.IMPORT_DOCUMENT, filePath),
    selectImport: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_IMPORT_DOCUMENTS),
    get: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_DOCUMENT, id),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_DOCUMENT, id),
  },
  indexing: {
    start: (documentId?: string) => ipcRenderer.invoke(IPC_CHANNELS.START_INDEXING, documentId),
    status: () => ipcRenderer.invoke(IPC_CHANNELS.GET_INDEXING_STATUS),
    chunks: (documentId: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_CHUNKS, documentId),
  },
  qa: {
    ask: (question: string) => ipcRenderer.invoke(IPC_CHANNELS.ASK_QUESTION, question),
    history: () => ipcRenderer.invoke(IPC_CHANNELS.GET_HISTORY),
  },
  app: {
    status: () => ipcRenderer.invoke(IPC_CHANNELS.GET_STATUS),
  },
};

contextBridge.exposeInMainWorld('knowledgeBase', api);
