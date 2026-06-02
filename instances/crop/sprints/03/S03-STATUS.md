# S03 Sprint Status

Date: 2026-06-02 (updated 2026-06-02)
Sprint: S03 — Bug Reporting Session + Frontend Fixes
Status: **CLOSED**

---

## Scope summary

Bugs reported by denistka and filed as GitHub issues in CT-CROP/CROP-front (and other repos as needed).
Also includes assigned frontend-fix tasks from appdev-v lane starting 2026-06-01.

---

## Bug log

| Issue | Title | Repo | Status |
|-------|-------|------|--------|
| # | Issue | Title | Notes | Status |
|---|-------|-------|-------|--------|
| 1 | [#527](https://github.com/CT-CROP/CROP-front/issues/527) | Footer mobile tap targets — WCAG 2.5.5 | PR #1380 merged. All 21 footer links ≥24px tap target on 390×844. | closed — fixed |
| 2 | [#649](https://github.com/CT-CROP/CROP-front/issues/649) | Cart: '+N more' overflow link not clickable | 45 items added to cart — element not found on any surface. | closed — not reproducible |
| 3 | [#651](https://github.com/CT-CROP/CROP-front/issues/651) | Cart: line item shows duplicate model+brand — should show NHL-{partnumber} only | PR #1414 merged. SKU plumbed via formatBrandedSku + product.sku; displays NHL-{partnumber}. | closed — fixed |
| 4 | [#650](https://github.com/CT-CROP/CROP-front/issues/650) | Cart: line item missing image (present at PDP, absent in cart) | PR #1406 merged. imageUrl plumbed from catalog-card addItem() payload. | closed — fixed |
| 5 | [#827](https://github.com/CT-CROP/CROP-front/issues/827) | Cart sidebar: Recently Viewed shows placeholder instead of part image | PR #1420 merged. RecentlyViewedItem.imageUrl captured at PDP; store wired into StoreHydration. | closed — fixed |
| 6 | [#525](https://github.com/CT-CROP/CROP-front/issues/525) | a11y: mobile-nav variants stay tabbable on desktop | False positive — DPR=3 triggered snippet before lg:hidden applied. display:none correctly removes from tab order. Fixed by header refactor. | closed — false positive, fixed by refactor |
| 7 | [#1291](https://github.com/CT-CROP/CROP-front/issues/1291) | Variant selector: brand-name fallback + smoke + banner integration test | PR #1422 merged. extractBrand wrapped in humaniseBrand(); 3 new test cases; equipment-detail banner slot test green; smoke doc committed. | closed — fixed |
| 8 | [#1371](https://github.com/CT-CROP/CROP-front/issues/1371) | Search: tooltip z-index overlaps page content | PR #1389 merged. TooltipContent z-[70]; no longer overlaps page content. | closed — fixed |
| 9 | [#1372](https://github.com/CT-CROP/CROP-front/issues/1372) | Search: missing gap between camera icon and Search button | PR #1394 merged. gap-1 wrapper around ImageSearchButton + SearchSubmitButton. | closed — fixed |
| 10 | [#617](https://github.com/CT-CROP/CROP-front/issues/617) | Verify: MT40279917 → SBA130306132 supersession dead-end | Reproduced on prod. Blocked on Spiders#5 + hub#49. | verified — blocked upstream |
| 11 | [#682](https://github.com/CT-CROP/CROP-front/issues/682) | test(e2e): slug-stability branded OR raw canonical | Fixed by rewrite (PRs #678, #958, #1027) — verified, no code change needed | closed — fixed-by-rewrite |
| 12 | [#1276](https://github.com/CT-CROP/CROP-front/issues/1276) | perf(audit): Web Vitals + bundle baseline re-measure | Measurement done, delta-table posted. Cart regression filed as #1423. | closed — measured |

---

## Sprint plans

| PTL | Title | Status |
|-----|-------|--------|
| [S03-FOOTER-WCAG-TAP-TARGETS.ptl](S03-FOOTER-WCAG-TAP-TARGETS.ptl) | Footer WCAG 2.5.5 — Mobile Tap Target Fix (#527) | CLOSED — PR #1380 merged |
| [S03-FRONTEND-FIXES.ptl](S03-FRONTEND-FIXES.ptl) | Frontend Fixes — Denis lane (issues 527/649/650/651/827/525/1291) | CLOSED — all PRs merged |

---

## Closure log

| Issue | Result | Date |
|-------|--------|------|
| #527 | fixed — PR #1380 merged | 2026-06-02 |
| #649 | closed — not reproducible | 2026-06-01 |
| #650 | fixed — PR #1406 merged | 2026-06-02 |
| #651 | fixed — PR #1414 merged | 2026-06-02 |
| #827 | fixed — PR #1420 merged | 2026-06-02 |
| #525 | closed — false positive, fixed by refactor | 2026-06-01 |
| #1291 | fixed — PR #1422 merged | 2026-06-02 |
| #1371 | fixed — PR #1389 merged | 2026-06-02 |
| #1372 | fixed — PR #1394 merged | 2026-06-02 |
| #617 | verified — blocked upstream (Spiders#5 + hub#49) | 2026-06-01 |
| #682 | closed — fixed-by-rewrite | 2026-06-01 |
| #1276 | closed — measured, #1423 filed for cart regression | 2026-06-01 |
