# Code Findings — docs vs actual code (verified 2026-06-03)

The `v2-docs/` plan and the S06 `.pd` files were written from the 2026-06-02 meeting,
before the code was inspected. Reading the live source surfaced **five material
discrepancies** that change task scope and ownership. Each task file references the
relevant finding. Fix the plan, not the code, where the doc was simply wrong.

---

## F1 — Ferris brand code is `FRR`, not `FER` ❗

Every doc (`v2-sprint.md`, `v2-team-assignments.md`, DAN-1/DAN-2) says to use **`FER`**
for Ferris. The live code uses **`FRR`** everywhere:

- `CROP-search-hono/src/lib/vocabulary-cache.ts:139` → `{ code: "FRR", canonicalName: "Ferris", ... }`
- `CROP-front/lib/equipment/brand-registry.ts:104` → `vendorCode: "FRR"` (comment: "FRR is the canonical Ferris code; FER legacy")
- `manufacturer-config.test.ts:81` pins `AVAILABLE_CODES = ["NHL","FRR","VNT","MCH"]`

`FER` exists only as a lowercase **alias** (`aliases: ["fer"]`). The doc's proposed unit
test `getBrandDisplayName("FER") === "Ferris"` would **FAIL** — `getBrandDisplayName`
falls back to the code itself for an unknown code, returning `"FER"`.

➡️ **Use `FRR` in all tasks and tests.** (hono already tests `FRR` — see F5.)

---

## F2 — Marcrest is already in the front registry, pinned `available: false` ❗❗

OLG-1 / A2 assumes `carriedIdentity("marcrest")` "auto-sets `available: true`". It does **not**.

- `CROP-front/lib/equipment/brand-registry.ts:149-166` already contains a full `marcrest`
  record — but **`available: false`** (line 155), with a comment: "Known carried-catalog
  brand, not yet sold. Pinned available:false … until activated."
- `carriedIdentity()` (`manufacturer-config.ts:16-36`) returns `available: record.available`
  → so it returns **`false`**, leaving Marcrest non-navigable even after you add the config entry.

➡️ **A2 must first flip `marcrest.available: false → true`** (and keep `seoIndexed: false`)
in `brand-registry.ts`, **then** add the `MANUFACTURER_CONFIGS.marcrest` entry.

---

## F3 — Activating Marcrest breaks hard invariant tests in TWO test files ❗❗

The "exactly the activated brands" guards will fail the moment Marcrest goes `available: true`:

**`CROP-front/lib/db/manufacturer-config.test.ts`**
- L80 `AVAILABLE_SLUGS = ["new-holland","ferris","ventrac","mchale"]` → add `"marcrest"`
- L81 `AVAILABLE_CODES = ["NHL","FRR","VNT","MCH"]` → add `"MAR"`
- L98-106 "flags only the activated brands as available" → marcrest now expected `true`
- L178-195 "carried configs derive from BRAND_REGISTRY" `.each([...])` → add `"marcrest"`

**`CROP-front/lib/equipment/brand-registry.test.ts`**
- L38-94 `EXPECTED` snapshot has marcrest `available: false` → flip to `true`
- L191-214 entire **"Marcrest parity"** describe block asserts `available: false` and
  `carriedSlugs NOT contain "marcrest"` → must be rewritten for the activated state

➡️ **A2 touches ≥4 files**, not the single `manufacturer-config.ts` the docs imply:
`brand-registry.ts`, `brand-registry.test.ts`, `manufacturer-config.ts`, `manufacturer-config.test.ts`.

---

## F4 — hono `STATIC_CARRIED_WHITELIST` contains none of VNT / FRR / MCH ❗

`CROP-search-hono/src/lib/vocabulary-cache.ts:213-224` whitelist = only the 10 CNH-family
codes (`NHL, FRD, CIH, FIA, VRS, FDB, GEH, HES, LAV, CTY`). Ventrac/Ferris/McHale work
today **only** because `getCarriedBrandCodes()` (L653-668) unions the static whitelist
with PG `brand_vocabulary.is_carried=true` rows. On a **cold instance before the PG cache
loads**, all four non-CNH brands (incl. Marcrest) fall back to static-only → **not carried
→ 404**.

