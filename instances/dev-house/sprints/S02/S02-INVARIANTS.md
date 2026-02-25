# Sprint 02 Invariants

## Architectural Decisions

- **Data Layer**:
  - SvelteKit `QuestService` centralizes Quest querying (`getQuestsByClan`, `updateQuestStatus`) using Supabase.
  - Quests are mapped to clans. Supabase Schema migration `20260224233005_kanban_schema` enables this, altering `quests` table logic and RLS explicitly to only show quests to clan members or unassigned public.
- **Components**:
  - `KanbanBoard` orchestrates quests, using Svelte reactivity to optimistically update states (`$state`), with fallback reverting.
  - `BoardColumn` handles rendering the columns and `ondrop` HTML5 DnD event mapping.
  - `QuestCard` handles rendering the individual task with cypherpunk/RPG aesthetic and initiating `ondragstart`.
- **UI System**:
  - Integrated `KanbanBoard` within the `/dashboard` page directly under the Profile Banner structure. Container sizes dynamically scale on larger breakpoints correctly (`max-w-7xl`).
