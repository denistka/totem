# S13 Invariants — Multi-Agent Task Handoff

> Ratified 2026-06-21. Extends S12 presence.

## Scope

A single `wc_tasks` row may have `lead_role` + optional `helper_roles[]`.
Agents run **sequentially** on one task — lead first, then each helper in order.
Each agent appears in board presence during their turn (S12 §5).

## Invariants

### §1 — Sequential only
No parallel agents on the same task. Helpers run after lead completes their steps.

### §2 — Handoff events
Every role transition emits `agent.activity` with event `agent.handoff` and payload `{ from, to }`.

### §3 — Presence per turn
Presence member id: `agent:{taskId}:{role}`. Only one agent presence entry per task at a time.

### §4 — Schema
`helper_roles` stored as JSON array of `AgentRole` strings. Empty/null = lead-only task.

### §5 — awareness-no-lock (unchanged)
Handoff does not lock the task; last-write-wins still applies (S12 §3).

## OUT

- Parallel multi-agent (future)
- Cross-task handoff (future)
