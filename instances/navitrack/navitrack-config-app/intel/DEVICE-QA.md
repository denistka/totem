# Device smoke checklist — manual QA (S13-T5)

Use a **real DUT** + Tauri iOS/Android build (`bun run ios:dev` / `android:dev`). Unit tests stay on FakeBle/MSW.

## Preflight

- [ ] Build uses TauriBleAdapter (not `VITE_FORCE_FAKE_BLE`)
- [ ] Bluetooth ON on phone
- [ ] DUT powered and advertising (name matches `Navitrek` / `Nvt` / `NavOd` / `Navi` / `TD_`)
- [ ] First-run OS permission dialogs can appear

## Happy path

1. [ ] Open **Sensors** → **Scan**
2. [ ] OS BLE permission prompt → **Allow**
3. [ ] DUT appears in list (name + optional advertise telemetry)
4. [ ] Tap DUT → sensor session opens
5. [ ] Enter DUT password → auth (cmd `0x50`) succeeds
6. [ ] Standard tab **Read** settings chain completes (vehicle / probe / period / calibration)
7. [ ] Live telemetry updates while session open
8. [ ] Screen stays awake during session (wake-lock / keep-screen-on)
9. [ ] Share settings / logs / graduation uses system share sheet or clipboard fallback
10. [ ] Disconnect / leave session cleanly

## Graduation tab write (S15)

1. [ ] Open **Graduation** tab
2. [ ] Enter password → unlock (if not already)
3. [ ] Fill in fuel↔frequency rows (multi-point)
4. [ ] Tap **Write to device**
5. [ ] Verify success message ("Graduation table written")
6. [ ] Optional: verify read-back matches (no mismatch warning)
7. [ ] Share table → text no longer says "NOT written"

## Permission / power deny paths

| Case | Expected UI |
|------|-------------|
| Deny BLE permission | Sensors error: permission copy (not empty silent fail) |
| Bluetooth powered off | Sensors error: BT-off copy |
| Permission later granted in Settings | Scan works after return |

## Regression (Fake web)

- [ ] `bun run test` green
- [ ] Browser demo still lists Fake demo devices

## Notes

Record device models / OS versions / DUT firmware used for each field session.
