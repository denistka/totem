# S19 quality closeout

Reviewed against the code-quality mandate. Home tiles and the bottom tabs both stay. FakeBle only. No live radio.

## What changed

- `StandardModeTab` was 291 lines after the shell work. The password gate, live tiles, and calibration block now live in `SessionPasswordGate`, `StandardLiveTelemetry`, `StandardCalibration`, and `session-fields`. The tab file is the wiring.
- DUT numeric fields were copied in the embedded sheet and the full settings page. They now share `DutNumericFields`. `ScreenHeader` and `RadarScanner` stay the shared primitives from earlier tasks. No second header or radar was added.

## Left as they are

These files are still over the 150-line screen guide and were not duplicated this sprint: `GraduationTab`, `sensor-session-actions`, `advanced-catalog`, `tauri-adapter`, `BottomSelectModal`, `calibration-modes`. Tauri stays behind `src/ble/factory.ts` and `src/ble/tauri-adapter.ts`. The macOS, iOS, and Android compile blockers are in `RELEASE-TARGETS.md`.

`bun run test` is the check for this closeout.
