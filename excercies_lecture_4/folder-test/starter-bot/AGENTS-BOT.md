# AGENTS.md -- Project 02: Agent-Readable Workspace

# Architecture -- Knowledge Base Electron App

## System Overview

The Knowledge Base is an Electron desktop application built with TypeScript and React. It provides document import, text indexing with chunking, and grounded question answering with citations.

## Layer Diagram

```
+-----------------------------------------------------------+
|                     Renderer (React)                       |
|  App.tsx -> DocumentList, DocumentDetail, QuestionPanel,  |
|             StatusBar, ImportPanel                         |
+-----------------------------------------------------------+
         |  window.knowledgeBase.* (typed IPC bridge)
+-----------------------------------------------------------+
|                     Preload Script                         |
|  contextBridge.exposeInMainWorld -> documents, indexing, qa|
+-----------------------------------------------------------+
         |  ipcRenderer.invoke(IPC_CHANNELS.*)
+-----------------------------------------------------------+
|                     Main Process                           |
|  main.ts -> createWindow(), initializeServices()          |
|  ipc-handlers.ts -> registerIpcHandlers()                  |
+-----------------------------------------------------------+
         |  Service method calls
+-----------------------------------------------------------+
|                     Services Layer                         |
|  DocumentService | IndexingService | QaService             |
|  PersistenceService (filesystem I/O)                       |
+-----------------------------------------------------------+
```

## Electron Layers

### Main Process (`src/main/`)

The main process is the Node.js process that manages the application lifecycle. Responsibilities:

- **Window management**: Creates `BrowserWindow` instances with secure web preferences (`contextIsolation: true`, `nodeIntegration: false`).
- **IPC registration**: Maps IPC channel names to service methods via `registerIpcHandlers()`.
- **Service initialization**: Constructs `PersistenceService`, `DocumentService`, `IndexingService`, and `QaService` with dependency injection.

**Key invariant**: The main process never imports React or renderer code.

### Preload (`src/preload/`)

The preload script runs in the renderer context before any page scripts load. It uses Electron's `contextBridge` to expose a limited, typed API:

```typescript
window.knowledgeBase = {
  documents: { list, import, get, delete },
  indexing:   { start, status, chunks },
  qa:         { ask, history },
}
```

**Key invariant**: The preload bridge is the only communication channel between renderer and main. No Node.js modules are accessible from the renderer.

### Renderer (`src/renderer/`)

The renderer is a React 18 application bundled by Vite. Components:

- `App.tsx` -- Root layout with header, sidebar, main panel, and status bar.
- `DocumentList` -- Sidebar listing of imported documents.
- `DocumentDetail` -- Shows document metadata, chunks, and indexing controls.
- `ImportPanel` -- File input for importing .txt and .md documents.
- `QuestionPanel` -- Text input for asking questions.
- `StatusBar` -- Shows index status and document count.

**Key invariant**: Renderer code never imports `fs`, `path`, `electron`, or any Node.js module.

### Services (`src/services/`)

Business logic classes running in the main process:

- `PersistenceService` -- Low-level JSON/text file I/O with atomic writes.
- `DocumentService` -- Document CRUD operations (import, list, get, update, delete).
- `IndexingService` -- Paragraph-aware chunking (~500 chars per chunk) and index management.
- `QaService` -- Mock question answering with keyword-based retrieval and citation generation.

**Key invariant**: Services may import shared types but never renderer code.

## Data Flow

1. User interacts with a React component (e.g., clicks "Ask").
2. Component calls `window.knowledgeBase.qa.ask(question)`.
3. Preload bridge invokes `ipcRenderer.invoke('qa:ask', question)`.
4. Main process IPC handler delegates to `QaService.ask()`.
5. QaService retrieves chunks, scores by keyword overlap, generates answer.
6. Response flows back through IPC to the renderer.
7. React component updates state and re-renders.

## Build Pipeline

1. `tsc -p tsconfig.node.json` compiles main, preload, shared, and services to `dist/`.
2. `vite build` bundles the renderer React app to `dist/renderer/`.
3. Electron loads `dist/main/main.js` as the entry point.

