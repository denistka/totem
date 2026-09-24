# S56-Reverse-iOS — Reverse Analysis (Legacy iOS App)

**Task:** S56-TA2-Reverse-Analysis-iOS  
**Source:** `old-apps/navitrack-mobile-ios` (Swift, Storyboard, Alamofire).

---

## 1. Navigation flows and screen transitions

- **Entry:** Login (ContainerVC) → after auth, main app via Storyboard identifier `"app"` (SWRevealViewController) or `"navbar"` (e.g. after Google Sign-In).
- **Side menu (SideMenu.swift):** Row 1 → Objects (`objects`), 2 → Map (`map`), 3 → Tracker (`tracker`), 4 → Reports (`reports`), 5 → Settings (`settings`), 6 → Login (modal ContainerVC). All via `performSegue(withIdentifier:...)`.
- **Tracker flow:** TrackerVC → (after track load) push to TrackerMapVC (`trackerMap`) with vehicle, vehicleTrack, vehicleInfo, eventIDs. From TrackerVC, opening vehicle/events list pushes ChooseForTrackerViewController (`showInfo`).
- **Report flow:** ReportVC, ChooseForReportViewController — company list, report list, vehicles; report params then submit.
- **Push notification:** AppDelegate `showView` sets root to SWRevealViewController and performs segue `"map"`.
- **Source of truth for navigation:** Storyboard segues + identifiers; no single route enum. Modes effectively: Objects, Map, Tracker (list), Tracker (map), Reports, Settings, Login.

---

## 2. Request formation (query build)

- **Tracking:** TrackerVC builds body `vehicleId`, `start`, `end`, `eventIds` (Unix ms); POST to `/ws/track/get` (iOS uses `api.navitrack.com.ua:2052` for this call in TrackerVC; Object.swift enum uses `vehicleTrack2` = online). In practice TrackerVC.swift uses hardcoded `http://api.navitrack.com.ua:2052/ws/track/get`.
- **Reports:** ReportVC / ChooseForReportViewController: GET companyList, reportList; GET vehicles for selection; POST doreport with report request body (bunchId, companyIds, start, end, partition, type, vehicleIds).
- **Vehicle/list:** GET vehicles (api), vehicleInfo (api), allVehicle (api), track/daily (online), getvea/savevea (online), settings (online).
- **Single point (player):** POST /ws/track/point with headers `trackToken`, `pointId`; body empty; URL from NaviTrack.point (online).

---

## 3. Validation rules and lifecycle

- **Auth:** Login/password from UserDefaults; Basic header on every request; validate via /ws/settings or /ws/vehicles.
- **Tracking query:** fromTime/untilTime set via cell delegates (ObserveFromTimeCell, ObserveUntilTimeCell); vehicle and event types from ChooseForTrackerViewController. No explicit client-side schema validation; server responds with track or error.
- **Reports:** Companies and vehicles selected in UI; report type from report list. No doc of client-side validation beyond non-empty selection.

---

## 4. Loading lifecycle

- **Indicator:** `ProgressLoader.shared.showProgressIndicator()` / `removeProgressIndicator()` used around track request and other network calls. Full-screen or blocking style (not documented as modal type).
- **When:** Before/after track get; during report generation and other API calls. No separate fullContent vs fullScreen vs notification modes — single loader pattern.

---

## 5. Tracking player flow (playback, controls, map sync)

- **Data:** TrackerVC fetches track via POST /ws/track/get → receives points + events + trackToken, moveTime, stopTime, distance, etc. Passes VehicleTrack to TrackerMapVC.
- **Playback / point detail:** On map interaction (e.g. point tap), TrackerMapVC calls POST /ws/track/point with `trackToken` and `pointId`; response used to build VehicleInfo and sent to SlideIn via NotificationCenter (`GET_DOT_INFO_DATA`).
- **Map:** Google Maps or OpenStreet; marker for vehicle; track polyline from points. No formal play/pause timeline — user-driven point selection.

---

## 6. Report formation (params, period, companies, vehicles)

- **Params:** bunchId (report type), companyIds, vehicleIds, start, end, partition, type (format). Fetched via GET reports, getcompanies, and vehicles; built in ReportVC/ChooseForReportViewController and sent as POST doreport.
- **Source of truth:** Server report list and company list; UI builds ReportRequest from selections.

---

## 7. Source-of-truth summary (for Track B/C)

| Area | Source of truth |
|------|------------------|
| Navigation | Storyboard segues; modes: Objects, Map, Tracker list, Tracker map, Reports, Settings, Login. |
| Tracking query | Body: vehicleId, start, end, eventIds (ms). Endpoint: POST /ws/track/get. |
| Tracking point | Headers: trackToken, pointId. Endpoint: POST /ws/track/point. |
| Reports | GET reports, getcompanies; vehicles for filter; POST doreport with ReportRequest. |
| Loading | Single ProgressLoader; no documented fullContent/fullScreen/notification split. |
| Auth | Basic; credentials in UserDefaults; validated via settings/vehicles. |

**Host split in iOS:** Part of requests use `api.navitrack.com.ua:2052` (vehicles, allvehicles, track/get, doreport, reports, getcompanies), part use `online.navitrack.com.ua:2052` (track/point, track/daily, settings, getvea, savevea, etc.). See S56-API-Doc-Gaps.md.

---

*Documentation only; no new logic. For use in Track B/C.*
