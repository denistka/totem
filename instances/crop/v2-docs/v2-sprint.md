# CROP V2 — Sprint S06 · All Tasks
**Deadline: Friday 2026-06-06 · Demo to ownership**
**Repos: CROP-front (Next.js) · CROP-search-hono (Bun/Hono)**

---

## Context

From the 2026-06-02 team meetup. Four brands need to go from dev to production:
**Ferris, Ventrac, McHale, Marcrest.**

Three issues to fix:
1. Getting to a parts diagram is the primary pain point — navigation is broken on mobile and loops on desktop.
2. Brand pages look generic (identical boxes with hex icons regardless of brand).
3. Search was single-brand; with 4+ brands, part-number collisions need correct attribution.

**Current state (from code):**
- Ferris, Ventrac, McHale — already `available: true` in CROP-front config and in hono `BRAND_REGISTRY`.
- Marcrest — **missing from both repos**. Every Marcrest route returns 404.
- Brand page template exists for non-NH brands; it's functional but visually generic.
- `MobileChapterDrawer` exists but shows only text chapter list on mobile — no image thumbnails.
- Circular breadcrumb issue: on the assembly page, the brand crumb links to `/parts-diagrams` root instead of `/parts-diagrams/{brand}`.

---

## PR Workflow

```
Dev opens PR (branch cut from dev)
  → Denis runs locally + verifies acceptance criteria
    → Vova final UI/UX review
      → Vova merges to dev → deploy crop-dev.app → smoke → prod
```

**Every issue must start with an impact statement** — one paragraph explaining why the work matters (not what it does).
**Small bugs found during work:** fix inline, note in the PR description — do not create a separate issue.

---

## Team

| Person | Role |
|--------|------|
| Oleg | Frontend (CROP-front) |
| Daniil | Backend / Search (CROP-search-hono) |
| Denis | QA — runs every PR locally before Vova reviews |
| Vova | Team lead — final PR review, DB ops, prod deploy |

---

## Dependency Order

```
DAN-1 (Marcrest in hono) ──────────────────────────────────────────┐
VOA-1 (Marcrest DB row)  ──┐                                        │
                           ├─→ OLG-1 (Marcrest FE) ─→ DEN-1 (smoke)─→ VOA-4 (prod)
DAN-3 (Ferris 59-slugs)  ──┘
  └─→ OLG-5 (flash fix)

OLG-2 (nav loop) ──────────→ DEN-3 (nav smoke)
OLG-3 (mobile parity) ─────→ DEN-3

OLG-4 (imagery)  — independent, no deps
DAN-2 (multibrand search) — independent after DAN-1
```

**Day 1 start order:**
- Daniil → DAN-1 immediately (everything is blocked on it)
- Oleg → OLG-2 and OLG-3 in parallel (no deps)
- Vova → VOA-1 (quick DB check, unblocks smoke)
- Denis → set up local env, read this doc, prepare smoke checklist

---

## Tasks

---

### DAN-1 · Add Marcrest to hono BRAND_REGISTRY
**Owner: Daniil** · Repo: CROP-search-hono · Priority: HIGHEST — everything blocked on this

**Impact:**
Marcrest is the last of the 4 V2 brands. Without this task every Marcrest route in hono returns 404 — the brand landing page, model grid, and assembly diagrams are all dead. Takes ~30 min; unblocks Oleg, Denis, and Vova's DB check simultaneously.

**File:** `src/lib/vocabulary-cache.ts`

**Step 1 — Add to `BRAND_REGISTRY` (around line 44):**
```ts
{
  code: "MAR",
  canonicalName: "Marcrest",
  vocabulary: ["Marcrest", "MARCREST"],
  productLines: ["MARCREST"],
  querySynonyms: ["marcrest", "mar", "bale barron"],
},
```
Copy the pattern from the VNT (Ventrac) or FER (Ferris) entry directly above.
`productLines` must be UPPERCASE (matches `models.product_line`).
`querySynonyms` must be lowercase.

