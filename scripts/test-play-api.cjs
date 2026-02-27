const { google } = require('googleapis');

const PACKAGE_NAME = 'com.sonanie.guide';
const PLAY_SA_JSON = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
const TEST_EMAIL = 'dbstour1@gmail.com'; // 테스트용 (실제 개발자 이메일)

async function main() {
  const credentials = JSON.parse(PLAY_SA_JSON);
  console.log('서비스 계정:', credentials.client_email);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
  });
  const token = await auth.getAccessToken();
  const BASE = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // 1단계: Edit 생성
  console.log('\n1️⃣ Edit 생성...');
  const editRes = await fetch(`${BASE}/edits`, { method: 'POST', headers, body: '{}' });
  const editBody = await editRes.json();
  if (!editRes.ok) {
    console.error('❌ Edit 생성 실패:', editRes.status, JSON.stringify(editBody).substring(0, 300));
    return;
  }
  const editId = editBody.id;
  console.log('✅ Edit 생성 성공! editId:', editId);

  // 2단계: alpha 트랙 테스터 조회
  console.log('\n2️⃣ alpha 트랙 테스터 조회...');
  const getRes = await fetch(`${BASE}/edits/${editId}/testers/alpha`, { headers });
  const getBody = await getRes.json();
  if (!getRes.ok) {
    console.error('❌ 테스터 조회 실패:', getRes.status, JSON.stringify(getBody).substring(0, 300));
  } else {
    console.log('✅ 현재 테스터:', getBody.testers || '(없음)');
  }

  // 3단계: Edit 삭제 (테스터 추가 안 함 - 테스트만)
  console.log('\n3️⃣ Edit 삭제 (테스트 종료)...');
  const delRes = await fetch(`${BASE}/edits/${editId}`, { method: 'DELETE', headers });
  console.log('Edit 삭제 상태:', delRes.status, delRes.status === 204 ? '✅ 성공' : '❌ 실패');
}

main().catch(e => console.error('오류:', e.message));
