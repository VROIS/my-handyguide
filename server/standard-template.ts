// ═══════════════════════════════════════════════════════════════
// ⚠️ CRITICAL: 표준 공유페이지 템플릿 - 1000+회 테스트된 핵심 파일
// ═══════════════════════════════════════════════════════════════
// 🔴 DO NOT MODIFY WITHOUT USER APPROVAL
// 🔴 이 파일은 신규 유입자가 앱으로 오는 **유일한 통로**입니다
// 🔴 임의 수정 시 전체 공유페이지 시스템이 깨집니다
// 
// 작업 이력:
// - 2025-11-23: appOrigin 하드코딩 (개발본/배포본 동일 작동 보장)
// - 출처: public/index.js의 generateShareHTML 함수 (373-900번 라인)
// ═══════════════════════════════════════════════════════════════

export interface StandardTemplateData {
  title: string;
  sender: string;
  location: string;
  date: string;
  guideItems: GuideItem[];
  appOrigin: string;
  isFeatured?: boolean;
  creatorReferralCode?: string;
}

export interface GuideItem {
  id?: string; // Guide UUID (optional, fallback to index)
  imageDataUrl: string;
  description: string;
  voiceLang?: string; // TTS 언어 코드 (예: ko-KR, fr-FR)
}

export function generateStandardShareHTML(data: StandardTemplateData): string {
  const { title, sender, location, date, guideItems, isFeatured = false, creatorReferralCode = '' } = data;
  
  // ⚠️ 2025-11-23: appOrigin 하드코딩 (개발본/배포본 동일 작동 보장)
  // 홈 버튼 2개 (메인 하단 "손안에 가이드 시작하기", 가이드 페이지 하단)에서 사용
  const appOrigin = 'https://My-handyguide1.replit.app';
  
  // HTML escape 함수 (XSS 방지 및 파싱 에러 방지)
  const escapeHTML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  // 갤러리 그리드 아이템 생성 (2열)
  // ✅ 2025-11-26: data-id는 인덱스 (클릭 핸들러용), data-guid는 UUID (parseGuidesFromHtml용)
  // ⚠️ CRITICAL: data-id는 반드시 숫자 인덱스여야 함! parseInt(data-id)로 appData 접근하기 때문
  const galleryItemsHTML = guideItems.map((item, index) => `
            <div class="gallery-item" data-id="${index}" data-guid="${item.id || ''}">
                <img src="${item.imageDataUrl || ''}" alt="가이드 ${index + 1}" loading="lazy">
                <p>가이드 ${index + 1}</p>
            </div>
        `).join('');

  // 데이터 JSON (이미지 + 설명 + 음성정보)
  // ✅ 2025-11-26: id는 인덱스 (클릭 핸들러용), guid는 UUID (parseGuidesFromHtml용)
  // ✅ 2025-12-03: voiceLang 추가 (저장된 언어로 TTS 재생)
  const dataJSON = JSON.stringify(guideItems.map((item, index) => ({
    id: index,
    guid: item.id || '',
    imageDataUrl: item.imageDataUrl || '',
    description: item.description || '',
    voiceLang: item.voiceLang
  })));

  // UTF-8 안전한 base64 인코딩
  const utf8ToBase64 = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt('0x' + p1));
    }));
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <!-- 🎤🔒 2025.12.04: TTS 강제 차단 + 번역 완료 후 재생 (speechSynthesis.speak 가로채기) -->
    <script>
        (function() {
            'use strict';
            
            // 언어코드 매핑
            var LANG_MAP = {
                'ko': 'ko-KR', 'en': 'en-US', 'ja': 'ja-JP',
                'zh-CN': 'zh-CN', 'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES'
            };
            
            // 🌐 2025.12.05: URL 파라미터 + localStorage 모두 체크
            var params = new URLSearchParams(window.location.search);
            var urlLang = params.get('lang');
            var storedLang = null;
            try { storedLang = localStorage.getItem('appLanguage'); } catch(e) {}
            
            // URL 파라미터 우선, 없으면 localStorage
            var activeLang = urlLang || storedLang || 'ko';
            var targetLang = LANG_MAP[activeLang] || LANG_MAP[activeLang.split('-')[0]] || null;
            
            // 한국어가 아니면 → 번역 필요, TTS 대기
            var needsTranslation = activeLang !== 'ko' && targetLang;
            window.__translationComplete = !needsTranslation;
            window.__ttsTargetLang = targetLang;
            window.__ttsQueue = [];
            
            if (needsTranslation) {
                console.log('🎤🔒 [TTS 차단] 번역 대기 중... 대상:', targetLang);
            }
            
            // 🔒 speechSynthesis.speak 원본 백업 및 가로채기
            var originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
            
            window.speechSynthesis.speak = function(utterance) {
                if (!window.__translationComplete) {
                    console.log('🎤🔒 [TTS 차단] 대기열 추가 (번역 미완료)');
                    window.__ttsQueue.push(utterance);
                    return;
                }
                
                if (window.__ttsTargetLang) {
                    var descEl = document.getElementById('detail-description');
                    if (descEl) {
                        var translatedText = descEl.textContent || descEl.innerText;
                        utterance.text = translatedText;
                        utterance.lang = window.__ttsTargetLang;
                        console.log('🎤✅ [TTS 재생] 언어:', window.__ttsTargetLang, '길이:', translatedText.length);
                    }
                }
                
                originalSpeak(utterance);
            };
            
            // 번역 완료 감지
            function watchForTranslation() {
                if (!needsTranslation) return;
                
                var observer = new MutationObserver(function() {
                    var hasTranslateClass = document.body.classList.contains('translated-ltr') || 
                                            document.body.classList.contains('translated-rtl');
                    
                    if (hasTranslateClass) {
                        console.log('🎤✅ [번역 완료] TTS 차단 해제!');
                        window.__translationComplete = true;
                        observer.disconnect();
                        
                        if (window.__ttsQueue.length > 0) {
                            console.log('🎤✅ [대기열 재생]', window.__ttsQueue.length + '개');
                            window.__ttsQueue.forEach(function(utt) {
                                var descEl = document.getElementById('detail-description');
                                if (descEl) {
                                    utt.text = descEl.textContent || descEl.innerText;
                                    utt.lang = window.__ttsTargetLang;
                                }
                                originalSpeak(utt);
                            });
                            window.__ttsQueue = [];
                        }
                    }
                });
                
                observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
                
                setTimeout(function() {
                    if (!window.__translationComplete) {
                        console.log('🎤⚠️ [번역 타임아웃] 원본으로 재생');
                        window.__translationComplete = true;
                        observer.disconnect();
                        window.__ttsQueue.forEach(function(utt) { originalSpeak(utt); });
                        window.__ttsQueue = [];
                    }
                }, 5000);
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', watchForTranslation);
            } else {
                watchForTranslation();
            }
        })();
    </script>
    <!-- 🌐 2025.12.03: 쿼리 파라미터로 구글 번역 쿠키 설정 (자동 번역용) -->
    <script>
        (function() {
            var params = new URLSearchParams(window.location.search);
            var lang = params.get('lang');
            if (lang && /^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
                var domain = window.location.hostname;
                document.cookie = 'googtrans=/ko/' + lang + ';path=/;domain=' + domain;
                document.cookie = 'googtrans=/ko/' + lang + ';path=/';
                console.log('🌐 Pre-set googtrans cookie for:', lang);
            }
        })();
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${escapeHTML(title)} - 손안에 가이드</title>
    <link rel="manifest" href="data:application/json;base64,${utf8ToBase64(JSON.stringify({
      name: title,
      short_name: title,
      start_url: '.',
      display: 'standalone',
      theme_color: '#4285F4'
    }))}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            background-color: #f0f2f5;
            overflow-x: hidden;
        }
        .hidden { display: none !important; }
        
        /* 앱과 100% 동일한 CSS (복사) */
        .full-screen-bg { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            object-fit: cover; 
            z-index: 1; 
        }
        .ui-layer { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            z-index: 10; 
            display: flex; 
            flex-direction: column;
        }
        .header-safe-area { 
            position: relative;
            width: 100%; 
            height: 80px; 
            flex-shrink: 0; 
            z-index: 20;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 0 1rem;
        }
        .content-safe-area { 
            flex: 1; 
            overflow-y: auto; 
            -webkit-overflow-scrolling: touch; 
            background: transparent;
            z-index: 25;
        }
        .footer-safe-area { 
            width: 100%; 
            height: 100px; 
            flex-shrink: 0; 
            z-index: 30; 
            display: flex; 
            justify-content: space-around; 
            align-items: center; 
            padding: 0 1rem;
        }
        
        /* 텍스트 오버레이 */
        .text-content {
            padding: 2rem 1.5rem;
            line-height: 1.8;
            word-break: keep-all;
            overflow-wrap: break-word;
        }
        .readable-on-image {
            color: white;
            text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.95);
        }
        
        /* 버튼 공통 스타일 (앱과 동일) */
        .interactive-btn {
            transition: transform 0.1s ease;
            cursor: pointer;
            border: none;
        }
        .interactive-btn:active {
            transform: scale(0.95);
        }
        
        /* 헤더 (메타데이터) */
        .header {
            padding: 20px;
            background-color: #4285F4; /* Gemini Blue - 앱 통일 */
            color: #fff;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 15px 0;
            font-size: 28px;
        }
        .metadata {
            font-size: 14px;
            opacity: 0.9;
        }
        .metadata p {
            margin: 5px 0;
        }
        
        /* 갤러리 뷰 */
        #gallery-view {
            padding: 15px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        /* 반응형: 태블릿/노트북/PC (768px 이상) */
        @media (min-width: 768px) {
            .gallery-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            #gallery-view {
                padding: 30px;
            }
        }
        
        .gallery-item {
            cursor: pointer;
            text-align: center;
        }
        .gallery-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            background-color: #e9e9e9;
        }
        .gallery-item:hover img {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        }
        .gallery-item p {
            margin: 8px 0 0;
            font-weight: 700;
            color: #333;
            font-size: 14px;
        }
        
        /* 갤러리 하단 버튼 */
        .gallery-footer {
            text-align: center;
            padding: 30px 15px;
        }
        .app-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #4285F4;
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
            transition: all 0.3s;
        }
        .app-button:hover {
            background: #3367D6;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4);
        }
    </style>
