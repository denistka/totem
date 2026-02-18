# MRPP Iteration Flow

Universal 5-phase execution flow for any sprint or task.

| Phase         | Role      | Focus                             | Gate                 |
| ------------- | --------- | --------------------------------- | -------------------- |
| **1-PLAN**    | PM        | Scope, requirements, estimation   | `scope-approved`     |
| **2-DESIGN**  | ARCHITECT | Patterns, data structures, APIs   | `design-reviewed`    |
| **3-DEVELOP** | TL, DEV   | Implementation, coding, logic     | `build-passes`       |
| **4-VERIFY**  | QA        | Testing, verification, compliance | `tests-pass`         |
| **5-CLOSE**   | PM, ROOT  | Handoff, documentation, cleanup   | `iteration-complete` |

## Flow Rules

1. **Sequential**: Phases follow the order (1→5).
2. **Rollback**: Failure at gate `N` returns the process to phase `N-1`.
3. **Parallel**: Task execution within DEVELOP can be parallelized if dependencies allow.

## Multi-Track Sprints

When a sprint has multiple tracks (e.g. A: sizing, B: dedup, C: polish):

1. Each track follows the same 5-phase flow internally.
2. Tracks execute sequentially unless explicitly marked parallel.
3. **Invariant gate**: Before phase 3-DEVELOP, verify INVARIANTS.md from prior sprints.
4. **Final QA**: Phase 4-VERIFY covers ALL tracks together (not per-track).
5. **Incremental discipline**: Visual changes (Track C) applied one at a time; build after each.

## Invariant Protection

After phase 5-CLOSE of a design sprint:

1. Create `<SPRINT>-INVARIANTS.md` documenting frozen decisions (tokens, APIs, animations).
2. Link via `invariants:` field in next sprint's `.ptl` file.
3. Any change to an invariant requires explicit discussion — auto-approve is BLOCKED.
