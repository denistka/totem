# TOTEM V6 — REFERENCE DOCUMENT
> Protocol version: MRPP v6.0 (SYSTEMATIC-EXCELLENCE)  
> Compression: v3.1 · Knowledge cutoff: March 2026

---

## 1. OVERVIEW

**Totem V6** — это **протокольный репозиторий** для совместной разработки в тандеме Human–AI. Не приложение (нет `npm start`, CLI или сервера). Totem — **общий протокол**, загружаемый в контекст AI-агента, чтобы обеспечить структурированный, контролируемый человеком рабочий процесс.

### Проблемы, которые решает Totem

| Проблема | Решение |
|----------|---------|
| AI авто-выполняет задачи без одобрения | Физические gates (`gate: LOCKED`) |
| Планирование и исполнение смешаны | Разделение ролей PLANNER / PM |
| Решения «теряются» между спринтами | `INVARIANTS.md` + ссылки из `.ptl` |
| Перегрузка контекста (все правила сразу) | JIT-загрузка через `requires:` |
| Знания одного проекта не используются в других | OPTIMIZER: глобальный backfill в `/stacks` |

### Философский фундамент

1. **Human holds the gate** — только человек может открыть gate (`LGTM` / `Go`)
2. **Agent never assumes approval** — запрещено симулировать или выводить согласие
3. **Plan ≠ Execute** — PLANNER создаёт файлы, PM исполняет (ни один не делает оба)
4. **Gates = External Human Signals** — не рекомендации, а жёсткие блокираторы
5. **Invariants protect past decisions** — заморозка решений, изменение только через явное обсуждение
6. **JIT Context** — загружать только правила, нужные конкретной задаче
7. **External Code** — никакого кода приложения внутри `totem/`

---

## 2. РЕПОЗИТОРИИ: ТИПОВАЯ СТРУКТУРА

```
/Projects/
  ├── totem/                          # (Этот репо) Протокол, Guardians, Core
  │     └── instances/your-project/  # Метаданные проекта и спринты
  ├── project-code/                   # Код приложения (Vue, React, Node и т.д.)
  └── prompt-machine/                 # (Опционально) История исполнения
```

---

## 3. ФАЙЛОВЫЕ ФОРМАТЫ

### 3.1 Расширения

| Расширение | Роль | Назначение |
|------------|------|------------|
| `.ti` | TOTEM (Internal) | Правила, протоколы, логика ролей |
| `.ptl` | PLANNER/PM | Спринт: цель, задачи, инварианты |
| `.pd` | PM/DEVELOPER | Атомарная задача: цель, шаги, критерии |
| `.pa` | ARCHITECT | Архитектурные решения, design gates |
| `.pi` | ROOT | Канонический индекс проекта |
| `.pqa` | QA | Результаты верификации (по запросу) |
| `.ppm` | PM | Executable context blocks (по запросу) |
| `.po` | LEGACY | **Не использовать** — deprecated |

### 3.2 Спринт-файл `.ptl`

```yaml
---
id: S01
name: Foundation & AI Core
status: TODO                           # TODO | IN-PROGRESS | DONE
gate: LOCKED                           # ВСЕГДА LOCKED при создании
requires: [vue/VUE.ti, node/NODE.ti]   # JIT: только нужные адаптеры
---

# S01: Foundation & AI Core

## Objective
Высокоуровневая цель спринта.

## Tracks (опционально)
- **Track A:** Core Logic
- **Track B:** UI

## Tasks
- [ ] S01-T01-FrontendInit.pd
- [ ] S01-T02-BackendInit.pd

## Invariants
@S00-INVARIANTS.md
```

**Правила:**
- `gate: LOCKED` обязателен при создании (только пользователь меняет на `OPEN`)
- `requires:` — минимально необходимый набор стек-адаптеров
- Финальный QA охватывает ВСЕ треки вместе (не per-track)

### 3.3 Задача `.pd`

```yaml
---
id: S01-T02
name: Backend Initialization
status: TODO
gate: LOCKED
requires: [node/NODE.ti]
---

# S01-T02: Backend Initialization

## Objective
Одна верифицируемая цель.

## Acceptance Criteria
- Критерий 1
- Критерий 2

## Steps
1. Шаг 1
2. Шаг 2
```

**Правила задачи:**
- **15–30 строк** логики исполнения (без заголовка): меньше = фрагментация, больше = perplexity
- **Атомарность**: одна цель = один файл
- `gate: LOCKED` по умолчанию — PM блокируется и сообщает: _"Change `gate: LOCKED` to `gate: OPEN` to authorize execution"_

### 3.4 Инварианты `INVARIANTS.md`

Создаются в конце спринта. Замораживают решения для следующего спринта.

```markdown
# S05 Invariants — Glass System

Sprint result: Design tokens ported, visual parity pending.

## Design Tokens
- `--glass-primary`: RGB definition (no rgba())
- `--shadow-glass`, `--shadow-glass-lg`, `--shadow-glass-xl`

## API Contracts
- `POST /api/auth/login` → { email, password } → { token, user }

## Structural Decisions
- State: Pinia (global), local hooks (component)
- Directory: `/src/features/{feature}/{components,services,types}`

## Restrictions
- Cannot change API contracts without explicit discussion
- Cannot add dependencies without ARCHITECT approval
```

**Правила инвариантов:**
- Подключаются в следующем `.ptl` через `invariants: @S05-INVARIANTS.md`
- Изменение — только через явный task + обсуждение
- Pre-sprint audit: проверить существование инвариантов предыдущего спринта

---

## 4. WORKFLOW: ФАЗЫ, GATES, СИГНАЛЫ

### 4.1 Пять фаз итерации

```
1-PLAN    (PLANNER/PM)    → gate: scope-approved
2-DESIGN  (ARCHITECT)     → gate: design-reviewed
3-DEVELOP (DEV)           → gate: build-passes
4-VERIFY  (QA)            → gate: tests-pass
5-CLOSE   (ROOT/PM)       → gate: iteration-complete
```

**Правила flow:**
- Последовательно: 1→5
- Откат: провал на gate N → возврат к фазе N-1
- Внутри DEVELOP: независимые задачи можно параллелить (DAG)
- **Gate = External Human Signal**: агент ЗАПРЕЩЁН предполагать, что gate пройден

### 4.2 Multi-Track спринты

```
Track A: Core → Types → Services → API
Track B: UI Components → Screens → Integration
Track C: Tests → Documentation → Polish
```

- Треки выполняются **последовательно** (если не помечен `parallel: true`)
- Перед 3-DEVELOP: верифицировать `INVARIANTS.md` предыдущего спринта
- Визуальные изменения — **один за раз**: изменение → build → проверка

### 4.3 LGTM Gate Protocol

Из `index.ti` (ANTI-AUTO-PROCEED AXIOMS):

```
1. AI ONLY: запрещено симулировать или предполагать одобрение человека
2. SEPARATION: PLANNER ментально заблокирован от исполнения
3. GATING: исполнение LOCKED до literal "LGTM" или "Go" в ПОСЛЕДНЕМ сообщении
4. PHYSICAL LOCK: любой .pd с gate:LOCKED — UNEXECUTABLE. Must stop.
```

### 4.4 Execution Protocol (PM Guardian)

1. Load Context: прочитать Project Index (`$pi`) первым
2. **Verify Physical Lock**: если `gate: LOCKED` → STOP → сообщить пользователю
3. **Verify Human Signal**: найти literal `LGTM`/`Approve` в последнем сообщении
4. Verify Stack: подтвердить проект и активный стек
5. Load Scoped Rules (JIT): читать `requires:`, загрузить только эти адаптеры
6. Verify Directory: строго в `paths.code` (НЕ внутри totem/)
7. Execute: выполнить действия из prompt
8. **Commit**: `git add . && git commit -m '<task_id>: <description>'` сразу после

