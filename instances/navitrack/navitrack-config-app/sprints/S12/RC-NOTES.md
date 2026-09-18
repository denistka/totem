# Release candidate notes — S12

Date: 2026-09-18

## What shipped (S01–S12)

- Protocol library (CRC8, frames, commands/responses, runner)
- BLE transport abstraction + FakeBleAdapter + advertise + watchdog
- FCS clients + fingerprint + app settings store
- Hub screens, sensors scanner, standard session, password, graduation, advanced
- i18n en/uk/ru, permissions docs, keep-awake hook, unified share
- CI: unit + Playwright e2e

## RC entry criteria

1. `bun run test` green locally and in CI
2. Playwright journeys: hub, settings save, scan→connect→unlock
3. Parity checklist signed (`intel/PARITY-CHECKLIST.md`)
4. No live FCS / no real BLE in automated tests

## Device QA (post-RC)

- [ ] Android BLE scan/connect on physical DUT
- [ ] iOS BLE + plist strings
- [ ] FCS GetUserSettings against staging (manual)
- [ ] Share sheets / keep-screen-on on device

## Known gaps

See PARITY-CHECKLIST “Remaining / known gaps” and S10 DECISION-STUBS / S09 DECISION.
