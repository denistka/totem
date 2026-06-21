# Work Control — Architecture

**App:** `app-agent-io/core/apps/work-control` · **Port:** 3003 · **Slug:** `work-control`  
**Organization:** DAWWWB (`organization/app/app.config.ts` — cascades to all apps)

## Layers (S05 orchestrator)

```
chats → chat → epics → epic (board) → tasks → task

Totem write-back: accept epic → PLANNER writes S<NN>-*.ptl + .pd at gate: LOCKED
Human open-gate → LOCKED→OPEN on disk → run task (mock agent, todo→in_progress→done)
Realtime: Nitro WebSocket /_ws (crossws) — chat:<id> / board:<id> rooms
Persistence: wc_* tables (SQLite local / Supabase target via CORE_DATASOURCE_*)
```

```
Chat UI + EpicsColumn  ──REST──►  API (defineFeatureHandler)
       │                              │
       │                              ├── mock ROOT (propose epics)
       │                              ├── mock PLANNER (decompose + totem-writer)
       │                              └── mock task agent (run)
       │
       └── useRealtime() ◄── WS ── broadcast hub (shared/ws.ts contract)
```

**App-agent cascade:** `apps/work-control` → `organization/` (DAWWWB brand + agent taxonomy) → `core/` (platform).

## Agent roles

Canonical enum in `organization/app/app.config.ts` (`agents` block). Per-app rules in
`apps/work-control/docs/orchestrator.md` and knowledge slug `work-control`.

| Layer | Lead | S05 behavior |
|-------|------|--------------|
| chat | ROOT | Re-derives epics from whole conversation |
| epic | PM | User-owned proposals (edit/accept) |
| board | PLANNER | Accept → LOCKED `.ptl`/`.pd` + task board |
| task | per-task `lead_role` | Runs only after human opens gate |

## Totem path resolution

From monorepo root (`turbo.json`):
`../../totem/totem-v6/instances/app-agent`

Override: `WORK_CONTROL_TOTEM_PATH`

Write scope: `<instance>/sprints/` only. Generated ids use next free `S<NN>`.

## Dev

```bash
cd apps/work-control
cp .env.example .env          # NUXT_SESSION_PASSWORD (32+ chars)
bun run db:migrate
NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3003 — preferred for WS
```

**Deps:** `drizzle-orm` + `drizzle-kit` (NuxtHub requires both).

**Do not use** `bun run dev` / turbo for WS verification — REST works; `/_ws` may not handshake through turbo proxy. Use isolated `bun --bun nuxt dev` per app.

Optional: `cd docs && bun --bun nuxt dev` for MCP `explain work-control` on :3000.

## Smoke (S05 closed — T12 verified 2026-06-21)

```bash
# Logic (no server):
bun run apps/work-control/scripts/smoke-agents.ts

# Runtime API path:
# POST /api/chats → POST .../messages ("hungry + coffee") → ROOT epics
# POST /api/epics/:id/accept → LOCKED .ptl/.pd + board
# POST /api/tasks/:id/run → 423 while LOCKED
# POST /api/boards/:id/open-gate → POST .../run → status done
# GET /api/boards/:id → activity timeline
```

- `bun run test` → 322 pass
- `bunx eslint .` (work-control) → clean
- `bun run feature:health` → work-control green

## S04 legacy (still available)

- `TotemSprintPanel` reads instance `.ptl`/`.pd` (read path)
- `POST /api/totem/sync` imports pending `.pd` tasks into kanban

## Next (roadmap — not planned)

- **S06 (Totem):** Replace mock agents with real LLM (in-app Nitro + AI SDK)
- **S07:** Time-machine scrubber
- **S08:** Multi-user presence
- Note: `S06-FirstEat.ptl` in `sprints/` is a **user-generated** plan from Accept smoke, not the roadmap S06.
