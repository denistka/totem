# DUT Functionality Guide — NaviTrack Config (hybrid as-built)

**SSOT** for hybrid app behaviour after **S18**.  
Code: `navitrack/navitrack-config-app` · Package manager: **bun** · Stack: React 19 + Tauri 2.

Legacy Xamarin inventory lived in this file through S17; **this rewrite documents the hybrid product** (screens, BLE, protocol, FCS, calibration). A short legacy pointer remains at the end.

Related: `PARITY-CHECKLIST.md` · `CLIENT-FIELD-INTEL.md` · `DEVICE-QA.md` · `S18-INVARIANTS.md`.

---

## 1. Product IA (S16 shell)

```
Boot (LogoLoader) → FCS bootstrap (soft-fail)
                  → Welcome (BLE ready / permission)
                  → Home tile hub
                       ├─ Sensors (scan list)
                       ├─ Catalog (one active sensor type)
                       ├─ Settings (header sheet + hub)
                       ├─ Logs
                       └─ About
Sensors / Catalog → Sensor session (tabs)
```

| Surface | Role |
|---------|------|
| Welcome | Brand + Scan CTA or BT permission warning |
| Home | Tile hub for DUT features |
| Sensors | BLE scan / connect list |
| Sensor session | Password gate → Standard / Password / Graduation / Advanced |
| Settings | Language, scan period, watchdog thresholds, cal rows, autoConnect, company |
| Logs / About | Diagnostics + version |

No cloud login. Auth = **DUT password** (`0x50`). Default in field manuals: often **`111`** (hint only — not hardcoded auth).

---

## 2. BLE session

| Item | Hybrid |
|------|--------|
| Adapter | `TauriBleAdapter` inside Tauri; `FakeBleAdapter` on web / Vitest |
| Force Fake | `VITE_FORCE_FAKE_BLE=1` only for demos |
| Name filters | `Navitrek` / `Nvt` / `NavOd` / `Navi` / `TD_` |
| Service / char | Same GATT UUIDs as legacy (`BLE_GATT`) |
| MTU | Request 200 |
| Connect | Tap list → GATT connect **without** second scan (`knownDevice` / `skipScan`) |
| Desktop launch | `bun run macos:dev` — see `sprints/S17/MACOS-BUILD.md`, smoke in `sprints/S18/SMOKE-NOTES.md` |

**autoConnectSensor** (default **false**): when true, scan rows enrich with advertise **Response_53** fuel/temp/battery; when false, list shows name/RSSI only.

**Watchdog** (after unlock): thresholds from settings (default **10s** last-sent / **45s** idle receive). On trip → status alert + GATT reconnect attempt.

---

## 3. Standard tab (post-password)

| Capability | Behaviour |
|------------|-----------|
| Live telemetry | Commands `0x06` / `0x61` |
| Read settings | Chain E0 → 14 → 4D → C8 → 48 |
| Write settings | E1 (if vehicle) else 56 → 56 → 4E → 0E → 13 → optional 47 |
| Calibration write | **Command_47** `[min, 1, max, calType]` |
| Share | Text via share helper; filename `navitrack-dut-settings-{SensorName}.txt` |

### Encoding

| Field | On DUT? | Charset |
|-------|---------|---------|
| Password | yes | ASCII pad 8 |
| Vehicle | yes | ASCII pad 8 — UI warns if non-ASCII (→ `?` on wire) |
| Company | no | Prefs + share file; Cyrillic OK |

### Calibration modes (S18)

| Mode | Index | Max derivation |
|------|-------|----------------|
| Full tank | 0 | Entered min + max |
| Not full | 1 | `INIT_CALIBRATION_BOTTOM_SHIFT` + (currentFreq − min) |
| Dry | 2 | min + (probeLength − `PROBE_LENGTH_TOP_SHIFT`) × `FREQUENCY_STEP` |

FCS params come from GetUserSettings (or defaults). Manual dry field sequence: `CLIENT-FIELD-INTEL.md`.

---

## 4. Other session tabs

| Tab | Behaviour |
|-----|-----------|
| Change password | Command `0x59` |
| Graduation | Multi-point table; **write to DUT** via Command_47 (S15) + optional 48 read-back |
| Advanced | Shown when FCS `isAdvancedModeTabEnabled`; command picker (S14 stubs policy) |

---

## 5. Protocol summary

```
Command:  [0x31][netAddr][cmdCode][...payload...][CRC8]
Response: [0x3E][netAddr][cmdCode][...payload...][CRC8]
```

- CRC: Dallas/Maxim table `0x31`
- BLE net address: **0xFF**
- Password / vehicle: ASCII pad **8**

---

## 6. FCS cloud

Base: `https://api.fcs.navitrack.com.ua`

| Call | When |
|------|------|
| `GetUserSettings` | App start: fingerprint → apply Advanced + cal params (soft-fail offline) |
| `SendLogMessage` | Log telemetry |

Unit tests: **MSW only** — never live FCS in CI.

---

## 7. App settings defaults

| Key | Default |
|-----|---------|
| language | `ua` (i18n code `uk`) |
| scanPeriod | 30 s |
| lastSent / lastReceive | 10 / 45 s |
| countCalibrationRows | 32 |
| autoConnectSensor | false |
| frequencyStep / probeLengthTopShift / initCalibrationBottomShift | 4.413… / 10 / 500 |

---

## 8. Non-goals (frozen — S18)

- Desktop COM / RS-485 / Bluetooth converter  
- Thermocompensation UI  
- Min RSSI scan filter  
- Full Installation Report wizard (S16 stub remains)  
- Application code under `totem/`  
- Live BLE in unit/CI tests  

---

## 9. Testing

| Layer | Rule |
|-------|------|
| Unit / integration | Vitest + FakeBle + MSW — `bun run test` |
| Device smoke | `DEVICE-QA.md` · record in `sprints/S18/SMOKE-NOTES.md` |
| Mandate | `TEST-COVERAGE-MANDATE.md` |

---

## 10. Legacy source (history)

Functional origin: `navitrack/navitrack-dut-config-mobile` (Xamarin.Forms + Plugin.BLE).  
Visual / hybrid shell: `navitrack/navitrack-mobile-apps`.  
Do not treat the Xamarin repo as runtime SSOT after S18 — use **this guide** + code under `paths.code`.
