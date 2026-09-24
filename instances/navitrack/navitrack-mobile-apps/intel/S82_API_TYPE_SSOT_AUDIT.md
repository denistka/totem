# S82 — API & type SSOT audit (TA2)

**Date:** 2026-04-08  
**metric_lock.api_metric:** coverage of “used endpoint families ↔ canonical client types” (this table is the scoreboard).

## P0 — align next

| Area | Finding | Action owner |
|------|---------|--------------|
| Reports UI | Types + calls spread across `@/api` barrel vs `@/api/domains/reports` | **In progress** — critical screens use `domains/reports` for HTTP |
| Vehicle UI | `Vehicle` types from barrel | **In progress** — pilot `entities/vehicle/model` for types |

## P1

| Area | Finding | Action |
|------|---------|--------|
| Tracking | `Track`, `TrackEvent` still often from `@/api` barrel in components | Route types through `entities` or `api/domains/tracking` in a follow-up slice |
| Zones | `Zone` from barrel on map screens | Same as tracking |

## P2

| Area | Finding | Action |
|------|---------|--------|
| Unused exports | Knip-style noise on barrels | TA3: delete only after grep confirms zero refs |
| Duplicate DTO names | `FooDto` vs `FooResponse` drift | TA4/TA5 rename + single export per family |

## TA3 backlog (unused client surface)

- Re-run `npx knip` after major refactors; do not mass-delete without per-symbol grep.

## Notes

- OpenAPI file not wired in-repo; SSOT is **client domain modules** + `report-types` / `vehicle-types` etc.
