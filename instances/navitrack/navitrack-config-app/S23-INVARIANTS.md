# S23 INVARIANTS — Field feedback: inputs, calibration, scan

Depends: [`S22-INVARIANTS.md`](S22-INVARIANTS.md). Date: 2026-10-14.

1. **Numbers are typed through `NumericInput`.** It's a text input with a numeric keypad; it can be emptied, has no leading zeros, and selects its value on focus. Don't use a controlled `type="number"` input: it snaps the last digit back.
2. **On iOS no field shows a caret** (`html[data-ios]`). Value fields select their text on focus instead.
3. **The scan hero keeps scroll room while collapsed** (viewport + 64 px), so a short list never loops between collapse and expand.
4. **Unlock can always be left:** Back (closes the keyboard first) or Cancel. A cancelled connect loop never touches a newer one.
5. **Calibration fields:** current level (live), min level, full tank frequency (Full mode — kept by user decision 2026-10-15), and max level chosen from 1024 / 2048 / 4096.
6. **Graduation is filled point by point.** Only points with a captured frequency are written to the sensor.
