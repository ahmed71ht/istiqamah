const CACHE_NAME = "istiqamah-v2.1.0";
const QURAN_CACHE = "quran-text-v1";
const BASE = self.location.pathname.replace(/\/sw\.js$/, '') || '';

const urlsToCache = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/about.html`,
  `${BASE}/azkar.html`,
  `${BASE}/quran.html`,
  `${BASE}/hadith.html`,
  `${BASE}/prayertime.html`,
  `${BASE}/qipla-direction.html`,
  `${BASE}/offline.html`,
  `${BASE}/manifest.json`,
  `${BASE}/azkar.json`,
  `${BASE}/muslim.json`,
  `${BASE}/assets/css/styles.css`,
  `${BASE}/icons/icon-72.png`,
  `${BASE}/icons/icon-96.png`,
  `${BASE}/icons/icon-128.png`,
  `${BASE}/icons/icon-144.png`,
  `${BASE}/icons/icon-152.png`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-384.png`,
  `${BASE}/icons/icon-512.png`,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) =>
          cache.add(url).catch(() => {/* skip failed */})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== QURAN_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Exclude non-GET and browser extension requests
  if (e.request.method !== "GET") return;
  if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") return;

  // API: network-first, fallback to cache
  if (
    url.hostname === "api.alquran.cloud" ||
    url.hostname === "api.aladhan.com" ||
    url.hostname === "nominatim.openstreetmap.org" ||
    url.hostname === "cdn.mualim.app"
  ) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(QURAN_CACHE).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(e.request).then(
            (cached) => cached || new Response(JSON.stringify({ error: "offline" }), { status: 503, headers: { "Content-Type": "application/json" } })
          )
        )
    );
    return;
  }

  // CDN fonts/icons: cache-first
  if (
    url.hostname === "cdnjs.cloudflare.com" ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        return cached || fetch(e.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        }).catch(() => new Response("", { status: 408 }));
      })
    );
    return;
  }

  // Navigation requests
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match(e.request).then((cached) => {
          if (cached) return cached;
          // Try index.html variant for root path
          if (url.pathname === BASE + "/" || url.pathname === BASE) {
            return caches.match(BASE + "/index.html");
          }
          return caches.match(BASE + "/offline.html");
        });
      })
    );
    return;
  }

  // Static assets: cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).catch(() => new Response("", { status: 408 }));
    })
  );
});