## Data Storage

All user data is stored under `app.getPath('userData')/knowledge-base-data/`:

```
knowledge-base-data/
  documents-meta.json     # Document metadata array
  content/
    <doc-id>.txt          # Extracted text content per document
  chunks/
    <doc-id>.json         # Chunk array per document
  index/
    index-meta.json       # Mapping of document IDs to chunk IDs
  qa-history.json         # Q&A interaction log
```


## Quick Start
1. Run `npm install && npm run check` to verify the build.
2. Read `docs/ARCHITECTURE.md` for layer structure.
3. Check `feature_list.json` for what needs to be done.

## Layers

- Main process: `src/main/` -- window, IPC, services
- Preload: `src/preload/` -- bridge API
- Renderer: `src/renderer/` -- React UI
- Services: `src/services/` -- business logic

## Conventions

- TypeScript strict mode. No `any` without comment.
- Named exports only.
- IPC channels in `src/shared/types.ts`.

{
  "project": "project-02",
  "description": "Agent-readable workspace with import, detail view, and persistence",
  "features": [
    {
      "id": "window-launch",
      "name": "Window Launch",
      "description": "Electron app opens a BrowserWindow with correct dimensions and preload script",
      "status": "pass",
      "evidence": "Carried over from P1 -- verified working",
      "testedAt": "2026-03-30T10:00:00Z"
    },
    {
      "id": "document-list",
      "name": "Document List Panel",
      "description": "Left sidebar shows imported documents with empty state message",
      "status": "pass",
      "evidence": "Carried over from P1 -- verified working",
      "testedAt": "2026-03-30T10:05:00Z"
    },
    {
      "id": "question-panel",
      "name": "Question Panel",
      "description": "Bottom input bar accepts questions and submits via IPC",
      "status": "pass",
      "evidence": "Carried over from P1 -- verified working",
      "testedAt": "2026-03-30T10:08:00Z"
    },
    {
      "id": "data-directory",
      "name": "Data Directory",
      "description": "PersistenceService creates and manages userData/knowledge-base-data directory",
      "status": "pass",
      "evidence": "Carried over from P1 -- verified working",
      "testedAt": "2026-03-30T10:10:00Z"
    },
    {
      "id": "document-import",
      "name": "Document Import",
      "description": "Users can import .txt and .md files via ImportPanel with file picker",
      "status": "pass",
      "evidence": "Runtime verified in one Electron session: document list advanced from 0 to 1 after importing meeting-summary.txt and to 2 after importing design-notes.md; package.json was rejected with 'Only .txt and .md files are supported.'; a temporary 10,485,761-byte .txt file was rejected with 'Files must be 10 MB or smaller.'",
      "testedAt": "2026-05-27T09:28:22Z"
    },
    {
      "id": "document-detail",
      "name": "Document Detail with Content",
      "description": "DocumentDetail shows full document content, metadata, and delete button",
      "status": "not-started",
      "evidence": null,
      "testedAt": null
    },
    {
      "id": "basic-persistence",
      "name": "Basic Persistence",
      "description": "Imported documents persist across app restarts via filesystem storage",
      "status": "not-started",
      "evidence": null,
      "testedAt": null
    }
  ]
}


# Product Description -- Knowledge Base

## What Is This?

A desktop application for managing a personal knowledge base. Users import text and Markdown documents, the system indexes them into searchable chunks, and a question-answering interface provides grounded answers with citations.

## Core Features

### Document Management
- Import `.txt` and `.md` files into a local data store.
- View document metadata: title, filename, size, import date, indexing status.
- Browse a list of all imported documents in a sidebar panel.
- Delete documents and their associated data.

### Text Indexing
- Split documents into ~500-character chunks at paragraph boundaries.
- Store chunks with metadata (character count, word count).
- Track indexing status per document and overall.
- Support indexing individual documents or the full library.

### Grounded Q&A
- Ask natural language questions about the document library.
- Receive answers with citations pointing to specific document chunks.
- Confidence scores indicate answer reliability (0.85 with citations, 0.30 without).
- Full Q&A history is persisted across sessions.

