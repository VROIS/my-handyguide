import { db } from '../server/db';
import { guides, sharedHtmlPages } from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { generateStandardShareHTML } from '../server/standard-template';

async function testStandardTemplate() {
  console.log('🧪 표준 템플릿 테스트 시작...\n');

  // 1. 최근 가이드 3개 가져오기
  const recentGuides = await db
    .select()
    .from(guides)
    .orderBy(guides.createdAt)
    .limit(3);

  if (recentGuides.length === 0) {
    console.error('❌ 테스트할 가이드가 없습니다.');
    return;
  }

  console.log(`✅ 테스트할 가이드: ${recentGuides.length}개`);
  recentGuides.forEach((guide, i) => {
    console.log(`  ${i + 1}. ${guide.title?.slice(0, 50)}...`);
  });

  // 2. 표준 템플릿 HTML 생성
  const guideItems = recentGuides.map(guide => ({
    imageUrl: guide.imagePath || '',
    description: guide.description || '',
    latitude: guide.latitude || '',
    longitude: guide.longitude || '',
    locationName: guide.locationName || '',
  }));

  const testHtml = generateStandardShareHTML({
    title: '테스트 공유 페이지',
    sender: '테스트 사용자',
    location: '파리, 프랑스',
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
    guideItems,
    appOrigin: 'http://localhost:5000',
  });

  // 3. HTML 파일 저장
  const testFilePath = path.join(process.cwd(), 'public', 'shared', 'TEST_TEMPLATE.html');
  fs.writeFileSync(testFilePath, testHtml, 'utf8');
  console.log(`\n✅ 테스트 HTML 파일 생성: ${testFilePath}`);

  // 4. 검증
  const hasTailwind = testHtml.includes('cdn.tailwindcss.com');
  const hasHeami = testHtml.includes('Microsoft Heami');
  const hasPureCssGrid = testHtml.includes('display: grid') && testHtml.includes('grid-template-columns: repeat(2, 1fr)');
  const hasResponsiveGrid = testHtml.includes('grid-template-columns: repeat(3, 1fr)') && testHtml.includes('@media (min-width: 768px)');

  console.log('\n🔍 검증 결과:');
  console.log(`  ${hasTailwind ? '❌' : '✅'} Tailwind CDN 사용: ${hasTailwind ? 'YES (실패!)' : 'NO (성공!)'}`);
  console.log(`  ${hasHeami ? '✅' : '❌'} Microsoft Heami 사용: ${hasHeami ? 'YES (성공!)' : 'NO (실패!)'}`);
  console.log(`  ${hasPureCssGrid ? '✅' : '❌'} 순수 CSS Grid (2-column): ${hasPureCssGrid ? 'YES (성공!)' : 'NO (실패!)'}`);
  console.log(`  ${hasResponsiveGrid ? '✅' : '❌'} 반응형 Grid (3-column): ${hasResponsiveGrid ? 'YES (성공!)' : 'NO (실패!)'}`);

  if (!hasTailwind && hasHeami && hasPureCssGrid && hasResponsiveGrid) {
    console.log('\n🎉 표준 템플릿 테스트 성공!');
    console.log(`   브라우저에서 확인: http://localhost:5000/shared/TEST_TEMPLATE.html`);
  } else {
    console.log('\n❌ 표준 템플릿 테스트 실패!');
  }
}

testStandardTemplate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ 테스트 오류:', error);
    process.exit(1);
  });
