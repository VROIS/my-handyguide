import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, BackHandler, PermissionsAndroid, Linking, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useEffect, useCallback, useState } from 'react';
// ⚠️ 수정금지(승인필요): 2026-04-06 오버레이 방식 — WebView 항상 마운트 + RN 카메라 위에 덮음
// Stack Navigator는 WebView를 파괴(unmount)해서 삼성에서 재로딩 → 하얀 화면 발생
// 오버레이 방식: WebView 상태 유지 + RN 카메라 absoluteFill로 위에 덮음
// ⚠️ 수정금지(승인필요): 2026-04-05 네이티브 Google OAuth 핸들러 (외부 브라우저 안 열림)
import GoogleAuthHandler from './src/components/GoogleAuthHandler';
import Constants from 'expo-constants';
// ⚠️ 수정금지(승인필요): 2026-03-12 Google OAuth 외부 브라우저 + Stripe 결제용
import * as WebBrowser from 'expo-web-browser';
// ⚠️ 수정금지(승인필요): 2026-03-20 네이티브 음성인식 활성화 — expo-speech-recognition v3.0.1 (Expo 54 호환)
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

// ⚠️ 수정금지(승인필요): 2026-03-11 네이티브 브릿지용 모듈 import
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';

// ⚠️ 수정금지(승인필요): 2026-03-14 미연결 모듈 풀연결 — 네이티브 우선 + 웹 fallback 구조
import { Audio } from 'expo-audio';
import { CameraView } from 'expo-camera';
import { useVideoPlayer } from 'expo-video';
import * as KeepAwake from 'expo-keep-awake';
import * as Network from 'expo-network';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as DocumentPicker from 'expo-document-picker';
import * as Brightness from 'expo-brightness';
import * as Battery from 'expo-battery';
import * as Crypto from 'expo-crypto';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SMS from 'expo-sms';
import * as TaskManager from 'expo-task-manager';
import * as Updates from 'expo-updates';

// ⚠️ 수정금지(승인필요): 2026-04-06 RN 메인 카메라 화면 — 삼성 Exynos WebView 렌더링 버그 우회
import MainCameraScreen from './src/screens/MainCameraScreen';

// ⚠️ 수정금지(승인필요): 2026-04-06 Stack Navigator 제거 — WebView 파괴 방지

// ⚠️ 수정금지(승인필요): 2026-03-11 fallback URL에 "1" 누락 수정 — 실제 도메인은 my-handyguide1.replit.app
const WEB_APP_URL = Constants.expoConfig?.extra?.webAppUrl || 'https://my-handyguide1.replit.app';

// ⚠️ 수정금지(승인필요): 2026-03-12 iOS 최적 음성 매핑 (한국어=Yuna 강제, Roko 방지)
const IOS_VOICE_MAP = {
  'ko-KR': 'com.apple.ttsbundle.Yuna-compact',
  'en-US': 'com.apple.ttsbundle.Samantha-compact',
  'ja-JP': 'com.apple.ttsbundle.Kyoko-compact',
  'zh-CN': 'com.apple.ttsbundle.Ting-Ting-compact',
  'fr-FR': 'com.apple.ttsbundle.Thomas-compact',
  'de-DE': 'com.apple.ttsbundle.Anna-compact',
  'es-ES': 'com.apple.ttsbundle.Monica-compact',
};

// ⚠️ 수정금지(승인필요): 2026-03-17 플랫폼별 UA 설정
// Android: Chrome UA 강제 (WebView 호환성)
// iOS: Safari UA 설정 — WKWebView 기본 UA로는 Google OAuth 403 차단됨
// Google은 embedded WebView에서 OAuth를 차단하므로 Safari UA로 우회 필요
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';
const IOS_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

