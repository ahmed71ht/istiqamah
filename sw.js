const CACHE_NAME = "istiqamah-v1.0.0";
const BASE = "/istiqamah"; // اسم المستودع

const urlsToCache = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/about.html`,
  `${BASE}/azkar.html`,
  `${BASE}/quran.html`,
  `${BASE}/hadith.html`,
  `${BASE}/offline.html`,
  `${BASE}/manifest.json`,
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
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    // network-first للصفحات
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match(e.request) || caches.match(`${BASE}/offline.html`);
      }),
    );
  } else {
    // cache-first للأصول الثابتة
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request)),
    );
  }
});
