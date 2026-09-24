# App Agent — Project Brief

> **Mandatory:** `INSTANCE.ti` + `APP-AGENT-PROTOCOL.md` + `intel/TOTEM_INDEX.ti` — every role, every session.  
> Source of truth for code: `app-agent-io/core/AGENTS.md`.

## What it is

**App Agent** is a forkable **Nuxt 4 layered monorepo** with an embedded AI development agent.
Thesis: *"The AI isn't smarter. The codebase is smarter."* — conventions + MCP so models build without drifting.

## Documentation layers (S07+)

| Layer | Path | MCP |
|-------|------|-----|
| Organization handbook | `docs/content/2.company/` | `list-pages`, `get-page` |
| Feature knowledge | `core/docs/knowledge/{slug}.md` | `explain(slug)` |
| Per-app rules | `apps/<app>/docs/` | `get-app-structure` |
| Instance planning | `apps/<app>/planning/sprints/` | work-control Accept |
| Meta planning (PLANNER) | `totem/.../instances/app-agent/sprints/` | archive S01–S11 |

Key slugs: `organization-planning`, `in-repo-planning`, `work-control`, `todo`.

## Core mental model — three-layer cascade

```
apps/*        extends   →  YOUR product code
organization/ extends   →  DAWWWB brand + agent taxonomy
core/         (upstream) →  shared platform — DO NOT MODIFY
```

## Apps in the monorepo

| App | Port | Role |
| --- | ---- | ---- |
| docs | 3000 | documentation + MCP (12 tools) |
| control | 3001 | control plane |
| apps/chat | 3002 | customer AI chat |
| apps/work-control | 3003 | chat → epic → board → task orchestrator |
| apps/todo | 3004 | dogfood app — task list MVP (S10) |
| demos | 3010–3014 | reference implementations |

## Work-control loop (S05–S11)

```
chat → ROOT proposes epics → Accept (PLANNER) → LOCKED .ptl/.pd
  → human open-gate → run task (mock/LLM) → done + WS activity
```

- **Default write path (S08):** `apps/{targetApp}/planning/sprints/` (`targetApp` on epic)
- **History replay (S11):** board Live/Replay + `HistoryScrubber`
- Gates: Accept ≠ run; `423` while LOCKED

## Current state (2026-06-21 — S11 closed)

| Sprint | Deliverable |
|--------|-------------|
| S07 | Org handbook + `organization-planning` slug |
| S08 | `planning-path.ts`, in-repo planning, `targetApp` |
| S09 | `apps/todo` scaffold + planning instance |
| S10 | TODO MVP CRUD |
| S11 | Board history replay |

**Next:** S12 multi-user presence — `intel/SPRINT-ROADMAP.md`

```bash
cd app-agent-io/core && bun install
bun run dev:docs          # :3000 MCP
bun run dev:work-control  # :3003 (after db:migrate)
bun run dev:todo          # :3004
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

Active invariants: `S11-INVARIANTS.md` · Last closed: `sprints/S11-SUMMARY.md`
