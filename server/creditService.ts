/**
 * Credit Service
 * 
 * 크레딧 관리 서비스:
 * - 잔액 조회
 * - 크레딧 충전 (구매)
 * - 크레딧 차감 (사용)
 * - 거래 내역 조회
 * 
 * @created 2025-11-26
 */

import { db } from './db';
import { users, creditTransactions } from '@shared/schema';
import { eq, desc, sql, and, like } from 'drizzle-orm';

export const CREDIT_CONFIG = {
  SIGNUP_BONUS: 35,
  PURCHASE_CREDITS: 140,
  PURCHASE_BONUS: 40,
  DETAIL_PAGE_COST: 2,
  SHARE_PAGE_COST: 5,
  REFERRAL_BONUS: 10,
  RECHARGE_BONUS: 20,
  CASHBACK_THRESHOLD: 1000,
  CASHBACK_AMOUNT: 200,
  PRICE_EUR: 10,
};

export class CreditService {
  async getBalance(userId: string): Promise<number> {
    const [user] = await db.select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, userId));
    return user?.credits ?? 0;
  }

  async getUserProfile(userId: string) {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));
    return user;
  }

  async addCredits(
    userId: string, 
    amount: number, 
    type: string, 
    description: string, 
    referenceId?: string
  ): Promise<number> {
    await db.insert(creditTransactions).values({
      userId,
      type,
      amount,
      description,
      referenceId,
    });

    const [updated] = await db.update(users)
      .set({ 
        credits: sql`COALESCE(${users.credits}, 0) + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({ credits: users.credits });

    return updated?.credits ?? 0;
  }

  async useCredits(
    userId: string, 
    amount: number, 
    description: string, 
    referenceId?: string
  ): Promise<{ success: boolean; balance: number; message?: string }> {
    const balance = await this.getBalance(userId);
    
    if (balance < amount) {
      return { 
        success: false, 
        balance, 
        message: `크레딧이 부족합니다. (필요: ${amount}, 잔액: ${balance})` 
      };
    }

    const newBalance = await this.addCredits(
      userId, 
      -amount, 
      'usage', 
      description, 
      referenceId
    );

    return { success: true, balance: newBalance };
  }

  async grantSignupBonus(userId: string): Promise<number> {
    const [existingBonus] = await db.select()
      .from(creditTransactions)
      .where(and(
        eq(creditTransactions.userId, userId),
        eq(creditTransactions.type, 'signup_bonus')
      ))
      .limit(1);

    if (existingBonus) {
      console.log(`User ${userId} already received signup bonus`);
      return await this.getBalance(userId);
    }

    return await this.addCredits(
      userId,
      CREDIT_CONFIG.SIGNUP_BONUS,
      'signup_bonus',
      '신규 가입 보너스 35 크레딧'
    );
  }

  async processPurchase(userId: string, stripePaymentId: string): Promise<number> {
    const totalCredits = CREDIT_CONFIG.PURCHASE_CREDITS;
    
    return await this.addCredits(
      userId,
      totalCredits,
      'purchase',
      `크레딧 충전 ${totalCredits} (100 기본 + 40 보너스)`,
      stripePaymentId
    );
  }

  async processReferralBonus(referrerId: string, newUserId: string): Promise<number> {
    return await this.addCredits(
      referrerId,
      CREDIT_CONFIG.REFERRAL_BONUS,
      'referral_bonus',
      '친구 추천 보너스 10 크레딧',
      newUserId
    );
  }

  async getTransactionHistory(userId: string, limit: number = 20): Promise<any[]> {
    const transactions = await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);

    // 현재 잔액에서 역순으로 balance 계산
    const currentBalance = await this.getBalance(userId);
    let runningBalance = currentBalance;
    
    // 최신순으로 정렬되어 있으므로, 최신 거래의 balance는 currentBalance
    // 그 이전 거래의 balance는 해당 거래 amount를 빼서 계산
    const transactionsWithBalance = transactions.map((tx, index) => {
      const balance = runningBalance;
      // 다음 (더 오래된) 거래의 balance 계산을 위해 현재 거래 amount 차감
      runningBalance = runningBalance - tx.amount;
      return { ...tx, balance };
    });

    return transactionsWithBalance;
  }

  async getUsageStats(userId: string): Promise<{ detailPages: number; sharePages: number }> {
    const detailResult = await db.select({ count: sql<number>`count(*)` })
      .from(creditTransactions)
      .where(and(
        eq(creditTransactions.userId, userId),
        like(creditTransactions.description, '%상세페이지%')
      ));

    const shareResult = await db.select({ count: sql<number>`count(*)` })
      .from(creditTransactions)
      .where(and(
        eq(creditTransactions.userId, userId),
        like(creditTransactions.description, '%공유페이지%')
      ));

    return {
      detailPages: Number(detailResult[0]?.count || 0),
      sharePages: Number(shareResult[0]?.count || 0),
    };
  }

  async canRequestCashback(userId: string): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= CREDIT_CONFIG.CASHBACK_THRESHOLD;
  }
}

export const creditService = new CreditService();
