# S06 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| Shared UI | Settings uses Input / Button / ToggleLabelSwitchRow / LanguageSelector |
| React | Thin screens; logs via useSyncExternalStore |
| Tauri | Share stub only |
| Tests | Hub RTL + Settings/Logs/About co-located |

## Smells / actions

- Language store (`ua`) vs i18n (`uk`) still separate; LanguageSelector owns i18n — OK for now
- Ready for S07 scanner wiring into SensorsScreen
