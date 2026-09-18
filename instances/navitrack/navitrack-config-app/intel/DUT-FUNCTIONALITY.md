# DUT Functionality Inventory — navitrack-dut-config-mobile

Source: `/Users/denistka/Projects/navitrack/navitrack-dut-config-mobile`  
Product: NaviTrack DUT / fuel-level sensor configurator  
Android package: `com.navitrack.dut_configurator` (versionCode/Name **56**)  
Stack: **Xamarin.Forms 3.4** + **Plugin.BLE 2.1.0** (shared netstandard2.0)

Status: deep inventory for Tauri rebuild into `navitrack-config-app`.  
Visual SSOT for rebuild: `navitrack-mobile-apps`. Package manager: **bun**.

---

## 1. Repo structure

| Path | Role |
|------|------|
| `NaviTrackDutConfigMobile/App/App/` | Shared UI + protocol + settings |
| `App.Android/` | Shipping host (BLE permissions, `IDevice`) |
| `App.iOS/` | Incomplete scaffold (placeholder bundle `com.companyname.App`, no `IDevice`, weak BLE plist) |
| `Doc/` | Google Play / Manual deployment Word docs |
| `PlayMarket/` | Store logos + screenshots |
| Root `*.apk` / `*.aab` | Built Android artifacts |

Shared domains: `Pages/`, `SensorConfigurator/`, `Settings/`, `Server/`, `CalibrationData/`, `Logs/`, `Localization/`, `Utils/`.

**No** ViewModels/, Services/, USB/serial host, firmware OTA.

---

## 2. Screens & navigation

```
App start → NavigationPage(MainPage)
         → OnStart: ServerHelper.GetUserSettings(); KeepScreenOn

MainPage
 ├─ SensorsPage → (BLE connect) → SensorPage (TabbedPage)
 ├─ SettingsPage
 ├─ LogsPage (singleton retained on MainPage)
 └─ AboutPage
```

| Screen | Files | Purpose |
|--------|-------|---------|
| MainPage | `Pages/MainPage.xaml(.cs)` | Hub: Sensors / Settings / Logs / About; clears temp files on load |
| SensorsPage | `Pages/SensorsPage.xaml(.cs)` | BLE scan list; connect; open SensorPage |
| SensorPage | `Pages/SensorPage/*` | Device session after password |
| → Standard | `SensorPage_StandardModeTab.cs` | Auth, live data, read/write settings, simple cal write, share |
| → Change Password | `ChangePasswordTab.cs` | DUT password change (0x59) |
| → Calibration | `SensorPage_CalibrationTab.cs` | Multi-row fuel/freq table; local persist + share (**does not** write table to DUT) |
| → Advanced | `SensorPage_AdvancedModeTab.cs` | Raw command picker (server-gated) |
| SettingsPage | `Pages/SettingsPage.xaml(.cs)` | Language, scan, timeouts, cal rows, auto-advertise |
| LogsPage | `Pages/LogsPage.*` | In-memory log, clear, share |
| AboutPage | `Pages/AboutPage.*` | App name + version |

No app login screen. Auth = **DUT numeric password** (cmd 0x50), not cloud credentials.

---

## 3. BLE transport

| Item | Value |
|------|-------|
| Library | Plugin.BLE |
| Name filters | `Navitrek`, `Nvt`, `NavOd`, `Navi`, `TD_` |
| Service UUID | `0bd51666-e7cb-469b-8e4d-2742f1ba77cc` |
| Characteristic | `e7add780-b042-4876-aae1-112855353cc1` |
| MTU | `RequestMtuAsync(200)` |
| Notify | Indicate **or** Notify required |
| Permissions | Location (scan) + Android 12+ `BLUETOOTH_SCAN`/`CONNECT` |

**Auto-connect mode:** parse manufacturer data as `Response_53` → fuel/temp/battery on list row without GATT.

**No USB / classic SPP / Wi‑Fi.** Baud commands (E2/E3) configure the **sensor’s COM baud**, still over BLE.

Watchdog (5s): command pending > `LastSentCommandThresholdSec` (default 10) **or** idle no response > `LastReceiveResponseThresholdSec` (default 45) → reconnect alert.

---

## 4. Features

### Standard mode (post-password)

| Capability | Protocol evidence |
|------------|-------------------|
| Live telemetry | 0x06 / 0x61 → fuel, frequency, temperature, battery |
| Read settings chain | E0 → 14 → 4D → C8 → 48 |
| Write settings chain | E1 (if vehicle) else 56 → 56 → 4E → 0E → 13 → optional 47 |
| 2-point calibration write | Command_47 `[min, 1, max, calType]` |
| Min/Max from live frequency | UI copies `Frequency_ent` |
| Calibration modes | Full tank / Not full / Dry — uses server params FREQUENCY_STEP, PROBE_LENGTH_TOP_SHIFT, INIT_CALIBRATION_BOTTOM_SHIFT |
| Share settings | Human-readable `.txt` via Essentials Share |
| Reconnect | Re-runs GATT setup |

