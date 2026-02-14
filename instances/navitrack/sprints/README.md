# Epic 1 — To-Do Sprints (Prompts)

**Epic 1 (E-01-TO-DO)**: Refactoring (S34–S37), release (S27), optional (S20, S21), backlog (S38–S40).

**Order**: S34 → S35 → S36 → S37 → S38 → S39 → S40. S20, S21, S27 can run in parallel when chosen.

**Prompt format**: Sprint lead = `.ptl` (TEAM_LEAD). Task = `.pd` (DEVELOPER). Hub = `.pi` (ROOT). See `totem/core/PROTOCOL_SCHEMA.md`.

---

## How to use

- **Hub**: Open `EPIC1-TO-DO.pi` — overview of Epic 1 and which sprint to run next.
- **Sprint lead**: Open `NN/S34.ptl` (or S35.ptl, etc.) — objective, phases, task dispatch.
- **Task**: Open `NN/S34-T1-*.pd` — spec, acceptance criteria, verify steps.
- **Context**: `../intel/TOTEM_EPICS.ti`, `../intel/TOTEM_SPRINTS.ti`, `../intel/TOTEM_REFACTORING.ti`.
- **Code**: `navitrack-app/` (from repo root). Run `pnpm run test` and `pnpm run build` from `navitrack-app/`.

---

## Sprints (To-Do)

| Sprint | Name                      | Priority | Path   | Lead prompt   |
|--------|---------------------------|----------|--------|---------------|
| S34    | Vue Component Refactoring | P0       | 34/    | S34.ptl       |
| S35    | Graphics Fallback System | P1       | 35/    | S35.ptl       |
| S36    | Slint/HTML Switch System | P2       | 36/    | S36.ptl       |
| S37    | Architecture Consolidation| P3       | 37/    | S37.ptl       |
| S38    | Async Reports + 2FA       | P1       | 38/    | S38.ptl       |
| S39    | Feature Pack             | P2       | 39/    | S39.ptl       |
| S40    | Tech Debt Cleanup        | P3       | 40/    | S40.ptl       |
| S20    | Universal UI Template    | optional | 20/    | S20.ptl       |
| S21    | Rebrand Login WOW         | optional | 21/    | S21.ptl       |
| S27    | Release Go-Live          | planned  | 27/    | S27.ptl       |
