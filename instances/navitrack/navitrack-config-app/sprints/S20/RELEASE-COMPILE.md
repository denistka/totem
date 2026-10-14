# S20 host compile

## macOS (`bun run macos:build`) — compiled

Date: 2026-09-30.

Identifier in `src-tauri/tauri.conf.json` and `src-tauri/tauri.ios.conf.json` is `com.navitrack.dutconfigurator`. `productName` is still `NaviTrack Config`.

`bun run test`: 64 files, 259 tests, passed.

First attempt stopped in `beforeBuildCommand` (`tsc -b`) before Tauri checked the identifier:

```
src/screens/sensor-session/GraduationTab.test.tsx(1,44): error TS6133: 'vi' is declared but its value is never read.
src/screens/sensor-session/GraduationTab.test.tsx(121,11): error TS6133: 'user' is declared but its value is never read.
src/store/useSavedSensorsStore.test.ts(25,12): error TS18048: 'entry' is possibly 'undefined'.
src/store/useSavedSensorsStore.test.ts(26,12): error TS18048: 'entry' is possibly 'undefined'.
src/store/useSavedSensorsStore.test.ts(27,12): error TS18048: 'entry' is possibly 'undefined'.
src/store/useSavedSensorsStore.test.ts(28,12): error TS18048: 'entry' is possibly 'undefined'.
src/store/useSavedSensorsStore.test.ts(52,12): error TS18048: 'entry' is possibly 'undefined'.
src/store/useSavedSensorsStore.test.ts(53,12): error TS18048: 'entry' is possibly 'undefined'.
src/store/useSavedSensorsStore.test.ts(54,12): error TS18048: 'entry' is possibly 'undefined'.
beforeBuildCommand `bun run build` failed with exit code 2
```

Those test errors were cleared. Second `bun run macos:build` compiled (exit 0, release profile, ~2 min). Bundles:

- `src-tauri/target/release/bundle/macos/NaviTrack Config.app`
- `src-tauri/target/release/bundle/dmg/NaviTrack Config_0.1.0_aarch64.dmg`

No store upload. No live radio.

## iOS (`bun run ios:build`) — compiled unsigned

Date: 2026-09-30.

`tauri ios init --ci` wrote `src-tauri/gen/apple/navitrack-config-app_iOS/Info.plist` (not `NaviTrack_iOS`). `scripts/sync-ios-version.sh` points at that plist. `productName` is still `NaviTrack Config`. `gen/` is gitignored and was not committed.

`bundle.iOS.infoPlist` in `tauri.ios.conf.json` is the path `Info.plist`. The inline object was rejected by this Tauri CLI (`infoPlist` must be a string). Bluetooth usage strings stay in `src-tauri/Info.plist`.

`bun run test`: 64 files, 259 tests, passed. The sync script printed `iOS version synced → 0.1.0`.

Plain `bun run ios:build` then failed in Xcode before the Rust link:

```
error: Unable to process request - PLA Update available: You currently don't have access to this membership resource. To resolve this issue, agree to the latest Program License Agreement in your developer account.
error: Provisioning profile "iOS Team Provisioning Profile: *" doesn't include signing certificate "Apple Development: Evgeniy Perevozchikov (Y5SUU6224W)".
```

`bun run ios:build -- --no-sign` compiled after two gitignored Xcode project fixes (not committed): drop the baked `FORCE_COLOR` value `0` that was passed as an arch, and link `CoreBluetooth.framework` for btleplug. Exit 0. Bundle:

- `src-tauri/gen/apple/build/arm64/NaviTrack Config.ipa`

No App Store upload. No `ios:build:appstore`. No live radio.

## Android (`bun run android:build`) — compiled

Date: 2026-09-30.

`ANDROID_HOME` was set to `~/Library/Android/sdk` for the commands only. No machine env file was committed.

`tauri android init --ci` created `src-tauri/gen/android`. NDK `29.0.13846066`. Java from Android Studio's JBR. `gen/` was not committed.

`bun run test`: 64 files, 259 tests, passed.

`bun run android:build` exited 0. Outputs (gitignored):

- `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk`
- `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab`

No Play upload. Did not run `android:build:apk`, `android:build:aab`, or `android:build:open`. No live radio.
