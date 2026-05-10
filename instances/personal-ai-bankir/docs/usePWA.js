// usePWA.js — хук для керування PWA установкою та push-сповіщеннями
import { useState, useEffect } from 'react';

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Перевіряємо iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Перевіряємо чи вже встановлено
    const installed =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(installed);

    // Слухаємо подію beforeinstallprompt (Android/Desktop Chrome)
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Реєструємо Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[PWA] SW зареєстровано:', reg.scope))
        .catch((err) => console.error('[PWA] SW помилка:', err));
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Запит на встановлення (Android)
  const triggerInstall = async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
      return true;
    }
    return false;
  };

  // Підписка на push-сповіщення
  const enablePush = async () => {
    if (!('Notification' in window)) return false;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY
        ),
      });

      // Відправляємо підписку на сервер
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      setPushEnabled(true);
      return true;
    } catch (err) {
      console.error('[PWA] Push помилка:', err);
      return false;
    }
  };

  return { installPrompt, isInstalled, isIOS, pushEnabled, triggerInstall, enablePush };
}

// ── Utility ──────────────────────────────────────────
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}


// ══════════════════════════════════════════════════════
// InstallBanner.jsx — банер "Встановити на телефон"
// ══════════════════════════════════════════════════════
import React from 'react';

export function InstallBanner() {
  const { installPrompt, isInstalled, isIOS, triggerInstall } = usePWA();
  const [dismissed, setDismissed] = React.useState(
    localStorage.getItem('pwa-banner-dismissed') === 'true'
  );

  if (isInstalled || dismissed) return null;
  if (!installPrompt && !isIOS) return null;

  const dismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div style={styles.banner}>
      <div style={styles.icon}>💚</div>
      <div style={styles.text}>
        <strong style={styles.title}>Встанови Банкір</strong>
        <span style={styles.sub}>
          {isIOS
            ? 'Натисни Поділитись → «На екран "Домівки"»'
            : 'Додай на робочий стіл — як справжній додаток'}
        </span>
      </div>
      <div style={styles.actions}>
        {!isIOS && (
          <button style={styles.btnInstall} onClick={triggerInstall}>
            Встановити
          </button>
        )}
        <button style={styles.btnDismiss} onClick={dismiss}>✕</button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999,
    background: '#162019', border: '1px solid #2eff7a',
    borderRadius: 16, padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
    boxShadow: '0 8px 32px rgba(46,255,122,0.15)',
    animation: 'slideUp 0.4s ease',
  },
  icon: { fontSize: 28, flexShrink: 0 },
  text: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  title: { color: '#e8f0ea', fontSize: 14, fontWeight: 700 },
  sub: { color: '#6b8a72', fontSize: 12, lineHeight: 1.4 },
  actions: { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  btnInstall: {
    background: '#2eff7a', color: '#0a0f0d',
    border: 'none', borderRadius: 8,
    padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
  },
  btnDismiss: {
    background: 'transparent', color: '#6b8a72',
    border: '1px solid #1e3024', borderRadius: 8,
    padding: '8px 10px', fontSize: 12, cursor: 'pointer',
  },
};
