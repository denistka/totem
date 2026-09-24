# S56-Migration-Strategy — Phased Migration to Target Architecture

**Task:** S56-TD2-Migration-Strategy  
**Constraints:** S51, S52, S53 invariants; no duplicate components; state architecture approved before implementation; Web + Desktop (Tauri) unification.

---

## Phases (high level)

| Phase | Scope | Gate |
|-------|--------|------|
| **0** | State architecture approved (S56-State-Architecture-Proposal.md). No code. | User LGTM on TC2 artifact. |
| **1** | Central state + GlobalLoader. Introduce loadingState, single GlobalLoader by mode; replace scattered LoadingOverlay with global state. | Checkpoint: one loader; no regression. |
| **2** | AppHeader + headerMode/headerViewState. Single AppHeader; all screens use it; route or content driven by headerMode. | Checkpoint: one header; navigation unchanged. |
| **3** | Query state + QueryValidator. Centralize tracking and reports query build/validate/submit; remove duplicate logic from screens. | Checkpoint: queryState single source; no duplicate validators. |
| **4** | SmartSelectableModal. Introduce one selection modal pattern; migrate report type/company/vehicle and object visibility to it. | Checkpoint: one modal pattern; Radix reuse. |
| **5** | Player + MapEngine. PlaybackControls and map driven by playerState; MapEngine with observer/scoped subscription. | Checkpoint: one player, one map component. |
| **6** | Tauri/Web parity. Unify config (API base, auth) for Web and Desktop; same state and components. | Checkpoint: one codebase; platform-specific only where required. |

---

## Principles

- **No big-bang.** Each phase scoped to one system (loader, header, query, modal, player/map, parity). Gate approval or checkpoint before next phase.
- **Invariants:** Respect S51, S52, S53 (INVARIANTS.md, style, dedup). No new entities without audit; no duplicate components; state architecture approved before implementation.
- **Web + Desktop:** Same components and state; Tauri uses same React tree and stores; only native bridges (e.g. http, store) differ.

---

*Planning only. Implementation sprints derived after gate OPEN.*
