
const CACHE = 'chess-forge-player-v4-rebuild-4';

const FILES = [
  './',
  './index.html',
  './player.html',
  './puzzles-pack.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './Data/catalog.json',
  './stockfish/engine.js',
  './stockfish/stockfish-19-lite-single.js',
  './stockfish/stockfish-19-lite-single.wasm'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    try {
      const isCatalog = url.pathname.endsWith('/Data/catalog.json');

      const response = await fetch(
        request,
        isCatalog ? { cache: 'no-store' } : { cache: 'no-cache' }
      );

      if (response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }

      return response;
    } catch (error) {
      const cached = await cache.match(request);

      if (cached) return cached;

      return new Response(
        'File could not be loaded. Check your internet connection and file path.',
        {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }
      );
    }
  })());
});
