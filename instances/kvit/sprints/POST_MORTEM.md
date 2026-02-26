# KVIT Test Assignment — Post-Mortem (2026-02-26)

**Result:** ❌ REJECTED

## Issues Found by Reviewer

| #   | Issue                                            | Category          | Severity |
| --- | ------------------------------------------------ | ----------------- | -------- |
| 1   | Mixed lock files (npm + pnpm)                    | Tooling           | HIGH     |
| 2   | Inconsistent state access (useStore vs direct)   | Architecture      | HIGH     |
| 3   | MapContainer full re-render on collection change | Performance       | HIGH     |
| 4   | `private authStore: any`                         | Typing            | MEDIUM   |
| 5   | Unused `reconnectTimeout` variable               | Dead Code         | MEDIUM   |
| 6   | No linter/prettier in project                    | Tooling           | HIGH     |
| 7   | Mixed MUI + raw CSS                              | Style Consistency | MEDIUM   |
| 8   | WebSocket error on registration                  | Delivery          | CRITICAL |

## Rules Generated

All issues were abstracted into universal Totem rules:

- `core/QUALITY_GATES.ti` — NEW, pre-delivery checklist
- `guardians/ARCHITECT.ti` — state-management, style-discipline sections added
- `guardians/QA.ti` — delivery-gates, dead code gates added
- `guardians/DEVOPS.ti` — single lock file, tooling baseline added
- `core/OPTIMIZER.ti` — "delivery is a user flow" lesson added

## Key Lesson

> Код может быть хорошим, но если `git clone → install → start` не работает идеально,
> рецензент не дойдёт до кода. Delivery — это первый тест.
