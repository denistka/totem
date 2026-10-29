# App Agent — Project Brief

> **Mandatory:** `INSTANCE.ti` + `APP-AGENT-PROTOCOL.md` + `intel/TOTEM_INDEX.ti` — every role, every session.  
> Source of truth for code: `app-agent-io/core/AGENTS.md` (in the fork: `DAWWWB-app-agent-dev`).

## What it is

**App Agent** is a forkable **Nuxt 4 layered monorepo** with an embedded AI development agent.
Thesis: *"The AI isn't smarter. The codebase is smarter."* — conventions + MCP so models build without drifting.

## Documentation layers (S07+)

| Layer | Path | MCP |
|-------|------|-----|
| Organization handbook | `docs/content/2.company/` | `list-pages`, `get-page` |
| Feature knowledge | `core/docs/knowledge/{slug}.md` | `explain(slug)` |
| Per-app rules | `apps/<app>/docs/` | `get-app-structure` |
| Instance planning | `apps/<app>/planning/` (+ `/sprints`, `/evidence`, `/decisions`) | work-control Accept |
| Meta planning (PLANNER archive) | `totem/.../instances/app-agent/sprints/` | history S01–S13 only |

Key slugs: `organization-planning`, `in-repo-planning`, `work-control`, `todo`.

## Core mental model — three-layer cascade

```
apps/*        extends   →  YOUR product code
organization/ extends   →  DAWWWB brand + agent taxonomy
core/         (upstream) →  shared platform — DO NOT MODIFY
```

## Stack

Nuxt 4 / Vue 3 / TypeScript · Bun 1.2.15 · Turborepo · Nuxt UI · Nitro · Supabase + `bun:sqlite` · vitest.

## Ports

| Surface | Port | Role |
| --- | ---- | ---- |
| docs | 3000 | documentation + **MCP server** (`.mcp.json` → `localhost:3000/mcp`) |
| control | 3001 | control plane |
| customer apps | **3002–3099** | allocator window (`nextAppPort`); reserved: 3000, 3001, 3010–3014 |
| apps/work-control | 3003 | chat → epics → board → human gate → background runner |
| demos | 3010–3014 | reference implementations |

## Work-control loop (current)

```
chat → ROOT proposes epics → Accept → board (LOCKED .ptl/.pd)
  → human open-gate → background runner (scaffold → build-verify → boot-verify)
  → app lands in apps/ and boots on a free port in 3002–3099
```

- **Build plane:** `claude-cli` (default, subscription OAuth) or OpenRouter (legacy / deploy-only). Not the mock.
- **Planning home (authoritative since S36):** `apps/work-control/planning/`
- **Default Accept write path:** `apps/{targetApp}/planning/sprints/`
- Gates: Accept ≠ run; `423` while LOCKED; human opens gate — never simulated

## Current state (2026-10-01 — post-S44)

| Sprint | Status |
|--------|--------|
| S36 | CLOSED PARTIAL — closed-loop substrate |
| S41 | CLOSED — live-run half answered by S43 |
| S43 | CLOSED 2026-08-24 — loop proven live (`claude-cli` → `apps/app2` on :3007) |
| S44 | CLOSED 2026-08-25 — Perfect Upstream PR prepared; **`pushed: false`** |

**Live checkout:** `DAWWWB-app-agent-dev` on `write-docs-in-auto`. Planning + evidence under `apps/work-control/planning/`.

**Next:** see `intel/TOTEM_INDEX.ti` post-S44 open items (2026-10-01) and `intel/SPRINT-ROADMAP.md`.

```bash
cd app-agent-io/DAWWWB-app-agent-dev && bun install
bun run dev:docs          # :3000 docs + MCP
bun run dev:work-control  # :3003 (after db:migrate)
# runner daemon separately — see apps/work-control/docs/build-loop.md
```

## Constraints (from AGENTS.md)

- Customer code in `apps/*` and `organization/` only
- `bun --bun nuxt dev` per app (not turbo for bun:sqlite)
- `bun run test` (vitest) — NOT bare `bun test`
- NEVER assume gate approval; PLANNER plans, PM executes

## Totem instance

**Path:** `totem/totem-v6/instances/app-agent/`

```text
index.ti → project.config.yml → INSTANCE.ti → APP-AGENT-PROTOCOL.md → TOTEM_INDEX.ti
```

Active invariants: `apps/work-control/planning/S43-INVARIANTS.md` · Last closed meta: S44 (`S44-SUMMARY.md`)
