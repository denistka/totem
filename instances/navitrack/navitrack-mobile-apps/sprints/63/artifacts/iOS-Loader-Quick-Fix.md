# iOS PWA Loader Quick Fix Guide

## 🚨 CRITICAL ISSUE
Loader has gaps between header and blur background in **installed iOS PWA only**.
This is blocking client demos.

## Root Cause
Incorrect handling of iOS safe area insets in installed PWA mode.

## Quick Fix Steps

### 1. Update GlobalLoader Component

Location: `src-client/src/components/ui/global-loader.tsx` (or similar)

```css
.global-loader {
  position: fixed;
  top: calc(var(--header-height, 0px) + env(safe-area-inset-top, 0px));
  bottom: calc(var(--footer-height, 0px) + env(safe-area-inset-bottom, 0px));
  left: env(safe-area-inset-left, 0px);
  right: env(safe-area-inset-right, 0px);
  
  /* Ensure full coverage */
  width: auto;
  height: auto;
  
  /* Blur effect */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  
  /* Background with opacity */
  background-color: hsl(var(--background) / 0.8);
  
  /* Ensure it's on top */
  z-index: 9999;
}
```

### 2. Verify viewport-fit in index.html

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### 3. Check CSS Variables

Ensure these are defined in your root CSS:

```css
:root {
  --header-height: 56px; /* or your actual header height */
  --footer-height: 64px; /* or your actual footer height */
}
```

### 4. iOS PWA Specific Styles

Add iOS PWA detection and specific styles:

```css
/* iOS PWA detection */
@supports (-webkit-touch-callout: none) {
  @media (display-mode: standalone) {
    .global-loader {
      /* Additional iOS PWA specific adjustments if needed */
      min-height: 100dvh;
    }
  }
}
```

## Testing Checklist

- [ ] Test in Safari browser (should work normally)
- [ ] Add to Home Screen on iOS device
- [ ] Open installed PWA app
- [ ] Trigger loader (login, data loading, etc.)
- [ ] Verify NO gaps between header and loader
- [ ] Verify NO gaps between loader and footer
- [ ] Check on iPhone with notch (X, 11, 12, 13, 14, 15)
- [ ] Check on iPhone with Dynamic Island (14 Pro, 15 Pro)

## Expected Result

✅ Loader fills entire space from header to footer
✅ No white/transparent gaps visible
✅ Blur effect covers entire area
✅ Works in both portrait and landscape

## Fallback if Still Not Working

If gaps persist, the issue might be with header/footer positioning.
Check that header and footer also respect safe areas:

```css
header {
  padding-top: env(safe-area-inset-top, 0px);
}

footer {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

## Reference
- Sprint 50: S50-Results.md (iOS full screen solution)
- Sprint 44: S44-INVARIANTS.md (safe-bottom class)
- Sprint 51: S51-INVARIANTS.md (safe area tokens)

---

**Priority**: CRITICAL - Blocking client demos
**Task**: S63-TA2
**Status**: Ready for implementation
