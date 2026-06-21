# S04 Invariants — work-control

> **Binding:** All roles follow `APP-AGENT-PROTOCOL.md` (see `INSTANCE.ti`).

Extends `S03-INVARIANTS.md`. Frozen 2026-06-18.

## App

1. **Customer app path:** `apps/work-control/` only — no upstream `core/` product code changes except `core/docs/knowledge/work-control.md`.
2. **Port:** 3003 when started via `package.json` dev script.
3. **Feature slug:** `work-control` on all API routes via `defineFeatureHandler`.

## Totem integration

4. **Read-only:** Server reads `.ptl` from `totem/totem-v6/instances/app-agent/sprints/` — never writes `.ptl` automatically.
5. **Path:** auto `../../totem/totem-v6/instances/app-agent` from monorepo root, or `WORK_CONTROL_TOTEM_PATH`.
6. **Sync:** `POST /api/totem/sync` imports pending `.pd` tasks to SQLite — does not mark Totem tasks done.

## Data

7. **Local DB:** NuxtHub SQLite in `apps/work-control/.data/`.
8. **Task statuses:** `todo` | `in_progress` | `done` (matches taskboard-supabase).

## Design

9. **Glass UI:** `card-glass-subtle` / `card-glass-strong` in app CSS — ported concept from taskboard-supabase / totem-view S05.
10. **Realtime:** not in S04 — REST + drag-drop only.

## Dev

```bash
cd apps/work-control && bun run db:migrate
NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # not turbo — bun:sqlite
```

**NuxtHub:** requires `drizzle-orm` + `drizzle-kit` in `package.json`.
