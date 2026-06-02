# QA Flow — Issue #1252: fix(search-service): raise DEFAULT_TIMEOUT_MS 8s→15s

**URL:** https://github.com/CT-CROP/CROP-front/issues/1252  
**Labels:** bug, medium, in-progress, goal/obj-07  
**Filed:** 2026-05-26  
**Triage status:** POSSIBLY-FIXED (label "in-progress" appears stale)

## Evidence

`lib/search-service/constants.ts`:

```ts
export const SEARCH_SERVICE_TIMEOUT_MS = 15_000;
```

`lib/search-service/client.test.ts:607`:
```ts
expect(SEARCH_SERVICE_TIMEOUT_MS).toBe(15_000);
```

The constant is used in:
- `brand-taxonomy-client.ts` — `config.timeoutMs ?? SEARCH_SERVICE_TIMEOUT_MS`
- `fetch-vocabulary.ts` — `Default to SEARCH_SERVICE_TIMEOUT_MS so callers don't accidentally inherit`

The issue asked to raise from 8s → 15s. The constant is now 15_000ms and pinned by a test.

## Steps to verify manually

1. Check Vercel deployment logs after a recent deploy — confirm no `SearchServiceTimeoutError` spikes vs pre-fix baseline
2. On Sentry: filter `SearchServiceTimeoutError` events, compare rate before and after ~2026-05-26
3. Optionally: trigger a slow search on prod and confirm it doesn't time out at 8s

## Expected result
No `SearchServiceTimeoutError` on searches that complete within 8–15s window.

## Actual result (at time of filing)
Search calls timing out at 8s when hono needed up to 15s.

## Risk if wrongly closed
Low for the timeout value itself — it's been raised and tested. However, if Sentry still shows `SearchServiceTimeoutError` after the fix, the root cause may be hono latency exceeding 15s, which is a separate issue (#1256 covers the Sentry tagging part).
