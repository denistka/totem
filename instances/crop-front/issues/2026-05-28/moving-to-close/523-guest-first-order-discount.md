# QA Flow — Issue #523: guest 15% first-order discount computed server-side but never displayed

**URL:** https://github.com/CT-CROP/CROP-front/issues/523  
**Labels:** bug, high, checkout, qa, goal/obj-01  
**Filed:** ~2026-04-28  
**Triage status:** POSSIBLY-FIXED  

## Evidence

`app/actions/delivery.ts`:
```ts
const firstOrderDiscount = orderValue * 0.15;
if (isFirstOrder && firstOrderDiscount > 0) {
  totalSavings += firstOrderDiscount;
  // type: "first_order_discount"
}
```

`app/checkout/review/_components/review-guest-prompt.tsx:76`:
```tsx
{item.type === "first_order_discount" ? "First order" : "Shipping"}
```

The discount is computed in the delivery action AND rendered on the review page with the label "First order".

## Steps to verify manually

1. Open https://clintontractor.net/ in a **private/incognito window** (guest, no account)
2. Add any part to cart
3. Proceed to checkout → Shipping step
4. On the shipping step: check if a "15% first order discount" line item appears anywhere in the order summary
5. Proceed to Review step: confirm a "First order" discount line appears in savings summary
6. Confirm the discount amount = 15% of order subtotal

## Expected result
Guest on first order sees 15% discount line prominently during checkout.

## Actual result (at time of filing)
Discount was computed server-side but never surfaced in the UI — customer had no visibility.

## Risk if wrongly closed
Medium — if the discount shows on review but NOT on the shipping step (where the customer first chooses rates), they may not know to proceed. Verify it's visible early enough to influence purchasing behavior.
