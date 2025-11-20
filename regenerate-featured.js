const fetch = require('node-fetch');

const baseUrl = 'https://6e9c1b21-2f71-4aa0-88c6-6094bd29a083-00-2nko28mxcvtbi.riker.replit.dev';

const pages = [
  {
    id: 'qi6WlKKC',
    title: '루부르 박물관 베스트20',
    sender: '여행자',
    location: '파리, 프랑스',
    date: '2025-10-18'
  },
  {
    id: 'A4dgTzkW',
    title: '251111',
    sender: '여행자',
    location: '파리, 프랑스',
    date: '2025-11-11'
  },
  {
    id: 'gTsAuDjr',
    title: '베르사유 궁전 내부 핵심',
    sender: '여행자',
    location: '파리, 프랑스',
    date: '2025-10-07'
  }
];

async function regenerateAll() {
  // 1. 관리자 인증
  console.log('🔐 관리자 인증 중...');
  const authRes = await fetch(`${baseUrl}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: '1234' })
  });
  
  const cookies = authRes.headers.get('set-cookie');
  if (!cookies) {
    console.error('❌ 인증 실패: 쿠키 없음');
    return;
  }
  
  console.log('✅ 관리자 인증 성공');
  
  // 2. 각 페이지 재생성
  for (const page of pages) {
    console.log(`\n🔄 재생성 중: ${page.id} - ${page.title}`);
    
    try {
      const res = await fetch(`${baseUrl}/api/admin/featured/${page.id}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies
        },
        body: JSON.stringify({
          title: page.title,
          sender: page.sender,
          location: page.location,
          date: page.date
        })
      });
      
      const result = await res.json();
      
      if (res.ok) {
        console.log(`✅ ${page.id} 재생성 성공:`, result.message);
      } else {
        console.error(`❌ ${page.id} 재생성 실패:`, result.error);
      }
    } catch (error) {
      console.error(`❌ ${page.id} 오류:`, error.message);
    }
  }
  
  console.log('\n✅ 모든 페이지 재생성 완료!');
}

regenerateAll().catch(console.error);
