# V2 Team Assignments — Sprint S06
**Deadline: Friday 2026-06-06**
**Reviewed by John on Friday — must be production-ready.**

---

## PR Workflow (agreed 2026-06-02)

```
Oleg/Daniil opens PR on branch cut from dev
  → Denis runs it locally + tests acceptance criteria
    → Vova does final UI/UX review
      → Vova merges to dev → deploy to crop-dev.app → smoke check → prod
```

Every issue must start with an **impact statement** (one paragraph: why this work matters).
Small bugs found during work: fix inline and note in the task comment — do not create new issues.

---

## Oleg — Frontend

### OLG-1 · Activate Marcrest brand page in CROP-front
**Unblocks:** Denis smoke test (A3), OLG-3

**What to do:**
Add `marcrest` entry to `MANUFACTURER_CONFIGS` in [lib/db/manufacturer-config.ts](../../../../../CROP-front/lib/db/manufacturer-config.ts).
Copy the McHale pattern (line ~76) exactly:

```ts
// S06-A2 — Marcrest activation. Navigable (available) but noindex
// (seoIndexed: false) until John approves indexing. Diagrams come from hono's
// brand routes; no MAR search MV yet.
marcrest: {
  ...carriedIdentity("marcrest"),
  collectionName: "MARCREST",
  fields: {
    partNumber: ["Part Number"],
    description: ["Description"],
    price: ["List Price"],
  },
},
```

`carriedIdentity("marcrest")` resolves from the DB data layer — it will set
`available: true` and `seoIndexed: false` as long as the "marcrest" entry exists
in the underlying data (Vova confirms the `brand_vocabulary` row).

**Verify it worked:**
- `getManufacturerConfig("marcrest")` returns a non-null config in unit test
- `bun run type-check` passes
- `/parts/brand/marcrest` renders (200) in local dev — either shows content or the
  graceful empty-state (no 404, no 500)
- `/parts-diagrams/marcrest` renders (200)

**Files to touch:**
- `lib/db/manufacturer-config.ts` — one new object entry

---

### OLG-2 · Fix desktop circular navigation loop on parts-diagrams
**Unblocks:** Denis smoke test sign-off

**Problem:** From the assembly page (`/parts-diagrams/{brand}/assemblies/{code}`),
some "back" or breadcrumb link routes to `/parts-diagrams` root instead of
`/parts-diagrams/{brand}` or `/parts-diagrams/{brand}/{modelCode}`.
John demonstrated this on Ferris: clicking "Open parts diagram" looped back to
the same menu.

**Where to look:**
1. [features/assemblies/brand-breadcrumb.tsx](../../../../../CROP-front/features/assemblies/brand-breadcrumb.tsx) —
   check what `href` the brand crumb resolves to for non-NH brands.
2. [app/parts-diagrams/[brand]/_components/brand-assembly-list.tsx](../../../../../CROP-front/app/parts-diagrams/%5Bbrand%5D/_components/brand-assembly-list.tsx) —
   does the "back" link use the correct `brandSlug` parameter?
3. [app/parts-diagrams/[brand]/_components/brand-assembly-view.tsx](../../../../../CROP-front/app/parts-diagrams/%5Bbrand%5D/_components/brand-assembly-view.tsx) —
   the `BrandAssemblyView` wrapper passes `assemblyName` and `chapterName` but
   no brand-back link. Check where back-nav is derived.
4. [features/navigation/schematic-banner-cta.tsx](../../../../../CROP-front/features/navigation) —
   `ConditionalSchematicBanner` on the brand landing page may CTA to `/parts-diagrams`
   root; if user is already on `/parts-diagrams/ferris` it should not show, or
   should link to `/parts-diagrams/ferris` not root.

**What to fix:**
- The brand crumb in the assembly page breadcrumb must link to `/parts-diagrams/{brandSlug}`.
- If `ConditionalSchematicBanner` shows on a brand-specific page, its href should
  point to the brand diagrams page, not `/parts-diagrams`.
- Walk the full path manually in dev browser: brand page → model card → assembly list →
  assembly viewer → every breadcrumb/back link → confirm no loop.

