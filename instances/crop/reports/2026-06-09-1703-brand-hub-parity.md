# Brand Hub Parity — Work Report (#1703)

**Date:** 2026-06-09  
**Author:** @denistka  
**Issue:** [#1703](https://github.com/CT-CROP/CROP-front/issues/1703)  
**PR:** [#1724](https://github.com/CT-CROP/CROP-front/pull/1724)  
**Branch:** `feat/ct-1703-brand-hub-parity` · HEAD `a17d2fc8`  
**Status:** Open — rebased on `dev` (`f401b1b8`), vitest green, localhost QA PASS

---

## Goal

Unify V2 brand hub pages (New Holland + Ferris / Ventrac / McHale / Marcrest) through **one render path** and a **shared component stack** so every brand shares the same section order and glass design system. **Thin ≠ different layout** — thin means less editorial content, not a separate page structure.

Agreed with @appdev-v in the 2026-06-08 UX meeting; implementation split per [Vova's review](https://github.com/CT-CROP/CROP-front/issues/1703#issuecomment-4656953549) (scopes A / B / C).

---

## Work Completed

### Scope A — behaviour-preserving refactor

| Artifact | Result |
|----------|--------|
| `page.tsx` | Removed NH fork (`NhLanding` vs thin template). All slugs → `BrandHubPage` |
| `BrandHubPage` | Single entry point for every brand |
| `fetch-brand-hub-data.ts` | Data layer extracted from the page |
| `HubFeaturedRail` | Replaces `NhPopularParts` + `ThinFeaturedRail` |
| `HubMaintenanceGrid` / `HubDealerStory` | Extracted to `features/brands/` with shared glass tokens |
| `NhJsonLd` | Extracted; NH SEO invariants preserved |
| `NhLanding` | Thin adapter only (backward compat + tests) |

### Scope B — per-brand editorial config

| Artifact | Result |
|----------|--------|
| `lib/equipment/brand-hub-config/` | Configs for NH, Ferris, Ventrac, McHale, Marcrest |
| `resolveBrandHubTypes()` | Merges live API types with authored fallback cards |
| NH data | Moved to `new-holland-data.ts` (lib layer) |

### Fix — dev 404 on `/parts/brand/*`

Circular import between `index.ts` and `resolve-brand-hub-types.ts` resolved by splitting `configs.ts`.

### Tests & QA artifacts

- **Vitest:** 204 tests in the brand-hub suite (PR scope: 60+)
- **Regression guards:** Ferris `requirePhotos=false` (#1547), NH JSON-LD byte-stability, scope B page-render tests
- **Screenshot script:** `scripts/qa-1703-screenshots.mjs` → `qa-screenshots/1703-brand-hub-parity/` + `audit.json`

### Commits in PR

1. `refactor(brands): unify brand hub render path for #1703`
2. `feat(brands): per-brand hub editorial config for #1703 scope B`
3. `fix(brands): break brand-hub-config circular import for dev 404`

---

## Current Section State (localhost audit)

From `qa-screenshots/1703-brand-hub-parity/audit.json` at **375px** and **1280px**:

| Section | NH | Ferris | Ventrac | McHale | Marcrest |
|---------|:--:|:------:|:-------:|:------:|:--------:|
| Best Sellers / Featured Parts | Best Sellers | Featured Parts | — | — | — |
| Equipment Types | ✅ | ✅ | ✅ (authored) | ✅ (authored) | ✅ (skeleton) |
| Popular Maintenance | ✅ | ✅ | — | — | — |
| Dealer story (About / at CT) | About CT (long) | Ferris at CT | Ventrac at CT | McHale at CT | Marcrest at CT |
| Browse all equipment models | ✅ | ✅ | ✅ | ✅ | ✅ |
| Serial lookup | ✅ (NH only) | — | — | — | — |
| Shop {brand} parts CTA | ✅ | ✅ | — | — | — |

**Skeleton is unified** — section order matches across brands. Differences are in **content** (data, photos, editorial copy), not layout.

---

## What Blocks Full Page Parity

### A. Intentional product gates (not bugs)

These differences are **by design** and are outside the #1703 code scope:

| Gate | Brands | Reason |
|------|--------|--------|
| **Serial lookup** | NH only | `brandSupportsSerialLookup` — CNH/NH capability today |
| **Shop {brand} parts CTA** | NH + Ferris | `hasSearchCatalogHub` — only brands with a real shoppable catalog |
| **Best Sellers vs Featured Parts** | NH vs others | NH uses photo-filtered curated rail; thin brands keep imageless cards (#1547) |
| **SEO / JSON-LD** | NH rich vs thin generic | NH is indexable with bespoke `NhJsonLd`; F/V/M/M are `noindex` |
| **Dealer story length** | NH long-form vs thin 1–2 paragraphs | Editorial density, not layout |

### B. API / backend data (main density blockers)

| Blocker | Issue | Owner | Impact |
|---------|-------|-------|--------|
| **Marcrest equipment types empty** | [#1538](https://github.com/CT-CROP/CROP-front/issues/1538) | Daniil | Hono: `GET /api/brand/marcrest/equipment-types` → `types: []`. Front shows 3 skeleton tiles; links may 404 until live data lands. A3b smoke FAIL |
| **McHale / Ventrac — no live equipment types** | — (data gap) | Daniil / data | Authored fallback (4 tiles) uses placeholder slugs (`tractors`, `balers`, …), not live taxonomy |
| **Featured Parts rail empty** | data | API / catalog | Ventrac / McHale / Marcrest: parts preview returns 0 → rail hidden (honest gating) |
| **Ferris `partsCount = 0` in summary** | known | hono `/api/brands/summary` | Identity card omits "X parts available" even though the brand catalog has parts |
| **Ferris 59-config codes** | A4 (no GH issue yet) | Daniil | Search / diagrams parity, not hub layout |

### C. Photography & visual density

| Problem | Issue | Status |
|---------|-------|--------|
| **Ferris Featured Parts — "No image"** | [#1547](https://github.com/CT-CROP/CROP-front/issues/1547) (closed as intended) | Catalog has no product photos; PartCard uses honest fallback |
| **Equipment TypeCard photos** | [#1613](https://github.com/CT-CROP/CROP-front/issues/1613) → #1695 | `BRAND_TYPE_IMAGE_MANIFEST`: F/V/M = empty sets; only NH `balers` has a photo. Marcrest has no `equipmentImageDir` |
| **BOM thumbnails on assembly pages** | #1613 | Hono does not return `imageUrl` in brand assembly BOM — separate from hub, but affects overall parity perception |
| **John dealer portal photos** | [#1710](https://github.com/CT-CROP/CROP-front/issues/1710) | Content blocker for diagrams landing redesign |

### D. Editorial content (scope B partial)

| Delivered | Still missing for NH-level density |
|-----------|-------------------------------------|
| Authored equipment cards (F/V/M/Marcrest) | Real model counts, working type-page links |
| Ferris maintenance grid (4 categories) | V/M/Marcrest — no authored maintenance blocks (product call: thin by design?) |
| Thin dealer story (1 paragraph) | NH long-form "About Clinton Tractor" (~3 paragraphs) |
| Featured rail subtitle in config | Rail does not render without parts data |

### E. Process / merge blockers

| Step | Status |
|------|--------|
| Merge PR #1724 → `dev` | ⏳ open |
| crop-dev PASS @ 375 + 1280 (all 5 hubs) | ⏳ after merge |
| @appdev-v visual sign-off | ⏳ |
| Close #1703 | ❌ not until Vova sign-off + Marcrest data path is clear |

---

## Code vs Data vs Content

```
✅ Done (#1703 PR)          ⏳ Blocked by data           ⏳ Blocked by media        ✓ By design
─────────────────          ───────────────────          ──────────────────        ─────────────
Unified render path        #1538 Marcrest hono types      TypeCard photo manifest   Serial lookup NH only
Shared components          McHale/Ventrac live taxonomy   Ferris part images        Shop CTA NH+Ferris only
brand-hub-config           Parts preview empty V/M/M      #1613 BOM imageUrl        Thin editorial copy
Authored fallback tiles    Ferris summary partsCount=0
```

---

## Recommended Next Steps

1. **Merge #1724** → crop-dev PASS (375/1280, all 5 hubs) → @appdev-v sign-off  
2. **#1538** (Daniil) — Marcrest live equipment types → re-smoke A3b; skeleton tiles become real  
3. **Product call:** maintenance grids for V/M/Marcrest, or is thin = equipment types + dealer story enough?  
4. **Images track:** populate `BRAND_TYPE_IMAGE_MANIFEST` + hono `imageUrl` (#1613) — separate sprint slice  
5. **Do not close #1703** until Vova sign-off; consider relabel `bug` → `refactor` + `content` (per Vova)

---

## One-Line Summary

**Code unification (#1703 scopes A+B) is complete** — all brands render through one template with shared components. **Full visual parity with NH** is blocked not by front layout but by **missing backend data** (equipment types, parts preview, photos) and **product decisions** (thin density, capability gates). The front skeleton is ready to accept live data without another refactor.
