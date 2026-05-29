Implementation is done.

The Electron app now supports:
- Native `.txt` / `.md` document import and automatic indexing.
- Full document text viewing plus indexed chunk inspection.
- Re-indexing and deletion with stored-content/index cleanup.
- Offline question answering based on retrieved document passages, with citations and confidence display.
- Consistent typed IPC between Electron main, preload, and React renderer.

Key files changed include [App.tsx](D:/School/NCKH/HarnessBuild/learn-harness-engineering-main/learn-harness-engineering-main/projects/project-01/experiment-a/src/renderer/App.tsx), [ipc-handlers.ts](D:/School/NCKH/HarnessBuild/learn-harness-engineering-main/learn-harness-engineering-main/projects/project-01/experiment-a/src/main/ipc-handlers.ts), [indexing-service.ts](D:/School/NCKH/HarnessBuild/learn-harness-engineering-main/learn-harness-engineering-main/projects/project-01/experiment-a/src/services/indexing-service.ts), and [qa-service.ts](D:/School/NCKH/HarnessBuild/learn-harness-engineering-main/learn-harness-engineering-main/projects/project-01/experiment-a/src/services/qa-service.ts).

Verification: I attempted `npm.cmd run check` and `npm.cmd run build`, but the project has no installed dependencies and this environment cannot fetch them. `npm.cmd install --offline` fails with `ENOTCACHED` for `@types/react`, while a network install timed out. No build failure in the implemented source was observed beyond unavailable tooling.