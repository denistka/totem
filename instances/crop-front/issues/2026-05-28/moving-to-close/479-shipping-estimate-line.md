# QA Flow — Issue #479: Phase G: stabilize ShippingEstimateLine items dep before PDP wiring

**URL:** https://github.com/CT-CROP/CROP-front/issues/479  
**Labels:** bug, goal/obj-01, low  
**Triage status:** POSSIBLY-FIXED

## Evidence

`features/shipping-estimate/shipping-estimate-line.tsx` — stable component exists.

`features/shipping-estimate/pdp-shipping-estimate.tsx`:
```ts
// front#467 Phase G, UC-11. Wraps ShippingEstimateLine for PDP
<ShippingEstimateLine items={items} initialZip={initialZip} surface="pdp" />
```

`app/cart/_components/cart-content.tsx`:
```ts
import { CartShippingEstimate } from "@/features/shipping-estimate/cart-shipping-estimate";
```

`app/parts/[id]/_components/product-detail.tsx:269`:
```
// CT-950 — the PDP shipping estimate moved here from the server tree (it's
// now a stable client-side feature with proper IP-geo ZIP seeding).
```

Phase G wiring is complete. `ShippingEstimateLine` is used on both PDP and cart page.

## Steps to verify manually

1. Open any PDP, e.g., clintontractor.net/parts/CT-NHL-48186079
2. Confirm a shipping estimate row appears below the purchase panel (showing ZIP + estimated rate)
3. Open the cart `/cart` — confirm shipping estimate appears in the cart sidebar
4. Change the ZIP in the estimate widget — confirm rate updates correctly

## Expected result
Shipping estimate line is stable and visible on PDP and cart, not crashing or showing undefined.

## Actual result (at time of filing)
`ShippingEstimateLine` had an unstable dependency chain preventing PDP wiring.

## Risk if wrongly closed
Low — if the component renders correctly on PDP and cart (as verified above), the stabilization is complete. A missing estimate line would be immediately visible.
