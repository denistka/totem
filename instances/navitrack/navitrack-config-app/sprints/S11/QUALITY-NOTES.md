# S11 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| i18n | Advanced + password/graduation keys in en/uk/ru |
| Permissions | `src/ble/permissions.ts` + README platform notes |
| Keep-awake | Injectable adapter + session hook |
| Share | Unified helper wired to logs / settings / graduation |

## Smells / actions

- Real Tauri permission / wake-lock / share plugins still stubs — API ready
- StandardModeTab share test uses dataset via share fallback when clipboard available
