/**
 * Profile Routes
 * 
 * 프로필 페이지 관련 API 라우트:
 * - GET /api/profile - 사용자 프로필 조회
 * - GET /api/profile/credits - 크레딧 잔액 조회
 * - GET /api/profile/transactions - 크레딧 내역 조회
 * - GET /api/profile/exchange-rate - 환율 조회
 * - POST /api/profile/checkout - 크레딧 충전 결제
 * 
 * @created 2025-11-26
 */

import { Router, Request, Response } from 'express';
import { creditService, CREDIT_CONFIG } from './creditService';
import { getEURtoKRW, convertEURtoKRW, formatKRW } from './exchangeRate';
import { getUncachableStripeClient, getStripePublishableKey } from './stripeClient';
import { storage } from './storage';

const router = Router();

function getUserId(user: any): string | null {
  if (!user) return null;
  if (typeof user === 'string') return user;
  if (user.claims?.sub) return user.claims.sub;
  if (user.id) return user.id;
  return null;
}

router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.json({
        authenticated: false,
        user: null,
        credits: 0,
        isGuest: true
      });
    }

    const user = await creditService.getUserProfile(userId);
    const balance = await creditService.getBalance(userId);
    const stats = await creditService.getUsageStats(userId);
    const canCashback = await creditService.canRequestCashback(userId);

    res.json({
      authenticated: true,
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profileImageUrl: user?.profileImageUrl,
        provider: user?.provider,
        referralCode: user?.referralCode,
      },
      credits: balance,
      stats,
      canCashback,
      isGuest: false
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/profile/credits', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.json({ credits: 0, isGuest: true });
    }

    const balance = await creditService.getBalance(userId);
    res.json({ credits: balance, isGuest: false });
  } catch (error: any) {
    console.error('Credits fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

router.get('/profile/transactions', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.json({ transactions: [], isGuest: true });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const transactions = await creditService.getTransactionHistory(userId, limit);
    
    res.json({ transactions, isGuest: false });
  } catch (error: any) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 🔒 크레딧 사용 (상세페이지/공유페이지 생성 시)
router.post('/profile/use-credits', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.', success: false });
    }

    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '올바른 크레딧 양을 입력하세요.', success: false });
    }

    const balance = await creditService.getBalance(userId);
    
    if (balance < amount) {
      return res.status(400).json({ 
        error: '크레딧이 부족합니다.', 
        success: false,
        balance,
        required: amount
      });
    }

    // 크레딧 차감
    await creditService.useCredits(userId, amount, description || 'AI 기능 사용');
    const newBalance = await creditService.getBalance(userId);

    res.json({ 
      success: true, 
      balance: newBalance,
      used: amount,
      description 
    });
  } catch (error: any) {
    console.error('Use credits error:', error);
    res.status(500).json({ error: 'Failed to use credits', success: false });
  }
});

