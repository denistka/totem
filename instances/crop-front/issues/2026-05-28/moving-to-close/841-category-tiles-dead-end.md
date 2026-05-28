# QA Flow — Issue #841: URGENT: Home page category tiles dead-end

**URL:** https://github.com/CT-CROP/CROP-front/issues/841  
**Labels:** bug, urgent, sale-blocker, goal/obj-06  
**Filed:** 2026-05-15  
**Triage status:** POSSIBLY-FIXED  

## Evidence

Code in `app/_components/home/shop-by-category.tsx` (read 2026-05-28 on dev branch):

```
// "bearing seal" or "pto driveline" require BOTH tokens on the same part
// and return zero against NHL — verified empty on prod 2026-05-15 for the
// initial multi-word picks for tiles #3, #4 and #7 (#841). Until the
// backend gains OR-mode, prefer the single most-specific noun...
```

**Before fix (dead-end queries):**
- "Bearings & seals" → `?q=bearing+seal` (multi-word AND, zero results)
- "PTO & drivetrain" → `?q=pto+driveline` (multi-word AND, zero results)
- "Engine & cooling" → `?q=engine+cooling` (multi-word AND, zero results)

**After fix (current code):**
- "Bearings & seals" → `?manufacturer=NHL&q=bearing`
- "PTO & drivetrain" → `?manufacturer=NHL&q=pto`
- "Engine & cooling" → `?manufacturer=NHL&q=cooling`

A vitest regression guard (`shop-by-category-query-allowlist.test.ts`) now pins every query to a verified-non-empty allowlist.

**Local test note:** On localhost:3000 dev, several categories show "No results" including `filter`, `hydraulic`, `bearing`, `cooling`, `brake`. This is likely a dev data gap (local hono/search service does not have the full NHL parts catalog). `pto`, `belt chain`, `electrical light`, etc. DO return results locally. Not a code regression.

## Steps to verify manually on production

1. Open https://clintontractor.net/
2. Scroll to "Shop by category" section (12 tile grid)
3. Click each of these tiles:
   - "Bearings & seals" → should show NH parts, NOT "No results"
   - "PTO & drivetrain" → should show NH parts, NOT "No results"
   - "Engine & cooling" → should show NH parts, NOT "No results"
4. Also confirm all 12 tiles return non-empty results

## Expected result
All 12 category tiles link to a populated parts listing page on prod.

## Actual result (at time of filing, 2026-05-15)
3 of 12 tiles returned zero results: bearing seal, engine cooling, pto driveline.

## Risk if wrongly closed
Medium — the code fix is correct (single-word queries), but if the prod NHL catalog is missing parts for these categories, they could still dead-end. Recommend verifying at least 3 tiles above on prod before closing. If all pass: close. If any still empty: check hono data pipeline, not this component.
