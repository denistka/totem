# app-agent — Totem V6 Instance

Totem instance for **App Agent** (`app-agent-io/core`) — a forkable Nuxt 4 layered monorepo with an embedded AI development agent.

## Layout

```
totem/totem-v6/instances/app-agent/   ← this dir (planning, sprints, invariants)
├── project.config.yml                 ← stack + paths + guardians
├── README.md                          ← you are here
├── sprints/                           ← .ptl + .pd files (created on demand)
└── intel/                             ← research, audits, links

/Users/denistka/Projects/app-agent-io/core/   ← workspace (paths.code)
├── core/                              ← upstream layer (shared Nuxt layer)
│   ├── app/                           ← components, composables, layouts
│   ├── server/                        ← middleware, API, auth, config service
│   ├── cli/dev.js                     ← smart launcher (first-run wizard)
│   ├── docs/                          ← docs app + MCP server (port 3000)
│   │   ├── adr/                       ← 9 Architecture Decision Records
│   │   ├── knowledge/                 ← slug-keyed feature knowledge
│   │   └── server/mcp/tools/          ← 12 MCP tools
│   └── control/                       ← control plane (port 3001)
├── organization/                      ← brand layer (app.config.ts)
├── docs/                              ← customer docs app
├── demos/                             ← dashboard(3010) saas(3011) landing(3012) chat(3013) characters
├── apps/                              ← customer apps (empty upstream)
└── packages/types/                    ← shared TypeScript types
```

## Architecture

Three-layer cascade with `defu` config merging (`apps/* extends organization extends core`).
Config deep-merges, arrays concatenate, primitives override (higher layer wins).
Server middleware from ALL layers runs (additive).

| Layer | Path | Responsibility |
| ----- | ---- | -------------- |
| Core | `core/` | Upstream-maintained shared layer — do NOT modify |
| Organization | `organization/` | Brand, logo, colors, company defaults |
| Apps | `apps/*` | Customer code (zero merge conflicts with upstream) |
| Docs + MCP | `core/docs/` | Documentation + MCP server (port 3000) |
| Control plane | `core/control/` | Agent chat, feature graph, live logs (port 3001) |
| Config service | `core/server/utils/config-service/` | Hot-reload runtime config (SQLite/Supabase) |

## Feature-Oriented Intelligence

The defining pattern (ADR-009). A kebab-case **slug** is the universal join key:

| Dimension | Mechanism |
| --------- | --------- |
| Knowledge | `core/docs/knowledge/{slug}.md` |
| Source | `// SEE: feature "slug" at path` annotations |
| Runtime | `defineFeatureHandler/Composable/Plugin(slug, fn)` |
| Tooling | MCP `explain`, `introspect`, `census`, `record` |

## Key Docs

| Doc | Location |
| --- | -------- |
| Agent guide | `app-agent-io/core/AGENTS.md` |
| README | `app-agent-io/core/README.md` |
| ADRs (001–009) | `app-agent-io/core/core/docs/adr/` |
| Feature knowledge | `app-agent-io/core/core/docs/knowledge/` |
| Naming issue (context→feature) | `app-agent-io/core/NAMING-ISSUE.md` |
| Instance config | `./project.config.yml` |

## Ports

| Service | Port |
| ------- | ---- |
| Docs + MCP | 3000 |
| Control plane | 3001 |
| Customer apps | 3002+ |
| Demos (dashboard/saas/landing/chat) | 3010–3013 |

## Status (updated 2026-06-18)

- ✅ **S01** Deep investigation — `intel/ARCHITECTURE_MAP.md`, `FEATURE_CENSUS.md`, etc.
- ✅ **S02** Chat bootstrap — `intel/S02-CHAT-SMOKE.md`, `intel/S02-DEV-SMOKE.md`
- ✅ Canonical Totem instance (merged from duplicate `app-agent-io` instance — removed)
- 📍 Load hub: `intel/TOTEM_INDEX.ti`

```text
read totem/totem-v6/index.ti, load instance app-agent, read intel/TOTEM_INDEX.ti
```

## Known Risks (intake candidates for S01 backlog)

- Secrets hygiene: `temp*.md` in repo root contain API-key-like strings — rotate + remove (first key
  found was already revoked → 401; confirms exposure risk)
- Dev ergonomics: `bun run dev:*` (turbo) → 500 on bun:sqlite routes; no single-command run-all.
  Permanent fix = make app `dev` scripts use `bun --bun nuxt dev` (upstream PR).
- Demo ports only in package.json scripts, not nuxt.config.ts → direct `nuxt dev` drops the port.
- README drift: control plane, 5th demo (characters), chat WIP not reflected
- Knowledge coverage low (~14 slugs) vs ambitious feature system; `bun run feature:health` as CI gate
- Stray `pnpm-lock.yaml` inside bun monorepo (demos/saas, demos/landing)

## Load Order

1. `totem-v6/index.ti` (master protocol)
2. `totem-v6/instances/app-agent/project.config.yml` (this instance)
3. Stack adapters from `requires:` (JIT — nuxt, vue, typescript, tailwind, mcp, supabase)
4. Sprint `.ptl` → tasks `.pd`

## Dev Commands

> Full runbook (blockers, env, troubleshooting): `intel/LOCAL-DEV-RUNBOOK.md`

⚠️ The `bun run dev:*` (turbo) scripts BOOT but return HTTP 500 on requests — they run the server
under Node, and the code imports `bun:sqlite` (Bun-only). Run each app directly under Bun instead:

```bash
cd /Users/denistka/Projects/app-agent-io/core
bun install

# One app per terminal, from its own dir, under the Bun runtime:
cd docs    && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3000 docs + MCP (verified 200)
cd control && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3001 control plane
cd demos/dashboard && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3010 (etc → 3011-3014)

bun run test             # vitest (322 tests)
bun run test:db          # bun:test SQLite suite (56 tests)
bun run feature:health   # feature knowledge coverage report
```

### Three startup blockers (see runbook §2)

1. **Secrets vault** — `bun run dev` tries to decrypt `encrypted.json`; we lack the password.
   Fix: gitignored `.env` stubs already created (SQLite datasource, no Supabase needed).
2. **Nuxt telemetry prompt** — interactive question stalls parallel dev.
   Fix: `NUXT_TELEMETRY_DISABLED=1`.
3. **`bun:sqlite` needs Bun runtime** (MAIN) — turbo launches `nuxt` under Node → 500
   `Received protocol 'bun:'`. Fix: `cd <app> && bun --bun nuxt dev` (runs under Bun end-to-end).
