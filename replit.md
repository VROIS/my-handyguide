# Overview

"내손가이드" (My Hand Guide) is a location-based travel guide application that enables users to create, manage, and share personalized travel guides. It utilizes Google's Gemini AI for automatic content generation, including descriptions and cultural insights, from user-uploaded photos and GPS data. The application aims to provide an intuitive platform for organizing travel memories into shareable, mobile-optimized guides with AI-powered content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## UI/UX Design
The application is a mobile-first, responsive Single-Page Application (SPA) built with Vanilla JavaScript, manual DOM manipulation, and Tailwind CSS (via CDN). It incorporates Progressive Web App (PWA) features for a native-like experience, featuring a brand identity around Gemini Blue and the MaruBuri font.

## Technical Implementation
### Frontend
Built with Vanilla JavaScript, it uses IndexedDB for local storage and direct DOM manipulation.
### Backend
An Express.js server (TypeScript) handles API requests, using Drizzle ORM for PostgreSQL. Authentication is managed via Replit Authentication (OpenID Connect) with PostgreSQL session storage, and Multer for image uploads. ESBuild bundles the server-side code.
### Database
PostgreSQL, managed by Drizzle ORM, stores users, travel guides, share links, and authentication sessions. Guide data is also embedded in HTML files for offline access.
### AI Integration
Google Gemini AI (Gemini 2.5 Flash) generates multi-language descriptions and tips from images and location data, with image compression (0.9 quality) for efficiency. A dynamic AI prompt management system allows for language-specific and persona-driven AI responses, configurable via an admin dashboard. Prompts are stored in the DB and ensure "text-only" responses to optimize TTS.
### Authentication
Replit Auth and Google OAuth 2.0 (via Passport.js) are used, with sessions stored in PostgreSQL.
### File Upload & Storage
Replit App Storage is used for persistent media files. Shared HTML pages are stored within the PostgreSQL database.
### API Design
A RESTful Express API features shared TypeScript schemas, error handling, authentication middleware, and a short URL system for share links.
### Referral System
A referral program rewards users for sign-ups and referred user top-ups.
### Credit System
Users earn credits for new sign-ups, referrals, QR copies, and sharing. Credits are consumed for AI response generation and share page creation. Unregistered users receive free trials for AI responses.
### Performance Optimization
AI response times target 2-2.5 seconds using optimized models and image compression. A Featured Gallery uses caching.
### Share Feature
Generates short URLs and uses a standard share page template with Microsoft Heami Voice TTS. Share pages are dynamically built from guide data and stored as HTML content in the database. Shared pages support Google Translate integration with TTS playback, waiting for translation completion, and offer offline storage via IndexedDB.
### Admin UI
Provides search, automatic featured ordering, and real-time statistics for shared pages, including AI prompt management.
### Service Workers
`public/service-worker.js` (Cache First) for the main app and `public/sw-share.js` (Network First) for share pages to ensure offline access and always-latest content for shared guides.
### TTS Logic
Prioritizes specific voice names for Korean (Yuna, Sora, Heami) and uses a `voice_configs` table in PostgreSQL for other languages. **Critical: Dynamic content retranslation** - Uses `retranslateNewContent()` function to force Google Translate widget to re-scan dynamically added DOM content before TTS playback. Pattern: toggle `.goog-te-combo` dropdown ('' → currentLang) with 100ms/800ms delays, then read translated `innerText` for TTS. Applied to index.js, share-page.js, guideDetailPage.js, admin-dashboard.html, profile.html, and standard-template.ts (Gallery).

# External Dependencies

## Core Services
-   **Replit Authentication**: User authentication (OpenID Connect).
-   **Google Gemini AI**: AI vision and text generation.
-   **PostgreSQL Database**: Primary data storage.
-   **Replit App Storage**: Cloud object storage for media files.

## Frontend Libraries & APIs
-   **Vanilla JavaScript**: Core development language.
-   **IndexedDB**: Local data storage for offline capabilities.
-   **Tailwind CSS**: Utility-first CSS framework (via CDN).
-   **Web APIs**: Speech Synthesis, Media Recorder, Geolocation, Camera.

## Backend Dependencies
-   **Express.js**: Web application framework.
-   **Drizzle ORM**: PostgreSQL database toolkit.
-   **Passport.js**: Authentication middleware.
-   **Multer**: Handles `multipart/form-data`.
-   **@google-cloud/storage**: Replit App Storage client.
-   **OpenID Client**: OpenID Connect client library.
-   **connect-pg-simple**: PostgreSQL session store.

# Debugging & Troubleshooting

## Debug Code Backup
`docs/debug-code-backup.md` contains reusable debugging code for language/translation issues:
- Mobile debug box (visual on-screen debugger)
- Language initialization logs
- Google Translate debugging

## Language Settings (2026-01-22)
- **localStorage only** - No DB sync, localStorage.appLanguage is the single source of truth
- **Device language detection** - Used only if localStorage is empty (not saved)
- **One-time reset** - langResetDone v2 flag clears old 'fr' values
- **TTS auto-config** - Based on localStorage.appLanguage (ko → ko-KR, fr → fr-FR)

## Critical Bug Fixes (2026-02-01)

### 1. AI 호출 시 크레딧 차감 버그 (2025-12-11 ~ 2026-02-01)
- **증상**: AI 호출해도 크레딧이 차감되지 않음
- **원인**: `/api/gemini` 엔드포인트에서 `req.user?.id`가 항상 undefined
- **수정**: `server/routes.ts` 라인 229 - `req.user?.id || req.session?.passport?.user`로 변경
- **영향**: 약 1.5개월간 무료 AI 사용 가능했음

### 2. 프로모션 크레딧 이중지급 (43명 × 280 크레딧)
- **증상**: 신규 가입자가 140 대신 280 크레딧 수령
- **원인**: `signup_bonus(140)` + `promo_bonus_2026(140)` 중복 지급
- **수정**: `server/creditService.ts` - signup_bonus 받은 사용자는 promo_bonus 제외 로직 추가
- **DB 조치**: 배포본에서 promo_bonus_2026 삭제 + 모든 사용자 100 크레딧으로 초기화

### 3. 크레딧 부족 시 처리 추가
- **수정 위치**: `public/geminiService.js` 라인 143-148
- **동작**: 402 응답 시 alert 표시 후 `/profile.html`로 리다이렉트

### 4. API 호출 로깅 추가 (2026-02-01)
- **목적**: 정확한 AI 호출 횟수 추적 (저장 안 한 1회성 열람 포함)
- **구현**: `/api/gemini` 호출마다 `api_logs` 테이블에 기록
- **기록 항목**: 시간, 사용자ID, 응답시간(ms), 성공여부, 추정비용($0.015/call)
- **대시보드 연동**: `/api/admin/overview`, `/api/admin/stats`가 `api_logs`에서 실시간 데이터 조회
- **과거 데이터**: 버그 기간(2025-12-11~2026-02-01) AI 호출은 추적 불가 (api_logs 비어있음)