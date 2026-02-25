const nodemailer = require('nodemailer');
const { Client } = require('pg');
const readline = require('readline');

const SENDER_EMAIL = 'dbstour1@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const TESTING_LINK = 'https://play.google.com/apps/internaltest/4701739022712298192';
const BETA_PAGE = 'https://My-handyguide1.replit.app/beta';
const WEB_APP = 'https://My-handyguide1.replit.app';

async function getUsers() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const result = await client.query(
    `SELECT email, first_name, last_name FROM users WHERE email ILIKE '%@gmail.com' AND email IS NOT NULL ORDER BY email`
  );
  await client.end();
  return result.rows;
}

function getEmailHtml(firstName, lastName) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const greeting = fullName ? `안녕하세요, ${fullName}님!` : '안녕하세요!';
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">

  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="color:#1a73e8;font-size:22px;">🗺️ 손안의 가이드</h1>
    <p style="color:#666;font-size:13px;">AI 여행 가이드 앱</p>
  </div>

  <div style="background:#f8f9fa;border-radius:12px;padding:24px;margin-bottom:16px;">
    <h2 style="font-size:16px;margin-top:0;">${greeting}</h2>
    <p style="line-height:1.8;">
      최근에 이용하신 <strong>'내 손안의 가이드'</strong>가 곧 Google Play Store에 정식 출시됩니다.<br>
      더 좋은 앱이 될 수 있도록 <strong>1분만 도와주세요!</strong>
    </p>
    <p style="line-height:1.8;">
      📱 <strong>Android 폰 사용자 전용</strong>입니다<br>
      📅 설치 후 <strong>14일간만</strong> 유지해주시면 정식 출시에 큰 도움이 됩니다<br>
      ✅ <strong>테스트 앱 설치 후 실제 앱처럼 바로 사용이 가능합니다</strong>
    </p>
  </div>

  <div style="background:#e8f0fe;border-radius:12px;padding:20px;margin-bottom:16px;">
    <h3 style="color:#1a73e8;margin-top:0;font-size:14px;">📋 설치 방법</h3>
    <ol style="font-size:13px;line-height:2.2;padding-left:20px;margin:0;">
      <li>아래 버튼 클릭</li>
      <li>파란 글자 <strong>"download it on Google Play"</strong> 클릭</li>
      <li><strong>"설치"</strong> 클릭 → 완료!</li>
    </ol>
    <p style="font-size:12px;color:#c62828;margin-top:12px;margin-bottom:0;">
      ⚠️ <strong>"Leave the program"</strong> 버튼은 절대 클릭하지 마세요 (탈퇴 버튼입니다)
    </p>
  </div>

  <div style="text-align:center;margin:24px 0;">
    <a href="${TESTING_LINK}"
       style="display:inline-block;background:#1a73e8;color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:bold;">
      📱 베타 앱 설치하기 (Android)
    </a>
    <p style="margin-top:8px;font-size:11px;color:#999;">Android 기기에서만 설치 가능합니다</p>
  </div>

  <div style="border-top:1px solid #eee;padding-top:16px;margin-bottom:16px;">
    <p style="font-size:13px;color:#555;line-height:1.7;">
      🤝 <strong>주변에 Android 폰 사용자가 계신가요?</strong><br>
      아래 링크를 공유해주세요. Google 로그인 후 바로 테스터로 참여할 수 있습니다:<br>
      👉 <a href="${BETA_PAGE}" style="color:#1a73e8;">${BETA_PAGE}</a>
    </p>
  </div>

  <div style="border-top:1px solid #eee;padding-top:16px;margin-bottom:16px;">
    <p style="font-size:13px;color:#555;line-height:1.7;">
      🍎 <strong>iPhone 사용자이신가요?</strong><br>
      Chrome 브라우저에서 웹 버전을 계속 이용하실 수 있습니다:<br>
      👉 <a href="${WEB_APP}" style="color:#1a73e8;">${WEB_APP}</a>
    </p>
  </div>

  <div style="text-align:center;color:#999;font-size:11px;margin-top:24px;padding-top:16px;border-top:1px solid #eee;">
    <p>본 메일은 손안의 가이드 가입 회원님께 발송되었습니다.</p>
    <p>문의: dbstour1@gmail.com</p>
  </div>

</body>
</html>`;
}

async function main() {
  if (!GMAIL_APP_PASSWORD) {
    console.error('❌ GMAIL_APP_PASSWORD 환경변수가 없습니다.');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL 환경변수가 없습니다.');
    process.exit(1);
  }

  console.log('📡 DB에서 Gmail 사용자 조회 중...');
  const users = await getUsers();
  console.log(`\n✅ Gmail 사용자 ${users.length}명 발견\n`);

  console.log('━'.repeat(60));
  console.log('📋 발송 대상 이메일 목록:');
  console.log('━'.repeat(60));
  users.forEach(u => {
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || '(이름 없음)';
    console.log(`${u.email}  |  ${name}`);
  });
  console.log('━'.repeat(60));
  console.log('\n준비되면 Enter를 눌러 이메일 발송을 시작하세요...\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => rl.question('발송 시작 ▶ ', () => { rl.close(); resolve(); }));

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SENDER_EMAIL, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.verify();
    console.log('\n✅ Gmail SMTP 연결 성공!\n');
  } catch (err) {
    console.error('❌ Gmail SMTP 연결 실패:', err.message);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      await transporter.sendMail({
        from: `"손안의 가이드" <${SENDER_EMAIL}>`,
        to: user.email,
        subject: '[손안의 가이드] 정식 출시 전, 1분만 도와주세요 (Android 전용)',
        html: getEmailHtml(user.first_name, user.last_name),
      });
      success++;
      const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || '';
      console.log(`✅ [${success + failed}/${users.length}] ${user.email}  ${name}`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      failed++;
      console.error(`❌ [${success + failed}/${users.length}] ${user.email}: ${err.message}`);
    }
  }

  console.log(`\n📊 완료: 성공 ${success}건, 실패 ${failed}건 (총 ${users.length}건)`);
}

main().catch(console.error);
