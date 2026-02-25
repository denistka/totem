# Sprint 04 Invariants

## Architectural Decisions

- **Peer Review State**:
  - `quests` table now strictly requires `reviewer_id` via CHECK constraints when moving to `completed` state (`quests_no_self_review`).
- **Authorization**:
  - `complete_quest` RPC (`20260224233500_xp_rpc.sql`) was updated to enforce that the executing user (`v_user_id`) cannot be the `assigned_to` user.
  - The `xp` is awarded securely to the original `assigned_to` operator, while the reviewer is stamped into `reviewer_id`.
- **UI Logic**:
  - `QuestCard.svelte` hides the "APPROVE" block if `currentUserId` matches the quest's `assigned_to` field, falling back to a "Waiting for peer review" label.
