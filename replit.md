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

### V2 Share Page Template System (⚠️ 봉인됨 2025-12-09)
**❌ v2.js/v2.css는 실패한 자동화 로직 - 사용 금지!**
- 현재 V1이 최적화된 상태 (components/ 폴더 사용)
- AI 주의: 이 파일들을 참조하거나 수정하지 말 것!
- 실제 사용 템플릿: `server/html-template.ts`, `server/standard-template.ts`

### 공유 페이지 템플릿 (현재 사용 중)
| 템플릿 | 용도 | 생성 API |
|--------|------|----------|
| `html-template.ts` | 일반 공유페이지 | `/api/share/create` |
| `standard-template.ts` | 추천모음 (Featured) | `/api/admin/featured/:id/regenerate` |

**중요**: 둘 다 같은 근원 (사용자가 만든 일반 공유페이지). 관리자가 Featured로 지정하면 추천모음이 됨.

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

# ⭐ TTS 핵심 로직 (2025-12-08 최종 표준화)

## 🎯 앱의 핵심 가치
**"여행지에서 바로 선택한 언어로 듣는것 - 온/오프라인"**

## 한국어 하드코딩 방식 (2025-12-08 확정)

### 문제
- DB의 `voice_name`이 NULL로 저장됨
- 디바이스가 임의 음성 선택 → iPhone에서 Rocko(기계음) 선택 문제

### 해결책
**한국어만 하드코딩 분리**, 다른 6개 언어는 DB 기반 유지

### 표준 코드 (5개 파일에 동일 적용)
```javascript
// ⭐ 2025-12-08: 한국어 하드코딩 (Yuna/Sora 우선순위)
const allVoices = synth.getVoices();
const koVoices = allVoices.filter(v => v.lang.startsWith('ko'));

// Yuna → Sora → 유나 → 소라 → Heami → 첫 번째 한국어 음성
const targetVoice = koVoices.find(v => v.name.includes('Yuna'))
                 || koVoices.find(v => v.name.includes('Sora'))
                 || koVoices.find(v => v.name.includes('유나'))
                 || koVoices.find(v => v.name.includes('소라'))
                 || koVoices.find(v => v.name.includes('Heami'))
                 || koVoices[0];

console.log('🎤 [한국어 하드코딩] 음성:', targetVoice?.name || 'default');
```

### 음성 우선순위 (플랫폼별 자동 선택)
| 우선순위 | 음성 이름 | 플랫폼 |
|---------|----------|--------|
| 1 | Yuna | Apple iOS/macOS |
| 2 | Sora | Apple iOS/macOS |
| 3 | 유나 | Apple iOS/macOS (한글) |
| 4 | 소라 | Apple iOS/macOS (한글) |
| 5 | Heami | Microsoft Windows |
| 6 | 첫 번째 ko 음성 | 기타 |

### 적용 파일 (5곳) - 절대 수정 금지!
1. `public/index.js` - `playAudio()` 함수 (1236줄)
2. `public/index.js` - `speakNext()` 함수 (3430줄) ← 메인 앱 핵심!
3. `public/share-page.js` - `getOptimalKoreanVoice()` 함수
4. `public/components/guideDetailPage.js` - `_getVoiceForLanguage()` 함수
5. `public/shared-template/v2.js` - 인라인 TTS 함수

### 다른 6개 언어 (DB 기반 유지)
| 언어 | 우선순위 |
|------|----------|
| en-US | Samantha, Microsoft Zira, Google US English |
| ja-JP | Kyoko, Microsoft Haruka, Google 日本語 |
| zh-CN | Ting-Ting, Microsoft Huihui, Google 普通话 |
| fr-FR | Thomas, Microsoft Hortense, Google français |
| de-DE | Anna, Microsoft Hedda, Google Deutsch |
| es-ES | Monica, Microsoft Helena, Google español |

---

# TTS DB 기반 시스템 (다른 언어용)

## 시스템 아키텍처
한국어 외 6개 언어는 **PostgreSQL 데이터베이스의 `voice_configs` 테이블**에서 관리됩니다.

### 데이터베이스 스키마 (voice_configs)
```typescript
{
  id: serial,                    // Primary key
  languageCode: varchar(10),     // 예: 'en-US', 'ja-JP'
  platform: varchar(20),         // 'ios' 또는 'other'
  voicePriorities: text[],       // 음성 우선순위 배열
  excludeVoices: text[],         // 제외할 음성 배열
  isActive: boolean              // 활성화 상태
}
```

### API 엔드포인트
- **GET /api/voice-configs**: 활성화된 모든 음성 설정 조회

### 프론트엔드 로딩
1. 앱 초기화 시 `/api/voice-configs` API 호출
2. 설정을 메모리에 캐싱 (`voiceConfigsCache`)
3. API 실패 시 하드코딩된 기본값 사용 (오프라인 fallback)

## 주의사항
- **한국어는 반드시 하드코딩 로직 사용** (DB voice_name NULL 문제)
- 새 언어 추가 시 DB에 레코드 추가 필요
- API 실패 시 자동으로 기본값 fallback

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