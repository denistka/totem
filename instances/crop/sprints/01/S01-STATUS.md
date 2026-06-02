# S01 Sprint Status

Date: 2026-05-28  
Sprint: S01 — Open Bug Backlog Triage and Reproduction Sweep  
Issues total: 84 open bug issues  
Processed: **84 / 84 — SWEEP COMPLETE**

---

## Pass 3 Results (2026-05-28 — 45 issues, sweep complete)

3 passes total across all 84 open bug issues. Pass 3 covered all remaining untriaged issues.

**POSSIBLY-FIXED → moving-to-close/ (3 new):**
- `#316` — Cart hydrate backfill (`cart-legacy-hydrate.tsx` implements backfill with explicit `#316` comment)
- `#479` — ShippingEstimateLine stabilized (used on PDP + cart, CT-950 comment confirms wiring)
- `#539` — UC-D-21 classification re-check (test spec `review-page-content.classification-recheck.test.tsx` explicitly covers it)

**REPRODUCED — code-only fixes ready (8):**
- `#1254` — Crawler missing `AbortSignal.timeout(30s)` in `scripts/pr-soft-404-crawler.ts:checkUrl()`
- `#1255` — Staff inventory fetch missing `AbortSignal.timeout` in `lib/staff/fetch-inventory.ts`
- `#525` — Mobile nav phantom focusables on desktop (`lg:hidden` without `inert`)
- `#511` — `requiresTruck` in data layer but never shown in any customer-facing UI component
- `#499` — No tax preview on `/checkout/review` (only "calculated at checkout" note — confirmed)
- `#667` — Legacy `/parts/{N}/C?asm=` URLs confirmed 404 (curl test; no handler exists)
- `#826` — Search URL still query-param-only (no slug-based format found)
- `#1292` — `request-utils.ts` silently clamps via `Math.min` (no 400 returned to caller)

**OUT-OF-SCOPE — backend only (5):** `#156, #524, #564, #970, #971, #972`

**NEEDS-HUMAN-VERIFY:** 28 remaining (prod access, real orders, Sentry, Lighthouse)

---

## Track gates

| Track | Gate | Output |
|---|---|---|
| T1 Baseline + priority queue | DONE | processed/S01-T1-TRIAGE-PASS-1.md |
| T2 Repro P0/P1 | DONE | processed/S01-T2-TRIAGE-PASS-2.md |
| T3 Stale/duplicate pass | DONE | processed/DUPLICATES-1296-1297.md |
| T4 Navigation/UX sweep | DONE | processed/S01-T1-TRIAGE-PASS-1.md (UX section) |
| T4 + Pass 3 remaining | DONE | processed/S01-T3-TRIAGE-PASS-3.md |
| T5 Closure proposals pack | LOCKED | dep: human review of moving-to-close/ |

---

## Moving-to-close (11 files — do NOT push until "push issues to github")

| File | Issue | Status |
|---|---|---|
| `907-kenect-mobile-overlay.md` | #907 | CLOSED ✓ (2026-05-28) |
| `841-category-tiles-dead-end.md` | #841 | CLOSED ✓ (2026-05-28) |
| `848-home-hero-dead-chips.md` | #848 | CLOSED ✓ (2026-05-28) |
| `523-guest-first-order-discount.md` | #523 | STILL OPEN — discount not rendered on Review page (verified crop-dev.app 2026-05-28) |
| `1252-search-timeout.md` | #1252 | CLOSED ✓ (2026-05-28) |
| `1252-search-timeout-15s.md` | #1252 | CLOSED ✓ (2026-05-28, duplicate file) |
| `1007-channel-leak-mobile.md` | #1007 | CLOSED ✓ (2026-05-28) |
| `636-pdp-service-unavailable.md` | #636 | CLOSED ✓ (2026-05-28) |
| `316-cart-hydrate-backfill.md` | #316 | CLOSED ✓ (2026-05-28) |
| `479-shipping-estimate-line.md` | #479 | CLOSED ✓ (2026-05-28) |
| `539-uc-d-21-classify.md` | #539 | POSSIBLY-FIXED — 8 tests all `todo`, no CI coverage; comment left on GH 2026-05-28 |

---

## Pending — needs real order / human session

- **#971** DIS pushOrder payload — needs real order (OUT-OF-SCOPE: backend)
- **#562** CT hardcoded tracking — needs real CT-delivery order (NEEDS-HUMAN-VERIFY)
- **#920** UPS overcharge — needs real heavy-item order (NEEDS-HUMAN-VERIFY)
- **#509** Pack-buy invariant — needs prod checkout with pack item (NEEDS-HUMAN-VERIFY)

## Pending — needs human device

- **#921** CLOSED ✓ 2026-05-28 — recheck on iPhone iOS Safari: all surfaces (Home search, /parts-diagrams, checkout ZIP/address) accept typing correctly. Prior session report superseded.

## Pending — needs human visual / prod access

### Confirmed from code (ready for implementation — no prod access needed)

