# S01 Invariants — invariants-demo

Sprint result: Fixture for versioned invariant verification.

> Machine-checked via ```inv``` blocks. Schema: `core/INVARIANTS.ti`.
> History: `INVARIANTS-LOG.md`. Freeform bullets below are NOT auto-verified.

## Active (structured)

```inv
id: INV-demo-001
date: 2026-10-01
severity: hard
status: active
confirmed_by: 0000000
assertion: file_exists
path: package.json
why: Fixture package manifest must exist for install simulation.
added_by: ARCHITECT
sprint: S01
```

```inv
id: INV-demo-002
date: 2026-10-01
severity: hard
status: active
confirmed_by: 0000000
assertion: path_absent
path: .env.local
why: Secrets file must never be committed in the fixture.
added_by: ARCHITECT
sprint: S01
```

```inv
id: INV-demo-003
date: 2026-10-01
severity: hard
status: active
confirmed_by: 0000000
assertion: config_value
path: package.json
key: name
expect: invariants-demo-fixture
why: Package name is frozen for the demo fixture.
added_by: PLANNER
sprint: S01
```

```inv
id: INV-demo-004
date: 2026-10-01
severity: soft
status: active
confirmed_by: 0000000
assertion: file_exists
path: OPTIONAL_README.md
why: Soft preferred doc; missing file should WARN only.
added_by: QA
sprint: S01
```

```inv
id: INV-demo-005
date: 2026-10-01
severity: hard
status: active
confirmed_by: 0000000
assertion: command
cmd: test -f src/index.js
why: Entry file presence checked via command assertion.
added_by: ARCHITECT
sprint: S01
```

```inv
id: INV-demo-006
date: 2026-09-01
severity: hard
status: deprecated
confirmed_by: 0000000
assertion: file_exists
path: legacy.js
why: Legacy entry removed; kept for log/history demo (skipped by verifier).
added_by: human:denis
deprecated_on: 2026-10-01
deprecated_why: Replaced by src/index.js
sprint: S00
```

## Freeform / narrative

- Demo instance only — do not treat as a product baseline.
- Port convention for docs: fixture listens conceptually on `5173` (not enforced here).

## Restrictions

- Hard invariant failures block task CLOSE (PM) and pre-push hooks.
- Soft failures are warnings for QA reports only.
