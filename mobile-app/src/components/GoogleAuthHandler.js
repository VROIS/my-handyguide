// ⚠️ 수정금지(승인필요): 2026-04-03 구글 OAuth 네이티브 핸들러 — 이중 레이어 해결
// iOS: ASWebAuthenticationSession (시스템 인증 시트, 자동 닫힘)
// Android: Custom Tabs (자동 종료)
// 카카오/애플은 기존 WebView 처리 유지 (정상 작동)
import { useEffect, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// ⚠️ 수정금지(승인필요): App.js의 WEB_APP_URL과 동일한 소스 사용 (대소문자 주의)
const WEB_APP_URL = Constants.expoConfig?.extra?.webAppUrl || 'https://my-handyguide1.replit.app';

export default function GoogleAuthHandler({ onSuccess, onCancel, onError }) {
  // useRef로 최신 콜백 참조 유지 (stale closure 방지)
  const callbacksRef = useRef({ onSuccess, onCancel, onError });
  callbacksRef.current = { onSuccess, onCancel, onError };

  useEffect(() => {
    const doAuth = async () => {
      try {
        const result = await WebBrowser.openAuthSessionAsync(
          `${WEB_APP_URL}/api/auth/google?redirect=app`,
          'sonanie-guide://auth-callback',
        );

        if (result.type === 'success' && result.url) {
          const tokenMatch = result.url.match(/[?&]token=([^&]+)/);
          callbacksRef.current.onSuccess(tokenMatch?.[1] || null);
        } else if (result.type === 'cancel' || result.type === 'dismiss') {
          callbacksRef.current.onCancel();
        } else {
          callbacksRef.current.onError?.('unexpected: ' + result.type);
        }
      } catch (err) {
        console.error('[GoogleAuth] error:', err);
        callbacksRef.current.onError?.(err.message || 'unknown');
      }
    };
    doAuth();
  }, []);

  return null;
}
