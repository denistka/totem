# S07 Invariants — Totem Organization Layer

> **Binding:** All roles follow `APP-AGENT-PROTOCOL.md`. This sprint is **organization-level only**.

Frozen at plan time 2026-06-21. Ratified S07-T01 2026-06-21 (`gate: OPEN`, execution authorized).

## Scope boundary

1. **IN scope:** Move Totem **header** rules (project-agnostic) into app-agent **organization** docs layer.
2. **OUT of scope:** Per-app instances (`apps/todo/planning/`), work-control path refactor, TODO scaffold, planning-writer changes — planned in **later** totem sprints after S07 closes.
3. **Sprint artifacts:** All `.ptl`/`.pd` for S07 live in `totem/.../instances/app-agent/sprints/` (work-control reads/writes here until in-repo migration is its own sprint).

## Totem header → app-agent organization mapping

| Totem concept (header) | App-agent org layer | Project-agnostic? |
|------------------------|---------------------|-------------------|
| `index.ti` anti-auto-proceed axioms | `docs/content/2.company/totem-governance.md` | ✅ |
| Role separation (PLANNER ≠ PM) | same + `organization/README.md` § planning |
| Gate semantics (`LOCKED` / human `Go`) | same + link to work-control page |
| Documentation layer discipline | `docs/content/2.company/documentation-layers.md` | ✅ |
| Agent-role taxonomy | `organization/app/app.config.ts` `agents` block (already exists) | ✅ |
| MCP preflight ritual | org handbook + knowledge slug | ✅ |
| Instance / per-app planning | **document only** in org docs — implement in S08+ | — |

## What we do NOT do in S07

- Do not create `apps/todo/` or `apps/*/planning/` directories
- Do not change `totem-reader.ts` / `totem-writer.ts` default paths
- Do not modify closed sprints S01–S06

## Delivery

Org docs readable on `:3000` company section; MCP `explain("organization-planning")` returns layer map; `feature:health` green for new slug.
