# TOTEM NEXUS — План реализации (оптимизированный)

> Версия: 1.0 · Дата: 2026-05-15  
> База: исходный 10-стадийный roadmap + анализ существующего кода  
> Цель: production-ready MVP за 6 месяцев, mass-market ready за 12

---

## 0. ИСХОДНОЕ ПРЕДЛОЖЕНИЕ — РЕВИЗИЯ

Ниже — анализ изначального 10-стадийного roadmap. Что **оставить**, что **переработать**, что **удалить**, и какие **критически важные стадии отсутствуют**.

### 0.1 Анализ исходных 10 стадий

| # | Стадия | Вердикт | Обоснование |
|---|--------|---------|-------------|
| 1 | **Core Protocol Engine (JSON-First)** | 🟡 **ПЕРЕРАБОТАТЬ** | JSON-only теряет читаемость для humans и git-diffs. Решение: **hybrid** — JSON Schema для валидации, MD/YAML для хранения и git-commits. JSON используется только как протокольный wire-format. |
| 2 | **Real-time Backbone (WebSocket)** | 🟢 **ОСТАВИТЬ** | Уже частично реализовано в `taskboard-supabase`. Добавить SSE fallback для serverless из `totem-view`. |
| 3 | **Visual DAG & Taskboard** | 🟢 **ОСТАВИТЬ** | Killer feature. Реализовать с зум-семантикой (epic → sprint → task) и архитектурными слоями (foundation/walls/roof). |
| 4 | **Agent Identity & Presence** | 🟢 **ОСТАВИТЬ** | Уже работает в `taskboard-supabase` (S03). Добавить thought-log и cursor visualization. |
| 5 | **Handoff Engine** | 🟢 **ОСТАВИТЬ — UPGRADE** | Это **сердце системы**. Расширить: JIT-контекст должен включать cross-project memory + invariants + integration_log стеков. |
| 6 | **Multi-Model Bridge (MCP)** | 🟢 **ОСТАВИТЬ — ПОВЫСИТЬ В ПРИОРИТЕТЕ** | Должно быть **в Phase 2, не Phase 6**. Раннее MCP-внедрение защищает от vendor lock-in с дня 1. |
| 7 | **Stack & Guardian Marketplace** | 🔴 **ОТЛОЖИТЬ** | Marketplace требует существующей user base. До 10k активных пользователей это бесполезный chrome. **Отложить до Year 2**. |
| 8 | **Collaborative Sandbox (Cloud IDE)** | 🔴 **ИНТЕГРИРОВАТЬ, НЕ СТРОИТЬ** | Построение Cloud IDE — это многолетний проект (см. CodeSandbox, StackBlitz). **Решение**: интеграция через **WebContainers API** или **GitHub Codespaces SDK**. Не строить своё. |
| 9 | **Enterprise Gates & Compliance** | 🟡 **ПАРАЛЛЕЛЬНЫЙ ТРЕК** | B2B-enterprise — отдельная sales motion. Не блокировать mass-market roadmap; делать параллельно с Year 2. |
| 10 | **Global Nexus Launch + Mobile** | 🟡 **РАСПРЕДЕЛИТЬ** | Mobile-first должен быть **с Phase 1** (PWA approve-from-phone). "Глобальный лонч" — это не стадия, это маркетинговое событие. |

### 0.2 Критически отсутствующие стадии

Эти стадии **не были** в исходном плане, но они **необходимы** для mass-market:

| Новая стадия | Зачем | Когда |
|--------------|-------|-------|
| **Zero-friction Onboarding** | Без неё mass-market не сработает. Цель: от регистрации до первой задачи за 60 секунд | Phase 3 |
| **Cross-Project Memory** | Главный дифференциатор. Без неё мы — просто ещё один Linear с ИИ. Vector store + retrieval | Phase 3 |
| **AI Coach Mode** | Для solo-developers — главного beachhead-сегмента. ИИ ведёт за ручку | Phase 3 |
| **Bug Capture (DevTools Extension)** | Из `totem-view/extension/`. Уникальная фича, конкурентов нет | Phase 3 |
| **Vibe-to-Code Generator** | Lovable-style onboarding. Без этого новички "не зацепятся" | Phase 4 |
| **GitHub/GitLab Integration** | Без этого мы — изолированный остров | Phase 5 |
| **Voice + Video Messages** | Loom-style для async-команд. Стандарт в 2026 | Phase 4 |
| **Notification System** | Email/Slack/Discord/Telegram/Mobile push | Phase 5 |
| **Public/Private Sharing** | Notion-style. Для freelancers — обязательно | Phase 4 |
| **Pricing & Billing** | Без этого нет revenue | Phase 5 |

