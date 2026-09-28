# S17 INVARIANTS — Real DUT macOS (live Navitrack BLE)

Depends: S01, S13, S16. Active as of S17-T0 (2026-09-24).  
Epic: E14.

## Live product target

| | |
|---|---|
| Hardware | **Navitrack BLE** fuel level DUT (ДУТ серии Navitrack-BLE) |
| Product sheet | `intel/NAVITRACK-BLE-DUT.md` (site capture 2026-09-24) |
| First field path | **macOS** Tauri desktop + `TauriBleAdapter` / `tauri-plugin-blec` |
| Catalog | Same single live BLE fuel entry as S16; this sprint proves radio against the unit on hand |

## Protocol caveat (frozen)

Marketing page lists **ModBus**. Configurator protocol remains **proprietary BLE GATT + CRC** (S01):

- Service `0bd51666-e7cb-469b-8e4d-2742f1ba77cc`
- Char `e7add780-b042-4876-aae1-112855353cc1`
- Frame `[0x31\|0x3E][netAddr][cmd][payload][CRC8]`, BLE netAddr `0xFF`
- Name filters: `Navitrek`, `Nvt`, `NavOd`, `Navi`, `TD_`
- Password auth cmd `0x50`

Do **not** implement ModBus in-app unless a future product variant is explicitly scoped.

## Encoding / identity fields (field intel 2026-09-25)

| Field | On DUT? | Charset |
|-------|---------|---------|
| Password (0x50 / writes) | yes | ASCII pad 8; default **111** |
| Vehicle / plate (E1) | yes | ASCII pad 8 — **Latin only** in practice |
| Company | no (prefs + `.txt` file) | Cyrillic OK in file/UI |

Firmware: Cyrillic **not** expected on DUT. See `intel/CLIENT-FIELD-INTEL.md`.

## Adapter / test split

| Runtime | Adapter |
|---------|---------|
| Vitest / `MODE=test` / web Vite | **FakeBle** (+ MSW for HTTP) |
| Tauri desktop/mobile, no `VITE_FORCE_FAKE_BLE` | **TauriBleAdapter** (real radio) |
| CI | No live BLE — unit tests only |

## Manual QA

- macOS preflight + happy path: `intel/DEVICE-QA.md` § macOS
- Session records: `sprints/S17/SMOKE-NOTES.md` (T3)

## Non-goals (this slice)

- iOS/Android live DUT (may append while `open_for_append`)
- Changing S01 GATT/CRC without a decision note
- Live BLE inside Vitest/CI
