const CACHE_NAME = "istiqamah-v2.0.0";
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== QURAN_CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;

  if (url.includes("api.alquran.cloud")) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(QURAN_CACHE).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(e.request).then(
            (cached) => cached || new Response("", { status: 503 }),
          ),
        ),
    );
    return;
  }

  if (
    url.includes("api.aladhan.com") ||
    url.includes("nominatim.openstreetmap.org") ||
    url.includes("cdn.mualim.app")
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
            (cached) => cached || new Response("", { status: 503 }),
          ),
        ),
    );
    return;
  }

  if (
    url.includes("cdnjs.cloudflare.com") ||
    url.includes("fonts.googleapis.com") ||
    url.includes("fonts.gstatic.com")
  ) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        return cached || fetch(e.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        }).catch(() => new Response("", { status: 408 }));
      }),
    );
    return;
  }

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match(e.request) || caches.match(`${BASE}/offline.html`);
      }),
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).catch(() => new Response("", { status: 408 }));
    }),
  );
});
