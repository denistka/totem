# S20 quality closeout

Reviewed against the code-quality mandate. Scope was host compile plus the unowned shell decision. No shell redesign. FakeBle only. No live radio.

## What this sprint touched

- Home is a bottom tab in the existing tab style. Sensors stays `Activity`. Padding, glass border, type tracking, and the depth slide were reverted. `ScreenTransition` crossfades and still blocks clicks on the exiting screen.
- Bundle id is `com.navitrack.dutconfigurator` in the two Tauri conf files. `productName` is unchanged. `infoPlist` is the path `Info.plist`, which already held the Bluetooth usage strings.
- `scripts/sync-ios-version.sh` points at the plist `tauri ios init` created.
- Two tests typecheck under `noUnusedLocals` and `noUncheckedIndexedAccess` so `macos:build` can run `tsc -b`.

## No refactor

Nothing this sprint added was duplicated UI, a second settings header, a fatter Tauri surface, or a new screen. Shared primitives stayed in `src/ui`. Native BLE stays behind `src/ble`. `src-tauri/gen/` stays gitignored and was not committed.

The unsigned iOS link needed two edits inside that gitignored Xcode project: drop the baked `FORCE_COLOR` value `0` that was passed as an architecture, and link `CoreBluetooth.framework`. Those edits are not in git. A fresh `tauri ios init` can wipe them. Device signing still needs the Apple Program License Agreement accepted on this account.

`bun run test` is the check for this closeout.
