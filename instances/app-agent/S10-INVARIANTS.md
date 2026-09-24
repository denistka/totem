# S10 Invariants — TODO MVP

> Extends `S09-INVARIANTS.md`. All feature work via work-control gated tasks only.

Frozen at plan time 2026-06-21. Ratified — execution authorized 2026-06-21.

## Scope

1. **IN:** Task list CRUD in `apps/todo` — add, complete, delete; SQLite persistence (NuxtHub).
2. **IN:** Execute tasks from `apps/todo/planning/sprints/S10-*.pd` (Accept-generated or ratified).
3. **OUT:** work-control features; multi-user; time-machine.

## Anti-ad-hoc rule

No direct coding without an OPEN `.pd` in `apps/todo/planning/sprints/` + human `Go`.

## Slug

`todo` — all API routes use `defineFeatureHandler('todo', ...)`.