---

## 5. GUARDIANS — РОЛИ АГЕНТОВ

### 5.1 Обзор

| Guardian | Файл | Роль |
|----------|------|------|
| **ROOT** | `guardians/ROOT.ti` | Оркестратор, Knowledge Hub, Intake; enforces MRPP v6.0 |
| **PLANNER** | `guardians/PLANNER.ti` | Создаёт `.ptl` и `.pd`; **никогда** не исполняет код |
| **PM** | `guardians/PM.ti` | Project Manager; верифицирует gates, загружает контекст, исполняет |
| **ARCHITECT** | `guardians/ARCHITECT.ti` | System design, инварианты, модульность, state management |
| **QA** | `guardians/QA.ti` | Тестирование, верификация, a11y, mobile-first, E2E smoke |
| **DEVOPS** | `guardians/DEVOPS.ti` | CI/CD, build pipelines, env management, lock files, linting |
| **CODEMAP_QUALITY_ADVISOR** | `guardians/CODEMAP_QUALITY_ADVISOR.ti` | Codemap-driven verdict + ordered refactor roadmap (опционально) |
| **OPTIMIZER** | `core/OPTIMIZER.ti` | System Director — оптимизация Totem, глобальный backfill |

### 5.2 Порядок загрузки (JIT Load Order)

```
1. index.ti                              → protocol axioms, ROOT orchestration
2. instances/<project>/project.config.yml → paths, guardians, stacks
3. Target guardian (PLANNER / PM / ...)  → role-specific rules
4. Stack adapters via requires:          → only what's needed
```

### 5.3 PLANNER — Философский Gate

```
Zero Code Knowledge: роль НЕ ЗНАЕТ ничего о коде, бизнес-логике, технологиях
Zero Execution: НИКОГДА не пишет код и не исполняет шаги
Pure Protocol: фокус на здоровье и структуре Totem
Hard Stop: после генерации .ptl + .pd → STOP, ждать gate scope-approved
```

**Planning Flow:**
1. Audit: проверить текущее состояние (дедупликация)
2. Invariants: найти и подключить `S*-INVARIANTS.md` в `.ptl`
3. Decompose: разбить backlog на атомарные `.pd` < 50 строк
4. Sequence: упорядочить по зависимостям (Core → Types → Services → UI)
5. JIT Context Mapping: назначить `requires:` каждой задаче
6. Physical Locking: **ОБЯЗАТЕЛЕН** `gate: LOCKED` в каждом `.ptl` и `.pd`

### 5.4 ARCHITECT — Архитектурные Правила

- **Loose Coupling**: модули общаются через интерфейсы, не через реализации
- **Single Source of Truth**: трансформации данных в одном месте
- **Modularity**: файлы > 100 строк ДОЛЖНЫ быть разбиты
- **State Access Pattern**: ONE pattern across entire app (не микс)
- **Observable Isolation**: дорогие компоненты (Map, Canvas, Chart) — leaf-level observers

### 5.5 CODEMAP_QUALITY_ADVISOR — Порядок чтения

1. `AGENT-GUIDE.md` — scope, refresh command, static limits
2. `codemap-surface.json` — generatedAt, summary, hot modules
3. `codemap-src-paths.json` — folder layout, naming, depth anomalies
4. `codemap-import-refs.json` — exact import sites, cycles, unresolved
5. `codemap.json` — file size/tree

**Сигналы риска:**
- Высокий `referencesFromOtherFiles` на большом модуле → change amplification risk
- `unresolved` в import-refs → фиксировать до использования графа
- Паттерны пути: `utils`/`helpers` blobs, lifecycle names (`old`, `v2`, `tmp`)

---

## 6. QUALITY GATES

> Источник: `core/QUALITY_GATES.ti` (post-mortem Kvit test assignment, 2026-02-26)

### Typing Gates
- **Zero `any`**: в production-коде — ноль `any`. Explicit interfaces или generics.
- **Explicit Contracts**: все store/service параметры типизированы
- **No Dead Code**: каждый import, переменная, параметр должны использоваться

### Tooling Gates
- **Single Package Manager**: один lock file (соответствующий README)
- **Linter Required**: `eslint` в `devDependencies` + config file
- **Formatter Required**: `prettier` в `devDependencies` + `.prettierrc`
- **Lint Must Pass**: `npm run lint` exits 0 перед delivery

### Consistency Gates
- **State Access**: ONE способ доступа к stores по всему приложению
- **Style System**: если используется компонентная библиотека → оверрайды через config, NOT raw CSS
- **Import Pattern**: aliasing (`@/`) OR relative — никогда вперемешку

### Modularity Gates
- **File Size**: ни один файл не должен превышать 100 строк
- **Split if >= 150**: ОБЯЗАТЕЛЬНО разбить до завершения задачи

### Performance Gates
- **Observable Granularity**: реактивные контейнеры (Map, Chart) НЕ должны перерендериваться на каждую мутацию коллекции
- **Re-render Audit**: компоненты с дорогими виджетами изолированы от высокочастотных state changes

### Delivery Gates
- **Task Commit**: `git add . && git commit -m '<task_id>: ...'`
- **Happy Path Smoke**: register → login → primary action без ошибок
- **Console Clean**: Zero unhandled errors/warnings в DevTools
- **README Accuracy**: каждая команда из README работает на fresh clone
- **Clone-Install-Start**: `git clone → install → start` — ноль ручных вмешательств

### Anti-Patterns (FAIL)
- ❌ `any` как "fix it later"
- ❌ Два lock file одновременно (`package-lock.json` + `pnpm-lock.yaml`)
- ❌ README упоминает linting, но нет linter в dependencies
- ❌ MUI `sx` props + raw `.css` файлы рядом
- ❌ MobX stores → full-tree re-renders
- ❌ Dead declarations (unused vars, imports, timeouts)
- ❌ Giant files (> 150 строк) вместо модулей

---

## 7. СТЕКИ (STACKS)

### 7.1 Stacks vs Templates vs Instances

| Директория | Тип | Описание |
|------------|-----|---------|
| `/stacks` | RUNTIME PATTERNS | Tech-specific adapters. "How-to" правила для AI во время имплементации |
| `/templates` | SCAFFOLDING | Пустые формы для конфигурации проекта (стартовые точки) |
| `/instances` | REAL DATA | Одна папка на активный проект с реальными данными |

### 7.2 Доступные стеки (42 всего)

**Frontend Frameworks:**
- `vue/VUE.ti` — Vue 3.6+ (Vapor, Composition API, alien-signals)
- `react/REACT.ti` — React 19/20 (Actions, useOptimistic, use() hook)
- `react/REACT_SERVER_COMPONENTS.ti` — RSC (Next.js/Remix server-first)
- `react/REACT_COMPILER.ti` — React Compiler (auto-memoization)
- `svelte/SVELTE_DEV.ti`
- `astro/ASTRO.ti` — Astro 6 (Vite Environment API)
- `nuxt/NUXT.ti` — Nuxt 4+ (Hybrid, Nitro, @nuxt/hints)

**Backend & Server:**
- `node/NODE.ti` — Node.js 22+ (ESM-first)
- `supabase/SUPABASE.ti`
- `vue-backend/VUE_BACKEND_REACTIVITY.ti`

**Build & Tooling:**
- `typescript/TYPESCRIPT.ti` — strict mode, no-any
- `vite/VITE.ti` — Vite 8 (Rolldown, SPA/Tauri)

**State Management:**
- `rstore/RSTORE.ti` — local-first с offline sync
- `mobx/MOBX.ti`
- `local-first/LOCAL_FIRST.ti` — CRDTs, Dexie
- `react/ZUSTAND.ti`
- `react/JOTAI.ti`

