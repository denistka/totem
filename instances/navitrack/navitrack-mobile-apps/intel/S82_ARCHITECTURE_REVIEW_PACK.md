# S82 — Architecture review pack (TW2)

**Date:** 2026-04-08  
**Purpose:** Single index for post-sprint handoff (`post_sprint_guards` assembly).

## Executive summary

- **Constraints:** No feature rewrites; UI/behavior parity; structural refactors only (`S82-ARCHITECT-V4-FULL-OPTIMIZATION.ptl` `migration_safety`).
- **Layering:** FSD-style map in `S82_FSD_LAYER_MAP.md`; UI types pilot via `entities/vehicle/model.ts`; reports HTTP imports use `@/api/domains/reports` on critical modules.
- **SSOT:** HTTP via `api/client.ts` + domains (`S82_API_CLIENT_SSOT.md`); types audit `S82_API_TYPE_SSOT_AUDIT.md`.
- **Duplication:** jscpd **0** clones after TS0; semantic follow-ups in `S82_SEMANTIC_DUPLICATION_MATRIX.md`.
- **Deps:** **0** circular imports (`pnpm deps:cycles`).
- **Risks / open:** SonarJS 40 warnings (TL0); TP2–TP4 performance passes not exhaustively profiled in this pack; remaining `@/api` barrel type imports on tracking/map (TA2 P1).

## Artifact index

| Artifact | Role |
|----------|------|
| [S82_ARCHITECT_V4_BASELINE.md](./S82_ARCHITECT_V4_BASELINE.md) | Codemap, lint, jscpd history |
| [S81_DUPLICATION_AND_UNIFICATION.md](./S81_DUPLICATION_AND_UNIFICATION.md) | Prior sprint continuity |
| [S82_SEMANTIC_DUPLICATION_MATRIX.md](./S82_SEMANTIC_DUPLICATION_MATRIX.md) | TS1 / TS2 backlog |
| [S82_HOOKS_NORMALIZATION.md](./S82_HOOKS_NORMALIZATION.md) | TS3 |
| [S82_FSD_LAYER_MAP.md](./S82_FSD_LAYER_MAP.md) | TM1 |
| [S82_API_CLIENT_SSOT.md](./S82_API_CLIENT_SSOT.md) | TA1 |
| [S82_API_TYPE_SSOT_AUDIT.md](./S82_API_TYPE_SSOT_AUDIT.md) | TA2–TA5 roadmap |
| [S82_QUALITY_GATES.md](./S82_QUALITY_GATES.md) | TW1 metrics & scripts |

## S81 cross-links

- `S81_DUPLICATION_AND_UNIFICATION.md` (madge / jscpd / semantic backlog).
- S81-TK4 brief: use repo search `TK4` / sprint 81 intel if present.

## Code highlights (this execution)

- Shared dedupe utilities: `lib/format-header-date-span.ts`, `lib/screen-date-range-init.ts`, `hooks/useFormatDurationFromMs.ts`, `ui/toggle-label-switch-row.tsx`.
- **Tests:** none in repo yet (removed from S82 scope; add Vitest/Jest in a separate task).
- **Lazy route:** `MapScreen` code-split in `app/ScreenRouter.tsx` (adds to existing lazy screens).

## Visual / CSS

- **TR1:** Tailwind merge helper remains `cn` in `@/lib/utils`; toggle row classes centralized in `toggle-label-switch-row.tsx`. No token changes in this pack.

## Performance track (TP)

- **TP1:** Additional lazy boundary: `MapScreen`.
- **TP2–TP4:** Deferred to follow-up PRs; no regressions introduced by lazy `MapScreen` (same `Suspense` shell as other screens).
