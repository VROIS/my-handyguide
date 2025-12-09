# 내손가이드 앱 아키텍처 완전 가이드
> **작성일:** 2025-11-09  
> **최종 업데이트:** 2025-11-24  
> **목적:** AI 에이전트와 개발자가 앱 구조를 정확히 이해하고 시행착오 없이 작업하기 위함

---

## 📖 용어 통일 (Terminology) ⭐ 필독!

> **중요:** 이 앱의 모든 코드, 문서, 대화에서 아래 확정된 한국어 용어를 사용합니다.  
> **갱신일:** 2025-11-24

| 기존 혼용 용어 | ✅ 확정된 한국어 | 설명 | 위치 |
|---|---|---|---|
| **Featured / Featured Gallery** | **추천모음** | 관리자가 선정한 상위 3개 외부 공유페이지 | 보관함 페이지 상단 |
| **Guide** | **상세페이지** | 사용자가 촬영/저장한 개별 여행 가이드 | DB `guides` 테이블 |
| **Share / Share Page** | **외부 공유페이지** | 카톡/링크로 공유되는 독립 HTML 페이지 | `/s/:id` 경로, `public/shared/*.html` |
| **Dashboard** | **대시보드** | 관리자 전용 관리 페이지 (비밀번호: 1234) | `/admin-dashboard.html` |
| **Gallery** | ~~삭제~~ | 더 이상 사용하지 않음 | - |
| **Archive** | **보관함** | 사용자가 저장한 상세페이지 목록 + 추천모음 | index.html 내 archivePage |
| **Detail Page** | **상세페이지** (동일) | AI 생성 콘텐츠를 표시하는 화면 | index.html 내 detailPage |
| **Main Page** | **메인 페이지** (동일) | 카메라 라이브뷰 + 4개 입력 버튼 | index.html 내 mainPage |

### 대시보드 탭 구성 (5개)
1. **요약** - 실시간 KPI 통계
2. **공유페이지** - 외부 공유페이지 관리 + 추천모음 선정
3. **상세페이지** - 사용자 상세페이지 관리 (태그 편집 등)
4. **수익** - (준비 중)
5. **통계** - 7일 트렌드 분석

### 용어 사용 예시
- ❌ "Featured Gallery를 클릭하면..."
- ✅ "추천모음을 클릭하면..."
- ❌ "Share Page 생성"
- ✅ "외부 공유페이지 생성"
- ❌ "Guide를 저장"
- ✅ "상세페이지를 저장"

---

## 📐 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 인터페이스                         │
│                    (Vanilla JS, Tailwind CSS)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏠 Features Page (추천 갤러리)                                 │
│  📸 Main Page (카메라)                                          │
│  📝 Detail Page (상세 뷰 + 음성)                                │
│  📚 Archive Page (보관함)                                       │
│  ⚙️  Settings Page (설정)                                       │
│  🔗 Share Page (독립 HTML - 오프라인 지원)                      │
│                                                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ REST API (Express)
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│                        Backend Server                            │
│                    (Express + TypeScript)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔐 Authentication (Replit Auth, Google OAuth, Kakao OAuth)     │
│  🤖 AI Integration (Google Gemini 2.5 Flash)                    │
│  📤 File Upload (Multer + Image Compression)                    │
│  🔗 Share System (HTML Generator + Service Worker)              │
│  👑 Admin Dashboard (통계 + Featured 관리)                      │
│                                                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ Drizzle ORM
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│                     PostgreSQL Database                          │
│                         (Neon)                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 users              사용자 정보                              │
│  📝 guides             여행 가이드                              │
│  🔗 shareLinks         공유 링크 (구버전)                       │
│  📄 sharedHtmlPages    공유 HTML 페이지 (신버전)                │
│  💳 creditTransactions 크레딧 거래                              │
│  🔑 sessions           세션 저장소                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ 페이지 구조 및 네비게이션

### 1. **Features Page** (기능 설명 페이지)
**파일:** `public/index.js` (featuresPage)  
**목적:** 앱 사용법 3단계 안내 + 추천모음 표시

**주요 버튼:**
```javascript
#startCameraFromFeaturesBtn  // "바로 시작하기" → 메인 페이지(카메라) 이동
```

**화면 구성:**
1. **추천모음** (상단 3개)
   - 관리자가 선정한 외부 공유페이지 (DB `featured=true`)
   - 클릭 시 외부 공유페이지 새 창 오픈
2. **사용법 3단계** (중간)
   - 1단계: 사진 찍기
   - 2단계: AI 설명 받기
   - 3단계: 보관 및 공유
3. **바로 시작하기 버튼** (하단)
   - 메인 페이지(카메라)로 이동

**동작:**
- 이 페이지는 앱 최초 진입 시 커튼 애니메이션 다음에 자동 표시됨
- 추천모음은 비로그인 사용자도 볼 수 있음 (사용 경험 우선)

---

### 2. **Main Page** (카메라)
**파일:** `public/index.js` (mainPage)  
**목적:** 사진 촬영 및 업로드

**주요 버튼:**
```javascript
#shootBtn   // 카메라 촬영 → Detail Page (AI 분석)
#uploadBtn  // 파일 업로드 → Detail Page (AI 분석)
#micBtn     // 음성 녹음 (현재 미사용)
#archiveBtn // 보관함 → Archive Page 이동
```

