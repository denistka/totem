# S01 INVARIANTS — navitrack-config-app DUT port

Frozen for all subsequent sprints. Changes require explicit user approval.

## Product

1. Config-app is a **BLE-only DUT fuel-sensor configurator** (parity with `navitrack-dut-config-mobile`).
2. **Visual identity** = `navitrack-mobile-apps` design system (not legacy Xamarin lime chrome).
3. **Package manager** = **bun** only.
4. No app cloud login; auth is **DUT numeric password** (cmd 0x50).

## Testing (HARD)

5. **Every deliverable is test-covered** per `intel/TEST-COVERAGE-MANDATE.md`.
6. Pyramid: Vitest + Testing Library + MSW + Playwright (`intel/TESTING.md`).
7. `bun run test` must pass before any task is marked done.

## Code quality (HARD — after each sprint)

8. **Post-sprint quality review + refactor as needed** per `intel/CODE-QUALITY-MANDATE.md`.
9. Reuse **common UI** from `src/ui`; follow React + Tauri best practices; no silent tech debt between sprints.
10. Sprint is not closed until quality closeout (review → refactor or follow-up `.pd`) is done and tests stay green.

## Architecture

11. Protocol framing: `[0x31|0x3E][netAddr][cmd][payload][CRC8]`; BLE netAddr `0xFF`; CRC Dallas/Maxim table from legacy `Crc8Helper`.
12. BLE UUIDs frozen: service `0bd51666-e7cb-469b-8e4d-2742f1ba77cc`, char `e7add780-b042-4876-aae1-112855353cc1`.
13. Name filters: `Navitrek`, `Nvt`, `NavOd`, `Navi`, `TD_`.
14. FCS base: `https://api.fcs.navitrack.com.ua` (`/scfg/GetUserSettings`, `/scfg/SendLogMessage`).
15. Application code only under `paths.code` (`navitrack/navitrack-config-app`), never inside `totem/`.

## UX IA (hub)

16. ~~Primary nav mirrors legacy MainPage: **Sensors · Settings · Logs · About** (may live under shell tabs / hub, not fleet tabs).~~  
    **Superseded by S16** (`S16-INVARIANTS.md`): primary IA = **Welcome → Home tiles → Catalog → Sensor session**; DUT settings via **AppHeader expand sheet**; settings hub tab **removed**. Bottom tabs sensors/logs/about may remain secondary.  
    Historical S01–S15 behaviour used hub tabs including Settings until S16-T4.
17. Sensor session tabs: **Settings (Standard) · Change password · Graduation · Commands (Advanced, server-gated)**.
