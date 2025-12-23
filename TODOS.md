# 손안에 가이드 - 통합 작업 히스토리

**최종 업데이트:** 2025-11-13  
**프로젝트:** 내손가이드 (My Hand Guide)  
**환경:** Replit (Express + Vite + PostgreSQL)  
**핵심 타겟:** 📱 모바일 99%, 카카오톡 90%, 삼성 안드로이드 90%

---

## 🔴 긴급 수정 필요 (2025-11-11 모바일 실제 테스트 피드백)

> **중요:** 99% 모바일, 90% 카카오톡, 90% 삼성폰 사용자 → 모든 수정은 이 환경 최적화!

### 📱 테스트 환경
- ✅ PC Chrome: Playwright 자동 테스트
- ❌ 실제 모바일: 수동 테스트 필요 (가장 중요!)
- ❌ 아이폰 Safari
- ❌ 삼성폰 카카오톡

### 🔧 발견된 3가지 문제

#### **1. ❌ 추천갤러리 X 버튼이 창을 안 닫음 (PC/모바일 공통)**

**문제:**
- X 버튼 클릭 시 보관함으로 이동만 하고 창이 안 닫힘
- 독립 페이지인데 페이지 이동 불필요
- 백그라운드 보관함 (카메라 라이브뷰, 인증 상태) 유지 안 됨

**위치:** `server/html-template.ts` Line 137-142

**현재 코드:**
```typescript
function handleSmartClose() {
    window.location.replace('/#archive');  // ❌ 페이지 이동만
}
```

**수정 방안:**
```typescript
function handleSmartClose() {
    window.close();  // ✅ 진짜 창 닫기
}
```

**기대 효과:**
- ✅ 설정/대시보드처럼 `window.close()` 로직 통일
- ✅ 백그라운드 앱 상태 그대로 유지
- ✅ 카메라 라이브뷰 보존

---

#### **2. ❌ 아이폰에서 홈 버튼 → 노란 경고 페이지 ("Chrome에서 열기")**

**문제:**
- 카카오톡 감지 코드가 iOS도 잡아버림 (안드로이드만 해야 함)
- Intent URL은 Android 전용인데 iOS에서도 실행
- "Chrome에서 열기" 버튼 클릭 시 아무 동작 없음

**위치:** `server/html-template.ts` Line 89-124

**현재 코드:**
```javascript
// Line 96
if (userAgent.match(/kakaotalk/i)) {  // ❌ 아이폰도 잡힘!
    isKakaoInApp = true;
    // Intent URL 실행...
}
```

**수정 방안 A (Android만 감지):**
```javascript
// Android 체크 추가
if (userAgent.match(/kakaotalk/i) && userAgent.match(/android/i)) {
    isKakaoInApp = true;
    // Intent URL 실행...
}
```

**수정 방안 B (범용 브라우저 지원 - 권장!):**
```javascript
// Intent URL 아예 제거하고 일반 링크 사용
// 카카오톡 WebView가 알아서 기본 브라우저로 열어줌
window.location.href = appUrl;  // 크롬/엣지/삼성인터넷 다 됨!
```

**연구 결과:**
- 삼성폰 카카오톡 = **Chrome 기반 WebView** (MS 기반 아님!)
- CustomTabs 지원: Chrome, Samsung Internet, Firefox, Whale, Edge
- **Intent URL 불필요** → 일반 링크만으로 모든 브라우저 지원

**기대 효과:**
- ✅ 아이폰: 노란 경고 없이 바로 Safari/Chrome에서 열림
- ✅ 삼성폰: 크롬/엣지/삼성인터넷 어디서든 열림
- ✅ UX 최적화: 경고 페이지 제거

---

#### **3. ✅ 아이폰 로그인 후 팝업 창 2개 (백그라운드에 1개 남음)** - 해결!

**문제:**
- OAuth 팝업이 iOS Safari에서 자동으로 안 닫힘
- `window.close()` 실패 (iOS 보안 정책)
- 백그라운드에 팝업 창 남아있음

**해결 방법 (2025-11-12):**
1. **PC/모바일 통일: window.open() 방식**
   - 모든 기기에서 팝업 사용 (보관함 상태 유지!)
   - 팝업 차단 시 현재 탭 fallback
   
2. **모바일 전용 "인증 완료" 버튼**
   - iOS에서 자동 닫기 안 되면 수동 버튼 표시
   - 버튼 클릭 → postMessage + 300ms 후 닫기
   
3. **1번 닫기 구현**
   - fallback 리다이렉트 제거
   - postMessage 전달 후 확실히 닫기

**결과:**
- ✅ 모바일에서 1번만 닫으면 됨
- ✅ 보관함 상태 완전 유지
- ✅ 백그라운드 창 문제 해결
- ✅ PC/모바일 UX 통일

---

## ✅ 완료된 작업 (날짜별 역순)

### 📅 2025-11-13: Hybrid Guide Storage System 구축 ✅

**작업 시간:** 3시간  
**배경:** 가이드 데이터 안전성 문제 해결 - HTML 손상 시 복구 불가능

**문제 발견:**
- guides 테이블이 완전히 비어있음 (0개 레코드)
- 가이드 데이터가 **HTML 파일에만** Base64로 저장됨
- HTML 파일 손상 = 데이터 영구 손실 (복구 불가능)
- 1000개 페이지 확장 시 위험성 매우 높음

**완료된 작업:**
1. **HTML 파서 유틸리티 생성** ✅
   - `server/html-parser.ts` 신규 작성
   - 2가지 형식 지원: shareData JSON, gallery-item 태그
   - routes.ts의 기존 파싱 로직 재사용
   
2. **자동 백업 시스템 구현** ✅
   - `createSharedHtmlPage()` 함수 수정
   - 공유 페이지 생성 시 guides 테이블에 자동 백업
   - 중복 방지: `onConflictDoUpdate` 적용
   - 백업 실패해도 공유 페이지 생성은 정상 진행
   
3. **기존 데이터 백업 완료** ✅
   - `scripts/backfill-guides.ts` 작성
   - DRY-RUN 모드 지원 (EXEC=1로 실제 실행)
   - 25개 공유 페이지 중 18개 성공
   - **94개 가이드 → 20개 고유 가이드 백업 완료**
   
4. **replit.md 문서화** ✅
   - Hybrid Guide Storage System 섹션 추가
   - 보호 코드 명시: "DO NOT disable guide backup"

**Hybrid 방식의 장점:**
- ✅ HTML 파일: 빠른 오프라인 접근 (기존 방식 유지)
- ✅ DB 백업: 데이터 안전성 보장
- ✅ HTML 손상 시 DB에서 재생성 가능
- ✅ 1000개 페이지 확장 시에도 안전

**수정 파일:**
- `server/html-parser.ts` (신규)
- `server/storage.ts` (createSharedHtmlPage)
- `scripts/backfill-guides.ts` (신규)
- `replit.md` (문서화)

**데이터베이스 변화:**
- Before: guides 테이블 0개
- After: guides 테이블 20개 (고유 가이드)

**⚠️ 보호 코드 추가:**
- `createSharedHtmlPage()`의 guides 백업 로직
- HTML 파서 유틸리티 (`parseGuidesFromHtml`)

---

### 📅 2025-11-12: 모바일 OAuth 통합 개선 ✅

**작업 시간:** 4시간  
**배경:** 모바일 OAuth 팝업 2번 닫기 문제 해결

**완료된 작업:**
1. **PC/모바일 OAuth 통일 (window.open)** ✅
   - 모든 기기에서 `window.open()` 팝업 사용
   - 보관함 페이지 상태 완전 보존
   - 카메라 라이브뷰 유지
   
2. **모바일 "인증 완료" 버튼** ✅
   - 모바일: 수동 닫기 버튼 표시
   - PC: postMessage 후 300ms 자동 닫기
   - `window.close()` 실패 시 보관함으로 이동
   