**UI & Styling:**
- `tailwind/TAILWIND.ti`
- `material-ui/MUI.ti`
- `accessibility/ACCESSIBILITY.ti` — WCAG 2.2

**Architecture & Security:**
- `architecture/ARCHITECTURE_SCALE.ti` — Micro frontends
- `security/SECURITY.ti`

**AI & Agents:**
- `mcp/MCP.ti` — MCP & agentic AI

**Graphics & Native:**
- `graphics/SLANG.ti`, `graphics/WEBGL.ti`, `graphics/WGPU.ti`
- `rust/RUST_DEV.ti`
- `web3/WEB3.ti`
- `leaflet/LEAFLET.ti`

**Platform:**
- `tauri/TAURI.ti` — Tauri 2 (iOS, Android, macOS, Windows, Linux)
- `vercel/VERCEL.ti`
- `pwa/PWA.ti`

### 7.3 Ключевые правила стеков (выборка)

**Vue 3.6+:**
- `<script setup>` + Composition API обязательны
- Vapor Mode для performance-critical компонентов
- Pinia — canonical state management (Vuex deprecated)
- Vue Router как typed state management

**React 19/20:**
- `<form action={fn}>` + `useActionState` для Actions
- `useOptimistic` для instant UI feedback
- `use()` для unwrap promises в render
- Portal architecture для PWA fixed chrome

**TypeScript:**
- `strict: true`, `noUncheckedIndexedAccess`, `noUnusedLocals`
- `interface` для extensibility, `type` для unions
- `unknown` вместо `any`, `as const` вместо `enum`
- Path aliases (`@/`) — последовательно

**Vite 8:**
- Rolldown (Rust bundler) — 10-30x быстрее
- SPA mode для Tauri/PWA (не SSR)
- Path aliases в `vite.config.ts` AND `tsconfig.json`

---

## 8. INSTANCE PATTERN

### 8.1 Структура инстанции

```
instances/
  └── your-project/
      ├── README.md               # Project hub (копия из template)
      ├── project.config.yml      # Paths, guardians, stack adapters
      ├── sprints/
      │   ├── S01-Foundation.ptl
      │   ├── S01-T01-FrontendInit.pd
      │   ├── S01-INVARIANTS.md
      │   └── ...
      ├── intel/                  # Instance-specific docs
      │   ├── architecture.md
      │   └── api-spec.md
      └── docs/
```

### 8.2 `project.config.yml`

```yaml
project:
  name: project-name
  version: 1.0.0
  stack: [vue, typescript, supabase]

paths:
  code: ../../../project-code-repo  # Внешний репо с кодом
  history: ./sprints                # Где лежат .ptl/.pd
  intel: ./intel                    # Instance-specific docs

guardians:
  default:
    - ROOT
    - PM
    - QA
    - DEVOPS
    - ARCHITECT
  stack_adapters:
    - vue/VUE.ti
    - typescript/TYPESCRIPT.ti
    - supabase/SUPABASE.ti
```

### 8.3 Онбординг нового проекта (5 шагов)

1. **Repo Init**: clone `totem` и `code` репо
2. **Context Sync**: указать AI на `totem/instances/{project}/README.md`
3. **Ground Truth**: выполнить `npm run build` для проверки текущего состояния
4. **History Check**: просмотреть последние `.ptl` и `.pd` в configured history path
5. **Role Alignment**: загрузить нужный Guardian

### 8.4 Создание новой инстанции

1. `totem/instances/` → создать папку `your-project-name`
2. Скопировать `totem/templates/PROJECT_README.template.md` → `README.md`
3. Заполнить README и создать `project.config.yml`
4. Выбрать стек-адаптеры из `/stacks/`
5. Сказать AI: _"Read totem/instances/your-project/README.md and start S01"_

---

## 9. TEMPLATES

### 9.1 Доступные шаблоны

**Vue & Nuxt:**
- `vue3-nuxt-tailwind/VUE3_NUXT_TAILWIND.ti` — Nuxt 4 + Vue 3.6 + Vite + RSTORE + MCP
- `vue3-vite-tailwind/VUE3_VITE_TAILWIND.ti` — Vue 3.6 + Vite 8 + Tailwind
- `vue3-ts-tauri2/VUE3_TAURI2.ti` — Vue 3 + TypeScript + Tauri 2

**React:**
- `react-ts/REACT_TS.ti`
- `react-ts/PWA_REACT_GLASS.ti` — PWA + Glassmorphism + Portal layout

**Backend:**
- `node-express/NODE_EXPRESS.ti`

**Svelte:**
- `svelte-ts/SVELTE_TS.ti`

---

## 10. OPTIMIZER: ОПТИМИЗАЦИЯ СИСТЕМЫ

> `core/OPTIMIZER.ti` — System Director (Totem Owner)

### Философский Gate

- **Company Owner Mindset**: Totem — стратегический актив
- **Independence**: Director не наследует от Architect
- **Strategic Readability**: нетехнический stakeholder должен понять систему за 30 секунд

### Optimization Sprint Flow

**Trigger**: "optimize totem" или "extract lessons from X"

```
Phase 1 — AUDIT
  Читать последние N спринтов из инстанции
  → искать паттерны, компоненты, замороженные решения из INVARIANTS.md

Phase 2 — GLOBAL BACKFILL
  Абстрагировать паттерны в глобальные best practices
  → добавить в stacks/ или templates/

Phase 3 — COMPRESS INSTANCE
  Сжать проанализированные спринты в исторический digest
  → создать instances/{project}/sprints/H1-S35_S45-Summary.md

Phase 4 — PRUNE
  Удалить: chat logs, .po файлы, устаревшие .md
  → оставить: .ptl, .pd, .pa, INVARIANTS.md, historical digest
```

### Метрики обслуживания

| Метрика | Определение |
|---------|-------------|
| **Density** | Tokens per business rule |
| **Perplexity** | Насколько легко агент понимает задачу без уточнений |
| **Purity** | Соответствие 100-строчному лимиту |

### Planning Lessons

- **Scope by flow, not widget**: одна "маленькая" задача тянет types, styles, несколько экранов
- **Invariants before next sprint**: создавать/расширять `INVARIANTS.md` после каждого спринта
- **Delivery = user flow**: `clone → install → start`; любой failing step = провал до code review

---

## 11. MODELS & AI WORKFLOW

### 11.1 Рейтинг моделей

| Модель | Роль | Когда использовать |
|--------|------|--------------------|
| Claude Opus 4.6 (Thinking) | Architect | System design, сложные алгоритмы, невозможные баги |
| Claude Sonnet 4.6 (Thinking) | Senior Developer | Реализация фич, сложная логика — идеальный баланс |
| Gemini Pro / GPT-OSS 120B | Middle All-rounder | Написание кода, ревью, общие задачи |
| Gemini Flash | Speedster | UI компоненты, стили, тесты, документация |

### 11.2 Режимы работы

**Fast Mode (Reactive):**
- Прямые действия без церемоний
- Best for: локальные изменения в 1-2 файлах
- Model: Sonnet 4.6 (Thinking)

**Planning Mode (Strategic):**
- Research → Plan → Approval → Execution
- Best for: фичи, затрагивающие несколько модулей, API, global state
- Output: Implementation Plan → Review → Commit

### 11.3 Decision Matrix

| Задача | Режим | Модель |
|--------|-------|--------|
| Bug fix в frontend | Fast | Sonnet |
| Новая система трекинга | Planning | Sonnet/Opus |
| UI компоненты из макета | Fast | Flash |
| Security audit | Planning | Gemini Pro |
| Docs/Tests | Fast | Flash |

