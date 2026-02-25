# S50 Sprint Results — Tauri 2 Multi-Platform

Summary of work completed in Sprint 50 and follow-up sessions. For the build matrix and success criteria, see **S50-Validate-Report.md**.

---

## 1. Core S50 (from validation report)

- **macOS**: `.app` bundle builds and runs; DMG step failed (bundle_dmg.sh).
- **Android**: Debug APK; minSdk 28; `gen/android` configured.
- **iOS**: Project initialized in `gen/apple/`; ATS for api/online.navitrack.com.ua; simulator/device needs development team (S50-iOS-signing.md).
- **Windows / RPi5**: CI and docs (S50-Windows.md, S50-RPi5.md).
- **Frontend**: Implicit `any` fixes so `beforeBuildCommand` passes.

---

## 2. Android: Run app and auth

- **Login “invalid user or password”** (auth worked on macOS, failed on Android):
  - **UTF-8 Basic auth** in `src-client/src/lib/api.ts`: encode credentials with `TextEncoder` so non-ASCII works.
  - **tauri-plugin-http**: added `unsafe-headers` in `src-tauri/Cargo.toml` so `Authorization` is sent.
  - **Login errors**: differentiated “Network error” vs “Invalid username or password” in `login-screen.tsx`; `useAuth` / `mobile-shell` use `LoginResult` type.

---

## 3. Android: Emulator network

- **Emulator had no internet**:
  - Script: `scripts/android-emulator-internet.sh` (ADB path detection) to disable Wi‑Fi and use cellular for network.
  - Doc: `docs/ANDROID-EMULATOR-NETWORK.md`.
  - App: `usesCleartextTraffic="true"`, `network_security_config.xml` for API domains, INTERNET permission in `gen/android`.

---

## 4. iOS: Build and run

- **Development team**: `tauri.ios.conf.json` — `bundle.iOS.developmentTeam` (placeholder for CLI); S50-iOS-signing.md.
- **Simulator code signing**: In `gen/apple/.../project.pbxproj` — simulator-only overrides: `CODE_SIGN_IDENTITY[sdk=iphonesimulator*]=""`, `CODE_SIGNING_REQUIRED`/`ALLOWED=NO` so simulator builds without a team when needed.
- **Run script**: `scripts/ios-run-simulator.sh` — clean `gen/apple/build`, build `-t aarch64-sim`, install/launch from `src-tauri/gen/apple/build/arm64-sim/NaviTrack.app`.
- **Doc**: `docs/IOS-RUN.md`.

---

## 5. iOS: Full screen and bottom strip

- **Goal**: App fills whole screen; remove white/blank strip below bottom nav.
- **Done**:
  - **HTML/CSS**: `viewport-fit=cover` in `index.html`; `min-height: 100dvh` on html/body/#root in `index.css`; `.safe-bottom-pwa` with `padding-bottom: max(20px, env(safe-area-inset-bottom))`; `nav.glass.safe-bottom-pwa::after` with solid `hsl(var(--background))` to fill bottom safe area; `tauri-plugin-edge-to-edge` in Cargo.toml and lib.rs for edge-to-edge WebView and safe area vars.
  - **App shell**: `.app-shell` on the fixed app container with `::after` bottom fill using `var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))` and `min-height: 100dvh` / `-webkit-fill-available`; html/body background set to `hsl(var(--background))` so any gap uses theme color.
- **Reverted**: LaunchScreen.storyboard dark background — caused `CompileStoryboard` (ibtool) to fail; reverted to `systemBackgroundColor`.
- **If strip remains**: Likely native WebView/superview constrained to safe area; would need Tauri/iOS template or edge-to-edge plugin to extend WebView under safe area.

---

## 6. Frontend: Vite import resolution

- **Error**: `Failed to resolve import "@/components/ui/sonner"` from `src/App.tsx` (e.g. when alias not applied).
- **Fix**: In `src-client/src/App.tsx`, replaced `@/` imports with relative paths (`./components/...`, `./hooks/...`) so resolution works regardless of which Vite config/root is used.

---

## Artifacts touched (summary)

| Area        | Paths / files |
|------------|----------------|
| Auth/API   | `src-client/src/lib/api.ts`, `http-adapter.ts`, `login-screen.tsx`, `useAuth.ts`, `mobile-shell.tsx` |
| Android    | `gen/android/` (manifest, network_security_config, build.gradle.kts), `scripts/android-emulator-internet.sh`, `docs/ANDROID-EMULATOR-NETWORK.md` |
| iOS        | `tauri.ios.conf.json`, `gen/apple/.../project.pbxproj`, `scripts/ios-run-simulator.sh`, `docs/IOS-RUN.md`, `LaunchScreen.storyboard` (reverted) |
| Layout     | `index.html`, `src-client/src/index.css` (safe-area, app-shell, html/body, nav::after), `App.tsx` (app-shell class, relative imports) |
| Tauri      | `src-tauri/Cargo.toml` (tauri-plugin-http unsafe-headers, tauri-plugin-edge-to-edge), `lib.rs` (edge-to-edge init) |

---

*S50-Validate-Report.md* — build matrix and success criteria  
*S50-iOS-signing.md* — iOS signing and deployment  
*S50-Windows.md* — Windows CI  
*S50-RPi5.md* — RPi5 target and build
