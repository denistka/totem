# iOS API Analysis (`navitrack-mobile-ios`)

## 1. Authentication

- **Method**: Basic Authentication (HTTP Basic Auth).
- **Implementation**: `Functions.swift` -> `requestHeadersStringProperty`.
- **Headers**:
  - `Authorization: Basic <base64(user:pass)>`
  - Added manually to each `Alamofire.request` call.
- **Login Flow**:
  1. Login Screen -> Saves `LOGIN` and `PASSWORD` to `UserDefaults`.
  2. `requestHeadersStringProperty` reads from `UserDefaults`.
  3. Subsequent requests use these headers.

## 2. API Endpoints

Base URL: `http://api.navitrack.com.ua:2052/ws/` & `http://online.navitrack.com.ua:2052/ws/`
(Wait, Android used `online` exclusively? iOS uses both!)

### Enum `NaviTrack` (Object.swift)

| Case            | URL                                                            | Usage                                         |
| --------------- | -------------------------------------------------------------- | --------------------------------------------- |
| `vehicles`      | `http://api.navitrack.com.ua:2052/ws/vehicles`                 | Get all vehicles (Polling).                   |
| `vehicleInfo`   | `http://api.navitrack.com.ua:2052/ws/vehicleinfo/`             | Get info for list? (Path param?)              |
| `vehicleTrack`  | `http://online.navitrack.com.ua:2052/ws/track/getall/`         | Get track history (Different from Android!).  |
| `vehicleTrack2` | `http://online.navitrack.com.ua:2052/ws/track/get`             | Get track (Same as Android).                  |
| `point`         | `http://online.navitrack.com.ua:2052/ws/track/point`           | Get point details.                            |
| `allVehicle`    | `http://api.navitrack.com.ua:2052/ws/allvehicles`              | Get all vehicles (Admin/Full List?).          |
| `picture`       | `http://online.navitrack.com.ua:2052/cars_icons/`              | Static resource.                              |
| `loginAppDemo`  | `http://online.navitrack.com.ua:2052/ws/infra/check/demo/`     | Check demo mode.                              |
| `loginApp`      | `http://online.navitrack.com.ua:2052/ws/settings`              | Get user settings (e.g., Push token update?). |
| `doReports`     | `http://api.navitrack.com.ua:2052/ws/doreport`                 | Generate Report (POST).                       |
| `reportList`    | `http://api.navitrack.com.ua:2052/ws/reports`                  | Get Report Types.                             |
| `companyList`   | `http://api.navitrack.com.ua:2052/ws/getcompanies`             | Get Companies list.                           |
| `trackDaily`    | `http://online.navitrack.com.ua:2052/ws/track/daily/`          | Get Daily Track.                              |
| `getVea`        | `http://online.navitrack.com.ua:2052/ws/getvea/`               | Get VEA per vehicle.                          |
| `setVea`        | `http://online.navitrack.com.ua:2052/ws/savevea/`              | Set VEA.                                      |
| `setToken`      | `http://online.navitrack.com.ua:2052/ws/update/`               | Update Push Token (POST).                     |
| `validate`      | `http://online.navitrack.com.ua:2052/ws/infra/check/`          | Validate Login?                               |
| `setSettings`   | `http://online.navitrack.com.ua:2052/ws/user/settings/setmain` | Set user settings.                            |
| `getSettings`   | `http://online.navitrack.com.ua:2052/ws/user/settings/getmain` | Get user settings.                            |

## 3. Notable Differences (vs Android)

- **Subdomains**: Uses `api` and `online` interchangeably. Android used `online`.
- **Endpoints**: `allVehicle`, `loginApp`, `getSettings` exist here but absent in Android Retrofit file.
- **Reporting**: POST body includes `"type": "json2"`.

### POST `doreport` Body

```json
{
  "bunchId": Int,
  "start": Long,
  "end": Long,
  "vehicleIds": [Int],
  "companyIds": [Int],
  "partition": "PERIOD",
  "type": "json2"
}
```

## 4. Logic Flows

### Startup

1. `AppDelegate` checks `UserDefaults` for Auth.
2. If logged in, loads `Object.swift` (MainVC).
3. `Object.swift` -> `fetchUserData()` calls `NaviTrack.vehicles`.
4. Saves initial vehicle list to `UserDefaults`.

### Polling

1. `Object.swift` uses a `Timer` (lines 138-143) to call `fetchUserData()` every 30 seconds.
2. Updates `vehicles` array and reloads TableView.

### Reporting UI

1. `ReportVC` handles complex form logic.
2. Uses `ReportConvertor` to parse JSON response into UI models.
3. Errors handled with Alerts.

## 5. Quirks

- **Direct Alamofire Calls**: No central networking layer except the `NaviTrack` enum usage.
- **Global Headers**: Computed via `Functions.swift` extension.
- **Hardcoded URLs**: In `Object.swift` enum.
- **Polling**: Same 30s polling logic as Android.
