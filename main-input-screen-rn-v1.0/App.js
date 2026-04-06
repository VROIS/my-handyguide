// ⚠️ 수정금지(승인필요): 앱 진입점 — RN 메인 카메라 + WebView 페이지 전환
// 메인 카메라: RN 네이티브 (삼성 Exynos WebView 렌더링 버그 우회)
// 상세/보관함: WebView (기존 앱 그대로)
// 전환: onNavigateToWebView → showNativeMain=false → WebView 표시
// 복귀: WebView postMessage('showMainPage') → showNativeMain=true
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, BackHandler, Platform } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { WebView } from 'react-native-webview';
import MainCameraScreen from './src/screens/MainCameraScreen';

const WEB_APP_URL = 'https://my-handyguide1.replit.app';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showNativeMain, setShowNativeMain] = useState(false); // WebView 먼저 (랜딩/기능설명)
  const webViewRef = useRef(null);

  // ⚠️ 수정금지(승인필요): 카메라 권한 자동 요청
  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // ⚠️ 수정금지(승인필요): RN 메인 → WebView 전환 콜백
  // 촬영/업로드: detail + imageBase64 → WebView에서 processImage 실행
  // 보관함: archive → WebView에서 showArchivePage 실행
  const handleNavigateToWebView = useCallback((page, data) => {
    setShowNativeMain(false);

    setTimeout(() => {
      if (page === 'detail' && data?.imageBase64) {
        webViewRef.current?.injectJavaScript(`
          if (typeof processImage === 'function') {
            processImage('data:image/jpeg;base64,${data.imageBase64}');
          }
          true;
        `);
      } else if (page === 'archive') {
        webViewRef.current?.injectJavaScript(`
          if (typeof showArchivePage === 'function') { showArchivePage(); }
          true;
        `);
      }
    }, 500);
  }, []);

  // ⚠️ 수정금지(승인필요): WebView → RN 전환 (postMessage)
  // showNativeMain: 랜딩/기능설명 끝나고 메인 입력 진입 시
  // showMainPage: 상세/보관함에서 메인으로 복귀 시
  const handleWebViewMessage = useCallback((event) => {
    try {
      const data = event.nativeEvent.data;
      // 단순 문자열 메시지 처리
      if (data === 'showNativeMain' || data === 'showMainPage') {
        setShowNativeMain(true);
        return;
      }
      // JSON 메시지 처리
      const message = JSON.parse(data);
      if (message.type === 'showNativeMain' || message.type === 'showMainPage') {
        setShowNativeMain(true);
      }
    } catch (e) {
      // JSON 파싱 실패 — 단순 문자열은 위에서 이미 처리
    }
  }, []);

  // ⚠️ 수정금지(승인필요): Android 뒤로가기 → WebView일 때 RN 메인으로 복귀
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!showNativeMain) {
        setShowNativeMain(true);
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [showNativeMain]);

  return (
    <View style={styles.container}>
      {/* ⚠️ 수정금지(승인필요): StatusBar 투명 — 상단 검정 띠 제거 */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* RN 메인 카메라 화면 */}
      {showNativeMain && (
        <MainCameraScreen onNavigateToWebView={handleNavigateToWebView} />
      )}

      {/* WebView (상세/보관함 등 기존 페이지) */}
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={[styles.webview, showNativeMain && styles.hidden]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        geolocationEnabled={true}
        cacheEnabled={true}
        originWhitelist={['*']}
        mediaCapturePermissionGrantType="grant"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  hidden: {
    height: 0,
    opacity: 0,
    position: 'absolute',
  },
});