**동작 플로우:**
```
1. 촬영/업로드 클릭
   ↓
2. 이미지 압축 (0.9 quality)
   ↓
3. Gemini AI 분석 (/api/gemini)
   ↓
4. Detail Page 표시 (이미지 + 설명 + 음성)
```

---

### 3. **Detail Page** (상세 뷰)
**파일:** `public/index.js` (detailPage)  
**목적:** AI 생성 콘텐츠 + 음성 재생

**주요 버튼:**
```javascript
#backBtn          // 뒤로가기 → Main Page 복귀 (음성 정지)
#audioBtn         // 음성 재생/정지 토글
#textToggleBtn    // 텍스트 오버레이 표시/숨김
#saveBtn          // IndexedDB 저장 → Archive Page 이동
```

**음성 재생 로직:**
- Web Speech API (window.speechSynthesis)
- Microsoft Heami 음성 강제 지정
- 페이지 이탈 시 자동 정지 (beforeunload 이벤트)

---

### 4. **Archive Page** (보관함 페이지) ⭐ 핵심!
**파일:** `public/index.js` (archivePage)  
**목적:** 저장된 상세페이지 관리 + 추천모음 표시 + 외부 공유페이지 생성

**화면 구성:**
1. **추천모음** (상단 3개)
   - 관리자가 선정한 외부 공유페이지
   - **클릭 시 인증 모달 표시** (충분한 사용 경험 후 인증 유도)
   - 로그인 후 외부 공유페이지 새 창 오픈
2. **내 저장 상세페이지** (중간 모자이크)
   - 사용자가 보관한 상세페이지 목록
   - 클릭 시 상세페이지 읽기 전용 모드로 표시

**주요 버튼:**
```javascript
#archiveBackBtn       // 뒤로가기 → Features Page 복귀
#profileBtn           // 프로필 (현재 미사용)
#archiveShareBtn      // 선택한 상세페이지로 외부 공유페이지 생성
#archiveDeleteBtn     // 선택한 상세페이지 삭제
#archiveSettingsBtn   // 설정 페이지 이동
```

**외부 공유페이지 생성 플로우:**
```
1. 상세페이지 1개 이상 선택 (체크박스)
   ↓
2. "공유" 버튼 클릭
   ↓
3. 제목 입력 모달
   ↓
4. POST /api/share/create
   ├─ HTML 생성 (generateShareHTML 함수)
   ├─ DB 저장 (sharedHtmlPages 테이블)
   └─ public/shared/:id.html 파일 생성
   ↓
5. 짧은 URL 반환: /s/abc12345
   ↓
6. 클립보드 복사 + 토스트 메시지
```

**⭐ 인증 모달 트리거 조건 (2025-11-24 확정)**
- **유일한 트리거:** 보관함의 추천모음(상단 3개) 클릭 시
- **이유:** 충분한 사용 경험 후 인증 유도 → 사용자 거부감 최소화
- **로그인 후 동작:** 외부 공유페이지 새 창 자동 오픈

---

### 5. **Settings Page** (설정)
**파일:** `public/index.js` (settingsPage)  
**목적:** 사용자 설정 관리

**주요 버튼:**
```javascript
#settingsBackBtn      // 뒤로가기 → Archive Page 복귀
#languageToggle       // 언어 선택 (한국어/English)
#locationToggle       // 위치 정보 사용 여부
#aiContentToggle      // AI 콘텐츠 생성 여부
#logoutBtn            // 로그아웃
#deleteAccountBtn     // 계정 삭제
```

---

### 6. **외부 공유페이지** (독립 HTML) ⭐ 핵심!
**파일:** `public/shared/:id.html` (독립 HTML)  
**접근:** `/s/:id` 경로 (예: `/s/abc12345`)  
**목적:** 카톡/링크로 공유되는 오프라인 지원 영구 여행 일기

**특징:**
- 앱 내에서는 보이지 않음 (독립 페이지)
- 카톡, 링크로만 공유 가능
- Service Worker로 오프라인 영구 보관
- 관리자는 대시보드에서 전체 목록 확인 가능

**페이지 구조:**
```html
<!-- 헤더 -->
<div class="header">
  <h1>제목</h1>
  <p>👤 발신자 이름</p>
  <p>📍 위치</p>
  <p>📅 날짜</p>
</div>

<!-- 갤러리 뷰 (기본) -->
<div id="gallery-view">
  <!-- 상세페이지 그리드 (3열 반응형) -->
  <div class="gallery-grid">
    <img> <!-- 클릭 → 상세 뷰 -->
  </div>
  
  <!-- 하단 홈 버튼 -->
  <a id="home-button">손안에 가이드 시작하기</a> ✅ 음성 정지 후 앱 이동
</div>

<!-- 상세 뷰 (hidden) -->
<div id="detail-view">
  <!-- 헤더: 뒤로가기 버튼 -->
  <button id="detail-back">←</button> ✅ 음성 정지 + 갤러리 복귀
  
  <!-- 배경 이미지 -->
  <img id="detail-bg">
  
  <!-- 텍스트 오버레이 (AI 설명) -->
  <div id="detail-text">
    <p id="detail-description"></p>
  </div>
  
  <!-- 하단 Footer -->
  <footer id="detail-footer">
    <button id="detail-audio">🔊/⏸</button>  <!-- 음성 재생/정지 (TTS) -->
    <button id="text-toggle">📄</button>      <!-- 텍스트 표시/숨김 -->
    <a id="detail-home">🏠</a>                <!-- ✅ 음성 정지 후 앱 이동 -->
  </footer>
</div>
```

