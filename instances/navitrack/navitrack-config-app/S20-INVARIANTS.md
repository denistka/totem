# S20 INVARIANTS — Host Compile

Depends: [`S19-INVARIANTS.md`](S19-INVARIANTS.md).  
Epic: **E17**. Active as of S20-T0 (2026-09-30).

S19 stays frozen. Do not reopen S19 tasks. Do not reopen S18. S18-T0 live BLE smoke stays deferred until a DUT is present.

## Shell (unchanged from S19)

1. **Welcome → Home → Catalog → sensor session.** Settings stay in the AppHeader sheet.
2. Brand stays **NaviTrack**.
3. One live profile: **fuel-ble**.

## Host compile

| Target | Rule |
|--------|------|
| iOS, Android | First ship. Compile on this Mac (`ios:build`, `android:build`). |
| macOS | Desk DUT test build (`macos:build`). |
| App Store / Play upload | Out. No `ios:build:appstore`, `android:build:apk`, `android:build:aab`, `android:build:open`, or the release script. |
| Live radio | Out. No live BLE smoke. |

- Bundle id in the Tauri conf files only: `com.navitrack.dutconfigurator`. The underscore is illegal. `productName` stays.
- `src-tauri/gen/` stays gitignored. Do not commit it.
- Package manager: **bun**.

## Unowned shell diff

The six uncommitted shell files are not a feature of this freeze. S20-T1 decides keep or revert. T0 does not edit them.

## Non-goals

- New protocol commands, FCS changes, a second live sensor, RS-485
- GPS tile, cloud account, full installation-report wizard
- Thermocompensation, desktop COM
- Reopening S18 or S19
