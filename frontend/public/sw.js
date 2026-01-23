self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("store-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html"
      ]);
    })
  );
});
