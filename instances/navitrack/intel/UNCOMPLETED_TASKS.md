# NaviTrack — Uncompleted Tasks Audit

> **Date**: 2026-03-10  
> **Context**: All sprints (S01–S64) marked complete. This document collects tasks that were **never started**, **skipped**, or remain **open** in the backlog.

---

## 1. Never-Started Sprints

### S38 — Async-Reports-2FA (⏭️ skipped)

- **Priority**: P1 | **Epic**: E-01-TO-DO | **Dep**: S37
- **Scope**: H-002 (2FA Google), H-003 (async Reports API), F-004 (Report sharing)
- **Tasks**:
  - T1: Spec async Reports API (polling/SSE for progress)
  - T2: Spec 2FA flow with Google Sign-In
  - T3: Implement async report request + progress UI + download/cancel
  - T4: Implement 2FA enrollment and login with Google Sign-In
  - T5: Report sharing (Email/Telegram/Viber/WhatsApp) — F-004
- **Note**: 2FA and async reports were later implemented in S47 (Feature-Hardening). Report sharing (F-004) remains open.

### S39 — Feature-Pack (⏭️ skipped)

- **Priority**: P2 | **Epic**: E-01-TO-DO | **Dep**: S38
- **Scope**: F-001, F-002, F-005, M-007, F-007
- **Tasks**:
  - T2: F-001 Engine Block (Safe/Emergency modes) — UI + API
  - T3: F-002 Event Journal last 3 days — expandable date range
  - T4: F-005 Vehicle search in Tracking/Reports — filter by name
  - T5: M-007 Event sound on both platforms
  - T6: F-007 New push format (larger/richer)
- **Note**: None of these features were implemented. All remain open in the backlog.

### S40 — Tech-Debt-Cleanup (⏭️ skipped)

- **Priority**: P3 | **Epic**: E-01-TO-DO | **Dep**: S39
- **Scope**: wgpu-update, static-mut-refactor, M-002
- **Tasks**:
  - T2: Update wgpu (and deps) in navitrack-app; fix breakages
  - T3: Rust static/mut refactor where identified
  - T4: M-002 iOS clustering zoom level
- **Note**: The project pivoted to React PWA (E-04/E-05). Rust/WGPU tech debt is no longer relevant to the active codebase. M-002 remains open.

---

## 2. LOCKED Sprint (Never Executed)

### S62 — Refactoring & Optimization (🔒 LOCKED)

- **Priority**: P1 | **Epic**: E-06-CODE-QUALITY-OPTIMIZATION
- **Scope**: Code cleanup, component architecture, API consolidation, performance, type safety, dev experience
- **Tracks** (all LOCKED):
  - A: Remove dead code, eliminate hardcoded lists, consolidate duplicate components
  - B: Extract reusable components, proper composition patterns, optimize re-renders
  - C: Consolidate API patterns, implement caching, optimize data flow
  - D: Bundle size optimization, lazy loading, memoization, virtual scrolling
  - E: TypeScript coverage, eliminate `any` types, add proper interfaces
  - F: Error boundaries, debugging tools, performance monitoring, documentation
- **Note**: This sprint was created as a standalone refactoring effort but was never unlocked. Many of these goals were partially addressed in S61 and S63 tracks (G/H/I).

---

## 3. Open Backlog Items

### Medium Priority

| ID    | Description                     | Status  |
| ----- | ------------------------------- | ------- |
| M-002 | iOS clustering zoom level       | ⬜ Open |
| M-003 | iOS track arrows (like Android) | ⬜ Open |
| M-007 | Event sound on both platforms   | ⬜ Open |

### Features

| ID    | Description                                        | Status  |
| ----- | -------------------------------------------------- | ------- |
| F-001 | Engine Block (Safe + Emergency modes)              | ⬜ Open |
| F-002 | Event Journal last 3 days, expandable date range   | ⬜ Open |
| F-003 | Technical Maintenance alerts, TC highlighting      | ⬜ Open |
| F-004 | Report sharing (Email/Telegram/Viber/WhatsApp)     | ⬜ Open |
| F-005 | Vehicle search in Tracking/Reports, filter by name | ⬜ Open |
| F-007 | New push format (larger/richer)                    | ⬜ Open |

### Nice to Have

| ID    | Description           | Status  |
| ----- | --------------------- | ------- |
| N-002 | Widgets (Android/iOS) | ⬜ Open |
| N-003 | Apple Watch / Wear OS | ⬜ Open |
| N-004 | Offline maps          | ⬜ Open |
| N-005 | Messages / Chat       | ⬜ Open |

---

## 4. Summary

| Category                        | Count                      |
| ------------------------------- | -------------------------- |
| Skipped sprints (S38, S39, S40) | 3                          |
| Locked sprints (S62)            | 1                          |
| Open backlog — Medium           | 3                          |
| Open backlog — Features         | 6                          |
| Open backlog — Nice to Have     | 4                          |
| **Total open items**            | **13 backlog + 4 sprints** |

> These items are candidates for a future planning cycle. Some (Rust/WGPU debt in S40) may be deprecated given the architecture pivot to React PWA.
