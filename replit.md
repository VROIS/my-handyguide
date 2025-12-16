# Overview

"내손가이드" (My Hand Guide) is a location-based travel guide application designed for creating, managing, and sharing personalized travel guides. It leverages Google's Gemini AI to automatically generate rich content, such as descriptions and cultural insights, from user-uploaded photos and GPS data. The application aims to provide an intuitive platform for organizing travel memories into shareable, mobile-optimized guides, enhancing user engagement through AI-powered content generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## UI/UX Design
The application features a mobile-first, responsive design with a brand identity centered around Gemini Blue and the MaruBuri font. It is implemented as a Single-Page Application (SPA) using Vanilla JavaScript, manual DOM manipulation, and Tailwind CSS (via CDN) for styling. Progressive Web App (PWA) features are prioritized for a native-like experience.

## Technical Implementation
### Frontend
Built with Vanilla JavaScript, utilizing IndexedDB for local storage and manual DOM manipulation.
### Backend
An Express.js server written in TypeScript handles API requests. It uses Drizzle ORM for PostgreSQL interactions, Replit Authentication (OpenID Connect) for user authentication with PostgreSQL session storage, and Multer for image uploads. ESBuild is used for server-side bundling.
### Database
PostgreSQL is the primary database, managed by Drizzle ORM. Key entities include users, travel guides (containing content, images, location), share links, and authentication sessions. A hybrid storage approach backs up guide data to the database and embeds it in HTML files for offline access.
### AI Integration
Google Gemini AI (Gemini 2.5 Flash model) is central to content generation. It analyzes images and location data to produce multi-language descriptions and tips. Image compression (0.9 quality) optimizes AI processing.
### Authentication
Replit Auth and Google OAuth 2.0 (via Passport.js) manage user authentication. Sessions are stored in PostgreSQL.
### File Upload & Storage
Replit App Storage is used for persistent media files. Shared HTML pages are stored within the PostgreSQL database (`sharedHtmlPages.htmlContent`).
### API Design
A RESTful API built with Express features shared TypeScript schemas, robust error handling, authentication middleware, and a short URL system for share links.
### Referral System
A referral program awards credits to both new users and referrers (+10 credits), with additional bonuses for referrer when referred users top-up (+20 credits). A cashback option (200 credits for 20 EUR) is available via KakaoPay/bank transfer.

## Credit System (2025-12-12 출시 버전)

### 크레딧 적립 (획득)
| 항목 | 크레딧 | 조건 |
|------|--------|------|
| 신규 가입 보너스 | +10 | 첫 가입 시 1회 |
| 추천 가입 보너스 (신규) | +10 | 추천코드로 가입 시 |
| 추천인 보상 | +10 | 내 추천코드로 누군가 가입 시 |
| 추천인 충전 보상 | +20 | 내가 추천한 사람이 충전 시 |
| QR 복사 리워드 | +2 | QR 복사 시 |
| 공유링크 생성 보상 | +1 | 공유 페이지 생성 시 |
| 크레딧 충전 (€10) | +140 | 100 기본 + 40 보너스 |

### 크레딧 차감 (사용)
| 항목 | 크레딧 | 설명 |
|------|--------|------|
| AI 응답 생성 | -2 | 이미지/음성 분석 |
| 공유 페이지 생성 | -5 | 공유 링크 만들기 |

### 비가입자 무료 체험
| 항목 | 횟수 |
|------|------|
| AI 응답 (무료) | 3회 |
| 3회 후 | 로그인 요청 |

### 설정 파일 위치
- `server/creditService.ts` → CREDIT_CONFIG 객체
- `public/index.js` → USAGE_LIMITS 객체

## Feature Specifications
### Performance Optimization
AI response times target 2-2.5 seconds, achieved through model selection and image compression. A Featured Gallery uses caching for instant display.
### Share Feature
Includes short URLs, preserves item selection order, and uses a standard share page template with Microsoft Heami Voice TTS.
### Admin UI
Provides search functionality for shared pages, automatic featured ordering, and a real-time statistics dashboard.
### Guide Detail Page Component (`public/components/guideDetailPage.js`)
A full-screen component displaying image backgrounds, automatic voice playback with sentence-by-sentence highlighting, auto-scrolling, location display, and play/pause controls. It integrates with Google Translate, waiting for translation completion before TTS playback.
### Share Page Translation + TTS Component
Provides multi-language support by detecting Google Translate's completion via `MutationObserver` on the `body` element before initiating TTS playback of the translated text. Supports offline storage via IndexedDB.
### HTML Parser (`server/html-parser.ts`)
Parses guide data from HTML (specifically from `<script id="app-data">`) to preserve AI-generated content in the `guides` database.
### TTS Logic
For Korean, specific voice names (Yuna, Sora, Heami) are hardcoded with a priority list. For other languages (English, Japanese, Chinese, French, German, Spanish), voice preferences are managed via a `voice_configs` table in PostgreSQL, allowing for platform-specific voice priorities. All TTS playback waits for Google Translate to complete, using a 3-second timeout fallback.

