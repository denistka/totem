# S56-State-Architecture-Proposal — State-Driven UI (Planning Only)

**Task:** S56-TC2-State-Architecture-Proposal  
**Gate:** Implementation forbidden until this is approved (gate OPEN = user-approved).

---

## 1. State slices (namespaces)

UI is driven by the following state; **route may derive from state**, not the other way around.

| Slice | Purpose |
|-------|---------|
| **headerMode** | Current context: Objects \| ObjectDetails \| Map \| Tracking \| TrackingAction \| Reports \| ReportsResults \| Settings \| Login. |
| **headerViewState** | Collapsed/expanded system bar; title/subtitle per mode (e.g. vehicle name, report name). |
| **queryState** | Tracking: vehicleId, start, end, eventIds, validation (valid, errors). Reports: bunchId, companyIds, vehicleIds, start, end, partition, type, validation. Single source for build/validate/submit. |
| **playerState** | Tracking playback: current track (points, events, trackToken), current point index, playing/paused, map sync. |
| **loadingState** | GlobalLoader: active, mode (fullContent \| fullScreen \| notification), optional message. |
| **navigationState** | Optional: breadcrumb or stack for back; can be derived from headerMode history. |

---

## 2. State-driven UI

- **Header:** Renders from headerMode + headerViewState (collapsed/expanded, context). No per-screen header component; one AppHeader reads this state.
- **Content:** Screen content is chosen by headerMode (or equivalent mapping). Router can sync from headerMode for URL if needed.
- **Query:** Tracking and Reports UIs read/write queryState; one QueryValidator (or two namespaced validators) own validation. Submit uses queryState; no duplicate request building in components.
- **Player:** PlaybackControls and map read playerState; user actions update playerState (e.g. play, seek to point). Map re-renders from playerState; no direct route-driven fetch in player.
- **Loader:** GlobalLoader reads loadingState; any feature sets loadingState (mode + message) instead of local overlay. No duplicate loader components.

---

## 3. Alignment with specs

- **Header spec:** Collapsed/expanded, context per mode (Objects, Object Details, Map, Tracking, Tracking Action, Reports, Reports Results). Satisfied by headerMode + headerViewState.
- **Tracking Player:** 50% map / 50% action zone; playback controls; summary stats. Satisfied by playerState + single Player/Map component.
- **Query Builder:** One build → validate → submit; Tracking and Reports. Satisfied by queryState + QueryValidator.
- **Loader:** fullContent, fullScreen, notification. Satisfied by loadingState.mode.

---

## 4. Store and centralization

- **No new store layers without justification.** Prefer one store (or few namespaced modules) with the slices above. Avoid per-feature stores that duplicate loading or query logic.
- **Centralize:** Loading lifecycle and query lifecycle in one place (loadingState, queryState). Components only read state and dispatch actions; no ad-hoc fetch + local loading in every screen.

---

## 5. Implementation gate

- **Document only; no implementation.** Implementation may not start until user approves this proposal (explicit gate OPEN or LGTM on this artifact).
- After approval, implementation sprints use this as the state contract; no page-driven Header or duplicate components.
