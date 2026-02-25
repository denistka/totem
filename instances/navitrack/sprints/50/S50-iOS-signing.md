# S50: iOS signing and deployment

## Simulator build

```bash
cd navitrack-apps
unset CI
npx @tauri-apps/cli ios build --debug -t aarch64-sim
```

Requires Xcode and a **development team** for signing. If you see "Signing for navitrack-app_iOS requires a development team":

1. Open `src-tauri/gen/apple/navitrack-app.xcworkspace` in Xcode.
2. Select the **navitrack-app_iOS** target → **Signing & Capabilities**.
3. Check **Automatically manage signing** and choose your **Team** (Apple Developer account).
4. Or set `APPLE_DEVELOPMENT_TEAM` / `bundle > iOS > developmentTeam` in tauri config.

## Device deployment

1. In Xcode: add your Apple ID (Xcode → Settings → Accounts).
2. Select a **Team** and ensure the bundle ID is registered in the developer portal.
3. Create a **Provisioning Profile** for the app (or use automatic signing).
4. Build for device: `npx @tauri-apps/cli ios build --debug` (default target is device).
5. Install via Xcode (Run on device) or export IPA for ad-hoc/TestFlight.

## ATS (HTTP API)

Info.plist already allows HTTP for:

- `api.navitrack.com.ua`
- `online.navitrack.com.ua`

See `src-tauri/gen/apple/navitrack-app_iOS/Info.plist` → `NSAppTransportSecurity`.
