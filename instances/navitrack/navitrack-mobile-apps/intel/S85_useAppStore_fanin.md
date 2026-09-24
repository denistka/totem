# S85 — useAppStore importer audit

Grouped by primary concern (importers → slices touched).

## Shell / navigation / loader

- `app/useMobileShell.ts` — screen, navigate, goBack, selectedObjectId, vehicles, fetchVehicles, setLoading, resetCoreData
- `app/global-loader.tsx` — loadingState
- `app/App.tsx` — coreDataLoaded
- `app/app-header/use-app-header.ts` — headerMode, headerViewState, resetCoreData, setScreen, goBack

## Header chrome

- `hooks/useHeaderSetup.ts` — setHeaderMode, setHeaderViewState
- `hooks/useDynamicBackground.ts` — setBackgroundVariant
- `screens/reports/ReportsScreen.tsx` — setHeaderMode, setHeaderViewState (see `useReportsScreenHeader`)
- `screens/tracking/TrackingActionScreen.tsx` — setHeaderMode, setHeaderViewState
- `screens/settings/hooks/useSettingsState.ts` — setHeaderMode, setHeaderViewState
- `screens/object-details/hooks/useObjectDetailsScreen.ts` — setHeaderMode, setHeaderViewState, vehicles

## Map / fleet data

- `screens/map/map-screen.tsx` — zones, fetchZones, fetchVehicles

## Objects list (extracted in T5)

- ~~`screens/objects/ObjectsScreen.tsx`~~ → `useObjectsUiStore` for search / showHidden / setObjects

## Tracking

- `screens/tracking/hooks/useTrackingState.ts` — vehicles
- `screens/tracking/hooks/useTrackingScreenLaunch.ts` — setQuery, navigate

## Other

- `screens/notification-settings/hooks/useNotificationSettingsScreen.ts` — vehicles

## T5 slice choice

**Objects list UI** (`search`, `showHidden`, `setObjects`) → dedicated `src/store/useObjectsUiStore.ts` to reduce fan-in on `useAppStore.ts` for the list screen only. Further slices (header shell, loader) are backlog if metrics regress.
