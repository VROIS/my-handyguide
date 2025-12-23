import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './shared/schema.ts';
import fs from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function migrateOldPages() {
  const pageIds = ['qi6WlKKC', 'gTsAuDjr'];
  
  for (const id of pageIds) {
    console.log(`\n🔄 처리 중: ${id}`);
    
    // 1. DB에서 페이지 가져오기
    const [page] = await db
      .select()
      .from(schema.sharedHtmlPages)
      .where(eq(schema.sharedHtmlPages.id, id));
    
    if (!page) {
      console.log(`❌ ${id} 페이지를 찾을 수 없음`);
      continue;
    }
    
    if (!page.htmlContent) {
      console.log(`❌ ${id} htmlContent가 없음`);
      continue;
    }
    
    // 2. HTML 파일 저장
    const filePath = `/shared/${id}.html`;
    const fullPath = path.join(process.cwd(), 'public', filePath);
    fs.writeFileSync(fullPath, page.htmlContent, 'utf8');
    console.log(`✅ 파일 저장 완료: ${fullPath}`);
    
    // 3. DB 업데이트
    await db
      .update(schema.sharedHtmlPages)
      .set({
        htmlFilePath: filePath,
        htmlContent: null, // 공간 절약
        updatedAt: new Date()
      })
      .where(eq(schema.sharedHtmlPages.id, id));
    
    console.log(`✅ DB 업데이트 완료: ${id}`);
  }
  
  console.log('\n✅ 모든 페이지 마이그레이션 완료!');
  await pool.end();
}

migrateOldPages().catch(console.error);
