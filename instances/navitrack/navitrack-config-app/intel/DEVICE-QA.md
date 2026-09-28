# Device smoke checklist — manual QA (S13-T5 + S17 macOS)

Use a **real DUT** + Tauri build. Unit tests stay on FakeBle/MSW — **no live BLE in CI**.

| Path | Launch | Sprint |
|------|--------|--------|
| iOS / Android | `bun run ios:dev` / `android:dev` | S13+ |
| **macOS desktop** | `bun run macos:dev` (or `tauri dev` on macOS) | **S17** |

Live product on hand: **Navitrack BLE** — see `intel/NAVITRACK-BLE-DUT.md`. App protocol = GATT/CRC (S01), **not** marketing ModBus.

Name filters (advertise): `Navitrek` / `Nvt` / `NavOd` / `Navi` / `TD_`.

Field intel (manual v3.0 + client): `intel/CLIENT-FIELD-INTEL.md`.

- Default DUT password (manuals): **`111`**
- Vehicle / plate on DUT: **ASCII / Latin only** (max 8). Company may be Cyrillic in UI/file only.
- Example unit: **Navi_4214** (serial 4214)

---

## Preflight (mobile)

- [ ] Build uses TauriBleAdapter (not `VITE_FORCE_FAKE_BLE`)
- [ ] Bluetooth ON on phone
- [ ] DUT powered and advertising (name matches filters above)
- [ ] First-run OS permission dialogs can appear

## Happy path (mobile)

1. [ ] Open **Sensors** → **Scan** (or Welcome Scan / Catalog → session)
2. [ ] OS BLE permission prompt → **Allow**
3. [ ] DUT appears in list (name + optional advertise telemetry)
4. [ ] Tap DUT → sensor session opens
5. [ ] Enter DUT password (default often **`111`**) → auth (cmd `0x50`) succeeds
6. [ ] Standard tab **Read** settings chain completes (vehicle / probe / period / calibration)
6a. [ ] If writing vehicle: use **Latin/ASCII** plate only (Cyrillic will become `?` on DUT)
7. [ ] Live telemetry updates while session open
8. [ ] Screen stays awake during session (wake-lock / keep-screen-on)
9. [ ] Share settings / logs / graduation uses system share sheet or clipboard fallback
10. [ ] Disconnect / leave session cleanly

---

## macOS desktop (S17)

Primary field path for the unit on hand until mobile live DUT is re-run.

### Preflight (macOS)

- [ ] `bun run macos:dev` (or documented `tauri dev`) launches app window
- [ ] Build uses **TauriBleAdapter** (not `VITE_FORCE_FAKE_BLE`, not browser Fake)
- [ ] macOS **Bluetooth ON** (System Settings → Bluetooth)
- [ ] App has Bluetooth privacy access if prompted (first launch / TCC)
- [ ] DUT powered and advertising (name filters above)
- [ ] Entitlements / Info.plist Bluetooth usage present (see `NATIVE-BLE.md` / S17 MACOS-BUILD notes)

### Happy path (macOS)

1. [ ] Open **Sensors** → **Scan** (or Welcome Scan CTA when BLE ready)
2. [ ] OS / app Bluetooth permission → **Allow** if shown
3. [ ] Navitrack BLE DUT appears in scan list
4. [ ] Select DUT → sensor session opens
5. [ ] Enter DUT password (default often **`111`**) → auth (`0x50`) succeeds
6. [ ] Standard tab **Read** chain completes (vehicle / probe / period / calibration)
6a. [ ] If writing vehicle: **Latin/ASCII** only (see CLIENT-FIELD-INTEL)
7. [ ] Live telemetry updates while session open (if DUT advertises / notifies)
8. [ ] Disconnect / leave session cleanly

Record results in `sprints/S18/SMOKE-NOTES.md` (OS version, DUT name seen, pass/fail, blockers). S17 notes superseded for active smoke.

### Permission / power deny (macOS)

| Case | Expected UI |
|------|-------------|
| Bluetooth off | Sensors / readiness: BT-off copy (not empty silent fail) |
| Privacy denied | Permission error copy; scan works after granting in System Settings |
| `VITE_FORCE_FAKE_BLE=1` | Fake demo devices only — not a live pass |

---

## Graduation tab write (S15)

1. [ ] Open **Graduation** tab
2. [ ] Enter password → unlock (if not already)
3. [ ] Fill in fuel↔frequency rows (multi-point)
4. [ ] Tap **Write to device**
5. [ ] Verify success message ("Graduation table written")
6. [ ] Optional: verify read-back matches (no mismatch warning)
7. [ ] Share table → text no longer says "NOT written"

## Permission / power deny paths (mobile)

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
