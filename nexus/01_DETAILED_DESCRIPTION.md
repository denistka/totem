# TOTEM NEXUS — Детальное описание системы

> Версия: v1.0 (Strategic Vision) · Дата: 2026-05-15  
> База: Totem V6 (`TOTEM_V6_REFERENCE.md`) + эксперименты V7 + Taskboard-Supabase  
> Тип документа: Product Vision + System Architecture

---

## 0. ОДНА СТРОКА

**TOTEM NEXUS** — это **чат, в котором живёт проект**. Снаружи — единый разговор между человеком и ИИ. Внутри — структурированная иерархия эпиков, спринтов, задач, инвариантов, гейтов и истории решений. Каждое сообщение в чате — это узел в графе проекта. Каждый коммит, каждый баг, каждое решение — событие в общей таймлайн-ленте.

Это попытка соединить лучшие свойства пяти инструментов в одной поверхности:

| Инструмент | Что берём |
|------------|-----------|
| **Cursor / Claude Code** | Реальная имплементация кода ИИ-агентами в контексте задачи |
| **Lovable / v0** | Мгновенное прототипирование от описания к рабочему приложению |
| **ClickUp / Linear** | Структура задач, спринтов, эпиков, статусов |
| **Chrome DevTools** | Сбор багов, скриншоты, логи прямо в задачу |
| **Slack / Discord** | Чат как первичная поверхность для коммуникации |

---

## 1. ПРОБЛЕМА

### 1.1 Текущее состояние индустрии (2026)

Разработчик в 2026 переключается между 8–12 инструментами в день:
- IDE (Cursor / VS Code / Claude Code)
- Task tracker (Linear / Jira / ClickUp)
- Chat (Slack / Discord)
- Repo (GitHub / GitLab)
- Docs (Notion / Confluence)
- Design (Figma)
- AI chat (ChatGPT / Claude / Gemini)
- Deployment (Vercel / Netlify)
- Bug tracker (Sentry)
- CI/CD dashboard
- DevTools
- Email/Slack уведомления

Каждое переключение — потеря контекста и времени. Менеджер не видит реального прогресса; разработчик не видит бизнес-обоснование задачи; ИИ-агент не видит историю решений и работает в вакууме одного промпта.

### 1.2 Что не решают существующие инструменты

| Инструмент | Что недостаёт |
|------------|---------------|
| **ClickUp / Linear** | Нет интеграции с ИИ-исполнением. Задача = текст, не контекст. |
| **Cursor / Claude Code** | Нет долгосрочной памяти, нет связи с задачами/спринтами. Каждый чат — изолированный остров. |
| **Lovable / v0** | Только генерация, нет управления проектом, нет команды, нет ревью-процессов. |
| **GitHub Copilot** | IDE-bound. Менеджер ничего не видит. |
| **Slack** | Знания умирают в каналах. Нельзя вернуться к "решению от 3 марта". |

### 1.3 Корневая проблема

**Контекст и работа разорваны.** Чат с ИИ — это один артефакт. Задача в трекере — другой. Код — третий. PR — четвёртый. Нет единой нити, по которой можно проследить **от идеи до коммита до production**.

---

## 2. ИДЕЯ TOTEM NEXUS

### 2.1 Основной принцип

> **Чат — это интерфейс. Структура — это движок.**  
> Пользователь видит разговор. Система видит граф.

Каждое сообщение в чате автоматически связывается с одним или несколькими узлами проекта: эпиком, спринтом, задачей, инвариантом, решением. Это происходит **прозрачно** — пользователь не выбирает теги вручную. ИИ-маршрутизатор анализирует сообщение и привязывает его к контексту.

### 2.2 Три слоя

```
┌────────────────────────────────────────────────────────┐
│  СЛОЙ 1: РАЗГОВОР (visible)                            │
│  Чат-сообщения, голос, скриншоты, видео, код-снипеты   │
├────────────────────────────────────────────────────────┤
│  СЛОЙ 2: СТРУКТУРА (toggleable)                        │
│  DAG задач, kanban-борд, timeline событий, инварианты  │
├────────────────────────────────────────────────────────┤
│  СЛОЙ 3: ПРОТОКОЛ (hidden)                             │
│  Гейты, JIT-контекст, агенты, JSON-схемы, MCP-ресурсы │
└────────────────────────────────────────────────────────┘
```

