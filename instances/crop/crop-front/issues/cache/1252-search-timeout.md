# QA Flow — Issue #1252: fix(search-service): raise DEFAULT_TIMEOUT_MS 8s→15s

**URL:** https://github.com/CT-CROP/CROP-front/issues/1252  
**Labels:** bug, (Lane C)  
**Filed:** 2026-05-26  
**Triage status:** POSSIBLY-FIXED  

## Evidence

`lib/search-service/constants.ts` — timeout is now 15s:
```
// Aligned with the hono `statement_timeout` cap (15s) — `cappedQuery`
// 15s. The FE budget must be at least this large or the FE
```

`lib/search-service/client.test.ts:636`:
```typescript
// Run. FE must NOT have aborted yet — that was the original bug at 8s.
```
`lib/search-service/client.test.ts:640`:
```typescript
// Past hono's own 15s cap the FE timeout is the correct backstop.
```

`lib/search-service/parts-popular-client.ts:9-11`:
```
// Intentionally shorter than SEARCH_SERVICE_TIMEOUT_MS (15s, hono cap): this
// [popular parts band] → if hono is slow, we'd rather skip the band than block the page on a 15s
```

The fix is in: FE timeout raised to 15s, aligned with hono `statement_timeout`. Test regression guards the original 8s abort bug.

## Steps to verify manually

1. Check Vercel logs for `SearchServiceTimeoutError` events — frequency should have dropped significantly since the 8s timeout was causing premature aborts on slow queries
2. On prod: load a parts catalog page with a complex filter (e.g., `/parts?manufacturer=NHL&q=hydraulic`) and confirm no timeout error in Sentry from the FE aborting before hono responds

## Expected result
- No `SearchServiceTimeoutError` on queries that complete within 15s on hono
- Popular-parts band (5s timeout) may still timeout and gracefully degrade on slow hono

## Actual result (at time of filing, 2026-05-26)
- FE aborted requests at 8s even though hono was still processing (hono limit is 15s)
- `Sentry tag upstream.timeout=hono on SearchServiceTimeoutError` events logged

## Risk if wrongly closed
Low — the timeout constant is explicit in code and has test coverage that enforces the correct value. If hono timeout changes again, the test and constant are easy to update.
