# QA improvements backlog (not filed to GitHub until Denis approves)

> **Bugs** → GitHub immediately + mirrored in [#1544](https://github.com/CT-CROP/CROP-front/issues/1544) **issue body** (team tracker).  
> **Ideas here** → polish / parity / UX — promote to GH only after Denis ✅.  
> **This file** = local detail / page notes; keep in sync when #1544 body or comments change.

**Last synced:** 2026-06-05 afternoon · [#1544](https://github.com/CT-CROP/CROP-front/issues/1544) comment synced · **#1675 QA PASS + approved** · **#1671 + #1672 QA PASS** · afternoon report: `totem/instances/crop/reports/2026-06-05-afternoon.md`

## Browser (single tab)

| Field | Value |
|-------|--------|
| **viewId** | `3d333c` (refresh if tab recreated) |
| **Viewport width** | **Denis** — agent does not force resize. |
| **On bug filing** | Agent snapshots `innerWidth×innerHeight` + URL from the live tab and puts both in the GitHub issue body. |

---

## Open bugs (compiled from #1544 + issues)

| Issue | Track | Page / area | Opened by | Status | Viewport |
|-------|-------|-------------|-----------|--------|----------|
| [#1608](https://github.com/CT-CROP/CROP-front/issues/1608) | B9 | `/parts-diagrams/{brand}` toolbar | **@denistka** | **PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** · **QA PASS** · merge pending | 987×1004 |
| [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) | B10 | GroupNav scroll-spy + hash + bottom section | **@denistka** | OPEN · `qa` | mchale 1291×1004 |
| [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) | B11 | Assembly BOM thumbnails (ARI) | **@denistka** | OPEN · `qa` | mchale MCH-182333 |
| [#1614](https://github.com/CT-CROP/CROP-front/issues/1614) | B12 | Assembly BOM add-to-cart | **@denistka** | OPEN · `qa` | ferris 1428×1004 |
| [#1616](https://github.com/CT-CROP/CROP-front/issues/1616) | B13 | GroupNav scroll active into view | **@denistka** | **PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** · **QA PASS** · merge pending | ferris 1428×1004 |
| [#1617](https://github.com/CT-CROP/CROP-front/issues/1617) | A7 | `/brands` → skip `/parts/brand` hub | **@denistka** | ✅ **CLOSED** 2026-06-05 · [#1670](https://github.com/CT-CROP/CROP-front/pull/1670) | 1428×1004 |
| [#1618](https://github.com/CT-CROP/CROP-front/issues/1618) | B14 | `/parts` toasts block cart | **@denistka** | **PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** · **QA PASS** · merge pending | 1428×1004 |
| [#1619](https://github.com/CT-CROP/CROP-front/issues/1619) | B15 | `/parts` “In order” no remove | **@denistka** | **PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** · **QA PASS** · merge pending | 1428×1004 |
| [#1621](https://github.com/CT-CROP/CROP-front/issues/1621) | B16 | `/checkout/shipping` address dialog | **@denistka** | **PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** · **QA PASS** · merge pending | 1428×1004 |
| [#1624](https://github.com/CT-CROP/CROP-front/issues/1624) | B17 | `/parts` header ↔ toolbar gap | **@denistka** | **PR [#1671](https://github.com/CT-CROP/CROP-front/pull/1671)** · **QA PASS** · CI green · merge pending | 960×1004 |
| [#1622](https://github.com/CT-CROP/CROP-front/issues/1622) | QT1 | **Owner routing** | **@denistka** | ✅ **CLOSED** 2026-06-05 | — |

### Withdrawn / closed (per Denis)

| Issue | Note |
|-------|------|
| [#1603](https://github.com/CT-CROP/CROP-front/issues/1603) | CLOSED — Call FAB overlap `/brands` — not valid |
| [#1606](https://github.com/CT-CROP/CROP-front/issues/1606) | CLOSED — translucent tiles — not valid |

### Sprint blockers (not QA-filed; from #1544 thread)

- **#1538** — Marcrest models → live `/parts-diagrams/marcrest` (A3b FAIL; Vova: demo-priority #1)
- **#1576** — B6 — ✅ **CLOSED** 2026-06-05
- **#1530** — B7 — ✅ **CLOSED** 2026-06-05

### Merged PRs — issues closed (2026-06-05)

| PR | Issue | Status |
|----|-------|--------|
| [#1607](https://github.com/CT-CROP/CROP-front/pull/1607) | [#1530](https://github.com/CT-CROP/CROP-front/issues/1530) B7 | ✅ **CLOSED** |
| [#1623](https://github.com/CT-CROP/CROP-front/pull/1623) | [#1548](https://github.com/CT-CROP/CROP-front/issues/1548) | ✅ **CLOSED** |
| [#1639](https://github.com/CT-CROP/CROP-front/pull/1639) | [#1547](https://github.com/CT-CROP/CROP-front/issues/1547) | ✅ **CLOSED** |
| [#1640](https://github.com/CT-CROP/CROP-front/pull/1640) | [#1549](https://github.com/CT-CROP/CROP-front/issues/1549) | ✅ **CLOSED** |
| [#1555](https://github.com/CT-CROP/CROP-front/pull/1555) | [#1528](https://github.com/CT-CROP/CROP-front/issues/1528) | ✅ **CLOSED** |
| [#1597](https://github.com/CT-CROP/CROP-front/pull/1597) | [#1576](https://github.com/CT-CROP/CROP-front/issues/1576) B6 | ✅ **CLOSED** |

### #1622 owner routing (2026-06-05, @appdev-v)

| Owner | Issues |
|-------|--------|
| **@denistka** (fix) | #1608, #1616, #1618, #1619, #1621 → **PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** · #1624 → **PR [#1671](https://github.com/CT-CROP/CROP-front/pull/1671)** QA PASS |
| **@pedchenkooleh-coo** (FE) | #1609, #1613, #1614, #1617 |

---

## Page queue (NH parity pass)

| # | URL | Status | Bugs / notes |
|---|-----|--------|----------------|
| 1 | `/brands` | **done** | No open QA bugs (#1603/#1606 withdrawn) |
| — | `/parts` (catalog) | **fix PRs open** | [#1618](https://github.com/CT-CROP/CROP-front/issues/1618), [#1619](https://github.com/CT-CROP/CROP-front/issues/1619), [#1624](https://github.com/CT-CROP/CROP-front/issues/1624) → [#1671](https://github.com/CT-CROP/CROP-front/pull/1671) + [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) |
| — | `/checkout/shipping` | **fix PR open** | [#1621](https://github.com/CT-CROP/CROP-front/issues/1621) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) |
| 2 | `/parts/brand/new-holland` | **reference** | NH baseline — pending deep pass |
| 2b | `/parts/brand/*` (F/V/M) | parity | [#1617](https://github.com/CT-CROP/CROP-front/issues/1617) hub routing |
| 3 | `/parts-diagrams/new-holland` | pending | — |
| 4 | `/parts/brand/ferris` | pending | — |
| 5 | `/parts-diagrams/ferris` | in progress | [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) open · [#1616](https://github.com/CT-CROP/CROP-front/issues/1616) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) |
| 6 | `/parts-diagrams/mchale` | in progress | [#1608](https://github.com/CT-CROP/CROP-front/issues/1608) → [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) · [#1609](https://github.com/CT-CROP/CROP-front/issues/1609) open |
| 7 | mchale assembly `MCH-182333` | filed | [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) |
| 8 | ferris assembly `d0f174e4-…` | filed | [#1614](https://github.com/CT-CROP/CROP-front/issues/1614) |
| … | ventrac / marcrest hubs+diagrams | pending | Marcrest blocked on #1538 |

**Suggested next (queue):** 1) ping @appdev-v merge [#1671](https://github.com/CT-CROP/CROP-front/pull/1671) + [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) · 2) crop-dev PASS B9–B17 after deploy · 3) NH reference pass · 4) A3b after #1538

---

## Page 1 — `/brands`

**Env:** crop-dev.app · 1280 + 375 · 2026-06-04

### Bugs

_None — #1603 and #1606 withdrawn (not valid per Denis)._

### PASS

- PromoContactCard full width (B8) — re-verified post #1589
- No horizontal overflow
- All 6 tiles + contact card render 200
- NH wide flagship layout intentional (photo + logo split)

### Improvements backlog (review before GH)

1. ~~**NH parity — entry URLs**~~ → filed as [#1617](https://github.com/CT-CROP/CROP-front/issues/1617).
2. **Badge semantics:** Marcrest grey “Diagrams” dot vs red on Ferris/Ventrac — brand accent `#414042`; optional legend.
3. **NH wide tile seam:** Equipment photo `border-l` abutment — polish radius/overlap.
4. **DarkHero depth:** `shadow-lg` on hero atop mesh — low priority.

---

## Page — `/parts` (catalog)

**Env:** 1428×1004 · 2026-06-04

### Bugs filed

- [#1618](https://github.com/CT-CROP/CROP-front/issues/1618) — rapid add toasts overlap header cart → **fix PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)**
- [#1619](https://github.com/CT-CROP/CROP-front/issues/1619) — green “In order” cannot remove → **fix PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)**
- [#1624](https://github.com/CT-CROP/CROP-front/issues/1624) — gap header ↔ toolbar · **PR [#1671](https://github.com/CT-CROP/CROP-front/pull/1671)** · **QA PASS** comment · localhost @960

### Improvements

_None queued locally._

---

## Page — `/checkout/shipping`

**Env:** 1428×1004 · 2026-06-04

### Bugs filed

- [#1621](https://github.com/CT-CROP/CROP-front/issues/1621) — Address validation dialog UX → **fix PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672)** (Dialog + backdrop dismiss + z-index)

### Improvements

_None queued locally._

---

<!-- Denis: comment ✅ on improvement items to promote to GH. Page queue “next” = your call. -->