3. **OAuth 완료 페이지 디자인 통일** ✅
   - Hero Icons 체크마크 (fill 스타일)
   - Gemini Blue (#4285F4) 컬러
   - MaruBuri 폰트
   - 공유페이지와 100% 동일한 느낌
   
4. **1번 닫기로 개선** ✅
   - fallback 리다이렉트 제거
   - postMessage 전달 후 확실히 닫기 (300ms delay)
   - 이중 닫기 문제 완전 해결

**수정 파일:**
- `server/googleAuth.ts` (OAuth 완료 페이지 HTML)
- `server/kakaoAuth.ts` (OAuth 완료 페이지 HTML)
- `public/index.js` (window.open 로직)

**수정금지 주석 추가:** ⚠️
- 모든 인증 로직에 "CRITICAL: DO NOT MODIFY" 주석 추가
- 2025-11-12 검증 완료 표시

---

### 📅 2025-11-09: 대시보드/사용설명서 window.open() 변경 ✅

**작업 내용:**
- 설정 페이지 링크 → 버튼으로 변경
- `<a href>` → `<button onclick="window.open()">`
- 새 창으로 열어서 원래 앱 탭 유지

**수정 파일:**
- `public/index.html`

**Before:**
```html
<a href="./admin-dashboard.html">📊 관리자 대시보드 열기</a>
<a href="./user-guide.html">📖 사용설명서 열기</a>
```

**After:**
```html
<button onclick="window.open('./admin-dashboard.html')">📊 관리자 대시보드 열기</button>
<button onclick="window.open('./user-guide.html')">📖 사용설명서 열기</button>
```

**결과:**
- ✅ 새 창 오픈 (PC 테스트 완료)
- ✅ 원래 앱 탭 유지 → 카메라 라이브뷰 보존
- ✅ `window.close()`로 간편하게 닫기

---

### 📅 2025-11-02: Featured Gallery UX 개선 + 다운로드 기능 ✅

**작업 시간:** 3-4시간  
**배경:** 5,100+ 조회수, 566 방문자 바이럴 성장

**완료된 작업:**
1. **추천 갤러리 레이아웃 재구성** ✅
   - 추천 갤러리 상단 고정 (스크롤 안 됨)
   - 내 보관함만 스크롤
   
2. **다운로드 버튼 추가** ✅
   - 추천 갤러리와 내 보관함 사이 배치
   - 선택 모드에서만 표시
   - ZIP 다운로드 기능

3. **Featured Gallery 새 탭 열기** ✅
   - `window.location.href` → `window.open()`
   - 보관함 세션 유지
   
4. **Featured 타이틀 글자 크기 조정** ✅
   - 모바일 가독성 개선
   - `clamp(1.125rem, 6vw, 1.75rem)` → `clamp(1rem, 4.5vw, 1.5rem)`

5. **인증 후 리다이렉트 수정** ✅
   - `res.redirect('/')` → `res.redirect('/archive')`
   - 이탈 방지

**수정 파일:**
- `public/index.html` (레이아웃, 다운로드 버튼)
- `public/index.js` (다운로드 로직, Featured 클릭)
- `server/googleAuth.ts`, `server/kakaoAuth.ts` (리다이렉트)

---

### 📅 2025-10-31: Featured 리턴 버튼 + 콘텐츠 순서 편집 ✅

**작업 시간:** 3시간

**완료된 작업:**
1. **Featured 리턴 버튼 수정** ✅ 🔥 **CRITICAL FIX**
   - 문제: `window.location.href='/#archive'` → 카메라 권한 손실
   - 해결: `window.close()` → 페이지만 닫고 앱 유지
   - 위치: `server/storage.ts` (Line 852)
   - 효과: 삼성폰 카메라 권한 문제 완전 해결

2. **Featured 콘텐츠 순서 편집 기능** ✅
   - Backend: guideIds 파라미터 추가
   - Admin UI: Drag & Drop 구현
   - 20장 이미지 순서 변경 가능

**수정 파일:**
- `server/storage.ts` (리턴 버튼, regenerateFeaturedHtml)
- `server/routes.ts` (POST /api/admin/featured/:id/regenerate)
- `public/admin-dashboard.html` (편집 모달 UI)

---

### 📅 2025-10-26: 관리자 대시보드 & DB 최적화 ✅

**작업 시간:** 4시간

**완료된 작업:**
1. **HTML 파일 저장 시스템 구축** ✅
   - DB에서 htmlContent 제거 → 파일 시스템으로 이동
   - `public/shared/` 폴더에 HTML 파일 저장
   - **결과:** DB 크기 184MB → 39MB (78% 감소!)

2. **기존 데이터 마이그레이션** ✅
   - 40개 기존 공유 페이지를 파일로 이동
   - 총 84.13MB 데이터 마이그레이션

3. **관리자 대시보드 구축** ✅
   - API: GET /api/admin/stats, /api/admin/analytics
   - 실시간 KPI 카드
   - Provider별 사용자 분포
   - 조회수 Top 10 공유 페이지
   - 일별 활동 추이 (최근 7일)

4. **관리자 인증 시스템** ✅
   - 비밀번호 기반 인증 (1234)
   - 설정 페이지 열 때마다 재인증
   - 영업 비밀 보호

5. **디자인 시스템 문서화** ✅
   - Gemini Blue (#4285F4)
   - MaruBuri 폰트
   - Heroicons (이모지 금지)

**수정 파일:**
- `server/routes.ts` (관리자 대시보드 API)
- `server/storage.ts` (HTML 파일 저장)
- `public/index.js` (관리자 인증)
- `public/admin-dashboard.html` (신규 파일)
- `public/index.html` (adminDashboardLink)
- `replit.md` (디자인 시스템)

---

### 📅 2025-10-26 B: Phase 1 긴급 수정 ✅

**작업 시간:** 3시간

**완료된 작업:**
1. **Featured Gallery localStorage 캐싱** ✅
   - 5분 캐싱 시스템
   - API 로딩: 0.9초 → 0ms
   - 보관함 즉시 표시

2. **삼성폰 이미지 업로드 버그 수정** ✅
   - `accept` 속성 단순화
   - 삼성 인터넷 브라우저 호환성

3. **카카오톡 Chrome 강제 리다이렉트** ✅ 🔥 **P1-1 CRITICAL**
   - 문제: 갤럭시 사용자가 카톡에서 링크 클릭 시 페이지 안 열림
   - 해결:
     - UserAgent로 카카오톡 인앱 브라우저 즉시 감지
     - 전체 화면 노란색 경고 배너 즉시 표시
     - 0.5초 후 Intent URL로 Chrome 앱 자동 실행
     - 실패 시 수동 "Chrome에서 열기" 버튼
   - Intent URL: `intent://...#Intent;scheme=https;package=com.android.chrome;end`

**수정 파일:**
- `public/index.js` (Featured 캐싱)
- `public/index.html` (이미지 업로드)
- `server/html-template.ts` (카카오톡 리다이렉트)

---

### 📅 2025-10-05: Featured Gallery 성능 최적화 ✅

**작업 시간:** 4시간

**완료된 작업:**
1. **성능 모니터링 시스템 제거** ✅
   - `performanceMonitor.js` 로딩 제거
   - 불필요한 로깅 정리

2. **Featured Gallery 로딩 최적화** ✅
   - API 호출 간소화 (4-5초 → 즉시)
   - 백그라운드 비동기 로딩
   - 에러 처리 개선

3. **레이아웃 복원** ✅
   - Featured Gallery를 헤더 바로 아래로 이동
   - 원래 UI 순서 복원

---

### 📅 2025-10-02: 공유/삭제 간편 로직 + 4존 스크롤 레이아웃 ✅

**완료된 작업:**
1. **공유 기능 개선** ✅
   - 선택 모드 구현
   - 클릭 순서 보존 (Array 기반)
   - 공유 모달 UI

2. **4존 스크롤 레이아웃** ✅
   - 헤더 고정
   - 스크롤 영역 분리
   - 하단 네비게이션 고정

---

## 🔒 절대 수정 금지 (핵심 로직)

> **⚠️ CRITICAL: DO NOT MODIFY WITHOUT USER APPROVAL**
>
> 3개월간의 시행착오로 완성된 검증된 로직들입니다.  
> 수정 시 **반드시 사용자 승인** 필요!

### 1. 🔥 카카오톡 Chrome 강제 리다이렉트 (2025-10-26)
**위치:** `server/html-template.ts` Line 66-143  
**중요도:** P1-1 CRITICAL  
**작업 시간:** 2시간

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

**영향:** 90% 삼성폰 사용자 핵심 UX

---

### 2. ⚠️ Featured Gallery localStorage 캐싱 (2025-10-26)
**위치:** `public/index.js`  
**중요도:** HIGH

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

**영향:** 보관함 즉시 표시 (0.9초 → 0ms)

---

### 3. ⚠️ HTML 파일 저장 시스템 (2025-10-26)
**위치:** `server/storage.ts`  
**중요도:** HIGH

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

**영향:** DB 크기 78% 감소 (184MB → 39MB)

---

### 4. ⚠️ Featured 리턴 버튼 (2025-10-31)
**위치:** `server/storage.ts` Line 852  
**중요도:** CRITICAL

**로직:**
```javascript
onclick="window.close()"  // ← 카메라 권한 보존!
// ❌ window.location.href='/#archive' (카메라 권한 손실)
```

**영향:** 삼성폰 카메라 권한 유지

---

### 5. ⚠️ Featured 순서 편집 (2025-10-31)
**위치:** `public/admin-dashboard.html`  
**중요도:** MEDIUM

**로직:**
```javascript
// Drag & Drop
const guideItems = document.querySelectorAll('.guide-item');
const newGuideIds = Array.from(guideItems).map(item => item.dataset.index);

await fetch(`/api/admin/featured/${id}/regenerate`, {
    method: 'POST',
    body: JSON.stringify({ guideIds: newGuideIds })
});
```

---

### 6. ⚠️ 관리자 대시보드 API (2025-10-26)
**위치:** `server/routes.ts` Line 1645-1810  
**중요도:** HIGH (영업 비밀)

**API 목록:**
- GET /api/admin/stats (전체 통계)
- GET /api/admin/analytics (일별 분석)
- POST /api/admin/featured/:id/regenerate

---

### 7. ⚠️ 관리자 인증 로직 (2025-10-26)
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

---

### 8. ✅ 공유/삭제 간편 로직 (2025-10-02)
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

---

### 9. ⚠️ 모바일 OAuth 인증 시스템 (2025-11-12)
**위치:** `server/googleAuth.ts`, `server/kakaoAuth.ts`, `public/index.js`  
**중요도:** CRITICAL (인증 핵심)

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

**영향:** 보관함 상태 보존, 1번 닫기, PC/모바일 통일

---

### 10. ✅ 4존 스크롤 레이아웃 (2025-10-02)
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

---

### 11. 🔥 Hybrid Guide Storage System (2025-11-13)
**위치:** `server/storage.ts`, `server/html-parser.ts`  
**중요도:** CRITICAL (데이터 안전성)

**배경:**
- guides 테이블 완전히 비어있음 (0개 레코드)
- 가이드 데이터가 HTML 파일에만 저장됨
- HTML 손상 = 데이터 영구 손실

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
    
    // 4. DB에 공유 페이지 메타데이터 저장
    await db.insert(sharedHtmlPages).values({ ... });
}
```

**HTML 파서:**
```typescript
// server/html-parser.ts
export function parseGuidesFromHtml(htmlContent: string, fallback: ParseFallbackData) {
    // 방법 1: shareData JSON 추출
    const shareDataMatch = htmlContent.match(/const shareData = ({[\s\S]*?});/);
    if (shareDataMatch) {
        const shareData = JSON.parse(shareDataMatch[1]);
        return shareData.contents.map((item, index) => ({
            id: fallback.guideIds[index],
            title: item.description?.substring(0, 100),
            imageUrl: item.imageDataUrl,
            // ...
        }));
    }
    
    // 방법 2: gallery-item 태그 파싱
    const galleryItemRegex = /<div[^>]*class="gallery-item"[^>]*data-id="([^"]*)"[^>]*>/g;
    // ...
}
```

**복구 시나리오:**
```typescript
// routes.ts - 이미 존재하는 로직 활용
if (guides.length === 0 && page.htmlFilePath) {
    // HTML 파일에서 가이드 재추출
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    guides = parseGuidesFromHtml(htmlContent, { ... });
}
```

**영향:** 
- ✅ HTML 손상 시 DB에서 복구 가능
- ✅ 1000개 페이지 확장 시 안전성 보장
- ✅ 기존 25개 페이지 → 20개 고유 가이드 백업 완료

**⚠️ 절대 제거 금지:**
- `createSharedHtmlPage()`의 guides 백업 로직
- `parseGuidesFromHtml()` 함수
- `scripts/backfill-guides.ts` (기존 데이터 백업용)

---

## 📋 대기중 작업 (백로그)

### 🟡 Priority 1 (중요)

#### 1. 범용 브라우저 지원 (삼성 인터넷, Edge, Whale)
**상태:** ⏳ 대기  
**예상 시간:** 2시간

**목표:**
- Intent URL 제거
- 일반 링크로 모든 브라우저 지원
- Chrome, Samsung Internet, Edge, Whale, Firefox

---

#### 2. Featured 캐시 무효화 시점 명확화
**상태:** ⏳ 대기  
**예상 시간:** 30분

**문제:**
- localStorage 5분 캐시 + DB Featured 업데이트 시차
- 새로 추가한 Featured가 바로 안 보임

**해결:**
- Admin에서 Featured 추가/삭제 시 localStorage 캐시 즉시 삭제

---

#### 3. Google Maps API 위치 정보 시스템
**상태:** ✅ 완료 (2025-10-26)

**완료된 기능:**
- GPS EXIF 자동 추출 (exifr)
- Google Maps Places API 동적 로딩
- GPS → 유명 랜드마크 자동 변환 (100m 반경)
- 상세 페이지 위치 배지 표시
- 공유 페이지에 위치 정보 포함

---

### 🟢 Priority 2 (개선)

#### 4. 공유 페이지 오프라인 지원 강화
**상태:** ⏳ 대기  
**예상 시간:** 2시간

**현재:**
- Service Worker 등록됨
- Cache-First 전략

**개선:**
- 공유 페이지 HTML 파일 자동 캐싱
- 이미지 Base64 임베딩으로 완전 오프라인
- 네트워크 없을 시 안내 메시지

---

#### 5. PC 데스크톱 레이아웃 최적화
**상태:** ⏳ 대기  
**예상 시간:** 1시간

**현재:** 모바일 UI 그대로 (1열 그리드)  
**개선:** 768px 이상에서 3열 그리드 (CSS만 수정)

---

#### 6. 공유 페이지 OG 태그 개선
**상태:** ⏳ 대기  
**예상 시간:** 1시간

**현재:** 기본 제목만  
**개선:** 썸네일 이미지, 설명, 작성자 정보

---

#### 7. SEO 최적화
**상태:** ⏳ 대기  
**예상 시간:** 2시간

- sitemap.xml 생성
- robots.txt 설정
- meta description 개선

---

### 🔵 Priority 3 (장기)

#### 8. 충전식 결제 시스템 (크레딧)
**상태:** ⏳ 대기  
**예상 시간:** 8-10시간

**비즈니스 모델:**
- 1 크레딧 = 300원
- 사진 촬영 + AI = 10 크레딧
- 가이드 저장 = 3 크레딧
- 공유페이지 생성 = 100 크레딧

---

#### 9. 다국어 지원 (ChatGPT 등록 필수)
**상태:** ⏳ 대기  
**예상 시간:** 8-10시간  
**마감:** 2025년 12월

**지원 언어:** 한/영/프/스/포/중/일 (7개)

**범위:**
- 인증 모달 언어 선택
- UI 텍스트 번역
- Gemini API 언어별 호출
- TTS 음성 언어별 생성
- 공유 페이지 언어별 생성

---

#### 10. 네이티브 앱 전환 연구
**상태:** ⏳ 대기  
**예상 시간:** 조사 2-3일

**조사 필요:**
- PWA → Android APK 변환 (PWABuilder, Bubblewrap)
- React Native 전환 비용/시간
- Flutter 전환 가능성
- Play Store 출시 절차 및 비용

---

## 🎯 작업 우선순위 요약

```
🔴 P0 (긴급): 3개 - 모바일 실제 테스트 피드백
  1. X 버튼 window.close()
  2. 아이폰 경고 페이지 제거
  3. iOS 로그인 팝업 문제

