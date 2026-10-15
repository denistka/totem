# Optional current-set rollup
#
# Maintain OR generate from active ```inv``` blocks across S*-INVARIANTS.md.
# Link from .ptl via `invariants: @CURRENT-INVARIANTS.md` when preferred over
# a single sprint freeze file. Copy to instances/<project>/CURRENT-INVARIANTS.md.

# {{PROJECT_NAME}} — Current Invariants

Active only (`status: active`). History: `INVARIANTS-LOG.md`.

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
```