**⚠️ 음성 정지 필수 버튼 (Microsoft Heami TTS)**
```javascript
#detail-back   // 갤러리 복귀 (음성 정지 O)
#detail-home   // 앱으로 이동 (음성 정지 O)
#home-button   // 갤러리 하단 홈 (음성 정지 O)
```

**Service Worker:**
- Cache-First 전략
- 오프라인 영구 보관
- `/sw-share.js` 등록

**⭐ 2025-11-24 변경사항: 관리자 편집 기능**
- 대시보드에서 제목/발신자/위치/날짜 수정 가능
- 상세페이지 순서 변경 가능 (▲▼ 버튼)
- HTML 자동 재생성 (수정 시)

---

## 🗄️ 데이터베이스 스키마

### **users** (사용자)
```typescript
id: varchar (UUID)           // 사용자 ID
email: varchar (unique)      // 이메일
firstName: varchar           // 이름
lastName: varchar            // 성
profileImageUrl: varchar     // 프로필 이미지
provider: varchar            // replit | google | kakao
preferredLanguage: varchar   // ko | en
locationEnabled: boolean     // 위치 정보 사용 여부
aiContentEnabled: boolean    // AI 콘텐츠 생성 여부
credits: integer             // 크레딧 (미래 기능)
isAdmin: boolean             // 관리자 여부
subscriptionStatus: varchar  // active | canceled
createdAt: timestamp
updatedAt: timestamp
```

### **guides** (상세페이지) ⭐ 핵심!
```typescript
id: varchar (UUID)           // 상세페이지 ID
userId: varchar → users.id   // 작성자
title: text                  // 제목
description: text            // 설명
imageUrl: text               // 이미지 경로 (Base64 또는 URL)
latitude: decimal            // GPS 위도 (EXIF 추출)
longitude: decimal           // GPS 경도 (EXIF 추출)
locationName: text           // 위치 이름 (Google Maps API)
aiGeneratedContent: text     // Gemini AI 생성 콘텐츠
tags: text[]                 // 태그 배열 (예: ['궁전', '역사'])
viewCount: integer           // 조회수
language: varchar            // ko | en
createdAt: timestamp
updatedAt: timestamp
```

**⭐ 2025-11-24 추가:**
- `tags` 필드: 관리자 대시보드에서 편집 가능 (PATCH /api/admin/guides/:id)

### **sharedHtmlPages** (외부 공유페이지) ⭐ 핵심!
```typescript
id: varchar (8자)            // 짧은 ID (abc12345)
userId: varchar → users.id   // 생성자
name: text                   // 외부 공유페이지 제목
htmlContent: text            // 완전한 HTML (DB 저장) ⭐ 2025-11-23 App Storage 마이그레이션
htmlFilePath: text           // (구버전) HTML 파일 경로 (nullable, 호환성 유지)
guideIds: text[]             // 포함된 상세페이지 ID 배열 (순서 유지)
thumbnail: text              // 썸네일 이미지
sender: text                 // 발신자 이름 (nullable)
location: text               // 위치 정보 (nullable)
date: text                   // 공유 날짜 (YYYY-MM-DD)
featured: boolean            // 추천모음 표시 여부
featuredOrder: integer       // 추천모음 순서 (1, 2, 3...)
downloadCount: integer       // 조회수
isActive: boolean            // 활성화 상태
createdAt: timestamp
updatedAt: timestamp
```

**⚠️ 중요한 변경사항:**
1. **2025-11-23:** `htmlContent` 필드로 HTML을 DB에 직접 저장 (App Storage 마이그레이션)
   - 이유: 배포 시 파일 시스템 초기화 문제 해결, 롤백 지원
   - 기존 `htmlFilePath`는 호환성 유지를 위해 nullable로 보존
2. **2025-11-24:** `PUT /api/admin/shares/:id` API로 메타데이터 편집 가능
   - 수정 가능 항목: name, sender, location, date, guideIds (순서)
   - HTML 자동 재생성 (`regenerateFeaturedHtml` 함수)

---

## 🔌 API 엔드포인트

### **인증 (Authentication)**
```
GET  /api/auth/user          사용자 정보 조회
GET  /api/auth/logout        로그아웃
GET  /auth/google            Google OAuth 리다이렉트
GET  /auth/google/callback   Google OAuth 콜백
GET  /auth/kakao             Kakao OAuth 리다이렉트 (준비 중)
GET  /auth/kakao/callback    Kakao OAuth 콜백 (준비 중)
```

### **가이드 (Guides)**
```
GET    /api/guides           사용자 가이드 목록
POST   /api/guides           가이드 생성 (이미지 업로드 포함)
GET    /api/guides/:id       가이드 상세
DELETE /api/guides/:id       가이드 삭제
```

### **공유 (Share)**
```
POST /api/share/create       공유 페이지 생성 (HTML 파일 저장)
GET  /s/:id                  공유 페이지 접속 (HTML 파일 제공)
GET  /api/share/:id          공유 페이지 데이터 조회
GET  /api/share/featured/list Featured 갤러리 목록 (5분 캐시)
```

### **AI (Gemini)**
```
POST /api/gemini             이미지 분석 + 설명 생성
```