🟡 P1 (중요): 3개 - UX 개선
  4. 범용 브라우저 지원
  5. Featured 캐시 관리
  6. 오프라인 강화

🟢 P2 (개선): 4개 - 추가 기능
  7. PC 레이아웃
  8. OG 태그
  9. SEO
  10. 결제 시스템

🔵 P3 (장기): 2개 - 백로그
  11. 다국어 지원
  12. 네이티브 앱
```

---

## 🚨 중요 원칙

1. **모든 수정은 사용자 승인 후 진행** ⚠️
2. **단계별 충분한 소통** 💬
3. **테스트 후 배포** ✅
4. **롤백 가능성 항상 고려** 🔄
5. **99% 모바일 최적화 우선** 📱

---

## 🎓 후임 개발자를 위한 핵심 주의사항

> **⚠️ AI 개발자 필독!**  
> 이 섹션은 3개월간의 시행착오와 실제 사용자 피드백으로 확립된 핵심 원칙들입니다.  
> **절대 간과하지 마세요!**

---

### 1. 🔴 **이 앱은 React가 아닙니다!**

**가장 흔한 실수:** "React 앱이겠거니" 착각

**실제:**
- ✅ **Vanilla JavaScript** (순수 JS + IndexedDB)
- ❌ React, Vue, Angular 등 프레임워크 없음
- ❌ npm 패키지에 React 있어도 **Frontend는 Vanilla JS**

**이유:**
1. 모바일 성능 최적화 (번들 사이즈 최소화)
2. PWA 오프라인 지원 단순화
3. 카메라 권한 및 라이브뷰 상태 관리 용이

**주의:**
- `client/` 폴더 없음 → `public/index.html`, `public/index.js` 직접 수정
- React Hook, JSX, Virtual DOM 개념 적용 불가
- 모든 DOM 조작은 `document.querySelector()` 직접 사용

---

### 2. 📱 **모든 결정은 모바일 우선!**

**핵심 통계:**
- 99% 모바일 사용자
- 90% 카카오톡 인앱 브라우저
- 90% 삼성 갤럭시 (안드로이드)

**개발 우선순위:**
1. **삼성 갤럭시 + 카카오톡** (최우선!)
2. 아이폰 Safari
3. PC Chrome (최하위)

**실전 예시:**
```javascript
// ❌ 잘못된 접근: PC 먼저 고려
if (isDesktop) {
    // PC 로직
} else {
    // 모바일 로직
}

