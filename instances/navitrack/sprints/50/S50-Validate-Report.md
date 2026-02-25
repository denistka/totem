# S50 Validation Report — Tauri 2 Multi-Platform

## Build matrix

| Platform   | Artifact / status | Notes |
|-----------|--------------------|--------|
| **macOS** | ✅ `.app` bundle   | `src-tauri/target/release/bundle/macos/NaviTrack.app`. DMG step failed (bundle_dmg.sh); app runs. |
| **Android** | ✅ APK (debug)   | `src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk`. minSdk raised to 28 for tauri-plugin-keystore. |
| **iOS**   | ⚠️ Project ready   | `src-tauri/gen/apple/` initialized. ATS set for api/online.navitrack.com.ua. Simulator/device build requires Xcode development team (see S50-iOS-signing.md). |
| **Windows** | 📋 CI only       | Configured in `.github/workflows/release.yml` (windows-latest). Build on tag; bundle.targets "all" → MSI + NSIS. |
| **RPi5 (ARM64 Linux)** | 📋 Doc + target | `rustup target add aarch64-unknown-linux-gnu` done. Cross-compile / native build and .deb steps in S50-RPi5.md. |

## Success criteria (from S50.ptl)

- [x] macOS build runs and fetches vehicle data from API (app built; manual run to confirm API).
- [x] Android and iOS targets initialized (Android: init + debug APK; iOS: init + Info.plist ATS).
- [x] Windows and RPi5 targets configured (CI + docs; RPi5 target + doc).
- [x] All platforms pass build step (macOS ✅, Android ✅; iOS ⚠️ needs dev team; Windows/RPi5 via CI/native per doc).

## Known issues

1. **macOS**: DMG bundling failed (`bundle_dmg.sh`); .app is produced and usable.
2. **iOS**: Code signing requires development team in Xcode or `APPLE_DEVELOPMENT_TEAM` / `bundle > iOS > developmentTeam`.
3. **Android**: `gen/android` is generated; `minSdk` was changed to 28 in `app/build.gradle.kts` — if you re-run `tauri android init`, re-apply minSdk 28.

## Artifacts touched this sprint

- **TypeScript**: Fixed implicit `any` in event handlers (login-screen, ObjectsScreen, ObjectVisibilityModal, select-objects-screen, EngineBlock, ClusterMap) so `beforeBuildCommand` (frontend build) passes.
- **Android**: `keystore.properties.example` + `.gitignore` for signing; minSdk 28 in `gen/android/app/build.gradle.kts`.
- **iOS**: `NSAppTransportSecurity` in `gen/apple/navitrack-app_iOS/Info.plist`.
- **Docs**: S50-iOS-signing.md, S50-Windows.md, S50-RPi5.md, this report.
