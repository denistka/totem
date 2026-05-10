# Банкір.ai — Epics & Tasks
**Версія 1.0 · Травень 2026**
**Методологія: Agile / Sprint 2 тижні**

---

## LEGEND

```
[P0] — Критично для MVP launch
[P1] — Важливо, але не блокує launch
[P2] — Наступний спринт
───────────────────────────────
[FE] — Frontend (Vue 3)
[BE] — Backend (Node.js)
[AI] — AI / Prompting
[DB] — Database (Supabase)
[TG] — Telegram
[OPS] — DevOps / Infrastructure
```

---

## EPIC 1 — PROJECT FOUNDATION
**Мета:** Налаштувати проект, оточення, CI/CD
**Спринт:** 1 · Тривалість: 3 дні

---

### TASK-001 · Ініціалізація Frontend [FE][OPS] · P0
**Опис:** Створити Vue 3 + Vite проект з базовою конфігурацією

**Acceptance Criteria:**
- [ ] `npm create vite@latest bankir-ai -- --template vue` виконано
- [ ] Встановлено залежності: `vite-plugin-pwa`, `pinia`, `axios`, `@vueuse/core`
- [ ] Налаштовано `vite.config.js` з PWA плагіном
- [ ] Базова структура папок згідно з `bankir-vue-structure.md`
- [ ] `npm run dev` запускається без помилок

**Definition of Done:** Проект запускається локально, структура відповідає документу

---

### TASK-002 · Ініціалізація Backend [BE][OPS] · P0
**Опис:** Створити Node.js + Express сервер з базовою структурою

**Acceptance Criteria:**
- [ ] Встановлено: `express`, `cors`, `dotenv`, `@anthropic-ai/sdk`, `ws`
- [ ] `nodemon` для розробки
- [ ] `.env.example` з усіма змінними
- [ ] Health check endpoint `GET /api/health` → `{ status: 'ok' }`
- [ ] CORS налаштований для localhost та продакшн домену

**Definition of Done:** Сервер запускається, health check відповідає

---

### TASK-003 · Supabase Database Setup [DB] · P0
**Опис:** Створити БД, таблиці, налаштувати підключення

**Acceptance Criteria:**
- [ ] Supabase проект створено
- [ ] Виконані міграції: `users`, `conversations`, `debts`, `bank_rates`, `push_subscriptions`
- [ ] Row Level Security (RLS) увімкнено
- [ ] Підключення з бекенду перевірено
- [ ] `DATABASE_URL` додано в `.env`

**SQL міграція:** див. `bankir-master-doc.md` розділ 10

---

### TASK-004 · CI/CD Pipeline [OPS] · P0
**Опис:** Автоматичний деплой на Vercel (FE) і Railway (BE)

**Acceptance Criteria:**
- [ ] GitHub репозиторій створено (monorepo: `/client` + `/server`)
- [ ] Vercel підключено до `/client` — auto-deploy на `main`
- [ ] Railway підключено до `/server` — auto-deploy на `main`
- [ ] `vercel.json` з правилами rewrite скопійовано
- [ ] ENV змінні додано в обох платформах
- [ ] Preview деплой для PR

**Definition of Done:** Push в `main` → автоматичний деплой без ручних дій

---

### TASK-005 · PWA Configuration [FE][OPS] · P0
**Опис:** Налаштувати PWA — manifest, service worker, install banner

**Acceptance Criteria:**
- [ ] `public/manifest.json` скопійовано та налаштовано
- [ ] `public/sw.js` скопійовано
- [ ] Іконки 192x192 і 512x512 створено (зелений кіт або монета)
- [ ] `usePWA.js` composable адаптовано під Vue 3
- [ ] `InstallBanner.vue` компонент працює
- [ ] Lighthouse PWA score ≥ 90

---

## EPIC 2 — ONBOARDING
**Мета:** Перший екран — людина обирає сценарій, AI отримує контекст
**Спринт:** 1 · Тривалість: 2 дні

---

### TASK-006 · Onboarding Screen [FE] · P0
**Опис:** Екран вибору сценарію — 5 опцій, одне питання

**Acceptance Criteria:**
- [ ] `views/Onboarding.vue` створено
- [ ] 5 опцій: борг, бюджет, ФОП, ціль, просто поговорити
- [ ] Анімація появи карток (stagger 0.1s)
- [ ] Tap → перехід в Chat з переданим сценарієм
- [ ] Адаптивний дизайн: мобільний + планшет
- [ ] Стилі згідно з дизайн-системою (CSS variables з MVP)

---

