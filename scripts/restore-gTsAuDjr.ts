import { db } from '../server/db';
import { guides } from '../shared/schema';
import * as fs from 'fs';
import * as path from 'path';

async function restoreGTsAuDjr() {
  console.log('🔄 gTsAuDjr 복구 시작...\n');
  
  // 1. JSON 파일에서 데이터 로드
  const guidesData = JSON.parse(fs.readFileSync('/tmp/gTsAuDjr-guides.json', 'utf-8'));
  console.log(`📦 ${guidesData.length}개 가이드 로드 완료\n`);
  
  const savedIds: string[] = [];
  
  for (const guideItem of guidesData) {
    try {
      const { localId, title, description, imageDataUrl, locationName, aiGeneratedContent } = guideItem;
      
      // Base64 → 파일 저장
      let imageUrl = '';
      if (imageDataUrl && imageDataUrl.startsWith('data:image/')) {
        const base64Match = imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
        if (base64Match) {
          const [, imageType, base64Data] = base64Match;
          const imageExtension = imageType === 'jpeg' ? 'jpg' : imageType;
          const imageName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageExtension}`;
          const imagePath = path.join('uploads', imageName);
          
          const imageBuffer = Buffer.from(base64Data, 'base64');
          fs.writeFileSync(imagePath, imageBuffer);
          
          imageUrl = `/uploads/${imageName}`;
          console.log(`✅ 이미지 저장: ${imageName}`);
        }
      }
      
      // guides DB 저장
      const [savedGuide] = await db.insert(guides).values({
        userId: 'temp-user-id',
        localId,
        title,
        description,
        imageUrl,
        latitude: null,
        longitude: null,
        locationName,
        aiGeneratedContent,
        language: 'ko'
      }).returning();
      
      savedIds.push(savedGuide.id);
      console.log(`✅ guides DB 저장: ${savedGuide.id} (${title})`);
      
    } catch (error) {
      console.error(`❌ 저장 실패:`, error);
    }
  }
  
  console.log(`\n✅ 총 ${savedIds.length}/${guidesData.length}개 저장 완료`);
  console.log('\n📋 저장된 UUID:');
  console.log(JSON.stringify(savedIds, null, 2));
  
  return savedIds;
}

restoreGTsAuDjr()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ 복구 실패:', error);
    process.exit(1);
  });
