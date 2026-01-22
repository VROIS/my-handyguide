# 디버깅 코드 백업 (2026-01-22)

문제 발생 시 다시 삽입하여 사용할 수 있는 디버깅 코드 모음입니다.

---

## 1. 모바일 디버깅 박스 (index.html)

`<body>` 바로 아래에 삽입:

```html
<!-- 🔧 모바일 디버깅 박스 (화면에서 직접 확인) -->
<div id="mobileDebugBox" style="position:fixed;top:10px;left:10px;right:10px;background:rgba(0,0,0,0.85);color:#0f0;font-size:11px;padding:10px;border-radius:8px;z-index:99999;font-family:monospace;max-height:40vh;overflow:auto;">
    <div style="font-weight:bold;margin-bottom:5px;color:#ff0;">📱 언어 디버깅</div>
    <div id="debugContent">로딩 중...</div>
</div>
<script>
// 디버깅 박스 업데이트 함수
function updateDebugBox() {
    const deviceLang = navigator.language || navigator.userLanguage || 'unknown';
    const storedLang = localStorage.getItem('appLanguage') || '(없음)';
    const googtrans = document.cookie.split(';').find(c => c.includes('googtrans'));
    const googtransVal = googtrans ? googtrans.split('=')[1] : '(없음)';
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const ua = navigator.userAgent.substring(0, 50);
    
    document.getElementById('debugContent').innerHTML = `
        <div>기기언어: <span style="color:#0ff">${deviceLang}</span></div>
        <div>localStorage: <span style="color:#0ff">${storedLang}</span></div>
        <div>googtrans: <span style="color:#0ff">${googtransVal}</span></div>
        <div>PWA: <span style="color:#0ff">${isPWA ? 'Yes' : 'No'}</span></div>
        <div style="font-size:9px;color:#888;margin-top:5px;">UA: ${ua}...</div>
        <div style="font-size:9px;color:#666;margin-top:3px;">탭하면 닫힘</div>
    `;
}
updateDebugBox();
setTimeout(updateDebugBox, 500);
setTimeout(updateDebugBox, 2000);

// 디버깅 박스 클릭 시 숨김
document.getElementById('mobileDebugBox').addEventListener('click', function() {
    this.style.display = 'none';
});

window.updateDebugBox = updateDebugBox;
</script>
```

---

## 2. language-helper.js 디버깅 로그

`initializeLanguage` 함수 시작 부분에 삽입:

```javascript
console.log('🔍 [DEBUG] ========== 언어 초기화 시작 ==========');
console.log('🔍 [DEBUG] navigator.language:', navigator.language);
console.log('🔍 [DEBUG] navigator.languages:', JSON.stringify(navigator.languages));
console.log('🔍 [DEBUG] localStorage.appLanguage (before):', localStorage.getItem('appLanguage'));
console.log('🔍 [DEBUG] googtrans 쿠키:', document.cookie.split(';').find(c => c.includes('googtrans')) || '없음');
console.log('🔍 [DEBUG] User-Agent:', navigator.userAgent.substring(0, 80));
```

함수 끝 부분:

```javascript
console.log('🔍 [DEBUG] 최종 언어:', savedLang);
console.log('🔍 [DEBUG] ========== 언어 초기화 완료 ==========');
```

---

## 3. Google Translate 초기화 디버깅

`googleTranslateElementInit` 함수에 삽입:

```javascript
console.log('🔧 [DEBUG] Google Translate 초기화 시작');
// ... 초기화 코드 ...
console.log('✅ [DEBUG] Google Translate 초기화 완료 (pageLanguage: ko)');
```

---

## 4. 언어 선택 디버깅 (랜딩페이지)

`selectLanguage` 함수에 삽입:

```javascript
console.log('📌 [DEBUG] localStorage.appLanguage 저장됨:', lang);
if (window.updateDebugBox) window.updateDebugBox();
```

---

## 사용 방법

1. 문제 발생 시 해당 코드를 해당 파일에 삽입
2. 배포 또는 개발 환경에서 테스트
3. 콘솔 로그 또는 화면 디버깅 박스 확인
4. 문제 해결 후 다시 제거

---

## 관련 파일

- `public/index.html` - 랜딩페이지, Google Translate
- `public/language-helper.js` - 언어 초기화 로직
- `public/index.js` - 메인 앱 로직
