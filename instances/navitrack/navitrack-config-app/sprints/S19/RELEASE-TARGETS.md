# S19-T10 release targets

First ship apps are iOS and Android. macOS is the desk build for DUT tests, not a store target. Nothing was uploaded to the App Store or Play. No live radio. S18-T0 stays deferred.

Scripts still call Tauri and were not changed:

- `bun run macos:build` → `tauri build`
- `bun run ios:build` → `scripts/sync-ios-version.sh` then `tauri ios build`
- `bun run android:build` → `tauri android build`

`src-tauri/gen` is gitignored, so the phone projects are created on the machine with `tauri ios init` and `tauri android init`.

## Attempts on this Mac

| Target | Host | Result |
| --- | --- | --- |
| macOS | Rust 1.93.0 | Blocked. `bun run macos:build` and `tauri build --no-bundle` both stop before compile. Tauri rejects the bundle identifier `com.navitrack.dut_configurator` because of the underscore. No app binary. |
| iOS | Xcode 26.2, iPhoneOS 26.2 SDK | Blocked. `bun run ios:build` exits in `scripts/sync-ios-version.sh` because `src-tauri/gen/apple/NaviTrack_iOS/Info.plist` is not there. `tauri ios build` did not start. |
| Android | SDK at `~/Library/Android/sdk` (platforms 29, 34, 36; build-tools; NDK 29). `ANDROID_HOME` was unset, so the attempt set it. | Blocked. `bun run android:build` stops because `src-tauri/gen/android` does not exist. The CLI asks for `tauri android init`. |

## How to compile the macOS DUT test build

From `navitrack/navitrack-config-app`: `bun run macos:build`.

That command is the desk build. It does not upload. It currently cannot finish until the bundle identifier contains only letters, digits, hyphens, and periods.
