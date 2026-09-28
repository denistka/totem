# S18 Smoke Notes — macOS / Navitrack BLE

## T1 — Desktop path ready (2026-09-28)

| Check | Result |
|-------|--------|
| `bun run macos:dev` | **PASS** — Vite `:1420` + `target/debug/navitrack-config-app` launched |
| Adapter | `createBleAdapter` → **TauriBleAdapter** when `isTauri()` and `VITE_FORCE_FAKE_BLE` unset (`src/ble/factory.ts`) |
| Web `bun run dev` | FakeBle (expected) |
| Build scripts | `macos:dev` / `macos:build` present; no new scripts required |
| Docs | `sprints/S17/MACOS-BUILD.md` still valid; smoke record moved here for S18 |

### Known watch during live smoke

`tauri-plugin-blec` can panic `failed to send data to the channel: "Full(..)"` under heavy scan traffic (observed in prior `macos:dev` session). Does not block launch; if scan stalls, restart app / shorten scan window.

**T1 verdict:** Desktop Tauri path known-good for T0.

---

## T0 — Live BLE smoke (absorbed from S17-T3)

| Field | Value |
|-------|--------|
| Date | 2026-09-28 |
| Host | macOS (darwin 25.5) |
| DUT | *not available this session* |
| Launch | Path ready per T1; live radio **not executed** |

### Checklist (DEVICE-QA macOS)

| Step | Status |
|------|--------|
| BT on → permission → scan | **SKIP** — no DUT |
| Connect → password `0x50` (often `111`) | **SKIP** |
| Standard read chain | **SKIP** |
| Live telemetry | **SKIP** |

### Verdict

**Explicit defer:** happy path not run — no physical Navitrack BLE on hand.  
**Next:** re-run T0 when DUT available (`Navi_*` / filters in `DEVICE-QA.md`); file follow-up `.pd` only if defects appear. Track B–Q continue without blocking on live radio.
