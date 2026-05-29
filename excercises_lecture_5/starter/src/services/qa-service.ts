import { QAResponse, QAHistory, Citation, Chunk, Document } from '../shared/types';
import { PersistenceService } from './persistence-service';
import { IndexingService } from './indexing-service';

const QA_HISTORY_FILE = 'qa-history.json';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'how',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'the',
  'to',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'with',
]);

interface ScoredChunk {
  chunk: Chunk;
  documentTitle: string;
  score: number;
  matchedTerms: string[];
}

export class QaService {
  private persistence: PersistenceService;
  private indexingService: IndexingService;

  constructor(persistence: PersistenceService, indexingService?: IndexingService) {
    this.persistence = persistence;
    this.indexingService = indexingService ?? new IndexingService(persistence);
  }

  /** Ask a question and get a grounded answer with citations. */
  async ask(question: string): Promise<QAResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));

    const chunks = this.indexingService.getAllChunks();
    const terms = this.tokenize(question);
    const rankedChunks = this.rankChunks(chunks, terms).slice(0, 3);
    const citations = rankedChunks.map(result => this.toCitation(result, terms));
    const answer = this.generateAnswer(citations);

    const response: QAResponse = {
      answer,
      citations,
      confidence: citations.length > 0 ? 0.85 : 0.3,
      timestamp: new Date().toISOString(),
    };

    // Save to history
    this.saveToHistory(question, response);

    return response;
  }

  /** Get the Q&A history. */
  getHistory(): QAHistory[] {
    return this.persistence.readJson<QAHistory[]>(QA_HISTORY_FILE) ?? [];
  }

  private rankChunks(chunks: Chunk[], terms: string[]): ScoredChunk[] {
    if (terms.length === 0) return [];

    const docs = this.persistence.readJson<Document[]>('documents-meta.json') ?? [];
    const titleById = new Map(docs.map(doc => [doc.id, doc.title]));

    return chunks
      .map(chunk => {
        const documentTitle = titleById.get(chunk.documentId) ?? 'Unknown Document';
        const searchable = `${documentTitle}\n${chunk.content}`.toLowerCase();
        const chunkTerms = new Set(this.tokenize(searchable));
        const matchedTerms = terms.filter(term => chunkTerms.has(term) || searchable.includes(term));
        const titleBoost = terms.filter(term => documentTitle.toLowerCase().includes(term)).length;
        const score = matchedTerms.reduce((sum, term) => {
          return sum + (chunkTerms.has(term) ? 2 : 1);
        }, titleBoost);
        return { chunk, documentTitle, score, matchedTerms };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score || a.chunk.index - b.chunk.index);
  }

  private toCitation(result: ScoredChunk, terms: string[]): Citation {
    return {
      documentId: result.chunk.documentId,
      documentTitle: result.documentTitle,
      chunkIndex: result.chunk.index,
      excerpt: this.createExcerpt(result.chunk.content, terms),
    };
  }

  private createExcerpt(content: string, terms: string[]): string {
    const normalized = content.replace(/\s+/g, ' ').trim();
    const sentences = normalized
      .split(/(?<=[.!?])\s+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
    const matchingSentence = sentences.find(sentence => {
      const lower = sentence.toLowerCase();
      return terms.some(term => lower.includes(term));
    });
    const excerpt = matchingSentence ?? normalized;

    if (excerpt.length <= 220) {
      return excerpt;
    }

    return `${excerpt.slice(0, 217).trimEnd()}...`;
  }

  private generateAnswer(citations: Citation[]): string {
    if (citations.length === 0) {
      return 'No relevant indexed content was found. Import and index documents before asking, or try a question with terms that appear in the indexed library.';
    }

    const primary = citations[0];
    if (citations.length === 1) {
      return `Based on "${primary.documentTitle}" chunk ${primary.chunkIndex}, ${primary.excerpt}`;
    }

    const otherSources = citations
      .slice(1)
      .map(citation => `"${citation.documentTitle}" chunk ${citation.chunkIndex}`)
      .join(', ');
    return `Based on "${primary.documentTitle}" chunk ${primary.chunkIndex}, ${primary.excerpt} Related supporting citations were found in ${otherSources}.`;
  }

  private tokenize(input: string): string[] {
    const tokens = input.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
    return Array.from(
      new Set(tokens.filter(token => token.length > 2 && !STOP_WORDS.has(token)))
    );
  }

  private saveToHistory(question: string, response: QAResponse): void {
    const history = this.getHistory();
    history.push({ question, response });
    this.persistence.writeJson(QA_HISTORY_FILE, history);
  }
}
