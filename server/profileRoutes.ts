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
              name: '내손가이드 크레딧 충전',
              description: `${CREDIT_CONFIG.PURCHASE_CREDITS} 크레딧 (100 기본 + 40 보너스)`,
            },
            unit_amount: CREDIT_CONFIG.PRICE_EUR * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/profile.html?payment=success`,
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
      thumbnail: g.imageUrl?.slice(0, 100),
      createdAt: g.createdAt,
    }));

    const sharePagesFormatted = sharePages.map((p: any) => ({
      id: p.id,
      name: p.name || '공유 링크',
      createdAt: p.createdAt,
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

export default router;