**Слой 1** — то, что видит **менеджер / клиент / новичок**. Просто чат.  
**Слой 2** — то, что видит **тимлид / PM**. Структура проекта в реальном времени.  
**Слой 3** — то, что видит **senior dev / архитектор**. Полная машинерия Totem.

Переключение между слоями — один клик. Это **прогрессивное раскрытие сложности**: системой можно пользоваться, не зная о V6-протоколе. Но если хочешь — он есть.

### 2.3 Что отличает от текущего Totem V6

| Аспект | Totem V6 | TOTEM NEXUS |
|--------|----------|-------------|
| **Поверхность** | Файлы `.ptl`, `.pd` в Git | Чат + UI поверх БД |
| **Целевой пользователь** | Senior dev, знающий протокол | Любой, кто умеет писать сообщения |
| **Сложность** | 7 Guardians, 8 расширений | Скрыта за чатом |
| **Контекст агента** | Промпт-инъекция через файлы | MCP-сервер, structured JSON |
| **Сотрудничество** | Async через Git | Real-time через WebSocket |
| **История** | `git log` + файлы | Event sourcing с time-travel |
| **Распространение** | Установка локально | SaaS + self-hosted |

**Totem V6 — это движок. NEXUS — это автомобиль.**

---

## 3. ЦЕЛЕВАЯ АУДИТОРИЯ

### 3.1 Сегментация

```
TIER 1 (Beachhead) — Solo Developers с ИИ
├── Indie hackers, freelancers
├── Используют Cursor / Claude Code ежедневно
├── Боль: «у меня 12 проектов и нет порядка»
└── Готовы платить $20-50/мес

TIER 2 (Expansion) — Small teams (2-10 человек)
├── Startups, agencies, R&D отделы
├── Mix: human-developers + AI-agents
├── Боль: «менеджер не видит что делает ИИ»
└── $200-500/мес (team plan)

TIER 3 (Growth) — Mid-size teams (10-50 человек)
├── Product companies, scale-ups
├── Боль: «онбординг занимает месяцы»
└── $1k-5k/мес (org plan)

TIER 4 (Future) — Enterprise (50+)
├── Корпоративные R&D
├── Боль: «compliance, audit, sso»
└── Custom pricing
```

### 3.2 Персоны

**P1: Indie Dev «Денис»** (12 лет опыта, фронтенд, использует Claude)
- 5 активных pet-проектов + 3 клиентских
- Использует Claude Code + Cursor
- Хочет: один интерфейс, чтобы прыгать между проектами не теряя контекст

**P2: PM «Анна»** (нетехнический менеджер в B2B SaaS)
- Команда из 6 человек + 2 ИИ-агента
- Хочет: видеть прогресс без чтения кода
- Боль: разработчики "забывают" обновлять Jira

**P3: Founder «Михаил»** (соло-фаундер, vibe-coder)
- Делает MVP с Lovable, но застрял
- Хочет: продолжать "по-человечески", но с возможностью углубиться в код когда нужно

**P4: Tech Lead «Игорь»** (10+ человек, growing pains)
- Боль: код-ревью пожирает день
- Хочет: автоматизировать стандартные проверки, оставить себе только critical path

---

## 4. ОПОРНЫЕ ФИЧИ (10 столпов)

### 4.1 Smart Chat (главная фича)

**Что:** Единый чат-интерфейс, в котором каждое сообщение автоматически:
- Привязывается к одной или нескольким задачам/спринтам
- Получает метку времени и автора
- Может содержать inline-карточки задач, кода, диффов, скриншотов
- Поддерживает голосовые сообщения и видео-record (Loom-style)

**Как:** AI-router читает сообщение → определяет intent (вопрос, баг-репорт, задача, фидбек, решение) → создаёт/обновляет соответствующую сущность.

**Пример:**
```
[Денис] У нас на /dashboard падает консоль ошибкой при logout
   ↓ автоматически
[NEXUS] Создал баг T-127 → привязан к Sprint 12 → 
         attached: screenshot, console-trace
         AI-агент Builder начал воспроизводить...
```

### 4.2 Visual Project Graph (DAG)

