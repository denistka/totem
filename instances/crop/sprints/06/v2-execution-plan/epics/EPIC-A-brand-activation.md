# EPIC A — Brand Activation

**Goal 1** · Owners: Daniil (backend), Oleg (frontend), Vova (data) · Repos: CROP-search-hono, CROP-front, DB

## Outcome

Ferris, Ventrac, McHale, **and Marcrest** are navigable end-to-end (brand landing → model
grid → assembly diagram) in production. Ferris commercial-mower **59-series config numbers**
resolve directly to their assembly diagrams. All four pages render (content or graceful
empty-state) — never 404/500.

## Why

Ventrac/Ferris/McHale are already `available: true` in both repos; **Marcrest is the only
brand missing** — and it is the gate for the whole V2 brand story. Ferris is Clinton's
#1-national-dealer brand; the 59-number is how a Ferris customer finds their machine, so
that lookup path must be reliable.

## State of play (verified 2026-06-03)

- Marcrest is **absent** from hono `BRAND_REGISTRY` → every `/api/brand/marcrest/*` is 404. (A1)
- Marcrest **exists** in front `brand-registry.ts` but `available: false` → not navigable. (A2, see [F2](../CODE-FINDINGS.md#f2))
- hono carried whitelist omits VNT/FRR/MCH/MAR → cold-start 404 risk. (A1, see [F4](../CODE-FINDINGS.md#f4))
- Activating Marcrest **breaks invariant tests** in 2 front test files. (A2, see [F3](../CODE-FINDINGS.md#f3))
- Ferris = **`FRR`**, never `FER`. (see [F1](../CODE-FINDINGS.md#f1))

## Tasks

| Task | Owner | Day | Repo |
|------|-------|-----|------|
| [A1 — Marcrest → hono registry + whitelist hardening](../../S06-A1-marcrest-hono-registry.pd) | Daniil | D1 | search-hono |
| [A2 — Activate Marcrest in CROP-front (+ invariant tests)](../../S06-A2-marcrest-front-activation.pd) | Oleg | D1–D2 | front |
| [A3 — 4-brand E2E smoke](../../S06-A3-4brand-e2e-smoke.pd) | Denis | D3 | both |
| [A4 — Ferris 59-config → assembly routing](../../S06-A4-ferris-config-numbers.pd) | Daniil | D2 | search-hono |
| A5 — Marcrest brand_vocabulary DB row + data check (ops, see [ROADMAP](../ROADMAP.md)) | Vova | D1 | DB |
| A6 — Ferris slug data fix (if needed) + cache refresh (ops, see [ROADMAP](../ROADMAP.md)) | Vova | D2–D3 | DB |
| [A7 — Brand hub entry parity (#1617)](../ROADMAP.md) | Oleg | D3 | front |

## Epic acceptance

- `GET /api/brand/marcrest/models` → 200 (data) or clean 404 `{code:"NOT_FOUND"}` — never 500
- `/parts/brand/{ferris,ventrac,mchale,marcrest}` + `/parts-diagrams/{…}` → 200 each
- ≥3 Ferris 59-series models clickable → assembly list loads
- A2 PR is green incl. updated invariant tests in both front test files
- A3 smoke checklist fully ✓ before D0 deploy
