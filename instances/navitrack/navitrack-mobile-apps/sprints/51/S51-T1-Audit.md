# S51-T1 Visual Audit — Component & Screen Mapping

Baseline for `navitrack-apps/src-client` → `navitrack-apps/draft/pwa-react-app-clear` migration.

---

## Primary Screens (src-client → pwa-react-app-clear)

| Screen | Old path | New target | Notes |
|--------|----------|------------|--------|
| Login | `screens/login-screen.tsx` | `pages/` or `features/auth/` | Glass inputs, glass-glow CTA |
| 2FA | `screens/two-factor-auth-screen.tsx` | same feature | Same design tokens |
| Map | `screens/map-screen.tsx` | features/map/ | ClusterMap, VehicleMarker, VehicleInfoPopup |
| Objects list | `screens/objects-screen/` | features/objects/ | ObjectVisibilityModal, vehicle-icons |
| Object details | `screens/object-details/` | features/object-details/ | EventsTab, HistoryTab |
| Reports | `screens/reports-screen/` | features/reports/ | ReportFormView, ReportResultView, ReportTable |
| Settings | `screens/settings-screen.tsx` | features/settings/ | SettingsModal exists in clear |
| Account security | `screens/account-security-screen.tsx` | features/settings/ | |
| Tracking | `screens/tracking-screen/` | features/tracking/ | TrackPreview |
| Select objects | `screens/select-objects-screen.tsx` | features/objects/ | |

---

## Global UI Components — Old → New Mapping

| Old (src-client) | New (pwa-react-app-clear) | Action |
|------------------|---------------------------|--------|
| `ui/button.tsx` | `ui/Button.tsx` | Add glass, glass-glow variants |
| `ui/input.tsx` | `ui/Input.tsx` | Add glass-input variant, data-state |
| `ui/dialog.tsx` | `ui/Modal.tsx` | Align API, glass-strong overlay |
| `ui/bottom-modal.tsx` | — | Port as Modal variant or Sheet |
| `ui/sheet.tsx` | — | Port if used |
| `ui/card.tsx` | — | Port as glass-card or use .glass |
| `ui/glass-button.tsx` | Button.tsx variant | Merge into Button (glass-glow) |
| `ui/glass-card.tsx` | — | Port or use .glass / .glass-strong |
| `ui/glass-input-wrapper.tsx` | Input.tsx wrapper | Port wrapper with icon slot |
| `ui/select.tsx` | `ui/Dropdown.tsx` | Align API |
| `ui/switch.tsx` | — | Port if needed |
| `ui/toast.tsx` / `sonner.tsx` | `ui/Toast.tsx` | Already in clear |
| `ui/LoadingOverlay.tsx` | — | Port to layout or ui |
| `ui/calendar.tsx`, `popover.tsx`, `label.tsx`, `separator.tsx` | — | Port on demand |

---

## Navigation / Layout

| Old | New | Notes |
|-----|-----|--------|
| `mobile-shell.tsx` | `layout/Footer.tsx` + routing | Bottom nav + ScreenRouter logic |
| `mobile-header.tsx` | `layout/Header.tsx` | Title, back, logo, settings |
| `app-bg.tsx` | `layout/Background.tsx` | Port anim layer + overlay, pulse |
| `bottom-select-modal.tsx` | Modal or Curtains | Selection sheets |
| `ScreenRouter.tsx` | App.tsx + pages/ | Route by screen state |

---

## Design Tokens to Port (S51-T2)

- From `src-client/src/styles/theme.css`: all `:root` and `.dark` vars (primary, glass-*, touch-*, app-bg-*).
- From `src-client/src/index.css`: keyframes (glass-input-pulse, rainbow-glow-pulse, object-badge-dot-pulse, app-bg-pulse), .glass, .glass-input, .glass-strong, .glass-glow, touch utilities, safe-area, scrollbar-hide.
- Map `.dark` → `html.theme-dark` in new app.

---

## Screenshots Checklist

- [ ] Login screen (light + dark)
- [ ] Map screen with markers (placeholder in clear; full map with Leaflet TBD)
- [ ] Objects list
- [ ] Object details (tabs)
- [ ] Reports (form + result)
- [ ] Settings + Account security
- [ ] Tracking screen
- [ ] Bottom nav + header variants
- [ ] Modals: bottom-select, visibility, settings

---

## S51 Migration Progress (copied into pwa-react-app-clear)

- **Auth**: LoginPage, useAuth, API login/getVehicles.
- **Navigation**: AppScreen, TabId, TABS, appStore (screen, navigate, goBack, loadVehicles).
- **Screens**: ObjectsScreen, MapScreen (placeholder), TrackingScreen, ReportsScreen, ObjectDetailsScreen (History + Events tabs), SelectObjectsScreen, SettingsScreen, AccountSecurityScreen, TwoFactorAuthScreen.
- **API**: Vehicle, VehicleInfo, DailyTrack, getVehicleDetails, getDailyTrack; ReportResponse, ReportTable types.
- **UI**: Logo, LoadingOverlay; glass/glassGlow in Button, glass variant in Input.
- **Not ported (optional next)**: Leaflet map in Object Details (HistoryTab map), ClusterMap/VehicleMarker/VehicleInfoPopup on Map screen; DateRangePicker; bottom-select modal; full Settings toggles (sound, icons, etc.).
