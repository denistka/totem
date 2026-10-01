# S{{NN}} Invariants — {{PROJECT_NAME}}

Sprint result: {{one-line summary}}.

> Structured blocks below are machine-checked by `scripts/verify-invariants`.
> Freeform sections remain human guidance (not auto-verified).
> History: see `INVARIANTS-LOG.md`. Schema: `core/INVARIANTS.ti`.

## Active (structured)

```inv
id: INV-{{PROJECT}}-001
date: {{YYYY-MM-DD}}
severity: hard
status: active
confirmed_by: {{git-sha}}
assertion: file_exists
path: package.json
why: {{rationale}}
added_by: ARCHITECT
sprint: S{{NN}}
```

## Freeform / narrative

- {{decision that is not yet machine-checkable}}

## Restrictions

- Cannot change hard invariants without explicit discussion + log entry.
- Soft invariants: warn and document; do not block CLOSE.