### TASK-007 · Pinia User Store [FE] · P0
**Опис:** Глобальний стейт користувача

**Acceptance Criteria:**
- [ ] `stores/user.js` з полями: `scenario`, `debt`, `healthScore`, `ageGroup`
- [ ] `scenario` зберігається в `localStorage`
- [ ] Дії: `setScenario()`, `setDebt()`, `updateHealth()`
- [ ] При перезавантаженні — відновлення з localStorage (пропуск онбордингу)

---

## EPIC 3 — AI CHAT
**Мета:** Головний екран — розмова як центр продукту
**Спринт:** 1–2 · Тривалість: 4 дні

---

### TASK-008 · Chat API Endpoint [BE][AI] · P0
**Опис:** Безпечний проксі до Claude API

**Acceptance Criteria:**
- [ ] `POST /api/chat` приймає `{ messages[], userContext }`
- [ ] Підставляє system prompt з `userContext`
- [ ] Повертає `{ reply: string }`
- [ ] Rate limiting: 30 запитів/хв на IP
- [ ] Timeout: 30 секунд
- [ ] Логування помилок (без PII)
- [ ] API ключ ніколи не потрапляє у frontend

---

### TASK-009 · System Prompt Engine [BE][AI] · P0
**Опис:** Динамічний system prompt з контекстом користувача

**Acceptance Criteria:**
- [ ] `server/lib/systemPrompt.js` — функція `buildPrompt(userContext)`
- [ ] Контекст містить: сценарій, борг, вік, мову спілкування
- [ ] Базовий характер Банкіра незмінний (з `bankir-master-doc.md`)
- [ ] Адаптація тону для 55+ якщо `ageGroup === 'senior'`
- [ ] Unit тести для різних контекстів

---

### TASK-010 · useChat Composable [FE] · P0
**Опис:** Vue composable для управління чатом

**Acceptance Criteria:**
- [ ] `composables/useChat.js` з: `messages`, `loading`, `send()`, `clear()`
- [ ] Зберігання history для multi-turn розмови
- [ ] Відправка до `/api/chat` через axios
- [ ] Обробка помилок: timeout, network error, rate limit
- [ ] Збереження history в Supabase після кожного повідомлення

---

### TASK-011 · Chat UI Component [FE] · P0
**Опис:** Екран чату — повна реалізація

**Acceptance Criteria:**
- [ ] `views/Chat.vue` — header, messages, input
- [ ] Bubble-стиль: AI зліва, user справа
- [ ] Typing indicator (три крапки з анімацією)
- [ ] Auto-scroll до останнього повідомлення
- [ ] Textarea з auto-resize (1–5 рядків)
- [ ] Enter → відправка, Shift+Enter → новий рядок
- [ ] Quick replies (4 кнопки під полем вводу)
- [ ] Кнопка "Інструменти" → перехід до Tools
- [ ] HTML рендеринг відповіді (bold, line breaks)

---

### TASK-012 · Quick Replies Logic [FE] · P0
**Опис:** Контекстні швидкі відповіді після кожного повідомлення AI

**Acceptance Criteria:**
- [ ] 4 варіанти залежно від `scenario`
- [ ] Оновлюються після кожної відповіді AI
- [ ] Горизонтальний скрол якщо не вміщаються
- [ ] Tap → відправляє як повідомлення користувача

---

### TASK-013 · Chat Widget System [FE] · P0
**Опис:** Інтерактивні віджети що з'являються всередині чату

**Acceptance Criteria:**
- [ ] `components/widgets/DebtWidget.vue` — вартість боргу по днях
- [ ] `components/widgets/ScannerWidget.vue` — топ-3 банки для суми
- [ ] AI response парситься на наявність тригерів (борг, комісія)
- [ ] Віджет рендериться після відповідного повідомлення AI
- [ ] Tap на віджет → перехід у відповідний інструмент

---

## EPIC 4 — DEBT DESTROYER
**Мета:** Інструмент розрахунку боргу — емоційно найважливіший
**Спринт:** 2 · Тривалість: 2 дні

---

### TASK-014 · Debt Calculator Logic [FE] · P0
**Опис:** Алгоритм розрахунку погашення боргу

**Acceptance Criteria:**
- [ ] `lib/debtCalc.js` — чиста функція `calcDebt(debt, rate, payment)`
- [ ] Повертає: `{ months, totalPaid, overpay, dailyCost }`
- [ ] Обробка edge case: платіж менший за відсотки (нескінченність)
- [ ] Unit тести з реальними кейсами
- [ ] Точність до 1 ₴

---

