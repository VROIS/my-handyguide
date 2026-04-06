// ⚠️ 수정금지(승인필요): 메인 카메라 화면 — 기존 WebView 메인 페이지 RN 클론
// 삼성 Exynos GPU WebView 렌더링 버그 우회
// 5버튼: 라이브, 촬영, 업로드, 여행비서, 보관함
// 촬영/업로드/보관함 → WebView 전환, 라이브/여행비서 → 백엔드 구현 중
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import FooterButtons from '../components/FooterButtons';
import { t, SupportedLang } from '../i18n/translations';

type Props = {
  onNavigateToWebView?: (page: string, data?: any) => void;
  lang?: SupportedLang; // WebView에서 전달받은 현재 언어
};

export default function MainCameraScreen({ onNavigateToWebView, lang = 'ko' }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);

  // ⚠️ 수정금지(승인필요): 5개 버튼 정의 — 기존 4개 유지 + 라이브/여행비서 신규 + i18n 라벨
  const buttons = [
    { id: 'live', icon: 'live', label: t('live', lang), onPress: () => handleLive() },
    { id: 'capture', icon: 'capture', label: t('capture', lang), onPress: () => handleCapture() },
    { id: 'upload', icon: 'upload', label: t('upload', lang), onPress: () => handleUpload() },
    { id: 'assistant', icon: 'assistant', label: t('assistant', lang), onPress: () => handleAssistant() },
    { id: 'archive', icon: 'archive', label: t('archive', lang), onPress: () => handleArchive() },
  ];

  // ⚠️ 수정금지(승인필요): 라이브 — 백엔드 구현 중 (Gemini Live)
  const handleLive = useCallback(() => {
    Alert.alert('라이브 가이드', '카메라를 비추면 실시간으로 안내해드려요\n(구현 중)');
  }, []);

  // ⚠️ 수정금지(승인필요): 촬영 → WebView 상세 페이지로 전환 (기존 processImage 활용)
  const handleCapture = useCallback(async () => {
    if (isProcessing || !cameraRef.current) return;
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8 });
      if (photo && onNavigateToWebView) {
        // base64 이미지를 WebView에 전달 → 기존 processImage() 실행
        onNavigateToWebView('detail', { imageBase64: photo.base64, width: photo.width, height: photo.height });
      }
    } catch (e: any) {
      Alert.alert('촬영 오류', e.message);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onNavigateToWebView]);

  // ⚠️ 수정금지(승인필요): 업로드 → expo-image-picker → WebView 상세 페이지
  const handleUpload = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0] && onNavigateToWebView) {
        const asset = result.assets[0];
        onNavigateToWebView('detail', { imageBase64: asset.base64, width: asset.width, height: asset.height });
      }
    } catch (e: any) {
      Alert.alert('업로드 오류', e.message);
    }
  }, [onNavigateToWebView]);

  // ⚠️ 수정금지(승인필요): 여행비서 — 백엔드 구현 중 (환율/통역/SOS)
  const handleAssistant = useCallback(() => {
    Alert.alert('여행비서', '무엇을 도와드릴까요?\n통역 / 환율 / SOS\n(구현 중)');
  }, []);

  // ⚠️ 수정금지(승인필요): 보관함 → WebView 보관함 페이지로 전환
  const handleArchive = useCallback(() => {
    if (onNavigateToWebView) {
      onNavigateToWebView('archive');
    }
  }, [onNavigateToWebView]);

  // 카메라 권한 요청
  if (!permission?.granted) {
    requestPermission();
    return null;
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <FooterButtons buttons={buttons} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
});