### Status Bar
- Real-time display of index status (idle, indexing, ready, error).
- Document count and last activity timestamp.

## Technical Requirements

- Runs as a desktop application via Electron.
- No external API dependencies -- all processing is local.
- TypeScript throughout with strict mode.
- React 18 for the UI with a dark theme.
- Data stored locally in the user's application data directory.

## User Interface

The interface has a three-panel layout:

```
+------------------+----------------------------------------+
| Header           |                                Refresh |
+------------------+----------------------------------------+
| Document List    | Document Detail / Welcome              |
| (sidebar)        |                                        |
|                  | Q&A Response                           |
| [+ Import]       |                                        |
+------------------+----------------------------------------+
| Question Input                              [Ask]         |
+-----------------------------------------------------------+
| Status: idle | Documents: 0                                |
+-----------------------------------------------------------+
```

## Constraints

- Maximum supported file size: 10 MB.
- Supported formats: `.txt`, `.md`.
- Q&A uses mock patterns -- no LLM integration in this version.
- All data is local; no network requests.

# Session Handoff

## Scope Completed

- Implemented the `document-import` feature only.
- Kept imported documents in memory for the current application session.
- Stopped before implementing `basic-persistence`.

## Implementation Notes

- `DocumentService` now maintains a session-only document list.
- Import validates that the selected item is a file with a `.txt` or `.md` extension.
- Import rejects files larger than 10 MB.
- The renderer displays an importing state and import error feedback.
- The preload bridge uses Electron `webUtils.getPathForFile()` to resolve the selected file path.
- The BrowserWindow sets `sandbox: false` so the compiled CommonJS preload bridge can load and expose the existing IPC API at runtime.

## Explicitly Not Implemented

- Imported documents are not persisted across app restarts.
- Imported source files are not copied into the data directory.
- Imported document content is not written to filesystem storage.
- `document-detail` content loading is still not implemented.

## Tracker Status

- Updated `document-import` to `pass` in `feature_list.json`.
- Left `basic-persistence` as `not-started`.
- Left `document-detail` as `not-started`.

## Files Changed

- `feature_list.json`
- `src/main/main.ts`
- `src/preload/preload.ts`
- `src/renderer/App.tsx`
- `src/renderer/components/DocumentDetail.tsx`
- `src/renderer/components/DocumentList.tsx`
- `src/renderer/components/ImportPanel.tsx`
- `src/renderer/components/StatusBar.tsx`
- `src/renderer/types.d.ts`
- `src/services/document-service.ts`
- `src/services/qa-service.ts`

## Verification

- Installed local dependencies with `npm install` to enable static verification.
- Ran `npm run check` successfully.
- Ran `npm run build` successfully and launched the Electron application.
- The first runtime attempt exposed that `window.knowledgeBase` was undefined; after configuring the existing CommonJS preload bridge to load, a clean Electron session exposed `window.knowledgeBase` as an object.
- In that clean session, the list initially displayed `Documents (0)`.
- Imported `data/sample-documents/meeting-summary.txt`; the list displayed `Documents (1)` and `meeting-summary`.
- Imported `data/sample-documents/design-notes.md`; the list displayed `Documents (2)` and both `meeting-summary` and `design-notes`.
- Selected `package.json`; the UI rejected it with `Only .txt and .md files are supported.` and the list remained at two documents.
- Created a temporary `runtime-too-large.txt` input of 10,485,761 bytes, selected it through the import UI, and observed `Files must be 10 MB or smaller.` with the list still at two documents; the temporary fixture was removed after verification.
- Closed the Electron application after recording these observations.

## Notes For The Next Session

- `DocumentService` must be connected back to filesystem-backed storage when implementing `basic-persistence`.
- The existing `PersistenceService`, indexing service, and Q&A service still use filesystem data; their integration with session-only imported documents has deliberately not been completed in this task.

 ## Critical Rule
  CRITICAL VERIFICATION RULE:
  Before reporting `document-detail` as complete, you must run `npm run check`
  and state exactly: `VERIFICATION_RECORDED: npm run check`.