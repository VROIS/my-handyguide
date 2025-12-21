// service-worker.js

const CACHE_NAME = 'travel-assistant-cache-v18';
const API_CACHE_NAME = 'travel-assistant-api-cache-v18';
const urlsToCache = [
  // 🔧 2025-12-17: HTML 캐싱 제거 (수정사항 즉시 반영)
  // '/',
  // '/index.html',
  // JS 파일은 캐싱하지 않음 (개발 중 수정 즉시 반영 위해)
  // '/index.js',
  // '/share.html',
  // '/share-page.js',
  // 캐시할 다른 에셋(CSS, 이미지 등)을 추가합니다.
  'https://hangeul.pstatic.net/maruburi/maruburi.css'
];

self.addEventListener('install', event => {
  // 새 버전 설치 시 즉시 활성화 (대기 없이)
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시가 열렸습니다.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Featured Gallery는 항상 최신 데이터 필요 - 캐싱 제외
  if (url.pathname === '/api/share/featured/list') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Share API 요청에 대해 stale-while-revalidate 전략 사용
  if (url.pathname.startsWith('/api/share')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchRequest = event.request.clone();
          
          // 백그라운드에서 네트워크 요청 및 캐시 업데이트
          const fetchPromise = fetch(fetchRequest).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // 네트워크 실패시 적절한 에러 응답 반환
            if (cachedResponse) {
              return cachedResponse;
            }
            // 캐시도 없고 네트워크도 실패한 경우 에러 응답 생성
            return new Response(JSON.stringify({error: "가이드북을 불러올 수 없습니다. 오프라인 상태입니다."}), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
          
          // 캐시된 응답이 있으면 즉시 반환하고 백그라운드에서 업데이트
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // 🔥 공유 페이지 HTML (/s/*) - Cache First 전략으로 오프라인 영구 사용 지원
  // 1회 클릭 시 자동 다운로드되어 오프라인에서도 영구히 사용 가능
  if (url.pathname.startsWith('/s/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            // 캐시 히트 - 즉시 반환 (오프라인 지원)
            return cachedResponse;
          }
          
          // 네트워크에서 가져와서 캐시에 저장
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // 네트워크 실패 시 적절한 에러 응답
            return new Response('오프라인 상태이며 캐시된 데이터가 없습니다.', {
              status: 503,
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
          });
        });
      })
    );
    return;
  }
  
  // /shared/*.html은 캐시하지 않음 (구 시스템)
  if (url.pathname.startsWith('/shared/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // 🔧 2025-12-21: JS 파일은 항상 네트워크에서 가져옴 (PWA 모드 캐시 문제 해결)
  if (url.pathname.endsWith('.js') && !url.pathname.includes('service-worker')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 오프라인 시 캐시 폴백
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // 🔧 2025-12-21: HTML 파일도 항상 네트워크 우선 (PWA 모드에서 최신 버전 로드)
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // 일반 요청에 대한 기본 캐시 전략 (share.html?id=... 를 위해 쿼리 스트링 무시)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: url.pathname === '/share.html' })
      .then(response => {
        // 캐시 히트 - 응답을 반환합니다.
        if (response) {
          return response;
        }

        // 중요: 요청을 복제합니다. 요청은 스트림이며 한 번만 소비될 수 있습니다.
        // 캐시와 브라우저 fetch에서 모두 소비해야 하므로, 복제가 필요합니다.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // 유효한 응답을 받았는지 확인합니다.
            if(!response || response.status !== 200) { // Removed 'basic' type check to allow caching opaque responses if needed, but safer to just avoid caching cross-origin resources without CORS.
              return response;
            }

            // 중요: 응답을 복제합니다. 응답은 스트림이며,
            // 브라우저와 캐시가 모두 응답을 소비해야 하므로 두 개의 스트림을 위해 복제합니다.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  // 새 Service Worker가 활성화되면 즉시 제어권 획득
  event.waitUntil(
    (async () => {
      // 오래된 캐시 삭제
      const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
      
      // 모든 클라이언트에 즉시 적용
      return self.clients.claim();
    })()
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 푸시 알림 이벤트 핸들러 (Push Notification Event Handler)
// ═══════════════════════════════════════════════════════════════════════════════
self.addEventListener('push', event => {
  console.log('[Service Worker] Push 알림 수신');
  
  let data = {
    title: '내손가이드',
    body: '새로운 알림이 있습니다.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    data: { url: '/' }
  };
  
  try {
    if (event.data) {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || payload.message || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        tag: payload.tag || payload.type || data.tag,
        data: { 
          url: payload.link || payload.url || data.data.url,
          notificationId: payload.notificationId
        }
      };
    }
  } catch (e) {
    console.error('[Service Worker] Push 데이터 파싱 오류:', e);
    if (event.data) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    vibrate: [100, 50, 100],
    requireInteraction: false,
    data: data.data,
    actions: [
      { action: 'open', title: '열기' },
      { action: 'close', title: '닫기' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 푸시 알림 클릭 핸들러
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] 알림 클릭:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 이미 열린 창이 있으면 포커스
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if (urlToOpen !== '/') {
            client.navigate(urlToOpen);
          }
          return;
        }
      }
      // 열린 창이 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 푸시 구독 변경 핸들러
self.addEventListener('pushsubscriptionchange', event => {
  console.log('[Service Worker] 푸시 구독 변경됨');
  
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.VAPID_PUBLIC_KEY
    }).then(subscription => {
      return fetch('/api/push/resubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldEndpoint: event.oldSubscription?.endpoint,
          newSubscription: subscription.toJSON()
        })
      });
    }).catch(err => {
      console.error('[Service Worker] 재구독 실패:', err);
    })
  );
});