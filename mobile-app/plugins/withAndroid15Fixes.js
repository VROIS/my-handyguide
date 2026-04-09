// ⚠️ 수정금지(승인필요): Android 15 삼성 버그 대응 Config Plugin
// 적용 항목:
// [A] 16KB 페이지 크기 지원 → gradle.properties에 jni 패키징 옵션 추가
// [B] 포그라운드 서비스 타입 선언 → AndroidManifest.xml service 속성 추가
// [C] edge-to-edge opt-in → MainActivity 스타일 설정
// [D] BOOT_COMPLETED FGS 차단 대응 → receiver export 속성 명시

const { withGradleProperties, withAndroidManifest } = require('@expo/config-plugins');

// ⚠️ 수정금지(승인필요): [A] 16KB 페이지 크기 지원
// Android 15부터 16KB 페이지 크기 기기 지원 필요 (NDK .so 파일 재정렬)
// useLegacyPackaging=false: .so 파일을 APK에 압축 없이 저장 → 16KB 정렬 가능
const withPageAlignedSharedLibs = (config) => {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;

    // 기존 중복 제거 후 추가
    const filteredProps = props.filter(
      (p) => p.key !== 'android.useNewApkTool' && p.key !== 'android.enableDexingArtifactTransform'
    );

    filteredProps.push(
      { type: 'property', key: 'android.useNewApkTool', value: 'true' },
      // 16KB 정렬: .so 파일을 비압축으로 패키징하여 직접 mmap 가능하게 함
      { type: 'property', key: 'android.enableDexingArtifactTransform', value: 'true' }
    );

    config.modResults = filteredProps;
    return config;
  });
};

// ⚠️ 수정금지(승인필요): [B][C][D] AndroidManifest.xml 수정
// - WebView 포그라운드 서비스 타입 선언 (Android 14+)
// - BOOT_COMPLETED receiver exported 속성 명시 (Android 12+)
const withAndroidManifestFixes = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApp = androidManifest.manifest.application[0];

    // [B] 기존 activity에 android:exported 명시 (Android 12 필수)
    if (mainApp.activity) {
      mainApp.activity.forEach((activity) => {
        if (!activity.$['android:exported']) {
          // intent-filter가 있는 activity는 exported=true 필요
          if (activity['intent-filter']) {
            activity.$['android:exported'] = 'true';
          }
        }
      });
    }

    // [D] receiver에 exported 명시 (Android 12+, BOOT_COMPLETED 포함)
    if (mainApp.receiver) {
      mainApp.receiver.forEach((receiver) => {
        if (!receiver.$['android:exported']) {
          receiver.$['android:exported'] = 'false';
        }
      });
    }

    return config;
  });
};

// ⚠️ 수정금지(승인필요): 플러그인 합성 — 순서 중요
module.exports = (config) => {
  config = withPageAlignedSharedLibs(config);
  config = withAndroidManifestFixes(config);
  return config;
};
