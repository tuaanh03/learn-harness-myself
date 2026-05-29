import { useCallback, useEffect, useState } from 'react';
import { AppStatus, Document, QAHistory } from '../shared/types';
import { DocumentDetail } from './components/DocumentDetail';
import { DocumentList } from './components/DocumentList';
import { ImportPanel } from './components/ImportPanel';
import { LatestAnswerConfidence } from './components/LatestAnswerConfidence';
import { LatestCitationCount } from './components/LatestCitationCount';
import { QuestionPanel } from './components/QuestionPanel';
import { StatusBar } from './components/StatusBar';

const initialStatus: AppStatus = {
  documentsLoaded: 0,
  indexStatus: 'idle',
  lastActivity: '',
};

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : 'The operation failed.';
}

export function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [appStatus, setAppStatus] = useState<AppStatus>(initialStatus);
  const [history, setHistory] = useState<QAHistory[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refreshDocuments = useCallback(async (preferredId?: string) => {
    const [docs, status] = await Promise.all([
      window.knowledgeBase.documents.list(),
      window.knowledgeBase.app.status(),
    ]);
    setDocuments(docs);
    setAppStatus(status);
    setSelectedDoc(current => {
      const selectedId = preferredId ?? current?.id;
      return docs.find(document => document.id === selectedId) ?? null;
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const existingHistory = await window.knowledgeBase.qa.history();
        setHistory(existingHistory);
        await refreshDocuments();
      } catch (loadError) {
        setError(messageFromError(loadError));
      }
    };
    void load();
  }, [refreshDocuments]);

  const handleImport = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const imported = await window.knowledgeBase.documents.selectImport();
      const lastImported = imported[imported.length - 1];
      await refreshDocuments(lastImported?.id);
    } catch (importError) {
      setError(messageFromError(importError));
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  const handleIndex = useCallback(async (documentId?: string) => {
    setBusy(true);
    setError('');
    setAppStatus(current => ({ ...current, indexStatus: 'indexing' }));
    try {
      await window.knowledgeBase.indexing.start(documentId);
      await refreshDocuments(documentId);
    } catch (indexError) {
      setError(messageFromError(indexError));
      await refreshDocuments(documentId);
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  const handleDelete = useCallback(async (document: Document) => {
    if (!window.confirm(`Delete "${document.title}" and its index data?`)) return;
    setBusy(true);
    setError('');
    try {
      await window.knowledgeBase.documents.delete(document.id);
      await refreshDocuments();
    } catch (deleteError) {
      setError(messageFromError(deleteError));
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  const handleAskQuestion = useCallback(async (question: string) => {
    setBusy(true);
    setError('');
    try {
      const response = await window.knowledgeBase.qa.ask(question);
      setHistory(previous => [...previous, { question, response }]);
      await refreshDocuments();
    } catch (questionError) {
      setError(messageFromError(questionError));
    } finally {
      setBusy(false);
    }
  }, [refreshDocuments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{
        padding: '12px 20px',
        background: '#16213e',
        borderBottom: '1px solid #0f3460',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Knowledge Base</h1>
        <button onClick={() => void refreshDocuments()} style={secondaryButtonStyle}>
          Refresh
        </button>
      </header>

      {error && (
        <div style={{ padding: '8px 20px', background: '#481f31', color: '#ffd0d8', fontSize: '13px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{
          width: '280px',
          borderRight: '1px solid #0f3460',
          display: 'flex',
          flexDirection: 'column',
          background: '#16213e',
        }}>
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid #0f3460',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#a0a0c0' }}>
              Documents ({documents.length})
            </span>
            <button onClick={() => void handleImport()} disabled={busy} style={primaryButtonStyle}>
              + Import
            </button>
          </div>
          <DocumentList
            documents={documents}
            onSelect={setSelectedDoc}
            selectedId={selectedDoc?.id ?? null}
          />
          {documents.length > 0 && (
            <button
              onClick={() => void handleIndex()}
              disabled={busy}
              style={{ ...primaryButtonStyle, margin: '12px 16px', padding: '8px' }}
            >
              Index All Documents
            </button>
          )}
        </aside>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
            {selectedDoc ? (
              <DocumentDetail
                document={selectedDoc}
                busy={busy}
                onIndex={handleIndex}
                onDelete={handleDelete}
              />
            ) : (
              <ImportPanel onImport={handleImport} disabled={busy} />
            )}

            {history.slice().reverse().map(({ question, response }, index) => (
              <section key={response.timestamp} style={{
                marginTop: '16px',
                padding: '16px',
                background: '#1a1a3e',
                borderRadius: '6px',
                border: '1px solid #0f3460',
              }}>
                <div style={{ fontSize: '12px', color: '#8888bb', marginBottom: '8px' }}>
                  Q: {question}
                </div>
                <div style={{ fontSize: '14px', lineHeight: 1.6 }}>{response.answer}</div>
                {index === 0 && <LatestAnswerConfidence confidence={response.confidence} />}
                {response.citations.map(citation => (
                  <div key={`${citation.documentId}-${citation.chunkIndex}`} style={{
                    marginTop: '8px',
                    paddingLeft: '8px',
                    borderLeft: '2px solid #533483',
                    fontSize: '12px',
                    color: '#aaaacd',
                  }}>
                    {citation.documentTitle} (chunk {citation.chunkIndex}): {citation.excerpt}
                  </div>
                ))}
              </section>
            ))}
          </div>
          <LatestCitationCount history={history} />
          <QuestionPanel onAsk={handleAskQuestion} disabled={busy} />
        </main>
      </div>

      <StatusBar status={appStatus} busy={busy} />
    </div>
  );
}

const primaryButtonStyle = {
  padding: '4px 10px',
  background: '#533483',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
};

const secondaryButtonStyle = {
  padding: '6px 14px',
  background: '#0f3460',
  color: '#e0e0e0',
  border: '1px solid #1a1a4e',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
};
