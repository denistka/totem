# S04 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI (`src/ui`) | N/A — BLE transport layer only |
| React practices | N/A |
| Tauri surface | Thin `BleAdapter` boundary; web defaults `FakeBleAdapter`; real GATT deferred |
| Design tokens | Unchanged |
| Tests | `bun run test` green; FakeBleAdapter only in BLE unit tests |

## What landed

- `BleAdapter` + `FakeBleAdapter` (scan/connect/MTU/write/subscribe)
- Constants: `SENSOR_NAMES`, UUIDs, MTU 200 from invariants
- Session orchestration + advertise → Response_53 list telemetry
- Watchdog with injectable clock (10s busy / 45s idle defaults)

## Smells / actions

- No native BLE plugin wiring yet — next sprint/epic attaches Tauri adapter implementing `BleAdapter`
- Pre-existing UI lint warnings unchanged
- No further refactor required before S05
