# S56-API-Doc-Gaps — API Documentation Verification

**Task:** S56-TA1-API-Documentation-Verification  
**Artifact:** Verification of incoming API documentation and gap list.

---

## Verified items

- **Source:** `navitrack-apps/incoming /API.md` (NaviTrack API Documentation, Russian).
- **Host:** `http://online.navitrack.com.ua:2052/` (documented).
- **Auth:** Basic Authorization, per request (documented).
- **Request/response:** JSON; Content-Type application/json for POST (documented).
- **Endpoints listed:** `/ws/allvehicles`, `/ws/vehicles`, `/ws/vehicledetails/{id}`, `/ws/vehicle/info/{id}`, `/ws/settings`, `/ws/getcompanies`, `/ws/getvea/{id}`, `/ws/savevea`, `/ws/track/daily/{id}/{date}`, `/ws/infra/vehicledatatypes`, `/ws/track/get`, `/ws/track/point`, `/ws/trackpoints/get`, `/ws/reports`, `/ws/doreport`.
- **Schema objects documented:** TrackPoint, Event, Track, DailyTrackEvent, DailyTrack, VehicleEventConfiguration, SimpleVehicle, Vehicle, VehicleInfo, KeyValuePair, VehicleState, UserConfigurationItem, Company, TrackRequest, TrackPointInfo, ReportItem, ReportRequest, ReportResponse, ReportGroup, ReportCell.
- **Enums:** Event IDs 0–19; report format (json, json2, xml).
- **Web client alignment:** `navitrack-apps/src-client/src/lib/api.ts` — types align with API.md (Vehicle, VehicleInfo, TrackRequest, ReportRequest, ReportResponse, etc.). Web uses proxy paths `/api-online`, `/api-nav`; backend base matches doc.

---

## Gaps (incomplete / conflicting / outdated)

1. **Missing descriptions**
   - `/ws/track/point` — no description; only method, headers (trackToken, pointId), body "{}".
   - `/ws/doreport` — no description; only method and auth. Request body (ReportRequest) is documented in Objects section but not referenced in endpoint table.

2. **Host inconsistency**
   - API.md: single host `online.navitrack.com.ua:2052`.
   - iOS code (`old-apps/navitrack-mobile-ios`): uses both `api.navitrack.com.ua:2052` (e.g. vehicles, allvehicles, reports, doreport, getcompanies) and `online.navitrack.com.ua:2052` (track/get, track/point, track/daily, settings, getvea, savevea, etc.). **Conflict:** which host is source of truth for which endpoint is not documented.

3. **Report request types**
   - ReportRequest: `companyIds: Number[]` in API.md; Company object has `id: String` (number as string). **Conflict:** type for company IDs in request (number vs string) not clarified.

4. **Web client coverage**
   - Web `api.ts` implements: getVehicles, getVehicleDetails, getDailyTrack, getSettings, doReport. **Not implemented in client:** getAllVehicles, getCompanies, getVea/saveVea, track/get, track/point, trackpoints/get, reports list. Not a doc error but a completeness gap for cross-platform parity.

5. **No OpenAPI/ machine-readable spec**
   - No OpenAPI 3.x or equivalent; no formal request/response examples or enum bindings. Limits automated checks and codegen.

6. **Language**
   - Doc is in Russian; parameter names in code are English. No impact on schemas but may cause ambiguity for i18n or external consumers.

---

## Decision

**Proceed with architecture.**

Gaps are documented and non-blocking: missing descriptions apply to two endpoints; host split (api vs online) can be treated as environment-specific (api vs online) and unified under a single configurable base URL in the new architecture. ReportRequest/Company id type can be fixed at implementation time (prefer string for company IDs). Architecture planning can proceed; implementers will use this gap list when integrating APIs.

---

*Artifact produced for S56 Track A. No code changes.*