router.get('/profile/exchange-rate', async (req: Request, res: Response) => {
  try {
    const rate = await getEURtoKRW();
    const priceKRW = await convertEURtoKRW(CREDIT_CONFIG.PRICE_EUR);
    const formattedPrice = await formatKRW(CREDIT_CONFIG.PRICE_EUR);

    res.json({
      rate,
      priceEUR: CREDIT_CONFIG.PRICE_EUR,
      krwPrice: priceKRW,
      priceKRW,
      formattedPrice,
      credits: CREDIT_CONFIG.PURCHASE_CREDITS,
    });
  } catch (error: any) {
    console.error('Exchange rate error:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

router.get('/profile/pricing', async (req: Request, res: Response) => {
  try {
    const rate = await getEURtoKRW();
    const priceKRW = await convertEURtoKRW(CREDIT_CONFIG.PRICE_EUR);

    res.json({
      plans: [
        {
          id: 'test',
          name: '테스트',
          description: '비회원',
          credits: 0,
          price: '무료',
          features: ['상세페이지 3회', '공유페이지 2회'],
          isFree: true,
        },
        {
          id: 'free',
          name: '무료체험',
          description: '신규 회원',
          credits: CREDIT_CONFIG.SIGNUP_BONUS,
          price: '무료',
          features: ['가입 즉시 지급', '상세페이지 ~17회', '공유페이지 ~7회'],
          isFree: true,
        },
        {
          id: 'standard',
          name: '일반',
          description: '충전 고객',
          credits: CREDIT_CONFIG.PURCHASE_CREDITS,
          priceEUR: CREDIT_CONFIG.PRICE_EUR,
          priceKRW,
          features: ['100 기본 + 40 보너스', '재충전 시 +20 추가'],
          isFree: false,
        },
        {
          id: 'pro',
          name: '프로',
          description: '기업/전문가',
          credits: '별도 협의',
          price: '문의',
          contactEmail: 'dbstour1@gmail.com',
          features: ['대용량 크레딧', '맞춤형 기능'],
          isFree: false,
        },
      ],
      creditCosts: {
        detailPage: CREDIT_CONFIG.DETAIL_PAGE_COST,
        sharePage: CREDIT_CONFIG.SHARE_PAGE_COST,
      },
      exchangeRate: rate,
    });
  } catch (error: any) {
    console.error('Pricing error:', error);
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

router.get('/profile/stripe-key', async (req: Request, res: Response) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (error: any) {
    console.error('Stripe key error:', error);
    res.status(500).json({ error: 'Failed to fetch Stripe key' });
  }
});

router.post('/profile/checkout', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const stripe = await getUncachableStripeClient();
    const user = await creditService.getUserProfile(userId);
    
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: '손안에 가이드 크레딧 충전',
              description: `${CREDIT_CONFIG.PURCHASE_CREDITS} 크레딧 (100 기본 + 40 보너스)`,
            },
            unit_amount: CREDIT_CONFIG.PRICE_EUR * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/profile.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/profile.html?payment=cancel`,
      customer_email: user?.email || undefined,
      metadata: {
        userId,
        credits: CREDIT_CONFIG.PURCHASE_CREDITS.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// 💳 결제 확인 및 크레딧 충전
router.post('/profile/verify-payment', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.', success: false });
    }

    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID가 필요합니다.', success: false });
    }

    const stripe = await getUncachableStripeClient();
    
    // Stripe에서 세션 정보 조회
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('💳 Verifying payment:', { 
      sessionId, 
      userId,
      paymentStatus: session.payment_status,
      metadata: session.metadata 
    });

    // 결제 완료 확인
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: '결제가 완료되지 않았습니다.', 
        success: false,
        status: session.payment_status 
      });
    }

    // 이미 처리된 결제인지 확인 (중복 방지)
    const existingTransaction = await storage.getCreditTransactionByReference(sessionId);
    if (existingTransaction) {
      console.log('⚠️ Payment already processed:', sessionId);
      const balance = await creditService.getBalance(userId);
      return res.json({ 
        success: true, 
        credits: balance,
        message: '이미 처리된 결제입니다.' 
      });
    }

    // metadata에서 크레딧 정보 확인
    const credits = parseInt(session.metadata?.credits || CREDIT_CONFIG.PURCHASE_CREDITS.toString());
    
    // 크레딧 추가
    const user = await storage.addCredits(
      userId,
      credits,
      'purchase',
      `크레딧 구매: ${credits}개 (€${CREDIT_CONFIG.PRICE_EUR})`,
      sessionId
    );

    console.log('✅ Credits added:', { userId, credits, newBalance: user.credits });

    // 추천인 킥백 처리
    await storage.processCashbackReward(CREDIT_CONFIG.PRICE_EUR * 100, userId);

    res.json({ 
      success: true, 
      credits: user.credits,
      added: credits,
      message: `${credits} 크레딧이 충전되었습니다!` 
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: '결제 확인 중 오류가 발생했습니다.', success: false });
  }
});

router.get('/profile/pages', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.json({ detailPages: [], sharePages: [], isGuest: true });
    }

    const guides = await storage.getUserGuides(userId);
    const sharePages = await storage.getUserSharedHtmlPages(userId);

    const detailPages = guides.map((g: any) => ({
      id: g.id,
      title: g.description?.slice(0, 30) || g.locationName || '상세페이지',
      thumbnail: g.imageUrl || '',
      createdAt: g.createdAt,
    }));

    const sharePagesFormatted = await Promise.all(sharePages.map(async (p: any) => {
      let thumbnail = '';
      if (p.guideIds && p.guideIds.length > 0) {
        const firstGuideId = p.guideIds[0];
        const firstGuide = await storage.getGuide(firstGuideId);
        if (firstGuide && firstGuide.imageUrl) {
          thumbnail = firstGuide.imageUrl;
        }
      }
      return {
        id: p.id,
        name: p.name || '공유 링크',
        thumbnail,
        createdAt: p.createdAt,
      };
    }));

    res.json({ detailPages, sharePages: sharePagesFormatted, isGuest: false });
  } catch (error: any) {
    console.error('Pages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

router.delete('/profile/pages/detail/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const id = req.params.id;
    await storage.deleteGuide(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete detail page error:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

router.delete('/profile/pages/share/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const id = req.params.id;
    await storage.permanentDeleteSharedHtmlPage(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete share page error:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 💰 캐시백 요청 API (2025-11-28 리워드 시스템)
// ═══════════════════════════════════════════════════════════════

// 캐시백 신청
router.post('/profile/cashback/request', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const { paymentMethod, paymentInfo } = req.body;
    
    if (!paymentMethod || !paymentInfo) {
      return res.status(400).json({ error: '결제 방법과 결제 정보를 입력해주세요.' });
    }

    const request = await storage.createCashbackRequest(userId, {
      creditsAmount: 200,
      cashAmount: 2000, // 20 EUR in cents
      paymentMethod,
      paymentInfo
    });

    res.json({ success: true, request });
  } catch (error: any) {
    console.error('Cashback request error:', error);
    res.status(400).json({ error: error.message || '캐시백 신청 실패' });
  }
});

// 내 캐시백 요청 목록
router.get('/profile/cashback/history', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const requests = await storage.getUserCashbackRequests(userId);
    res.json({ requests });
  } catch (error: any) {
    console.error('Cashback history error:', error);
    res.status(500).json({ error: '캐시백 내역 조회 실패' });
  }
});

// 추천 코드 가져오기
router.get('/profile/referral-code', async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user);
    
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const code = await storage.generateReferralCode(userId);
    res.json({ referralCode: code });
  } catch (error: any) {
    console.error('Referral code error:', error);
    res.status(500).json({ error: '추천 코드 생성 실패' });
  }
});

export default router;
