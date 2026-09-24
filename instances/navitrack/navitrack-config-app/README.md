# Instance: NaviTrack Config App

Hybrid DUT configurator (iOS / Android / desktop). Config: **`project.config.yml`**.

| | |
|---|---|
| Code | `navitrack/navitrack-config-app` — [github](https://github.com/denistka/navitrack-config-app) |
| Functionality SSOT | `navitrack/navitrack-dut-config-mobile` → `intel/DUT-FUNCTIONALITY.md` |
| UI / hybrid template | `navitrack/navitrack-mobile-apps` (shell scaffolded) |
| Package manager | **bun** |
| Epics / sprints | `intel/EPICS.md` · S01–S15 ✅ CLOSED · **S16** Design Shell Parity `gate: LOCKED` · post-RC E12 → `intel/POST-RC.md` |
| **Tests** | **HARD MANDATE** → `intel/TEST-COVERAGE-MANDATE.md` |
| **Code quality** | **After each sprint** → `intel/CODE-QUALITY-MANDATE.md` (shared UI, React/Tauri practice, refactor) |

## Goal

Parity with legacy DUT configurator + mobile-apps visual identity + **full test coverage on every change**.

## Work order

1. ~~DUT analysis~~ · ~~empty shell~~  
2. ~~Execute **S01 → S12** (epics E1–E11)~~ — all `gate: CLOSED`  
3. ~~Close via S12 parity checklist + CI~~  
4. ~~Post-RC **S13 → S14 → S15** (`intel/POST-RC.md`)~~ — all `gate: CLOSED` (2026-09-18)

## Layout

| Item | Location |
|------|----------|
| Instance config | `project.config.yml` |
| Invariants | `S01-INVARIANTS.md` |
| Epics | `intel/EPICS.md` |
| Sprints | `sprints/S01`…`S15` |
| Post-RC plan | `intel/POST-RC.md` |
| Test mandate | `intel/TEST-COVERAGE-MANDATE.md` |
| Code quality mandate | `intel/CODE-QUALITY-MANDATE.md` |
| Testing strategy | `intel/TESTING.md` |
| Application code | `paths.code` |

## Agent rules

- **bun** only — no pnpm/npm lockfiles.
- App code only in `paths.code`, never under `totem/`.
- **Every `.pd` must leave co-located Vitest tests + `bun run test` green** (`TEST-COVERAGE-MANDATE.md`).
- **After each sprint:** quality review — reuse `src/ui`, React + Tauri best practices, refactor if needed (`CODE-QUALITY-MANDATE.md`). Sprint not closed without it.
- S01–S15 sprint/task files are `gate: CLOSED` (MVP + post-RC E12 complete).

## Load

`load navitrack` or this folder. S01–S15 are closed; see `S12-INVARIANTS.md` / `S15-INVARIANTS.md` / `sprints/S12/RC-NOTES.md`.
