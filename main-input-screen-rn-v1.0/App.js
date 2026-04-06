// ⚠️ 수정금지(승인필요): 앱 진입점 — WebView(기존 앱) + RN 카메라 오버레이
// WebView: 항상 전체 화면, 기존 앱 100% 그대로 동작
// 카메라 오버레이: absoluteFill로 WebView 위에 덮음, 조건부 표시/숨김
// 첫 성공 APK(RN테스트.apk)와 동일한 카메라 구조 + WebView 추가
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { WebView } from 'react-native-webview';
import MainCameraScreen from './src/screens/MainCameraScreen';

const WEB_APP_URL = 'https://my-handyguide1.replit.app';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const webViewRef = useRef(null);

  // 카메라 권한 자동 요청
  React.useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  // WebView → RN 카메라 오버레이 표시
  const handleWebViewMessage = useCallback((event) => {
    try {
      const data = event.nativeEvent.data;
      if (data === 'showNativeMain' || data === 'showMainPage') {
        setShowCamera(true);
        return;
      }
      const msg = JSON.parse(data);
      if (msg.type === 'showNativeMain' || msg.type === 'showMainPage') {
        setShowCamera(true);
      }
    } catch (e) {}
  }, []);

  // 촬영/업로드/보관함 → 카메라 오버레이 숨김 → WebView가 처리
  const handleNavigateToWebView = useCallback((page, data) => {
    setShowCamera(false);
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
    }, 300);
  }, []);

  // Android 뒤로가기
  React.useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showCamera) {
        setShowCamera(false);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [showCamera]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* WebView — 항상 전체 화면, 기존 앱 100% 그대로 */}
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        startInLoadingState={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        geolocationEnabled={true}
        cacheEnabled={true}
        originWhitelist={['*']}
        mediaCapturePermissionGrantType="grant"
      />

      {/* RN 카메라 오버레이 — WebView 위에 absoluteFill로 덮음 */}
      {showCamera && (
        <View style={StyleSheet.absoluteFill}>
          <MainCameraScreen onNavigateToWebView={handleNavigateToWebView} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1 },
});
