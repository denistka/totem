# S06 — App Agent Execution Loop · Summary

**Status:** CLOSED (2026-06-21, T11 verified) · **Codebase:** `app-agent-io/core`
**Deliverable:** Totem × app-agent × work-control loop closed — protocol injection, docs sync,
LLM agents with mock fallback, env gate + UI badges.

## What shipped (T01–T11)

| Task | Outcome |
|------|---------|
| T01 | `S06-INVARIANTS.md` ratified; linked from sprint `.ptl`. |
| T02 | Smoke artifact rehomed to `S05-SMOKE-FirstEat.*` (historical CLOSED proof). |
| T03 | `totem-writer.ts` injects protocol, requires, PD block, PTL header fields. |
| T04 | DAWWWB handbook `docs/content/2.company/3.work-control.md` + index link. |
| T05 | Knowledge slug + orchestrator docs synced with protocol layers + LLM roadmap. |
| T06 | `apps/work-control/docs/llm-agents.md` — architecture for T07–T09. |
| T07 | `llm/root.llm.ts` — `proposeEpics` via `generateObject`; mock fallback. |
| T08 | `llm/planner.llm.ts` — structured TaskPlan[]; Accept still writes OPEN plans. |
| T09 | `llm/task.llm.ts` — activity steps via emit callback; gate semantics unchanged. |
| T10 | `factory.ts` — mock/llm selection; `wc_agents.kind` persisted; `AgentKindBadge` UI. |
| T11 | Verification + this summary + `TOTEM_INDEX.ti` → S06 CLOSED. |

## Protocol embodiment (unchanged gates)

- **Accept ≠ run.** Accept writes OPEN `.ptl`/`.pd` + todo board.
- **Humans open gates.** Only `POST /api/boards/:id/open-gate` flips OPEN.
- **Run is gated.** `POST /api/tasks/:id/run` → **423** while OPEN.
- **Generated plans** carry `APP-AGENT-PROTOCOL.md` fields (T03).

## LLM agents (S06 §7–10)

- Same `Agent` interface; factory selects mock vs llm via `validateIntegrations()` (env parity in scripts).
- Incomplete `AI_PROVIDER_*` → mock silently; boot succeeds.
- UI shows mock/llm badge on epics (ROOT), board (PLANNER), tasks.

## Verification

| Check | Result |
|-------|--------|
| `bun run test` (vitest) | ✅ 328 passed / 22 files |
| `bun run feature:health` | ✅ 100% slug coverage |
| `bun run apps/work-control/scripts/smoke-agents.ts` | ✅ SMOKE PASS |
| `eslint` (work-control) | ✅ clean |
| MCP preflight `:3000` | ✅ 200 / 406 at close |
| Org page `:3000/company/work-control` | ✅ authored (manual render check) |

## MCP note

Docs MCP was reachable during close. No degraded-mode gap.

## Next (roadmap — not in S06)

- S07: Time-machine scrubber
- S08: Multi-user presence
- S09: Task-level multi-agent handoff
- S10: OPTIMIZER + `feature:health` CI gate
