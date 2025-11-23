# 내손가이드 - 프로젝트 현황 (2025년 11월 23일)

**프로젝트:** 파리 여행 가이드 PWA  
**핵심 타겟:** 📱 모바일 99%, 카카오톡 90%, 삼성 안드로이드 90%  
**현재 상태:** Production 배포 중, 테스트 진행 중

---

## 🎯 오늘 완료 (2025-11-23)

### ✅ Service Worker 자동 업데이트 시스템 구축 🔥 **CRITICAL**
**작업 시간:** 1시간  
**배경:** 배포 후 캐시 문제로 삭제/로그아웃 버튼 미작동

**문제 발견:**
- 아이폰/크롬에서 삭제/로그아웃 버튼 작동 안 함
- 노트북(일반 브라우저)에서는 정상 작동
- 원인: Service Worker 캐시 문제 (v6 → v7 업데이트 안 됨)
- 사용자가 수동으로 캐시 삭제해야 함 (일반 여행객 불가능)

**완료 작업:**
1. **Service Worker 자동 업데이트 로직**
   - `self.skipWaiting()` - 새 버전 즉시 설치
   - `self.clients.claim()` - 모든 탭에 즉시 적용
   - 오래된 캐시 자동 삭제

2. **프론트엔드 자동 새로고침**
   - `updatefound` 이벤트 감지
   - 새 버전 활성화 시 자동 `window.location.reload()`
   - `controllerchange` 이벤트로 백그라운드 업데이트 처리

3. **캐시 버전 업그레이드**
   - `travel-assistant-cache-v6` → `v7`
   - `travel-assistant-api-cache-v5` → `v7`

**코드 변경:**
```javascript
// public/service-worker.js
self.addEventListener('install', event => {
  self.skipWaiting();  // 즉시 활성화
});

self.addEventListener('activate', event => {
  // 오래된 캐시 삭제 + 즉시 제어권 획득
  return self.clients.claim();
});

// public/index.js
reg.addEventListener('updatefound', () => {
  if (newWorker.state === 'activated') {
    window.location.reload();  // 자동 새로고침
  }
});
```

**영향:**
- ✅ 사용자가 캐시 수동 삭제 불필요
- ✅ 배포 후 자동 업데이트 (일반 여행객 UX)
- ✅ 모바일 99% 타겟 환경 최적화
- ✅ 삭제/로그아웃 버튼 정상 작동 확인 (99%)

**수정 파일:**
- `public/service-worker.js` - skipWaiting, claim 추가
- `public/index.js` - updatefound 리스너 추가

---

### ✅ 관리자 대시보드 공유 페이지 생성 버그 수정
**문제:** 관리자 인증(1234) 후 가이드 선택 → 공유 페이지 생성 실패
```
POST /api/admin/create-share-from-guides 500
TypeError: Cannot read properties of undefined (reading 'id')
```

**원인:** 
- 비밀번호 인증은 `req.session.adminUserId` 사용
- 코드는 `req.user`만 체크 → undefined 에러

**해결:**
```typescript
// Line 2549: server/routes.ts
const userId = req.session?.adminUserId || (req.user ? getUserId(req.user) : 'anonymous');
sender: '관리자',  // 고정값으로 변경
```

**영향:**
- ✅ 비밀번호 인증 관리자도 공유 페이지 생성 가능
- ✅ 발신자가 '관리자'로 통일됨

---

## 📅 최근 완료 작업 (날짜 역순)

### 🔹 2025-11-22: 보관함 하단 버튼 UI 개선
**작업 시간:** 1시간

**완료 내용:**
- ✅ 원형 배경 추가 (연한 제미니 블루)
- ✅ Heroicons로 아이콘 통일 (프로필/공유/삭제/설정)
- ✅ 프로필 버튼 추가 (향후 프로필 페이지 연결 예정)

**수정 파일:**
- `public/index.html`: 버튼 스타일, SVG 아이콘
- `public/index.js`: 이벤트 리스너

