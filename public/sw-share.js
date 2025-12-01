// sw-share.js - 공유 페이지용 Service Worker
// v2 - 오프라인 지원 및 캐싱

const CACHE_NAME = 'share-cache-v2';

self.addEventListener('install', event => {
  console.log('[SW-Share] v2 설치됨');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW-Share] v2 활성화됨');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 공유 페이지 (/s/*) - Cache First 전략
  if (url.pathname.startsWith('/s/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cached => {
          if (cached) return cached;
          
          return fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }
  
  // 기타 요청은 네트워크 우선
  event.respondWith(fetch(event.request));
});
