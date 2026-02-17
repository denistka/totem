# S43 Audit: navitrack-apps/react-app structure

## 1. Entry points and render tree

- **main.tsx**: Renders `StrictMode` → `ErrorBoundary` → `App`. Imports: `./ErrorBoundary`, `./i18n`, `./App`, `./index.css`. No router (single state-based navigation).
- **App.tsx**: Renders `MobileShell` and `Toaster` (sonner). No routes.
- **Render tree**: `App` → `MobileShell` → (auth gate) → either `LoginScreen` or tabbed area with `ObjectsScreen` | `MapScreen` | `TrackingScreen` | `ReportsScreen` | `ObjectDetailsScreen` | `SettingsScreen` | `SelectObjectsScreen` | `AccountSecurityScreen`. Navigation is state in `MobileShell` (`useState<AppScreen>`); `lib/navigation.ts` provides only types and `TABS` constant.

## 2. File inventory (used / unused)

### Used (in render or imported by used code)

| Path | Imported by |
|------|-------------|
| main.tsx | entry |
| App.tsx | main.tsx |
| ErrorBoundary.tsx | main.tsx |
| index.css | main.tsx |
| i18n.ts | main.tsx |
| components/mobile-shell.tsx | App.tsx |
| components/screens/* (all 9 screens) | mobile-shell.tsx |
| components/screens/index.ts | (barrel; screens imported directly by mobile-shell) |
| components/mobile-header.tsx | objects, map, tracking, reports, settings, account-security, select-objects, object-details |
| components/theme-toggle.tsx | settings-screen.tsx |
| components/date-range-picker.tsx | reports-screen.tsx, tracking-screen.tsx |
| components/ui/* | various screens, features, pages |
| lib/navigation.ts | mobile-shell.tsx |
| lib/api.ts | mobile-shell, useAuth, pages (pages are unused but api is used) |
| lib/utils.ts | components/ui/* |
| hooks/useAuth.ts | mobile-shell.tsx, (pages) |

### Unused (never imported, or only imported by unused code)

| Path | Reason |
|------|--------|
| components/RequireAuth.tsx | Never imported anywhere |
| pages/Login.tsx | Never imported |
| pages/Dashboard.tsx | Never imported |
| pages/Settings.tsx | Never imported |
| pages/Tracking.tsx | Never imported |
| pages/Reports.tsx | Never imported |
| features/map/ClusterMap.tsx | Only imported by pages/Dashboard.tsx (unused) |
| features/map/VehicleMarker.tsx | Only imported by ClusterMap.tsx (unused chain) |
| features/control/EngineBlock.tsx | Only imported by pages/Settings.tsx (unused) |
| features/reports/ReportTable.tsx | Only imported by pages/Reports.tsx (unused) |
| components/map/PlaybackControl.tsx | Only imported by pages/Tracking.tsx (unused) |

## 3. Duplicate feature map (screen vs page)

| Feature | In-use implementation | Unused (built, not wired) |
|---------|------------------------|----------------------------|
| Login | screens/login-screen.tsx | pages/Login.tsx |
| Map | screens/map-screen.tsx (placeholder SVG) | pages/Dashboard.tsx uses features/map/ClusterMap.tsx |
| Settings | screens/settings-screen.tsx | pages/Settings.tsx uses features/control/EngineBlock.tsx |
| Reports | screens/reports-screen.tsx (inline sample table) | pages/Reports.tsx uses features/reports/ReportTable.tsx |
| Tracking | screens/tracking-screen.tsx | pages/Tracking.tsx uses components/map/PlaybackControl.tsx |
| Objects / Dashboard | screens/objects-screen.tsx | pages/Dashboard.tsx (map + vehicles) |

S42 deliverables (ClusterMap, EngineBlock, ReportTable, PlaybackControl) exist under `features/` and `components/map/` but are only used by `pages/*`, which are not in the render tree.

## 4. Recommendation and migration steps for T2

**Recommendation: Option B — Keep MobileShell + screens, delegate to features, remove pages.**

- **Pros**: Preserves the current working app and state-based navigation; single structure (one Login, one Map, etc.); reuses S42 feature components inside screens; no risk of breaking auth or shell behavior.
- **Cons**: No URL-based routing (state-only navigation remains).

### Migration steps for T2

1. **Wire features into screens (single source of truth per feature)**  
   - **MapScreen**: Replace placeholder SVG with `ClusterMap`; pass `vehicles` from MobileShell (already loaded there) via props or context so MapScreen can show real vehicle markers.  
   - **SettingsScreen**: Add an optional section or collapsible that renders `EngineBlock` (e.g. when a vehicle is in context, or a generic “Engine block” block).  
   - **ReportsScreen**: When report data is available (e.g. from `getApiClient().getReport(...)`), render `ReportTable` for the result view; keep existing form UI for filters and “Build report”.  
   - **TrackingScreen**: Optionally add `PlaybackControl` for playback when track data exists; keep existing date/vehicle/events UI.

2. **Remove pages and router usage if unused**  
   - Delete `pages/Login.tsx`, `pages/Dashboard.tsx`, `pages/Settings.tsx`, `pages/Tracking.tsx`, `pages/Reports.tsx`.  
   - In `main.tsx`, remove `BrowserRouter` wrapper if no `<Route>` will be used (optional; can keep for future use).

3. **Preserve**  
   - `lib/api.ts`, `hooks/useAuth.ts`, `components/ui/*`, `i18n`, PWA config, ErrorBoundary. Do not break auth flow or API client.

### T3 (after T2)

- Delete `components/RequireAuth.tsx` (zero imports).  
- Delete no other files that are imported after T2; features/* and components/map/PlaybackControl become used by screens.  
- Update barrel `components/screens/index.ts` only if any screen is removed; otherwise leave as-is.  
- Run `pnpm run build` and `pnpm run lint` and fix any broken imports.

---

## 5. T3 deleted files (S43 consolidation)

- `navitrack-apps/react-app/src/pages/Login.tsx`
- `navitrack-apps/react-app/src/pages/Dashboard.tsx`
- `navitrack-apps/react-app/src/pages/Settings.tsx`
- `navitrack-apps/react-app/src/pages/Tracking.tsx`
- `navitrack-apps/react-app/src/pages/Reports.tsx`
- `navitrack-apps/react-app/src/components/RequireAuth.tsx`
