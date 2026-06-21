# app-agent — Local Dev Runbook

> How to run `app-agent-io/core` locally. Verified 2026-06-09 on macOS (darwin 25.5.0).
> Workspace: `/Users/denistka/Projects/app-agent-io/core`

## 0. TL;DR (fastest path that ACTUALLY works)

> The `bun run dev:*` (turbo) scripts BOOT but return **HTTP 500** on any request, because the
> server code imports `bun:sqlite` and turbo runs `nuxt` under **Node** (see §2C). Run each app
> directly under the **Bun runtime** with `bun --bun nuxt dev` instead.

```bash
cd /Users/denistka/Projects/app-agent-io/core
bun install

# Docs + MCP — run from the app dir, under Bun runtime:
cd docs && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # → http://localhost:3000  (verified 200 OK)
```

Each app runs in its OWN terminal (one process each), from its own dir:

```bash
# docs + control: port is in nuxt.config.ts (devServer.port) → no flag needed
cd docs    && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev              # :3000 docs + MCP
cd control && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev              # :3001 control plane

# demos: port lives ONLY in their package.json `dev` script. Running `nuxt dev` directly drops it,
# so you MUST pass --port or they all default to 3000 and collide with docs.
cd demos/dashboard  && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port 3010
cd demos/saas       && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port 3011
cd demos/landing    && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port 3012
cd demos/chat       && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port 3013
cd demos/characters && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port 3014
```

> Two gotchas baked into these commands:
> 1. `--bun` forces Bun's runtime for the `nuxt` CLI (shebang `#!/usr/bin/env node`), so
>    `bun:sqlite` resolves in Nitro AND Vite SSR. Without it → HTTP 500 (§2C).
> 2. `--port` is REQUIRED for demos (port is only in their package.json script, not nuxt.config.ts).
>    docs/control set `devServer.port` in config, so they don't need it.

## 1. Prerequisites

| Tool | Version | Notes |
| ---- | ------- | ----- |
| Bun | ≥ 1.2.15 (pinned `packageManager`) | runtime + package manager |
| Node | ≥ 20 | only for `core/cli/dev.js` launcher |
| Git (SSH) | — | repo is PRIVATE → clone via `git@github.com:app-agent-io/core.git` |

> HTTPS clone returns 404 (private). Use SSH with your authed GitHub account.

## 2. The two startup blockers (and fixes)

### Blocker A — encrypted secrets vault

`bun run dev` runs `checkAndDecryptSecrets()`: if `encrypted.json` exists and any file listed in
the `# Secrets` block of `.gitignore` is missing, it runs `bun run dec` and **exits if the password
is wrong**. We don't have the team password.

**Fix:** create every path listed in the `# Secrets` block yourself so the launcher skips decryption entirely.

**Full manifest** (all must exist — files or empty dirs):

| Path | Kind | Local stub |
|------|------|------------|
| `./.env` | file | `CORE_DATASOURCE_PROVIDER=sqlite`, `CORE_ENVIRONMENT=development` |
| `./control/.env` | file | `NUXT_SESSION_PASSWORD` (32+ chars), optional `AI_PROVIDER_*` |
| `./demos/chat/.env` | file | session + optional AI |
| `./demos/dashboard/.env` | file | session only |
| `./demos/landing/.env` | file | session only |
| `demos/characters/.data` | dir | `mkdir -p` (empty) |
| `demos/dashboard/.data` | dir | `mkdir -p` (empty) |
| `apps/companions/.data` | dir | `mkdir -p` (empty — no `companions` app required) |
| `apps/chat/.data` | dir | NuxtHub SQLite (created by chat app / migrate) |

**Also needed (not in manifest):** `apps/chat/.env` — copy from `apps/chat/.env.example`.

**One-shot bootstrap** (no team password):

```bash
cd /Users/denistka/Projects/app-agent-io/core
mkdir -p apps/companions/.data demos/characters/.data demos/dashboard/.data
# Create .env files from .env.example templates if missing (see table above)
```

Verify: all manifest paths exist → `bun run dev` will not prompt for decrypt password.

