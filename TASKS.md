# TASKS - 손안에 가이드 통합 작업 목록

**통합일**: 2026-03-05  
**프로젝트**: 내손가이드 (My Hand Guide)  
**구조**: Vanilla JavaScript 기반 PWA 앱  
**환경**: Replit (Express + Vite + PostgreSQL)

---

# PART 1. 긴급/이력 (2025-11-17)

## URGENT: Data Recovery & Migration System
**Priority**: P0 (Blocking production issues)

### Task 1: Recover Lost Shared Pages
**Status**: ⏸️ Pending Production DB access

**Lost Data**:
- `qi6WlKKC.html` (루부르 박물관 베스트20): app-data = `[]` - 500+ views affected
- `k0Q6UEeK.html` (세느강 12): 11 out of 12 guides missing

**Recovery Options**:
1. **Production DB Backup Restore** (RECOMMENDED)
2. **Replit Checkpoint Rollback**
3. **Manual Recreation** (LAST RESORT)

**Action Required**: Access Neon Dashboard → Backups, Check Replit History → Checkpoints (Nov 12)

---

### Task 2: Build Safe Migration System
**Priority**: P1 (Critical for future scaling)

### Task 3: Create Migration Dashboard
**Admin UI for Migration Control**

Features: View all shared pages by template version, Select pages for migration, Preview changes, Rollback button

---

### Protected Files (DO NOT modify without explicit user approval)
- `server/standard-template.ts` - V2 template
- `public/shared/*.html` - User-facing pages
- Migration scripts with bulk operations

---

# PART 2. 개발 체크리스트

## 2025-11-02 세션: Featured Gallery UX 개선 + 다운로드 기능

### 핵심 요구
1. 추천 갤러리 상단 고정
2. 다운로드 버튼 추가
3. 새 탭으로 열기 (보관함 세션 유지)
4. 디자인 통일성 (Gemini Blue + Heroicons, 절대 이모지 금지)
5. 모바일 최적화

### 구현 계획

#### 1. Featured Gallery 레이아웃 재구성
- `featuredGallery`를 `archiveScrollZone` 밖으로 이동
- 수정 파일: `public/index.html` (라인 794-796)

#### 2. 다운로드 버튼 추가
- 수정 파일: `public/index.html`, `public/index.js`

#### 3. Featured Gallery 새 탭 열기
- `window.location.href` → `window.open(shareUrl, '_blank')`
- 수정 파일: `public/index.js` (라인 2162)

#### 4. Featured 타이틀 글자 크기 조정
- `style="font-size: clamp(1rem, 4.5vw, 1.5rem);"`
- 수정 파일: `public/index.js` (라인 2134)

#### 5. 인증 후 리다이렉트 수정
- `res.redirect('/')` → `res.redirect('/archive')`
- 수정 파일: `server/googleAuth.ts`, `server/kakaoAuth.ts`

---

## 2025-10-31 세션: Featured 리턴 버튼 + 콘텐츠 순서 편집 ✅

### 완료 작업
1. **Featured 리턴 버튼 수정** ✅ - `window.close()` (카메라 권한 유지)
2. **Featured 콘텐츠 순서 편집** ✅ - Drag & Drop
3. **LSP 에러 수정** ✅

---

## 2025-10-26 세션: 관리자 대시보드 & DB 최적화 ✅

### 완료 작업
1. **HTML 파일 저장 시스템** ✅ - DB 184MB → 39MB (78% 감소)
2. **관리자 대시보드 구축** ✅
3. **관리자 인증 시스템** ✅
4. **카카오톡 Chrome 강제 리다이렉트** ✅ (P1-1 CRITICAL)

---

## 2025-10-05 세션: Featured Gallery 성능 최적화 ✅

### 완료 작업
1. **Featured Gallery 로딩 최적화** ✅ - 비동기 로딩
2. **공유 모달 UX 대폭 개선** ✅

---

## 배포 테스트 피드백 (2025-10-26) - 진행 중

### Phase 1: 긴급 수정
1. 카카오톡 공유링크 재생 문제 (삼성폰) ✅
2. 삼성폰 이미지 업로드 버튼 미작동 ✅
3. 공유 페이지 생성 속도 (20장 3분 → 10초) ⏳ 대기

### Phase 2~6: UX/UI, 성능, 인증, 다국어 등 ⏳ 대기

---

## 다음 할 일 (우선순위 순)

### 1️⃣ SVG 아이콘 교체 (우선순위: 중간)
- 공유 페이지 이모지 → Heroicons SVG

### 2️⃣ E2E 테스트 실행 (우선순위: 높음)
- 공유 생성 플로우, Featured Gallery, 삭제 기능 검증

