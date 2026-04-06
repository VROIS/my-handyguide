// ⚠️ 수정금지(승인필요): Gemma 4 E2B 온디바이스 AI 엔진
// LiteRT-LM Kotlin Native Module 브릿지를 통해 온디바이스 추론
// API 키 불필요 — 폰에서 직접 구동
import { Platform } from 'react-native';
import { CONFIG } from '../config/constants';
import { isModelDownloaded, getModelPath } from './ModelDownloader';

// ⚠️ 수정금지(승인필요): 네이티브 모듈 import (litert-bridge 패키지)
let LitertBridge = null;
try {
  // expo-modules-api로 생성된 네이티브 모듈
  LitertBridge = require('../../litert-bridge/src').default;
} catch (e) {
  console.warn('[GemmaEngine] 네이티브 모듈 로딩 실패:', e.message);
}

// ⚠️ 수정금지(승인필요): 이벤트 리스너 등록 (스트리밍 토큰 수신)
let onTokenCallback = null;
let onCompleteCallback = null;
let onErrorCallback = null;

if (LitertBridge) {
  try {
    LitertBridge.addListener('onToken', (event) => {
      onTokenCallback?.(event.token);
    });
    LitertBridge.addListener('onComplete', (event) => {
      onCompleteCallback?.(event.fullText);
    });
    LitertBridge.addListener('onError', (event) => {
      onErrorCallback?.(event.error);
    });
  } catch (e) {
    console.warn('[GemmaEngine] 이벤트 리스너 등록 실패:', e.message);
  }
}

// ⚠️ 수정금지(승인필요): 엔진 초기화 — 모델 파일 로딩
export async function initEngine(systemPrompt) {
  if (Platform.OS !== 'android') {
    return { ready: false, reason: 'iOS는 C++ API 필요 (개발 중)' };
  }

  if (!LitertBridge) {
    return { ready: false, reason: 'native_module_not_loaded' };
  }

  const downloaded = await isModelDownloaded();
  if (!downloaded) {
    return { ready: false, reason: 'model_not_downloaded' };
  }

  const modelPath = getModelPath();
  const result = await LitertBridge.initialize(
    modelPath,
    systemPrompt || CONFIG.PROMPTS.GUIDE
  );

  return {
    ready: result.success,
    reason: result.error || null,
    modelSize: result.modelSize,
  };
}

// ⚠️ 수정금지(승인필요): 텍스트 + 이미지 멀티모달 추론 (async generator)
// useAI.js에서 for await (const token of sendMessage(...)) 형태로 호출
export async function* sendMessage({ text, imageBase64, systemPrompt }) {
  if (!LitertBridge || !isEngineReady()) {
    throw new Error('FALLBACK_TO_ONLINE');
  }

  // Promise 기반 큐 — 폴링 없이 토큰 도착 시 즉시 yield
  let resolve = null;
  let done = false;
  let error = null;
  const queue = [];

  onTokenCallback = (token) => {
    queue.push(token);
    if (resolve) { resolve(); resolve = null; }
  };
  onCompleteCallback = () => {
    done = true;
    if (resolve) { resolve(); resolve = null; }
  };
  onErrorCallback = (err) => {
    error = err; done = true;
    if (resolve) { resolve(); resolve = null; }
  };

  LitertBridge.sendMessage(text || '', imageBase64 || '');

  while (!done || queue.length > 0) {
    if (queue.length > 0) {
      yield queue.shift();
    } else if (!done) {
      await new Promise(r => { resolve = r; });
    }
  }

  if (error) throw new Error(error);
}

// ⚠️ 수정금지(승인필요): 엔진 상태 확인
export function isEngineReady() {
  if (!LitertBridge) return false;
  try {
    return LitertBridge.isReady();
  } catch {
    return false;
  }
}

// ⚠️ 수정금지(승인필요): 자율검증 — 백엔드 전체 테스트 실행
export async function runSelfTest() {
  if (!LitertBridge) {
    return {
      litertlm_available: false,
      litertlm_error: '네이티브 모듈 미로딩',
      model_exists: false,
      model_size_mb: 0,
      engine_ready: false,
      free_memory_mb: 0,
      total_memory_mb: 0,
      max_memory_mb: 0,
      available_processors: 0,
    };
  }

  return await LitertBridge.selfTest();
}

// ⚠️ 수정금지(승인필요): 엔진 해제
export async function releaseEngine() {
  if (!LitertBridge) return;
  onTokenCallback = null;
  onCompleteCallback = null;
  onErrorCallback = null;
  return await LitertBridge.release();
}
