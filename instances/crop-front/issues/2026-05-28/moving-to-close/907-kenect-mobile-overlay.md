# QA Flow — Issue #907: P0 (mobile): Kenect chat widget overlays Add to Cart on PDP

**URL:** https://github.com/CT-CROP/CROP-front/issues/907  
**Labels:** bug, urgent, sale-blocker, goal/obj-04  
**Filed:** 2026-05-16  
**Triage status:** POSSIBLY-FIXED  

## Evidence

Code in `components/kenect-widget.tsx` (read 2026-05-28 on dev branch) contains:

```
// Why mobile is fully disabled (CROP-front#918, supersedes #913/#914):
//   The vendor auto-mounts a fixed bottom-right prompt + button with
//   `z-index: 2147483000` (max-int floor). On phones it overlaps the sticky
//   Add to order bar on the PDP (`z-30`), blocks the primary purchase action,
//   and ships a dismiss "X" that is too small to hit cleanly.
//   John's call (2026-05-16) made the call: mobile customers get a direct
//   phone Call button instead (see layout/Header/MobileCallButton.tsx)
//   and Kenect never injects below the `(min-width: 768px)` breakpoint.
```

The fix implemented in #918:
- `KenectWidget` checks `window.matchMedia('(min-width: 768px)')` before injecting script
- On mobile (< 768px): script is never appended, no listener registered
- `app/layout.tsx` line 184: `{process.env.VERCEL_ENV === "production" ? <KenectWidget /> : null}`

Local test: Kenect not active on localhost (dev env), cannot reproduce.

## Steps to verify manually on real iPhone

1. Open https://clintontractor.net/ on iPhone (Safari or Chrome)
2. Navigate to any PDP — e.g., `/parts/CT-NHL-10263460`
3. Scroll to the "Add to cart / Add to order" sticky bar at the bottom
4. Confirm: **no Kenect chat bubble visible** at bottom-right overlapping the CTA
5. Also confirm: tapping the sticky bar registers (not blocked by invisible widget)
6. Check desktop (>= 768px): Kenect chat bubble SHOULD appear at bottom-right

## Expected result
- Mobile (< 768px): no Kenect widget, sticky CTA fully accessible
- Desktop: Kenect widget visible at bottom-right, does not overlap primary CTA

## Actual result (at time of filing, 2026-05-16)
- Kenect z-index 2147483000 covered the Add to Cart bar on mobile
- Dismiss "X" too small to hit

## Risk if wrongly closed
Low — the fix explicitly disables Kenect on mobile entirely. MobileCallButton replaces the support path. If verification confirms no widget on mobile, it is safe to close. If the widget still appears (e.g., vendor script changed), reopen immediately.

## Superseded by
#918 (fix), also mentions #913, #914 as prior attempts.
