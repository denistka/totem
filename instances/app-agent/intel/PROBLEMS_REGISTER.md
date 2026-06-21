# Problems Register

**Updated:** 2026-06-21 (S05 closed)

Priority: **P0** = blocks dev/onboarding, **P1** = product/quality gap, **P2** = polish/future

### S05 close notes

- Work-control orchestrator spine verified on `:3003` (T12).
- `db:migrate` works (sqlite). Supabase datasource path still unverified without creds.
- WebSocket live sync: use isolated `bun --bun nuxt dev` in `apps/work-control` (turbo proxy may block `/_ws`).

---

## P0 — Blocks understanding or local dev

| ID | Problem | Evidence | Suggested sprint |
|----|---------|----------|------------------|
| P0-1 | **Chat app not runnable without env** | Was blocked — **resolved S02**: `SETUP.md`, `.env.example`, migrations verified | ~~S02~~ Done |
| P0-2 | **Credentials in repo scratch file** | `temp.md` — **redacted S02**; user must rotate keys | Rotate keys manually |
| P0-3 | **Typecheck fails on demos + control** | `bun run typecheck` — demo-saas `uiLocale` Locale type; control duplicate `@nuxt/ui` + `~~/shared/utils/file` (see `DEEP-TYPECHECK-AUTOPSY.md`) | S04 Typecheck fix |
| P0-4 | ~~**Test suite partially broken at root**~~ | **FALSE ALARM S03:** `bun test` ≠ `bun run test`. Vitest: 322 pass; bun:test db: 56 pass. Document correct command. | S04 README/CI doc |
| P0-5 | **Cursor MCP `user-app-agent-docs` errored** | MCP server must run via docs dev first | See `MCP_SETUP.md` |
| P0-6 | **`.gitignore` secrets manifest lists `.data/` dirs** | S02 fix reverted upstream — `bun run dev` tries `multi-encrypt dec` for missing `.data`. PR [#120](https://github.com/app-agent-io/core/pull/120) submitted for WAL sidecars only | Upstream: remove `.data` from `# Secrets`, add `./apps/chat/.env` only |

---

## P1 — Product / infrastructure gaps

| ID | Problem | Evidence |
|----|---------|----------|
| P1-1 | **Vision vs built** | `temp-product-context.md` lists auth/billing/multi-tenancy/compliance as needed — mostly not productized |
| P1-2 | **Demo hardcoding** | `temp.md` + issue #114 — nav, auth forms, footer columns hardcoded in demo components |
| P1-3 | **No live Supabase integration tests** | Issue #4 — config service only unit-tested with mocks |
| P1-4 | **MCP analysis aspect stub** | Issue #5 — `explain` returns error for `aspect: analysis` |
| P1-5 | **record() sub-agent not implemented** | Issue #10 |
| P1-6 | **VoyceMe patterns not back in core** | Issue #103 (high priority) |
| P1-7 | **Chat endpoint factory in storytech** | Issue #108 SPIKE — evaluate moving to core |
| P1-8 | **i18n scope extension** | Issue #24 — FeatureScope i18n/config/enabled |
| P1-9 | **AI integrations / model profiles** | Issue #26 |
| P1-10 | **CoreUserMenu UI bug** | Issue #111 — login buttons truncated |
| P1-11 | **Docs gap: Supabase MCP for forks** | Issue #117 |

---

## P2 — Polish / backlog

| ID | Problem | Evidence |
|----|---------|----------|
| P2-1 | **Orphaned knowledge slugs** | `feature-flags`, `secrets-management`, `sync-adr-tickets` — no code refs |
| P2-2 | **README/docs drift** | `todo-documentation-updates.md` — structure diagram, MCP tool list outdated in places |
| P2-3 | **Missing demo templates** | Issues #17–19 (editor, changelog, portfolio) |
| P2-4 | **Raw PostgreSQL ConfigProvider** | Issue #12 |
| P2-5 | **Client hot-reload via WebSocket** | Issue #8 |
| P2-6 | **Auto-generate knowledge frontmatter** | Issue #11 |
| P2-7 | **Config introspection MCP redesign** | Issue #13 |
| P2-8 | **Extract data layer to package** | Issue #101 |

---

## Operational smoke results (2026-06-18, S03 verified)

| Check | Result |
|-------|--------|
| `bun run typecheck` | **FAIL** — demo-saas Locale + control @nuxt/ui dedup (see `DEEP-TYPECHECK-AUTOPSY.md`) |
| `bun run test` (vitest) | **PASS** — 322/322 |
| `bun run test:db` | **PASS** — 56/56 (bun:test SQLite) |
| `bun test` (raw) | **MISLEADING** — use vitest; see `DEEP-TEST-ANALYSIS.md` |
| `node core/cli/feature-health.js` | **PASS** — 12/12 slugs covered, 3 orphaned knowledge files |
| `bun run dev` (full turbo) | **BOOT OK** — HTTP 500 on routes if Node runtime; use `bun --bun nuxt dev` |
| Chat `:3002/api/status` | **PASS** — see `intel/S02-CHAT-SMOKE.md` |
| Work Control `:3003/api/board` | **PASS** when run via `bun --bun nuxt dev` — see `sprints/S04-WORK-CONTROL-SUMMARY.md` |

---

## Product questions (needs human decision)

1. **Chat agent vs docs MCP** — `temp.md` asks for a "special" chat agent like docs. Options: extend control `/agent`, dedicated MCP on chat app, or unified gateway.
2. **i18n strategy** — Nuxt built-in vs `@nuxtjs/i18n` module (already in core deps) — issue #1 area from `temp.md`.
3. **Configurable demo items** — centralize in `app.config.ts` vs content YAML (issue #114 analysis in `temp.md`).

---

## Security note

Do **not** commit or copy contents of `temp.md` into Totem intel. Rotate any keys that were stored there. Recommend adding `temp.md` to `.gitignore` or deleting from repo.
