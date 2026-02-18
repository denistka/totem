# Design & UI Sprint Guide (project-agnostic)

Universal guide for planning, executing, and closing UI/design sprints.  
Applies to any frontend stack. Stack-specific details live in `stacks/<stack>/` adapters.

---

## Principles

### 1. Reuse, don't multiply

- Before creating a new component, style, or pattern — **search the codebase** for something similar.
- If a base exists, **extend or configure it**; do not create a parallel implementation.
- One modal style → one shared component. One primary button → one variant. One form-field wrapper → one component.
- **Lesson (S44):** We spent significant time manually fixing screens because glass styling was applied ad-hoc (inline classes) instead of through reusable components. Had GlassCard/GlassButton existed from the start, applying the design across 9 screens would have been trivial.

### 2. Consistent changes based on base entities

- **Analyze the codebase thoroughly** before making changes.
- Base decisions on **foundational entities**: design tokens (CSS variables / theme), shared components (headers, modals, buttons), established patterns (overlay, spacing scale).
- When changing a pattern, **find every place** that implements it and update all to the same base. Don't leave half the app on the old pattern.
- **Lesson (S44):** Objects and Settings screens had partial `glass` usage while other screens had none. Inconsistency required a full audit (T1) before any changes could begin. If every screen had used the same component, one change would propagate everywhere.

### 3. Reference implementation first

- Before mass-applying a design across multiple screens, **build one reference screen end-to-end**.
- Get approval on the reference screen, then replicate the pattern.
- The reference screen defines: tokens, components, interactions, accessibility, performance.
- **Lesson (S44):** Login screen served as the reference. All other screens were measured against it.

### 4. Tokens before components, components before screens

- **Order matters**:
  1. Design tokens (colors, spacing, typography, shadows, transitions)
  2. Shared components (card, button, input, modal)
  3. Screen-level composition
- Never apply visual changes at the screen level without first having proper tokens and components.
- **Lesson (S44):** Screens had hard-coded glass values (`bg-opacity: 0.38`) instead of using `--glass-bg-opacity` tokens. This made global adjustments impossible without touching every file.

### 5. Protect previous sprint invariants

- When a sprint establishes design tokens, component APIs, animations, or CSS classes — these become **invariants**.
- The next sprint MUST document exactly which values, names, and behaviors are frozen.
- Create an `INVARIANTS.md` file listing every frozen item with exact values, rationale, and verification checklist.
- **Changes to invariants are BLOCKED** until explicitly discussed and resolved.
- **Lesson (S44→S45):** S44 established glass tokens, 3 animations, and element-specific CSS overrides (e.g. `button.glass` has no border). Without an invariant doc, S45 could accidentally break these tuned values.

### 6. Deduplicate before adding

- Before creating new components or patterns, **audit for existing duplicates**.
- Common duplication: overlay/backdrop patterns, dropdown triggers, tab bars, fixed bottom CTAs, inline SVG icons.
- Extract shared patterns BEFORE applying new changes — otherwise you multiply the problem.
- Target: every UI pattern exists in exactly ONE place. Screens compose, not re-implement.
- **Lesson (S44→S45):** After S44, 6 separate dropdown buttons (glass + ChevronDown) existed across 3 screens. 2 identical overlay patterns. 3 identical fixed-bottom CTAs. Each would need individual updating.

### 7. Keep components small

- No screen/component file should exceed **200 lines** (excluding comments/types).
- If a file grows beyond this, split into focused sub-components.
- Parent manages state + passes callbacks; children are presentational.
- Complex components (e.g. date pickers, forms) get their own **folder** with sub-components.
- **Lesson (S44→S45):** DateRangePicker grew to 533 lines — calendar, time picker, clock display, and utils all in one file. Changing any part risked breaking others.

### 8. Polish incrementally

- Visual improvements (spacing, shadows, animations) must be applied **one at a time**.
- Build after each change. Check both themes (light + dark).
- If visual result is worse, **revert immediately** — don't try to fix forward.
- No new npm packages for visual changes.
- **Lesson (S44→S45):** Batch visual changes make it impossible to pinpoint which change caused a regression.

---

## Before a design sprint

### Checklist

**Design system:**

