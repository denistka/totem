# S14 Quality Notes

Date: 2026-09-18
Sprint: S14-TQ

## Review Summary

All S14 tasks completed with tests passing. Code follows established patterns.

## Quality Checklist

| Area | Status | Notes |
|------|--------|-------|
| Co-located Vitest tests | ✅ | All new logic has tests |
| FakeBle/MSW usage | ✅ | No live FCS/BLE in tests |
| i18n coverage | ✅ | New params and messages localized |
| Type safety | ✅ | Catalog type extended for `disabled` |
| Protocol parity | ✅ | Encoders match legacy spec |
| `bun run test` | ✅ | 141 tests passing |

## Changes by File

### Protocol Layer
- `src/protocol/fake-responses.ts` — Added Response_52 synthesis for tests

### UI Layer
- `src/screens/sensor-session/advanced-catalog.ts` — Extended type with `disabled`/`disabledReasonKey`; updated 46/47/5A/52 entries
- `src/screens/sensor-session/advanced-encode.ts` — Command_46 now passes calibration point params
- `src/screens/sensor-session/AdvancedModeTab.tsx` — Renders disabled state with reason, disables send button

### Localization
- `src/locales/en.json` — Added 6 calibration point param labels, disabled messages, updated command labels

### Tests
- `src/screens/sensor-session/advanced-encode.test.ts` — Extended with Command_46 params, 5A disabled, 52 enabled assertions
- `src/screens/sensor-session/AdvancedModeTab.test.tsx` — Added FakeBle round-trip tests for 46/52, disabled 5A behavior

### Documentation
- `sprints/S10/DECISION-STUBS.md` — Amended with S14 enablement scope
- `sprints/S14/DECISION.md` — Full decision record for all 4 items

## Patterns Followed

1. **Catalog-driven UI**: New param fields and disabled states flow from catalog definitions
2. **Encoder reuse**: `buildAdvancedFrames` delegates to existing `encodeCommand*` functions
3. **FakeBle auto-respond**: `synthesizeResponseForCommand` extended for new cases
4. **i18n keys**: Consistent `advanced.params.*` and `advanced.cmds.*` structure

## No Refactors Needed

The existing architecture cleanly supports:
- Additional command params via catalog
- Disabled vs stub distinction
- Response parsing already wired through `runCommandQueue`

## Test Results

```
Test Files  38 passed (38)
      Tests  141 passed (141)
```

## Recommendations for Future Sprints

1. Consider adding integration tests that verify the full BLE→UI→Result flow with more response types
2. If more commands need "permanently disabled" status, consider a dedicated catalog filter in the picker
3. Response_52 protocol value could surface in UI beyond just the result string (e.g., decoded meaning)
