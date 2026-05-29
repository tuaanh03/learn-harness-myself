import { type CSSProperties, useCallback, useEffect, useState } from 'react';
import { AppStatus, Document, QAResponse } from '../../shared/types';
import { DocumentDetail } from './components/DocumentDetail';
import { DocumentList } from './components/DocumentList';
import { QuestionPanel } from './components/QuestionPanel';
import { StatusBar } from './components/StatusBar';

const INITIAL_STATUS: AppStatus = {
  documentsLoaded: 0,
  indexedDocuments: 0,
  indexStatus: 'idle',
  lastActivity: '',
};

export function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [appStatus, setAppStatus] = useState<AppStatus>(INITIAL_STATUS);
  const [lastResponse, setLastResponse] = useState<QAResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refreshDocuments = useCallback(async (): Promise<Document[]> => {
    const [docs, status] = await Promise.all([
      window.knowledgeBase.documents.list(),
      window.knowledgeBase.indexing.status(),
    ]);
    setDocuments(docs);
    setAppStatus(status);
    setSelectedDoc(current => {
      if (!current) return docs[0] ?? null;
      return docs.find(doc => doc.id === current.id) ?? docs[0] ?? null;
    });
    return docs;
  }, []);

  useEffect(() => {
    refreshDocuments().catch(reason => setError(getMessage(reason)));
  }, [refreshDocuments]);

  const handleImport = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const imported = await window.knowledgeBase.documents.select();
      if (imported.length === 0) return;
      await window.knowledgeBase.indexing.start();
      const docs = await refreshDocuments();
      const newestId = imported[imported.length - 1].id;
      setSelectedDoc(docs.find(doc => doc.id === newestId) ?? null);
    } catch (reason) {
      setError(getMessage(reason));
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  const handleIndex = useCallback(async (documentId: string) => {
    setBusy(true);
    setError('');
    try {
      await window.knowledgeBase.indexing.start(documentId);
      await refreshDocuments();
    } catch (reason) {
      setError(getMessage(reason));
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  const handleDelete = useCallback(async (documentId: string) => {
    if (!window.confirm('Delete this document and its index?')) return;
    setBusy(true);
    setError('');
    try {
      await window.knowledgeBase.documents.delete(documentId);
      await refreshDocuments();
    } catch (reason) {
      setError(getMessage(reason));
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  const handleAskQuestion = useCallback(async (question: string) => {
    setBusy(true);
    setError('');
    try {
      setLastResponse(await window.knowledgeBase.qa.ask(question));
    } catch (reason) {
      setError(getMessage(reason));
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: '19px', fontWeight: 600 }}>Document Desk</h1>
          <div style={{ color: '#96a3bb', fontSize: '12px', marginTop: '3px' }}>
            Local document reading and grounded questions
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" disabled={busy} onClick={handleImport} style={styles.primaryButton}>
            Import documents
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void refreshDocuments().catch(reason => setError(getMessage(reason)))}
            style={styles.secondaryButton}
          >
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div role="alert" style={styles.error}>
          {error}
        </div>
      )}

      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>Documents ({documents.length})</div>
          <DocumentList
            documents={documents}
            onSelect={setSelectedDoc}
            selectedId={selectedDoc?.id ?? null}
          />
        </aside>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflow: 'auto', padding: '22px' }}>
              {selectedDoc ? (
                <DocumentDetail
                  document={selectedDoc}
                  busy={busy}
                  onIndex={handleIndex}
                  onDelete={handleDelete}
                />
              ) : (
                <div style={styles.empty}>
                  Import a Markdown or text file to read it and ask questions.
                </div>
              )}
            </div>

            <aside style={styles.answerColumn}>
              <h2 style={styles.panelTitle}>Answer</h2>
              {lastResponse ? (
                <Answer response={lastResponse} />
              ) : (
                <div style={styles.subtle}>Answers will cite matching indexed passages.</div>
              )}
            </aside>
          </div>
          <QuestionPanel onAsk={handleAskQuestion} disabled={busy} />
        </section>
      </main>

      <StatusBar status={appStatus} busy={busy} />
    </div>
  );
}

function Answer({ response }: { response: QAResponse }) {
  return (
    <div>
      <p style={{ fontSize: '14px', lineHeight: 1.65, marginBottom: '14px' }}>{response.answer}</p>
      <div style={{ color: '#96a3bb', fontSize: '12px', marginBottom: '14px' }}>
        Confidence: {Math.round(response.confidence * 100)}%
      </div>
      {response.citations.length > 0 && (
        <>
          <h3 style={{ ...styles.panelTitle, fontSize: '12px' }}>Sources</h3>
          {response.citations.map(citation => (
            <div key={`${citation.documentId}-${citation.chunkIndex}`} style={styles.citation}>
              <strong>{citation.documentTitle}</strong> / chunk {citation.chunkIndex + 1}
              <p style={{ marginTop: '5px', lineHeight: 1.45 }}>{citation.excerpt}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function getMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'An operation failed. Please try again.';
}

const styles: Record<string, CSSProperties> = {
  header: {
    padding: '15px 20px',
    background: '#111b31',
    borderBottom: '1px solid #263858',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryButton: {
    padding: '9px 14px',
    background: '#5074de',
    color: '#fff',
    border: 0,
    borderRadius: '5px',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '9px 14px',
    background: '#172642',
    color: '#dde5f4',
    border: '1px solid #33486c',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    background: '#4c2130',
    borderBottom: '1px solid #814156',
    color: '#ffdfe7',
    padding: '9px 20px',
    fontSize: '13px',
  },
  sidebar: {
    width: '270px',
    borderRight: '1px solid #263858',
    display: 'flex',
    flexDirection: 'column',
    background: '#111b31',
  },
  sidebarHeader: {
    padding: '13px 16px',
    color: '#96a3bb',
    borderBottom: '1px solid #263858',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  answerColumn: {
    width: '350px',
    flexShrink: 0,
    overflow: 'auto',
    padding: '22px',
    background: '#111b31',
    borderLeft: '1px solid #263858',
  },
  panelTitle: {
    color: '#96a3bb',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '14px',
  },
  citation: {
    borderLeft: '2px solid #5074de',
    padding: '8px 10px',
    marginBottom: '10px',
    background: '#172642',
    color: '#afbad0',
    fontSize: '12px',
  },
  subtle: {
    color: '#77839b',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  empty: {
    color: '#77839b',
    textAlign: 'center',
    paddingTop: '80px',
    fontSize: '14px',
  },
};
