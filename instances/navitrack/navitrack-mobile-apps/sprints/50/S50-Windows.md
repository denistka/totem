# S50: Windows target

## Config

- **Rust target**: `x86_64-pc-windows-msvc` (or `rustup target add x86_64-pc-windows-msvc` on a Windows host).
- **Bundle**: `tauri.conf.json` has `bundle.targets: "all"` → on Windows build produces **MSI** (WiX) and **NSIS** (.exe installer).

## Build on Windows

```bash
cd navitrack-apps
pnpm install --frozen-lockfile
npx @tauri-apps/cli build
```

Artifacts under `src-tauri/target/release/bundle/` (msi/ and nsis/).

## CI (GitHub Actions)

Release workflow `.github/workflows/release.yml` already has a **windows-latest** matrix job. On tag `v*` it builds Tauri on Windows; ensure `projectPath` / working directory match your repo layout so the job runs from the app root.

## Code signing (optional)

For distribution without SmartScreen warnings:

1. Obtain a code signing certificate (e.g. EV or standard from DigiCert, Sectigo).
2. Sign the `.exe` and/or installers with `signtool` (Windows SDK) or in CI with a stored certificate.
3. Tauri does not sign automatically; add a step after build to sign the bundle outputs.