**Step 2 — Add `"MAR"` to `STATIC_CARRIED_WHITELIST` (line ~213):**
```ts
const STATIC_CARRIED_WHITELIST: ReadonlySet<string> = new Set([
  "NHL", "FRD", "CIH", "FIA", "VRS", "FDB", "GEH", "HES", "LAV", "CTY",
  "VNT", "FER", "MCH",  // already there or add them
  "MAR",                // Marcrest — S06
]);
```
This is the cold-start fallback when the `brand_vocabulary` PG table hasn't loaded yet. Without it, hono serves Marcrest as "not carried" and returns 404 on cold instances.

**Step 3 — Add 3 unit tests** in the existing vocabulary-cache test file:
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
- `bun run test` — all pass
- `bun run typecheck` — passes
- `GET /api/brand/marcrest/models` returns 200 (with data) or clean `404 { code: "NOT_FOUND" }` if no DB rows yet — must **not** be 500

---

### DAN-2 · Audit multibrand part-number search
**Owner: Daniil** · Repo: CROP-search-hono · Depends on: DAN-1

**Impact:**
With 4 brands live, the same part number can exist for both Ferris and New Holland. If search returns only the NH result or shows no brand label on the Ferris result, customers order the wrong part. John's exact words: "a part number can be the same for two brands potentially... search is going to be much more complicated."

**Step 1 — Verify `manufacturer_codes` in search response:**
Ask Vova for a test part number that exists in both NH and one new brand.
Call `GET /api/search?q={testPN}`.
Check each result: does `manufacturer_codes` array contain the correct brand code(s)?

**Step 2 — Verify brand facets:**
`GET /api/filters` (with `MANUFACTURER_FILTER_ENABLED=true` in dev env).
Check: Ferris, Ventrac, McHale appear in the brand facet list.

