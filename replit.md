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