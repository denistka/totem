# S08 Invariants — In-Repo Instance Planning

> **Binding:** `APP-AGENT-PROTOCOL.md` + `organization-planning` knowledge slug.
> Extends `S07-INVARIANTS.md`. Supersedes external-totem as **default** write target.

Frozen at plan time 2026-06-21. Ratified S08-T01 2026-06-21 (`gate: OPEN`, execution authorized).

## Scope

1. **IN:** work-control reads/writes `apps/<targetApp>/planning/sprints/` by default.
2. **IN:** `targetApp` on epics; planning path resolver; docs/knowledge sync.
3. **OUT:** `apps/todo` Nuxt app (S09); full feature CRUD (S09+).
4. **OUT:** Deleting external totem tree — remains read-only archive.

## Path resolution (frozen)

| Priority | Source | Path |
|----------|--------|------|
| 1 | Per-epic `targetApp` | `apps/{targetApp}/planning/` |
| 2 | Env `WORK_CONTROL_PLANNING_ROOT` | absolute override (tests) |
| 3 | Legacy env `WORK_CONTROL_TOTEM_PATH` | external totem instance (backward compat) |
| 4 | Legacy default | `../../totem/totem-v6/instances/app-agent` if exists |

After S08 ships, **default Accept target** = `work-control` → writes `apps/work-control/planning/sprints/`.

## Instance directory contract

Each `apps/<app>/planning/` MUST contain:

```
planning/
├── INSTANCE.md          # load gate (optional S08-T03 scaffold)
├── PROTOCOL.md          # symlink or copy ref to org handbook + app rules
├── BRIEF.md             # app brief (stub OK)
├── S<NN>-INVARIANTS.md  # when sprint frozen
├── templates/           # PTL + PD blocks (or read from work-control writer fallback)
└── sprints/             # .ptl / .pd — ONLY write target for Accept
```

## Gates & MCP (unchanged)

- Generated plans: always `gate: LOCKED`
- Every PM task: MCP preflight + `explain` + verify tools per S07 pattern
- `bun run feature:health` on touched slugs

## First dogfood target

S08 smoke uses **`targetApp: work-control`** — orchestrator plans itself in-repo.
S09 creates `apps/todo` + dogfood on todo.

## Port table (unchanged from S07)

todo :3004 reserved for S09 — do not scaffold app code in S08.
