// ⚠️ 수정금지(승인필요): 2026-04-05 네이티브 앱 Google OAuth — idToken 검증 + 세션 생성
// 기존 googleAuth.ts (웹 로그인)은 수정하지 않음 — 이 파일은 앱 전용
// 흐름: 앱 → GoogleSignin.signIn() → idToken → 이 엔드포인트 → 검증 → OTT 토큰 반환

import type { Express } from "express";
import { OAuth2Client } from "google-auth-library";
import { storage } from "./storage";
import { creditService } from "./creditService";
import { ottStore } from "./ottStore";

export function setupNativeGoogleAuth(app: Express) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();

  if (!googleClientId) {
    console.warn('⚠️ GOOGLE_CLIENT_ID 미설정 — 네이티브 Google 로그인 비활성화');
    return;
  }

  const client = new OAuth2Client(googleClientId);

  // ⚠️ 수정금지(승인필요): 앱에서 idToken을 받아 검증 후 OTT 토큰 반환
  app.post('/api/auth/google/native-token', async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ error: 'idToken 필요' });
      }

      // Google idToken 검증
      const ticket = await client.verifyIdToken({
        idToken,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.sub) {
        return res.status(401).json({ error: '토큰 검증 실패' });
      }

      // ⚠️ 수정금지(승인필요): googleAuth.ts와 동일한 upsertUser 패턴 사용
      const userId = `google_${payload.sub}`;
      const email = payload.email || '';
      const firstName = payload.given_name || '';
      const lastName = payload.family_name || '';
      const profileImageUrl = payload.picture || '';

      await storage.upsertUser({
        id: userId,
        email,
        firstName,
        lastName,
        profileImageUrl,
        provider: 'google',
      });

      // 가입 보너스
      try {
        await creditService.grantSignupBonus(userId);
      } catch (e) {
        console.error('가입 보너스 오류:', e);
      }

      // OTT 토큰 생성
      const ottToken = ottStore.create(userId);

      // 세션 로그인
      const user = { id: userId, email, firstName, lastName, profileImageUrl, provider: 'google' };
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('네이티브 Google 로그인 오류:', loginErr);
          return res.status(500).json({ error: '로그인 실패' });
        }
        res.json({ token: ottToken });
      });
    } catch (err: any) {
      console.error('[NativeGoogleAuth] 오류:', err);
      res.status(500).json({ error: err.message || '서버 오류' });
    }
  });
}
