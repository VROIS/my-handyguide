// ═══════════════════════════════════════════════════════════════
// 🧹 모든 공유페이지에서 카카오톡 경고 제거
// ═══════════════════════════════════════════════════════════════

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

async function removeKakaoWarnings() {
  console.log('🧹 카카오톡 경고 제거 시작...\n');
  
  try {
    // 1. 모든 공유 HTML 파일 찾기
    const htmlFiles = await glob('public/shared/*.html');
    console.log(`📊 총 ${htmlFiles.length}개 HTML 파일 발견\n`);
    
    let cleanCount = 0;
    let modifiedCount = 0;
    let errorCount = 0;
    
    for (const filePath of htmlFiles) {
      try {
        const fileName = path.basename(filePath);
        
        // 2. 파일 읽기
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 3. 카카오톡 경고 패턴 검사
        const hasKakaoWarning = 
          content.includes('카메라 기능') ||
          content.includes('kakao-browser-warning') ||
          content.includes('카카오톡 인앱 브라우저') ||
          content.includes('Chrome 강제 리다이렉트') ||
          content.includes('isKakaoInApp');
        
        if (!hasKakaoWarning) {
          console.log(`✅ [${fileName}] 이미 깨끗함`);
          cleanCount++;
          continue;
        }
        
        console.log(`🔧 [${fileName}] 카카오톡 경고 제거 중...`);
        
        // 4. 카카오톡 리다이렉트 스크립트 블록 제거
        // 패턴: <script>로 시작하고 isKakaoInApp이 포함된 블록
        content = content.replace(
          /<script>\s*\/\/\s*═+\s*\/\/\s*⭐\s*카카오톡 인앱 브라우저.*?<\/script>/gs,
          ''
        );
        
        // 5. 카카오톡 경고 HTML 요소 제거
        content = content.replace(
          /<!--\s*카카오톡 인앱 브라우저 경고.*?-->\s*<div id="kakao-browser-warning">.*?<\/div>/gs,
          ''
        );
        
        // 6. 카카오톡 경고 스타일 제거
        content = content.replace(
          /\/\*\s*카카오톡 인앱 브라우저 경고.*?\*\/\s*#kakao-browser-warning\s*{[^}]*}(?:\s*#kakao-browser-warning[^{]*{[^}]*})*/gs,
          ''
        );
        
        // 7. isKakaoInApp 관련 스크립트 제거 (더 광범위한 패턴)
        content = content.replace(
          /<script>[\s\S]*?isKakaoInApp[\s\S]*?<\/script>/g,
          ''
        );
        
        // 8. openInChrome 함수 제거
        content = content.replace(
          /function\s+openInChrome\s*\([^)]*\)\s*{[\s\S]*?}/g,
          ''
        );
        
        // 9. 불필요한 빈 줄 정리
        content = content.replace(/\n{3,}/g, '\n\n');
        
        // 10. 파일 저장
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ [${fileName}] 제거 완료!`);
        modifiedCount++;
        
      } catch (error) {
        console.error(`❌ [${path.basename(filePath)}] 오류:`, error);
        errorCount++;
      }
    }
    
    // 11. 결과 요약
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 카카오톡 경고 제거 결과:');
    console.log(`   - 총 파일: ${htmlFiles.length}개`);
    console.log(`   - 이미 깨끗함: ${cleanCount}개`);
    console.log(`   - 제거 완료: ${modifiedCount}개`);
    console.log(`   - 오류: ${errorCount}개`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (modifiedCount > 0) {
      console.log('✅ V2 표준 로직 적용 완료:');
      console.log('   ❌ 카카오톡 경고 완전 제거');
      console.log('   ✅ 모든 브라우저에서 정상 작동\n');
    }
    
  } catch (error) {
    console.error('❌ 제거 실패:', error);
    process.exit(1);
  }
}

// 실행
removeKakaoWarnings()
  .then(() => {
    console.log('🎉 카카오톡 경고 제거 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 치명적 오류:', error);
    process.exit(1);
  });
