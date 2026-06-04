# S05 Sprint Status

Date: 2026-06-02
Sprint: S05 — Shipping & Delivery — Backend Hardening + Customer-Facing Taxonomy
Status: **IN PROGRESS — 7 tasks implemented; 4 S05 PRs CI green, 2 S05 PRs CI re-running; 4 S04 PRs CI green, 2 S04 PRs CI re-running (10 PRs total open)**

---

## Scope summary

Original scope trimmed — 4 tasks deferred to S06 (blocked on infra/stakeholder decisions).
7 tasks implemented across crop-parts-services and crop-front.

---

## Issue index

| Issue | Repo | Track | Task | PR | Status |
|-------|------|-------|------|----|--------|
| CROP-parts-services#259 | crop-parts-services | A | A1 | [#362](https://github.com/CT-CROP/CROP-parts-services/pull/362) | PR open — awaiting review |
| CROP-parts-services#340 | crop-parts-services | A | A4 | [#363](https://github.com/CT-CROP/CROP-parts-services/pull/363) | PR open — awaiting review |
| CROP-parts-services#303 | crop-parts-services | A | A5 | [#364](https://github.com/CT-CROP/CROP-parts-services/pull/364) | PR open — awaiting review |
| CROP-front#303 (FE) | crop-front | A | A5 | [#1488](https://github.com/CT-CROP/CROP-front/pull/1488) | PR open — awaiting review |
| — | crop-front | B | B2 | — | already in dev (free-shipping-options.tsx) |
| — | crop-front | B | B4 | — | already in dev (free-ship-countdown.tsx) |
| CROP-parts-services#981 | crop-parts-services | B | B5 | [#365](https://github.com/CT-CROP/CROP-parts-services/pull/365) | PR open — awaiting review |
| CROP-front#1437 | crop-front | B | B6 | [#1489](https://github.com/CT-CROP/CROP-front/pull/1489) | PR open — awaiting review |

---

## Deferred to S06

| Task | Issue | Blocker |
|------|-------|---------|
| A2 — UPS OAuth shared cache | CROP-parts-services#259 phase 2 | Redis/Memorystore infra decision needed |
| A3 — UPS XAV result cache | S02 lever L1 | Depends on A2 cache adapter |
| B1 — shipping umbrella gate comment | CROP-front#978 | Manual GitHub comment step |
| B3 — Lane 7 margin gate | CROP-front#995 | 3 open decisions for John: bundling rule, threshold ratio, override interface |

---

## Open PRs (all base=`dev`, all MERGEABLE)

| PR | Repo | Task | Commits |
|----|------|------|---------|
| [#362](https://github.com/CT-CROP/CROP-parts-services/pull/362) | crop-parts-services | A1 | +1 ahead of dev |
| [#363](https://github.com/CT-CROP/CROP-parts-services/pull/363) | crop-parts-services | A4 | +1 ahead of dev |
| [#364](https://github.com/CT-CROP/CROP-parts-services/pull/364) | crop-parts-services | A5 | +1 ahead of dev |
| [#365](https://github.com/CT-CROP/CROP-parts-services/pull/365) | crop-parts-services | B5 | +2 ahead of dev |
| [#1488](https://github.com/CT-CROP/CROP-front/pull/1488) | crop-front | A5 | +1 ahead of dev |
| [#1489](https://github.com/CT-CROP/CROP-front/pull/1489) | crop-front | B6 | +1 ahead of dev |

---

## Closure log

| Task | Result | Date |
|------|--------|------|
| A1 | PR #362 — UPS XAV per-attempt timeout 8s + test fixed | 2026-06-02 |
| A4 | PR #363 — 6 deploy workflows watch packages/shared-types/** | 2026-06-02 |
| A5 | PR #364 (BE) + PR #1488 (FE) — CNH constants → shared-types SSoT | 2026-06-02 |
| B2 | already in dev — free-shipping-options.tsx (FREE ≥$75 / $9 flat / per-state timing / UPS overnight) | pre-S05 |
| B4 | already in dev — free-ship-countdown.tsx (restored 12e76d9a) | pre-S05 |
| B5 | PR #365 — staff PATCH /status shipped → email, idempotent, correct DELIVERY_ADMIN_TOKEN guard | 2026-06-02 |
| B6 | PR #1489 — checkCnhOvernightParity + Sentry captureMessage on drift | 2026-06-02 |

## Issues closed this sprint

| Issue | Repo | Date |
|-------|------|------|
| #931 — Free shipping Phase 1 pivot | CROP-front | 2026-06-02 |
| #1437 — CNH-overnight parity check | CROP-front | 2026-06-02 |
| #980 — countdown banner (pending manual close) | CROP-front | 2026-06-02 |
