# Overview

"내손가이드" (My Hand Guide) is a location-based travel guide application designed for users to create, manage, and share personalized travel guides. It integrates Google's Gemini AI to automatically generate rich content (descriptions, tips, cultural insights) based on uploaded photos and GPS data. The application aims to provide an intuitive platform for capturing travel memories, organizing them into shareable guides, and accessing them via a mobile-optimized interface. The vision is to leverage AI for enriched content and user engagement, targeting travel enthusiasts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend uses Vanilla JavaScript, manual DOM manipulation, and IndexedDB for local storage, built as a single-page application. Tailwind CSS is used for styling via CDN. It emphasizes mobile responsiveness, touch-friendly interactions, and PWA features. All UI adheres to a brand design system utilizing Gemini Blue and the MaruBuri font.

## Backend Architecture
The backend is an Express.js server written in TypeScript. It uses Drizzle ORM for PostgreSQL database interactions. User authentication is handled via Replit Authentication (OpenID Connect) with session storage in PostgreSQL. Multer manages image file uploads, and ESBuild is used for server-side bundling.

## Database Design
PostgreSQL is the primary database, with schema defined by Drizzle ORM. Key tables include users, travel guides (with content, images, location), share links, and authentication sessions. A hybrid storage system ensures data safety by backing up guide data to the DB while also embedding it in HTML files for fast offline access. Guides are automatically saved to the database upon user action, not just sharing.

## AI Integration
Google Gemini AI analyzes images and location data to generate descriptions and tips, supporting multi-language content. **The Gemini 2.5 Flash model is used for optimal balance of image recognition, prompt adherence, and cost efficiency** ($0.30 input / $2.50 output per 1M tokens). Image compression to 0.9 quality is applied to optimize AI processing without causing hallucinations. All API calls (content generation, share descriptions, cinematic prompts, script optimization) use the same model for consistency and cost control.

## Authentication & Authorization
Replit Auth and Google OAuth 2.0 (via `passport-google-oauth20`) are integrated using Passport.js. User sessions are managed by a PostgreSQL-backed session middleware. An authentication modal guides unauthenticated users to log in, with Google Login active and Kakao Login planned.

## File Upload & Storage
**App Storage Migration (2025-11-23):** Migrated from ephemeral file system to Replit App Storage for production stability. Shared HTML pages are now stored in PostgreSQL database (`sharedHtmlPages.htmlContent`) instead of `public/` directory. Dream Studio AI-generated images (future) will be stored in App Storage using presigned URLs. This ensures data persistence across deployments and enables rollback support.

## API Design
A RESTful API built with Express features shared TypeScript schemas, robust error handling, and authentication middleware. A short URL system is implemented for share links.

## System Design Choices
-   **UI/UX:** Mobile-first, responsive design with camera/GPS integration.
-   **Performance:** Optimized AI response times (target 2-2.5 seconds) through model selection and image compression. Featured Gallery caching is implemented for instant display.
-   **Share Feature:** Includes short URLs, preservation of item selection order, and a standard share page template (Pure CSS, 3-column responsive grid, Microsoft Heami Voice TTS, data-driven from guides DB). **Production-Ready Storage (2025-11-23):** Shared HTML pages stored in DB (`htmlContent`) instead of ephemeral file system, ensuring persistence across deployments. A fix for KakaoTalk in-app browser forcing Chrome redirect is implemented.
-   **Admin UI:** Features search functionality for shared pages, automatic featured ordering, and a real-time statistics dashboard for KPIs.

# External Dependencies

## Core Services
-   **Replit Authentication**: OpenID Connect for user authentication.
-   **Google Gemini AI**: Vision and text generation API.
-   **PostgreSQL Database**: Primary data storage.
-   **Replit App Storage**: Cloud object storage for AI-generated media files (production-ready, ephemeral-safe).

## Frontend Libraries
-   **Vanilla JavaScript**: Core language.
-   **IndexedDB**: Local data storage.
-   **Tailwind CSS**: Utility-first CSS framework (CDN).
-   **Web APIs**: Speech Synthesis, Media Recorder, Geolocation, Camera.

## Backend Dependencies
-   **Express.js**: Web application framework.
-   **Drizzle ORM**: Database toolkit.
-   **Passport.js**: Authentication middleware.
-   **Multer**: Middleware for `multipart/form-data` (Dream Studio temporary uploads).
-   **@google-cloud/storage**: Replit App Storage client for persistent file storage.
-   **OpenID Client**: OpenID Connect client.
-   **connect-pg-simple**: PostgreSQL session store.

