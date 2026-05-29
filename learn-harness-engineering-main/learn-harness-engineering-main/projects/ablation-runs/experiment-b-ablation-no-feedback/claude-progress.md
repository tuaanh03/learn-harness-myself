# claude-progress.md -- Session Log

## Project 01: Baseline vs Minimal Harness

### Session 1 -- 2026-03-30

**Duration**: ~45 minutes
**Goal**: Establish baseline Electron app with proper harness

**What was done**:
- Verified Electron window launches at 1200x800 with correct webPreferences
- Confirmed document list panel renders with empty state message
- Confirmed question panel accepts input and submits via IPC
- Verified PersistenceService creates data directories under userData
- Updated feature_list.json with all 4 features at status "pass"
- Wrote AGENTS.md with startup rules and layer boundaries
- Wrote docs/ARCHITECTURE.md describing Electron layer structure
- Wrote docs/PRODUCT.md describing knowledge base requirements

**Decisions**:
- Used constructor injection for PersistenceService to keep services testable
- Kept all IPC channel names in a single const object in types.ts
- Window title set to "Knowledge Base" for consistency

**Issues**: None

**Next session**: Proceed to Project 02 to add import, detail view, and persistence features.

### Session 2 -- 2026-05-25

**Duration**: Interactive experiment run and independent verification
**Goal**: Compare the explicit-harness run against the prompt-only baseline from Lecture 01.

**What was done**:
- Used the repository harness (`AGENTS.md`, architecture/product docs, and `feature_list.json`) to guide completion and verification.
- Verified document import, text indexing, citation-backed Q&A, persisted history, and deletion cleanup.
- Added lifecycle coverage in `tests/knowledge-base.test.ts`.
- Updated `feature_list.json` with current evidence for eight verified features.

**Verification**:
- `npm.cmd run check`: pass.
- `npm.cmd test`: pass (2/2 tests).
- `npm.cmd run build`: pass.

**Comparison against experiment-a (prompt-only)**:

| Criterion | Experiment A | Experiment B |
|---|---|---|
| Harness artifacts available | None in the experiment directory | `AGENTS.md`, docs, `feature_list.json`, progress log |
| Completion claim | Reported implementation done | Reported pass evidence per feature |
| Independent type check | Failed with renderer TypeScript errors | Passed |
| Test coverage | No test files found | Lifecycle tests passed (2/2) |
| Machine-readable state | None | Eight features recorded with evidence |

**Diagnostic conclusion**:
- Experiment A exposed a verification gap: it declared completion although independent `npm run check` later failed.
- Experiment B reduced that gap through explicit instructions, concrete verification commands, test coverage, and persistent feature evidence.
- The highest-value harness improvement observed in this comparison was feedback/verification, followed by state recording.

**Known limitation**:
- `experiment-b` started from the provided `solution` directory, which already contained baseline harness artifacts and four passing feature entries. The comparison demonstrates improved reliability and verification discipline, but is not a perfectly controlled same-source ablation experiment.

**Next session**:
- Use this run as input for Lecture 02's five-subsystem harness audit.
- Improve Windows environment guidance, such as a PowerShell-compatible initialization path using `npm.cmd`.
