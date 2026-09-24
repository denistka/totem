# S56-Reverse-Documentation-Report — Consolidated Reverse Documentation

**Task:** S56-TB1-Reverse-Documentation-Report  
**Synthesizes:** S56-TA1 (API gaps), S56-TA2 (iOS), S56-TA3 (Android).

---

## 1. API doc verification outcome

- **Decision:** **Proceed with architecture** (see S56-API-Doc-Gaps.md).
- **Gaps summary:** Missing descriptions for /ws/track/point and /ws/doreport; host inconsistency (api vs online) between doc and iOS; ReportRequest companyIds type (number vs string); Web client does not implement all endpoints; no OpenAPI spec.
- **Impact:** Non-blocking. Unify bases in config; fix company ID type at implementation.

---

## 2. iOS and Android reverse-analysis summary

**iOS (`old-apps/navitrack-mobile-ios`):**
- Navigation: Side menu → Objects, Map, Tracker, Reports, Settings, Login. Tracker → TrackerMap (push); Reports/Choose flows for report params.
- Tracking: POST track/get (vehicleId, start, end, eventIds); POST track/point (trackToken, pointId). Uses both api.* and online.* hosts.
- Reports: GET reports, getcompanies, vehicles; POST doreport with ReportRequest.
- Loading: Single ProgressLoader (blocking).
- Source: S56-Reverse-iOS.md.

**Android (`old-apps/navitrack-mobile-android`):**
- Navigation: Fragments (Object, Map, Tracking, Report, Settings). No header-mode enum.
- Tracking: Same TrackRequest shape; POST track/get, track/point. Single base URL online.* only.
- Reports: Same report list/companies/vehicles + ReportRequestData; POST doreport.
- Event types: GET infra/eventtypes (not in API.md).
- Source: S56-Reverse-Android.md.

---

## 3. Consolidated source of truth

| Domain | Source of truth |
|--------|------------------|
| **Navigation** | Modes: Objects, Object Details, Map, Tracking (list), Tracking (map / action), Reports, Reports Results, Settings, Login. State-driven view: one header mode per context; transitions from menu and in-flow pushes. |
| **Tracking query** | Request: vehicleId, start (ms), end (ms), eventIds[]. POST /ws/track/get. Response: Track (points, events, trackToken, moveTime, stopTime, distance, etc.). |
| **Tracking point** | Headers: trackToken, pointId. POST /ws/track/point. Response: point/vehicle detail for player. |
| **Reports** | GET /ws/reports, /ws/getcompanies; vehicles from /ws/vehicles or allvehicles. Request: bunchId, companyIds, vehicleIds, start, end, partition, type. POST /ws/doreport. |
| **Validation** | Basic Auth on all requests. No shared client-side schema validation doc; server validates. |
| **Loading** | Target: one GlobalLoader with modes (fullContent, fullScreen, notification). Current iOS: single blocking loader; Android: per-call. |

---

## 4. Readiness for architectural planning

- API gaps documented; decision: proceed.
- iOS/Android behavior documented; host and endpoint differences listed.
- Single reference for navigation, query, validation, loading, player, reports established.
- **No new entities or logic** — documentation only. Architecture planning (Track B diagrams, Track C entity/state) can proceed from this report and the three artifacts: S56-API-Doc-Gaps.md, S56-Reverse-iOS.md, S56-Reverse-Android.md.
