# TOTEM NEXUS — Pitch Deck

> Формат: slide-by-slide презентация · Время: ~15 минут  
> Аудитория: инвесторы, потенциальные команды, early adopters  
> Версия: 1.0 · 2026-05-15

---

## SLIDE 1 — HOOK

# TOTEM NEXUS

**Чат, в котором живёт проект.**

*Cursor встретил Linear. У них родился общий язык — для людей и ИИ.*

---

## SLIDE 2 — ОДНА КАРТИНКА (Show, don't tell)

```
┌─────────────────────────────────────────────────────────┐
│  💬  CHAT                                    [⚙] [📊]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Денис] У нас баг в /dashboard при logout              │
│                                                          │
│  [🤖 NEXUS] Создал задачу T-127 → Sprint 12              │
│              📎 console-trace.log                        │
│              📷 screenshot.png                           │
│              👉 Builder-Sonnet начал работу             │
│                                                          │
│  [🤖 Builder] Воспроизвёл. Это race condition в         │
│               useAuthStore.ts:42. Готов починить.       │
│               ⛔ gate: locked — ждёт LGTM               │
│                                                          │
│  [Денис] LGTM                                            │
│                                                          │
│  [🤖 Builder] ✅ Commit: "T-127: fix logout race"        │
│               +12 -3 строк · CI green · tests pass      │
│                                                          │
└─────────────────────────────────────────────────────────┘

Один чат. Полная история. ИИ как участник команды.
```

---

## SLIDE 3 — ПРОБЛЕМА

### Разработчик в 2026 — это пилот с 12 кабинами

- **IDE** (Cursor / Claude Code)
- **Tracker** (Linear / Jira)
- **Chat** (Slack / Discord)
- **Repo** (GitHub)
- **Docs** (Notion)
- **AI Chat** (ChatGPT / Claude)
- **Design** (Figma)
- **Deploy** (Vercel)
- **DevTools** (Chrome)
- **CI** (GitHub Actions)
- **Mail** (Gmail)
- **Calls** (Zoom)

Каждое переключение = **15 минут восстановления контекста** *(Microsoft research, 2024)*.

**Результат:** разработчик пишет код 1.5 часа из 8.

---

## SLIDE 4 — ИИ НЕ ПОЧИНИЛ ПРОБЛЕМУ — УХУДШИЛ ЕЁ

ИИ-чат — это **новая 13-я кабина**.

| Боль | Из-за чего |
|------|-----------|
| 🔥 «У меня 30 чатов с Claude» | Чаты не привязаны к задачам |
| 🔥 «ИИ забыл, что мы решили в прошлый раз» | Нет долгосрочной памяти |
| 🔥 «Менеджер не видит, что делает ИИ» | ИИ невидим в трекере |
| 🔥 «Не могу повторить успех со вчера» | Промпт-шаблоны не сохранены |
| 🔥 «Cursor работает только локально» | Команда не участвует |

---

## SLIDE 5 — РЕШЕНИЕ: TOTEM NEXUS

### **Чат как поверхность. Граф как мозг.**

Один интерфейс, в котором живёт проект:
- Каждое **сообщение** автоматически — узел в графе задач
- Каждый **ИИ-агент** — first-class член команды с аватаром
- Каждое **решение** — frozen invariant с timestamp'ом
- Каждый **баг** — захвачен из DevTools в один клик

Три слоя, переключаемые одной кнопкой:

```
┌──────────────────────────────────┐
│ 💬  Chat       — для всех         │
├──────────────────────────────────┤
│ 📊  Structure  — для менеджеров   │
├──────────────────────────────────┤
│ ⚙️  Protocol   — для архитекторов │
└──────────────────────────────────┘
```

**Прогрессивное раскрытие сложности**: новичок видит чат, эксперт — машинерию.

---

## SLIDE 6 — KILLER FEATURE #1: SMART CHAT

