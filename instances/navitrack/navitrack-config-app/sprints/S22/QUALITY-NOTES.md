# S22 TQ — Quality notes

## Shape of the change

- **Link layer** (`src/ble/adapter-transport.ts`): one cached transport per adapter. It serializes requests, matches replies by cmd, cleans up on timeout, and routes unsolicited frames to listeners. The runner uses `request` when a transport has it; plain write/read transports (tests) still work.
- **Session actions** (`src/store/sensor-session-actions.ts`) own all link state:
  - the connect loop and its abort;
  - session attach (push → telemetry, disconnect listener);
  - the read-once-per-device marker;
  - the live period for the watchdog.

  The store wrappers are now thin; `savedForm` is maintained in the actions, so every entry point (Write, Save-and-leave, auto-read) agrees on "unsaved".
- **Watchdog**: same `evaluateWatchdog` core plus a consecutive-timeouts rule and a period-aware idle limit. The session controller attaches to transport events instead of wrapping write/read.
- **Settings v4**: `autosaveDrafts` (off), `connectWaitSec` (120), `scanPeriod` 60.

## Reuse / UI

- The reconnect banner and link-status lines reuse `glass`, `Button` and existing status keys; there's no new primitive.
- `focus-field.ts` is removed: the programmatic scroll on focus is gone everywhere, and password inputs get `caret-transparent`.
- The autosave hook gained an `enabled` switch; both tabs use it. Graduation rows are kept in memory per sensor, with an owner guard so one sensor's rows are never filed under another.

## Tests

- New `adapter-transport.test.ts`: push routing, no orphan waiter after a timeout, serialization, hung write, 0x06→0x61.
- `sensor-session-connect.test.ts` is rewritten on byte-exact Navi_7514 frames (`src/test/live-dut.ts`). It covers:
  - read mapping, push telemetry, and write-back of the read values;
  - a rejected step stopping the chain, and calibration only when changed;
  - connect retry across sleep, connectFail, and cancel on leave;
  - link loss followed by reconnect and re-auth;
  - the linger.
- The watchdog covers 5 minutes of pushes with no trip, a trip on two timeouts, and the idle-limit math.
- Stale specs from the session redesign are fixed: e2e helpers (empty catalog → Scan), and session tests (no scroll on focus, linger, `writeOk` without 0x47).

## Debt carried

- `SensorSessionScreen` cognitive complexity is still above the lint limit (pre-existing).
- Repo-wide `eslint .` still fails on old files; the changed files are clean apart from the pre-existing `_mtu` in `tauri-adapter.ts`.
- The blec plugin keeps a hardcoded 5 s connect timeout and `listServices` panics on error; the app works around both (retry loop; `listServices` unused). Vendoring the plugin isn't needed yet.