### TASK-015 · Debt Destroyer UI [FE] · P0
**Опис:** Екран з інтерактивним слайдером

**Acceptance Criteria:**
- [ ] `views/DebtDestroyer.vue`
- [ ] Форма введення: банк, сума, ставка (pre-filled з store)
- [ ] Слайдер суми платежу (1 000 – 10 000 ₴, крок 500)
- [ ] Live перерахунок при зміні слайдера (без debounce — миттєво)
- [ ] 3 чіпи результату: місяців / переплата / економія
- [ ] CTA кнопка → відкрити Chat з контекстом "знайди гроші на платіж"
- [ ] Анімація зміни цифр

---

## EPIC 5 — COMMISSION SCANNER
**Мета:** Миттєве порівняння комісій банків
**Спринт:** 2 · Тривалість: 2 дні

---

### TASK-016 · Bank Rates Data [BE][DB] · P0
**Опис:** База тарифів банків та API для отримання

**Acceptance Criteria:**
- [ ] `bank_rates` таблиця заповнена для 8 банків
- [ ] Операції: p2p, cash_withdrawal, iban, international
- [ ] `GET /api/rates?operation=p2p` → масив банків з тарифами
- [ ] Кешування відповіді: 1 година
- [ ] Адмін-ендпоінт для оновлення тарифів (захищений API ключем)

**Банки для MVP:** monobank, ПриватБанк, Sense Bank, А-Банк,
Укргазбанк, Ощадбанк, Райффайзен, ПУМБ

---

### TASK-017 · Scanner UI [FE] · P0
**Опис:** Екран порівняння комісій

**Acceptance Criteria:**
- [ ] `views/Scanner.vue`
- [ ] Input суми з форматуванням (1 000 ₴, 5 000 ₴...)
- [ ] Вибір операції: переказ / зняття / IBAN
- [ ] Live сортований список банків по вартості комісії
- [ ] Winner badge для найдешевшого
- [ ] Колір суми: зелений (0) / amber (<50) / червоний (>50)
- [ ] Примітка з умовами (напр. "до 5 000 ₴/міс")

---

## EPIC 6 — SURVIVAL MODE
**Мета:** Режим кризи — 3 дії, без зайвого
**Спринт:** 2 · Тривалість: 1 день

---

### TASK-018 · Survival Mode UI [FE] · P0
**Опис:** Мінімалістичний екран з конкретними діями

**Acceptance Criteria:**
- [ ] `views/Survival.vue`
- [ ] 4 задачі з чекбоксами
- [ ] Tap → toggle done/undone з анімацією
- [ ] Стан зберігається в localStorage (скидається щодня)
- [ ] Прогрес бар зверху (0/4 → 4/4)
- [ ] При 4/4 → мотиваційне повідомлення від AI

---

### TASK-019 · AI-Generated Survival Tasks [BE][AI] · P1
**Опис:** AI генерує персональні задачі на основі профілю

**Acceptance Criteria:**
- [ ] `POST /api/survival` з userContext → 4 конкретні задачі
- [ ] Задачі специфічні для ситуації (борг vs бюджет vs ФОП)
- [ ] Кожна задача: title, description, saving (₴), tag
- [ ] Fallback на статичні задачі якщо AI недоступний
- [ ] Кешування на 24 години для одного користувача

---

## EPIC 7 — FINANCIAL HEALTH SCORE
**Мета:** Один показник 0–100 замість складних графіків
**Спринт:** 2 · Тривалість: 2 дні

---

### TASK-020 · Health Score Algorithm [BE] · P1
**Опис:** Алгоритм підрахунку фінансового здоров'я

**Acceptance Criteria:**
- [ ] `lib/healthScore.js` — функція `calcHealth(userProfile)`
- [ ] Фактори та вага:
  - Борг після пільгового: -30 балів
  - Відношення боргу до доходу: до -20 балів
  - Наявність подушки (1–3 міс витрат): +20 балів
  - Позитивний cashflow: +15 балів
  - Активне використання кешбеку: +10 балів
  - Своєчасні платежі: +15 балів
  - Зайві підписки: до -10 балів
- [ ] Результат: 0–100, label, колір, 3 дії для покращення
- [ ] Unit тести

---

### TASK-021 · Health Score UI [FE] · P1
**Опис:** Візуалізація показника здоров'я

**Acceptance Criteria:**
- [ ] `components/HealthScore.vue`
- [ ] Велика цифра з кольором (червоний/amber/зелений)
- [ ] Градієнтний прогрес-бар
- [ ] 4 картки: 2 знижують / 2 піднімуть
- [ ] Анімація при першому завантаженні (0 → score за 1с)
- [ ] Tap на карту → відкриває Chat з контекстом

