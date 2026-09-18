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

**S15** (Epic E12): product uplift to allow Graduation → DUT multi-point write via Command_47.  
Until S15-T0 amends invariants, this decision stands.

---

## S15 Amendment (2026-09-18)

**This decision is superseded by S15-T0.**

Graduation tab MAY now write a multi-point calibration table to the DUT:
- Uses `Command_47` with 64×u16 payload (fuel↔freq pairs in legacy Xamarin order).
- Password gate required before write.
- Optional read-back via `Command_48` for verification.
- Local draft + share remain unchanged.

See `intel/S15-INVARIANTS.md` for updated product rules.
