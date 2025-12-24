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