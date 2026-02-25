# Gamified DevHouse: Detailed MVP Plan

## 🎯 Concept

A project management and tracking tool that treats software development like a clan-based RPG.

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 2.0 (for high-performance routing and minimal overhead), GSAP (for gamification animations like level-ups and point counters), Tailwind CSS.
- **Backend / Database**: Supabase (PostgreSQL, Auth, Edge Functions for calculating XP and ladder rankings).
- **Integrations**: GitHub API (for PR validation), or generic webhooks.

---

## 🗺️ Epics

### Epic 1: Clan Foundation & Profiles (E-01)

Establish user profiles with RPG stats (e.g., "Frontend Mage: Lvl 12", "Backend Warrior: Lvl 8"). Group users into "Clans".

### Epic 2: The Quest Board / Task Management (E-02)

Standard Kanban board but reframed as a "Quest Board." Tasks have difficulty ratings (S, A, B, C) which translate directly to XP rewards upon completion.

### Epic 3: Gamification Engine & Leaderboards (E-03)

Implement the core logic that distributes XP, updates levels, and calculates global/clan leaderboards. Build the GSAP animations for "Level Up" sequences.

### Epic 4: Validation Gates (E-04)

Integrate external triggers (like opening a PR or a successful CI build) or peer-review flows (Code Review / QA phase) as the "Boss Fights" required to mark a quest as complete.

---

## 🏃‍♂️ MVp Sprints

### Sprint 01 (S01): Identity & Database Schema

- **Goal**: Set up SvelteKit and Supabase. Create schemas for `users` (with XP/Level columns), `clans`, and `quests`.
- **Outcome**: A user can log in via GitHub/Supabase Auth and view their basic character sheet (Level 1, 0 XP, unassigned Clan).

### Sprint 02 (S02): The Quest Board (E-02)

- **Goal**: Build the Kanban interface. Allow Project Managers (or "Quest Givers") to create tasks with XP bounties.
- **Outcome**: A functional drag-and-drop board. Moving a task to "Done" triggers a basic database update.

### Sprint 03 (S03): The Gamification Loop (E-03)

- **Goal**: Write Supabase RPCs/Edge Functions that secure the transaction of XP. When a task hits "Done," add the bounty to the user's total. Return a payload that triggers a frontend GSAP animation.
- **Outcome**: Completing a task successfully rewards points. The user's progress bar animates, and the global leaderboard updates instantly.

### Sprint 04 (S04): Peer Review & Gates (E-04)

- **Goal**: Add a "Review" state. A quest cannot go to "Done" unless a different user in the clan approves it (simulating PR reviews).
- **Outcome**: Multi-user collaboration on a single task lifecycle ensures "quests" aren't completed fraudulently.

### Sprint 05 (S05): Polish & Visuals

- **Goal**: Enhance the UI to feel like an RPG interface (dark fantasy or cypherpunk aesthetic). Add sound effects and particle effects for the "Level Up" screen.
- **Outcome**: MVP Release. Teams can manage software tasks in a fluid, rewarding, and gamified environment.