---

## 12. TERMINOLOGY

| Термин | Определение |
|--------|------------|
| **Gate** | Checkpoint (`gate: LOCKED/OPEN`). Агент не может предполагать, что gate пройден |
| **LGTM** | "Looks Good To Me" — явный сигнал одобрения человека |
| **Invariants** | Замороженные решения в `INVARIANTS.md`; изменение только через explicit task |
| **JIT Context** | Загрузка только нужных правил через `requires:` |
| **DAG** | Directed Acyclic Graph зависимостей задач |
| **Parity** | Полная реализация, соответствующая референсу (по flow, не по виджетам) |
| **Brick** | Атомарная задача (`.pd`) — метафора "дом строится из кирпичей" |
| **Track** | Параллельный поток работы в спринте (последовательный, если не `parallel: true`) |
| **Vapor Mode** | Opt-in режим Vue 3 — компиляция в прямые DOM операции (без VDOM diffing) |
| **Alien Signals** | Vue 3.6 reactivity engine — 3-5x быстрее, -40% памяти |
| **rstore** | Typed local-first state management с offline sync и Drizzle/Directus |
| **Rolldown** | Rust-bundler в Vite 8 — 10-30x быстрее esbuild/Rollup |
| **ROC** | Return on Complexity — отвергать сложные решения без 10x стратегической ценности |
| **$pi** | Project Index (alias для Project Index файла) |
| **$ti** | Totem Intel (alias) |

### Операторы компрессии (`core/COMPRESSION_RULES.ti`)

```yaml
->  Flow / Depends On
=>  Implies / Results In
+   Add / Include
-   Remove / Exclude
?   Check / Query
!   Execute / Enforce
```

---

## 13. ПАТТЕРНЫ PROMPT

### Sprint Planning (PLANNER)

```
Read totem/index.ti, load instance <project>, load PLANNER.
Plan a sprint for: [описание фичи].
Expected output: .ptl (Sprint) and .pd (Task) files with gate: LOCKED.
```

### Task Execution (PM)

```
Read totem/index.ti, load instance <project>, load PM.
LGTM — execute paths.history/sprints/46/S46-T1-TaskName.pd
```

> ⚠️ LGTM или Go должны быть в **том же сообщении** что и команда выполнить

### Codemap Quality Verdict

```
Read totem/index.ti, load instance <project>, load CODEMAP_QUALITY_ADVISOR.
Using codemap JSON under [path], produce:
- Quality verdict (healthy/mixed/risky)
- Ordered refactor roadmap (3-7 steps)
```

### Optimization

```
Read totem/index.ti, load instance <project>, load totem/core/OPTIMIZER.ti.
Optimize totem: extract lessons from last 20 sprints, update global stacks.
```

---

## 14. ANTI-PATTERNS: СВОДНАЯ ТАБЛИЦА

| Anti-Pattern | Guardian | Последствие | Исправление |
|--------------|----------|-------------|-------------|
| PLANNER пишет/исполняет код | PLANNER | Нарушение разделения ролей | Только `.ptl`/`.pd`, STOP |
| Агент предполагает одобрение | All | AI auto-proceeds, человек не в петле | Требовать literal LGTM/Go |
| Код приложения в `totem/` | All | Загрязнение Totem | Писать в `paths.code` |
| `any` в TypeScript | QA/ARCHITECT | Нарушена типобезопасность | Explicit interfaces/generics |
| Два lock file одновременно | DEVOPS | Несогласованность зависимостей | Один lock file |
| Смешение паттернов state access | ARCHITECT | Хаос обслуживания | Один паттерн по всему приложению |
| Файлы > 150 строк | QA/ARCHITECT | Читаемость, testability | Разбить на модули |
| Изменение инвариантов без обсуждения | OPTIMIZER | Тихие регрессии | Explicit task + discussion |
| MUI sx + raw CSS рядом | ARCHITECT/QA | Конфликты стилей | Один подход |
| Нет `.env.example` | DEVOPS | Секреты в репо / missing config | Всегда создавать с dummy values |
| "Works locally" (пропуск browser checks) | QA | Мобильные/тематические баги в production | Проверять все темы и устройства |

---

## 15. UI/UX DASHBOARD: TASKBOARD-SUPABASE

> Репозиторий: `/Users/denistka/Projects/taskboard-supabase`  
> Роль: **визуальный интерфейс и оркестровая панель** для Totem V6 protocol  
> Статус: S01–S08 + частично S15 реализованы; 20 спринтов MRPP-промптов готовы (S01–S20)

### 15.1 Назначение

Taskboard-Supabase — это **production-ready real-time collaborative taskboard**, который служит дашбордом для Totem V6. Он визуализирует спринты, задачи, AI-агентов и временну́ю историю событий. Именно здесь Totem переходит из мира `.ptl`/`.pd` файлов в живой интерфейс.

**Ключевые функции для Totem:**
- Kanban-борды с колонками Todo / In Progress / Done для `.pd` задач
- Timeline — лента событий (event sourcing) по всем акторам (human + agent)
- Time-Travel — скрабб через историю спринта до любой точки во времени
- Agent Presence — AI-агенты как first-class пользователи с идентичностью
- Handoff Panel — передача задач между human ↔ agent
- Seed из Totem — `pnpm db:seed-sprints` импортирует `sprints/` в борд "Sprints"

### 15.2 Технический стек

| Уровень | Технология |
|---------|-----------|
| Frontend | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (strict mode) |
| Router | Vue Router 4 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + PostCSS |
| State | Composables (Vue 3 hooks-pattern), без Pinia |
| Testing | Vitest (unit) + Playwright (E2E) |
| Backend | Node.js 20+ + WebSocket (`ws` library) |
| Database | PostgreSQL (Supabase managed) + RLS |
| Auth | JWT via Supabase Auth |
| Package manager | pnpm (monorepo / workspaces) |
| Deployment | Docker multi-stage · Railway · Render · Fly.io |

### 15.3 Структура монорепо

```
taskboard-supabase/
├── client/                 # Vue 3 SPA (Vite)
│   └── src/
│       ├── components/
│       │   ├── common/     # Button, Card, Input и др.
│       │   ├── modules/    # Timeline, EventDetail, HandoffPanel
│       │   ├── pages/      # Boards, TaskBoard, Home, Login, Profile
│       │   └── wrappers/   # AppLayout, PageLayout
│       ├── composables/
│       │   ├── useAuth.ts
│       │   ├── useWebSocket.ts
│       │   └── core/       # useBoards, useTasks, useTimeline,
│       │                   # useTimeTravel, useReplay, useComments...
│       ├── config/
│       │   └── sprintMarkers.ts   # Маркеры спринтов на Timeline
│       └── utils/websocket.ts     # WS message types & helpers
├── server/                 # Node.js WebSocket server
│   └── src/
│       ├── index.ts                # Entry point
│       ├── MessageHandler.ts       # Central WS dispatcher (~800 lines)
│       ├── EventEmitter.ts         # Event sourcing emitter
│       ├── eventStore.ts           # Time-travel queries & replay
│       ├── validation.ts           # Zod schemas для WS-сообщений
│       ├── managers/               # AuthManager, BoardManager,
│       │                           # TaskManager, PresenceManager,
│       │                           # PromptHistoryManager...
│       └── scripts/
│           ├── seed-sprints.ts     # Import totem/sprints/ → DB
│           ├── parseSprints.ts     # Parse .po/.ppm/.pqa/.pcto
│           └── totem-export.ts     # Export totem data to JSON
├── shared/
│   ├── types.ts            # Event sourcing types, Task, Board, Profile...
│   └── eventReplay.ts      # Pure replay function (shared client+server)
├── db/                     # Migrations & schema
│   ├── migration_events.sql          # Event sourcing table (S01)
│   ├── migration_agent_profiles.sql  # Agent support (S03)
│   ├── migration_agent_tasks.sql
│   └── migration_prompt_history.sql
└── sprints/                # MRPP промпты S01–S20
    └── N/                  # S0N.po, S0N.ppm, S0N.pqa, S0N.pcto
                            # + task-level: S0N-TK-slug.*
```

