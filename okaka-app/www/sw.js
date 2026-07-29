// Service Worker - 哦卡卡的工作台 PWA
const CACHE_NAME = 'okaka-workbench-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {
        return cache.addAll(['./', './index.html', './manifest.json']);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // AI API calls - always network (don't cache)
  const url = new URL(event.request.url);
  if (event.request.url.includes('/v1/chat/completions') ||
      event.request.url.includes('/api/chat') ||
      url.hostname.includes('openai') ||
      url.hostname.includes('deepseek') ||
      url.hostname.includes('minimaxi')) {
    return; // Let it go to network
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
