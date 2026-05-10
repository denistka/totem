// sw.js — Service Worker для Банкір PWA
// Кешування + Push-сповіщення

const CACHE_NAME = 'bankir-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/chat',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── INSTALL: кешуємо статику ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Кешування статики...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: чистимо старий кеш ─────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first для статики, network-first для API ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API запити — тільки мережа
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Офлайн режим' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Статика — кеш першим
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Кешуємо нові GET-запити
        if (request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// ── PUSH NOTIFICATIONS ────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const options = {
    body: data.body || 'У тебе нове повідомлення від Банкіра',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/dashboard' },
    actions: [
      { action: 'open', title: '📊 Переглянути' },
      { action: 'dismiss', title: 'Пізніше' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '💚 Банкір', options)
  );
});

// ── NOTIFICATION CLICK ────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Якщо вже відкрито — фокусуємо
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Інакше — нове вікно
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
