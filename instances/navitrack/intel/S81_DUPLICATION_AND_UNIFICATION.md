# S81 — Duplication audit & unification plan

**Tools:** `pnpm run dupes:jscpd` (from `navitrack-apps/src-client`), `pnpm run lint` (SonarJS rules at **warn**), `npx madge --circular --extensions ts,tsx src`.

## Madge (TK2)

- **Result:** no circular dependencies (`madge` exit 0).
- **Stack:** `madge` run from `src-client` root on `src`.

## jscpd baseline (post T0)

- Run: `pnpm run dupes:jscpd` (config: `.jscpdrc.json`).
- Latest snapshot: low duplicate % in TS/TSX; notable clones include `language-selector.tsx` (internal) and `theme.css` (CSS block). Use reports to prioritize the next refactors.

## SonarJS (lint)

- Duplicate-branch / cognitive-complexity / nested ternary warnings surface in tracking and reports screens — aligns with TF/TG thin/split tasks.

## Findings & backlog (semantic)

| Area | Finding | Priority | Proposed layer | Notes |
|------|---------|----------|----------------|-------|
| Reports | Domain split done | P0 | `api/domains/report-*` | TA1 |
| Date/time | Single `lib/datetime.ts` | P0 | `lib/datetime` | TC2 |
| Date UI | Split picker module | P0 | `modules/date-range-picker/*` | TC1 |
| Map popups | Factory + row component | P1 | `MapPopupFactory`, `PopupRow` | TE1 |
| Lists | Sort/filter pure helpers | P1 | `lib/sorting.ts` | TG5 |
| Vehicle icons | Map registry facade | P1 | `modules/map/VehicleIconRegistry` | TD3 |
| Tracking action | Screen + map + controls | P1 | `hooks/useTrackingState`, components | TB1 |
| CSS | Semantic bundles + glass :is() | P2 | `styles/components.css`, `glass.css` | TH1/TH2 |
| API shared | `coerce` + auth contracts | P2 | `api/transforms/coerce`, `api/interfaces/auth` | TI1 |

## TK3 — Dead code

- `npx knip` reports many **unused exports** on public API surfaces (false positives for future/entry use). **No mass deletion** in this pass; re-run after large refactors.
- Removed only unused **barrel stubs** (`api/interfaces/index.ts`, `api/transforms/index.ts`) that duplicated direct imports.

## Alignment with tracks TA–TI

- **TA / TI:** Reports split + shared coerce + auth interfaces.
- **TB / TE / TD3:** Tracking screen decomposition + popups + icon registry.
- **TC:** Datetime + picker modularization.
- **TF / TG:** Remaining large screens/hooks (see sprint `.pd`); this document lists Sonar/jscpd hotspots to avoid duplicate work.