### **관리자 (Admin)**
```
POST   /api/admin/auth                관리자 인증 (비밀번호: 1234)
GET    /api/admin/shares              외부 공유페이지 검색
GET    /api/admin/all-shares          전체 외부 공유페이지 목록
GET    /api/admin/featured            추천모음 목록
POST   /api/admin/featured/:id        추천모음 추가 (자동 순서 지정)
DELETE /api/admin/featured/:id        추천모음 제거
PUT    /api/admin/shares/:id          외부 공유페이지 편집 (제목/발신자/위치/날짜/순서) ⭐ 신규 (2025-11-24)
PATCH  /api/admin/guides/:id          상세페이지 태그 편집
GET    /api/admin/stats               통계 (사용자, 상세페이지, 외부 공유페이지, 조회수)
GET    /api/admin/analytics           7일 트렌드 분석
```

**⭐ 2025-11-24 신규 추가: 외부 공유페이지 편집 API**
- **엔드포인트:** `PUT /api/admin/shares/:id`
- **기능:**
  - 제목(name), 발신자(sender), 위치(location), 날짜(date) 수정
  - 상세페이지 순서 변경 (guideIds 배열)
  - HTML 자동 재생성 (`regenerateFeaturedHtml` 함수 활용)
- **추가 이유:** 관리자가 대시보드에서 추천모음 메타데이터를 직접 수정할 수 있도록 UX 개선
- **사용 예시:** 대시보드 → 공유페이지 탭 → 편집 버튼 → 제목/발신자/위치/날짜 수정 + 순서 변경(▲▼) → 저장

### **설정 (User Preferences)**
```
PATCH /api/user/preferences  사용자 설정 업데이트
```

### **Service Worker**
```
GET /sw-share.js             Service Worker 파일
```

---

## 🎨 주요 기능 플로우

### **1. 사진 촬영 → AI 분석 → 상세페이지 저장**
```
메인 페이지 (카메라 스탠바이)
  ↓ 촬영/업로드/음성입력
Image Compression (0.9 quality)
  ↓
POST /api/gemini (Gemini 2.5 Flash)
  ↓ AI 분석 (2-2.5초)
상세페이지 (이미지 + AI 설명 + TTS 음성)
  ↓ 저장 버튼
DB 저장 (guides 테이블) + IndexedDB 저장
  ↓
보관함 페이지 (추천모음 + 내 저장 목록)
```

### **2. 외부 공유페이지 생성 (카톡/링크 공유)**
```
보관함 페이지
  ↓ 상세페이지 1개 이상 선택
선택 모드 활성화
  ↓ 공유 버튼 클릭
제목 입력 모달
  ↓
POST /api/share/create
  ├─ generateShareHTML() 실행 (public/index.js)
  ├─ HTML 생성 (독립 HTML)
  ├─ DB 저장 (sharedHtmlPages.htmlContent 필드) ⭐ 2025-11-23 변경
  └─ 짧은 URL 반환 (/s/abc12345)
  ↓
클립보드 복사 + 토스트 메시지
  ↓
카톡/링크로 공유 가능
```

### **3. 외부 공유페이지 접속 (오프라인 지원)**
```
/s/abc12345 접속 (카톡 링크 클릭)
  ↓
Service Worker 확인
  ├─ 캐시 있음 → 즉시 표시 (0ms)
  └─ 캐시 없음 → 서버 요청
       ↓
  GET /s/:id → DB에서 HTML 조회 (htmlContent 필드)
       ↓
  Service Worker 캐시 저장
       ↓
  오프라인 영구 보관 완료
```

### **4. 추천모음 관리 (관리자 대시보드)**
```
관리자 대시보드 (/admin-dashboard.html)
  ↓ 비밀번호 입력 (1234)
POST /api/admin/auth
  ↓
공유페이지 탭
  ↓ 외부 공유페이지 검색
  ↓ 추천모음 추가 버튼
POST /api/admin/featured/:id
  ├─ featuredOrder 자동 지정 (1, 2, 3...)
  └─ DB 업데이트 (featured=true)
  ↓
앱 보관함 상단에 추천모음 표시 (localStorage 5분 캐시)
```

### **5. 외부 공유페이지 편집 (2025-11-24 신규)**
```
관리자 대시보드 → 공유페이지 탭
  ↓ 편집 버튼 클릭
편집 모달 표시
  ├─ 제목(name) 수정
  ├─ 발신자(sender) 수정
  ├─ 위치(location) 수정
  ├─ 날짜(date) 수정
  └─ 상세페이지 순서 변경 (▲▼ 버튼)
  ↓
PUT /api/admin/shares/:id
  ├─ DB 업데이트 (sharedHtmlPages 테이블)
  ├─ regenerateFeaturedHtml() 실행
  └─ HTML 재생성 (htmlContent 필드 업데이트)
  ↓
외부 공유페이지 링크로 즉시 반영 확인 가능
```

---

## 🔧 핵심 기술 스택

### **Frontend**
- **JavaScript:** Vanilla JS (No Framework)
- **CSS:** Tailwind CSS (CDN)
- **Storage:** IndexedDB (dexie.js)
- **PWA:** Service Worker (오프라인 지원)
- **음성:** Web Speech API (speechSynthesis)