> 🚫 **NEVER run `bun run enc`** in this clone. It re-encrypts the CURRENT local `.env` files
> (our stubs + the live OpenRouter key) and OVERWRITES the committed `encrypted.json` — destroying
> the team's real secrets and baking our test values (and a real API key) into git history.
> `encrypted.json` is the team vault; leave it untouched. The launcher never reads it while the
> stub files exist (it only decrypts MISSING files). To adopt the real secrets instead of stubs:
> get the password and run `bun run dec` (this overwrites the stubs with real values).

Current stub contents (gitignored — never commit):
```
.env                  → CORE_DATASOURCE_PROVIDER=sqlite, CORE_ENVIRONMENT=development
control/.env          → NUXT_SESSION_PASSWORD=<32+ chars>, AI_PROVIDER_* (your key)
demos/chat/.env       → NUXT_SESSION_PASSWORD=<32+ chars>, AI_PROVIDER_* (optional)
demos/dashboard/.env  → NUXT_SESSION_PASSWORD=<32+ chars>
demos/landing/.env    → NUXT_SESSION_PASSWORD=<32+ chars>
apps/chat/.env        → same as demos/chat (not in manifest but required for chat app)
*.data dirs           → empty mkdir -p (satisfies launcher only)
```
Alternative: get the team password and run `bun run dec` (overwrites stubs with team values).

### Blocker B — Nuxt telemetry interactive prompt

On first run each Nuxt app asks `Are you interested in participating?` (telemetry). Under
`turbo run dev` several apps print this at once, stdin can't answer, and the run stalls / fails on
Ctrl-C. This is what happened in the last attempt.

**Fix (recommended):** set `NUXT_TELEMETRY_DISABLED=1` (prefix the command, see §0). Clean, no
repo changes. To make it permanent add `export NUXT_TELEMETRY_DISABLED=1` to your shell rc.

> ⚠️ Do NOT run `bunx nuxt telemetry disable --global` from inside the repo: it writes a
> root-level `.nuxtrc` that is NOT gitignored and pollutes the working tree. If you want the
> global config, run it from your home dir (`cd ~ && bunx nuxt telemetry disable --global`).

### Blocker C — `bun:sqlite` requires the Bun runtime (turbo runs Node) ⚠️ MAIN ISSUE

Symptom on any HTTP request (homepage, MCP, API):
```
HTTP 500 — Only URLs with a scheme in: file, data, and node are supported by the
default ESM loader. Received protocol 'bun:'
```

Root cause: the project migrated `better-sqlite3` → `bun:sqlite`
(`docs/superpowers/specs/2026-06-04-bun-sqlite-migration-design.md`). Server utils
(`logs-db.ts`, `feature-registry-db.ts`, `config-service/provider-sqlite.ts`, `knowledge-db.ts`,
`logs-query.ts`) import `bun:sqlite`, which exists ONLY in Bun's runtime. The design assumes
`nitro: { preset: 'bun' }`. But in dev, `turbo run dev` → `nuxt dev` is launched via the `nuxt`
binary's `#!/usr/bin/env node` shebang → server code executes under **Node** → `bun:` protocol
import throws. Startup may log `from sqlite datasource` (Nitro plugins survive), but page SSR via
Vite's Node loader still throws on request → 500.

**Fix (verified):** bypass turbo, run each app's `nuxt dev` directly under Bun:
```bash
cd <app-dir> && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev
```
Verified: `cd docs && ... bun --bun nuxt dev` → `GET /` returns **200** with real HTML
(`<title>Documentation</title>`), zero `bun:` errors.

Notes:
- `bun --bun run dev:docs` does NOT fix it — turbo (a compiled binary) spawns `nuxt` via Node
  regardless; the `--bun` node-shim doesn't propagate to turbo's grandchild process.
- Trade-off: no single-command "run all". Use one terminal per app (or a tmux/concurrently setup).
- Pure-content demos (saas/landing) may render under Node IF they don't hit core's bun:sqlite
  middleware — but use `bun --bun` uniformly to be safe.
- Permanent repo fix (out of scope here, needs upstream PR): change each app `dev` script to
  `bun --bun nuxt dev`, or configure Nitro dev to use the Bun runtime.

## 3. Datasource: SQLite vs Supabase

