# Overview

"내손가이드" (My Hand Guide) is a location-based travel guide application that enables users to create, manage, and share personalized travel guides. It utilizes Google's Gemini AI to automatically generate rich content, such as descriptions, tips, and cultural insights, from uploaded photos and GPS data. The application's core purpose is to provide an intuitive platform for capturing and organizing travel memories into shareable guides, accessible via a mobile-optimized interface. The project aims to leverage AI for enhanced content and user engagement, targeting travel enthusiasts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
The frontend is a single-page application built with Vanilla JavaScript, manual DOM manipulation, and IndexedDB for local storage. It uses Tailwind CSS via CDN for styling and emphasizes mobile responsiveness and PWA features. The UI adheres to a brand design system featuring Gemini Blue and the MaruBuri font.

## Backend
The backend is an Express.js server written in TypeScript, utilizing Drizzle ORM for PostgreSQL database interactions. User authentication is managed through Replit Authentication (OpenID Connect) with session storage in PostgreSQL. Multer handles image uploads, and ESBuild is used for server-side bundling.

## Database Design
PostgreSQL is the primary database, defined by Drizzle ORM. Key tables include users, travel guides (with content, images, location), share links, and authentication sessions. A hybrid storage system ensures data safety by backing up guide data to the DB and embedding it in HTML files for offline access. Guides are automatically saved to the database upon user action.

## AI Integration
Google Gemini AI (specifically the Gemini 2.5 Flash model) is integrated to analyze images and location data for generating multi-language descriptions and tips. Image compression to 0.9 quality is applied to optimize AI processing. All API calls (content generation, share descriptions, cinematic prompts, script optimization) consistently use this model.

## Authentication & Authorization
Authentication is handled by Replit Auth and Google OAuth 2.0 via Passport.js, with sessions managed by a PostgreSQL-backed middleware. A login modal guides unauthenticated users.

## File Upload & Storage
The application uses Replit App Storage for production stability and persistence. Shared HTML pages are stored in the PostgreSQL database (`sharedHtmlPages.htmlContent`), and future Dream Studio AI-generated images will be stored in App Storage using presigned URLs.

## API Design
A RESTful API built with Express features shared TypeScript schemas, robust error handling, and authentication middleware. A short URL system is implemented for share links.

## Referral & Reward System
A referral system encourages viral growth by rewarding new sign-ups (+10 credits for both new user and referrer) and subsequent credit top-ups by referred users (+20 bonus credits for referrer). Users can request a cashback (200 credits for 20 EUR) via KakaoPay/bank transfer. The system tracks referrals using `?ref=code` parameters and cookies, preventing self-referrals and duplicate cashback requests.

## System Design Choices
The UI/UX is mobile-first and responsive, with camera/GPS integration. Performance is optimized for AI response times (target 2-2.5 seconds) through model selection and image compression, with Featured Gallery caching for instant display. The share feature includes short URLs, preserves item selection order, and uses a standard share page template with Microsoft Heami Voice TTS. An Admin UI provides search for shared pages, automatic featured ordering, and a real-time statistics dashboard.

## Reusable Components
### Guide Detail Page Component
A full-screen detail page component (`public/components/guideDetailPage.js`) displays an image background with automatic voice playback (Microsoft Heami TTS) and sentence-by-sentence highlighting. It includes auto-scrolling, location display, play/pause toggles, and back button functionality.

**Translation-Aware TTS (2025-12-04)**: The component now waits for Google Translate to complete before starting TTS playback. It uses `MutationObserver` to detect the `translated-ltr/rtl` class on `body`, then reads the translated text from DOM and plays TTS in the selected language. Features:
- `_initTranslationWatcher()`: Initial setup on component init
- `_refreshTranslationState()`: Re-checks translation state on each page open
- `guideTranslationComplete` event: Triggers TTS playback after translation
- 3-second timeout fallback for offline mode

