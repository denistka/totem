# S26 INVARIANTS — Android release (DRAFT, awaiting Denis approval)

Depends: [`S25-INVARIANTS.md`](S25-INVARIANTS.md). Date: 2026-10-17.

1. **`src-tauri/gen/android` is versioned; signing material never is.** Upload key lives in `~/.navitrack/keys/` (alias `navitrack_upload`, SHA-1 92:34:CC:…:9A:7D); `app/keystore.properties` is gitignored. Release builds fail clearly without it. Env via `scripts/android-env.sh`.
2. **Safe-area insets come from `--sai-*`** (= max(env(), `--android-inset-*`)); no raw `env(safe-area-inset-*)` in components. Android insets are pushed by `MainActivity` (system bars + cutout). S24 `--safe-left/right` build on `--sai-left/right`.
3. **Share is text only via `shareText`**; on Android it goes to the native ACTION_SEND sheet (`NavitrackShare` bridge), on iOS to `navigator.share`.
4. **Location permission only for Android ≤ 11** (manifest maxSdkVersion 30; blec scan `allowIbeacons` only there). No TV launcher; `bluetooth_le` required.
