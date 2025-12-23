/**
 * 🔊 공통 TTS 헬퍼 유틸리티
 * 2025-12-23: 전 영역 일관된 TTS 로직
 * 
 * 핵심 로직:
 * - 한국어: 즉시 TTS 재생 (하드코딩 음성: Yuna → Sora → Heami)
 * - 다른 언어: Google Translate 번역 완료 감지 후 해당 언어 음성으로 재생
 */

window.TTSHelper = (function() {
    'use strict';
    
    const synth = window.speechSynthesis;
    
    // 언어 코드 매핑 (appLanguage → TTS lang)
    const LANG_MAP = {
        'ko': 'ko-KR',
        'en': 'en-US',
        'ja': 'ja-JP',
        'zh-CN': 'zh-CN',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES'
    };
    
    // ⭐ 한국어 하드코딩 음성 우선순위 (iOS 버그 대응)
    function getKoreanVoice() {
        const voices = synth.getVoices();
        const koVoices = voices.filter(v => v.lang.startsWith('ko'));
        
        // Yuna → Sora → 유나 → 소라 → Heami → 첫 번째 한국어 음성
        const targetVoice = koVoices.find(v => v.name.includes('Yuna'))
                        || koVoices.find(v => v.name.includes('Sora'))
                        || koVoices.find(v => v.name.includes('유나'))
                        || koVoices.find(v => v.name.includes('소라'))
                        || koVoices.find(v => v.name.includes('Heami'))
                        || koVoices[0];
        
        console.log('🎤 [한국어] 음성:', targetVoice?.name || 'default');
        return targetVoice;
    }
    
    // 다른 언어 음성 가져오기
    function getVoiceForLanguage(langCode) {
        const voices = synth.getVoices();
        const ttsLang = LANG_MAP[langCode] || langCode;
        
        // 정확한 매칭 시도
        let targetVoice = voices.find(v => v.lang === ttsLang);
        
        // 접두사 매칭
        if (!targetVoice) {
            const prefix = ttsLang.split('-')[0];
            targetVoice = voices.find(v => v.lang.startsWith(prefix));
        }
        
        console.log('🎤 [' + langCode + '] 음성:', targetVoice?.name || 'default');
        return targetVoice;
    }
    
    // 현재 앱 언어 가져오기 (독립 페이지 지원)
    // 우선순위: URL 파라미터 > 페이지 저장 언어 > __ttsTargetLang > localStorage
    function getAppLanguage() {
        // 1. URL 파라미터 (?lang=fr) - 독립 페이지에서 앱이 전달
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) {
            console.log('🌐 [언어] URL 파라미터:', urlLang);
            return urlLang;
        }
        
        // 2. 페이지에 저장된 언어 (공유페이지 생성 시 저장)
        if (window.__pageLanguage) {
            console.log('🌐 [언어] 페이지 저장:', window.__pageLanguage);
            return window.__pageLanguage;
        }
        
        // 3. window.__ttsTargetLang (HEAD 스크립트에서 설정)
        if (window.__ttsTargetLang) {
            const lang = window.__ttsTargetLang.split('-')[0];
            console.log('🌐 [언어] __ttsTargetLang:', lang);
            return lang;
        }
        
        // 4. localStorage (앱 내에서만 유효)
        const storedLang = localStorage.getItem('appLanguage');
        if (storedLang) {
            console.log('🌐 [언어] localStorage:', storedLang);
            return storedLang;
        }
        
        return 'ko';
    }
    
    // 번역 완료 감지 (MutationObserver)
    function waitForTranslation(timeout = 2000) {
        return new Promise((resolve) => {
            const appLang = getAppLanguage();
            
            // 한국어면 즉시 완료
            if (appLang === 'ko') {
                resolve(true);
                return;
            }
            
            // 이미 번역되었는지 확인
            const isTranslated = document.body.classList.contains('translated-ltr') ||
                                 document.body.classList.contains('translated-rtl');
            if (isTranslated) {
                resolve(true);
                return;
            }
            
            // 번역 완료 감지
            let resolved = false;
            const observer = new MutationObserver(() => {
                const nowTranslated = document.body.classList.contains('translated-ltr') ||
                                      document.body.classList.contains('translated-rtl');
                if (nowTranslated && !resolved) {
                    resolved = true;
                    observer.disconnect();
                    console.log('🌍 [번역완료] 감지됨');
                    resolve(true);
                }
            });
            
            observer.observe(document.body, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
            
            // 타임아웃 fallback
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    observer.disconnect();
                    console.log('🌍 [번역] 타임아웃, 진행');
                    resolve(false);
                }
            }, timeout);
        });
    }
    
    // 언어에 맞는 음성과 설정 가져오기
    function getVoiceSettings() {
        const appLang = getAppLanguage();
        const ttsLang = LANG_MAP[appLang] || 'ko-KR';
        
        let voice;
        if (appLang === 'ko') {
            voice = getKoreanVoice();
        } else {
            voice = getVoiceForLanguage(appLang);
        }
        
        return {
            lang: ttsLang,
            voice: voice,
            appLang: appLang
        };
    }
    
    // TTS 재생 (번역 대기 포함)
    async function speak(text, element, options = {}) {
        const settings = getVoiceSettings();
        
        // 한국어가 아니면 번역 완료 대기
        if (settings.appLang !== 'ko') {
            await waitForTranslation(options.timeout || 2000);
            
            // 번역된 텍스트 가져오기 (element가 있으면)
            if (element) {
                text = element.textContent.trim() || text;
            }
        }
        
        // 기존 음성 중지
        if (synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = settings.lang;
        utterance.voice = settings.voice;
        
        console.log('🔊 [TTS] 언어:', settings.lang, '| 음성:', settings.voice?.name);
        
        return new Promise((resolve, reject) => {
            utterance.onend = () => resolve();
            utterance.onerror = (e) => reject(e);
            synth.speak(utterance);
        });
    }
    
    // 유틸리티: SpeechSynthesisUtterance 설정
    function configureUtterance(utterance) {
        const settings = getVoiceSettings();
        utterance.lang = settings.lang;
        utterance.voice = settings.voice;
        return utterance;
    }
    
    // 음성 중지
    function stop() {
        if (synth.speaking || synth.pending) {
            synth.cancel();
        }
    }
    
    // Public API
    return {
        speak: speak,
        stop: stop,
        getVoiceSettings: getVoiceSettings,
        getKoreanVoice: getKoreanVoice,
        getVoiceForLanguage: getVoiceForLanguage,
        waitForTranslation: waitForTranslation,
        configureUtterance: configureUtterance,
        getAppLanguage: getAppLanguage,
        LANG_MAP: LANG_MAP
    };
})();

console.log('🔊 TTSHelper 로드됨');
