const CACHE_NAME = "shrimp-app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/shrimp.1024x852.png",
    "/shrimp.256x213.png",
    "/shrimp.512x426.png",
    "/shrimp.svg",
    "/shrimpConfirmation.html",
    "/shrimpDetected.html",
    "/shrimpDetected.mp3",
    "/shrimpDetected.png",
    "/shrimpDetected2.mp3",
    "/shrimpNotDetected.html",
    "/shrimpNotDetected.opus",
    "/shrimpNotDetected.png",
    "/style.css"
];

self.addEventListener("install", e => e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache).then(self.skipWaiting))
));

self.addEventListener("activate", e => e.waitUntil(
    caches.keys().then(names => Promise.all(
        names.map(n => n !== CACHE_NAME && n.startsWith("shrimp-app-cache") ? caches.delete(n) : null)
    )).then(() => self.clients.claim())
));

self.addEventListener("fetch", e => {
    if (e.request.method !== "GET") return;
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request).then(nr => {
            if (!nr || nr.status !== 200 || nr.type !== "basic") return nr;
            const rc = nr.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, rc));
            return nr;
        }))
    );
});