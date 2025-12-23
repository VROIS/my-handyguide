# Overview

"내손가이드" (My Hand Guide) is a location-based travel guide application that enables users to create, manage, and share personalized travel guides. It utilizes Google's Gemini AI to automatically generate rich content, such as descriptions and cultural insights, from user-uploaded photos and GPS data. The application aims to transform travel memories into shareable, mobile-optimized guides with AI-powered content generation. The project also has ambitions to integrate video generation capabilities using Google Veo.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## UI/UX Design
The application is a mobile-first, responsive Single-Page Application (SPA) built with Vanilla JavaScript, manual DOM manipulation, and Tailwind CSS (via CDN). It emphasizes Progressive Web App (PWA) features and uses Gemini Blue and the MaruBuri font for brand identity.

## Technical Implementation
### Frontend
Developed with Vanilla JavaScript, using IndexedDB for local storage to support offline capabilities, particularly for shared pages.
### Backend
An Express.js server in TypeScript uses Drizzle ORM for PostgreSQL interactions and Replit Authentication (OpenID Connect) with PostgreSQL session storage. Multer handles image uploads, and ESBuild is used for server bundling.
### Database
PostgreSQL is the primary database, managed by Drizzle ORM, storing users, travel guides (content, images, location), share links, and authentication sessions. Guide data is backed up in the database and embedded in HTML for offline access.
### AI Integration
Google Gemini AI (Gemini 2.5 Flash) generates descriptions in Korean, which are then translated via Google Translate to the user's selected language. Image compression (0.9 quality) optimizes AI processing. **2025-12-23 Update**: Language-specific prompts removed; Gemini always responds in Korean for consistency, with Google Translate handling localization.
### Authentication
Replit Auth and Google OAuth 2.0 (via Passport.js) are used, with sessions stored in PostgreSQL.
### File Upload & Storage
Replit App Storage is used for media files, and shared HTML pages are stored within the PostgreSQL database.
### API Design
A RESTful Express API features shared TypeScript schemas, error handling, authentication middleware, and a short URL system for share links.
### Referral System
A credit-based referral program rewards new users (+10 credits), referrers (+10 credits), and gives additional bonuses when referred users top-up (+20 credits). Cashback options are available.
### Credit System
Users earn credits for new sign-ups, referrals, QR copies, and sharing. Credits are consumed for AI response generation (-2) and share page creation (-5). Non-logged-in users receive 3 free AI responses before being prompted to log in.
### Performance Optimization
AI response times target 2-2.5 seconds. A Featured Gallery uses caching.
### Share Feature
Generates short URLs, preserves item selection order, uses a standard share page template with Microsoft Heami Voice TTS, and includes multi-language support via Google Translate. Share pages include automatic voice playback with sentence highlighting and auto-scrolling.
### Admin UI
Provides search for shared pages, automatic featured ordering, and a real-time statistics dashboard.
### HTML Parser
Parses guide data from HTML to preserve AI-generated content in the database.
### TTS Logic
**2025-12-23 Update**: Unified TTS via `TTSHelper` utility (`public/utils/tts-helper.js`):
- **Korean**: Immediate playback with hardcoded voices (Yuna → Sora → Heami priority for iOS compatibility)
- **Other languages**: Wait for Google Translate completion (MutationObserver + 2s timeout), then play with native language voice based on `appLanguage`
- Applied consistently across: index.js, guideDetailPage.js, share-page.js, profile.html, admin-dashboard.html, v2.js (standalone share pages)
### Service Worker Strategy
The main app uses a Cache First strategy, while shared pages (`/s/:id`) employ a Network First strategy (via `sw-share.js`) to ensure fresh content and offline availability.
### Dream Video (Planned)
Future integration with Google Veo 3.1 to generate personalized videos from user photos and Gemini AI narratives.

# External Dependencies

## Core Services
-   **Replit Authentication**: OpenID Connect for user authentication.
-   **Google Gemini AI**: Vision and text generation API.
-   **Google Veo 3.1**: Video generation API (planned integration).
-   **PostgreSQL Database**: Primary data storage.
-   **Replit App Storage**: Cloud object storage for persistent media files.

## Frontend Libraries & APIs
-   **Vanilla JavaScript**: Core language for client-side logic.
-   **IndexedDB**: Browser-based local storage.
-   **Tailwind CSS**: Utility-first CSS framework (via CDN).
-   **Web APIs**: Speech Synthesis, Media Recorder, Geolocation, Camera.

## Backend Dependencies
-   **Express.js**: Web application framework.
-   **Drizzle ORM**: TypeScript ORM for PostgreSQL.
-   **Passport.js**: Authentication middleware.
-   **Multer**: Middleware for handling `multipart/form-data`.
-   **@google-cloud/storage**: Client library for Replit App Storage.
-   **OpenID Client**: OpenID Connect client library.
-   **connect-pg-simple**: PostgreSQL session store for Express.js.