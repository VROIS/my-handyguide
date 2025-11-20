// ═══════════════════════════════════════════════════════════════
// 🔄 모든 공유페이지 재생성 스크립트
// ═══════════════════════════════════════════════════════════════
// 목적: DB에서 가이드 데이터를 다시 불러와 v2 템플릿으로 재생성
// ═══════════════════════════════════════════════════════════════

import { db } from '../server/db';
import { sharedHtmlPages, guides } from '../shared/schema';
import { generateShareHtmlV2 } from '../server/html-template';
import { eq, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function regenerateAllShares() {
  console.log('🔄 모든 공유페이지 재생성 시작...\n');
  
  try {
    // 1. htmlFilePath가 있는 모든 공유페이지 조회
    const allPages = await db
      .select()
      .from(sharedHtmlPages)
      .where(eq(sharedHtmlPages.htmlFilePath, sharedHtmlPages.htmlFilePath));
    
    console.log(`📊 총 ${allPages.length}개 공유페이지 발견\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const page of allPages) {
      if (!page.htmlFilePath || !page.guideIds || page.guideIds.length === 0) {
        console.log(`⚠️ [${page.id}] 데이터 없음 - 스킵`);
        errorCount++;
        continue;
      }
      
      try {
        console.log(`🔧 [${page.id}] 재생성 중... (가이드 ${page.guideIds.length}개)`);
        
        // 2. 가이드 데이터 조회
        const guideList = await db
          .select()
          .from(guides)
          .where(inArray(guides.id, page.guideIds));
        
        if (guideList.length === 0) {
          console.log(`⚠️ [${page.id}] 가이드 데이터 없음 - 스킵`);
          errorCount++;
          continue;
        }
        
        // 3. 이미지를 Base64로 변환
        const guidesWithBase64 = guideList.map(guide => {
          const imageBase64 = guide.imageData 
            ? Buffer.from(guide.imageData).toString('base64')
            : '';
          
          return {
            id: guide.id,
            title: guide.title || '가이드',
            description: guide.content || '',
            imageBase64,
            location: guide.location || undefined,
            locationName: guide.locationName || undefined
          };
        });
        
        // 4. v2 HTML 생성
        const htmlContent = generateShareHtmlV2({
          title: page.name,
          items: guidesWithBase64,
          createdAt: page.createdAt?.toISOString() || new Date().toISOString(),
          location: (page.includeLocation || false) && guidesWithBase64[0]?.location 
            ? guidesWithBase64[0].location 
            : undefined,
          includeAudio: page.includeAudio || false,
          isFeatured: page.featured || false
        });
        
        // 5. 파일 저장
        const htmlPath = path.join(process.cwd(), 'public', page.htmlFilePath);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        
        console.log(`✅ [${page.id}] 재생성 완료! (${guideList.length}개 아이템)`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ [${page.id}] 오류:`, error);
        errorCount++;
      }
    }
    
    // 6. 결과 요약
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 재생성 결과 요약:');
    console.log(`   - 총 페이지: ${allPages.length}개`);
    console.log(`   - 재생성 성공: ${successCount}개`);
    console.log(`   - 오류: ${errorCount}개`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (successCount > 0) {
      console.log('✅ V2 표준 로직 적용 완료:');
      console.log('   1. ❌ 카카오톡 경고 제거');
      console.log('   2. ✅ X 버튼 항상 표시\n');
    }
    
  } catch (error) {
    console.error('❌ 재생성 실패:', error);
    process.exit(1);
  }
}

// 실행
regenerateAllShares()
  .then(() => {
    console.log('🎉 재생성 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 치명적 오류:', error);
    process.exit(1);
  });
