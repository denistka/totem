# S16 Invariants — Design Shell Parity

Date: 2026-09-24  
Depends: S01-INVARIANTS.md, S15-INVARIANTS.md

## Product Change

**S16 amends S01 §16:** primary IA is Welcome → Home tiles → Catalog → Session; DUT settings enter via **AppHeader expand sheet**; settings hub tab **removed**.

## Rules

| Invariant | Value / rule |
|-----------|--------------|
| Entry flow | `welcome` → `home` → `catalog` → `sensor-session` |
| Settings entry | `app-header-sheet` |
| Settings hub tab | `removed` |
| Hub tab bar target (post-T4) | `sensors`, `logs`, `about` (secondary) |
| Home tiles | `sensors`, `logs`, `installation-report`, `about` |
| Live catalog products now | 1 (BLE fuel DUT) |
| Brand | NaviTrack (not ESCORT) |
| Chrome SSOT | navitrack-mobile-apps |

## Runtime Mirror

`src/config/invariants.ts` → `S16_UX_IA`

## Amends

- `S01-INVARIANTS.md` §16 — see supersede note.
- Full write-up: `S16-INVARIANTS.md` (instance root).
