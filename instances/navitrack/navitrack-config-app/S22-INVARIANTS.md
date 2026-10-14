# S22 INVARIANTS — Live Sensor Reliability + Session UX

Depends: [`S21-INVARIANTS.md`](S21-INVARIANTS.md). Epic **E19**. Date: 2026-10-14.
Ground truth: [`sprints/S22/LIVE-DUT-NOTES.md`](sprints/S22/LIVE-DUT-NOTES.md) (Navi_7514).

## Link

1. **One transport per adapter.** `createAdapterTransport(adapter)` is cached; every caller shares it. Never create a second notify handler for the same adapter.
2. **Requests are serialized and matched by cmd.** Each request has a timeout (8 s) that also covers a hung native write, and it removes its waiter on timeout. Frames nobody asked for go to `onFrame` listeners.
3. **Pushes are data and liveness.** The DUT pushes 0x61 every period: it updates live telemetry and resets the watchdog's idle clock. The idle limit is `max(setting, 2.5 × period + 5)`.
4. **Watchdog trips on two back-to-back unanswered requests** (or a hung write), never on a quiet but healthy link. A failed reconnect stops the watchdog and offers **Reconnect**; it does not loop.
5. **Link loss reaches the store** through `setDisconnectListener` (unexpected drops only). On the session screen, while unlocked, the app reconnects and re-authenticates.

## Connect

6. **Connect retries up to `connectWaitSec` (default 120 s).** The DUT may not advertise for up to ~90 s. On "no peripheral with id", rescan until the sensor shows up. Leaving the session cancels the loop.
7. **The link lingers 90 s after leaving the session.** Reconnecting can mean waiting out the sensor's sleep. A different sensor or a full reset drops it at once.
8. **Scan window default 60 s** (v4 migration raises shorter saved windows once).

## Protocol parity

9. **Read fills everything Write sends**: network address from the reply header, averaging from 0x14 `length`, min / max / type from 0x48 (legacy filter). Unlock reads **before** showing the form, once per device work period.
10. **Write chain stops on the first non-zero return code**, including E1. Calibration (0x47) goes out only when a calibration field changed.

## Session UX

11. **"Unsaved" means differs from what the sensor holds** (last read or write). Company is app-side, saved on edit, and never makes a session "unsaved". Discard restores only sensor-held fields.
12. **Draft autosave is opt-in** (`autosaveDrafts`, default off). Graduation rows always survive tab switches in memory.
13. **Password fields hide the caret** and nothing scrolls a field into view on focus.

## Tooling

14. `tools/dut-bridge` + `tools/dut-probe` run the app's own code on a live DUT, headless (macOS). The dev-only `VITE_DUT_SELFTEST=<name> bun run macos:dev` runs the real Tauri/blec stack and prints to the terminal. Neither ships in release builds.
15. `src/test/live-dut.ts` holds byte-exact frames from Navi_7514. Session tests answer like the real sensor.

S18–S21 stay closed.
