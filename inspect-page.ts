import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sharedHtmlPages } from './shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function inspectPage() {
  const pageId = 'gTsAuDjr';
  const page = await db
    .select()
    .from(sharedHtmlPages)
    .where(eq(sharedHtmlPages.id, pageId))
    .limit(1);
  
  if (page.length === 0) {
    console.log('❌ 페이지 없음');
    return;
  }
  
  const p = page[0];
  const html = p.htmlContent || '';
  
  console.log(`\n📄 페이지: ${p.name} (${pageId})`);
  console.log(`📊 templateVersion: ${p.templateVersion}`);
  console.log(`📏 HTML 크기: ${(html.length / 1024).toFixed(1)}KB`);
  console.log(`📁 htmlFilePath: ${p.htmlFilePath || 'null'}`);
  
  // 카카오 경고 체크
  const hasKakaoWarning = html.includes('<div id="kakao-browser-warning">');
  console.log(`\n🔍 카카오톡 경고: ${hasKakaoWarning ? '✅ 있음' : '❌ 없음'}`);
  
  // v2 참조 체크
  const hasV2CSS = html.includes('/shared-template/v2.css');
  const hasV2JS = html.includes('/shared-template/v2.js');
  console.log(`📦 v2.css 참조: ${hasV2CSS ? '✅' : '❌'}`);
  console.log(`📦 v2.js 참조: ${hasV2JS ? '✅' : '❌'}`);
  
  // 갤러리 아이템 체크
  const hasGalleryGrid = html.includes('<div class="gallery-grid">');
  const hasGalleryItem = html.includes('class="gallery-item"');
  console.log(`🖼️ 갤러리 그리드: ${hasGalleryGrid ? '✅' : '❌'}`);
  console.log(`🖼️ 갤러리 아이템: ${hasGalleryItem ? '✅' : '❌'}`);
  
  // 상세 뷰 체크
  const hasDetailView = html.includes('<div id="detail-view"');
  const hasAudioBtn = html.includes('id="detail-audio"');
  console.log(`📖 상세 뷰: ${hasDetailView ? '✅' : '❌'}`);
  console.log(`🎤 오디오 버튼: ${hasAudioBtn ? '✅' : '❌'}`);
  
  // 데이터 주입 체크
  const hasGuideData = html.includes('window.GUIDE_DATA');
  console.log(`💾 window.GUIDE_DATA: ${hasGuideData ? '✅' : '❌'}`);
  
  // HTML 구조 샘플
  console.log(`\n📝 HTML 구조 샘플 (첫 1500자):\n`);
  console.log(html.substring(0, 1500));
  
  // DB htmlContent를 파일로 저장 (디버깅용)
  fs.writeFileSync('/tmp/gTsAuDjr-db.html', html, 'utf8');
  console.log(`\n💾 DB HTML 저장: /tmp/gTsAuDjr-db.html`);
}

inspectPage()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ 오류:', err);
    process.exit(1);
  });