**Test to add:**
In [features/assemblies/brand-breadcrumb.test.tsx](../../../../../CROP-front/features/assemblies/brand-breadcrumb.test.tsx) —
add a case: for `brandSlug="ferris"`, the rendered breadcrumb href contains
`/parts-diagrams/ferris` not `/parts-diagrams`.

**Files to touch:**
- `features/assemblies/brand-breadcrumb.tsx` (likely fix location)
- Possibly `app/parts-diagrams/[brand]/_components/brand-assembly-list.tsx`

---

### OLG-3 · Mobile assembly view — expose diagram image-scroll panel
**Can start:** independently (no hard deps)

**Problem:** On desktop, the assembly page shows a scrollable image strip where users
can browse diagram sections visually ("I know it when I see it"). On mobile,
users only see the text-only chapter list. `MobileChapterDrawer` exists but only
shows text chapters.

**Where to look:**
1. [features/assemblies/assembly-interactive-view.tsx](../../../../../CROP-front/features/assemblies/assembly-interactive-view.tsx) —
   contains the image-scroll panel. Check if it's hidden via CSS breakpoint
   (`hidden md:block`) or a JS visibility state. If CSS: expose it on mobile
   behind a trigger button. If JS: wire the trigger into `MobileChapterDrawer`.
2. [features/assemblies/chapter-sidebar.tsx](../../../../../CROP-front/features/assemblies/chapter-sidebar.tsx) —
   `MobileChapterDrawer` lives here. The drawer already handles open/close;
   put the image-strip content inside it.
3. [features/assemblies/chapter-assembly-list.tsx](../../../../../CROP-front/features/assemblies/chapter-assembly-list.tsx) —
   check if this has thumbnail rendering that can be passed to the drawer.

**What to build:**
- A "Browse Diagrams" trigger button (FAB or top bar) on the assembly page, visible
  on mobile only (`md:hidden`).
- Tap the trigger → `MobileChapterDrawer` opens with assembly diagram thumbnails.
- Tap a thumbnail → drawer closes, schematic viewer snaps to that section.
- The text-filter input (already in the desktop panel) must work inside the drawer
  on mobile keyboard.

**Do not:**
- Create a new drawer component — use `MobileChapterDrawer`.
- Change the desktop layout.
- Break `use-zoom-pan.ts` touch gestures (test pinch-zoom after the change).

**Acceptance:**
- Mobile (375px): "Browse Diagrams" button visible on assembly page.
- Tap → drawer shows diagram section images (not just text).
- Tap image → viewer shows that section.
- Existing `mobile-chapter-drawer.test.tsx` still passes.

**Files to touch:**
- `features/assemblies/assembly-interactive-view.tsx`
- `features/assemblies/chapter-sidebar.tsx` (MobileChapterDrawer — add image content)

---

### OLG-4 · Brand landing — equipment-type static imagery on TypeCards
**Can start:** independently

**Problem:** TypeCards on brand landing pages show a generic hex tractor icon
regardless of brand or equipment type. Customers can't tell a "Mowers" card from
a "Tractors" card by sight. Vova has Figma reference images.

**What to build:**
1. Create `lib/brand/equipment-type-images.ts`:
   ```ts
   export const EQUIPMENT_TYPE_IMAGES: Record<string, string> = {
     tractors: "/images/equipment-types/tractors.webp",
     mowers: "/images/equipment-types/mowers.webp",
     "commercial-mowers": "/images/equipment-types/commercial-mowers.webp",
     "hay-tools": "/images/equipment-types/hay-tools.webp",
     "utility-vehicles": "/images/equipment-types/utility-vehicles.webp",
     attachments: "/images/equipment-types/attachments.webp",
   };
   ```
2. Add the WebP images to `public/images/equipment-types/` (4-6 images, ~400×250px).
   **Get the image sources from Vova** (Figma reference has them).
3. In [app/parts/brand/[slug]/page.tsx](../../../../../CROP-front/app/parts/brand/%5Bslug%5D/page.tsx)
   inject the static image into each `TypeCard` via an `imageUrl` prop when the slug
   matches `EQUIPMENT_TYPE_IMAGES`.
