# Банкір.ai — План реалізації MVP
**Складено: Травень 2026**

---

## Стек

```
Frontend:  React + Vite + PWA (vite-plugin-pwa)
Backend:   Node.js + Express
AI:        Claude API (claude-sonnet-4-20250514)
DB:        PostgreSQL (Supabase — безкоштовно)
Realtime:  WebSocket (вже є)
Deploy:    Vercel (frontend) + Railway (backend)
Payments:  LiqPay або Stripe
Telegram:  Telegraf + Mini App
```

---

## Структура проекту

```
bankir-ai/
├── client/                    # React PWA
│   ├── public/
│   │   ├── manifest.json      ✅ готово
│   │   ├── sw.js              ✅ готово
│   │   └── icons/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Tools.jsx
│   │   │   ├── DebtDestroyer.jsx
│   │   │   ├── Scanner.jsx
│   │   │   └── Survival.jsx
│   │   ├── hooks/
│   │   │   ├── usePWA.js      ✅ готово
│   │   │   ├── useTelegram.js ✅ готово
│   │   │   └── useChat.js
│   │   ├── components/
│   │   │   ├── InstallBanner.jsx ✅ готово
│   │   │   ├── ShareResult.jsx   ✅ готово
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── Widget.jsx
│   │   ├── lib/
│   │   │   ├── bankRates.js   # тарифи банків
│   │   │   └── healthScore.js # алгоритм 0-100
│   │   └── App.jsx
│   ├── vercel.json            ✅ готово
│   └── vite.config.js
│
├── server/                    # Node.js API
│   ├── routes/
│   │   ├── chat.js            # /api/chat → Claude
│   │   ├── auth.js            # /api/auth/telegram
│   │   ├── push.js            # /api/push/subscribe
│   │   └── rates.js           # /api/rates
│   ├── lib/
│   │   ├── claude.js          # Claude API wrapper
│   │   ├── systemPrompt.js    # характер Банкіра
│   │   └── telegram.js        ✅ готово
│   └── index.js
│
└── bot/                       # Telegram бот
    └── bot.js                 ✅ готово
```

---

## Тиждень 1 — Фундамент

### День 1–2: Проект + PWA
```bash
npm create vite@latest client -- --template react
cd client
npm install vite-plugin-pwa
```
- [ ] Перенести bankir-mvp.html у React компоненти
- [ ] Підключити manifest.json + sw.js
- [ ] InstallBanner + usePWA hook
- [ ] Deploy на Vercel — перевірити PWA score

### День 3–4: Backend + Claude
```bash
mkdir server && cd server
npm init -y
npm install express cors anthropic dotenv
```
- [ ] POST /api/chat → проксі до Claude API
- [ ] System prompt як окремий файл (легко редагувати)
- [ ] Зберігати conversationHistory в сесії
- [ ] CORS + rate limiting

### День 5: База даних
```sql
-- Supabase: створити таблиці
users (id, telegram_id, scenario, created_at)
conversations (id, user_id, messages jsonb, updated_at)
debts (id, user_id, bank, amount, rate, created_at)
bank_rates (bank, operation, rate, updated_at)
```
- [ ] Supabase проект → отримати connection string
- [ ] Підключити до Express
- [ ] Зберігати та відновлювати історію розмов

---

## Тиждень 2 — AI серце

### System Prompt (найважливіший файл)
```javascript
// server/lib/systemPrompt.js
export const buildPrompt = (user) => `
Ти — Банкір, персональний фінансовий друг.

ХАРАКТЕР: чесний, теплий, конкретний, без осуду
МОВА: проста, без жаргону, українська
ФОРМАТ: короткі абзаци, цифри, конкретні дії

КОНТЕКСТ КОРИСТУВАЧА:
- Сценарій: ${user.scenario}
- Борг: ${user.debt || 'не вказано'}
- Банки: ${user.banks || 'не вказано'}

ПРАВИЛА:
- Ніколи не рекламуй банки
- Якщо не знаєш — кажи чесно
- Максимум 3-4 речення, потім питання або дія
`;
```

### Інструменти як функції
- [ ] Debt Destroyer: компонент + хук розрахунку
- [ ] Сканер комісій: JSON тарифів + live update
- [ ] Режим виживання: AI генерує список дій
- [ ] Фінансове здоров'я: алгоритм підрахунку

---

## Тиждень 3 — Telegram

```bash
npm install telegraf
```

- [ ] Зареєструвати @bankir_ai_bot у @BotFather
- [ ] /start з кнопкою відкрити Mini App
- [ ] Верифікація initData (безпека)
- [ ] Push алерти через бота
- [ ] Share результату з канвасу

### Mini App налаштування
```javascript
// У BotFather:
/newapp → вказати URL задеплоєного Vercel сайту
/setmenubutton → "Відкрити Банкір"
```

---

## Тиждень 4 — Монетизація + Запуск

### Підписка
- [ ] LiqPay інтеграція (Україна, просто)
- [ ] Free tier: 20 повідомлень/міс, 1 борг
- [ ] Pro 99 ₴/міс: безліміт, пам'ять, сім'я
- [ ] 7 днів тріал автоматично

### UX для 55+
- [ ] Авто-збільшення шрифту (detectAge з питань)
- [ ] Прості формулювання в промпті для старшої аудиторії
- [ ] Підтвердження кожної дії

### Запуск
- [ ] 5 фінансових Telegram каналів України
- [ ] Особиста історія засновника
- [ ] Мета: 100 користувачів тиждень 1

---

## ENV змінні

```bash
# client/.env
VITE_API_URL=https://your-backend.railway.app
VITE_VAPID_PUBLIC_KEY=...

# server/.env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=...
VAPID_PRIVATE_KEY=...
VAPID_PUBLIC_KEY=...
```

---

## Готові файли (вже зроблено)

| Файл | Статус |
|---|---|
| bankir-mvp.html | ✅ Робочий MVP з Claude |
| bankir-vision.md | ✅ Vision документ |
| manifest.json | ✅ PWA конфіг |
| sw.js | ✅ Service Worker |
| usePWA.js | ✅ React хук + InstallBanner |
| telegram.js | ✅ Бот + Mini App + верифікація |
| ShareResult.jsx | ✅ Вірусна механіка |
| vercel.json | ✅ Deploy конфіг |

---

## Критичний шлях до першого користувача

```
День 1:  Vite проект + компоненти з MVP
День 2:  Backend /api/chat → Claude (API ключ прихований)
День 3:  Deploy Vercel + Railway
День 4:  Telegram бот + Mini App
День 5:  Перший реальний користувач
```

---

## Принципи які не можна порушувати

1. **Чесність понад усе** — ніякої реклами банків
2. **Конкретність** — цифри і дії, не загальні поради  
3. **Простота** — 5 екранів, не більше
4. **Повага до віку** — продукт для всіх
5. **Місія** — фінансова грамотність як право

---

*"Банки заробляють на плутанині.*
*Ми заробляємо на тому що тобі добре."*