ИИ-роутер **прозрачно** понимает каждое сообщение:

| Юзер пишет... | Система делает... |
|---------------|------------------|
| «баг на /dashboard» | Создаёт Task с тегом `bug` |
| «надо бы добавить dark mode» | Создаёт `feature` в текущем спринте |
| «давайте обсудим миграцию на Vue 3.6» | Создаёт `discussion`, тегает архитектора |
| «согласен на план» | Открывает gate, разрешает ИИ-агенту работать |
| «как мы решили с auth?» | Семантически ищет в `INVARIANTS`, цитирует |

**Никаких ручных тегов. Никаких форм. Только разговор.**

---

## SLIDE 7 — KILLER FEATURE #2: ИИ-АГЕНТЫ КАК КОМАНДА

```
┌─────────────────────────────────────┐
│  Team Members  · 5 online           │
├─────────────────────────────────────┤
│  👤 Денис          (you)            │
│  👤 Анна           PM, idle         │
│  🤖 Claude-Architect  ◉ thinking... │
│  🤖 Sonnet-Builder    ◉ coding T-42 │
│  🤖 Flash-UI          ⚪ idle       │
└─────────────────────────────────────┘
```

- Видишь, **что** делает ИИ в реальном времени
- Видишь, **где** его курсор в коде
- Читаешь его **поток мыслей** (thought log)
- Передаёшь работу через кнопку **Handoff** — JIT-контекст собирается автоматически

ИИ — это **member**, не tool.

---

## SLIDE 8 — KILLER FEATURE #3: ПАМЯТЬ ЧЕРЕЗ ПРОЕКТЫ

«Я уже **решал** похожую задачу 3 месяца назад в другом проекте.»

NEXUS помнит:
- Какие **стеки** вы предпочитаете
- Какие **паттерны** работали, какие — нет
- Какие **решения** были приняты и почему (`INVARIANTS`)
- Какие **скрипты** вы создавали (`Script Registry`)

При начале новой задачи — **семантический поиск** по всем вашим прошлым проектам. ИИ предложит решение, не изобретая колесо.

> *«Это как иметь второй мозг, специфичный именно для разработки.»*

---

## SLIDE 9 — KILLER FEATURE #4: GATES — ЧЕЛОВЕК ВСЕГДА В ПЕТЛЕ

```
.pd: T-127 (Fix logout bug)
gate: locked  ⛔  ← ИИ заблокирован
              │
       Ждёт literal "LGTM" / "Go"
              │
              ▼ человек одобряет
gate: open    ✅  ← ИИ исполняет
              │
              ▼ задача завершена
gate: closed  🔒  ← заморожено
```

**3 уровня безопасности:**
- 🔴 `locked` — нужен явный апрув
- 🟡 `auto` — для рутинных задач (тесты, доки, рефактор)
- 🟢 `open` — текущее исполнение

**Никаких сюрпризов.** ИИ не "пробует" что-то и не "решает за вас".

---

## SLIDE 10 — KILLER FEATURE #5: VIBE-TO-CODE

```
[Юзер] Сделай мне SaaS для отслеживания
       питания, типа MyFitnessPal но проще.
       Цвета: оранжевый + чёрный.

[NEXUS] ✨ Создаю проект...
         ▸ Stack: Nuxt 4 + Supabase + Tailwind
         ▸ Sprint S01: Foundation (5 tasks)
         ▸ Sprint S02: Auth + Onboarding
         ▸ Sprint S03: Food tracking flow
         ▸ Preview: nutrislim-x7.preview.nexus.app

         Готов начать S01? [LGTM]
```

**От идеи до preview за 30 секунд.** Дальше — итерация в чате.

*(Lovable + Cursor + Linear в одной кнопке.)*

---

## SLIDE 11 — KILLER FEATURE #6: BUG CAPTURE FROM DEVTOOLS