Интерактивный 2D-граф с **зум-семантикой**:
- **Far zoom**: эпики (квадраты)
- **Mid zoom**: спринты (круги внутри эпика)
- **Close zoom**: задачи (мелкие узлы)

Цветовое кодирование по архитектурным слоям (из V7 идеи):
- 🟢 Foundation — типы, API, ядро
- 🟠 Walls — фичи, UI, бизнес-логика
- 🔵 Roof — тесты, документация, деплой

Каскадный показ: клик на задачу → подсвечиваются все потомки (BFS по `depends_on`).

### 4.3 Agent Presence (живые ИИ-участники)

- Каждый ИИ-агент — first-class user с аватаром, именем, "профессией"
- Виден его курсор: какой файл сейчас открыт, какая строка
- Поток "мыслей" (thought log) можно открыть в side-panel
- Статус real-time: idle / planning / coding / waiting-for-gate

### 4.4 Handoff Engine (умная передача контекста)

Кнопка "Handoff to AI" автоматически собирает JIT-контекст:
- Текущая задача + её acceptance criteria
- Связанные инварианты предыдущих спринтов
- Релевантные файлы кода (через codemap)
- Прошлые решения по похожим задачам (cross-project memory)
- Stack-адаптеры

И обратно: агент может пометить блок кода как "stuck here, need help" — у человека пингуется конкретное место.

### 4.5 Time-Travel & Replay

- Slider: перематай состояние проекта на любую точку в прошлом
- "Story Mode": автозапуск replay'я для онбординга нового члена команды или ретроспективы
- Каждое решение в `INVARIANTS` маркировано timestamp'ом и контекстом, в котором было принято

### 4.6 Bug Capture via DevTools Extension

Chrome extension, который:
- Перехватывает console errors, network failures, performance issues
- Делает скриншот текущего состояния
- При нажатии "Send to Totem" — создаёт задачу с полным контекстом (URL, viewport, browser, console trace, screenshot)
- В DevTools panel показывает текущую задачу: objective, steps, acceptance criteria

### 4.7 Vibe Coding (Lovable-style)

- В пустом проекте: «Сделай мне продуктовый лендинг для AI-стартапа»
- NEXUS генерирует:
  - Totem instance (config, paths, guardians)
  - Spectrum sprint S01 + 4-6 задач
  - Скаффолдинг кода (через WebContainers или git push)
  - Первое preview
- Дальше — итеративный диалог: «А теперь добавь pricing-секцию»

### 4.8 Cross-Project Memory

Когда вы начинаете новый проект, NEXUS уже знает:
- Ваши предпочитаемые стеки и паттерны
- Прошлые решения в похожих доменах
- Stack-адаптеры с `integration_log` (как стек применялся раньше)

Это — главное преимущество перед чистыми чат-ботами: **накопление личной разработческой памяти**.

### 4.9 Multi-Model Bridge (MCP)

NEXUS — не привязан к одному ИИ:
- Claude — для архитектуры и сложных решений
- Sonnet — для имплементации
- Gemini Flash — для быстрых UI-задач
- Локальные модели (Ollama) — для конфиденциального кода

Подключение через MCP — стандарт. Никаких prompt-инъекций под конкретную модель.

### 4.10 Mobile-First Gate Approval

PWA + push notifications:
- Approve / Reject спринты с телефона
- Голосовая команда: "Approve sprint 12"
- Watch-app для самых нетерпеливых менеджеров

---

## 5. АРХИТЕКТУРА (high level)

### 5.1 Технический стек

| Слой | Технология | Обоснование |
|------|-----------|-------------|
| Frontend | Vue 3.6 (Vapor) + TypeScript strict | Из стека Totem V6, проверено в taskboard-supabase |
| Build | Vite 8 (Rolldown) | 10-30x faster |
| State | Pinia + Local-First (rstore) | Offline-first из коробки |
| Realtime | WebSocket primary + SSE fallback | Подтверждённая dual-strategy из totem-view |
| Backend | Node.js 22 ESM + Fastify | Лёгкий, ESM-native |
| Database | PostgreSQL + Supabase | RLS, RT subscriptions, JWT |
| Storage | S3-compatible (R2) | Скриншоты, видео, voice notes |
| Search | pgvector + tsvector | Hybrid semantic + full-text |
| Agent Protocol | MCP server | Open standard, model-agnostic |
| Code execution | WebContainers (StackBlitz) | Без построения своего IDE |
| Deployment | Vercel (web) + Tauri 2 (desktop) + iOS/Android (PWA) | Multi-platform из totem-v6 patterns |

