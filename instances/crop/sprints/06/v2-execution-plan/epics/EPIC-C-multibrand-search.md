# EPIC C — Multibrand Search

**Goal 3** · Owners: Daniil, Dan · Repo: CROP-search-hono

## Outcome

Search resolves correctly across multiple brands: when a part number exists in 2+ brands,
results carry correct brand attribution; brand facets populate for the 4 new brands;
config numbers work as search entry points.

## Why

John: *"a part number can be the same for two brands potentially… search is going to be
much more complicated when we're not using just the New Holland data set."* A search that
returns wrong-brand results destroys trust. Dan owns search and was absent from the
2026-06-02 meeting — he must be briefed before release.

## State of play (verified 2026-06-03)

- hono `vocabulary.test.ts` already covers `FRR`/`VNT`/`MCH` display + normalisation
  (L50-53, 112-115). **Only `MAR` coverage is missing** — added by A1; C2 extends it. (see [F5](../CODE-FINDINGS.md#f5))
- `getCarriedBrandCodes()` unions static whitelist + PG `brand_vocabulary` (`vocabulary-cache.ts:653`).
- `brand-extractor.ts` guards CNH-family AI-copy contamination — Ferris/Ventrac/McHale are
  **not** CNH family and must pass `isAiBrandSafe` as safe (do not widen its scope).
- Brand facet aggregation is gated by `MANUFACTURER_FILTER_ENABLED` in `/api/filters`.

## Tasks

| Task | Owner | Day | Notes |
|------|-------|-----|-------|
| [C1 — Multibrand PN collision audit](../../S06-C1-multibrand-pn-search.pd) | Daniil | D2–D3 | `manufacturer_codes` attribution; code fix vs data gap |
| [C2 — Search brand context + facets + MAR tests](../../S06-C2-search-brand-context.pd) | Daniil | D2 | Brand facets for 4 brands; `getBrandDisplayName` coverage |
| C3 — Brief Dan on multibrand search (ops, see [ROADMAP](../ROADMAP.md)) | Vova/group | D1 | Async-friendly written brief |

## Epic acceptance

- `GET /api/search?q={PN-in-2-brands}` → each result's `manufacturer_codes` carries the
  correct brand code(s); no wrong-brand-only result
- `/api/filters` (with `MANUFACTURER_FILTER_ENABLED=true`) shows Ferris/Ventrac/McHale facets
- `getBrandDisplayName("FRR"|"VNT"|"MCH"|"MAR")` all return correct names (never `"UNK"`/code)
- No 500s on `/api/search` for Ferris part numbers
- `brand-extractor.ts` scope unchanged (CNH family only)
- Dan acknowledges the brief; any data-pipeline gap captured as one issue (impact statement,
  assigned Vova/Alex) — does **not** block V2
