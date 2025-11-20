# Overview

This project is a location-based travel guide application named "내손가이드" (My Hand Guide). Its primary purpose is to enable users to create, manage, and share personalized travel guides featuring photos and location information. A key capability is the integration of Google's Gemini AI, which automatically generates guide descriptions, tips, and cultural insights based on uploaded images and GPS data. The application aims to provide a seamless experience for capturing travel memories, organizing them into shareable guides, and accessing them through a mobile-optimized interface. The business vision is to offer an intuitive tool for travelers to document and share their experiences, leveraging AI to enrich content and improve user engagement, ultimately targeting a broad market of travel enthusiasts.

# User Preferences

Preferred communication style: Simple, everyday language.

# Design System

## Brand Colors
- **Primary Color (Gemini Blue)**: `#4285F4` (CSS variable: `--gemini-blue`)
- **Background**: `#FFFEFA` (크림색/Cream)
- **Accent (Yellow Dot)**: `#FBBF24`

## Typography
- **Primary Font**: `MaruBuri` (마루부리) - 네이버 한글 폰트
- **Fallback**: `sans-serif`
- **Import**: `https://hangeul.pstatic.net/maruburi/maruburi.css`

## UI Guidelines
- **Mobile-first**: 모든 UI는 터치 친화적으로 설계
- **PWA**: 오프라인 지원, Service Worker 활용
- **Interactive Elements**: Gemini Blue 기본 사용
- **Buttons**: 둥근 모서리, 그림자 효과
- **Admin Pages**: 예외적으로 다른 컬러/폰트 허용 (영업 비밀)

## Important Note
**모든 사용자 대면 UI는 Gemini Blue + MaruBuri 사용 필수!** 관리자 전용 페이지는 예외.

# System Architecture

## Frontend Architecture
The frontend is built with **Vanilla JavaScript** (not React). The app uses a single-page architecture with manual DOM manipulation and IndexedDB for local storage. **Tailwind CSS** is used for styling via CDN. The design emphasizes mobile responsiveness and touch-friendly interactions, with PWA features for enhanced mobile experience. All UI follows the brand design system (Gemini Blue + MaruBuri font).

## Backend Architecture
The backend is an **Express.js** server written in **TypeScript**. **Drizzle ORM** is used for interacting with a **PostgreSQL** database. User authentication is managed via **Replit Authentication** (OpenID Connect) with session-based storage in PostgreSQL. **Multer** handles image file uploads. **ESBuild** is used for server-side bundling.

## Database Design
**PostgreSQL** serves as the primary database. **Drizzle ORM** defines the schema, which includes tables for users (with preferences), travel guides (content, images, location), share links, and authentication sessions.

**Hybrid Guide Storage System (2025-11-13):** Critical data safety improvement
- **Problem**: Guide data was stored ONLY in HTML files (Base64 inline) - HTML corruption = permanent data loss
- **Solution**: Hybrid approach - DB backup + HTML inline for speed
  - `guides` table: Backup storage with structured data (title, description, images, GPS)
  - HTML files: Fast offline access with Base64 images (original behavior)
  - **Auto-backup**: New shared pages automatically save guides to DB
  - **Recovery**: HTML damaged? Regenerate from DB backup
- **Backfill**: Existing 25 pages → 94 guides → 20 unique guides backed up to DB
- **Scripts**: `scripts/backfill-guides.ts` for migrating existing pages
- ⚠️ **Protected**: DO NOT disable guide backup in `createSharedHtmlPage()` - breaks data safety

**Automatic Guide Saving on Archive (2025-11-15):** guides DB auto-population
- **Critical Change**: guides DB now saves immediately when user clicks "보관" (save), NOT only when sharing
- **Previous Behavior**: guides only saved to DB when creating shared pages (data loss risk if user never shares)
- **New Behavior**: 
  - User clicks 보관 → saves to IndexedDB (local) + guides DB (server) simultaneously
  - POST /api/guides/batch endpoint handles batch saving with Base64 images
  - Frontend: `handleSaveClick()` in public/index.js calls API after IndexedDB save
  - Backend: Base64 → file conversion, guides DB insertion
- **Benefit**: guides DB becomes the core asset repository, available for all future features
- ⚠️ **Protected**: DO NOT remove POST /api/guides/batch or guides DB save in handleSaveClick()

