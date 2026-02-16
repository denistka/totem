# Android API Analysis (`navitrack-mobile-android`)

## 1. Authentication

- **Method**: Basic Authentication (HTTP Basic Auth).
- **Implementation**: `ApiRetrofit2.kt` -> `Factory.create(loginName, loginPass)`.
- **Headers**:
  - `Authorization: Basic <base64(user:pass)>`
  - Added via OkHttp Interceptor to _every_ request.
- **Login Flow**:
  1. App retrieves `UserData` from local DB (Room).
  2. If found, initializes `ApiRetrofit2` with stored credentials.
  3. `checkPasswordLive()` (GET `vehicles`) is used to validate credentials/session.

## 2. API Endpoints

Base URL: `http://online.navitrack.com.ua:2052/ws/`

### GET `vehicles`

- **Goal**: Check password / Get all vehicles.
- **Kotlin Function**: `checkPasswordLive()`, `getAllVehiclesList()`
- **Response**: `List<VehicleEntry>`
  - Main fields: `id`, `name`, `imageurl`, `latitude`, `longitude`, `state` ("P"=Parked?), `lastTransmitTime`, `address`.

### GET `vehicledetails/{id}`

- **Goal**: Get detailed info for a specific vehicle.
- **Params**: `id` (Path).
- **Response**: `DetailInfoCarResponse`
  - Fields likely include speed, odometer, fuel, etc.

### GET `track/daily/{id}/{date}`

- **Goal**: Get tracking history for a specific date.
- **Params**: `id` (Path), `date` (Path, likely YYYY-MM-DD or similar).
- **Response**: `DetailsCarByDateResponse`.

### GET `vehicleinfo/{vehicleId}`

- **Goal**: Get static info?
- **Params**: `vehicleId` (Path).
- **Response**: `VehicleEntryInfo`.

### GET `infra/eventtypes`

- **Goal**: Get available event types (stops, moves, sensors?).
- **Response**: `List<EventTypes>`.

### POST `track/get`

- **Goal**: Get tracking details (complex history?).
- **Body**: `TrackingRequestData`
  - `vehicleId`: Int
  - `start`: Long (Timestamp)
  - `end`: Long (Timestamp)
  - `eventIds`: List<Int>
- **Response**: `TrackingDetails`.

### POST `track/point`

- **Goal**: Get specific point info?
- **Headers**:
  - `trackToken`: String (Special header!)
  - `pointId`: Long (Special header!)
- **Response**: `TrackingPointDetails`
- **Quirk**: Uses headers for data transmission instead of Query/Body.

### GET `reports`

- **Goal**: List available report types.
- **Response**: `List<ReportTypeData>`
  - `bunchId`, name, etc.

### GET `getcompanies`

- **Goal**: List companies (for multi-company users).
- **Response**: `List<CompanyData>`
  - `id`, `value` (name).

### POST `doreport`

- **Goal**: Generate a report.
- **Body**: `ReportRequestData`
  - `bunchId`: Int (Report Type ID)
  - `start`: Long
  - `end`: Long
  - `vehicleIds`: List<Int>
  - `partition`: String (e.g., "PERIOD", "DAILY")
  - `companyIds`: List<Int>
- **Response**: `ResponseBody` (Raw string/JSON stream).

### GET `getvea/{id}`

- **Goal**: Get "VEA" (Vehicle Event Attributes? Options?).
- **Params**: `id` (Path).
- **Response**: `EventOptionsData`.

### POST `savevea`

- **Goal**: Save "VEA".
- **Body**: `EventOptionsData`.
- **Response**: `IdResponse`.

### POST `update`

- **Goal**: Update Push Notification Token?
- **Body**: `PushRequest`
  - Likely contains FCM token.
- **Response**: `ResponseBody`.

## 3. Logic Flows

### Startup / Login

1. `DataRepository` init -> Check local DB for `UserData`.
2. If exists -> `ApiRetrofit2.create(user, pass)`.
3. Calls `getAllVehiclesList()` (GET `vehicles`) repeatedly (deferred, repeatEvery 30s) to update map.

### Live Tracking

1. `getAllVehiclesList()` polls every 30s.
2. Updates `VehicleEntry` list.
3. Calculates "Stopover" time locally if state is "P" (Parked).
4. Updates local DB (Room).

### Reporting

1. User selects Report Type (`getReportListFromServer`).
2. User selects Company (`getCompaniesListFromServer`).
3. User selects Vehicles.
4. User selects Date Range.
5. `getReport(request)` -> POST `doreport`.
6. Response body (String) is parsed/displayed.

## 4. Quirks & Observations

- **Hardcoded Base URL**: `http://online.navitrack.com.ua:2052/ws/`.
- **Header Auth**: Basic Auth constructed manually in Retrofit Interceptor.
- **Weird Headers**: `track/point` uses `trackToken` and `pointId` as headers.
- **Dual Use Endpoint**: `vehicles` used for both auth check and polling data.
- **Polling**: Client polls `vehicles` every 30s. No WebSocket found (despite endpoint potentially implying it?).
