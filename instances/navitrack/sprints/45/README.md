# Sprint 45: Touch, Component Health & UI Polish

## 🎯 Objective

Three-track sprint:

1. **Touch targets** — enforce 44px+ sizing on all interactive elements
2. **Component health** — deduplicate patterns, split oversized screens
3. **UI trend polish** — small modern improvements, micro-animations

---

## 📊 Three Tracks

### Track A: Touch-Friendly Refactoring (T1–T5)

| Standard    | Min  | Recommended | Token               |
| ----------- | ---- | ----------- | ------------------- |
| Icon button | 44px | 44px        | `--touch-target-sm` |
| Button      | 44px | 48px        | `--touch-target`    |
| Primary CTA | 48px | 56px        | `--touch-target-lg` |
| Input       | 44px | 48px        | `--input-height`    |
| List row    | 48px | 56px        | `--list-item-min-h` |
| Nav tab     | 44px | 56px        | `--nav-item-h`      |
| Target gap  | 8px  | 8px+        | `--touch-gap`       |

🔴 **Critical problems found:** ThemeToggle (32px), Checkboxes (28px), Slider tracks (8px), Bottom nav (~40px)

### Track B: Component Health (T6–T8)

📦 **Duplicates found** (pre-audit):
| Pattern | Copies | Proposed |
|---------|--------|----------|
| Overlay + bottom sheet | 2 | `<BottomSheet>` |
| Dropdown button (glass + chevron) | 4-6 | `<DropdownButton>` |
| Tab/segmented control | 3 | `<SegmentedControl>` |
| Fixed bottom CTA | 3 | `<FixedBottomAction>` |
| Done/Cancel mini-button | 3 | Button `size="pill"` |
| Inline SVG vehicle icons | 1 file, 65 lines | `vehicle-icons.tsx` |

📐 **Oversized components:**
| File | Lines | Target | Action |
|------|-------|--------|--------|
| `date-range-picker.tsx` | **533** | ≤150 | Split → 5 files in folder |
| `object-details-screen.tsx` | **308** | ≤150 | Split → 4 sub-components |
| `objects-screen.tsx` | **256** | ≤150 | Extract list item, utils |
| `reports-screen.tsx` | **253** | ≤150 | Extract form, result view |
| `tracking-screen.tsx` | **216** | ≤150 | Extract settings panel |

### Track C: UI Trend Polish (T9–T12)

🎨 **Areas to review:** spacing grid, typography hierarchy, corner consistency, glass effects balance, shadows, button feedback, transitions, color contrast

---

## 📋 All Tasks (12)

| #   | Task               | Track | Owner     | Duration | Description                   |
| --- | ------------------ | ----- | --------- | -------- | ----------------------------- |
| T1  | Touch Audit        | A     | ARCHITECT | 0.5d     | Measure all elements          |
| T2  | Touch Tokens       | A     | FRONTEND  | 0.5d     | Define `--touch-*` CSS tokens |
| T3  | Component Sizing   | A     | FRONTEND  | 1.5d     | Update components ≥ 44px      |
| T4  | Apply Screens      | A     | FRONTEND  | 2d       | Fix screen-specific issues    |
| T5  | Touch QA           | A     | QA        | 0.5d     | Lighthouse + device test      |
| T6  | Dedup Audit        | B     | ARCHITECT | 0.5d     | Catalog all duplicates        |
| T7  | Extract Shared     | B     | FRONTEND  | 1d       | Create shared components      |
| T8  | Split Screens      | B     | FRONTEND  | 1d       | Split files > 200 lines       |
| T9  | Trend Audit        | C     | UI_UX     | 0.5d     | Review vs 2025-26 trends      |
| T10 | Micro Improvements | C     | FRONTEND  | 0.75d    | Small visual tweaks           |
| T11 | Motion Polish      | C     | FRONTEND  | 0.5d     | Subtle animations             |
| T12 | Final Review       | C     | QA        | 0.5d     | Ship-ready check              |

**Total: ~9.25 days** (tracks B and C partially parallel with track A)

---

## 🏗️ Execution Flow

```
Track A (touch targets):
  T1:Audit → T2:Tokens → T3:Components → T4:Screens → T5:QA
                                              │
Track B (component health):                   ▼
                                    T6:DedupAudit → T7:Extract → T8:Split
                                                                      │
Track C (UI polish):                                                  ▼
                                                        T9:TrendAudit → T10:Micro → T11:Motion → T12:Final
```

---

## 🔒 S44 Design Invariants (DO NOT BREAK)

> Full details: **`S44-INVARIANTS.md`** — MUST be read before any CSS/component change.

| Category                | What's Protected                                       | Why                                         |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------- |
| Glass tokens            | All `--glass-*` values (opacity, blur, shadow, border) | Tuned for visual balance in both themes     |
| Theme differences       | Light/dark glass tokens differ intentionally           | Dark needs higher opacity, stronger shadows |
| `glass-glow ::before`   | `inset: -14px`, `blur(28px)`, `overflow: visible`      | Rainbow glow extends beyond button          |
| `glass-input` animation | `4s ease-in-out infinite` pulse                        | Breathing effect on idle inputs             |
| Element overrides       | `button.glass` = no border, `header.glass` = no border | Context-specific visual rules               |
| Performance             | `contain`, `will-change`, `transform3d` on glass       | 60fps animation guarantee                   |
| Component APIs          | GlassButton, GlassCard, GlassInputWrapper              | Stable API, separate from base Button       |
| Variant names           | `glass`, `glass-strong`, `glass-glow`, etc.            | Public API, used across all screens         |
| Anti-patterns           | No inline styles, no `!important`, no CSS-in-JS        | S44 established rules                       |

**Hard Rule:** Any S45 change that breaks an S44 invariant is **BLOCKED** until resolved.

---

## 📚 Lessons Applied from S44

1. **Tokens → Components → Screens** — component defaults fix 80% of issues
2. **No ad-hoc values** — tokens are single source of truth
3. **Reuse, don't multiply** — T6/T7 directly address this
4. **Audit before fix** — T1, T6, T9 analyze before changing
5. **One change at a time** — T10/T11 enforce incremental discipline

---

## ✅ Success Criteria

- Zero interactive elements below 44px
- Zero duplicated UI patterns
- No screen file > 200 lines
- Modern, trending feel (without redesign)
- Subtle, meaningful animations
- Lighthouse tap target audit: PASS
- Build + lint: zero errors
