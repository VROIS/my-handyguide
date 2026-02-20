const nodemailer = require('nodemailer');

const SENDER_EMAIL = 'dbstour1@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const TESTING_LINK = 'https://play.google.com/apps/testing/com.sonanie.guide';

const recipients = [
  'a01056421474@gmail.com',
  'agatha03@dosun.hs.kr',
  'biology@hyundai.hs.kr',
  'blue8671@gmail.com',
  'caesar198107@gmail.com',
  'cherished921@gmail.com',
  'choiyj0218@gmail.com',
  'earltoooo@gmail.com',
  'gaemiking@gmail.com',
  'gajungssamzzang@gmail.com',
  'happyhour012012@gmail.com',
  'jinouc@gmail.com',
  'jpfoodking@gmail.com',
  'june_wook@snu.ms.kr',
  'leemyeonghan@gmail.com',
  'memilmuk82@gmail.com',
  'myungah0126@gmail.com',
  'nkino12@gmail.com',
  'osh9149@gmail.com',
  'pk97699@gmail.com',
  'renaitre2014@gmail.com',
  'salladin0717@gmail.com',
  'shc77777@gmail.com',
  'smartlivingparis@gmail.com',
  'sobi65501@gmail.com',
  'stchichi70@gmail.com',
  'supersonic9799@gmail.com',
  'teachingko@snu.ac.kr',
  'wonchon2020@gmail.com',
];

const subject = '[손안의 가이드] Android 앱 베타 테스터를 모집합니다! (무료 100 크레딧 제공)';

function getEmailHtml() {
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #4285F4; font-size: 24px;">📱 손안의 가이드</h1>
    <p style="color: #666; font-size: 14px;">AI 여행 가이드 앱</p>
  </div>

  <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #333; font-size: 18px; margin-top: 0;">안녕하세요, 손안의 가이드 회원님! 👋</h2>
    <p style="line-height: 1.8;">
      항상 저희 <strong>손안의 가이드</strong>를 이용해 주셔서 감사합니다.
    </p>
    <p style="line-height: 1.8;">
      기쁜 소식을 전해드립니다!<br>
      드디어 <strong>Android 전용 앱</strong>이 Google Play Store에 출시 준비 중입니다. 🎉
    </p>
    <p style="line-height: 1.8;">
      정식 출시 전에 <strong>베타 테스트</strong>에 참여해 주실 분을 모집하고 있습니다.
    </p>
  </div>

  <div style="background: #e8f0fe; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="color: #1a73e8; margin-top: 0;">🎁 베타 테스터 혜택</h3>
    <ul style="line-height: 2; padding-left: 20px;">
      <li><strong>무료 100 크레딧</strong> 즉시 지급</li>
      <li>정식 출시 전 <strong>앱을 먼저</strong> 사용해 볼 수 있습니다</li>
      <li>여러분의 피드백이 앱 개선에 직접 반영됩니다</li>
    </ul>
  </div>

  <div style="background: #fff3e0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="color: #e65100; margin-top: 0;">📋 참여 방법 (간단 3단계)</h3>
    <ol style="line-height: 2.2; padding-left: 20px;">
      <li>아래 링크를 <strong>Android 기기</strong>에서 클릭하세요</li>
      <li>"테스터 되기"를 누르세요</li>
      <li>앱을 설치하고 자유롭게 사용해 보세요!</li>
    </ol>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${TESTING_LINK}" style="display: inline-block; background: #1a73e8; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
      👉 베타 테스트 참여하기
    </a>
  </div>

  <div style="background: #fce4ec; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0; line-height: 1.8; font-size: 14px;">
      ⚠️ <strong>참고사항</strong><br>
      • Android 기기에서만 참여 가능합니다 (iPhone 미지원)<br>
      • 위 링크의 <strong>Google 계정</strong>과 Play Store 계정이 동일해야 합니다<br>
      • 테스트 기간: 약 2주
    </p>
  </div>

  <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p>본 메일은 손안의 가이드 가입 회원님께 발송되었습니다.</p>
    <p>문의: dbstour1@gmail.com</p>
  </div>
</body>
</html>`;
}

async function sendEmails() {
  if (!GMAIL_APP_PASSWORD) {
    console.error('GMAIL_APP_PASSWORD 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ Gmail SMTP 연결 성공!\n');
  } catch (err) {
    console.error('❌ Gmail SMTP 연결 실패:', err.message);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (const to of recipients) {
    try {
      await transporter.sendMail({
        from: `"손안의 가이드" <${SENDER_EMAIL}>`,
        to,
        subject,
        html: getEmailHtml(),
      });
      success++;
      console.log(`✅ [${success + failed}/${recipients.length}] ${to}`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      failed++;
      console.error(`❌ [${success + failed}/${recipients.length}] ${to}: ${err.message}`);
    }
  }

  console.log(`\n📊 발송 완료: 성공 ${success}건, 실패 ${failed}건 (총 ${recipients.length}건)`);
}

sendEmails();
