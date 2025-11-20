import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sharedHtmlPages } from './shared/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function checkHtmlContent() {
  // gTsAuDjr 페이지 (사용자가 PC에서 본 페이지)
  const page = await db
    .select()
    .from(sharedHtmlPages)
    .where(eq(sharedHtmlPages.id, 'gTsAuDjr'))
    .limit(1);
  
  if (page.length === 0) {
    console.log('❌ 페이지 없음');
    return;
  }
  
  const html = page[0].htmlContent || '';
  
  console.log(`\n📄 페이지: ${page[0].name}`);
  console.log(`📊 templateVersion: ${page[0].templateVersion}`);
  console.log(`📏 HTML 크기: ${(html.length / 1024).toFixed(1)}KB`);
  console.log(`\n🔍 HTML 구조 확인:\n`);
  
  // v2.css 참조 확인
  if (html.includes('href="/shared-template/v2.css"')) {
    console.log('✅ v2.css 참조 발견');
  } else {
    console.log('❌ v2.css 참조 없음');
  }
  
  // v2.js 참조 확인
  if (html.includes('src="/shared-template/v2.js"')) {
    console.log('✅ v2.js 참조 발견');
  } else {
    console.log('❌ v2.js 참조 없음');
  }
  
  // window.GUIDE_DATA 확인
  if (html.includes('window.GUIDE_DATA')) {
    console.log('✅ window.GUIDE_DATA 발견');
  } else {
    console.log('❌ window.GUIDE_DATA 없음');
  }
  
  // <script id="app-data"> 확인 (v1 패턴)
  if (html.includes('<script id="app-data"')) {
    console.log('⚠️ v1 패턴 (<script id="app-data">) 발견 - 마이그레이션 실패!');
  } else {
    console.log('✅ v1 패턴 없음');
  }
  
  console.log(`\n📝 HTML 첫 500자:\n`);
  console.log(html.substring(0, 500));
}

checkHtmlContent()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ 오류:', err);
    process.exit(1);
  });
