import { generateShareHtml } from '../server/html-template';
import fs from 'fs';

// k0Q6UEeK 데이터 로드
const v1Items = JSON.parse(fs.readFileSync('/tmp/k0Q6UEeK_v1_items.json', 'utf8'));

console.log('=== k0Q6UEeK V1 마이그레이션 ===');
console.log('Items:', v1Items.length);

// V1 HTML 생성
const html = generateShareHtml({
  title: '세느3',
  items: v1Items.map((item: any, index: number) => ({
    id: String(index),
    title: `가이드 ${index + 1}`,
    description: item.description,
    imageBase64: item.imageBase64,
    locationName: item.locationName
  })),
  createdAt: '2025-11-15T05:00:29.117274',
  location: '파리',
  sender: '여행자',
  includeAudio: true,
  isFeatured: true
});

// 저장
fs.writeFileSync('/tmp/k0Q6UEeK_v1.html', html);
console.log('✅ V1 HTML 생성 완료');
console.log('크기:', Math.round(html.length / 1024), 'KB');

// app-data 검증
const appDataMatch = html.match(/<script id="app-data" type="application\/json">([\s\S]*?)<\/script>/);
if (appDataMatch) {
  const appData = JSON.parse(appDataMatch[1]);
  console.log('\n✅ app-data 검증:');
  console.log('  - guides:', appData.length);
  appData.forEach((g: any, i: number) => {
    console.log(`  - description #${i+1}:`, g.description ? '✅ 있음 (' + g.description.substring(0, 30) + '...)' : '❌ 없음');
  });
} else {
  console.log('❌ app-data 없음!');
}