---

## EPIC 8 — TELEGRAM INTEGRATION
**Мета:** Бот + Mini App — другий канал дистрибуції
**Спринт:** 2–3 · Тривалість: 3 дні

---

### TASK-022 · Telegram Bot Setup [TG][BE] · P0
**Опис:** Запустити бота з основними командами

**Acceptance Criteria:**
- [ ] Зареєстровано @bankir_ai_bot у @BotFather
- [ ] `/start` → привітання + кнопка відкрити Mini App
- [ ] `/help` → список можливостей
- [ ] Inline кнопки з WebApp URL
- [ ] Бот задеплоєний на Railway (той самий сервер)

---

### TASK-023 · Telegram Auth [BE] · P0
**Опис:** Верифікація користувача через Telegram initData

**Acceptance Criteria:**
- [ ] `POST /api/auth/telegram` → верифікація HMAC-SHA256
- [ ] При успіху: створення/оновлення user в БД
- [ ] JWT токен у відповіді (httpOnly cookie або header)
- [ ] `telegram_id` зберігається в users таблиці
- [ ] Middleware `requireAuth` для захищених роутів

---

### TASK-024 · Mini App Integration [FE][TG] · P1
**Опис:** Адаптація Vue app для Telegram Mini App

**Acceptance Criteria:**
- [ ] `<script src="https://telegram.org/js/telegram-web-app.js">` в index.html
- [ ] `composables/useTelegram.js` адаптовано під Vue 3
- [ ] `tg.ready()` + `tg.expand()` при запуску
- [ ] MainButton для primary CTA
- [ ] BackButton для навігації назад
- [ ] Тема Telegram (colorScheme) врахована
- [ ] Автологін через initData

---

### TASK-025 · Push Notifications [BE][FE] · P1
**Опис:** Web Push через VAPID + Telegram алерти

**Acceptance Criteria:**
- [ ] VAPID ключі згенеровано, додано в ENV
- [ ] `POST /api/push/subscribe` зберігає підписку в БД
- [ ] `POST /api/push/send` відправляє повідомлення
- [ ] Типи алертів: тариф змінився, нагадування платежу, тижневий підсумок
- [ ] Паралельно: `sendAlert(telegramId, message)` через бота
- [ ] Користувач може вимкнути в налаштуваннях

---

## EPIC 9 — MONETIZATION
**Мета:** Підписка 99 ₴/міс + Free tier
**Спринт:** 3 · Тривалість: 3 дні

---

### TASK-026 · Subscription Logic [BE][DB] · P1
**Опис:** Система підписок і лімітів

**Acceptance Criteria:**
- [ ] Таблиця `subscriptions` (user_id, plan, status, expires_at)
- [ ] Free tier: 20 повідомлень/міс, 1 борг, базовий сканер
- [ ] Pro tier: все без обмежень
- [ ] Middleware `checkSubscription` — лічильник повідомлень
- [ ] 7 днів Pro тріал для нових користувачів (автоматично)
- [ ] `GET /api/subscription/status` → план, ліміти, дата закінчення

---

### TASK-027 · LiqPay Integration [BE] · P1
**Опис:** Платіжний шлюз для України

**Acceptance Criteria:**
- [ ] LiqPay merchant акаунт підключено
- [ ] `POST /api/payment/create` → LiqPay форма/URL
- [ ] Webhook `POST /api/payment/callback` — оновлення підписки
- [ ] HMAC верифікація webhook
- [ ] Відправка підтвердження (через Telegram бота)
- [ ] Автоматичне продовження (recurring якщо підтримується)

---

### TASK-028 · Paywall UI [FE] · P1
**Опис:** Екран обмеження + апгрейд

**Acceptance Criteria:**
- [ ] `components/Paywall.vue` — з'являється при вичерпанні ліміту
- [ ] Показує: що вичерпано, що дає Pro
- [ ] Кнопка → LiqPay оплата
- [ ] Після успішної оплати — миттєве розблокування без перезавантаження
- [ ] "Спробувати 7 днів безкоштовно" — якщо тріал не використано

---

## EPIC 10 — UX FOR 55+
**Мета:** Продукт доступний для старшого покоління
**Спринт:** 3 · Тривалість: 2 дні

---

### TASK-029 · Age Detection & Adaptation [FE][AI] · P2
**Опис:** Автоматична адаптація під вік користувача

