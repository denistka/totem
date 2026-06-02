# S05 Sprint Status

Date: 2026-06-02
Sprint: S05 — Shipping & Delivery — Backend Hardening + Customer-Facing Taxonomy
Status: **IN PROGRESS — started 2026-06-02**

---

## Scope summary

Full shipping + delivery sprint across crop-front and crop-parts-services.
Carries forward S02 UPS XAV analysis (investigation complete, implementation not started).
- **Track A** (crop-parts-services): UPS timeout, OAuth shared cache, XAV result cache, CI deploy fix, CNH pricing SSoT
- **Track B** (crop-front): 7-lane taxonomy umbrella, 2-tier pricing, Lane 7 free-ship gate, countdown banner, tracking notifications, parity check

Dedup already completed in S04: #1016 and #1172 closed as duplicates of #980.

---

## Issue index

| Issue | Repo | Track | Task | Status |
|-------|------|-------|------|--------|
| CROP-parts-services#259 | crop-parts-services | A | A1 | in progress |
| S02 hypothesis B (ups-oauth.ts) | crop-parts-services | A | A2 | planned |
| S02 lever L1 (xav cache) | crop-parts-services | A | A3 | planned |
| CROP-parts-services#340 | crop-parts-services | A | A4 | planned |
| CROP-parts-services#303 | crop-parts-services + crop-front | A | A5 | planned |
| CROP-front#978 (umbrella) | crop-front | B | B1 | planned |
| CROP-front#955 | crop-front | B | B2 | planned |
| CROP-front#995 | crop-front | B | B3 | planned |
| CROP-front#980 | crop-front | B | B4 | planned |
| CROP-front#981 | crop-front | B | B5 | planned |
| CROP-front#1437 | crop-front | B | B6 | planned |

---

## Pre-conditions before unlock

- S04 Track A closed (security + stability baseline)
- #1396 (RESEND_API_KEY in Vercel prod) confirmed resolved before B5

---

## Sprint plan

| PTL | Status |
|-----|--------|
| [S05-SHIPPING-DELIVERY.ptl](S05-SHIPPING-DELIVERY.ptl) | LOCKED — awaiting S04 + scope-approved |

---

## Unlock procedure

1. S04 Track A complete.
2. Flip `gate: LOCKED` → `gate: OPEN` on `S05-SHIPPING-DELIVERY.ptl` and `S05-A1-delivery-timeout-bound.pd`.
3. Say "scope-approved S05."
4. PLANNER stops. Implementation begins with Track A.

---

## Closure log

| Issue | Result | Date |
|-------|--------|------|
| — | — | — |
