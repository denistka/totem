# S15 INVARIANTS — Graduation Multi-Point DUT Write

Depends: S01, S12. Active as of S15-T0 (2026-09-18).

## Amendment

| Before (S09/S12) | After (S15) |
|------------------|-------------|
| Graduation tab never multi-point-writes DUT | Graduation **may** write multi-point table via **Command_47** from draft rows |
| Standard mode owns 2-point Command_47 UX | Standard keeps 2-point; Graduation owns full-table write |

## Unchanged

- Local draft autosave + share `.txt` remain.
- Unit tests: FakeBleAdapter only; no live FCS.
- Advanced Command_46 = 3-point path (S14); do not conflate with Graduation 47 packing.

## UX

- Explicit **Write to device** control (not silent).
- Password required; success/error alerts.
- Optional Command_48 read-back after write.
- Disclaimer text updated (no longer “never writes”).

## Runtime mirror

See `GRADUATION_PRODUCT_RULES` in `navitrack-config-app/src/config/invariants.ts` and `intel/S15-INVARIANTS.md`.
