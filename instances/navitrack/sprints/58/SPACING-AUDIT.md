# UI Layout Spacing System & Audit (S58-TA1)

## Context

Initial implementation suffered from geometry separation issues, primarily the global loader overlapping the bottom navigation (footer) and inconsistencies with padding across screens.

## The Spacing System

A unified CSS-variable-based layout spacing system was implemented in `src/styles/theme.css`:

```css
/* Layout Dimensions System */
--header-height: 64px;
--footer-base: 60px;
--footer-safe-padding: 20px;
--footer-height: calc(var(--footer-base) + var(--footer-safe-padding));

--loader-offset-top: var(--header-height);
--loader-offset-bottom: var(--footer-height);
```

## Component Audits & Fixes

### 1. `content-wrapper`

- The global scrollable container was updated to dynamically respect the layout tokens.
- **Rule applied:** `padding-top: var(--header-height)` and `padding-bottom: var(--footer-height)`.
- **Architecture Fix:** The `.content-wrapper` definition was moved to `@layer components` in `index.css`. This prevents it from taking precedence over Tailwind's utility classes (like `pb-[13rem]`), restoring expected override behavior for specific screen layouts.

### 2. Header (`app-header.tsx`)

- Maintains a max collapsed height of `50px`, but reserves `64px` (`--header-height`) in the layout to ensure sufficient breathing room between the top bar and active content.

### 3. Footer / Mobile Shell (`mobile-shell.tsx`)

- The `<nav>` element was previously autosizing based on flex content which caused dynamic resizing overlapping depending on the phone's rendering context.
- **Rule applied:** Enforced explicit height using `h-[var(--footer-height)]` so the visual element matches the layout token perfectly.

### 4. Global Loader (`global-loader.tsx`)

- The `fullContent` loader incorrectly relied on absolute spacing metrics hardcoded in tailwind (`top-16 bottom-[72px]`).
- **Rule applied:** Now uses CSS variables (`bottom-[var(--loader-offset-bottom)]` and `top-[var(--loader-offset-top)]`).
- **Dev Mode Fix:** The App shifts `MobileShell` by `40px` down when the developer header is active. The `GlobalLoader` was bypassing this since it ports directly to `document.body`. A condition was added so the loader inherits the dev offset (`useDevMode`) dynamically, preventing it from clipping the dev header.

### 5. Screens Output Audit

- **Removed Overrides**: Hardcoded tailwind utilities like `pb-[72px]` were removed from `ObjectsScreen.tsx`, `MapScreen.tsx`, `ObjectDetailsScreen.tsx`, and `ReportResultView.tsx` because the unified token system automatically applies the correct padding.
- **Preserved Overrides**: Action-heavy screens like `TrackingScreen.tsx` and `ReportFormView.tsx` maintained their large overrides (`pb-[13rem]` and `pb-[10rem]`) because their CTA buttons sit above the footer, requiring extended scroll clearance. Since `.content-wrapper` is now a component layer class, these overrides function as expected.

## Modals (Preview for later tracks)

Modals should follow similar rules by ensuring their content avoids `var(--footer-height)` if they are placed globally, or sit above it naturally if spawned inside `MobileShell`. Bottom sheets in particular should use dynamic `max-height` calculations (e.g. `calc(100vh - var(--header-height))`).
