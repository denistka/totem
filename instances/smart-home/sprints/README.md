# Sprints (MRPP v3.0 Protocol)

Protocol-compliant sprint structure. See `totem/core/PROTOCOL_SCHEMA.md`, `ITERATION_FLOW.md`.

## File Extensions

| Extension | Role       | Scope  |
| --------- | ---------- | ------ |
| `.pi`     | ROOT       | Hub, navigation |
| `.ptl`    | TEAM_LEAD  | Sprint orchestration |
| `.pd`     | DEVELOPER  | Task execution |
| `.pqa`    | QA         | Testing, verification, quality gates |
| `.pdo`    | DEVOPS     | Build, env, infrastructure |

## Usage

1. **Hub**: Open `SPRINTS.pi` — overview, sprint order.
2. **Sprint lead**: Open `03/S03.ptl` or `04/S04.ptl`.
3. **Phases**: plan → design → develop → verify → close.
4. **Tasks**: Run `.pd` files in dispatch order.

## Sprints

| Sprint | Lead    | Objective                    |
| ------ | ------- | ---------------------------- |
| S03    | S03.ptl | eWeLink Refinement           |
| S04    | S04.ptl | Tuya Integration             |

## Context

- **Intel**: `../intel/` (TOTEM_INDEX, TOTEM_BACKLOG, TOTEM_SPRINTS)
- **Role briefs**: `../intel/sprints/S03/`, `../intel/sprints/S04/`
- **Code**: `apps/` (workspace root)