### 15.4 База данных (PostgreSQL / Supabase RLS)

| Таблица | Назначение |
|---------|-----------|
| `profiles` | Пользователи + AI-агенты (`actor_type`: human/agent) |
| `boards` | Рабочие пространства (воркспейсы) |
| `tasks` | Kanban-задачи с версионированием и agent assignment |
| `comments` | Обсуждения к задачам |
| `board_members` | Роли (owner/member) и join requests |
| `events` | **Append-only event log** — JSONB payload, 8 индексов |
| `prompt_history` | История AI-взаимодействий (prompt, context, actor) |

**Event типы в `events`:**
```
task:*        board:*        comment:*
presence:*    agent:*        handoff:*    sprint:*
```

### 15.5 Totem V6 Integration (детально)

**Event Sourcing (S01–S02)**
- Иммутабельный event log — база для time-travel и replay
- Fire-and-forget emission: клиент получает ответ немедленно, запись async
- Производительность: цель < 50ms response time

**Agent Identity & Presence (S03)**
- Agent profiles как first-class users: `actor_type = 'agent'`
- Поля: `agent_name`, `agent_avatar_url`, `agent_capabilities (JSONB)`
- `AgentBadge` + `AgentAvatar` компоненты в UI
- Agent task status: `pending → in_progress → done | failed`

**Timeline & Event Explorer (S04)**
- Компонент `Timeline` с карточками событий
- Event detail drawer (full payload inspection)
- Фильтрация по type / actor / entity
- Маркеры спринтов на таймлайне
- Экспорт событий (JSON/CSV)

**Time-Travel & Replay (S05–S06)**
- `useTimeTravel` — реконструкция состояния на любой timestamp
- `useReplay` — инкрементальный replay (без повторного fetch на каждый шаг)
- `TimeTravelSlider` — скрабб через историю
- `ReplayControls` — step-forward / step-back

**Agent Handoff (S07–S08)**
- `HandoffPanel` — UI для передачи задачи human ↔ agent
- Event types: `handoff:to_agent`, `handoff:to_human`
- `PromptHistoryManager` — хранение и получение истории промптов

**Sprint Seeding (S15)**
```bash
pnpm db:seed-sprints
# Читает totem/sprints/ и sprints/N/
# → создаёт борд "Sprints" в БД
# Идемпотентно: безопасно запускать повторно
```

### 15.6 Архитектурные решения

**WebSocket-First Real-Time**
- Bidirectional WS (не polling)
- `MessageHandler.ts` — центральный диспетчер (~800 строк)
- Broadcast стратегии: `broadcastToAuthenticated`, `broadcastToBoard`
- Presence updates каждые 5 секунд; удаление по disconnect

**Optimistic Updates + Versioning**
- Клиент обновляет task оптимистично + version field
- Сервер детектирует конфликт через сравнение version
- Предотвращает lost updates при concurrent editing

**Manager Pattern (Server)**
- `BaseManager` — Supabase client wrapper
- Специализированные: `BoardManager`, `TaskManager`, `PresenceManager`...
- Все инжектируются в `MessageHandler` как зависимости

**Shared Types (Client + Server)**
- `shared/types.ts` — единый источник типов (Event, Task, Board, Profile)
- `shared/eventReplay.ts` — pure replay function (без side effects)
- Zod schemas на сервере для валидации WS-сообщений

### 15.7 Дорожная карта спринтов

| Фаза | Фокус | Спринты |
|------|-------|---------|
| Foundation | Event sourcing, state reconstruction | S01, S02 |
| Identity | Agent profiles, presence, UI attribution | S03 |
| Timeline | Timeline UI, filters, sprint markers | S04 |
| Time & Replay | Time-travel state, replay mode | S05, S06 |
| Agent Workflow | Task assignment, HandoffPanel | S07, S08 |
| Extended | Дальнейшие фичи | S09–S20 |

### 15.8 Dev-команды

```bash
pnpm dev              # Запуск server + client параллельно
pnpm build            # Build client (Vite) + server (tsc)
pnpm test             # Vitest unit tests (server + client)
pnpm db:start         # supabase start (локальная DB)
pnpm db:push          # Применить migrations
pnpm db:seed-sprints  # Импорт sprints/ → "Sprints" борд в БД
```

### 15.9 Деплой

| Платформа | Конфиг | Особенности |
|-----------|--------|-------------|
| **Docker** | `Dockerfile` + `docker-compose.yml` | Multi-stage: client (Nginx) + server (Node 20) |
| **Railway** | `railway.json` | Dockerfile builder, restart ON_FAILURE |
| **Render** | `render.yaml` | Docker runtime, health: `/health` |
| **Fly.io** | `fly.toml` | Region iad, shared CPU, 256MB RAM, auto-scale min=0 |

Nginx (`nginx.conf`) — reverse proxy: статика клиента (`:80`) + WebSocket server (`:3001`).

---

## 16. ЭВОЛЮЦИЯ СИСТЕМЫ: ЛУЧШИЕ ИДЕИ ИЗ ЭКСПЕРИМЕНТОВ

> Источники: `totem-v7/`, `totem-v7-app/`, `totem-view/`, `totem-view-sandbox/`  
> Статус идей: черновики и пробы пера — не внедрены в V6, но проверены на реальных проектах

---

### 16.1 Упрощение ролей: Owner / Planner / Builder

*Источник: `totem-v7/`*

V6 использует семь Guardians. V7 экспериментирует с радикальным упрощением до **трёх ролей**:

| Роль | Кто | Что делает |
|------|-----|-----------|
| **Owner** | Human | Видит «дом» целиком. Открывает gates. Принимает решения. |
| **Planner** | AI или Human | Строит DAG. Декомпозирует работу на bricks. |
| **Builder** | AI или Human | Исполняет один brick в рамках правил crew. |

Остальные функции (QA, DEVOPS, ARCHITECT) переходят в **Crew Rules** — конфигурируемые наборы ограничений, назначаемые на уровне brick или проекта.

**Crew Inheritance** — crew может наследовать от другого:
```json
{
  "id": "builder-rust",
  "extends": "builder-default",
  "constraints": [
    "Error handling: Use Result<T, E> — no unwrap() in production code.",
    "Memory safety: No unsafe blocks without documented justification.",
    "WASM: Minimize boundary crossings, batch transfers."
  ]
}
```

Это позволяет создать базовый crew и добавить специализацию (TypeScript, Rust, Python) без дублирования правил.

---

### 16.2 Gate: Auto — третье состояние

*Источник: `totem-v7/schema/`*

V6 знает только `locked` и `open`. V7 вводит третье состояние:

```json
"gate": "locked" | "open" | "auto"
```

- **`auto`** — Builder может proceed без явного LGTM от Owner  
- Применяется для низкорисковых, повторяющихся bricks (тесты, документация, рефакторинг по шаблону)
- Граница: Owner явно помечает brick как `gate: auto` при создании спринта

**Правило применения:** `auto` допустим только если brick не изменяет архитектурных инвариантов, не затрагивает API-контракты и не добавляет зависимостей.

---

### 16.3 Стек как живой документ с Integration Log

*Источник: `totem-v7/stacks/`*

В V7 каждый `.json` стека содержит `integration_log` — историю реального применения:

