# Sprint 03 Invariants

## Architectural Decisions

- **XP Calculation & Gamification**:
  - XP distribution happens fully server-side via `complete_quest` RPC (`20260224233500_xp_rpc.sql`) to prevent tampering.
  - The calculated `bounty_xp` and leveling up trigger a custom `questComplete` window event on the frontend in `KanbanBoard` if the transaction is successful.
- **Frontend Animations**:
  - `XpBarAnimation.svelte` hooks into the `questComplete` event. It uses GSAP (`gsap.timeline`) to trigger non-blocking high-impact animations. The component utilizes Svelte's `$bindable` so that properties reflect their new value in the parent implicitly after animation without prop-drilling or store subscriptions.
- **Leaderboards**:
  - Offloaded expensive XP calculation joining users/clans to PostgreSQL views (`global_leaderboard`, `clan_leaderboard`) securely exposed to authenticated users.
