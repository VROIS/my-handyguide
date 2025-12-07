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

# TTS 음성 최적화 설정 (2025-12-07 업데이트)

## 한국어 (ko-KR) - 플랫폼별 분기 (2025-12-07 수정)
- **문제**: "Google 한국어" 음성이 오프라인 모바일에서 문제 발생
- **해결**: iOS/Android 플랫폼별 분기 적용, Google 한국어 완전 제외

### iOS/macOS 설정
```javascript
const isIOS = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
// iOS: ['Sora', 'Yuna', 'Korean', '한국어']
```
- **Sora**: iOS 17+ 최신 고품질 음성 (최우선)
- **Yuna**: iOS/macOS 기존 고품질 음성
- **Korean, 한국어**: WebView/기타 fallback

### Android/Windows 설정
```javascript
// Android/Windows: ['Microsoft Heami', 'Korean', '한국어']
```
- **Microsoft Heami**: Windows Edge 고품질 음성
- ❌ **Google 한국어 제외** (오프라인 문제 해결)
- **Korean, 한국어**: fallback

## 전체 언어 우선순위 전략
1. **1순위**: iOS/macOS 음성 (Sora, Yuna, Samantha, Kyoko, Ting-Ting, Thomas, Anna, Monica)
2. **2순위**: Windows Edge 음성 (Microsoft Heami, Zira, Haruka, Huihui, Hortense, Hedda, Helena)
3. **3순위**: Chrome/Android 음성 (Google 시리즈 - 한국어 제외)
4. **4순위**: 일반 fallback (Korean, English, Japanese 등)

## 전체 voicePriority 설정값
```javascript
const isIOS = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
const voicePriority = {
    'ko-KR': isIOS ? ['Sora', 'Yuna', 'Korean', '한국어'] : ['Microsoft Heami', 'Korean', '한국어'],
    'en-US': ['Samantha', 'Microsoft Zira', 'Google US English', 'English'],
    'ja-JP': ['Kyoko', 'Microsoft Haruka', 'Google 日本語', 'Japanese'],
    'zh-CN': ['Ting-Ting', 'Microsoft Huihui', 'Google 普通话', 'Chinese'],
    'fr-FR': ['Thomas', 'Microsoft Hortense', 'Google français', 'French'],
    'de-DE': ['Anna', 'Microsoft Hedda', 'Google Deutsch', 'German'],
    'es-ES': ['Monica', 'Microsoft Helena', 'Google español', 'Spanish']
};
```

## 적용 파일 (6곳) - 반드시 동일하게 유지!
- `server/standard-template.ts` (라인 523-533)
- `public/index.js` (라인 1062-1071, 2311-2321, 3332-3342) - 3곳
- `public/components/guideDetailPage.js` (라인 262-272)
- `public/components/sharePageTranslation.js` (라인 33-48)

## 주의사항
- v2.js는 실패한 로직이므로 수정 금지
- 모든 파일에서 동일한 설정 유지 필수
- 새 언어 추가 시 6곳 모두 업데이트 필요
- 한국어만 플랫폼별 분기, 다른 언어는 기존 설정 유지

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