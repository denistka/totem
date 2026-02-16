# Legacy UI/UX Audit

## 1. Screen Inventory

Based on Android Resource files and iOS ViewControllers.

| Screen               | Description             | Android Components                                   | iOS Components                              |
| -------------------- | ----------------------- | ---------------------------------------------------- | ------------------------------------------- |
| **Login**            | Auth screen             | `fragment_login.xml`                                 | `LoginViewController`                       |
| **Map (Main)**       | Main tracking interface | `map.xml`, `map_bottom_sheet.xml`                    | `MapViewController`, `ClusteringVC`         |
| **Object List**      | List of vehicles        | `object_fragment.xml`, `object_item_fragment.xml`    | `Object` (VC), `ObjectCell`                 |
| **Tracking History** | Path playback/history   | `tracking_fragment.xml`, `tracking_bottom_sheet.xml` | `TrackerVC`, `TrackerMapVC`                 |
| **Reports**          | Report generation form  | `report_fragment.xml`                                | `ReportVC`, `ReportViewController` (Result) |
| **Settings**         | User settings           | `settings_fragment.xml`                              | `SettingsVC`                                |
| **Info Windows**     | Popups on map markers   | `custom_info_contents.xml`                           | `CustomInfoWindow` (XIB)                    |

## 2. Visual Identity & Color Palette

The legacy brand is heavily defined by a specific "Olive Green" palette.

| Token Name                       | Hex Code  | Usage                                   |
| -------------------------------- | --------- | --------------------------------------- |
| **Primary (High Green)**         | `#485503` | Headers, Primary Buttons, Active States |
| **Secondary (Middle Green)**     | `#546B03` | Subheaders, Gradients                   |
| **Tertiary (Short/Light Green)** | `#A3B000` | Checkboxes, Accents, Highlights         |
| **Blue (Custom)**                | `#63A1D0` | Links, Some icons                       |
| **Background Green**             | `#EDF3EB` | Page backgrounds (Android)              |
| **Text Color**                   | `#1F1F1F` | Primary text                            |

**Typography**:

- Android: Default System Font (likely Roboto).
- iOS: Default System Font (San Francisco).
- No custom fonts detected.

## 3. UI Patterns & Components

- **Bottom Sheets**: Used extensively for details.
  - _Android_: `BottomSheetBehavior` with `design_bottom_sheet_fixed.xml`.
  - _iOS_: Likely custom implementations or modal presentations.
- **Gradient Headers**:
  - Both platforms use a 3-color gradient (High -> Middle -> High Green) for Navigation Bars.
- **Floating Action Buttons (FAB)**:
  - Used in Android (`my_custom_button_save.xml`?) and iOS for primary actions on Map.
- **Cards**:
  - Vehicle list items (`object_event_item.xml`, `ObjectCell.swift`) use card-like styling with shadows.

## 4. Platform Differences

- **Navigation**:
  - Android: Drawer Layout (implied by `drawer_click_back` color).
  - iOS: Side Menu (SideMenu library used in `Object.swift`).
- **Maps**:
  - Android: Google Maps + OSM (OpenStreetMap) variants found (`map_open_street.xml`).
  - iOS: Google Maps + Mapbox (`Podfile`).

## 5. Modernization Strategy (Vue 3 / Tailwind)

Mapping legacy styles to a modern aesthetic.

### Color Mapping

- Legacy `#485503` (Olive) -> **Modern Primary**: `emerald-800` or custom `#3f6212` (lime-800).
- Legacy `#A3B000` (Lime) -> **Modern Accent**: `lime-500`.
- **Recommendation**: Shift from "Muddy Olive" to "Vibrant Emerald/Lime" for a fresher look while keeping brand recognition.

### Component Recommendations

- `NtHeader`: Implement the gradient header but cleaner (maybe subtle blur).
- `NtBottomSheet`: Reusable Vue component for map details.
- `NtVehicleCard`: Card component for the vehicle list with status indicators (Parked/Moving).
- `NtMap`: Wrapper around MapLibre/Leaflet (since we are moving to PWA/Tauri, generic web maps like MapLibre are better than native SDKs).