### 0.3 Архитектурные решения "из коробки"

Принимаем **до начала** имплементации, чтобы избежать переписывания:

1. **MCP-first agent integration** (не Anthropic-specific) — agnostic с дня 1
2. **Event Sourcing as Truth** — все мутации = события (уже в taskboard-supabase)
3. **Local-First клиент** — offline работает, sync при возврате
4. **Progressive Disclosure UI** — 3 слоя (Chat / Structure / Protocol), переключаемые
5. **Hybrid JSON+MD storage** — JSON Schema validation, MD git-export
6. **Open Core** — protocol open-source, hosted SaaS закрытый
7. **BYO-Keys default** — пользователь приносит свой OpenAI/Anthropic key (защита от vendor margin squeeze)

---

## 1. ОПТИМИЗИРОВАННЫЙ ROADMAP

### 1.1 Высокоуровневый timeline

```
Месяц:  M1  M2  M3  M4  M5  M6  M7  M8  M9  M10 M11 M12  Y2H1  Y2H2
        ─────────────────────────────────────────────────────────────
P0 ████████  Foundation (JSON Schema + Protocol Engine)
P1     ███████████  Core MVP (Chat + Tasks + Real-time)
P2          ████████  Agent Layer (Presence + MCP + Handoff)
P3                   ███████  Mass-market hooks (Onboard + Memory + Coach + Bug Capture)
P4                        ███████  Vibe Generator + Collab features (voice/video/share)
P5                                ███████  Integrations (GitHub + Notifs + Mobile PWA)
P6                                                   ████████  Marketplace + Enterprise
P7                                                          ████████  Code Sandbox + Polish
```

### 1.2 Phase-by-Phase

---

## PHASE 0 — FOUNDATION (M1–M2)

**Цель:** Установить ядро, на которое будет надстраиваться всё остальное.

### Deliverables

1. **JSON Schema definitions** для:
   - Project, Epic, Sprint, Task, Step
   - Invariant, Stack Adapter, Script
   - Event (полный набор event types)
   - Agent profile, Guardian/Crew rules
2. **Protocol engine** (TypeScript library):
   - Валидация JSON-документов
   - Преобразование JSON ↔ MD (для git-export V6-совместимости)
   - Гейт-логика (`locked` / `open` / `auto`)
3. **Database schema** (PostgreSQL):
   - Расширение схемы `taskboard-supabase`
   - Добавить таблицы: `invariants`, `stack_adapters_log`, `scripts`, `ai_feedback`, `prompts`
4. **Authentication scaffold**:
   - Supabase Auth + JWT
   - OAuth: GitHub, Google
5. **Monorepo setup**:
   - pnpm workspaces: `client/` + `server/` + `protocol/` + `shared/`
   - Vite 8 + TypeScript strict + Vue 3.6

### Success criteria

- ✅ JSON Schema валидирует все типы событий, отвергает невалидные
- ✅ Можно скриптом `protocol-export <project>` получить рабочий V6-репо
- ✅ `pnpm dev` поднимает SPA + WS server локально
- ✅ Login через GitHub работает end-to-end

### Команда

- 1 Tech Lead (full-time)
- 1 Backend dev (full-time)

---

## PHASE 1 — CORE MVP: CHAT + TASKS + REAL-TIME (M3–M5)

**Цель:** Минимальный продукт, в котором уже можно работать.

### Deliverables

1. **Smart Chat UI** (Vue 3.6 + Tailwind):
   - Message composer с markdown + slash-commands
   - Attached: screenshots, code-snippets, file refs
   - Message threading
   - Voice notes (записать → отправить)
   - **AI-router** для intent detection:
     - `bug` → создаёт Task с тегом
     - `feature` → создаёт Task с тегом
     - `discussion` → ничего не создаёт, но индексирует
     - `lgtm` / `go` / `approve` → открывает gate
     - `block` → ставит pause на задачу