### 5.2 Доменная модель (упрощённо)

```
Organization
  └── Workspace
        └── Project (= Totem instance)
              ├── Epics
              │     └── Sprints (.ptl)
              │           └── Tasks (.pd)
              │                 └── Steps
              ├── Invariants (frozen decisions)
              ├── Stack Adapters (with integration_log)
              ├── Scripts (registry)
              ├── Members
              │     ├── Humans
              │     └── Agents (with capabilities JSONB)
              └── Events (append-only log)
                    ├── chat:*
                    ├── task:*
                    ├── gate:*
                    ├── handoff:*
                    └── presence:*
```

### 5.3 Ключевые архитектурные решения

1. **Event Sourcing as Truth** — все изменения, чаты, действия — события. Состояние проекта реконструируется replay'ем.
2. **Hybrid Storage** — структурированные данные (tasks, sprints) в PG; неструктурированные (chat content, voice, screenshots) в S3.
3. **JSON-validated, Markdown-rendered** — внутри храним JSON по схеме (V7), но рендерим в MD для git-commit'ов (V6 совместимость).
4. **Local-First** — клиент работает offline; синхронизация через CRDT при возврате online.
5. **MCP-Native** — Totem сам по себе является MCP-сервером; любой ИИ-инструмент может подключиться.

---

## 6. ОТЛИЧИЯ ОТ КОНКУРЕНТОВ

| Конкурент | Что они делают хорошо | Что у нас лучше |
|-----------|----------------------|-----------------|
| **Linear** | UX задач, скорость | + AI-агенты как участники, + чат-first, + код-уровень |
| **Cursor** | Локальный AI-кодинг | + долгосрочная память, + команда, + менеджерский слой |
| **Lovable / v0** | Vibe coding | + продолжение после prototype, + структура, + контроль |
| **Notion AI** | Документация + AI | + реальное исполнение, + intentral protocol |
| **GitHub Projects** | Bind to repo | + AI-агенты, + чат-first UX, + cross-project memory |
| **ClickUp** | Всё в одном | + AI-native (агенты — first-class), + код-аспект |

**Наша уникальная позиция:** *«Cursor встретил Linear на свидании, и у них появился ребёнок, говорящий на языке менеджеров»*.

---

## 7. БИЗНЕС-МОДЕЛЬ

### 7.1 Pricing tiers

| План | Цена | Кому |
|------|------|------|
| **Free** | $0 | Solo dev, до 3 проектов, общественные ИИ |
| **Pro** | $25/мес | Solo+, unlimited projects, приватные ИИ, BYO-keys |
| **Team** | $20/user/мес (min 3) | До 10 человек, agent slots, presence |
| **Org** | $50/user/мес | До 50 человек, SSO, audit-log, custom guardians |
| **Enterprise** | Custom | SSO+SCIM, on-prem option, compliance |

### 7.2 Дополнительные источники дохода

- **Marketplace fee** — 20% с продажи stack-адаптеров и шаблонов проектов
- **AI-credits passthrough** — markup на использование API премиум-моделей (Opus, GPT-5)
- **Enterprise consulting** — внедрение, миграция, кастомные Guardians

### 7.3 GTM (Go-to-Market)

1. **Phase 1 — Indie Dev Wedge** (месяцы 1-6):
   - Free tier + open-core
   - Хантинг в HN, Reddit r/ChatGPTCoding, Twitter dev-influencer'ы
   - Контент: "How I built X using Totem Nexus" посты

