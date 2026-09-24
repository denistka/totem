# S56-Reverse-Android — Reverse Analysis (Legacy Android App)

**Task:** S56-TA3-Reverse-Analysis-Android  
**Source:** `old-apps/navitrack-mobile-android` (Kotlin, Retrofit2, RxJava).

---

## 1. Navigation, request formation, validation, loading, player, reports (same dimensions as TA2)

- **Navigation:** Fragment-based (ObjectFragment, SingleMapFragment, TrackingFragment, TrackingFragmentMap, ReportFragment, SettingsFragment, etc.). No single “header mode” enum; fragment transactions drive views. Entry: login then main activity with fragment container.
- **Request formation:**
  - **Tracking:** `TrackingRequestData`: vehicleId, start, end, eventIds. POST `track/get`. GET `track/daily/{id}/{date}` for daily. POST `track/point` with headers trackToken, pointId.
  - **Reports:** `ReportRequestData`: bunchId, start, end, vehicleIds, partition (PERIOD/DAILY), companyIds. GET `reports`, `getcompanies`; POST `doreport`.
  - **Vehicles/details:** GET `vehicles`, `vehicledetails/{id}`, `vehicleinfo/{vehicleId}`. GET `getvea/{id}`, POST `savevea`. POST `update` for token.
- **Validation:** Auth via OkHttp interceptor (Basic). No explicit client-side validation doc; server-driven.
- **Loading:** Per-call (no single GlobalLoader pattern documented in this codebase slice).
- **Tracking player:** TrackingFragmentMap uses track/get → points/events; track/point for point details. Same logical flow as iOS.
- **Reports:** ReportFragment + ReportRequestData; companies and report list from API; build request and POST doreport.

---

## 2. Android-specific behavior and differences from iOS

- **Single base URL:** Android uses only `http://online.navitrack.com.ua:2052/ws/` (API_END_POINT). iOS splits between `api.navitrack.com.ua:2052` and `online.navitrack.com.ua:2052`. **Divergence:** Android does not use api.* host; all calls go to online.*.
- **Endpoint path:** Android uses `vehicleinfo/{vehicleId}` (no leading `ws/` in path; base already has `/ws/`). API doc has `/ws/vehicle/info/{id}`. iOS uses `vehicleInfo` = "http://api.navitrack.com.ua:2052/ws/vehicleinfo/". So Android path = `vehicleinfo/{id}` vs doc `vehicle/info/{id}` — possible server alias or doc typo.
- **Event types:** Android calls GET `infra/eventtypes`; not listed in incoming API.md. **Gap:** endpoint exists in Android; add to API doc or confirm with backend.
- **Report partition:** Android defines PARTITION_PERIOD, PARTITION_DAILY constants; aligns with ReportRequest.partition.
- **ReportRequestData.companyIds:** ArrayList<Int>. API doc Company.id is string; ReportRequest.companyIds in doc is Number[]. So Android uses Int; implementation may coerce or server accepts both.

---

## 3. Cross-platform consistency summary

| Item | iOS | Android | Agree / Diverge |
|------|-----|---------|------------------|
| Track request | vehicleId, start, end, eventIds; POST track/get | Same (TrackingRequestData) | Agree |
| Track point | trackToken, pointId headers; POST track/point | Same | Agree |
| Reports | companyList, reportList, vehicles; POST doreport | Same (getcompanies, reports, doreport) | Agree |
| Base host | api.* + online.* split | online.* only | Diverge (host usage) |
| Vehicle info path | vehicleinfo/ (api host) | vehicleinfo/ (online host) | Agree path; differ host |
| Event types | From UI/config | GET infra/eventtypes | Android exposes extra endpoint |
| Loading | ProgressLoader (single) | Per-call | Diverge (pattern) |

**Source of truth for shared logic:** Track request/response and report request shape are aligned. Use online.navitrack.com.ua:2052 as canonical base and proxy both “api” and “online” to it if backend allows, or document two bases in config. Event types: treat GET infra/eventtypes as part of contract and add to API doc.

---

*Documentation only; no new logic. For use in Track B/C.*
