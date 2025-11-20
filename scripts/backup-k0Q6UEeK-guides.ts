import { db } from '../server/db';
import { guides } from '../shared/schema';
import fs from 'fs';
import { eq } from 'drizzle-orm';

const html = fs.readFileSync('public/shared/k0Q6UEeK.html', 'utf8');
const pageId = 'k0Q6UEeK';
const userId = 'kakao_4511307810'; // k0Q6UEeK의 실제 user_id

console.log('=== k0Q6UEeK guides 백업 중 ===\n');

// app-data 추출
const appDataMatch = html.match(/<script id="app-data" type="application\/json">([\s\S]*?)<\/script>/);

if (!appDataMatch) {
  console.error('❌ app-data를 찾을 수 없음');
  process.exit(1);
}

const appData = JSON.parse(appDataMatch[1]);
console.log('추출된 guides:', appData.length);

// DB에 저장
let saved = 0;
let updated = 0;
for (const item of appData) {
  const guideId = `k0q6ueek-${item.id}`;
  
  // 기존 guide 확인
  const existing = await db.select().from(guides).where(eq(guides.id, guideId));
  
  if (existing.length > 0) {
    console.log(`⏭️  Guide ${guideId} 이미 존재, 업데이트`);
    await db.update(guides)
      .set({
        description: item.description,
        imageUrl: item.imageDataUrl,
        locationName: item.locationName || '파리',
        updatedAt: new Date()
      })
      .where(eq(guides.id, guideId));
    updated++;
  } else {
    await db.insert(guides).values({
      id: guideId,
      userId: userId,
      title: item.description ? item.description.substring(0, 50) + '...' : `가이드 ${item.id + 1}`,
      description: item.description || '',
      imageUrl: item.imageDataUrl,
      latitude: null,
      longitude: null,
      locationName: item.locationName || '파리',
      aiGeneratedContent: item.description || '',
      viewCount: 0,
      language: 'ko',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Guide ${guideId} 저장 완료`);
    saved++;
  }
}

console.log(`\n✅ 새로 저장: ${saved}개, 업데이트: ${updated}개`);
