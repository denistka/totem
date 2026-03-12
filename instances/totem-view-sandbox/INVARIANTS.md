# Totem View Sandbox: Project Memory

This instance is the primary sandbox for implementing the "House of Bricks" orchestration layer.

## Invariants
- [ARCHITECTURAL] Every task MUST pass the Docker-based Verification Gate.
- [UI] Bricks must follow the established state-texture language.
- [SECURITY] All Supabase RLS policies must be verified by the QA Guardian.

## Implementation Path
1.  Initialize Event Store in Supabase.
2.  Deploy Node.js Orchestration Manager.
3.  Implement Vue 3 Brickhouse UI.
