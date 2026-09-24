# macOS build — NaviTrack Config (S17)

One-command desktop path for live Navitrack BLE DUT work.

## Prerequisites

| Tool | Notes |
|------|--------|
| **bun** | Package manager (not npm/pnpm) |
| **Rust** + macOS SDK | Tauri 2 desktop |
| **Xcode CLT** | `xcode-select --install` if missing |
| Bluetooth | System Settings → Bluetooth **ON** |
| Signing | Local `tauri dev` uses ad-hoc / development signing; no Apple Developer ID required for smoke |

## Commands

```bash
cd navitrack/navitrack-config-app
bun install
bun run macos:dev    # = tauri dev — Vite + native window
# release-ish desktop bundle:
bun run macos:build  # = tauri build (macOS host)
```

Do **not** set `VITE_FORCE_FAKE_BLE=1` for live radio. Web `bun run dev` stays Fake.

## BLE / privacy

| Piece | Location |
|-------|----------|
| Capability | `src-tauri/capabilities/default.json` → `blec:default` |
| Usage strings | `src-tauri/Info.plist` (`NSBluetoothAlwaysUsageDescription`) — merged into the .app bundle |
| Adapter | `TauriBleAdapter` when `isTauri()` and not force-fake (`src/ble/factory.ts`) |

First launch may prompt for Bluetooth access (TCC). If scan fails after deny: System Settings → Privacy & Security → Bluetooth → enable NaviTrack Config.

### Sandboxed distribution (optional)

Default local desktop builds are **not** App Sandbox. If you later enable sandbox for notarized distribution, add an entitlements plist with `com.apple.security.device.bluetooth` and point `bundle.macOS.entitlements` in `tauri.conf.json`. Do **not** put usage strings in the entitlements file.

## Adapter factory (S17-T2)

- `resolveUseFakeBle` / `createBleAdapter`: Fake under Vitest / web / `VITE_FORCE_FAKE_BLE=1`
- macOS `tauri dev` → `isTauri()` → **TauriBleAdapter** (real radio)
- Verified 2026-09-24: `bun run macos:dev` compiled (`Finished dev`) and launched `target/debug/navitrack-config-app`

## Scan timing (S17 fix)

`tauri-plugin-blec` `startScan` / `discover` **returns immediately** after spawning the scan task; devices arrive later on a Channel. `TauriBleAdapter.scan` waits `timeoutMs + 300` before stopping and returning. Without that wait, Logs show instant `raw=0`.

Default scan window = Settings **scan period** (often **30s**) — Scan button stays busy that long.

## Info.plist / TCC

`src-tauri/Info.plist` Bluetooth usage strings merge into **`tauri build`** `.app` bundles. Bare `tauri dev` binary reports `Info.plist=not bound` — if macOS never prompts for Bluetooth, allow the app under **System Settings → Privacy & Security → Bluetooth**, or smoke with `bun run macos:build` and open the generated `.app`.

## Smoke

Follow `intel/DEVICE-QA.md` § macOS; record session in `sprints/S17/SMOKE-NOTES.md`.
