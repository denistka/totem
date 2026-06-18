# S02 Invariants — app-agent-io

Extends `S01-INVARIANTS.md`. Frozen 2026-06-18.

## Chat bootstrap

1. **Customer chat app** lives at `apps/chat`, default port **3002** when started alone.
2. **Local DB** is NuxtHub SQLite — run `bun run db:migrate` in `apps/chat`; `DATABASE_URL` not required locally.
3. **AI env vars** are `AI_PROVIDER_URL`, `AI_PROVIDER_KEY`, `AI_PROVIDER_MODEL` (+ optional `AI_PROVIDER_MODELS`) — not `AI_GATEWAY_API_KEY`.
4. **`apps/chat/.env`** is in the root `# Secrets` manifest for `multi-encrypt`.
5. **`# Secrets` manifest** must list only `.env` files — never `.data/` directories.

## Dev launcher

6. Root `bun run dev` runs full Turbo when `/apps/` is non-empty.
7. Port fallback: if 3002/3001 are taken, Nuxt assigns alternative ports — check console output.

## Security

8. **`temp.md`** must not contain API keys — redacted S02; rotate any previously exposed keys.

## Documentation

9. Chat onboarding canonical doc: `apps/chat/SETUP.md`.
10. Totem smoke artifacts: `intel/S02-DEV-SMOKE.md`, `intel/S02-CHAT-SMOKE.md`.
