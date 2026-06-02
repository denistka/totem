# QA Flow — Issue #539: UC-D-21 — /checkout/review does not re-classify cart lines server-side

**URL:** https://github.com/CT-CROP/CROP-front/issues/539  
**Labels:** bug, high, checkout, qa, goal/obj-01  
**Triage status:** POSSIBLY-FIXED

## Evidence

`app/checkout/review/_components/review-page-content.classification-recheck.test.tsx`:
```ts
// #491 UC-D-21 / #539 — server-side classification re-check at /checkout/review.
describe("ReviewPageContent — UC-D-21 classification re-check (#539)", () => {
```

The test spec explicitly covers UC-D-21 re-classification behavior, including scenarios where cart lines should be re-classified before Stripe payment is initiated.

## Steps to verify manually

1. Add to cart a part that has a "ships direct" or "freight" classification
2. Proceed through checkout shipping step normally
3. On `/checkout/review`, observe that the order summary reflects the correct shipping classification (not the stale client-side value from when the item was added)
4. Confirm that if classification changes between "add to cart" and "review", the review page shows the updated class

## Expected result
Cart lines are re-classified server-side when `/checkout/review` renders, preventing stale classification data from flowing to Stripe.

## Actual result (at time of filing)
`/checkout/review` used client-side cart state without server-side re-classification.

## Risk if wrongly closed
High — if re-classification does not fire, customers could proceed to payment with wrong shipping class (e.g., thinking an item ships ground when it actually requires freight). Run the classification-recheck test in CI to confirm coverage.

**CI check:** `bun test app/checkout/review/_components/review-page-content.classification-recheck.test.tsx`
