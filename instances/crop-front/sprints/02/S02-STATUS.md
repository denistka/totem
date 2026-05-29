# S02 Sprint Status

Date: 2026-05-29
Sprint: S02 — Address Validation Performance (UPS XAV bridge)
Trigger: customer report — address validation step in checkout is slow
Status: **PLANNED — scope refocused, awaiting scope-approved gate**

---

## Evidence in hand

| Source | Reading |
|---|---|
| Browser trace 2026-05-29 (POST /checkout/shipping) | total **970ms** / TTFB **968ms** / download 1ms / body 152B |
| Code-path discovery 2026-05-29 | full hot path mapped (see below) |
| CROP-search-hono audit | **not in path** — dropped from scope |

> >99% of the latency is server-side. Browser-side optimization has no ceiling.

---

## Hot-path map (verified 2026-05-29)

| Layer | File | Notes |
|---|---|---|
| FE call site | [shipping-form.tsx:564](../../../../CROP-front/app/checkout/shipping/_components/shipping-form.tsx#L564) | onSubmit only, single trip, `startTransition` |
| FE Server Action | [app/actions/delivery.ts:236](../../../../CROP-front/app/actions/delivery.ts#L236) | pass-through, **no cache**, no retry |
| FE client | [lib/delivery-api/client.ts:214](../../../../CROP-front/lib/delivery-api/client.ts#L214) | `POST {DELIVERY_API_DIRECT_URL}/ups/addresses/validate`, 35s timeout, bypasses gateway |
| BE route | [routes/addresses.ts:78](../../../../CROP-parts-services/services/delivery/src/routes/addresses.ts#L78) | Hono → `upsProvider.validateAddressDetails` |
| BE provider | [providers/ups/ups-address.ts:30](../../../../CROP-parts-services/services/delivery/src/providers/ups/ups-address.ts#L30) | builds XAV payload, `fetchWithRetry`, **no result cache** |
| BE OAuth | [providers/ups/ups-oauth.ts:27](../../../../CROP-parts-services/services/delivery/src/providers/ups/ups-oauth.ts#L27) | **instance-memory token only**, lost on cold start |

---

## 968ms TTFB — expected composition

```
Vercel SSR → Cloud Run delivery-api → UPS XAV
  TLS / routing                ~50–150ms   (fixed)
  OAuth getAccessToken         ~0 (warm) / ~300–500ms (cold)
  UPS XAV /addressvalidation   ~400–700ms  (UPS-side, dominant)
  delivery-api processing      ~10–30ms
```

T1 will confirm the actual split with n≥10 samples.

---

## Ranked hypotheses

| ID | Hypothesis | Rank |
|---|---|---|
| A | UPS XAV provider call dominates (~400–700ms typical) | **primary** |
| B | OAuth token miss on cold instance adds ~300–500ms | secondary |
| C | No result cache — identical addresses re-validated on retry/edit | **high-leverage** |
| D | Cloud Run cold start adds container init | baseline |
| E | Network hops (Vercel us-east → Cloud Run → UPS) | fixed |

---

## Remediation levers under review

| Lever | Mechanism | Why it might be top pick |
|---|---|---|
| **L1** | Cache UPS XAV result by normalized-address hash (TTL 5min / 24h) | Removes 100% of repeat round-trips. Largest user-visible win. |
| **L2** | Persist OAuth token across instances (Memorystore / shared cache) | Removes cold-OAuth penalty in defense-in-depth combination with L1. |
| **L3** | Cloud Run `min-instances ≥ 1` for delivery service | Cheap blunt mitigation, money trade-off. |
| **L4** | FE continental ZIP/state pre-check before submit | Already have continental schema (S01 #510/#538). Rejects obvious bad input pre-trip. |

T3 scores each formally; user picks one for T4.

---

## Out of scope

- **CROP-search-hono** — verified not in path
- FE-side caching / dedupe — no value over server-side cache
- Parallelize validate + rates — already not sequential at FE
- Switching providers away from UPS XAV — outside cost/risk envelope

---

## Track gates

| Track | Title | Gate | Output | Dep |
|---|---|---|---|---|
| T1 | Server-side timing breakdown | LOCKED | S02-T1-server-timing.md | — |
| T2 | Cache-opportunity quantification | LOCKED | S02-T2-cache-opportunity.md | T1 |
| T3 | Remediation architecture pack | LOCKED | S02-T3-remediation.md | T2 |
| T4 | Implementation plan for chosen lever | LOCKED | S02-T4-implementation-plan.md | T3 + human pick |

Stop after T4. Implementation work goes to S03 once T4 is approved.

---

## Invariants

- **No code edits inside S02** except a header-only Server-Timing change in T1 — that change needs explicit user approval before merging.
- **Addresses are PII.** Any caching proposal must use hashed keys, no raw addresses in logs/metrics, controlled retention.
- **No prior INVARIANTS.md** from S01 to link (S01 was triage).

---

## Unlock procedure

1. Flip `gate: LOCKED` → `gate: OPEN` on [`S02-ADDRESS-VALIDATION-PERF.ptl`](S02-ADDRESS-VALIDATION-PERF.ptl) and [`S02-T1-server-timing-breakdown.pd`](S02-T1-server-timing-breakdown.pd).
2. Say "scope-approved" or "proceed with T1."
3. PLANNER stops; QA picks up T1.

---

## Hand-off note

Sprint pivoted on 2026-05-29 from broad "find the bottleneck" to a focused UPS XAV bridge optimization. The pivot was triggered by a customer-supplied browser trace + a one-pass code-path discovery covering CROP-front + CROP-parts-services. CROP-search-hono is confirmed not involved.
