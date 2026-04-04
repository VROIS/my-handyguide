# /deploy — 원스톱 배포 (커밋 → 푸시 → 빌드 → 게시)

변경사항을 커밋하고 GitHub에 push한 후, 앱 빌드까지 자동 실행합니다.

## 실행 순서  **커밋전 Simplify+Review Skills 사용 2단계 검증 필수**

### 1. 변경사항 확인
- `git status`로 변경 파일 목록 확인
- `git diff --stat`로 변경 규모 확인
- 변경 없으면 "변경사항 없음" 출력 후 중단

### 2. 스테이징
- 변경된 파일을 개별적으로 `git add` (git add -A 사용 금지)
- 민감 파일 제외: `.env`, `credentials.json`, `*.p12`, `*.mobileprovision`, `*.keystore`, `*.jks`, `*.b64`, `*.p8`
- 제외된 파일이 있으면 사용자에게 알림

### 3. 커밋 메시지 생성
- `git diff --cached`를 분석하여 변경 내용 파악
- 한국어로 간결한 커밋 메시지 작성 (예: "TTS 자동재생 전환 + keepAwake 연결")
- 최근 커밋 스타일(`git log --oneline -5`)에 맞춤
- Co-Authored-By 포함

### 4. 커밋 실행
- HEREDOC 형식으로 커밋 메시지 전달
- pre-commit hook 실패 시 수정 후 새 커밋 (amend 금지)

### 5. 버전 코드 체크 (필수)
- `mobile-app/app.json` → `android.versionCode` 확인
- `mobile-app/app.json` → `ios.buildNumber` 확인
- Google Play 마지막 게시 versionCode보다 +1 이상인지 검증
- App Store 마지막 buildNumber보다 +1 이상인지 검증
- 부족하면 올린 후 커밋에 포함

### 6. GitHub push
- `git push origin main`
- push 실패 시 `git pull --rebase origin main` 후 재시도
- force push 절대 금지

### 7. 앱 빌드 트리거 (터미널에서 자동 실행)
```bash
# gh CLI 경로 (Windows)
GH="/c/Program Files/GitHub CLI/gh.exe"

# Android AAB 빌드 (~11분)
"$GH" workflow run build-android.yml --ref main

# iOS IPA 빌드 + TestFlight 자동 제출 (~8분)
"$GH" workflow run build-ios.yml --ref main

# 빌드 상태 확인
"$GH" run list --limit 2
```

### 8. 빌드 모니터링
```bash
# 최근 워크플로우 ID 확인 후 감시
"$GH" run watch <RUN_ID> --exit-status
```

### 9. 결과 보고
```
✅ 배포 완료
- 커밋: [해시] [메시지]
- versionCode: [N], buildNumber: "[N]"

📱 빌드 상태:
- Android AAB: ✅/❌ (소요시간)
- iOS IPA + TestFlight: ✅/❌ (소요시간)

🌐 웹 배포:
- Replit → Git 탭 → Pull → Deploy (수동)

📦 Google Play:
- Artifact에서 AAB 다운로드 → 내부 테스트 업로드 → 출시 → 프로모트(승격) → 비공개 테스트
- ⚠️ 같은 AAB를 내부+비공개에 직접 업로드 금지 (승격만 사용)

🍎 iOS:
- TestFlight 자동 제출됨 → Apple 심사 대기 (보통 몇 시간)
```

---

## GitHub Actions 워크플로우 구조

| 파일 | 트리거 | 내용 |
|------|--------|------|
| `.github/workflows/build-android.yml` | workflow_dispatch | EAS Build → AAB → Artifact 업로드 |
| `.github/workflows/build-ios.yml` | workflow_dispatch | .p8 키 Secret 복원 → EAS Build → IPA → TestFlight 자동 제출 |

### iOS .p8 키 처리
- 로컬: `mobile-app/AuthKey_H92XS2QHYH.p8` (.gitignore로 제외)
- GitHub Secret: `APPLE_API_KEY_BASE64` (base64 인코딩)
- 워크플로우에서: Secret → base64 디코딩 → 파일 복원 → eas submit 사용

### gh CLI
- 설치 경로: `/c/Program Files/GitHub CLI/gh.exe`
- 인증: VROIS 계정 로그인 완료
- 인증 만료 시: `"$GH" auth login --hostname github.com --git-protocol https --web`

---

## 배포 일지

### 2026-04-04 (v15/b6)
- **versionCode**: 14 → 15, **buildNumber**: "5" → "6"
- **커밋**: `b50ce7e` iOS 워크플로우 .p8 키 Secret 복원 수정
- **커밋**: `20b3448` 삼성폰 하단 버튼 4단계 방어적 레이아웃 + 아이폰 버튼 복원
- **빌드**: Android AAB ✅ (11m14s), iOS IPA + TestFlight ✅ (7m44s)
- **변경**: App.js (NativeFooter), index.html (CSS 방어), index.js (아이폰 복원), app.json (버전)

### 2026-03-20 (v11/b4)
- **versionCode**: 10 → 11, **buildNumber**: 3 → 4
- **변경**: expo-speech-recognition 활성화, OAuth WebView 대응, 프로필 닫기 복구
