/**
 * 🔄 기존 공유 페이지를 표준 템플릿으로 마이그레이션
 * 
 * 목적: public/shared/*.html 파일들을 새로운 표준 템플릿으로 자동 변환
 * 
 * 실행: npx tsx scripts/migrate-to-standard-template.ts
 */

import { db } from '../server/db';
import { sharedHtmlPages, guides, users } from '../shared/schema';
import { eq, isNull, or, inArray } from 'drizzle-orm';
import { generateStandardShareHTML, type StandardTemplateData, type GuideItem } from '../server/standard-template';
import fs from 'fs';
import path from 'path';

async function migrateAllPages() {
  console.log('🔄 표준 템플릿 마이그레이션 시작...\n');
  
  // 1. 모든 활성화된 공유 페이지 조회
  const pages = await db
    .select()
    .from(sharedHtmlPages)
    .where(eq(sharedHtmlPages.isActive, true));
  
  console.log(`📦 총 ${pages.length}개 페이지 발견\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const page of pages) {
    try {
      console.log(`\n📄 처리 중: ${page.id} (${page.name})`);
      
      // 2. guide_ids (이미 배열로 저장됨)
      const guideIds: string[] = page.guideIds || [];
      
      if (guideIds.length === 0) {
        console.log(`  ⚠️ guideIds가 비어있음 - 건너뛰기`);
        failCount++;
        continue;
      }
      
      console.log(`  📦 ${guideIds.length}개 가이드 ID:`, guideIds);
      
      // 3. guides DB에서 데이터 조회
      const guidesData = await db
        .select()
        .from(guides)
        .where(or(
          inArray(guides.id, guideIds),
          inArray(guides.localId, guideIds)
        ));
      
      console.log(`  ✅ guides DB 조회: ${guidesData.length}개 발견`);
      
      if (guidesData.length === 0) {
        console.log(`  ⚠️ 가이드 데이터 없음 - 건너뛰기`);
        failCount++;
        continue;
      }
      
      // 4. GuideItem[] 변환
      const guideItems: GuideItem[] = guidesData.map((guide) => ({
        imageDataUrl: guide.imageUrl || '',
        description: guide.description || guide.aiGeneratedContent || ''
      }));
      
      // 5. 순서 유지
      const orderedGuideItems = guideIds
        .map(id => {
          const guide = guidesData.find(g => g.id === id || g.localId === id);
          if (!guide) return null;
          return {
            imageDataUrl: guide.imageUrl || '',
            description: guide.description || guide.aiGeneratedContent || ''
          };
        })
        .filter((item): item is GuideItem => item !== null);
      
      // 6. 메타데이터 구성 (동적)
      // 사용자 정보 조회
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, page.userId))
        .limit(1);
      
      // 실시간 메타데이터 생성
      const senderName = user 
        ? `${user.firstName} ${user.lastName}`.trim() 
        : '익명';
      
      const locationName = guidesData.find(g => g.locationName)?.locationName 
        || page.location 
        || '위치 정보 없음';
      
      const dateFormatted = page.createdAt
        ? page.createdAt.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : new Date().toLocaleDateString('ko-KR');
      
      const metadata = {
        title: page.name || '제목 없음',
        sender: senderName,
        location: locationName,
        date: dateFormatted,
        appOrigin: '/'
      };
      
      // 7. 표준 템플릿 HTML 생성
      const templateData: StandardTemplateData = {
        ...metadata,
        guideItems: orderedGuideItems
      };
      
      const newHtml = generateStandardShareHTML(templateData);
      
      // 8. HTML 파일 저장 (있을 경우)
      if (page.htmlFilePath) {
        const htmlFilePath = path.join(process.cwd(), 'public', page.htmlFilePath);
        fs.writeFileSync(htmlFilePath, newHtml, 'utf-8');
        console.log(`  💾 HTML 파일 저장: ${page.htmlFilePath}`);
      }
      
      // 9. DB 업데이트
      await db
        .update(sharedHtmlPages)
        .set({
          htmlContent: newHtml,
          templateVersion: 'v2-standard',
          updatedAt: new Date()
        })
        .where(eq(sharedHtmlPages.id, page.id));
      
      console.log(`  ✅ 마이그레이션 완료: ${page.id}`);
      successCount++;
      
    } catch (error) {
      console.error(`  ❌ 실패: ${page.id}`, error);
      failCount++;
    }
  }
  
  console.log(`\n\n📊 마이그레이션 결과:`);
  console.log(`  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failCount}개`);
  console.log(`  📦 전체: ${pages.length}개\n`);
}

migrateAllPages()
  .then(() => {
    console.log('✅ 마이그레이션 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  });
