# Deep Dive: Security Surface

**Audited:** 2026-06-18 (S03)  
**No secrets reproduced in this document.**

## Secrets management flow

1. Plaintext `.env` files listed in `.gitignore` under `# Secrets` manifest
2. `bun run enc` → `encrypted.json` (committed, encrypted blobs)
3. `bun run dev` → auto-prompts decrypt if manifest files missing
4. CI: `MULTI_ENCRYPT_PASSWORD` env var piped to `multi-encrypt dec`

**Knowledge slug:** `secrets-management` (orphaned — no SEE refs in code except dev.js comment)

## Manifest rules (S02 invariant)

- List only `.env` **files** — never `.data/` directories
- Each new app with secrets → append path + re-encrypt

## Exposure incidents

| File | Risk | Status |
|------|------|--------|
| `temp.md` | API key-like strings in repo root | Redacted S02 — **rotate keys manually** |
| `context.db` | Working SQLite in root | Should be gitignored |
| `todo-*.md` | Internal notes | Working files in VCS |

**Rule:** Never copy `temp.md` contents into Totem intel.

## Runtime config secrets

- Use Nuxt `runtimeConfig` private keys (not `$secret` custom namespace)
- Public vs private split via `.public` suffix in nuxt.config
- Datasource credentials via `CORE_DATASOURCE_*` env — outside runtimeConfig shape

## Auth secrets

| Var | Purpose |
|-----|---------|
| `NUXT_SESSION_PASSWORD` | Cookie encryption (32+ chars) |
| `NUXT_OAUTH_*_CLIENT_ID/SECRET` | Per-provider OAuth |

## Recommendations

1. Add `temp.md`, `context.db`, `todo-*.md` to `.gitignore` or delete from repo
2. Rotate any keys ever committed to `temp.md`
3. Add SEE ref from `dev.js` to `secrets-management` knowledge slug
4. Document fork onboarding: Supabase MCP setup (#117)

## Multi-tenant / compliance

Not implemented — vision doc only. No SOC2, no tenant isolation beyond config layer `app_id`.
