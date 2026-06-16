# S88 Auth Friction Audit — iOS Biometry Paths

**Date:** 2026-06-16  
**Sprint:** S88 iOS Session Trust  
**Client repro:** Older iPhone, Bulgarian locale, Face ID enabled — frequent password prompts.

## Summary

Every path that ends on the login screen with username/password required is listed below with file references and severity. Recommended fix order matches sprint tracks T1–T4.

## Password-forcing paths

### 1. Cold start — biometry unlock fail (HIGH)

**Flow:** `useSessionBiometryLock` startup effect → `requestBiometricUnlock()` → on fail → `onBiometryFailed` → `performUserLogout({ preserveBiometricCredentials: true })` → `useAuthStore.logout()` calls `blockBiometryUntilManualLogin()` and `clearToken()`.

| Step | File | Lines |
|------|------|-------|
| Startup gate | `useSessionBiometryLock.ts` | 70–158 |
| Unlock request | `biometric-unlock.ts` | 97–99 |
| Fail handler | `useMobileShell.ts` | 70–81 |
| Logout + block | `useAuthStore.ts` | 115–123 |
| Block flag | `biometric-credentials.ts` | 221–227 |

**Severity:** HIGH — user cancel or Face ID fail forces password even when vault intact.  
**Fix:** T2 — biometry-cancel logout preserves session token + vault, skip block flag.

### 2. Cold start — no session, Keychain relogin fail (MEDIUM)

**Flow:** No gated session → `loadBiometricCredentials()` (Keychain + Face ID) → `reloginWithBiometricCredentials` fail → `onBiometryFailed`.

| Step | File | Lines |
|------|------|-------|
| Credential load | `biometric-credentials.ts` | 167–186 |
| Relogin | `useAuthStore.ts` | 67–93 |

**Severity:** MEDIUM — expected when API rejects credentials.  
**Fix:** T2 soft landing for cancel only; API failure still requires password.

### 3. Resume from background — always prompts (HIGH)

**Flow:** `visibilitychange` in `useSessionBiometryLock` — every foreground return triggers `requestBiometricUnlock()` after 2.5s cooldown. `local_biometry_inactivity_minutes` exists in `useLocalSettings` (default 5) but is **never read**.

| Step | File | Lines |
|------|------|-------|
| Visibility handler | `useSessionBiometryLock.ts` | 161–212 |
| Unused setting | `useLocalSettings.ts` | 16–17, 37, 94 |

**Severity:** HIGH — short app switch feels like constant re-auth (client complaint).  
**Fix:** T1 — respect inactivity grace window.

### 4. Resume — biometry fail → logout + block (HIGH)

Same as path 1: `onFail()` on resume cancel calls full logout with block.

| Step | File | Lines |
|------|------|-------|
| Resume fail | `useSessionBiometryLock.ts` | 196 |

**Fix:** T2.

### 5. Explicit sign-out (EXPECTED)

**Flow:** Header/settings → `performUserLogout()` → clears credentials, blocks biometry, login screen.

| Step | File | Lines |
|------|------|-------|
| Logout entry | `perform-user-logout.ts` | 12–27 |
| Header | `useAppHeader.ts` | 20–22 |

**Severity:** LOW — intentional. Must remain password-required.

### 6. JWT expiry on hydrate (MEDIUM)

**Flow:** `hydrateFromStoredSessionToken` → `isJwtExpired` → `clearToken` → user unauthenticated.

| Step | File | Lines |
|------|------|-------|
| Hydrate | `useAuthStore.ts` | 96–112 |
| Expiry check | `api-auth.ts` | 5–24 |

**Severity:** MEDIUM — triggers Keychain relogin (Face ID again) or password if block flag set.  
**Fix:** T3 trust mode — silent relogin from durable creds without biometry.

### 7. Session token in sessionStorage only (MEDIUM)

**Flow:** `setToken` writes `sessionStorage` only (`api-auth.ts:63`). Cold start may lose token before biometry gate runs on some WebView lifecycle edge cases.

| Step | File | Lines |
|------|------|-------|
| Token storage | `api-auth.ts` | 60–64, 85–88 |
| Biometric gate | `api-auth.ts` | 39–53 |

**Severity:** MEDIUM for trust-device users wanting passwordless reopen.  
**Fix:** T3 — durable localStorage token when `local_trust_device` on.

### 8. Biometry block flag after any logout (HIGH)

**Flow:** `logout()` always calls `blockBiometryUntilManualLogin()`. Login flow checks `isBiometryBlockedUntilManualLogin()` in startup lock.

| Step | File | Lines |
|------|------|-------|
| Block on logout | `useAuthStore.ts` | 117 |
| Check on resume | `useSessionBiometryLock.ts` | 182 |

**Fix:** T2 — skip block on biometry-cancel only.

## System biometry prompt count

On cold start with biometry + existing session:

1. `requestBiometricUnlock()` — app-level Face ID (if authenticated or pending session).
2. If no session: `loadBiometricCredentials()` → Keychain retrieve — **second** Face ID.

User may see **one or two** system prompts per open depending on session state.

## Client repro steps

1. iPhone (older model, iOS 16+), Bulgarian UI locale.
2. Enable Face ID in NaviTrack settings after password login.
3. Kill app → reopen → Face ID prompt(s).
4. Switch to another app for 1–2 minutes → return → Face ID again (no grace).
5. Cancel Face ID → login screen, password required (block flag set).
6. Repeat daily use → perception of "constant password".

## Recommended fix order

| Track | Task | Addresses |
|-------|------|-----------|
| T1 | S88-T1 inactivity grace | Paths 3 |
| T2 | S88-T2 soft cancel landing | Paths 1, 4, 8 |
| T3 | S88-T3 trust device session | Paths 6, 7 |
| T4 | S88-T4 trust warning UI | Path 7 opt-in |
| T5 | S88-T5 login quick unlock | Paths 1, 4 UX |
| T4 | S88-T6 device QA | Verification |