➡️ **A1 should add `VNT`, `FRR`, `MCH`, **and** `MAR`** to the whitelist (cold-start
hardening), not just `MAR`. The docs' "VNT, FER, MCH — already there" is incorrect; they
are absent.

---

## F5 — Equipment-type imagery (OLG-4) is already shipped; hono brand tests already exist ❗

**OLG-4 / B3 — imagery already built.** The docs propose creating
`lib/brand/equipment-type-images.ts`, adding an `imageUrl` prop to `TypeCard`, and adding
WebP assets. All of that already exists, in a different shape:
- `CROP-front/lib/equipment/type-image.ts` → `TYPE_IMAGE_MAP` + `getTypeImageSrc(slug)` (12 keys)
- `CROP-front/app/parts-diagrams/_components/type-card.tsx:55,70-87` already renders
  `<Image src={getTypeImageSrc(...)}>` with graceful Lucide-icon fallback
- `CROP-front/public/images/equipment-types/` already holds 12 WebP assets
  (`commercial-mowers`, `mowers`, `hay-tools`, `balers`, `tractors`, …)
- `CROP-front/scripts/audit-equipment-type-images.ts` audits the set

➡️ **B3 reduces to verification + gap-fill:** confirm the equipment-type **slugs hono
returns** for Ferris/Ventrac/McHale/Marcrest are keys in `TYPE_IMAGE_MAP`; add any missing
asset+key. Not a from-scratch build.

**hono tests already cover the new brands.** `CROP-search-hono/tests/vocabulary.test.ts`
already asserts `FRR`/`VNT`/`MCH` (L50-53, 112-115). Only **`MAR`** coverage is missing.

---

## F6 — Desktop nav loop: the brand-routes crumb is already correct ❗

OLG-2 / B1 says the fix is in `features/assemblies/brand-breadcrumb.tsx` (brand crumb
links to `/parts-diagrams` root). In the live code:
- `brand-breadcrumb.tsx` is **purely presentational** — it renders whatever `crumbs[]`
  (with `href`) it is handed; it hardcodes no brand path.
- The brand-routes assembly page **already** builds the brand crumb correctly:
  `app/parts-diagrams/[brand]/assemblies/[assemblyCode]/page.tsx:117` →
  `{ label: config.name, href: \`/parts-diagrams/${config.slug}\` }`.

So the loop John saw is **not** in this file. Likely sources to repro/diagnose:
- the older `/equipment/[slug]/parts-diagrams` system (`features/assemblies/assembly-view.tsx`,
  `features/diagrams/mobile-diagram-view.tsx`), or
- the brand-landing `/parts/brand/[slug]` "Open parts diagram" CTA, or
- `ConditionalSchematicBanner` (`features/navigation/schematic-banner-cta/banner-routes.ts`)
  — note it renders on `/parts/brand/`, `/parts`, `/brands`, `/equipment`,
  `/equipment/.../parts-diagrams`, but **not** on `/parts-diagrams/[brand]/*`.

➡️ **B1 starts with live reproduction**, then fixes the actual offending link. Do not
"fix" the already-correct brand crumb.

---

## Routing reality (context for B1/B2/A3)

There are **two** diagram surfaces — keep them straight when smoke-testing:
- **Brand-routes (newer):** `/parts/brand/[slug]` (landing) → `/parts-diagrams/[brand]` →
  `/parts-diagrams/[brand]/[modelCode]` → `/parts-diagrams/[brand]/assemblies/[assemblyCode]`.
  Pure hono brand-hub reads. This is the path the 4 new brands use.
- **Equipment-routes (older, NH):** `/equipment/[slug]/parts-diagrams/...` via
  `assembly-view.tsx` + `mobile-diagram-view.tsx`.

The mobile image-scroll parity gap (B2) and the desktop loop (B1) must each be checked on
the surface the **new brands** actually use (brand-routes), not assumed from the NH path.
