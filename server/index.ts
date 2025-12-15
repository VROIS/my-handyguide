import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import fs from 'fs';
import path from 'path';

const app = express();

// 🚀 Gzip 압축 - 모든 응답 자동 압축 (파일 크기 60-70% 감소)
app.use(compression({ level: 6 }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Simple logging function
const log = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [express] ${message}`);
};

// Basic request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    // Log ALL requests temporarily to debug /s/:id issue
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// 🔧 [CRITICAL] /s/:id 라우트 - express.static()보다 먼저 등록!
// ⚠️ MUST be registered OUTSIDE the async IIFE!
// Express route registration is SYNCHRONOUS - async IIFE runs later
app.get('/s/:id', async (req, res) => {
  try {
    const { id } = req.params;
    log(`[SHARE] Request for ID: ${id}`);
    
    // DB에서 공유 페이지 조회
    const page = await storage.getSharedHtmlPage(id);
    
    if (!page) {
      log(`[SHARE] Page not found: ${id}`);
      return res.status(404).send('Not Found');
    }
    
    if (!page.isActive) {
      log(`[SHARE] Page inactive: ${id}`);
      return res.status(410).send('Link Expired');
    }
    
    // 조회수 증가
    await storage.incrementDownloadCount(id);
    
    // HTML 반환
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    
    // ═══════════════════════════════════════════════════════════════
    // 🔧 App Storage 마이그레이션 (2025-11-23)
    // ═══════════════════════════════════════════════════════════════
    // 변경: DB htmlContent 우선 → htmlFilePath fallback (하위 호환성)
    // 이유: Production 환경에서 파일 시스템은 ephemeral (재배포 시 삭제)
    // 해결: DB에 저장된 HTML을 우선 사용, 파일은 fallback만
    // ═══════════════════════════════════════════════════════════════
    
    // ═══════════════════════════════════════════════════════════════
    // 🎁 Referral 시스템: 공유페이지 생성자의 referralCode 주입 (2025-11-29)
    // ═══════════════════════════════════════════════════════════════
    // 공유페이지의 "나도 만들어보기" 버튼에 생성자의 referralCode 추가
    // 이 링크로 가입한 신규 사용자 → 공유페이지 생성자에게 리워드!
    // ═══════════════════════════════════════════════════════════════
    let creatorReferralCode = '';
    try {
      if (page.userId) {
        const creator = await storage.getUser(page.userId);
        if (creator?.referralCode) {
          creatorReferralCode = creator.referralCode;
          log(`[SHARE] 🎁 Creator referralCode: ${creatorReferralCode}`);
        }
      }
    } catch (refError) {
      log(`[SHARE] ⚠️ Could not get creator referralCode: ${refError}`);
    }
    
    // HTML에 referralCode 주입 + 버튼 문구 통일 + 구글 번역 쿠키 설정 함수
    const injectReferralAndUpdateButton = (html: string): string => {
      let result = html;
      
      // 0. 🌐 구글 번역 쿠키 설정 스크립트 주입 (구버전 페이지 호환!)
      // #googtrans(ko|언어코드) 해시 감지 → 쿠키 설정 (구글 번역 로드 전)
      const googTransScript = `
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
    </script>`;
      
      // <head> 바로 뒤에 스크립트 삽입 (구글 번역 로드보다 먼저!)
      if (!result.includes('Pre-set googtrans cookie')) {
        result = result.replace(/<head>/i, '<head>' + googTransScript);
      }
      
      // 🌐 구글 번역 위젯 주입 (기존 페이지에 없는 경우만!)
      const googleTranslateWidget = `
    <!-- 🌐 2025.12.04: 구글 번역 위젯 자동 주입 (다국어 지원) -->
    <div id="google_translate_element" style="display:none;"></div>
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
    <style>
        .skiptranslate { display: none !important; }
        body { top: 0 !important; }
    </style>`;
      
      // </body> 앞에 구글 번역 위젯 삽입 (없으면만!)
      if (!result.includes('google_translate_element')) {
        result = result.replace(/<\/body>/i, googleTranslateWidget + '</body>');
      }
      
      // 🎤🔒 2025-12-04: 가장 강력한 TTS 차단 - speechSynthesis.speak 자체를 가로채기
      // 모든 TTS 호출은 최종적으로 speechSynthesis.speak()를 호출함
      // 이걸 가로채면 playAudio가 로컬이든 전역이든 100% 차단됨
      const ttsBlockerScript = `
    <!-- 🎤🔒 2025.12.04: TTS 강제 차단 + 번역 완료 후 재생 (speechSynthesis.speak 가로채기) -->
    <script>
        (function() {
            'use strict';
            
            // 언어코드 매핑
            var LANG_MAP = {
                'ko': 'ko-KR', 'en': 'en-US', 'ja': 'ja-JP',
                'zh-CN': 'zh-CN', 'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES'
            };
            
            // ?lang= 파라미터 감지
            var params = new URLSearchParams(window.location.search);
            var urlLang = params.get('lang');
            var targetLang = urlLang ? (LANG_MAP[urlLang] || LANG_MAP[urlLang.split('-')[0]] || null) : null;
            
            // 한국어거나 lang 파라미터 없으면 → 번역 불필요, 바로 재생 허용
            var needsTranslation = targetLang && urlLang !== 'ko';
            window.__translationComplete = !needsTranslation;
            window.__ttsTargetLang = targetLang;
            window.__ttsQueue = []; // 대기 중인 TTS 요청
            
            if (needsTranslation) {
                console.log('🎤🔒 [TTS 차단] 번역 대기 중... 대상:', targetLang);
            }
            
            // 🔒 speechSynthesis.speak 원본 백업 및 가로채기
            var originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
            
            window.speechSynthesis.speak = function(utterance) {
                // 번역 완료 전이면 → 대기열에 추가
                if (!window.__translationComplete) {
                    console.log('🎤🔒 [TTS 차단] 대기열 추가 (번역 미완료)');
                    window.__ttsQueue.push(utterance);
                    return;
                }
                
                // 번역 완료 후 → 번역된 텍스트와 언어로 교체
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
            
            // 🔍 번역 완료 감지 (MutationObserver)
            function watchForTranslation() {
                if (!needsTranslation) return;
                
                var observer = new MutationObserver(function() {
                    var hasTranslateClass = document.body.classList.contains('translated-ltr') || 
                                            document.body.classList.contains('translated-rtl');
                    
                    if (hasTranslateClass) {
                        console.log('🎤✅ [번역 완료] TTS 차단 해제!');
                        window.__translationComplete = true;
                        observer.disconnect();
                        
                        // 대기열에 있는 TTS 재생
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
                
                // 5초 후 타임아웃 (오프라인 등)
                setTimeout(function() {
                    if (!window.__translationComplete) {
                        console.log('🎤⚠️ [번역 타임아웃] 원본으로 재생');
                        window.__translationComplete = true;
                        observer.disconnect();
                        // 대기열 재생 (원본 그대로)
                        window.__ttsQueue.forEach(function(utt) {
                            originalSpeak(utt);
                        });
                        window.__ttsQueue = [];
                    }
                }, 5000);
            }
            
            // DOM 로드 후 감시 시작
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', watchForTranslation);
            } else {
                watchForTranslation();
            }
        })();
    </script>`;
      
      // <head> 바로 뒤에 삽입 (모든 스크립트보다 먼저!)
      if (!result.includes('__translationComplete')) {
        result = result.replace(/<head>/i, '<head>' + ttsBlockerScript);
      }
      
      // 1. 버튼 문구 통일: 다양한 기존 문구 → "나도 만들어보기"
      // (이모지 제거, 모든 기존 페이지에 적용)
      result = result
        .replace(/손안에 가이드 시작하기/g, '나도 만들어보기')
        .replace(/나도 만들어보기\s*✨/g, '나도 만들어보기')
        .replace(/나도 만들어보기\s*\*/g, '나도 만들어보기');
      
      // 2. referralCode 주입 (생성자 코드가 있을 때만)
      if (creatorReferralCode) {
        // href="https://My-handyguide1.replit.app" → href="https://My-handyguide1.replit.app?ref=코드"
        result = result
          .replace(/href="(https:\/\/My-handyguide1\.replit\.app)(\/?)"/g, 
            `href="$1$2?ref=${creatorReferralCode}"`)
          .replace(/href='(https:\/\/My-handyguide1\.replit\.app)(\/?)'/g, 
            `href='$1$2?ref=${creatorReferralCode}'`);
      }
      
      // 3. X 버튼 → 리턴 버튼 교체 (갤러리: window.close)
      const returnButtonHTML = `
        <div style="position: sticky; top: 0; z-index: 100; height: 60px; display: flex; align-items: center; padding: 0 1rem; background: #4285F4;">
            <button onclick="window.close()" style="width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(255, 255, 255, 0.95); color: #4285F4; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s;" aria-label="창 닫기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </div>`;
      
      // X 버튼(closeWindowBtn) 제거 + 리턴 버튼 삽입
      result = result.replace(/<button id="closeWindowBtn"[^>]*>[\s\S]*?<\/button>/g, '');
      
      // gallery-view 시작 직후에 리턴 버튼 삽입 (없으면)
      if (!result.includes('onclick="window.close()"') || result.includes('closeWindowBtn')) {
        result = result.replace(
          /<div id="gallery-view"[^>]*>/g, 
          '$&' + returnButtonHTML
        );
      }
      
      // 4. TTS 음성 최적화 스크립트 주입 (guideDetailPage.js 로직 복사)
      const ttsVoiceOptimizationScript = `
    <!-- 🔊 2025.12.15: TTS 음성 최적화 (앱과 동일한 voicePriority 로직) -->
    <script>
        (function() {
            // 플랫폼 감지
            function detectPlatform() {
                var ua = navigator.userAgent;
                if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
                if (/Mac/.test(ua) && 'ontouchend' in document) return 'ios';
                if (/Android/.test(ua)) return 'android';
                if (/Mac/.test(ua)) return 'macos';
                if (/Windows/.test(ua)) return 'windows';
                return 'default';
            }
            
            // DB 기반 음성 우선순위 (앱과 동일)
            var defaultVoicePriorities = {
                'ko-KR': {
                    'ios': ['Yuna', 'Sora'],
                    'macos': ['Yuna', 'Sora'],
                    'windows': ['Heami', 'Microsoft Heami', 'SunHi'],
                    'android': ['Korean', 'ko-KR'],
                    'default': ['Heami', 'Yuna', 'Sora', 'Korean']
                },
                'en-US': {
                    'ios': ['Samantha', 'Karen'],
                    'macos': ['Samantha', 'Karen'],
                    'windows': ['Zira', 'Microsoft Zira', 'David'],
                    'android': ['English', 'en-US'],
                    'default': ['Samantha', 'Zira', 'Google US English', 'English']
                },
                'ja-JP': {
                    'ios': ['Kyoko', 'Otoya'],
                    'macos': ['Kyoko', 'Otoya'],
                    'windows': ['Haruka', 'Microsoft Haruka'],
                    'android': ['Japanese', 'ja-JP'],
                    'default': ['Kyoko', 'Haruka', 'Google 日本語', 'Japanese']
                },
                'zh-CN': {
                    'ios': ['Ting-Ting', 'Meijia'],
                    'macos': ['Ting-Ting', 'Meijia'],
                    'windows': ['Huihui', 'Microsoft Huihui'],
                    'android': ['Chinese', 'zh-CN'],
                    'default': ['Ting-Ting', 'Huihui', 'Google 普通话', 'Chinese']
                },
                'fr-FR': {
                    'ios': ['Thomas', 'Amelie'],
                    'macos': ['Thomas', 'Amelie'],
                    'windows': ['Hortense', 'Microsoft Hortense'],
                    'android': ['French', 'fr-FR'],
                    'default': ['Thomas', 'Hortense', 'Google français', 'French']
                },
                'de-DE': {
                    'ios': ['Anna', 'Markus'],
                    'macos': ['Anna', 'Markus'],
                    'windows': ['Hedda', 'Microsoft Hedda'],
                    'android': ['German', 'de-DE'],
                    'default': ['Anna', 'Hedda', 'Google Deutsch', 'German']
                },
                'es-ES': {
                    'ios': ['Monica', 'Jorge'],
                    'macos': ['Monica', 'Jorge'],
                    'windows': ['Helena', 'Microsoft Helena'],
                    'android': ['Spanish', 'es-ES'],
                    'default': ['Monica', 'Helena', 'Google español', 'Spanish']
                }
            };
            
            // 언어별 최적 음성 찾기
            window.getOptimalVoice = function(langCode, voices) {
                var platform = detectPlatform();
                var priorities = defaultVoicePriorities[langCode];
                if (!priorities) priorities = defaultVoicePriorities['ko-KR'];
                
                var platformPriorities = priorities[platform] || priorities['default'];
                
                for (var i = 0; i < platformPriorities.length; i++) {
                    var voiceName = platformPriorities[i];
                    var found = voices.find(function(v) { return v.name.includes(voiceName); });
                    if (found) return found;
                }
                
                // 언어 코드로 fallback
                var langPrefix = langCode.substring(0, 2);
                var fallback = voices.find(function(v) { return v.lang.replace('_', '-').startsWith(langPrefix); });
                return fallback || voices[0];
            };
            
            console.log('🔊 TTS 음성 최적화 로드 완료, 플랫폼:', detectPlatform());
        })();
    </script>`;
      
      // </head> 앞에 TTS 최적화 스크립트 삽입 (없으면)
      if (!result.includes('getOptimalVoice')) {
        result = result.replace(/<\/head>/i, ttsVoiceOptimizationScript + '</head>');
      }
      
      return result;
    };
    
    // 1. DB htmlContent 우선 (런타임 변환 적용)
    if (page.htmlContent) {
      log(`[SHARE] ✅ Serving from DB (htmlContent)`);
      return res.send(injectReferralAndUpdateButton(page.htmlContent));
    }
    
    // 3. htmlFilePath fallback (구 데이터 호환성)
    if (page.htmlFilePath) {
      const relativePath = page.htmlFilePath.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      
      if (fs.existsSync(fullPath)) {
        const htmlContent = fs.readFileSync(fullPath, 'utf8');
        log(`[SHARE] ⚠️ Serving from file (legacy): ${relativePath}`);
        return res.send(injectReferralAndUpdateButton(htmlContent));
      } else {
        log(`[SHARE] ❌ File not found: ${fullPath}`);
      }
    }
    
    return res.status(404).send('HTML content not found');
  } catch (error) {
    console.error('[SHARE] Error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

(async () => {
  // 🔧 Ensure temp-user-id exists for share functionality
  try {
    const tempUser = await storage.getUser('temp-user-id');
    if (!tempUser) {
      await storage.upsertUser({
        id: 'temp-user-id',
        email: 'temp@example.com',
        firstName: '임시',
        lastName: '사용자',
      });
      log('Created temp-user-id for share functionality');
    }
  } catch (error) {
    log('Warning: Could not create temp-user-id: ' + error);
  }
  
  // 🔧 [공유링크 수정] 정적 파일 서빙을 라우트 등록보다 먼저 설정
  const publicDir = process.env.NODE_ENV === 'production' ? 'dist/public' : 'public';
  
  // ⚠️ 2025.11.02: 스마트 캐시 전략 (업데이트 vs 성능 균형)
  // 🚀 2025-12-01: 최적화된 캐시 헤더 - 재방문 즉시 로딩
  app.use(express.static(publicDir, {
    maxAge: '1d',  // 기본 캐시: 24시간
    etag: true,    // ETag 기반 유효성 검사
    setHeaders: (res, filePath) => {
      // HTML/JS만 캐시 비활성화 (업데이트 즉시 반영)
      // 이미지/CSS/폰트: 장기 캐시 (1일~30일)
      if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (filePath.endsWith('.css') || filePath.endsWith('.woff2') || filePath.endsWith('.woff')) {
        // CSS/폰트: 30일 캐시 (거의 안 바뀜)
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      } else if (filePath.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
        // 이미지: 7일 캐시 (해시값 기반 버전관리)
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      } else {
        // 기타: 1시간 캐시
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    }
  }));
  
  // Route for root page
  app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('index.html', { root: publicDir });
  });
  
  // Route for share page - 명시적 라우트 추가
  app.get('/share.html', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('share.html', { root: publicDir });
  });
  
  // 🔧 명시적 HTML 파일 라우트 (SPA Fallback 우회)
  app.get('/profile.html', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('profile.html', { root: publicDir });
  });
  
  app.get('/admin-dashboard.html', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('admin-dashboard.html', { root: publicDir });
  });
  
  app.get('/user-guide.html', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('user-guide.html', { root: publicDir });
  });
  
  // 🔧 [공유링크 임시 비활성화] SEO 친화적 URL은 추후 구현 예정

  const server = await registerRoutes(app);

  // ⚠️ 2025.11.02: SPA Fallback - 모든 클라이언트 라우트를 index.html로
  // API 라우트가 먼저 처리되고, 나머지는 모두 index.html로 (SPA 라우팅)
  app.get('*', (req, res) => {
    // API 경로는 이미 위에서 처리되었으므로 여기 도달하지 않음
    // 클라이언트 라우트(/archive, /settings 등)를 index.html로 보냄
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('index.html', { root: publicDir });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Express error:", err);
    res.status(status).json({ message });
    // Don't throw err after sending response to prevent server crashes
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
