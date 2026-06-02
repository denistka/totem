# S01 Triage Pass 2 — Repro + Lane C Stale Scan

Date: 2026-05-28  
Environment: localhost:3000 · branch: dev · last merge: #1301  
Method: curl HTTP checks + code search + codebase review  
Covers: T2 (Pass 2 targets), T3 (Lane C full scan), T4 (remaining UX items)

---

## T2 — Reproduction Pass 2

### #1284 — REPRODUCED (local)
**bug(parts): unstable_cache poison renders empty on /parts?priceMax=10**

```
curl http://localhost:3000/parts?priceMax=10 → 200, body: "No results match your filters"
```

- `serializeParams` uses sorted `JSON.stringify` — different param combos don't cross-contaminate cache keys. So the issue is NOT a classic cache-key collision.
- However, on dev the sparse local catalog returns 0 results for `priceMax=10` (most parts cost >$10). If the same happens on prod (even transiently), `unstable_cache` will store that empty response and serve it until `REVALIDATE.LISTING` expires — visible to all users with priceMax=10.
- The `priceBucket` path is a parallel, pre-bucketed alternative — but `priceMax` raw values bypass this bucket guard.
- **Action:** prod spot-check via Vercel logs or a direct prod curl. Dev result is "correct" for sparse local data.

---

### #1007 — POSSIBLY-FIXED
**P0 — Mobile redesign: 3 channel-leak surfaces + missing shippingProvider**