// ⚠️ 수정금지(승인필요): 2026-03-12 SafeAreaView가 safe-area 처리하므로 CSS 이중 패딩 제거
// Z Fold 등 큰 safe-area-inset-bottom 기기에서 하단 버튼 밀림 방지
// touch-action: manipulation → 300ms 터치 딜레이 제거
// ⚠️ 수정금지(승인필요): 2026-04-07 INJECTED_JS 전체 재작성
// 목적: (A) WebView mainPage 완전 차단 (B) MutationObserver 자동 pageReady (C) 모니터링
const INJECTED_JS = `
(function() {
  // ─── (A) CSS 패딩 정리 ───
  var style = document.createElement('style');
  style.textContent =
    '.footer-safe-area { padding-bottom: 0 !important; }' +
    '.gallery-footer { padding-bottom: 0 !important; }' +
    '.bottom-nav { padding-bottom: 0 !important; }';
  document.head.appendChild(style);

  // ─── (B) 모니터링 패널 (삼성 테스트용, 트리플탭 토글) ───
  var _monDiv = document.createElement('div');
  _monDiv.id = '_rnMonitor';
  _monDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9000;background:rgba(0,0,0,0.75);color:#0f0;font:10px monospace;max-height:100px;overflow-y:auto;padding:4px;display:none;';
  document.body.appendChild(_monDiv);
  var _monLogs = [];
  window.__rnMonitor = function(msg) {
    var ts = new Date().toISOString().substr(11,8);
    _monLogs.push(ts + ' ' + msg);
    if (_monLogs.length > 50) _monLogs.shift();
    _monDiv.innerHTML = _monLogs.join('<br>');
    _monDiv.scrollTop = _monDiv.scrollHeight;
  };
  var _monTaps = 0, _monTimer = null;
  document.addEventListener('touchstart', function() {
    _monTaps++;
    if (_monTimer) clearTimeout(_monTimer);
    _monTimer = setTimeout(function() { _monTaps = 0; }, 500);
    if (_monTaps >= 3) {
      _monTaps = 0;
      _monDiv.style.display = _monDiv.style.display === 'none' ? 'block' : 'none';
    }
  });

  // ─── (C) nativeResponse 수신 모니터링 ───
  window.addEventListener('nativeResponse', function(e) {
    if (window.__rnMonitor && e.detail) {
      window.__rnMonitor('RX: ' + (e.detail.type || 'unknown'));
    }
  });

  // ─── (D) mainPage 완전 차단 — WebView 메인 화면 비활성화 ───
  var _attempts = 0;
  var _waitForMain = setInterval(function() {
    if (++_attempts > 50) { clearInterval(_waitForMain); return; }
    var mainPage = document.getElementById('mainPage');
    // mainPage가 visible일 때만 차단 — 랜딩/인증 초기화 완료 후에만 실행
    // visible 체크 없으면 featuresPage 상태에서 차단 → WebView 초기화 미완료 → 엉뚱한 페이지 표시
    if (mainPage && mainPage.classList.contains('visible')) {
      clearInterval(_waitForMain);

      // (D-1) mainPage display:none — 완전 시각 제거
      // detailPage/archivePage는 형제 div라 영향 없음
      mainPage.style.display = 'none';
      if (window.__rnMonitor) window.__rnMonitor('mainPage display:none 완료');

      // (D-2) 카메라 하드웨어 해제
      if (typeof pauseCamera === 'function') pauseCamera();

      // (D-3) mainPage 내 버튼 이벤트 전부 해제 (cloneNode — 리스너 스트립)
      ['shootBtn','micBtn','uploadBtn','archiveBtn','upload-input'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn && btn.parentNode) btn.replaceWith(btn.cloneNode(true));
      });

      // (D-4) showMainPage 오버라이드 → RN 메인으로 전환
      // IIFE 스코프의 showMainPage()가 호출되어도 mainPage가 display:none이라 안 보임 (이중 방어)
      window.showMainPage = function() {
        if (window.__rnMonitor) window.__rnMonitor('TX: showNativeMain (showMainPage 오버라이드)');
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'showNativeMain' }));
      };

      // (D-5) RN 메인 활성화 요청
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'showNativeMain' }));
        if (window.__rnMonitor) window.__rnMonitor('TX: showNativeMain (초기)');
      }
    }
  }, 100);

  // ─── (E) MutationObserver — 자동 pageReady ───
  // detailPage/archivePage/settingsPage가 .visible 클래스를 받으면 자동으로 pageReady 전송
  // 기존 index.js의 수동 pageReady(async 무시 버그)를 대체
  var _observerAttempts = 0;
  var _waitForPages = setInterval(function() {
    if (++_observerAttempts > 50) { clearInterval(_waitForPages); return; }
    var dp = document.getElementById('detailPage');
    var ap = document.getElementById('archivePage');
    if (dp && ap) {
      clearInterval(_waitForPages);
      var _pageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.attributeName === 'class') {
            var el = m.target;
            if (el.id !== 'mainPage' && el.classList.contains('visible')) {
              if (window.ReactNativeWebView) {
                var msg = JSON.stringify({ type: 'pageReady', page: el.id });
                window.ReactNativeWebView.postMessage(msg);
                if (window.__rnMonitor) window.__rnMonitor('TX: pageReady (' + el.id + ')');
              }
            }
          }
        });
      });
      ['detailPage','archivePage','settingsPage','adminSettingsPage'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) _pageObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
      });
      if (window.__rnMonitor) window.__rnMonitor('MutationObserver 등록 완료');
    }
  }, 100);
})();
true;
`;

