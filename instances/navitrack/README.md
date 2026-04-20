# Instance: NaviTrack

Fleet tracking PWA (React 19, optional Tauri 2). Source and stack details: **`project.config.yml`**.

## Layout

| Item | Location |
|------|----------|
| Instance config | `project.config.yml` |
| Sprint / task files | `sprints/` (e.g. `84/`, `85/`) |
| Intel & machine index | `intel/` (`TOTEM_SPRINTS.ti`, reports, JSON baselines) |
| Application code | `paths.code` in `project.config.yml` (relative to this instance folder; typically the monorepo’s `navitrack-apps` package) |

## Default guardians (from config)

`ROOT`, `PM`, `QA`, **`CODEMAP_QUALITY_ADVISOR`**, `DEVOPS`, `ARCHITECT` — plus stack adapters such as `FRONTEND_DEV` on tasks via `requires:`.

- **`CODEMAP_QUALITY_ADVISOR`** — codemap JSON under `src-client/codemap/`: structural quality verdict and ordered refactor steps (or report-only when the prompt says so). See `AGENT-GUIDE.md` in that folder.

## Codemap (client)

Regenerate from `navitrack-apps/src-client`: `pnpm codemap`. Artifacts: `src-client/codemap/*.json`, guide: `src-client/codemap/AGENT-GUIDE.md`.

## Recent in-instance sprints

- **S84** — Constrained architectural repair (FSD convergence, ownership, api/store boundary, graph verification).

See `intel/TOTEM_SPRINTS.ti` for a machine-oriented sprint list; it may lag behind `sprints/` — prefer filesystem for latest `.ptl` / `.pd`.
