const CACHE_NAME = "istiqamah-v1.0.0";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/azkar.html",
  "/quran.html",
  "/hadith.html",
  "/offline.html", // ← أضفنا صفحة وضع عدم الاتصال
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

// التثبيت: تخزين الملفات الأساسية وتفعيل الـ Service Worker الجديد فوراً
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
  self.skipWaiting(); // تفعيل فوري بمجرد التثبيت
});

// التفعيل: تنظيف الكاش القديم والسيطرة على الصفحات المفتوحة
self.addEventListener("activate", (event) => {
  event.waitUntil(
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
  self.clients.claim(); // السيطرة على جميع العملاء بدون انتظار إعادة تحميل
});

// الجلب: استراتيجية مزدوجة (Network-first للصفحات، Cache-first للأصول)
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // التنقل بين الصفحات: الشبكة أولاً، وعند الفشل الرجوع للكاش أو صفحة offline
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request) || caches.match("/offline.html");
      }),
    );
  } else {
    // باقي الأصول (أيقونات، CSS، JS...): الكاش أولاً ثم الشبكة
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      }),
    );
  }
});
