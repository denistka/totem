# S15 Invariants — Graduation Multi-Point DUT Write

Date: 2026-09-18
Depends: S01-INVARIANTS.md, S12-INVARIANTS.md

## Product Change

**S15 amends the S09/S12 invariant:** Graduation tab MAY now write a multi-point calibration table to the DUT via `Command_47`.

## Rules

| Invariant | Value / rule |
|-----------|--------------|
| Graduation → DUT multi-point write | Allowed via `Command_47` |
| `dutWriteCommand` | `COMMAND_47` |
| Standard mode owns 2-point cal | Yes (unchanged) |
| Max calibration ushorts | 64 (device limit) |
| Max graduation rows | 32 (fuel↔freq pairs) |
| Password gate | Required before write |
| Read-back verify | Optional via `Command_48` after write |

## Runtime Mirror

`src/config/invariants.ts`:

```ts
export const GRADUATION_PRODUCT_RULES = {
  mayWriteMultiPointToDut: true,
  dutWriteCommand: 'COMMAND_47' as const,
  standardOwnsTwoPointCal: true,
  maxCalibrationUshorts: 64,
  maxGraduationRows: 32,
} as const
```

## Backward Compatibility

- Local draft + share text remain (no behavior change).
- New `Write to device` button on Graduation tab (password-gated).
- Disclaimer updated to reflect write capability.
- Share file footer no longer states "NOT written".

## Amends

- `sprints/S09/DECISION.md` — superseded by S15 for multi-point write.
- `intel/S12-INVARIANTS.md` — row updated to reflect allowed write.
