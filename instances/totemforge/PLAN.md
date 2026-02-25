# TotemForge: Detailed MVP Plan

## 🎯 Concept

A web-based, real-time collaborative animation and audio design tool (Figma meets After Effects + Logic Pro).

## 🛠️ Tech Stack

- **Frontend / Client**: Vue 3 (Composition API), GSAP (animation engine), Tauri 2 (for desktop performance & native OS capabilities).
- **Backend / Collaboration**: Supabase (PostgreSQL, Realtime DB, Auth), WebRTC (for low-latency syncing).
- **Audio / Core Engine**: Rust & WebAssembly (DSP, heavy audio processing).

---

## 🗺️ Epics

### Epic 1: Shared Canvas Foundation (E-01)

Establish the real-time drawing and basic shape manipulation environment where multiple users can see each other's cursors.

### Epic 2: Animation Timeline (E-02)

Integrate the GSAP-powered motion timeline. Support keyframing for standard properties (scale, rotation, opacity, position).

### Epic 3: Audio DSP Engine (E-03)

Implement the Rust/WASM audio engine. Allow users to drop audio tracks onto the timeline and apply basic DSP effects (reverb, filter).

### Epic 4: Frame-level Collaboration (E-04)

Tie the comment system directly to timeline frames, allowing directors to leave feedback precisely on a millisecond mark.

---

## 🏃‍♂️ MVp Sprints

### Sprint 01 (S01): Project Setup & Authenticated Rooms

- **Goal**: Initialize Tauri 2 + Vue 3 codebase, connect Supabase Auth, and allow users to create and join "Studio Rooms".
- **Outcome**: Users can log in and see a list of accessible rooms.

### Sprint 02 (S02): Multiplayer Canvas (E-01)

- **Goal**: Implement a basic SVG/Canvas layer. Broadcast user presence (cursors) and simple shape creation via Supabase Realtime.
- **Outcome**: Two users can draw basic shapes and see each other's updates with <100ms latency.

### Sprint 03 (S03): The GSAP Timeline (E-02)

- **Goal**: Add a bottom panel timeline. Allow selection of canvas objects and creation of GSAP keyframes for `x`, `y`, and `opacity`.
- **Outcome**: A single user can animate a shape, and the animation playback triggers universally for all users in the room.

### Sprint 04 (S04): WASM Audio Integration (E-03)

- **Goal**: Hook up the Rust audio DSP module. Add audio track support to the timeline.
- **Outcome**: Users can upload a short `.wav` file, place it on the timeline, and play back audio synchronized with the visual animation.

### Sprint 05 (S05): Feedback & QA (E-04)

- **Goal**: Add a commenting tool mapped to the timeline playhead. Resolve visual bugs, optimize Reactivity overhead, and enforce UI/UX glassmorphism tokens.
- **Outcome**: MVP Release. A fully functional collaborative motion/audio session with frame-specific commenting.