4. In [app/parts-diagrams/_components/type-card.tsx](../../../../../CROP-front/app/parts-diagrams/_components/type-card.tsx)
   add an optional `imageUrl?: string` prop; when set, render `<Image>` instead of
   the generic icon.

**Rules:**
- Use Next.js `<Image>` (not `<img>`). Add `alt` text to every image.
- Lazy-load images below-fold; above-fold TypeCards (first 4) use `priority={true}`.
- If a type has no static image: show the existing generic icon (no broken layout).
- No hardcoded hex — use Moby DS tokens for any overlays.

**Files to touch:**
- `lib/brand/equipment-type-images.ts` (new file)
- `app/parts-diagrams/_components/type-card.tsx` (add imageUrl prop)
- `app/parts/brand/[slug]/page.tsx` (inject static image into TypeCard)
- `public/images/equipment-types/` (image assets from Vova)

---

### OLG-5 · Fix Ferris commercial mower selection flash
**Depends on:** OLG-1 + Daniil's DAN-1 (Marcrest hono) being done so Ferris routes are clean

**Problem:** John selected a Ferris commercial mower config number and saw a visual
flash before the page settled. ("It's doing this flashy flash s***. Ola knows
exactly what that is and he's going to fix it.")

**How to reproduce:**
1. In dev: go to `/parts-diagrams/ferris`.
2. Find the "Commercial Mowers" model group.
3. Click a 59-series config card.
4. Observe the flash.

**Root cause candidates (check in order):**
1. Open Chrome DevTools → Performance → record the click. Which element flashes?
   Is it the whole page, a specific section, an image?
2. Check [app/parts-diagrams/loading.tsx](../../../../../CROP-front/app/parts-diagrams/loading.tsx) —
   does the loading skeleton shape match the actual page layout? A dimension
   mismatch causes layout shift visible as a flash.
3. Check `BrandModelGroups` for any `useEffect` that toggles visibility on mount.
4. Check if any `<Suspense>` boundary in the model list page shows a blank fallback.

**Fix:** Once the root cause is identified, add/fix the loading skeleton or remove
the flash-causing state change. The fix should be ≤ 20 lines.

**Acceptance:**
- Navigate Ferris → Commercial Mowers → click a 59-series model.
- No visible flash or layout shift (CLS ≈ 0 in Lighthouse).
- Same test on mobile (375px, Slow 4G throttle in DevTools).

---

## Daniil — Backend / Search

### DAN-1 · Add Marcrest (MAR) to hono BRAND_REGISTRY
**Priority: highest — everything else in Track A is blocked until this is done.**

**File:** [CROP-search-hono/src/lib/vocabulary-cache.ts](../../../../../CROP-search-hono/src/lib/vocabulary-cache.ts)

**Step 1 — Add to BRAND_REGISTRY (around line 44):**
```ts
{
  code: "MAR",
  canonicalName: "Marcrest",
  vocabulary: ["Marcrest", "MARCREST"],
  productLines: ["MARCREST"],
  querySynonyms: ["marcrest", "mar", "bale barron"],
},
```
Pattern: copy the VNT or FER entry. `productLines` must be UPPERCASE to match
`models.product_line` column convention. `querySynonyms` must be lowercase.

**Step 2 — Add to STATIC_CARRIED_WHITELIST (line ~213):**
```ts
const STATIC_CARRIED_WHITELIST: ReadonlySet<string> = new Set([
  "NHL", "FRD", "CIH", "FIA", "VRS", "FDB", "GEH", "HES", "LAV", "CTY",
  "VNT", "FER", "MCH",   // non-CNH carried brands (already here or add them)
  "MAR",                 // Marcrest — S06
]);
```
> Check the current whitelist first — VNT/FER/MCH may already be there.
> The whitelist is the cold-start fallback when PG `brand_vocabulary` hasn't loaded.

**Step 3 — Add unit tests:**
In the existing vocabulary-cache test file:
```ts
it("MAR resolves from marcrest slug", () => {
  expect(normaliseManufacturerToken("marcrest")).toBe("MAR");
});
it("getBrandDisplayName returns Marcrest for MAR", () => {
  expect(getBrandDisplayName("MAR")).toBe("Marcrest");
});
it("getCarriedBrandCodes includes MAR", () => {
  expect(getCarriedBrandCodes().has("MAR")).toBe(true);
});
```

**Verify:**
- `bun run test` — all unit tests pass.
- `bun run typecheck` passes.
- After cache refresh: `GET /api/brand/marcrest/models` returns 200 (with data) or
  a clean `404 { code: "NOT_FOUND" }` if no Marcrest rows are in the DB yet.
  It must **not** return 500.

---

### DAN-2 · Audit multibrand part-number search
**Depends on:** DAN-1 (Marcrest in registry)

**Context:** With 4 brands in the platform, the same part number may appear in
multiple brands. Search must surface all matches with correct brand labels.
John's exact words: "a part number can be the same for two brands potentially...
search is going to be much more complicated when we're not using just the New Holland data set."

**Step 1 — Verify manufacturer_codes in search response:**
Find a part number that exists in both New Holland and one of the new brands
(ask Vova for a test PN). Call `GET /api/search?q={testPN}`.
Check: does each result's `manufacturer_codes` array contain the correct brand code(s)?

**Step 2 — Verify brand facet in `/api/filters`:**
Call `GET /api/filters?manufacturer=ferris` (or equivalent).
Check: Ferris, Ventrac, McHale appear as brand facets when `MANUFACTURER_FILTER_ENABLED=true`.

**Step 3 — Check `brand-extractor.ts`:**
[CROP-search-hono/src/lib/brand-extractor.ts](../../../../../CROP-search-hono/src/lib/brand-extractor.ts)
lists CNH-family brands for AI-copy contamination detection. Ferris/Ventrac/McHale
are NOT CNH family — they should pass through `isAiBrandSafe` as safe.
Verify: `isAiBrandSafe("Ferris commercial mower fuel filter", ["FER"])` returns `true`.
(It should — Ferris is not in `BRAND_KEYWORDS`. Just confirm it doesn't accidentally
return false.)

**Step 4 — If manufacturer_codes is empty/wrong for non-NH brands:**
Check the SQL in [src/routes/search.ts](../../../../../CROP-search-hono/src/routes/search.ts)
and [src/adapters/search-adapter.ts](../../../../../CROP-search-hono/src/adapters/search-adapter.ts).
The `manufacturer_codes` column comes from the PG `parts` table. If non-NH parts
are missing it, this is a data pipeline gap — document it for Vova/Alex (not a
code bug).

**Output:**
- Fix any code-side issue found (≤ 20 lines typically).
- If it's a data gap: open a GitHub issue with impact statement, assign to Vova.
- Add unit test: `getBrandDisplayName("FER")`, `("VNT")`, `("MCH")`, `("MAR")`
  all return correct strings (not "UNK").

---

### DAN-3 · Verify Ferris 59-number config codes resolve to assemblies
**Depends on:** DAN-1

**Context:** Ferris commercial mowers are identified by "59-series" configuration
numbers (e.g., 590xx). This is the customer's primary lookup path. If a 59-number
doesn't route to the correct parts diagram, the Ferris use case is broken.

**Step 1 — Check vocabulary cache for Ferris 59-numbers:**
After a cache refresh on dev, call `GET /api/brand/ferris/models` (or the models-by-brand
equivalent). Look at the response: do the Commercial Mowers group have model entries
with 59-series `modelNumber` values?

**Step 2 — Verify slug is populated:**
In `brand-hub.ts` (line ~107): models with `!vocab.slug` are already skipped.
If 59-series Ferris models have empty slugs in the `models` table, they won't appear.
Check: `SELECT model_code, model_number, slug FROM models WHERE product_line = 'FERRIS' AND model_number LIKE '59%' LIMIT 10;`
If slug is empty: the `models.slug` column needs to be populated for these rows.
This is a data task — document for Vova with the exact SQL and the model_codes.

**Step 3 — Verify model route resolves:**
Call `GET /api/brand/ferris/models` → pick a 59-series slug.
Then navigate to `/parts-diagrams/ferris/{slug}` in the dev FE.
The assembly list should render. If it 404s, check `resolve-model-param.ts` in hono —
does it accept the slug form?

**Output:**
- If code gap: fix in hono (slug route resolver or brand-hub filter).
- If data gap: document SQL + affected model_codes for Vova.

---

## Denis — QA

### QA role in this sprint

Denis does not write features. Denis runs every PR locally before Vova reviews it.
The output of QA is: pass/fail on acceptance criteria, bugs filed with impact statements,
and the A3 smoke-test checklist filled in.

---

### QA-1 · Run the 4-brand end-to-end smoke test
**Depends on:** OLG-1 and DAN-1 merged to dev

**What to do:**
Pull the latest `dev` branch. For each of the 4 brands, run the checklist in
[S06-A3-4brand-e2e-smoke.pd](../sprints/06/S06-A3-4brand-e2e-smoke.pd).

For each brand test these 3 pages:

**Brand landing** (`/parts/brand/{slug}`):
- [ ] Page renders at 375px and 1280px without console errors
- [ ] Brand name visible in hero header
- [ ] At least 1 TypeCard (or graceful empty-state — not a broken layout)
- [ ] "Search all parts" CTA clicks through to `/parts?manufacturer=...`
- [ ] Serial search widget visible

**Parts-diagrams brand page** (`/parts-diagrams/{slug}`):
- [ ] Page renders without 404 or 500
- [ ] Model list shows (or graceful empty-state)
- [ ] At least 1 model card is clickable

**Assembly page** (click a model → click an assembly):
- [ ] Schematic/viewer loads
- [ ] BOM table shows at least 1 part row
- [ ] "Add to cart" visible (or login prompt — not an error)

Fill in the smoke-checklist table in the `.pd` file with ✓ / ✗ / note.

**For every ✗ found:**
Open a GitHub issue in the relevant repo with:
```
Impact: [one paragraph explaining what breaks for the user]

Steps to reproduce:
1. ...

Expected: ...
Actual: ...
```
Assign to the relevant dev (Oleg for FE, Daniil for BE). Tag `goal/obj-03`.

---

### QA-2 · PR review process — run locally before Vova

For every PR in this sprint before Vova reviews it:

1. `git fetch && git checkout <branch>`
2. `bun install` (if package.json changed)
3. `bun run dev` — navigate to the affected routes
4. Verify the acceptance criteria in the PR's `.pd` task file
5. Check at two viewports: 375px mobile and 1280px desktop
6. Comment on the PR: **"Local test: PASS"** or **"Local test: FAIL — [specific thing broken]"**

CROP-front specific:
- `bun run type-check` must pass before commenting PASS
- `bun test` for any file with a co-located `.test.ts` that was changed

CROP-search-hono specific:
- `bun run test` must pass
- `bun run typecheck` must pass

---

### QA-3 · Navigation smoke (B1 + B2 sign-off)

After OLG-2 and OLG-3 are submitted as PRs, run:

**Desktop circular loop check (OLG-2):**
On Chrome desktop:
1. Go to `/parts-diagrams/ferris`
2. Click a model card
3. Click an assembly
4. Use every breadcrumb link and every "back" button
5. Confirm no link takes you to `/parts-diagrams` root when you came from `/parts-diagrams/ferris`

**Mobile drawer check (OLG-3):**
On Chrome (DevTools → iPhone SE emulation, 375px):
1. Go to `/parts-diagrams/ferris/{modelCode}/assemblies/{code}` (any Ferris assembly)
2. A "Browse Diagrams" button or drawer trigger must be visible
3. Tap it → drawer opens with image thumbnails (not just text)
4. Tap a thumbnail → schematic shows that section
5. Tap outside → drawer closes; schematic is still visible and pannable

---

## Vova — Team Lead

### VOA-1 · Data pipeline — confirm Marcrest in brand_vocabulary table
**Before Oleg and Daniil can fully verify their Marcrest tasks.**

The `brand_vocabulary` table in PG (`is_carried` column) is used by hono's
`getCarriedBrandCodes()`. If "MAR" has no row in that table, hono falls back to
`STATIC_CARRIED_WHITELIST` — which is fine, but the brand name display will fall
back to the `BRAND_REGISTRY.canonicalName` ("Marcrest") until a row is added.

Action: verify or add this row in `brand_vocabulary`:
```sql
INSERT INTO brand_vocabulary (code, name, is_carried)
VALUES ('MAR', 'Marcrest', true)
ON CONFLICT (code) DO UPDATE SET is_carried = true, name = 'Marcrest';
```
Also confirm the `models` table has rows with `product_line = 'MARCREST'` — if no data
exists yet, the brand pages will show the graceful empty-state (acceptable for V2).

---

### VOA-2 · Final PR review checklist

For every PR before merge:

**Code quality:**
- No `React.memo` / unjustified `useMemo`/`useCallback`
- All colors via Moby DS tokens (no hardcoded hex)
- No `Co-Authored-By:` or AI attribution in commit
- No Cyrillic in source
- No emoji in commits or source
- Impact statement present in the PR description

**Navigation correctness (B-track PRs):**
- Desktop: breadcrumb at every level is correct brand + depth ≤ 4
- Mobile: no overflow, touch targets ≥ 44px

**Brand correctness (A-track PRs):**
- `seoIndexed: false` on any new brand entry (never `true` without John approval)
- `available: true` for V2 brands
- Canonical slug: lowercase, no spaces, no special chars

---

### VOA-3 · Ferris 59-numbers data check
**Coordinate with Daniil (DAN-3).**

If Daniil finds that Ferris 59-series model slugs are empty in the `models` table,
run the fix:
```sql
-- Example — verify the exact column name and pattern first:
UPDATE models
SET slug = LOWER(REGEXP_REPLACE(model_number, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE product_line = 'FERRIS'
  AND model_number LIKE '59%'
  AND (slug IS NULL OR slug = '');
```
After update: trigger `POST /admin/cache/refresh` on the hono dev instance so
vocabulary cache reloads.

---

### VOA-4 · Friday production deploy

Once Denis's smoke checklist is all ✓ on dev:
1. Tag the release commit: `v2.0.0-brands`
2. Deploy to prod from `dev` branch
3. Verify all 4 brand pages live on crop.clintontractor.net
4. Notify John / ownership the demo is ready

---

## Dependency Map

```
DAN-1 (Marcrest hono)
  ├─→ OLG-1 (Marcrest FE) ─→ QA-1 (smoke test)
  ├─→ DAN-2 (multibrand search)
  └─→ DAN-3 (Ferris 59-numbers)
        └─→ OLG-5 (flash fix — needs Ferris routes clean)

OLG-2 (nav loop fix) ─→ QA-3 (navigation smoke)
OLG-3 (mobile parity) ─→ QA-3

OLG-4 (brand imagery) — independent (no deps)
VOA-1 (Marcrest DB row) — parallel with DAN-1 (both needed for full Marcrest e2e)

QA-1 (smoke all ✓) ─→ VOA-4 (prod deploy)
```

**Start order for Day 1 (Tuesday 2026-06-03):**
- Daniil: start DAN-1 immediately — it unblocks everything
- Oleg: start OLG-2 (nav loop) and OLG-3 (mobile) in parallel — no deps
- Vova: VOA-1 (DB row) — quick, unblocks smoke
- Denis: review docs, set up local env, prepare smoke checklist

---

## Definition of Done

A brand is "production ready" when:
- [ ] `/parts/brand/{slug}` → 200, brand name visible, TypeCards rendered
- [ ] `/parts-diagrams/{slug}` → 200, model grid rendered (or graceful empty-state)
- [ ] At least one assembly diagram loads end-to-end
- [ ] No console errors at 375px and 1280px
- [ ] Denis ran the smoke checklist and all checked ✓
- [ ] Vova reviewed and merged the PR
- [ ] Verified on crop-dev.app before pushing to prod
