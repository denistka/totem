# S08 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI | Input / Button on StandardModeTab |
| Protocol | 0x50 auth, 06/61 live, read E0→14→4D→C8→48, write chain, 47 cal |
| BLE | FakeBleAdapter autoRespond + adapter-transport bridge |
| Tests | Co-located Vitest covering gate → live → read/write/cal/share |

## Smells / actions

- Share is clipboard/dataset stub (native share later)
- Change-password / graduation / advanced tabs still placeholders
- Session store split into types + actions for file size
