# S21-T0 — Sensor connect failure

Client report 2026-10-13: scan finds Navi_901 (RSSI -91) and Navi_919 (RSSI -100). Connecting fails.

## Found in code (no device log yet)

1. **Connect overlapped a running scan.** Tapping a row while the scan was still running (the client's screenshot shows "Сканування…") started the GATT connect without stopping the scan. `TauriBleAdapter.scan` kept sleeping for the whole scan window. Then it called `stopScan()` on the radio, possibly in the middle of the connect. Connecting during a scan is a well-known Android failure (GATT 133) and is flaky on iOS.
   - **Fix:** `ensureSession` calls `useSensorsStore.stopScan()` before `openBleSession`. The native scan wait can be cancelled now, so it never touches the radio again after an early stop.
2. **Connect errors looked like a wrong password.** Any transport or timeout error during unlock set `status: 'authFail'` ("Пароль відхилено"). Now the status is `connectFail` when the GATT session never came up. The new message asks the user to move closer and try again. The auto-connect retry also re-arms on `connectFail`.

## Still open

- Not confirmed on the client device. The weak RSSI (-91 and -100) can still make a connect fail on its own.
- If it still fails, get the Журнал copy right after the attempt (look for lines starting `BLE stopScan`, `GATT connected` or `Auth error:`), plus the phone model and OS.

## Tests

- `src/store/sensor-session-connect.test.ts`: stopScan runs before connect; `connectFail` is reported when GATT fails.
- `src/ble/tauri-adapter.test.ts`: stopScan ends a running scan early and stops the radio only once.
