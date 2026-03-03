# S56-Component-Reuse-Matrix — Single Component per System

**Task:** S56-TD1-Component-Reuse-Matrix  
**References:** S56-Entity-Audit.md (TC1), S56-State-Architecture-Proposal.md (TC2).

---

## Matrix: system → component + state-driven behavior

| System | Single component | State-driven behavior |
|--------|------------------|------------------------|
| **Header** | AppHeader | headerMode, headerViewState (collapsed/expanded, title). One component; no per-page header. |
| **Loader** | GlobalLoader | loadingState (active, mode: fullContent \| fullScreen \| notification, message). One overlay; no duplicate loaders. |
| **Modal (selection)** | SmartSelectableModal | open, type (reportType \| company \| vehicle \| objectVisibility), selectedIds, onSelect. Search + list + single/multi-select. |
| **Query (tracking)** | QueryValidator (tracking) / query state | queryState.tracking: vehicleId, start, end, eventIds, valid, errors. Build → validate → submit. |
| **Query (reports)** | QueryValidator (reports) / query state | queryState.reports: bunchId, companyIds, vehicleIds, start, end, partition, type, valid, errors. |
| **Player** | PlaybackControls | playerState: track, currentIndex, playing, mapSync. One control strip; map reads playerState. |
| **Map** | MapEngine (or single map component) | Vehicles, track points, selected point from playerState/queryState. One map; Leaflet re-render scoped (observer/computed) per ARCHITECT. |

---

## No duplicates

- **Header:** No duplicate Headers per page; one AppHeader.
- **Loader:** No duplicate Loaders; one GlobalLoader by mode.
- **Modal:** No duplicate modal patterns for selection; one SmartSelectableModal pattern (Radix or custom bottom sheet + search/list).
- **Query:** No duplicate request-building or validation in Tracking vs Reports; one validator per domain, one queryState.
- **Player/Map:** One PlaybackControls, one MapEngine (or single map); behavior by state.

---

## Radix UI and Leaflet

- **Radix:** Reuse Radix Dialog for confirm/alert; reuse (or extend) for SmartSelectableModal list/accessibility. Single design system; no raw duplicate modal markup.
- **Leaflet:** Per ARCHITECT, wrap map in observer at leaf; avoid subscribing to full collections. MapEngine component owns subscription to track/points/events relevant to view; minimize re-renders.

---

*Planning only. Migration and implementation reference this matrix.*
