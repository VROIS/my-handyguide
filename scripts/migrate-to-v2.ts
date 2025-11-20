// ═══════════════════════════════════════════════════════════════
// 🔄 공유페이지 v1 → v2 마이그레이션 스크립트
// ═══════════════════════════════════════════════════════════════
// 목적: 기존 v1 인라인 HTML을 v2 외부 CSS/JS 템플릿으로 변환
// V2 표준 로직:
//   1. 카카오톡 경고 제거 (범용 브라우저 지원)
//   2. X 버튼 항상 표시 (외부 링크에서도)
// ═══════════════════════════════════════════════════════════════

import { db } from '../server/db';
import { sharedHtmlPages } from '../shared/schema';
import { generateShareHtmlV2 } from '../server/html-template';
import * as fs from 'fs';
import * as path from 'path';

interface ShareItem {
  id: string;
  title: string;
  description: string;
  imageBase64: string;
  location?: string;
  locationName?: string;
}

async function migrateToV2() {
  console.log('🔄 공유페이지 v1 → v2 마이그레이션 시작...\n');
  
  try {
    // 1. 모든 공유페이지 조회
    const allPages = await db.select().from(sharedHtmlPages);
    console.log(`📊 총 ${allPages.length}개 공유페이지 발견\n`);
    
    let v1Count = 0;
    let v2Count = 0;
    let errorCount = 0;
    let migratedCount = 0;
    
    for (const page of allPages) {
      // htmlFilePath가 null인 경우 스킵
      if (!page.htmlFilePath) {
        console.log(`⚠️ [${page.id}] htmlFilePath가 null - 스킵`);
        errorCount++;
        continue;
      }
      
      const htmlPath = path.join(process.cwd(), 'public', page.htmlFilePath);
      
      try {
        // 2. HTML 파일 존재 확인
        if (!fs.existsSync(htmlPath)) {
          console.log(`⚠️ [${page.id}] HTML 파일 없음: ${htmlPath}`);
          errorCount++;
          continue;
        }
        
        // 3. HTML 파일 읽기
        const oldHtml = fs.readFileSync(htmlPath, 'utf8');
        
        // 4. v1 또는 v2 패턴 감지
        const isV1 = oldHtml.includes('<script id="app-data"');
        const isV2 = oldHtml.includes('/shared-template/v2.css');
        
        if (isV2) {
          console.log(`🔄 [${page.id}] v2 템플릿 재생성 (카카오톡 경고 제거 적용)`);
          v2Count++;
        } else if (isV1) {
          console.log(`🔧 [${page.id}] v1 → v2 마이그레이션 시작...`);
          v1Count++;
        } else {
          console.log(`❓ [${page.id}] 알 수 없는 형식 - 스킵`);
          errorCount++;
          continue;
        }
        
        // 5. 데이터 파싱 (v1 템플릿에서 JSON 추출)
        const dataMatch = oldHtml.match(/<script id="app-data"[^>]*>([\s\S]*?)<\/script>/);
        if (!dataMatch) {
          console.log(`❌ [${page.id}] app-data 스크립트를 찾을 수 없음`);
          errorCount++;
          continue;
        }
        
        let appData: ShareItem[];
        try {
          appData = JSON.parse(dataMatch[1].trim());
        } catch (e) {
          console.log(`❌ [${page.id}] JSON 파싱 실패:`, e);
          errorCount++;
          continue;
        }
        
        // 6. 메타데이터 추출 (헤더에서)
        const titleMatch = oldHtml.match(/<title>(.*?) - 손안에 가이드<\/title>/);
        const senderMatch = oldHtml.match(/👤 (.*?) 님이 보냄/);
        const locationMatch = oldHtml.match(/📍 ([^<]+)/);
        const dateMatch = oldHtml.match(/📅 ([^<]+)/);
        
        const title = titleMatch ? titleMatch[1] : page.name;
        const sender = senderMatch ? senderMatch[1] : '여행자';
        const location = locationMatch ? locationMatch[1] : '';
        const createdAt = page.createdAt || new Date().toISOString();
        
        // 7. v2 템플릿으로 재생성
        const newHtml = generateShareHtmlV2({
          title,
          items: appData.map((item, index) => ({
            id: item.id || String(index),
            title: `가이드 ${index + 1}`,
            description: item.description,
            imageBase64: item.imageDataUrl?.replace('data:image/jpeg;base64,', '') || item.imageBase64 || '',
            locationName: item.locationName
          })),
          createdAt,
          location,
          sender,
          includeAudio: false, // v1에서 음성 기능 확인 필요 시 수정
          isFeatured: page.featured
        });
        
        // 8. 파일 덮어쓰기
        fs.writeFileSync(htmlPath, newHtml, 'utf8');
        console.log(`✅ [${page.id}] 마이그레이션 완료! (${appData.length}개 아이템)`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ [${page.id}] 오류:`, error);
        errorCount++;
      }
    }
    
    // 9. 결과 요약
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 마이그레이션 결과 요약:');
    console.log(`   - 총 페이지: ${allPages.length}개`);
    console.log(`   - v1 발견: ${v1Count}개`);
    console.log(`   - v2 이미 완료: ${v2Count}개`);
    console.log(`   - 마이그레이션 성공: ${migratedCount}개`);
    console.log(`   - 오류: ${errorCount}개`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (migratedCount > 0) {
      console.log('✅ V2 표준 로직 적용 완료:');
      console.log('   1. ❌ 카카오톡 경고 제거');
      console.log('   2. ✅ X 버튼 항상 표시\n');
    }
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
migrateToV2()
  .then(() => {
    console.log('🎉 마이그레이션 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 치명적 오류:', error);
    process.exit(1);
  });
