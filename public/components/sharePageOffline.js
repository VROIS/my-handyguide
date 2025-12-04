/**
 * 📴 공유페이지 오프라인 저장 컴포넌트 (Share Page Offline Component)
 * 
 * 2025-12-04 V1 표준화
 * 
 * 기능:
 * - 번역된 텍스트를 IndexedDB에 자동 저장
 * - 오프라인 시 IndexedDB에서 로드
 * - 공유 ID + 언어별로 저장 (중복 방지)
 * 
 * 저장 구조:
 * {
 *   id: 'shareId_lang',
 *   shareId: 'abc123',
 *   lang: 'fr-FR',
 *   items: [{ id: 0, translatedText: '...', originalText: '...' }],
 *   savedAt: timestamp
 * }
 * 
 * 사용법:
 * 1. HTML에 sharePageOffline.getScript() 삽입
 * 2. 번역 완료 시 자동 저장
 * 3. 오프라인 재방문 시 자동 로드
 */

const SharePageOffline = {
    DB_NAME: 'SharePageCache',
    DB_VERSION: 1,
    STORE_NAME: 'translations',

    // 인라인 스크립트 반환 (standard-template.ts에서 사용)
    getScript: function() {
        return `
    <!-- 📴 2025-12-04: 공유페이지 오프라인 저장 컴포넌트 V1 -->
    <script>
    (function() {
        'use strict';
        
        var DB_NAME = 'SharePageCache';
        var DB_VERSION = 1;
        var STORE_NAME = 'translations';
        
        // 공유 ID 추출 (URL에서)
        var pathParts = window.location.pathname.split('/');
        var shareId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        
        // 언어 추출
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'ko';
        var cacheKey = shareId + '_' + lang;
        
        console.log('📴 [오프라인] 캐시 키:', cacheKey);
        
        // IndexedDB 열기
        function openDB() {
            return new Promise(function(resolve, reject) {
                var request = indexedDB.open(DB_NAME, DB_VERSION);
                
                request.onerror = function() {
                    console.warn('📴 [오프라인] IndexedDB 열기 실패');
                    reject(request.error);
                };
                
                request.onsuccess = function() {
                    resolve(request.result);
                };
                
                request.onupgradeneeded = function(event) {
                    var db = event.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        var store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                        store.createIndex('shareId', 'shareId', { unique: false });
                        store.createIndex('savedAt', 'savedAt', { unique: false });
                    }
                };
            });
        }
        
        // 번역 결과 저장
        window.saveTranslation = function(items) {
            openDB().then(function(db) {
                var tx = db.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                
                var data = {
                    id: cacheKey,
                    shareId: shareId,
                    lang: lang,
                    items: items,
                    savedAt: Date.now()
                };
                
                store.put(data);
                console.log('📴 [오프라인] 저장 완료:', cacheKey, items.length + '개 아이템');
            }).catch(function(err) {
                console.warn('📴 [오프라인] 저장 실패:', err);
            });
        };
        
        // 저장된 번역 로드
        window.loadTranslation = function() {
            return openDB().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var tx = db.transaction(STORE_NAME, 'readonly');
                    var store = tx.objectStore(STORE_NAME);
                    var request = store.get(cacheKey);
                    
                    request.onsuccess = function() {
                        if (request.result) {
                            console.log('📴 [오프라인] 로드 성공:', cacheKey);
                            resolve(request.result);
                        } else {
                            resolve(null);
                        }
                    };
                    
                    request.onerror = function() {
                        reject(request.error);
                    };
                });
            });
        };
        
        // 온라인 상태 확인
        window.isOnline = function() {
            return navigator.onLine;
        };
        
        // 번역 완료 이벤트 리스너 (자동 저장)
        window.addEventListener('translationComplete', function(event) {
            // 타임아웃이 아닌 경우에만 저장 (실제 번역 완료)
            if (!event.detail.timeout && window.isOnline()) {
                // 모든 아이템의 번역된 텍스트 수집
                setTimeout(function() {
                    var appData = window.__appData || [];
                    var galleryItems = document.querySelectorAll('.gallery-item');
                    var items = [];
                    
                    galleryItems.forEach(function(item, index) {
                        var titleEl = item.querySelector('.font-semibold, h3, .title');
                        items.push({
                            id: index,
                            translatedText: titleEl ? titleEl.textContent : '',
                            originalText: appData[index] ? appData[index].description : ''
                        });
                    });
                    
                    if (items.length > 0) {
                        window.saveTranslation(items);
                    }
                }, 500); // 번역 적용 후 약간의 딜레이
            }
        });
        
        // 오프라인 시 저장된 데이터 로드
        document.addEventListener('DOMContentLoaded', function() {
            if (!window.isOnline()) {
                console.log('📴 [오프라인] 오프라인 모드 - 캐시에서 로드 시도');
                window.loadTranslation().then(function(cached) {
                    if (cached && cached.items) {
                        console.log('📴 [오프라인] 캐시된 번역 적용:', cached.items.length + '개');
                        window.__cachedTranslation = cached;
                        window.__translationComplete = true;
                        window.dispatchEvent(new CustomEvent('translationComplete', { 
                            detail: { lang: cached.lang, fromCache: true } 
                        }));
                    }
                });
            }
        });
    })();
    </script>`;
    }
};

// Node.js 환경에서 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharePageOffline;
}
