# S01 Triage Pass 1 — Bug Backlog

Date: 2026-05-28  
Environment: localhost:3000 · branch: dev · last merge: #1301  
Method: curl HTTP checks + code search + codebase review  
Total open bug issues: 84

---

## Summary (Pass 1 — see S01-T2-TRIAGE-PASS-2.md for Pass 2 additions)

| Status | Count (Pass 1) |
|---|---|
| POSSIBLY-FIXED (moving-to-close/) | 2 |
| DUPLICATE (confirmed) | 2 pairs |
| DUPLICATE (possible) | 1 pair |
| REPRODUCED (confirmed on local) | 3 |
| NEEDS-HUMAN-DEVICE | 1 |
| NEEDS-HUMAN-VERIFY | 5 |
| NOT-REPRODUCED-NOW | 1 |
| NEW FINDING (not in issues) | 1 |
| UNREVIEWED (remaining) | ~69 |

---

## POSSIBLY-FIXED → moving-to-close/

### #907 — P0 (mobile): Kenect chat widget overlays Add to Cart on PDP
`components/kenect-widget.tsx` explicitly disables Kenect on mobile (< 768px) as of #918.  
Comment cites John's decision on 2026-05-16 — matches the issue date.  
QA file: `moving-to-close/907-kenect-mobile-overlay.md`

### #841 — URGENT: Home page category tiles dead-end
Code in `shop-by-category.tsx` was updated from multi-word queries ("bearing seal") to single-word ("bearing").  
Comment in code explicitly references #841 as the reason.  
A regression test (`shop-by-category-query-allowlist.test.ts`) guards against future dead-ends.  
QA file: `moving-to-close/841-category-tiles-dead-end.md`

---

## DUPLICATES → processed/DUPLICATES-1296-1297.md

| Close | Keep | Reason |
|---|---|---|
| #1270 | #1297 | Identical ProductFeed shard failure, 1-day re-file |
| #1269 | #1296 | Identical assembly.pagination_overflow, 1-day re-file |
| #1271 (possible) | #1298 | ImageSitemap shard 0 — slightly different title, human confirm |

---

## REPRODUCED

### #634 — bug(parts/filter): /parts?manufacturer=new-holland returns 0 products
```
curl http://localhost:3000/parts?manufacturer=new-holland → "No results"
```
Note: also `?manufacturer=NHL` search queries show partial dev data gaps.  
Likely a data pipeline issue (hono/search service not indexing by `manufacturer` param correctly), not a frontend bug. Needs prod verification before fixing.

### #841 (partial) — Category tiles: 5/12 show "No results" on localhost
`filter`, `hydraulic`, `bearing`, `cooling`, `brake` queries return empty locally.  
Likely dev data gap (local hono catalog incomplete), not a code regression. Code fix is in place (single-word queries). Needs prod check — see moving-to-close.

### #855 (partial) — raw PN /parts/{N} 404 when branded /CT-NHL-N exists
- `/parts/10263460` → 308 → `/parts/CT-NHL-10263460` ✓ (redirects correctly)
- `/parts/47677961` → 404 (no redirect, no branded equivalent found)
- `/parts/47677962` → 404 (no redirect)
- `/parts/84158549` → 200 (has its own page)
Conclusion: redirect logic works for some PNs, but not for all raw numeric IDs without a branded equivalent. Issue is PARTIALLY REPRODUCED.

---

## NEEDS-HUMAN-DEVICE

### #921 — P0 (mobile): iPhone text input — only 1 character typed then locked
Issue title says "NOT reproducible on emulator". Cannot verify via curl or code analysis.  
Status: NEEDS-HUMAN-DEVICE — requires real iPhone Safari test.

---

## NOT-REPRODUCED-NOW

### #986 — bug(brand-hub): 8% dead-link rate from /parts/brand/new-holland/type/tractors → 404 /equipment/*
- `/parts/brand/new-holland/type/tractors` → 200 ✓
- Equipment pages from that page (`/equipment/new-holland-54cms`, `/equipment/new-holland-72-85`, etc.) → 200 ✓
Appears NOT-REPRODUCED-NOW on dev. May have been fixed. Recommend prod spot-check of 5-10 equipment links from the brand-hub page.

---

## NEEDS-HUMAN-VERIFY

### #562 — delivery: Clinton Tractor shipment hardcoded — fake CT-XXXXXXXX tracking
No `CT-XXXXXXXX` pattern or fake tracking literal found in app/ code.  
`update-delivery-status.ts` is now a proper staff action calling the backend API.  
Cannot verify without placing a real CT-delivery order. Status: NEEDS-HUMAN-VERIFY.

### #1262 — bug(auth): Clerk JS fails to load from clerk.clintontractor.net
`debug-config` endpoint shows `clerkConfigIssue: null` on dev (no custom domain set).  
Issue is production-only (custom Clerk domain `clerk.clintontractor.net`).  
Needs prod Clerk dashboard + network check. Status: NEEDS-HUMAN-VERIFY.

### #1278 — bug(cron): CRON_SECRET missing in Vercel env
`.env.local` has `CRON_SECRET=dev-cron-secret`. Vercel prod env is the issue.  
Status: NEEDS-HUMAN-VERIFY (Vercel dashboard → Environment Variables).

### #1127 — fix(checkout): confirmation email silently skipped on null order-detail
Code has null guards for `fullOrder` in `checkout/success/page.tsx`.  
Cannot verify email sending without real prod order. Status: NEEDS-HUMAN-VERIFY.

### #985 — P0 SEO umbrella: GSC 0 indexed / 82 not-indexed
`/sitemap.xml` → 308 → `/sitemap-index.xml` → 404 locally.  
Note: dev likely doesn't generate sitemaps. Needs prod GSC + Vercel log review.  
Status: NEEDS-HUMAN-VERIFY (production-only).

---

## NEW FINDING — Not tracked in any open issue

### BUG: Brand pages 404 for all non-New-Holland brands
```
/parts/brand/john-deere → 404
/parts/brand/case-ih    → 404
/parts/brand/kubota     → 404
/parts/brand/massey-ferguson → 404
/parts/brand/fendt      → 404
```
Only `/parts/brand/new-holland` (and sub-paths like `/type/tractors`) returns 200.  
**Impact:** any user trying to browse parts by brand other than NH hits a dead end.  
**Verdict:** New bug candidate. Should open as issue or verify if non-NH brands are intentionally not launched yet.

---

## UX Observations

1. **Search autosuggest background darkens** — issue #824 exists already
2. **Checkout and Account redirect** — `/checkout` → 307 `/checkout/shipping`, `/account` → 307 (expected, auth required)
3. **Parts diagrams chapter URLs 404** — tested `/parts-diagrams/new-holland-workmaster-95-engine` → 404. Format likely wrong. The `/equipment/{slug}/parts-diagrams` URL returns 200. May relate to #632/#633.

---

## Next pass targets

Priority for Pass 2:
1. #1284 — unstable_cache poison (needs deeper prod behavior analysis)
2. #1007 — Mobile redesign channel-leak surfaces
3. #971 — DIS pushOrder payload
4. #1264 / #1265 — React hooks crashes (Sentry data, can't reproduce via curl)
5. #904 — CLS regression on /equipment/{slug}
6. #632/#633 — parts-diagrams 0 BOM rows / 0 chapters
