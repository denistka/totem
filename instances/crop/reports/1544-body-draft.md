## Impact

Four brands — **Ferris, Ventrac, McHale, Marcrest** — go from dev-only to production, each with a real brand page and a straight path to parts diagrams on desktop and mobile. Parts diagrams are the #1 customer-facing feature; this sprint is the funnel from "I have a Ferris mower" to the exact part.

- **Deadline:** 2026-06-06 (slipped) → **Saturday launch** (next prod window) · **Env:** `dev` → [crop-dev.app](https://crop-dev.app) → prod
- **Workflow:** dev opens PR → @denistka runs locally + PASS → @appdev-v final review + merge
- **Design sub-track:** umbrella [#1525](https://github.com/CT-CROP/CROP-front/issues/1525)

*Last synced: **2026-06-11 EOD** — **#1821/#1823/#1818/#1826/#1728 merged** · **#1828 closed** · **#1841 A8 PR CI green** · **Saturday NOT green***

**Mirror (detail):** `totem/instances/crop/sprints/06/ROADMAP.md`  
**Runbook:** `docs/ops/go-live-runbook.md` (merged #1826) · **D0 tracker:** [#1829](https://github.com/CT-CROP/CROP-front/issues/1829)  
**EOD report:** `totem/instances/crop/reports/2026-06-11-EOD.md`

### Saturday launch contract (meeting 2026-06-09)

**In scope for go-live:** complete catalog data on every page · functional parts diagrams (desktop + mobile) · three visual pillars:

1. **Parts store** — in-house proprietary parts images (Ferris, Ventrac, Marcrest, McHale, Baron) · [#1741](https://github.com/CT-CROP/CROP-front/issues/1741)
2. **Parts diagrams** — consistent UI across brands (Ferris = NH style); [#1710](https://github.com/CT-CROP/CROP-front/issues/1710)
3. **Equipment / category pages** — real model imagery · [#1742](https://github.com/CT-CROP/CROP-front/issues/1742)

**Deferred post-release:** brand-hub hero layout rethink (#1703 scope C / [#1737](https://github.com/CT-CROP/CROP-front/issues/1737)), cross-brand category matrix (D6), instructional cards (D5).

---

### Go / No-Go gates (flip only when all ✅)

| Gate | Issue | Owner | Status |
|------|-------|-------|--------|
| G1 Marcrest data | [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) | @DaniilDerkach | ❌ open |
| G2 A3b smoke | [#1541](https://github.com/CT-CROP/CROP-front/issues/1541) | @denistka | ❌ blocked G1 |
| G3 A8 NH Construction | [#1507](https://github.com/CT-CROP/CROP-front/issues/1507) | @denistka | 🟡 **PR [#1841](https://github.com/CT-CROP/CROP-front/pull/1841)** CI ✅ · merge + John OK |
| G4 D1 parts images | [#1741](https://github.com/CT-CROP/CROP-front/issues/1741) | @pedchenkooleh-coo | ❌ no PR |
| G5 D2 category imagery | [#1742](https://github.com/CT-CROP/CROP-front/issues/1742) | @pedchenkooleh-coo | ❌ no PR |
| G6 D3 `/brands` grid | [#1738](https://github.com/CT-CROP/CROP-front/issues/1738) | @pedchenkooleh-coo | ❌ no PR |
| G7 diagrams landing | [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) | @pedchenkooleh-coo | ❌ no PR |
| G8 merge queue | `dev` | @appdev-v | 🟡 QA wave + runbook merged · **#1841** pending |
| G9 crop-dev PASS | [#1541](https://github.com/CT-CROP/CROP-front/issues/1541) | @denistka | 🟡 F/V/M ✅ Marcrest ✗ · refresh after #1841 |
| G10 375/1280 sign-off | — | @appdev-v | ⏳ |
| G11 CI on `dev` | — | — | ✅ a11y [#1828](https://github.com/CT-CROP/CROP-front/issues/1828) closed · #1728 merged |
| G12 John stakeholder OK | — | John | ⏳ |

---

### Track A — Brand Activation

- [x] **A1** · hono [#332](https://github.com/CT-CROP/CROP-search-hono/pull/332) ✅
- [x] **A2** · [#1553](https://github.com/CT-CROP/CROP-front/pull/1553) ✅
- [x] **A3** · [#1541](https://github.com/CT-CROP/CROP-front/issues/1541) F/V/M smoke ✅ (issue open — partial)
- [ ] **A3b** · ❌ FAIL crop-dev — Marcrest diagrams empty; re-PASS after [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) · @denistka
- [ ] **A4** · Ferris 59-config → assemblies · @DaniilDerkach
- [x] **A5** · hub [#165](https://github.com/CT-CROP/CROP-hub/issues/165) — 170 MAR models
- [ ] **A5b** · [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) 🔍 **BLOCKER** · @DaniilDerkach
- [ ] **A6** · Ferris 59 slug fix if A4 needs it · @appdev-v
- [x] **A7** · [#1617](https://github.com/CT-CROP/CROP-front/issues/1617) ✅ closed
- [ ] **A8** · **NH Construction ≠ NH Agriculture** · [#1507](https://github.com/CT-CROP/CROP-front/issues/1507) · **PR [#1841](https://github.com/CT-CROP/CROP-front/pull/1841)** · merge + John preview OK

### Track B — Navigation & UX

- [x] **B1–B8, B9, B12–B18** ✅ merged · crop-dev PASS 2026-06-08–10
- [x] **B10** · [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) → [#1693](https://github.com/CT-CROP/CROP-front/pull/1693) ✅ merged 2026-06-10 · closed
- [ ] **B11** · [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) → [#1695](https://github.com/CT-CROP/CROP-front/pull/1695) · FE merged · **keep open** until hono `imageUrl`

### Track C — Multibrand Search

- [x] **C1–C3** ✅

### Design (#1525)

- [x] [#1533](https://github.com/CT-CROP/CROP-front/pull/1533), [#1537](https://github.com/CT-CROP/CROP-front/pull/1537), [#1543](https://github.com/CT-CROP/CROP-front/pull/1543) ✅

### Track UX

- [x] **UX1** · [#1703](https://github.com/CT-CROP/CROP-front/issues/1703) · **PR [#1724](https://github.com/CT-CROP/CROP-front/pull/1724)** ✅ merged 2026-06-10 · scope A+B · **#1703 closed**
  - [ ] **scope C** hero simplification · [#1737](https://github.com/CT-CROP/CROP-front/issues/1737) · post-Saturday / John sign-off
- [ ] **UX2** · [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) · **Saturday** · @pedchenkooleh-coo · John assets pending

### Track D — Saturday visuals

- [ ] **D1** · [#1741](https://github.com/CT-CROP/CROP-front/issues/1741) · @pedchenkooleh-coo · **Saturday blocker**
- [ ] **D2** · [#1742](https://github.com/CT-CROP/CROP-front/issues/1742) · @pedchenkooleh-coo
- [ ] **D3** · [#1738](https://github.com/CT-CROP/CROP-front/issues/1738) · @pedchenkooleh-coo
- [ ] **D4** · [#1739](https://github.com/CT-CROP/CROP-front/issues/1739) · @pedchenkooleh-coo + @appdev-v
- [ ] **D5–D8** · post-Saturday

### QA program lane (2026-06-11)

- [x] **#1753** story discovery · **#1755** story vitest · **#1757** program doc · merged **PR [#1823](https://github.com/CT-CROP/CROP-front/pull/1823)** 2026-06-11
- [x] **#1756** page-landmarks e2e · merged **PR [#1821](https://github.com/CT-CROP/CROP-front/pull/1821)** 2026-06-11 · **#1756 closed**
- [x] **#1754** wave-2 Chromatic · merged **PR [#1818](https://github.com/CT-CROP/CROP-front/pull/1818)** 2026-06-11 · UI Tests ✅ · umbrella issue open
- [x] **#1828** a11y CI gate · **closed** — fix on `dev` via [#1728](https://github.com/CT-CROP/CROP-front/pull/1728)

### Oleg lane — merged 2026-06-10 ✅

| Issue | PR | Shipped | Status |
|-------|-----|---------|--------|
| [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) | [#1693](https://github.com/CT-CROP/CROP-front/pull/1693) | GroupNav scroll-spy | ✅ closed |
| [#1664](https://github.com/CT-CROP/CROP-front/issues/1664) | [#1692](https://github.com/CT-CROP/CROP-front/pull/1692) | Header Brands dropdown | ✅ closed |
| [#1662](https://github.com/CT-CROP/CROP-front/issues/1662) | [#1685](https://github.com/CT-CROP/CROP-front/pull/1685) | Branded cart SKU | ✅ closed |
| [#1385](https://github.com/CT-CROP/CROP-front/issues/1385) | [#1696](https://github.com/CT-CROP/CROP-front/pull/1696) | My Garage saved parts | ✅ closed |
| [#1386](https://github.com/CT-CROP/CROP-front/issues/1386) | [#1694](https://github.com/CT-CROP/CROP-front/pull/1694) | Garage year-range | ✅ closed |
| [#1325](https://github.com/CT-CROP/CROP-front/issues/1325) | [#1698](https://github.com/CT-CROP/CROP-front/pull/1698) | `?equipmentModelKey=` | ✅ closed |
| [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) | [#1695](https://github.com/CT-CROP/CROP-front/pull/1695) | BOM `imageUrl` FE | open — hono null |
| [#1702](https://github.com/CT-CROP/CROP-front/issues/1702) | [#1728](https://github.com/CT-CROP/CROP-front/pull/1728) | Diagrams sticky toolbar | ✅ merged 2026-06-10 |

### Oleg — in flight

| Item | Status |
|------|--------|
| [#1737](https://github.com/CT-CROP/CROP-front/issues/1737) template simplification | no PR |
| D1–D3 + [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) | no PR · John assets |
| [#1827](https://github.com/CT-CROP/CROP-front/pull/1827) What we stock grid | open · #1769 · not Saturday scope |
| [#1830](https://github.com/CT-CROP/CROP-front/pull/1830) brand quick chips | open · catalog UX · not Saturday scope |
| [#1706](https://github.com/CT-CROP/CROP-front/issues/1706) garage 500 | open · @pedchenkooleh-coo |
| [#1699](https://github.com/CT-CROP/CROP-front/issues/1699) catalog placeholders | open · @pedchenkooleh-coo |
| [#1317](https://github.com/CT-CROP/CROP-front/issues/1317)→[#1705](https://github.com/CT-CROP/CROP-front/pull/1705) | WIP |

### Denis lane (2026-06-11)

- [ ] **#1841** merge · **#1507** A8 NH AG/CE split · John preview OK
- [ ] **A3b** Marcrest smoke · after #1538
- [ ] **#1814** homepage visual pass · PASS posted · Vova sign-off
- [x] **#1703** / #1724 · merged 2026-06-10
- [x] QA program wave · #1821/#1823/#1818 · merged 2026-06-11

### Release

- [ ] **D0** · [#1829](https://github.com/CT-CROP/CROP-front/issues/1829) · @appdev-v · runbook on `dev` (#1826 merged)

---

### QA — page status (crop-dev.app · 2026-06-11 EOD)

| Page | Status |
|------|--------|
| `/brands` | ✅ counts live · **D3** redesign pending |
| `/` home + BrandStrip | ✅ #1683 live · [#1814](https://github.com/CT-CROP/CROP-front/issues/1814) final pass pending |
| `/parts/brand/{ferris,ventrac,mchale}` | ✅ hub parity #1724 |
| `/parts/brand/marcrest` | ⚠️ hub OK · diagrams empty #1538 |
| `/parts/brand/new-holland` + Construction tile | 🟡 **#1841** preview — AG/CE split after merge |
| `/parts-diagrams/marcrest` | ❌ empty — #1538 |
| `/parts-diagrams/ferris` | ⚠️ functional · #1710 redesign pending |
| `/parts-diagrams` root | 🟡 AG-only grid after **#1841** merge |
| `/account/garage` | ❌ Add Equipment 500 — [#1706](https://github.com/CT-CROP/CROP-front/issues/1706) |
| Assembly BOM cart | ✅ #1684 |

---

### Definition of Done (per brand)

- [x] `/parts/brand/{slug}` → 200, brand name + TypeCards
- [x] `/parts-diagrams/{slug}` → 200, model grid
- [x] ≥1 assembly E2E — **F/V/M ✅** · **Marcrest ✗**
- [ ] No JS console errors 375px + 1280px ← @appdev-v
- [x] No circular nav loop
- [ ] Ferris 59-series models ← A4 pending
- [x] Multibrand PN search attributed correctly
- [x] Denis smoke F/V/M + fix lane ✅ · **Marcrest A3b ✗**

---

### Critical path

**#1841** merge → **#1507** John OK → **#1538** → A3b → Oleg **D1–D3 + #1710** (John assets) → Vova **375/1280** → **#1829** D0

**@denistka:** merge #1841 → A3b after #1538 → crop-dev PASS refresh → #1814  
**@pedchenkooleh-coo:** D1–D3 · #1710 · #1737 · #1706  
**@DaniilDerkach:** #1538  
**@appdev-v:** merge #1841 · 375/1280 · #1829 D0  
**@John:** assets #1741/#1813 · NH split preview OK · G12 sign-off

**Issues closed 2026-06-11:** #1753, #1755, #1756, #1757, #1758, #1499, #1803, #1828  
**Merged 2026-06-11:** #1821, #1823, #1818, #1826 · open **#1841**
