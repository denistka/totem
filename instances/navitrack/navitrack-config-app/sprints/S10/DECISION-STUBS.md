# Decision: Legacy Advanced stubs (46 / 47 UI, 5A, Response_52)

Date: 2026-09-18
Sprint: S10-T3 (amended S14)

## Inventory (legacy)

| Item | Legacy behavior | Rebuild stance |
|------|-----------------|----------------|
| Advanced **Command_46** send | UI send commented out | Encode ported; picker marks **stub**; send still works for tests |
| Advanced **Command_47** send | UI send commented out | Same — Standard mode owns real 47 UX |
| **Command_5A** | `Command_5A.cs` missing; `SendCommand_5A` / handle TODO empty | Header-only `encodeCommand5A`; stub label |
| **Response_52** | Parser exists; Advanced handler unwired in places | Encode 52 available; response registry already parses 52 |

## Product decision

Keep encode/parse parity for future enablement. Do **not** pretend Advanced 46/47/5A are production-complete. Surface stub note in Advanced picker UI.

## Out of scope

Firmware OTA, USB host — still absent (DUT inventory).

---

## S14 Enablement Scope (Epic E12)

Date: 2026-09-18
Sprint: S14-T0

### Enablement decisions

| Item | S14 Decision | Rationale |
|------|--------------|-----------|
| **Command_46** | ✅ ENABLED | 3-point calibration write with 6 ushort params (p1Fuel, p1Freq, p2Fuel, p2Freq, p3Fuel, p3Freq). Stub badge removed. Full UI send path. |
| **Command_47** (Advanced) | ⚠️ STUB RETAINED | Standard mode owns the 2-point/multi-point calibration UX. Advanced picker keeps stub label directing users to Standard mode. No duplicate partial UX. |
| **Command_5A** | ❌ PERMANENTLY DISABLED | Legacy `Command_5A.cs` was never implemented (TODO empty). No firmware spec available. Permanently disabled in UI with explanation. |
| **Response_52** | ✅ WIRED | Parse already exists. Session handler now surfaces 52 protocol response in Advanced UI result + logs. |

### Implementation notes

- **Command_46**: Added 6 calibration point params to catalog. `buildAdvancedFrames` now passes user-entered values. FakeBle round-trip tested.
- **Command_47**: Catalog entry keeps `stub: true`. UI shows stub note. Users should use Standard mode Settings tab for calibration.
- **Command_5A**: Marked with `disabled: true` and `disabledReason` in catalog. UI renders disabled state with i18n explanation.
- **Response_52**: `synthesizeResponseForCommand` handles 0x52. Advanced send path already returns parsed response via `runCommandQueue`.

### Test coverage

- `advanced-encode.test.ts`: Command_46 with params round-trip
- `AdvancedModeTab.test.tsx`: FakeBle session test for 46/52
- All paths verified via `bun run test`
