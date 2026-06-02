# QA Flow — Issue #316: Cart hydrate backfill — refetch packQty/requiresPackBuy for legacy cart items

**URL:** https://github.com/CT-CROP/CROP-front/issues/316  
**Labels:** bug, high, goal/obj-01  
**Triage status:** POSSIBLY-FIXED

## Evidence

`app/cart/_components/cart-legacy-hydrate.tsx`:
```ts
// front#316 — backfill `packQty` + `requiresPackBuy` for legacy cart items
// that were added before the pack-buy invariant was enforced.
if (item.packQty == null && item.requiresPackBuy == null) {
  // ... backfill logic
}
```
Comment explicitly references #316. The `CartLegacyHydrate` component is mounted in the cart page and fires on items that lack pack fields.

## Steps to verify manually

1. Open clintontractor.net in a browser where you have an old/legacy cart (items added before 2026-05-10)
2. Open the cart page `/cart`
3. Confirm that pack items in the cart show pack badge ("Pack of N") even if they were added before pack-buy logic shipped
4. Confirm that legacy single-unit items show no phantom pack badge
5. Optional: open DevTools → Application → Local Storage → cart store → inspect `packQty` and `requiresPackBuy` fields on old cart items

## Expected result
Legacy cart items correctly show pack badge + pack quantity after page load.

## Actual result (at time of filing)
Legacy cart items had no `packQty`/`requiresPackBuy` in the cart store — pack invariant guard was bypassed silently.

## Risk if wrongly closed
Medium — if hydrate doesn't fire in some edge case (e.g., hydration race), legacy items could still bypass the pack qty enforcer at checkout. The pack-buy invariant test in `cart-item-card.test.tsx` should catch this regression.
