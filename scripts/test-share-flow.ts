import { db } from '../server/db';
import { guides } from '../shared/schema';
import { desc } from 'drizzle-orm';
import { storage } from '../server/storage';
import fs from 'fs';
import path from 'path';

async function testShareFlow() {
  console.log('🧪 공유 페이지 생성 플로우 테스트 시작...\n');

  // 1. guides DB에서 최근 가이드 3개 조회
  console.log('📦 Step 1: guides DB에서 가이드 조회');
  const recentGuides = await db
    .select()
    .from(guides)
    .orderBy(desc(guides.createdAt))
    .limit(3);

  if (recentGuides.length === 0) {
    console.error('❌ 테스트할 가이드가 없습니다.');
    return;
  }

  const guideIds = recentGuides.map(g => g.id);
  console.log(`✅ 가이드 ${guideIds.length}개 조회 완료: ${guideIds.join(', ')}\n`);

  // 2. buildSharePageFromGuides 호출
  console.log('📦 Step 2: 표준 템플릿 HTML 생성');
  const appOrigin = 'http://localhost:5000';
  const metadata = {
    title: '테스트 공유 페이지 (통합 테스트)',
    sender: '테스트 사용자',
    location: '파리, 프랑스',
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
    appOrigin,
  };

  const html = await storage.buildSharePageFromGuides(guideIds, metadata);
  console.log(`✅ HTML 생성 완료 (${html.length} bytes)\n`);

  // 3. HTML 파일 저장 (수동)
  console.log('📦 Step 3: HTML 파일 저장');
  const testId = 'TEST_SHARE_' + Date.now();
  const testFilePath = path.join(process.cwd(), 'public', 'shared', `${testId}.html`);
  fs.writeFileSync(testFilePath, html, 'utf8');
  console.log(`✅ 테스트 HTML 파일 생성: ${testFilePath}\n`);

  // 4. createSharedHtmlPage 호출
  console.log('📦 Step 4: shared_html_pages DB에 저장');
  try {
    const sharedPage = await storage.createSharedHtmlPage('test-user-id', {
      name: '테스트 공유 페이지 (통합 테스트)',
      htmlContent: html,
      guideIds: guideIds,
      sender: metadata.sender,
      location: metadata.location,
      date: metadata.date,
    });
    console.log(`✅ shared_html_pages DB 저장 완료: /s/${sharedPage.id}\n`);

    // 5. 검증
    console.log('📦 Step 5: 생성된 HTML 검증');
    const savedHtmlPath = path.join(process.cwd(), 'public', 'shared', `${sharedPage.id}.html`);
    const savedHtml = fs.readFileSync(savedHtmlPath, 'utf8');

    const hasTailwind = savedHtml.includes('cdn.tailwindcss.com');
    const hasHeami = savedHtml.includes('Microsoft Heami');
    const hasPureCssGrid = savedHtml.includes('display: grid') && savedHtml.includes('grid-template-columns: repeat(2, 1fr)');
    const hasResponsiveGrid = savedHtml.includes('grid-template-columns: repeat(3, 1fr)') && savedHtml.includes('@media (min-width: 768px)');

    console.log('🔍 검증 결과:');
    console.log(`  ${hasTailwind ? '❌' : '✅'} Tailwind CDN 사용: ${hasTailwind ? 'YES (실패!)' : 'NO (성공!)'}`);
    console.log(`  ${hasHeami ? '✅' : '❌'} Microsoft Heami 사용: ${hasHeami ? 'YES (성공!)' : 'NO (실패!)'}`);
    console.log(`  ${hasPureCssGrid ? '✅' : '❌'} 순수 CSS Grid (2-column): ${hasPureCssGrid ? 'YES (성공!)' : 'NO (실패!)'}`);
    console.log(`  ${hasResponsiveGrid ? '✅' : '❌'} 반응형 Grid (3-column): ${hasResponsiveGrid ? 'YES (성공!)' : 'NO (실패!)'}`);

    if (!hasTailwind && hasHeami && hasPureCssGrid && hasResponsiveGrid) {
      console.log('\n🎉 공유 페이지 생성 플로우 테스트 성공!');
      console.log(`   브라우저에서 확인: http://localhost:5000/s/${sharedPage.id}`);
      console.log(`   또는: http://localhost:5000/shared/${sharedPage.id}.html`);
    } else {
      console.log('\n❌ 공유 페이지 생성 플로우 테스트 실패!');
    }

  } catch (error) {
    console.error('❌ createSharedHtmlPage 오류:', error);
  }
}

testShareFlow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ 테스트 오류:', error);
    process.exit(1);
  });
