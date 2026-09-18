# S07 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI | Button + Logo on SensorsScreen |
| BLE | FakeBleAdapter default seed devices; store injectable |
| E2E | Playwright hub→scan→connect with web Fake demo devices |
| Tests | Co-located Vitest for store + screen |

## Smells / actions

- Default FakeBleAdapter seeds demo devices for web/e2e; production Tauri adapter swap via `setAdapter`
- Ready for S08 standard session to consume `selectedDeviceId`
