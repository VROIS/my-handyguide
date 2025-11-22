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
Multer handles image uploads, storing them locally. It includes file type validation, size limits, and image compression to 0.6 quality for optimized processing.

## API Design
A RESTful API built with Express features shared TypeScript schemas, robust error handling, and authentication middleware. A short URL system is implemented for share links.

## System Design Choices
-   **UI/UX:** Mobile-first, responsive design with camera/GPS integration.
-   **Performance:** Optimized AI response times (target 2-2.5 seconds) through model selection and image compression. Featured Gallery caching is implemented for instant display.
-   **Share Feature:** Includes short URLs, preservation of item selection order, and a standard share page template (Pure CSS, 3-column responsive grid, Microsoft Heami Voice TTS, data-driven from guides DB). A fix for KakaoTalk in-app browser forcing Chrome redirect is implemented.
-   **Admin UI:** Features search functionality for shared pages, automatic featured ordering, and a real-time statistics dashboard for KPIs.

# External Dependencies

## Core Services
-   **Replit Authentication**: OpenID Connect for user authentication.
-   **Google Gemini AI**: Vision and text generation API.
-   **PostgreSQL Database**: Primary data storage.

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
-   **OpenID Client**: OpenID Connect client.
-   **connect-pg-simple**: PostgreSQL session store.

## Development Tools
-   **Vite**: Frontend build tool.
-   **ESBuild**: Server-side bundling.
-   **TypeScript**: Language for type safety.
-   **PostCSS**: CSS transformation tool.
-   **TSX**: TypeScript execution.