## AI Integration
**Google Gemini AI** is central to content generation, analyzing images and location data to create descriptions, tips, and cultural information. It supports multi-language content generation based on user preferences and enhances travel recommendations with location-based context. Recent optimizations include:
- **Final Model Selection (2025-10-18):** Gemini 2.5 Flash for optimal balance of image recognition, prompt adherence, and cost efficiency (6.4x cheaper than Claude Haiku 4.5)
- **Image Compression:** 0.9 quality maintained (0.6 or below causes AI hallucinations and false information)
- **Prompt Engineering:** Refined 38-character prompt balancing response speed and content quality, targeting 2-2.5 second response times

## Authentication & Authorization
**Replit Auth** with OpenID Connect is integrated via **Passport.js**. A session middleware with PostgreSQL backing store manages user sessions. A soft-delete subscription system preserves user data upon subscription cancellation and reactivation.

**Google OAuth Integration (2025-10-18):** Added Google OAuth 2.0 authentication via `passport-google-oauth20`. Users can log in with their Google accounts. The database schema includes a `provider` column (varchar) to distinguish between authentication methods ('replit', 'google', 'kakao'). Kakao OAuth is planned but not yet implemented.

**Authentication Modal (2025-10-18):** Implemented a login modal that appears when unauthenticated users click Featured Gallery items. The modal offers:
- Google Login button (active, redirects to `/api/auth/google`)
- Kakao Login button (disabled with "준비 중" badge)
- Smooth returnTo redirect after successful authentication

**Setup Requirements:**
- For Google OAuth to work, set environment variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from Google Cloud Console
- OAuth consent screen must be configured with authorized redirect URIs

## File Upload & Storage
**Multer** handles image uploads, storing them locally. File type validation restricts uploads to image formats, and size limits are enforced. Image compression to 0.6 quality is applied to optimize upload speed and AI processing.

## API Design
The system features a **RESTful API** built with Express, using shared TypeScript schemas for type-safe requests and responses. It includes robust error handling and authentication middleware to protect endpoints. A short URL system has been implemented for share links, reducing their length by 67%.

## System Design Choices
- **UI/UX:** Mobile-first approach with responsive design, touch-friendly interfaces, and camera/GPS integration.
- **Performance:** Focus on optimizing AI response times (current target 2-2.5 seconds) through prompt engineering, AI model selection, and image compression. Recent improvements include:
  - **Featured Gallery Caching (2025-10-26):** localStorage 5-minute cache reduces API loading from 0.9s to 0ms, instant archive page display
- **Share Feature:** Comprehensive re-implementation of sharing functionality, including:
  - Short URLs (8-character IDs, 67% length reduction)
  - **Item Selection Order Preservation (2025-10-18):** User's click order in archive is preserved in shared pages (like shopping cart functionality)
  - **Standard Share Page Template (2025-11-15):** Unified template system for all shared pages
    - **Pure CSS**: No Tailwind CDN dependency (offline-first, faster loading)
    - **3-Column Responsive Grid**: Mobile (2-col) → Tablet/Desktop (3-col) at 768px breakpoint
    - **Microsoft Heami Voice**: Korean TTS for accessibility
    - **Data-Driven**: `buildSharePageFromGuides()` function fetches from guides DB instead of inline HTML
    - **Template Location**: `server/standard-template.ts` with `generateStandardShareHTML()`
    - **Share Flow**: POST /api/share/create → guides DB lookup → standard template generation → HTML file save
    - ⚠️ **Protected**: DO NOT revert to Tailwind CDN or inline HTML generation - breaks offline mode
  - **KakaoTalk In-App Browser Fix (2025-10-26):** Chrome force redirect with full-screen warning for Galaxy users
    - UserAgent detection for KakaoTalk in-app browser
    - Instant full-screen yellow warning overlay
    - Automatic Chrome app launch via Intent URL after 0.5s
    - Manual "Open in Chrome" button fallback
    - ⚠️ **Protected Code**: Critical UX fix for primary user base
  - Offline support via Service Worker (Cache-First strategy, iOS Safari fixes)
  - Responsive shared page UI with z-index hierarchy and HTML escaping fixes
