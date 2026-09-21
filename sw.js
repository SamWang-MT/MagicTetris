/* Tetris PWA Service Worker */
const CACHE_NAME = "tetris-pwa-v1";
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png",
  "./icons/icon-152.png",
  "./res/audio/bgm_1.mp3",
  "./res/audio/bgm_2.mp3",
  "./res/audio/bgm_3.mp3",
  "./res/audio/bgm_4.mp3",
  "./res/audio/move.mp3",
  "./res/audio/rotate.mp3",
  "./res/audio/drop.mp3",
  "./res/audio/clear.mp3",
  "./res/audio/tetris.mp3",
  "./res/audio/win.mp3",
  "./res/audio/gameover.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          // Cache successful same-origin responses
          if (res && res.status === 200 && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);

      // Prefer cache for navigations when offline
      return cached || network;
    }),
  );
});
