# S05 Invariants — Work Control Orchestrator

Extends `S03-INVARIANTS.md`. **Supersedes `S04-INVARIANTS.md` §4 (read-only Totem).**
Frozen at plan time 2026-06-21. (gate: LOCKED until human "Go".)

## Spine (the product shape)

1. **Hierarchy:** `chats → chat → epics → epic (board) → tasks → task`. Exactly one
   *lead* agent role per layer; tasks may add *additional* roles (lead + helpers).
2. **Epics are proposals.** ROOT derives them from the **whole chat context + project
   context**, not the last message. User fully owns them: rename / edit / delete /
   create / accept / drag-back-to-chat.

## Protocol embodiment (the reason write-back was chosen)

3. **Accept ≠ run.** Accepting an epic makes PLANNER decompose it and **write real
   `.ptl` + `.pd` files at `gate: LOCKED`** into `totem-v6/instances/app-agent/sprints/`.
   This is PLANNER's only output (no app code), consistent with `index.ti`.
4. **Humans open gates.** A (mock or real) agent may execute a task ONLY after a human
   flips that plan's `gate: LOCKED → OPEN` (a UI "Open gate" action == "Go"). The app
   MUST NOT auto-open a gate. This is the anti-auto-proceed axiom, in-product.
5. **Write target is scoped.** App writes ONLY under the instance `sprints/` dir, never
   elsewhere; generated ids follow `S<NN>-T<NN>-<Name>` and never collide with existing.

## Agent roles (agnostic taxonomy)

6. **Home = organization layer.** Canonical role enum lives in
   `organization/app/app.config.ts` under `agents` so it cascades to every app.
   Roles: `PLANNER`, `PM`, `ARCHITECT`, `QA`, `TEST_AUTHOR`, `DEVOPS`, `ROOT`, `OPTIMIZER`.
7. **Per-app rules = work-control docs.** Instance-specific behavior (which role leads
   each layer, how mock agents act) lives in `apps/work-control` docs + the
   `work-control` knowledge slug — NOT in the organization layer.

## Realtime & persistence

8. **Transport = Nitro WebSocket (crossws).** Server broadcasts a typed event contract
   (`epic.proposed|updated|accepted`, `board.created`, `gate.opened`, `task.created|moved`,
   `agent.activity`, `presence.sync`). No Supabase realtime. Writes still go via REST.
9. **Persistence = Supabase** (multi-user) reached via the ADR-005 datasource pattern
   (`CORE_DATASOURCE_*`). Tables: `wc_chats, wc_messages, wc_epics, wc_tasks, wc_agents,
   wc_activity`. A `bun:sqlite` dev fallback is allowed but Supabase is the S05 target.
10. **Task status flow:** `todo → in_progress → done`. Starting a task sets `in_progress`;
    completion sets `done`. (No "back to todo" on completion.)

## Agents this sprint

11. **Mock only.** ROOT/PLANNER/task agents are deterministic stubs (no LLM, no
    `AI_PROVIDER_KEY`). They must implement the same interface the real agents will in S06.

## Unchanged from S04

12. **App path:** `apps/work-control/` only. **Port:** 3003. **Feature slug:** `work-control`
    on all API routes via `defineFeatureHandler`. No upstream `core/` product changes except
    `core/docs/knowledge/work-control.md`.

## Dev

```bash
cd apps/work-control && bun run db:migrate   # or Supabase scripts/db-setup
NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev # :3003
```
