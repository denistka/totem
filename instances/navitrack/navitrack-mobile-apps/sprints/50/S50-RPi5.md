# S50: Raspberry Pi 5 (ARM64 Linux)

## Rust target

```bash
rustup target add aarch64-unknown-linux-gnu
```

## Cross-compile from macOS/Linux host

Option A — **cross** (Docker):

```bash
cargo install cross
cd navitrack-apps
cross build --release --target aarch64-unknown-linux-gnu -p navitrack-app
# Then run Tauri bundle step on an aarch64 Linux host or use cross for full bundle.
```

Option B — **Zig as linker** (no Docker):

```bash
# Install zig, then e.g. in .cargo/config.toml for the target:
# [target.aarch64-unknown-linux-gnu]
# linker = "zig"
# Or set env: CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=zig
```

Option C — **Build on RPi5** (native, no cross-compile):

```bash
# On Raspberry Pi 5 (aarch64 Linux):
cd navitrack-apps
pnpm install --frozen-lockfile
npx @tauri-apps/cli build --target aarch64-unknown-linux-gnu
```

Artifacts: `src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/deb/` (`.deb` when bundle is run on Linux).

## Bundle / .deb

Tauri with `bundle.targets: "all"` produces `.deb` on Linux. For `--target aarch64-unknown-linux-gnu` the bundle step must run in a Linux aarch64 environment (native RPi5 or cross).

## RPi5 deployment

1. Copy the built `.deb` to the Pi (e.g. `scp`).
2. Install: `sudo dpkg -i navitrack-app_*.deb` (resolve deps with `sudo apt-get install -f` if needed).
3. **systemd** (optional): create a user service if you want the app to start on login or run as a kiosk:

   ```ini
   [Unit]
   Description=NaviTrack
   After=graphical-session.target

   [Service]
   Type=simple
   ExecStart=/usr/bin/navitrack-app
   Restart=on-failure
   Environment=DISPLAY=:0

   [Install]
   WantedBy=default.target
   ```

   Save as `~/.config/systemd/user/navitrack.service` and enable with `systemctl --user enable navitrack`.
