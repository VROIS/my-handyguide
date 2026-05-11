// ⚠️ 수정금지(승인필요): 2026-05-11 Tailwind v3 + PostCSS 빌드 통합 (CDN 제거 목적)
// content path: public/ 폴더 안의 모든 html/js에서 사용된 class만 추출 → production CSS 최소화
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