### Share Page Translation + TTS Component V1
A standard component system for multi-language support integrates translation detection and text-to-speech. It uses Google Translate's class additions to `body` to detect translation completion, allowing TTS playback in the translated language. It also includes offline storage capabilities via IndexedDB.

### V2 Share Page Template System
This system generates complete HTML pages for sharing, which are stored directly in the `sharedHtmlPages` database table. The structure is highly optimized and critical for the application's core functionality, with strict prohibitions against structural changes to `server/standard-template.ts`, `public/shared-template/v2.js`, and `public/shared-template/v2.css`.

### HTML Parser (`server/html-parser.ts`)
This critical component handles the parsing of guide data from HTML to ensure the preservation of AI-generated content (descriptions) in the `guides` database. It prioritizes parsing from the `<script id="app-data">` tag within the generated HTML.

# External Dependencies

## Core Services
-   **Replit Authentication**: OpenID Connect for user authentication.
-   **Google Gemini AI**: Vision and text generation API.
-   **PostgreSQL Database**: Primary data storage.
-   **Replit App Storage**: Cloud object storage for persistent media files.

## Frontend Libraries
-   **Vanilla JavaScript**: Core language.
-   **IndexedDB**: Local data storage.
-   **Tailwind CSS**: Utility-first CSS framework (CDN).
-   **Web APIs**: Speech Synthesis, Media Recorder, Geolocation, Camera.

## Backend Dependencies
-   **Express.js**: Web application framework.
-   **Drizzle ORM**: Database toolkit.
-   **Passport.js**: Authentication middleware.
-   **Multer**: Middleware for `multipart/form-data`.
-   **@google-cloud/storage**: Replit App Storage client.
-   **OpenID Client**: OpenID Connect client.
-   **connect-pg-simple**: PostgreSQL session store.

# TTS 음성 최적화 설정 (2025-12-07 DB 기반 시스템으로 전환)

## 시스템 아키텍처
TTS 음성 우선순위 설정은 이제 **PostgreSQL 데이터베이스의 `voice_configs` 테이블**에서 관리됩니다. 이를 통해 코드 수정 없이 음성 설정을 변경할 수 있습니다.

### 데이터베이스 스키마 (voice_configs)
```typescript
{
  id: serial,                    // Primary key
  languageCode: varchar(10),     // 예: 'ko-KR', 'en-US'
  platform: varchar(20),         // 'ios' 또는 'other' (Android/Windows)
  voicePriorities: text[],       // 음성 우선순위 배열
  excludeVoices: text[],         // 제외할 음성 배열 (예: ['Google 한국어'])
  isActive: boolean              // 활성화 상태
}
```

### API 엔드포인트
- **GET /api/voice-configs**: 활성화된 모든 음성 설정 조회
- 응답 형식: `VoiceConfig[]` 배열

### 프론트엔드 로딩 방식
1. 앱 초기화 시 `/api/voice-configs` API 호출
2. 설정을 메모리에 캐싱 (`voiceConfigsCache`)
3. API 실패 시 하드코딩된 기본값 사용 (오프라인 fallback)

## 기본 음성 설정값 (DB에 저장됨)

### 한국어 (ko-KR) - 플랫폼 통일 (2025-12-08 복원)
- **문제**: iOS에서 Google 한국어 등 기계음 선택 문제
- **해결**: 플랫폼 분기 제거, 12월 3일 원본 로직 복원

| 플랫폼 | voicePriorities | excludeVoices |
|--------|-----------------|---------------|
| 모든 플랫폼 | **['Microsoft Heami', 'Yuna']** | [] |