</head>
<body>
    <!-- 헤더 (메타데이터) -->
    <div class="header">
        <h1>${escapeHTML(title)}</h1>
        <div class="metadata">
            <p>👤 ${escapeHTML(sender)} 님이 보냄</p>
            <p>📍 ${escapeHTML(location)}</p>
            <p>📅 ${escapeHTML(date)}</p>
        </div>
    </div>
    
    <!-- 갤러리 뷰 -->
    <div id="gallery-view">
        ${isFeatured ? `
        <!-- 🔙 추천 갤러리 전용 리턴 버튼 (왼쪽 상단, 앱과 통일) -->
        <div style="position: sticky; top: 0; z-index: 100; height: 60px; display: flex; align-items: center; padding: 0 1rem; background: #4285F4;">
            <button onclick="window.location.href='${appOrigin}/#archive'" style="width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(255, 255, 255, 0.95); color: #4285F4; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s;" aria-label="보관함으로 돌아가기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </div>
        ` : ''}
        <div class="gallery-grid">
            ${galleryItemsHTML}
        </div>
        <div class="gallery-footer">
            <a href="${appOrigin}${creatorReferralCode ? `?ref=${creatorReferralCode}` : ''}" class="app-button" id="home-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                나도 만들어보기 ✨
            </a>
        </div>
    </div>
    
    <!-- 상세 뷰 (앱과 100% 동일한 구조) -->
    <div id="detail-view" class="ui-layer hidden">
        <img id="detail-bg" src="" class="full-screen-bg">
        <header class="header-safe-area">
            <button id="detail-back" class="interactive-btn" style="width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 4px 12px rgba(0,0,0,0.3); position: fixed; top: 1rem; right: 1rem; z-index: 10000;" aria-label="뒤로가기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </header>
        <div class="content-safe-area">
            <div id="detail-text" class="text-content hidden">
                <p id="detail-description" class="readable-on-image" style="font-size: 1.25rem; line-height: 1.75rem;"></p>
            </div>
        </div>
        <footer id="detail-footer" class="footer-safe-area hidden" style="background: transparent;">
            <button id="detail-audio" class="interactive-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);" aria-label="오디오 재생">
                <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem;" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.648c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
                <svg id="pause-icon" xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem; display: none;" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
                </svg>
            </button>
            <button id="text-toggle" class="interactive-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);" aria-label="해설 읽기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>
            <a href="${appOrigin}${creatorReferralCode ? `?ref=${creatorReferralCode}` : ''}" id="detail-home" class="interactive-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); text-decoration: none;" aria-label="앱으로 이동">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </a>
        </footer>
    </div>
    
    <!-- 데이터 저장 -->
    <script id="app-data" type="application/json">${dataJSON}</script>
    
    <script>
        // ═══════════════════════════════════════════════════════════════
        // 🎯 리워드 시스템: Referral 쿠키 저장 (2025-11-28)
        // URL의 ?ref=XXXX 파라미터를 감지하여 30일간 쿠키에 저장
        // 나중에 회원가입 시 서버에서 쿠키 확인하여 추천인 연결
        // ═══════════════════════════════════════════════════════════════
        (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            if (refCode) {
                // 30일간 쿠키 저장
                const expires = new Date();
                expires.setDate(expires.getDate() + 30);
                document.cookie = 'referralCode=' + encodeURIComponent(refCode) + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
                console.log('🎁 Referral code saved:', refCode);
            }
        })();
        
        // 데이터 로드
        const appData = JSON.parse(document.getElementById('app-data').textContent);
        const galleryView = document.getElementById('gallery-view');
        const detailView = document.getElementById('detail-view');
        const header = document.querySelector('.header');
        
        // Web Speech API
        const synth = window.speechSynthesis;
        let voices = [];
        let currentUtterance = null;
        
        function populateVoiceList() {
            voices = synth.getVoices();
        }
        
        function stopAudio() {
            if (synth.speaking) {
                synth.pause();
                synth.cancel();
            }
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
        
        // 🎤 2025-12-03: voiceLang 파라미터 추가 (저장된 언어로 TTS 재생)
        function playAudio(text, voiceLang) {
            stopAudio();
            
            // ⚠️ **핵심 로직 - 절대 수정 금지!** (2025-10-03 치명적 버그 해결)
            const cleanText = text.replace(new RegExp('<br\\s*/?>', 'gi'), ' ');
            
            // 문장 분리 및 하이라이트 준비
            const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
            const textElement = document.getElementById('detail-description');
            
            // 원본 텍스트 저장
            const originalText = cleanText;
            
            currentUtterance = new SpeechSynthesisUtterance(cleanText);
            
            // 🎤 저장된 voiceLang 사용 (각 가이드별 원본 언어, 없으면 TTS 스킵)
            if (!voiceLang) {
                console.warn('[Share TTS] voiceLang 없음 - TTS 스킵');
                return;
            }
            const langCode = voiceLang;
            
            // 플랫폼별 최적 음성 우선순위 (2025-12-07: 한국어 iOS/Android 분기)
            const isIOS = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
            const voicePriority = {
                'ko-KR': isIOS ? ['Yuna'] : ['Microsoft Heami', 'Korean', '한국어'],
                'en-US': ['Samantha', 'Microsoft Zira', 'Google US English', 'English'],
                'ja-JP': ['Kyoko', 'Microsoft Haruka', 'Google 日本語', 'Japanese'],
                'zh-CN': ['Ting-Ting', 'Microsoft Huihui', 'Google 普通话', 'Chinese'],
                'fr-FR': ['Thomas', 'Microsoft Hortense', 'Google français', 'French'],
                'de-DE': ['Anna', 'Microsoft Hedda', 'Google Deutsch', 'German'],
                'es-ES': ['Monica', 'Microsoft Helena', 'Google español', 'Spanish']
            };
            
            const allVoices = synth.getVoices();
            let targetVoice = null;
            
            // 우선순위대로 음성 찾기
            const priorities = voicePriority[langCode] || [];
            for (const voiceName of priorities) {
                targetVoice = allVoices.find(v => v.name.includes(voiceName));
                if (targetVoice) break;
            }
            
            // 우선순위에 없으면 언어 코드로 찾기
            if (!targetVoice) {
                targetVoice = allVoices.find(v => v.lang.replace('_', '-').startsWith(langCode.substring(0, 2)));
            }
            
            currentUtterance.voice = targetVoice || null;
            currentUtterance.lang = langCode;
            currentUtterance.rate = 1.0;
            
            console.log('[Share TTS] 언어:', langCode, '음성:', targetVoice ? targetVoice.name : 'default');
            
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            
            let currentSentenceIndex = 0;
            
            currentUtterance.onstart = () => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            };
            
            // 단어 경계마다 하이라이트
            currentUtterance.onboundary = (event) => {
                if (event.name === 'sentence') {
                    // 현재 문장 하이라이트
                    const highlightedHTML = sentences.map((sentence, idx) => {
                        if (idx === currentSentenceIndex) {
                            return '<span style="background-color: rgba(66, 133, 244, 0.3); font-weight: 600;">' + sentence + '</span>';
                        }
                        return sentence;
                    }).join('');
                    
                    textElement.innerHTML = highlightedHTML;
                    currentSentenceIndex++;
                }
            };
            
            currentUtterance.onend = () => {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                // 하이라이트 제거, 원본 복원
                textElement.textContent = originalText;
            };
            
            synth.speak(currentUtterance);
        }
        
        populateVoiceList();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = populateVoiceList;
        }
        
        // 🎤 현재 보고 있는 아이템의 voiceLang 저장
        let currentVoiceLang = null;
        
        // 갤러리 아이템 클릭 (앱과 100% 동일한 로직)
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const itemData = appData[parseInt(item.dataset.id)];
                
                // 🎤 현재 아이템의 voiceLang 저장 (DB에서 가져온 값 그대로)
                currentVoiceLang = itemData.voiceLang;
                
                // 배경 이미지 설정
                document.getElementById('detail-bg').src = itemData.imageDataUrl;
                
                // 텍스트 설정
                document.getElementById('detail-description').textContent = itemData.description;
                
                // UI 표시
                galleryView.classList.add('hidden');
                header.classList.add('hidden');
                detailView.classList.remove('hidden');
                document.getElementById('detail-footer').classList.remove('hidden');
                
                // 텍스트는 표시 상태로 시작 (음성과 동시에 보임)
                document.getElementById('detail-text').classList.remove('hidden');
                
                // 🎤 음성 자동 재생 (저장된 언어 사용)
                playAudio(itemData.description, currentVoiceLang);
            });
        });
        
        // 🔙 보관함으로 돌아가기 버튼 (갤러리 뷰)
        const galleryBackBtn = document.getElementById('gallery-back-btn');
        if (galleryBackBtn) {
            galleryBackBtn.addEventListener('click', () => {
                window.location.href = '/#archive';
            });
        }
        
        // 뒤로 가기
        document.getElementById('detail-back').addEventListener('click', () => {
            stopAudio();
            detailView.classList.add('hidden');
            document.getElementById('detail-text').classList.add('hidden');
            document.getElementById('detail-footer').classList.add('hidden');
            header.classList.remove('hidden');
            galleryView.classList.remove('hidden');
        });
        
        // 텍스트 토글 버튼 (앱과 동일한 로직)
        document.getElementById('text-toggle')?.addEventListener('click', () => {
            document.getElementById('detail-text').classList.toggle('hidden');
        });
        
        // 음성 재생/정지
        document.getElementById('detail-audio').addEventListener('click', () => {
            if (synth.speaking) {
                stopAudio();
            } else {
                const text = document.getElementById('detail-description').textContent;
                // 🎤 저장된 언어 사용
                playAudio(text, currentVoiceLang);
            }
        });
        
        // 홈 버튼 (갤러리 하단)
        const homeButton = document.getElementById('home-button');
        if (homeButton) {
            homeButton.addEventListener('click', (e) => {
                e.preventDefault();
                stopAudio();
                setTimeout(() => {
                    window.location.href = homeButton.href;
                }, 200);
            });
        }
        
        // 홈 버튼 (상세 뷰 하단) - 음성 듣다가 바로 앱으로 가기
        const detailHome = document.getElementById('detail-home');
        if (detailHome) {
            detailHome.addEventListener('click', (e) => {
                e.preventDefault();
                stopAudio();
                setTimeout(() => {
                    window.location.href = detailHome.href;
                }, 200);
            });
        }
        
        // 페이지 이탈 시 오디오 정지 (백그라운드 재생 방지)
        window.addEventListener('beforeunload', () => {
            stopAudio();
        });
    </script>
    
    <!-- ⚠️ 핵심 로직: Service Worker 등록 (오프라인 지원) -->
    <script>
        // Service Worker 지원 확인 및 등록 (v10 - 메인 앱과 동일)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('✅ [SW] v10 등록 성공:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ [SW] 등록 실패:', error);
                    });
            });
        }
    </script>

    <!-- Google Translate Widget (숨김) -->
    <div id="google_translate_element" style="display:none;"></div>

    <!-- Google Translate Initialization -->
    <!-- 🌐 쿠키는 <head>에서 미리 설정됨 (구글 번역 로드 전) -->
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'ko',
                includedLanguages: 'ko,en,ja,zh-CN,fr,de,es',
                autoDisplay: false
            }, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    <!-- Google Translate CSS 숨김 -->
    <style>
        .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget { font-size: 0px !important; color: transparent !important; }
        .goog-logo-link { display: none !important; }
        .skiptranslate { display: none !important; }
    </style>
</body>
</html>`;
}