### **Backend**
- **Framework:** Express.js + TypeScript
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (Neon)
- **인증:** Passport.js (Replit Auth, Google OAuth, Kakao OAuth)
- **파일 업로드:** Multer + Sharp (이미지 압축)
- **AI:** Google Gemini 2.5 Flash

### **Build Tools**
- **Frontend:** Vite
- **Backend:** ESBuild + tsx

---

## 🎯 대원칙: 상세페이지/공유페이지 표준화 (2025-12-09 확정)

> **목적:** 이 앱에 사용되는 모든 상세페이지와 공유페이지는 동일한 버전 내에서 **동일한 HTML/JS/CSS**를 사용하여 레이아웃, 버튼 위치, 동작(텍스트 하이라이트, 스크롤, 리턴, 닫힘, 음성 자동재생)을 포함하여 AI 텍스트 답변을 번역하여 지정된 음성 TTS로 사용자에게 **동일한 UI/UX**를 제공한다.
>
> **⚠️ AI 필수 준수사항:** 항상 이 원칙에 따라 컴포넌트를 만들어 공유해야 한다. 임의 수정 금지!

---

### 📄 표준 구조도 1: 상세페이지 (Detail View)

**소스 원천:** `server/standard-template.ts` → `detail-view` 섹션 (426-461줄, 855-925줄)

```
┌─────────────────────────────────────────────────────────────────┐
│                    🖼️ 배경 이미지 (z-index: 1)                   │
│                 <img class="full-screen-bg">                     │
│                 position: fixed, 100vw × 100vh                   │
│                 object-fit: cover                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              UI 레이어 (z-index: 10)                     │    │
│  │              <div class="ui-layer">                      │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │  ┌───────────────────────────────────────────────┐      │    │
│  │  │  📍 헤더 (header-safe-area)                    │      │    │
│  │  │  height: 80px                                   │      │    │
│  │  │                          ┌──────────────┐       │      │    │
│  │  │                          │ ← 리턴 버튼  │       │      │    │
│  │  │                          │ #detail-back │       │      │    │
│  │  │                          │ right: 1rem  │       │      │    │
│  │  │                          │ z-index:10001│       │      │    │
│  │  │                          └──────────────┘       │      │    │
│  │  └───────────────────────────────────────────────┘      │    │
│  │                                                          │    │
│  │  ┌───────────────────────────────────────────────┐      │    │
│  │  │  📝 콘텐츠 (content-safe-area)                 │      │    │
│  │  │  flex: 1, overflow-y: auto, z-index: 25        │      │    │
│  │  │                                                 │      │    │
│  │  │  ┌─────────────────────────────────────────┐  │      │    │
│  │  │  │  🔍 상단 입력창 (.location-info)         │  │      │    │
│  │  │  │  ┌─────────────────────────────────────┐│  │      │    │
│  │  │  │  │ 📍 이미지인 경우: 위치 정보 표시     ││  │      │    │
│  │  │  │  │    (Google Maps API로 가져온 주소)  ││  │      │    │
│  │  │  │  │                                      ││  │      │    │
│  │  │  │  │ 🎤 음성인 경우: 키워드 표시          ││  │      │    │
│  │  │  │  │    (음성 인식 결과 확인용)           ││  │      │    │
│  │  │  │  └─────────────────────────────────────┘│  │      │    │
│  │  │  │  - background: rgba(255,255,255,0.9)    │  │      │    │
│  │  │  │  - backdrop-filter: blur(8px)           │  │      │    │
│  │  │  │  - border-radius: 0.5rem                │  │      │    │
│  │  │  └─────────────────────────────────────────┘  │      │    │
│  │  │                                                 │      │    │
│  │  │  ┌─────────────────────────────────────────┐  │      │    │
│  │  │  │ <p id="detail-description"              │  │      │    │
│  │  │  │    class="readable-on-image">           │  │      │    │
│  │  │  │    AI 생성 텍스트 (번역됨)              │  │      │    │
│  │  │  │    - 문장별 하이라이트                  │  │      │    │
│  │  │  │    - 자동 스크롤                        │  │      │    │
│  │  │  │    font-size: 1.25rem                   │  │      │    │
│  │  │  │    text-shadow: 0px 2px 8px             │  │      │    │
│  │  │  └─────────────────────────────────────────┘  │      │    │
│  │  └───────────────────────────────────────────────┘      │    │
│  │                                                          │    │
│  │  ┌───────────────────────────────────────────────┐      │    │
│  │  │  🎛️ 푸터 (footer-safe-area)                   │      │    │
│  │  │  height: 100px, z-index: 30                   │      │    │
│  │  │  gap: 1.5rem, justify-content: center         │      │    │
│  │  │                                                │      │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │      │    │
│  │  │  │ 🔊 재생  │  │ 📄 텍스트 │  │ 💾 저장  │     │      │    │
│  │  │  │ #detail- │  │ #text-   │  │ #save-   │     │      │    │
│  │  │  │  audio   │  │  toggle  │  │  btn     │     │      │    │
│  │  │  │ 4rem×4rem│  │ 4rem×4rem│  │ 4rem×4rem│     │      │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘     │      │    │
│  │  └───────────────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**버튼 동작:**
| 버튼 | ID | 동작 |
|------|-----|------|
| ← 리턴 | `#detail-back` | 음성 정지 → 갤러리로 복귀 (또는 창 닫기) |
| 🔊 재생 | `#detail-audio` | TTS 재생/일시정지 토글 |
| 📄 텍스트 | `#text-toggle` | 텍스트 오버레이 표시/숨김 |
| 💾 저장 | `#save-btn` | 로컬 보관함(IndexedDB)에 저장 → 공유페이지 생성 가능 |

