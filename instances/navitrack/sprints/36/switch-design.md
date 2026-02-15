# S36 — Slint/HTML Switch Design

**Sprint:** S36 — Slint/HTML Switch System  
**Objective:** HTML default; Slint optional via env. Single switch point for login and future views.

---

## Default and optional path

| Path | When | Description |
|------|------|-------------|
| **HTML** | Default (production and dev unless overridden) | Vue components (LoginForm, Nt*, etc.). Fallback/prototyping. |
| **Slint** | When `VITE_S31_LOGIN_UI=slint` | Slint WASM UI (fast path on WGPU). Optional; requires slint-runtime build. |

**Production build:** Default is **HTML**. Slint loads only when env is explicitly set (e.g. build with `VITE_S31_LOGIN_UI=slint`).

---

## Switch point

- **Env:** `VITE_S31_LOGIN_UI=html|slint` (Vite env, read at build/startup).
- **Where:** `LoginView.vue` — `useSlintLogin = ref(import.meta.env.VITE_S31_LOGIN_UI === 'slint')`.
- **Single source of truth:** One env variable; no scattered conditionals. Future views that support HTML vs Slint can read the same env or a shared composable (e.g. `useViewMode()` returning `'html' | 'slint'`).

---

## Consumers

- **Login:** `LoginView` — if `useSlintLogin` → `SlintLoginForm`; else HTML card + `LoginForm` / `BiometricPrompt`.
- **Future:** Any view that can render HTML or Slint should use the same switch (env or shared composable).

---

## Implementation (current)

- **LoginView:** `const useSlintLogin = ref(import.meta.env.VITE_S31_LOGIN_UI === 'slint')`. Template: `v-if="useSlintLogin"` → SlintLoginForm; `v-else` → HTML form.
- **SlintLoginForm:** Loads slint-runtime; on error or “fallback” click, emits and parent can set `useSlintLogin = false` to switch to HTML.
- **Default:** If env is unset or `html`, HTML is used. So production default = HTML.

---

## Verification

- Build without `VITE_S31_LOGIN_UI` or with `VITE_S31_LOGIN_UI=html` → HTML login.
- Build with `VITE_S31_LOGIN_UI=slint` → Slint login (if slint-runtime available).
- Single switch point; no duplicated conditionals across views.
