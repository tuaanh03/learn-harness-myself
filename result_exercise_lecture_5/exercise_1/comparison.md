# Exercise 1 Comparison

## Setup

- Project used: no-handoff run used `D:\School\NCKH\HarnessBuild\excercises_lecture_5\starter`; with-handoff run used `D:\School\NCKH\HarnessBuild\excercises_lecture_5\exercise_01\handoff-existing`
- Number of sessions: 3
- Feature per session:
  1. metadata-extraction
  2. document-chunking
  3. indexing-status-ui + grounded-qa

## Result Table

| Run | Session 2 rebuild cost | Session 3 rebuild cost | Total rebuild cost |
|---|---:|---:|---:|
| No handoff | about 5-10 min; 11 files inspected before coding | about 10-15 min; 20 files inspected before coding | about 15-25 min; 31 files inspected before coding |
| With handoff | about 2-4 min to recover state from handoff; additional source inspection was implementation-specific | TODO | Session 2 measured; Session 3 TODO |

## Qualitative Observations

### No Handoff

- Files agent had to rediscover: `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, `feature_list.json`, `src/services/indexing-service.ts`, `src/services/document-service.ts`, `src/services/persistence-service.ts`, `src/shared/types.ts`, IPC/preload files, renderer detail/status files, and `package.json`.
- Decisions agent had to infer: `metadata-extraction` was already complete; `document-chunking` was the next scoped feature; the existing chunking code was partial and needed index metadata/status updates.
- Confusion or duplicated work: `git status` included unrelated changes outside the target project, and the current project had no handoff explaining which changes belonged to the previous session.
- Verification gaps: No manual import/index/Q&A scenario was recorded from the previous session, so the later sessions re-ran `npm run check`, `npm run build`, Electron launch smoke tests, an in-memory chunking smoke test, and a compiled-service status + Q&A smoke test.
- Session 3 extra rediscovery: Before implementing `indexing-status-ui` and `grounded-qa`, the agent had to inspect the status contract across shared types, IPC, preload, renderer app state, StatusBar, IndexingService, QaService, DocumentService, and PersistenceService.

### With Handoff

- Files agent could read immediately: `session-handoff.md`, `feature_list.json`, and the exact next files listed in the handoff.
- Decisions preserved: `metadata-extraction` was complete; `document-chunking` was next; previous verification had passed; parent-repo git noise was expected.
- Work avoided: The agent did not need to infer the prior feature outcome from scratch before choosing the next scoped feature.
- Remaining gaps: Source inspection was still needed because `IndexingService` had partial chunking code and the incomplete behavior was in implementation details.

## Conclusion

Using `session-handoff.md` reduced the measured Session 2 rebuild cost from about 5-10 min to about 2-4 min.

The current measured no-handoff rebuild cost is about 15-25 min across sessions 2 and 3. The with-handoff run has Session 2 measured; Session 3 is still TODO.

The most important observed cost was:

- The agent had to rediscover feature ownership, current pass/fail state, cross-layer contracts, and unrelated git changes before safely editing.

The handoff template should be improved by adding:

- Last completed feature, exact files changed, verification commands/results, next scoped feature, known unrelated git status noise, and the cross-layer files that future sessions should read first.
