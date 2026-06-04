# CROP v2 — Goals & Scope
> Derived from team meetup 2026-06-02. Target delivery: **Friday 2026-06-06** (next Friday from meeting date).

---

## Primary Goal

Ship a production-ready **multi-brand** parts platform that reliably gets users to parts diagrams — on both desktop and mobile — with zero critical navigation bugs.

---

## Goal 1 — Onboard New Brands to Production

Bring **Ferris, Ventrak, Male (CLAAS Mále), and Marrest** from dev state to production-ready.

Each brand must have:
- Brand-specific landing page (not a generic clone of New Holland)
- Correct category structure for that brand's equipment lineup (Ferris/Ventrak: commercial mowers, niche attachments; Male: balers, hay tools; Marrest: TBD)
- SEO-ready URL slugs and clean indexable structure
- Verified data wiring — all configuration numbers surfaced and searchable

**Why:** Clinton Parts has national-scale opportunity for these smaller brands (Ferris = #1 dealer nationally, Ventrak = one of very few dealers in the US). Currently only accessible locally. V2 opens them online.

---

## Goal 2 — Fix Navigation to Parts Diagrams

The parts diagram screen itself is strong. Getting there is the main pain point. Fix the path, not the destination.

Required improvements:
- Desktop: remove circular navigation loops (e.g. "Open parts diagram" going back to the same menu)
- Mobile: expose the diagram image-scroll UI that currently only exists on desktop; mobile users fall into meaningless nested menus
- Reduce steps to reach a diagram from the brand/model entry point
- Configuration number (59-numbers for commercial mowers) must be a reliable, direct entry point into diagrams

**Why:** "Getting to that screen is the primary pain point." — John. Users know their tractor, they know they need a part; the app must not lose them on the way.

---

## Goal 3 — Multibrand Search

Search currently works against the New Holland dataset only. V2 introduces multiple brands with potentially overlapping part numbers.

Required:
- Search must resolve correctly when a part number exists across multiple manufacturers
- Dan (search specialist) must be briefed on these new requirements before the release
- Configuration numbers work as valid search entry points across all new brands

**Why:** Part numbers collide across manufacturers. A search that returns wrong-brand results destroys trust.

---

## Goal 4 — UX: Brand Pages Feel Brand-Specific

Current brand pages are generic — just boxes with hex tractor icons. V2 brand pages must feel intentional.

Required:
- Brand-specific imagery on each brand landing page (can use dealer marketing assets)
- Equipment type images on category/model listing pages
- Clear visual grouping so users can orient quickly (not a wall of identical boxes)

**Why:** "It's a little too much the same with just boxes." — John. Visual clarity drives conversion. Pages that look sparse lose users before they buy.

---

## Goal 5 — Quality & Stability

V2 must be demonstrably bug-free before going to production — not aspirationally.

Process:
- Dev environment mirrors production test scenarios exactly
- Denis reviews and tests PRs locally before Vova's final check
- PR workflow: Oleh opens PR → Denis runs locally + reviews → Vova reviews UI/UX + merges
- Known bugs from current backlog absorbed into scope where possible rather than creating new issues
- Small bugs found during feature work: fix inline, document in a backlog task list (not new issues)

**Why:** "I want to make sure that when we move version two into production we are to the degree possible bug-free." — John. V2 is being shown to ownership.

---

## Goal 6 — Issue Hygiene (Process Goal)

Not a feature, but a hard requirement going forward.

- Every issue must start with an **impact statement**: one paragraph explaining *why* the work matters, not what it does technically
- Small bugs found in scope: absorb into the existing issue or add to a shared backlog task list — do not create individual issues
- Goal: John can read 10 issue titles and impact statements in 2 minutes and understand what the team is doing without reading technical details

**Why:** "I just want to know why and then if it's important I'll read it." — John. With 400+ issues and an active backlog, scannable context at the top of each issue is non-negotiable.

---

## Out of Scope for V2

These were mentioned but explicitly deferred:

- "My Garage" / saved vehicle feature
- AI-powered search or recommendations
- Full content/imagery for all 50+ brands (Maria or content hire needed; not on dev team)
- Deep refactoring or feature-slice architecture migration (discussed post-John, no commitment made)

---

## Team Roles for V2

| Person | Role |
|--------|------|
| Oleh Pedchenko | Lead front-end & UX; owns navigation quality, bug reduction, mobile/desktop parity |
| Denis Baranov | PR review (run locally first), QA alignment, second pair of eyes on Oleh's work |
| Vova Pirotskiy | Final PR verification (UI/UX check), architecture, data wiring, brand onboarding |
| Dan | Search — needs to be briefed on multibrand search requirements ASAP |
| Alex | Existing team; impact statement model for others to follow |

---

## Definition of Done (V2)

- [ ] Ferris, Ventrak, Male, Marrest accessible in production with brand pages
- [ ] User can reach a parts diagram from the brand landing page in ≤ 3 steps on mobile
- [ ] Configuration number search returns correct brand-specific results
- [ ] No circular navigation loops on desktop
- [ ] Mobile diagram browsing (image scroll) works equivalently to desktop
- [ ] All new brands tested against the same production test scenarios in dev before release
- [ ] Dan briefed on multibrand search gap
- [ ] Figma link shared with full team for brand page reference
