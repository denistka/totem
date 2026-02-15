# S40 — Tech Debt List

**Backlog:** wgpu-update, static-mut-refactor, M-002.

---

## Items

| Item | Description | Notes |
|------|-------------|--------|
| **wgpu/rust update** | Update wgpu (and deps) in navitrack-app; fix breakages | ShaderRendererWebGPU.vue uses WebGPU types (GPUComputePipeline, etc.); ensure @webgpu/types or equivalent is up to date. |
| **static/mut refactor** | Rust static/mut refactor where identified | In src-tauri and wgpu; keep behavior. |
| **M-002** | iOS clustering zoom level | Align with Android if applicable. |

---

## Tasks

- **T1:** This list (scope-approved).
- **T2:** Update wgpu (and deps); fix breakages.
- **T3:** Rust static/mut refactor where scoped.
- **T4:** M-002 iOS clustering zoom — align with Android.
