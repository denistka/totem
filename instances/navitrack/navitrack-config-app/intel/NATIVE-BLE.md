# Native BLE — adapter selection (S13-T0)

Date: 2026-09-18
Sprint: S13

## Decision

Use **`tauri-plugin-blec`** (`@mnlphlp/plugin-blec` + Rust `tauri-plugin-blec` **0.12**) as the production BLE GATT client for iOS / Android / desktop Tauri builds.

| Concern | Choice |
|---------|--------|
| Plugin | `tauri-plugin-blec` (btleplug + Android Tauri plugin path) |
| JS binding | `@mnlphlp/plugin-blec@0.12.0` (matched to crate 0.12) |
| App adapter | `TauriBleAdapter` implements `BleAdapter` |
| Factory | `createBleAdapter()` / `createDefaultBleAdapter()` |
| Unit tests | **Always** `FakeBleAdapter` + injectable `BlecApi` |
| Web / Vite browser | Fake + demo devices (not real radio) |

## Build flags

| Flag / env | Effect |
|------------|--------|
| Running under Vitest (`import.meta.env.VITEST`) | Force Fake |
| `MODE=test` | Force Fake |
| `VITE_FORCE_FAKE_BLE=1` | Force Fake even inside Tauri (debug / demos) |
| `isTauri() === true` and no force-fake | **TauriBleAdapter** (real radio) |

**Hard rule:** production device builds must **not** hardcode Fake. Only the factory conditions above select Fake.

## GATT invariants (frozen)

- Service `0bd51666-e7cb-469b-8e4d-2742f1ba77cc`
- Characteristic `e7add780-b042-4876-aae1-112855353cc1`
- Requested MTU **200** (Android via `setAndroidMtu`; others use negotiated `getMtu`)

## Capabilities / OS

- Capability permission: `blec:default`
- iOS: `NSBluetoothAlwaysUsageDescription` (+ peripheral legacy key) in `tauri.ios.conf.json`
- **macOS (S17):** `src-tauri/Info.plist` Bluetooth usage strings (merged into bundle). Dev: `bun run macos:dev`. See `sprints/S17/MACOS-BUILD.md`.
- Android 12+: plugin merges `BLUETOOTH_SCAN` / `BLUETOOTH_CONNECT` (see `BLE_PLATFORM_NOTES`)

## Alternatives considered

| Option | Why not |
|--------|---------|
| Raw `btleplug` in app crate | Extra JNI/Android glue; blec already wraps it |
| Web Bluetooth only | Incomplete on iOS WKWebView; not DUT-parity |
| Custom Swift/Kotlin plugin | Higher maintenance for same GATT surface |