## Development Tools
-   **Vite**: Frontend build tool.
-   **ESBuild**: Server-side bundling.
-   **TypeScript**: Language for type safety.
-   **PostCSS**: CSS transformation tool.
-   **TSX**: TypeScript execution.

# Reusable Components

## Guide Detail Page Component (`public/components/guideDetailPage.js`)

**⚠️ 2025-11-28 확보된 로직 - 절대 수정 금지!**

풀스크린 상세페이지 컴포넌트. 이미지 배경 + 음성 자동재생 + 문장별 하이라이트.

### 기능
- 풀스크린 이미지 배경 (투명 오버레이)
- 흰색 텍스트 (그림자 없음)
- 음성 자동재생 (Microsoft Heami TTS)
- 문장별 파란 하이라이트 `rgba(66, 133, 244, 0.3)`
- 자동 스크롤 (현재 문장 따라감)
- 위치 정보 표시 (흰색 박스)
- play/pause 아이콘 토글
- 뒤로가기 = 음성 정지

### 사용법

**1. HTML에 삽입:**
```html
<script src="/components/guideDetailPage.js"></script>
<style>
    /* 컴포넌트 CSS 추가 (guideDetailPage.getCSS() 내용 복사) */
</style>
```

**2. HTML 템플릿 추가:**
```javascript
document.body.insertAdjacentHTML('beforeend', guideDetailPage.getHTML());
```

**3. 초기화:**
```javascript
guideDetailPage.init({
    onClose: () => console.log('닫힘')
});
```

**4. 열기:**
```javascript
// API로 가이드 데이터 가져오기
guideDetailPage.open(guideId);

// 또는 직접 데이터 전달
guideDetailPage.openWithData({
    imageUrl: 'https://...',
    description: '설명 텍스트',
    locationName: '위치 이름'
});
```

### 필수 CSS 변수
```css
:root {
    --gemini-blue: #4285F4;
}
```

### 주의사항
- `text-shadow` 사용 금지 (투명 오버레이 깨짐)
- `justify-content: flex-end` 사용 금지 (텍스트 시작 위치 깨짐)
- Microsoft Heami 음성은 Windows에서만 지원

## V2 공유페이지 템플릿 시스템

**⚠️ 2025-11-28 1달간 최적화 완료 - 절대 수정 금지!**

공유페이지는 앱의 **핵심 영업 채널**입니다. V2 마이그레이션 시 guides DB 90% 손실 경험 있음.

### 파일 구조

| 파일 | 역할 | 수정 가능 |
|------|------|----------|
| `server/standard-template.ts` | HTML 생성 (548줄) | ❌ 금지 |
| `public/shared-template/v2.js` | 클라이언트 JS (179줄) | ❌ 금지 |
| `public/shared-template/v2.css` | 클라이언트 CSS (168줄) | ❌ 금지 |

### 생성 흐름

```
1. 사용자가 상세페이지 선택 (최대 20개)
2. index.js의 generateShareHTML() → 완전한 HTML 생성
3. /api/share/create → 서버 호출
4. storage.ts의 createSharedHtmlPage() → DB 저장
5. /s/{8자ID} URL로 접근 가능
```

### DB 저장 구조 (sharedHtmlPages 테이블)

| 필드 | 설명 |
|------|------|
| `id` | 8자 짧은 ID (base64url, 예: `abc12345`) |
| `htmlContent` | 완전한 HTML 문서 (DB 직접 저장) |
| `guideIds` | 포함된 상세페이지 ID 배열 (1-20개) |
| `thumbnail` | 첫 번째 이미지 |
| `name`, `sender`, `location` | 메타데이터 |
| `downloadCount` | 조회수 |
| `featured` | 추천 여부 |

### ⚠️ 절대 금지 사항

1. **CSS 인라인 → 외부 파일 분리 시도 금지** (기존 페이지 깨짐)
2. **템플릿 구조 변경 금지** (갤러리 뷰 ↔ 상세 뷰 전환 로직)
3. **음성 재생 로직 수정 금지** (Microsoft Heami TTS)
4. **카카오톡 리다이렉트 로직 수정 금지**
5. **guides 테이블 백업 로직 수정 금지** (parseGuidesFromHtml)