Chrome Extension перехватывает:
- ❌ Console errors
- 🌐 Network failures
- 📊 Performance issues
- 📷 Screenshots
- 🖱️ User actions trace

Одна кнопка → **полностью контекстуализированный bug-report**:
- URL, viewport, browser, OS
- Last 50 user actions
- Console trace
- Network har
- Screenshot
- Текущий active sprint

ИИ получает идеальный bug-report. Bug → Fix → Commit в одном цикле.

---

## SLIDE 12 — KILLER FEATURE #7: TIME-TRAVEL

```
Project History  ◀═══●═════════════▶
                 Mar 2026    Today

[Drag slider to any moment]
  → Видишь полное состояние проекта тогда
  → Все задачи, инварианты, чат-логи
  → "Почему мы выбрали Pinia?" — ответ из 2026-03-10

Story Mode: автозапуск history-replay для онбординга.
```

**Понимание проекта = понимание его истории.**

---

## SLIDE 13 — РЫНОК

### TAM / SAM / SOM

```
TAM (всё AI-Dev tooling):           $50B к 2028
   ↓
SAM (AI-orchestration platforms):   $8B
   ↓
SOM (chat-first project mgmt):      $1.5B
```

**Активная аудитория:**
- 28M developers in world (2026)
- 6M используют AI coding tools ежедневно
- 1.5M фрилансеров и indie devs

**Beachhead:** Indie devs с ИИ → $25/мес × 100k = $30M ARR (3% от 1.5M через 24 мес).

---

## SLIDE 14 — БИЗНЕС-МОДЕЛЬ

| План | $/мес | Сегмент |
|------|-------|---------|
| Free | $0 | Discovery |
| Pro | $25 | Solo dev |
| Team (3-10) | $20/user | Small teams |
| Org (10-50) | $50/user | Mid-market |
| Enterprise | Custom | 50+ |

**Дополнительные потоки:**
- 💰 **Marketplace** — 20% с stack-адаптеров и шаблонов
- ⚡ **AI credits markup** — на premium-модели
- 🏢 **Enterprise services** — внедрение, custom guardians

**Unit economics target (Pro):**
- ARPU: $25/мес
- CAC: $40 (organic + content marketing)
- LTV: $600 (24 мес avg)
- LTV/CAC: 15x

---

## SLIDE 15 — КОНКУРЕНТНЫЙ ЛАНДШАФТ

```
              ┌───────────────────────────────────┐
              │              CODE                  │
              │           ⬆                       │
              │     Cursor          Claude Code   │
              │  Github Copilot     v0/Lovable    │
              │                                    │
              │            [TOTEM NEXUS]          │
              │                                    │
              │  Linear            ChatGPT/Claude │
              │  ClickUp           Notion AI      │
              │           ⬇                       │
              │           CHAT/PM                  │
              └───────────────────────────────────┘
                  SOLO ◀━━━━━━━━━━━━━━━━━━▶ TEAM
```

**Наш квадрант пуст.** Все остальные — solo-code или team-chat. Никто не делает chat-first project mgmt с реальным AI-исполнением.

---

## SLIDE 16 — ПРОДУКТ — РОАДМЭП (визуальный)

```
M1-M3   FOUNDATION
        ├─ JSON Schema + protocol engine
        ├─ Chat UI + AI-router
        └─ Real-time backbone (WS+SSE)

M4-M6   MVP — CHAT + TASKS
        ├─ Visual DAG taskboard
        ├─ Agent presence
        └─ Handoff with JIT-context

M7-M9   MASS-MARKET HOOKS
        ├─ Vibe-to-Code generator
        ├─ Chrome extension (bug capture)
        ├─ Cross-project memory
        └─ AI Coach for solo

M10-M12 COLLABORATION
        ├─ Voice / video / screen-rec
        ├─ Comments / threads
        └─ Sharing (public / private)

Y2 H1   INTEGRATIONS
        ├─ GitHub / GitLab sync
        ├─ Slack / Discord / Telegram
        └─ Mobile PWA + push

Y2 H2   MARKETPLACE + ENTERPRISE
        ├─ Stack marketplace
        ├─ SSO / SCIM / audit-log
        └─ On-prem edition
```

