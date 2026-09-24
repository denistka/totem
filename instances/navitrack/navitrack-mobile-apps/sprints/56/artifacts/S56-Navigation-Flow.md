# S56-Navigation-Flow — Navigation Flow (State-Driven)

**Task:** S56-TB2-Navigation-Flow-Diagram  
**Purpose:** Header and state architecture design; state-driven, not page-driven.

---

## Header modes and entry points

| Mode | Description | Entry / transition |
|------|-------------|--------------------|
| **Objects** | List of vehicles/objects | Menu → Objects |
| **Object Details** | Single object/vehicle detail | Objects → select object |
| **Map** | Map view (all or context) | Menu → Map; Push notification → Map |
| **Tracking** | Tracking query (vehicle, period, events) | Menu → Tracker |
| **Tracking Action** | Map + playback / point detail | Tracking → load track → Tracker Map |
| **Reports** | Report type and param selection | Menu → Reports |
| **Reports Results** | Report output view | Reports → submit → Results |
| **Settings** | App settings | Menu → Settings |
| **Login** | Auth | Menu → Login; app start |

---

## Mermaid: navigation flow (state-driven)

```mermaid
stateDiagram-v2
    [*] --> Login
    Login --> Objects: auth OK
    Login --> Map: auth OK (e.g. push)

    Objects --> ObjectDetails: select object
    ObjectDetails --> Objects: back
    ObjectDetails --> Map: show on map
    ObjectDetails --> Tracking: track this object

    Map --> Objects: menu
    Map --> Tracking: menu / action
    Map --> Reports: menu
    Map --> ObjectDetails: tap object

    Tracking --> TrackingAction: load track (vehicleId, range, events)
    TrackingAction --> Tracking: back
    Tracking --> Objects: vehicle picker
    Tracking --> Map: (context)

    Reports --> ReportsResults: submit (bunchId, companies, vehicles, period)
    ReportsResults --> Reports: back
    Reports --> Objects: (vehicle picker)

    Objects --> Map: menu
    Objects --> Tracking: menu
    Objects --> Reports: menu
    Objects --> Settings: menu
    Objects --> Login: menu

    Tracking --> Map: menu
    Tracking --> Reports: menu
    Reports --> Map: menu
    Settings --> Objects: (or root)
```

---

## Header mode ↔ view state

- **headerMode:** One of Objects | ObjectDetails | Map | Tracking | TrackingAction | Reports | ReportsResults | Settings | Login.
- **headerViewState:** Collapsed vs expanded (e.g. system bar); context title/subtitle per mode (e.g. vehicle name in Tracking, report name in Reports).
- Transitions above define when headerMode and headerViewState update; UI depends on these states, not on route string alone.

---

## Alignment

- Aligns with S56-Reverse-Documentation-Report (navigation source of truth) and reverse iOS/Android flows.
- Header spec: collapsed/expanded, context per mode. No implementation — planning only.
