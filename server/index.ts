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
    <!-- 🌐 2025.12.03: 구글 번역 로드 전에 쿠키 설정 (자동 번역용) -->
    <script>
        (function() {
            // 이미 쿠키가 설정되어 있으면 스킵 (무한 루프 방지)
            if (document.cookie.includes('googtrans=')) return;
            
            var hash = decodeURIComponent(window.location.hash);
            var match = hash.match(/#googtrans\\(ko\\|([a-z]{2}(-[A-Z]{2})?)\\)/);
            if (match) {
                var lang = match[1];
                var domain = window.location.hostname;
                document.cookie = 'googtrans=/ko/' + lang + ';path=/;domain=' + domain;
                document.cookie = 'googtrans=/ko/' + lang + ';path=/';
                console.log('🌐 Pre-set googtrans cookie for:', lang);
                // 해시 제거 후 새로고침
                history.replaceState(null, '', window.location.pathname + window.location.search);
                window.location.reload();
            }
        })();
    </script>`;
      
      // <head> 바로 뒤에 스크립트 삽입 (구글 번역 로드보다 먼저!)
      if (!result.includes('Pre-set googtrans cookie')) {
        result = result.replace(/<head>/i, '<head>' + googTransScript);
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
      
      return result;
    };
    
    // 1. DB htmlContent 우선 (신규 데이터)
    if (page.htmlContent) {
      log(`[SHARE] ✅ Serving from DB (htmlContent)`);
      return res.send(injectReferralAndUpdateButton(page.htmlContent));
    }
    
    // 2. htmlFilePath fallback (구 데이터 호환성)
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
