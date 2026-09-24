# S16 DECISION — Design Mix

Date: 2026-09-24  
Sprint: S16 · Task: T5  
Depends: S16-T0 / `S16-INVARIANTS.md`

## Mix rules (frozen)

| Layer | Source | Notes |
|-------|--------|-------|
| Chrome / Logo / glass / AppHeader sheet / motion | `navitrack-mobile-apps` | Tokens, header expand sheet, Login composition cues |
| Information architecture | Customer ESCORT Configurator refs (`intel/design-refs/S16-customer/`) | Splash → home tiles → catalog → report intro |
| Branding | **NaviTrack** | Not ESCORT logo, red palette, or product copy clone |

## Primary flow

```
welcome → home (tiles) → catalog → sensor-session
```

Settings: **AppHeader expand sheet only** (`settingsHubTab: removed`).

## Home tile → route map

| Tile id | Label (intent) | Navigates to |
|---------|----------------|--------------|
| `sensors` | Sensor settings / scan | `catalog` (then session) — interim: `sensors` hub until catalog lands |
| `logs` | Logs | `logs` screen |
| `installation-report` | Installation report | `installation-report` intro stub |
| `about` | About | `about` screen |

No GPS/GLONASS tracker tile. No personal-account tile.

## Catalog extensibility

- Data model: list of products (`id`, `name`, `transport: ble | rs485`, `status: live | comingSoon`).
- **Now:** exactly **one** live BLE fuel-level DUT (existing name filters / session).
- Others: `comingSoon` / disabled UI placeholders for future models.
- RS-485 path: catalog may show BT-only or hide RS-485 this sprint.

## Non-goals (this sprint)

- Fleet GPS / tracker setup hub tile  
- Cloud personal account / logout  
- RS-485 install path  
- Full 6-step installation report wizard (intro stub only)  
- ESCORT visual clone  

## Runtime mirror

`S16_UX_IA` in `src/config/invariants.ts` (+ catalog constants added with T7).
