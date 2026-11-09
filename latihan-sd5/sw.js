const C = "sd5-v2", F = ["./", "index.html", "manifest.json", "icon.svg", "js/core.js", "js/mtk.js", "js/bind.js", "js/bing.js", "js/ipa.js", "js/materi.js", "js/app.js"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(F))));
self.addEventListener("fetch", (e) => e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))));
