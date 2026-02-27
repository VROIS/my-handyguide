const { google } = require('googleapis');

const PACKAGE_NAME = 'com.sonanie.guide';
const PLAY_SA_JSON = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;

async function main() {
  const credentials = JSON.parse(PLAY_SA_JSON);
  console.log('서비스 계정:', credentials.client_email);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
  });
  const accessToken = await auth.getAccessToken();
  const BASE = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}`;
  const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

  console.log('\n1️⃣ Edit 생성...');
  const editRes = await fetch(`${BASE}/edits`, { method: 'POST', headers, body: '{}' });
  const editBody = await editRes.json();
  if (!editRes.ok) {
    console.error('❌ Edit 생성 실패:', editRes.status, JSON.stringify(editBody).substring(0, 400));
    return;
  }
  const editId = editBody.id;
  console.log('✅ Edit 생성 성공! editId:', editId);

  console.log('\n2️⃣ alpha 트랙 테스터 조회...');
  const getRes = await fetch(`${BASE}/edits/${editId}/testers/alpha`, { headers });
  const getBody = await getRes.json();
  if (!getRes.ok) {
    console.error('❌ 테스터 조회 실패:', getRes.status, JSON.stringify(getBody).substring(0, 400));
  } else {
    console.log('✅ 현재 테스터:', getBody.testers?.length ? getBody.testers : '(없음)');
  }

  console.log('\n3️⃣ Edit 삭제 (변경 없이 종료)...');
  const delRes = await fetch(`${BASE}/edits/${editId}`, { method: 'DELETE', headers });
  if (delRes.status === 204) {
    console.log('✅ Edit 삭제 완료 — API 연결 정상!');
  } else {
    const delBody = await delRes.text();
    console.log('⚠️ 삭제 상태:', delRes.status, delBody.substring(0, 200));
  }
}

main().catch(e => console.error('오류:', e.message));
