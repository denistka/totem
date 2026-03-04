# API Analysis — Old iOS & Android App Implementation
**Sprint 63 · TG1 Artifact**

---

## 1. Base URLs

| App     | Base URL |
|---------|----------|
| iOS     | `http://api.navitrack.com.ua:2052` (track), `http://online.navitrack.com.ua:2052` (online) |
| Android | Same endpoints |
| PWA     | Proxied via `/api-nav` and `/api-online` |

---

## 2. Authentication

All requests use **HTTP Basic Auth** via `Authorization: Basic <base64(login:password)>` header.

iOS implementation (`Functions.swift`):
```swift
func requestHeadersString(login: String, password: String) -> [String: String] {
    let credentialData = "\(login):\(password)".data(using: .utf8)!
    let base64Credentials = credentialData.base64EncodedString(options: [])
    return ["Authorization": "Basic \(base64Credentials)"]
}
```

---

## 3. Endpoint Inventory

### 3.1 Vehicle List
- **Method:** GET
- **URL:** `/ws/vehicle/list` (or `/ws/online/list`)
- **Response:** Array of Vehicle objects

### 3.2 Vehicle Info / Details
- **Method:** GET  
- **URL:** `/ws/vehicle/info/{vehicleId}`
- **Response:** Extended VehicleInfo with ignition, satellites, odometer, temperature, doors, stopInterval

### 3.3 Track (Playback)
- **Method:** POST
- **URL:** `http://api.navitrack.com.ua:2052/ws/track/get`
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "vehicleId": 123,
  "start": 1700000000000,
  "end": 1700086400000,
  "eventIds": [0, 9, 11, 12]
}
```
- **Response:** `{ points[], events[], startPeriod, endPeriod, vehicleId, trackToken, fuelConsumption, moveTime, distance, stopTime }`
- **Timeout:** 3600s (iOS sets this explicitly)

### 3.4 Daily Track (History)
- **Method:** GET or POST
- **URL:** `/ws/track/daily/{vehicleId}/{date}`
- **Response:** `TrackDailyModel` with items array

### 3.5 Vehicle Lock/Unlock
- **Method:** GET
- **URL:** `http://online.navitrack.com.ua:2052/ws/vehicle/lock/{vehicleId}`
- **URL:** `http://online.navitrack.com.ua:2052/ws/vehicle/unlock/{vehicleId}`

### 3.6 Reports
- **Method:** GET/POST
- **URL:** `/ws/report/...`

---

## 4. Event ID Codes (Critical)

From `TrackerVC.swift` `getEventsName()` method:

| UI Index | Event Code | Meaning |
|----------|-----------|---------|
| 0        | **0**     | Parking / Stop |
| 1        | **9**     | Fuel Drain |
| 2        | **11**    | Speed (Overspeed) |
| 3        | **12**    | Fuel Fill |

> **Important:** PWA was using wrong codes (1, 2, 3, 4). Fixed in TG3.

---

## 5. Data Models

### Vehicle (from `VehicleModel.swift`)
```
id, state, startTime, stopTime, name, lastTransmitTime, address,
pointAzimuth, longitude, latitude, imageurl, driverPhone, fuel1, fuel2, fuel3
```

- `state = "P"` means Parked; otherwise contains speed as string
- `imageurl = "none"` → use `car_256_32x32.png` fallback

### TrackDailyItem (from `TrackDailyModel.swift`)
```
start, end, type, text, distance, speed, volume, trackToken,
points[], latitude, longitude, dsats, ddist
```

- `type` values: `"move"` (driving), `"stop"` / `"park"` (parking)

### TrackPoint
```
time, pointId, latitude, longitude, dsats, ddist, speed
```

---

## 6. Map Types (from `Constant.swift`)

```swift
enum MapType: String {
    case google = "Google"
    case googleHybrid = "Google Hybrid"
    case googleSattelite = "Google Sattelite"
    case openStreet = "Open Street"
}
```

iOS saves `mapType` to `UserDefaults`. Note: Tracker screen forces Google when OpenStreet is set.

---

## 7. Timeout & Retry Patterns

- iOS uses 3600s timeout for track requests (large data)
- No automatic retry in iOS — shows alert on failure
- No request deduplication — repeated taps create duplicate requests

---

## 8. Date/Time Handling

- All timestamps are **Unix milliseconds** (×1000)
- Day start: `dayStart().timeIntervalSince1970 * 1000` (floor)
- Day end: `dayEnd().timeIntervalSince1970 * 1000` (ceil)
- Max track range enforced: **7 days** (`week = 604800` seconds)

---

## 9. Key Differences from PWA Implementation

| Feature | iOS | PWA |
|---------|-----|-----|
| Event codes | 0, 9, 11, 12 | ~~1, 2, 3, 4~~ → **Fixed** |
| Track timeout | 3600s | Default fetch timeout |
| Request dedup | None | Uses throttler ✓ |
| Error handling | Alert dialog | Toast notification ✓ |
| Map type saved | UserDefaults | ~~None~~ → **Fixed** in TB3 |
