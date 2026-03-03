# S56-Consolidated-Roadmap — Master Reference for Implementation Planning

**Task:** S56-TE1-Consolidated-Roadmap  
**Purpose:** Single reference for implementation (after gate OPEN). Planning only — no code.

---

## Index of S56 artifacts

| Artifact | Description |
|----------|-------------|
| [S56-API-Doc-Gaps.md](./S56-API-Doc-Gaps.md) | API doc verification; proceed/block decision; gaps list. |
| [S56-Reverse-iOS.md](./S56-Reverse-iOS.md) | iOS reverse analysis: navigation, query, loading, player, reports. |
| [S56-Reverse-Android.md](./S56-Reverse-Android.md) | Android reverse analysis; cross-platform alignment. |
| [S56-Reverse-Documentation-Report.md](./S56-Reverse-Documentation-Report.md) | Consolidated reverse report; source of truth. |
| [S56-Navigation-Flow.md](./S56-Navigation-Flow.md) | Navigation flow; header modes; state-driven. |
| [S56-Query-Lifecycle.md](./S56-Query-Lifecycle.md) | Query lifecycle (Tracking + Reports); build → validate → submit. |
| [S56-Loading-Lifecycle.md](./S56-Loading-Lifecycle.md) | Loader modes: fullContent, fullScreen, notification. |
| [S56-Entity-Audit.md](./S56-Entity-Audit.md) | Header, Loader, Modal, Player, Query audit; consolidation targets. |
| [S56-State-Architecture-Proposal.md](./S56-State-Architecture-Proposal.md) | State slices; state-driven UI; implementation gate. |
| [S56-Component-Reuse-Matrix.md](./S56-Component-Reuse-Matrix.md) | One component per system; state-driven behavior. |
| [S56-Migration-Strategy.md](./S56-Migration-Strategy.md) | Phased migration; checkpoints; invariants. |
| [S56-Risk-Assessment.md](./S56-Risk-Assessment.md) | Risks (SSR, PWA, Tauri, Leaflet, Radix, quality); mitigations. |

---

## Header spec

- **Modes:** Objects, Object Details, Map, Tracking, Tracking Action, Reports, Reports Results, Settings, Login.
- **Behavior:** Collapsed/expanded system bar; context (title/subtitle) per mode. State-driven: **headerMode** + **headerViewState**. One AppHeader; no per-page header.
- **Reference:** S56-Navigation-Flow.md, S56-State-Architecture-Proposal.md, S56-Entity-Audit.md.

---

## Tracking Player spec

- **Layout:** 50% map / 50% action zone (or equivalent); playback controls; summary stats (distance, move time, stop time, etc.).
- **State:** **playerState** (track, current point index, playing/paused, map sync). One PlaybackControls; map reads playerState. Point detail via /ws/track/point (trackToken, pointId).
- **Reference:** S56-Reverse-Documentation-Report.md, S56-State-Architecture-Proposal.md, S56-Component-Reuse-Matrix.md.

---

## Query Builder spec

- **Tracking:** vehicleId, start, end, eventIds; validate → submit POST /ws/track/get. One QueryValidator (tracking); **queryState.tracking**.
- **Reports:** bunchId, companyIds, vehicleIds, start, end, partition, type; validate → submit POST /ws/doreport. One QueryValidator (reports); **queryState.reports**.
- **Reference:** S56-Query-Lifecycle.md, S56-State-Architecture-Proposal.md.

---

## Loader spec

- **Modes:** fullContent (header→footer area), fullScreen (whole screen), notification (non-blocking).
- **Usage:** Footer nav → fullContent or none; Tracking Player → notification; report generation → fullScreen; Tracking Action → fullContent or notification.
- **Single GlobalLoader;** state: **loadingState** (active, mode, message). Reference: S56-Loading-Lifecycle.md, S56-State-Architecture-Proposal.md.

---

## Modal spec

- **SmartSelectableModal:** Search + list + single/multi-select. Use for: report type, companies, vehicles, object visibility. One pattern; Radix or same a11y contract.
- **Dialog:** Confirm/alert (e.g. safe stop, emergency stop). Radix Dialog.
- **Reference:** S56-Entity-Audit.md, S56-Component-Reuse-Matrix.md.

---

## Implementation gate

- Implementation may not start until **state architecture is approved** (S56-State-Architecture-Proposal.md). After approval, use this roadmap and linked artifacts as the single reference; no new content that contradicts them.
- Migration follows S56-Migration-Strategy.md; risks in S56-Risk-Assessment.md.

---

*S56 planning only. Implementation sprints (after gate OPEN) use this as master reference.*
