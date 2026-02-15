# S35 — Graphics Fallback Design

**Sprint:** S35 — Graphics Fallback System  
**Objective:** Unified graphics fallback: WGPU (priority 0) → WebGL (1) → HTML/APNG (2).

---

## Priority chain

| Priority | Backend | Description |
|----------|---------|-------------|
| **0** | WebGPU (wgpu/wasm) | Native WebGPU when available; WGSL shaders. |
| **1** | WebGL | WebGL 1/2 when WebGPU unavailable; GLSL shaders. |
| **2** | HTML / APNG | Static image or canvas fallback when both fail; or when `prefers-reduced-motion` is set. |

Detection order: **0 → 1 → 2**. No user-agent sniffing; feature detection only.

---

## Detection flow

1. **Reduced motion:** If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, use priority **2** (APNG) and skip GPU.
2. **WebGPU:** `navigator.gpu?.requestAdapter()` + optional device + canvas `getContext('webgpu')`. If all succeed → **0**.
3. **WebGL:** `canvas.getContext('webgl')` or `experimental-webgl`. If available → **1**.
4. **Fallback:** Otherwise → **2** (APNG or static).

Detection runs once per session (cached). No throw in normal flow.

---

## API

### Existing (navitrack-apps)

- **`useShaderBackend()`** (composable)  
  Returns: `{ backend: Ref<'webgpu'|'webgl'|'apng'|null>, prefersReducedMotion, fallbackKind }`.  
  Used by: `ShaderLoader`, `useShaderLoaderSources`, `SceneRendererWasmOrTs`.

- **`getGraphicsPriority()`** (optional helper)  
  Returns: `0 | 1 | 2` from current backend (0=webgpu, 1=webgl, 2=apng).  
  Implemented in: `useGraphicsCapability.ts` or `capabilityDetector.ts`.

### Consumer usage

- Login background, map, any WGPU/WebGL consumer: use **`useShaderBackend()`** or **`ShaderLoader`** (which uses it).
- For a numeric priority: **`getGraphicsPriority()`** after backend is resolved.

---

## Where it’s plugged

- **Login background:** `LoginView` → `Background` / `ShaderLoader` (scene name).
- **Map / other consumers:** Components that need shaders use `ShaderLoader` or read `useShaderBackend().backend`.
- **Incremental adoption:** Existing components keep working; new ones use the same composable.

---

## References

- `navitrack-apps/src/composables/useShaderBackend.ts` — detection and backend ref.
- `navitrack-apps/src/components/common/shader-loader/ShaderLoader.vue` — picks WebGPU vs WebGL vs APNG by backend.
- `navitrack-apps/src/composables/useGraphicsCapability.ts` — optional `getGraphicsPriority()`.