- Config service (ADR-005) picks a provider from `CORE_DATASOURCE_*` in root `.env`.
- No `CORE_DATASOURCE_URL`/`KEY` → falls back to **local SQLite** (`bun:sqlite`), zero setup.
- Vite prints `"bun:sqlite" ... treating it as external dependency` warnings — harmless; resolved at
  runtime by Bun.
- For prod-like multi-node config: set `CORE_DATASOURCE_PROVIDER=supabase` + URL + service key,
  then run `scripts/db-setup.sql` in the Supabase SQL editor.

## 4. Run recipes

✅ Working (Bun runtime, per app, own terminal):

| Goal | Command (run from repo root) |
| ---- | ---------------------------- |
| Docs + MCP | `cd docs && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev` → :3000 (port in config) |
| Control plane | `cd control && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev` → :3001 (port in config) |
| A demo | `cd demos/<name> && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev --port <PORT>` (flag REQUIRED) |

⚠️ Boots but 500s on requests (turbo → Node runtime, see §2C):

| Command | Status |
| ------- | ------ |
| `bun run dev` (smart launcher) | server runs under Node → 500 on bun:sqlite routes |
| `bun run dev:docs` / `dev:control` / `dev:demos` / `dev:all` | same — boot only, 500 on request |

**Smart launcher (`bun run dev`)**: if `apps/` is empty → wizard (1 copy a demo, 2 run demos,
3 exit). If `apps/` has an app → runs full `turbo run dev`. Copying a demo creates
`apps/<name>/` on **port 3002** and updates its `package.json` name. Useful for SCAFFOLDING a new
app, but to actually serve it use `cd apps/<name> && bun --bun nuxt dev`.

## 5. Optional capabilities → required env

| Capability | Var | File |
| ---------- | --- | ---- |
| Agent chat (control) | `AI_PROVIDER_KEY` (OpenRouter/OpenAI-compatible) | `control/.env` |
| Chat demo AI | `AI_PROVIDER_KEY` | `demos/chat/.env` |
| GitHub login (chat) | `NUXT_OAUTH_GITHUB_CLIENT_ID` / `_SECRET` | `demos/chat/.env` |
| GitHub login (dashboard/landing) | same pair; callback `http://localhost:<port>/auth/github` | respective `.env` |
| Shared config DB | `CORE_DATASOURCE_URL/KEY/PROVIDER` | root `.env` |

Without `AI_PROVIDER_KEY`, agent chat / chat demo render a friendly "not configured" 503 — expected.

## 6. Verify / health

```bash
bun run test          # vitest — 322 tests (NOT `bun test` — see DEEP-TEST-ANALYSIS.md)
bun run test:db       # bun:test SQLite — 56 tests
bun run typecheck     # turbo typecheck (fails on demo-saas + control as of S03)
bun run lint          # eslint
bun run feature:health  # feature knowledge coverage
```

> **S03 note:** Raw `bun test` at repo root runs bun's test runner without vitest setup → 83 false failures. Always use `bun run test`.

## 7. MCP in Cursor/Claude

With docs running on :3000:
```bash
claude mcp add --transport http app-agent-docs http://localhost:3000/mcp
```
Cursor: the docs server prints an "Install Nuxt MCP server" deeplink on startup; 12 tools exposed.

## 8. Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `Failed to decrypt secrets ... exited 1` | wrong/empty vault password | create `.env` stubs (§2A) or get password |
| Run hangs on `Are you interested in participating?` | Nuxt telemetry prompt in parallel | `NUXT_TELEMETRY_DISABLED=1` (§2B) |
| `vitest: command not found` | deps not installed | `bun install` |
| `HTTP 500 ... Received protocol 'bun:'` | server ran under Node (turbo), not Bun | run `cd <app> && bun --bun nuxt dev` (§2C) |
| `bun:sqlite ... external dependency` warns at build | Vite static analysis | ignore — resolves at runtime under Bun |
| Demo starts on :3000 instead of its port | `bun --bun nuxt dev` drops the package.json `--port` | add `--port 3010/3011/...` (§0) |
| HTTPS clone 404 | private repo | clone via SSH |
| Port conflict warning | port already used | launcher warns; stop the other process or ignore |
