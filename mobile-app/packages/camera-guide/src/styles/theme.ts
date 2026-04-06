// ⚠️ 수정금지(승인필요): 2026-04-05 테마 스타일 (기존 앱과 동일)
import { StyleSheet } from 'react-native';
import { CONFIG } from '../config/constants';

export const theme = StyleSheet.create({
  // 전체 화면 카메라 배경
  cameraFull: {
    flex: 1,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Footer 영역 (5개 버튼)
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: CONFIG.FOOTER_HEIGHT,
    flexDirection: 'row' as const,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // 원형 버튼 (56px)
  button: {
    width: CONFIG.BUTTON_SIZE,
    height: CONFIG.BUTTON_SIZE,
    borderRadius: CONFIG.BUTTON_SIZE / 2,
    backgroundColor: CONFIG.BUTTON_BG,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
  },

  // 버튼 아이콘 색상
  buttonIcon: {
    color: CONFIG.GEMINI_BLUE,
  },

  // 버튼 라벨
  buttonLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500' as const,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // 버튼 컨테이너 (아이콘 + 라벨)
  buttonContainer: {
    alignItems: 'center' as const,
    gap: 4,
  },

  // 라이브 대화 오버레이
  chatOverlay: {
    position: 'absolute' as const,
    top: 80,
    left: 16,
    right: 16,
    maxHeight: '40%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 12,
  },

  // AI 응답 텍스트
  aiText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
});
