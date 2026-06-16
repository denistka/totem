# S01 Invariants — REDA

Frozen from production codebase. Any change requires explicit discussion — auto-approve is BLOCKED.

## Stack (locked)

- **Framework:** Nuxt 3 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS 4 + modular CSS (`assets/css/main.css`, `animations.css`, `components.css`, `landing.css`)
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Realtime) + Nuxt Server API (`server/api/`)
- **Package manager:** pnpm
- **Deploy:** Vercel
- **Dev server:** port `8080`, host `localhost`
- **Testing:** Vitest (`tests/api/`)

## Roles (locked — 5 roles)

| Role | Scope |
| ---- | ----- |
| VISITOR | Own orders, pay, decline own queued unpaid items, feedback |
| WAITER | Assigned orders, full menu, transfer, refund-start, statistics |
| CHEF | Kitchen items only (`food`, `desserts`) |
| BARMAN | Bar items only, create bar orders |
| ADMIN | Full system access, refund-complete, user management |

Canonical source: `REDA/docs/ROLE_PERMISSIONS_REFERENCE.md`

## Status flows (locked — dual system)

**Payment:** `unpaid → paid → refund_process → refunded`

**Service (order):** `new → preparing → ready → paid → served → completed` (or `cancelled → refund_process → refunded`)

**Service (item):** `queued → preparing → ready → served` (decline from `queued` if unpaid)

## Server API pattern (locked)

All routes use `createRouteHandler()` from `server/utils/api-helpers.ts`:

```typescript
export default createRouteHandler(
  async (event, supabase) => { /* handler */ },
  { requireSupabase: true, validation: { ... } }
)
```

Shared utilities: `validateRequest`, `getUserProfile`, `createSuccessResponse`, `validateUUID`.

Auth/role checks via `status-management.ts` + `role-middleware.ts`.

## Component architecture (locked)

- **Pages:** thin shells (45–261 lines post-refactor) delegating to components
- **Role actions:** `components/actions/{Admin,Chef,Waiter,Barman}Actions.vue`
- **Domains:** `payment/`, `statistics/`, `orders/`, `chat/`, `schedule/`, `shared/`, `widgets/`
- **Composables:** `useAuth`, `useOrders`, `useChat`, `useStatistics`, `useMenu`, `useFeedback`, `useProfile`

## State management (locked)

Vue composables only. No Pinia / no global store layer.

## Database (locked)

- Migrations: `REDA/supabase/migrations/` (001–024, sequential)
- RLS policies per role
- Performance indexes on `orders(status, created_at)`, `orders(waiter_id, status)`, `menu_items(category, is_available)`

## Environment variables (locked)

```
SUPABASE_URL / NUXT_PUBLIC_SUPABASE_URL
SUPABASE_ANON_KEY / NUXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY  (server only — never expose)
```

## Nuxt modules (locked)

`@nuxt/fonts`, `@nuxt/icon`, `@nuxt/image`, `@nuxt/scripts`, `@nuxt/ui`, `@nuxtjs/supabase`

Supabase redirect: login `/auth/login`, callback `/dashboard`, exclude `/auth/*`, `/`, `/menu`.

## Code location (locked)

- App code: `/Users/denistka/Projects/REDA/_app/reda`
- Repo: `https://github.com/denistka/REDA.git`
- Agent MUST NOT write application code inside `totem/`
