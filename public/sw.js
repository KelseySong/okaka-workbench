// Service Worker - 哦卡卡的工作台 PWA v8
const CACHE_NAME = 'okaka-workbench-v8';
const ASSETS = [
  './',
  './index.html',
  './redirect.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon.ico'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {
        return cache.addAll(['./', './index.html']);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          // Delete ALL old caches (v1, v2, anything else)
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // External domains (douyin, xiaohongshu, etc.) - do NOT intercept, let browser handle normally
  if (url.hostname !== self.location.hostname &&
      !url.hostname.includes('localhost') &&
      !url.hostname.includes('127.0.0.1')) {
    return;
  }

  // AI API calls - always network, never cache
  if (event.request.url.includes('/v1/chat/completions') ||
      event.request.url.includes('/api/chat') ||
      event.request.url.includes('/api/health') ||
      url.hostname.includes('openai') ||
      url.hostname.includes('deepseek') ||
      url.hostname.includes('minimaxi')) {
    return;
  }

  // Everything else (same-origin) - NETWORK FIRST, cache fallback
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(event.request).then(cached => {
        return cached || caches.match('./index.html');
      });
    })
  );
});