2. **Visual Project Graph (DAG)**:
   - 2D Canvas с pan/zoom (vue-flow or custom)
   - 3 уровня зума: Epic → Sprint → Task
   - Цветовое кодирование: foundation/walls/roof
   - Cascade highlight при клике
   - Drag-and-drop для перемещения задач между спринтами

3. **Kanban Board** (как альтернативный view):
   - Columns: Todo / In-Progress / Done / Blocked
   - Drag-and-drop между колонками
   - Quick edit inline

4. **Real-time Backbone**:
   - WebSocket primary (server: ws library из taskboard-supabase)
   - SSE fallback (для Vercel-deploy)
   - Presence updates каждые 5 сек
   - Event sourcing для всех мутаций
   - Optimistic updates на клиенте

5. **Gate Management**:
   - `locked` / `open` / `auto` states
   - UI для approve/reject
   - Audit log изменения gate

6. **3-Layer UI Switcher**:
   - Chat-only view
   - Chat + Structure (split)
   - Full Protocol view (для power users)

### Success criteria

- ✅ Можно создать проект, написать в чат "У меня баг в логине" — появляется Task
- ✅ Можно открыть DAG, перетащить задачу
- ✅ Два user'а в одном проекте видят presence друг друга real-time
- ✅ Gate работает — без LGTM ИИ-агент не действует (даже если подключен)

### Команда

- 2 Frontend dev (Vue/TS)
- 1 Backend dev
- 1 Designer (для UI-layer system)

---

## PHASE 2 — AGENT LAYER: MCP + PRESENCE + HANDOFF (M4–M6, parallel)

**Цель:** ИИ-агенты как полноценные участники команды.

### Deliverables

1. **MCP Server** (внутри `server/`):
   - Resources: `totem://project/{id}/dag`, `invariants`, `tasks/{id}`, `stacks/{id}`
   - Tools: `execute-task`, `propose-invariant`, `request-handoff`, `request-gate-open`
   - Аутентификация: API tokens
2. **Agent Profiles**:
   - Каждый агент — first-class user (`actor_type='agent'`)
   - Поля: name, avatar, capabilities (JSONB), parent_model
   - Presets: Claude-Architect, Sonnet-Builder, Flash-UI, GPT-Reviewer
3. **Agent Presence Visualization**:
   - Avatar в UI с цветным dot (idle/thinking/coding/blocked)
   - Cursor visualization в коде (если open file)
   - Thought Log side-panel (real-time stream)
4. **Handoff Engine**:
   - Кнопка "Handoff to AI" на любой задаче
   - JIT-Context Builder:
     - Текущая задача + acceptance criteria
     - Релевантные `INVARIANTS.md` (по тегам и dependencies)
     - Релевантные файлы кода (codemap query)
     - Cross-project memory (semantic search) — *Phase 3*
     - Stack-адаптеры из `requires:`
   - Кнопка "Handoff back to Human" с pointer на конкретный блок кода
5. **AI Feedback Channel** (из totem-view S19):
   - Async badge на TaskCard
   - Types: `status` | `block` | `suggestion` | `message`
   - Dismiss action
6. **Prompt Templates** (из totem-view S20):
   - User-created `.md` шаблоны с `{{placeholders}}`
   - Quick-run: select task → click prompt → выполнить

### Success criteria

- ✅ Claude Code подключается через MCP, видит `totem://project/foo/dag`
- ✅ ИИ-агент может через MCP взять задачу с `gate: open` и закоммитить код
- ✅ Видна разница между Claude-Architect (planning) и Sonnet-Builder (executing) в UI
- ✅ Handoff собирает контекст автоматически за < 2 сек

### Команда

- 1 AI Engineer (full-time, новый hire)
- 1 Backend dev (продолжение)

---

## PHASE 3 — MASS-MARKET HOOKS (M6–M9)

**Цель:** Сделать продукт **достижимым** для не-power-users.

### Deliverables

