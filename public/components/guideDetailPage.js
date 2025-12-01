/**
 * ⚠️ 상세페이지 컴포넌트 (Guide Detail Page Component)
 * 
 * 2025-11-28 확보된 로직 - 절대 수정 금지!
 * 
 * 기능:
 * - 풀스크린 이미지 배경
 * - 흰색 텍스트 (그림자 없음, 투명 오버레이)
 * - 음성 자동재생 (언어별 자동 선택)
 * - 문장별 파란 하이라이트
 * - 자동 스크롤 (현재 문장 따라감)
 * - 위치 정보 표시 (흰색 박스)
 * 
 * 사용법:
 * 1. HTML에 guideDetailPage.getHTML() 삽입
 * 2. <style>에 guideDetailPage.getCSS() 삽입
 * 3. <script>에서 guideDetailPage.init() 호출
 * 4. guideDetailPage.open(guideId) 로 열기
 */

const guideDetailPage = {
    // HTML 템플릿
    getHTML: function() {
        return `
    <!-- 풀 화면 상세보기 (상세페이지 컴포넌트) -->
    <div id="guideDetailPage" class="hidden">
        <img id="guideDetailImage" src="" alt="상세페이지 이미지" class="full-screen-bg">
        <header class="header-safe-area">
            <button id="guideDetailBackBtn" class="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-gemini-blue interactive-btn shadow-2xl absolute top-1/2 left-4 -translate-y-1/2" aria-label="뒤로가기">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </header>
        <div class="content-safe-area">
            <div id="guideDetailTextOverlay" class="text-content">
                <div id="guideDetailLocationInfo" class="hidden mb-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gemini-blue flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                    </svg>
                    <span id="guideDetailLocationName" class="text-base font-semibold text-gray-800"></span>
                </div>
                <p id="guideDetailDescription" class="readable-on-image text-xl leading-relaxed"></p>
            </div>
        </div>
        <footer class="footer-safe-area">
            <button id="guideDetailAudioBtn" aria-label="오디오 재생" class="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-gemini-blue interactive-btn shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.648c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
            </button>
            <button id="guideDetailTextToggleBtn" aria-label="해설 읽기" class="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-gemini-blue interactive-btn shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>
        </footer>
    </div>`;
    },

    // CSS 스타일
    getCSS: function() {
        return `
        /* ⚠️ 상세페이지 컴포넌트 스타일 (2025-11-28 확보) */
        #guideDetailPage {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            display: flex;
            flex-direction: column;
        }
        #guideDetailPage .full-screen-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: 1;
        }
        #guideDetailPage .header-safe-area {
            width: 100%;
            height: 80px;
            flex-shrink: 0;
            z-index: 30;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            position: relative;
        }
        #guideDetailPage .content-safe-area {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: transparent;
            z-index: 20;
        }
        #guideDetailPage .text-content {
            padding: 1.5rem;
            line-height: 1.8;
            word-break: keep-all;
            overflow-wrap: break-word;
        }
        #guideDetailPage .readable-on-image {
            color: white;
        }
        #guideDetailPage .footer-safe-area {
            width: 100%;
            height: 100px;
            flex-shrink: 0;
            z-index: 30;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
            padding: 0 1rem;
            background: transparent;
        }
        #guideDetailPage .interactive-btn {
            transition: transform 0.1s ease, background-color 0.2s ease;
        }
        #guideDetailPage .interactive-btn:active {
            transform: scale(0.95);
        }
        .text-gemini-blue { color: var(--gemini-blue); }`;
    },

    // 내부 상태
    _state: {
        isTextVisible: true,
        synth: null,
        voices: [],
        currentUtterance: null,
        originalText: '',
        onClose: null
    },

    // 초기화
    init: function(options = {}) {
        const self = this;
        this._state.synth = window.speechSynthesis;
        this._state.onClose = options.onClose || null;

        // DOM 요소
        this._els = {
            page: document.getElementById('guideDetailPage'),
            image: document.getElementById('guideDetailImage'),
            description: document.getElementById('guideDetailDescription'),
            locationInfo: document.getElementById('guideDetailLocationInfo'),
            locationName: document.getElementById('guideDetailLocationName'),
            textOverlay: document.getElementById('guideDetailTextOverlay'),
            audioBtn: document.getElementById('guideDetailAudioBtn'),
            textToggleBtn: document.getElementById('guideDetailTextToggleBtn'),
            backBtn: document.getElementById('guideDetailBackBtn')
        };

        // 음성 목록 로드
        this._populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => self._populateVoiceList();
        }

        // 이벤트 리스너
        this._els.backBtn.addEventListener('click', () => self.close());
        this._els.audioBtn.addEventListener('click', () => self._toggleAudio());
        this._els.textToggleBtn.addEventListener('click', () => self._toggleText());

        console.log('[GuideDetailPage] Initialized');
    },

    // 음성 목록 로드 (모든 언어)
    _populateVoiceList: function() {
        this._state.voices = this._state.synth.getVoices();
    },
    
    // 언어별 음성 선택
    _getVoiceForLanguage: function(userLang) {
        // 짧은 형식 (ko, en) → 긴 형식 (ko-KR, en-US) 변환
        const langMap = {
            'ko': 'ko-KR',
            'en': 'en-US',
            'ja': 'ja-JP',
            'zh-CN': 'zh-CN',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'es': 'es-ES'
        };
        
        const fullLang = langMap[userLang] || 'en-US';
        const langCode = fullLang.substring(0, 2);
        
        const voiceMap = {
            'ko-KR': 'Microsoft Heami - Korean (Korea)',
            'en-US': 'Microsoft Zira - English (United States)',
            'ja-JP': 'Microsoft Haruka - Japanese (Japan)',
            'zh-CN': 'Microsoft Huihui - Chinese (Simplified, PRC)',
            'fr-FR': 'Microsoft Hortense - French (France)',
            'de-DE': 'Microsoft Hedda - German (Germany)',
            'es-ES': 'Microsoft Helena - Spanish (Spain)'
        };
        
        const targetVoiceName = voiceMap[fullLang];
        const targetVoice = targetVoiceName ? this._state.voices.find(v => v.name === targetVoiceName) : null;
        
        return targetVoice || this._state.voices.find(v => v.lang.startsWith(langCode)) || this._state.voices[0];
    },

    // 페이지 열기 (guideId로 API 호출)
    open: async function(guideId) {
        try {
            this._show();
            this._els.description.textContent = '불러오는 중...';
            this._els.image.src = '';
            this._els.locationInfo.classList.add('hidden');

            const response = await fetch(`/api/guides/${guideId}`, { credentials: 'include' });
            if (!response.ok) throw new Error('가이드를 불러올 수 없습니다.');
            
            const guide = await response.json();
            this._render(guide);
        } catch (error) {
            console.error('[GuideDetailPage] Error:', error);
            this._els.description.textContent = '불러오기 실패';
        }
    },

    // 데이터로 직접 열기 (API 호출 없이)
    openWithData: function(data) {
        this._show();
        this._render(data);
    },

    // 렌더링
    _render: function(guide) {
        this._els.image.src = guide.imageUrl || guide.imageDataUrl || '';
        this._els.description.textContent = guide.description || '내용 없음';
        
        if (guide.locationName) {
            this._els.locationName.textContent = guide.locationName;
            this._els.locationInfo.classList.remove('hidden');
        }

        // 음성 자동 재생
        if (guide.description) {
            this._playAudio(guide.description);
        }
    },

    // 페이지 표시
    _show: function() {
        this._els.page.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    // 페이지 닫기
    close: function() {
        this._stopAudio();
        this._els.page.classList.add('hidden');
        document.body.style.overflow = '';
        
        if (this._state.onClose) {
            this._state.onClose();
        }
    },

    // 음성 재생 (문장별 하이라이트 + 자동 스크롤)
    _playAudio: function(text) {
        const self = this;
        this._stopAudio();
        
        // <br> 태그 제거
        const cleanText = text.replace(new RegExp('<br\\s*/?>', 'gi'), ' ');
        
        // 문장 분리
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        
        // 원본 저장
        this._state.originalText = cleanText;
        
        this._state.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // 현재 선택된 언어 가져오기 (appLanguage: ko, en, ja 등 짧은 형식)
        const userLang = localStorage.getItem('appLanguage') || 'ko';
        
        // 🔴 매번 음성 다시 로드 (언어 변경 시 음성 적용)
        this._state.voices = this._state.synth.getVoices();
        
        // 언어별 음성 자동 선택
        const targetVoice = this._getVoiceForLanguage(userLang);
        
        // 언어 코드를 긴 형식으로 변환 (ko → ko-KR)
        const langFullMap = { 'ko': 'ko-KR', 'en': 'en-US', 'ja': 'ja-JP', 'zh-CN': 'zh-CN', 'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES' };
        const fullLang = langFullMap[userLang] || 'ko-KR';
        
        this._state.currentUtterance.voice = targetVoice;
        this._state.currentUtterance.lang = fullLang;
        this._state.currentUtterance.rate = 1.0;
        
        let currentSentenceIndex = 0;
        
        this._state.currentUtterance.onstart = () => {
            self._updateAudioButtonIcon(true);
        };
        
        // 문장별 하이라이트 + 자동 스크롤
        this._state.currentUtterance.onboundary = (event) => {
            if (event.name === 'sentence') {
                const highlightedHTML = sentences.map((sentence, idx) => {
                    if (idx === currentSentenceIndex) {
                        return '<span class="current-sentence" style="background-color: rgba(66, 133, 244, 0.3); font-weight: 600;">' + sentence + '</span>';
                    }
                    return sentence;
                }).join('');
                
                self._els.description.innerHTML = highlightedHTML;
                currentSentenceIndex++;
                
                // 자동 스크롤
                const currentSpan = self._els.description.querySelector('.current-sentence');
                if (currentSpan) {
                    currentSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };
        
        this._state.currentUtterance.onend = () => {
            self._updateAudioButtonIcon(false);
            self._els.description.textContent = self._state.originalText;
        };
        
        this._state.synth.speak(this._state.currentUtterance);
    },

    // 음성 정지
    _stopAudio: function() {
        if (this._state.synth.speaking) {
            this._state.synth.pause();
            this._state.synth.cancel();
        }
        this._updateAudioButtonIcon(false);
        if (this._state.originalText) {
            this._els.description.textContent = this._state.originalText;
        }
    },

    // 음성 토글
    _toggleAudio: function() {
        const text = this._els.description.textContent;
        if (!text || text === '불러오는 중...') return;

        if (this._state.synth.speaking) {
            this._stopAudio();
        } else {
            this._playAudio(text);
        }
    },

    // 오디오 버튼 아이콘 업데이트
    _updateAudioButtonIcon: function(isPlaying) {
        this._els.audioBtn.innerHTML = isPlaying ? `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
            </svg>
        ` : `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.648c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
        `;
    },

    // 텍스트 토글
    _toggleText: function() {
        this._state.isTextVisible = !this._state.isTextVisible;
        this._els.textOverlay.style.opacity = this._state.isTextVisible ? '1' : '0';
    }
};

// ES Module export (선택적)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = guideDetailPage;
}