**Step 3 — Spot-check `brand-extractor.ts`:**
File: `src/lib/brand-extractor.ts`
This file guards against CNH-family brand contamination in AI copy.
Ferris/Ventrac/McHale are NOT CNH family — they must pass through as safe.
Verify: `isAiBrandSafe("Ferris commercial mower fuel filter", ["FER"])` returns `true`.
(It should — FER is not in `BRAND_KEYWORDS`. Just confirm it doesn't accidentally block non-CNH results.)

**Step 4 — Fix or document:**
- If `manufacturer_codes` is wrong in the code: fix in `src/adapters/search-adapter.ts` or `src/routes/search.ts`.
- If it's a data gap (non-NH parts missing brand codes in the PG `parts` table): open a GitHub issue with impact statement, assign to Vova/Alex. Do not block V2 for a data issue.

**Also add these 4 unit tests** (display name coverage for all new brands):
```ts
expect(getBrandDisplayName("FER")).toBe("Ferris");
expect(getBrandDisplayName("VNT")).toBe("Ventrac");
expect(getBrandDisplayName("MCH")).toBe("McHale");
expect(getBrandDisplayName("MAR")).toBe("Marcrest"); // needs DAN-1
```

**Verify:**
- Unit tests pass
- No 500 errors on `/api/search` when queried with Ferris part numbers
- Ferris brand facet visible in `/api/filters` response

---

### DAN-3 · Verify Ferris 59-number config codes route to assemblies
**Owner: Daniil** · Repos: CROP-search-hono · Depends on: DAN-1

**Impact:**
Ferris commercial mowers are identified by "59-series" configuration numbers (e.g., 590xx). This is the primary way a Ferris customer finds their machine. John: "if a customer knows that 59 number, that's how they're going to find their diagram. V2 release must ensure these configurations are correctly wired and searchable."

**Step 1 — Check vocabulary cache for 59-series models:**
After `POST /admin/cache/refresh` on dev hono instance, call `GET /api/brand/ferris/models`.
Find the Commercial Mowers group. Do 59-series model numbers appear?

**Step 2 — Check if slugs are populated:**
In `brand-hub.ts` (line ~107), models with empty `slug` are already skipped — so
if 59-series models don't appear in the grid, it's because `models.slug` is empty.

Run this SQL to verify:
```sql
SELECT model_code, model_number, slug
FROM models
WHERE product_line = 'FERRIS'
  AND model_number LIKE '59%'
LIMIT 10;
```

**Step 3 — If slugs are empty:**
Document for Vova (see VOA-3). Slugs need to be populated in the DB.
This is a data task, not a code task.

**Step 4 — If slugs exist, verify the route:**
`GET /api/brand/ferris/models` → pick a 59-series model slug.
Navigate to `/parts-diagrams/ferris/{slug}` in dev FE.
Assembly list must render. If it 404s, check `src/lib/resolve-model-param.ts` — does it accept slug form or only UUID?
If it only accepts UUID: add slug → UUID reverse lookup (the `slugToModelCode` map in vocabulary-cache already exists — verify it's populated for Ferris models).

**Verify:**
- At least 5 Ferris 59-series models appear in `GET /api/brand/ferris/models` response
- Navigating to their slug leads to an assembly list (no 404)

---

### OLG-1 · Activate Marcrest brand in CROP-front
**Owner: Oleg** · Repo: CROP-front · Depends on: DAN-1

**Impact:**
Marcrest has no entry in `MANUFACTURER_CONFIGS`. Both `/parts/brand/marcrest` and `/parts-diagrams/marcrest` return 404. Activating it wires the brand into every CROP-front route automatically: brand hub, parts-diagrams, equipment types API, brands list page, and sitemap generation.

**File:** `lib/db/manufacturer-config.ts`

**Add this entry** (copy the McHale pattern at line ~76):
```ts
// S06-A2 — Marcrest activation. Navigable (available) but noindex
// (seoIndexed: false) until John approves indexing. Diagrams from hono brand
// routes (/api/brands/MAR/...); no MAR search MV yet.
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

`carriedIdentity("marcrest")` auto-sets `available: true` and `seoIndexed: false` from the underlying data. `seoIndexed: false` keeps the page noindex,follow — **never set this to `true` without John's explicit approval**.

**Add one unit test** (find the manufacturer-config test file):
```ts
it("marcrest config is available and not seo-indexed", () => {
  const config = getManufacturerConfig("marcrest");
  expect(config).not.toBeNull();
  expect(config?.available).toBe(true);
  expect(config?.seoIndexed).toBeFalsy();
});
```

**Verify:**
- `bun run type-check` passes
- `bun run dev` → `/parts/brand/marcrest` → 200 (content or graceful empty-state — not 404, not 500)
- `/parts-diagrams/marcrest` → 200
- robots meta on `/parts/brand/marcrest` → `noindex,follow` (open DevTools → Elements → check `<meta name="robots">`)

---

### OLG-2 · Fix desktop circular navigation loop
**Owner: Oleg** · Repo: CROP-front · No deps — start immediately

**Impact:**
John demonstrated: clicking "Open parts diagram" from the assembly list sent the user back to the same menu. This is the #1 navigation pain point. Users who know their machine can't reach their diagram in a straight line. Must be fixed before the Friday demo.

**How to reproduce:**
1. `/parts-diagrams/ferris`
2. Click a model card → `/parts-diagrams/ferris/{modelCode}`
3. Click an assembly → `/parts-diagrams/ferris/assemblies/{assemblyCode}`
4. From the assembly page: click the "Ferris" breadcrumb
5. **Bug:** it routes to `/parts-diagrams` root, not `/parts-diagrams/ferris`

**Where to look (in order):**

`features/assemblies/brand-breadcrumb.tsx`
— The brand crumb href. Check what URL it resolves to for non-NH brands. It likely hardcodes `/parts-diagrams` root when it should use the brand-specific path.

`app/parts-diagrams/[brand]/_components/brand-assembly-list.tsx`
— Any "back" link. Verify it uses `brandSlug` param, not a hardcoded path.

`features/navigation/schematic-banner-cta.tsx` (ConditionalSchematicBanner)
— On brand landing pages this CTA points to `/parts-diagrams`. If the user is already on `/parts-diagrams/ferris` this CTA creates a perceived loop. Fix: hide it on brand-diagram pages, or change the href to brand-specific.

**Fix:** The brand crumb in the assembly breadcrumb must link to `/parts-diagrams/{brandSlug}`, not `/parts-diagrams`.

**Add unit test** in `features/assemblies/brand-breadcrumb.test.tsx`:
```ts
it("brand crumb href points to brand-specific diagrams page", () => {
  // render with brandSlug="ferris"
  // expect the brand crumb href to contain "/parts-diagrams/ferris"
  // not "/parts-diagrams"
});
```

**Verify (walk the full path manually in dev browser):**
- `/parts-diagrams/ferris` → click model → click assembly → click "Ferris" breadcrumb → lands on `/parts-diagrams/ferris` ✓
- Same path for Ventrac and McHale ✓
- New Holland path unchanged ✓

---

### OLG-3 · Mobile assembly view — expose diagram image-scroll panel
**Owner: Oleg** · Repo: CROP-front · No deps — start immediately

**Impact:**
On desktop, the assembly page shows a scrollable image strip so users can visually browse diagram sections ("I know it when I see it"). On mobile, only a text-only chapter list exists. Most customers browse on mobile. Without image-based browsing on mobile, the strongest feature of the platform is invisible to the majority of users.

**How to reproduce the gap:**
1. Open DevTools → emulate iPhone SE (375px)
2. Navigate to any assembly page: `/parts-diagrams/ferris/assemblies/{code}`
3. You see a text list. On desktop you'd see scrollable diagram thumbnails.

**Files:**
- `features/assemblies/assembly-interactive-view.tsx` — contains the image-scroll panel. Check if it's hidden via CSS (`hidden md:flex`) or JS state.
- `features/assemblies/chapter-sidebar.tsx` — contains `MobileChapterDrawer`. The drawer exists; put the image-strip content inside it.
- `features/assemblies/chapter-assembly-list.tsx` — may have thumbnail rendering to reuse.

**What to build:**

1. A "Browse Diagrams" trigger button on the assembly page, **mobile only** (`md:hidden`). Place it in the assembly page header or as a sticky bottom button.
2. Tap → `MobileChapterDrawer` opens with diagram section thumbnails (same images shown in the desktop hover strip).
3. Tap a thumbnail → drawer closes + schematic viewer snaps/scrolls to that section.
4. The text-filter input from the desktop panel must work inside the drawer on mobile keyboard.

**Do not:**
- Create a new drawer component — use `MobileChapterDrawer`.
- Change the desktop layout at all.
- Break `use-zoom-pan.ts` touch gestures. Test pinch-zoom on mobile after the change.

**Verify:**
- 375px viewport: "Browse Diagrams" button visible on assembly page
- Tap → drawer opens with images (not just text)
- Tap image → viewer shows that section
- Tap outside drawer → closes; schematic still pannable (no frozen viewport)
- `features/assemblies/mobile-chapter-drawer.test.tsx` — existing tests still pass

---

### OLG-4 · Brand landing — equipment-type static imagery on TypeCards
**Owner: Oleg** · Repo: CROP-front · No deps — independent task

**Impact:**
Brand landing pages show a generic hex tractor icon on every TypeCard regardless of brand or equipment type. Customers can't distinguish "Mowers" from "Tractors" by sight. John: "it's a little too much the same with just boxes with little hex tractors in them... adding type images and clear grouping would make the page feel more intuitive."

**hono returns `imageUrl: null` today** (no hero image column on `models` table yet — deferred). The pragmatic V2 fix: a static image map per equipment-type slug. No DB change, no hono change.

**Step 1 — Create `lib/brand/equipment-type-images.ts`:**
```ts
export const EQUIPMENT_TYPE_IMAGES: Record<string, string> = {
  tractors:            "/images/equipment-types/tractors.webp",
  mowers:              "/images/equipment-types/mowers.webp",
  "commercial-mowers": "/images/equipment-types/commercial-mowers.webp",
  "hay-tools":         "/images/equipment-types/hay-tools.webp",
  "utility-vehicles":  "/images/equipment-types/utility-vehicles.webp",
  attachments:         "/images/equipment-types/attachments.webp",
};
```
Slugs must match what hono `brand-taxonomy` returns as `equipmentType.slug`.
Verify the actual slugs from `GET /api/brand/ferris/models` or `GET /api/brand-taxonomy/ferris`.

**Step 2 — Get images from Vova.**
4-6 WebP images, ~400×250px, from the Figma reference Vova shared.
Place in `public/images/equipment-types/`.

**Step 3 — Update TypeCard (`app/parts-diagrams/_components/type-card.tsx`):**
Add optional `imageUrl?: string` prop.
When set: render `<Image src={imageUrl} alt={type.label} ... />` instead of the generic icon.
When not set: render the existing icon (graceful fallback — no broken layout).

**Step 4 — Inject in brand landing (`app/parts/brand/[slug]/page.tsx`):**
When building the TypeCard list from `types`, look up `EQUIPMENT_TYPE_IMAGES[t.slug]`
and pass it as `imageUrl` to each TypeCard.

**Rules:**
- Use Next.js `<Image>`, not `<img>`.
- Descriptive `alt` text on every image.
- First 4 TypeCards (above-fold): `priority={true}`. Below-fold: lazy (default).
- No hardcoded hex — use Moby DS tokens for any overlay/caption backgrounds.

**Verify:**
- `/parts/brand/ferris` → "Commercial Mowers" card shows a mower image (not hex icon)
- `/parts/brand/new-holland` → existing NH brand page has no regression
- TypeCard with no matching slug still renders the existing icon (no broken layout)
- `bun run type-check` passes

---

### OLG-5 · Fix Ferris commercial mower selection flash
**Owner: Oleg** · Repo: CROP-front · Depends on: OLG-1 + DAN-1 (Ferris routes clean)

**Impact:**
John selected a Ferris commercial mower config and saw a visual flash before the page settled. This happens in the Friday ownership demo. One visible glitch on the flagship new brand is enough to lose confidence in the whole platform.

**How to reproduce:**
1. Dev: `/parts-diagrams/ferris`
2. Find "Commercial Mowers" group
3. Click a 59-series config card
4. Observe the flash before the assembly list settles

**Diagnose before coding:**
Open Chrome DevTools → Performance → record the click. Which element flashes?
Is it the full page? A specific section? An image loading late?

**Common root causes in Next.js App Router:**

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Whole page flashes white | `loading.tsx` fallback showing before data | Add skeleton that matches page dimensions |
| Specific section disappears then reappears | `useEffect` toggling visibility on mount | Remove the effect or initialise state correctly |
| Image pops in after layout | No `priority` on above-fold images causing LCP shift | Add `priority={true}` |
| Text shifts | Font FOUT or dynamic className mismatch | Check `className` for SSR/client mismatch |

**Check these files:**
- `app/parts-diagrams/loading.tsx` — does the skeleton match the actual model-list layout?
- `app/parts-diagrams/[brand]/page.tsx` — any `useEffect` or Suspense fallback?
- `app/parts-diagrams/[brand]/_components/brand-model-groups.tsx` — any state that changes on mount?

**Verify:**
- Navigate Ferris → Commercial Mowers → click any 59-series model → no visible flash (CLS ≈ 0 in Lighthouse)
- Same on mobile (375px, Slow 4G throttle in DevTools Network tab)
- Existing Playwright tests do not regress

---

### DEN-1 · 4-brand end-to-end smoke test
**Owner: Denis** · Both repos · Depends on: OLG-1 + DAN-1 merged to dev

**Impact:**
This is the gate before production deploy. If Denis doesn't run this, we go to prod blind. John said the whole point of having Denis on QA is so the team doesn't discover bugs after deploy.

**Pull latest `dev` branch. For each brand run this checklist:**

**Brand: ferris / ventrac / mchale / marcrest**

Brand landing page (`/parts/brand/{slug}`):
- [ ] Page renders — no 404, no 500, no blank white screen
- [ ] Viewport 375px — no overflow, no cut-off elements
- [ ] Viewport 1280px — layout intact
- [ ] Brand name visible in the hero header
- [ ] At least 1 TypeCard visible (or graceful "coming soon" empty-state — NOT a broken grid)
- [ ] "Search all parts" CTA → clicks through to `/parts?manufacturer=...`
- [ ] Serial search widget visible
- [ ] No JS errors in browser console (DevTools → Console)
- [ ] `<meta name="robots">` → `noindex,follow` (not `noindex,nofollow`)

Parts-diagrams page (`/parts-diagrams/{slug}`):
- [ ] Page renders — no 404, no 500
- [ ] Model group grid visible (or graceful empty-state)
- [ ] At least 1 model card is clickable

Assembly page (click a model → click an assembly):
- [ ] Schematic/viewer loads — image visible
- [ ] BOM table shows at least 1 part row
- [ ] "Add to cart" visible (or login prompt — not a JS error)

**For every failed item (✗):**
Open a GitHub issue in the relevant repo:
```
## Impact
[One paragraph: what breaks for the user, why it matters]

## Steps to reproduce
1. ...

## Expected
...

## Actual
...
```
Assign to Oleg (FE issue) or Daniil (BE issue). Label: `goal/obj-03`, priority: `high`.

---

### DEN-2 · PR local test runs
**Owner: Denis** · Both repos · Ongoing throughout sprint

**For every PR before Vova reviews it:**

1. `git fetch && git checkout <branch-name>`
2. `bun install` (only if `package.json` or `bun.lock` changed)
3. `bun run dev` (CROP-front) or `bun run dev` (CROP-search-hono)
4. Navigate to the affected routes
5. Verify the acceptance criteria listed in the PR description
6. Check two viewports: **375px** and **1280px**
7. CROP-front: `bun run type-check` must pass
8. CROP-front: `bun test <changed-test-file>` for any co-located `.test.ts` changed
9. CROP-search-hono: `bun run test` must pass + `bun run typecheck`

**Comment on the PR:**
- Pass: `"Local test: PASS — acceptance criteria verified at 375px and 1280px"`
- Fail: `"Local test: FAIL — [specific thing broken with steps to reproduce]"`

Do not approve. Denis's comment is the signal for Vova to begin final review.

---

### DEN-3 · Navigation smoke (OLG-2 + OLG-3 sign-off)
**Owner: Denis** · Repo: CROP-front · Depends on: OLG-2 and OLG-3 PRs submitted

**Desktop circular loop check (for OLG-2):**

On Chrome desktop (1280px):
1. `/parts-diagrams/ferris`
2. Click any model card
3. Click any assembly
4. Click every link on the assembly page (breadcrumbs, any "back" button, brand name link)
5. **Pass:** "Ferris" breadcrumb → `/parts-diagrams/ferris` (not `/parts-diagrams`)
6. **Pass:** No single click sends you back to the page you were already on
7. Repeat for Ventrac and McHale

**Mobile drawer check (for OLG-3):**

Chrome DevTools → Dimensions: iPhone SE (375×667):
1. Navigate to any assembly page: `/parts-diagrams/ferris/{modelCode}/assemblies/{assemblyCode}`
2. **Pass:** A "Browse Diagrams" button (or similar trigger) is visible without scrolling
3. Tap it → **Pass:** drawer opens showing diagram section images (not just text)
4. Tap any image → **Pass:** schematic viewer shows that section; drawer closed
5. Pinch-zoom the schematic → **Pass:** still works (not frozen)
6. Tap outside drawer → **Pass:** closes cleanly; schematic still pannable

---

### VOA-1 · Confirm Marcrest in brand_vocabulary table
**Owner: Vova** · DB task · Run in parallel with DAN-1

**Impact:**
`brand_vocabulary.is_carried` is hono's primary source for carried-brand status.
If MAR has no row, hono falls back to `STATIC_CARRIED_WHITELIST` — which works after
DAN-1, but the `displayName` won't be available from the DB. Best to have both.

**Run on the production/dev Cloud SQL instance:**
```sql
INSERT INTO brand_vocabulary (code, name, is_carried)
VALUES ('MAR', 'Marcrest', true)
ON CONFLICT (code) DO UPDATE SET is_carried = true, name = 'Marcrest';
```

**Also check Marcrest data exists:**
```sql
SELECT COUNT(*), product_line
FROM models
WHERE product_line ILIKE '%marcrest%'
   OR product_line ILIKE '%MAR%'
GROUP BY product_line;
```
If 0 rows: the brand page will render a graceful empty-state ("Marcrest parts diagrams are not available yet"). This is acceptable for V2 — the page won't 404 or 500.

---

### VOA-2 · Ferris 59-number slug fix (if needed)
**Owner: Vova** · DB task · Depends on: DAN-3 investigation result

**If Daniil confirms that Ferris 59-series models have empty `slug` in the `models` table:**

```sql
-- Verify first — check which rows are affected:
SELECT model_code, model_number, slug
FROM models
WHERE product_line = 'FERRIS'
  AND model_number LIKE '59%'
  AND (slug IS NULL OR slug = '')
LIMIT 20;

-- If rows exist with empty slug, generate slug from model_number:
UPDATE models
SET slug = LOWER(REGEXP_REPLACE(model_number, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE product_line = 'FERRIS'
  AND model_number LIKE '59%'
  AND (slug IS NULL OR slug = '');
```

After the update: trigger cache refresh on dev hono instance:
```bash
curl -X POST https://{hono-dev-url}/admin/cache/refresh \
  -H "Authorization: Bearer ${ADMIN_REFRESH_TOKEN}"
```

Then notify Daniil to re-verify DAN-3 acceptance criteria.

---

### VOA-3 · Final PR review checklist
**Owner: Vova** · All PRs

For every PR after Denis comments "Local test: PASS":

**Code quality:**
- [ ] No `React.memo` / unjustified `useMemo`/`useCallback`
- [ ] All colors via Moby DS tokens — no hardcoded hex values
- [ ] No `Co-Authored-By:` footer, no AI attribution, no emoji in commits
- [ ] No Cyrillic characters in source files
- [ ] Impact statement in PR description body

**Brand safety:**
- [ ] Any new brand entry has `seoIndexed: false` — **never `true` without John's explicit approval**
- [ ] Any new brand has `available: true` for V2 activation
- [ ] Canonical slug: lowercase, no spaces, no special characters

**Navigation (B-track PRs):**
- [ ] Desktop: breadcrumb depth ≤ 4 at every level
- [ ] Mobile: no overflow, no elements cut at screen edges
- [ ] Touch targets ≥ 44×44px on all interactive elements

**Search (C-track PRs):**
- [ ] No changes to `brand-safety.ts` scope (CNH family only — do not expand)
- [ ] `getBrandDisplayName` must never return "UNK" for a registered brand

---

### VOA-4 · Production deploy
**Owner: Vova** · Depends on: DEN-1 smoke all ✓

Once Denis's smoke checklist is fully ✓ on `crop-dev.app`:

1. Confirm with John: "V2 smoke passed — deploying to prod. 4 brands: Ferris, Ventrac, McHale, Marcrest."
2. Tag the commit: `git tag v2.0.0-brands && git push origin v2.0.0-brands`
3. Deploy `dev` → prod
4. Spot-verify each brand on `crop.clintontractor.net`:
   - `/parts/brand/ferris` — 200, brand content visible
   - `/parts/brand/ventrac` — 200
   - `/parts/brand/mchale` — 200
   - `/parts/brand/marcrest` — 200
5. Confirm to John: ready for ownership demo.

---

## Definition of Done

A brand is **production ready** when all of these are true:

- [ ] `/parts/brand/{slug}` → 200, brand name + TypeCards visible
- [ ] `/parts-diagrams/{slug}` → 200, model grid visible (or graceful empty-state)
- [ ] At least one assembly diagram loads end-to-end
- [ ] No JS console errors at 375px and 1280px
- [ ] No circular breadcrumb loops (brand crumb points to brand page, not diagrams root)
- [ ] Ferris: at least 3 commercial mower 59-series models clickable and loading
- [ ] Denis ran the smoke checklist — all items ✓
- [ ] Vova reviewed and merged the PR
- [ ] Verified on `crop-dev.app` before pushing to prod

**Brands covered:** Ferris · Ventrac · McHale · Marcrest
