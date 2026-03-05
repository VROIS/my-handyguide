const nodemailer = require('nodemailer');

const SENDER_EMAIL = 'dbstour1@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const GROUP_LINK = 'https://groups.google.com/g/dbstour';
const INSTALL_LINK = 'https://play.google.com/apps/testing/com.sonanie.guide';
const BETA_PAGE = 'https://My-handyguide1.replit.app/beta';
const WEB_APP = 'https://My-handyguide1.replit.app';

// 프로덕션 DB 조회 결과 (2026-02-25) - dbstour1@gmail.com 제외 (이미 발송됨)
const USERS = [
  { email: 'a01056421474@gmail.com', first_name: '미경', last_name: '류' },
  { email: 'agatha03@dosun.hs.kr', first_name: '주희', last_name: '함' },
  { email: 'biology@hyundai.hs.kr', first_name: '호진', last_name: '최' },
  { email: 'blue8671@gmail.com', first_name: '비비드', last_name: '' },
  { email: 'caesar198107@gmail.com', first_name: '민석', last_name: '강' },
  { email: 'cherished921@gmail.com', first_name: '민경', last_name: '천' },
  { email: 'choiyj0218@gmail.com', first_name: '예진', last_name: '최' },
  { email: 'earltoooo@gmail.com', first_name: '지혜', last_name: '김' },
  { email: 'enzoafrica@gmail.com', first_name: 'Enzo', last_name: 'Oh' },
  { email: 'gaemiking@gmail.com', first_name: 'ji won', last_name: 'lee' },
  { email: 'gajungssamzzang@gmail.com', first_name: 'Sujin', last_name: 'Lee' },
  { email: 'happyhour012012@gmail.com', first_name: 'Hyunju', last_name: 'Kim' },
  { email: 'jinouc@gmail.com', first_name: 'jinouc', last_name: 'jung' },
  { email: 'jpfoodking@gmail.com', first_name: '충순', last_name: '고' },
  { email: 'june_wook@snu.ms.kr', first_name: '철호', last_name: '허' },
  { email: 'leemyeonghan@gmail.com', first_name: 'Myeong Han', last_name: 'Lee' },
  { email: 'memilmuk82@gmail.com', first_name: 'JINSEON', last_name: 'LEE' },
  { email: 'myungah0126@gmail.com', first_name: '명아', last_name: '문' },
  { email: 'nkino12@gmail.com', first_name: '신', last_name: 'Shin' },
  { email: 'osh9149@gmail.com', first_name: '승희', last_name: '오' },
  { email: 'pk97699@gmail.com', first_name: '현희', last_name: '기' },
  { email: 'renaitre2014@gmail.com', first_name: 'Boniface', last_name: 'park' },
  { email: 'salladin0717@gmail.com', first_name: '정수쌤', last_name: '' },
  { email: 'shc77777@gmail.com', first_name: 'Jake', last_name: 'Seo' },
  { email: 'smartlivingparis@gmail.com', first_name: 'Smart Living', last_name: 'Paris' },
  { email: 'sobi65501@gmail.com', first_name: '소비', last_name: '' },
  { email: 'stchichi70@gmail.com', first_name: 'Cheshire', last_name: 'Cat' },
  { email: 'supersonic9799@gmail.com', first_name: '영준', last_name: '김' },
  { email: 'teachingko@snu.ac.kr', first_name: '고진홍', last_name: '' },
  { email: 'wonchon2020@gmail.com', first_name: '정보', last_name: '' },
];

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
    <h3 style="color:#1a73e8;margin-top:0;font-size:14px;">📋 설치 방법 (2단계)</h3>
    <ol style="font-size:13px;line-height:2.4;padding-left:20px;margin:0;">
      <li><strong>1단계:</strong> 아래 파란 버튼 클릭 → 구글 그룹에 가입</li>
      <li><strong>2단계:</strong> 그룹 가입 완료 후 초록 버튼 클릭 → 앱 설치</li>
    </ol>
  </div>

  <div style="text-align:center;margin:20px 0 12px;">
    <a href="${GROUP_LINK}"
       style="display:inline-block;background:#1a73e8;color:white;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:bold;">
      1단계: 구글 그룹 가입하기
    </a>
  </div>

  <div style="text-align:center;margin:0 0 20px;">
    <a href="${INSTALL_LINK}"
       style="display:inline-block;background:#34a853;color:white;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:bold;">
      2단계: 비공개 테스트 앱 설치하기 (Android)
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

  console.log(`📋 발송 대상: ${USERS.length}명\n`);
  console.log('━'.repeat(60));
  USERS.forEach((u, i) => {
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ');
    console.log(`${String(i + 1).padStart(2)}. ${u.email}  |  ${name}`);
  });
  console.log('━'.repeat(60));

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SENDER_EMAIL, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.verify();
    console.log('\n✅ Gmail SMTP 연결 성공! 발송 시작...\n');
  } catch (err) {
    console.error('❌ Gmail SMTP 연결 실패:', err.message);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;
  const failedList = [];

  for (const user of USERS) {
    try {
      await transporter.sendMail({
        from: `"손안의 가이드" <${SENDER_EMAIL}>`,
        to: user.email,
        subject: '[손안의 가이드] 정식 출시 전, 1분만 도와주세요 (Android 전용)',
        html: getEmailHtml(user.first_name, user.last_name),
      });
      success++;
      const name = [user.first_name, user.last_name].filter(Boolean).join(' ');
      console.log(`✅ [${success + failed}/${USERS.length}] ${user.email}  ${name}`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      failed++;
      failedList.push(user.email);
      console.error(`❌ [${success + failed}/${USERS.length}] ${user.email}: ${err.message}`);
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log(`📊 발송 완료: 성공 ${success}건, 실패 ${failed}건 (총 ${USERS.length}건)`);
  if (failedList.length > 0) {
    console.log('❌ 실패 목록:');
    failedList.forEach(e => console.log('  -', e));
  }
}

main().catch(console.error);
