// Chess Forge service worker.
// - App shell + engine files: network-first, cached copy used when offline.
// - Puzzle batches (Data/puzzles-batch-*.json, ~1.2 MB each, 118 files) are NOT cached here:
//   the app stores them in IndexedDB, so caching them again would double the storage use.
// - Anything under /api/ is never touched.
const CACHE = 'chess-forge-player-v5';

const FILES = [
  './',
  './index.html',
  './player.html',
  './puzzles-pack.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './Data/catalog.json',
  './stockfish/stockfish-19-lite-single.js',
  './stockfish/stockfish-19-lite-single.wasm'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.allSettled(FILES.map(f => cache.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return;
  if (/\/Data\/puzzles-batch-\d+\.json$/.test(url.pathname)) return; // let the browser fetch it directly
  if (request.headers.has('range')) return;                          // never cache partial responses

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response && response.status === 200) cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch (error) {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      return new Response('File could not be loaded. Check your internet connection and file path.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
