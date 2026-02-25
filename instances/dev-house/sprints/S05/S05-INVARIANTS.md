# Sprint 05 Invariants

## Architectural Decisions

- **Audio Service**:
  - Leverages Web Audio API (`window.AudioContext`) in a Singleton instance `AudioService` (in `client/src/lib/services/AudioService.ts`).
  - Synthesizes chimes and Level Up chords directly using oscillators (`sine`, `square`) bypassing the need to load external binary assets.
- **Particle Systems**:
  - Canvas-based rendering on top of the `.levelUpOverlay` driven by the `gsap.ticker` in `XpBarAnimation.svelte`. Ensures robust 60fps framerates without polluting the DOM with hundreds of `div`s.
- **Global Theme & Typography**:
  - `Space Grotesk` and `JetBrains Mono` imported via Google Fonts directly in `+layout.svelte`.
  - Added global cypherpunk styling (cyan deep colors, custom scrollbars) in `app.css` using Tailwind `@layer base` syntax.
