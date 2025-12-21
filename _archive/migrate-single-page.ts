import { db } from "../server/db";
import { sharedHtmlPages, guides } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";
import { generateShareHtml } from "../server/html-template";
import fs from "fs";
import path from "path";

const shareId = process.argv[2];

if (!shareId) {
  console.error("❌ 사용법: tsx scripts/migrate-single-page.ts <shareId>");
  process.exit(1);
}

async function migrateSinglePage(id: string) {
  console.log(`🔄 페이지 마이그레이션 시작: ${id}`);
  
  // 1. 페이지 정보 가져오기
  const [page] = await db
    .select()
    .from(sharedHtmlPages)
    .where(eq(sharedHtmlPages.id, id));
  
  if (!page) {
    console.error(`❌ 페이지를 찾을 수 없습니다: ${id}`);
    return;
  }
  
  console.log(`📄 페이지 발견: ${page.name} (${page.guideIds?.length || 0}개 가이드)`);
  
  // 2. 가이드 데이터 가져오기
  const guidesData = page.guideIds && page.guideIds.length > 0
    ? await db.select().from(guides).where(inArray(guides.id, page.guideIds))
    : [];
  
  if (guidesData.length === 0) {
    console.warn(`⚠️ 가이드 데이터 없음, HTML 백업에서 복원 필요`);
    // HTML 파싱 로직은 나중에 추가
    return;
  }
  
  // 3. 표준 템플릿 데이터 구조 생성
  const shareItems = guidesData.map(g => ({
    id: g.id,
    title: g.title || '',
    description: g.aiGeneratedContent || g.description || '',
    imageBase64: g.imageUrl?.replace(/^data:image\/[^;]+;base64,/, '') || '',
    locationName: g.locationName || undefined
  }));
  
  // 4. 표준 템플릿으로 HTML 생성 (476줄, Gemini Blue)
  const newHtml = generateShareHtml({
    title: page.name,
    items: shareItems,
    createdAt: page.date || page.createdAt?.toISOString() || new Date().toISOString(),
    location: page.location || undefined,
    sender: page.sender || undefined,
    includeAudio: true // 기본적으로 음성 기능 활성화
  });
  
  // 5. HTML 파일 저장
  const htmlPath = path.join(process.cwd(), 'public', 'shared', `${id}.html`);
  fs.writeFileSync(htmlPath, newHtml, 'utf8');
  
  // 6. DB 업데이트
  await db
    .update(sharedHtmlPages)
    .set({
      htmlContent: newHtml,
      htmlFilePath: `/shared/${id}.html`,
      templateVersion: 'v2',
      updatedAt: new Date()
    })
    .where(eq(sharedHtmlPages.id, id));
  
  console.log(`✅ 마이그레이션 완료!`);
  console.log(`   - HTML 저장: ${htmlPath}`);
  console.log(`   - 템플릿: v2 (476줄, Gemini Blue, 음성 기능)`);
  console.log(`   - 가이드: ${shareItems.length}개`);
}

migrateSinglePage(shareId)
  .then(() => {
    console.log("🎉 작업 완료");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ 오류 발생:", err);
    process.exit(1);
  });
