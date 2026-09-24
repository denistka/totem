# Work Control — Architecture

> ⚠️ **STALE — frozen 2026-06-21 (S11). Do not plan from this file.**
>
> Two sprints have landed since: **S41** (the agent-honesty batch) and **S43** (the Claude-CLI
> overlay). What this document presents as current is wrong in at least these ways:
>
> - **Agent selection.** "mock when `AI_PROVIDER_*` incomplete; else LLM" (§Agents below) is the
>   exact silent-fallback shape recorded as defect **S41-F13** — a mock served while the product
>   claimed an LLM. `resolveAgentKind()` now asks the claude-cli question first.
> - **The completion backend** is the `claude` CLI on subscription OAuth (S43-T04), not an HTTP
>   provider. There is no OpenRouter path and no `402` to swallow.
> - **The UI** is chat + board only. The fleet / insight / dashboard views and the brickhouse were
>   deleted in **S43-T08**.
> - **"mock/LLM" epic proposals**: every generated sprint in the repo's history was
>   `planner.mock.ts` output, 39 for 39. See `apps/work-control/planning/CORPUS-PROVENANCE-EVIDENCE.md`.
>
> **Live sources of truth** — in the fork under `apps/work-control/docs/`:
> `work-control.md` (surface + API) · `build-loop.md` (daemon, queue, gate) ·
> `agent-runtime.md` (the build plane) · `chat-session-transport.md` (the completion plane) ·
> `time-switcher.md` (per-app git and restore).
>
> Kept for history only. Retired by **S43-T11**.

**App:** `app-agent-io/core/apps/work-control` · **Port:** 3003 · **Slug:** `work-control`  
**Updated:** 2026-06-21 (S11)

## Spine

```
chats → chat → epics → epic (board) → tasks → task
```

| Layer | Lead | Behavior |
|-------|------|----------|
| chat | ROOT | Whole-context epic proposals (mock/LLM) |
| epic | PM | User-owned; `targetApp` selects planning home |
| board | PLANNER | Accept → LOCKED `.ptl`/`.pd` + task board |
| task | `lead_role` | Run after human opens gate |

## Planning paths (S08+)

**Default:** `apps/{epic.targetApp}/planning/sprints/` (default `targetApp: work-control`)

Resolver: `server/utils/planning-path.ts`  
Writers/readers: `planning-writer.ts`, `planning-reader.ts` (`totem-*` re-exports)

| Priority | Source |
|----------|--------|
| 1 | `apps/{targetApp}/planning/` |
| 2 | `WORK_CONTROL_PLANNING_ROOT` env |
| 3 | `WORK_CONTROL_TOTEM_PATH` → external totem archive |
| 4 | Legacy walk to `../../totem/.../app-agent` |

Instance scaffolds: `apps/work-control/planning/`, `apps/todo/planning/`.

## Agents (S06)

`server/agents/factory.ts` — mock when `AI_PROVIDER_*` incomplete; else LLM.  
Kinds: ROOT, PLANNER, task agents. UI `AgentKindBadge`.

## Gates

- Accept writes **only** `gate: LOCKED`
- `POST /api/boards/:id/open-gate` — human Go
- `POST /api/tasks/:id/run` → **423** while LOCKED

## History replay (S11)

- `GET /api/boards/:id/history` — activity snapshots
- `HistoryScrubber.vue` on board — Live/Replay mode
- WS disconnected during replay (no live mutations)

## Realtime & persistence

- WS: Nitro `crossws` at `/_ws` — `shared/ws.ts` contract
- DB: `wc_*` tables — SQLite local / Supabase via `CORE_DATASOURCE_*`

## Dev

```bash
cd apps/work-control
cp .env.example .env    # NUXT_SESSION_PASSWORD
bun run db:migrate
NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3003
# or from root: bun run dev:work-control
```

MCP: `explain("work-control")`, `explain("in-repo-planning")` on :3000.

## Docs (in-repo)

| Doc | Path |
|-----|------|
| Per-app rules | `apps/work-control/docs/orchestrator.md` |
| History replay | `apps/work-control/docs/history-replay.md` |
| Knowledge | `core/docs/knowledge/work-control.md` |

## Legacy (S04)

- `TotemSprintPanel` — reads planning dir for current sprint
- External totem `sprints/` — historical archive S01–S11 meta plans

## Next

S12: multi-user presence — `intel/SPRINT-ROADMAP.md`