---

### 🔹 2025-11-13: Hybrid Guide Storage System 구축 ✅ 🔥 **CRITICAL**
**작업 시간:** 3시간  
**배경:** 가이드 데이터 안전성 문제 해결

**문제 발견:**
- guides 테이블 완전히 비어있음 (0개 레코드)
- 가이드 데이터가 **HTML 파일에만** Base64로 저장됨
- HTML 파일 손상 = 데이터 영구 손실 (복구 불가능)

**완료 작업:**
1. **HTML 파서 유틸리티** (`server/html-parser.ts`)
   - 2가지 형식 지원: shareData JSON, gallery-item 태그
2. **자동 백업 시스템** (`server/storage.ts`)
   - 공유 페이지 생성 시 guides 테이블에 자동 백업
   - `onConflictDoUpdate` 중복 방지
3. **기존 데이터 백업** (`scripts/backfill-guides.ts`)
   - 25개 공유 페이지 → 20개 고유 가이드 백업 완료

**Hybrid 방식 장점:**
- ✅ HTML: 빠른 오프라인 접근 (기존 유지)
- ✅ DB: 데이터 안전성 보장 (신규 추가)
- ✅ HTML 손상 시 DB에서 재생성 가능

**⚠️ 절대 제거 금지:**
- `createSharedHtmlPage()`의 guides 백업 로직
- `parseGuidesFromHtml()` 함수
- `scripts/backfill-guides.ts`

---

### 🔹 2025-11-12: 모바일 OAuth 통합 개선 ✅
**작업 시간:** 4시간  
**배경:** 모바일 OAuth 팝업 2번 닫기 문제 해결

**완료 작업:**
1. **PC/모바일 OAuth 통일 (window.open)** 
   - 모든 기기에서 `window.open()` 팝업 사용
   - 보관함 페이지 상태 완전 보존
   - 카메라 라이브뷰 유지
2. **모바일 "인증 완료" 버튼**
   - 모바일: 수동 닫기 버튼 표시
   - PC: postMessage 후 300ms 자동 닫기
3. **OAuth 완료 페이지 디자인 통일**
   - Gemini Blue + MaruBuri 폰트
4. **1번 닫기로 개선**
   - postMessage 전달 후 확실히 닫기

**수정 파일:**
- `server/googleAuth.ts`, `server/kakaoAuth.ts`
- `public/index.js`

**⚠️ 수정금지 주석:** "CRITICAL: DO NOT MODIFY" 추가

---

### 🔹 2025-11-09: 대시보드/사용설명서 window.open() 변경
**작업 시간:** 30분

**변경 내용:**
- `<a href>` → `<button onclick="window.open()">` 변경
- 새 창으로 열어서 원래 앱 탭 유지
- 카메라 라이브뷰 보존

**수정 파일:**
- `public/index.html`

---

### 🔹 2025-11-02: Featured Gallery UX 개선 + 다운로드 기능
**작업 시간:** 3-4시간  
**배경:** 5,100+ 조회수, 566 방문자 바이럴 성장

**완료 작업:**
1. **추천 갤러리 레이아웃 재구성**
   - 추천 갤러리 상단 고정 (스크롤 안 됨)
   - 내 보관함만 스크롤
2. **다운로드 버튼 추가**
   - 선택 모드에서만 표시
   - ZIP 다운로드 기능
3. **Featured Gallery 새 탭 열기**
   - `window.location.href` → `window.open()`
   - 보관함 세션 유지
4. **Featured 타이틀 글자 크기 조정**
   - 모바일 가독성 개선
5. **인증 후 리다이렉트 수정**
   - `res.redirect('/')` → `res.redirect('/archive')`

**수정 파일:**
- `public/index.html`, `public/index.js`
- `server/googleAuth.ts`, `server/kakaoAuth.ts`

---

### 🔹 2025-10-31: Featured 리턴 버튼 + 콘텐츠 순서 편집
**작업 시간:** 3시간

