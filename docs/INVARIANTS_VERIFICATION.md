# Versioned invariants — project wiring

How a **project code repo** (`paths.code`) runs Totem invariant checks.

## Manual / local

```bash
# From totem clone:
node scripts/verify-invariants --instance instances/<project>
# Override code root:
node scripts/verify-invariants --instance instances/<project> --code /path/to/code-repo

# Self-test (demo fixture):
node scripts/verify-invariants --self-test
```

Exit codes: `0` hard OK (soft → WARN), `1` hard fail, `2` usage/config error.

## Git hooks (optional)

From the **code** repository (or any checkout that can see the totem path):

```bash
node /path/to/totem/scripts/install-invariant-hooks \
  --instance /path/to/totem/instances/<project> \
  --code .

# Remove:
node /path/to/totem/scripts/install-invariant-hooks --uninstall --code .
```

- `post-commit` — advisory (never blocks the commit)
- `pre-push` — hard failures block the push

## CI

Copy `templates/ci/verify-invariants.yml` into the code repo’s `.github/workflows/`, set `{{PROJECT}}`, and ensure the workflow can checkout `denistka/totem` (or a vendored copy).

## Schema & templates

- Protocol: `core/INVARIANTS.ti`
- Blocks: `templates/invariants/`
- Example instance: `instances/invariants-demo/`
