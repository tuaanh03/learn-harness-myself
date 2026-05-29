import { Citation, Chunk, Document, QAHistory, QAResponse } from '../shared/types';
import { IndexingService } from './indexing-service';
import { PersistenceService } from './persistence-service';

const QA_HISTORY_FILE = 'qa-history.json';
const STOP_WORDS = new Set([
  'about', 'and', 'are', 'can', 'does', 'for', 'from', 'how', 'the', 'this',
  'was', 'what', 'when', 'where', 'which', 'with', 'would',
]);

interface RankedChunk {
  chunk: Chunk;
  score: number;
}

export class QaService {
  private persistence: PersistenceService;
  private indexingService: IndexingService;

  constructor(persistence: PersistenceService, indexingService?: IndexingService) {
    this.persistence = persistence;
    this.indexingService = indexingService ?? new IndexingService(persistence);
  }

  /** Retrieve relevant indexed passages and produce an extractive answer. */
  async ask(question: string): Promise<QAResponse> {
    const terms = this.tokenize(question);
    const ranked = this.rankChunks(this.indexingService.getAllChunks(), terms).slice(0, 3);
    const documents = this.persistence.readJson<Document[]>('documents-meta.json') ?? [];
    const citations = ranked.map(({ chunk }) => this.createCitation(chunk, documents));
    const answer = this.generateAnswer(ranked, citations, terms);

    const response: QAResponse = {
      answer,
      citations,
      confidence: citations.length === 0 ? 0 : Math.min(0.95, 0.55 + ranked[0].score * 0.1),
      timestamp: new Date().toISOString(),
    };

    this.saveToHistory(question, response);
    return response;
  }

  getHistory(): QAHistory[] {
    return this.persistence.readJson<QAHistory[]>(QA_HISTORY_FILE) ?? [];
  }

  private rankChunks(chunks: Chunk[], terms: string[]): RankedChunk[] {
    if (terms.length === 0) return [];

    return chunks
      .map(chunk => {
        const words = new Set(this.tokenize(chunk.content));
        const score = terms.reduce((total, term) => total + (words.has(term) ? 1 : 0), 0);
        return { chunk, score };
      })
      .filter(result => result.score > 0)
      .sort((left, right) => right.score - left.score || left.chunk.index - right.chunk.index);
  }

  private createCitation(chunk: Chunk, documents: Document[]): Citation {
    const document = documents.find(candidate => candidate.id === chunk.documentId);
    return {
      documentId: chunk.documentId,
      documentTitle: document?.title ?? 'Unknown document',
      chunkIndex: chunk.index,
      excerpt: chunk.content.slice(0, 240),
    };
  }

  private generateAnswer(ranked: RankedChunk[], citations: Citation[], terms: string[]): string {
    if (citations.length === 0) {
      return 'I could not find a relevant passage in the indexed documents. Import and index a document, or use more specific terms.';
    }

    const sentences = ranked
      .flatMap(({ chunk }) => chunk.content.split(/(?<=[.!?])\s+|\n+/))
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => ({
        sentence,
        score: terms.reduce((total, term) =>
          total + (this.tokenize(sentence).includes(term) ? 1 : 0), 0),
      }))
      .filter(candidate => candidate.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
      .map(candidate => candidate.sentence);

    const uniqueSentences = [...new Set(sentences)];
    const supportingText = uniqueSentences.join(' ');
    if (!supportingText) {
      return `The most relevant passage is in "${citations[0].documentTitle}": ${citations[0].excerpt}`;
    }

    return supportingText;
  }

  private tokenize(text: string): string[] {
    return [...new Set(
      (text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
        .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    )];
  }

  private saveToHistory(question: string, response: QAResponse): void {
    const history = this.getHistory();
    history.unshift({ question, response });
    this.persistence.writeJson(QA_HISTORY_FILE, history.slice(0, 50));
  }
}
