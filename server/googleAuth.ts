// ═══════════════════════════════════════════════════════════════
// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT USER APPROVAL
// 사용자 승인 없이 절대 수정 금지 - AI 및 모든 개발자 주의
// 
// 📱 모바일 OAuth 통합 인증 시스템 (2025-11-12)
// - PC/모바일 통일: window.open() 팝업 방식 (상태 보존)
// - 모바일: "인증 완료" 수동 닫기 버튼
// - PC: postMessage + 300ms 자동 닫기
// - 디자인: 공유페이지와 100% 통일 (Hero Icons + Gemini Blue)
// - 1번 닫기: fallback 리다이렉트 제거로 이중 닫기 해결
//
// Verified: 2025-11-12 | Status: Production-Ready ✅
// ═══════════════════════════════════════════════════════════════

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";
import { creditService } from "./creditService";

export async function setupGoogleAuth(app: Express) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!googleClientId || !googleClientSecret) {
    console.warn('⚠️  구글 OAuth 환경변수가 설정되지 않았습니다. 구글 로그인을 사용하려면 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET을 설정하세요.');

    app.get("/api/auth/google", (req, res) => {
      res.status(503).json({
        error: "구글 로그인이 아직 설정되지 않았습니다. 관리자에게 문의하세요."
      });
    });

    app.get("/api/auth/google/callback", (req, res) => {
      res.status(503).json({
        error: "구글 로그인이 아직 설정되지 않았습니다."
      });
    });

    return;
  }

  const domains = process.env.REPLIT_DOMAINS?.split(",") || ['localhost:5000'];
  const domain = domains[0];
  const protocol = domain.includes('replit.dev') || domain.includes('replit.app') ? 'https' : 'http';
  const callbackURL = `${protocol}://${domain}/api/auth/google/callback`;

  console.log('🔐 Google OAuth Callback URL:', callbackURL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';
          const profileImageUrl = profile.photos?.[0]?.value || '';

          const userId = `google_${profile.id}`;

          await storage.upsertUser({
            id: userId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            profileImageUrl: profileImageUrl,
            provider: 'google',
          });

          // 신규 가입 보너스 지급 (이미 받은 경우 무시됨)
          try {
            await creditService.grantSignupBonus(userId);
          } catch (bonusError) {
            console.error('가입 보너스 지급 오류:', bonusError);
          }

          // 🎁 리워드 시스템: referral 처리는 콜백에서 수행 (쿠키 접근 필요)
          // done 콜백에서 user 객체에 isNewUser 플래그 추가
          const existingUser = await storage.getUser(userId);
          const isNewUser = !existingUser?.referredBy; // referredBy가 없으면 신규

          const user = {
            id: userId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            profileImageUrl: profileImageUrl,
            provider: 'google',
            isNewUser: isNewUser,
          };

          done(null, user);
        } catch (error) {
          console.error('구글 인증 오류:', error);
          done(error as Error, undefined);
        }
      }
    )
  );

  app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/api/auth/google/callback",
    (req, res, next) => {
      passport.authenticate("google", (err: any, user: any) => {
        if (err) {
          console.error('구글 인증 콜백 오류:', err);
          return res.redirect("/archive?auth=failed");
        }

        if (!user) {
          console.error('구글 인증 실패: 사용자 없음');
          return res.redirect("/archive?auth=failed");
        }

        // 로그인 처리
        req.logIn(user, async (loginErr) => {
          if (loginErr) {
            console.error('구글 로그인 오류:', loginErr);
            return res.redirect("/archive?auth=failed");
          }

          // 🎁 리워드 시스템: referralCode 쿠키 확인 및 처리 (2025-11-28)
          try {
            if (user.isNewUser) {
              const referralCode = req.cookies?.referralCode;
              if (referralCode) {
                console.log('🎁 Referral code found:', referralCode);
                await storage.processReferralReward(referralCode, user.id);
                // 쿠키 삭제 (사용 완료)
                res.clearCookie('referralCode');
              }
            }
          } catch (refError) {
            console.error('Referral 처리 오류:', refError);
          }

          // ⚠️ 2025.11.12: 공유페이지와 100% 동일한 디자인
          res.send(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>로그인 완료</title>
              <link rel="stylesheet" href="https://hangeul.pstatic.net/maruburi/maruburi.css">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  font-family: 'MaruBuri', -apple-system, BlinkMacSystemFont, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background-color: #FFFEFA;
                  padding: 20px;
                }
                .container {
                  text-align: center;
                  max-width: 400px;
                }
                .icon-wrapper {
                  width: 5rem;
                  height: 5rem;
                  margin: 0 auto 2rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 9999px;
                  background: rgba(66, 133, 244, 0.1);
                  color: #4285F4;
                }
                h1 {
                  font-size: 1.875rem;
                  margin-bottom: 0.75rem;
                  color: #333;
                }
                p {
                  font-size: 1rem;
                  margin-bottom: 2rem;
                  color: #666;
                }
                #closeBtn {
                  display: none;
                  padding: 16px 40px;
                  font-size: 18px;
                  font-weight: 700;
                  color: white;
                  background: #4285F4;
                  border: none;
                  border-radius: 12px;
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
                  transition: all 0.3s;
                }
                #closeBtn:hover {
                  background: #3367D6;
                  transform: translateY(-2px);
                  box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4);
                }
                #closeBtn:active {
                  transform: translateY(0);
                }
                #autoCloseMsg {
                  display: none;
                  font-size: 14px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" style="width: 3rem; height: 3rem;" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h1>로그인 성공!</h1>
                <p id="message">인증이 완료되었습니다</p>
                <button id="closeBtn" onclick="closeAndReturn()" style="display:inline-block;">앱으로 돌아가기</button>
                <p id="autoCloseMsg" style="display:block;">잠시 후 자동으로 돌아갑니다...</p>
              </div>
              <script>
                // ═══════════════════════════════════════════════════════════════
                // ⚠️ 2026-03-05: 세션 유지 원칙 + 버튼 먹통 해결
                // - 절대 리다이렉트 금지 (window.location.href 사용 금지)
                // - window.close() → 실패 시 history.back() fallback
                // - 버튼 항상 표시 + onclick 직접 사용
                // ═══════════════════════════════════════════════════════════════

                function closeAndReturn() {
                  // 1. 부모 창에 인증 성공 메시지 전달
                  try {
                    if (window.opener && !window.opener.closed) {
                      window.opener.postMessage({ type: 'oauth_success' }, window.location.origin);
                    }
                  } catch(e) { console.log('postMessage 실패:', e); }

                  // 2. window.close() 시도
                  window.close();

                  // 3. close()가 실패하면 (Android WebView) history.back()으로 앱 복귀
                  setTimeout(function() {
                    history.back();
                  }, 300);

                  // 4. history.back()도 실패하면 (히스토리 없음) 메시지 표시
                  setTimeout(function() {
                    document.getElementById('autoCloseMsg').textContent = '앱으로 돌아가서 계속 사용하세요';
                  }, 1000);
                }

                // 1.5초 후 자동 닫기/복귀 시도
                setTimeout(function() {
                  closeAndReturn();
                }, 1500);
              </script>
            </body>
            </html>
          `);
        });
      })(req, res, next);
    }
  );
}