```json
"integration_log": [
  {
    "project": "navitrack",
    "date": "2026-03-10",
    "target": "navitrack-apps/src-client",
    "learnings": [
      "Portal-based PWA layout (createPortal for header/footer outside #root)",
      "Zustand store for screen navigation instead of react-router",
      "useOptimistic for handoff state (human ↔ agent)"
    ]
  }
]
```

**Принцип:** стек никогда не «забывает», где он применялся и что было выучено. Это превращает статическую документацию в базу знаний, которая растёт с каждым проектом.

**Для V6:** каждый `stacks/*.ti` может дополняться секцией `## Applied In` с ссылкой на спринт и кратким учебным выводом.

---

### 16.4 Script Registry — реестр инструментов

*Источник: `totem-v7/knowledge/scripts-registry.json`*

Полезные скрипты, созданные в ходе спринтов, теряются или забываются. V7 решает это через централизованный реестр:

```json
{
  "id": "code-map",
  "name": "Code Structure Mapper",
  "path": "navitrack-apps/src-client/scripts/code-map.mjs",
  "description": "Analyzes src-client. Generates CODEMAP.md with import analysis, identifies rule violations (R1-R9).",
  "usage": "node scripts/code-map.mjs",
  "created_sprint": "S72",
  "tags": ["analysis", "structure", "validation"]
}
```

**Зарегистрированные скрипты NaviTrack:**

| ID | Назначение |
|----|-----------|
| `code-map` | Анализ структуры, импорты, R1-R9 проверки → CODEMAP.md |
| `dep-graph` | Граф зависимостей, обнаружение циклов и orphans |
| `file-size-report` | Список файлов по размеру, флаги > 100 строк |
| `generate-pwa-icons` | Генерация favicon + PWA иконок из исходного PNG |

**Для V6:** добавить секцию `## Scripts` в `instances/<project>/` с аналогичным реестром.

---

### 16.5 DAG Health Metrics по слоям

*Источник: `totem-v7/instances/navitrack/dag.json`, `totem-v7-app/src/`*

V7 отслеживает прогресс не по задачам, а по **архитектурным слоям**:

```json
"health": {
  "foundation_progress": 0.33,
  "walls_progress": 0.0,
  "roof_progress": 0.0,
  "blocked_count": 8,
  "active_count": 12,
  "total_bricks": 20
}
```

**Три слоя:**
- **Foundation** — типы, схемы, API-контракты, базовые сервисы
- **Walls** — фичи, компоненты, бизнес-логика
- **Roof** — тесты, документация, polish, деплой

**Визуальный язык (из `totem-v7-app`):**
- Foundation → зелёные тона (стабильность)
- Walls → оранжевые тона (строительство)
- Roof → синие тона (финишные слои)

**Статусы brick** (полный lifecycle):
```
ghost → queued → ready → planning → executing → verifying → completed
                                  ↘ blocked → repairing → failed
```

---

### 16.6 Cascade Impact Calculation

*Источник: `totem-v7-app/src/App.tsx`*

При выборе brick в UI — автоматически вычисляется каскад всех затронутых зависимостей (BFS по DAG):

```typescript
const getDescendants = (id, allBricks, visited = new Set()) => {
  // BFS через depends_on edges → все потомки
}
const affectedBricks = getDescendants(selectedBrickId, bricks)
const cascadeWeight = affectedBricks.length * 2.5
```

**Для Totem:** при планировании спринта PLANNER должен оценивать `cascadeWeight` — количество зависимых задач, которые будут заблокированы если brick провалится. Brick с высоким `cascadeWeight` требует повышенного внимания и более чётких acceptance criteria.

---

### 16.7 Оценка стоимости brick

*Источник: `totem-v7-app/src/types/totem.ts`*

Каждый brick может нести явную оценку сложности:

```typescript
cost_estimate?: {
  base_hours: number          // базовая оценка в часах
  complexity_multiplier: number  // 1.0x → 10.0x
  cascade_weight?: number     // вес каскадных зависимостей
}
```

**Для PLANNER:** при декомпозиции спринта в `.ptl` добавлять оценку complexity (low / medium / high), чтобы PM и Owner видели суммарный scope до старта.

---

### 16.8 AI Feedback: агент → человек

*Источник: `totem-view/api/feedback/`, `supabase/migrations/S19`*

Агенты могут оставлять асинхронные сообщения, видимые в UI:

```typescript
type FeedbackType = 'status' | 'block' | 'suggestion' | 'message'

interface Feedback {
  instanceId?: string
  sprintId?: string
  taskId?: string         // scope: хотя бы одно поле
  type: FeedbackType
  body: string
  actor: { id: string; name: string; type: 'agent' }
  dismissed?: boolean
}
```

**Типы feedback:**
- `block` — агент заблокирован, требуется вмешательство человека
- `suggestion` — агент предлагает изменить подход
- `status` — промежуточный отчёт о прогрессе
- `message` — произвольное уведомление

**Схема таблицы:**
```sql
CREATE TABLE ai_feedback (
  id uuid PRIMARY KEY,
  instance_id text, sprint_id text, task_id text,
  type text NOT NULL CHECK (type IN ('status','block','suggestion','message')),
  body text NOT NULL,
  actor_id text NOT NULL, actor_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  dismissed boolean DEFAULT false
);
```

**Для V6/taskboard:** feedback badge на TaskCard + dismiss action = полноценный async канал agent→human без синхронного прерывания.

---

### 16.9 User Prompts: параметризованные шаблоны

*Источник: `totem-view/client/src/lib/runPrompt.ts`, `supabase/migrations/S20`*

Пользователи пишут многоразовые prompt-шаблоны с `{{placeholders}}`:

```typescript
interface TotemPrompt {
  name: string
  body: string            // "read totem/index.ti, load instance {{instanceId}}, load {{guardian}} and execute {{targetRef}}"
  guardian?: string       // 'PM' | 'DEV' | 'QA'
  targetType?: 'sprint' | 'task' | 'custom'
  targetRef?: string
}

// Генерация канонической команды:
export function buildTaskRunPrompt(instanceId, sprintId, taskId, guardian = 'PM'): string {
  return `read totem/index.ti, load instance ${instanceId}, load ${guardian} and execute sprints/${sprintId}/${taskFile}`
}
```

**Workflow:**
1. В UI создать prompt: `"load {{guardian}} and execute {{targetRef}}"`
2. Выбрать задачу → click "Run" → автоматически подставляются значения
3. Скопировать в Claude → агент исполняет

**Для V6:** хранить часто используемые prompt-шаблоны в `instances/<project>/prompts/` как `.md` файлы с frontmatter.

---

### 16.10 QA DevTools Extension

*Источник: `totem-view/extension/`*

Chrome extension (Manifest V3), решающий проблему: «QA тестирует фичу, а требования — в другом окне».

**Механика:**
1. UI устанавливает `window.__TOTEM_QA_CONTEXT__` при открытии задачи
2. `content.js` периодически считывает контекст и отправляет в background
3. Chrome DevTools panel показывает **objective, steps, acceptance criteria** прямо в DevTools

```javascript
// QaContext (из .pd файла):
{
  taskId, taskTitle,
  objective,
  steps,
  acceptanceCriteria,
  taskUrl
}
```

**Ценность:** QA не переключается между вкладками — все требования видны прямо рядом с DevTools Console.

---

### 16.11 Scoped Presence: уровни осведомлённости

*Источник: `totem-view/client/src/composables/usePresence.ts`*

Три уровня отслеживания присутствия (humans + agents):

```
instance:<id>   — кто в проекте
board:<sprintId> — кто смотрит спринт  
task:<sprintId>:<taskId> — кто открыл задачу
```

Polling-based (не требует постоянного WebSocket). Actors включают `type: 'human' | 'agent'` — агенты видны наравне с людьми.

