# NaviTrack BLE — DUT product sheet (live sensor)

**Source:** [https://navitrack.com.ua/ru/solution/navitrack-ble/](https://navitrack.com.ua/ru/solution/navitrack-ble/)  
**Captured:** 2026-09-24  
**Purpose:** Product/hardware context for real-device sprint (S17+). App protocol SSOT remains `DUT-FUNCTIONALITY.md` + S01 GATT/CRC invariants — **not** this marketing page.

## Product

| | |
|---|---|
| Name | Датчик уровня топлива **Navitrack BLE** (ДУТ серии Navitrack-BLE) |
| Role | Measure level/volume of liquid in tanks (incl. hazardous where TC rules apply) |
| Fluids | Gasoline, diesel, oil, liquid additives, liquids inert to aluminum, etc. |
| Construction | Aluminum + fuel-resistant plastic; sealable outer housing; inner electronics cover + gasket |
| Sensing | Removable capacitive probe (capacitance ∝ fuel level) → digital level in measuring head + temperature + averaging |

## Interfaces (product family)

| Variant | Link to receiver |
|---------|------------------|
| Wired | **RS-485** |
| Wireless (our DUT) | **Bluetooth Low Energy (BLE 4.0 / BLE)** |

Configurator app scope: **BLE only** (S01). RS-485 host not in app.

## Marketing “advantages” (BLE)

- Cable-free install
- Battery life marketed as **~5–7 years** on one cell (Li-SOCl₂ + BLE low energy)
- Rugged sealed shock-resistant housing (PA6 glass-filled polyamide outer shell)
- Phone-based configuration

## Specs table (from site «Характеристики»)

| Parameter | Value |
|-----------|--------|
| Output / work mode | Digital |
| Receiver interface | **BLE** |
| Data protocol (marketing) | **ModBus** ← see caveat below |
| Level accuracy (working range) | ≤ **1%** |
| Temperature accuracy | **±1 °C** |
| Transmit period | **2 … 6000** s |
| Supply | **3.6 V** (built-in) |
| Shock protection class | III |
| Probe length | **20 … 4000** mm |
| Housing material | PA6 (glass-filled polyamide) |
| Probe material | Aluminum |
| Ingress | **IP67** |
| Operating ambient | **−20 … +50 °C** |
| Ambient limit | **+50 °C** |
| Net mass | ≤ **0.5 kg** |
| Boxed size (L×W×H) | **1000×100×100** mm |

## Downloads (site)

| Doc | URL |
|-----|-----|
| document.pdf | https://navitrack.com.ua/wp-content/uploads/2023/02/document.pdf |
| Ekspertyza_BLE.pdf | https://navitrack.com.ua/wp-content/uploads/2021/12/Ekspertyza_BLE.pdf |

## Caveat — protocol for *this* app

Site lists **ModBus** as “протокол передачи данных”. The **navitrack-config-app** DUT path (legacy Xamarin + our port) uses **proprietary framed BLE GATT**:

- Service `0bd51666-e7cb-469b-8e4d-2742f1ba77cc`
- Char `e7add780-b042-4876-aae1-112855353cc1`
- Frame `[0x31\|0x3E][netAddr][cmd][payload][CRC8]`, BLE netAddr `0xFF`
- Name filters: `Navitrek`, `Nvt`, `NavOd`, `Navi`, `TD_`

Do **not** implement Modbus in the configurator unless a future product variant is explicitly scoped. Treat ModBus as product-family / wired-side marketing language until proven otherwise on the live DUT.

## App catalog mapping (S16+)

- Live catalog product now = this **Navitrack BLE** fuel DUT (one physical unit on hand).
- Future catalog rows = other models; this sheet is the first enabled entry’s hardware brief.

## Related intel

- `DUT-FUNCTIONALITY.md` — app behaviour SSOT  
- `NATIVE-BLE.md` — TauriBleAdapter / blec  
- `DEVICE-QA.md` — manual smoke (extend for macOS in S17)  
- `S01-INVARIANTS.md` — UUIDs / name filters  
