# EPIC B — Navigation & UX

**Goals 2 + 4** · Owner: Oleg · Repo: CROP-front

## Outcome

Getting to a parts diagram is a straight line on both desktop and mobile, and brand pages
feel brand-specific rather than a wall of identical boxes.

- **Desktop:** no circular navigation loop — every breadcrumb/back link goes "up", never
  back to the page you were already on.
- **Mobile:** the diagram image-scroll experience (desktop-only today) is reachable on
  mobile via a trigger into the existing `MobileChapterDrawer`.
- **Brand pages:** equipment-type cards show type-specific imagery (already shipped —
  verify coverage for the 4 brands).
- **Ferris:** no visible flash when selecting a commercial-mower config.

## Why

John: *"Getting to that screen is the primary pain point."* The diagram screen itself is
strong; the path to it loses users — especially on mobile, where most customers browse.
And *"it's a little too much the same with just boxes"* — visual clarity drives conversion.

## State of play (verified 2026-06-03)

- The brand-routes assembly breadcrumb is **already correct** — the loop is elsewhere; B1
  starts with live repro. (see [F6](../CODE-FINDINGS.md#f6))
- Equipment-type imagery is **already built** (`lib/equipment/type-image.ts`, 12 assets,
  `TypeCard` renders it with icon fallback) — B3 is verify + gap-fill. (see [F5](../CODE-FINDINGS.md#f5))
- `MobileChapterDrawer` lives in `features/assemblies/chapter-sidebar.tsx` (258 lines);
  `assembly-interactive-view.tsx` (70 lines) holds the image panel. (B2)

## Tasks

| Task | Owner | Day | Notes |
|------|-------|-----|-------|
| [B1 — Desktop circular nav loop fix](../../S06-B1-desktop-nav-loop-fix.pd) | Oleg | D1–D2 | Repro first; both diagram systems |
| [B2 — Mobile assembly image-scroll panel](../../S06-B2-mobile-diagram-parity.pd) | Oleg | D2–D3 | Reuse `MobileChapterDrawer`; don't break pinch-zoom |
| [B3 — Equipment-type imagery: verify + gap-fill](../../S06-B3-brand-equipment-imagery.pd) | Oleg | D2 | Already shipped; check 4-brand slug coverage |
| [B4 — Ferris commercial-mower flash fix](../../S06-B4-ferris-flash-fix.pd) | Oleg | D3 | Needs clean Ferris routes (A2/A4) |
| B5 — Navigation smoke (B1+B2 sign-off) (ops, see [ROADMAP](../ROADMAP.md)) | Denis | D3 | Desktop loop + mobile drawer |
| [B9 — DiagramsToolbar sticky bar (#1608)](../../ROADMAP.md) | Denis | D3 | PR [#1672](https://github.com/CT-CROP/CROP-front/pull/1672) — remove redundant frosted strip |
| [B10 — GroupNav scroll-spy + hash (#1609)](../../ROADMAP.md) | Oleg | D3 | Bottom short section; no skip-one; `#g-*` in URL |
| [B11 — BOM thumbnails (#1613)](../../ROADMAP.md) | Oleg + Daniil | D3 | `imageUrl` on brand assembly BOM; related #1429 |
| [B12 — BOM add-to-cart (#1614)](../../ROADMAP.md) | Oleg | D3 | Enable `cart` in `ARI_CAPABILITIES`; NH parity |
| [B13 — GroupNav active scroll (#1616)](../../ROADMAP.md) | Oleg | D3 | `scrollIntoView` when activeId changes; related #1609 |
| [B14 — /parts toasts (#1618)](../../ROADMAP.md) | TBD | D3 | Priority via [#1622](https://github.com/CT-CROP/CROP-front/issues/1622) @appdev-v |
| [B15 — /parts cart toggle (#1619)](../../ROADMAP.md) | TBD | D3 | Same triage |
| [B16 — checkout address dialog (#1621)](../../ROADMAP.md) | TBD | D3 | Same triage |
| [B17 — /parts header toolbar gap (#1624)](../../ROADMAP.md) | Denis | D3 | PR [#1671](https://github.com/CT-CROP/CROP-front/pull/1671) QA PASS — ResizeObserver sync |
| [QT1 — QA priority triage (#1622)](../../ROADMAP.md) | **Vova** | D3 | **Assign P0/P1 + owners on #1608–#1624** |

## Epic acceptance

- Desktop: from `/parts-diagrams/{brand}` → model → assembly, every link routes "up"; brand
  crumb → `/parts-diagrams/{brand}`; breadcrumb depth ≤ 4
- Mobile (375px): "Browse Diagrams" trigger visible on assembly page; opens drawer with
  image thumbnails; tap image → viewer scrolls to section; pinch-zoom still works
- `/parts/brand/{brand}` TypeCards show type imagery (not generic icon) for covered slugs;
  uncovered slugs fall back gracefully (no broken layout)
- Ferris commercial-mower selection: CLS ≈ 0, no visible flash at 375px + 1280px
- Touch targets ≥ 44px; no console errors at 375px/1280px
