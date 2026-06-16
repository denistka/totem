# V2 Multi-Brand Launch — S06 Roadmap

> **Live issue:** https://github.com/CT-CROP/CROP-front/issues/1544 (created 2026-06-03).
> **Team tracker** = #1544 issue body (checkboxes + QA tables).
> This file mirrors that issue. Source of truth for task DETAIL = the `S06-*.pd` files in
> this folder. When a checkbox flips, update **both** the GitHub issue body and this file.
>
> **Last synced:** 2026-06-12 EOD — **#1832 inventory · Denis PR wave #1866–#1870 · #1814 PASS · #1852 crop-dev PASS (#1854 merged)** · **#1867/#1855/#1866 merge queue → Vova** · **Saturday NOT green** · critical path: Vova merge Denis wave → crop-dev PASS → Oleg D1–D3/#1710 → John G12 → D0

## Impact

Four brands — **Ferris, Ventrac, McHale, Marcrest** — go from dev-only to production, each
with a real brand page and a straight path to parts diagrams on desktop and mobile. Parts
diagrams are the #1 customer-facing feature; this sprint is the funnel from "I have a Ferris
mower" to the exact part. Shown to ownership end of week.

- **Deadline:** 2026-06-06 (slipped) → **Saturday launch** (next prod window) · **Env:** branch `dev` → `crop-dev.app` → prod
- **Workflow:** dev opens PR → @denistka runs locally + PASS → @appdev-v final review + merge
- **Design sub-track:** umbrella [#1525](https://github.com/CT-CROP/CROP-front/issues/1525) (PRs #1533 / #1537 / #1543)

### Saturday launch contract (meeting 2026-06-09)

**In scope for go-live:** complete catalog data on every page · functional parts diagrams (desktop + mobile) · three visual pillars John has flagged repeatedly:

1. **Parts store** — in-house proprietary parts images live (Ferris, Ventrac, Marcrest, McHale, Baron)
2. **Parts diagrams** — consistent UI across all brands (Ferris = NH style); [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) mockup direction
3. **Equipment / category pages** — real model imagery (not generic wheat icons); category drill-down pages are highest beautification priority

**Deferred post-release:** major brand-hub layout rethink (overlapping identity bubble, dense instructional copy, parts-count hero stats, serial-search prominence). Unified **skeleton** (#1703 scope A/B) ships; **presentation layer** follows Maria Figma clean layout in a follow-up.

**Philosophy:** brand landing = two jobs only — find equipment model → diagram, or buy parts. Minimal copy; no fabricated metrics.

---

## Track A — Brand Activation

- [x] **A1 — Marcrest → hono registry + carried whitelist** · @DaniilDerkach · [search-hono#332](https://github.com/CT-CROP/CROP-search-hono/pull/332) ✅ merged
- [x] **A2 — Activate Marcrest in CROP-front** · @pedchenkooleh-coo · [#1553](https://github.com/CT-CROP/CROP-front/pull/1553) ✅ merged 2026-06-04
- [x] **A3 — 4-brand smoke (Ferris/Ventrac/McHale)** · @denistka · [#1541](https://github.com/CT-CROP/CROP-front/issues/1541) ✅ PASS 2026-06-04 (issue open — partial; see A3b)
- [x] **A3b — Marcrest smoke re-run** · @denistka · ✅ **PASS 2026-06-12** — [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) closed · hono#400 + [#1847](https://github.com/CT-CROP/CROP-front/pull/1847) · CE_2034 assembly E2E
- [ ] **A4 — Ferris 59-config codes resolve to assemblies** · @DaniilDerkach · ❓ pending investigation (no GH issue yet)
- [x] **A5 — Marcrest data load** · Alex · ✅ 170 models via [CROP-hub#165](https://github.com/CT-CROP/CROP-hub/issues/165) + [#146](https://github.com/CT-CROP/CROP-hub/issues/146)
- [x] **A5b — Marcrest catalog → live diagrams** · @DaniilDerkach · [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) ✅ **closed 2026-06-12**
- [ ] **A6 — Ferris 59-series slug data fix** (only if A4 finds empty slugs) · @appdev-v
- [x] **A7 — Brand hub entry parity** · [#1617](https://github.com/CT-CROP/CROP-front/issues/1617) ✅ closed 2026-06-05
- [ ] **A8 — NH Construction ≠ NH Agriculture** · @denistka · **Saturday** · [#1507](https://github.com/CT-CROP/CROP-front/issues/1507) · ✅ **#1841 + #1843 merged** on dev · Vova verified crop-dev · **John sign-off pending** · remainder [#1857](https://github.com/CT-CROP/CROP-front/pull/1857) (NHC carousel)
  - AG hub = 11 farm types · Construction tile → `/parts/brand/new-holland/type/construction`
  - Construction equipment types ≠ ag (tractors, balers, etc.)

## Track B — Navigation & UX

- [x] **B1–B5, B8** ✅ (#1556, #1578, #1583, #1589)
- [x] **B6** · [#1576](https://github.com/CT-CROP/CROP-front/issues/1576) ✅ closed 2026-06-05 · [#1597](https://github.com/CT-CROP/CROP-front/pull/1597)
- [x] **B7** · [#1530](https://github.com/CT-CROP/CROP-front/issues/1530) ✅ closed 2026-06-05 · [#1607](https://github.com/CT-CROP/CROP-front/pull/1607) crop-dev PASS
- [x] **B9** · [#1608](https://github.com/CT-CROP/CROP-front/issues/1608) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B10** · [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) → [#1693](https://github.com/CT-CROP/CROP-front/pull/1693) · ✅ **merged + crop-dev PASS** 2026-06-10 · #1609 closed
- [ ] **B11** · [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) → [#1695](https://github.com/CT-CROP/CROP-front/pull/1695) · ✅ Denis QA PASS (FE plumbing merged; hono `imageUrl` still null — keep #1613 open until Daniil's side deployed)
- [x] **B12** · [#1614](https://github.com/CT-CROP/CROP-front/issues/1614) → [#1684](https://github.com/CT-CROP/CROP-front/pull/1684) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B13** · [#1616](https://github.com/CT-CROP/CROP-front/issues/1616) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B14** · [#1618](https://github.com/CT-CROP/CROP-front/issues/1618) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B15** · [#1619](https://github.com/CT-CROP/CROP-front/issues/1619) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B16** · [#1621](https://github.com/CT-CROP/CROP-front/issues/1621) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B17** · [#1624](https://github.com/CT-CROP/CROP-front/issues/1624) → [#1671](https://github.com/CT-CROP/CROP-front/pull/1671) ✅ merged + **crop-dev PASS** 2026-06-08
- [x] **B18** · [#1515](https://github.com/CT-CROP/CROP-front/issues/1515) → [#1683](https://github.com/CT-CROP/CROP-front/pull/1683) ✅ merged + **crop-dev PASS** 2026-06-08

## Track QT — QA triage

- [x] **QT1** · [#1622](https://github.com/CT-CROP/CROP-front/issues/1622) ✅ closed 2026-06-05

## Track C — Multibrand Search

- [x] **C1–C3** ✅

## Design (#1525)

- [x] [#1533](https://github.com/CT-CROP/CROP-front/pull/1533), [#1537](https://github.com/CT-CROP/CROP-front/pull/1537), [#1543](https://github.com/CT-CROP/CROP-front/pull/1543), [#1535](https://github.com/CT-CROP/CROP-front/issues/1535) ✅

## Track UX — V2 ownership demo polish

### UX1 · [#1703](https://github.com/CT-CROP/CROP-front/issues/1703) — Brand hub parity · **PR [#1724](https://github.com/CT-CROP/CROP-front/pull/1724)**

- [x] **scope A+B merge** · @appdev-v · ✅ **merged 2026-06-10** · skeleton refactor + per-brand editorial config
  - ✅ unified `BrandHubPage` render path · `HubFeaturedRail` / `HubMaintenanceGrid` / `HubDealerStory`
  - ✅ `lib/equipment/brand-hub-config/` for F/V/M/Marcrest
  - ✅ Denis **crop-dev PASS** @ 375px + 1280px · all 5 brand hubs · **#1703 closed**
  - Note: hero peel + scroll-reveal animation commits dropped pre-merge (Vova — #1737 removes that element)
  - Marcrest meaningful types blocked on [#1538](https://github.com/CT-CROP/CROP-front/issues/1538)
- [ ] **scope C — hero simplification** · post-merge follow-up · meeting 2026-06-09
  - John/Vova rejected demo: overlapping identity bubble, dense serial/PIN copy, parts-count subline, busy layers
  - **Keep:** one template, unified section order, equipment types → models funnel
  - **Change:** Maria Figma clean hero (no bubble overlap) · drop parts-count badges · de-emphasize serial search · minimal copy
  - Report: `totem/instances/crop/reports/2026-06-09-1703-brand-hub-parity.md`

### UX2 · [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) — Parts diagrams landing · **Saturday** · @pedchenkooleh-coo

- [ ] **Mockup v3:** Popular Models rail → Browse by Type tiles → sticky toolbar → grouped catalog
- **John 2026-06-09:** all brands same diagram UI style (Ferris = NH); function non-negotiable (find model → diagram → buy part)
- Counts **sidebar only** (not on featured/type tiles) · related [#1702](https://github.com/CT-CROP/CROP-front/issues/1702)
- **Content blocker:** John — popular model list + dealer portal photos

## Track D — Saturday visuals (meeting 2026-06-09 · John priorities)

> These were out of active scope until the Jun 9 call. John: *"can't go live Saturday without"* in-house parts images.

- [ ] **D1 — In-house parts images in store** · @pedchenkooleh-coo · **Saturday blocker**
  - Proprietary parts photos for Ferris, Ventrac, Marcrest, McHale, Baron — currently not in dev scope
  - Oleg estimates ~1 day to roll into template
- [ ] **D2 — Category / equipment-type page imagery** · @pedchenkooleh-coo · **Saturday**
  - Drill-down pages (e.g. `/parts-diagrams/{brand}/tractors`) look neglected — generic icons, no model photos
  - Reference Maria Figma equipment panels; scrape brand marketing portals if needed · John to supply assets
- [ ] **D3 — `/brands` card grid** · @pedchenkooleh-coo · **Saturday**
  - Uniform grid; larger cards for top ~8 brands (NH, NH Construction, MF, Ferris, Ventrac, Marcrest, Coon, …)
  - Flagship equipment image per card; optional hover motion · smaller compact cards for minor brands later
  - Fix inconsistent NH vs Massey Ferguson sizing/positioning John called out
- [ ] **D4 — `/parts-diagrams` entry page** · @pedchenkooleh-coo + @appdev-v · 🟡 **partial** — [#1851](https://github.com/CT-CROP/CROP-front/pull/1851) + [#1844](https://github.com/CT-CROP/CROP-front/pull/1844) merged (cross-brand type root behind flag) · [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) landing v3 still open
  - Must not default to New Holland only; needs unified all-brands or category-first landing
  - Cross-brand categories (click "balers" → all brands with balers) — **needs category matrix (D6)**
- [ ] **D5 — Landing instructional cards** · group · 🟡 **homepage shipped** [#1842](https://github.com/CT-CROP/CROP-front/pull/1842) · site-wide expansion post-Saturday ([#1744](https://github.com/CT-CROP/CROP-front/issues/1744))
- [ ] **D6 — Category × brand matrix** · @John Stechyshyn (template) + group · **post-Saturday**
  - ~50 vendors × equipment categories checkbox matrix; unify naming (AI assist OK)
  - Drives cross-brand category search and correct per-brand category lists (e.g. NH Construction ≠ ag categories)
- [ ] **D7 — `/brands` ↔ clintontractor.net inventory backlinks** · group · **post-Saturday** (SEO)
- [ ] **D8 — Vendor image audit** · @pedchenkooleh-coo · replace outdated marketing images (John flagged old combine/harvester photos on NH ag page)

## Oleg lane — merged + closed

- [x] **#1528** [#1555](https://github.com/CT-CROP/CROP-front/pull/1555) · **#1530** [#1607](https://github.com/CT-CROP/CROP-front/pull/1607) · **#1548** [#1623](https://github.com/CT-CROP/CROP-front/pull/1623) · **#1547** [#1639](https://github.com/CT-CROP/CROP-front/pull/1639) · **#1549** [#1640](https://github.com/CT-CROP/CROP-front/pull/1640) · **#1576** [#1597](https://github.com/CT-CROP/CROP-front/pull/1597)
- [x] **#1532** parts counts · [#1675](https://github.com/CT-CROP/CROP-front/pull/1675) ✅ merged 2026-06-05 · **crop-dev PASS** 2026-06-08
- [x] **`/brands/loading.tsx`** · [#1682](https://github.com/CT-CROP/CROP-front/pull/1682) ✅ merged 2026-06-05
- [x] **#1515** home BrandStrip · [#1683](https://github.com/CT-CROP/CROP-front/pull/1683) ✅ merged 2026-06-05 · **crop-dev PASS** 2026-06-08

## Denis fix lane — merged + closed 2026-06-08

- [x] **#1671** → #1624 (B17) · **#1672** → #1608/#1616/#1618/#1619/#1621 (B9–B16) — merged 2026-06-05 · **crop-dev PASS** 2026-06-08

## QA program lane (2026-06-11 → 2026-06-12)

- [x] **#1753 / #1755 / #1757** · merged **PR [#1823](https://github.com/CT-CROP/CROP-front/pull/1823)** · story vitest CI + program doc
- [x] **#1756** page-landmarks · merged **PR [#1821](https://github.com/CT-CROP/CROP-front/pull/1821)** · **#1756 closed**
- [x] **#1754** wave-2 Chromatic · merged **PR [#1818](https://github.com/CT-CROP/CROP-front/pull/1818)** · UI Tests ✅ · issue open (~85% checklist)
- [x] **#1828** a11y CI gate · **closed** — fix on `dev` via [#1728](https://github.com/CT-CROP/CROP-front/pull/1728)
- [ ] **#1644** regression spine · **PR [#1859](https://github.com/CT-CROP/CROP-front/pull/1859)** open · `docs/ops/regression-testing-flow.md`
- [ ] **#1368** umbrella · open until #1644 merge + Vova stage→main sign-off

## Denis lane (2026-06-12)

- [x] **A3b Marcrest smoke** · ✅ PASS 2026-06-12 · #1538 closed · [crop-dev Marcrest](https://crop-dev.app/parts/brand/marcrest)
- [x] **#1814** homepage QA · ✅ PASS posted [#1812](https://github.com/CT-CROP/CROP-front/issues/1812#issuecomment-4692432704) · [crop-dev `/`](https://crop-dev.app/) · Vova sign-off pending
- [x] **#1832** CFP / table inventory · ✅ posted [#1832](https://github.com/CT-CROP/CROP-front/issues/1832#issuecomment-4692312469) · cross-post #1429/#1810 · Vova standard review pending
- [x] **#1852** Ferris *SM PDP crash · ✅ **#1854 merged** · crop-dev PASS [#1852 comment](https://github.com/CT-CROP/CROP-front/issues/1852#issuecomment-4692433439) · [CT-FRR-1650347SM](https://crop-dev.app/parts/CT-FRR-1650347SM) · close pending Vova
- [ ] **#1863** no card CFP (John/SEO) · **PR [#1867](https://github.com/CT-CROP/CROP-front/pull/1867)** MERGEABLE · pre-merge baseline: [Marcrest parts](https://crop-dev.app/parts/brand/marcrest/parts) (24× «Ask for a price»)
- [ ] **#1831** «Choose your brand» · **PR [#1869](https://github.com/CT-CROP/CROP-front/pull/1869)** MERGEABLE · [/brands](https://crop-dev.app/brands)
- [ ] **#1833** category search placeholder · **PR [#1870](https://github.com/CT-CROP/CROP-front/pull/1870)** MERGEABLE · [hay-tools](https://crop-dev.app/parts-diagrams?category=hay-tools)
- [ ] **#1811** Ferris 590 search hint · **PR [#1868](https://github.com/CT-CROP/CROP-front/pull/1868)** MERGEABLE · retargeted main→dev · [/parts-diagrams/ferris](https://crop-dev.app/parts-diagrams/ferris)
- [ ] **#1810** unified purchase CTA · **PR [#1866](https://github.com/CT-CROP/CROP-front/pull/1866)** MERGEABLE
- [ ] **#1853** diagram callout/BOM header · **PR [#1855](https://github.com/CT-CROP/CROP-front/pull/1855)** MERGEABLE · MAR-scoped dedupe per Vova review · [Marcrest assembly](https://crop-dev.app/parts-diagrams/marcrest/CE_2034/assembly)
- [ ] **#1644** regression spine · **PR [#1859](https://github.com/CT-CROP/CROP-front/pull/1859)** open
- [ ] **#1507 / A8** · code live (#1841/#1843) · [NH AG](https://crop-dev.app/parts/brand/new-holland) vs [Construction](https://crop-dev.app/parts/brand/new-holland/type/construction) · **John sign-off pending** · [#1857](https://github.com/CT-CROP/CROP-front/pull/1857) remainder
- [x] **#1703** · **PR [#1724](https://github.com/CT-CROP/CROP-front/pull/1724)** · ✅ **merged + crop-dev PASS** 2026-06-10 · #1703 closed
- [ ] **crop-dev full PASS refresh** · after #1867/#1855/#1866 merge · comment on [#1544](https://github.com/CT-CROP/CROP-front/issues/1544)

## Oleg lane — PRs merged 2026-06-10

> All 7 merged per midday report. crop-dev PASS confirmed for #1692/#1693/#1685/#1696/#1694/#1698.

| Issue | PR | What Oleg shipped | crop-dev |
|-------|-----|-------------------------------|--------|
| [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) | [#1693](https://github.com/CT-CROP/CROP-front/pull/1693) | **B10** GroupNav scroll-spy | ✅ PASS · #1609 closed |
| [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) | [#1695](https://github.com/CT-CROP/CROP-front/pull/1695) | **B11** BOM `imageUrl` plumbing | ✅ merged · #1613 open (hono data pending) |
| [#1664](https://github.com/CT-CROP/CROP-front/issues/1664) | [#1692](https://github.com/CT-CROP/CROP-front/pull/1692) | **Header Brands** dropdown + mobile | ✅ PASS · #1664 closed |
| [#1662](https://github.com/CT-CROP/CROP-front/issues/1662) | [#1685](https://github.com/CT-CROP/CROP-front/pull/1685) | **Branded cart SKU** | ✅ PASS · #1662 closed |
| [#1385](https://github.com/CT-CROP/CROP-front/issues/1385) | [#1696](https://github.com/CT-CROP/CROP-front/pull/1696) | **My Garage** saved parts tab | ✅ PASS · #1385 closed |
| [#1386](https://github.com/CT-CROP/CROP-front/issues/1386) | [#1694](https://github.com/CT-CROP/CROP-front/pull/1694) | **Garage** year-range validation | ✅ PASS · #1386 closed |
| [#1325](https://github.com/CT-CROP/CROP-front/issues/1325) | [#1698](https://github.com/CT-CROP/CROP-front/pull/1698) | **Catalog** slug-less `?equipmentModelKey=` | ✅ PASS · #1325 closed |

### Oleg — in flight (2026-06-12)

| Issue | PR | Status |
|-------|-----|--------|
| [#1737](https://github.com/CT-CROP/CROP-front/issues/1737) | — | Template simplification (hero cleanup) — no PR yet |
| [#1702](https://github.com/CT-CROP/CROP-front/issues/1702) | [#1728](https://github.com/CT-CROP/CROP-front/pull/1728) | Diagrams sticky toolbar — ✅ **merged 2026-06-10** |
| [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) | — | Diagrams landing v3 — no PR yet |
| D1/D2/D3 | — | Saturday visuals — no PR yet · blocked on John assets |
| [#1769](https://github.com/CT-CROP/CROP-front/issues/1769) | [#1827](https://github.com/CT-CROP/CROP-front/pull/1827) | ✅ **merged 2026-06-12** — all carried brands in What we stock · issue open until close |
| — | [#1830](https://github.com/CT-CROP/CROP-front/pull/1830) | ✅ **merged 2026-06-12** — brand quick chips on `/parts` |
| [#1849](https://github.com/CT-CROP/CROP-front/issues/1849) | [#1849](https://github.com/CT-CROP/CROP-front/pull/1849) | OPEN · Denis PASS · rebase on #1851 (Vova) |
| [#1317](https://github.com/CT-CROP/CROP-front/issues/1317) | [#1705](https://github.com/CT-CROP/CROP-front/pull/1705) | Edge probe retry + breadcrumb fail-open — WIP |

### Already on crop-dev (merged Fri — not in the 7-PR queue)

| Issue | PR | What | crop-dev |
|-------|-----|------|----------|
| [#1614](https://github.com/CT-CROP/CROP-front/issues/1614) | [#1684](https://github.com/CT-CROP/CROP-front/pull/1684) | **BOM cart UI** — checkboxes + Add to cart on Ferris/ARI assemblies (`cart: true`) | ✅ live — Denis PASS 2026-06-08 |
| [#1515](https://github.com/CT-CROP/CROP-front/issues/1515) | [#1683](https://github.com/CT-CROP/CROP-front/pull/1683) | Home **BrandStrip** (Also stocked) | ✅ live |
| [#1532](https://github.com/CT-CROP/CROP-front/issues/1532) | [#1675](https://github.com/CT-CROP/CROP-front/pull/1675) | `/brands` per-brand parts counts | ✅ live |

### Branch hygiene (@appdev-v before merge)

All 7 open PR branches are **behind `origin/dev`** (diverged while Fri queue landed). Rebase recommended; largest drift: **#1685** (~14 commits).

### In progress — not ready for QA

| Issue | PR | Status |
|-------|-----|--------|
| [#1317](https://github.com/CT-CROP/CROP-front/issues/1317) | [#1705](https://github.com/CT-CROP/CROP-front/pull/1705) | Oleg **in progress** — edge probe retry + breadcrumb fail-open · await "ready for review" |

## Release

**Runbook:** [`CROP-front/docs/ops/go-live-runbook.md`](../../../../CROP-front/docs/ops/go-live-runbook.md) · **Regression flow:** [`regression-testing-flow.md`](../../../../CROP-front/docs/ops/regression-testing-flow.md) (#1859 pending merge)

- [ ] **D0 — Production deploy** · @appdev-v · tracker [#1829](https://github.com/CT-CROP/CROP-front/issues/1829) · runbook on `dev` (#1826 merged) · blocked:
  - **Data:** ✅ #1538 closed · ✅ A3b PASS
  - **Merge queue:** ✅ morning wave (#1841–#1851, #1827, #1830, ps#406, **#1854**) · **Denis wave #1866–#1870 + #1855** pending Vova
  - **Saturday visuals:** D1–D3 + #1710 — no PRs yet
  - **Correctness:** A8 code live · **#1507 John OK** · #1852 PASS on crop-dev · #1853 after #1855 merge · **#1863/#1831/#1833/#1811** after Denis wave merge
  - **QA:** Denis crop-dev PASS refresh after merge wave · @appdev-v **375/1280** · #1814 Vova sign-off · #1832 standard sign-off
  - **Post-merge:** #1703 scope C hero (John sign-off)

---

## Definition of Done (per brand)

- [x] `/parts/brand/{slug}` → 200, brand name + TypeCards visible
- [x] `/parts-diagrams/{slug}` → 200, model grid (or graceful empty-state)
- [x] ≥1 assembly diagram loads end-to-end — **F/V/M/Marcrest ✓** (A3b PASS 2026-06-12)
- [ ] No JS console errors at 375px and 1280px ← @appdev-v before prod
- [x] No circular nav loop; brand crumb → brand page
- [ ] Ferris: ≥3 commercial-mower 59-series models clickable + loading ← A4 pending
- [x] Multibrand PN search returns correctly attributed results
- [x] @denistka smoke **F/V/M/Marcrest + fix lane + B18** ✓ on crop-dev · prod after D0 gates

---

## Progress

**Done (45+):** A1, A2, A3, **A3b**, A5, **A5b**, A7, B1–B10, B13–B18, B6, B7, C1–C3 · Denis fix lane · UX1 A+B · morning merge wave 2026-06-12 · **#1854** · QA program #1821/#1823/#1818/#1826 · **#1832 inventory** · **#1814 PASS**

**Issues closed 2026-06-12:** #1538 (Marcrest data)

**Critical path (updated 2026-06-12 EOD):** Vova merge **#1867/#1855/#1866** (+ #1869/#1870/#1868) → Denis **crop-dev PASS** → **#1507 John OK** · Oleg **D1–D3 + #1710** → Vova **375/1280** + **#1814** sign-off → **D0**

**@denistka next:** 1) **Post-merge QA** on [Marcrest parts](https://crop-dev.app/parts/brand/marcrest/parts), [/brands](https://crop-dev.app/brands), [hay-tools](https://crop-dev.app/parts-diagrams?category=hay-tools) @ 375+1280 · 2) Close **#1852** after Vova OK · 3) **#1832** close after standard sign-off · 4) **#1507** John preview · 5) **#1544** evening regression

**@pedchenkooleh-coo next:** **D1** parts images · **D2** category imagery · **D3** `/brands` grid · **#1710** diagrams landing · **#1737** hero simplify

**@appdev-v next:** merge **Denis wave #1866–#1870 + #1855** · **375/1280** · **#1814** + **#1832** sign-off · **D0** ([#1829](https://github.com/CT-CROP/CROP-front/issues/1829))

**@John Stechyshyn next:** marketing assets for Oleg · **NH split preview** [AG](https://crop-dev.app/parts/brand/new-holland) / [CE](https://crop-dev.app/parts/brand/new-holland/type/construction) · G12 sign-off · category matrix template (D6)

**Daniil:** ✅ #1538 closed · ps#406 merged · hono morning wave shipped

**EOD report:** `totem/instances/crop/reports/2026-06-12-EOD.md`

**✅ a11y CI gate closed (#1828):** fix on `dev` via #1728 · `e2e-a11y-smoke` green on #1841

## Afternoon QA — Denis filed 2026-06-08

| Issue | Area | Priority |
|-------|------|----------|
| [#1699](https://github.com/CT-CROP/CROP-front/issues/1699) | catalog OEM placeholders / missing photos (app-wide audit) | medium |
| [#1700](https://github.com/CT-CROP/CROP-front/issues/1700) | header search tooltip z-index | medium |
| [#1702](https://github.com/CT-CROP/CROP-front/issues/1702) | diagrams sticky toolbar backdrop + mobile jump scroll | medium |
| [#1703](https://github.com/CT-CROP/CROP-front/issues/1703) | brand hub — skeleton unify · **PR [#1724](https://github.com/CT-CROP/CROP-front/pull/1724)** · Denis PASS · hero simplification (scope C) per Jun 9 meeting | **high** |
| [#1704](https://github.com/CT-CROP/CROP-front/issues/1704) | toast anchor top-left | medium |
| [#1706](https://github.com/CT-CROP/CROP-front/issues/1706) | garage Add Equipment → 500 on crop-dev | **high** |
| [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) | diagrams landing — Popular Models + Browse by Type (mockup v3, John ✓) | **high** |

---

## Ops task detail (tasks with no `.pd` — kept here so nothing is lost)

### A5 — Marcrest `brand_vocabulary` DB row (@appdev-v)
```sql
INSERT INTO brand_vocabulary (code, name, is_carried)
VALUES ('MAR', 'Marcrest', true)
ON CONFLICT (code) DO UPDATE SET is_carried = true, name = 'Marcrest';
SELECT COUNT(*) AS n, product_line FROM models
WHERE product_line ILIKE '%marcrest%' OR product_line ILIKE 'MAR%' GROUP BY product_line;
```
Then `curl -X POST {hono-dev}/admin/cache/refresh -H "Authorization: Bearer $ADMIN_REFRESH_TOKEN"`.

### A6 — Ferris 59-series slug fix, only if A4 finds empty slugs (@appdev-v)
```sql
SELECT model_code, model_number, slug FROM models
WHERE product_line = 'FERRIS' AND model_number LIKE '59%' AND (slug IS NULL OR slug = '') LIMIT 20;
UPDATE models SET slug = LOWER(REGEXP_REPLACE(model_number, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE product_line = 'FERRIS' AND model_number LIKE '59%' AND (slug IS NULL OR slug = '');
```

### D0 — Production deploy (@appdev-v)
Preconditions: fix lane + Oleg ship ✓ on crop-dev · merge queue ✓ · **#1538 + A3b ✓**
Remaining: **D1–D3** Saturday visuals · **#1710** · **#1854/#1855** hotfixes · **#1507 John OK** · Denis **crop-dev PASS refresh** · **#1703 scope C** hero · @appdev-v **375/1280** · **#1829 D0** · QA **#1699–#1706** · **#1814** sign-off
1. Confirm with John. 2. `git tag v2.0.0-brands && git push origin v2.0.0-brands`.
3. Deploy `dev` → prod. 4. Spot-check all 4 brand hubs + diagrams. 5. `noindex,follow` on all 4. 6. Confirm to John.
