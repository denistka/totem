# 🎮 TOTEM 4: GAMIFICATION & RATING LIFECYCLE

> **Соответствует:** `4.png` — Gamification of Music Ratings in P2P Music Streaming

---

## Уровень: Game Design / Retention / Long-term Economy

Эта диаграмма отвечает на вопрос:
> **«Как сделать, чтобы контент сам себя фильтровал без модераторов?»**

---

## Главная идея

**Музыка живёт как игровой объект с жизненным циклом**, а не как "залил и забыл".

```
Популярность = НАГРАДА
Непопулярность = СВОБОДА ДОСТУПА (не наказание!)
```

---

## Track Lifecycle (State Machine)

```
┌─────────────────────────────────────────────────────────────────┐
│                     TRACK LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │   NEW    │ ◀── Только что загружен
    └────┬─────┘
         │ набирает популярность
         ▼
    ┌──────────┐
    │   PAID   │ ◀── Высокий рейтинг, платный доступ
    └────┬─────┘
         │ интерес падает
         ▼
    ┌──────────┐
    │   FREE   │ ◀── Низкий рейтинг, бесплатный доступ
    └────┬─────┘
         │                    │
         │ интерес возвращается    │ остаётся непопулярным
         ▼                    ▼
    ┌──────────┐         ┌──────────┐
    │ REVIVAL  │         │ ARCHIVE  │ ◀── Забыт, минимальное хранение
    └──────────┘         └──────────┘
         │
         │ снова популярен
         ▼
    ┌──────────┐
    │   PAID   │ ◀── Возврат к монетизации
    └──────────┘
```

---

## Engagement Actions

### Что влияет на рейтинг

| Действие | Очки |
|----------|------|
| **Upvote** | +1 to +3 |
| **Organic Rating Boost** | Variable |
| **Share With Friends** | +2 |
| **Drive Traffic via P2P** | +1 |
| **Like & Favorite** | +1 |
| **Earn Boost Points** | Multiplier |

### Rating Points Formula

```
TOTAL_SCORE = (
    engagement_actions × (1 to 3 points)
  + p2p_track_seeding × 1 point
  + listening_downloads × 2 points
  + reshared_by_others × 3 points
) × multipliers
```

---

## Trending Tracks System

```
┌─────────────────────────────────────────────────────────┐
│                  TRENDING CHART                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 🏆 Top Track      ████████████████████  Gold       │
│  2.    Track #2       ██████████████████               │
│  3.    Track #3       ████████████████                 │
│  4.    Track #4       ██████████████                   │
│  5.    Track #5       ████████████                     │
│  6.    Track #6       ██████████                       │
│  7.    Track #7       ████████                         │
│  8.    Low-Rated      ████████  → Moved to FREE        │
│  9.    Low-Rated      ██████    → Moved to FREE        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Rewards & Bonuses

### Top-Ranking Tracks (Top 10%)

| Reward | Описание |
|--------|----------|
| 🥇 **Gold Bonuses** | Дополнительный доход |
| 📈 **x3 Royalties Boost** | Тройные выплаты |
| 💰 **Tips Bonus Multiplier** | Увеличенные чаевые |
| 🏠 **Home Page Promotions** | Показ на главной |

### Mid-Tier Tracks (Top 50%)

| Reward | Описание |
|--------|----------|
| 🥈 **Gold Bonuses** (меньше) | Бонусный доход |
| 📈 **x1.5 Royalties Boost** | Полуторные выплаты |
| 💰 **Tips Bonus** | Стандартный бонус |

---

## Rank Decay System

```
┌─────────────────────────────────────────────────────────┐
│                   RANK DECAY                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⚠️  Low User Engagement                               │
│  👎  Too Many Downvotes                                 │
│  🔓  Pushed to FREE access                             │
│  🗑️  Auto-Deleted if Rank Stays Low (optional)         │
│                                                         │
│  💀  RuleStays: Free votes prevent deletion            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Badges & Achievements

### Artist Badges

| Badge | Requirement | Reward |
|-------|-------------|--------|
| 🌟 **Dowaards** | $100 earned | Recognition |
| ❤️ **Fan Favorite** | 1500 likes | $1,000 Boost |
| 🔥 **Viral Hit** | 10K plays in 24h | $250 Bonus Tips |
| 👑 **Superstar Song** | Top 1% | $1,000 + 50% Reward |

### Listener Badges

| Badge | Requirement | Reward |
|-------|-------------|--------|
| 🎧 **Active Listener** | 100 hours | Tokens |
| 🌱 **Super Seeder** | 1TB shared | P2P bonus |
| 🔍 **Discoverer** | First to upvote viral track | Recognition |

---

## Self-Filtering Content

### Как это работает без модераторов

1. **Community voting** — пользователи голосуют
2. **Engagement metrics** — объективные данные
3. **Economic incentives** — нет смысла накручивать
4. **Organic decay** — неактуальный контент уходит сам

### Защита от манипуляций

- **Sybil resistance** — wallet-based identity
- **Stake-based voting** — голоса с весом
- **Time-decay** — старые голоса теряют вес
- **Anomaly detection** — ML для обнаружения ботов

---

## Ключевые принципы геймификации

1. **Popularity = Reward** — популярный контент получает бонусы
2. **Unpopularity = Freedom** — непопулярный становится бесплатным
3. **Participation = Earnings** — активность вознаграждается
4. **Self-regulation** — сообщество само фильтрует контент

---

*Последнее обновление: January 2026*
