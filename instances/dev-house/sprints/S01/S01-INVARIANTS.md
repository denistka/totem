# Sprint 01 Invariants

## Architectural Decisions

- **Stack**: SvelteKit with Tailwind CSS and Supabase.
- **Styling**: `app.css` uses Tailwind v4 base. Aesthetic is cypherpunk / dark fantasy (slate, cyan, dark themes).
- **Authentication**: Using Supabase Auth with GitHub OAuth provider.
- **Database Schema**:
  - `clans` (id, name, description)
  - `profiles` (extends auth.users with xp, level, clan_id)
  - `quests` (id, title, status, bounty_xp, created_by, assigned_to)
- **Database Triggers**: `handle_new_user` trigger automatically creates a `profiles` row upon new user registration in `auth.users`.
- **Row Level Security**: Enabled on all tables. Profiles are public, but updateable only by the owner. Quests/Clans are public read, authenticated insert/update.
