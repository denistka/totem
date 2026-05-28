# QA Flow — Issue #636: PDP ServiceUnavailable UX — soften copy + nav fallback + Sentry alert

**URL:** https://github.com/CT-CROP/CROP-front/issues/636  
**Labels:** bug, (Lane C)  
**Filed:** 2026-05-03 · Updated: 2026-05-18  
**Triage status:** POSSIBLY-FIXED  

## Evidence

`features/product-detail/service-unavailable.tsx` — dedicated component exists:
```tsx
// front#757 — passed through to the Sentry beacon so a soft-503 event
<meta name="robots" content="noindex,nofollow,noarchive" />
```

`features/product-detail/service-unavailable-beacon.tsx` — Sentry alert component exists (dedicated file + test).

`app/parts/[id]/page.tsx:189,221,355,465-470` — error handling chain:
```typescript
// Networks or unhealthy backend → escalate to ServiceUnavailable UI.
// ServiceUnavailable centralises the `<meta robots noindex>` hoist so
return <ServiceUnavailable diagnostic={error.diagnostic} />
```

References in code: `front#983` (Hono down → body renders `<ServiceUnavailable />`), `front#757` (predecessor), `front#636` (this issue).

All three requested items are addressed:
- Softened copy: `ServiceUnavailable` component renders user-friendly message
- Nav fallback: component includes navigation options (not a dead end)
- Sentry alert: `service-unavailable-beacon.tsx` fires on render

## Steps to verify manually

1. On prod, temporarily visit a PDP of a part with a slug that would trigger an API failure, OR wait for next Hono hiccup in Sentry
2. Confirm: user sees a friendly "something went wrong" UI, not a raw error
3. Confirm: page has `<meta robots noindex>` (check with browser DevTools → Elements)
4. Confirm: Sentry receives a `ServiceUnavailable` event with `diagnostic` context
5. Confirm: user can navigate away via the fallback links (no dead end)

## Expected result
- Softened, helpful copy on PDP 503 states
- NOINDEX meta tag prevents Googlebot from indexing error pages
- Sentry receives diagnostic event for monitoring
- User has navigation path out (not a dead end)

## Actual result (at time of filing, 2026-05-03)
- Raw error state or blank page on PDP when Hono backend was down
- No Sentry alert on service unavailability
- No NOINDEX — risk of Google indexing error pages

## Risk if wrongly closed
Low — the `ServiceUnavailable` component and Sentry beacon are wired and tested. If the backend error type changes (e.g., new error class not caught), the beacon would not fire. Monitor Sentry for PDP 503 coverage gaps.
