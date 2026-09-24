# SDEMO-B Summary — Vercel Demo Branch

**Status:** IN PROGRESS (T06–T07 remaining)
**Started:** 2026-06-22
**Branch:** `vercel-demo` (git worktree at `/Users/denistka/Projects/app-agent-io/DAWWWB-app-agent`)

## Delivered

### T01 — Branch split ✅
- Зафиксирован build fix на `test-app`, создана ветка `vercel-demo`
- **Root cause fix:** Vite SSR externalized `shared/ws.ts` с неправильными relative paths в compiled chunks. Инлайнены `chatRoom`/`boardRoom` в `useChats.ts`, `useEpics.ts`, `useBoard.ts`

### T02 — Vercel preset ✅
- `nitro.preset: 'bun'` → `'vercel'` — генерирует `.vercel/output/` (Vercel Build Output API)
- `@nuxthub/core` убран из modules (hub:db недоступен на Vercel serverless)
- `experimental.websocket` убран (Vercel serverless не поддерживает persistent WS)
- `runtimeConfig.public.demoMode` добавлен для управления demo-стабами
- `vercel.json` создан в корне монорепо

### T03 — In-memory repo ✅
- `server/repo/repo-memory.ts` — полная реализация `WorkControlRepo` через `Map<string, T>`
- Seed при конструкторе: 1 чат "App Agent Demo", 1 принятый эпик, борд с 3 задачами (done/in_progress/todo)
- Фабрика `repo/index.ts` — fallback на `MemoryWorkControlRepo` вместо `SqliteWorkControlRepo`
- Нет `hub:db` в production bundle

### T04 + T05 — Realtime + Presence stub ✅
- `useRealtime()` проверяет `demoMode` → если `true`, возвращает `useRealtimeStub()`
- Stub: `connected=true` немедленно, `ROOT Agent` в `members[]`, mock `task.moved` через 3с на board rooms
- Нет попыток открыть реальный WebSocket в demo mode

### Worktree setup (вне sprint scope) ✅
- `DAWWWB-app-agent/` → `vercel-demo` (Vercel demo)
- `DAWWWB-app-agent-dev/` → `test-app` (dev / framework demo)
- `git worktree` — один .git, два рабочих дерева

## Оставшееся

- [ ] T06 — UX Review: пройти demo флоу в браузере, починить шероховатости
- [ ] T07 — Vercel deploy + smoke: `vercel --prod`, получить публичный URL

## Build status

`bun run build --filter=@app-agent/work-control` → ✨ Build complete! (preset: vercel)

## Commits на vercel-demo

```
a9a829e fix(work-control): inline chatRoom/boardRoom — Vite SSR build fix
ae3c8b6 feat(vercel-demo): Vercel preset + strip WS config + demoMode flag
3befdd0 feat(vercel-demo): in-memory repo with seed data
5d7fa3a feat(vercel-demo): useRealtime stub for demo mode
```

## Next

T06 — UX Review (требует запущенного dev сервера: `NUXT_PUBLIC_DEMO_MODE=true bun --bun nuxt dev`)
T07 — Vercel deploy
После: SDEV-FrameworkDemo (dev ветка, локальное демо фреймворка)
