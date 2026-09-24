# S82 — Semantic duplication matrix (cross-feature)

**Date:** 2026-04-08  
**Sources:** `S82_ARCHITECT_V4_BASELINE.md` (pre-TS0), `S81_DUPLICATION_AND_UNIFICATION.md`, codemap exports.

## Status vs TS0 (syntactic)

| Former jscpd pair | Status |
|-------------------|--------|
| Report ↔ tracking headers (date span) | **Done** — `lib/format-header-date-span.ts` |
| Reports ↔ tracking form date defaults | **Done** — `lib/screen-date-range-init.ts` |
| History timeline ↔ tracking duration copy | **Done** — `hooks/useFormatDurationFromMs.ts` |
| Notification toggles ↔ settings toggle row | **Done** — `ui/toggle-label-switch-row.tsx` |
| Other internal clones (picker, transforms, CSS, …) | **Done** in TS0 — see baseline §3 |

## Semantic rows (behavior-level; P0 first)

| Feature A | Feature B | Shared behavior | Files (indicative) | Proposed SSOT | Risk | Status |
|-----------|-----------|-----------------|-------------------|---------------|------|--------|
| Reports filters | Tracking screen | Date range UX, period chips | `modules/date-range-picker/*`, screen hooks | Keep picker module; hooks stay feature-scoped | M — different defaults | Open |
| Reports | Tracking | “Screen header” metadata row pattern | `FiltersPanelHeader`, `TrackingScreenHeader` | Optional `ui/screen-header-meta.tsx` if more screens adopt | L | Partial (date span only) |
| Object details history | Tracking | Map + track visualization | `HistoryMap*`, `TrackingMap*` | `modules/map/*` facades (existing registry) | M | Open (S81 TE/TD) |
| Objects list | Map clusters | Vehicle label / icon resolution | `ObjectListItem`, map layers | `utils/vehicle-name`, `VehicleIconRegistry` | L | Open |
| Settings | Notifications | List sections + modals | `SettingsSections`, `NotificationEventTogglesPanel` | Shared `ui` primitives (toggle row done) | L | Partial |
| Reports table | (API) | Column humanization + grand total | `humanizeReportColumnKey`, `reportTableModel` | `modules/reports/*` (current) | L | Stable |

## Rules

- No ghost paths: rows reference real modules under `navitrack-apps/src-client/src`.
- Runtime changes require explicit task (TS2/TS3/TA/TM), not this matrix alone.
