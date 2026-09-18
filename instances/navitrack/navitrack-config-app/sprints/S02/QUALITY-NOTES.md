# S02 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI (`src/ui`) | N/A — protocol-only sprint, no UI changes |
| React practices | N/A — no React surface this sprint |
| Tauri surface | Unchanged (pure TS protocol helpers) |
| Design tokens | Unchanged |
| Tests | `bun run test` green (36); co-located Vitest under `src/protocol/` |

## What landed

- `crc8.ts` — byte-identical Dallas/Maxim table from `Crc8Helper.cs`
- `package.ts` — encode/decode `[prefix][addr][cmd][payload][crc]` with CRC over body excluding CRC byte
- `user-state.ts` — `UserState` enum + `isBusy` / `canStart` / reset helpers (legacy `WriteSettigs` typo preserved)
- `pad.ts` — ASCII pad/truncate length 8 + `decodeAsciiPad` trailing-NUL strip

## Smells / actions

- Pre-existing lint warnings in `navigation.ts`, `BottomModal.tsx`, `BottomSelectModal.tsx` — out of S02 scope; no new follow-up `.pd` needed for protocol code.
- No refactor required before S03 (command/response ports can import these helpers directly).
- No live FCS in unit tests.
