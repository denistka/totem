# Банкір.ai — Vue 3 структура проекту

## Ініціалізація

```bash
npm create vite@latest bankir-ai -- --template vue
cd bankir-ai
npm install
npm install vite-plugin-pwa @vueuse/core axios
```

## Структура

```
bankir-ai/
├── public/
│   ├── manifest.json        ✅ готово
│   ├── sw.js                ✅ готово
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── src/
│   ├── views/
│   │   ├── Onboarding.vue
│   │   ├── Chat.vue
│   │   ├── Tools.vue
│   │   ├── Survival.vue
│   │   ├── DebtDestroyer.vue
│   │   └── Scanner.vue
│   │
│   ├── composables/
│   │   ├── useChat.js       # Claude API + history
│   │   ├── usePWA.js        ✅ готово (адаптувати)
│   │   ├── useTelegram.js   ✅ готово (адаптувати)
│   │   └── useHealth.js     # алгоритм 0-100
│   │
│   ├── stores/
│   │   └── user.js          # Pinia: сценарій, борг, профіль
│   │
│   ├── lib/
│   │   ├── bankRates.js     # тарифи банків (JSON)
│   │   ├── systemPrompt.js  # характер Банкіра
│   │   └── debtCalc.js      # розрахунок боргу
│   │
│   ├── App.vue
│   └── main.js
│
├── server/                  # окремий репо або monorepo
│   ├── routes/
│   │   ├── chat.js          # POST /api/chat → Claude
│   │   ├── auth.js          # Telegram verifyInitData
│   │   └── rates.js         # GET /api/rates
│   ├── lib/
│   │   ├── claude.js
│   │   └── systemPrompt.js
│   └── index.js
│
├── vercel.json              ✅ готово
└── vite.config.js
```

## vite.config.js з PWA

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // використовуємо свій public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
        }]
      }
    })
  ]
})
```

## useChat.js — головний composable

```js
import { ref } from 'vue'
import { SYSTEM_PROMPT } from '../lib/systemPrompt'

export function useChat() {
  const messages = ref([])
  const loading = ref(false)
  const history = ref([])

  async function send(text, isSystem = false) {
    if (loading.value) return
    loading.value = true

    if (!isSystem) {
      messages.value.push({ role: 'user', text })
    }

    history.value.push({ role: 'user', content: text })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.value })
      })
      const { reply } = await res.json()

      history.value.push({ role: 'assistant', content: reply })
      messages.value.push({ role: 'assistant', text: reply })
    } catch (e) {
      messages.value.push({ role: 'assistant', text: 'Немає з\'єднання.' })
    }

    loading.value = false
  }

  function clear() {
    messages.value = []
    history.value = []
  }

  return { messages, loading, send, clear }
}
```

## server/routes/chat.js

```js
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '../lib/systemPrompt.js'

const client = new Anthropic()

export async function chatHandler(req, res) {
  const { messages, userContext } = req.body

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: buildSystemPrompt(userContext),
    messages
  })

  res.json({ reply: response.content[0].text })
}
```

## ENV

```bash
# .env (frontend)
VITE_API_URL=http://localhost:3000

# .env (backend)
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=...
DATABASE_URL=postgresql://...
```

## Pinia store (user.js)

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    scenario: null,      // debt | budget | fop | goal | general
    debt: null,          // { bank, amount, rate }
    healthScore: 34,
    survivalDone: [],
  }),
  actions: {
    setScenario(s) { this.scenario = s },
    updateHealth(score) { this.healthScore = score },
  }
})
```

## Deploy

```bash
# Frontend → Vercel
vercel --prod

# Backend → Railway
railway up

# Telegram бот → Railway (той самий сервер)
```

## Готові файли які переносимо

| Файл | Куди |
|---|---|
| bankir-vue-mvp.html | розбити на .vue компоненти |
| manifest.json | public/ |
| sw.js | public/ |
| vercel.json | корінь проекту |
| telegram.js | server/lib/ |
| ShareResult.vue | src/components/ |
