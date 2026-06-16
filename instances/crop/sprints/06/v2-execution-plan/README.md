# CROP V2 — One-Week Execution Plan (S06)

> Day-by-day, role-by-role delivery plan for the V2 multi-brand launch.
> Built from `v2-docs/` + the S06 `.ptl`/`.pd` set, then **re-grounded against the
> actual code in `CROP-front`, `CROP-search-hono`** on 2026-06-03.
>
> Read [CODE-FINDINGS.md](./CODE-FINDINGS.md) first — the live code differs from the
> source docs in five material ways that change task scope and ownership.

---

## Goal (one line)

Ship a production-ready multi-brand parts platform — **Ferris, Ventrac, McHale, Marcrest**
live, reliable navigation to diagrams on desktop + mobile, correct multibrand search —
demoed to ownership at end of week.

---

## Calendar

| Day | Date | Weekday | Theme |
|-----|------|---------|-------|
| D1 | 2026-06-03 | **Wed** (today) | Unblock: Marcrest backend + FE activation start; nav loop repro; Dan briefed |
| D2 | 2026-06-04 | **Thu** | Build: mobile parity, search audit, Ferris 59-config, imagery gap-fill |
| D3 | 2026-06-05 | **Fri** | Stabilize: flash fix, full QA smoke, all PRs merged to `dev` |
| D4 | 2026-06-06 | **Sat** | Deploy + demo: prod cutover, 4-brand prod spot-check |

> **Calendar note.** The source docs call 06-06 "Friday" and 06-03 "Tuesday". By the
> calendar, 06-03 is a Wednesday and 06-06 is a Saturday. This plan uses real weekdays.
> **Reconcile the actual demo date with John** — if the demo is the real Friday it is
> 2026-06-05 (D3) and Saturday is not a work day; the plan front-loads so all engineering
> lands by **end of D3 (Fri 06-05)** and D4 is deploy/buffer only.

---

## Roles

| Person | Lane | Repo(s) | Output |
|--------|------|---------|--------|
| **Oleg** (@pedchenkooleh-coo) | Frontend / UX lead | CROP-front | Feature PRs (brand activation FE, nav, mobile, imagery, flash) |
| **Daniil** (@DaniilDerkach) | Backend / Search | CROP-search-hono | Registry, search audit, Ferris config routing |
| **Denis** (@denistka) | QA gate | both | Local PR runs, 4-brand smoke, bugs filed with impact statements |
| **Vova** (@appdev-v) | Lead / Data / Deploy | DB + both | DB rows, final PR review, prod deploy |
| **Dan** | Search specialist | CROP-search-hono | Briefed D1 on multibrand requirements; consulted on C1/C2 |

---

## PR workflow (agreed 2026-06-02)

```
Oleg/Daniil open PR  (branch cut from dev)
  → Denis runs locally + verifies acceptance criteria  ("Local test: PASS/FAIL")
    → Vova final UI/UX + code review
      → Vova merges to dev → deploy crop-dev.app → smoke → prod
```

- Branches **cut from `dev`**, PRs target `dev` (not `main`). See branch-state warning below.
- Every issue/PR opens with a **one-paragraph impact statement** (why, not what).
- Small bugs found in-scope: **fix inline + note in PR body**. Do not open new issues
  (issue-sprawl rule). Net-new work → one issue with impact statement at top.

### Branch-state warning (verified 2026-06-03)
- `CROP-front` is currently on `feat/s04-a3-loading-skeletons`, **not `dev`**. Every V2
  branch must be cut fresh from `origin/dev` — do **not** branch off the current HEAD.
- `CROP-search-hono` is on `main` (behind 7). Cut V2 branches from `origin/dev`.
- `CROP-parts-services` has unrelated uncommitted delivery-service work — **out of V2 scope**, leave untouched.

---

## Epics

| Epic | Title | Goals | Owner(s) | File |
|------|-------|-------|----------|------|
| **A** | Brand Activation | G1 | Daniil, Oleg, Vova | [epics/EPIC-A-brand-activation.md](./epics/EPIC-A-brand-activation.md) |
| **B** | Navigation & UX | G2, G4 | Oleg | [epics/EPIC-B-navigation-ux.md](./epics/EPIC-B-navigation-ux.md) |
| **C** | Multibrand Search | G3 | Daniil, Dan | [epics/EPIC-C-multibrand-search.md](./epics/EPIC-C-multibrand-search.md) |

Cross-cutting (G5 quality, G6 issue hygiene) is the PR workflow + smoke gates above,
enforced on every task.

---

## Status snapshot — 2026-06-04 (see [ROADMAP.md](../ROADMAP.md) for live checkboxes)

