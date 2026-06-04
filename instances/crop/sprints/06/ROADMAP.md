# V2 Multi-Brand Launch — S06 Roadmap

> **Live issue:** https://github.com/CT-CROP/CROP-front/issues/1544 (created 2026-06-03).
> This file mirrors that issue. Source of truth for task DETAIL = the `S06-*.pd` files in
> this folder; the issue is the team-facing checkbox tracker. When a checkbox flips, update
> both the GitHub issue and the matching `.pd` `gate:`/`status:`.

## Impact

Four brands — **Ferris, Ventrac, McHale, Marcrest** — go from dev-only to production, each
with a real brand page and a straight path to parts diagrams on desktop and mobile. Parts
diagrams are the #1 customer-facing feature; this sprint is the funnel from "I have a Ferris
mower" to the exact part. Shown to ownership end of week.

- **Deadline:** 2026-06-06 · **Env:** branch `dev` → `crop-dev.app` → prod
- **Workflow:** dev opens PR → @denistka runs locally + PASS → @appdev-v final review + merge
- **Design sub-track:** umbrella #1525 (PRs #1533 / #1537 / #1543)

---

## Track A — Brand Activation

- [x] **A1 — Marcrest → hono registry + carried whitelist** · @DaniilDerkach · [#332](https://github.com/CT-CROP/CROP-search-hono/pull/332) ✅ merged
- [ ] **A2 — Activate Marcrest in CROP-front** (flip `available`, config + invariant tests) · @pedchenkooleh-coo · [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) 🔧 in flight
- [ ] **A3 — 4-brand end-to-end smoke** (the deploy gate) · @denistka · [#1541](https://github.com/CT-CROP/CROP-front/issues/1541) ⏳ blocked on A2
- [ ] **A4 — Ferris 59-config codes resolve to assemblies** · @DaniilDerkach · ❓ pending investigation (not covered by #332)
- [ ] **A5 — Marcrest `brand_vocabulary` DB row + data check** · @appdev-v
- [ ] **A6 — Ferris 59-series slug data fix** (only if A4 finds empty slugs) · @appdev-v

## Track B — Navigation & UX

- [ ] **B1 — Desktop circular nav-loop fix** · @pedchenkooleh-coo · [#1539](https://github.com/CT-CROP/CROP-front/issues/1539) 🔧 in flight
- [ ] **B2 — Mobile assembly image-scroll panel** (reuse MobileChapterDrawer) · @pedchenkooleh-coo · [#1540](https://github.com/CT-CROP/CROP-front/issues/1540) 🔧 in flight
- [x] **B3 — Equipment-type imagery on TypeCards** · ✅ already shipped (verified in #1537 review)
- [ ] **B4 — Ferris commercial-mower flash fix** (may be resolved by #1537 loading.tsx) · @pedchenkooleh-coo
- [ ] **B5 — Navigation smoke (B1 + B2 sign-off)** · @denistka · ⏳ blocked on B1+B2 PRs

## Track C — Multibrand Search

- [x] **C1 — Multibrand PN collision → correct brand attribution** · @DaniilDerkach · [#332](https://github.com/CT-CROP/CROP-search-hono/pull/332) ✅ merged
- [x] **C2 — Search brand context + facets + MAR display tests** · @DaniilDerkach · [#332](https://github.com/CT-CROP/CROP-search-hono/pull/332) ✅ merged
- [x] **C3 — Brief Dan on multibrand search gap** · @appdev-v · ✅ done

## Design redesign (umbrella #1525)

- [x] **Foundation — shared brand component library** · @appdev-v · [#1533](https://github.com/CT-CROP/CROP-front/pull/1533) ✅ merged
- [ ] **Diagrams page v2** · @appdev-v · [#1537](https://github.com/CT-CROP/CROP-front/pull/1537) 🔍 approved, awaiting merge
- [ ] **Brand hub page v2** · @appdev-v · [#1543](https://github.com/CT-CROP/CROP-front/pull/1543) 🔍 approved, awaiting merge
- [x] **e2e coverage (price-leak + a11y + live filter)** · @denistka · [#1535](https://github.com/CT-CROP/CROP-front/issues/1535) ✅ on #1537 branch

## Release

- [ ] **D0 — Production deploy** (tag `v2.0.0-brands`, spot-check 4 brand pages) · @appdev-v · ⏳ blocked on A3 smoke ✓

---

## Definition of Done (per brand)

- [ ] `/parts/brand/{slug}` → 200, brand name + TypeCards visible
- [ ] `/parts-diagrams/{slug}` → 200, model grid (or graceful empty-state)
- [ ] ≥1 assembly diagram loads end-to-end (schematic + BOM row)
- [ ] No JS console errors at 375px and 1280px
- [ ] No circular nav loop; brand crumb → brand page
- [ ] Ferris: ≥3 commercial-mower 59-series models clickable + loading
- [ ] Multibrand PN search returns correctly attributed results
- [ ] @denistka smoke checklist all ✓ · @appdev-v merged · verified on `crop-dev.app` before prod

> `seoIndexed` stays `false` for all 4 new brands — never flip without John's explicit approval.

---

## Progress

**Done (6):** A1, B3, C1, C2, #1533, #1535 · **Approved awaiting merge (2):** #1537, #1543
**In flight (3):** A2, B1, B2 · **Blocked (2):** A3, B5 · **Pending (2):** A4, B4 · **Vova ops (3):** A5, A6, D0

**Critical path:** `A2 (#1538) → @denistka PASS → @appdev-v merge → A3 smoke → D0 deploy`

---

## Ops task detail (tasks with no `.pd` — kept here so nothing is lost)

### A5 — Marcrest `brand_vocabulary` DB row (@appdev-v)
```sql
INSERT INTO brand_vocabulary (code, name, is_carried)
VALUES ('MAR', 'Marcrest', true)
ON CONFLICT (code) DO UPDATE SET is_carried = true, name = 'Marcrest';
-- data check (0 rows = acceptable → graceful empty-state, not 404/500):
SELECT COUNT(*) AS n, product_line FROM models
WHERE product_line ILIKE '%marcrest%' OR product_line ILIKE 'MAR%' GROUP BY product_line;
```
Then `curl -X POST {hono-dev}/admin/cache/refresh -H "Authorization: Bearer $ADMIN_REFRESH_TOKEN"`.

### A6 — Ferris 59-series slug fix, only if A4 finds empty slugs (@appdev-v)
```sql
-- verify first:
SELECT model_code, model_number, slug FROM models
WHERE product_line = 'FERRIS' AND model_number LIKE '59%' AND (slug IS NULL OR slug = '') LIMIT 20;
-- fix:
UPDATE models SET slug = LOWER(REGEXP_REPLACE(model_number, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE product_line = 'FERRIS' AND model_number LIKE '59%' AND (slug IS NULL OR slug = '');
```
Then cache refresh; notify @DaniilDerkach to re-run A4 acceptance.

### B5 — Navigation smoke (@denistka)
- **Desktop 1280px:** `/parts-diagrams/ferris` → model → assembly; click every crumb/back link;
  "Ferris" crumb → `/parts-diagrams/ferris` (not root); no click returns to the same page;
  repeat Ventrac + McHale; re-walk the brand-landing "Open parts diagram" CTA.
- **Mobile 375px (iPhone SE):** assembly page → "Browse Diagrams" trigger visible → drawer
  opens with images (not text) → tap image scrolls schematic → pinch-zoom still works → tap
  outside closes, schematic still pannable.

### C3 — Brief Dan on multibrand search (@appdev-v) — ✅ done
Posted async brief: search now spans 4 brands; PN-collision attribution; Ferris 59-numbers as
entry points; open Q on non-NH brand-code population in PG `parts`.

### D0 — Production deploy (@appdev-v)
Preconditions: A3 smoke ✓ on `crop-dev.app` · B5 ✓ · all V2 PRs merged to `dev` · no open high-pri bug.
1. Confirm with John. 2. `git tag v2.0.0-brands && git push origin v2.0.0-brands`.
3. Deploy `dev` → prod (Vercel + Cloud Run). 4. Spot-check `/parts/brand/{ferris,ventrac,mchale,marcrest}` → 200.
5. Confirm `<meta name="robots">` = `noindex,follow` on all 4. 6. Confirm to John.
**Rollback:** promote previous Vercel / route Cloud Run to prior revision; re-open smoke gate.
