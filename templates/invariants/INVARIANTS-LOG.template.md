# Invariants Log — {{PROJECT_NAME}}

Append-only history of invariant lifecycle events.
Never rewrite past entries. OPTIMIZER may compact into digests
while preserving ID chronology (`core/OPTIMIZER.ti` → invariants-compaction).

Schema: `core/INVARIANTS.ti`

---

## {{YYYY-MM-DD}} — ADD INV-{{PROJECT}}-001

- **action:** added
- **by:** ARCHITECT
- **why:** {{rationale}}
- **confirmed_by:** {{git-sha}}
- **severity:** hard
- **sprint:** S{{NN}}

---

<!-- Example deprecate / supersede entries:

## 2026-10-15 — SUPERSEDE INV-demo-001 → INV-demo-004

- **action:** superseded
- **by:** PLANNER
- **why:** Path moved after monorepo split
- **confirmed_by:** def5678
- **supersedes:** INV-demo-001
- **superseded_by:** INV-demo-004

## 2026-11-01 — DEPRECATE INV-demo-002

- **action:** deprecated
- **by:** human:denis
- **why:** Feature removed; assertion no longer applicable
- **deprecated_on:** 2026-11-01

-->
