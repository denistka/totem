# app-agent-io — Project Brief

## What it is

**App Agent** is a turnkey Nuxt 4 monorepo with an embedded AI development agent. Customers fork it, customize branding in `/organization`, build apps in `/apps`, and use MCP + feature-knowledge so AI assistants understand the codebase without pre-loading 1,300+ lines of ADRs.

**Tagline:** "Describing your product makes it exist."

**Repo:** [github.com/app-agent-io/core](https://github.com/app-agent-io/core)

---

## Core domains

| Domain | Summary |
| ------ | ------- |
| **Layer cascade** | core → organization → apps/demos/docs/control |
| **Feature knowledge** | Slug-based docs in `core/docs/knowledge/`, `// SEE:` annotations, `defineFeature*()` wrappers |
| **MCP (docs app)** | 12 tools at `http://localhost:3000/mcp` — explain, record, census, list-apps, get-file, etc. |
| **Control plane** | `core/control` — features, logs, i18n, agent chat UI (port 3001) |
| **Runtime config** | ConfigProvider abstraction, Supabase/SQLite, Settings API, `$meta.lock` |
| **Demos** | dashboard, saas, landing, chat, characters — reference patterns on ports 3010–3014 |
| **Customer apps** | `/apps/*` — currently `chat` on port 3002 |

---

## Architecture invariants (do not break)

1. **Do not modify `/core/` upstream layer** in customer forks — extend via organization + apps.
2. **Feature slug rule** — no ambient logging; use `defineFeatureHandler/Plugin/Composable` or `getFeature()`.
3. **Knowledge pull-model** — agents call MCP `explain(slug)` instead of loading all ADRs.
4. **Server middleware** — all layers run; no override for `server/middleware/`.
5. **Customer code isolation** — `/apps/` never conflicts with upstream on merge.
6. **Ports** — docs 3000, control 3001, apps 3002+, demos 3010–3014.

---

## How to load this Totem instance

```
read totem/totem-v6/index.ti, load instance app-agent-io, read intel/TOTEM_INDEX.ti
```

For a task: load PM and execute `sprints/S01-T*.pd` (after gate OPEN).

---

## Investigation status

Sprint **S01** (Deep Investigation) and **S02** (Chat Bootstrap) completed 2026-06-18.  
Chat setup: `app-agent-io/core/apps/chat/SETUP.md` — see `intel/S02-CHAT-SMOKE.md`.
