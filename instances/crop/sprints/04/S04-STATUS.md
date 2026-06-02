# S04 Sprint Status

Date: 2026-06-02
Sprint: S04 — Frontend Fixes: Security, Stability, Reliability (CROP-front)
Status: **COMPLETE — all 14 issues closed 2026-06-02**

---

## Scope summary

14 issues assigned by team lead to denistka (CROP-front only).
Prioritised by context into 3 tracks:
- **Track A** (P1) — security vulnerability + prod UX crashes: #1416, #1256, #1257
- **Track B** (P2) — reliability and CI quality: #1442, #1292, #1255, #1370
- **Track C** (P3) — improvements and tech debt: #1443, #1437, #1374, #1461, #1453, #1391, #1318

---

## Issue index

| Issue | Track | Task | Title | Status |
|-------|-------|------|-------|--------|
| #1416 | A | A1 | Clerk authz bypass HIGH — bun audit + CI gate | done |
| #1256 | A | A2 | Sentry tag upstream.timeout=hono | done |
| #1257 | A | A3 | loading.tsx skeletons PDP + equipment | done |
| #1442 | B | B1 | nuqs throttled-queue timer flakes tests | done |
| #1292 | B | B2 | MAX_PAGE_SIZE silent clamp → 400 | done |
| #1255 | B | B3 | fetch-inventory AbortSignal.timeout | done |
| #1370 | B | B4 | assembly.missing_index Sentry flood — fix fingerprint | done |
| #1443 | C | C1 | fetch-full-order EmailableOrder type + facade | done |
| #1437 | C | C2 | CNH-overnight parity check vs BE /rates | done |
| #1374 | C | C3 | BOM scroll to part on hotspot click | done |
| #1461 | C | C4 | /parts-diagrams/{invalid-brand} → 404 | done |
| #1453 | C | C5 | per-brand schematic parser fixtures | done |
| #1391 | C | C6 | knip dead-code cleanup + blocking CI gate | done |
| #1318 | C | C7 | remove dead asmCtx plumbing from PDP supersession | done |

---

## Sprint plan

| PTL | Status |
|-----|--------|
| [S04-FRONTEND-FIXES.ptl](S04-FRONTEND-FIXES.ptl) | LOCKED — awaiting scope-approved |

---

## Unlock procedure

1. Flip `gate: LOCKED` → `gate: OPEN` on `S04-FRONTEND-FIXES.ptl` and `S04-A1-clerk-authz-vuln.pd`.
2. Say "scope-approved" or "proceed with A1."
3. PLANNER stops. Implementation begins with Track A.

---

## Closure log

| Issue | Result | Date |
|-------|--------|------|
| #1416 | A1 | Fixed — @clerk/nextjs 7.4.2 + blocking audit gate (commit ef02d15c, PR #1430) | 2026-06-02 |
| #1256 | A2 | Fixed — upstream.timeout=hono Sentry tag at AbortError throw site (PR #1482) | 2026-06-02 |
| #1257 | A3 | Fixed — dedicated EquipmentLoadingSkeleton matching real equipment layout (PR #1483) | 2026-06-02 |
| #1442 | B1 | Already on dev — commit 77aa7f24, PR #1449 (NuqsTestingAdapter + rateLimitFactor=0) | 2026-06-02 |
| #1292 | B2 | Fixed — validatePageSize() throws 400 instead of Math.min clamp (PR #1484) | 2026-06-02 |
| #1255 | B3 | Already on dev — authedFetch 30s timeout + TIMEOUT/CANCELLED (PR #1241, commits a408eb1f + 50948de7) | 2026-06-02 |
| #1370 | B4 | Fixed — fingerprint consolidated to type-only ['assembly-missing-index'] (PR #1485) | 2026-06-02 |
| #1443 | C1 | Already on dev — commit 7bb5846b, PR #1447 (EmailableOrder + confirmation facade) | 2026-06-02 |
| #1437 | C2 | Already on dev — commit f9e82bd7, PR #1421 (CNH-overnight parity golden vectors) | 2026-06-02 |
| #1374 | C3 | Already on dev — commits 180f3f22 + 21081626, PRs #1376 + #1407 (BOM scroll on hotspot click) | 2026-06-02 |
| #1461 | C4 | Already on dev — notFound() guard in app/parts-diagrams/[brand]/page.tsx | 2026-06-02 |
| #1453 | C5 | Fixed — parsers.fixtures.test.ts, 18 tests across NH/Ventrac/McHale/Ferris (PR #1487) | 2026-06-02 |
| #1391 | C6 | Already on dev — commits cc1ffd12 + 37d1c15f, PRs #1399 + #1431 (knip + blocking gate) | 2026-06-02 |
| #1318 | C7 | Fixed — removed assembly-context.ts + dead asmCtx plumbing (PR #1486) | 2026-06-02 |