- [ ] Confirm design tokens location (e.g. CSS variables in `index.css`, theme file, or design-tokens package).
- [ ] List any **new tokens** needed for the sprint (colors, shadows, blur values, animation durations).
- [ ] If the project has a theme (light/dark): verify tokens support both.
- [ ] If the project supports `prefers-reduced-motion`: verify all animations have this guard.
- [ ] Review previous sprint invariants (if any). Create `<SPRINT>-INVARIANTS.md` documenting what MUST NOT change.
- [ ] Audit for duplicated UI patterns that should be consolidated first.

**Screens and flows:**

- [ ] List screens/flows in scope; mark which are **new** vs **refactor**.
- [ ] For modals/dialogs: decide shared pattern (one BottomSheet/Modal component) vs custom.
- [ ] Identify **reusable building blocks** from existing UI kit or project components.
- [ ] Check file sizes: flag any component > 200 lines for splitting.
- [ ] Count duplicate patterns: same overlay, same button layout, same tab bar — candidates for extraction.
- [ ] Identify the **reference screen** (the one already approved or closest to target).

**Dependencies:**

- [ ] Align with canonical UI dependencies (package.json, design system package).
- [ ] No unapproved UI libraries — use existing stack.
- [ ] Verify build tools can handle new patterns (e.g. PostCSS plugins, SSR compatibility).

### Backlog shape

- Group items by **screen or feature**; tag each: `[design-tokens | components | accessibility | copy]`.
- Prioritize: **tokens and shared components first**, then screen-specific UI.
- Spike: one "reference" screen implemented end-to-end before replicating.

---

## During the sprint

### Patterns to enforce

- **Reuse modals/sheets** and form controls; avoid new one-off overlay styles.
- **Consistent modal/popup styling**: same overlay (e.g. backdrop-blur + dim), same content position (bottom sheet vs centered).
- **Buttons**: primary = one prominent style; secondary = consistent; destructive = explicit variant. Never two "primary" styles.
- **Lists and forms**: spacing from design tokens or scale; align with existing screens.
- **Never add a CSS class** that duplicates what a component already encapsulates. If `<GlassCard>` exists, don't manually write `bg-opacity-38 backdrop-blur-16` on a div.
- **Touch targets**: all interactive elements ≥ 44px (Apple HIG). Primary CTAs recommended 48-56px. Spacing between targets ≥ 8px.
- **Component size**: if a file exceeds 200 lines during the sprint, immediately split before continuing.
- **Invariant protection**: if you are about to change a value documented in INVARIANTS.md — STOP and discuss first.

### Quality gates

- **Accessibility**: focus order, ARIA where needed, keyboard (Escape to close, Enter/Space to activate), `prefers-reduced-motion` for animations, color contrast (WCAG AA: 4.5:1 text, 3:1 large text).
- **Responsive**: use intrinsic sizing (CSS Grid, Flexbox, clamp, minmax); avoid magic numbers. Use breakpoints already established in the project.
- **Performance**: `contain: layout style` on animated elements, `will-change` where beneficial, hardware-accelerated properties (transform, opacity) over layout-triggering ones (width, height, top/left).
- **Lighthouse**: tap target audit should PASS. Performance ≥ 85, Accessibility ≥ 95.
- **No inline styles** for layout/theme — use classes or tokens.

### Common mistakes to avoid (lessons from experience)

| Mistake                          | What happened                                                                       | Prevention                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Ad-hoc styling                   | Glass classes used directly in JSX instead of components; 9 screens to fix manually | Create reusable components first (T3 before T4)            |
| Partial updates                  | Objects screen had glass, Settings had partial, rest had none                       | Audit all screens (T1) → apply everywhere in one pass (T4) |
| Missing tokens                   | Hard-coded opacity/blur values scattered across files                               | Extract tokens to single source of truth first (T2)        |
| Animation without reduced-motion | Background pulse ran on all devices, inaccessible                                   | Add `prefers-reduced-motion` from day one                  |
| No reference screen              | Team implements different interpretations of "glass design"                         | Approve one reference screen, then derive all others       |
| Scope creep                      | Adding new components during "apply" phase                                          | Phase discipline: audit → tokens → components → apply      |
| Breaking previous invariants     | New sprint accidentally changed tuned token values from prior sprint                | Create INVARIANTS.md; block changes to frozen values       |
| Duplicate patterns               | Same overlay/button/tab pattern copied 3-6 times across screens                     | Dedup audit before new work; extract shared components     |
| God components                   | Single file growing to 300-500+ lines, mixing concerns                              | Split at 200 lines; folder structure for complex widgets   |
| Batch visual changes             | Multiple CSS tweaks at once, impossible to identify which broke the design          | One change → build → check both themes → next change       |

