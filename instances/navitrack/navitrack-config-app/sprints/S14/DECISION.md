# S14 Decision: Advanced Stubs Enablement

Date: 2026-09-18
Sprint: S14 (Epic E12)

## Summary

This sprint resolves the legacy Advanced mode stubs (46, 47, 5A, Response_52) documented in S10 DECISION-STUBS.md.

## Decisions

### Command_46 — 3-Point Calibration Write ✅ ENABLED

**Decision**: Enable with full parameter form and send path.

**Rationale**: 
- Encoder `encodeCommand46` already exists and is tested
- Legacy UI had this commented out, but the protocol is sound
- 3-point calibration (6 × ushort: fuel/freq pairs for 3 points) is distinct from Standard's 2-point flow

**Implementation**:
- Catalog: 6 params (p1Fuel, p1Freq, p2Fuel, p2Freq, p3Fuel, p3Freq) as u16
- `buildAdvancedFrames`: Parse params and call `encodeCommand46`
- Stub badge removed
- i18n labels added for all params

### Command_47 — Advanced Mode ⚠️ STUB RETAINED

**Decision**: Keep stub badge. Standard mode owns the calibration UX.

**Rationale**:
- Standard mode provides the proper 2-point calibration workflow with min/max capture
- Advanced 47 would duplicate that UX poorly (no live frequency capture, no cal type guidance)
- Legacy app had Advanced 47 send commented out for this reason

**Implementation**:
- Catalog keeps `stub: true`
- UI shows stub note directing users to Standard mode
- Encoder remains available for programmatic/test use

### Command_5A — 3-Point Calibration Read ❌ PERMANENTLY DISABLED

**Decision**: Permanent skip with documented reason.

**Rationale**:
- Legacy `Command_5A.cs` was never implemented (`SendCommand_5A` was TODO empty)
- No firmware specification or observed behavior available
- Cannot implement correctly without hardware documentation

**Implementation**:
- Catalog: `disabled: true`, `disabledReason` key for i18n explanation
- UI renders as disabled option (not selectable)
- Header-only encoder retained for protocol completeness

### Response_52 — Protocol Read Response ✅ WIRED

**Decision**: Wire to Advanced UI results.

**Rationale**:
- Parser `parse52` already exists in registry
- Command_52 (read protocol) returns this response
- Just needs visibility in Advanced send results

**Implementation**:
- `synthesizeResponseForCommand` handles 0x52 for FakeBle
- Advanced send already returns parsed response via `runCommandQueue`
- Result displays as `52` in UI result string

## Files Changed

- `src/screens/sensor-session/advanced-catalog.ts` — Catalog updates
- `src/screens/sensor-session/advanced-encode.ts` — Command_46 param parsing
- `src/protocol/fake-responses.ts` — Response_52 synthesis
- `src/locales/en.json` — i18n for 46 params and 5A disabled reason
- Tests: `advanced-encode.test.ts`, `AdvancedModeTab.test.tsx`

## Verification

```bash
bun run test
```

All tests pass including new coverage for:
- Command_46 with 3-point params
- Response_52 in FakeBle session
- Disabled 5A behavior
