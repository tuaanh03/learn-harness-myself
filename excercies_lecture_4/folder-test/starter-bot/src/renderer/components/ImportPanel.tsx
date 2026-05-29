interface Props {
  onImport: (file: File) => Promise<void>;
  error: string | null;
  isImporting: boolean;
}

export function ImportPanel({ onImport, error, isImporting }: Props) {
  return (
    <div style={{
      padding: '20px',
      background: '#16213e',
      borderRadius: '6px',
      border: '1px dashed #0f3460',
      textAlign: 'center',
      color: '#888',
    }}>
      <div style={{ fontSize: '14px', marginBottom: '8px' }}>Import Documents</div>
      <div style={{ fontSize: '12px' }}>
        Choose a file to add it to this session.
        <br />
        Supported: .txt, .md files (maximum 10 MB)
      </div>
      <input
        type="file"
        accept=".txt,.md"
        disabled={isImporting}
        onChange={async e => {
          const file = e.target.files?.[0];
          if (file) {
            await onImport(file);
            e.target.value = '';
          }
        }}
        style={{ marginTop: '10px' }}
      />
      {isImporting && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#a0a0c0' }}>
          Importing...
        </div>
      )}
      {error && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#e07a7a' }}>
          {error}
        </div>
      )}
    </div>
  );
}
