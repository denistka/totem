# Instance: NaviTrack Config App

Hybrid DUT configurator (iOS / Android / desktop). Config: **`project.config.yml`**.

| | |
|---|---|
| Code | `navitrack/navitrack-config-app` — [github](https://github.com/denistka/navitrack-config-app) |
| Functionality SSOT / guide | `intel/DUT-FUNCTIONALITY.md` (as-built hybrid after S18; legacy source was `navitrack-dut-config-mobile`) |
| UI / hybrid template | `navitrack/navitrack-mobile-apps` (shell scaffolded) |
| Package manager | **bun** |
| Epics / sprints | `intel/EPICS.md` · S01–S16 ✅ · S17 T0–T2 ✅ · S18 ✅ · S19 ✅ · S20 ✅ · S21 ✅ · S22 ✅ |
| **Live DUT** | `sprints/S22/LIVE-DUT-NOTES.md` — Navi_7514 ground truth; headless harness `tools/dut-bridge` + `tools/dut-probe` |
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
8. ~~**S19** Design Shell Closeout (E16)~~ — `gate: CLOSED` (2026-09-30)  
9. ~~**S20** Host Compile (E17)~~ — `gate: CLOSED` (2026-09-30). Unsigned iOS IPA; Android APK/AAB unsigned. Device signing still needs the Apple Program License Agreement.
10. ~~**S21** Field Feedback Bugs (E18)~~ — `gate: CLOSED` (2026-10-14). T0 superseded by S22.
11. ~~**S22** Live Sensor Reliability + Session UX (E19)~~ — `gate: CLOSED` (2026-10-14). First live-DUT sprint; v0.1.3. Invariants: `S22-INVARIANTS.md`.

## Layout

| Item | Location |
|------|----------|
| Instance config | `project.config.yml` |
| Invariants | `S01-INVARIANTS.md` |
| Epics | `intel/EPICS.md` |
| Sprints | `sprints/S01`…`S20` |
| S19 invariants | `S19-INVARIANTS.md` |
| S20 invariants | `S20-INVARIANTS.md` |
| S21 / S22 invariants | `S21-INVARIANTS.md` · `S22-INVARIANTS.md` |
| Live DUT notes | `sprints/S22/LIVE-DUT-NOTES.md` |
| S20 host compile | `sprints/S20/S20-Host-Compile.ptl` (`gate: CLOSED`) |
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
- **S19** `gate: CLOSED` (2026-09-30). Do not reopen S19 tasks. S18 stays closed. S18-T0 live smoke stays deferred.
- **S20** `gate: CLOSED` (2026-09-30). Do not reopen S20 tasks. S19 and S18 stay closed. S18-T0 live smoke stays deferred. `gen/` stays gitignored.

- **S22**: the live DUT harness runs the app's own code (`bun tools/dut-probe/probe.ts read|idle|silent <name>`). Never write settings to a live sensor without reading them first. The sensor password is required for authenticated paths.

## Load

`load navitrack` or this folder. S01–S20 are closed. S18-T0 live smoke stays deferred.