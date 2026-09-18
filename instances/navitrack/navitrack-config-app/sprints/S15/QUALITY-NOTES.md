# S15 Quality Notes

Date: 2026-09-18
Sprint: S15 — Graduation Multi-Point DUT Write

## Summary

S15 enables the Graduation tab to write multi-point calibration tables to DUT via Command_47, superseding the S09/S12 "never write" invariant.

## Changes Reviewed

### T0 — Invariants
- ✅ `intel/S15-INVARIANTS.md` created
- ✅ `S12-INVARIANTS.md` updated (both root + sprints/S12 copy)
- ✅ `sprints/S09/DECISION.md` amended with S15 supersession
- ✅ `src/config/invariants.ts` — added `GRADUATION_PRODUCT_RULES`
- ✅ `invariants.test.ts` — new test for graduation rules

### T1 — graduation-pack.ts
- ✅ `src/protocol/graduation-pack.ts` — pack/unpack functions
- ✅ `graduation-pack.test.ts` — 13 tests incl. golden tests vs encodeCommand47

### T2 — Write to device + password gate
- ✅ `sensor-session-actions.ts` — `writeGraduationTable` action
- ✅ `useSensorSessionStore.ts` — wired action
- ✅ `GraduationTab.tsx` — password gate, Write button, status alerts
- ✅ i18n en/uk/ru — new graduation keys
- ✅ `graduation-draft.ts` — updated footer (no "NOT written")
- ✅ `GraduationTab.test.tsx` — 10 dedicated tests
- ✅ `ChangePasswordTab.test.tsx` — updated assertions

### T3 — Command_48 read-back
- ✅ Read-back verification integrated into writeGraduationTable
- ✅ `gradReadbackOk` / `gradReadbackMismatch` statuses
- ✅ FakeBle tests cover both match and mismatch scenarios

### T4 — Docs
- ✅ `intel/PARITY-CHECKLIST.md` — graduation row updated + gap marked done
- ✅ `intel/DEVICE-QA.md` — added graduation tab write steps

## Code Quality

- **Test coverage**: 165 tests, all passing
- **No regressions**: Existing functionality preserved
- **i18n complete**: All three locales updated consistently
- **Type safety**: Full TypeScript coverage, no `any` escapes

## Refactor Notes

No refactors required. Code follows existing patterns:
- Actions in `sensor-session-actions.ts`
- Store wiring in `useSensorSessionStore.ts`
- Protocol helpers in `src/protocol/`
- Component tests colocated

## Test Results

```
 Test Files  40 passed (40)
      Tests  165 passed (165)
```

## Closeout

- `bun run test` green ✅
- All S15 `.pd` and `.ptl` files marked `gate: CLOSED`
