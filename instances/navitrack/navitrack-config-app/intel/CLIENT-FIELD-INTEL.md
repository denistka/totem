# Client / field intel — Navitrack BLE DUT + DUT Config manual

**Captured:** 2026-09-28 (chat 2026-09-25 + manual text + settings export)  
**Sources:**
1. Telegram/chat with **Перевозчиков Євгеній** (support / product) ↔ Denis — Cyrillic & what is written to DUT  
2. Official manual **«Керівництво користувача ПЗ NAVITRACK DUT CONFIG»** v**3.0** (30.04.2026), ТОВ «НАВІТРЕК»  
3. Live settings export `navitrack-dut-settings-Navi_4214.txt` (sample unit)

**Authority vs SSOT:** Protocol / GATT / CRC SSOT remains `DUT-FUNCTIONALITY.md` + S01. This file is **product/ops field truth** (manual + client + live export). Where they conflict on wire format, prefer code + `DUT-FUNCTIONALITY.md`.

---

## 1. Cyrillic & what the firmware stores (client, 2026-09-25)

| Statement | Implication for config-app |
|-----------|----------------------------|
| «Кирилиця не підтримується в самій прошивці датчика… швидше за все ні» | Do **not** expect UTF-8 / Cyrillic round-trip on DUT string fields |
| «Туди по ідеє тільки цифри записуються» + «клієнт і номер машини» | Writable identity on DUT is thin: mostly numeric params + vehicle (plate) |
| «По ідеї підтримує кирилицю» (про файл) vs «записується тільки госномер → тоді тільки латиниця» | **Company** can be Cyrillic in the **calibration/settings file**; **vehicle/plate written to DUT → Latin/ASCII only** |

### Protocol confirmation (already in code)

- Password + vehicle payloads use **ASCII pad length 8** (`encodeAsciiPad` / legacy `Encoding.ASCII`). Non-ASCII → `?`.
- **Company** is app-local (prefs + share file), **not** a DUT write command.
- Password default in manuals: **`111`** (numeric).

**Product rule (freeze for UX / smoke):**
- Allow Cyrillic in **Company** (file/UI).
- Restrict or warn on **Vehicle** for DUT write: Latin/ASCII (max 8). Cyrillic plate will corrupt on write.
- Do not invent a Cyrillic-on-DUT feature without firmware confirmation.

---

## 2. Live sample — `Navi_4214` (export)

| Field (UA labels) | Value |
|-------------------|-------|
| Time | 18.02.2025 12:14:54 |
| Sensor name | **Navi_4214** (matches name filter `Navi`) |
| Serial | 4214 |
| Company | **Агро механизм** (Cyrillic — file/local) |
| Vehicle (ТС) | **H0981KM** (Latin plate) |
| Network address | 1 |
| Probe length, mm | 545 |
| Firmware | 26 |
| Data period, s | 10 |
| Averaging interval, s | 10 |
| Calibration range | **4096** |
| Empty-tank freq, Hz | **3262** |
| Full-tank freq, Hz | **5598** |
| Calibration table | `1:3262` · `4096:5598` (2-point full-tank style) |

Export filename pattern (legacy): `navitrack-dut-settings-{SensorName}.txt`.

---

## 3. Manual v3.0 — BLE path we care about

### Defaults & ranges (desktop + mobile chapters)

| Item | Manual | Notes vs our app |
|------|--------|------------------|
| Default DUT password | **111** | Document in UX / DEVICE-QA; do not hardcode into auth |
| Data period default | **5 s** (manual); battery ↑ if period ↓ | Our empty form default is **15** — UI default only; device value from Read |
| Averaging default | **7**; range **1…20** | Our empty form default **5** — same caveat |
| Calibration ranges | **1024 / 2048 / 4096** | Covered |
| Thermocompensation | default **0**; «не рекомендується змінювати» | Desktop PC tool. Mobile Xamarin has **locale label only** — no wired field/command in legacy mobile inventory. **Out of hybrid app scope** unless a cmd is proven |
| Empty / Full / Calibrate | Standard wet calibration | Covered as min/max capture + Command_47 |
| **Dry calibration** («Сухе калібрування») | v3.0 addition (rev 3.0 / 30.04.2026) | Legacy mobile has mode index 2 + FCS `FREQUENCY_STEP` / `PROBE_LENGTH_TOP_SHIFT`. **Hybrid app: not yet first-class UX** — gap |
| Company | Editable; **saved in calibration file** | Matches: local + share |
| Vehicle (номер ТЗ) | Editable; written with settings | DUT via Command_E1 (ASCII) |
| Graduation (тарування) | Volume (L) + live freq rows; share file | Covered (S09/S15); multi-point write S15 |
| BT min RSSI filter | Desktop «Bluetooth» settings tab | Not in mobile/hybrid settings — optional later |
| Report: specialist name + cal-file directory | Desktop «Звіт» | Maps to future installation-report (S16 stub only) |
| Auto-update / Logs toggles | Desktop | N/A / we have Logs screen |

### Dry calibration sequence (manual §3.2) — for parity backlog

1. Read settings  
2. Trim probe  
3. Select **Dry calibration**  
4. Set probe length (mm)  
5. Empty tank (capture min)  
6. Write settings  
7. Calibrate (confirm table overwrite)  
8. Re-read; verify table  
9. Then tank graduation  

**ВАЖЛИВО:** probe must be dry, no fuel residue.

### Out of hybrid BLE app scope (manual chapters)

- Windows 10 desktop `NaviTrackDutConfig` host  
- **Navitrack RS / RS-XXXX** via COM / RS-485-USB  
- **Bluetooth converter** (COM ↔ BLE bridge) config table  
- Desktop auto-updater  

Keep documenting as product-family context; do not implement in `navitrack-config-app` without a new epic.

### Mobile Play chapter (§6)

- Package: `com.navitrack.dut_configurator` (matches DUT-FUNCTIONALITY)  
- Graduation tab may require support activation (`+38 (050) 490-50-61`) — cloud flag territory; our Advanced/Graduation gates differ (FCS Advanced flag; Graduation enabled locally)  
- Hub tabs Sensors / Settings / Logs / About — superseded in our shell by S16 IA  

---

## 4. Coverage vs navitrack-config-app (2026-09-28)

| Topic | Status |
|-------|--------|
| BLE GATT/CRC, name filters, password 0x50 | ✅ |
| Company local + Vehicle DUT write | ✅ (encoding caveat now explicit) |
| Cyrillic on DUT string fields | ✅ documented: **no** / ASCII only |
| Read/Write settings + 2-point cal 47 | ✅ |
| Graduation table + share (+ DUT write S15) | ✅ |
| Live sample field set (Navi_4214) | ✅ recorded |
| Default password **111** in QA/docs | ✅ this intel + DEVICE-QA |
| Dry / Not-full calibration modes (FCS math) | ⚠️ **gap** — backlog |
| Thermocompensation field | ⚪ out of scope (desktop; unwired in mobile) |
| Desktop COM / RS / BT converter | ⚪ out of scope |
| Settings share text = UA localized legacy format | ⚠️ partial (EN-ish share today) |
| Installation report specialist + file dir | ⚠️ S16 stub only |
| Min RSSI scan filter | ⚪ not ported |

---

## 5. Related

- `DUT-FUNCTIONALITY.md` — behaviour / protocol SSOT  
- `NAVITRACK-BLE-DUT.md` — hardware marketing sheet  
- `PARITY-CHECKLIST.md` — gaps row updated  
- `DEVICE-QA.md` — smoke with password **111** + ASCII vehicle note  
- `S17-INVARIANTS.md` — encoding freeze for live DUT  
