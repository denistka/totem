# S22 — Live DUT ground truth (Navi_7514)

First real-sensor session for this app (S18-T0 was always deferred). Host: macOS, 2026-10-14.
Harness: `tools/dut-bridge` (Swift CoreBluetooth, stdin/stdout) + `tools/dut-probe` (Bun; runs the app's own `src/` protocol and session code). No GUI.

## Sensor

| | |
|---|---|
| Name / id | `Navi_7514`, CoreBluetooth id `0F24B737-…-2FD2E62AD472` |
| RSSI at the desk | −58 … −74 |
| Network address | **1** (reply header byte 1) |
| Firmware / serial | 26 / 7514 |
| Vehicle | `Ghj` |
| Probe length | 731 mm |
| Period (C8) | 19 s |
| Averaging (0x14 `length`) | 5 |
| Calibration (0x48) | `[4, 1, 5, 1022, 0…]` → min 4, max 5, type 1022 |
| Password | **not 111** (0x50 → rc=1). Unknown to the harness — authenticated paths not run live. |

## GATT

- Characteristic properties: `read, write, writeNoResp, notify, indicate`.
- Max write: 244 without response, 512 with response. MTU 247 — every frame fits one packet.
- Write without response works (the app's choice is fine).

## Timing

- Command → reply ≈ **60 ms** (first after connect ≈ 240 ms). Reads need **no** auth.
- Connect + discover + subscribe ≈ **3–4 s**.
- While connected the DUT **pushes 0x61 every period (19 s)** and once right after subscribe.
- The DUT answers 0x06 with a **0x61** frame.
- A connection held for 150 s stayed up; no idle disconnect from the sensor.

## Advertising

- Bursts every ~3 s for ~15–35 s, then no adverts seen for **20–90 s** (one stretch of ~4 min — likely another central connected).
- Duplicate filtering on (macOS default) can hide the sensor for a whole scan → the bridge scans with duplicates allowed.
- Despite the quiet stretches, a pending connect completed in **3–4 s** even 12 s and 25 s after the last advert we saw. Discovery is slow; connecting is not.

## What was wrong in the app (fixed in S22)

1. **Watchdog killed healthy links.** Pushes never reached it, so after ~45 s without a user command it tore the link down and reconnected (often into the sensor's quiet phase). Legacy counted every notification.
2. **Lost replies.** Each action created a new transport and stole the adapter's single notify handler; a timed-out read left a waiter that swallowed the next reply.
3. **Read never filled** network address, averaging or calibration → Save wrote **255 / 5 / defaults** to the sensor.
4. **Write chain ignored return codes** → "written" even when the sensor refused a step.
5. **8 s scan window** vs a sensor that may not advertise for a minute.
6. **blec connect = 3 × 5 s** with an UnknownPeripheral error when the map lacks the sensor; now retried up to `connectWaitSec` (120 s), rescanning on UnknownPeripheral.

## Verified live with the new code (probe `idle`, `silent`)

- Store connect loop → connected in 1.4–4.4 s; read fills all fields; "unsaved" = false.
- 130 s idle with the watchdog running → live values every 19 s, **no** watchdog trip.
- Leaving the session keeps the link (still connected 20 s later; drops after 90 s).
- Connect started 6 / 12 / 25 s into a quiet stretch → connected on attempt 1 in 3.0–4.3 s.

## Real Tauri / blec stack on macOS (`VITE_DUT_SELFTEST=Navi_7514 bun run macos:dev`)

- The native layer reported the sensor 0.4 s after the scan started (incremental listing works). When the sensor sleeps, the whole 60 s window can pass without it.
- blec connect took 1.9–3.9 s on attempt 1; the first push arrived at once; the read chain took 0.3 s with every field mapped.
- 70 s idle with the watchdog: 4 pushes, link up, no trip. Leaving kept the link (still up 20 s later).
- The user unlocked in the same window (0x50 rc=0 through blec, auto-read, pushes).

## Authenticated write round-trip (probe `roundtrip`, user's password)

- Unlock → auto-read → **Write the same values back** → re-read.
- The chain E1 → 56 → 4E → 0E → 13 returned **rc=0 at every step** (E1 included, so checking E1's code is right). No 0x47 was sent (calibration unchanged).
- The re-read was **identical**, so nothing on the sensor changed.

## Not run live

Calibration (0x47) / graduation writes and password change (0x59): they change the sensor and need the user's intent. They are covered by unit tests on the captured frames (`src/test/live-dut.ts`).
