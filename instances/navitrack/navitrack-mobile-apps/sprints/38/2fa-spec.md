# S38 — 2FA with Google Sign-In (Spec)

**Backlog:** H-002 (2FA Google).

---

## Scope

- User can enable 2FA (Google Sign-In as second factor).
- When 2FA is enabled, login requires: password + Google Sign-In (or TOTP if backend supports).
- Backend: store 2FA enrollment; validate 2FA at login.

---

## Flow (align with backend)

- **Enrollment:** User in settings (or profile) enables 2FA → backend returns Google OAuth URL or QR for TOTP → user completes → backend marks account as 2FA enabled.
- **Login:** After password success, if account has 2FA → frontend shows 2FA step (Google Sign-In button or TOTP input) → send token/code to backend → backend validates → returns session.

---

## Frontend tasks

- T4: Implement 2FA enrollment UI (e.g. in settings); implement 2FA step in login flow (after password).
- Use existing Google Sign-In where applicable; add 2FA step component.