2. **Phase 2 — Small Teams** (месяцы 6-12):
   - Team plan + presence фичи
   - Кейс-стади с агентствами и стартапами
   - Bottom-up sales (от dev'а к команде)

3. **Phase 3 — Mid Market** (год 2):
   - Org plan + SSO
   - Outbound к R&D-директорам tech-компаний

4. **Phase 4 — Enterprise** (год 2-3):
   - Compliance, on-prem, custom guardians
   - Channel partners (системные интеграторы)

---

## 8. РИСКИ И MITIGATIONS

| Риск | Вероятность | Влияние | Mitigation |
|------|-------------|---------|-----------|
| **AI-провайдеры запускают свой аналог** | High | Critical | Model-agnostic via MCP; пользователь приносит свой ключ; данные = моат |
| **Сложность UX отпугнёт mass-market** | High | High | Progressive disclosure: чат-first, протокол скрыт |
| **Регуляторика на ИИ в EU** | Medium | Medium | Audit-log, право на explanation, on-prem-вариант |
| **Долгий цикл онбординга** | High | High | Zero-friction install (Chrome extension + GitHub OAuth → готовый проект за 30 сек) |
| **Vendor lock-in боязнь у enterprise** | Medium | High | Open core + экспорт в `.ptl/.pd` git-репо в любой момент |
| **Стоимость AI-токенов** | High | Medium | Кэширование, BYO-keys по умолчанию, smart router (Flash для дешёвых задач) |
| **Конкуренция со стороны GitHub Copilot Workspaces** | High | Critical | Дифференциация через cross-project memory + чат-first |

---

## 9. МЕТРИКИ УСПЕХА

### 9.1 Product metrics

- **DAU/MAU ratio** > 50% (sticky daily use)
- **Time-to-first-shipped-task** < 10 минут от регистрации
- **Agent task success rate** > 80% (% задач, исполненных ИИ без revert'а)
- **Cross-project context hits** > 5/неделю на активного пользователя

### 9.2 Business metrics

- **MRR growth** 20%/мес в первые 12 мес
- **Net revenue retention** > 110%
- **CAC payback** < 6 мес для self-serve

### 9.3 Качественные

- Регулярные user interviews: "что бы вы сейчас использовали, если бы не Nexus?"
- NPS > 50

---

## 10. СВЯЗЬ С СУЩЕСТВУЮЩИМ КОДОМ

### 10.1 Что мы переиспользуем

- **Taskboard-Supabase** (`taskboard-supabase/`) → база для backend WebSocket + Event Sourcing  
  Готово: 8/20 спринтов, agent presence, time-travel, handoff panel, sprint seeding
- **Totem-View** (`totem-view/`) → AI Feedback таблица, User Prompts шаблоны, QA Extension
- **Totem-View-Sandbox** → SDUI Engine, Rhythmic Synchronization
- **Totem-V7-App** → визуальные паттерны DAG, layer-based progress
- **Totem V6** (`totem-v6/`) → референсный протокол, stack-адаптеры, guardians

### 10.2 Что строим заново

- AI-router для чата (intent classification)
- MCP-сервер для агентов
- Cross-project memory (vector store + retrieval)
- Vibe coding generator (от описания → к instance + sprint)
- Pricing/billing infrastructure
- Onboarding flow

### 10.3 Что списываем

- Файловая природа `.ptl`/`.pd` (остаётся как export-формат, но первичное хранилище — БД)
- 7 Guardians → 3 ролевых архетипа: Owner / Planner / Builder (из V7 эксперимента)
- 8 расширений файлов → скрыты от UI, доступны через export

---

## 11. ОТКРЫТЫЕ ВОПРОСЫ

1. **Self-hosted vs SaaS-only?** Self-hosted даёт доверие enterprise, но усложняет update cycle. → **Решение: SaaS + self-hosted enterprise edition с lag в 1 минор-версию**.
2. **Хранить ли весь чат-историй в одной БД?** Может быть огромным. → **Решение: горячие 30 дней в PG, остальное в холодное S3 + индекс**.
3. **Как защитить пользовательский код от утечки в обучение моделей?** → **Решение: явные соглашения с провайдерами + опция self-hosted Ollama**.
4. **MCP vs Anthropic-specific?** → **Решение: MCP primary, но Anthropic-specific оптимизации для prompt caching**.
5. **Russian/English UI?** → **Решение: i18n с дня 1; русский — bootstrap-аудитория, английский — экспансия**.

---

*Документ описывает целевое состояние системы и стратегические решения. Детали реализации — в `03_IMPLEMENTATION_PLAN.md`.*
