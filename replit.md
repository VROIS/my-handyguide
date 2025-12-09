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