// ✅ 올바른 접근: 모바일 먼저 고려
if (isMobile()) {
    // 모바일 로직 (최우선!)
} else {
    // PC 로직
}
```

**테스트 순서:**
1. 삼성폰 실제 기기 테스트 (가장 중요!)
2. 아이폰 Safari
3. PC Chrome (Playwright 자동화)

---

### 3. 🎥 **카메라 라이브뷰 상태 보존이 생명줄!**

**핵심 문제:**
- 카메라 권한은 페이지 새로고침 시 **항상 손실**
- 삼성폰은 특히 카메라 권한 재요청에 민감

**해결책: window.open() 사용**
```javascript
// ❌ 절대 금지: 페이지 이동 (카메라 권한 손실!)
window.location.href = '/other-page';

// ✅ 필수: 새 창 열기 (원래 페이지 유지!)
window.open('/other-page', '_blank');
```

**적용 사례:**
- Featured Gallery 클릭 → `window.open()`
- OAuth 로그인 → `window.open()`
- 설정/대시보드 → `window.open()`
- 공유페이지 닫기 → `window.close()` (리다이렉트 금지!)

**예외:**
- Main 페이지(/) ↔ Archive 페이지(/#archive): 같은 페이지이므로 괜찮음

---

### 4. 💾 **HTML 파일 저장 시스템 (DB 아님!)**

**특이점:**
- 공유페이지 HTML은 **DB에 저장 안 함**
- `public/shared/` 폴더에 파일로 저장

**이유:**
- DB 크기 78% 감소 (184MB → 39MB)
- PostgreSQL 용량 절약
- 정적 파일 서빙이 더 빠름

**구조:**
```
public/
  shared/
    abcd1234.html  ← 공유페이지 HTML 파일
    efgh5678.html
    ...
```

**코드 위치:**
- `server/storage.ts` - `createSharedHtml()` 함수
- DB에는 `htmlFilePath`만 저장 (`htmlContent` 제외!)

**주의:**
- 절대 `htmlContent` 컬럼을 DB에 다시 추가하지 마세요!
- 파일 시스템 권한 확인 필요

---

### 5. 🎨 **디자인 시스템 엄격 준수 (협상 불가!)**

**절대 규칙:**
- **Primary Color:** `#4285F4` (Gemini Blue)
- **Font:** `MaruBuri` (마루부리)
- **Icons:** Heroicons (Outline/Solid)
- **Background:** `#FFFEFA` (크림색)

**금지 사항:**
- ❌ 이모지 사용 (📱, 🎯 등)
- ❌ Font Awesome, Material Icons
- ❌ 다른 Primary Color

**예외:**
- 관리자 페이지 (`admin-dashboard.html`, `user-guide.html`)
  - 영업 비밀이므로 다른 디자인 허용

**적용 범위:**
- `public/index.html` (Main/Archive 페이지)
- `server/html-template.ts` (공유페이지)
- `server/googleAuth.ts`, `server/kakaoAuth.ts` (OAuth 완료 페이지)

---

### 6. 🤖 **AI 모델 선택의 역사 (Gemini 고수!)**

**진화 과정:**
1. Claude Sonnet 3.5 → 이미지 인식 약함
2. Claude Haiku 4.5 → 비싸고 느림
3. **Gemini 2.5 Flash** ← 현재 (최종 결정!)

**Gemini 2.5 Flash 선택 이유:**
- ✅ 이미지 인식 정확도 최고
- ✅ 프롬프트 준수율 우수
- ✅ 비용 효율 6.4배 (Claude 대비)
- ✅ 응답 속도 2-2.5초 (목표 달성)

**절대 변경 금지:**
- Gemini API 코드 (`server/routes.ts` - AI 생성 로직)
- 38자 프롬프트 (응답 속도와 품질 최적화됨)

**변경 시 필요 사항:**
- 사용자 승인 필수
- 100회 이상 실제 테스트
- 비용/속도/품질 비교 보고서

---

### 7. 📸 **이미지 압축 0.9 유지 (절대 낮추지 마세요!)**

**현재 설정:**
```javascript
canvas.toDataURL('image/jpeg', 0.9); // ← 0.9 고정!
```

**역사:**
- 0.6 이하: **AI 환각 발생!** (잘못된 설명 생성)
- 0.7-0.8: 이미지 품질 저하
- **0.9: 최적점** (품질 + AI 정확도)

**실제 사례 (0.6일 때):**
- 음식 사진 → "고양이"로 인식
- 건물 사진 → "자연 풍경"으로 착각
- GPS 정보 → 완전히 다른 위치 추측

**절대 변경 금지:**
- `public/index.js` - 이미지 업로드 압축 로직

---

### 8. 📋 **선택 순서 보존 (Array vs Set)**

**특이점:**
- 공유/삭제 기능에서 **클릭 순서 중요!**

**올바른 구현:**
```javascript
// ✅ Array 사용 (순서 보존!)
let selectedItemIds = [];

function handleItemSelect(id) {
    if (selectedItemIds.includes(id)) {
        selectedItemIds = selectedItemIds.filter(x => x !== id);
    } else {
        selectedItemIds.push(id); // 순서 보존!
    }
}
```

**잘못된 구현:**
```javascript
// ❌ Set 사용 (순서 손실!)
let selectedItemIds = new Set();

function handleItemSelect(id) {
    if (selectedItemIds.has(id)) {
        selectedItemIds.delete(id);
    } else {
        selectedItemIds.add(id); // 순서 없음!
    }
}
```

**이유:**
- 사용자가 클릭한 순서대로 공유페이지에 표시
- 쇼핑 카트처럼 순서가 중요한 UX

**코드 위치:**
- `public/index.js` - `selectedItemIds` 변수

---

### 9. 🗺️ **Google Maps API 동적 로딩 (정적 import 금지!)**

**특이점:**
- Google Maps API를 **<script> 태그로 동적 로딩**

**이유:**
- API Key 보안 (환경변수 사용)
- 필요할 때만 로딩 (성능 최적화)
- Vite 빌드 충돌 방지

**올바른 구현:**
```javascript
// ✅ 동적 로딩
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
document.head.appendChild(script);
```