1. **Zero-Friction Onboarding**:
   - GitHub OAuth → автоматический сканер репо → предложение Totem-instance
   - 60-секундный onboarding flow:
     ```
     1. Login via GitHub
     2. Pick a repo (or "start blank")
     3. AI scans codebase → suggests stack adapters
     4. Generates first sprint (3-5 tasks)
     5. Drops you into Smart Chat
     ```
   - Welcome chat-bot пройдёт первую задачу за ручку
2. **Cross-Project Memory**:
   - Vector embeddings всех:
     - Chat-messages
     - Tasks + descriptions
     - Invariants (с timestamp'ом и контекстом)
     - Decisions
   - pgvector for storage
   - Semantic retrieval API:
     ```typescript
     memory.findSimilar(query, scope: 'project'|'user'|'public', limit)
     ```
   - UI: при создании задачи показывать "вы решали похожее в X 3 мес назад"
3. **AI Coach Mode** (для solo):
   - Daily check-in: "Что планируешь сегодня?"
   - Автоматическое предложение следующей задачи из backlog
   - Pointing out technical debt (на основе codemap)
   - End-of-week retrospective digest
4. **Bug Capture Chrome Extension**:
   - Манифест V3
   - Перехват: console errors, network failures, performance markers
   - "Send to Totem" button:
     - Создаёт Task в активном спринте
     - Attached: screenshot, console trace, network har, user actions
   - DevTools panel: показывает active task (objective, steps, AC)
5. **Mobile PWA** (gate approval focus):
   - Push notifications на gate request
   - One-tap approve/reject
   - Voice command: "Approve sprint 12"
   - Минимальный UI: только approve queue + chat read

### Success criteria

- ✅ Новый пользователь (без обучения) приходит к первой задаче за < 60 сек
- ✅ При создании "fix auth bug" система предлагает аналог из прошлого проекта
- ✅ Solo-dev может за неделю использовать Coach Mode без отказа
- ✅ Chrome extension установлен у > 30% активных пользователей

### Команда

- 1 Frontend dev (PWA)
- 1 Backend dev (vector store + retrieval)
- 1 AI Engineer (Coach Mode prompts)

---

## PHASE 4 — COLLABORATION FEATURES (M8–M11)

**Цель:** Сделать продукт пригодным для **команд**, а не только solo.

### Deliverables

1. **Vibe-to-Code Generator** (Lovable-style):
   - Описание → автоматическое создание:
     - Totem instance (config + paths)
     - Первый Sprint с задачами
     - Scaffold кода (через WebContainers preview)
     - Preview URL
   - Iterative chat: "А теперь добавь dark mode"
2. **Voice & Video Messages**:
   - Запись голоса (browser MediaRecorder)
   - Запись экрана + камера (Loom-style)
   - Transcription через Whisper API
   - Attached к message / task
3. **Comments & Threads**:
   - Threaded conversations на любом message / task
   - @mentions (humans + agents)
   - Reactions (emoji)
4. **Sharing**:
   - Public link на задачу/спринт (read-only)
   - Invite collaborator с granular permissions
   - "Embed in Notion/Slack" preview cards
5. **Approval Workflows**:
   - Multi-step gates: "Architect + QA must approve"
   - Approval queue
   - Async signing

### Success criteria

- ✅ От описания до preview URL за 30 сек
- ✅ Можно записать видео-baghepoort в один клик
- ✅ Public share linkработает без логина
- ✅ В команде 5+ человек активно используют threads

### Команда

- 2 Frontend dev
- 1 Backend dev

---

## PHASE 5 — INTEGRATIONS + NOTIFICATIONS (M10–M12)

**Цель:** Перестать быть изолированным островом.

### Deliverables

1. **GitHub/GitLab bidirectional sync**:
   - PR создан → автоматически связан с Task
   - Commit message содержит `#T-127` → coupled
   - Issue created in GH → mirrored to Totem
   - Branch status (CI green/red) → отображается в Task
2. **Slack / Discord / Telegram bots**:
   - Webhook на gate request → DM в Slack
   - Reply "approve" в DM → опен гейт
   - Daily digest канала
3. **Email digests**:
   - Daily / weekly summary
   - Per-event subscription
4. **Mobile push notifications** (продолжение Phase 3):
   - Sound + vibration
   - Action buttons: Approve / Reject / Open
5. **Webhook system**:
   - Outbound webhooks на любой event type
   - Для интеграции с custom системами
6. **Pricing & Billing**:
   - Stripe integration
   - Plan management (Free / Pro / Team / Org)
   - Usage tracking (AI tokens, storage)
   - Invoicing

### Success criteria

- ✅ PR merged → Task auto-closed
- ✅ Manager может approve спринт прямо из Slack
- ✅ Можно выставить счёт за месяц
- ✅ < 1% missed notifications

### Команда

- 1 Frontend dev
- 2 Backend dev (integrations + billing)
- 1 DevOps (production scaling)

---

## PHASE 6 — MARKETPLACE + ENTERPRISE (Y2H1)

**Цель:** Расширить экосистему + открыть enterprise сегмент.

### Deliverables (PARALLEL TRACKS)

**Track A: Marketplace**
1. Stack adapter marketplace
   - Public listings
   - Versioning + reviews
   - Revenue share (20% platform / 80% creator)
2. Project templates marketplace
   - Sells: "SaaS template", "AI startup", "E-commerce"
3. Crew/Guardian sharing
   - Custom rule sets, шерящиеся между пользователями
4. **Cron-scheduled agents** (recurring tasks):
   - "Every Monday review last week's commits"

**Track B: Enterprise**
1. SSO (SAML, OIDC, SCIM)
2. Audit log (compliance):
   - All actions logged
   - Tamper-proof (append-only)
3. Custom Guardians (per-org):
   - Org-specific rules and constraints
4. Multi-step approval chains
5. On-premise edition:
   - Docker-compose deploy
   - Helm chart for K8s
6. Compliance certifications:
   - SOC2 Type I → II
   - GDPR
   - HIPAA (опционально для healthcare customers)

### Success criteria

- ✅ Marketplace: 100+ adapters, 50+ templates published
- ✅ Enterprise: 5 paying customers, $50k+ ARR each
- ✅ SOC2 Type I в процессе аудита

### Команда

- 1 Frontend dev (Marketplace UI)
- 2 Backend dev (Enterprise infra + SSO)
- 1 Compliance / Security engineer

---

## PHASE 7 — EMBEDDED CODE EDITOR + POLISH (Y2H2)

**Цель:** Закрыть последнюю кабину разработчика — IDE.

### Deliverables

1. **WebContainers Integration** (StackBlitz SDK):
   - Lightweight editor в-браузер
   - Hot reload preview
   - Terminal для запуска тестов
2. **NOT** строить свой IDE:
   - VS Code Web embedding для power users
   - GitHub Codespaces integration option
3. **Live Code Diffing**:
   - Видеть ИИ-агента редактирующего код real-time
   - Inline approve/reject hunks
4. **Performance polish**:
   - < 100ms response time на gate decisions
   - < 50ms event sourcing
   - SSE/WS auto-reconnect with backoff
5. **Internationalization**:
   - i18n: EN, RU, ES, PT, JP, ZH
   - RTL support

### Success criteria

- ✅ Можно дописать строку кода прямо в Nexus
- ✅ Видно diff от ИИ-агента и approve по строкам
- ✅ Lighthouse score > 95 на mobile

### Команда

- 2 Frontend dev (editor integration)
- 1 Performance engineer
- 1 i18n / community manager

---

## 2. КРИТИЧЕСКИЙ ПУТЬ

```
P0 Foundation
   ↓
P1 Core MVP ──┬→ P3 Mass-market hooks ──┬→ P4 Collab ──→ P5 Integrations
              │                          │
              └→ P2 Agent Layer ─────────┘
                       ↓
                  (MCP enables P3 memory + P4 vibe-gen)

   P6 Marketplace ──── parallel to P5/P7
   P7 Code Editor ──── final phase

Total critical path: P0 → P1 → P2/P3 → P4 → P5 = ~12 months
```

**Зависимости, которые НЕЛЬЗЯ нарушить:**

- P0 → всё остальное (без protocol engine ничего не работает)
- P1 → P2 (нужен chat + tasks, чтобы агенты что-то делали)
- P2 → P3 (cross-project memory зависит от vector store, который зависит от MCP-агентов как consumers)
- P5 → revenue (без billing нет денег)

**Что можно параллелить:**

- P1 и P2 можно начинать одновременно (с overlap в M4-M5)
- P6 (marketplace) можно начинать с M9 параллельно с P4/P5
- Marketing / DevRel начинается уже в P1 (контент, demos, waitlist)

---

## 3. TECH STACK — ФИНАЛЬНЫЙ ВЫБОР

| Слой | Технология | Источник в Totem |
|------|-----------|------------------|
| **Frontend Framework** | Vue 3.6 + Composition API | `stacks/vue/VUE.ti` |
| **Build** | Vite 8 (Rolldown) | `stacks/vite/VITE.ti` |
| **State (server-sync)** | Pinia + rstore | `stacks/rstore/RSTORE.ti` |
| **State (local-first)** | Dexie + Yjs | `stacks/local-first/LOCAL_FIRST.ti` |
| **Styling** | Tailwind CSS 4 | `stacks/tailwind/TAILWIND.ti` |
| **Component Lib** | Headless UI + custom Glass system | `taskboard-supabase` patterns |
| **Type System** | TypeScript strict (zero-any) | `stacks/typescript/TYPESCRIPT.ti` |
| **Real-time** | WebSocket (ws) + SSE fallback | `taskboard-supabase` + `totem-view` |
| **Backend** | Node.js 22 ESM + Fastify | `stacks/node/NODE.ti` |
| **Database** | PostgreSQL 16 + Supabase | `stacks/supabase/SUPABASE.ti` |
| **Search** | pgvector + tsvector | Phase 3 add |
| **Storage** | S3-compatible (Cloudflare R2) | Phase 4 add |
| **Auth** | Supabase Auth + JWT | existing |
| **AI Protocol** | MCP (Model Context Protocol) | `stacks/mcp/MCP.ti` |
| **Code Sandbox** | WebContainers SDK | Phase 7 (NOT build own) |
| **Browser Extension** | Chrome Manifest V3 + Vite | `totem-view/extension/` |
| **Mobile** | PWA (Vue + Capacitor optional) | `stacks/pwa/PWA.ti` |
| **Desktop** | Tauri 2 (later) | `stacks/tauri/TAURI.ti` |
| **CI/CD** | GitHub Actions + Vercel | standard |
| **Hosting** | Vercel (web), Fly.io (WS server), R2 (storage) | `taskboard-supabase` deploy patterns |
| **Monitoring** | Sentry + PostHog | new |
| **Payments** | Stripe | Phase 5 |

---

## 4. КОМАНДА И БЮДЖЕТ

### 4.1 Команда по фазам

| Фаза | Период | Headcount | Roles |
|------|--------|-----------|-------|
| P0 | M1-M2 | 2 | TechLead, Backend |
| P1 | M3-M5 | 5 | +2 Frontend, +1 Designer, +1 DevRel (part-time) |
| P2 | M4-M6 | 6 | +1 AI Engineer |
| P3 | M6-M9 | 7 | +1 Frontend, content marketing ramp |
| P4 | M8-M11 | 7 | same, refocus |
| P5 | M10-M12 | 8 | +1 DevOps |
| P6 | Y2H1 | 10 | +1 Compliance, +1 BackendEnterprise |
| P7 | Y2H2 | 11 | +1 Performance, +1 i18n |

### 4.2 Бюджет (18 месяцев до Series A)

```
Engineering:
  Year 1: 5 → 7 FTE  × $150k avg     = $1,050,000
  H1 Y2: 8 → 10 FTE  × $150k × 0.5    = $675,000

AI Infrastructure:
  OpenAI/Anthropic API   $5k/mo × 18  = $90,000
  Vector DB (Pinecone)   $1k/mo × 18  = $18,000
  Embeddings cache       $500/mo × 12 = $6,000

Hosting:
  Vercel Pro             $200/mo × 18 = $3,600
  Fly.io (WS server)     $300/mo × 18 = $5,400
  Cloudflare R2          $500/mo × 12 = $6,000
  Supabase Pro           $250/mo × 18 = $4,500

Marketing & DevRel:
  Content & paid          $5k/mo × 12 = $60,000
  Conference sponsorships              = $20,000
  Influencer partnerships              = $30,000

Operations:
  Legal (incorporation, contracts)     = $25,000
  Accounting & taxes                   = $18,000
  SaaS tools (linear, figma, etc)      = $12,000
  Buffer / contingency 10%             = $200,000

TOTAL 18 months                         = ~$2.22M
```

**Realistic seed ask: $2.5M** (с buffer на Series A bridge).

---

## 5. РИСКИ ИМПЛЕМЕНТАЦИИ

| Риск | Влияние | Mitigation |
|------|---------|-----------|
| **Скорость найма AI Engineer** | High | Начать в M2; рассмотреть part-time contractor для P2 |
| **MCP-стандарт ещё не стабилен** | Medium | Wrapper layer: тонкий adapter, легко переписать |
| **WebContainers ограничения** | Medium | Phase 7 — поздно. Если не подойдёт, fallback на GitHub Codespaces |
| **pgvector performance на big data** | Medium | Запасной план: Pinecone / Weaviate |
| **Stripe для billing — недели интеграции** | Low | Использовать Stripe Atlas или Lemon Squeezy |
| **Compliance (SOC2) дольше планируемого** | Medium | Стартовать процесс в M10, не позже |
| **Конкурент запустит аналог раньше** | High | Speed of execution + community building с M1 |

---

## 6. MVP DEFINITION (что отгружаем в M5)

**Минимальный продукт, который можно показать публично:**

✅ **Must-have:**
1. Регистрация / Login (GitHub OAuth)
2. Создание проекта
3. Smart Chat с AI-router (basic intents: bug, feature, lgtm)
4. Visual DAG таскборд
5. Kanban view
6. Gate management (locked/open)
7. WebSocket real-time presence
8. Базовая MCP-интеграция (только resources, без tools)
9. Export проекта в `.ptl`/`.pd` git-репо

❌ **NOT in MVP:**
- Cross-project memory (P3)
- Vibe-to-Code (P4)
- Mobile PWA (P3)
- Voice / video (P4)
- Chrome extension (P3)
- Pricing / billing (P5)
- Marketplace (P6)
- Code editor (P7)

**Launch strategy:**
- M5 — closed beta (50 users из waitlist)
- M7 — public beta (free)
- M9 — paid plans go live (Pro)
- M11 — Team plans
- Y2H1 — Org / Enterprise

---

## 7. METRICS — ЧТО ТРЕКАЕМ

### 7.1 Engineering metrics

- **Deploy frequency**: >= 2/неделю production
- **Lead time** (commit → prod): < 1 час
- **Change failure rate**: < 5%
- **MTTR**: < 2 часа

### 7.2 Product metrics (по phase)

| Phase | Primary metric | Target |
|-------|---------------|--------|
| P0 | Working protocol engine | All schemas validated |
| P1 | Time-to-first-task | < 5 min |
| P2 | Agent task success rate | > 70% |
| P3 | Onboarding completion | > 60% (registered → first task) |
| P4 | Multi-user adoption | 30% of users invite teammate |
| P5 | Integration adoption | 50% of pro users link GitHub |
| P6 | Marketplace listings | 50+ in Y2H1 |
| P7 | NPS | > 50 |

### 7.3 Business metrics

| Quarter | Target |
|---------|--------|
| Q1 (M1-M3) | Internal alpha working |
| Q2 (M4-M6) | Closed beta: 50 active users, 10 paying (early supporters $25) |
| Q3 (M7-M9) | Public beta: 1k waitlist + 200 paid |
| Q4 (M10-M12) | 1k paid, $25k MRR |
| Q5 (Y2H1) | 5k paid + 3 Org, $150k MRR |
| Q6 (Y2H2) | 10k paid + 10 Org + 1 Enterprise, $400k MRR — Series A ready |

---

## 8. РЕШЕНИЯ "БРИТВЫ ОККАМА" — ЧТО НЕ ДЕЛАЕМ

Прямые отказы — чтобы не распыляться:

1. **❌ Не строим свой Cloud IDE** — используем WebContainers / Codespaces
2. **❌ Не строим свою AI-модель** — orchestration only, models — pluggable
3. **❌ Не делаем deeptech features** (CRDT для кода, blockchain audit, на этом этапе) — слишком сложно для MVP
4. **❌ Не строим native mobile apps** — PWA достаточно до Year 2
5. **❌ Не строим свой billing** — Stripe + Lemon Squeezy
6. **❌ Не делаем internationalization до Phase 7** — английский + русский с дня 1, остальные потом
7. **❌ Не строим marketplace до Y2** — нет user base
8. **❌ Не делаем сложные approval chains в MVP** — простой LGTM достаточно
9. **❌ Не делаем on-prem до enterprise pilot** — overhead до validation
10. **❌ Не делаем браузер-extension для Firefox/Safari** — Chromium-only до traction

---

## 9. ПЕРВЫЕ 30 ДНЕЙ (CONCRETE NEXT STEPS)

### Week 1
- [ ] Регистрация юр.лица (Delaware C-Corp или Cyprus, в зависимости от налогового резидентства)
- [ ] Открытие банковского счёта
- [ ] GitHub org `totem-nexus` или аналог
- [ ] Domain: `nexus.dev` / `totemcorp.io` / альтернативы
- [ ] Установка инструментов: Linear (ironic), Figma, GitHub
- [ ] Финализация tech lead (нанять или founder сам)

### Week 2
- [ ] JSON Schema MVP (Project, Sprint, Task, Event, Invariant)
- [ ] Repo bootstrap: pnpm + Vite + Vue + TS strict + ESLint + Prettier
- [ ] CI/CD: GitHub Actions (test + build + deploy preview)
- [ ] Supabase project setup + initial migrations

### Week 3
- [ ] Protocol engine — первая версия (валидация + JSON↔MD)
- [ ] Authentication scaffold (GitHub OAuth)
- [ ] Базовый WebSocket server (heartbeat + presence)
- [ ] Landing page: nexus.dev/waitlist с прозрачным roadmap

### Week 4
- [ ] Внутренний демо: создать project + sprint + task через API
- [ ] Первые 3 design'а в Figma (Chat layer, Structure layer, Protocol layer)
- [ ] Контент-план на M2-M3: 8 постов по разработке
- [ ] Найм объявления: Backend dev, Designer

---

## 10. ОТКРЫТЫЕ ВОПРОСЫ (требуют решения до старта)

1. **Юридическая структура** — Delaware C-Corp vs Cyprus Ltd vs Estonia e-Residency? Зависит от налогового резидентства фаундера.
2. **Бренд** — Totem Nexus vs какое-то новое имя? Бренд Totem перегружен ("totem pole", "spiritual"), Nexus тоже занят. Возможный rename.
3. **Open core boundary** — protocol open-source (MIT?), SaaS закрытый. Что именно открываем?
4. **Initial financing** — bootstrapping vs seed round vs friends & family? Влияет на сроки и team size.
5. **Russian language priority** — рынок дома, но monetization сложнее. Решение: RU-bootstrap → EN-expansion с M6.
6. **Self-hosted enterprise** — Year 2 must-have или Year 3 opt-in?

---

## 11. ЗАКРЫТИЕ

**Главные мысли по реализации:**

1. **Не строй с нуля то, что можно интегрировать** — WebContainers, MCP, Supabase, Stripe
2. **Прогрессивное раскрытие сложности — главный UX-принцип** — 3 слоя, переключаемые
3. **Cross-project memory — это моат** — без неё мы просто ещё один Linear с ИИ
4. **MCP с дня 1** — защита от vendor lock-in. Никаких Claude-specific prompts в core
5. **Mobile важно с Phase 3** — менеджеры одобряют гейты с телефона
6. **Маркетплейс — Year 2, не Year 1** — нужна сначала user base
7. **Open core стратегия** — protocol open, hosted SaaS закрытый, экспорт всегда доступен

**MVP за 6 месяцев. Production-ready за 12. Series A — за 18.**

---

*План оптимизирован относительно исходного 10-стадийного roadmap. Основные изменения: переупорядочение приоритетов, добавление 10 критических стадий, отказ от 2 (cloud IDE, маркетплейс на ранней стадии), и явная критика рисков. Документ — живой; ревизия каждые 90 дней.*
