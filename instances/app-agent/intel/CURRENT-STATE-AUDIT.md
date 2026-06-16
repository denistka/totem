# app-agent — Current State Audit

> Date: 2026-06-09 · Updated: 2026-06-10 · Auditor: Totem onboarding intake
> Scope: full repo read of `app-agent-io/core`

## 1. Health snapshot

| Area | Status | Evidence |
| ---- | ------ | -------- |
| Clone / install | 🟢 | SSH clone OK (HTTPS 404 — private repo); `bun install` 1642 pkgs |
| Tests (vitest) | 🟢 | 322 passed / 20 files |
| Tests (bun:test db) | 🟢 | 56 passed / 3 files |
| Dev server (docs) | 🟢 | `cd docs && bun --bun nuxt dev` → GET / = 200, MCP 12 tools |
| Dev via turbo (`bun run dev:*`) | 🔴 | boots but HTTP 500 `Received protocol 'bun:'` (Node runtime) |
| Local dev w/o vault | 🟢 | unblocked via SQLite + `.env` stubs (see §4) |
| AI provider | 🟢 | OpenRouter key set in control + chat `.env`; live completion verified |
| Secrets hygiene | 🔴 | plaintext key-like strings in `temp.md` (repo root); 1st key revoked (401) |
| Docs ↔ code parity | 🟡 | README omits control plane, characters demo, chat WIP |
| Knowledge coverage | 🟡 | ~14 knowledge files vs ~50+ `// SEE:` annotations |

## 2. Repository structure (as built)

```
app-agent-io/core/
├── core/{app,server,cli,docs,control}   ← upstream layer
│   ├── docs/  → port 3000, MCP server, 9 ADRs, knowledge/
│   └── control/ → port 3001, control plane app
├── organization/  ← brand layer
├── docs/          ← customer docs app
├── demos/{dashboard,saas,landing,chat,characters}
├── apps/          ← only .gitkeep upstream
├── packages/types/
└── (root) AGENTS.md, README.md, NAMING-ISSUE.md, turbo.json, vitest.config.ts
```

## 3. Findings by severity

### 🔴 Critical

- **Secrets in VCS**: `temp.md` contains an OpenRouter-style key (`sk-or-v1-...`) and a short token.
  `temp-product-context.md`, `todo-*.md`, `context.db` are working files sitting in repo root.
  Action: purge from history if pushed, `.gitignore` them, rotate any real keys.

### 🟡 Moderate

- **README drift** vs reality (tracked partly in `todo-documentation-updates.md`):
  control plane (3001), `characters` demo, chat demo status, organization layer detail.
- **Knowledge gap**: ADR-009 is "Partially Implemented"; self-healing docs loop + OTel are aspirational.
  `bun run feature:health` exists but is not enforced.
- **Mixed lockfiles**: `demos/saas/pnpm-lock.yaml`, `demos/landing/pnpm-lock.yaml` inside a bun
  monorepo — violates single-package-manager gate.
- **AGENTS.md Windows-centric** ("Environment: Windows (Git Bash)") while dev is on macOS.

### 🟢 Strengths

- Layer cascade + `defu` merge is clean and well-documented (ADR-002, ADR-004).
- Feature-Oriented Intelligence is a genuine differentiator (slug join key, MCP tools).
- Control plane is unusually complete (agent chat, dependency graph, SSE live logs, config diff).
- Strong test coverage for infrastructure; secrets via `multi-encrypt` is pragmatic.

## 4. Local dev unblock (applied, not committed — gitignored stubs)

Created to satisfy the launcher's `# Secrets` manifest without the team password:

```
.env                       → CORE_DATASOURCE_PROVIDER=sqlite, CORE_ENVIRONMENT=development
control/.env               → NUXT_SESSION_PASSWORD + AI_PROVIDER_* (key blank)
demos/chat/.env            → NUXT_SESSION_PASSWORD + AI_PROVIDER_* (key blank)
demos/dashboard/.env       → NUXT_SESSION_PASSWORD
demos/landing/.env         → NUXT_SESSION_PASSWORD
apps/companions/.data/     → empty dir (manifest entry)
```

To go full prod-like: get `multi-encrypt` password (`bun run dec`) OR supply real
`AI_PROVIDER_KEY`, `NUXT_OAUTH_GITHUB_*`, and `CORE_DATASOURCE_*` (Supabase).

**Update 2026-06-10:** `AI_PROVIDER_KEY` now set (working OpenRouter free-tier key) in
`control/.env` and `demos/chat/.env`. Validated: `/api/v1/key` → 200, chat completion on
`anthropic/claude-haiku-4.5` → 200. The earlier key from `temp.md` was dead (401) — evidence the
committed key was already exposed/revoked.

### Run method (confirmed working)

Per-app, own terminal, under Bun runtime; demos need explicit `--port` (port lives only in their
package.json `dev` script, not nuxt.config.ts):
```
cd docs    && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev            # :3000 (config port)
cd control && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev            # :3001 (config port)
cd demos/<name> && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port <3010..3014>
```

## 5. Build/dev command map

| Command | Effect |
| ------- | ------ |
| `bun run dev` | smart launcher (first-run wizard if apps/ empty) |
| `bun run dev:docs` | docs + MCP → :3000 |
| `bun run dev:demos` | docs + control + all demos |
| `bun run test` / `test:db` | vitest / bun:test SQLite |
| `bun run feature:health` | feature knowledge coverage report |
| `bun run enc` / `dec` | encrypt/decrypt secrets vault |

## 6. Recommended S01 themes (for PLANNER — gate LOCKED until LGTM)

1. Security hardening sprint (remove/rotate secrets, gitignore working files).
2. Docs-accuracy sprint (README + AGENTS cross-platform + characters/chat coverage).
3. Feature-knowledge enforcement sprint (feature:health as CI gate, stub missing slugs).

Pick ONE theme per sprint; scope by user/maintainer flow, not by individual file.