**잘못된 구현:**
```html
<!-- ❌ 정적 import -->
<script src="https://maps.googleapis.com/maps/api/js?key=..."></script>
```

**코드 위치:**
- `public/index.js` - GPS 처리 로직

---

### 10. 🔒 **수정금지 코드 구역 (절대 건드리지 마세요!)**

**표시 방법:**
```javascript
// ═══════════════════════════════════════════════════════════════
// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT USER APPROVAL
// 사용자 승인 없이 절대 수정 금지 - AI 및 모든 개발자 주의
// 
// [기능 설명]
// [작업 날짜]
// Verified: YYYY-MM-DD | Status: Production-Ready ✅
// ═══════════════════════════════════════════════════════════════
```

**현재 수정금지 구역:**
1. 카카오톡 Chrome 리다이렉트 (`server/html-template.ts`)
2. Featured Gallery 캐싱 (`public/index.js`)
3. HTML 파일 저장 시스템 (`server/storage.ts`)
4. Featured 리턴 버튼 (`server/storage.ts`)
5. 관리자 대시보드 API (`server/routes.ts`)
6. 공유/삭제 로직 (`public/index.js`)
7. TTS 음성 재생 (`public/index.js`)
8. **모바일 OAuth 시스템** (`server/googleAuth.ts`, `server/kakaoAuth.ts`, `public/index.js`)

**수정 필요 시:**
1. 사용자에게 승인 요청
2. 기존 로직 백업
3. 충분한 테스트 (100회 이상)
4. 롤백 계획 수립

---

### 11. 🎯 **개발 의도 이해하기**

**이 앱이 다른 앱과 다른 점:**

1. **PWA 최적화**
   - 오프라인 지원 필수
   - Service Worker 활용
   - IndexedDB 로컬 저장

2. **극단적 모바일 최적화**
   - 99% 모바일 사용자
   - 카메라/GPS 핵심 기능
   - 터치 친화적 UI

3. **AI 중심 UX**
   - 사진 → AI 설명 자동 생성
   - TTS 음성 읽어주기
   - 위치 기반 문화 정보

4. **바이럴 성장 전략**
   - 공유 기능 최우선
   - 카카오톡 최적화
   - 단축 URL (8자리)

5. **비즈니스 모델**
   - 크레딧 기반 결제 (준비중)
   - Featured Gallery 프리미엄
   - 다국어 지원 (ChatGPT 연동)

---

### 12. ⚡ **빠른 디버깅 체크리스트**

**문제 발생 시 순서대로 확인:**

1. **카메라 권한 문제?**
   - → `window.location.href` 사용했나? → `window.open()` 변경!

2. **공유페이지 안 보임?**
   - → `public/shared/` 폴더 파일 확인
   - → DB에 `htmlFilePath` 있나?

3. **AI 이상한 설명 생성?**
   - → 이미지 압축 0.6 이하? → 0.9로 변경!
   - → Gemini API 키 만료? → 환경변수 확인!

4. **Featured Gallery 안 뜸?**
   - → localStorage 캐시 확인 (5분)
   - → `/api/featured` 응답 확인

5. **OAuth 로그인 안 됨?**
   - → `window.open()` 팝업 차단? → 사용자에게 허용 안내
   - → 환경변수 `GOOGLE_CLIENT_ID` 확인

6. **모바일에서 이상한 동작?**
   - → 삼성폰 실제 기기 테스트! (에뮬레이터 신뢰 금지)
   - → 카카오톡 인앱 브라우저 테스트!

---

### 13. 📞 **사용자 소통 원칙**

**사용자는 비개발자입니다!**

**절대 금지:**
- ❌ 기술 용어 사용 (API, DB, Cache, DOM 등)
- ❌ "코드 수정했어요" 같은 말
- ❌ 도구 이름 언급 (grep, bash, read 등)

**대신 사용:**
- ✅ "로그인 기능을 개선했습니다"
- ✅ "이미지가 더 빠르게 열립니다"
- ✅ "문제를 해결했습니다"

**소통 스타일:**
- 짧고 명확하게
- 결과 중심으로 설명
- 전문 용어 → 일상 언어 번역

---

### 14. 🚀 **배포 전 최종 체크리스트**

**필수 확인 사항:**

- [ ] 삼성폰 실제 기기 테스트 완료
- [ ] 카카오톡 인앱 브라우저 테스트 완료
- [ ] 아이폰 Safari 테스트 완료
- [ ] Featured Gallery 로딩 확인
- [ ] OAuth 로그인/로그아웃 확인
- [ ] 공유 기능 정상 작동
- [ ] AI 설명 생성 품질 확인
- [ ] TTS 음성 재생 확인
- [ ] 카메라 권한 유지 확인
- [ ] 수정금지 코드 건드리지 않았는지 확인
- [ ] TODOS.md 업데이트 완료
- [ ] replit.md 업데이트 완료

**테스트 시나리오:**
1. 메인 페이지 → 카메라 촬영 → AI 설명 생성 → 저장
2. 보관함 → Featured Gallery 클릭 → 새 창 열림 → 닫기 → 카메라 유지 확인
3. 로그인 → Featured Gallery 클릭 → 공유페이지 열림
4. 보관함 → 이미지 선택 → 공유 → 공유페이지 생성 → 카카오톡 공유

---

**이 주의사항을 반드시 숙지하세요!**  
3개월간의 시행착오를 10분으로 줄일 수 있습니다. 🎯

---

## 📊 프로젝트 현황

**통계:**
- 5,100+ 조회수
- 566 방문자
- 바이럴 성장 중

**핵심 사용자:**
- 99% 모바일
- 90% 카카오톡 링크
- 90% 삼성 안드로이드

**기술 스택:**
- Frontend: Vanilla JavaScript (React 아님!)
- Backend: Express + TypeScript
- Database: PostgreSQL (Neon)
- AI: Google Gemini 2.5 Flash
- Auth: Replit Auth + Google OAuth + Kakao OAuth

