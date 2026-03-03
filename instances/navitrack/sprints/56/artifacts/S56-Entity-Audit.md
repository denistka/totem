# S56-Entity-Audit — Header, Loader, Modal, Player, Query (Consolidation Targets)

**Task:** S56-TC1-Entity-Audit  
**Scope:** `navitrack-apps/src-client` (and draft where relevant). No new entities; audit only.

---

## 1. Header

**Current:** Per-screen header usage; no single AppHeader.

- **MobileHeader** (`components/mobile-header.tsx`): Title, overlay, back, loading (LogoLoader). Used by: ObjectsScreen, ObjectDetailsScreen, MapScreen, TrackingScreen, ReportsScreen, ReportFormView, GeneratingReportView, etc.
- **DevHeader** (`components/dev-header.tsx`): Dev-only top bar.
- **Effect:** Each screen composes its own header; title and actions are local. No shared header mode or collapsed/expanded system bar.

**Consolidation target:** One **AppHeader** (or single header component) driven by **headerMode** + **headerViewState** (collapsed/expanded, context). All screens use it; no per-page header variants.

---

## 2. Loader

**Current:** Multiple patterns; no single GlobalLoader with modes.

- **LoadingOverlay** (`components/ui/LoadingOverlay.tsx`): Full-area overlay with LogoLoader + optional message. Used by: ObjectsScreen, ObjectDetailsScreen, MapScreen, ClusterMap, LoginScreen, etc.
- **LogoLoader** (`components/ui/logo-loader.tsx`): Inline spinner (header, buttons).
- **Per-screen** `loading` prop passed from ScreenRouter/vehiclesLoading or local state. No distinction between fullContent / fullScreen / notification.

**Consolidation target:** One **GlobalLoader** with state: `mode: 'fullContent' | 'fullScreen' | 'notification'`. All loading flows set this state; one overlay component renders by mode. No duplicate LoadingOverlay per feature.

---

## 3. Modals

**Current:** Several modal patterns; no single SmartSelectableModal.

- **BottomModal** (`components/ui/bottom-modal.tsx`): Base bottom sheet.
- **BottomSelectModal** (`components/bottom-select-modal.tsx`): List + select (used for report type, company, vehicle in ReportFormView; vehicle in TrackingScreen). Search/list/multi-select pattern repeated.
- **ObjectVisibilityModal** (`screens/objects-screen/ObjectVisibilityModal.tsx`): Object show/hide list (BottomModal + list).
- **DateRangePicker** uses BottomModal for calendar.
- **Dialog** (Radix): EngineBlock (safe stop / emergency stop). Different pattern (center dialog).

**Consolidation target:** One **SmartSelectableModal** pattern (search + list + single/multi-select). Reuse for: report type, companies, vehicles, object visibility. Radix Dialog for simple confirm/alert; bottom sheet for selection. No duplicate BottomSelectModal per screen.

---

## 4. PlaybackControls / MapEngine / QueryValidator

**Current:**

- **ClusterMap** (`features/map/ClusterMap.tsx`): Map + vehicles; VehicleInfoPopup for detail. No dedicated “PlaybackControls” component in src-client; tracking screen has form (vehicle, date range, events) and submits track request. Playback (point-by-point) and map sync are future or partial.
- **MapEngine:** Map is Leaflet/ClusterMap; no separate MapEngine abstraction.
- **Query building:** TrackingScreen and ReportFormView build request (vehicleId, start, end, eventIds; bunchId, companyIds, vehicleIds, start, end, partition, type) in screen/fragment. No shared QueryValidator or query-builder module; validation is ad hoc (e.g. required fields).

**Consolidation target:** One **QueryValidator** (or query-builder) for Tracking and one for Reports: build → validate → submit. One **PlaybackControls** (or equivalent) for tracking playback when implemented; one map abstraction (**MapEngine** or single map component) for track display. Behavior by state, not multiple component variants.

---

## 5. Duplication map and consolidation summary

| System | Current | Target |
|--------|---------|--------|
| Header | MobileHeader per screen; no mode/state | One AppHeader; headerMode + headerViewState |
| Loader | LoadingOverlay + LogoLoader; no modes | One GlobalLoader; fullContent / fullScreen / notification |
| Modal | BottomModal, BottomSelectModal, ObjectVisibilityModal, Dialog | One SmartSelectableModal pattern; Radix for confirm |
| Query | Request built in TrackingScreen, ReportFormView | One QueryValidator (tracking), one (reports); centralize validation |
| Player/Map | ClusterMap, VehicleInfoPopup; no playback component | One PlaybackControls concept; one MapEngine/map component |

**Constraint:** No new entities without audit. This audit defines the consolidation targets; implementation follows state architecture approval (TC2).

---

*Planning only — no code changes.*
