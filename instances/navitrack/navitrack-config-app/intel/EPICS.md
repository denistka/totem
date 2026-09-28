# Epics — DUT port to navitrack-config-app

Functionality SSOT: `navitrack/navitrack-dut-config-mobile` → `intel/DUT-FUNCTIONALITY.md`  
UI shell: already scaffolded from `navitrack-mobile-apps`  
**Tests:** `intel/TEST-COVERAGE-MANDATE.md` (hard rule on every task)  
**Code quality:** `intel/CODE-QUALITY-MANDATE.md` — **after every sprint**, review shared UI / React / Tauri practice and refactor before starting the next sprint.

All sprints **S01–S16**: `gate: CLOSED` (S16 executed 2026-09-24). History: `./sprints/`.

---

## Post-sprint gate (all epics)

```
sprint tasks → bun run test green → CODE QUALITY review/refactor → then next sprint
```

## Epic map

| Epic | Goal | Sprints |
|------|------|---------|
| **E0** Shell baseline (done) | Empty hybrid shell + bun + Vitest/Playwright | — |
| **E1** Contract & IA | Freeze invariants, nav IA, test mandate | **S01** |
| **E2** Binary protocol | CRC8, frames, cmds/responses, UserState | **S02–S03** |
| **E3** BLE transport | Adapter, scan/connect/GATT, advertise, watchdog | **S04** |
| **E4** Cloud + prefs | FCS GetUserSettings/SendLog, fingerprint, app settings store | **S05** |
| **E5** Hub screens | Main Sensors/Settings/Logs/About (non-session) | **S06** |
| **E6** Scanner | Sensors list + BLE UX | **S07** |
| **E7** Standard session | Password, live, read/write, cal write, share | **S08** |
| **E8** Extra tabs | Change password + Graduation table | **S09** |
| **E9** Advanced | Server-gated raw commands | **S10** |
| **E10** Native + i18n | Permissions, keep-awake, share, Locale* parity | **S11** |
| **E11** QA closeout | E2E journeys, CI gate, parity checklist | **S12** ✅ |
| **E12** Post-RC gaps | Native BLE/OS + Advanced stubs + Graduation→DUT write | **S13–S15** ✅ |
| **E13** Design shell parity | Mix mobile-apps chrome + customer structured IA (welcome, home tiles, catalog, report stub); 1 live sensor, extensible | **S16** ✅ |
| **E14** Real DUT | macOS Tauri + live Navitrack BLE (T0–T2 done; open T3/TQ → **S18**) | **S17** T0–T2 ✅ · remainder → S18 |
| **E15** Hybrid parity template | Finish in-scope legacy mobile parity + as-built `DUT-FUNCTIONALITY.md` guide | **S18** `gate: LOCKED` |

See `intel/POST-RC.md`. Product sheet: `intel/NAVITRACK-BLE-DUT.md`. Field intel: `intel/CLIENT-FIELD-INTEL.md`.

---

## Dependency order

```
S01 → … → S12  (MVP RC)
              └→ S13 → S14 → S15 → S16
                                   └→ S17 (T0–T2) → S18 (parity + guide + absorbed smoke)
```

```
S01 → S02 → S03 → S04 → S05 → S06 → S07 → S08 → S09 → S10 → S11 → S12
         ↘________↗ (S05 can partially parallel S04 after S03)
```
---

## Out of scope (still)

Firmware OTA · USB/UART host · Fleet map/tracking · Cloud user login · Import settings presets ·  
Desktop Windows COM / **RS-485** / Bluetooth-converter chapters · Thermocompensation field (desktop-only; unwired in mobile)

## Field intel

Manual v3.0 + client Cyrillic notes + `Navi_4214` export → `intel/CLIENT-FIELD-INTEL.md`.
