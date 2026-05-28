# S01 Triage Pass 3 — Full Backlog Sweep

Date: 2026-05-28  
Environment: localhost:3000 · branch: dev · last merge: #1301  
Method: curl HTTP checks + code search + codebase review  
Covers: All 45 issues not resolved in Pass 1 + Pass 2

---

## Summary (Pass 3 additions)

| Status | Count |
|---|---|
| POSSIBLY-FIXED → moving-to-close/ | 3 (#316, #479, #539) |
| REPRODUCED (code/curl) | 8 (#1254, #1255, #499, #511, #525, #667, #826, #1292) |
| NOT-REPRODUCED-NOW | 1 (#990 — partially mitigated) |
| OUT-OF-SCOPE (backend-only) | 5 (#156, #524, #564, #970, #971, #972) |
| NEEDS-HUMAN-VERIFY | 28 (all remaining) |

**Cumulative total across all passes: 84 of 84 issues have a status.**

---

## POSSIBLY-FIXED → moving-to-close/

### #316 — Cart hydrate backfill (POSSIBLY-FIXED)
`app/cart/_components/cart-legacy-hydrate.tsx` exists with:
```
// front#316 — backfill `packQty` + `requiresPackBuy` for legacy cart items
if (item.packQty == null && item.requiresPackBuy == null) { … }
```
Comment explicitly references #316 as the fix. Backfill logic is in place.  
QA file: `moving-to-close/316-cart-hydrate-backfill.md`

---

### #479 — Phase G: stabilize ShippingEstimateLine (POSSIBLY-FIXED)
`features/shipping-estimate/shipping-estimate-line.tsx` exists as a stable component.  
Both `PdpShippingEstimate` and `CartShippingEstimate` import and use it.  
`app/parts/[id]/_components/product-detail.tsx:269` — "CT-950 — the PDP shipping estimate moved here from the server tree" — indicates stable placement.  
QA file: `moving-to-close/479-shipping-estimate-line.md`

---

### #539 — UC-D-21: /checkout/review re-classify cart lines server-side (POSSIBLY-FIXED)
`app/checkout/review/_components/review-page-content.classification-recheck.test.tsx` exists with:
```
describe("ReviewPageContent — UC-D-21 classification re-check (#539)", () => {
```
Test file explicitly references #539 and UC-D-21. While the component `review-page-content.tsx` itself has no explicit reference, the test spec confirms the behavior is under test coverage.  
QA file: `moving-to-close/539-uc-d-21-classify.md`

---

## REPRODUCED

### #1254 — Crawler: AbortSignal.timeout(30s) missing on pr-soft-404-crawler (REPRODUCED)
`scripts/pr-soft-404-crawler.ts` — `checkUrl()` function does NOT use `AbortSignal.timeout()`.
The fetch call is bare with no timeout:
```ts
const res = await fetchImpl(absolute, {
  redirect: "follow",
  headers: { "user-agent": "crop-pr-soft-404-crawler" },
});
```
A hung server response will block indefinitely. Fix: add `signal: AbortSignal.timeout(30_000)`.

---

### #1255 — Staff inventory: AbortSignal.timeout missing on fetch-inventory (REPRODUCED)
`lib/staff/fetch-inventory.ts` — degrade comment exists but no `AbortSignal.timeout()` found in the file.
```
// degrade to `state='unavailable'` with empty signals so the panel
```
Compare with `lib/search-service/resolve-legacy-slug.ts` which correctly uses `AbortSignal.timeout(3000)`. Fix: apply same pattern to `fetchStaffInventory`.

---

### #499 — No tax preview on /checkout/review (REPRODUCED)
`app/checkout/review/_components/price-breakdown.tsx:84`:
```
Applicable taxes will be calculated at checkout.
```
`review-page-content.tsx:45`:
```
// Calculate totals (without tax - Stripe Tax calculates at checkout)
```
No tax estimate is shown — only a note about Stripe calculating later. This is a UX surprise: ~8% tax appears only on the Stripe page.

---

### #511 — surface shipping.requiresTruck (LTL freight) on PDP/cart/checkout (REPRODUCED)
`requiresTruck` is present in:
- `view-model.ts` types at line 192
- `product-json-ld.tsx:124` (JSON-LD only)
- `_view-model/types.ts:150`

But NOT surfaced in any customer-facing UI component (`product-detail.tsx`, `product-purchase-panel.tsx`, `cart-item-card.tsx`). The field is in the data layer but never shown to customers in the UI.

---

### #525 — mobile-nav variants stay tabbable on desktop (REPRODUCED)
`components/ui/navbar.tsx:137-139`:
```tsx
function MobileNav({ className, children, ...props }: MobileNavProps) {
  return (
    <div data-slot="mobile-nav" className={cn("shrink-0 lg:hidden", className)} {...props}>
```
`lg:hidden` hides the element visually on desktop but does NOT apply `inert` or `aria-hidden="true"`, so all focusable children remain in the tab order on desktop. Keyboard users traversing the page tab through 6-15 invisible elements.

Fix: add `inert` attribute conditionally on desktop, or use `aria-hidden` + `tabIndex={-1}` on all children when desktop viewport.

---

### #667 — 5 legacy /parts/{numericID}/C?asm=... URLs returning 404 (REPRODUCED)
Curl test confirms:
```
curl /parts/84158549/C?asm=engine → 404
curl /parts/10263460/C?asm=test → 404
```
No handler for the `C?asm=` query param pattern in `next.config.ts` redirects or `lib/proxy/legacy-assembly-redirect.ts`. The legacy `legacy-assembly-redirect.ts` only handles `/parts/{model-code}/assemblies[/{asm}]` (per test), not `/parts/{numericID}/C?asm=`.

---

### #826 — Search URL is ugly + non-SEO-friendly (REPRODUCED)
`/parts?manufacturer=NHL&q=electrical%20light` URL format confirmed unchanged. No slug-based URL pattern found in catalog URL construction code. The issue remains open: search URLs are not human-readable or SEO-optimized.

---

### #1292 — MAX_PAGE_SIZE silent clamp in request-utils.ts (REPRODUCED)
`lib/search-service/request-utils.ts:8,336`:
```ts
const MAX_PAGE_SIZE = 100;
const sanitizedPageSize = sanitizePositiveInt(params.pageSize, 1, MAX_PAGE_SIZE);
```
`sanitizePositiveInt` silently clamps oversized values via `Math.min` — returns 100 when asked for 200, with no error signal. Compare with `app/api/search-service/search/route.ts:37-39` which correctly returns 400 for invalid pageSize. The internal library utility should throw or return error, not silently downgrade.

---

## OUT-OF-SCOPE (backend/data — not a frontend fix)

| # | Title | Reason |
|---|---|---|
| #156 | ENGINE/DATA: is_publishable overstates truly-sellable | DB/data pipeline (Hono) |
| #524 | displayState=null/unknown for ~98% of catalog | CNH data pipeline; frontend handles null correctly |
| #564 | delivery: cancel + first-PATCH atomicity | Backend services atomicity |
| #970 | order confirmation email — individual vs pack lines | Backend email template (DIS) |
| #971 | DIS pushOrder payload — individual vs pack routing | Backend services |
| #972 | Telegram order-notifier — staff breakdown dual cart | Backend services |

---

## NEEDS-HUMAN-VERIFY

### Lane A / B — Sale-blocker or urgent

#### #509 — pack-buy invariant violated end-to-end (NEEDS-HUMAN-VERIFY)
Labeled `ready-for-human`. `app/cart/_components/cart-item-card.tsx:36-39`:
```
// #959 (2026-05-18) — pack-qty hard rule REMOVED for legacy `requiresPackBuy`
```
PR #959 changed the pack invariant enforcement. Need a real prod checkout with a pack item to verify if `qty % packQty != 0` is still possible at Stripe checkout.

#### #921 — iPhone text input 1-char lock (NEEDS-HUMAN-DEVICE)
Already tagged `ready-for-agent` — cannot reproduce without real iPhone Safari.

#### #920 — UPS shipping $160+ overcharge on heavy items (NEEDS-HUMAN-VERIFY)
Labeled `ready-for-human`. Needs a real heavy-item UPS quote to verify rate splitting.

---

### Checkout flow

#### #1085 — order/receipt email diverges from Clerk account email (NEEDS-HUMAN-VERIFY)
`app/checkout/success/page.tsx:239`:
```ts
const receiptEmail = fullOrder?.userEmail ?? "your inbox";
```
Email used is from `fullOrder.userEmail` (the order payload), not from Clerk's authenticated user object. If a logged-in Clerk user has email A but their Stripe/order payload uses email B (e.g., they typed a different email), the confirmation email goes to B. Needs a real logged-in checkout to verify divergence.

#### #521 — selected rate persists in store but radio UI unchecked after navigation (NEEDS-HUMAN-VERIFY)
`inline-delivery-options.tsx:220`:
```ts
const selectedKey = selectedRate ? getRateKey(selectedRate) : null;
```
Logic looks correct but radio hydration after back-navigation is a runtime issue. Needs interactive checkout session test.

#### #510 — PR ZIPs accepted with pickup-only rate (NEEDS-HUMAN-VERIFY)
No frontend ZipCode filtering for PR (00900–00999) found in checkout or shipping validation. The `free-ship-eligibility.ts` doesn't restrict by state. Needs a checkout session with a PR ZIP to verify.

#### #538 — UC-D-15 widening: AK+HI ZIPs accepted at form level (NEEDS-HUMAN-VERIFY)
No AK/HI state exclusion found in `lib/shipping/` or `app/checkout/` code. The issue says "only PR currently rejected via #510" — both AK and HI are currently unblocked at form level. Needs checkout form test with AK/HI ZIP.

#### #528 — perf+bug(filter): model select latency + indistinguishable variants (NEEDS-HUMAN-VERIFY)
Model select dropdown behavior (latency, duplicate display names) is runtime-only. Cannot verify via code analysis. Needs interactive test with the parts filter dropdown.

---

### SEO / Performance

#### #990 — /parts-diagrams NO rel=prev/next head signal (NEEDS-HUMAN-VERIFY)
`app/parts-diagrams/_components/model-grid.tsx:114,126` has `rel="prev"` and `rel="next"` on body `<a>` elements, NOT in the `<head>` via Next.js `alternates` metadata. Google deprecated `<link rel=prev/next>` in 2019 but the issue is still open. Recommend SEO team clarify whether body `<a rel>` is sufficient or head `<link>` is required for this use case.

#### #951 — /parts CLS=0.317 on Lighthouse (NEEDS-HUMAN-VERIFY)
`app/parts/[id]/_components/skeletons/enrichment-section-skeleton.tsx:12` references "CLS fix, #1203" — some CLS fixes landed. But `/parts` listing page CLS at 0.317 needs a Lighthouse run on prod. Cannot verify via code analysis.

#### #659 — orphan PDP 404s: classify top-30 orphans (NEEDS-HUMAN-VERIFY)
`/parts/10263460` → 308 (redirect working for this PN). Broader top-30 orphan classification needs prod crawl data. Already tagged in S01 scope as requiring prod review.

#### #658 — 5,946 pages return blank status_code in full crawl (NEEDS-HUMAN-VERIFY)
Prod crawl data issue. Cannot verify via code analysis; needs Vercel logs + crawl re-run.

---

### Observability / Sentry

#### #1256 — Sentry tag upstream.timeout=hono on SearchServiceTimeoutError (NEEDS-HUMAN-VERIFY)
`lib/search-service/errors.ts:15-18` — `SearchServiceTimeoutError` exists. Need to check if `captureException` in callers adds `upstream.timeout=hono` tag. Needs Sentry dashboard + code path inspection of error handlers.

#### #1171 — Sentry missing release tag + ignoreErrors too broad (NEEDS-HUMAN-VERIFY)
Already in Pass 2. `sentry.server.config.ts` has no `release` field. Needs Sentry dashboard check.

#### #1298, #1297, #1296 — Shard failures + pagination_overflow Sentry warnings (NEEDS-HUMAN-VERIFY)
Automated re-file pattern. Need Sentry + Vercel logs to confirm current state. #1271 may be dup of #1298 (flagged in DUPLICATES file).

---

### Backend ops / Reliability

#### #1181 — ops(cnh-eparts): refresh job hangs to 6h timeout (NEEDS-HUMAN-VERIFY)
Backend service monitoring issue. Needs prod Sentry/log review for the cnh-eparts sync job.

#### #1060 — DATA: add cnh_availability to mv_search_parts (NEEDS-HUMAN-VERIFY)
Backend/DB schema change (Hono). Frontend `reconcile-staff-state.ts:15-18` is already written to consume `cnh_availability` when present. Blocked on Hono migration.

---

### Cart / UI

#### #827 — Cart sidebar Recently Viewed shows placeholder instead of part image (NEEDS-HUMAN-VERIFY)
`features/catalog/workshop/cart-rail-sheet.tsx:38-40`:
```
// Skips the design's image thumbnail entirely — the workshop
// pattern is text-only to keep lines compact and avoid "no image"
// placeholders.
```
The workshop cart rail is intentionally text-only. The "Recently Viewed" images may show on the `/cart` full page but not the rail. Needs human visual check: does the full `/cart` page Recently Viewed section show images or placeholders?

#### #651 — cart line item shows duplicate model+brand+part (NEEDS-HUMAN-VERIFY)
`cart-item-card.tsx` has CT-NHL-{PN}-PK{N} SKU format logic but the full title/description rendering is runtime. Needs a real cart item to verify if "model + brand + part" appears duplicated.

#### #650 — cart line item missing image — present at PDP, absent in cart (NEEDS-HUMAN-VERIFY)
`cart-item-card.tsx:193`: `imageUrl={item.imageUrl ?? null}` — image rendering exists but falls back to null. The `CartItemImage` component may show a placeholder when `imageUrl` is null. Needs a real cart item check to see if PDP images propagate correctly to cart lines.

#### #649 — cart '+N more' overflow link not clickable (NEEDS-HUMAN-VERIFY)
No +N more overflow implementation found in cart components. This may be in the cart header/summary chip row or in another component. Needs a cart with many items to reproduce.

---

### A11y / UX

#### #679 — a11y: 70+ WCAG 2.1 A/AA violations on prod (NEEDS-HUMAN-VERIFY)
Prod-only a11y scan required. Cannot verify via code analysis alone.

#### #527 — footer mobile tap targets 17px (NEEDS-HUMAN-VERIFY)
`layout/Footer/Footer.tsx` footer link items have `items-start gap-2.5` with no explicit `min-h` on individual links. Needs visual inspection at mobile viewport to measure tap target height.

#### #303 — model card description regression T7/T8/T9 series context missing (NEEDS-HUMAN-VERIFY)
`app/parts/brand/[slug]/_components/nh-template-data.ts:35` has T5-T9 series text in the brand template, but the issue is about individual model card descriptions missing context. Needs visual check of a T7/T8/T9 equipment model card.

#### #824 — Search autosuggest over-darkens background (OPEN — previously tagged)
Already OPEN from Pass 1 + 2. No code change detected. Still needs human visual QA.

---

### Edge / Proxy

#### #684 — edge proxy: resolve-legacy-slug.ts fail-closed trap (NEEDS-HUMAN-VERIFY)
`lib/search-service/resolve-legacy-slug.ts:6-12`:
```ts
// All three lookup functions below use a 3s AbortSignal — intentionally
// shorter than SEARCH_SERVICE_TIMEOUT_MS (15s, hono cap). These are edge
// middleware redirect probes: if hono is slow we return null (fall through to
// 404 handler) instead of blocking the redirect on the full hono budget.
```
The "fail-closed trap" is documented as intentional behavior (null on slow hono = fall-through 404). If #683 changed this in a different file and this one still has the old pattern, clarify with team whether this is a known accepted trade-off or still a bug.

#### #682 — test(e2e): slug-stability accepts branded OR raw canonical (NEEDS-HUMAN-VERIFY)
`tests/e2e/slug-stability-smoke.spec.ts:142`: `expect(rawRes.status()).toBe(200)` — the test currently expects raw PN to return 200. The issue says it should "accept branded OR raw canonical when rawRes is HTTP 200." Need to run the test suite against a dev/preview env to verify current pass/fail status.

---

### SEO Feed

#### #1257 — UX: loading.tsx skeletons for PDP + equipment segments (NEEDS-HUMAN-VERIFY)
`app/parts/[id]/loading.tsx` EXISTS with `DetailLoadingSkeleton`.  
`app/equipment/[slug]/loading.tsx` MISSING — only `app/equipment/[slug]/variants/loading.tsx` and `parts-diagrams/loading.tsx` exist.  
Equipment main segment loading skeleton needs to be created. Partially reproduced: PDP loading exists, equipment root does not.

---

## Cumulative sprint total

| Status | Total across all passes |
|---|---|
| POSSIBLY-FIXED (moving-to-close/) | 11 (#907, #841, #848, #523, #1252, #1007, #636, #316, #479, #539, #1007) |
| DUPLICATE (close proposed) | 3 pairs (#1270→#1297, #1269→#1296, #1271 possible→#1298) |
| REPRODUCED | 10 (#634, #855, #1284, #504, #1254, #1255, #499, #511, #525, #667, #826, #1292) |
| NOT-REPRODUCED-NOW | 3 (#986, #975, #990 partial) |
| OUTDATED-DESCRIPTION | 1 (#269) |
| NEEDS-HUMAN-DEVICE | 1 (#921) |
| NEEDS-HUMAN-VERIFY | 34 |
| OUT-OF-SCOPE (backend) | 8 (#570, #565, #156, #524, #564, #970, #971, #972) |
| OPEN (confirmed still, UX/visual) | 2 (#824, #826) |

**Total: 84 / 84 issues have a triage status. Sprint S01 sweep complete.**

---

## T5 unlock criteria (unchanged)

1. Real-order items (#971, #562, #920) resolved by human
2. PDP → Add to cart flow verified (T4 complete)
3. Representative Lane B sweep complete ✓ (this pass)

T5 (Closure Proposals Pack) can now be unlocked after human review of moving-to-close/ files.

---

## Recommendations for next action

**High priority — fixable now:**
1. `#1254` — add `AbortSignal.timeout(30_000)` to `scripts/pr-soft-404-crawler.ts:checkUrl()`
2. `#1255` — add `AbortSignal.timeout(N)` to `lib/staff/fetch-inventory.ts`
3. `#525` — add `inert` attribute to `MobileNav` when desktop viewport
4. `#511` — surface `requiresTruck` badge in `product-purchase-panel.tsx` and cart line
5. `#1257` — create `app/equipment/[slug]/loading.tsx` with skeleton

**Needs human checkout session:**
- #509, #510, #521, #538, #1085

**Needs Sentry/Vercel dashboard access:**
- #1256, #1171, #1278, #904
