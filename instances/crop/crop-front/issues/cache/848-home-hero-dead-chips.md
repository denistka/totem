# QA Flow — Issue #848: Home hero: clean dead chips + add Part Store / Parts Diagrams CTAs

**URL:** https://github.com/CT-CROP/CROP-front/issues/848  
**Labels:** bug, urgent, sale-blocker, goal/obj-01, ready-for-human  
**Filed:** 2026-05-15  
**Triage status:** POSSIBLY-FIXED  

## Evidence

`app/_components/home/hero-search.tsx` (read 2026-05-28):

```
// ── Browse: chip row — intentionally removed in #848 ─────────────────────
// The prior chip row pointed to `/equipment` (being demoted per #842),
// brand-leaf `/parts/brand/<x>/type/<y>` pages (also demoted), and a
// `q=maintenance+kit` query that returned 3 results due to the AND-mode
// `q` trap (same class as #841 / PR #845). Cutting the row cleans up the
// hero composition; future entries are gated by ...
```

```ts
export const ALT_ACTIONS: readonly AltAction[] = [
  { label: "Parts Store", href: "/parts", Icon: Tag },
  { label: "Parts Diagrams", href: "/parts-diagrams", Icon: ListChecks },
];
```

**Local test (curl):** Homepage renders "Parts Store" (10×) and "Parts Diagrams" (10×) — CTAs are live.

## Steps to verify manually

1. Open https://clintontractor.net/
2. In the hero section: confirm 2 CTA buttons visible — **"Parts Store"** and **"Parts Diagrams"**
3. Confirm NO dead chip row (no brand, equipment, or "maintenance kit" chips visible)
4. Click "Parts Store" → should land on `/parts` with results
5. Click "Parts Diagrams" → should land on `/parts-diagrams` with content

## Expected result
Two CTAs (Parts Store, Parts Diagrams), zero dead chips.

## Actual result (at time of filing, 2026-05-15)
Hero had dead chips linking to pages with 0 results or demoted equipment paths.

## Risk if wrongly closed
Low — dead chips are gone per code. If a new chip appears (future code change), the allowlist CI guard will catch it.
