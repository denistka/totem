# REDA — Project Brief

## What it is

REDA is a **restaurant operations platform** for a multi-staff venue: customers order from tables, waiters manage service, kitchen and bar prepare items independently, admins oversee everything. Analytics track staff performance against baselines.

**Status:** Production-ready. Refactored codebase (~41% reduction), zero server duplication, 60+ modular components.

---

## Core domains

| Domain | Summary |
| ------ | ------- |
| **Orders** | Dual status (payment + service), role-scoped item management, transfer, decline |
| **Payments** | CompuCash POS + Pocket Bank, bulk pay, tips 10–25% |
| **Chat** | Role-based messaging — visitors ↔ assigned waiter, staff intercommunicate |
| **Statistics** | Per-role performance baselines (WAITER 87%, CHEF 95%, BARMAN 92%) |
| **Feedback** | Visitor/staff feedback with categories, storage, automated processor |
| **Calls / Tables** | Call-waiter, table assignments, inventory |

---

## Architecture invariants (do not break)

1. **5 roles** — VISITOR, WAITER, CHEF, BARMAN, ADMIN. Permission matrix is canonical.
2. **Dual status flow** — payment (`unpaid → paid → refund_process → refunded`) and service (`pending → confirmed → preparing → ready → served`) are independent.
3. **Item decline** — only from `queued` when order is unpaid; role must have item-type access.
4. **Server pattern** — all API routes use `createRouteHandler()` from `server/utils/api-helpers.ts`. No inline Supabase setup duplication.
5. **Component modularity** — role actions split into `AdminActions`, `ChefActions`, `WaiterActions`, `BarmanActions`. Pages are thin shells.
6. **State** — Vue composables (`useAuth`, `useOrders`, `useChat`, `useStatistics`, `useMenu`). No Pinia store layer.
7. **Database** — Supabase PostgreSQL with RLS. Migrations in `supabase/migrations/` (001–024).
8. **Deploy** — Vercel + Supabase. Dev port `8080`.

---

## Constraints for new work

- Match existing composable + thin-page pattern
- API changes go through `api-helpers.ts` wrappers
- Role permission changes require updating `status-management.ts` + docs
- No new global state library without explicit discussion
- Migrations: sequential numbering, human-readable header comment

---

## Reference docs (external to instance)

- `REDA/docs/AGENTS.MD` — full system schema
- `REDA/docs/REDA_TECH_REFERENCE.md` — condensed tech reference
- `REDA/docs/ROLE_PERMISSIONS_REFERENCE.md` — permission matrix
