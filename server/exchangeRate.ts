/**
 * Exchange Rate Service
 * 
 * Frankfurter API를 사용한 EUR → KRW 실시간 환율 조회
 * - 무료 API, 키 불필요
 * - European Central Bank 데이터 기반
 * 
 * @created 2025-11-26
 */

interface ExchangeRateCache {
  rate: number;
  timestamp: number;
}

let cache: ExchangeRateCache | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간 캐시

export async function getEURtoKRW(): Promise<number> {
  const now = Date.now();
  
  if (cache && (now - cache.timestamp) < CACHE_DURATION) {
    return cache.rate;
  }

  try {
    const response = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=KRW');
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.rates.KRW;
    
    cache = {
      rate,
      timestamp: now
    };
    
    console.log(`📈 Exchange rate updated: 1 EUR = ${rate} KRW`);
    return rate;
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    return cache?.rate || 1500;
  }
}

export async function convertEURtoKRW(eurAmount: number): Promise<number> {
  const rate = await getEURtoKRW();
  return Math.round(eurAmount * rate);
}

export async function formatKRW(eurAmount: number): Promise<string> {
  const krwAmount = await convertEURtoKRW(eurAmount);
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(krwAmount);
}
