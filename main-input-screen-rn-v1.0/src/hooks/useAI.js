// ⚠️ 수정금지(승인필요): AI 통합 훅 — Gemma 4 온디바이스 ↔ Gemini API 자동 전환
// 음성 중심 UX: 모든 AI 응답은 텍스트 + TTS 출력
import { useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useStore } from '../state/store';
import { CONFIG } from '../config/constants';
import { isEngineReady, sendMessage as gemmaSend } from '../services/GemmaEngine';
import { initGemini, sendTextStream, analyzeImageStream, isGeminiReady } from '../services/GeminiLiveApi';

export function useAI() {
  const {
    liveMode, setLiveMode,
    addMessage, setActiveFeature,
    useOnlineFallback, setOnlineFallback,
  } = useStore();

  // ⚠️ 수정금지(승인필요): 앱 시작 시 Gemini API 자동 초기화 (Gemma 4 폴백용)
  useEffect(() => {
    if (CONFIG.API.GEMINI_API_KEY) {
      initGemini(CONFIG.API.GEMINI_API_KEY);
    }
  }, []);

  // ⚠️ 수정금지(승인필요): AI에 텍스트 전송 + 스트리밍 응답 + TTS
  // Gemma → 실패 시 Gemini → 둘 다 실패 시 에러
  const sendText = useCallback(async (text, { speak = true, systemPrompt } = {}) => {
    addMessage({ role: 'user', text });
    let fullResponse = '';

    try {
      // 1순위: Gemma 4 온디바이스
      if (isEngineReady()) {
        for await (const token of gemmaSend({ text, systemPrompt })) {
          fullResponse += token;
        }
      } else {
        throw new Error('FALLBACK_TO_ONLINE');
      }
    } catch {
      // 2순위: Gemini API 온라인
      if (isGeminiReady()) {
        setOnlineFallback(true);
        for await (const token of sendTextStream(text)) {
          fullResponse += token;
        }
      } else {
        fullResponse = '인터넷 연결을 확인해주세요. 오프라인 AI 모델을 먼저 다운로드하세요.';
      }
    }

    addMessage({ role: 'ai', text: fullResponse });

    // 음성 출력 (핵심 UX — 화면 안 봐도 됨)
    if (speak && fullResponse) {
      Speech.speak(fullResponse, {
        language: CONFIG.VOICE.LANGUAGE,
        rate: CONFIG.VOICE.TTS_RATE,
        pitch: CONFIG.VOICE.TTS_PITCH,
      });
    }

    return fullResponse;
  }, [addMessage, setOnlineFallback]);

  // ⚠️ 수정금지(승인필요): 이미지 분석 + 음성 응답
  const analyzeImage = useCallback(async (imageBase64, { speak = true, prompt } = {}) => {
    addMessage({ role: 'user', text: '[이미지 분석 중...]' });
    let fullResponse = '';

    try {
      if (isEngineReady()) {
        for await (const token of gemmaSend({ imageBase64, text: prompt, systemPrompt: CONFIG.PROMPTS.ANALYZER })) {
          fullResponse += token;
        }
      } else {
        throw new Error('FALLBACK_TO_ONLINE');
      }
    } catch (gemmaErr) {
      console.log('[useAI] Gemma 실패, Gemini 폴백 시도. isGeminiReady:', isGeminiReady());
      if (isGeminiReady()) {
        try {
          setOnlineFallback(true);
          for await (const token of analyzeImageStream(imageBase64, prompt || CONFIG.PROMPTS.ANALYZER)) {
            fullResponse += token;
          }
        } catch (geminiErr) {
          console.error('[useAI] Gemini API 호출 실패:', geminiErr.message);
          fullResponse = 'AI 분석 중 오류가 발생했습니다: ' + geminiErr.message;
        }
      } else {
        console.error('[useAI] Gemini 미초기화 — initGemini 호출 확인 필요');
        fullResponse = 'AI 엔진을 초기화하고 있습니다. 잠시 후 다시 시도해주세요.';
      }
    }

    addMessage({ role: 'ai', text: fullResponse });

    if (speak && fullResponse) {
      Speech.speak(fullResponse, {
        language: CONFIG.VOICE.LANGUAGE,
        rate: CONFIG.VOICE.TTS_RATE,
      });
    }

    return fullResponse;
  }, [addMessage, setOnlineFallback]);

  // ⚠️ 수정금지(승인필요): TTS 중지
  const stopSpeaking = useCallback(() => {
    Speech.stop();
  }, []);

  // ⚠️ 수정금지(승인필요): TTS 상태 확인
  const isSpeaking = useCallback(async () => {
    return Speech.isSpeakingAsync();
  }, []);

  return {
    sendText,
    analyzeImage,
    stopSpeaking,
    isSpeaking,
  };
}