---

### 📄 표준 구조도 2: 공유페이지 (Share Page)

**소스 원천:** `server/standard-template.ts` → `generateStandardShareHTML()` 전체

```
┌─────────────────────────────────────────────────────────────────┐
│                    공유페이지 (독립 HTML)                        │
│                    경로: /s/:id                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ✕ 페이지 닫기 버튼 (#closeWindowBtn)                    │    │
│  │  position: fixed, top: 1rem, right: 1rem, z-index: 1000  │    │
│  │  → window.close() 실행                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📋 헤더 (메타데이터)                                    │    │
│  │  <div class="header">                                    │    │
│  │    <h1>제목</h1>                                         │    │
│  │    <p>👤 발신자 이름</p>                                 │    │
│  │    <p>📍 위치</p>                                        │    │
│  │    <p>📅 날짜</p>                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🖼️ 갤러리 뷰 (기본 표시) #gallery-view                  │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  <div class="gallery-grid">                      │    │    │
│  │  │    ┌─────┐ ┌─────┐ ┌─────┐                       │    │    │
│  │  │    │ 📷  │ │ 📷  │ │ 📷  │  ← 클릭 시 상세 뷰   │    │    │
│  │  │    └─────┘ └─────┘ └─────┘                       │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  <a id="home-button" class="app-button">         │    │    │
│  │  │    🏠 나도 만들어보기 ✨                          │    │    │
│  │  │  </a>                                             │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📖 상세 뷰 (hidden) #detail-view                        │    │
│  │  → 갤러리 아이템 클릭 시 표시                            │    │
│  │                                                          │    │
│  │  ★★★ 상세페이지 표준 구조 (구조도 1 기반, 푸터만 예외) ★★★  │    │
│  │    - 배경 이미지 (full-screen-bg)                        │    │
│  │    - 헤더: 우측 상단 리턴 버튼 (z-index: 10001)          │    │
│  │    - 상단 입력창: 위치정보/키워드 (.location-info)       │    │
│  │    - 콘텐츠: 텍스트 오버레이 (문장별 하이라이트)         │    │
│  │    - 푸터: 재생 + 텍스트 + 🏠홈 버튼 (3개) ⚠️ 예외      │    │
│  │      ※ 공유페이지는 외부용 → 저장 불가 → 앱 유입용 홈   │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📦 데이터 저장                                          │    │
│  │  <script id="app-data" type="application/json">          │    │
│  │    { imageDataUrl, description, voiceLang, ... }         │    │
│  │  </script>                                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🔊 TTS 음성 우선순위 (2025-12-07 확정, 3일간 100번 테스트 결과)

**소스 원천:** `server/standard-template.ts` → `voicePriority` (535-542줄)

| 언어 코드 | 음성 우선순위 (1순위 → 2순위 → ...) |
|-----------|--------------------------------------|
| **ko-KR** (한국어) | `Microsoft Heami` → `Yuna` |
| **en-US** (영어) | `Samantha` → `Microsoft Zira` → `Google US English` → `English` |
| **ja-JP** (일본어) | `Kyoko` → `Microsoft Haruka` → `Google 日本語` → `Japanese` |
| **zh-CN** (중국어) | `Ting-Ting` → `Microsoft Huihui` → `Google 普通话` → `Chinese` |
| **fr-FR** (프랑스어) | `Thomas` → `Microsoft Hortense` → `Google français` → `French` |
| **de-DE** (독일어) | `Anna` → `Microsoft Hedda` → `Google Deutsch` → `German` |
| **es-ES** (스페인어) | `Monica` → `Microsoft Helena` → `Google español` → `Spanish` |

**TTS 동작 원리:**
1. 번역 완료 대기 (Google Translate → MutationObserver, 3초 타임아웃)
2. voiceLang에 맞는 음성 우선순위에서 순서대로 탐색
3. 찾은 음성으로 TTS 재생 (문장별 하이라이트 + 자동 스크롤)

---

### 🔧 표준 적용 규칙

| 구분 | 상세페이지 (표준) | 공유페이지 내 상세뷰 (예외) |
|------|-------------------|------------------------------|
| **소스** | `standard-template.ts` | `standard-template.ts` (동일) |
| **상단 버튼** | ← (창 닫기) | ← (갤러리 복귀) |
| **상세 뷰** | 바로 표시 | 갤러리 클릭 시 전환 |
| **상단 입력창** | 위치정보/키워드 | 위치정보/키워드 (동일) |
| **푸터 버튼** | 재생 + 텍스트 + 💾**저장** | 재생 + 텍스트 + 🏠**홈** (예외) |
| **푸터 예외 이유** | 로컬 보관함 저장 → 공유 가능 | 외부용 → 저장 불가 → 앱 유입 |
| **TTS** | voicePriority 기반 | voicePriority 기반 (동일) |

---

## 🚨 보호된 코드 (수정 금지)

### **1. generateShareHTML() 함수 (public/index.js)**
- **위치:** 373번 줄
- **목적:** 공유 페이지 HTML 생성
- **보호 이유:** 사용자가 4시간 투자한 원본 로직
- **수정 시 영향:**
  - 공유 페이지 디자인 깨짐
  - 오프라인 기능 손상
  - 음성 재생 버그

### **2. 음성 정지 로직**
- **위치:** public/index.js
  - `stopAudio()` 함수 (841-853번 줄)
  - `#detail-back` 이벤트 (960번 줄)
  - `#detail-home` 이벤트 (1000번 줄)
  - `#home-button` 이벤트 (988번 줄)
