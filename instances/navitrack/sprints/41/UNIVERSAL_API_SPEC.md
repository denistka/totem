# Universal API Specification (`navitrack-api-v1`)

## 1. Overview

This specification specifies the legacy HTTP API used by NaviTrack mobile applications.
**Source**: `API.md`, `ApiRetrofit2.kt`, `Object.swift`.

- **Base URL**: `http://online.navitrack.com.ua:2052/`
- **Protocol**: HTTP/1.1
- **Authentication**: Basic Auth (Base64 encoded `user:password`).
- **Response Format**: JSON.

## 2. Authentication

### Headers

Every request MUST include:

```http
Authorization: Basic <base64(username:password)>
Content-Type: application/json
```

### Session Validation

To check if credentials are valid, perform a lightweight call:

- **Endpoint**: `GET /ws/vehicles`
- **Success**: 200 OK.
- **Failure**: 401/403.

## 3. Vehicles & Assets

### List All Vehicles

Returns list of vehicles enabled for map display.

- **Endpoint**: `GET /ws/vehicles`
- **Response**: `Array<Vehicle>`

### List All Account Vehicles

Returns ALL vehicles in the account (admin view).

- **Endpoint**: `GET /ws/allvehicles`
- **Response**: `Array<SimpleVehicle>`

### Vehicle Details (Telemetry)

Detailed status of a vehicle (Speed, Fuel, Sensors).

- **Endpoint**: `GET /ws/vehicledetails/{id}`
- **Response**: `VehicleInfo`

### Vehicle Static Info

Different view of vehicle details.

- **Endpoint**: `GET /ws/vehicle/info/{id}`
- **Response**: `VehicleState`

### Vehicle Data Types

Returns mapping of keys used in `VehicleState`.

- **Endpoint**: `GET /ws/infra/vehicledatatypes`
- **Response**: `Array<KeyValuePair<String, String>>`

## 4. Tracking & History

### Daily Track

Get the path and events for a specific date.

- **Endpoint**: `GET /ws/track/daily/{vehicleId}/{dateString}`
- **Params**: `dateString` format `YYYY-MM-DD`.
- **Response**: `DailyTrack`

### Advanced Track History (POST)

Get complex track data with event filtering.

- **Endpoint**: `POST /ws/track/get`
- **Body**: `TrackRequest`
- **Response**: `Track`

### Track Points (Expanded)

Get track with expanded point details.

- **Endpoint**: `POST /ws/trackpoints/get`
- **Response**: `Array<TrackPointInfo>`

### Track Point Detail

Get telemetry for a specific point.
**NOTE**: Custom Headers required.

- **Endpoint**: `POST /ws/track/point`
- **Headers**:
  - `trackToken`: `{String}`
  - `pointId`: `{Number}`
- **Body**: `{}` (Empty JSON)

## 5. Reports

### List Report Types

- **Endpoint**: `GET /ws/reports`
- **Response**: `Array<ReportItem>`

### List Companies

- **Endpoint**: `GET /ws/getcompanies`
- **Response**: `Array<Company>`

### Generate Report

- **Endpoint**: `POST /ws/doreport`
- **Body**: `ReportRequest`
- **Response**: JSON stream. Structure depends on `type` param (`json`, `json2`, `xml`). We use `json2`.
- **Format**: `ReportResponse` (for `type="json2"`)

## 6. Settings & Configuration

### User Settings

- **Endpoint**: `GET /ws/settings`
- **Response**: `Array<UserConfigurationItem>`

### Vehicle Event Configuration (VEA)

Get/Set event thresholds (Speed limit, etc) per vehicle.

- **Endpoint**: `GET /ws/getvea/{id}`
- **Response**: `VehicleEventConfiguration`

- **Endpoint**: `POST /ws/savevea`
- **Body**: `VehicleEventConfiguration`

### Push Token Update

- **Endpoint**: `POST /ws/update`
- **Body**: `PushRequest`

## 7. Data Models & Types

### Vehicle

```json
{
  "id": 123,
  "name": "Truck 01",
  "imageurl": "/path/to/icon.png",
  "state": "P", // "P" = Parked, otherwise Speed (Number as String)
  "latitude": 50.45,
  "longitude": 30.52,
  "lastTransmitTime": 1678900000,
  "address": "Kyiv, Khreshchatyk",
  "pointAzimuth": 120,
  "driverPhone": "+380...",
  "fuel1": 0,
  "fuel2": 0,
  "fuel3": 0
}
```

### TrackRequest

```json
{
  "vehicleId": 123,
  "start": 1678838400000, // Unix Ms
  "end": 1678924800000, // Unix Ms
  "eventIds": [0, 1, 9] // See Event IDs
}
```

### ReportRequest

```json
{
  "bunchId": 1,
  "start": 1678838400000,
  "end": 1678924800000,
  "vehicleIds": [123],
  "companyIds": [1],
  "partition": "PERIOD", // or "DAILY"?
  "type": "json2"
}
```

## 8. Enums & Constants

### Event IDs

| ID  | Event                          |
| --- | ------------------------------ |
| 0   | Stop (Остановка)               |
| 1   | Start Move (Начало движения)   |
| 2   | Zone Enter                     |
| 3   | Zone Exit                      |
| 9   | Speeding (Превышение скорости) |
| 11  | Refuel (Заправка)              |
| 12  | Fuel Drain (Слив)              |
| 15  | Engine Stop                    |
| 16  | Engine Start                   |

See `API.md` for full list.
