# Instance: NaviTrack Config App

Hybrid DUT configurator (iOS / Android / desktop). Config: **`project.config.yml`**.

| | |
|---|---|
| Code | `navitrack/navitrack-config-app` — [github](https://github.com/denistka/navitrack-config-app) |
| Functionality SSOT / guide | `intel/DUT-FUNCTIONALITY.md` (as-built hybrid after S18; legacy source was `navitrack-dut-config-mobile`) |
| UI / hybrid template | `navitrack/navitrack-mobile-apps` (shell scaffolded) |
| Package manager | **bun** |
| Epics / sprints | `intel/EPICS.md` · S01–S16 ✅ · S17 T0–T2 ✅ · **S18** E15 parity + guide `gate: CLOSED` |
| **Tests** | **HARD MANDATE** → `intel/TEST-COVERAGE-MANDATE.md` |
| **Code quality** | **After each sprint** → `intel/CODE-QUALITY-MANDATE.md` (shared UI, React/Tauri practice, refactor) |

## Goal

Parity with legacy DUT configurator + mobile-apps visual identity + **full test coverage on every change**.

## Work order

1. ~~DUT analysis~~ · ~~empty shell~~  
2. ~~Execute **S01 → S12** (epics E1–E11)~~ — all `gate: CLOSED`  
3. ~~Close via S12 parity checklist + CI~~  
4. ~~Post-RC **S13 → S14 → S15** (`intel/POST-RC.md`)~~ — all `gate: CLOSED` (2026-09-18)  
5. ~~**S16** Design Shell Parity (E13)~~ — `gate: CLOSED` (2026-09-24)  
6. ~~**S17** Real DUT macOS (E14)~~ — T0–T2 closed; T3/TQ absorbed into S18  
7. ~~**S18** Legacy Parity Closeout + As-Built Guide (E15)~~ — `gate: CLOSED` (2026-09-28); live smoke T0 deferred if no DUT

## Layout

| Item | Location |
|------|----------|
| Instance config | `project.config.yml` |
| Invariants | `S01-INVARIANTS.md` |
| Epics | `intel/EPICS.md` |
| Sprints | `sprints/S01`…`S18` |
| Post-RC plan | `intel/POST-RC.md` |
| Functionality guide (SSOT) | `intel/DUT-FUNCTIONALITY.md` |
| S18 invariants | `S18-INVARIANTS.md` |
| Test mandate | `intel/TEST-COVERAGE-MANDATE.md` |
| Code quality mandate | `intel/CODE-QUALITY-MANDATE.md` |
| Testing strategy | `intel/TESTING.md` |
| Device QA | `intel/DEVICE-QA.md` |
| Client / manual field intel | `intel/CLIENT-FIELD-INTEL.md` |
| Application code | `paths.code` |

## Agent rules

- **bun** only — no pnpm/npm lockfiles.
- App code only in `paths.code`, never under `totem/`.
- **Every `.pd` must leave co-located Vitest tests + `bun run test` green** (`TEST-COVERAGE-MANDATE.md`).
- **After each sprint:** quality review — reuse `src/ui`, React + Tauri best practices, refactor if needed (`CODE-QUALITY-MANDATE.md`). Sprint not closed without it.
- S01–S16 sprint/task files are `gate: CLOSED` (MVP + post-RC E12 + E13 design shell).
- S17 T0–T2 `CLOSED`; S17-T3 / S17-TQ **superseded by S18**. **S18** `gate: CLOSED` (2026-09-28); T0 live smoke deferred without DUT.

## Load

`load navitrack` or this folder. Active planning: **S18** (`S18-INVARIANTS.md`). S01–S16 closed; S17 slice T0–T2 done.