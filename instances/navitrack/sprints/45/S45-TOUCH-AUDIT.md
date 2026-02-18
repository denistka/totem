# S45 Touch Target Audit — Measure All Interactive Elements

**Status:** Completed 2026-02-18
**Resolution:** 390x844 (Mobile)
**Standards:** Apple HIG (44x44px minimum), Material 3 (48x48px recommended).

## 1. Audit Table (Interactive Elements)

| Component / Screen  | Element               | Measured Size   | Severity    | Recommendation                                   |
| ------------------- | --------------------- | --------------- | ----------- | ------------------------------------------------ |
| **Global UI**       | Button (default)      | h-10 (40px)     | 🟡 WARNING  | Update to `h-12` (48px)                          |
| **Global UI**       | Button (sm)           | h-9 (36px)      | 🟡 WARNING  | Update to `h-11` (44px)                          |
| **Global UI**       | Switch                | h-9 (36px)      | 🟡 WARNING  | Increase to 44px height                          |
| **Global UI**       | ThemeToggle           | h-11 (44px)     | 🟢 PASS     | OK                                               |
| **Objects Screen**  | Search Input          | h-9 (36px)      | 🟡 WARNING  | Update to `h-11` (44px)                          |
| **Objects Screen**  | Vehicle List Item     | h-~80px         | 🟢 PASS     | Row is clickable                                 |
| **Objects Screen**  | Settings Button       | h-11 (44px)     | 🟢 PASS     | OK                                               |
| **Object Details**  | Tabs (History/Events) | py-3 (~40px)    | 🟡 WARNING  | Increase to `py-4` (44px+)                       |
| **Object Details**  | Event Checkboxes      | h-6 (24px)      | 🔴 CRITICAL | Row clickable, but icon needs visual 44px target |
| **Object Details**  | Summary Cells         | py-2.5 (~36px)  | 🟡 WARNING  | Increase padding/height                          |
| **Tracking Screen** | Date Buttons          | h-11 (44px)     | 🟢 PASS     | OK                                               |
| **Tracking Screen** | Color/Width Sliders   | h-2 (8px track) | 🔴 CRITICAL | Wrap in `touch-range-container` (44px)           |
| **Tracking Screen** | Event Toggles         | h-11 (44px)     | 🟢 PASS     | OK                                               |
| **Map Screen**      | Layer Switcher        | py-1 (~28px)    | 🔴 CRITICAL | Increase chip height to 44px                     |
| **Settings Screen** | Language Select       | h-11 (44px)     | 🟢 PASS     | OK                                               |
| **Settings Screen** | Input Rows (Value)    | py-2 (~32px)    | 🔴 CRITICAL | Increase hit area for numeric adjustments        |
| **Select Objects**  | Search Input          | h-11 (44px)     | 🟢 PASS     | OK                                               |
| **Select Objects**  | Object Checkboxes     | h-11 (44px)     | 🟢 PASS     | OK                                               |

## 2. Visual Regression / Broken Paddings

1. **Objects Screen Header**:
   - Search bar is cramped between the logo and settings icon.
   - Needs `gap-4` or more explicit width constraints to avoid overlapping visual artifacts.
2. **Object Details Info Section**:
   - The vehicle info (Plate/Name) uses `text-xs` for details, which is readable but the vertical gap between lines is minimal (squashed).
3. **Map Attribution**:
   - Leaflet attribution overlaps with the gradient blur of the bottom navigation.
4. **Bottom Navigation Labels**:
   - Text label is very close to the bottom edge. On devices with home indicators (iPhone), this may be obscured. Needs `pb-safe` or more padding.
5. **Tracking Range Labels**:
   - "From" and "To" labels are too close to the trigger buttons. Needs consistent block spacing.

## 3. Recommended Fix Plan

1. **P1 (Critical)**:
   - Fix Sliders in `TrackingScreen` (add 44px hit area).
   - Fix Layer Switcher in `ClusterMap` (increase chip height).
   - Fix Settings numeric input hit areas.
2. **P2 (Warnings)**:
   - Update `Switch` component to 44px height.
   - Update `ObjectsScreen` search input to `h-11` minimum.
   - Increase `ObjectDetails` tab height.
3. **P3 (Visual Polish)**:
   - Fix header spacing in `ObjectsScreen`.
   - Add extra bottom padding to navigation labels.
   - Improve spacing in `TrackingScreen` sections.

---

**Audit performed by:** Antigravity (ARCHITECT)
