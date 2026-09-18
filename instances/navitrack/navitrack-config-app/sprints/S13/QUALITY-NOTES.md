# S13 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI | No new one-off controls; share/keep-awake/BLE stay behind adapters |
| React | Factory + injectable probes; stores unchanged aside from adapter source |
| Tauri | Thin plugins: `blec`, `keep-screen-on`; capabilities least-privilege |
| Fake/MSW | Vitest still FakeBle only; BlecApi injectable for TauriBleAdapter tests |
| Tests | `bun run test` green |

## Smells / actions

- `tauri-plugin-blec` npm **0.12** pinned to match crate (crates.io newer than npm — do not drift)
- iOS Info.plist Bluetooth keys live in `tauri.ios.conf.json` (merged at gen time)
- Field QA: follow `intel/DEVICE-QA.md` on real DUT

## Refactors applied

- Centralized BLE selection in `src/ble/factory.ts`
- Demo Fake seeding moved out of `useSensorsStore`
- Share / keep-awake gained default platform paths without changing call sites
