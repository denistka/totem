# S04 Work Control Summary

**Closed:** 2026-06-21  
**Deliverable:** `apps/work-control` @ :3003

## Shipped

- Customer Nuxt app with Totem sprint reader + kanban board
- SQLite persistence (boards, tasks with optional `totemTaskId`)
- Glass UI from taskboard-supabase design language
- Feature slug `work-control` + knowledge file (`core/docs/knowledge/work-control.md`)
- Totem `S04-WorkControl.ptl`, `DEEP-WORK-CONTROL.md`, `S04-INVARIANTS.md`
- Organization layer branded **DAWWWB** (`organization/app/app.config.ts`, i18n `org.*`)

## Verify

```bash
cd app-agent-io/core/apps/work-control
bun run db:migrate
NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev
# http://localhost:3003 — Totem panel + kanban, Sync imports .pd tasks

curl -s http://localhost:3003/api/board | head
curl -s http://localhost:3003/api/status

# From monorepo root:
bun run feature:health   # work-control: 11 files
```

## Fixes during close

| Item | Resolution |
|------|------------|
| `sprint is not defined` in TotemSprintPanel | `const props = defineProps(...)` |
| NuxtHub Drizzle ERROR on dev start | `drizzle-kit` in `devDependencies` |
| Dev launcher starts all `apps/*` | Run work-control only from `apps/work-control/` (no root script change) |

## Upstream (optional)

- PR [#120](https://github.com/app-agent-io/core/pull/120) — gitignore `knowledge.db-wal` / `-shm`

## Next

**S05** — Work Control Orchestrator: chat → epics → board → tasks, MOCK agents, Nitro WS (`sprints/S05-Orchestrator.ptl`)
