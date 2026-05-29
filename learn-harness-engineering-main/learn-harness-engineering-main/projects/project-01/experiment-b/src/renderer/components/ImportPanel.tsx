interface Props {
  onImport: () => Promise<void>;
  disabled: boolean;
}

export function ImportPanel({ onImport, disabled }: Props) {
  return (
    <div style={{
      padding: '36px 20px',
      background: '#16213e',
      borderRadius: '6px',
      border: '1px dashed #0f3460',
      textAlign: 'center',
      color: '#888',
    }}>
      <div style={{ fontSize: '17px', color: '#e0e0e0', marginBottom: '8px' }}>Import Documents</div>
      <div style={{ fontSize: '12px' }}>
        Add text or Markdown files to your local library.
        <br />
        Supported: .txt, .md files, up to 10 MB
      </div>
      <button
        onClick={() => void onImport()}
        disabled={disabled}
        style={{
          marginTop: '14px',
          padding: '8px 16px',
          background: '#533483',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Select Documents
      </button>
    </div>
  );
}
