/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  interface Window {
    knowledgeBase: import('../shared/types').KnowledgeBaseApi;
  }
}

export {};
