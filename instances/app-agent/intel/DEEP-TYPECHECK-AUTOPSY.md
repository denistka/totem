# Deep Dive: Typecheck Autopsy

**Audited:** 2026-06-18 (S03)  
**Command:** `bun run typecheck` (turbo across all workspaces)

## Result

**FAIL** — 12/20 turbo tasks OK before first failure (`@app-agent/demo-saas#typecheck`)

## Failure 1: demo-saas locale type

```
demos/saas/app/app.vue(26,6): error TS2739
Type '{}' is missing properties from type 'Locale<Messages>': name, code, dir, messages
```

**Cause:** `<UApp :locale="uiLocale">` — `useUiLocale()` return type doesn't satisfy Nuxt UI `Locale` when inference fails.

**File:** `demos/saas/app/app.vue:26`

**Fix strategy:** Ensure `useUiLocale` returns full `Locale` shape or cast/type the composable return. Same pattern in other demos using `uiLocale`.

## Failure 2: control plane (parallel errors)

```
core/control/app/app.vue(30,10): error TS2322
Locale types incompatible between core/node_modules/@nuxt/ui and root node_modules/@nuxt/ui
```

**Cause:** **Duplicate `@nuxt/ui` installations** — `core/control` resolves different `node_modules` than app root. Messages type missing `authForm`, `banner`, `chatPrompt`, etc.

**Also:**

```
FileAvatar.vue, FileUploadButton.vue, useFileUploadLocal.ts:
Cannot find module '~~/shared/utils/file'
```

**Cause:** Control layer references `shared/utils/file` alias — path may not resolve in typecheck context for nested layer.

## Apps that likely pass

Based on turbo order before failure: docs, chat, demo-dashboard, demo-chat, demo-characters may pass individually.

## Fix priority (S04)

| Priority | Fix | Effort |
|----------|-----|--------|
| P1 | Hoist/dedupe `@nuxt/ui` — single version across workspace | Medium |
| P1 | Fix `useUiLocale` return type contract | Small |
| P2 | Resolve `~~/shared/utils/file` in control layer tsconfig | Small |
| P2 | Run per-package typecheck in CI to isolate failures |

## Workaround for investigation

Typecheck individual packages:

```bash
cd demos/saas && bun run typecheck
cd control && bun run typecheck
```

Dev servers work despite typecheck failures — `typescript.typeCheck: false` in nuxt.config.
