# S82 — Architect v4.1 baseline (seeded snapshot)

**Purpose:** Ground sprint S82 in measured state. **Immutable reference row** for the original seed; later rows go to §5 changelog only (do not rewrite history).

**Refresh:** After major merge run `pnpm codemap`, `pnpm lint`, `pnpm dupes:jscpd` from `navitrack-apps/src-client` and append §5 — see `metric_lock` + `post_sprint_guards` in `sprints/82/S82-ARCHITECT-V4-FULL-OPTIMIZATION.ptl`.

**Seeded:** 2026-04-08 (matches `codemap.json` `generatedAt`).

---

## 1. Codemap (`pnpm codemap` → `codemap.json`)

| Field | Value |
|--------|--------|
| `generatedAt` | `2026-04-08T12:12:28.379Z` |
| `summary.files` | **377** (entire `src-client` tree) |
| `summary.lines` | **33 034** |
| `summary.bytes` | 1 760 697 |
| `root` | `navitrack-apps/src-client` |

**Note:** `jscpd` analyzes `src/` only → **319** files in that run; smaller scope than full codemap.

---

## 2. ESLint (`pnpm lint`) — SonarJS snapshot

**Totals:** **40** problems, **0** errors, **40** warnings (all actionable under `sonarjs/*`).

### By rule (grouped)

| Rule | Approx. count | Theme |
|------|----------------|--------|
| `sonarjs/no-nested-conditional` | 22 | nested ternary → early return / helper |
| `sonarjs/cognitive-complexity` | 7 | extract branches / helpers |
| `sonarjs/slow-regex` | 4 | safer patterns (`humanizeReportColumnKey`, `ObjectListItem`, `vehicle-name`) |
| `sonarjs/no-nested-functions` | 2 | `useObjectDetailsScreen`, `useTrackingState` |
| `sonarjs/void-use` | 2 | `useMobileShell`, `i18n.ts` |
| `sonarjs/no-duplicated-branches` | 1 | `TrackingEventPicker` |
| `sonarjs/use-type-alias` | 1 | `report-transforms.ts` |
| `sonarjs/concise-regex` | 1 | `reportTableModel.ts` |

### Files touched (lint warnings)

- `src/api/client.ts`, `report-api.ts`, `report-transforms.ts`
- `src/app/global-loader.tsx`, `useMobileShell.ts`
- `src/config/i18n.ts`
- `src/modules/map/MapPopupFactory.tsx`, `popup-fuel.ts`
- `src/modules/reports/VirtualizedReportTable.tsx`, `humanizeReportColumnKey.ts`, `reportTableModel.ts`
- `src/screens/login/components/LoginFormFields.tsx`
- `src/screens/map/MapScreenToolbars.tsx`
- `src/screens/notification-settings/.../NotificationEventTogglesPanel.tsx`
- `src/screens/object-details/hooks/useObjectDetailsScreen.ts`
- `src/screens/objects/ObjectListItem.tsx`, `utils.ts`
- `src/screens/reports/modules/FiltersPanelHeader.tsx`, `FiltersPanelSections.tsx`, `ReportHistoryView.tsx`
- `src/screens/tracking/components/TrackingEventPicker.tsx`, `TrackingRouteMapChrome.tsx`, `track-layers/StaticTrackLayer.tsx`
- `src/screens/tracking/hooks/useTrackingState.ts`
- `src/ui/bottom-select-modal.tsx`
- `src/utils/vehicle-name.ts`

**S82 tasks:** `S82-TL0-sonarjs-warnings-sweep.pd` (clear or document suppressions with rationale).

---

## 3. jscpd (`pnpm dupes:jscpd`) — clone inventory

**Post–S82-TS0 (2026-04-08):** **0** clones, **0** duplicated lines / tokens (full `src` scan).

### Resolved (was baseline §3 — now SSOT’d)

| Former pair | Resolution |
|-------------|------------|
| FiltersPanelHeader ↔ TrackingScreenHeader | `lib/format-header-date-span.ts` |
| useReportsFormState ↔ useTrackingScreenForm | `lib/screen-date-range-init.ts` |
| useHistoryTimeline ↔ useTrackingState | `hooks/useFormatDurationFromMs.ts` |
| Notification toggles ↔ SettingsField toggle | `ui/toggle-label-switch-row.tsx` |
| SettingsSections duplicate pairs | inline config arrays + `SettingsField` |
| icon-svg | `VehicleStrokeIcon` wrapper |
| reportTableModel | `rowIsTotalMarker` helper |
| DateRangePicker | `DateRangePickerRow` |
| report-transforms | `mapKeysToCells` |
| language-selector | shared `languageModal` subtree |
| theme.css | dark theme inherits green scale from `:root` |

**S82 tasks:** `S82-TS1` / `S82-TS2` focus on **semantic** dupes (matrix + further merges).

---

## 4. Delta vs S81 intel (`S81_DUPLICATION_AND_UNIFICATION.md`)

- S81 already notes jscpd + SonarJS qualitatively; **this doc** pins **exact** file:line inventory for S82 execution.
- S81 TK2: **no circular deps** (madge) — still valid until structure changes.
- **S82-only backlog** (beyond S81 tracks): FSD layer map, API client SSOT, path aliases, lazy routes, unit tests, quality-gate policy, **explicit** SonarJS zero-warn push, **explicit** jscpd clone list burn-down.

---

## 5. Refresh checklist (executor)

1. `pnpm codemap` — update §1 table if `summary.*` shifts.
2. `pnpm lint` — paste new warning count or confirm **0** warnings.
3. `pnpm dupes:jscpd` — update §3 or mark clones resolved.
4. Append row to changelog at bottom with date + command outputs (one line each).

### Changelog

| Date | codemap files | lint warnings | jscpd clones | Notes |
|------|---------------|---------------|--------------|--------|
| 2026-04-08 | 377 | 40 | 12 | Seeded baseline (pre-S82 execution) |
| 2026-04-08 | 377 | 40 | 12 | S82-T0 refresh: `codemap`/`lint`/`dupes:jscpd` re-run; codemap lines/bytes drift vs seed only |
| 2026-04-08 | 377 | 40 | 0 | S82-TS0: jscpd clone elimination (0 clones); new shared modules listed in §3 |
