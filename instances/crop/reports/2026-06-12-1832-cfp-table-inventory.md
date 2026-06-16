# #1832 — Call-for-pricing / table column inventory

**Date:** 2026-06-12 · **Env:** `dev` HEAD code audit + crop-dev route matrix  
**Author:** Denis · **Issue:** [CT-CROP/CROP-front#1832](https://github.com/CT-CROP/CROP-front/issues/1832)

---

## Method

- Traced every customer-facing part/BOM/listing surface in `CROP-front` on `dev` (not a re-spec of #1429 implementation).
- Column order and CFP copy taken from source (`bom-table.tsx`, `brand-capabilities.ts`, `parts-list-table.tsx`, catalog cards, PDP).
- crop-dev routes listed for spot-check at 375px + 1280px.

---

## Inventory table (surface × columns × CFP)

| # | Surface | Route / entry | Brands | Columns (order) | No-price / CFP treatment | Mobile notes |
|---|---------|---------------|--------|-----------------|---------------------------|--------------|
| A | **Assembly BOM table** | `/parts-diagrams/{brand}/…` → assembly viewer | **NH AG + NH CE** (NHL) | Ref · Part Number* · Description · Qty · **Availability** · Price · Actions† | `pricing: full` → muted **"Check Price"** (Title Case) | `<lg` → `MobileDiagramView` sheet; PN col hidden `<md` |
| B | **Assembly BOM table** | same | **Ferris, Ventrac, McHale** (FRR/VNT/MCH) | Ref · Part Number* · Description · Qty · Price · Actions† | `pricing: status-based` → **`call_for_pricing`:** tel link **"Call for pricing"** → +1 (315) 853-6151; else muted **"Check price"** (sentence case) | same mobile sheet; no Availability col |
| C | **Assembly BOM table** | same | **Marcrest** (MAR) | Ref · Part Number* · Description · Qty · Price | same status-based CFP as B; **no Actions** (`cart: false`, hub#136 display-only) | same; no cart checkboxes |
| D | **Global catalog — list table** | `/parts` view mode **List** | All brands in search index | Thumb · PN · Description · Fits‡ · Brand§ · Stock§ · Unit§ · Qty · Line · Add | Unit/Line: **"—"**; add tooltip **"Quote-only"**; toast **"This part is quote-only"** | Fits/Brand/Unit/Stock hide at lg/md/sm breakpoints |
| E | **Global catalog — card grid** | `/parts` compact / grid | All | Card: image · title · PN · price slot · add CTA | **CardPrice:** **"Ask for a price"**; **AddToCart:** **"Ask for a price"**; compact badge **"Quote"** | Same components; compact = denser grid |
| F | **Brand parts store grid** | `/parts/brand/{slug}/parts` | F/V/M/McH/NH/MAR | Same as E (`BrandPartsGrid` → `ProductCard`) | Same as E; Marcrest rows typically all unpriced | 260px min card width |
| G | **PDP purchase panel** | `/parts/CT-{CODE}-{PN}` | All | Price block + primary CTA (not a table) | **"Ask for a price"** → quote flow (#782 — intentional, out of #1863 card scope) | `MobilePurchaseBar` mirrors PDP CTA |
| H | **PDP related-parts rail** | PDP → "Bought together" | All | Horizontal cards | Pill **"Ask for a price"** when no list price | Horizontal scroll |
| I | **Diagram mobile rail / callout pin** | Assembly viewer mobile | Per brand diagram | Rail row / pin popover | **"Ask for a price"** fallback | `<lg` only |
| J | **Brand hub `PartCard`** (Storybook / glass surfaces) | Not wired on live hub grid today | — | Image · PN · title · price | **"Call for pricing"** (primary link style) | N/A — component exists, not primary catalog path |

\* Part Number header hidden below `md`.  
† Actions = sticky cart column (checkbox + add); no header label.  
‡ Fits often **"—"** + `?` (fitmentCount not on list API).  
§ Responsive hide breakpoints.

---

## CFP wording variants (current)

| Copy | Where | Interactive? |
|------|-------|----------------|
| **Call for pricing** | BOM status-based (`call_for_pricing`); brand `PartCard` | tel: link on BOM |
| **Check price** / **Check Price** | BOM status-based fallback; NH `full` pricing | Text only |
| **Ask for a price** | Catalog cards, PDP, diagram rail/callout, related parts | PDP quote / card defers to PDP |
| **Quote** / **Quote-only** | Compact card badge; list-table add tooltip | Toast → open PDP |
| **—** (em dash) | List table Unit/Line when no price | Silent |

---

## Per-brand BOM capability matrix (code)

| Brand | Vendor | Col count | Availability | Cart | Pricing mode |
|-------|--------|-----------|--------------|------|--------------|
| NH AG / NH CE | NHL | 7 | ✅ | ✅ | `full` |
| Ferris | FRR | 6 | ❌ | ✅ | `status-based` |
| Ventrac | VNT | 6 | ❌ | ✅ | `status-based` |
| McHale | MCH | 6 | ❌ | ✅ | `status-based` (ellipse callout markers) |
| Marcrest | MAR | 5 | ❌ | ❌ | `status-based` |

Source: `features/assemblies/brand-capabilities.ts`, `bom-table.tsx`.

---

## crop-dev spot-check routes

| Brand | BOM / diagram | Store grid |
|-------|---------------|------------|
| NH AG | `/parts-diagrams/new-holland-agriculture` | `/parts/brand/new-holland/parts` |
| NH CE | `/parts-diagrams/new-holland-construction` | (shared NHL store) |
| Ferris | `/parts-diagrams/ferris` | `/parts/brand/ferris/parts` |
| Ventrac | `/parts-diagrams/ventrac` | `/parts/brand/ventrac/parts` |
| McHale | `/parts-diagrams/mchale` | `/parts/brand/mchale/parts` |
| Marcrest | `/parts-diagrams/marcrest` | `/parts/brand/marcrest/parts` |
| Cross-brand list | `/parts` → toggle List + Compact | — |

---

## Proposed ONE standard (for Vova / John review)

### BOM / diagram table (feeds #1429 — do not implement here)

**Column set (when data exists):**

1. Ref  
2. Part Number (link when `pdpLinks`)  
3. Description  
4. Qty  
5. Availability *(only when live DIS/orderability wired — NHL today)*  
6. Price  
7. Actions *(cart column when brand is purchasable)*  

**CFP in Price column:**

| Condition | Treatment |
|-----------|-----------|
| List price present | Formatted currency |
| `publishStatus === call_for_pricing` | **"Call for pricing"** → `tel:+13158536151` (single wording, Title Case) |
| No price, other status | Muted **"Check price"** (one casing — pick sentence or title, not both) |
| Marcrest display-only | Same Price CFP; Actions column omitted until hub#136 |

### Catalog cards / list rows (feeds #1810 / #1863)

| Surface | Proposed CFP |
|---------|--------------|
| Cards / compact grid / brand store | **No price text on card** — title + PN only; tap through to PDP (#1863 / John 6/11) |
| List table Unit column | **"—"** OR align with BOM muted "Check price" — **open question** |
| List table add affordance | Disabled cart + tooltip **"Quote-only"** (keep) |
| PDP | Keep **"Ask for a price"** quote CTA (#782) |

### Diagram mobile rail / callout

Align with card standard post-#1863: **show formatted price when present; omit CFP string on rail** (link to row/PDP). *Or* match PDP "Ask for a price" — **open question**.

---

## Open questions

1. **NH "Check Price" vs brand "Call for pricing"** — same semantic slot, different copy and interaction (text vs tel). Unify to tel CTA everywhere, or keep NH text-only until DIS parity?
2. **"Ask for a price" vs "Call for pricing"** — PDP/card/BOM use three phrases today. John wants one customer-facing voice — recommend **PDP = "Ask for a price"** (quote form), **BOM/list = "Call for pricing"** (tel) OR single phrase everywhere.
3. **List table silent "—"** vs explicit CFP in Unit column — customers may not discover quote path without card CFP removed (#1863).
4. **Marcrest Actions column** — intentionally absent; re-enable with hub#136 pricing flip.
5. **Availability on ARI brands** — column absent until hono ships DIS; standard includes slot but gated by capability flag (already the #1429 model).

---

## Cross-links

- BOM column convergence: [#1429](https://github.com/CT-CROP/CROP-front/issues/1429)
- CTA / card copy axis: [#1810](https://github.com/CT-CROP/CROP-front/issues/1810)
- Card CFP removal (pending merge): [#1863](https://github.com/CT-CROP/CROP-front/issues/1863) / PR [#1867](https://github.com/CT-CROP/CROP-front/pull/1867)

---

## Suggested follow-up implementation issues (after standard sign-off)

1. Unify BOM Price cell casing + CFP component (`Check price` vs `Check Price`).
2. Apply #1863 card silence to diagram rail + related-parts rail (if not in #1867 scope).
3. List table Unit column policy (dash vs muted CFP).
4. Marcrest cart column when hub#136 lands.
5. ARI Availability column when DIS data exists.
