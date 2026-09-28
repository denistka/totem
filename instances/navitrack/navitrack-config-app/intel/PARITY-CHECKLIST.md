# DUT parity checklist (hybrid as-built — S18)

Source: `intel/DUT-FUNCTIONALITY.md` (as-built hybrid guide). Updated 2026-09-28.

| Area | Parity item | Covered | Tests | Notes |
|------|-------------|---------|-------|-------|
| Hub | Welcome → Home → Sensors / Catalog / Settings / Logs / About | yes | Vitest + e2e | S16 IA |
| Settings | Lang, scan, timeouts, cal rows, auto-connect, company | yes | Vitest | ua↔uk i18n sync (S18-T6) |
| BLE | Name filters + UUIDs + MTU 200 | yes | Vitest | |
| BLE | Scan / connect / notify | yes | Vitest | FakeBle web; Tauri desktop |
| BLE | Advertise Response_53 gated by autoConnect | yes | Vitest | S18-T4 default off |
| BLE | Watchdog → reconnect UX | yes | Vitest | S18-T3 |
| Auth | Password 0x50 + field hint 111 | yes | Vitest | S18-T6 hint only |
| Standard | Live 06/61 | yes | Vitest | |
| Standard | Read / write chains | yes | Vitest | |
| Standard | Cal modes Full / Not-full / Dry → 47 | yes | Vitest | S18-T5 |
| Standard | Vehicle ASCII warn | yes | Vitest | S18-T6 |
| Standard | Share `navitrack-dut-settings-{SensorName}.txt` | yes | Vitest | S18-T6 |
| Password | Change 0x59 | yes | Vitest | |
| Graduation | Table + DUT write Command_47 | yes | Vitest | S15 |
| Advanced | Server flag + command picker | yes | Vitest | S14 |
| FCS | Bootstrap on app start | yes | Vitest/MSW | S18-T2 soft-fail |
| i18n | en/uk/ru | yes | Locale files | |
| Native | Permissions, keep-awake, share, macOS BLE | yes* | Vitest + manual | *Live smoke: T0 deferred if no DUT |
| QA | `bun run test` | yes | CI | No live BLE in CI |

## In-scope S18 — closed

| Item | Task |
|------|------|
| FCS bootstrap | T2 |
| Watchdog reconnect | T3 |
| autoConnect gate | T4 |
| Calibration modes | T5 |
| Field UX (hint / ASCII / share / i18n) | T6 |
| As-built guide | T7 |
| Desktop path / smoke notes | T1 / T0 |

## Explicit non-goals (unchanged)

Desktop COM/RS · thermocompensation · min RSSI · full Installation Report wizard · ModBus in-app.

## Live smoke

macOS path ready (`SMOKE-NOTES.md` T1). Live DUT session **deferred** when no unit on hand — re-run T0 checklist when available.
