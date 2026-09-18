# Decision: Graduation table does not write multi-point to DUT

Date: 2026-09-18
Sprint: S09-T4

## Decision

The Graduation (calibration data) tab stores a **local draft only** (localStorage keyed by sensor name) and can share a `.txt` export.

It does **not** push a multi-point fuel↔frequency table to the device.

## Legacy evidence

- DUT inventory / `SensorPage_CalibrationTab`: multi-row table auto-saves and shares; **does not** write table to DUT.
- Multi-point / 2-point DUT write is **Standard mode `Command_47`** (`[min, 1, max, calType, …]`).

## UX

- Disclaimer banner on Graduation tab (i18n `sensorSession.graduation.disclaimer`).
- Share file footer repeats the non-write note.

## Follow-up

None required for parity; Standard mode already owns Command_47.
