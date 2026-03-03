# S56-Risk-Assessment — Refactor Risks and Mitigations

**Task:** S56-TD3-Risk-Assessment  
**Scope:** SSR, PWA, Tauri lifecycle, Leaflet re-render, Radix reuse, code quality.

---

## 1. Risks

| Risk | Description |
|------|-------------|
| **SSR / PWA** | If SSR or PWA entry is introduced, state hydration and loader/header must work without window/document assumptions. Current src-client is SPA; future SSR could break global state or overlay. |
| **PWA** | Service worker and offline; loading state and API errors must be clear when offline. No current SW in src-client; PWA readiness may require loader/notification mode. |
| **Tauri lifecycle** | Desktop app lifecycle (suspend, resume, quit); state must not be lost or duplicated. Central state (loadingState, queryState) must survive Tauri events. |
| **Leaflet re-render** | Map re-renders on every parent state change if not isolated. ARCHITECT: observer at leaf; derived/computed for points/events; avoid subscribing to full collections. Risk: performance regression if state-driven map is not scoped. |
| **Radix reuse** | Multiple modals (BottomSelectModal, Dialog) must share Radix patterns; accessibility and focus trap. Risk: inconsistent a11y or duplicate Radix usage. |
| **Code quality** | Nesting, store proliferation, loading/query scattered. Risk: new stores per feature; duplicate loading flags; deep component trees. |

---

## 2. Mitigations or acceptance

| Risk | Mitigation or acceptance |
|------|---------------------------|
| SSR / PWA | Defer SSR until needed; document that state architecture assumes client-only unless hydration path is added. PWA: use loadingState.notification for offline/error toasts. |
| Tauri lifecycle | Use Tauri lifecycle events to persist/restore minimal state if needed; avoid storing volatile UI in Tauri store only. Accept: single store in memory is primary. |
| Leaflet re-render | Enforce observer/computed for map children; single MapEngine component; derive visible points/events from playerState/queryState in one place. Accept: refactor map layer to be leaf-only subscription. |
| Radix reuse | One SmartSelectableModal built on Radix (or same a11y contract); one Dialog usage pattern. Audit after TD1/TC1. |
| Code quality | No new stores without justification; centralized loading and query (loadingState, queryState). Limit nesting (max 100 lines per component per DESIGN_SPRINT_GUIDE). |

---

## 3. No implementation

Mitigations are documented; no code in this sprint. Migration and implementation can account for this risk list.
