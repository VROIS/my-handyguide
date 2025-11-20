import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sharedHtmlPages } from './shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function checkProdMigration() {
  console.log('🔍 Production DB 마이그레이션 상태 확인...\n');
  
  const allPages = await db
    .select()
    .from(sharedHtmlPages)
    .orderBy(sharedHtmlPages.createdAt);
  
  console.log(`총 ${allPages.length}개 페이지:\n`);
  
  const v1Pages = allPages.filter(p => p.templateVersion !== 'v2');
  const v2Pages = allPages.filter(p => p.templateVersion === 'v2');
  
  console.log(`📊 통계:`);
  console.log(`  - v1 페이지: ${v1Pages.length}개`);
  console.log(`  - v2 페이지: ${v2Pages.length}개\n`);
  
  console.log(`📄 페이지 상세:\n`);
  for (const page of allPages) {
    const version = page.templateVersion || 'v1';
    const hasFile = page.htmlFilePath ? '파일' : 'DB만';
    const hasContent = page.htmlContent ? 'O' : 'X';
    const contentLength = page.htmlContent ? `${(page.htmlContent.length / 1024).toFixed(1)}KB` : '0KB';
    console.log(`${page.id.padEnd(12)} | ${version.padEnd(4)} | ${hasFile.padEnd(6)} | HTML: ${hasContent} (${contentLength}) | ${page.name}`);
  }
}

checkProdMigration()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ 오류:', err);
    process.exit(1);
  });