**Acceptance Criteria:**
- [ ] Питання про вік під час онбордингу (опційно, не обов'язково)
- [ ] Або AI визначає за стилем спілкування (1–2 повідомлення)
- [ ] `ageGroup` зберігається в store: `young | mid | senior`
- [ ] `senior` → збільшений шрифт (+2px), більші кнопки
- [ ] System prompt адаптується для `senior`

---

### TASK-030 · Voice Input [FE] · P2
**Опис:** Голосовий ввід для старшого покоління

**Acceptance Criteria:**
- [ ] Кнопка мікрофону поряд з полем вводу
- [ ] Web Speech API (`webkitSpeechRecognition`) для запису
- [ ] Мова розпізнавання: `uk-UA`
- [ ] Транскрипт вставляється в поле вводу
- [ ] Fallback: кнопка прихована якщо API недоступний
- [ ] Індикатор запису (анімований мікрофон)

---

## EPIC 11 — VIRAL MECHANICS
**Мета:** Органічне зростання через шеринг
**Спринт:** 3 · Тривалість: 2 дні

---

### TASK-031 · Share Result [FE] · P1
**Опис:** Генерація картинки з результатом для Stories/Telegram

**Acceptance Criteria:**
- [ ] `components/ShareResult.vue` адаптовано з `ShareResult.jsx`
- [ ] Canvas генерує картинку 1080x1080
- [ ] Дані: сума економії, місяць, топ-банк
- [ ] Web Share API для мобільних
- [ ] Telegram switchInlineQuery для Mini App
- [ ] Fallback: скачати картинку
- [ ] Haptic feedback при натисканні (Telegram)

---

## SPRINT PLAN

### Sprint 1 (Дні 1–10) — Foundation + Chat
```
TASK-001  Ініціалізація Frontend
TASK-002  Ініціалізація Backend
TASK-003  Supabase Setup
TASK-004  CI/CD Pipeline
TASK-005  PWA Configuration
TASK-006  Onboarding Screen
TASK-007  Pinia User Store
TASK-008  Chat API Endpoint
TASK-009  System Prompt Engine
TASK-010  useChat Composable
TASK-011  Chat UI Component
TASK-012  Quick Replies
```
**Результат:** Живий чат з Claude на продакшн домені

---

### Sprint 2 (Дні 11–20) — Tools + Telegram
```
TASK-013  Chat Widget System
TASK-014  Debt Calculator Logic
TASK-015  Debt Destroyer UI
TASK-016  Bank Rates Data
TASK-017  Scanner UI
TASK-018  Survival Mode UI
TASK-019  AI Survival Tasks
TASK-020  Health Score Algorithm
TASK-021  Health Score UI
TASK-022  Telegram Bot Setup
TASK-023  Telegram Auth
```
**Результат:** Повний MVP з усіма інструментами + Telegram бот

---

### Sprint 3 (Дні 21–30) — Polish + Launch
```
TASK-024  Mini App Integration
TASK-025  Push Notifications
TASK-026  Subscription Logic
TASK-027  LiqPay Integration
TASK-028  Paywall UI
TASK-029  Age Detection
TASK-030  Voice Input
TASK-031  Share Result
```
**Результат:** Монетизований продукт готовий до публічного запуску

---

## DEFINITION OF DONE (загальний)

Кожна задача вважається виконаною якщо:

- [ ] Код написано і пройшло code review
- [ ] Немає консольних помилок у браузері
- [ ] Перевірено на мобільному пристрої (iOS + Android)
- [ ] Edge cases оброблені (немає мережі, порожні дані)
- [ ] Зміни задеплоєні на staging/preview
- [ ] PM підтвердив acceptance criteria

---

## ENV VARIABLES CHECKLIST

```bash
# Frontend (Vercel)
VITE_API_URL=                    # Railway backend URL

# Backend (Railway)
ANTHROPIC_API_KEY=               # Claude API
DATABASE_URL=                    # Supabase PostgreSQL
TELEGRAM_BOT_TOKEN=              # @bankir_ai_bot
VAPID_PUBLIC_KEY=                # Web Push
VAPID_PRIVATE_KEY=               # Web Push
LIQPAY_PUBLIC_KEY=               # Платежі
LIQPAY_PRIVATE_KEY=              # Платежі
JWT_SECRET=                      # Auth токени
ADMIN_API_KEY=                   # Оновлення тарифів
```

---

**Документ створено:** Травень 2026
**Всього тасок:** 31
**Спринтів:** 3 (30 днів)
**Результат Sprint 1:** Живий продукт
**Результат Sprint 3:** Монетизований MVP на ринку