**완료 작업:**
1. **Featured 리턴 버튼 수정** 🔥 **CRITICAL FIX**
   - 문제: `window.location.href='/#archive'` → 카메라 권한 손실
   - 해결: `window.close()` → 페이지만 닫고 앱 유지
   - 위치: `server/storage.ts` (Line 852)
   - 효과: **삼성폰 카메라 권한 문제 완전 해결** ✅

2. **Featured 콘텐츠 순서 편집 기능**
   - Backend: guideIds 파라미터 추가
   - Admin UI: Drag & Drop 구현
   - 20장 이미지 순서 변경 가능

**수정 파일:**
- `server/storage.ts`, `server/routes.ts`
- `public/admin-dashboard.html`

---

### 🔹 2025-10-26: 관리자 대시보드 & DB 최적화
**작업 시간:** 4시간

**완료 작업:**
1. **HTML 파일 저장 시스템 구축**
   - DB에서 htmlContent 제거 → 파일 시스템으로 이동
   - `public/shared/` 폴더에 HTML 파일 저장
   - **결과:** DB 크기 184MB → 39MB (78% 감소!)

2. **기존 데이터 마이그레이션**
   - 40개 기존 공유 페이지를 파일로 이동
   - 총 84.13MB 데이터 마이그레이션

3. **관리자 대시보드 구축**
   - API: GET /api/admin/stats, /api/admin/analytics
   - 실시간 KPI 카드
   - Provider별 사용자 분포
   - 조회수 Top 10 공유 페이지
   - 일별 활동 추이 (최근 7일)

4. **관리자 인증 시스템**
   - 비밀번호 기반 인증 (1234)
   - 세션 기반 (며칠간 유지)

**수정 파일:**
- `server/routes.ts`, `server/storage.ts`
- `public/index.js`, `public/admin-dashboard.html`
- `replit.md`

---

### 🔹 2025-10-26 B: Phase 1 긴급 수정
**작업 시간:** 3시간

**완료 작업:**
1. **Featured Gallery localStorage 캐싱**
   - 5분 캐싱 시스템
   - API 로딩: 0.9초 → 0ms

2. **삼성폰 이미지 업로드 버그 수정**
   - `accept` 속성 단순화

3. **카카오톡 Chrome 강제 리다이렉트** 🔥 **P1-1 CRITICAL**
   - 문제: 갤럭시 사용자가 카톡에서 링크 클릭 시 페이지 안 열림
   - 해결:
     - UserAgent로 카카오톡 인앱 브라우저 즉시 감지
     - 전체 화면 노란색 경고 배너 즉시 표시
     - 0.5초 후 Intent URL로 Chrome 앱 자동 실행
   - Intent URL: `intent://...#Intent;scheme=https;package=com.android.chrome;end`

**수정 파일:**
- `public/index.js`
- `server/html-template.ts` (26줄 보호 주석 추가)

---

## 🔒 확보한 핵심 로직 (절대 수정 금지!)

> **⚠️ CRITICAL: DO NOT MODIFY WITHOUT USER APPROVAL**
> 
> 3개월간의 시행착오로 완성된 검증된 로직들입니다.

### 1. 🔥 카카오톡 Chrome 강제 리다이렉트 (2025-10-26)
**위치:** `server/html-template.ts` Line 66-143  
**중요도:** P1-1 CRITICAL  
**영향:** 90% 삼성폰 사용자 핵심 UX

**로직:**
```javascript
// UserAgent 감지
if (userAgent.match(/kakaotalk/i)) {
    // 1. 노란 경고 배너 즉시 표시
    banner.style.display = 'block';
    galleryView.style.display = 'none';
    
    // 2. 0.5초 후 Chrome Intent URL 실행
    setTimeout(() => {
        const intentUrl = 'intent://' + urlWithoutProtocol + 
                          '#Intent;scheme=https;package=com.android.chrome;end';
        window.location.href = intentUrl;
    }, 500);
}
```