Editable: Company (local), Vehicle, Network address, Sensor length, Period, Averaging, Calibration type (1024/2048/4096), Min/Max.  
Read-only: Updated time, Serial, Firmware, Fuel/Freq/Temp/Power.

### Change password
Current + serial + new → **0x59**.

### Calibration data tab
- Default **32** rows fuel ↔ frequency; auto-save 5s to Properties by sensor name
- Add row fills previous empty with **live frequency**
- Share `navitrack-dut-calibration-data-*.txt`
- **Does not** push multi-point table to device (that’s Standard’s Command_47)

### Advanced mode (server-gated)
Shown if `GetUserSettings` returns flag `IS_ADVANCED_MODE_TAB_ENABLED` (=1). Locally forced false each Init, then server may enable.

Notable opcodes (EN labels from LocaleEn): 06, 0E, 13, 14, 17, 42, 43, 45–52, 56, 58, 59, 5A, 61, C8, D3/D4, E0–E3; combo 43+56.  
**Stubbed/bugs:** Advanced 46/47 send commented; Response_52 unwired; 5A TODO empty; firmware **read only — no OTA**.

### Explicitly absent
Firmware flash/OTA · USB/UART host · Preset library / import settings · User account login · Map/Geotab live (protocol enum only).

---

## 5. Protocol framing (rebuild-critical)

```
Command:  [0x31][netAddr][cmdCode][...payload...][CRC8]
Response: [0x3E][netAddr][cmdCode][...payload...][CRC8]
```

- CRC: Dallas/Maxim table `0x31` (`Crc8Helper.cs`) — copy exactly
- BLE net address for commands: **0xFF**
- Password / vehicle: ASCII padded length **8**
- Endianness: BitConverter / little-endian on current platforms

`UserState`: None → ReadSettings / WriteSettigs / ChangePassword / SendSingleCommand / SendMultiplyCommands / WriteCalibrationData

---

## 6. Server API

Base: `https://api.fcs.navitrack.com.ua`

| Endpoint | Effect |
|----------|--------|
| `POST /scfg/GetUserSettings` `{ userId, userId2 }` | Advanced flag + FREQUENCY_STEP, PROBE_LENGTH_TOP_SHIFT, INIT_CALIBRATION_BOTTOM_SHIFT |
| `POST /scfg/SendLogMessage` | Crash/log telemetry |

`userId`/`userId2` = SHA-256 of device fingerprint (`Sha256HashHelper`); `userId2` adds AndroidId via `IDevice` (**Android only**).

---

## 7. App settings keys

| Key | Default | Meaning |
|-----|---------|---------|
| Language | ua | ua / ru / en |
| ScanPeriod | 30 s | BLE scan timeout |
| LastSentCommandThresholdSec | 10 | Command timeout |
| LastReceiveResponseThresholdSec | 45 | Idle response timeout |
| CountCalibrationRows | 32 | Calibration table size |
| AutoConnectSensor | false | Parse advertise telemetry |
| UserId / UserId2 | computed | FCS identity |
| Company | remembered | Standard form |
| IsAdvancedModeTabEnabled | server | Advanced tab |
| IsCalibrationTabEnabled | forced true locally; server flag unused | |
| FrequencyStep / ProbeLengthTopShift / InitCalibrationBottomShift | defaults + server | Cal math |

---

## 8. UI patterns (legacy — do not copy look)

Code-behind + `partial SensorPage` (5 files). NavigationPage + TabbedPage. Lime brand `#B5CC18`, pill buttons. i18n via `Localizer` dictionaries (~200 keys), not RESX.

**New app visual identity:** `navitrack-mobile-apps` theme (`#94b32c` / `#8cc63f` / `#1a1c17`), not legacy Xamarin chrome.

---

## 9. Rebuild module map

1. **UI** — Main hub, Scanner, Device session (tabs), Settings, Logs, About  
2. **ble** — scan/connect/GATT notify/write  
3. **protocol** — encode/decode + CRC + command runners  
4. **api** — GetUserSettings / SendLogMessage  
5. **storage** — prefs + temp file share  
6. **i18n** — ua/ru/en from Locale*.cs  

### Product decisions to settle

- Calibration tab vs Standard cal-write are different concepts — clarify UX  
- Keep or drop Advanced Mode stubs (46/47/5A/52)  
- iOS BLE parity (legacy incomplete)  
- Fingerprinting privacy for FCS userIds  

### Tauri risks

BLE plugin on iOS/Android · Location for scan · Share sheet · Keep-awake · Offline defaults for flags · Doc password “NaviTrack” in Word — rotate for new release process.
