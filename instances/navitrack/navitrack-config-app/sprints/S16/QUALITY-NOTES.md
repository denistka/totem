# S16 Quality Notes

Date: 2026-09-24  
Sprint: S16 — Design Shell Parity (Welcome + Structured Hub)

## Summary

Mix of mobile-apps chrome (Logo, glass, AppHeader expand sheet) with customer-structured IA (welcome splash → home tiles → catalog → session; installation report intro stub). One live BLE fuel DUT; catalog extensible via `comingSoon`.

## Changes Reviewed

| Task | Deliverable |
|------|-------------|
| T0 | `S16-INVARIANTS.md`, S01 §16 supersede, `S16_UX_IA` runtime mirror |
| T1 | `AppHeader` portal + expand/backdrop; welcome hides header |
| T5 | `DECISION-DESIGN-MIX.md` + tile→route + non-goals |
| T2/T3 | `WelcomeScreen` + splash asset + BLE readiness gate |
| T4 | `DutSettingsSections` in header sheet; settings hub tab removed |
| T6 | `HomeScreen` 2×2 glass tiles |
| T7 | `SENSOR_CATALOG` + `CatalogScreen` |
| T8 | `InstallationReportIntroScreen` stub (no wizard) |

## Code Quality

| Check | Result |
|-------|--------|
| Shared UI (`Button`, `Logo`, `Input`, `ThemeToggle`, …) | ✅ reused |
| React modularity | ✅ screens ≤150 lines; settings extracted |
| Tauri surface | ✅ no new native plugins; BLE readiness via existing probes |
| Design tokens / glass | ✅ mobile-apps patterns |
| Fleet strip | ✅ no logout / map / account |
| i18n en/uk/ru | ✅ welcome, home, catalog, report |

## Refactors Applied

- Removed transitional `settings.sheetStub` locale keys after T4 embedded real DUT settings.
- Settings hub tab removed from `HUB_TAB_IDS` / tab bar (aligned with `S16_UX_IA`).
- `DutSettingsSections` shared by sheet + legacy `SettingsScreen` deep link.

## Smells Noted (acceptable / deferred)

- Bottom tabs remain secondary shortcuts alongside home tiles (by design).
- `SettingsScreen` full-page retained for deep link / tests — not shown in tab bar.
- Installation report wizard deferred (explicit stub).

## Test Results

```
 Test Files  48 passed (48)
      Tests  187 passed (187)
```

## Closeout

- `bun run test` green ✅  
- All S16 `.pd` / `.ptl` → `gate: CLOSED`  
- Quality mandate satisfied; no follow-up `.pd` required for closeout smells