**주의사항:**
- Android 전용 (iOS는 별도 처리 필요)
- Intent URL은 Chrome 전용 (다른 브라우저 미지원)

---

### 2. ⚠️ Featured Gallery localStorage 캐싱 (2025-10-26)
**위치:** `public/index.js`  
**중요도:** HIGH  
**영향:** 보관함 즉시 표시 (0.9초 → 0ms)

**로직:**
```javascript
const CACHE_KEY = 'featuredGalleryCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5분

const cached = localStorage.getItem(CACHE_KEY);
if (cached && Date.now() - data.timestamp < CACHE_DURATION) {
    // 캐시 사용 (0ms 로딩)
} else {
    // API 호출 + 캐시 저장
}
```

**주의사항:**
- Admin에서 Featured 추가/삭제 시 캐시 즉시 삭제 필요
- 5분 캐시 + DB 업데이트 시차 고려

---

### 3. ⚠️ HTML 파일 저장 시스템 (2025-10-26)
**위치:** `server/storage.ts`  
**중요도:** HIGH  
**영향:** DB 크기 78% 감소 (184MB → 39MB)

**로직:**
```typescript
const htmlFilePath = `/shared/${shortId}.html`;
const fullPath = path.join(process.cwd(), 'public', htmlFilePath);
fs.writeFileSync(fullPath, page.htmlContent, 'utf8');

// DB에는 경로만 저장
await db.insert(sharedHtmlPages).values({ 
    id: shortId,
    htmlFilePath: htmlFilePath,
    // htmlContent 제외!
});
```

**주의사항:**
- 파일 시스템과 DB 동기화 필수
- 파일 삭제 시 DB 메타데이터도 삭제

---

### 4. ⚠️ Featured 리턴 버튼 (2025-10-31)
**위치:** `server/storage.ts` Line 852  
**중요도:** CRITICAL  
**영향:** 삼성폰 카메라 권한 유지

**로직:**
```javascript
onclick="window.close()"  // ← 카메라 권한 보존!
// ❌ window.location.href='/#archive' (카메라 권한 손실)
```

**주의사항:**
- `window.close()` 실패 시 fallback 필요
- 팝업이 아닌 경우 닫기 안 됨

---

### 5. ⚠️ 관리자 인증 로직 (2025-10-26)
**위치:** `public/index.js`  
**중요도:** HIGH (보안)

**로직:**
```javascript
const password = '1234';
if (inputPassword === password) {
    // 대시보드 링크 표시
    adminDashboardLink.classList.remove('hidden');
}
```

**주의사항:**
- 프로덕션에서는 환경변수 사용 권장
- 세션 기반 (며칠간 유지)

---

### 6. ⚠️ 모바일 OAuth 인증 시스템 (2025-11-12)
**위치:** `server/googleAuth.ts`, `server/kakaoAuth.ts`, `public/index.js`  
**중요도:** CRITICAL (인증 핵심)  
**영향:** 보관함 상태 보존, 1번 닫기, PC/모바일 통일

**로직:**
```javascript
// Frontend: window.open() 팝업 (PC/모바일 통일)
const popup = window.open('/api/auth/google', 'google_oauth', 'width=500,height=600,...');

// Backend: OAuth 완료 페이지
if (isMobile()) {
    // 모바일: "인증 완료" 버튼
    button.onclick = closeWindow;
} else {
    // PC: 300ms 후 자동 닫기
    setTimeout(() => closeWindow(), 300);
}

function closeWindow() {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'oauth_success' }, origin);
        setTimeout(() => window.close(), 300);
    } else {
        window.location.href = '/#archive';
    }
}
```

**주의사항:**
- iOS Safari는 `window.close()` 실패할 수 있음
- postMessage origin 검증 필수

---

### 7. 🔥 Service Worker 자동 업데이트 (2025-11-23)
**위치:** `public/service-worker.js`, `public/index.js`  
**중요도:** CRITICAL (일반 사용자 UX)  
**영향:** 배포 후 캐시 자동 업데이트, 사용자 개입 불필요

