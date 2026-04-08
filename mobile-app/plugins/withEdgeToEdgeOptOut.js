// ⚠️ 수정금지(승인필요): 2026-04-08 Android 15 edge-to-edge 강제 비활성화
// 이유: edge-to-edge가 시스템 네비바를 WebView 위에 겹치게 함 → 하단 버튼 터치 차단
// Android 공식 문서: windowOptOutEdgeToEdgeEnforcement=true로 opt-out 가능
// 참고: https://developer.android.com/about/versions/15/behavior-changes-15?hl=ko
const { withAndroidStyles } = require('@expo/config-plugins');

module.exports = function withEdgeToEdgeOptOut(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults;

    // AppTheme 스타일 찾기
    const appTheme = styles.resources.style?.find(
      (s) => s.$.name === 'AppTheme'
    );

    if (appTheme) {
      if (!appTheme.item) appTheme.item = [];

      // 이미 추가되어 있으면 스킵
      const exists = appTheme.item.some(
        (item) => item.$.name === 'android:windowOptOutEdgeToEdgeEnforcement'
      );

      if (!exists) {
        appTheme.item.push({
          $: { name: 'android:windowOptOutEdgeToEdgeEnforcement' },
          _: 'true',
        });
      }
    }

    return config;
  });
};