### 전체 언어별 설정 (DB 기준)
| 언어 | 우선순위 |
|------|----------|
| ko-KR | **Microsoft Heami, Yuna** (플랫폼 통일) |
| en-US | Samantha, Microsoft Zira, Google US English, English | (동일) |
| ja-JP | Kyoko, Microsoft Haruka, Google 日本語, Japanese | (동일) |
| zh-CN | Ting-Ting, Microsoft Huihui, Google 普通话, Chinese | (동일) |
| fr-FR | Thomas, Microsoft Hortense, Google français, French | (동일) |
| de-DE | Anna, Microsoft Hedda, Google Deutsch, German | (동일) |
| es-ES | Monica, Microsoft Helena, Google español, Spanish | (동일) |

## DB 기반 시스템 적용 파일 (2곳)
- `public/index.js` - `loadVoiceConfigsFromDB()`, `getVoicePriorityFromDB()` 함수
- `public/components/guideDetailPage.js` - `_loadVoiceConfigsFromDB()`, `_getVoicePriorityFromDB()` 함수

## 하드코딩 유지 파일 (오프라인 호환성)
공유 페이지는 오프라인에서도 동작해야 하므로 하드코딩 유지:
- `server/standard-template.ts` - 공유 HTML 생성 시 음성 설정 포함
- `public/components/sharePageTranslation.js` - 공유 페이지 TTS

## 주의사항
- v2.js는 실패한 로직이므로 수정 금지
- 새 언어 추가 시 DB에 레코드 추가 (ios/other 플랫폼별 2개)
- API 실패 시 자동으로 기본값 fallback
- 한국어만 플랫폼별로 다른 excludeVoices 적용

# 구글 번역 후 TTS 통일 규칙 (2025-12-06)

## 개요
모든 TTS 재생 전에 구글 번역이 완료되었는지 확인해야 합니다. 구글 번역은 페이지 로드 후 비동기로 텍스트를 변경하므로, 번역 완료를 감지한 후 DOM에서 번역된 텍스트를 읽어 TTS로 재생합니다.

## 구현 패턴
```javascript
// 1. 번역 상태 객체
const translationState = {
    isTranslated: false,
    detectedLang: null,
    waitingCallbacks: []
};

// 2. MutationObserver로 번역 감지
function initTranslationWatcher() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'class') {
                const classList = document.body.classList;
                if (classList.contains('translated-ltr') || classList.contains('translated-rtl')) {
                    translationState.isTranslated = true;
                    // 콜백 실행
                }
            }
        }
    });
    observer.observe(document.body, { attributes: true });
}

// 3. 번역 완료 대기 함수
async function waitForTranslation(timeout = 3000) {
    if (translationState.isTranslated) return true;
    return new Promise(resolve => {
        const timer = setTimeout(() => resolve(false), timeout);
        translationState.waitingCallbacks.push(() => {
            clearTimeout(timer);
            resolve(true);
        });
    });
}

// 4. TTS 함수에서 사용
async function playTTS(elementSelector) {
    await waitForTranslation();
    const element = document.querySelector(elementSelector);
    const text = element?.innerText || element?.textContent;
    // TTS 재생...
}
```

## 적용된 파일 (4곳) - 반드시 동일하게 유지!
- `public/index.js` - `playAudio()`, `speakNext()` 함수
- `public/generate-standalone.js` - `startSpeech()` 함수
- `public/share-page.js` - `playNextInQueue()` 함수
- `public/components/guideDetailPage.js` - `_startAutoPlay()` 함수

## 핵심 로직
1. `initTranslationWatcher()` - MutationObserver로 `translated-ltr/rtl` 클래스 감지
2. `waitForTranslation()` - async 함수로 번역 완료 대기 (3초 타임아웃)
3. TTS 함수에서 `await waitForTranslation()` 호출 후 DOM에서 번역된 텍스트 읽기

## 주의사항
- v2.js는 실패한 로직이므로 수정 금지
- 한국어(ko) 원본 페이지는 번역 대기 스킵 가능
- 3초 타임아웃으로 오프라인/번역 실패 상황 대응
- 새 TTS 기능 추가 시 반드시 이 패턴 적용 필요