**Dual realtime стратегия:**
```typescript
if (wsUrl?.trim()) {
  connectWs()    // Long-lived WebSocket (dev / self-hosted)
} else {
  connectSse()   // One-shot SSE (Vercel serverless / production)
}
```

---

### 16.12 SDUI Engine: UI из JSON

*Источник: `totem-view-sandbox/client/src/components/modules/brickhouse/`*

**Structured Data UI** — рекурсивный движок, рендерящий иерархию компонентов из JSON-моделей:

```typescript
interface UiNodeModel {
  type: string            // 'container' | 'brick' | 'panel' | ...
  id: string
  props?: Record<string, unknown>
  children?: UiNodeModel[]
}
```

Компонент `UiNode.vue` рекурсивно разворачивает модель в реальный DOM.

**Ценность для Totem:** AI-агент может вернуть JSON-структуру интерфейса, и она автоматически станет рабочим UI — без ручного кодирования компонентов.

---

### 16.13 Rhythmic Synchronization: состояние → анимация

*Источник: `totem-view-sandbox/client/src/composables/useRhythm.ts`*

16 предустановленных «вибов» — каждый задаёт BPM + stagger delay анимаций. Состояние приложения автоматически меняет активный вайб:

```typescript
const syncVibeToState = (state) => {
  if (state.error)        return 'vibe-fault-jitter'
  if (state.initializing) return 'vibe-hifi-soul'
  if (state.busy)         return 'vibe-masterflow'
  if (state.active)       return 'vibe-jazz-hop'
  return 'vibe-odessa-soul'  // idle
}
```

**Принцип:** приложение «дышит» вместе с пользователем — напряжённые операции дают ощущение работы, спокойные — расслабление. Subtle, но влияет на восприятие скорости и отзывчивости.

---

### 16.14 MCP-Ready архитектура

*Источник: `totem-v7/instances/totem-engine/invariants.json` (INV-004)*

> "Agent-agnostic via MCP. Totem never injects prompts into a specific AI. It exposes an MCP server that any AI can connect to. Context is assembled as structured JSON, not as prompt text."

**Предлагаемые MCP ресурсы:**
```
totem://project/{id}/dag         → текущий DAG с health metrics
totem://project/{id}/invariants  → frozen decisions
totem://stacks/{stackId}         → patterns + integration_log
totem://instance/{id}/config     → конфигурация проекта
```

**Значение:** любой MCP-поддерживающий инструмент (Claude Code, Cursor, VS Code Copilot) подключается к Totem и получает структурированный контекст — без copy-paste промптов.

---

### 16.15 Сравнительная таблица V6 → V7

| Аспект | V6 (текущий) | V7 (эксперимент) |
|--------|-------------|-----------------|
| **Форматы** | `.ti`, `.ptl`, `.pd`, YAML | JSON-only + JSON Schema validation |
| **Роли** | 7 Guardians | 3: Owner / Planner / Builder |
| **Rules** | Guardian rules | Crews с inheritance + per-brick override |
| **Knowledge** | Статические stack docs | Живые стеки с `integration_log` |
| **Agent integration** | Prompt-injected | MCP-ready, structured JSON output |
| **Validation** | Ручная | JSON Schema enforced |
| **Gates** | `locked` / `open` | + `auto` для доверенных задач |
| **Metrics** | Task counts | Layer progress (foundation / walls / roof) |
| **Tool persistence** | Теряются после спринта | Script Registry |
| **Feedback loop** | Синхронная | Async AI Feedback таблица |
| **Prompts** | Ad-hoc | Параметризованные шаблоны с `{{placeholders}}` |
| **QA context** | Ручной переход | DevTools Extension с auto-inject |

---

## 17. АУДИТ ИНСТАНЦИЙ: ЗДОРОВЬЕ СИСТЕМЫ

> Аудит проведён: 2026-05-15  
> Охват: 22 инстанции (`instances/`) включая navitrack как flagship-проект

---

### 17.1 NaviTrack — детальный аудит (S01–S86)

NaviTrack — самый крупный и зрелый проект в системе: 54 директории спринтов (S20–S86), 64 последовательно завершённых спринта, исторический архив S01–S19 удалён после zero-debt baseline.

#### Итоговый статус

| Категория | Статус | Детали |
|-----------|--------|--------|
| Спринты | 🟢 | Все S01–S86 завершены; нет активных; нет orphaned задач |
| Инварианты | 🟢 | S84–S86 корректно ссылаются на `sprints/54/INVARIANTS.md` |
| Архитектура | 🟢 | madge=0 циклов, jscpd=0 клонов; API barrel ликвидирован в S85; FSD converged |
| Backlog | 🟢 | 100% archived; zero-debt baseline установлен после S76 |
| Конфиг / пути | 🟢 | Все `paths.*` существуют; guardians корректны |
| **S83 отсутствует** | 🟡 | Нигде не упомянут — ни в `TOTEM_SPRINTS.ti`, ни в задачах. До S87 нужно задокументировать: пропущен намеренно или нет |
| **Intel устарел** | 🟡 | `TOTEM_INDEX.ti` / `TOTEM_EPICS.ti` — заморожены на 2026-03-10 (66 дней). `TOTEM_SPRINTS.ti` обновлён до S85, но S86 закрыт 2026-04-24. Refresh перед S87 обязателен |

#### Архитектурные достижения (S81–S86)

```
S81 — Architecture Review: дублирование и унификация (basis for S82–S84)
S82 — API Client SSOT: тип-безопасный слой, аудит hooks
S84 — Constrained Architectural Repair:
       ├── modules/ → features/ (FSD convergence)
       ├── api/store boundary: store→api facade extraction
       ├── Ownership map: domain consumers declared
       └── madge_cycles = 0 (verified)
S85 — Codemap Hub Reduction:
       ├── src/api/index.ts: referencesFromOtherFiles 59 → 0 (barrel eliminated)
       ├── useAppStore fan-in: 20 → 19 (slice extracted)
       ├── jscpd clones = 0, codemap unresolved = 0
       └── New: useObjectsUiStore (objects list separation)
S86 — Mobile Native Integrations:
       ├── Firebase FCM (iOS + Android)
       ├── Biometrics
       ├── Keystore (Tauri 2 unified)
       └── All tracks: DONE (2026-04-24)
```

#### Действия перед S87

1. Задокументировать статус S83 в `TOTEM_SPRINTS.ti`
2. Обновить `TOTEM_SPRINTS.ti`, `TOTEM_INDEX.ti`, `TOTEM_DECISIONS.ti` — отразить закрытие S86
3. Рассмотреть консолидацию инвариантов: S51–S54, S73 — несколько файлов, но в `.ptl` ссылается только S54

---

### 17.2 Аудит всех инстанций (22 проекта)

#### Сводная таблица

