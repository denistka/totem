# S09 Invariants — TODO App Scaffold

> Extends `S08-INVARIANTS.md`. Requires S08 in-repo paths shipped.

Frozen at plan time 2026-06-21. Ratified — execution authorized 2026-06-21.

## Scope

1. **IN:** `apps/todo` Nuxt app on port **3004**; `apps/todo/planning/` instance; dev scripts; knowledge slug.
2. **IN:** Dogfood Accept with `targetApp: todo` → writes LOCKED plan to `apps/todo/planning/sprints/`.
3. **OUT:** Task list CRUD features (S10); time-machine (S11).

## Ports

| App | Port |
|-----|------|
| todo | **3004** |

## Dogfood contract

S09 smoke Accept must produce a LOCKED **S10** seed plan (e.g. `S10-TodoMvp.ptl` stub or full .ptl header) in `apps/todo/planning/sprints/` — proving cross-app `targetApp` works.

## Code rules

- Code only under `apps/todo/` + allowed knowledge slug `todo`
- Boot from monorepo root: `bun run dev:todo` (after T05)
- No feature UI beyond placeholder — MVP is S10
