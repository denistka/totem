# API Verification — New PWA vs Old iOS/Android
**Sprint 63 · TG2 Artifact**

---

## 1. Endpoint Accuracy

| Endpoint | iOS URL | PWA URL | Status |
|----------|---------|---------|--------|
| Vehicle list | `/ws/vehicle/list` | `/ws/vehicle/list` | ✅ Match |
| Vehicle info | `/ws/vehicle/info/{id}` | `/ws/vehicle/info/{id}` | ✅ Match |
| Track (playback) | `POST /ws/track/get` | `POST /ws/track/get` | ✅ Match |
| Daily track | `GET /ws/track/daily/{id}/{date}` | `GET /ws/track/daily/{id}/{date}` | ✅ Match |
| Reports | `/ws/report/...` | `/ws/report/...` | ✅ Match |
| Lock vehicle | `GET /ws/vehicle/lock/{id}` | Not implemented | ⚠️ Missing |
| Unlock vehicle | `GET /ws/vehicle/unlock/{id}` | Not implemented | ⚠️ Missing |

---

## 2. Request Parameter Accuracy

### Track Request

| Parameter | iOS | PWA | Status |
|-----------|-----|-----|--------|
| `vehicleId` | ✅ | ✅ | Match |
| `start` | Unix ms | Unix ms | ✅ Match |
| `end` | Unix ms | Unix ms | ✅ Match |
| `eventIds` | Array of int | Array of int | ✅ Match |

### Event ID Values (**Critical Bug Found**)

| Event | iOS Code | PWA (before fix) | PWA (after TG3 fix) |
|-------|----------|-----------------|---------------------|
| Parking/Stop | `0` | ~~`1`~~ | `0` ✅ |
| Fuel Drain | `9` | ~~`2`~~ | `9` ✅ |
| Speed/Overspeed | `11` | ~~`3`~~ | `11` ✅ |
| Fuel Fill | `12` | ~~`4`~~ | `12` ✅ |

> **Impact:** Before the fix, tracking events were never returned from the API because the codes didn't exist in the backend. Fixed in TG3.

---

## 3. Authentication

| Aspect | iOS | PWA | Status |
|--------|-----|-----|--------|
| Scheme | Basic Auth | Basic Auth | ✅ Match |
| Header | `Authorization: Basic <b64>` | `Authorization: Basic <b64>` | ✅ Match |
| Credentials source | UserDefaults | localStorage via httpFetch | ✅ Match |

---

## 4. Timeout Configuration

| Aspect | iOS | PWA | Status |
|--------|-----|-----|--------|
| Track request timeout | 3600s | Browser default (~30s) | ⚠️ Gap |

**Recommendation:** Add explicit `signal` with 120s timeout to track fetch calls for large datasets.

---

## 5. Date/Time Format

| Aspect | iOS | PWA | Status |
|--------|-----|-----|--------|
| Timestamp format | Unix ms (×1000) | Unix ms (×1000) | ✅ Match |
| Daily track date | `YYYY-MM-DD` | `YYYY-MM-DD` | ✅ Match |
| Day range validation | Max 7 days | No validation | ⚠️ Missing |

---

## 6. Response Model Accuracy

### Vehicle State
| Field | iOS | PWA | Status |
|-------|-----|-----|--------|
| `state = "P"` → parked | ✅ | ✅ | Match |
| `state = "{speed}"` → moving | ✅ | ✅ | Match |
| `imageurl = "none"` fallback | Uses `car_256_32x32.png` | Uses generic SVG | ⚠️ Diverge |

### TrackDailyItem type values
| Value | Meaning | iOS | PWA | Status |
|-------|---------|-----|-----|--------|
| `"move"` | Driving segment | ✅ | ✅ `\|\| 'route'` | ✅ |
| `"stop"` / `"park"` | Parking | ✅ | `else` clause | ✅ |

---

## 7. Missing API Features (vs iOS)

1. **Engine lock/unlock** — iOS has lock & unlock endpoints; PWA has none
2. **Push notification token registration** — iOS registers device token; PWA has no push support
3. **7-day range validation** — iOS enforces this; PWA allows any range
4. **Track fetch timeout** — iOS uses 3600s; PWA uses browser default

---

## 8. Verdict

The PWA API implementation is **largely accurate** with one **critical bug** (event ID codes) now fixed in TG3. The main gaps are lock/unlock endpoints and the track fetch timeout, both of which are low priority for MVP.