---

## After the sprint

### Handover

- Document new/changed components and patterns in project README (e.g. "Key UI patterns" section).
- Update design-system docs if new tokens or variants were added.
- Note any tech debt or follow-up (e.g. "unify remaining modal styles").
- Update project epics/sprints tracking (e.g. LOG.ti, TOTEM_SPRINTS).
- **Create INVARIANTS.md** for the next sprint — document all tokens, animations, component APIs, and CSS classes that are now frozen.

### Planning next

- Review backlog for next UI sprint; move "design-tokens" and "shared components" items up if still missing.
- Reference this guide in sprint kickoff.
- Consider a Lighthouse audit for performance/accessibility baseline.
- Check component file sizes — flag any > 200 lines.
- Audit for duplicate patterns — schedule dedup if found.

---

## Sprint structure templates

### Single-track design sprint (basic)

```
Phase 1: AUDIT (0.5d)
  └─ T1: Audit current design across all screens
  └─ Deliverable: AUDIT.md (current state, inconsistencies, recommendations)

Phase 2: DESIGN SYSTEM (1-2d)
  └─ T2: Extract/organize tokens, document design system
  └─ Deliverable: design-system.md, updated token files

Phase 3: COMPONENTS (1-2d)
  └─ T3: Create/update reusable components with variants
  └─ Deliverable: New components, updated existing components

Phase 4: APPLICATION (1-2d)
  └─ T4: Apply design system to all screens using components
  └─ Deliverable: All screens updated, consistent styling

Phase 5: OPTIMIZATION (1-1.5d, parallel tracks)
  ├─ T5: Performance (60fps, containment, GPU acceleration)
  └─ T6: Accessibility (reduced-motion, ARIA, keyboard, contrast)

Phase 6: QA (0.5d)
  └─ T7: Visual QA, cross-browser, cross-device, Lighthouse
  └─ Deliverable: QA-REPORT.md
```

### Multi-track sprint (compound)

When a sprint combines sizing, deduplication, and polish:

```
Track A: Core fix (e.g. touch targets)
  T1: Audit → T2: Tokens → T3: Components → T4: Apply → T5: QA
                                                │
Track B: Component health (after T4)            ▼
  T6: Dedup audit → T7: Extract shared → T8: Split oversized
                                                   │
Track C: Visual polish (after T8)                  ▼
  T9: Trend audit → T10: Micro-improvements → T11: Motion → T12: Final QA
```

**Multi-track rules:**

- Tracks are sequential (B starts after A's apply phase).
- Each track has its own audit phase — never skip analysis before changes.
- An INVARIANTS.md from prior sprints gates ALL tracks.
- Final QA covers ALL tracks together.

**Key rule**: Never skip phases. T3 depends on T2; T4 depends on T3. Skipping components and applying styles directly to screens creates the exact ad-hoc mess this guide exists to prevent.

---

## Invariant management

After a UI sprint completes, create `<SPRINT>-INVARIANTS.md` in the sprint folder documenting:

| Section                | Contents                                                       |
| ---------------------- | -------------------------------------------------------------- |
| CSS tokens             | Every custom property with exact values (both themes)          |
| CSS classes            | Element-specific overrides (e.g. `button.glass` has no border) |
| Animations             | Keyframe names, durations, easing — exact                      |
| Component APIs         | Props interfaces, variant names — frozen                       |
| Performance rules      | Containment, will-change, hardware acceleration                |
| Anti-patterns          | Established "never do" rules                                   |
| Verification checklist | Checklist for next sprint to verify nothing broke              |

**Hard rule**: Any change to an invariant is BLOCKED until discussed. The invariant doc is linked in the next sprint's `.ptl` file via `invariants:` field.

---

## References

- `core/ITERATION_FLOW.md`: Universal sprint phases (PLAN → DESIGN → DEVELOP → VERIFY → CLOSE).
- `guardians/ARCHITECT.ti`: Architecture rules (DRY, SRP, component size limits).
- `guardians/QA.ti`: Testing and verification standards (including touch targets, Lighthouse).
- Stack-specific UI adapters: `stacks/<stack>/UI_UX.ti`, `stacks/<stack>/APP_UI_KIT.ti`.
- Instance README: project-specific UI patterns and planning section.