- **Admin UI:** Improved administrator interface for managing featured galleries with:
  - Search functionality for shared pages by name
  - **Automatic Featured Ordering (2025-10-18):** Click order automatically assigned (1, 2, 3...) via `featuredOrder` column for consistent display
  - **Admin Dashboard (2025-10-26):** Real-time statistics dashboard with KPIs, analytics, and top shares
    - 📊 Core metrics: Total users, guides, shared pages, views
    - 📈 Daily trends: User/guide/share creation over 7 days
    - 🔒 Password-protected access (비밀번호: 1234)
    - 💾 DB optimization tracking: HTML file storage reduced DB from 184MB to 39MB (78% reduction)
    - ⚠️ **Protected Code**: All critical functions marked with "DO NOT MODIFY WITHOUT USER APPROVAL"

# External Dependencies

## Core Services
- **Replit Authentication**: OpenID Connect for user authentication.
- **Google Gemini AI**: Vision and text generation API for AI content creation.
- **PostgreSQL Database**: Primary data storage, typically a managed service like Neon.

## Frontend Libraries
- **Vanilla JavaScript**: No framework, manual DOM manipulation
- **IndexedDB**: Local storage for guides and user data
- **Tailwind CSS**: Utility-first CSS framework (CDN)
- **Web APIs**: Speech Synthesis, Media Recorder, Geolocation, Camera

## Backend Dependencies
- **Express.js**: Web application framework.
- **Drizzle ORM**: Database toolkit for PostgreSQL.
- **Passport.js**: Authentication middleware.
- **Multer**: Middleware for handling `multipart/form-data`.
- **OpenID Client**: OpenID Connect client implementation.
- **connect-pg-simple**: PostgreSQL session store for Connect/Express.

## Development Tools
- **Vite**: Frontend build tool.
- **ESBuild**: Server-side bundling.
- **TypeScript**: Language for type safety.
- **PostCSS**: CSS transformation tool.
- **TSX**: TypeScript execution for development.

# Critical Lessons Learned

## Migration Automation Incident (2025-11-16)
**Background**: Automated migration system applied V2 template to ALL shared pages without proper validation, causing catastrophic data loss.

**Damage**:
- `qi6WlKKC.html` (루부르 박물관 베스트20): 500+ views → app-data completely empty `[]`
- `k0Q6UEeK.html` (세느강 12): Lost 11 out of 12 guides
- All users with external shared links now see blank pages
- **Impact**: 500+ users affected by single migration button

**Root Cause**:
- Migration script modified Production HTML files directly
- No dry-run validation on Development DB first
- No version compatibility checks before applying changes
- Git history didn't preserve original data (file committed after data loss)

**Critical Migration Principles (Established 2025-11-16)**:

### 1. Development → Production Pipeline
```
Step 1: Test in Development DB
Step 2: Validate with sample data
Step 3: Backup Production DB
Step 4: Apply migration
Step 5: Verify results
Step 6: Rollback if issues found
```

### 2. Version Control Standards
- Each template version must have:
  - ✅ Complete specification document
  - ✅ Validation test suite
  - ✅ Backward compatibility checks
  - ✅ Migration dry-run script
  - ✅ Rollback procedure

### 3. Safe Automation Requirements
- **NEVER** apply bulk changes without user confirmation
- **ALWAYS** test on Development DB first
- **ALWAYS** create backups before migration
- **ALWAYS** validate data integrity after migration
- **USE** feature flags for gradual rollout
- **IMPLEMENT** version-specific templates (V1, V2, V3 coexist)

### 4. Template Migration Checklist
Before ANY migration:
- [ ] Development DB tested successfully
- [ ] Sample pages validated
- [ ] Production DB backup created
- [ ] Dry-run log reviewed by user
- [ ] User explicitly approved migration
- [ ] Rollback script prepared
- [ ] Post-migration verification plan ready

### 5. Protected Code Markers
Code marked with these comments MUST NOT be modified without user approval:
- `⚠️ CRITICAL`
- `⚠️ Protected`
- `DO NOT MODIFY WITHOUT USER APPROVAL`
- `P1-1` (Priority 1, Critical)

**Future Scale Consideration**: With exponential page growth expected, automation is necessary BUT safety must come first. The cost of one failed migration can destroy hundreds or thousands of user-facing pages.

**Reference Scripts**:
- `scripts/backfill-guides.ts` - Safe backfill with dry-run mode
- `scripts/migrate-to-standard-template.ts` - Template migration (USE WITH CAUTION)

**Next Steps** (2025-11-17):
1. Implement step-by-step migration system with user confirmation at each stage
2. Create version-aware template system (V1/V2 coexist)
3. Build migration validation dashboard
4. Establish Production DB backup automation