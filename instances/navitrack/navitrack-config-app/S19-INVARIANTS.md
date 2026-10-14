# S19 INVARIANTS — Design Shell Closeout

Depends: [`S16-INVARIANTS.md`](S16-INVARIANTS.md), [`S18-INVARIANTS.md`](S18-INVARIANTS.md).  
Epic: **E16**. Active as of S19-T0 (2026-09-30).

Do not redesign. Do not reopen S18. S18-T0 live BLE smoke stays deferred until a DUT is present.

## Shell

1. **Welcome → Home → Catalog → sensor session.** Settings stay in the AppHeader sheet.
2. Brand stays **NaviTrack**.
3. Bottom tabs: **Home · Sensors · Logs · About**. Home is the primary tab. The logo also goes Home.
4. Header text is the **current screen name**, not the word NaviTrack.
5. Version is shown **once**, on About.
6. Welcome **enters Home** and is **not labeled Scan**.

## Saved sensors

- Saved sensors persist.
- A saved sensor can be bookmarked.
- The Home card opens a sensor session.
- Scan calls `markSeen` when a saved sensor is seen.

## Scan telemetry (amends S18)

Advertise telemetry is shown whenever manufacturer data is present. The S18 `autoConnectSensor` display gate no longer hides it.

## Sensor profile

- Catalog and session read a sensor-profile template (`src/config/sensor-profile.ts`).
- Catalog `profileId` selects the profile. Session tabs are that profile's `sections`.
- **One** live profile: `fuel-ble`. No second live product. No RS-485.

## Ship targets

| Target | Role |
|--------|------|
| iOS, Android | First ship apps |
| macOS | Compile for real-sensor testing |
| App Store / Play upload | Out |

## Field safety

- A write to the sensor asks for confirmation first.
- Installer screens hide opcode numbers.
- Advanced raw commands may keep opcode numbers.
- A focused session field stays on screen.
- Leaving a session with unwritten edits asks.

## Non-goals

- New protocol commands, FCS changes, live radio
- A second live sensor, RS-485, GPS tile, cloud account
- Full installation-report wizard, thermocompensation, desktop COM
- Reverting Welcome → Home → Catalog
- Reopening S18

## Screen rhythm exceptions

Hub screens use `ScreenHeader` inside `.content-wrapper`. These stay custom:

- **Welcome** — full-bleed. No `ScreenHeader`.
- **AppHeader settings sheet** — embedded `DutSettingsSections`. No second header.
- **Sensor session** — one `ScreenHeader`. Title is the device name. Eyebrow is "Sensor".

## Runtime mirror

`navitrack-config-app/src/config/invariants.ts` → `S19_DESIGN_SHELL`  
Package manager: **bun**.

## Pointer (S20)

S19 stays frozen. Host compile continues in [`S20-INVARIANTS.md`](S20-INVARIANTS.md). Do not reopen S19 tasks.
