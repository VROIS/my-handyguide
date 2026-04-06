// ⚠️ 수정금지(승인필요): 하단 5버튼 Footer — 기존 WebView index.html:1009-1043 100% 클론
// 아이콘: Heroicons SVG (기존 앱과 동일), react-native-svg 사용
// 스타일: 기존 .footer-safe-area CSS 완벽 재현
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const GEMINI_BLUE = '#4285F4';

// ⚠️ 수정금지(승인필요): 기존 index.html에서 추출한 Heroicons SVG path — 그대로 복붙
const ICONS: Record<string, { paths: string[]; fill?: string }> = {
  // 촬영 — index.html:1012-1014 카메라 아이콘
  capture: {
    paths: [
      'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z',
      'M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
  // 업로드 — index.html:1029-1030 이미지/갤러리 아이콘
  upload: {
    paths: [
      'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    ],
  },
  // 보관함 — index.html:1037-1038 아카이브 아이콘
  archive: {
    paths: [
      'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
    ],
  },
  // 라이브 ★신규 — Heroicons signal 스타일 (동일 stroke 스타일)
  live: {
    paths: [
      'M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.788m13.788 0c3.808 3.808 3.808 9.98 0 13.788M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    ],
  },
  // 여행비서 ★신규 — Heroicons globe-alt 스타일 (동일 stroke 스타일)
  assistant: {
    paths: [
      'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    ],
  },
};

// ⚠️ 수정금지(승인필요): SVG 아이콘 컴포넌트 — 기존 Heroicons outline 스타일 재현
function HeroIcon({ name, size = 28, color = GEMINI_BLUE }: { name: string; size?: number; color?: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {icon.paths.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

type ButtonConfig = {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
};

type Props = {
  buttons: ButtonConfig[];
};

// ⚠️ 수정금지(승인필요): Footer 컴포넌트 — 기존 .footer-safe-area CSS 100% 클론
export default function FooterButtons({ buttons }: Props) {
  return (
    <View style={styles.footer}>
      {buttons.map(({ id, icon, label, onPress }) => (
        <View key={id} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <HeroIcon name={icon} />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

// ⚠️ 수정금지(승인필요): 기존 CSS 완벽 클론
// .footer-safe-area: height 100px, flex space-around, padding 0 1rem
// 버튼: w-14 h-14 (56px), rounded-full, bg-black/60, backdrop-blur-md
// 라벨: text-xs (12px), text-white, font-medium, drop-shadow-md
const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16, // 1rem
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // safe-area-inset-bottom
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 4, // gap-1
  },
  button: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 28, // rounded-full
    backgroundColor: 'rgba(0,0,0,0.6)', // bg-black/60
    alignItems: 'center',
    justifyContent: 'center',
    // shadow-2xl 근사치
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
  },
  buttonLabel: {
    fontSize: 12, // text-xs
    color: '#fff', // text-white
    fontWeight: '500', // font-medium
    // drop-shadow-md 근사치
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
