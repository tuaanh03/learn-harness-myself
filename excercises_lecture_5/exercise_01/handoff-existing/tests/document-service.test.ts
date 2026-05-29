import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { DocumentService, extractDocumentMetadata } from '../src/services/document-service';
import { PersistenceService } from '../src/services/persistence-service';

describe('extractDocumentMetadata', () => {
  it('extracts word count, line count, and markdown file type', () => {
    const metadata = extractDocumentMetadata(
      'notes.md',
      '# Heading\r\nFirst paragraph has words.\r\n\r\nSecond paragraph.'
    );

    expect(metadata).toEqual({
      wordCount: 8,
      lineCount: 4,
      fileType: 'markdown',
    });
  });

  it('handles empty text files', () => {
    expect(extractDocumentMetadata('empty.txt', '')).toEqual({
      wordCount: 0,
      lineCount: 0,
      fileType: 'text',
    });
  });

  it('stores extracted metadata when importing a document', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-metadata-'));

    try {
      const sourcePath = path.join(tempDir, 'sample.txt');
      fs.writeFileSync(sourcePath, 'One two\nthree', 'utf-8');

      const persistence = new PersistenceService(path.join(tempDir, 'data'));
      const service = new DocumentService(persistence);
      const imported = service.importDocument(sourcePath);

      expect(imported.metadata).toEqual({
        wordCount: 3,
        lineCount: 2,
        fileType: 'text',
      });
      expect(service.listDocuments()[0]?.metadata).toEqual(imported.metadata);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
