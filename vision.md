# Dream Shot Studio - D-ID 연동 구현 문서 (V1)

## 개요
기존 가이드 데이터(이미지 + AI description)를 재활용하여 10초 숏폼 영상을 생성하는 기능.
D-ID API를 사용하여 한국어 TTS 립싱크 영상 제작.

## 핵심 아키텍처

### 데이터 흐름
1. 사용자가 가이드 선택 → 가이드 내 이미지/description 로드
2. 선택된 이미지 + description → D-ID API 호출
3. D-ID가 아바타 립싱크 영상 생성 → 결과 URL 반환
4. 사용자에게 프리뷰 및 다운로드 제공

### 구현된 파일
- `public/dream-studio.html` - 드림 스튜디오 UI
- `server/routes.ts` - D-ID API 엔드포인트
- `public/temp-did/` - 임시 이미지 저장 디렉토리

## D-ID API 연동

### API 키 설정
```
DID_API_KEY - D-ID 계정의 API Key (Basic Auth)
```

### 엔드포인트
```
POST /api/did/create-video
  - source_url: 이미지 공개 URL
  - script: AI description 텍스트
  - avatar_url: 아바타 이미지 URL

GET /api/did/status/:talkId
  - 영상 생성 상태 조회
  
POST /api/did/prepare-image
  - 이미지를 공개 URL로 변환
```

### 이미지 처리 방식
1. 원본 이미지 가져오기 (App Storage 또는 외부 URL)
2. Sharp로 640x640 리사이즈, JPEG 85% 압축
3. `public/temp-did/` 에 저장
4. 공개 접근 가능한 URL 생성

### 아바타 합성 방식 (얼굴 인식 문제 해결)
D-ID는 얼굴 인식이 필수. 풍경/랜드마크 이미지에는 얼굴이 없어 오류 발생.
해결: 모든 이미지에 아바타를 합성하여 안정적인 얼굴 인식 보장.

```javascript
// 배경 이미지 위에 아바타 오버레이
const composite = await sharp(backgroundBuffer)
  .composite([{ input: avatarBuffer, gravity: 'southeast' }])
  .jpeg({ quality: 85 })
  .toBuffer();
```

## D-ID 제약사항

### 립싱크 전용
- D-ID는 얼굴만 움직임 (입 + 눈)
- 전체 신체 모션은 지원하지 않음
- 이미지의 다른 부분은 정적

### 한국어 TTS
- Microsoft Azure 음성 사용
- `ko-KR-SunHiNeural` 등 한국어 음성 지원

### 비용
- D-ID API: 크레딧 기반 과금
- 영상 길이에 따라 크레딧 소모

## 네비게이션

### 관리자 설정 → 드림 스튜디오
```
관리자 설정 페이지 '드림 샷 스튜디오' 섹션
'생성' 버튼 클릭 → ./dream-studio.html?from=admin
```

### 드림 스튜디오 → 관리자 설정 복귀
```javascript
function handleBack() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'admin') {
        window.location.href = './index.html#adminSettings';
    } else {
        history.back();
    }
}
```

### index.js 해시 처리
```javascript
if (window.location.hash === '#adminSettings') {
    showAdminSettingsPage();
    window.history.replaceState({}, '', window.location.pathname);
}
```

## V2 개선 방향

### 동적 움직임 추가 (Kling API 고려)
- Kling: 이미지→영상 변환, 전체 모션 지원
- 단, 한국어 TTS 미지원 → 별도 TTS 통합 필요

### 비용 최적화
- 캐싱: 동일 이미지+텍스트 조합 결과 재사용
- 배치 처리: 여러 영상 한번에 생성

### 사용자 경험
- 실시간 진행률 표시
- 생성 완료 푸시 알림
- 갤러리에서 직접 생성

---
*작성일: 2026-01-01*
*버전: V1.0*