async function requestAndroidPermissions() {
  if (Platform.OS !== 'android') return;
  try {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  } catch (err) {
    console.warn('Permission request error:', err);
  }
}

// ⚠️ 수정금지(승인필요): 2026-04-06 오버레이 방식 — WebView 항상 마운트 + RN 카메라 위에 덮음
export default function App() {
  const webViewRef = useRef(null);
  // ⚠️ 수정금지(승인필요): 2026-04-05 네이티브 Google OAuth 상태
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);
  const [appLanguage, setAppLanguage] = useState('ko');
  // ⚠️ 수정금지(승인필요): 2026-04-07 RN 메인 독립 실행 토글
  // true → RN 메인 화면 표시 + WebView 숨김 (opacity:0)
  // false → WebView 표시 (상세/보관함/설정 등) + RN 숨김
  const [showNativeMain, setShowNativeMain] = useState(false);
  // ⚠️ 수정금지(승인필요): 2026-04-07 STT 이중 핸들러 방지용 ref
  // useSpeechRecognitionEvent 콜백은 클로저라서 state 직접 참조 시 stale 값 사용
  // ref로 최신 값 동기화하여 RN 메인 활성 시 App.js STT 핸들러 비활성화
  const showNativeMainRef = useRef(false);

  // ⚠️ 수정금지(승인필요): 2026-04-07 ref 동기화 — state 변경 시 ref도 업데이트
  useEffect(() => { showNativeMainRef.current = showNativeMain; }, [showNativeMain]);

  useEffect(() => {
    requestAndroidPermissions();

    // ⚠️ 수정금지(승인필요): 2026-03-22 OTT 딥링크 수신 — 토큰으로 WebView 세션 교환
    // 외부 브라우저에서 sonanie-guide://auth-callback?token=xxx 수신
    // → WebView를 /api/auth/exchange?token=xxx 로 이동 → 서버가 세션 생성 + 쿠키 설정
    const handleDeepLink = (event) => {
      const { url } = event;
      if (url && url.includes('auth-callback')) {
        WebBrowser.dismissBrowser().catch(() => {});
        // URL에서 토큰 추출
        const tokenMatch = url.match(/[?&]token=([^&]+)/);
        if (tokenMatch && tokenMatch[1] && webViewRef.current) {
          // ⚠️ 수정금지(승인필요): OTT 토큰 → WebView에서 서버로 직접 교환 (쿠키 정상 설정됨)
          // encodeURIComponent로 토큰 이스케이프 — 인젝션 방지
          const safeToken = encodeURIComponent(tokenMatch[1]);
          const exchangeUrl = WEB_APP_URL + '/api/auth/exchange?token=' + safeToken;
          webViewRef.current.injectJavaScript(
            'window.location.replace("' + exchangeUrl.replace(/"/g, '\\"') + '"); true;'
          );
        } else if (webViewRef.current) {
          // 토큰 없는 이전 방식 fallback
          webViewRef.current.injectJavaScript(`
            localStorage.setItem('auth_success', 'true');
            localStorage.setItem('landingVisited', 'true');
            window.location.replace('/');
            true;
          `);
        }
      }
    };
    const linkingSub = Linking.addEventListener('url', handleDeepLink);

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // ⚠️ 수정금지(승인필요): RN 카메라 모드에서 뒤로가기 → WebView로 복귀
        if (showNativeMain) {
          setShowNativeMain(false);
          return true;
        }
        if (webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => {
        backHandler.remove();
        linkingSub.remove();
      };
    }
    return () => linkingSub.remove();
  }, []);

  // ⚠️ 수정금지(승인필요): 2026-04-07 네이티브 → 웹 응답 전송 함수 + 모니터링 로깅
  const sendToWeb = useCallback((type, payload) => {
    const ts = new Date().toISOString().substr(11, 12);
    if (webViewRef.current) {
      const data = JSON.stringify({ type, ...payload });
      console.log(`[RN→WV][${ts}] ${type}`, JSON.stringify(payload || {}).substring(0, 150));
      webViewRef.current.injectJavaScript(`
        (function() {
          window.dispatchEvent(new CustomEvent('nativeResponse', { detail: ${data} }));
          if (window.__rnMonitor) window.__rnMonitor('RX(WV): ${type}');
        })();
        true;
      `);
    } else {
      console.warn(`[RN→WV][${ts}] FAIL (webViewRef null): ${type}`);
    }
  }, []);

  // ⚠️ 수정금지(승인필요): 2026-04-07 네이티브 음성인식 결과/에러 → 웹에 전달
  // showNativeMainRef 가드: RN 메인 활성 시 MainCameraScreen의 핸들러가 처리하므로 여기선 스킵
  // 이중 핸들러 방지 — MainCameraScreen.useSpeechRecognitionEvent + 여기 양쪽 등록 → speechResult 2번 전송 버그
  useSpeechRecognitionEvent('result', (event) => {
    if (showNativeMainRef.current) return; // RN 메인 활성 → MainCameraScreen이 처리
    const text = event.results?.[0]?.transcript || '';
    if (text) sendToWeb('speechResult', { text });
  });
  useSpeechRecognitionEvent('error', (event) => {
    if (showNativeMainRef.current) return; // RN 메인 활성 → MainCameraScreen이 처리
    sendToWeb('speechResult', { error: event.error || 'unknown' });
  });

  // ⚠️ 수정금지(승인필요): 2026-04-07 웹 → 네이티브 메시지 처리 (onMessage 핸들러) + 모니터링 로깅
  const handleMessage = useCallback(async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      const { type, payload } = message;
      // 모니터링: WebView → RN 수신 로그
      console.log(`[WV→RN] ${type}`, JSON.stringify(payload || {}).substring(0, 150));

      switch (type) {
        // ⚠️ 수정금지(승인필요): WebView → RN 메인 카메라로 전환 (오버레이)
        case 'showMainPage':
        case 'showNativeMain': {
          setShowNativeMain(true);
          break;
        }
        // ⚠️ 수정금지(승인필요): WebView 페이지 전환 완료 → RN 메인 숨김
        case 'pageReady': {
          setShowNativeMain(false);
          break;
        }
        // ⚠️ 수정금지(승인필요): WebView에서 언어 변경 알림 → RN i18n 동기화
        case 'languageChanged': {
          if (payload?.language) setAppLanguage(payload.language);
          break;
        }
        // --- TTS (텍스트 음성 변환) ---
        case 'speak': {
          // ⚠️ 수정금지(승인필요): 2026-03-12 네이티브 TTS + 언어별 최적 음성 하드코딩 강제
          const { text, language = 'en-US', rate = 1.0, pitch = 1.0 } = payload;
          const speakOpts = { language, rate, pitch };
          if (Platform.OS === 'ios' && IOS_VOICE_MAP[language]) {
            speakOpts.voice = IOS_VOICE_MAP[language];
          }
          speakOpts.onDone = () => sendToWeb('speakDone', { success: true });
          speakOpts.onError = (err) => sendToWeb('speakDone', { error: err?.message || 'unknown' });
          Speech.speak(text, speakOpts);
          break;
        }
        case 'stopSpeech': {
          Speech.stop();
          break;
        }
        case 'isSpeaking': {
          const speaking = await Speech.isSpeakingAsync();
          sendToWeb('isSpeaking', { speaking });
          break;
        }
        case 'getVoices': {
          const voices = await Speech.getAvailableVoicesAsync();
          sendToWeb('voices', { voices });
          break;
        }

        // --- 햅틱 (진동 피드백) ---
        case 'haptic': {
          // ⚠️ 수정금지(승인필요): expo-haptics 네이티브 햅틱
          const style = payload?.style || 'light';
          const styles = {
            light: Haptics.ImpactFeedbackStyle.Light,
            medium: Haptics.ImpactFeedbackStyle.Medium,
            heavy: Haptics.ImpactFeedbackStyle.Heavy,
          };
          await Haptics.impactAsync(styles[style] || styles.light);
          break;
        }
        case 'hapticNotification': {
          const notifType = payload?.notifType || 'success';
          const types = {
            success: Haptics.NotificationFeedbackType.Success,
            warning: Haptics.NotificationFeedbackType.Warning,
            error: Haptics.NotificationFeedbackType.Error,
          };
          await Haptics.notificationAsync(types[notifType] || types.success);
          break;
        }

        // --- 공유 ---
        case 'share': {
          // ⚠️ 수정금지(승인필요): expo-sharing 네이티브 공유 시트
          const { url, title } = payload;
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(url, { dialogTitle: title });
          }
          break;
        }

        // --- 클립보드 ---
        case 'clipboard': {
          // ⚠️ 수정금지(승인필요): expo-clipboard 네이티브 클립보드
          const { action, text: clipText } = payload;
          if (action === 'copy') {
            await Clipboard.setStringAsync(clipText);
            sendToWeb('clipboardResult', { success: true });
          } else if (action === 'paste') {
            const content = await Clipboard.getStringAsync();
            sendToWeb('clipboardResult', { content });
          }
          break;
        }

        // --- 위치 ---
        case 'getLocation': {
          // ⚠️ 수정금지(승인필요): expo-location 네이티브 위치
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            sendToWeb('location', {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
            });
          } else {
            sendToWeb('location', { error: 'permission_denied' });
          }
          break;
        }

        // --- 이미지 피커 (카메라/갤러리) ---
        case 'pickImage': {
          // ⚠️ 수정금지(승인필요): expo-image-picker 네이티브 이미지 선택
          const { source = 'gallery' } = payload;
          let result;
          if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              sendToWeb('imageResult', { error: 'permission_denied' });
              break;
            }
            result = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              quality: 0.8,
              base64: true,
            });
          } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              sendToWeb('imageResult', { error: 'permission_denied' });
              break;
            }
            result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              quality: 0.8,
              base64: true,
            });
          }
          if (!result.canceled && result.assets?.[0]) {
            sendToWeb('imageResult', {
              uri: result.assets[0].uri,
              base64: result.assets[0].base64,
              width: result.assets[0].width,
              height: result.assets[0].height,
            });
          } else {
            sendToWeb('imageResult', { canceled: true });
          }
          break;
        }

        // --- 인증 캐시 (SecureStore) ---
        case 'secureStore': {
          // ⚠️ 수정금지(승인필요): expo-secure-store 네이티브 암호화 저장소 (인증 캐시 영구 보관)
          const { action: storeAction, key, value } = payload;
          if (storeAction === 'set') {
            await SecureStore.setItemAsync(key, value);
            sendToWeb('secureStoreResult', { success: true, key });
          } else if (storeAction === 'get') {
            const storedValue = await SecureStore.getItemAsync(key);
            sendToWeb('secureStoreResult', { key, value: storedValue });
          } else if (storeAction === 'delete') {
            await SecureStore.deleteItemAsync(key);
            sendToWeb('secureStoreResult', { success: true, key });
          }
          break;
        }

        // --- 언어/로케일 ---
        case 'getLocale': {
          // ⚠️ 수정금지(승인필요): expo-localization 디바이스 언어 정보
          const locales = Localization.getLocales();
          sendToWeb('locale', {
            languageCode: locales[0]?.languageCode,
            languageTag: locales[0]?.languageTag,
            regionCode: locales[0]?.regionCode,
          });
          break;
        }

        // --- 네이티브 음성인식 (마이크 입력) ---
        case 'startSpeechRecognition': {
          // ⚠️ 수정금지(승인필요): 2026-03-20 네이티브 음성인식 시작 — expo-speech-recognition 활성화
          const lang = payload?.language || 'ko-KR';
          try {
            const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!granted) {
              sendToWeb('speechResult', { error: '마이크 권한이 필요합니다' });
              break;
            }
            // ⚠️ 수정금지(승인필요): 2026-04-05 iOS 음성인식 옵션 확장 — iOS 18+ 세션 조기 종료 방지 + WebView 오디오 세션 충돌 방지
            // 근거: jamsch/expo-speech-recognition #77 (iOS 18 3초 종료), README iosCategory 필수
            ExpoSpeechRecognitionModule.start({
              lang,
              interimResults: true,
              continuous: false,
              requiresOnDeviceRecognition: false,
              iosCategory: {
                category: 'PlayAndRecord',
                categoryOptions: ['DefaultToSpeaker', 'AllowBluetooth'],
                mode: 'Measurement',
              },
            });
          } catch (e) {
            sendToWeb('speechResult', { error: e.message });
          }
          break;
        }
        case 'stopSpeechRecognition': {
          // ⚠️ 수정금지(승인필요): 2026-03-20 네이티브 음성인식 중지
          ExpoSpeechRecognitionModule.stop();
          break;
        }

        // ⚠️ 수정금지(승인필요): 2026-04-05 네이티브 Google OAuth 트리거
        case 'openGoogleAuth': {
          setShowGoogleAuth(true);
          break;
        }

        // --- 오버레이 닫기 (추천갤러리 리턴 문제 해결) ---
        case 'closeWindow': {
          // ⚠️ 수정금지(승인필요): window.close() 대신 네이티브에서 뒤로가기 처리
          if (webViewRef.current) {
            webViewRef.current.goBack();
          }
          break;
        }

        // ⚠️ 수정금지(승인필요): 2026-03-14 미연결 모듈 풀연결 — 네이티브 핸들러

        // --- 화면 꺼짐 방지 (TTS 재생 중) ---
        case 'keepAwake': {
          KeepAwake.activateKeepAwakeAsync().catch(() => {});
          break;
        }
        case 'allowSleep': {
          KeepAwake.deactivateKeepAwake();
          break;
        }

        // --- 네트워크 상태 ---
        case 'getNetworkState': {
          const netState = await Network.getNetworkStateAsync();
          sendToWeb('networkState', {
            isConnected: netState.isConnected,
            isInternetReachable: netState.isInternetReachable,
            type: netState.type,
          });
          break;
        }

        // --- 디바이스 정보 ---
        case 'getDeviceInfo': {
          sendToWeb('deviceInfo', {
            brand: Device.brand,
            modelName: Device.modelName,
            osName: Device.osName,
            osVersion: Device.osVersion,
            deviceType: Device.deviceType,
          });
          break;
        }

        // --- 파일 다운로드 ---
        case 'downloadFile': {
          const { url: fileUrl, filename } = payload;
          const downloadPath = FileSystem.documentDirectory + (filename || 'download');
          try {
            const downloadResult = await FileSystem.downloadAsync(fileUrl, downloadPath);
            sendToWeb('downloadResult', { uri: downloadResult.uri, status: downloadResult.status });
          } catch (dlErr) {
            sendToWeb('downloadResult', { error: dlErr.message });
          }
          break;
        }

        // --- 파일 읽기 ---
        case 'readFile': {
          const { uri: readUri, encoding = 'utf8' } = payload;
          try {
            const fileContent = await FileSystem.readAsStringAsync(readUri, { encoding });
            sendToWeb('fileContent', { content: fileContent });
          } catch (readErr) {
            sendToWeb('fileContent', { error: readErr.message });
          }
          break;
        }

        // --- 문서 선택 ---
        case 'pickDocument': {
          try {
            const docResult = await DocumentPicker.getDocumentAsync({ type: '*/*' });
            if (!docResult.canceled && docResult.assets?.[0]) {
              sendToWeb('documentResult', {
                uri: docResult.assets[0].uri,
                name: docResult.assets[0].name,
                size: docResult.assets[0].size,
                mimeType: docResult.assets[0].mimeType,
              });
            } else {
              sendToWeb('documentResult', { canceled: true });
            }
          } catch (docErr) {
            sendToWeb('documentResult', { error: docErr.message });
          }
          break;
        }

        // --- 화면 밝기 ---
        case 'getBrightness': {
          try {
            const brightness = await Brightness.getBrightnessAsync();
            sendToWeb('brightnessResult', { brightness });
          } catch (brightErr) {
            sendToWeb('brightnessResult', { error: brightErr.message });
          }
          break;
        }
        case 'setBrightness': {
          const { level } = payload;
          try {
            await Brightness.setBrightnessAsync(level);
            sendToWeb('brightnessResult', { success: true });
          } catch (brightSetErr) {
            sendToWeb('brightnessResult', { error: brightSetErr.message });
          }
          break;
        }

        // --- 배터리 ---
        case 'getBatteryLevel': {
          try {
            const batteryLevel = await Battery.getBatteryLevelAsync();
            const batteryState = await Battery.getBatteryStateAsync();
            sendToWeb('batteryResult', { level: batteryLevel, state: batteryState });
          } catch (batErr) {
            sendToWeb('batteryResult', { error: batErr.message });
          }
          break;
        }

        // --- 암호화 해시 ---
        case 'generateHash': {
          const { data: hashData, algorithm = 'SHA-256' } = payload;
          try {
            const algMap = { 'SHA-256': Crypto.CryptoDigestAlgorithm.SHA256, 'SHA-512': Crypto.CryptoDigestAlgorithm.SHA512, 'MD5': Crypto.CryptoDigestAlgorithm.MD5 };
            const digest = await Crypto.digestStringAsync(algMap[algorithm] || algMap['SHA-256'], hashData);
            sendToWeb('hashResult', { hash: digest, algorithm });
          } catch (hashErr) {
            sendToWeb('hashResult', { error: hashErr.message });
          }
          break;
        }

        // --- 메일 작성 ---
        case 'composeMail': {
          const { recipients, subject, body: mailBody } = payload;
          try {
            const isAvail = await MailComposer.isAvailableAsync();
            if (isAvail) {
              await MailComposer.composeAsync({ recipients, subject, body: mailBody });
              sendToWeb('mailResult', { success: true });
            } else {
              sendToWeb('mailResult', { error: 'mail_not_available' });
            }
          } catch (mailErr) {
            sendToWeb('mailResult', { error: mailErr.message });
          }
          break;
        }

        // --- 인쇄 ---
        case 'printContent': {
          const { html: printHtml } = payload;
          try {
            await Print.printAsync({ html: printHtml });
            sendToWeb('printResult', { success: true });
          } catch (printErr) {
            sendToWeb('printResult', { error: printErr.message });
          }
          break;
        }

        // --- 화면 방향 ---
        case 'lockOrientation': {
          const { orientation: orient = 'DEFAULT' } = payload;
          try {
            const orientMap = { 'PORTRAIT': ScreenOrientation.OrientationLock.PORTRAIT, 'LANDSCAPE': ScreenOrientation.OrientationLock.LANDSCAPE, 'DEFAULT': ScreenOrientation.OrientationLock.DEFAULT };
            await ScreenOrientation.lockAsync(orientMap[orient] || orientMap['DEFAULT']);
            sendToWeb('orientationResult', { success: true });
          } catch (orientErr) {
            sendToWeb('orientationResult', { error: orientErr.message });
          }
          break;
        }

        // --- SMS ---
        case 'sendSMS': {
          const { addresses, message: smsMsg } = payload;
          try {
            const isAvail = await SMS.isAvailableAsync();
            if (isAvail) {
              await SMS.sendSMSAsync(addresses, smsMsg);
              sendToWeb('smsResult', { success: true });
            } else {
              sendToWeb('smsResult', { error: 'sms_not_available' });
            }
          } catch (smsErr) {
            sendToWeb('smsResult', { error: smsErr.message });
          }
          break;
        }

        // --- 푸시 알림 ---
        case 'scheduleNotification': {
          const { title: notifTitle, body: notifBody, seconds = 1 } = payload;
          try {
            await Notifications.scheduleNotificationAsync({
              content: { title: notifTitle, body: notifBody },
              trigger: { type: 'timeInterval', seconds, repeats: false },
            });
            sendToWeb('notificationResult', { success: true });
          } catch (notifErr) {
            sendToWeb('notificationResult', { error: notifErr.message });
          }
          break;
        }

        // --- OTA 업데이트 확인 ---
        case 'checkForUpdates': {
          try {
            const update = await Updates.checkForUpdateAsync();
            sendToWeb('updateResult', { isAvailable: update.isAvailable });
          } catch (updateErr) {
            sendToWeb('updateResult', { error: updateErr.message });
          }
          break;
        }

        default:
          console.log('[Bridge] 알 수 없는 메시지 타입:', type);
      }
    } catch (error) {
      console.error('[Bridge] 메시지 처리 오류:', error);
    }
  }, [sendToWeb]);

  // ⚠️ 수정금지(승인필요): 2026-03-11 Android WebView 권한 요청 자동 허용 (카메라/마이크)
  const handlePermissionRequest = useCallback((request) => {
    request.grant(request.resources);
  }, []);

  // ⚠️ 수정금지(승인필요): 2026-03-12 Google OAuth + Stripe → 시스템 브라우저로 열기
  // Google: WebView 내 OAuth 차단 (403 disallowed_useragent) → 외부 브라우저 필수 (RFC 8252)
  // Stripe: WebView 결제 비권장 → 시스템 브라우저로 전환
  const openExternal = useCallback((url) => {
    WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url));
  }, []);

  const handleNavigationRequest = useCallback((request) => {
    const { url } = request;

    // ⚠️ 수정금지(승인필요): 2026-03-24 Google/Apple OAuth → WebView 내부 처리 (카카오와 동일 패턴)
    // 이전: 외부 브라우저 → 쿠키 미공유 → 앱 복귀 불가. UserAgent Chrome/120으로 disallowed_useragent 우회
    // Stripe만 외부 브라우저 유지 (결제 보안)
    if (url.includes('checkout.stripe.com')) {
      openExternal(url);
      return false; // WebView 내 이동 차단
    }

    return true; // 나머지 URL은 WebView 내에서 정상 이동
  }, [openExternal]);

  // ⚠️ 수정금지(승인필요): 2026-04-07 RN 메인 → WebView 전환 콜백
  // sendToWeb(CustomEvent 'nativeResponse') 방식 — IIFE 로컬 스코프 함수에 접근 가능
  // 기존 speechResult/location/imageResult 등과 동일한 검증된 패턴
  // ⚠️ 수정금지(승인필요): RN → WebView 전환 — sendToWeb 먼저, WebView 'pageReady' 수신 후 RN 숨김
  const handleNavigateToWebView = useCallback((page, data) => {
    if (page === 'detail' && data?.imageBase64) {
      sendToWeb('nativeImage', { base64: data.imageBase64 });
    } else if (page === 'voice' && data?.text) {
      sendToWeb('speechResult', { text: data.text });
    } else if (page === 'archive') {
      sendToWeb('nativeArchive', {});
    }
  }, [sendToWeb]);

  // ⚠️ 수정금지(승인필요): WebView에 JS 주입 (MainCameraScreen에서 GPS 전달용)
  const injectJSToWebView = useCallback((js) => {
    webViewRef.current?.injectJavaScript(js);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#4285F4" />

      {/* ⚠️ 수정금지(승인필요): 2026-04-07 RN 메인 — 기본 화면 (오버레이 아님) */}
      {/* 삼성 Exynos WebView 렌더링 버그 우회: 메인 입력 화면을 RN 네이티브로 실행 */}
      {showNativeMain && (
        <MainCameraScreen
          onNavigateToWebView={handleNavigateToWebView}
          onInjectJS={injectJSToWebView}
          lang={appLanguage}
        />
      )}

      {/* ⚠️ 수정금지(승인필요): 2026-04-07 WebView — 항상 마운트 유지 (삼성 재로딩 방지) */}
      {/* showNativeMain=true → opacity:0 + pointerEvents:none (시각·터치 완전 숨김) */}
      {/* showNativeMain=false → 상세/보관함/설정 등 WebView 페이지 표시 */}
      <View style={[
        StyleSheet.absoluteFill,
        showNativeMain && styles.webviewHidden
      ]}>
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
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          mediaCapturePermissionGrantType="grant"  // ⚠️ 수정금지(승인필요): 2026-03-24 카메라/마이크 무조건 허용 (grantIfSameHostElsePrompt → grant)
          injectedJavaScript={INJECTED_JS}
          onShouldStartLoadWithRequest={handleNavigationRequest}
          onMessage={handleMessage}
          androidLayerType="hardware"  // ⚠️ 수정금지(승인필요): 2026-04-05 hardware 시도 — PR #854 근거, 삼성 Exynos GPU 컴포지팅 호환 테스트
          nestedScrollEnabled={true}  // ⚠️ 수정금지(승인필요): 2026-03-24 Android onClick 미발동 워크어라운드 (Issue #2478)
          onAndroidPermissionRequest={handlePermissionRequest}
          // ⚠️ 수정금지(승인필요): 2026-03-17 플랫폼별 UA 적용 (Google OAuth 403 방지)
          userAgent={Platform.OS === 'android' ? ANDROID_USER_AGENT : IOS_USER_AGENT}
        />
      </View>

      {/* ⚠️ 수정금지(승인필요): 2026-04-05 네이티브 Google OAuth — 외부 브라우저 안 열림 */}
      {showGoogleAuth && (
        <GoogleAuthHandler
          onSuccess={(token) => {
            setShowGoogleAuth(false);
            if (token) {
              const safeToken = encodeURIComponent(token);
              webViewRef.current?.injectJavaScript(
                `window.location.replace("${WEB_APP_URL}/api/auth/exchange?token=${safeToken}"); true;`
              );
            }
          }}
          onCancel={() => setShowGoogleAuth(false)}
          onError={(err) => {
            console.error('[GoogleAuth] failed:', err);
            setShowGoogleAuth(false);
          }}
        />
      )}

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
  // ⚠️ 수정금지(승인필요): 2026-04-07 WebView 숨김 — RN 메인 활성 시 시각·터치 완전 차단
  // opacity:0 + pointerEvents:none = WebView 마운트 유지하면서 안 보이고 터치 안 됨
  webviewHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
});
