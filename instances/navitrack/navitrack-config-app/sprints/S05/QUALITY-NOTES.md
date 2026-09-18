# S05 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI (`src/ui`) | N/A — API / prefs layer; Settings screen can bind later |
| React practices | Zustand persist store; no unnecessary re-render surface yet |
| Tauri surface | Fingerprint AndroidId injectable for Tauri stub; store uses localStorage with memory fallback |
| Design tokens | Unchanged |
| Tests | MSW-only HTTP; `bun run test` green |

## What landed

- `src/api/fcs.ts` — POST GetUserSettings / SendLogMessage + parse ConfigParameters / advanced flag
- MSW handlers expanded to legacy response shape (FREQUENCY_STEP, PROBE_LENGTH_TOP_SHIFT, INIT_CALIBRATION_BOTTOM_SHIFT, Settings=[1])
- `src/lib/fingerprint.ts` — SHA-256 Base64 userId/userId2 with web fallback
- `useAppSettingsStore` — ScanPeriod 30, LastSent 10, LastReceive 45, CountCalibrationRows 32, AutoConnect false, company, FCS fields; persisted

## Smells / actions

- GetUserSettings MSW switched from GET → POST to match legacy (S01 skeleton updated)
- Wire Settings screen + App start `getUserSettings` in a later sprint
- No further refactor required before S06
