# S03 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI (`src/ui`) | N/A — protocol library only |
| React practices | N/A |
| Tauri surface | Unchanged; transport is injectable interface for later BLE adapter |
| Design tokens | Unchanged |
| Tests | `bun run test` green (65); co-located Vitest under `src/protocol/` |

## What landed

- CommandCode constants + `buildCommand` / LE helpers / ASCII pad reuse
- Standard + advanced encoders matching legacy `Command_*.cs` payloads
- Response registry (`parseResponse`) with `ProtocolCrcError` on CRC fail
- Advertise `parseAdvertise53` (manufacturer data, not 0x3E frame)
- Runner: `sendCommand`, `runCommandQueue`, read/write settings chain builders

## Intentional stubs

- **0x5A**: no `Command_5A.cs` in legacy; Advanced send commented — header-only `encodeCommand5A` for opcode coverage
- **Opcodes without builders**: 0x54, 0x60, 0xC3, 0xC5 (codes only; unused in Standard/Advanced paths)
- **Command_46 / 47 Advanced UI**: encode ports exist; Advanced send of 46/47 remains historically commented in legacy

## Smells / actions

- Split advanced encoders (`advanced-a` / `advanced-b`) and response parsers/registry to keep files &lt;150 lines
- Pre-existing UI lint warnings unchanged
- No further refactor required before S04 (BLE adapter can implement `ProtocolTransport`)
