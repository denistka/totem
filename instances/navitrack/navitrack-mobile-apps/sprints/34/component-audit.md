# S34 Component Audit — Vue files under `navitrack-apps/src`

**Sprint:** S34 — Vue Component Refactoring  
**Target:** All components &lt;150 lines; mark ≥150 as `refactor`.

| Path | Lines | Status |
|------|------:|--------|
| navitrack-apps/src/features/tracking/components/TrackRequestForm.vue | 484 | refactor |
| navitrack-apps/src/features/reports/components/ReportForm.vue | 358 | refactor |
| navitrack-apps/src/features/map/components/VehicleInfoWindow.vue | 351 | refactor |
| navitrack-apps/src/features/settings/views/SettingsView.vue | 338 | refactor |
| navitrack-apps/src/features/vehicles/views/VehiclesView.vue | 329 | refactor |
| navitrack-apps/src/components/common/shader-loader/ShaderLoader.vue | 322 | refactor |
| navitrack-apps/src/features/vehicles/components/VehicleItem.vue | 292 | refactor |
| navitrack-apps/src/features/vehicles/components/VehicleDetailsCard.vue | 292 | refactor |
| navitrack-apps/src/components/common/shader-loader/ShaderRendererWebGPU.vue | 274 | refactor |
| navitrack-apps/src/features/events/views/EventsView.vue | 218 | refactor |
| navitrack-apps/src/components/common/shader-loader/SceneRendererWasmOrTs.vue | 215 | refactor |
| navitrack-apps/src/features/tracking/views/TrackingView.vue | 210 | refactor |
| navitrack-apps/src/features/tracking/components/TrackMap.vue | 194 | refactor |
| navitrack-apps/src/components/ui/Modal.vue | 184 | refactor |
| navitrack-apps/src/components/ui/NtInput.vue | 180 | refactor |
| navitrack-apps/src/features/auth/views/OtpView.vue | 176 | refactor |
| navitrack-apps/src/features/map/components/MapTypeSelector.vue | 173 | refactor |
| navitrack-apps/src/components/layout/AppHeader.vue | 172 | refactor |
| navitrack-apps/src/components/layout/AppLayout.vue | 165 | refactor |
| navitrack-apps/src/features/auth/components/SlintLoginForm.vue | 161 | refactor |
| navitrack-apps/src/components/ui/Toast.vue | 159 | refactor |
| navitrack-apps/src/components/common/shader-loader/ShaderRendererWebGL.vue | 158 | refactor |
| navitrack-apps/src/features/auth/views/BlockedView.vue | 154 | refactor |
| navitrack-apps/src/features/map/views/MapView.vue | 147 | ok |
| navitrack-apps/src/features/reports/views/ReportView.vue | 146 | ok |
| navitrack-apps/src/features/reports/views/ReportsView.vue | 145 | ok |
| navitrack-apps/src/components/ui/NtDateTimeRange.vue | 141 | ok |
| navitrack-apps/src/features/auth/components/LoginForm.vue | 140 | ok |
| navitrack-apps/src/features/vehicles/components/VehicleSearch.vue | 139 | ok |
| navitrack-apps/src/features/auth/components/OtpInput.vue | 131 | ok |
| navitrack-apps/src/features/map/components/MapControls.vue | 130 | ok |
| navitrack-apps/src/components/layout/BottomNav.vue | 112 | ok |
| navitrack-apps/src/components/ui/NavigationTrackIcon.vue | 111 | ok |
| navitrack-apps/src/features/map/components/MapContainer.vue | 109 | ok |
| navitrack-apps/src/features/map/components/GeofenceLayer.vue | 109 | ok |
| navitrack-apps/src/components/TechBackground.vue | 109 | ok |
| navitrack-apps/src/components/ui/Input.vue | 107 | ok |
| navitrack-apps/src/features/tracking/views/HistoryView.vue | 106 | ok |
| navitrack-apps/src/features/tracking/components/PlaybackControls.vue | 104 | ok |
| navitrack-apps/src/features/auth/components/BiometricPrompt.vue | 103 | ok |
| navitrack-apps/src/App.vue | 102 | ok |
| navitrack-apps/src/components/ui/NavitrackLogotype.vue | 101 | ok |
| navitrack-apps/src/features/auth/views/LoginView.vue | 100 | ok |
| navitrack-apps/src/components/ui/icons/Icon.vue | 96 | ok |
| navitrack-apps/src/features/tracking/components/PointDetails.vue | 94 | ok |
| navitrack-apps/src/features/settings/components/SettingsSelect.vue | 94 | ok |
| navitrack-apps/src/components/layout/AppSidebar.vue | 94 | ok |
| navitrack-apps/src/components/ui/Spinner.vue | 91 | ok |
| navitrack-apps/src/components/ui/NtGlass.vue | 91 | ok |
| navitrack-apps/src/features/vehicles/components/SelectionBar.vue | 87 | ok |
| navitrack-apps/src/components/ui/LogoEzkiz.vue | 87 | ok |
| navitrack-apps/src/features/settings/components/SettingsToggle.vue | 84 | ok |
| navitrack-apps/src/features/vehicles/components/FuelGauge.vue | 83 | ok |
| navitrack-apps/src/features/auth/components/GoogleSignInButton.vue | 80 | ok |
| navitrack-apps/src/features/reports/components/ReportCard.vue | 79 | ok |
| navitrack-apps/src/features/map/components/GeofenceToggle.vue | 78 | ok |
| navitrack-apps/src/features/tracking/components/EventItem.vue | 70 | ok |
| navitrack-apps/src/features/settings/components/SettingsNumberInput.vue | 69 | ok |
| navitrack-apps/src/features/tracking/components/TrackColorPicker.vue | 68 | ok |
| navitrack-apps/src/features/vehicles/components/CallDriverButton.vue | 67 | ok |
| navitrack-apps/src/features/tracking/components/DateQuickPicker.vue | 67 | ok |
| navitrack-apps/src/features/reports/components/ShareMenu.vue | 63 | ok |
| navitrack-apps/src/components/SplashScreen.vue | 62 | ok |
| navitrack-apps/src/features/map/components/FitAllButton.vue | 58 | ok |
| navitrack-apps/src/components/ui/NtButton.vue | 58 | ok |
| navitrack-apps/src/features/vehicles/components/VehicleStatus.vue | 55 | ok |
| navitrack-apps/src/components/OfflineBanner.vue | 54 | ok |
| navitrack-apps/src/features/tracking/components/VehicleSelector.vue | 53 | ok |
| navitrack-apps/src/features/tracking/components/TrackList.vue | 53 | ok |
| navitrack-apps/src/components/ui/NtSelect.vue | 53 | ok |
| navitrack-apps/src/components/ui/Button.vue | 45 | ok |
| navitrack-apps/src/components/ErrorBoundary.vue | 45 | ok |
| navitrack-apps/src/features/reports/components/ReportsList.vue | 44 | ok |
| navitrack-apps/src/components/ui/ToastContainer.vue | 44 | ok |
| navitrack-apps/src/features/settings/components/SettingsSection.vue | 43 | ok |
| navitrack-apps/src/features/reports/components/ReportTable.vue | 42 | ok |
| navitrack-apps/src/features/vehicles/components/DirectionArrow.vue | 41 | ok |
| navitrack-apps/src/features/events/components/ThresholdSlider.vue | 40 | ok |
| navitrack-apps/src/components/OfflineHandler.vue | 40 | ok |
| navitrack-apps/src/features/tracking/components/TrackSummary.vue | 36 | ok |
| navitrack-apps/src/features/events/components/EventToggle.vue | 36 | ok |
| navitrack-apps/src/features/vehicles/components/VehicleList.vue | 34 | ok |
| navitrack-apps/src/components/layout/PageTransition.vue | 33 | ok |
| navitrack-apps/src/components/ui/Skeleton.vue | 29 | ok |
| navitrack-apps/src/components/ui/Card.vue | 29 | ok |
| navitrack-apps/src/features/tracking/components/HistorySummary.vue | 26 | ok |
| navitrack-apps/src/features/tracking/components/EventList.vue | 23 | ok |
| navitrack-apps/src/features/auth/views/SplashView.vue | 23 | ok |
| navitrack-apps/src/components/layout/PageLayout.vue | 22 | ok |
| navitrack-apps/src/components/Background.vue | 17 | ok |
| navitrack-apps/src/components/ui/NtFormField.vue | 15 | ok |
| navitrack-apps/src/features/vehicles/components/VehicleItemSkeleton.vue | 14 | ok |
| navitrack-apps/src/features/auth/views/NotFoundView.vue | 12 | ok |

---

## Critical / high (from S34.ptl)

| Component | Lines | Status | Note |
|-----------|------:|--------|------|
| TrackRequestForm.vue | 484 | refactor | Critical |
| ReportForm.vue | 358 | refactor | High |
| VehicleInfoWindow.vue | 351 | refactor | High |
| SettingsView.vue | 338 | refactor | High |
| LoginView.vue | 100 | ok | Already &lt;150 |
| SouthernLightsBg | — | N/A | No such file; shader/background: ShaderLoader (322), ShaderRendererWebGPU (274), SceneRendererWasmOrTs (215), TechBackground (109) — treat shader-loader set as refactor target |

**Summary:** 93 `.vue` files; 23 with ≥150 lines (refactor), 70 ok.