### 3️⃣ 이미지 압축 구현 (우선순위: 낮음)
- 70% JPEG 압축 적용

### 4️⃣ 문서화: replit.md 업데이트 (우선순위: 낮음)

---

## 보호된 핵심 로직 목록 (통합)

1. ⚠️ Featured Gallery 고정 레이아웃 (2025.11.02) - 스크롤 분리
2. ⚠️ 다운로드 버튼 (2025.11.02)
3. ⚠️ Featured Gallery 새 탭 열기 (2025.11.02) - 세션 유지
4. ⚠️ Featured 리턴 버튼 (2025.10.31) - 카메라 권한 보호
5. ⚠️ Featured 순서 편집 (2025.10.31) - Drag & Drop
6. ⚠️ 관리자 대시보드 API (2025.10.26)
7. ⚠️ HTML 파일 저장 시스템 (2025.10.26)
8. ⚠️ 관리자 인증 로직 (2025.10.26)
9. 🔥 카카오톡 Chrome 강제 리다이렉트 (2025.10.26) - P1-1 CRITICAL
10. ✅ Featured Gallery 캐싱 (2025.10.26)
11. ✅ Featured Gallery 로딩 (2025.10.05)
12. ✅ 공유/삭제 간편 로직 (2025.10.02)
13. ✅ 4존 스크롤 레이아웃 (2025.10.02)

---

## 디자인 가이드

**컬러**: Primary #4285F4 (Gemini Blue), Gradient from-blue-500 to-blue-600, Background #FFFEFA  
**폰트**: MaruBuri (마루부리)  
**원칙**: ❌ 절대 이모지 금지, ✅ Heroicons SVG만 사용, ✅ 터치 친화적 버튼 (최소 44px)

---

## 상세 체크리스트 (A~I)

### A. 보관함 페이지
- [ ] A-1-1~3: 상단 헤더 (뒤로가기, 타이틀, 아이콘)
- [x] A-2-1~7: 추천 갤러리 섹션 | **2025-10-05 완료** ✅
- [ ] A-3-1~3: 내 보관함 섹션 | [x] A-3-4 스크롤 **2025-10-02 완료** ✅
- [ ] A-4-1~4: 선택 모드
- [ ] A-5-1~6: 하단 액션바 (4버튼)

### B. 공유 페이지
- [ ] B-1: 상단 헤더 (닫기, 타이틀)
- [ ] B-2: 메타데이터 입력 (제목, 발신자, 위치, 일자)
- [ ] B-3: 선택된 항목 영역 (N개 표시, 2열 그리드)
- [ ] B-4: 하단 Footer (Featured 체크박스, 다운로드, 바로가기)

### C. 공유 기능
- [ ] C-1: 선택 흐름 (선택 모드, 다중 선택, 모달)
- [ ] C-2: 공유 페이지 표시
- [ ] C-3: 메타데이터 수집
- [ ] C-4: HTML 파일 생성 (이미지 압축 미구현)
- [ ] C-5: HTML 내용 구성
- [ ] C-6: 다운로드 & 저장

### D. 추천 갤러리
- [x] D-1, D-2: 데이터 로드, UI 렌더링 | **2025-10-05 완료** ✅
- [ ] D-3: 다운로드 기능

### E. 삭제 기능
- [ ] E-1: 선택 모드
- [ ] E-2: 삭제 실행 (확인, IndexedDB 제거, UI 갱신)

### F. IndexedDB 구조
- [ ] F-1: archive store
- [ ] F-2: shareLinks store
- [ ] F-3: DB 버전 업그레이드

### G. CSS 스타일링
- [x] G-1-1: 추천 갤러리 3칸 | **완료** ✅
- [ ] G-1-2~4, G-2, G-3: 나머지

### H. 정보 흐름
- [ ] H-1: 공유 생성 흐름
- [x] H-2: 추천 갤러리 흐름 | **완료** ✅
- [ ] H-3: 바로가기 흐름

### I. 공유 페이지 개선 (2025-10-03~05)
- [x] I-1: 상세 뷰 UX (z-index, 텍스트 하이라이트) ✅
- [x] I-2: 반응형 디자인 ✅
- [ ] I-3: SVG 아이콘 교체 (이모지 → Heroicons)
- [x] I-4: Service Worker 오프라인 지원 ✅
- [x] I-5: 공유 모달 UX 개선 ✅

---

## 정직한 현황 (2025-10-05 업데이트)

**총 147개 체크리스트**
- ✅ 실제 작동 확인: **14개** (9.5%)
- 📝 코드만 작성 (미검증): **약 43개** (29.3%)
- ❌ 완전히 미구현: **약 90개** (61.2%)

---

*통합 문서: TODO.md + todos.md/TODOS.md/TODOs.md 내용 중복 제거 후 병합*
