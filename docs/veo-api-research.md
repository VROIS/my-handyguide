# Veo 3.1 API 기술 연구 문서

작성일: 2025-12-21

## 1. API 접근 방법

### Gemini API (권장)
- 이미 Gemini API 키 보유 → 동일 키로 Veo 3.1 사용 가능
- 문서: https://ai.google.dev/gemini-api/docs/video-generation

### Vertex AI (엔터프라이즈)
- 대규모 프로덕션용
- Google Cloud 계정 필요

## 2. API 호출 예시 (Node.js)

### 기본 영상 생성

```javascript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateVideo(prompt, imageBase64) {
  // 1. 영상 생성 시작 (비동기)
  const operation = await ai.models.generateVideo({
    model: 'veo-3.1-generate-preview', // 또는 'veo-3.1-generate-preview-fast'
    prompt: prompt,
    referenceImages: imageBase64 ? [{ base64: imageBase64 }] : undefined,
    config: {
      aspectRatio: '16:9',      // 또는 '9:16' (세로)
      duration: 8,              // 4, 6, 8초
      numberOfVideos: 1,
    }
  });

  // 2. 작업 ID 반환 (폴링용)
  return operation.name; // 예: 'operations/abc123'
}
```

### 생성 상태 폴링

```javascript
async function pollVideoStatus(operationName) {
  const operation = await ai.operations.get(operationName);
  
  if (operation.done) {
    if (operation.error) {
      throw new Error(operation.error.message);
    }
    // 완료 - 영상 URL 반환
    return operation.result.videos[0].uri;
  }
  
  // 아직 진행 중
  return null;
}
```

### 영상 연장 (20초 만들기)

```javascript
async function extendVideo(videoUri, extensionPrompt) {
  const operation = await ai.models.extendVideo({
    model: 'veo-3.1-extend-preview',
    videoUri: videoUri,
    prompt: extensionPrompt,
    config: {
      extensionDuration: 7, // 7초 추가
    }
  });
  
  return operation.name;
}

// 20초 영상 생성 플로우
async function generate20SecVideo(prompt, imageBase64) {
  // 1단계: 8초 생성
  const op1 = await generateVideo(prompt, imageBase64);
  const video1 = await waitForCompletion(op1); // 60-90초 대기
  
  // 2단계: +7초 연장 (15초)
  const op2 = await extendVideo(video1, prompt);
  const video2 = await waitForCompletion(op2);
  
  // 3단계: +7초 연장 (22초)
  const op3 = await extendVideo(video2, prompt);
  const finalVideo = await waitForCompletion(op3);
  
  return finalVideo;
}
```

## 3. 모델 옵션

| 모델 | 용도 | 가격 |
|------|------|------|
| `veo-3.1-generate-preview-fast` | 빠른 생성, 테스트용 | $0.15/초 |
| `veo-3.1-generate-preview` | 고품질 최종 결과물 | $0.40/초 |
| `veo-3.1-extend-preview` | 영상 연장 | $0.15-$0.40/초 |

## 4. 레퍼런스 이미지 활용

사용자 사진을 영상에 반영하는 방법:

```javascript
const operation = await ai.models.generateVideo({
  model: 'veo-3.1-generate-preview',
  prompt: '영화 같은 여행 장면, 황금빛 석양',
  referenceImages: [
    { base64: userPhoto1 },
    { base64: userPhoto2 },
    { base64: userPhoto3 }  // 최대 3장
  ],
  config: {
    aspectRatio: '16:9',
    duration: 8,
  }
});
```

## 5. 프리셋 프롬프트 (전문가 수준)

### 🎬 시네마틱

```
Transform this travel scene into a cinematic masterpiece.
Camera: slow dolly push-in on tripod, 50mm lens, medium-wide shot.
Lighting: soft ambient with golden hour warmth, low contrast.
Motion cues: gentle wind in hair/fabric, subtle parallax on background.
Aesthetic: teal-and-amber color grade, gentle halation, soft film grain (Kodak 2383).
Constraints: avoid cartoonish saturation, no time-lapse trails.
Aspect: 16:9, 8 seconds, relaxed cinematic pacing.
Audio: ambient environmental sounds, soft orchestral undertone.
```

### 📱 브이로그

```
Create an authentic travel vlog moment, selfie-style POV.
Camera: handheld with natural movement, slight bounce while walking.
Lighting: natural daylight, slightly overexposed highlights for casual feel.
Motion cues: people walking by, vendor stalls, street activity.
Aesthetic: warm and inviting, slightly grainy smartphone look.
Constraints: avoid over-stabilization, keep it raw and real.
Aspect: 9:16 (vertical), 8 seconds, energetic pacing.
Audio: ambient street sounds, casual speaking tone.
```

