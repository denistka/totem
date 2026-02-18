# NaviTrack — Project Overview

**Stack**: React 19 + TypeScript (primary PWA), Vue 3, Tauri 2 + Rust, WebGPU  
**Source**: [GitHub Repo](https://github.com/denistka/navitrack)

---

## Architecture

| Layer             | Directory                       | Responsibility                            |
| ----------------- | ------------------------------- | ----------------------------------------- |
| App Shell (React) | `navitrack-apps/react-app/`     | Main React 19 PWA (Vite, Tailwind, glass) |
| App Shell (Vue)   | `navitrack-apps/`               | Legacy Vue 3 PWA (Vite)                   |
| Graphics          | `wgpu/`                         | WebGPU/WASM components                    |
| UI (React)        | `navitrack-apps/react-app/src/` | Screens, components, design system        |

---

## UI & design sprints (for team planning)

Use this section for UI/design backlog and sprint planning. Keep it updated as screens and patterns evolve.

**Principles (соблюдать в будущем)**

- **Переиспользование компонентов**: не плодить сущности — перед новым компонентом или стилем проверить, есть ли уже базовый (BottomSelectModal, glass, glass-glow, DateRangePicker, MobileHeader и т.д.); при необходимости расширить существующий, а не создавать параллельный.
- **Консистентные изменения по коду**: тщательно анализировать кодовую базу перед правками; вносить изменения на всём участке кода консистентно, опираясь на базовые сущности (токены в index.css, общие компоненты, одни и те же паттерны модалок/кнопок/отступов). Один стиль модалки — один компонент; один стиль кнопки — один вариант.

**Design system**

- **Tokens & glass**: `navitrack-apps/react-app/src/index.css` — `--glass-*`, `--primary`, light/dark, `prefers-reduced-motion`.
- **Background**: `navitrack-apps/react-app/src/styles/app-bg.css`, `AppBg` component.
- **Stack**: Tailwind + Radix primitives; align deps with `refs/app-ui-kit` (see `project.config.yml`).

**Key UI patterns (implemented)**

- **Overlay + bottom sheet**: Modals/popups use `fixed inset-0 z-40` overlay with `backdrop-blur-sm` and `bg-foreground/20`; content `fixed inset-x-4 bottom-4` (date/time, vehicle/company select).
- **Shared modal**: `BottomSelectModal` (`src/components/bottom-select-modal.tsx`) — single style for list pickers (Vehicle, Company, Report type); title `text-sm font-semibold`, list without row background, Cancel = primary button right-aligned.
- **Date & time**: `DateRangePicker` — one popup wrapper; calendar view and 2D time slider (X=minutes, Y=hours), grid labels, “now” dot (blurred + pulsed), analog clock in footer; Done/Cancel consistent with modals.
- **Headers**: Overlay header (content scrolls under); bottom nav fixed with glass; content `pt-12 pb-[4.5rem]` or `pb-[13rem]` when fixed bottom blocks exist (Tracking, Reports).
- **Lists**: Objects screen — vehicle rows, fuel badge (icon + value, two-layer blur+pulse); Settings — toggles, Language/Map type buttons with top padding; Reports — no section titles, Report type / Time interval / Company / Vehicle as controls.

**Planning tips**

- Before a UI sprint: list screens/flows to touch; decide which use `BottomSelectModal` vs custom; confirm tokens in `index.css` for new surfaces.
- After a sprint: add new components to this README “Key UI patterns”, update `intel/TOTEM_SPRINTS.ti` and epics if needed.
- Reuse: glass (`glass`, `glass-strong`), buttons (`glass-glow` for primary), inputs (`glass-input`); avoid one-off modal styles.

**References**

- Config: `project.config.yml` (`ui_design_docs`, `react_app` path).
- Design sprint guide: `totem/core/DESIGN_SPRINT_GUIDE.md` (project-agnostic).
- Stack guidance: `totem/stacks/react-ts/APP_UI_KIT.ti`, `totem/stacks/react-ts/UI_UX.ti`.

---

## Epics

- **Epic 0 (E-00)**: Done — all completed work. See `intel/TOTEM_EPICS.ti`.
- **Epic 1 (E-01-TO-DO)**: To-Do — optional (S20, S21), backlog (S38–S40). S34–S37 and S27 done. See `intel/TOTEM_EPICS.ti`, `intel/TOTEM_SPRINTS.ti`.

---

## Key Docs (Instance)

| Doc                 | Location                            |
| ------------------- | ----------------------------------- |
| Protocol Core       | `totem/core/`                       |
| Intel Index         | `intel/TOTEM_INDEX.ti`              |
| Config              | `project.config.yml`                |
| UI/design plan      | README.md#ui--design-sprints        |
| Design sprint guide | `totem/core/DESIGN_SPRINT_GUIDE.md` |

## Guardians Selection

Universal Process: `ROOT`, `PM`, `TEAM_LEAD`, `QA`, `DEVOPS`, `ARCHITECT`

Stack Adapters:

- `FRONTEND_DEV` (React 19 + TypeScript; React PWA: `navitrack-apps/react-app/`; Tailwind, glass, Radix)
- `RUST_DEV` (Tauri, WGPU)