- **핵심:** 페이지 이탈 시 `synth.pause()` + `synth.cancel()` + 200ms setTimeout

### **3. sharedHtmlPages 테이블 스키마**
- **위치:** shared/schema.ts (139-156번 줄)
- **보호 이유:** 8시간 작업 결과물
- **수정 시 영향:**
  - 짧은 URL 시스템 파괴
  - 공유 링크 생성 실패
  - DB 구조 손상

### **4. KakaoTalk In-App Browser Fix**
- **위치:** Service Worker + UserAgent 감지
- **보호 이유:** Galaxy 사용자 핵심 UX
- **기능:** 카톡 브라우저 감지 → Chrome 강제 리다이렉트

### **5. Admin Dashboard** (관리자 대시보드)
- **위치:** public/admin-dashboard.html
- **보호 이유:** 비즈니스 핵심 기능
- **비밀번호:** 1234 (변경 금지)
- **기능:**
  - 실시간 통계 (KPI)
  - 추천모음 관리
  - 외부 공유페이지 검색 및 편집 ⭐ 2025-11-24 신규
  - 상세페이지 태그 편집
  - HTML 자동 재생성

---

## 📝 작업 체크리스트

### **버튼 수정 시**
1. ✅ 어느 페이지의 버튼인지 확인 (Features/Main/Detail/Archive/Settings/Share)
2. ✅ 버튼 ID 확인 (`getElementById('xxx')`)
3. ✅ 기존 이벤트 리스너 확인 (`addEventListener`)
4. ✅ 음성 재생 중인가? → `stopAudio()` 호출 필요
5. ✅ 페이지 이동하는가? → `setTimeout` 200ms 적용
6. ✅ Share Page 수정인가? → `generateShareHTML()` 함수 수정
7. ✅ 새 공유 페이지로 테스트 (캐시 주의!)

### **API 수정 시**
1. ✅ 인증 필요? → `isAuthenticated` 미들웨어
2. ✅ 관리자 전용? → `requireAdmin` 미들웨어
3. ✅ 파일 업로드? → `upload.single('image')` 미들웨어
4. ✅ DB 접근? → Drizzle ORM 사용
5. ✅ 에러 처리? → try-catch + 500 응답

### **DB 스키마 수정 시**
1. ✅ 기존 데이터 호환성 확인
2. ✅ Primary Key 타입 절대 변경 금지
3. ✅ `npm run db:push --force` 실행
4. ✅ 수동 마이그레이션 금지

---

## 🎯 자주 발생하는 실수

### **1. 공유 페이지 수정 후 캐시 문제**
- **문제:** 기존 공유 페이지는 HTML이 이미 저장됨
- **해결:** 새 공유 페이지 생성 후 테스트

### **2. 음성 정지 안 됨**
- **문제:** `synth.cancel()` 호출 후 즉시 페이지 이동
- **해결:** `setTimeout(() => { window.location.href = ... }, 200);`

### **3. 버튼 클릭 안 됨**
- **문제:** `querySelector` vs `getElementById` 혼동
- **해결:** ID는 `getElementById`, Class는 `querySelector`

### **4. 추천모음 캐시 미적용**
- **문제:** localStorage 캐시 로직 누락
- **해결:** 5분 캐시 (localStorage + version hash)

### **5. 관리자 기능 접근 불가**
- **문제:** 비밀번호 틀림 또는 세션 만료
- **해결:** 비밀번호 1234 재입력

### **6. 용어 혼용으로 인한 혼란 (2025-11-24 해결)**
- **문제:** Featured/Gallery/Guide/Share 등 영어-한국어 혼용
- **해결:** 용어 통일표 참고 (최상단 섹션)
  - Featured → 추천모음
  - Guide → 상세페이지
  - Share → 외부 공유페이지

---

## 📚 참고 파일 위치

```
프로젝트 루트/
├── public/
│   ├── index.js              # 메인 앱 로직 (3,400+ 라인)
│   ├── index.html            # 앱 HTML
│   ├── admin-dashboard.html  # 관리자 대시보드
│   ├── service-worker.js     # Service Worker (앱용)
│   ├── sw-share.js           # Service Worker (공유 페이지용)
│   └── shared/               # 공유 HTML 파일 저장 폴더
│       └── *.html
├── server/
│   ├── routes.ts             # API 라우트 (2,000+ 라인)
│   ├── storage.ts            # 스토리지 인터페이스
│   ├── auth.ts               # 인증 설정
│   └── vite.ts               # Vite 서버 설정
├── shared/
│   └── schema.ts             # DB 스키마
└── replit.md                 # 프로젝트 개요
```

---

## 🏁 결론

이 문서는 **AI 에이전트와 개발자가 앱 구조를 완벽히 이해**하고, **시행착오 없이 작업**하기 위해 작성되었습니다.

**핵심 원칙:**
1. 수정 전 반드시 파일 구조 확인
2. 보호된 코드는 승인 없이 절대 수정 금지
3. 테스트는 새 데이터로 진행 (캐시 주의)
4. 음성 관련 작업은 `stopAudio()` 필수

