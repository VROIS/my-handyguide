// ⚠️ 수정금지(승인필요): 메인 카메라 화면 — 5개 버튼 + 카메라 라이브뷰
// 촬영/업로드/보관함 → onNavigateToWebView로 WebView 전환
// 라이브/여행비서 → 메인 화면 유지 + 음성 모드 토글
// Alert 사용 금지 — 모든 안내는 음성 (백엔드 담당)
import React, { useState, useCallback, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

import CameraView from '../components/CameraView';
import FooterButtons from '../components/FooterButtons';
import LiveChat from '../components/LiveChat';
import TravelAssistant from '../components/TravelAssistant';
import { useCamera } from '../hooks/useCamera';
import { useAI } from '../hooks/useAI';
import { useStore } from '../state/store';
import { theme } from '../styles/theme';
import { CONFIG } from '../config/constants';

// ⚠️ 수정금지(승인필요): debounce — 기존 index.js:537-550 debounceClick 클론
const debounceMap = new Map();
function debounceClick(key, callback, delay = 500) {
  const now = Date.now();
  if (now - (debounceMap.get(key) || 0) < delay) return;
  debounceMap.set(key, now);
  callback();
}

export default function MainCameraScreen({ onNavigateToWebView }) {
  const { cameraRef, takePicture, startFrameCapture, stopFrameCapture } = useCamera();
  const { sendText, analyzeImage, stopSpeaking } = useAI();
  const {
    liveMode, setLiveMode,
    setActiveFeature, activeFeature,
    addMessage,
  } = useStore();

  const [showAssistant, setShowAssistant] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ⚠️ 수정금지(승인필요): 5개 버튼 핸들러 분기
  const handleButtonPress = useCallback((buttonId) => {
    switch (buttonId) {
      case 'live':
        handleLive();
        break;
      case 'capture':
        debounceClick('capture', () => handleCapture(), 300); // 기존: 300ms
        break;
      case 'upload':
        handleUpload(); // 기존: debounce 없음
        break;
      case 'assistant':
        handleAssistant();
        break;
      case 'archive':
        debounceClick('archive', () => handleArchive(), 300); // 기존: 300ms
        break;
    }
  }, [liveMode, isProcessing, showAssistant]);

  // ⚠️ 수정금지(승인필요): 라이브 — Always-Listening 토글 (메인 화면 유지 + 음성)
  const handleLive = useCallback(() => {
    if (liveMode !== 'off') {
      setLiveMode('off');
      stopFrameCapture();
      stopSpeaking();
      setActiveFeature(null);
    } else {
      setLiveMode('listening');
      setActiveFeature('live');
      startFrameCapture(async (frame) => {
        // 카메라 프레임 → AI 분석 (백엔드 담당)
      });
    }
  }, [liveMode, setLiveMode, startFrameCapture, stopFrameCapture, stopSpeaking, setActiveFeature]);

  // ⚠️ 수정금지(승인필요): 촬영 → WebView 상세 페이지 전환
  // 기존 흐름: capturePhoto → processImage(dataUrl, shootBtn) → showDetailPage()
  const handleCapture = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveFeature('capture');

    try {
      const photo = await takePicture();
      if (photo?.base64 && onNavigateToWebView) {
        // WebView 상세 페이지로 전환 + 이미지 전달
        onNavigateToWebView('detail', { imageBase64: photo.base64 });
      }
    } catch (e) {
      // 에러 시 음성 안내 (백엔드 useAI가 처리)
      console.error('[촬영 오류]', e.message);
    } finally {
      setIsProcessing(false);
      setActiveFeature(null);
    }
  }, [isProcessing, takePicture, onNavigateToWebView, setActiveFeature]);

  // ⚠️ 수정금지(승인필요): 업로드 → 갤러리 선택 → WebView 상세 페이지 전환
  // 기존 흐름: uploadInput.click() → handleFileSelect() → processImage(dataUrl, uploadBtn)
  const handleUpload = useCallback(async () => {
    if (isProcessing) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.base64 && onNavigateToWebView) {
        setIsProcessing(true);
        setActiveFeature('upload');
        // WebView 상세 페이지로 전환 + 이미지 전달
        onNavigateToWebView('detail', { imageBase64: result.assets[0].base64 });
      }
    } catch (e) {
      console.error('[업로드 오류]', e.message);
    } finally {
      setIsProcessing(false);
      setActiveFeature(null);
    }
  }, [isProcessing, onNavigateToWebView, setActiveFeature]);

  // ⚠️ 수정금지(승인필요): 여행비서 — 메인 화면 유지 + 음성 모드 토글
  const handleAssistant = useCallback(() => {
    setShowAssistant(!showAssistant);
    setActiveFeature(showAssistant ? null : 'assistant');
  }, [showAssistant, setActiveFeature]);

  // ⚠️ 수정금지(승인필요): 보관함 → WebView 보관함 페이지 전환
  // 기존 흐름: showArchivePage() → pauseCamera() + showPage(archivePage) + renderArchive()
  const handleArchive = useCallback(() => {
    if (onNavigateToWebView) {
      onNavigateToWebView('archive');
    }
  }, [onNavigateToWebView]);

  // ⚠️ 수정금지(승인필요): 여행비서 서브메뉴 선택 (백엔드 담당)
  const handleAssistantSelect = useCallback(async (menuId) => {
    setShowAssistant(false);
    // 백엔드 서비스 호출 (음성 안내)
  }, []);

  return (
    <View style={theme.container}>
      {/* ⚠️ 수정금지(승인필요): StatusBar 투명 — 상단 검정 띠 제거 */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* 카메라 전체 화면 배경 */}
      <CameraView ref={cameraRef} />

      {/* 라이브 대화 오버레이 (음성 보조 시각화) */}
      <LiveChat />

      {/* 여행비서 서브메뉴 */}
      <TravelAssistant
        visible={showAssistant}
        onSelect={handleAssistantSelect}
        onClose={() => { setShowAssistant(false); setActiveFeature(null); }}
      />

      {/* ⚠️ 수정금지(승인필요): 처리 중 스피너 — 기존 .loader animate-spin 클론 */}
      {isProcessing && (
        <View style={theme.spinnerOverlay}>
          <ActivityIndicator size="large" color={CONFIG.GEMINI_BLUE} />
        </View>
      )}

      {/* 5개 버튼 Footer */}
      <FooterButtons onPress={handleButtonPress} isProcessing={isProcessing} />
    </View>
  );
}
