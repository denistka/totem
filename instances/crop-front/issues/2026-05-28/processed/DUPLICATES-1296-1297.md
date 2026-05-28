# Duplicate Pairs — auto-refile pattern detected

Snapshot: 2026-05-28  
Method: title normalization (strip numbers/dates, compare)

---

## Pair 1: ProductFeed shard failures

**KEEP (newer):** #1297 — created 2026-05-27  
`bug(seo): ProductFeed shard failures — shard 6 batch 90, shard 5 batch 71, shard 10 31/100 batches`

**CLOSE (older):** #1270 — created 2026-05-26  
`bug(seo): ProductFeed shard failures — shard 6 batch 90, shard 5 batch 71, shard 10 31/100 batches failed`

Signal: identical symptom, same author (appdev-v), 1-day apart, same batch numbers.  
Pattern: looks like automated daily re-file from a monitoring script.  
Recommendation: close #1270 with comment referencing #1297.

---

## Pair 2: assembly.pagination_overflow

**KEEP (newer):** #1296 — created 2026-05-27  
`bug(assembly): assembly.pagination_overflow Sentry warning — 52x last 100 events`

**CLOSE (older):** #1269 — created 2026-05-26  
`bug(assembly): assembly.pagination_overflow Sentry warning — 52x in last 100 events`

Signal: same symptom, same event count (52x), same author, 1-day apart.  
Pattern: same automated re-file pattern as Pair 1.  
Recommendation: close #1269 with comment referencing #1296.

---

## Possible Pair 3: ImageSitemap shard 0 failures

**Newer:** #1298 — created 2026-05-27  
`bug(seo): ImageSitemap shard 0 batch 4 + 1/10 batches failed at ship`

**Older:** #1271 — created 2026-05-26  
`bug(seo): ImageSitemap shard 0 — batch 4 failed + shard 0 shipped with 1/10 batches failed`

Signal: same shard 0, same batch 4 failure, same author, 1-day apart.  
Note: title differs more than pairs 1/2 so flagging as POSSIBLE-DUPLICATE, not confirmed.  
Recommendation: human review — if same underlying job, close #1271 → #1298.

---

## Action required
> ⚠️ Do NOT close on GitHub until "push issues to github" command is given.  
> All proposals above are suggestions only.
