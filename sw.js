/* Service worker — makes the site installable and usable offline.
   Pages and data/*.json are network-first (daily news always shows fresh when online);
   images, icons and fonts are served from cache and refreshed in the background.
   Bump VERSION when you change index.html's app shell so every phone updates. */
const VERSION = 'psb-v2';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'data/news.json',
  'data/site.json',
  'assets/img/logo.png',
  'assets/img/logo-160.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('psb-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(request, fallbackUrl) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(VERSION).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() =>
      caches.match(request, { ignoreSearch: true }).then((hit) => hit || (fallbackUrl ? caches.match(fallbackUrl) : undefined))
    );
}

function staleWhileRevalidate(request) {
  return caches.open(VERSION).then((cache) =>
    cache.match(request).then((hit) => {
      const refresh = fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
          return response;
        })
        .catch(() => hit);
      return hit || refresh;
    })
  );
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never cache the content editor.
  if (sameOrigin && url.pathname.includes('/admin/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, 'index.html'));
    return;
  }
  if (sameOrigin && url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (sameOrigin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(request));
  }
});
