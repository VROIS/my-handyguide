/**
 * 📍 중앙화된 언어 설정 헬퍼
 * 모든 페이지에서 공유하는 언어 관리 시스템
 * 
 * 기능:
 * 1. localStorage에 선택한 언어 저장
 * 2. Google Translate 쿠키 설정 (reload 없이!)
 * 3. 페이지 로드 시 저장된 언어 자동 적용
 * 
 * 사용법:
 * - HTML: <script src="language-helper.js"></script>
 * - 언어 선택: LanguageHelper.setLanguage('en')
 * - 현재 언어: LanguageHelper.getCurrentLanguage()
 */

const LanguageHelper = {
  /**
   * 지원하는 언어 목록
   */
  LANGUAGES: {
    ko: '🇰🇷 한국어',
    en: '🇺🇸 English',
    ja: '🇯🇵 日本語',
    'zh-CN': '🇨🇳 中文 (简体)',
    fr: '🇫🇷 Français',
    de: '🇩🇪 Deutsch',
    es: '🇪🇸 Español'
  },

  /**
   * 저장된 언어 반환 (기본값: 'ko')
   */
  getCurrentLanguage: function() {
    return localStorage.getItem('appLanguage') || 'ko';
  },

  /**
   * 언어 설정 저장 + Google Translate 쿠키 설정 + DB 저장
   * @param {string} lang - 언어 코드 (예: 'en', 'fr' 등)
   */
  setLanguage: function(lang) {
    if (!this.LANGUAGES[lang]) {
      console.warn(`❌ 지원하지 않는 언어: ${lang}`);
      return;
    }

    console.log(`🌐 언어 변경: ${lang}`);
    
    // 1. localStorage에 저장
    localStorage.setItem('appLanguage', lang);
    
    // 2. Google Translate 쿠키 설정
    const domain = window.location.hostname;
    document.cookie = `googtrans=/ko/${lang}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/ko/${lang}; path=/`;
    
    // 3. Google Translate 수동 활성화 (즉시 번역!)
    if (window.google && window.google.translate && window.google.translate.TranslateService) {
      console.log('✅ Google Translate 즉시 활성화');
      try {
        window.google.translate.TranslateService.getInstance().translate('ko', lang);
      } catch (e) {
        console.log('⚠️ Google Translate 서비스 미발견 (초기화 필요)');
      }
    }
    
    // 4. 🌐 DB에 저장 (로그인된 사용자만)
    this.saveToDatabase(lang);
    
    // 5. 🎤 음성 인식 언어도 동시 업데이트
    if (window.updateRecognitionLang) {
      window.updateRecognitionLang();
    }
  },
  
  /**
   * DB에 선호 언어 저장 (비동기, 실패해도 무시)
   */
  saveToDatabase: async function(lang) {
    try {
      const response = await fetch('/api/profile/language', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      });
      if (response.ok) {
        console.log('🌐 DB에 선호 언어 저장:', lang);
      }
    } catch (error) {
      // 비로그인 상태면 실패 - 무시
      console.log('🌐 DB 저장 스킵 (비로그인 또는 오류)');
    }
  },

  /**
   * 페이지 로드 시 저장된 언어 초기화
   * - HTML <head>에서 호출
   * - Google Translate 로드 전에 쿠키 설정
   */
  initializeLanguage: function() {
    const savedLang = localStorage.getItem('appLanguage') || 'ko';
    
    if (savedLang !== 'ko') {
      const domain = window.location.hostname;
      document.cookie = `googtrans=/ko/${savedLang}; path=/; domain=${domain}`;
      document.cookie = `googtrans=/ko/${savedLang}; path=/`;
      console.log(`🌐 저장된 언어 적용: ${savedLang}`);
    }
  },

  /**
   * 언어 선택 셀렉트 엘리먼트에 이벤트 리스너 등록
   * @param {string} selectElementId - select 엘리먼트의 ID
   */
  bindLanguageSelect: function(selectElementId = 'languageSelect') {
    const select = document.getElementById(selectElementId);
    if (!select) {
      console.warn(`❌ 셀렉트 엘리먼트를 찾을 수 없음: #${selectElementId}`);
      return;
    }

    // 현재 언어 표시
    select.value = this.getCurrentLanguage();

    // 언어 변경 이벤트
    select.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      this.setLanguage(selectedLang);
      
      // 토스트 메시지 (있으면)
      if (window.showToast) {
        window.showToast(`언어가 ${this.LANGUAGES[selectedLang]}로 변경됩니다...`);
      }
      
      // ⚠️ reload 제거! (Google Translate가 자동으로 번역)
      console.log('✅ 언어 변경 완료 (새로고침 불필요)');
    });
  }
};

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  LanguageHelper.initializeLanguage();
});