| Инстанция | Конфиг | README | Спринты | Ключевые проблемы | Статус |
|-----------|--------|--------|---------|-------------------|--------|
| **navitrack** | ✅ | ✅ | ✅ S20–S86 | S83 gap, intel stale | 🟢 ACTIVE |
| **tactical-recon-interface** | ✅ | ✅ | ✅ 70 спринтов | Нет | 🟢 ACTIVE |
| **totem-view** | ✅ | ✅ | ✅ 21 спринт | Невалидные адаптеры: `NODE_EXPRESS`, `REACT_TS`, `BUILD` | 🟡 ACTIVE |
| **personal-ai-bankir** | ✅ | ✅ | ✅ 13 спринтов | Нет | 🟢 ACTIVE |
| **portfolio** | ✅ | ✅ | ✅ 5 спринтов | Невалидный адаптер `GSAP_MOTION` (стека нет) | 🟡 ACTIVE |
| **smart-home** | ✅ | ✅ | ✅ 4 спринта | Невалидные: `FRONTEND_DEV`, `BACKEND_DEV`; `paths.code="../apps"` неоднозначен | 🟡 ACTIVE |
| **daww3** | ✅ | ✅ | ✅ 4 спринта | Невалидные: `FRONTEND_DEV`, `BACKEND_DEV`, `NODE`, `WEB3` | 🟡 ACTIVE |
| **kvit** | ✅ | ✅ | ✅ 5 спринтов | Нет секции `stack_adapters` | 🟡 ACTIVE |
| **taskboard-supabase** | ✅ | ✅ | ❌ нет | Нет спринтов; невалидные: `FRONTEND_DEV`, `BACKEND_DEV` | 🟡 DORMANT |
| **sdui-proto** | ✅ | ✅ | ⚠️ пустая | Пустая `sprints/`; невалидные: `VUE_DEV`, `FRONTEND_DEV` | 🔴 MISC |
| **totem-view-sandbox** | ⚠️ | ❌ | ✅ 2 спринта | Нестандартная схема конфига (`project_id` вместо `project.name`); нет `guardians` | 🔴 MISC |
| **timeline-editor** | ✅ | ✅ | ❌ нет | Нет спринтов; невалидный `FRONTEND_DEV` | 🟡 DORMANT |
| **fit** | ✅ | ✅ | ❌ нет | Нет спринтов; невалидный `FRONTEND_DEV` | 🟡 DORMANT |
| **TapMap** | ✅ | ✅ | ❌ нет | Нет спринтов; невалидные адаптеры | 🟡 DORMANT |
| **tat** | ✅ | ✅ | ❌ нет | Нет спринтов; невалидный `FRONTEND_DEV` | 🟡 DORMANT |
| **totem-v7** | ✅ | ❌ | ❌ нет | Нет README; нет спринтов; нет `stack_adapters` | 🟡 DORMANT |
| **totem-v7-app** | ✅ | ❌ | ✅ 1 спринт | Нет README; нет `history` в конфиге | 🟡 DORMANT |
| **vova-help** | ✅ | ❌ | ❌ нет | Нет README; нет спринтов; нет адаптеров | 🟡 DORMANT |
| **rive-demo** | ✅ | ❌ | ❌ нет | Нет README; нет спринтов; минимальный конфиг | 🟡 DORMANT |
| **chat** | ❌ | ✅ | ❌ нет | **Нет `project.config.yml`** | 🔴 BROKEN |
| **experiment** | ❌ | ✅ | ❌ нет | **Нет `project.config.yml`** | 🔴 BROKEN |

---

### 17.3 Системные проблемы (по категориям)

#### 🔴 Критические

**Отсутствует `project.config.yml` (2 инстанции):**
```
instances/chat/          — только README, конфига нет
instances/experiment/    — только README, конфига нет
```
Без конфига PM не может загрузить инстанцию. Нужно либо создать конфиг, либо удалить.

**Нестандартная схема конфига (`totem-view-sandbox`):**
```yaml
# ❌ Неправильно (используется в totem-view-sandbox):
project_id: totem-view-sandbox
project_name: Totem View Sandbox
# нет секции guardians

# ✅ Правильно:
project:
  name: totem-view-sandbox
guardians:
  default: [ROOT, PM, QA, DEVOPS, ARCHITECT]
```

#### 🟡 Массовая проблема: невалидные имена стек-адаптеров

**15+ инстанций** используют старые однословные имена адаптеров без пути — JIT-загрузка не найдёт такие файлы:

```yaml
# ❌ Старый формат (не работает):
stack_adapters:
  - FRONTEND_DEV
  - VUE_DEV
  - BACKEND_DEV
  - NODE
  - WEB3
  - MOBILE_TAURI

# ✅ Правильный формат (путь относительно totem-v6/stacks/):
stack_adapters:
  - react-ts/REACT_TS.ti
  - vue/VUE.ti
  - node/NODE.ti
  - web3/WEB3.ti
  - tauri/TAURI.ti
```

**Несуществующие адаптеры (нужно создать или убрать):**

| Невалидное имя | Что делать |
|----------------|-----------|
| `GSAP_MOTION` | Стека GSAP нет в `stacks/` — убрать или создать |
| `MOBILE_TAURI` | Заменить на `tauri/TAURI.ti` |
| `NODE_EXPRESS` | Заменить на `node/NODE.ti` |
| `FRONTEND_DEV` | Уточнить framework: `react-ts/REACT_TS.ti` или `vue/VUE.ti` |
| `BACKEND_DEV` | Заменить на `node/NODE.ti` или `supabase/SUPABASE.ti` |
| `BUILD` | Заменить на `vite/VITE.ti` |
| `REACT_TS` | Заменить на `react-ts/REACT_TS.ti` |
| `VUE_DEV` | Заменить на `vue/VUE.ti` |

#### 🟡 Инстанции без спринтов (10 штук)

Никогда не запускались или заброшены до первого спринта:
```
timeline-editor, chat, fit, vova-help, taskboard-supabase,
TapMap, experiment, rive-demo, totem-v7, tat
```
**Рекомендация:** принять решение — архивировать или запустить S01.

#### 🟡 Отсутствует README (5 инстанций)

```
vova-help, rive-demo, totem-v7, totem-v7-app, totem-view-sandbox
```
PM не может получить первичный контекст при onboarding.

---

### 17.4 Рекомендации по приоритетам

#### Немедленно (перед следующим спринтом в navitrack)
1. Обновить `intel/TOTEM_SPRINTS.ti` — добавить S86 в `done-order`
2. Обновить `intel/TOTEM_INDEX.ti` и `TOTEM_DECISIONS.ti`
3. Задокументировать S83: добавить запись `"S83: skipped — scope merged into S82/S84"` в `TOTEM_SPRINTS.ti`

#### Один технический спринт (по инстанциям)
1. Исправить `chat` и `experiment` — создать конфиги или удалить
2. Привести все `stack_adapters` к формату `scope/NAME.ti` (пройтись по всем 15+ инстанциям)
3. Исправить `totem-view-sandbox` — стандартизировать схему конфига
4. Удалить пустую `sprints/` в `sdui-proto` или создать первый спринт

#### Долгосрочно
- Добавить в онбординг-инструкцию явную валидацию: имена адаптеров должны соответствовать `stacks/<scope>/<NAME>.ti`
- Рассмотреть создание `GSAP_MOTION.ti` в `stacks/` — раз несколько проектов его требуют
- Консолидировать инварианты navitrack: создать `S86-INVARIANTS.md` как master-baseline вместо ссылки на S54

---

## 18. ИСТОЧНИКИ ЗНАНИЙ

Из `KNOWLEDGE_SOURCES.ti` (интегрировано на март 2026):

- **Vue.js Amsterdam 2026** — Vue 3.6 (Vapor/Alien Signals), Rolldown, Nuxt 4/5, Astro 6, rstore, Local-First, MCP/Agentic
- **React 2026** (Conf & Summit) — React 19/20, RSC, React Compiler, Zustand/Jotai, AI Agentic
- **DAWW3 P2P Web DAW** — Nexus-Pulse Networking, Quantum Glass Aesthetics, Real-time Canvas, Agentic MIDI
- **Totem Orchestration Spec** — DAG-based Task Graph, Event Bus, Sandbox, Brick-based Frontend, CI/CD Linting

---

*Документ сгенерирован на основе полного чтения репозитория Totem V6 · 2026-05-15. Дополнен: раздел 16 — анализ черновиков (totem-v7, totem-v7-app, totem-view, totem-view-sandbox); раздел 17 — аудит 22 инстанций.*
