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
