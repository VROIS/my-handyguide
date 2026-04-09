// ⚠️ 수정금지(승인필요): 2026-04-08 순수 WebView 앱 — 웹 자체 로직으로 전부 동작
// 삼성 앱 = WebView 껍데기만. 카메라/촬영/음성/보관함/AI 전부 웹에서 처리
// 네이티브 브릿지(TTS, 진동, 위치 등) 불필요 — 웹 자체 Web API로 동작
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useEffect } from 'react';
import Constants from 'expo-constants';

// ⚠️ 수정금지(승인필요): 실제 도메인 my-handyguide1 (1 포함)
const WEB_APP_URL = Constants.expoConfig?.extra?.webAppUrl || 'https://my-handyguide1.replit.app';

// ⚠️ 수정금지(승인필요): Chrome UA — Google OAuth 403 방지 (embedded WebView UA 차단 우회)
const CHROME_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';

export default function App() {
  const webViewRef = useRef(null);

  // ⚠️ 수정금지(승인필요): Android 뒤로가기 → WebView 히스토리 백
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => backHandler.remove();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#4285F4" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        geolocationEnabled={true}
        cacheEnabled={true}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        userAgent={CHROME_USER_AGENT}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4285F4',
  },
  webview: {
    flex: 1,
  },
});