## 🎯 V1 공유페이지 시스템 (2025-12-16 완성)

### 핵심 파일 및 역할
| 파일 | 역할 | 핵심 라인 |
|------|------|----------|
| `server/standard-template.ts` | V1 HTML 템플릿 생성 | 전체 (1200+ 줄) |
| `server/storage.ts` | DB 조회 → 템플릿 데이터 변환 | buildSharePageFromGuides() 1362-1448 |
| `server/routes.ts` | API 엔드포인트 | POST /api/share/create (1572-1636) |
| `public/components/guideDetailPage.js` | 프론트엔드 상세보기 컴포넌트 | 전체 |

### 데이터 플로우
```
1. 프론트엔드에서 /api/share/create 호출 (guideIds 배열 전달)
2. routes.ts → storage.buildSharePageFromGuides() 호출
3. storage.ts → guides 테이블에서 데이터 조회 + GuideItem[] 변환
4. standard-template.ts → generateStandardShareHTML() 호출
5. 생성된 HTML을 sharedHtmlPages.htmlContent에 저장
6. /s/:id 접속 시 DB에서 htmlContent 조회 → 렌더링
```

### GuideItem 필수 필드 (storage.ts 1400-1412)
| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 가이드 UUID |
| `title` | string | 음성키워드 폴백용 |
| `imageDataUrl` | string | Base64 또는 /uploads/ 경로 |
| `description` | string | AI 생성 콘텐츠 |
| `voiceLang` | string | TTS 언어 코드 (ko-KR, en-US 등) |
| `locationName` | string | 위치정보 (이미지 가이드용) |
| `voiceQuery` | string | 음성키워드 (title 사용) |
| `voiceName` | string | 저장된 TTS 음성 이름 |

### TTS 음성 우선순위 (standard-template.ts 630-655)
| 언어 | 음성 우선순위 |
|------|--------------|
| ko-KR | Yuna → Sora → 유나 → 소라 → Heami |
| 기타 언어 | savedVoiceName → 언어코드 매칭 |

### 음성 가이드 썸네일 (standard-template.ts 63-75, 382-408)
```html
<div class="voice-thumbnail">
    <img src="/images/landing-logo.jpg" class="voice-bg-logo">  <!-- 블러 로고 -->
    <div class="voice-content">
        <svg class="voice-icon">...</svg>  <!-- 마이크 아이콘 -->
        <span class="voice-keyword">음성키워드</span>
    </div>
</div>
```
CSS: 검정 배경(#000) + 로고 opacity 0.1 + 마이크 아이콘 파란색

### Google Translate 대기 로직 (standard-template.ts 168-180)
```javascript
var observer = new MutationObserver(function() {
    var hasTranslateClass = document.body.classList.contains('translated-ltr') || 
                            document.body.classList.contains('translated-rtl');
    if (hasTranslateClass) {
        window.__translationComplete = true;
        observer.disconnect();
        // 대기열 TTS 재생
    }
});
observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
```
- 3초 타임아웃 폴백 포함

### 오프라인 저장 (standard-template.ts 1177-1221)
```javascript
const dbRequest = indexedDB.open('MyAppDB', 1);
// objectStore: 'archive'
// keyPath: 'id', autoIncrement: true
```

### API 사용법
```bash
# 새 공유페이지 생성
POST /api/share/create
{
  "name": "파리 여행",
  "guideIds": ["uuid1", "uuid2", ...],
  "sender": "여행자",
  "location": "파리",
  "date": "2025년 12월 16일"
}

# 개별 페이지 재생성
POST /api/admin/featured/:id/regenerate

# 일괄 재생성 (V1 템플릿으로 모든 페이지 업데이트)
POST /api/admin/regenerate-all
# 응답: { success, total, successCount, failCount, errors[] }
```

# External Dependencies

## Core Services
-   **Replit Authentication**: OpenID Connect for user authentication.
-   **Google Gemini AI**: Vision and text generation API.
-   **PostgreSQL Database**: Primary data storage.
-   **Replit App Storage**: Cloud object storage for persistent media files.

## Frontend Libraries & APIs
-   **Vanilla JavaScript**: Core language.
-   **IndexedDB**: Local data storage.
-   **Tailwind CSS**: Utility-first CSS framework (via CDN).
-   **Web APIs**: Speech Synthesis, Media Recorder, Geolocation, Camera.

## Backend Dependencies
-   **Express.js**: Web application framework.
-   **Drizzle ORM**: Database toolkit.
-   **Passport.js**: Authentication middleware.
-   **Multer**: Middleware for `multipart/form-data`.
-   **@google-cloud/storage**: Replit App Storage client.
-   **OpenID Client**: OpenID Connect client.
-   **connect-pg-simple**: PostgreSQL session store.