- **#1171** Sentry release tag — CONFIRMED 2026-05-28: `release:` missing in `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation-client.ts`. Also `ignoreErrors: ["Network request failed", "Load failed"]` in `instrumentation-client.ts` suppresses checkout/payment failures.
- **#1256** upstream.timeout tag — CONFIRMED 2026-05-28: `lib/search-service/http-client.ts:123` `normalizeRequestError` AbortError branch throws `SearchServiceTimeoutError` with no Sentry tag/extras.
- **#1133** Auth demotion — CONFIRMED 2026-05-28: `app/actions/stock-alert.ts:17` `currentUser().catch(() => null)` and `app/actions/part-request.ts:293` `auth().catch(() => ({ userId: null }))` swallow Clerk errors.
- **#1170** Gateway swallowed errors — CONFIRMED 2026-05-28: `app/api/gateway/[...path]/route.ts:115` catch returns 502 with `console.error` only, no `captureException`. Also affects `app/actions/cart.ts`, `payment-methods.ts`, `delivery.ts`, `addresses.ts`, `api/cron/backstock-check/route.ts`, `api/chat/route.ts`.

### Pending — needs human visual / prod access

- **#632/#633** Parts-diagrams chapters — need real `assemblyCode` from prod
- **#1264/#1265** React crashes — check current Sentry event rate
- **#1278** CRON_SECRET missing — Vercel env vars dashboard
- **#1191** Slow sign-out — intermittent; check Clerk + React 19 ViewTransition
- **#658** 5,946 blank status_code pages — Vercel logs + crawl re-run
- **#659** orphan PDP top-30 — prod crawl classification
- **#1085** email diverges from Clerk email — real logged-in checkout
- **#521** radio UI unchecked after navigation — interactive checkout test
- **#1298/#1297** Shard failures — Sentry + Vercel logs
- **#1296** pagination_overflow — Sentry current rate

---

## Reproduced — ready to fix (code-only fixes)

| # | Issue | Fix |
|---|---|---|
| #1254 | Crawler: missing AbortSignal.timeout(30s) | `scripts/pr-soft-404-crawler.ts:checkUrl()` |
| #1255 | Staff inventory: missing AbortSignal.timeout | `lib/staff/fetch-inventory.ts` |
| #525 | Mobile-nav tabbable on desktop | Add `inert` to `MobileNav` on desktop viewport |
| #511 | requiresTruck not surfaced in UI | Show badge in `product-purchase-panel.tsx` + cart |
| #499 | No tax preview on /checkout/review | Add Stripe Tax estimate line or prominent note |
| #1257 | Equipment slug loading.tsx missing | Create `app/equipment/[slug]/loading.tsx` |
| #667 | Legacy /parts/{N}/C?asm= URLs 404 | Add redirect handler for C?asm= param pattern |
| #1292 | MAX_PAGE_SIZE silent clamp | Return 400 instead of Math.min in request-utils.ts |
| #826 | Search URL not SEO-friendly | Requires URL schema redesign (larger effort) |
| #504 | Emoji hook false-positives on .webp | Add `.webp` to `scripts/check-emoji.ts` exclusion list |

---

## Closed via test-pass / visual-QA evidence

| # | Date | Evidence |
|---|---|---|
| #510 | 2026-05-28 | `shipping-form.continental.test.tsx` rejects ZIP 006 (PR) / 008 (USVI); 15/15 pass |
| #538 | 2026-05-28 | Same test rejects state=AK/HI, ZIP 995/967; 15/15 pass |
| #824 | 2026-05-28 | iPhone iOS Safari visual QA — backdrop overlay no longer blocks taps (commits d124e4a7, 940a39b3) |
| #904 | 2026-05-28 | Lighthouse desktop: CLS = 0.031 on 3 equipment slugs (target <= 0.1); commit a7439096 |
| #951 | 2026-05-28 | Lighthouse desktop: CLS = 0.021 on /parts (target <= 0.25) |

## Duplicates — closed

| Closed | Kept | Date |
|---|---|---|
| #1270 | #1297 | CLOSED ✓ (2026-05-28) — ProductFeed shard failures dup |
| #1269 | #1296 | CLOSED ✓ (2026-05-28) — assembly.pagination_overflow dup |
| #1271 | #1298 | CLOSED ✓ (2026-05-28) — ImageSitemap shard 0 dup (confirmed) |

---

## Out-of-scope (not frontend)

### Closed 2026-05-28 (refile in CROP-parts-services if still relevant)
- #156, #524, #564, #570, #565, #970, #971, #972 — CLOSED ✓ (8 backend issues)

---

## T5 unlock criteria

1. Real-order items: #971 CLOSED (OOS backend), #562 + #920 still need real heavy/CT-delivery order
2. PDP → Add to cart flow verified (T4) ← COMPLETE
3. Representative Lane B sweep complete ← COMPLETE (Pass 3 done)

**T5 unlocks when human verifies remaining real-order items (#562, #920).**
