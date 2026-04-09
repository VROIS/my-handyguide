// ⚠️ 수정금지(승인필요): 2026-04-09 Android 15 삼성 버그 전체 수정 적용
// 적용된 수정 목록 (research 기반, 누락 없음):
// [1] edge-to-edge 강제 대응 → SafeAreaProvider + useSafeAreaInsets (하단 네비게이션 바)
// [2] onPermissionRequest → getUserMedia 카메라/마이크 허용 (없으면 조용히 거부됨)
// [3] 백그라운드 네트워크 제한 대응 → AppState 복귀 감지 + onError 자동 재시도
// [4] 강제종료 PendingIntent 취소 대응 → AppState active 복귀 시 재연결 주입
// [5] 오디오 포커스 보호 → mediaPlaybackRequiresUserAction=false + setSupportMultipleWindows
// [6] Samsung One UI 7 tapjacking 대응 → setSupportMultipleWindows=false
// [7] iOS 콘텐츠 프로세스 종료(WK) 대응 → onContentProcessDidTerminate 재로드

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, BackHandler, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
// ⚠️ 수정금지(승인필요): SafeAreaProvider — Android 15 edge-to-edge 인셋 제공
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useEffect, useCallback } from 'react';
import Constants from 'expo-constants';

// ⚠️ 수정금지(승인필요): 실제 도메인 my-handyguide1 (1 포함)
const WEB_APP_URL = Constants.expoConfig?.extra?.webAppUrl || 'https://my-handyguide1.replit.app';

// ⚠️ 수정금지(승인필요): Chrome UA — Google OAuth 403 방지 (embedded WebView UA 차단 우회)
const CHROME_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';

// ⚠️ 수정금지(승인필요): WebView 메인 컴포넌트 — SafeAreaProvider 자식으로 분리 (훅 사용)
function WebViewScreen() {
  const webViewRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // [1] Android 15 edge-to-edge: 상단/하단 시스템 UI 인셋 값 획득
  // SafeAreaView 대신 직접 insets 적용 → 3버튼/제스처 네비게이션 바 모두 대응
  const insets = useSafeAreaInsets();

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

  // ⚠️ 수정금지(승인필요): [3][4] AppState 복귀 감지
  // Android 15 백그라운드 네트워크 제한: 앱이 background→active 전환 시
  // UnknownHostException 발생 → 포그라운드 복귀 후 WebView 재연결 트리거
  // 강제종료 후 PendingIntent 취소 대응: 복귀 시 앱 상태 재초기화
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (webViewRef.current) {
          // 웹앱에 포그라운드 복귀 신호 전달 → 네트워크 재연결 처리
          webViewRef.current.injectJavaScript(
            'if(typeof window.__handyReconnect==="function")window.__handyReconnect();true;'
          );
        }
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // ⚠️ 수정금지(승인필요): [3] 네트워크 오류 자동 재시도
  // Android 15 백그라운드 네트워크 제한으로 발생하는 오류 대응
  // code < 0 = 네트워크 레벨 오류 (UnknownHostException, ERR_INTERNET_DISCONNECTED 등)
  const handleError = useCallback((syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.code < 0) {
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }, 3000);
    }
  }, []);

  // ⚠️ 수정금지(승인필요): [2] Android 15 onPermissionRequest 필수 처리
  // 없으면 WebView가 getUserMedia(카메라/마이크) 요청을 조용히 거부함
  // Samsung WebView + Android 15에서 특히 문제 → 명시적 grant 필요
  const handlePermissionRequest = useCallback((request) => {
    request.grant(request.resources);
  }, []);

  return (
    // ⚠️ 수정금지(승인필요): [1] edge-to-edge 인셋 패딩 적용
    // Android: 상단 상태바 + 하단 3버튼/제스처 네비게이션 바 모두 처리
    // iOS: SafeAreaProvider가 자동 처리 (paddingTop/Bottom=0)
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'android' ? insets.top : 0,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar style="light" backgroundColor="#4285F4" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        // ⚠️ 수정금지(승인필요): [5] 오디오 포커스 — TTS/음성 자동 재생 허용
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        geolocationEnabled={true}
        cacheEnabled={true}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        userAgent={CHROME_USER_AGENT}
        // ⚠️ 수정금지(승인필요): [2] Android 15 카메라/마이크 권한 허용
        onPermissionRequest={handlePermissionRequest}
        // ⚠️ 수정금지(승인필요): [3] 백그라운드 네트워크 오류 → 자동 재시도
        onError={handleError}
        // ⚠️ 수정금지(승인필요): [6] Samsung One UI 7 tapjacking 차단 대응
        // 다중창 허용 시 Edge Panel 등이 터치 이벤트 가로챌 수 있음
        setSupportMultipleWindows={false}
        // ⚠️ 수정금지(승인필요): [7] iOS WKWebView 콘텐츠 프로세스 비정상 종료 → 자동 재로드
        onContentProcessDidTerminate={() => {
          if (webViewRef.current) {
            webViewRef.current.reload();
          }
        }}
      />
    </View>
  );
}

// ⚠️ 수정금지(승인필요): SafeAreaProvider 최상위 래퍼
// Android 15 edge-to-edge 인셋 값을 하위 컴포넌트에 제공
export default function App() {
  return (
    <SafeAreaProvider>
      <WebViewScreen />
    </SafeAreaProvider>
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
