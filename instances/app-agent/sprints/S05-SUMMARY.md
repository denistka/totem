# S05 — Work Control Orchestrator · Summary

**Status:** CLOSED (2026-06-21, T12 verified) · **Codebase:** `app-agent-io/core`
**Deliverable:** `apps/work-control` evolved from a Totem reader into a chat-driven AI work
orchestrator shipping the full spine **end-to-end with MOCK agents**:

```
chats → chat → epics → epic (board) → tasks → task
```

## What shipped (T01–T12)

| Task | Outcome |
|------|---------|
| T01 | `intel/DEEP-ORCHESTRATOR.md` — single source of truth; flags the LOCKED-vs-OPEN defect. |
| T02 | Agnostic agent taxonomy in `organization/app/app.config.ts` + `useAgentRoles()`. |
| T03 | 6 `wc_*` tables, Drizzle schema + migration `0001`, `scripts/db-setup.sql`, provider-agnostic `WorkControlRepo` (SQLite verified, Supabase target). |
| T04 | Chat surface — chats launcher + two-pane thread, `wc_chats`/`wc_messages`, stub echo reply. |
| T05 | Mock ROOT proposes epics from the whole chat; WS contract (`shared/ws.ts`) + broadcast hub; re-derive/reconcile by title. |
| T06 | Editable epics column — rename / edit / change lead role / delete / create; taxonomy badges; Accept; drag/re-ask. |
| T07 | **Accept → PLANNER decompose → writes `.ptl`+`.pd` at `gate: LOCKED`** into `sprints/`; board + tasks; never auto-OPEN. |
| T08 | Gate/run state machine — human `open-gate` flips `LOCKED→OPEN` (disk + DB); `run` returns **423** while LOCKED; `todo→in_progress→done` with timed activity. |
| T09 | Nitro WebSocket (`crossws`) `/_ws` with room subscribe + peer registry; `useRealtime()` client (backoff reconnect). |
| T10 | Live board (`BoardView`) + `ActivityTimeline`; `useBoard` patches from WS; gated Run + Open-gate. |
| T11 | Knowledge slug `work-control.md` updated; per-app `docs/orchestrator.md`; `feature:health` green. |
| T12 | Verification + this summary + sprint close. |

## Protocol embodiment (anti-auto-proceed, in-product)

- **Accept ≠ run.** Accepting only plans: LOCKED `.ptl`/`.pd` + a `todo` board.
- **Humans open gates.** `POST /api/boards/:id/open-gate` is the only path to OPEN.
- **Run is gated.** `POST /api/tasks/:id/run` → **423 Locked** while LOCKED.
- **Write scope.** App writes only under `sprints/`, ids `S<NN>-T<NN>-<Name>`, next free number.

## Verification

| Check | Result |
|-------|--------|
| `bun run test` (vitest, core) | ✅ 322 passed / 20 files |
| `bunx eslint .` (work-control) | ✅ clean |
| `nuxt typecheck` | ✅ 0 new errors from S05 (12 pre-existing S04 errors; baseline was 16, lowered to 12 by fixing 3 component import paths) |
| `feature:health` | ✅ `work-control` green, no broken `// SEE:` refs (51 annotated files) |
| Agent logic smoke (`scripts/smoke-agents.ts`) | ✅ PASS — "hungry + coffee" → `First eat, Make coffee`; PLANNER 4-task decompose; WS routing |
| Runtime e2e on `:3003` | ✅ PASS — chat → ROOT epics (`First eat`, `Make coffee`) → accept → `S06-FirstEat.ptl` + 4 `.pd` at LOCKED → 423 on run → open gate → task `done` → 6 activity events |
| `db:migrate` (work-control) | ✅ 2 migrations applied (sqlite) |
| WebSocket `/_ws` via turbo `bun run dev` | ⚠️ REST path verified; WS handshake did not complete through turbo proxy — use isolated `cd apps/work-control && bun --bun nuxt dev` for live second-tab WS |

## Key decisions & deviations (flagged)

1. **LOCKED, not OPEN.** The `S05-Orchestrator.ptl` Objective/DoD prose says write-back at
   `gate: OPEN`; that contradicts its own tasks (T07/T08) and invariant §3/§4. Implemented as
   **LOCKED → human opens → OPEN** (correct). The `.ptl` wording is a known doc defect.
2. **SQLite = verified provider; Supabase = target.** No `CORE_DATASOURCE_*` creds in this
   environment, so the Supabase repo is faithful (mirrors core's `provider-supabase`) but
   unverified at runtime. SQLite (`hub:db`) is the local-first default and the tested path.
3. **DB migration** — `bun run db:migrate` verified (sqlite, 2 migrations).
4. **`task` lead role** = derived per-task (`lead_role`), PM fallback in `defaultLeadByLayer`.

## Follow-ups (roadmap)

- **S06** — replace mock agents with real LLM (in-app Nitro + AI SDK; same `Agent` interface).
- **S07** — time-machine scrubber (history replay) for board + epic stream.
- Optionally fix the 12 pre-existing S04 typecheck errors (i18n `Locale`, drizzle
  `possibly undefined`, `H3Event` type import) — out of S05 scope.

## Generated artifacts note

Accepting an epic writes real `S<NN>-*.ptl` + `S<NN>-T<NN>-*.pd` files (at `gate: LOCKED`)
into this `sprints/` dir. **Verified T12:** accept of "First eat" generated `S06-FirstEat.ptl`
+ `S06-T01`…`T04` `.pd` files (user-generated sprint from orchestrator, distinct from roadmap S06 LLM sprint).
