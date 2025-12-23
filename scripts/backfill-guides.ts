/**
 * ═══════════════════════════════════════════════════════════════
 * 📦 기존 공유 페이지 → guides 테이블 백업 스크립트
 * ═══════════════════════════════════════════════════════════════
 * 
 * 목적: 기존 공유 페이지의 가이드 데이터를 guides 테이블에 백업
 * 
 * 배경:
 * - 기존: 가이드 데이터가 HTML 파일에만 Base64로 저장됨
 * - 문제: HTML 손상 시 데이터 복구 불가능
 * - 해결: guides 테이블에 백업 저장 (하이브리드 방식)
 * 
 * 실행 방법:
 * ```bash
 * tsx scripts/backfill-guides.ts
 * ```
 * 
 * ⚠️ 안전 장치:
 * - dry-run 모드 지원 (EXEC=1 환경변수로 실제 실행)
 * - 중복 방지 (onConflictDoUpdate)
 * - 에러 발생 시 계속 진행 (다른 페이지에 영향 없음)
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from "../server/db";
import { sharedHtmlPages, guides } from "../shared/schema";
import { parseGuidesFromHtml } from "../server/html-parser";
import fs from "fs";
import path from "path";

const DRY_RUN = process.env.EXEC !== '1';

async function backfillGuides() {
  console.log('🚀 기존 공유 페이지 → guides 테이블 백업 시작...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY-RUN 모드: 실제 저장하지 않음');
    console.log('⚠️  실제 실행: EXEC=1 tsx scripts/backfill-guides.ts\n');
  } else {
    console.log('✅ 실행 모드: DB에 저장됨\n');
  }
  
  // 모든 공유 페이지 조회
  const allPages = await db.select().from(sharedHtmlPages);
  console.log(`📋 총 ${allPages.length}개 공유 페이지 발견\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let totalGuidesBackedUp = 0;
  
  for (const page of allPages) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 처리 중: ${page.name} (ID: ${page.id})`);
    console.log(`   guideIds: ${page.guideIds.length}개`);
    
    try {
      // HTML 파일 경로
      let htmlContent: string | null = null;
      
      // 1. htmlFilePath에서 로드 시도
      if (page.htmlFilePath) {
        const htmlPath = path.join(process.cwd(), 'public', page.htmlFilePath);
        if (fs.existsSync(htmlPath)) {
          htmlContent = fs.readFileSync(htmlPath, 'utf-8');
          console.log(`   ✅ HTML 파일 로드: ${page.htmlFilePath}`);
        } else {
          console.log(`   ⚠️  HTML 파일 없음: ${page.htmlFilePath}`);
        }
      }
      
      // 2. DB의 htmlContent fallback
      if (!htmlContent && page.htmlContent) {
        htmlContent = page.htmlContent;
        console.log(`   ✅ DB에서 HTML 로드 (fallback)`);
      }
      
      if (!htmlContent) {
        console.log(`   ❌ HTML 콘텐츠를 찾을 수 없음 - SKIP`);
        skipCount++;
        continue;
      }
      
      // HTML 파싱
      const parsedGuides = parseGuidesFromHtml(htmlContent, {
        userId: page.userId,
        guideIds: page.guideIds,
        location: page.location ?? undefined,
        createdAt: page.createdAt || new Date()
      });
      
      if (parsedGuides.length === 0) {
        console.log(`   ⚠️  가이드 데이터 추출 실패 - SKIP`);
        skipCount++;
        continue;
      }
      
      console.log(`   📦 ${parsedGuides.length}개 가이드 추출 완료`);
      
      if (!DRY_RUN) {
        // DB에 저장
        for (const guide of parsedGuides) {
          await db
            .insert(guides)
            .values({
              ...guide,
              id: guide.id
            } as any)
            .onConflictDoUpdate({
              target: guides.id,
              set: {
                title: guide.title,
                description: guide.description,
                imageUrl: guide.imageUrl,
                locationName: guide.locationName,
                aiGeneratedContent: guide.aiGeneratedContent,
                updatedAt: new Date()
              }
            });
        }
        console.log(`   ✅ DB 저장 완료: ${parsedGuides.length}개`);
      } else {
        console.log(`   🔸 DRY-RUN: ${parsedGuides.length}개 저장 예정`);
      }
      
      successCount++;
      totalGuidesBackedUp += parsedGuides.length;
      
    } catch (error) {
      console.error(`   ❌ 오류 발생:`, error);
      errorCount++;
    }
  }
  
  // 최종 결과
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 백업 완료 통계:');
  console.log(`   ✅ 성공: ${successCount}개`);
  console.log(`   ⚠️  건너뜀: ${skipCount}개`);
  console.log(`   ❌ 실패: ${errorCount}개`);
  console.log(`   📦 총 가이드: ${totalGuidesBackedUp}개`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (DRY_RUN) {
    console.log('💡 실제 실행: EXEC=1 tsx scripts/backfill-guides.ts');
  } else {
    console.log('✅ 백업 완료!');
  }
}

// 실행
backfillGuides()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 스크립트 실행 실패:', error);
    process.exit(1);
  });