### ✨ 에픽 리빌

```
Create an epic reveal shot that inspires awe.
Camera: crane shot starting low, ascending to reveal vast landscape.
Lighting: dramatic sunrise/sunset, god rays through clouds.
Motion cues: birds flying across frame, clouds drifting.
Aesthetic: high dynamic range, saturated but natural colors.
Constraints: maintain sense of scale, avoid quick cuts.
Aspect: 16:9, 8 seconds, building to climax.
Audio: swelling orchestral music, wind sounds.
```

### 🌅 골든아워

```
Capture the magic of golden hour in slow motion.
Camera: smooth tracking shot, following subject, shallow depth of field.
Lighting: warm backlight, lens flare, rim lighting on subject.
Motion cues: slow-motion hair movement, dust particles in light.
Aesthetic: warm orange/gold tones, dreamy soft focus edges.
Constraints: avoid harsh shadows, maintain warmth throughout.
Aspect: 16:9, 8 seconds, slow and romantic.
Audio: gentle acoustic guitar, ambient nature sounds.
```

### 🎭 아트필터

```
Transform this scene into a living painting, Studio Ghibli inspired.
Camera: gentle pan across painted landscape, parallax layers.
Lighting: soft diffused light, pastel shadows.
Motion cues: hand-drawn style movement, leaves floating, clouds morphing.
Aesthetic: watercolor texture, soft edges, pastel color palette.
Constraints: maintain hand-painted look, avoid photorealism.
Aspect: 16:9, 8 seconds, meditative pacing.
Audio: soft piano, wind chimes, nature ambience.
```

## 6. 나레이션 통합

Veo 3.1은 음성을 자동 생성 가능. 프롬프트에 대사 포함:

```
[시각 장면 설명]
Camera: slow push-in on the Eiffel Tower at sunset.
Aesthetic: cinematic, golden hour.

[나레이션 대사]
Narrator says (gentle, reflective tone): "여기 바로 영화 인셉션의 촬영지입니다. 크리스토퍼 놀란 감독이 이 광장에서..."

Audio: narrator's voice with soft ambient background.
```

## 7. 에러 핸들링

```javascript
async function safeGenerateVideo(prompt, imageBase64) {
  try {
    const operationName = await generateVideo(prompt, imageBase64);
    
    // 최대 10분 대기 (20초 영상 = ~5분 생성)
    const maxWait = 600000; // 10분
    const pollInterval = 10000; // 10초
    let waited = 0;
    
    while (waited < maxWait) {
      const result = await pollVideoStatus(operationName);
      if (result) return result;
      
      await sleep(pollInterval);
      waited += pollInterval;
    }
    
    throw new Error('VIDEO_GENERATION_TIMEOUT');
    
  } catch (error) {
    if (error.message.includes('QUOTA_EXCEEDED')) {
      // 할당량 초과 - 나중에 재시도
    }
    if (error.message.includes('CONTENT_POLICY')) {
      // 콘텐츠 정책 위반
    }
    throw error;
  }
}
```

## 8. 비용 최적화

| 전략 | 절감 효과 |
|------|----------|
| Fast 모델 사용 (테스트/프로토타입) | 60% 절감 |
| 8초 단위로 정확히 생성 | 불필요한 연장 방지 |
| 720p 사용 (SNS 충분) | 렌더링 속도 향상 |
| 나레이션 없는 영상 | 33% 절감 (audio 비활성화) |

## 9. 저장 및 제공

생성된 영상은 Google Cloud Storage에 임시 저장됨.
우리 서버로 다운로드하여 Object Storage에 영구 저장 필요.

```javascript
async function downloadAndSaveVideo(videoUri, dreamVideoId) {
  // Google 임시 URL에서 다운로드
  const response = await fetch(videoUri);
  const buffer = await response.buffer();
  
  // Replit Object Storage에 저장
  const filename = `dream-videos/${dreamVideoId}.mp4`;
  await storage.upload(filename, buffer);
  
  return `/uploads/dream-videos/${dreamVideoId}.mp4`;
}
```

## 10. 다음 단계 (구현 시)

1. `@google/genai` 패키지 설치 확인 (이미 설치됨)
2. Gemini API 키가 Veo 3.1 접근 권한 있는지 확인
3. 테스트 생성 (8초 단일 클립)
4. 연장 기능 테스트 (8초 → 15초)
5. 프론트 연동

---

## 참고 자료

- [Gemini API Video Generation 공식 문서](https://ai.google.dev/gemini-api/docs/video-generation)
- [Veo 3.1 프롬프트 가이드](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- [Replicate Veo 3.1 예시](https://replicate.com/google/veo-3.1)