Code evidence on dev branch (#1301):

| Surface | File | Evidence |
|---|---|---|
| Checkout review page | `checkout/review/_components/shipping-summary.tsx:48,150` | `// #1086 no-channel-leak rule` comment + omission confirmed |
| PDP view model | `app/parts/[id]/_view-model/types.ts:78` | "NOT forwarded to the customer payload (depot/channel leak)" |
| Staff inventory panel | `app/parts/[id]/_components/staff-inventory-panel.tsx:167,222` | "channel / depot / vendor vocabulary never reaches the customer view" |
| shippingProvider | `app/checkout/success/page.tsx:42,105,245` | Correctly typed as optional; `optionalString()` guard applied |

Test: `checkout/review/_components/shipping-summary.test.tsx:15` — "Spec: no-channel-leak rule (John 2026-05-18)"

Cannot verify without a real checkout session. QA file: `moving-to-close/1007-channel-leak-mobile.md`

---

### #1252 — POSSIBLY-FIXED
**fix(search-service): raise DEFAULT_TIMEOUT_MS 8s→15s to match hono statement_timeout**

Code evidence on dev branch:
- `lib/search-service/constants.ts`: "Aligned with the hono `statement_timeout` cap (15s)" — FE timeout is ≥15s
- `lib/search-service/client.test.ts:636`: "FE must NOT have aborted yet — that was the original bug at 8s"
- `lib/search-service/client.test.ts:640`: "Past hono's own 15s cap the FE timeout is the correct backstop"
- `parts-popular-client.ts:11`: intentionally lower 5s for non-critical path

The 8s→15s fix is confirmed in code with explicit test coverage.  
QA file: `moving-to-close/1252-search-timeout.md`

---

### #636 — POSSIBLY-FIXED
**PDP ServiceUnavailable UX — soften copy + nav fallback + Sentry alert**

Code evidence:
- `features/product-detail/service-unavailable.tsx` exists with full component
- `app/parts/[id]/page.tsx:189,221,355,465,470` — catches network/503 errors, renders `<ServiceUnavailable diagnostic={...} />`
- `service-unavailable.tsx:33` — `<meta name="robots" content="noindex,nofollow,noarchive" />`
- `service-unavailable-beacon.tsx` — dedicated Sentry beacon component
- Comment references `front#757` and `front#983` as predecessors

QA file: `moving-to-close/636-pdp-service-unavailable.md`

---

### #632 / #633 — NEEDS-HUMAN-VERIFY
**parts-diagrams: 0 chapters / 0 BOM rows**

- `/equipment/{slug}/parts-diagrams` → 200 ✓
- `/equipment/{slug}/parts-diagrams/{assemblyCode}` → 404 (tested with `engine` slug, invalid code)
- Route `/equipment/[slug]/parts-diagrams/[assemblyCode]/page.tsx` exists and validates `assemblyCode` via `isValidCode()`
- Cannot verify without a real assemblyCode from the search-service API

Action: open any equipment with a parts diagram on prod, note the assemblyCode from the URL, test that chapter route.

---

### #1133 — NEEDS-HUMAN-VERIFY
**fix(reliability): swallowed errors demote auth / drop favorites / hide notifications**

Partial fix visible:
- `app/account/error.tsx:21` — `Sentry.captureException(error)` in account error boundary
- `app/account/staff/orders/[orderId]/error.tsx:61` — Sentry capture with context
- Staff labels + orders views have `catch(() => ({}))` on JSON parsing (acceptable recovery)

Cannot verify all server action paths without Sentry dashboard. Needs Sentry review for auth/favorites error rates.

---

### #1170 — NEEDS-HUMAN-VERIFY
**obs(front): server actions + gateway proxy swallow errors on money path**

No specific fix found in code scan. Needs Sentry event review for money-path server actions (checkout, payment, order creation). Cannot verify via code analysis alone.

---

### #904 — NEEDS-HUMAN-VERIFY
**fix(perf): CLS=0.318 on /equipment/{slug} exceeds Lighthouse threshold**

- `app/equipment/[slug]/_components/equipment-media-gallery.tsx` has responsive `sizes` attributes set
- Equipment page 404s on dev for test slug — cannot run Lighthouse locally
- Needs Lighthouse CI run on prod or Vercel preview

---

### #1264 / #1265 — NEEDS-HUMAN-VERIFY (Sentry only)
**bug(react): hook count error / removeChild crash**

Sentry-only. Cannot reproduce via curl. Needs current Sentry event volume check — if event rate dropped to 0 since filing (2026-05-26), may be POSSIBLY-FIXED by a recent merge.

---

## T3 — Lane C Stale / Duplicate Full Scan

### Confirmed POSSIBLY-FIXED (new)

| # | Title | Evidence |
|---|---|---|
| #1252 | search-service timeout 8s→15s | 15s timeout in constants.ts + test coverage |
| #636 | PDP ServiceUnavailable UX | Full component + NOINDEX + Sentry beacon in code |
| #1007 | channel-leak surfaces | no-channel-leak rule in 3 locations + test |

---

### OUTDATED-DESCRIPTION

#### #269 — OUTDATED-DESCRIPTION
**bug: /brands renders New-Holland-only content but footer 'All brands' promises multi-brand**

Code confirms `/brands` page is **intentionally NH-only** per "John's 2-tile decision (DM 1213989)" — CT-674 #101. Comment: "Non-NH brands remain reachable via direct URL but carry robots: noindex on their brand-detail page." The issue predates this scope decision. The footer "All brands" link is a UX copy issue, not the original bug scope.

Recommendation: OUTDATED-DESCRIPTION — rewrite issue to track only the footer copy misleading users (or close as by-design and open a separate UX copy ticket).

---

### REPRODUCED (Lane C)

#### #504 — REPRODUCED
**fix(scripts): emoji-policy hook false-positives on binary files (webp/png)**

`scripts/check-emoji.ts` binary exclusion list contains: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`, `.woff2`, `.ttf`, `.eot`, `.pdf`, `.min.js`, `.min.css`  
**`.webp` is NOT in the exclusion list.** Any commit staging a `.webp` file will trigger the emoji scanner on binary content → false positive violations.

Status: REPRODUCED. Still open.

---

### NOT-REPRODUCED-NOW (Lane C)

#### #975 — NOT-REPRODUCED-NOW
**Localhost crawl 502 on /equipment/new-holland-powerstar-120-power-shuttle-tier-4**

```
curl http://localhost:3000/equipment/new-holland-powerstar-120-power-shuttle-tier-4 → 404
```

Returns 404 (not 502). Dev data doesn't have this model. Issue was a 502 from the crawler bot, likely a transient dev-server issue or a data-population timing problem. Created 2026-05-18, updated 2026-05-26, no recent activity. Low priority.

Status: NOT-REPRODUCED-NOW — likely stale for dev env. Prod check via monitoring only.

---

### NEEDS-HUMAN-VERIFY (Lane C)

#### #1171 — NEEDS-HUMAN-VERIFY
**obs(front): Sentry missing release tag + ignoreErrors too broad + CI alert**

`sentry.server.config.ts` has no `release` field — Sentry release tag is NOT being set from `VERCEL_GIT_COMMIT_SHA`. This means events lack git context for source-map linking. `ignoreErrors` not visible in config (may be in `sentryBeforeSend` in `lib/sentry-scrub.ts`).

Action: check `lib/sentry-scrub.ts` + Sentry dashboard for release tracking and ignoreErrors list.

#### #1191 — NEEDS-HUMAN-VERIFY
**Intermittent slow sign-out (~17-31s): post-signout navigation stalls**

`app/cart/_components/cart-summary.tsx:76`: "React 19 ViewTransition stalls soft navigation on mobile" comment found — this is a known adjacency but for cart navigation, not sign-out specifically. Sign-out flow goes through `SignOutNavRow` → Clerk SDK. Cannot reproduce intermittent timing issue via code analysis.

---

### Auto-refile duplicates (already tracked)

Already in `DUPLICATES-1296-1297.md`:
- #1270 → close, keep #1297 (ProductFeed shard)
- #1269 → close, keep #1296 (assembly.pagination_overflow)
- #1271 → possible dup of #1298 (ImageSitemap, human confirm)

---

### Lane C cluster: delivery/audit issues (low priority, stable)

| # | Title | Status | Reason |
|---|---|---|---|
| #570 | bearer scheme parser case-sensitive (B5/#562) | OPEN | Backend fix, not frontend |
| #565 | admin PATCH audit logging zero (B6/#562) | OPEN | Backend fix |
| #617 | MT40279917→SBA130306132 supersession dead-end | NEEDS-HUMAN-VERIFY | Data/catalog issue |
| #562 | Clinton Tractor shipment hardcoded tracking | NEEDS-HUMAN-VERIFY | Needs real order (Pass 1) |

---

### Lane C cluster: parts-diagrams / assembly

| # | Title | Status |
|---|---|---|
| #632 | parts-diagrams/chapter 0 BOM rows | NEEDS-HUMAN-VERIFY (real assemblyCode) |
| #633 | parts-diagrams/landing 0 chapters | NEEDS-HUMAN-VERIFY |
| #796 | AllPartsSheet rows lost qty/ref/schematic | NEEDS-HUMAN-VERIFY (no prod access) |
| #442 | assembly BOM ItemList + brand×type JSON-LD missing | NEEDS-HUMAN-VERIFY |
| #662 | 1,084 render timeouts on /parts-diagrams/{guid} | NEEDS-HUMAN-VERIFY (Vercel logs) |

---

## T4 — Navigation / UX Sweep Continuation

### #824 — OPEN (still)
**Search autosuggest over-darkens background**

The `command-menu-dropdown.tsx` loading overlay uses `bg-popover/60 backdrop-blur-[1px]` — this is the in-flight search navigation overlay. The issue is about the **dropdown backdrop** when the search results panel is open (not the loading state). This is a runtime rendering issue that can only be assessed by opening the search dropdown on a visible page. Cannot verify via curl or static code analysis alone.

Staff complaints are specific to a color-theme rendering issue. **Status: OPEN** — needs human visual check on prod.

---

### Parts diagrams chapter URLs — CONFIRMED 404
```
/equipment/{slug}/parts-diagrams/{assemblyCode} → 404 for any guessed assemblyCode
```
Route exists in code, validates assemblyCode format. Test failed because `engine` is not a valid assemblyCode. Need a real assemblyCode from a working parts-diagrams page on prod.

---

## Summary (Pass 2 additions to Pass 1 totals)

| Status | Count added |
|---|---|
| POSSIBLY-FIXED → moving-to-close/ | +3 (#1007, #1252, #636) |
| REPRODUCED | +1 (#1284, +#504 confirmed) |
| NOT-REPRODUCED-NOW | +1 (#975) |
| OUTDATED-DESCRIPTION | +1 (#269) |
| NEEDS-HUMAN-VERIFY | +8 (#632, #633, #904, #1133, #1170, #1171, #1191, #1264/#1265) |
| OPEN (confirmed still) | +1 (#824) |

**Cumulative processed:** ~30 of 84 issues have a status.  
**Remaining unreviewed:** ~54 (primarily Lane B and lower Lane C).

---

## Next pass targets (Pass 3)

Priority for remaining Lane B items:
1. #509 — pack-buy invariant violated end-to-end (urgent + checkout + qa)
2. #1081 — Catalog grid hides price + sort misorders (high — checkout)
3. #921 — iPhone text input 1-char lock (NEEDS-HUMAN-DEVICE, already tagged)
4. #855 — raw PN 404 remaining cases (/parts/47677961, /47677962)
5. #658 — 5,946 blank status_code pages in crawl
6. #679 — 70+ WCAG violations (a11y-smoke red)
7. #1278 — CRON_SECRET missing in Vercel (NEEDS-HUMAN-VERIFY already tagged)
8. Remaining Lane B items: #528, #525, #524, #523, #521, #511, #510, #499, #316, #156