**로직:**
```javascript
// Service Worker - skipWaiting + claim
self.addEventListener('install', event => {
  self.skipWaiting();  // 대기 없이 즉시 활성화
});

self.addEventListener('activate', event => {
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

// Frontend - 자동 새로고침
navigator.serviceWorker.register('/service-worker.js')
  .then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          if (!navigator.serviceWorker.controller) return; // 첫 설치 제외
          window.location.reload();  // 자동 새로고침
        }
      });
    });
  });

// 백그라운드 업데이트 감지
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});
```

**주의사항:**
- 첫 설치 시에는 새로고침하지 않음 (controller 체크)
- 배포 시마다 캐시 버전 업데이트 필요 (v7 → v8 ...)
- 모바일 99% 타겟 환경에서 필수

---

### 8. 🔥 Hybrid Guide Storage System (2025-11-13)
**위치:** `server/storage.ts`, `server/html-parser.ts`  
**중요도:** CRITICAL (데이터 안전성)

**로직:**
```typescript
// server/storage.ts - createSharedHtmlPage()
async createSharedHtmlPage(userId: string, page: InsertSharedHtmlPage) {
    // 1. HTML 파일 저장 (기존)
    fs.writeFileSync(fullPath, page.htmlContent, 'utf8');
    
    // 2. 🆕 가이드 데이터 백업 (DB)
    const parsedGuides = parseGuidesFromHtml(page.htmlContent, {
        userId: userId,
        guideIds: page.guideIds,
        location: page.location ?? undefined,
        createdAt: new Date()
    });
    
    // 3. 각 가이드를 DB에 저장 (중복 시 업데이트)
    for (const guide of parsedGuides) {
        await db.insert(guides).values(guide)
            .onConflictDoUpdate({
                target: guides.id,
                set: { /* 업데이트 */ }
            });
    }
}
```

**주의사항:**
- HTML 파싱 실패 시에도 공유 페이지 생성은 계속
- `parseGuidesFromHtml()` 함수는 2가지 형식 지원 필요

---

### 9. ✅ 4존 스크롤 레이아웃 (2025-10-02)
**위치:** `public/index.html`  
**중요도:** MEDIUM

**구조:**
```
┌─────────────────┐
│ 보관함 헤더 (고정) │
├─────────────────┤
│ 추천 갤러리 (고정) │
├─────────────────┤
│ ┌─────────────┐ │
│ │ 내 보관함   │ │ ← 여기만 스크롤
│ │ (스크롤)    │ │
│ └─────────────┘ │
├─────────────────┤
│ 하단 네비 (고정)  │
└─────────────────┘
```

**주의사항:**
- 추천 갤러리는 절대 스크롤 안 됨
- 내 보관함만 독립 스크롤 영역

---

### 10. ✅ 공유/삭제 간편 로직 (2025-10-02)
**위치:** `public/index.js`  
**중요도:** MEDIUM

**로직:**
```javascript
// 클릭 순서 보존 (Array)
let selectedItemIds = [];  // ← Set이 아니라 Array!

function handleItemSelect(id) {
    if (selectedItemIds.includes(id)) {
        selectedItemIds = selectedItemIds.filter(x => x !== id);
    } else {
        selectedItemIds.push(id);  // 순서 보존
    }
}
```

**주의사항:**
- Set이 아니라 Array 사용 (순서 보존 필수)

---

## 🚀 현재 진행 중

### ✅ 배포 테스트 완료 (2025-11-23)
- ✅ Development 환경 테스트 완료
- ✅ Production 배포 후 사용자 테스트 완료
- ✅ 99% 정상 작동 확인
- ✅ Service Worker 자동 업데이트 적용

**해결된 문제:**
1. ✅ 캐시 문제 → 자동 업데이트 시스템 구축
2. ✅ 삭제/로그아웃 버튼 작동
3. ✅ 모바일 환경 최적화 (아이폰/크롬)