| | |
|---|---|
| ✅ Merged to dev | hono#332, front#1533–1543, #1553, #1556, #1578, #1583, #1589, #1597 (B6 code) |
| ✅ QA PASS (crop-dev) | A3 F/V/M, B4, B5, B8 — @denistka |
| 🔄 QA in progress | `QA-IMPROVEMENTS-BACKLOG.md` synced 2026-06-04 · done: `/brands`, `/parts` (#1618–1619), `/checkout/shipping` (#1621) · open v2: #1608–#1616, A7 #1617 |
| ❌ QA FAIL | A3b Marcrest — diagrams empty until catalog data |
| 🔍 Open issues | #1538 (MAR data), #1530 (B7), #1576 (B6 visual), **#1608–#1616** (B9–B13 QA) |
| 📝 Issue hygiene | #1603/#1606 withdrawn; #1608 filed with scroll+full-bleed spec |

**Critical path:** #1538 → B7 #1530 → B6 visual #1576 → B9 #1608 (recommended) → Vova sign-off → D0

---

## PRs already in review (Denis + Oleg action needed D1)

| PR | Description | Status | Blocks |
|----|-------------|--------|--------|
| [front#1533](https://github.com/CT-CROP/CROP-front/pull/1533) | Shared component set (Vova) — all checks green | **Needs Denis + Oleg approval** | Oleg's front#1538 (A2) |
| [front#1537](https://github.com/CT-CROP/CROP-front/pull/1537) | New Ferris/Ventrac/McHale diagrams page (Vova) | **Needs Denis + Oleg approval** | — |

**Denis: review PR 1533 first** — it's the blocker for Oleg starting Marcrest activation.

---

## Task index

> **Moved.** The live task list with checkboxes + status now lives in
> [ROADMAP.md](../ROADMAP.md) (mirrored to the GitHub roadmap issue). Canonical
> per-task detail = the `S06-*.pd` files in [sprints/06/](../). The old
> `tasks/*.md` briefs were retired 2026-06-03 to remove the `.pd` duplication;
> their unique ops detail (A5/A6 SQL, B5 checklist, D0 deploy) is in the ROADMAP appendix.
>
> This README keeps only the planning narrative below (swimlanes, dep graph, branch strategy).

---

## Dependency graph

```
PR#1533 (Vova shared components — Denis reviews D1) ─→ A2 (front#1538, Oleg: MAR FE) ─┐
                                                                                         │
A5 (MAR db row, Vova D1) ──────────────────────────────────────────────────────────────┤
                                                                                         ├─→ A3 (front#1541, Denis: smoke) ─→ D0 (prod)
A1 (search-hono#329, Daniil D1: MAR hono) ─┬─→ A2                                      │
                                            ├─→ A4 (Ferris 59) ─→ A6 (slug fix, Vova) ─┘
                                            ├─→ C1 (search-hono#330: PN collision)
                                            └─→ C2 (search-hono#330: brand context)

PR#1537 (Vova diagrams page — Denis reviews D1) ─→ B3 (imagery verify, Oleg D2)

B1 (front#1539, desktop loop) ─┐
                               ├─→ B5 (nav smoke, Denis D3)
B2 (front#1540, mobile parity)─┘
B4 (Ferris flash) — needs A2/A4 routes clean
front#1535 (Denis: test coverage) — needs PR#1533 merged
C3 (brief Dan) — D1, independent
```

**Critical path:** `PR#1533 approved → A1 + A5 → A2 → A3 → D0`.
**Denis's D1 first action: review PR 1533 locally** — it's the gate for Oleg starting 1538.

---

## Day-by-day swimlanes

### D1 — Wed 2026-06-03 ✅ COMPLETE

- **Denis:** ✅ Reviewed + approved PR#1533, #1537, #1543. Fixed style violations in #1537 (v4 focus rings) and #1543 (bg-white dark-mode bug) before approving. Wrote e2e coverage (#1535): price-leak, a11y, live filter. Reviewed + approved search-hono#332 (967 tests green). Local env ready (localhost:3000).
- **Daniil:** ✅ Combined PR#332 opened + merged (A1 + C1 + C2). MAR in registry + whitelist. Multibrand PN attribution fixed.
- **Vova:** ✅ Merged #1533 (foundation) + #332. Approved PRs #1537 + #1543 pending merge.
- **Oleg:** 🔧 Working on #1538 (Marcrest FE), #1539 (nav loop), #1540 (mobile). No PRs yet.

### D2 — Thu 2026-06-04 (build) — ✅ MOSTLY COMPLETE

- **Denis:** ✅ B4/B8 crop-dev PASS; ✅ A3 F/V/M + B5; ❌ A3b Marcrest FAIL (empty diagrams). #1535 closed.
- **Oleg:** ✅ #1553 Marcrest FE, #1556 B1, #1578 B2, #1597 B6 code merged. B7 #1530 still open.
- **Daniil:** #1538 open — MAR catalog data to live page (blocks A3b). A4 still TBD.
- **Vova:** Merged B4/B8/#1581/#1586; B6 visual sign-off pending on #1576.

### D3 — Fri 2026-06-05 (stabilize) — **all engineering lands today**
- **Oleg:** B4 — Ferris commercial-mower flash fix; address smoke bugs.
- **Daniil:** finish C1; address smoke bugs.
- **Denis:** A3 — full 4-brand E2E smoke; B5 — navigation smoke (B1+B2 sign-off).
- **Vova:** final review + merge all green PRs to `dev`; deploy `dev` → `crop-dev.app`; coordinate smoke re-runs.

### D4 — Sat 2026-06-06 (deploy + demo)
- **Vova:** D0 — tag `v2.0.0-brands`, deploy `dev` → prod, spot-check 4 brand pages on `crop.clintontractor.net`, confirm to John.
- **Denis:** prod spot-check parity with dev smoke.

---

## Definition of Done (V2)

A brand is production-ready when **all** hold:
- [ ] `/parts/brand/{slug}` → 200, brand name + TypeCards visible
- [ ] `/parts-diagrams/{slug}` → 200, model grid visible (or graceful empty-state)
- [ ] ≥1 assembly diagram loads end-to-end (schematic + BOM row)
- [ ] No JS console errors at 375px and 1280px
- [ ] No circular nav loop; brand crumb → brand page (not diagrams root)
- [ ] Ferris: ≥3 commercial-mower 59-series models clickable + loading
- [ ] Multibrand PN search returns correctly attributed results
- [ ] Denis ran the smoke checklist — all ✓
- [ ] Vova reviewed + merged the PR
- [ ] Verified on `crop-dev.app` before prod

**Brand-page `seoIndexed` stays `false` for all four new brands** — never flip to `true`
without John's explicit approval.
