# S18 INVARIANTS — Legacy Parity Closeout + As-Built Guide

Depends: S01, S15, S16, S17 (T0–T2 closed). Active when S18 gates open (planned 2026-09-28).  
Epic: **E15**.

## Sprint goal (freeze)

1. Hybrid app is the **working template** with all **in-scope** legacy mobile functionality.
2. [`intel/DUT-FUNCTIONALITY.md`](intel/DUT-FUNCTIONALITY.md) is the **as-built hybrid guide** (product руководство / SSOT for behaviour).
3. Open S17 work absorbed: live macOS BLE smoke → **S18-T0**; quality → **S18-TQ**.

## In-scope parity (must be done by S18 close)

| Item | Rule |
|------|------|
| FCS bootstrap | App start → fingerprint → GetUserSettings → apply Advanced flag + cal params |
| Watchdog | Thresholds wired into BLE session → reconnect / alert UX |
| autoConnectSensor | Gates Response_53 / advertise enrichment on scan list |
| Calibration modes | Standard UI: **Full / Not-full / Dry** using FCS math params |
| Field UX | Password hint `111`; Vehicle ASCII warning; share filename `{SensorName}`; i18n ↔ language store sync |
| Live smoke | macOS path recorded in `sprints/S18/SMOKE-NOTES.md` |

## Guide SSOT

- **Primary:** `intel/DUT-FUNCTIONALITY.md` (as-built hybrid after T7).
- Supporting: `PARITY-CHECKLIST.md`, `CLIENT-FIELD-INTEL.md`, `DEVICE-QA.md`.
- Legacy Xamarin inventory may remain as a **delta / history** section inside DUT-FUNCTIONALITY — do not leave the hybrid undocumented.

## Encoding (from S17 / client)

| Field | On DUT? | Charset |
|-------|---------|---------|
| Password | yes | ASCII pad 8; default often **111** |
| Vehicle | yes | ASCII pad 8 — Latin in practice |
| Company | no (prefs + file) | Cyrillic OK |

## Non-goals (frozen)

- Desktop COM / RS-485 / Bluetooth converter
- Thermocompensation UI
- Min RSSI scan filter
- Full Installation Report wizard (S16 stub remains)
- Reverting S16 IA (Welcome → Home → Catalog)
- ModBus in-app
- Application code inside `totem/`

## S17 absorption

| Former | Status |
|--------|--------|
| S17-T0 … T2 | CLOSED (remain under `sprints/S17/`) |
| S17-T3 live smoke | **SUPERSEDED** by S18-T0 |
| S17-TQ quality | **SUPERSEDED** by S18-TQ |

## Adapter / test split (unchanged)

| Runtime | Adapter |
|---------|---------|
| Vitest / web | FakeBle + MSW |
| Tauri desktop/mobile | TauriBleAdapter (unless `VITE_FORCE_FAKE_BLE`) |
| CI | No live BLE |
