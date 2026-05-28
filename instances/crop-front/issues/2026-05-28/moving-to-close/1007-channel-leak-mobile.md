# QA Flow — Issue #1007: P0 — Mobile redesign: 3 channel-leak surfaces + missing shippingProvider

**URL:** https://github.com/CT-CROP/CROP-front/issues/1007  
**Labels:** bug, urgent, goal/obj-01  
**Filed:** (open)  
**Triage status:** POSSIBLY-FIXED  

## Evidence

Code on dev branch (#1301) — 3 surfaces explicitly guarded:

**Surface 1 — Checkout review:**  
`app/checkout/review/_components/shipping-summary.tsx:48`
```
// the fulfillment source/location/depot (#1086 no-channel-leak rule).
```
`app/checkout/review/_components/shipping-summary.tsx:150` — channel info omitted from customer-visible summary.

**Surface 2 — PDP view model:**  
`app/parts/[id]/_view-model/types.ts:78`
```
// NOT forwarded to the customer payload (depot/channel leak). Client
```

**Surface 3 — Staff inventory panel:**  
`app/parts/[id]/_components/staff-inventory-panel.tsx:167`
```
// (channel / depot / vendor vocabulary never reaches the customer view).
```

**shippingProvider:**  
`app/checkout/success/page.tsx:42,105,245` — typed as `string | undefined`, applied via `optionalString()` guard. Correctly handled.

**Test coverage:**  
`app/checkout/review/_components/shipping-summary.test.tsx:15`
```
// Spec: no-channel-leak rule (John 2026-05-18 14:01) +
```

## Steps to verify manually

1. Sign in as a customer (not staff)
2. Add any part to cart, proceed to `/checkout/shipping`
3. On `/checkout/review` — confirm: no depot name, fulfillment center ID, or warehouse channel visible to customer
4. Complete order, check `/checkout/success` — confirm shippingProvider (UPS/FedEx/etc.) shows correctly if present, no internal channel identifier visible
5. On PDP (`/parts/{id}`) as customer — confirm no "channel", "depot", or vendor-routing info visible in price or availability display

## Expected result
- No internal depot/channel/fulfillment-source identifiers visible to customer at any step
- shippingProvider (public carrier name) does appear on success page when available

## Actual result (at time of filing)
- 3 surfaces leaked internal channel identifiers to customer-facing UI
- shippingProvider was missing on order confirmation

## Risk if wrongly closed
Medium — if a future refactor removes the `no-channel-leak` guards without noticing the comments, channel data could re-surface. Guards are code-comments only, not type enforcement. Recommend closing only after a full checkout QA pass confirms no channel names visible to customers.
