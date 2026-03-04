# Project Audit Report — Sprint 63
**TI1 Artifact**

---

## 1. File Size Audit (>150 lines)

| File | Lines | Action |
|------|-------|--------|
| `src/lib/api.ts` | 366 | Split into `api-types.ts` + `api-client.ts` |
| `TrackingActionScreen.tsx` | 341 | Extract `TrackingMap`, `TrackingPlayback` hook |
| `DateRangePicker.tsx` | 307 | Extract sub-components (CalendarGrid, TimeInput) |
| `HistoryTab.tsx` | 306 | Extract `HistoryMap`, `HistoryEventList` |
| `TrackingScreen.tsx` | 262 | Extract query state form into `TrackingQueryForm` |
| `app-header.tsx` | 238 | Extract `HeaderSettingsMenu` sub-component |
| `ReportFormView.tsx` | 218 | Extract `ReportFilters`, `ReportDateRange` |
| `ObjectsScreen.tsx` | 192 | Acceptable — list view with badges |
| `map-screen.tsx` | 185 | Acceptable — map + floating controls |
| `mobile-shell.tsx` | 182 | Acceptable — app shell |

---

## 2. Duplicate Code Patterns

### 2.1 Duplicate `@layer` blocks in `index.css`
- `@layer utilities` appears at lines ~101 and ~629 (identical)
- `@layer components` appears at lines ~211 and ~735 (identical)
- **Action:** Merge or remove duplicate blocks

### 2.2 Repeated header slot setup (4 screens)
- `ObjectDetailsScreen`, `TrackingActionScreen`, `TrackingScreen` all do:
  ```tsx
  setHeaderMode('...')
  setHeaderViewState({ title: '...', backAction: onBack })
  ```
- **Action:** Extract `useHeaderSetup(mode, title, backAction)` hook

### 2.3 Repeated loading toast pattern (3 screens)
- `ObjectDetailsScreen`, `TrackingActionScreen`, `TrackingScreen` all do:
  ```tsx
  showToast('Loading...', 'loading', { id: '...' })
  // ... fetch ...
  dismissToast('...')
  ```
- **Action:** Extract `useApiLoader()` hook wrapping the pattern

### 2.4 Date range timestamp computation
- Repeated in `TrackingActionScreen` and `DateRangePicker`
- **Action:** Consolidate in `src/lib/date-utils.ts`

---

## 3. Unused/Dead Code

### Imports not used
- `Gauge, ParkingCircle` in `ObjectsScreen.tsx` (imported from lucide but only `MapPin, Search, Filter` used in render)
- `Activity` in `TrackingActionScreen.tsx`
- `setObjects` from store in `ObjectsScreen.tsx` (assigned but body not shown)

### Components potentially unused
- `VanIcon` in `vehicle-icons.tsx` — no vehicle type maps to 'van' currently
- `DictionaryMapped.swift` in iOS — unused by PWA

---

## 4. Unused Dependencies (package.json check needed)

Run: `npx depcheck src-client/` to confirm, but likely candidates:
- `@radix-ui/*` packages not used in components
- Old shadcn components not wired up

---

## 5. Architecture Gaps

| Gap | Impact | Recommendation |
|-----|--------|----------------|
| No barrel exports from `src/components/ui/` | Medium | Add `index.ts` re-exports |
| No barrel exports from `src/features/map/` | Low | Add `index.ts` |
| Duplicate CSS layer blocks | Low-Med | Remove duplicates |
| `api.ts` mixes types + client | Medium | Split into separate files |
| Vehicle icons spread across 2 files | Low | Consolidate in single `vehicle-icons` module |

---

## 6. Recommended Refactoring Roadmap

### Priority 1 (immediate value)
1. Extract `useHeaderSetup` hook — reduces ~10 lines per screen
2. Remove duplicate CSS layer blocks — fixes potential cascade issues
3. Remove unused imports from `ObjectsScreen` and `TrackingActionScreen`

### Priority 2 (next sprint)
4. Split `api.ts` into `api-types.ts` + `api-client.ts`
5. Split `TrackingActionScreen` → extract `TrackingMap` component
6. Split `HistoryTab` → extract `HistoryMap` component

### Priority 3 (future)
7. Extract barrel exports for `ui/` and `features/map/`
8. Split `DateRangePicker` into sub-components
9. Consolidate duplicate CSS layer definitions

---

## 7. Code Quality Summary

| Category | Score | Notes |
|----------|-------|-------|
| TypeScript coverage | 9/10 | All files use TS strictly |
| Component size | 6/10 | Several files >250 lines |
| Code duplication | 7/10 | Some patterns repeated 3× |
| Import hygiene | 7/10 | A few unused imports |
| CSS organization | 6/10 | Duplicate layer blocks |
| Architecture clarity | 8/10 | Good separation of concerns |
