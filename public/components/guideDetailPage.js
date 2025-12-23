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
            <button id="guideDetailBackBtn" class="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-gemini-blue interactive-btn shadow-2xl absolute top-1/2 right-4 -translate-y-1/2" style="z-index: 10001; pointer-events: auto;" aria-label="뒤로가기">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </header>
        <!-- 📍🎤 정보 표시 영역 (고정, 스크롤 안됨) -->
        <div class="info-fixed-area">
            <div id="guideDetailLocationInfo" class="hidden flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gemini-blue flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                <span id="guideDetailLocationName" class="text-base font-semibold text-gray-800"></span>
            </div>
            <div id="guideDetailVoiceQueryInfo" class="hidden flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gemini-blue flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
                <span id="guideDetailVoiceQueryText" class="text-base font-semibold text-gray-800"></span>
            </div>
        </div>
        <div class="content-safe-area">
            <div id="guideDetailTextOverlay" class="text-content">
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
            <button id="guideDetailSaveBtn" aria-label="보관함에 저장" class="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-gemini-blue interactive-btn shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
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
            position: relative;
            width: 100%;
            height: 60px;
            flex-shrink: 0;
            z-index: 30;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
        }
        #guideDetailPage .info-fixed-area {
            position: relative;
            width: 100%;
            flex-shrink: 0;
            z-index: 25;
            padding: 0 1rem 0.5rem 1rem;
        }
        #guideDetailPage .content-safe-area {
            position: relative;
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
            position: relative;
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
        .text-gemini-blue { color: var(--gemini-blue); }
        /* 구글 번역 스피너 완전 숨김 (상세페이지) */
        .goog-te-spinner-pos { display: none !important; }`;
    },

    // 내부 상태
    _state: {
        isTextVisible: true,
        synth: null,
        voices: [],
        currentUtterance: null,
        originalText: '',
        onClose: null,
        // 🌐 2025-12-04: 번역 완료 대기 상태
        translationComplete: true,
        translationObserver: null,
        // 🔊 2025-12-07: DB 기반 음성 설정 캐시
        voiceConfigsCache: null,
        voiceConfigsLoading: false,
        // 💾 2025-12-09: 현재 가이드 데이터 (저장용)
        currentGuideData: null,
        onSave: null,
        // 🔒 2025-12-11: 렌더 ID (경쟁 상태 방지)
        renderId: 0
    },
    
    // 🔊 하드코딩 기본값 (오프라인 fallback)
    _defaultVoicePriorities: {
        'ko-KR': { default: ['Microsoft Heami', 'Yuna'] },
        'en-US': { default: ['Samantha', 'Microsoft Zira', 'Google US English', 'English'] },
        'ja-JP': { default: ['Kyoko', 'Microsoft Haruka', 'Google 日本語', 'Japanese'] },
        'zh-CN': { default: ['Ting-Ting', 'Microsoft Huihui', 'Google 普通话', 'Chinese'] },
        'fr-FR': { default: ['Thomas', 'Microsoft Hortense', 'Google français', 'French'] },
        'de-DE': { default: ['Anna', 'Microsoft Hedda', 'Google Deutsch', 'German'] },
        'es-ES': { default: ['Monica', 'Microsoft Helena', 'Google español', 'Spanish'] }
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
            voiceQueryInfo: document.getElementById('guideDetailVoiceQueryInfo'),
            voiceQueryText: document.getElementById('guideDetailVoiceQueryText'),
            textOverlay: document.getElementById('guideDetailTextOverlay'),
            audioBtn: document.getElementById('guideDetailAudioBtn'),
            textToggleBtn: document.getElementById('guideDetailTextToggleBtn'),
            backBtn: document.getElementById('guideDetailBackBtn'),
            saveBtn: document.getElementById('guideDetailSaveBtn')
        };

        // 💾 2025-12-09: 저장 콜백 설정
        this._state.onSave = options.onSave || null;

        // 음성 목록 로드
        this._populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => self._populateVoiceList();
        }

        // 🔊 2025-12-07: DB에서 음성 설정 로드
        this._loadVoiceConfigsFromDB();

        // 이벤트 리스너 (모든 버튼 클릭 시 음성 멈춤)
        this._els.backBtn.addEventListener('click', () => self.close());
        this._els.audioBtn.addEventListener('click', () => self._toggleAudio());
        this._els.textToggleBtn.addEventListener('click', () => { self._stopAudio(); self._toggleText(); });
        this._els.saveBtn.addEventListener('click', () => { self._stopAudio(); self._saveToLocal(); });

        // 🌐 2025-12-04: 번역 완료 감지 초기화
        this._initTranslationWatcher();

        console.log('[GuideDetailPage] Initialized');
    },
    
    // 🔊 DB에서 음성 설정 로드
    _loadVoiceConfigsFromDB: async function() {
        if (this._state.voiceConfigsCache) return this._state.voiceConfigsCache;
        if (this._state.voiceConfigsLoading) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return this._state.voiceConfigsCache || null;
        }
        
        this._state.voiceConfigsLoading = true;
        try {
            const response = await fetch('/api/voice-configs');
            if (response.ok) {
                const configs = await response.json();
                this._state.voiceConfigsCache = {};
                for (const config of configs) {
                    if (!this._state.voiceConfigsCache[config.langCode]) {
                        this._state.voiceConfigsCache[config.langCode] = {};
                    }
                    this._state.voiceConfigsCache[config.langCode][config.platform] = {
                        priorities: config.voicePriorities,
                        excludeVoices: config.excludeVoices || []
                    };
                }
                console.log('🔊 [GuideDetailPage Voice DB] 설정 로드 완료:', Object.keys(this._state.voiceConfigsCache));
            }
        } catch (error) {
            console.warn('🔊 [GuideDetailPage Voice DB] 로드 실패, 기본값 사용:', error.message);
        }
        this._state.voiceConfigsLoading = false;
        return this._state.voiceConfigsCache;
    },
    
    // 🔊 플랫폼 감지
    _detectPlatform: function() {
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod|Mac/.test(ua)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        if (/Windows/.test(ua)) return 'windows';
        return 'default';
    },
    
    // 🔊 DB 기반 음성 우선순위 가져오기
    _getVoicePriorityFromDB: function(langCode) {
        const platform = this._detectPlatform();
        
        // DB 캐시 확인
        if (this._state.voiceConfigsCache && this._state.voiceConfigsCache[langCode]) {
            const config = this._state.voiceConfigsCache[langCode][platform] || this._state.voiceConfigsCache[langCode]['default'];
            if (config) {
                return { priorities: config.priorities, excludeVoices: config.excludeVoices };
            }
        }
        
        // 기본값 사용 (오프라인/로드 실패)
        const fallback = this._defaultVoicePriorities[langCode];
        if (fallback) {
            const priorities = fallback[platform] || fallback['default'] || fallback[Object.keys(fallback)[0]];
            return { priorities, excludeVoices: [] };
        }
        
        return { priorities: [], excludeVoices: [] };
    },

    // 🌐 번역 완료 감지 (MutationObserver)
    _initTranslationWatcher: function() {
        const self = this;
        const userLang = localStorage.getItem('appLanguage') || 'ko';
        
        // 한국어면 번역 대기 불필요
        if (userLang === 'ko') {
            this._state.translationComplete = true;
            return;
        }
        
        // 이미 번역된 상태인지 확인
        const hasTranslateClass = document.body.classList.contains('translated-ltr') || 
                                  document.body.classList.contains('translated-rtl');
        if (hasTranslateClass) {
            this._state.translationComplete = true;
            console.log('[GuideDetailPage] 이미 번역됨');
            return;
        }
        
        // 번역 대기 모드
        this._state.translationComplete = false;
        console.log('[GuideDetailPage] 번역 대기 모드:', userLang);
        
        // MutationObserver로 번역 완료 감지
        this._state.translationObserver = new MutationObserver(function(mutations) {
            const hasTranslated = document.body.classList.contains('translated-ltr') || 
                                  document.body.classList.contains('translated-rtl');
            if (hasTranslated) {
                console.log('[GuideDetailPage] 🌐 번역 완료 감지!');
                self._state.translationComplete = true;
                self._state.translationObserver.disconnect();
                
                // 번역 완료 이벤트 발생
                window.dispatchEvent(new CustomEvent('guideTranslationComplete'));
            }
        });
        
        this._state.translationObserver.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        // 3초 후 타임아웃 (오프라인 등)
        setTimeout(function() {
            if (!self._state.translationComplete) {
                console.log('[GuideDetailPage] 번역 타임아웃 - 원본 사용');
                self._state.translationComplete = true;
                if (self._state.translationObserver) {
                    self._state.translationObserver.disconnect();
                }
                window.dispatchEvent(new CustomEvent('guideTranslationComplete', { detail: { timeout: true } }));
            }
        }, 3000);
    },

    // 음성 목록 로드 (모든 언어)
    _populateVoiceList: function() {
        this._state.voices = this._state.synth.getVoices();
    },
    
    // 언어별 음성 선택 (플랫폼별 최적 음성 우선순위)
    // ⚠️ 2025-12-07 DB 기반: _getVoicePriorityFromDB() 사용, excludeVoices 필터링
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
        
        const fullLang = langMap[userLang] || 'ko-KR';
        const langCode = fullLang.substring(0, 2);
        
        // 🔊 DB 기반 음성 우선순위 가져오기
        const voiceConfig = this._getVoicePriorityFromDB(fullLang);
        const priorities = voiceConfig.priorities;
        const excludeVoices = voiceConfig.excludeVoices;
        
        const allVoices = this._state.voices;
        let targetVoice = null;
        
        // 우선순위대로 음성 찾기 (제외 목록 적용)
        for (const voiceName of priorities) {
            targetVoice = allVoices.find(v => 
                v.name.includes(voiceName) && !excludeVoices.some(ex => v.name.includes(ex))
            );
            if (targetVoice) break;
        }
        
        // 우선순위에 없으면 언어 코드로 찾기 (제외 목록 적용)
        if (!targetVoice) {
            targetVoice = allVoices.find(v => 
                v.lang.replace('_', '-').startsWith(langCode) && !excludeVoices.some(ex => v.name.includes(ex))
            );
        }
        
        // 디버깅 로그
        console.log('[TTS] userLang:', userLang, 'fullLang:', fullLang, 'langCode:', langCode);
        console.log('[TTS] DB priorities:', priorities, 'excludeVoices:', excludeVoices);
        console.log('[TTS] Selected voice:', targetVoice?.name, targetVoice?.lang);
        
        return targetVoice || allVoices[0];
    },

    // 페이지 열기 (guideId로 API 호출)
    open: async function(guideId) {
        // 🔊 2025-12-11: 표준 초기화 - 이전 음성 즉시 중지 + 데이터 초기화
        this._stopAudio();
        this._state.currentGuideData = null;
        // 🔒 렌더 ID 증가 - 이전 콜백 무효화
        this._state.renderId++;
        const thisRenderId = this._state.renderId;
        
        console.log('[GuideDetailPage] open() guideId:', guideId, 'renderId:', thisRenderId);
        
        try {
            this._show();
            
            if (this._els.description) {
                this._els.description.textContent = '불러오는 중...';
            }
            this._els.image.src = '';
            this._els.locationInfo.classList.add('hidden');
            if (this._els.voiceQueryInfo) this._els.voiceQueryInfo.classList.add('hidden');

            const response = await fetch(`/api/guides/${guideId}`, { credentials: 'include' });
            if (!response.ok) throw new Error('가이드를 불러올 수 없습니다.');
            
            const guide = await response.json();
            
            // 🔒 렌더 ID 체크 - 다른 항목이 열렸으면 무시
            if (thisRenderId !== this._state.renderId) {
                console.log('[GuideDetailPage] 렌더 ID 불일치, 무시:', thisRenderId, '!=', this._state.renderId);
                return;
            }
            
            // 💾 2025-12-11: 저장 버튼용 데이터 보관 (프로필→로컬 복구 기능)
            this._state.currentGuideData = guide;
            this._render(guide, thisRenderId);
        } catch (error) {
            console.error('[GuideDetailPage] Error:', error);
            this._els.description.textContent = '불러오기 실패';
        }
    },

    // 데이터로 직접 열기 (API 호출 없이)
    openWithData: function(data) {
        // 💾 2025-12-09: 저장용 데이터 보관
        this._state.currentGuideData = data;
        this._show();
        this._render(data);
    },

    // 렌더링
    // 🎨 2025-12-11: 이미지 모드 / 음성 모드 분기 처리
    _render: function(guide, renderId) {
        console.log('[GuideDetailPage] _render 호출:', {
            id: guide.id,
            locationName: guide.locationName,
            voiceQuery: guide.voiceQuery,
            imageUrl: guide.imageUrl?.substring(0, 50),
            voiceLang: guide.voiceLang
        });
        console.log('[GuideDetailPage] _els 상태:', {
            locationInfo: !!this._els.locationInfo,
            voiceQueryInfo: !!this._els.voiceQueryInfo
        });
        
        // 🎤 음성 모드 판별: 이미지 없고 voiceQuery 있으면 음성 모드
        const isVoiceGuide = (!guide.imageUrl && !guide.imageDataUrl) && (guide.voiceQuery || guide.title);
        
        // 🎨 배경 이미지 설정
        const imageUrl = guide.imageUrl || guide.imageDataUrl || '/images/landing-logo.jpg';
        this._els.image.src = imageUrl;
        
        // 음성 모드 또는 이미지 없을 때: 흐린 로고 배경
        if (!guide.imageUrl && !guide.imageDataUrl) {
            this._els.image.style.filter = 'blur(8px) brightness(0.7)';
            this._els.image.style.transform = 'scale(1.1)';
        } else {
            this._els.image.style.filter = '';
            this._els.image.style.transform = '';
        }
        
        this._els.description.textContent = guide.description || '내용 없음';
        
        // 🎤 모드별 정보박스 표시 전환
        if (isVoiceGuide) {
            // 음성 모드: voiceQueryInfo 표시, locationInfo 숨김
            this._els.locationInfo.classList.add('hidden');
            if (this._els.voiceQueryInfo && this._els.voiceQueryText) {
                this._els.voiceQueryText.textContent = guide.voiceQuery || guide.title || '';
                this._els.voiceQueryInfo.classList.remove('hidden');
            }
            console.log('[GuideDetailPage] 음성 모드:', guide.voiceQuery || guide.title);
        } else {
            // 이미지 모드: locationInfo 표시, voiceQueryInfo 숨김
            if (this._els.voiceQueryInfo) {
                this._els.voiceQueryInfo.classList.add('hidden');
            }
            if (guide.locationName) {
                this._els.locationName.textContent = guide.locationName;
                this._els.locationInfo.classList.remove('hidden');
            } else {
                this._els.locationInfo.classList.add('hidden');
            }
            console.log('[GuideDetailPage] 이미지 모드:', guide.locationName);
        }

        // 🎤 저장된 음성 정보 보관 (토글 재생 시 사용)
        this._state.savedVoiceLang = guide.voiceLang || null;
        this._state.savedVoiceName = guide.voiceName || null;

        // 🎤 저장된 음성 정보 전달 (voiceLang, voiceName, renderId)
        if (guide.description) {
            this._playAudio(guide.description, guide.voiceLang, guide.voiceName, renderId);
        }
    },

    // 페이지 표시
    _show: function() {
        this._els.page.classList.remove('hidden');
        // 부모 페이지 스크롤 완전 차단 (html, body 모두)
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // 🌐 2025-12-04: 페이지 열 때마다 번역 상태 재확인
        this._refreshTranslationState();
    },
    
    // 🌐 번역 상태 재확인 (언어 동적 변경 대응)
    _refreshTranslationState: function() {
        const self = this;
        const userLang = localStorage.getItem('appLanguage') || 'ko';
        
        // 한국어면 번역 대기 불필요
        if (userLang === 'ko') {
            this._state.translationComplete = true;
            return;
        }
        
        // 이미 번역된 상태인지 확인
        const hasTranslateClass = document.body.classList.contains('translated-ltr') || 
                                  document.body.classList.contains('translated-rtl');
        if (hasTranslateClass) {
            this._state.translationComplete = true;
            console.log('[GuideDetailPage] 번역 완료 상태');
            return;
        }
        
        // 번역 대기 모드 (아직 번역되지 않음)
        this._state.translationComplete = false;
        console.log('[GuideDetailPage] 번역 대기 모드 (재설정):', userLang);
        
        // 기존 Observer 정리
        if (this._state.translationObserver) {
            this._state.translationObserver.disconnect();
        }
        
        // 새로운 MutationObserver 설정
        this._state.translationObserver = new MutationObserver(function(mutations) {
            const hasTranslated = document.body.classList.contains('translated-ltr') || 
                                  document.body.classList.contains('translated-rtl');
            if (hasTranslated) {
                console.log('[GuideDetailPage] 🌐 번역 완료 감지 (재설정)!');
                self._state.translationComplete = true;
                self._state.translationObserver.disconnect();
                window.dispatchEvent(new CustomEvent('guideTranslationComplete'));
            }
        });
        
        this._state.translationObserver.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    },

    // 페이지 닫기
    close: function() {
        this._stopAudio();
        this._els.page.classList.add('hidden');
        // 부모 페이지 스크롤 원복 (html, body 모두)
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        if (this._state.onClose) {
            this._state.onClose();
        }
    },

    // 음성 재생 (문장별 하이라이트 + 자동 스크롤)
    // 🎤 voiceLang, voiceName: 저장된 음성 정보 (없으면 현재 appLanguage 기본값)
    // 🌐 2025-12-04: 번역 완료 대기 후 번역된 텍스트로 TTS 재생
    _playAudio: async function(text, savedVoiceLang, savedVoiceName, renderId) {
        const self = this;
        const thisRenderId = renderId || this._state.renderId;
        this._stopAudio();
        
        // 🌐 번역 완료 대기 (한국어가 아닌 경우)
        const userLang = localStorage.getItem('appLanguage') || 'ko';
        if (userLang !== 'ko' && !this._state.translationComplete) {
            console.log('[TTS] 번역 완료 대기 중...');
            await new Promise(resolve => {
                const handler = () => {
                    window.removeEventListener('guideTranslationComplete', handler);
                    resolve();
                };
                window.addEventListener('guideTranslationComplete', handler);
                // 타임아웃 백업 (3초)
                setTimeout(resolve, 3500);
            });
        }
        
        // 🌐 번역된 텍스트 가져오기 (DOM에서 현재 보이는 텍스트)
        const currentText = this._els.description.textContent || text;
        
        // <br> 태그 제거
        const cleanText = currentText.replace(new RegExp('<br\\s*/?>', 'gi'), ' ');
        
        // 문장 분리
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        
        // 원본 저장
        this._state.originalText = cleanText;
        
        this._state.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // 🎤 TTS 언어 결정: 현재 appLanguage 우선 (번역된 텍스트에 맞춤)
        const langFullMap = { 'ko': 'ko-KR', 'en': 'en-US', 'ja': 'ja-JP', 'zh-CN': 'zh-CN', 'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES' };
        const fullLang = (userLang !== 'ko') ? (langFullMap[userLang] || 'ko-KR') : (savedVoiceLang || 'ko-KR');
        
        console.log('[TTS] 재생 언어:', fullLang, '텍스트 길이:', cleanText.length);
        
        // 🔴 음성 목록 로드 대기 (최대 1초)
        let voices = this._state.synth.getVoices();
        if (voices.length === 0) {
            console.log('[TTS] Waiting for voices to load...');
            await new Promise(resolve => {
                const checkVoices = () => {
                    voices = self._state.synth.getVoices();
                    if (voices.length > 0) {
                        resolve();
                    } else {
                        setTimeout(checkVoices, 100);
                    }
                };
                setTimeout(checkVoices, 100);
                setTimeout(resolve, 1000); // 최대 1초 대기
            });
            voices = this._state.synth.getVoices();
        }
        this._state.voices = voices;
        console.log('[TTS] Voices loaded:', voices.length);
        
        // 🎤 2025-12-11: 현재 앱 언어(appLanguage)에 맞는 음성 선택 (savedVoiceName 무시)
        let targetVoice = null;
        const shortLang = fullLang.substring(0, 2);
        
        // 🔧 2025-12-23: TTSHelper 사용으로 일관된 음성 선택
        if (window.TTSHelper) {
            const settings = window.TTSHelper.getVoiceSettings();
            targetVoice = settings.voice;
            console.log('[TTS] TTSHelper 사용:', settings.lang, '→', targetVoice?.name);
        } else if (shortLang === 'ko') {
            // ⭐ Fallback 한국어 하드코딩 (iOS: Yuna/Sora, Windows: Heami)
            const koVoices = voices.filter(v => v.lang.startsWith('ko'));
            targetVoice = koVoices.find(v => v.name.includes('Yuna'))
                       || koVoices.find(v => v.name.includes('Sora'))
                       || koVoices.find(v => v.name.includes('유나'))
                       || koVoices.find(v => v.name.includes('소라'))
                       || koVoices.find(v => v.name.includes('Heami'))
                       || koVoices[0];
            console.log('[TTS] Fallback 한국어 음성:', targetVoice?.name);
        } else {
            targetVoice = this._getVoiceForLanguage(shortLang === 'zh' ? 'zh-CN' : shortLang);
            console.log('[TTS] Fallback 언어 음성:', fullLang, '→', targetVoice?.name);
        }
        
        this._state.currentUtterance.voice = targetVoice;
        this._state.currentUtterance.lang = fullLang;
        this._state.currentUtterance.rate = 1.0;
        
        let currentSentenceIndex = 0;
        
        this._state.currentUtterance.onstart = () => {
            self._updateAudioButtonIcon(true);
        };
        
        // 문장별 하이라이트 + 자동 스크롤
        this._state.currentUtterance.onboundary = (event) => {
            // 🔒 렌더 ID 체크 - 다른 항목이 열렸으면 무시
            if (thisRenderId !== self._state.renderId) return;
            
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
            // 🔒 렌더 ID 체크 - 다른 항목이 열렸으면 무시
            if (thisRenderId !== self._state.renderId) return;
            
            self._updateAudioButtonIcon(false);
            self._els.description.textContent = self._state.originalText;
        };
        
        this._state.synth.speak(this._state.currentUtterance);
    },

    // 음성 정지
    _stopAudio: function() {
        // 🔒 2025-12-11: 이벤트 핸들러 먼저 제거 (race condition 방지)
        if (this._state.currentUtterance) {
            this._state.currentUtterance.onboundary = null;
            this._state.currentUtterance.onend = null;
            this._state.currentUtterance.onstart = null;
            this._state.currentUtterance.onerror = null;
        }
        if (this._state.synth.speaking) {
            this._state.synth.pause();
            this._state.synth.cancel();
        }
        this._updateAudioButtonIcon(false);
        if (this._state.originalText && this._els.description) {
            this._els.description.textContent = this._state.originalText;
        }
    },

    // 음성 토글 (저장된 음성 정보 사용)
    _toggleAudio: function() {
        const text = this._els.description.textContent;
        if (!text || text === '불러오는 중...') return;

        if (this._state.synth.speaking) {
            this._stopAudio();
        } else {
            // 🎤 저장된 음성 정보 사용
            this._playAudio(text, this._state.savedVoiceLang, this._state.savedVoiceName);
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
    },

    // 💾 2025-12-10: 로컬 보관함(IndexedDB)에 저장 + 보관함으로 이동
    // public/index.js handleSaveClick 동작 그대로 복사
    _saveToLocal: async function() {
        const data = this._state.currentGuideData;
        if (!data) {
            console.warn('[GuideDetailPage] 저장할 데이터 없음');
            this._showToast('저장할 데이터가 없습니다', 'error');
            return;
        }

        // 저장 버튼 비활성화
        this._els.saveBtn.disabled = true;
        this._els.saveBtn.style.opacity = '0.5';

        try {
            // IndexedDB에 직접 저장 (public/index.js addItem 로직)
            const guideData = {
                imageDataUrl: data.imageUrl || data.imageDataUrl || '',
                description: data.description || '',
                locationName: data.locationName || '',
                voiceLang: data.voiceLang || this._state.savedVoiceLang || 'ko-KR',
                voiceName: data.voiceName || this._state.savedVoiceName || '',
                title: data.title || data.voiceQuery || '제목 없음',
                timestamp: Date.now()
            };

            const savedId = await this._addToIndexedDB(guideData);
            console.log('[GuideDetailPage] IndexedDB 저장 완료, ID:', savedId);
            
            this._showToast('보관함에 저장되었습니다', 'success');
            
            // 페이지 닫고 보관함으로 이동
            setTimeout(() => {
                this.close();
                // 메인 앱이면 hash 이동, 프로필 페이지면 앱으로 이동
                if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                    window.location.hash = '#archive';
                    // 보관함 새로고침 트리거
                    window.dispatchEvent(new CustomEvent('archiveUpdated'));
                } else {
                    // 프로필 등 다른 페이지 → 앱 보관함으로 이동
                    window.location.href = '/#archive';
                }
            }, 500);
            
        } catch (error) {
            console.error('[GuideDetailPage] 저장 실패:', error);
            this._showToast('저장에 실패했습니다', 'error');
            this._els.saveBtn.disabled = false;
            this._els.saveBtn.style.opacity = '1';
        }
    },

    // IndexedDB에 아이템 추가 (public/index.js addItem 복사)
    _addToIndexedDB: function(item) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MyAppDB', 1);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('archive')) {
                    db.createObjectStore('archive', { keyPath: 'id', autoIncrement: true });
                }
            };
            
            request.onsuccess = (e) => {
                const db = e.target.result;
                const tx = db.transaction('archive', 'readwrite');
                const store = tx.objectStore('archive');
                const addRequest = store.add(item);
                
                addRequest.onsuccess = () => resolve(addRequest.result);
                addRequest.onerror = () => reject(addRequest.error);
            };
            
            request.onerror = () => reject(request.error);
        });
    },

    // 💾 토스트 메시지 표시
    _showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm z-[10000] transition-all duration-300 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-gray-800'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};

// ES Module export (선택적)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = guideDetailPage;
}
