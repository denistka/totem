# DUT parity checklist (S12-T2 signed)

Source: `intel/DUT-FUNCTIONALITY.md`. Updated 2026-09-18.

| Area | Parity item | Covered | Tests | Notes |
|------|-------------|---------|-------|-------|
| Hub | Main: Sensors / Settings / Logs / About | yes | Vitest + e2e | MobileShell IA |
| Settings | Lang, scan, timeouts, cal rows, auto-connect | yes | Vitest | Theme/lang via existing UI |
| BLE | Name filters + UUIDs + MTU 200 | yes | Vitest | invariants + constants |
| BLE | Scan / connect / notify | yes | Vitest + e2e | FakeBleAdapter default on web |
| BLE | Advertise Response_53 | yes | Vitest | parseAdvertise53 |
| BLE | Watchdog thresholds | yes | Vitest | injectable clock |
| Auth | Password 0x50 | yes | Vitest + e2e | Standard gate |
| Standard | Live 06/61 | yes | Vitest | Fake autoRespond |
| Standard | Read chain E0→14→4D→C8→48 | yes | Vitest | |
| Standard | Write chain | yes | Vitest | |
| Standard | Cal write 47 + min/max | yes | Vitest | |
| Standard | Share settings | yes | Vitest | share helper stub/native-ready |
| Password | Change 0x59 | yes | Vitest | |
| Graduation | Table persist + share (no DUT multi-point write) | yes | Vitest | S09 DECISION.md |
| Advanced | Server flag gate | yes | Vitest | FCS flag in settings store |
| Advanced | Command picker + send (+ stubs decision) | yes | Vitest | S10 DECISION-STUBS.md |
| FCS | GetUserSettings params/flags | yes | Vitest/MSW | POST clients |
| FCS | SendLogMessage | yes | Vitest/MSW | |
| i18n | en/uk/ru DUT keys | yes | Manual/locale files | Expanded S09–S11 |
| Native | Permissions, keep-awake, share | partial | Vitest | Adapters/stubs; real Tauri plugins TBD |
| QA | `bun run test` + e2e CI | yes | CI workflow | Real device BLE not in CI |

## Remaining / known gaps

- Production Tauri BLE adapter (not Fake) on iOS/Android
- Native permission prompts, Wake Lock / keep-awake plugin, system share sheet
- Advanced stubs 46/47/5A intentionally incomplete (documented)
- Graduation never writes multi-point to DUT (by design)
- Firmware OTA / USB — out of product scope
