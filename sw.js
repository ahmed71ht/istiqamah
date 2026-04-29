const CACHE_NAME = "istiqamah-v1.0.0";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/azkar.html",
  "/quran.html",
  "/hadith.html",
  "/manifest.json",
  "/icons/icon-72.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-144.png",
  "/icons/icon-152.png",
  "/icons/icon-192.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      return cache.addAll(urlsToCache);
    }),
  );
});

// جلب الملفات من الكاش أو من الشبكة
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا وجد في الكاش، أرجع منه
      if (response) {
        return response;
      }
      // وإلا، أجلب من الشبكة
      return fetch(event.request);
    }),
  );
});

// تحديث الكاش عند تفعيل Service Worker جديد
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