**디자인 시스템:**
- Primary Color: Gemini Blue (#4285F4)
- Font: MaruBuri (마루부리)
- Icons: Heroicons (이모지 금지!)
- Background: #FFFEFA (크림색)

---

## 🚀 Phase 1-5: 바이럴 성장 대비 확장 로드맵

> **작성일:** 2025-11-13  
> **목적:** 26개 → 100개 → 1000개 공유페이지 확장 준비  
> **핵심 타겟:** 📱 모바일 99%, 카카오톡 90%, 삼성 안드로이드 90%

**배경:**
- 현재: 26개 공유페이지 (사용자들이 방법을 모르는 상태)
- 예상: 매주 30-50개 신규 공유페이지 생성 (가이드 업무)
- 문제: 공유페이지 속성 변경 시 일괄 적용 불가 → 수동 재작성 필요
- 해결: 템플릿 시스템 + 유입 추적 + 크레딧 보상 시스템

**총 예상 시간:** 14-16시간 (2일)

---

### ✅ Phase 1: 템플릿 시스템 구축 (최우선!)

**📌 목표:**  
공유페이지 JavaScript/CSS를 외부 파일로 분리 → 속성 변경 시 일괄 적용 가능

**⏱ 예상 시간:** 3-4시간

**📱 모바일 고려사항:**
- Service Worker 캐싱 전략 유지 (Cache-First)
- 카카오톡 Chrome 강제 리다이렉트 로직 보존 (⚠️ 수정 금지!)
- 음성 정지 로직 보존 (⚠️ 수정 금지!)
- 삼성폰 Web Audio API 호환성 확인

---

#### 🔧 작업 체크리스트:

**1. 공통 JavaScript 파일 생성**
- [ ] `public/shared-template/v2.js` 파일 생성
- [ ] 기존 HTML 내 JavaScript 코드 분리
  - [ ] 갤러리 뷰 로직
  - [ ] 상세 뷰 로직
  - [ ] 음성 재생/정지 로직
  - [ ] 리턴 버튼 로직
  - [ ] 홈 버튼 로직
- [ ] 데이터 주입 인터페이스 구현
  ```javascript
  // window.GUIDE_DATA로 개별 데이터 받기
  const guideData = window.GUIDE_DATA || [];
  ```

**2. 공통 CSS 파일 생성**
- [ ] `public/shared-template/v2.css` 파일 생성
- [ ] Tailwind CDN 유지 (기존 스타일 보존)
- [ ] 공유페이지 전용 스타일 분리

**3. 템플릿 HTML 생성 함수 수정**
- [ ] `server/html-template.ts` 수정
  - [ ] `<script src="/shared-template/v2.js">` 참조
  - [ ] `<link href="/shared-template/v2.css">` 참조
  - [ ] 개별 데이터만 JSON으로 삽입
    ```html
    <script>
      window.GUIDE_DATA = [...];
    </script>
    ```

**4. 버전 관리 시스템 구축**
- [ ] DB 스키마 업데이트: `sharedHtmlPages` 테이블
  ```typescript
  templateVersion: varchar  // "v1", "v2", "v3"
  ```
- [ ] `npm run db:push --force` 실행 (스키마 동기화)
- [ ] 레거시 지원: v1 템플릿 유지

**5. 마이그레이션 API 구현**
- [ ] `POST /api/admin/migrate-shared-pages` 엔드포인트 추가
  - [ ] 관리자 인증 미들웨어 (`requireAdmin`)
  - [ ] v1 → v2 일괄 업그레이드 로직
  - [ ] 진행 상황 로깅
- [ ] 기존 26개 공유페이지 마이그레이션

**6. 보호 코드 검증**
- [ ] 카카오톡 Chrome 리다이렉트 로직 보존 확인
  - [ ] UserAgent 감지
  - [ ] Intent URL 실행
  - [ ] 노란 경고 배너
- [ ] 음성 정지 로직 보존 확인
  - [ ] `stopAudio()` 함수
  - [ ] 200ms setTimeout
  - [ ] `synth.pause()` + `synth.cancel()`

---

#### 🧪 테스트 방법 (실제 배포본):

**⚠️ 중요: 로컬 서버 테스트 금지! Replit 배포본만 테스트**

**1. PC 테스트 (Chrome)**
- [ ] Featured Gallery에서 공유페이지 클릭 → 새 창 열림
- [ ] 갤러리 뷰 정상 렌더링 확인
- [ ] 이미지 클릭 → 상세 뷰 전환 확인
- [ ] 음성 재생 버튼 클릭 → TTS 작동 확인
- [ ] 뒤로가기 버튼 → 갤러리로 복귀 + 음성 정지 확인
- [ ] X 버튼 클릭 → `window.close()` 작동 확인

**2. 모바일 테스트 (실제 기기 필수!)**
- [ ] **아이폰 Safari:**
  - [ ] 공유페이지 열림 확인
  - [ ] 음성 재생 확인
  - [ ] 홈 버튼 클릭 → 앱으로 이동 + 음성 정지
- [ ] **삼성폰 Chrome:**
  - [ ] 일반 링크로 공유페이지 열림
  - [ ] 갤러리/상세 뷰 정상 작동
  - [ ] 음성 재생 확인

**3. 카카오톡 인앱 브라우저 테스트 (삼성폰)**
- [ ] 카카오톡에서 공유 링크 클릭
- [ ] 노란 경고 배너 표시 확인
- [ ] 0.5초 후 Chrome 자동 실행 확인
- [ ] Chrome에서 공유페이지 정상 렌더링 확인
- [ ] 음성 재생 작동 확인

**4. 오프라인 테스트**
- [ ] 공유페이지 1회 접속 (Service Worker 캐시)
- [ ] 비행기 모드 ON
- [ ] 공유페이지 재접속 → 정상 표시 확인
- [ ] 음성 재생 작동 확인

**5. 템플릿 업데이트 테스트**
- [ ] `v2.js` 파일 수정 (예: console.log 추가)
- [ ] 기존 공유페이지 새로고침
- [ ] 변경사항 즉시 반영 확인 ✅

**6. 마이그레이션 테스트**
- [ ] 관리자 대시보드 접속 (`/admin-dashboard.html`)
- [ ] 비밀번호 입력 (1234)
- [ ] "v1 → v2 마이그레이션" 버튼 클릭
- [ ] 26개 페이지 일괄 업그레이드 확인
- [ ] Featured Gallery에서 샘플 확인

---

#### 📂 수정 파일:

```
public/
  └── shared-template/
      ├── v2.js         # 신규 - 공통 JavaScript
      └── v2.css        # 신규 - 공통 CSS

server/
  ├── html-template.ts  # 수정 - 템플릿 참조 로직
  └── routes.ts         # 추가 - 마이그레이션 API

shared/
  └── schema.ts         # 수정 - templateVersion 컬럼 추가
```

---

### ✅ Phase 2: 유입 추적 시스템 (레퍼럴)

**📌 목표:**  
공유페이지를 통한 신규 유입 추적 → 레퍼럴 마케팅 데이터 수집

**⏱ 예상 시간:** 2시간

**📱 모바일 고려사항:**
- localStorage 사용 (모든 브라우저 지원)
- 카카오톡 인앱 브라우저 → Chrome 전환 시에도 유지
- 쿠키 대신 localStorage (삼성폰 호환성)

---

#### 🔧 작업 체크리스트:

**1. DB 스키마 업데이트**
- [ ] `users` 테이블 수정
  ```typescript
  referralCode: varchar       // 유입된 공유페이지 ID (예: "abc123")
  referrerId: varchar         // 공유페이지 생성자 ID
  referralDate: timestamp     // 유입 날짜
  ```
- [ ] `npm run db:push --force` 실행

**2. 공유페이지 유입 추적 코드 추가**
- [ ] `server/html-template.ts` 수정
  ```javascript
  // 공유페이지 접속 시
  const shareId = '{{SHARE_ID}}';
  localStorage.setItem('referral_code', shareId);
  ```
- [ ] v2.js에 추적 코드 추가 (템플릿 시스템 활용!)

**3. 회원가입 시 유입 정보 저장**
- [ ] `server/googleAuth.ts` 수정
  - [ ] OAuth 완료 페이지에서 `localStorage.getItem('referral_code')` 읽기
  - [ ] postMessage로 부모 창에 전달
- [ ] `server/kakaoAuth.ts` 동일 수정
- [ ] `public/index.js` - OAuth 콜백 수신 시 DB 저장
  ```javascript
  const referralCode = localStorage.getItem('referral_code');
  await fetch('/api/user/referral', {
    method: 'POST',
    body: JSON.stringify({ referralCode })
  });
  ```

**4. 유입 정보 API 구현**
- [ ] `POST /api/user/referral` 엔드포인트 추가
  - [ ] 인증된 사용자의 referralCode 업데이트
  - [ ] 공유페이지 생성자 ID 조회 및 저장
- [ ] `GET /api/user/referral-stats` (관리자용)
  - [ ] 공유페이지별 유입 수 조회
  - [ ] 유료 전환율 조회

---

#### 🧪 테스트 방법 (실제 배포본):

**1. 유입 시나리오 테스트**
- [ ] 로그아웃 상태에서 공유페이지 접속
- [ ] 브라우저 개발자 도구 → localStorage 확인
  - [ ] `referral_code` 존재 확인
- [ ] "앱 시작하기" 버튼 클릭 → 보관함 이동
- [ ] Featured Gallery 클릭 → 인증 모달 표시
- [ ] Google 로그인 클릭
- [ ] 로그인 완료 후 보관함 복귀
- [ ] 관리자 대시보드 → 유입 통계 확인
  - [ ] 해당 공유페이지의 유입 수 +1 확인

**2. 카카오톡 유입 테스트 (삼성폰)**
- [ ] 카카오톡에서 공유 링크 전송
- [ ] 친구가 링크 클릭 → Chrome 자동 실행
- [ ] localStorage에 referral_code 저장 확인
- [ ] 회원가입 진행
- [ ] DB에 referralCode 저장 확인

**3. 크로스 브라우저 테스트**
- [ ] 아이폰 Safari: 공유페이지 → 앱 → 로그인
- [ ] 삼성폰 Chrome: 동일 시나리오
- [ ] PC Chrome: 동일 시나리오
- [ ] 모든 환경에서 유입 정보 정상 저장 확인

---

#### 📂 수정 파일:

```
server/
  ├── html-template.ts   # 수정 - localStorage 추적 코드
  ├── googleAuth.ts      # 수정 - referral 정보 전달
  ├── kakaoAuth.ts       # 수정 - referral 정보 전달
  └── routes.ts          # 추가 - 유입 API

public/
  ├── index.js           # 수정 - referral 저장 로직
  └── shared-template/
      └── v2.js          # 수정 - 추적 코드 추가

shared/
  └── schema.ts          # 수정 - users 테이블 컬럼 추가
```

---

### ✅ Phase 3: 크레딧 시스템

**📌 목표:**  
크레딧 차감/적립 시스템 구현 → 비즈니스 모델 기반 마련

**⏱ 예상 시간:** 3시간

**📱 모바일 고려사항:**
- 크레딧 잔액 표시 (보관함 상단)
- 터치 친화적 크레딧 충전 UI
- 모바일 결제 UX 고려 (Phase 4 준비)

---

#### 🔧 작업 체크리스트:

**1. DB 스키마 업데이트**
- [ ] `users` 테이블 - credits 컬럼 확인 (이미 존재)
- [ ] `creditTransactions` 테이블 생성
  ```typescript
  id: varchar (UUID)
  userId: varchar → users.id
  amount: integer            // +10 (적립) or -10 (차감)
  type: varchar              // earn, spend, referral, purchase
  description: text          // "AI 분석", "신규 유입 보상"
  relatedId: varchar         // 관련 가이드/공유페이지 ID
  createdAt: timestamp
  ```
- [ ] `npm run db:push --force` 실행

**2. 크레딧 차감 로직 구현**
- [ ] AI 분석 시 크레딧 차감 (10 크레딧)
  - [ ] `POST /api/gemini` 엔드포인트 수정
  - [ ] 요청 전 잔액 확인
  - [ ] 분석 완료 후 차감 + 트랜잭션 기록
- [ ] 가이드 저장 시 크레딧 차감 (3 크레딧)
  - [ ] `POST /api/guides` 엔드포인트 수정
- [ ] 공유페이지 생성 시 크레딧 차감 (100 크레딧)
  - [ ] `POST /api/share/create` 엔드포인트 수정

**3. 크레딧 적립 로직 구현**
- [ ] 신규 가입자 무료 크레딧 (430 크레딧)
  - [ ] `server/googleAuth.ts` - 첫 로그인 시 지급
  - [ ] `server/kakaoAuth.ts` - 첫 로그인 시 지급
- [ ] 레퍼럴 보상 (Phase 2 연동)
  - [ ] 신규 유입: 10 크레딧
  - [ ] 유료 전환: 17 크레딧

**4. 크레딧 API 구현**
- [ ] `GET /api/user/credits` - 잔액 조회
- [ ] `GET /api/user/transactions` - 거래 내역
- [ ] `POST /api/user/credits/adjust` - 관리자 수동 조정

**5. UI 업데이트**
- [ ] 보관함 상단에 크레딧 잔액 표시
  ```html
  <div id="credit-display">
    💳 잔액: 420 크레딧
  </div>
  ```
- [ ] 크레딧 부족 시 경고 모달
- [ ] 충전 버튼 (Phase 4 연결)

---

#### 🧪 테스트 방법 (실제 배포본):

**1. 신규 가입자 무료 크레딧 테스트**
- [ ] 새 계정으로 Google 로그인
- [ ] 보관함 접속 → 크레딧 잔액 확인
  - [ ] 430 크레딧 표시 확인
- [ ] 관리자 대시보드 → 거래 내역 확인
  - [ ] "신규 가입 보너스" 기록 확인

**2. 크레딧 차감 테스트 - AI 분석**
- [ ] 크레딧 잔액 기록 (예: 430)
- [ ] 이미지 업로드 → AI 분석
- [ ] AI 분석 완료 후 잔액 확인
  - [ ] 420 크레딧 (430 - 10) 확인
- [ ] 거래 내역 확인
  - [ ] "AI 분석" -10 크레딧 기록

**3. 크레딧 차감 테스트 - 공유페이지 생성**
- [ ] 보관함에서 이미지 3개 선택
- [ ] 공유 버튼 클릭 → 제목 입력
- [ ] 공유페이지 생성 완료
- [ ] 잔액 확인
  - [ ] 320 크레딧 (420 - 100) 확인
- [ ] 거래 내역 확인
  - [ ] "공유페이지 생성" -100 크레딧 기록

**4. 크레딧 부족 테스트**
- [ ] 관리자 대시보드에서 크레딧 50으로 조정
- [ ] 공유페이지 생성 시도
- [ ] 에러 모달 표시 확인
  - [ ] "크레딧이 부족합니다. 충전해주세요."
- [ ] 충전 버튼 표시 확인

**5. 모바일 UI 테스트**
- [ ] **삼성폰:** 크레딧 잔액 표시 크기/위치 확인
- [ ] **아이폰:** 동일 확인
- [ ] 터치 영역 크기 적절한지 확인

---

#### 📂 수정 파일:

```
server/
  ├── routes.ts          # 수정 - 크레딧 차감/적립 로직
  ├── googleAuth.ts      # 수정 - 신규 가입 크레딧 지급
  └── kakaoAuth.ts       # 수정 - 신규 가입 크레딧 지급

public/
  ├── index.html         # 수정 - 크레딧 UI 추가
  └── index.js           # 수정 - 크레딧 API 호출

shared/
  └── schema.ts          # 추가 - creditTransactions 테이블
```

---

### ✅ Phase 4: 결제 시스템 (Stripe)

**📌 목표:**  
크레딧 충전 기능 구현 → 수익화

**⏱ 예상 시간:** 4-5시간

**📱 모바일 고려사항:**
- Stripe Mobile SDK 활용
- 카카오페이/삼성페이 연동 검토
- 터치 친화적 결제 UI
- 카카오톡 인앱 브라우저에서 결제 가능 여부 확인

---

#### 🔧 작업 체크리스트:

**1. Stripe Integration 설정**
- [ ] Replit Integrations에서 Stripe 검색
  ```
  search_integrations(query="stripe payment")
  ```
- [ ] Stripe Integration 추가
  - [ ] API 키 자동 관리
  - [ ] Webhook 자동 설정
- [ ] 환경변수 확인
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`

**2. 충전 패키지 정의**
- [ ] DB 스키마: `creditPackages` 테이블
  ```typescript
  id: varchar
  name: text              // "10유로 패키지"
  price: integer          // 1500 (15,000원 = 센트 단위)
  credits: integer        // 1390
  currency: varchar       // "EUR"
  isActive: boolean
  ```
- [ ] 기본 패키지 생성 (10유로 = 1,390 크레딧)

**3. Stripe Checkout API 구현**
- [ ] `POST /api/payment/create-checkout` 엔드포인트
  - [ ] 패키지 선택
  - [ ] Stripe Checkout Session 생성
  - [ ] 성공/실패 URL 설정
- [ ] `GET /api/payment/success` - 결제 완료 페이지
- [ ] `GET /api/payment/cancel` - 결제 취소 페이지

**4. Webhook 처리**
- [ ] `POST /api/payment/webhook` 엔드포인트
  - [ ] `checkout.session.completed` 이벤트 처리
  - [ ] 사용자 크레딧 증가
  - [ ] 거래 내역 기록 (type: "purchase")

**5. UI 구현**
- [ ] 충전 버튼 클릭 시 패키지 선택 모달
  ```html
  <div id="payment-modal">
    <h2>크레딧 충전</h2>
    <div class="package">
      <h3>10유로 패키지</h3>
      <p>1,390 크레딧</p>
      <button>충전하기</button>
    </div>
  </div>
  ```
- [ ] Stripe Checkout 페이지로 리다이렉트

---

#### 🧪 테스트 방법 (실제 배포본):

**⚠️ 중요: Stripe Test Mode 사용! 실제 결제 금지**

**1. Stripe Test Mode 설정**
- [ ] Stripe Dashboard → Test Mode 활성화
- [ ] 테스트 카드 번호 준비
  - [ ] 성공: `4242 4242 4242 4242`
  - [ ] 실패: `4000 0000 0000 0002`

**2. PC 결제 테스트**
- [ ] 보관함 → 크레딧 충전 버튼 클릭
- [ ] 패키지 선택 모달 표시 확인
- [ ] "10유로 패키지" 선택
- [ ] Stripe Checkout 페이지로 리다이렉트
- [ ] 테스트 카드 입력 → 결제 완료
- [ ] 성공 페이지로 리다이렉트
- [ ] 크레딧 잔액 증가 확인 (+1,390)
- [ ] 거래 내역 확인 ("크레딧 구매" +1,390)

**3. 모바일 결제 테스트 (삼성폰)**
- [ ] Chrome에서 충전 버튼 클릭
- [ ] Stripe Checkout 모바일 UI 확인
- [ ] 카드 정보 입력 (터치 키보드)
- [ ] 결제 완료 → 성공 페이지
- [ ] 크레딧 증가 확인

**4. 카카오톡 인앱 브라우저 테스트**
- [ ] 카카오톡에서 앱 링크 클릭
- [ ] Chrome 자동 실행
- [ ] 충전 버튼 클릭
- [ ] Stripe Checkout 정상 작동 확인
  - [ ] ⚠️ 카카오톡 인앱에서는 결제 차단될 수 있음
  - [ ] Chrome 전환 후 결제 진행

**5. Webhook 테스트**
- [ ] Stripe Dashboard → Webhooks → Test
- [ ] `checkout.session.completed` 이벤트 전송
- [ ] 서버 로그 확인 (Webhook 수신 확인)
- [ ] 크레딧 증가 확인

**6. 에러 처리 테스트**
- [ ] 결제 실패 카드로 시도
- [ ] 에러 메시지 표시 확인
- [ ] 크레딧 변동 없음 확인

---

#### 📂 수정 파일:

```
server/
  ├── routes.ts          # 추가 - 결제 API
  └── stripe.ts          # 신규 - Stripe 로직

public/
  ├── index.html         # 수정 - 충전 모달 UI
  ├── index.js           # 수정 - 충전 로직
  └── payment-success.html  # 신규 - 결제 완료 페이지

shared/
  └── schema.ts          # 추가 - creditPackages 테이블
```

---

### ✅ Phase 5: 보상 대시보드

**📌 목표:**  
가이드(사용자)가 레퍼럴 보상 현황 확인 → 바이럴 마케팅 활성화

**⏱ 예상 시간:** 2시간

**📱 모바일 고려사항:**
- 모바일 우선 대시보드 디자인
- 차트 라이브러리: Chart.js (반응형)
- 터치 스크롤 최적화

---

#### 🔧 작업 체크리스트:

**1. 보상 통계 API 구현**
- [ ] `GET /api/user/referral-dashboard` 엔드포인트
  - [ ] 내가 만든 공유페이지 목록
  - [ ] 각 공유페이지별 유입 수
  - [ ] 총 유입 수
  - [ ] 유료 전환 수
  - [ ] 누적 보상 크레딧
  - [ ] 최근 7일 유입 추이

**2. 대시보드 UI 구현**
- [ ] `public/referral-dashboard.html` 신규 파일
  - [ ] Gemini Blue 디자인
  - [ ] MaruBuri 폰트
  - [ ] Heroicons 사용
- [ ] 대시보드 구성 요소:
  ```html
  <!-- KPI 카드 -->
  <div class="kpi-cards">
    <div class="card">📊 총 유입: 89명</div>
    <div class="card">💳 유료 전환: 12명</div>
    <div class="card">💰 누적 보상: 204 크레딧</div>
  </div>
  
  <!-- 공유페이지 목록 -->
  <div class="share-list">
    <h3>내 공유페이지</h3>
    <div class="share-item">
      <p>베르사유 베스트 20</p>
      <p>유입: 35명 | 전환: 5명 | 보상: 85 크레딧</p>
    </div>
  </div>
  
  <!-- 일별 유입 차트 -->
  <canvas id="referral-chart"></canvas>
  ```

**3. Chart.js 연동**
- [ ] Chart.js CDN 추가
- [ ] 일별 유입 추이 그래프
  - [ ] 최근 7일 데이터
  - [ ] 반응형 차트

**4. 보관함에서 대시보드 링크 추가**
- [ ] 설정 페이지에 "내 보상 현황" 버튼 추가
- [ ] `window.open('/referral-dashboard.html')` 방식

---

#### 🧪 테스트 방법 (실제 배포본):

**1. 대시보드 접속 테스트**
- [ ] 보관함 → 설정 → "내 보상 현황" 버튼 클릭
- [ ] 새 창에서 대시보드 열림
- [ ] 로그인 상태 유지 확인

**2. 통계 표시 테스트**
- [ ] KPI 카드 정상 표시
  - [ ] 총 유입 수
  - [ ] 유료 전환 수
  - [ ] 누적 보상 크레딧
- [ ] 공유페이지 목록 정상 표시
  - [ ] 제목, 유입 수, 보상 크레딧

**3. 차트 렌더링 테스트**
- [ ] 일별 유입 추이 그래프 표시
- [ ] 반응형 확인 (모바일/PC)

**4. 모바일 UI 테스트 (삼성폰)**
- [ ] 대시보드 모바일 레이아웃 확인
- [ ] KPI 카드 터치 스크롤
- [ ] 차트 터치 확대/축소
- [ ] 가독성 확인 (MaruBuri 폰트)

**5. 실시간 데이터 테스트**
- [ ] 새 계정으로 공유페이지 통해 유입
- [ ] 대시보드 새로고침
- [ ] 유입 수 +1 확인
- [ ] 차트 업데이트 확인

---

#### 📂 수정 파일:

```
server/
  └── routes.ts          # 추가 - 보상 대시보드 API

public/
  ├── referral-dashboard.html  # 신규 - 보상 대시보드
  ├── index.html         # 수정 - 대시보드 링크 추가
  └── index.js           # 수정 - 대시보드 오픈 로직

shared/
  └── schema.ts          # 수정 없음 (기존 스키마 활용)
```

---

## 📋 Phase 완료 체크리스트

**전체 작업 진행 상황:**

- [ ] **Phase 1: 템플릿 시스템** (3-4시간)
  - [ ] 작업 완료
  - [ ] PC 테스트 완료
  - [ ] 모바일 테스트 완료 (삼성폰)
  - [ ] 카카오톡 테스트 완료
  - [ ] 오프라인 테스트 완료

- [ ] **Phase 2: 유입 추적** (2시간)
  - [ ] 작업 완료
  - [ ] 유입 시나리오 테스트 완료
  - [ ] 카카오톡 유입 테스트 완료 (삼성폰)
  - [ ] 크로스 브라우저 테스트 완료

- [ ] **Phase 3: 크레딧 시스템** (3시간)
  - [ ] 작업 완료
  - [ ] 신규 가입 크레딧 테스트 완료
  - [ ] 차감 로직 테스트 완료
  - [ ] 모바일 UI 테스트 완료

- [ ] **Phase 4: 결제 시스템** (4-5시간)
  - [ ] 작업 완료
  - [ ] PC 결제 테스트 완료 (Test Mode)
  - [ ] 모바일 결제 테스트 완료 (삼성폰)
  - [ ] Webhook 테스트 완료
  - [ ] 에러 처리 테스트 완료

- [ ] **Phase 5: 보상 대시보드** (2시간)
  - [ ] 작업 완료
  - [ ] 대시보드 접속 테스트 완료
  - [ ] 통계 표시 테스트 완료
  - [ ] 모바일 UI 테스트 완료 (삼성폰)
  - [ ] 실시간 데이터 테스트 완료

---

## 🚨 중요 원칙

1. **모든 테스트는 실제 배포본에서 진행** ⚠️
   - ❌ 로컬 서버 (`localhost:5000`) 테스트 금지
   - ✅ Replit 미리보기 URL 사용

2. **모바일 최우선** 📱
   - 99% 모바일 사용자
   - 90% 카카오톡 링크
   - 90% 삼성 안드로이드
   - 실제 기기 테스트 필수!

3. **보호 코드 절대 수정 금지** 🔒
   - 카카오톡 Chrome 리다이렉트
   - 음성 정지 로직
   - Featured Gallery 캐싱
   - HTML 파일 저장 시스템

4. **단계별 진행** ✅
   - Phase 1 완료 후 Phase 2 시작
   - 각 Phase 테스트 완료 후 체크
   - TODOS.md 업데이트

5. **문서화** 📝
   - 완료 시 replit.md 업데이트
   - architecture.md 업데이트
   - 새로운 보호 코드 영역 표시

---

**작업 시작 준비 완료!**  
Phase 1부터 순차적으로 진행하시겠습니까?

---

**문서 끝**
