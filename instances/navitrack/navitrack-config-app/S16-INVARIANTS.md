# S16 INVARIANTS — Design Shell Parity (Welcome + Structured Hub)

Depends: S01, S15. Active as of S16-T0 (2026-09-24).  
Epic: E13.

## Amendment (supersedes S01 §16 hub-as-primary)

| Before (S01) | After (S16) |
|--------------|-------------|
| Primary nav = bottom hub tabs **Sensors · Settings · Logs · About** | Primary IA = **Welcome → Home tiles → Catalog → Sensor session** |
| Settings = hub tab screen | Settings = **AppHeader expand sheet only** (`settingsEntry: app-header-sheet`) |
| — | Settings hub tab **removed** (not “opens sheet”) |

S01 §17 sensor-session tabs unchanged.

## Entry + shell IA

1. **Welcome** — first screen (mobile-apps Login composition; no cloud auth). Scan CTA when BLE ready; else BT/permission warning (T2/T3).
2. **Home** — customer-structured 2×2 tile hub; chrome/tokens from mobile-apps (T6).
3. **Catalog** — product grid; **one** live BLE fuel sensor now; others `comingSoon` / disabled (T7).
4. **Sensor session** — existing Standard / Change password / Graduation / Advanced.
5. **Installation report** — intro scaffold stub only (T8); no full wizard this sprint.

## Settings surface

- **Sheet-primary:** DUT app settings (theme, language, scan period, thresholds, cal rows, auto-connect, save) live in AppHeader expand sheet (T1/T4).
- **Hub tab:** `settings` **removed** from bottom tab bar target (`hubTabIdsTarget`).
- Bottom tabs (sensors / logs / about) are **secondary** until home tiles own primary nav; may remain as shortcuts after T6.

## Design mix (see also T5 / `DECISION-DESIGN-MIX.md`)

| Layer | Source |
|-------|--------|
| Chrome, Logo, glass, header sheet, motion | `navitrack-mobile-apps` |
| IA / structure (splash, tiles, catalog, report intro) | Customer refs `intel/design-refs/S16-customer/` |
| Brand | **NaviTrack** — not ESCORT clone |

### Home tile → route (T5 freeze)

| Tile | Route |
|------|-------|
| `sensors` | catalog → session (interim: sensors hub) |
| `logs` | logs |
| `installation-report` | installation-report stub |
| `about` | about |

### Catalog

- One live BLE fuel DUT now; model list extensible via `comingSoon` placeholders.
- No RS-485 / GPS / account this sprint.

## Non-goals (this sprint)

- Fleet GPS / tracker setup tile  
- Cloud personal account  
- RS-485 catalog path  
- Full multi-step installation report wizard  

## Runtime mirror

`navitrack-config-app/src/config/invariants.ts` → `S16_UX_IA`  
(`HUB_TAB_IDS` stays transitional until T4 removes `settings` from the live tab bar.)

## Amends

- `S01-INVARIANTS.md` §16 — superseded by this document for primary nav / settings entry.
