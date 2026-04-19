# 내손앱 메인입력 화면 RN — 이식용 독립 모듈

> 버전 2 프로토타입 | 다른 RN 앱에 부가기능으로 접목 가능

---

## 완성도 (80%)

### ✅ 완성
- **App.js** — WebView + RN 카메라 오버레이 (작동 구조)
- **MainCameraScreen.js** — 촬영/업로드/음성/보관함 5버튼
- **hooks**: useCamera, useVoice, useLocation, useSave, useAI
- **components**: CameraView, FooterButtons, LiveChat, TravelAssistant
- **services**: GeminiLiveApi, ArchiveService, ExchangeRateService, TranslationService, SOSService, PromptService, GemmaEngine, ModelDownloader
- **litert-bridge**: Gemma 4 네이티브 모듈 (Android Kotlin 구현)
- **expo-speech-recognition** 포함
- **Zustand** 상태 관리
- **다국어** i18n/translations.js

### ⚠️ 미완성/점검 필요
- 삼성 Exynos WebView 호환성 미해결 (TWA 전환 이유)
- WebView↔RN 전환 시 깜빡임/중복 (이전 세션에서 실패)
- litert-bridge iOS Swift 파일이 보일러플레이트만 (Android만 실제 구현)
- BackendTestScreen 존재 — 테스트용, 배포 시 제거 필요
- Kotlin 참조 파일(src/native/) — 구현 참조용, 실행 코드 아님

---

## 구조도

```
내손앱 메인입력 화면 RN/
├── App.js                    # 진입점: WebView + RN 카메라 오버레이
├── index.js                  # Expo 엔트리
├── app.json / eas.json       # Expo 설정
├── src/
│   ├── screens/
│   │   ├── MainCameraScreen.js    # 메인 화면 (5버튼: 촬영/업로드/음성/보관함/설정)
│   │   └── BackendTestScreen.js   # ⚠️ 테스트용 — 배포 시 제거
│   ├── components/
│   │   ├── CameraView.js          # 카메라 뷰
│   │   ├── FooterButtons.js       # 하단 5버튼
│   │   ├── LiveChat.js            # 실시간 채팅 UI
│   │   └── TravelAssistant.js     # AI 가이드 UI
│   ├── hooks/
│   │   ├── useCamera.js           # 카메라 촬영/갤러리
│   │   ├── useVoice.js            # 음성 녹음 (expo-av, 16kHz PCM)
│   │   ├── useLocation.js         # GPS 위치
│   │   ├── useSave.js             # 저장 기능
│   │   └── useAI.js               # Gemini AI + TTS (expo-speech)
│   ├── services/
│   │   ├── GeminiLiveApi.js       # Gemini Live 스트리밍 API
│   │   ├── GemmaEngine.js         # Gemma 4 온디바이스 AI (LiteRT)
│   │   ├── ModelDownloader.js     # 모델 다운로드 관리
│   │   ├── ArchiveService.js      # 보관함 CRUD
│   │   ├── ExchangeRateService.js # 환율 조회
│   │   ├── TranslationService.js  # 번역
│   │   ├── PromptService.js       # AI 프롬프트 관리
│   │   └── SOSService.js          # 긴급 SOS 기능
│   ├── api/
│   │   └── backendApi.js          # 서버 API 연동
│   ├── config/constants.js        # 설정 상수 (API URL 등)
│   ├── i18n/translations.js       # 다국어 번역
│   ├── state/store.js             # Zustand 전역 상태
│   ├── styles/theme.js            # UI 테마
│   └── native/                    # Kotlin 참조 코드 (LiteRT용)
│       ├── reference-AudioRecorderPanel.kt
│       ├── reference-ChatPanel.kt
│       └── reference-LiveCameraView.kt
├── litert-bridge/                 # Gemma 4 네이티브 모듈
│   ├── android/                   # Kotlin 구현 (LitertBridgeModule.kt)
│   ├── ios/                       # Swift 보일러플레이트 (⚠️ 미구현)
│   ├── src/                       # TypeScript 인터페이스
│   └── expo-module.config.json    # Expo 모듈 설정
└── assets/                        # 아이콘/스플래시
```

---

## 이식 방법

### 1. 폴더 복사
이 폴더 전체를 대상 RN 프로젝트에 복사 (또는 서브모듈)

### 2. 의존성 설치
```bash
cd [이 폴더]
npm install
```

### 3. 핵심 파일 연결
- `MainCameraScreen.js` — 메인 화면 컴포넌트
- `App.js` — WebView + 카메라 오버레이 통합 예시

### 4. 필요한 Expo 패키지
```json
{
  "expo-camera": "~17.0.10",
  "expo-av": "~16.0.8",
  "expo-location": "~19.0.8",
  "expo-speech": "~14.0.8",
  "expo-speech-recognition": "^3.1.2",
  "expo-file-system": "~19.0.21",
  "expo-image-picker": "~17.0.10",
  "@google/generative-ai": "^0.24.1",
  "zustand": "^5.0.12"
}
```

### 5. 서버 연결
`src/config/constants.js`에서 API URL 변경:
```js
export const API_BASE_URL = 'https://your-server.com';
```

### 6. 주의사항
- iOS 음성인식: WKWebView에서 SpeechRecognition API 차단 → expo-speech-recognition 필수
- 삼성 Exynos: WebView 렌더링 버그 → TWA 전환 권장
- litert-bridge iOS: Swift 구현 필요 (현재 보일러플레이트만)
