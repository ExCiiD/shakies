// Service worker : toujours la dernière version en ligne, et l'app marche hors-ligne une fois ouverte une première fois.
const CACHE = "shakies-v13";
const ASSETS = ["./", "./index.html", "./chefskiss.js", "./chefskiss-data.js", "./chefskiss-photos.js", "./shakies-data2.js", "./chefskiss-data2.js", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord. Pour les fichiers de l'app, on revalide toujours auprès du serveur (pas de cache HTTP périmé),
// les photos peuvent venir du cache du navigateur. Hors-ligne : copie en cache.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const appFile = url.origin === self.location.origin && !url.pathname.includes("/photos/");
  const req = appFile ? new Request(e.request, {cache: "no-cache"}) : e.request;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
