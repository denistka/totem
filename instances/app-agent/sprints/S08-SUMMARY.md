# S08 — In-Repo Instance Planning · Summary

**Status:** CLOSED (2026-06-21, T10 verified) · **Codebase:** `app-agent-io/core`
**Deliverable:** Accept writes to `apps/work-control/planning/sprints/` by default; `targetApp` on epics; legacy totem fallback preserved.

## What shipped (T01–T10)

| Task | Outcome |
|------|---------|
| T01 | `S08-INVARIANTS.md` ratified — path table, work-control dogfood, S09 exclusions |
| T02 | Knowledge slug `in-repo-planning.md` |
| T03 | `planning-path.ts` + unit tests |
| T04 | `wc_epics.target_app` migration + API/UI + ROOT proposals |
| T05 | `apps/work-control/planning/` scaffold (INSTANCE, BRIEF, PROTOCOL, templates) |
| T06 | `planning-reader.ts` / `planning-writer.ts`; totem-* re-exports |
| T07 | Fallback chain: in-repo → `WORK_CONTROL_PLANNING_ROOT` → `WORK_CONTROL_TOTEM_PATH` |
| T08 | Docs sync: orchestrator, work-control slug, documentation-layers, company work-control |
| T09 | Smoke steps documented (`S08-SMOKE.md`) |
| T10 | This summary + `TOTEM_INDEX.ti` → S08 CLOSED |

## Scope guard

- **No** `apps/todo/` app code
- External totem S01–S08 `.ptl` in `totem/.../sprints/` unchanged (archive)
- Gates unchanged: Accept writes `gate: OPEN`; human opens gate

## Verify

| Check | Result |
|-------|--------|
| `bun run test` | ✅ 334 passed |
| `bun run feature:health` | ✅ 100% referenced slugs |
| `bun run db:migrate` | ✅ 0002_epic_target_app applied |
| In-repo resolver | ✅ prefers `apps/work-control/planning/sprints/` |
| Legacy fallback test | ✅ via `WORK_CONTROL_TOTEM_PATH` |

## MCP verify log

MCP tools used during close where applicable; full interactive Accept smoke requires manual run on `:3003` (see `S08-SMOKE.md`).

## Backlog (NOT S08)

- **S09:** `apps/todo` scaffold (:3004) + dogfood `targetApp: todo`
- **S10:** Time-machine scrubber