**문제 발생 시:**
1. 이 문서의 체크리스트 확인
2. 관련 파일의 주석 확인
3. replit.md 참고
4. 사용자에게 명확히 질문 (추측 금지)

---

---

## 📜 변경 이력 (Change Log)

### **2025-11-24 (최신)**
1. **용어 통일 확정**
   - Featured → 추천모음
   - Guide → 상세페이지
   - Share → 외부 공유페이지
   - Gallery 삭제 (더 이상 사용 안 함)

2. **🔴 우선순위 1: 관리자 대시보드 기능 개선**
   - **상태:** ✅ 완료 (2025-11-24 02:15)
   - **엔드포인트:** `PUT /api/admin/shares/:id`
   - **기능:**
     - 외부 공유페이지 메타데이터 수정 (제목/발신자/위치/날짜)
     - 상세페이지 순서 변경 (▲▼ 버튼)
     - HTML 자동 재생성 (`regenerateFeaturedHtml`)
   - **태그 편집 기능 확인:**
     - API: `PATCH /api/admin/guides/:id` (이미 존재)
     - 프론트엔드: `editGuideTags()` 함수 (이미 완성)
     - DB 저장: `guides.tags` (text array)
     - 관리자 대시보드에서 태그 표시 및 편집 가능
   - **수동 테스트 방법:**
     1. `/admin-dashboard.html` 접속
     2. 비밀번호 "1234" 입력
     3. Featured 탭 → 편집 버튼 클릭
     4. 제목/발신자/위치/날짜 수정 및 순서 변경
     5. 저장 버튼 클릭
     6. Featured Gallery에서 변경사항 확인
   - **기술 구현:**
     - 기존 `regenerateFeaturedHtml()` 로직 재사용
     - 관리자 인증: `requireAdmin` 미들웨어 (세션 기반)
     - HTML 파일: DB `htmlContent` 필드에 저장 (App Storage 마이그레이션 완료)
   - **이유:** 관리자 UX 개선, 외부 공유페이지 유연한 관리

3. **🎯 우선순위 2: Featured Gallery 캐시 문제 완전 해결 (10회 시도)**
   - **상태:** ✅ 완료 (2025-11-24 07:45)
   - **문제:**
     - 관리자 대시보드에서 Featured 편집 후 보관함의 추천모음이 즉시 반영되지 않음
     - 일반 새로고침(F5)으로도 옛날 데이터 표시
     - Shift+F5(강제 새로고침)으로만 새 데이터 표시
   - **근본 원인 발견 (8회 시도 끝):**
     - Service Worker가 `/api/share/featured/list` API 응답을 캐싱
     - Service Worker가 `/index.js`, `/share-page.js` 개발 파일을 캐싱
     - 편집 후에도 옛날 캐시 데이터 반환 → 보관함에 옛날 썸네일 표시
   - **최종 해결 방법 (10회 시도):**
     1. **Service Worker 수정 (`public/service-worker.js`):**
        - `/api/share/featured/list` 캐싱 제외 (Network-First 전략)
        - `/index.js` 캐싱 제거 (코드 수정 즉시 반영)
        - `/share-page.js` 캐싱 제거
     2. **Service Worker 버전 업데이트:**
        - v8 → v10 (모든 옛날 캐시 무효화)
        - `skipWaiting()` + `clients.claim()` 자동 업데이트 활용
   - **검증 결과:**
     - ✅ 관리자 Featured 편집 → 보관함 일반 새고침(F5) → 즉시 반영
     - ✅ `/index.js` 수정 → 즉시 반영
     - ✅ 브라우저 콘솔에 "캐시가 열렸습니다" 로그 표시 (SW v10 작동 중)
   - **핵심 원칙:**
     - `guides` DB가 원본 데이터 소스
     - Featured 편집 시 `guides` DB에서 전체 재생성 필수
     - Service Worker는 정적 자원만 캐싱, API는 Network-First
   - **보호된 로직 (절대 수정 금지):**
     - `public/service-worker.js` 버전 v10
     - `/api/share/featured/list` 캐싱 제외 로직
     - `/index.js`, `/share-page.js` 캐싱 제외 로직
   - **이유:** 1000+ 회 테스트된 핵심 로직, 임의 수정 시 캐시 문제 재발 가능

4. **인증 모달 트리거 명확화**
   - 유일한 트리거: 보관함의 추천모음(상단 3개) 클릭 시
   - 이유: 충분한 사용 경험 후 인증 유도 → 사용자 거부감 최소화

5. **문서 구조 개선**
   - 용어 통일 섹션 최상단 배치 (필독 표시)
   - 모든 섹션에 용어 통일 반영
   - 변경사항에 이유 명시

### **2025-11-23**
1. **App Storage 마이그레이션**
   - 외부 공유페이지 HTML을 DB `htmlContent` 필드에 저장
   - 이유: 배포 시 파일 시스템 초기화 문제 해결, 롤백 지원

### **2025-11-09 (초기 작성)**
- architecture.md 최초 작성
- 전체 앱 구조, 페이지별 설명, API 엔드포인트, DB 스키마 문서화

---

**최종 업데이트:** 2025-11-24 02:30  
**작성자:** Replit AI Agent (Claude Sonnet 4.5)  
**검토자:** 프로젝트 오너님 💙
