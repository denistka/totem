## Status: Visuals Optimized, Logic Hardening P0

**Visually**: 95% Configured. Glass/Glow design system is active across 9 screens.
**Architecturally**: **CRITICAL**. S44's design dash resulted in code degradation. Quality and architecture are now the primary focus.

---

## 🛡️ Quality Invariants (REQUIRED)

1.  **Deduplication First**: NO new files if logic can be merged. 1 Logic Gate = 1 Place.
2.  **No "Shadow" Entities**: Do not duplicate types or interfaces for the same model (e.g., Vehicle, Event).
3.  **Atomic Tasking**: Tasks MUST be < 50 lines. Large changes are REJECTED.
4.  **Suspicion Rule**: If an implementation feels heavy or redundant — WARN and STOP.
5.  **Master Hooks**: Centralize all orchestration. UI components MUST be pure and small (< 100 lines).

---

## UI & Design Invariants

- **Tokens**: `index.css` is the source of truth. DO NOT hardcode values.
- **Components**: `GlassCard`, `GlassButton`, `BottomSelectModal` are mandatory. No custom overlays.
- **Mobile**: Touch targets MIN 44px. Ergonomics for one-handed use are non-negotiable.

**References**

- Config: `project.config.yml` (`ui_design_docs`, `react_app` path).
- Design sprint guide: `totem/core/DESIGN_SPRINT_GUIDE.md` (project-agnostic).
- Stack guidance: `totem/stacks/react-ts/APP_UI_KIT.ti`, `totem/stacks/react-ts/UI_UX.ti`.

---

## Epics & Sprints

- **Epic 0**: Core Framework & Legacy Port (DONE).
- **Epic 1**: S44 Design Dash (DONE - Visuals ✅, Quality ⚠️).
- **Epic 2 (ACTIVE)**: Architectural Hardening & Refactoring (P0).

---

## Key Docs (Instance)

| Doc           | Location                            |
| ------------- | ----------------------------------- |
| Intel Index   | `intel/TOTEM_INDEX.ti`              |
| Config        | `project.config.yml`                |
| Quality Rules | README.md#🛡️-quality-invariants     |
| Design guide  | `totem/core/DESIGN_SPRINT_GUIDE.md` |

## Guardians Selection

- Universal: `ROOT`, `PM`, `TEAM_LEAD`, `QA`, `DEVOPS`, `ARCHITECT`
- Adapters: `FRONTEND_DEV` (React 19), `RUST_DEV` (Tauri/WGPU)
