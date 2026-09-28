# S18 QUALITY-NOTES — post-sprint review

Date: 2026-09-28 · Mandate: `intel/CODE-QUALITY-MANDATE.md`

## Review

| Check | Verdict |
|-------|---------|
| Shared UI (`src/ui`) | LanguageSelector / Button / Input reused; cal mode uses native `<select>` (acceptable, no new kit control) |
| React | Bootstrap + watchdog as modules; session actions stay the BLE/protocol boundary |
| Tauri | BLE still behind adapters; no capability sprawl this sprint |
| Tests | `bun run test` green after T2–T6 (214+ tests) |
| Duplication | Cal math / field-ux / language-sync extracted as pure libs |

## Smells noted (non-blocking)

- `sensor-session-actions.ts` still large — acceptable; further split only if next sprint touches it heavily.
- Watchdog wraps transport only after unlock; intentional.
- Live smoke (T0) deferred — no DUT; not a code smell.

## Refactors done in-sprint

- `fcs-bootstrap`, `session-watchdog`, `calibration-modes`, `field-ux`, `language-sync` modules with co-located tests.

## Gate

Quality closeout **complete**. Sprint may close when PM sets `.ptl` / task gates `CLOSED`.
