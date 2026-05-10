// telegram.js — Інтеграція Telegram Mini App для Банкір

// ══════════════════════════════════════════════════════
// 1. ПІДКЛЮЧЕННЯ В index.html
// ══════════════════════════════════════════════════════
// <script src="https://telegram.org/js/telegram-web-app.js"></script>

// ══════════════════════════════════════════════════════
// 2. ХУКИ ДЛЯ REACT
// ══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const [user, setUser] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (!tg) return;

    setIsTelegram(true);
    tg.ready();                        // Повідомляємо Telegram що готові
    tg.expand();                       // Розгортаємо на весь екран
    tg.enableClosingConfirmation();    // "Ви впевнені що хочете закрити?"

    // Дані користувача — вже авторизований через Telegram!
    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }

    // Адаптуємо кольори під тему Telegram
    const colorScheme = tg.colorScheme; // 'light' | 'dark'
    setTheme(colorScheme);

    // Налаштовуємо кнопки
    tg.BackButton.onClick(() => window.history.back());

  }, []);

  // Головна кнопка (внизу екрану)
  const showMainButton = (text, onClick) => {
    if (!tg) return;
    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
    tg.MainButton.setParams({
      color: '#2eff7a',
      text_color: '#0a0f0d',
    });
  };

  const hideMainButton = () => tg?.MainButton.hide();

  // Поділитись результатом
  const shareResult = (text) => {
    if (!tg) {
      // Фолбек для браузера
      navigator.share?.({ text }) ?? navigator.clipboard.writeText(text);
      return;
    }
    tg.switchInlineQuery(text, ['users', 'groups', 'channels']);
  };

  // Закрити міні-апп
  const close = () => tg?.close();

  // Тактильний відгук
  const haptic = (type = 'light') => {
    tg?.HapticFeedback.impactOccurred(type); // light | medium | heavy
  };

  return { user, isTelegram, theme, showMainButton, hideMainButton, shareResult, close, haptic };
}


// ══════════════════════════════════════════════════════
// 3. TELEGRAM BOT — Node.js бекенд (telegraf)
// npm install telegraf
// ══════════════════════════════════════════════════════

// bot.js
import { Telegraf, Markup } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const APP_URL = process.env.APP_URL; // https://bankir.ai

// /start — привітання з кнопкою відкрити аппп
bot.start(async (ctx) => {
  const name = ctx.from.first_name;
  await ctx.reply(
    `Привіт, ${name}! 👋\n\n` +
    `Я — Банкір, твій чесний AI-фінансист.\n\n` +
    `🔍 Аналізую твої витрати по всіх банках\n` +
    `💸 Знаходжу де ти переплачуєш комісії\n` +
    `📊 Кажу яку карту використовувати де\n\n` +
    `Середня економія моїх користувачів — *2 340 ₴/міс* 💚`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('📊 Відкрити Банкір', APP_URL)],
        [Markup.button.callback('❓ Як це працює', 'how_it_works')],
      ]),
    }
  );
});

// Пояснення як працює
bot.action('how_it_works', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '1️⃣ Завантажуєш виписку з банку (CSV або PDF)\n' +
    '2️⃣ AI аналізує твої реальні витрати\n' +
    '3️⃣ Отримуєш персональний план економії\n\n' +
    'Без доступу до твоїх рахунків. Без паролів. Тільки аналіз. 🔒',
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Спробувати зараз', APP_URL)],
    ])
  );
});

// Push-сповіщення з бота (викликається з API)
export async function sendAlert(telegramId, message) {
  await bot.telegram.sendMessage(telegramId, message, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('📊 Переглянути', APP_URL + '/dashboard')],
    ]),
  });
}

// Приклади алертів які відправляємо автоматично:
// sendAlert(userId, '💸 monobank змінив тариф на зняття готівки. Перегляньмо твій план!')
// sendAlert(userId, '💚 Цього місяця ти вже заощадив *340 ₴*. Продовжуй в тому ж дусі!')
// sendAlert(userId, '⚡️ А-Банк: акція — зняття готівки без комісії до кінця місяця!')

bot.launch();

// ══════════════════════════════════════════════════════
// 4. ВЕРИФІКАЦІЯ ДАНИХ TELEGRAM (безпека)
// ══════════════════════════════════════════════════════
import crypto from 'crypto';

export function verifyTelegramData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  const expectedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return expectedHash === hash;
}

// Використання в Express:
// app.post('/api/auth/telegram', (req, res) => {
//   if (!verifyTelegramData(req.body.initData)) {
//     return res.status(401).json({ error: 'Невалідні дані Telegram' });
//   }
//   // Користувач авторизований — створюємо сесію
// });
