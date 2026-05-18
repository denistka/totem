# Nexus · Sprints

Sprints materialise the implementation plan from `../03_IMPLEMENTATION_PLAN.md`
into concrete, trackable units. Each `.md` file is a sprint definition that can
later be exported as Totem V6 `.ptl`/`.pd` once the protocol engine ships.

## Naming

- `S00..S09` — Phase 0 (Foundation), Phase 1 (Core MVP)
- `S10..S19` — Phase 2 (Agent layer) + Phase 3 (Mass-market hooks)
- `S20+`     — later phases

## Source of truth

Sprints below are derived from `../03_IMPLEMENTATION_PLAN.md` sections
"Phase X — Deliverables" and "Success criteria". When the plan changes,
update the corresponding sprint file and re-derive task lists.

## Status legend

| Glyph | Meaning |
|-------|---------|
| `[ ]` | not started |
| `[~]` | in progress |
| `[x]` | done |
| `[!]` | blocked |

## Index

| ID | Phase | Title | Window | Status |
|----|-------|-------|--------|--------|
| [S01](./S01-foundation-protocol.md) | P0 | Foundation · protocol + schema | M1–M2 | planned |
| [S02](./S02-foundation-db-auth.md)  | P0 | Foundation · DB + auth scaffold | M1–M2 | planned |
| [S03](./S03-chat-shell.md)          | P1 | Chat shell · glassmorphic UI    | M3    | **in progress** (prototype shipped) |
| [S04](./S04-ai-router.md)           | P1 | AI intent router                | M3–M4 | planned |
| [S05](./S05-dag-kanban.md)          | P1 | Visual DAG + kanban             | M4    | partial (structure layer mock shipped) |
| [S06](./S06-realtime-gates.md)      | P1 | Real-time backbone + gates      | M4–M5 | planned |
| [S07](./S07-mcp-server.md)          | P2 | MCP server (resources first)    | M5–M6 | planned |
| [S08](./S08-agent-presence.md)      | P2 | Agent presence + thought log    | M5–M6 | planned |
| [S09](./S09-handoff-engine.md)      | P2 | Handoff with JIT context        | M6    | planned |
| [S10](./S10-onboarding.md)          | P3 | Zero-friction onboarding        | M6–M7 | planned |
| [S11](./S11-memory-vector.md)       | P3 | Cross-project memory (pgvector) | M7–M8 | planned |
| [S12](./S12-coach-mode.md)          | P3 | AI Coach mode                   | M8    | planned |
| [S13](./S13-bug-capture-ext.md)     | P3 | Chrome bug-capture extension    | M8–M9 | planned |
| [S14](./S14-pwa-gates.md)           | P3 | Mobile PWA + push for gates     | M9    | planned |
