# S06 Invariants — App Agent Execution Loop

> **Binding:** All roles follow `APP-AGENT-PROTOCOL.md` and load `INSTANCE.ti` before acting.

Extends `S05-INVARIANTS.md`. **Supersedes S05 §11 (mock-only agents)** for runtime behavior.
Frozen at plan time 2026-06-21. (gate: LOCKED until human "Go".)

## App Agent Execution Contract

1. **Every code `.pd`** MUST include YAML `protocol: ../APP-AGENT-PROTOCOL.md`, `requires: [mcp/MCP.ti, ...]`,
   and body sections from `templates/PD-APP-AGENT-BLOCK.md` (preflight → implementation → close).
2. **Every new `.ptl`** MUST include `protocol`, `invariants`, `requires` per `templates/PTL-PROTOCOL-HEADER.md`.
3. **MCP preflight** (protocol §2) before planning or coding; if :3000 down → WARN + `[static fallback]` only;
   cannot close verify tasks without documenting MCP gap in sprint summary.
4. **Doc layers** (protocol §3) — do not conflate:
   - Platform patterns → `core/docs/knowledge/{slug}.md`
   - Per-app rules → `apps/<app>/docs/*.md`
   - Human handbook → `docs/content/` (DAWWWB)
   - Sprint architecture → `totem/.../intel/`
   Organization layer does **not** auto-sync to docs or knowledge.
5. **Generated plans** — `totem-writer.ts` MUST inject protocol + requires + PD block into Accept-written
   `.pd` files (T03). Until shipped, PM adds block manually when opening a generated gate.
6. **Close checklist** (protocol §7) on sprint last task: `feature:health`, knowledge/docs sync,
   `TOTEM_INDEX.ti` + `S06-SUMMARY.md`, MCP gap noted if any.

## LLM agents (supersedes S05 §11)

7. **Same interface.** ROOT / PLANNER / task agents implement `Agent` (`server/agents/types.ts`).
   Swap mocks for LLM behind factory; `kind: 'mock' | 'llm'` persisted on `wc_agents`.
8. **Env gate.** When `AI_PROVIDER_*` incomplete, fall back to mock agents silently (same as chat app).
   UI shows mock/llm badge; no crash on missing key.
9. **PLANNER LLM** still writes `.ptl`/`.pd` via `totem-writer` at **`gate: LOCKED` only** — never auto-OPEN.
10. **Task LLM** respects board gate: `run` → **423** while LOCKED (S05 §4 unchanged).

## Unchanged from S05

11. **Spine:** `chats → chat → epics → epic (board) → tasks → task` — gates, WS, write scope, taxonomy.
12. **App path:** `apps/work-control/` only. **Port:** 3003. **Slug:** `work-control`.
    Allowed upstream change: `core/docs/knowledge/work-control.md` only.
13. **Smoke artifact:** `S05-SMOKE-FirstEat.*` is historical proof from S05-T12 — not product backlog.

## Dev

```bash
cd apps/work-control && bun run db:migrate
NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3003
cd docs && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev   # :3000 MCP preflight
```