**MVP shipping: 6 месяцев.** Production-grade: 12 месяцев.

---

## SLIDE 17 — СТАРТОВЫЙ КАПИТАЛ (что уже сделано)

| Артефакт | Готовность | Сэкономлено |
|----------|-----------|-------------|
| **Totem V6 protocol** | 100% — production-ready | 6 мес исследований |
| **Taskboard-Supabase** | 40% — event sourcing, presence, time-travel | 4 мес кодинга |
| **Totem V7 patterns** | 20% — JSON schema, crews, MCP design | 2 мес дизайна |
| **Totem-View experiments** | Working POC — AI feedback, prompts, DevTools | 2 мес дизайна |
| **42 stack adapters** | Production-tested | 3 мес курирования |

**Старт не с нуля.** Уже ~17 месяцев инженерной работы вложено в основу.

---

## SLIDE 18 — РИСКИ И ОТВЕТЫ

| Риск | Ответ |
|------|-------|
| 🚨 OpenAI / Anthropic запускают свой аналог | **MCP**: model-agnostic. BYO-keys. Данные — наш моат |
| 🚨 GitHub Copilot Workspaces | Кроссы-проектная память + chat-first |
| 🚨 Mass-market сложно охватить | Прогрессивное раскрытие: 3 слоя UI |
| 🚨 Vendor lock-in боязнь у enterprise | Open core + экспорт в .ptl/.pd → git в любой момент |
| 🚨 AI-токены дорого | Smart router (Flash для дешёвого), BYO-keys, prompt caching |
| 🚨 Регуляторика на ИИ в EU | Audit-log из коробки + on-prem option |

---

## SLIDE 19 — КОМАНДА

*(заполнить по факту: founder profile, advisors, key hires plan)*

Ключевые роли для старта:
- **Founder / Product** — vision, GTM
- **Tech Lead** — full-stack senior (Vue/Node/PG)
- **AI Engineer** — MCP, agentic systems
- **Designer** — UX для прогрессивного раскрытия сложности
- **DevRel** — content, community, demos

---

## SLIDE 20 — ASK

### Что нам нужно

**Seed round: $1.2M на 18 месяцев**

Распределение:
- **60% inженерия** — 4 человека × $150k × 1.5 года
- **15% AI инфраструктура** — токены, vector DB, hosting
- **15% маркетинг** — content, dev-influencers, conferences
- **10% operations** — legal, accounting, runway buffer

**Цели к концу runway:**
- ✅ Production-ready SaaS
- ✅ 5,000 paying users
- ✅ $150k MRR
- ✅ 3 enterprise pilots
- ✅ Series A readiness

---

## SLIDE 21 — ВИДЕНИЕ

> «Через 5 лет программирование выглядит так:
> 
> Ты открываешь **один чат** на телефоне или ноуте.
> Говоришь, что хочешь.
> Видишь, как **команда — твоя и ИИ-агентов — строит**.
> Утверждаешь решения голосом или одной кнопкой.
> Код, тесты, деплой — невидимая инфраструктура под капотом.
> 
> Программирование как игра в стратегию, а не сборка пазла.»

**Totem Nexus — это первый шаг туда.**

---

## SLIDE 22 — CLOSE

### TOTEM NEXUS

**One chat. Full project. Real AI team.**

📧 contact@nexus.dev  
🌐 nexus.dev/demo  
📂 github.com/totem/nexus

*Спасибо.*

---

*Презентация для use case: pitch инвесторам, рекрутинг команды, demo для early adopters. Slides 10-12, 17 — наиболее важные для эмоционального воздействия. Slides 13-16 — для инвесторов. Slides 5-9 — для тех-команды.*
