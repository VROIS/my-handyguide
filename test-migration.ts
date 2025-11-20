import { storage } from './server/storage.js';

async function testMigration() {
  console.log('🔄 마이그레이션 시작...\n');
  
  try {
    const count = await storage.migrateAllToV2();
    console.log(`\n✅ 마이그레이션 완료: ${count}개 페이지 성공`);
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
  }
  
  process.exit(0);
}

testMigration();