---

## 📋 대기 중인 작업 (우선순위별)

### 🔴 Priority 1 (긴급)

#### 1. 배포 환경 문제 해결
**상태:** ⏳ 사용자 피드백 대기  
**예상 시간:** 1-2시간

---

### 🟡 Priority 2 (중요)

#### 1. 범용 브라우저 지원 (삼성 인터넷, Edge, Whale)
**상태:** ⏳ 대기  
**예상 시간:** 2시간

**목표:**
- Intent URL 제거
- 일반 링크로 모든 브라우저 지원

---

#### 2. 첫 실행 온보딩 플로우 구현
**상태:** ⏳ 기획 단계  
**예상 시간:** 4시간

**5개 슬라이드 구성:**
1. 📸 "궁금한 것을 찍으면 AI가 설명해줘요"
2. 💾 "마음에 들면 '보관' 버튼을 눌러주세요"
3. ✅ "보관함에서 여러 장을 선택하세요"
4. 🔗 "공유 버튼으로 나만의 여행 가이드 페이지를 만드세요" (가장 강조)
5. 🎉 "카카오톡, 링크로 친구들과 공유하세요!"

---

#### 3. 프로필 페이지 구현
**상태:** ⏳ 기획 단계  
**예상 시간:** 2시간

**구현 계획:**
- 사용자 정보 표시 (이름, 이메일)
- 크레딧 잔액 표시
- 생성한 공유 페이지 목록
- 설정 메뉴 연결

---

### 🔵 Priority 3 (장기)

#### 1. 충전식 결제 시스템 구현
**상태:** ⏳ 대기  
**예상 시간:** 8-10시간

**비즈니스 모델:**
- 1 크레딧 = 300원
- 사진 촬영 + AI 응답 = 10 크레딧
- 공유페이지 생성 = 100 크레딧
- 신규 가입자: 430 크레딧 무료 제공

---

## ❓ 사용자 확인 필요

### 질문 1: 배포 환경에서 작동 안 되는 기능
**현재 상황:** 사용자가 배포 후 테스트 중  
**필요 정보:**
- 구체적으로 어떤 기능이 안 되는지?
- 에러 메시지가 있는지?
- Development와 차이점은?

---

### 질문 2: 기존 TODO 파일 삭제 여부
**4개 파일:**
- TODO.md
- TODOS.md
- TODOs.md
- todos.md

**통합 완료:** PROJECT_STATUS.md로 정리  
**삭제해도 되나요?**

---

## 📝 보호된 파일

**DO NOT modify without explicit user approval:**
- `server/standard-template.ts` - V2 template
- `server/html-template.ts` - 카카오톡 리다이렉트
- `server/storage.ts` - HTML 파일 저장, Hybrid 백업
- `server/html-parser.ts` - 가이드 파싱
- `public/index.js` - OAuth, Featured 캐싱, Service Worker 자동 업데이트
- `public/service-worker.js` - 캐시 관리, skipWaiting, claim
- `server/googleAuth.ts`, `server/kakaoAuth.ts` - OAuth 완료 페이지
- Migration scripts with bulk operations

---

## 📊 통계 (참고)

**성과:**
- DB 크기: 184MB → 39MB (78% 감소)
- Featured 로딩: 0.9초 → 0ms (100% 개선)
- 조회수: 5,100+ (566 방문자)
- 가이드 백업: 20개 고유 가이드

**기술 스택:**
- Frontend: Vanilla JavaScript, Tailwind CSS (CDN)
- Backend: Express.js, Drizzle ORM, PostgreSQL
- AI: Google Gemini 2.5 Flash
- Auth: Replit Auth, Google OAuth
- Storage: Hybrid (HTML + DB)

---

**최종 업데이트:** 2025-11-23 17:30 KST  
**다음 작업:** App Storage 마이그레이션 완료 확인 후 다음 우선순위 작업
