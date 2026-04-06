// ⚠️ 수정금지(승인필요): 2026-04-05 설정 상수
// 다른 앱에 이식 시 이 파일만 수정하면 됨

export const CONFIG = {
  // 색상 (기존 앱과 동일)
  GEMINI_BLUE: '#4285F4',
  BG_COLOR: '#FFFEFA',
  BUTTON_BG: 'rgba(0,0,0,0.6)',

  // 버튼 크기 (기존 56px 원형 유지)
  BUTTON_SIZE: 56,
  FOOTER_HEIGHT: 100,

  // Gemma 4 E2B 모델
  MODEL_REPO: 'litert-community/gemma-4-E2B-it-litert-lm',
  MODEL_FILENAME: 'gemma-4-E2B-it.litertlm',
  MODEL_SIZE_MB: 1800, // ~1.8GB 예상

  // 카메라
  CAMERA_FPS: 2, // 라이브 모드에서 초당 프레임 전송 수
  CAMERA_FRAME_SIZE: 500, // 프레임 캡처 해상도

  // API 폴백 (온라인)
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
  EXCHANGE_RATE_API: 'https://api.exchangerate-api.com/v4/latest',

  // 시스템 프롬프트 (페르소나)
  GUIDE_PROMPT: '당신은 전문 여행 가이드입니다. 카메라에 보이는 것을 친근하고 자세하게 설명해주세요. 역사, 문화, 재미있는 사실을 포함해주세요.',
  ASSISTANT_PROMPT: '당신은 현지 여행 비서입니다. 통역, 환율 계산, 교통 안내, 긴급 도움을 제공합니다. 항상 친절하고 실용적으로 답해주세요.',
};
