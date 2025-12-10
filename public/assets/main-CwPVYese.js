(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))B(h);new MutationObserver(h=>{for(const w of h)if(w.type==="childList")for(const l of w.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&B(l)}).observe(document,{childList:!0,subtree:!0});function L(h){const w={};return h.integrity&&(w.integrity=h.integrity),h.referrerPolicy&&(w.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?w.credentials="include":h.crossOrigin==="anonymous"?w.credentials="omit":w.credentials="same-origin",w}function B(h){if(h.ep)return;h.ep=!0;const w=L(h);fetch(h.href,w)}})();const vn=`당신은 세계 최고의 여행 예능 방송 진행자이자, 역사와 문화 해설 전문가입니다. 제공된 이미지(미술 작품, 건축/풍경, 음식 중 택일)를 분석하여, 다음 지침에 따라 한국어 나레이션 스크립트를 작성해야 합니다.

[AI 역할 및 톤(Tone) 강제]
역할: 여행 예능 프로그램의 메인 진행자처럼 활기차고, 청중을 집중시키며, 전문 지식을 쉽고 흥미롭게 풀어내는 해설을 제공합니다.
톤: 친근함, 유머러스함, 전문 지식에 기반한 깊이감을 동시에 갖춘 나레이션 스타일을 유지합니다.

[최우선 출력 강제 규칙]
인사말/뒷말 절대 금지: 모든 형식적인 인사말(시작, 끝)은 절대 사용하지 않습니다. 오직 콘텐츠 본문만 출력합니다.
출력 포맷: 순수한 설명문만 출력하며, 분석 과정, 기호, 번호, 마크다운 강조 기호(**, *) 등은 절대 사용하지 않습니다.
길이: 2분 내외의 음성 해설에 적합한 분량으로 작성합니다.

[필수 설명 순서 (순서 엄수)]
1. 야사/비화 (강력 후킹): 충격적인 사실이나 흥미로운 뒷이야기로 설명을 즉시 시작합니다. (광고 카피처럼 임팩트 있게, 최대 2문장)
2. 연도/배경: 정확한 연도를 명시하고, 이해를 돕기 위해 해당 시기를 한국사(예: 조선시대, 삼국시대)와 비교하여 설명합니다.
3. 상세 설명 (전문성 & 흥미): 이미지의 유형별 가이드라인을 따르되, 전문적인 지식(작가, 명칭, 특징 등)을 반드시 포함하여 깊이 있고 흥미로운 해설을 제공합니다.

[이미지 유형별 상세 가이드라인 (필수 정보 포함 강제)]
미술작품: 작품명, 작가, 시대적 배경을 명시한 후, 예술적 특징, 주요 감상 포인트를 예능적 표현을 섞어 해설합니다.
건축/풍경: 명칭, 역사적 의의, 건축 양식을 명시한 후, 핵심 특징, 방문자에게 유용한 사진 촬영 팁을 재미있게 전달합니다.
음식: 음식명, 유래, 맛의 특징을 명시한 후, 식재료 특징, 추천하는 섭취 방법/음료, 술을 제안합니다.`,bn=`당신은 세계 최고의 여행 가이드 도슨트입니다. 사용자의 질문에 한국어로 전문적으로 답변해주세요.

**[중요] 답변 구조:**
1. **비화/가격 정보로 시작** - 흥미로운 뒷이야기나 실용 정보로 시작
2. **역사 → 한국 비교** - 해당 시기 한국 상황과 비교
3. **현지 팁** - 실용적인 여행 정보 제공

[분석 유형별 가이드라인]
• 장소/명소: 역사, 특징, 방문 팁, 주변 정보
• 문화/역사: 배경, 의의, 현대적 해석
• 실용 정보: 교통, 가격, 영업시간, 추천 사항

[출력 규칙]
- 자연스러운 대화 형식으로 작성
- 1분 내외의 음성 해설에 적합한 길이 (400-500자)
- 전문 용어는 쉽게 풀어서 설명
- 마크다운 강조 기호(**) 사용 가능
- 인사말, 마무리 멘트 금지`;async function*xn(x){try{const f=await fetch("/api/gemini",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)});if(!f.ok||!f.body){const h=await f.json().catch(()=>({error:`서버 오류: ${f.status}`}));throw new Error(h.error||"서버에서 응답을 받을 수 없습니다.")}const L=f.body.getReader(),B=new TextDecoder;for(;;){const{done:h,value:w}=await L.read();if(h)break;yield{text:B.decode(w,{stream:!0})}}}catch(f){console.error("Netlify 함수 fetch 오류:",f),yield{text:`
[오류: 서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.]`}}}function kn(){const x=localStorage.getItem("appLanguage")||"ko";if(x==="ko")return"";const L={en:"English",ja:"日本語 (Japanese)","zh-CN":"中文 (Chinese)",fr:"Français (French)",de:"Deutsch (German)",es:"Español (Spanish)"}[x]||"English";return console.log("🌐 [언어설정] 선택된 언어:",L),`

[중요: 반드시 ${L} 언어로만 응답하세요. 한국어를 사용하지 마세요.]`}function Bo(x){const f=localStorage.getItem("customImagePrompt")||vn,L=kn(),B=f+L,h=localStorage.getItem("appLanguage")||"ko";return console.log("🔍 [프롬프트확인] 사용중인 이미지 프롬프트:",f.substring(0,50)+"..."),console.log("🌐 [언어지시] 추가됨:",L?"예":"아니오 (한국어)"),xn({base64Image:x,prompt:h==="ko"?"이 이미지를 분석하고 한국어로 생생하게 설명해주세요.":"Analyze this image and describe it vividly.",systemInstruction:B})}function Co(x){const f=localStorage.getItem("customTextPrompt")||bn,L=kn(),B=f+L;return console.log("🔍 [프롬프트확인] 사용중인 텍스트 프롬프트:",f.substring(0,50)+"..."),console.log("🌐 [언어지시] 추가됨:",L?"예":"아니오 (한국어)"),xn({prompt:x,systemInstruction:B})}function To(x,f=1024,L=1024){return new Promise((B,h)=>{const w=new Image;w.onload=()=>{let{width:l,height:C}=w;if(l<=f&&C<=L){B(x);return}l>C?l>f&&(C=Math.round(C*(f/l)),l=f):C>L&&(l=Math.round(l*(L/C)),C=L);const q=document.createElement("canvas");q.width=l,q.height=C;const re=q.getContext("2d");if(!re)return h(new Error("Canvas context를 가져올 수 없습니다."));re.drawImage(w,0,0,l,C);const Ce=parseFloat(localStorage.getItem("imageQuality"))||.9;console.log(`📊 [압축테스트] 사용 품질: ${Ce}, 크기: ${l}x${C}`);const X=q.toDataURL("image/jpeg",Ce),W=Math.round(X.length*3/4/1024);console.log(`📊 [압축결과] 최종 크기: ${W}KB`),B(X)},w.onerror=l=>{console.error("이미지 로딩 오류:",l),h(new Error("최적화를 위해 이미지를 로드하는 데 실패했습니다."))},w.src=x})}document.addEventListener("DOMContentLoaded",()=>{var pn,fn,wn,yn;LanguageHelper.bindLanguageSelect("languageSelect");const x=document.getElementById("camera-feed"),f=document.getElementById("capture-canvas"),L=document.getElementById("upload-input"),B=document.getElementById("toastContainer"),h=document.getElementById("shareModal"),w=document.getElementById("shareModalContent");document.getElementById("closeShareModalBtn");const l=document.getElementById("authModal"),C=document.getElementById("closeAuthModalBtn"),q=document.getElementById("googleLoginBtn"),re=document.getElementById("kakaoLoginBtn"),Ce=document.getElementById("featuresPage"),X=document.getElementById("mainPage"),W=document.getElementById("detailPage"),Pt=document.getElementById("archivePage"),At=document.getElementById("settingsPage"),_e=document.getElementById("startCameraFromFeaturesBtn"),Dt=document.getElementById("cameraStartOverlay"),$t=document.getElementById("mainLoader"),Ln=X.querySelector(".footer-safe-area"),fe=document.getElementById("shootBtn"),we=document.getElementById("uploadBtn"),ce=document.getElementById("micBtn"),ze=document.getElementById("archiveBtn"),Ke=document.getElementById("backBtn"),Y=document.getElementById("resultImage"),le=document.getElementById("loader"),P=document.getElementById("textOverlay"),N=document.getElementById("descriptionText"),Z=document.getElementById("loadingHeader"),Ut=Z.querySelector("h1"),Te=document.getElementById("loadingText"),ye=document.getElementById("detailFooter"),A=document.getElementById("audioBtn"),qe=document.getElementById("textToggleBtn"),ee=document.getElementById("saveBtn"),We=document.getElementById("archiveBackBtn"),D=document.getElementById("archiveGrid"),Nt=document.getElementById("emptyArchiveMessage"),ve=document.getElementById("featuredGallery"),In=document.getElementById("featuredGrid"),jt=document.getElementById("archiveHeader"),Ft=document.getElementById("selectionHeader"),Je=document.getElementById("cancelSelectionBtn"),En=document.getElementById("selectionCount");document.getElementById("deleteSelectedBtn");const Qe=document.getElementById("profileBtn"),Xe=document.getElementById("archiveShareBtn"),Ye=document.getElementById("archiveDeleteBtn"),Ze=document.getElementById("archiveSettingsBtn"),et=document.getElementById("settingsBackBtn"),tt=document.getElementById("userSettingsGuideBtn"),nt=document.getElementById("userSettingsQrBtn"),I=document.getElementById("user-push-toggle"),E=document.getElementById("user-push-status-text"),ot=document.getElementById("userSettingsAdminAuthBtn"),Me=document.getElementById("user-admin-auth-modal"),V=document.getElementById("user-admin-password"),at=document.getElementById("userAdminAuthCancelBtn"),it=document.getElementById("userAdminAuthConfirmBtn"),j=document.getElementById("user-admin-auth-message"),Pe=document.getElementById("user-qr-code-modal");document.getElementById("userQrCloseBtn");const st=document.getElementById("user-copy-qr-button"),J=document.getElementById("notificationModal"),be=document.getElementById("notificationList"),rt=document.getElementById("emptyNotificationMessage"),ct=document.getElementById("closeNotificationModalBtn"),de=document.getElementById("notificationBadge");let Ot=!1;const Rt=document.getElementById("adminSettingsPage"),lt=document.getElementById("adminSettingsBackBtn"),G=document.getElementById("authSection"),dt=document.getElementById("authForm"),te=document.getElementById("authPassword"),H=document.getElementById("adminPromptSettingsSection"),xe=document.getElementById("adminImagePromptTextarea"),ke=document.getElementById("adminTextPromptTextarea"),ut=document.getElementById("adminSavePromptsBtn"),gt=document.getElementById("adminResetPromptsBtn"),mt=document.getElementById("adminImageSynthesisPromptTextarea"),ne=document.getElementById("adminGenerateImageBtn"),ht=document.getElementById("adminVideoGenerationPromptTextarea"),oe=document.getElementById("adminGenerateVideoBtn"),Vt=window.SpeechRecognition||window.webkitSpeechRecognition;let F=Vt?new Vt:null,pt=!1,O=null,Ae=!1;const k=window.speechSynthesis;let De=[],$e=!1,ae=!1,z=null,Gt=0,M=null,ft=!1;const Sn={"ko-KR":{ios:["Sora","Yuna","Korean","한국어"],default:["Microsoft Heami","Korean","한국어"]},"en-US":{default:["Samantha","Microsoft Zira","Google US English","English"]},"ja-JP":{default:["Kyoko","Microsoft Haruka","Google 日本語","Japanese"]},"zh-CN":{default:["Ting-Ting","Microsoft Huihui","Google 普通话","Chinese"]},"fr-FR":{default:["Thomas","Microsoft Hortense","Google français","French"]},"de-DE":{default:["Anna","Microsoft Hedda","Google Deutsch","German"]},"es-ES":{default:["Monica","Microsoft Helena","Google español","Spanish"]}};async function Bn(){if(M)return M;if(ft)return await new Promise(e=>setTimeout(e,500)),M||null;ft=!0;try{const e=await fetch("/api/voice-configs");if(e.ok){const t=await e.json();M={};for(const n of t)M[n.langCode]||(M[n.langCode]={}),M[n.langCode][n.platform]={priorities:n.voicePriorities,excludeVoices:n.excludeVoices||[]};console.log("🔊 [Voice DB] 설정 로드 완료:",Object.keys(M))}}catch(e){console.warn("🔊 [Voice DB] 로드 실패, 기본값 사용:",e.message)}return ft=!1,M}function Cn(){const e=navigator.userAgent;return/iPhone|iPad|iPod|Mac/.test(e)?"ios":/Android/.test(e)?"android":/Windows/.test(e)?"windows":"default"}function Ht(e){const t=Cn();if(M&&M[e]){const o=M[e][t]||M[e].default;if(o)return{priorities:o.priorities,excludeVoices:o.excludeVoices}}const n=Sn[e];return n?{priorities:n[t]||n.default||n[Object.keys(n)[0]],excludeVoices:[]}:{priorities:[],excludeVoices:[]}}Bn();let $={complete:!1,observer:null,timeoutId:null};function Tn(){if((localStorage.getItem("appLanguage")||"ko")==="ko"){$.complete=!0,console.log("[Translation] 한국어 - 번역 대기 불필요");return}if(document.body.classList.contains("translated-ltr")||document.body.classList.contains("translated-rtl")){$.complete=!0,console.log("[Translation] 이미 번역 완료됨");return}$.complete=!1,$.observer=new MutationObserver(n=>{var a;(document.body.classList.contains("translated-ltr")||document.body.classList.contains("translated-rtl"))&&(console.log("[Translation] 🌐 번역 완료 감지!"),$.complete=!0,(a=$.observer)==null||a.disconnect(),window.dispatchEvent(new CustomEvent("appTranslationComplete")))}),$.observer.observe(document.body,{attributes:!0,attributeFilter:["class"]}),$.timeoutId=setTimeout(()=>{var n;$.complete||(console.log("[Translation] 번역 타임아웃 - 원본 사용"),$.complete=!0,(n=$.observer)==null||n.disconnect(),window.dispatchEvent(new CustomEvent("appTranslationComplete",{detail:{timeout:!0}})))},3e3)}async function Mn(){(localStorage.getItem("appLanguage")||"ko")==="ko"||$.complete||(console.log("[TTS] 번역 완료 대기 중..."),await new Promise(t=>{const n=()=>{window.removeEventListener("appTranslationComplete",n),t()};window.addEventListener("appTranslationComplete",n),setTimeout(t,3500)}))}Tn();let R="ko";function Pn(){if(R&&R!=="ko")return R;const e=document.cookie.split(";");for(const t of e){const[n,o]=t.trim().split("=");if(n==="googtrans"&&o){const a=o.match(/\/ko\/([a-z]{2}(-[A-Z]{2})?)/);if(a)return R=a[1],R}}return"ko"}async function An(){try{const e=await fetch("/api/profile/language");if(e.ok&&(R=(await e.json()).language||"ko",console.log("🌐 사용자 선호 언어 로드:",R),R!=="ko")){localStorage.setItem("appLanguage",R);const n=window.location.hostname;document.cookie=`googtrans=/ko/${R}; path=/; domain=${n}`,document.cookie=`googtrans=/ko/${R}; path=/`,console.log("🌐 DB 언어 → localStorage/쿠키 동기화 완료")}}catch(e){console.warn("언어 로드 실패:",e)}}function _t(e){const t=Pn();return t==="ko"?e:`${e}?lang=${t}`}const zt=new Map;function ie(e,t,n=500){const o=Date.now(),a=zt.get(e)||0;return o-a<n?!1:(zt.set(e,o),t(),!0)}let y={imageDataUrl:null,description:""},U=!1;const ue={GUEST_DETAIL_LIMIT:3,GUEST_SHARE_LIMIT:999999,DETAIL_CREDIT_COST:2,SHARE_CREDIT_COST:0};function Kt(){return{detail:parseInt(localStorage.getItem("guestDetailUsage")||"0"),share:parseInt(localStorage.getItem("guestShareUsage")||"0")}}function Dn(e){const t=e==="detail"?"guestDetailUsage":"guestShareUsage",n=parseInt(localStorage.getItem(t)||"0");localStorage.setItem(t,(n+1).toString())}function qt(){return localStorage.getItem("adminAuthenticated")==="true"}async function Le(){try{const e=await fetch("/api/auth/user",{credentials:"include"});if(e.ok){const t=await e.json();return t&&(t.id||t.email)?(console.log("✅ 인증된 사용자:",t.email||t.id),t):t.authenticated?t.user:null}return null}catch(e){return console.error("Auth check error:",e),null}}async function $n(){try{const e=await fetch("/api/profile/credits",{credentials:"include"});return e.ok&&(await e.json()).credits||0}catch(e){return console.error("Credits check error:",e),0}}function Un(){const e=document.getElementById("authModal");e&&(e.classList.remove("hidden"),e.classList.remove("pointer-events-none"),e.classList.add("pointer-events-auto")),s("무료 체험이 끝났습니다. 로그인하면 35 크레딧을 드려요!")}function Nn(){s("크레딧이 부족합니다. 프로필에서 충전해주세요."),setTimeout(()=>{window.open("/profile.html","_blank")},1500)}async function wt(e="detail"){if(qt())return console.log("🔓 관리자 모드: 사용량 제한 없음"),!0;if(!await Le()){const a=Kt(),i=e==="detail"?ue.GUEST_DETAIL_LIMIT:ue.GUEST_SHARE_LIMIT,r=e==="detail"?a.detail:a.share;return r>=i?(console.log(`🔒 비가입자 ${e} 제한 초과: ${r}/${i}`),Un(),!1):(console.log(`✅ 비가입자 ${e} 허용: ${r+1}/${i}`),!0)}const n=await $n(),o=e==="detail"?ue.DETAIL_CREDIT_COST:ue.SHARE_CREDIT_COST;return n<o?(console.log(`🔒 크레딧 부족: ${n}/${o}`),Nn(),!1):(console.log(`✅ 크레딧 충분: ${n} (필요: ${o})`),!0)}async function jn(e="detail"){if(qt())return;if(await Le())try{const n=e==="detail"?ue.DETAIL_CREDIT_COST:ue.SHARE_CREDIT_COST,o=e==="detail"?"AI 응답 생성":"공유페이지 생성";await fetch("/api/profile/use-credits",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({amount:n,description:o})}),console.log(`💳 크레딧 차감: -${n} (${o})`)}catch(n){console.error("크레딧 차감 오류:",n)}else{Dn(e);const n=Kt();console.log(`📊 비가입자 사용량 업데이트: detail=${n.detail}, share=${n.share}`)}}let S=[],yt=!1,Ue="",vt=null,Ie=!1;async function Fn(){if(Ue)return Ue;try{return Ue=(await(await fetch("/api/config")).json()).googleMapsApiKey,Ue}catch(e){return console.error("Google Maps API 키 로드 실패:",e),""}}function Wt(e){if(yt){e&&e();return}Fn().then(t=>{if(!t){console.error("Google Maps API 키가 없습니다.");return}const n=document.createElement("script");n.src=`https://maps.googleapis.com/maps/api/js?key=${t}&libraries=places`,n.async=!0,n.defer=!0,n.onload=()=>{yt=!0,vt=new google.maps.Geocoder,console.log("🗺️ Google Maps API 로드 완료"),e&&e()},n.onerror=()=>{console.error("Google Maps API 로드 실패")},document.head.appendChild(n)})}async function Jt(e,t){return console.log("🔍 랜드마크 검색 시작:",e,t),!yt||!window.google?(console.warn("⚠️ Google Maps가 로드되지 않음"),null):new Promise(n=>{const o=new google.maps.Map(document.createElement("div")),a=new google.maps.places.PlacesService(o),i=new google.maps.LatLng(e,t);console.log("🔍 Places Nearby Search 호출 (반경 100m)...");const r={location:i,radius:100,rankBy:google.maps.places.RankBy.PROMINENCE};a.nearbySearch(r,(c,d)=>{if(console.log("📡 Places API 응답:",d),d===google.maps.places.PlacesServiceStatus.OK&&c&&c.length>0){const g=c.find(p=>p.types.includes("tourist_attraction")||p.types.includes("museum")||p.types.includes("church")||p.types.includes("park")||p.types.includes("lodging")||p.types.includes("point_of_interest"))||c[0],m=g.name;console.log("🎯 근처 장소:",m,"(타입:",g.types.join(", ")+")"),n(m)}else{if(console.log("📍 Places API 실패, Geocoding으로 전환"),!vt){console.warn("⚠️ Geocoder 초기화 안 됨"),n(null);return}vt.geocode({location:{lat:e,lng:t}},(g,m)=>{var p;if(m==="OK"&&g[0]){const u=((p=g[0].address_components.find(b=>b.types.includes("locality")))==null?void 0:p.long_name)||g[0].formatted_address.split(",")[0];console.log("📍 도시 찾음:",u),n(u)}else console.warn("⚠️ 위치 정보 찾기 실패"),n(null)})}})})}const On="TravelGuideDB",Rn=2,Q="archive",Ne="shareLinks";let K;function Vn(){return new Promise((e,t)=>{const n=indexedDB.open(On,Rn);n.onerror=o=>t("IndexedDB error: "+o.target.errorCode),n.onsuccess=o=>{K=o.target.result,e(K)},n.onupgradeneeded=o=>{const a=o.target.result;a.objectStoreNames.contains(Q)||a.createObjectStore(Q,{keyPath:"id"}),a.objectStoreNames.contains(Ne)||a.createObjectStore(Ne,{keyPath:"id"}).createIndex("featured","featured",{unique:!1})}})}function Qt(e){return new Promise(async(t,n)=>{if(!K)return n("DB not open");const o=e.id||`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,a={...e,id:o},c=K.transaction([Q],"readwrite").objectStore(Q).add(a);c.onsuccess=()=>t(c.result),c.onerror=d=>n("Error adding item: "+d.target.error)})}function je(){return new Promise((e,t)=>{if(!K)return t("DB not open");const a=K.transaction([Q],"readonly").objectStore(Q).getAll();a.onsuccess=()=>e(a.result.reverse()),a.onerror=i=>t("Error getting items: "+i.target.error)})}function Gn(e){return new Promise((t,n)=>{if(!K)return n("DB not open");const a=K.transaction([Q],"readwrite").objectStore(Q);let i=[];e.forEach(r=>{i.push(new Promise((c,d)=>{const g=a.delete(r);g.onsuccess=c,g.onerror=d}))}),Promise.all(i).then(t).catch(n)})}function bt(e,t,n,o,a,i,r=!1,c="ko"){const d=u=>u.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),g=a.map((u,b)=>`
            <div class="gallery-item" data-id="${b}">
                <img src="${u.imageDataUrl||""}" alt="가이드 ${b+1}" loading="lazy">
                <p>가이드 ${b+1}</p>
            </div>
        `).join(""),m=JSON.stringify({language:c,items:a.map((u,b)=>({id:b,imageDataUrl:u.imageDataUrl||"",description:u.description||""}))}),p=u=>btoa(encodeURIComponent(u).replace(/%([0-9A-F]{2})/g,(b,v)=>String.fromCharCode("0x"+v)));return`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${d(e)} - 손안에 가이드</title>
    <link rel="manifest" href="data:application/json;base64,${p(JSON.stringify({name:e,short_name:e,start_url:".",display:"standalone",theme_color:"#4285F4"}))}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            background-color: #f0f2f5;
            overflow-x: hidden;
        }
        .hidden { display: none !important; }
        
        /* 앱과 100% 동일한 CSS (복사) */
        .full-screen-bg { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            object-fit: cover; 
            z-index: 1; 
        }
        .ui-layer { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            z-index: 10; 
            display: flex; 
            flex-direction: column;
        }
        .header-safe-area { 
            position: relative;
            width: 100%; 
            height: 80px; 
            flex-shrink: 0; 
            z-index: 20;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 0 1rem;
        }
        .content-safe-area { 
            flex: 1; 
            overflow-y: auto; 
            -webkit-overflow-scrolling: touch; 
            background: transparent;
            z-index: 25;
        }
        .footer-safe-area { 
            width: 100%; 
            height: 100px; 
            flex-shrink: 0; 
            z-index: 30; 
            display: flex; 
            justify-content: space-around; 
            align-items: center; 
            padding: 0 1rem;
        }
        
        /* 텍스트 오버레이 */
        .text-content {
            padding: 2rem 1.5rem;
            line-height: 1.8;
            word-break: keep-all;
            overflow-wrap: break-word;
        }
        .readable-on-image {
            color: white;
            text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.95);
        }
        
        /* 버튼 공통 스타일 (앱과 동일) */
        .interactive-btn {
            transition: transform 0.1s ease;
            cursor: pointer;
            border: none;
        }
        .interactive-btn:active {
            transform: scale(0.95);
        }
        
        /* 헤더 (메타데이터) */
        .header {
            padding: 20px;
            background-color: #4285F4; /* Gemini Blue - 앱 통일 */
            color: #fff;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 15px 0;
            font-size: 28px;
        }
        .metadata {
            font-size: 14px;
            opacity: 0.9;
        }
        .metadata p {
            margin: 5px 0;
        }
        
        /* 갤러리 뷰 */
        #gallery-view {
            padding: 15px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        /* 반응형: 태블릿/노트북/PC (768px 이상) */
        @media (min-width: 768px) {
            .gallery-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            #gallery-view {
                padding: 30px;
            }
        }
        
        .gallery-item {
            cursor: pointer;
            text-align: center;
        }
        .gallery-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            background-color: #e9e9e9;
        }
        .gallery-item:hover img {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        }
        .gallery-item p {
            margin: 8px 0 0;
            font-weight: 700;
            color: #333;
            font-size: 14px;
        }
        
        /* 갤러리 하단 버튼 */
        .gallery-footer {
            text-align: center;
            padding: 30px 15px;
        }
        .app-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #4285F4;
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
            transition: all 0.3s;
        }
        .app-button:hover {
            background: #3367D6;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4);
        }
    </style>
</head>
<body>
    <!-- 카카오톡/인앱 브라우저 → Chrome 자동 리다이렉트 (2025-12-02) -->
    <!-- 1단계: Intent URL로 Chrome 시도, 2단계: 실패 시 fallback URL로 자동 열림 -->
    <script>
        (function() {
            var ua = navigator.userAgent.toLowerCase();
            var isInApp = ua.indexOf('kakaotalk') > -1 || ua.indexOf('naver') > -1 || ua.indexOf('instagram') > -1 || ua.indexOf('fb') > -1 || ua.indexOf('facebook') > -1;
            if (isInApp && /android/i.test(ua)) {
                var currentUrl = location.href;
                var url = currentUrl.replace(/^https?:\\/\\//, '');
                location.href = 'intent://' + url + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(currentUrl) + ';end';
            }
        })();
    <\/script>
    
    <!-- ❌ X 닫기 버튼 (우측 상단, 최상위 z-index) -->
    <button id="closeWindowBtn" onclick="window.close()" title="페이지 닫기" style="position: fixed; top: 1rem; right: 1rem; z-index: 10000; width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); border-radius: 50%; color: #4285F4; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); border: none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
    
    <!-- 헤더 (메타데이터) -->
    <div class="header">
        <h1>${d(e)}</h1>
        <div class="metadata">
            <p>👤 ${d(t)} 님이 보냄</p>
            <p>📍 ${d(n)}</p>
            <p>📅 ${d(o)}</p>
        </div>
    </div>
    
    <!-- 갤러리 뷰 -->
    <div id="gallery-view">
        ${r?`
        <!-- 🔙 추천 갤러리 전용 리턴 버튼 (왼쪽 상단, 앱과 통일) -->
        <div style="position: sticky; top: 0; z-index: 100; height: 60px; display: flex; align-items: center; padding: 0 1rem; background: #4285F4;">
            <button onclick="window.location.href='${i}/#archive'" style="width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(255, 255, 255, 0.95); color: #4285F4; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s;" aria-label="보관함으로 돌아가기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </div>
        `:""}
        <div class="gallery-grid">
            ${g}
        </div>
        <div class="gallery-footer">
            <a href="${i}" class="app-button" id="home-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                손안에 가이드 시작하기
            </a>
        </div>
    </div>
    
    <!-- 상세 뷰 (앱과 100% 동일한 구조) -->
    <div id="detail-view" class="ui-layer hidden">
        <img id="detail-bg" src="" class="full-screen-bg">
        <header class="header-safe-area">
            <button id="detail-back" class="interactive-btn" style="width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: absolute; top: 50%; left: 1rem; transform: translateY(-50%);" aria-label="뒤로가기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
        </header>
        <div class="content-safe-area">
            <div id="detail-text" class="text-content hidden">
                <p id="detail-description" class="readable-on-image" style="font-size: 1.25rem; line-height: 1.75rem;"></p>
            </div>
        </div>
        <footer id="detail-footer" class="footer-safe-area hidden" style="background: transparent;">
            <button id="detail-audio" class="interactive-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);" aria-label="오디오 재생">
                <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem;" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.648c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
                <svg id="pause-icon" xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem; display: none;" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
                </svg>
            </button>
            <button id="text-toggle" class="interactive-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);" aria-label="해설 읽기">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>
            <a href="${i}" id="detail-home" class="interactive-btn" style="width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); color: #4285F4; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); text-decoration: none;" aria-label="앱으로 이동">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </a>
        </footer>
    </div>
    
    <!-- 데이터 저장 -->
    <script id="app-data" type="application/json">${m}<\/script>
    
    <script>
        // 데이터 로드
        const appData = JSON.parse(document.getElementById('app-data').textContent);
        const galleryView = document.getElementById('gallery-view');
        const detailView = document.getElementById('detail-view');
        const header = document.querySelector('.header');
        
        // Web Speech API
        const synth = window.speechSynthesis;
        let voices = [];
        let currentUtterance = null;
        
        // 언어 코드 매핑
        const langCodeMap = {
            'ko': 'ko-KR',
            'en': 'en-US',
            'ja': 'ja-JP',
            'zh-CN': 'zh-CN',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'es': 'es-ES'
        };
        
        // 선택 언어에 맞는 음성 찾기 (플랫폼별 최적화)
        function getVoiceForLanguage(userLang, allVoices) {
            const langCode = langCodeMap[userLang] || 'ko-KR';
            
            // 플랫폼별 최적 음성 우선순위 (2025-12-07: 한국어 iOS/Android 분기)
            const isIOS = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
            const voicePriority = {
                'ko-KR': isIOS ? ['Sora', 'Yuna', 'Korean', '한국어'] : ['Microsoft Heami', 'Korean', '한국어'],
                'en-US': ['Samantha', 'Microsoft Zira', 'Google US English', 'English'],
                'ja-JP': ['Kyoko', 'Microsoft Haruka', 'Google 日本語', 'Japanese'],
                'zh-CN': ['Ting-Ting', 'Microsoft Huihui', 'Google 普通话', 'Chinese'],
                'fr-FR': ['Thomas', 'Microsoft Hortense', 'Google français', 'French'],
                'de-DE': ['Anna', 'Microsoft Hedda', 'Google Deutsch', 'German'],
                'es-ES': ['Monica', 'Microsoft Helena', 'Google español', 'Spanish']
            };
            
            let targetVoice = null;
            
            // 우선순위대로 음성 찾기
            const priorities = voicePriority[langCode] || [];
            for (const voiceName of priorities) {
                targetVoice = allVoices.find(v => v.name.includes(voiceName));
                if (targetVoice) break;
            }
            
            // 우선순위에 없으면 언어 코드로 찾기 (Android underscore 형식 대응)
            if (!targetVoice) {
                const langPrefix = langCode.substring(0, 2);
                targetVoice = allVoices.find(v => 
                    v.lang.replace('_', '-').startsWith(langPrefix) && 
                    v.lang.replace('_', '-').includes(langCode.substring(3))
                );
            }
            
            // 그래도 없으면 언어 앞 2자리만 매칭
            if (!targetVoice) {
                targetVoice = allVoices.find(v => v.lang.replace('_', '-').startsWith(langCode.substring(0, 2)));
            }
            
            return targetVoice;
        }
        
        function populateVoiceList() {
            const userLang = appData.language || 'ko'; // 저장된 언어 사용 (localStorage 대신)
            const allVoices = synth.getVoices();
            
            // 선택 언어에 맞는 음성 필터링
            const langCode = langCodeMap[userLang] || 'ko-KR';
            voices = allVoices.filter(v => v.lang.startsWith(langCode.substring(0, 2)));
            
            console.log('🎤 [음성로드]', langCodeMap[userLang], '음성 개수:', voices.length);
        }
        
        function stopAudio() {
            if (synth.speaking) {
                synth.pause();
                synth.cancel();
            }
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
        
        async function playAudio(text) {
            stopAudio();
            
            // 🌐 구글 번역 완료 대기 (번역된 텍스트로 TTS 재생)
            await waitForTranslation();
            
            // ⚠️ **핵심 로직 - 절대 수정 금지!** (2025-10-03 치명적 버그 해결)
            // 
            // 문제: HTML 내부 JavaScript에서 정규식 /<brs*/?>/gi 사용 시
            //       HTML 파서가 < > 를 &lt; &gt; 로 변환하여 JavaScript 파싱 에러 발생
            //       → "Uncaught SyntaxError: Unexpected token '&'" 
            //
            // 해결: new RegExp() 방식으로 HTML 파서와 100% 분리
            //       - 안전성: HTML escape 문제 원천 차단
            //       - 호환성: 모든 브라우저 지원
            //       - 영구성: 앞으로 절대 깨지지 않음
            //
            // 영향: 27개 기존 공유 페이지 DB 일괄 업데이트 완료 (2025-10-03)
            const cleanText = text.replace(new RegExp('<br\\s*/?>', 'gi'), ' ');
            
            // 문장 분리 및 하이라이트 준비
            const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
            const textElement = document.getElementById('detail-description');
            
            // 원본 텍스트 저장
            const originalText = cleanText;
            
            currentUtterance = new SpeechSynthesisUtterance(cleanText);
            
            // 선택 언어에 맞는 음성 자동 선택 (저장된 언어 사용)
            const userLang = appData.language || 'ko';
            const langCode = langCodeMap[userLang] || 'ko-KR';
            
            // 모든 언어에 대해 voicePriority에서 음성 선택
            const targetVoice = getVoiceForLanguage(userLang, synth.getVoices());
            currentUtterance.voice = targetVoice;
            currentUtterance.lang = langCode;
            currentUtterance.rate = 1.0;
            console.log('🎤 [음성재생]', langCode, '음성:', targetVoice?.name || 'default');
            
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            
            let currentSentenceIndex = 0;
            
            currentUtterance.onstart = () => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            };
            
            // 단어 경계마다 하이라이트
            currentUtterance.onboundary = (event) => {
                if (event.name === 'sentence') {
                    // 현재 문장 하이라이트
                    const highlightedHTML = sentences.map((sentence, idx) => {
                        if (idx === currentSentenceIndex) {
                            return '<span style="background-color: rgba(66, 133, 244, 0.3); font-weight: 600;">' + sentence + '</span>';
                        }
                        return sentence;
                    }).join('');
                    
                    textElement.innerHTML = highlightedHTML;
                    currentSentenceIndex++;
                }
            };
            
            currentUtterance.onend = () => {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                // 하이라이트 제거, 원본 복원
                textElement.textContent = originalText;
            };
            
            synth.speak(currentUtterance);
        }
        
        populateVoiceList();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = populateVoiceList;
        }
        
        // 갤러리 아이템 클릭 (앱과 100% 동일한 로직)
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const itemData = appData.items[parseInt(item.dataset.id)];
                
                // 배경 이미지 설정
                document.getElementById('detail-bg').src = itemData.imageDataUrl;
                
                // 텍스트 설정
                document.getElementById('detail-description').textContent = itemData.description;
                
                // UI 표시
                galleryView.classList.add('hidden');
                header.classList.add('hidden');
                detailView.classList.remove('hidden');
                document.getElementById('detail-footer').classList.remove('hidden');
                
                // 텍스트는 표시 상태로 시작 (음성과 동시에 보임)
                document.getElementById('detail-text').classList.remove('hidden');
                
                // 음성 자동 재생
                playAudio(itemData.description);
            });
        });
        
        // 🔙 보관함으로 돌아가기 버튼 (갤러리 뷰)
        const galleryBackBtn = document.getElementById('gallery-back-btn');
        if (galleryBackBtn) {
            galleryBackBtn.addEventListener('click', () => {
                window.location.href = '/#archive';
            });
        }
        
        // 뒤로 가기
        document.getElementById('detail-back').addEventListener('click', () => {
            stopAudio();
            detailView.classList.add('hidden');
            document.getElementById('detail-text').classList.add('hidden');
            document.getElementById('detail-footer').classList.add('hidden');
            header.classList.remove('hidden');
            galleryView.classList.remove('hidden');
        });
        
        // 텍스트 토글 버튼 (앱과 동일한 로직)
        document.getElementById('text-toggle')?.addEventListener('click', () => {
            document.getElementById('detail-text').classList.toggle('hidden');
        });
        
        // 음성 재생/정지
        document.getElementById('detail-audio').addEventListener('click', () => {
            if (synth.speaking) {
                stopAudio();
            } else {
                const text = document.getElementById('detail-description').textContent;
                playAudio(text);
            }
        });
        
        // 홈 버튼 (갤러리 하단)
        const homeButton = document.getElementById('home-button');
        if (homeButton) {
            homeButton.addEventListener('click', (e) => {
                e.preventDefault();
                stopAudio();
                setTimeout(() => {
                    window.location.href = homeButton.href;
                }, 200);
            });
        }
        
        // 홈 버튼 (상세 뷰 하단) - 음성 듣다가 바로 앱으로 가기
        const detailHome = document.getElementById('detail-home');
        if (detailHome) {
            detailHome.addEventListener('click', (e) => {
                e.preventDefault();
                stopAudio();
                setTimeout(() => {
                    window.location.href = detailHome.href;
                }, 200);
            });
        }
        
        // 페이지 이탈 시 오디오 정지 (백그라운드 재생 방지)
        window.addEventListener('beforeunload', () => {
            stopAudio();
        });
    <\/script>
    
    <!-- ⚠️ 핵심 로직: Service Worker 등록 (오프라인 지원) -->
    <script>
        // Service Worker 지원 확인 및 등록
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw-share.js')
                    .then(registration => {
                        console.log('✅ [SW] 등록 성공:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ [SW] 등록 실패:', error);
                    });
            });
        } else {
            console.log('⚠️ [SW] Service Worker를 지원하지 않는 브라우저입니다.');
        }
    <\/script>
</body>
</html>`}function Hn(e,t){const n=new Blob([t],{type:"text/html;charset=utf-8"}),o=URL.createObjectURL(n),a=document.createElement("a");a.href=o,a.download=e,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(o)}window.downloadFeaturedHTML=async function(e){try{const o=K.transaction([Ne],"readonly").objectStore(Ne).get(e);o.onsuccess=()=>{const a=o.result;if(a){const i=window.location.origin,r=localStorage.getItem("appLanguage")||"ko",c=bt(a.title,a.sender,a.location,a.date,a.guideItems,i,!1,r);Hn(`${a.title}-손안에가이드.html`,c),s("다운로드가 시작되었습니다.")}}}catch(t){console.error("Download error:",t),s("다운로드 중 오류가 발생했습니다.")}};function s(e,t=3e3){if(!B)return;const n=document.createElement("div");n.className="toast-notification",n.textContent=e,B.appendChild(n),requestAnimationFrame(()=>{n.classList.add("show")}),setTimeout(()=>{n.classList.remove("show"),n.addEventListener("transitionend",()=>{n.remove()})},t)}function ge(e){[Ce,X,W,Pt,At,Rt].forEach(t=>{t&&t.classList.toggle("visible",t===e)})}function xt(){Ie=!1,k.cancel(),me(),ge(X),W.classList.remove("bg-friendly"),Dt.classList.add("hidden"),Ln.classList.remove("hidden");const e=localStorage.getItem("cameraWasActive")==="true";O&&!Ae?tn():!O&&e&&(console.log("🔄 Restoring camera after Featured page visit"),en())}function kt(e=!1){Oe(),ge(W),ee.disabled=e}async function Ee(){Oe(),k.cancel(),me(),U&&se(!1),ge(Pt),Se()}async function Lt(){Oe(),mo(),ho(),ge(At)}function me(){k.cancel(),De=[],$e=!1,ae=!1,z&&z.classList.remove("speaking"),z=null}let It=null;async function _n(){try{const e=await fetch("/api/notifications/unread-count",{credentials:"include"});return e.ok&&(await e.json()).count||0}catch(e){return console.warn("알림 수 조회 실패:",e),0}}async function Et(){const e=await _n();de&&(e>0?(de.textContent=e>99?"99+":e,de.classList.remove("hidden")):de.classList.add("hidden"))}async function Xt(){try{const e=await fetch("/api/notifications",{credentials:"include"});return e.ok?await e.json():[]}catch(e){return console.warn("알림 목록 조회 실패:",e),[]}}function Yt(e){if(!(!be||!rt)){if(e.length===0){be.classList.add("hidden"),rt.classList.remove("hidden");return}be.classList.remove("hidden"),rt.classList.add("hidden"),be.innerHTML=e.map(t=>{const n=t.isRead,o=Kn(new Date(t.createdAt)),a=zn(t.type);return`
                <div class="notification-item flex items-start gap-3 p-3 rounded-lg ${n?"opacity-60":"bg-blue-50/50"}"
                     data-notification-id="${t.id}"
                     data-testid="notification-item-${t.id}">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        ${a}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 ${n?"":"font-semibold"}">${t.title}</p>
                        <p class="text-sm text-gray-600 truncate">${t.body||""}</p>
                        <p class="text-xs text-gray-400 mt-1">${o}</p>
                    </div>
                    <button class="notification-delete-btn flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                            data-notification-id="${t.id}"
                            data-testid="button-delete-notification-${t.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `}).join(""),be.querySelectorAll(".notification-delete-btn").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation();const o=parseInt(t.dataset.notificationId);await qn(o),Et();const a=await Xt();Yt(a)})})}}function zn(e){switch(e){case"reward":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';case"system":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';case"new_content":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>';case"event":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>';case"urgent":return'<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';default:return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>'}}function Kn(e){const n=new Date-e,o=Math.floor(n/1e3),a=Math.floor(o/60),i=Math.floor(a/60),r=Math.floor(i/24);return o<60?"방금 전":a<60?`${a}분 전`:i<24?`${i}시간 전`:r<7?`${r}일 전`:e.toLocaleDateString("ko-KR")}async function qn(e){try{await fetch(`/api/notifications/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include"})}catch(t){console.warn("알림 삭제 실패:",t)}}async function Wn(){if(!J)return;J.classList.remove("hidden");const e=await Xt();Yt(e)}async function Zt(){if(J){J.classList.add("hidden"),Ot=!1;try{await fetch("/api/notifications/mark-read",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include"}),de&&de.classList.add("hidden")}catch(e){console.warn("알림 읽음 처리 실패:",e)}}}function Jn(){Et(),It&&clearInterval(It),It=setInterval(()=>{Et()},3e4)}ct==null||ct.addEventListener("click",Zt),J==null||J.addEventListener("click",e=>{e.target===J&&Zt()}),Qe==null||Qe.addEventListener("click",async()=>{if(!await Le()){window.open("/profile.html","_blank");return}try{((await(await fetch("/api/notifications/unread-count",{credentials:"include"})).json()).count||0)>0?(Ot=!0,Wn()):window.open("/profile.html","_blank")}catch(t){console.warn("알림 수 확인 실패:",t),window.open("/profile.html","_blank")}});async function Qn(){try{await An(),await Vn()}catch(n){console.error("Failed to open database",n),s("데이터베이스를 열 수 없습니다. 앱이 정상적으로 작동하지 않을 수 있습니다.")}new URLSearchParams(window.location.search).get("auth")==="failed"&&(console.error("❌ OAuth 인증 실패 감지"),s("로그인에 실패했습니다. 다시 시도해주세요."),window.history.replaceState({},"",window.location.pathname+window.location.hash),localStorage.removeItem("pendingShareUrl")),console.log("🔍 Checking for pending share URL...");const t=localStorage.getItem("pendingShareUrl");console.log("📦 localStorage.pendingShareUrl:",t),t?(console.log("🎯 Opening pending share URL after auth:",t),localStorage.removeItem("pendingShareUrl"),console.log("🗑️ Removed from localStorage"),setTimeout(()=>{console.log("🚀 Opening page in new window:",t),window.open(t,"_blank")},500)):console.log("❌ No pending URL found"),window.location.hash==="#archive"&&(console.log("📁 Direct archive access detected"),Ee()),F&&(F.continuous=!1,F.lang="ko-KR",F.interimResults=!1,F.maxAlternatives=1),Fe(),window.addEventListener("focus",Fe),window.addEventListener("visibilitychange",()=>{document.hidden||Fe()}),window.addEventListener("message",n=>{if(n.origin!==window.location.origin){console.warn("⚠️ Unauthorized message origin:",n.origin);return}if(n.data.type==="oauth_success"){console.log("✅ OAuth 팝업 성공 메시지 수신!"),l==null||l.classList.add("hidden"),l==null||l.classList.add("pointer-events-none"),l==null||l.classList.remove("pointer-events-auto");const o=localStorage.getItem("pendingShareUrl");o?(console.log("🎯 Opening pending URL in new window:",o),localStorage.removeItem("pendingShareUrl"),window.open(o,"_blank")):(console.log("🔄 Refreshing Featured Gallery"),an())}}),window.addEventListener("storage",n=>{n.key==="auth_success"&&n.newValue==="true"&&(console.log("🔔 Storage 이벤트 감지: auth_success = true"),Fe())}),Jn()}async function Fe(){if(console.log("🟡 Checking auth status..."),localStorage.getItem("auth_success")==="true"){console.log("✅ OAuth 인증 성공 플래그 감지!"),l==null||l.classList.add("hidden"),l==null||l.classList.add("pointer-events-none"),l==null||l.classList.remove("pointer-events-auto"),localStorage.removeItem("auth_success"),console.log("✅ Auth modal closed - OAuth redirect successful");const t=localStorage.getItem("pendingShareUrl");t&&(console.log("🎯 Opening pending share URL in new window:",t),localStorage.removeItem("pendingShareUrl"),window.open(t,"_blank"));return}try{const t=await fetch("/api/auth/user");if(console.log("🟡 Auth response:",t.ok,t.status),t.ok){console.log("🟡 Modal element:",l),l==null||l.classList.add("hidden"),l==null||l.classList.add("pointer-events-none"),l==null||l.classList.remove("pointer-events-auto"),console.log("✅ Auth modal closed - user is authenticated");const n=localStorage.getItem("pendingShareUrl");n&&(console.log("🎯 Opening pending share URL in new window:",n),localStorage.removeItem("pendingShareUrl"),window.open(n,"_blank"))}else console.log("⚪ Not authenticated, keeping modal state")}catch(t){console.log("⚠️ Auth check error:",t)}}async function en(){if(ge(X),Dt.classList.add("hidden"),k&&!k.speaking){const e=new SpeechSynthesisUtterance("");k.speak(e),k.cancel()}$t.classList.remove("hidden");try{O?tn():(await Xn(),localStorage.setItem("cameraWasActive","true"))}catch(e){console.error(`Initialization error: ${e.message}`),console.log("⚠️ 카메라 초기화 실패, 업로드 기능은 사용 가능합니다."),s("카메라를 시작할 수 없습니다. 업로드 기능을 사용해주세요.")}finally{$t.classList.add("hidden")}}function Xn(){return new Promise(async(e,t)=>{if(O&&O.getTracks().forEach(i=>i.stop()),!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){const i=new Error("카메라 기능을 지원하지 않는 브라우저입니다.");return t(i)}const n={video:{facingMode:{ideal:"environment"}},audio:!1},o={video:!0,audio:!1};let a;try{a=await navigator.mediaDevices.getUserMedia(n)}catch(i){console.warn("Could not get camera with ideal constraints, falling back to basic.",i);try{a=await navigator.mediaDevices.getUserMedia(o)}catch(r){return t(r)}}O=a,x.srcObject=O,x.play().catch(i=>console.error("Video play failed:",i)),x.onloadedmetadata=()=>{[fe,we,ce].forEach(i=>{i&&(i.disabled=!1)}),Ae=!0,e()},x.onerror=i=>t(new Error("Failed to load video stream."))})}function Oe(){O&&(O.getTracks().forEach(e=>e.enabled=!1),Ae=!1,localStorage.setItem("cameraWasActive","false"))}function tn(){O&&(O.getTracks().forEach(e=>e.enabled=!0),Ae=!0,x.play().catch(e=>console.error("Video resume play failed:",e)),localStorage.setItem("cameraWasActive","true"))}async function Yn(){if(!x.videoWidth||!x.videoHeight||!await wt("detail"))return;f.width=x.videoWidth,f.height=x.videoHeight;const t=f.getContext("2d");t&&(t.drawImage(x,0,0,f.width,f.height),Re(),nn(f.toDataURL("image/jpeg"),fe))}async function Re(){if(!navigator.geolocation){console.warn("⚠️ 브라우저가 위치 정보를 지원하지 않습니다");return}try{const e=await new Promise((o,a)=>{navigator.geolocation.getCurrentPosition(o,a,{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})}),t=e.coords.latitude,n=e.coords.longitude;window.currentGPS={latitude:t,longitude:n,locationName:null},console.log("📍 브라우저 위치 추출 성공:",window.currentGPS),Wt(async()=>{console.log("🗺️ callback 실행됨 (브라우저 GPS)");const o=await Jt(t,n);console.log("🔎 랜드마크 검색 결과:",o),o&&(window.currentGPS.locationName=o,console.log("✅ 위치 이름 저장 완료:",o))})}catch(e){e.code===1?console.log("ℹ️ 사용자가 위치 권한을 거부했습니다"):console.error("위치 정보 오류:",e),window.currentGPS=null}}async function Zn(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(t){if(!await wt("detail")){e.target.value="";return}try{if(window.exifr){const i=await exifr.gps(t);i&&i.latitude&&i.longitude?(window.currentGPS={latitude:i.latitude,longitude:i.longitude,locationName:null},console.log("📍 EXIF GPS 추출 성공:",window.currentGPS),Wt(async()=>{console.log("🗺️ callback 실행됨 (EXIF GPS)");const r=await Jt(i.latitude,i.longitude);console.log("🔎 랜드마크 검색 결과:",r),r&&(window.currentGPS.locationName=r,console.log("✅ 위치 이름 저장 완료:",r))})):(console.log("ℹ️ EXIF GPS 정보 없음 → 브라우저 위치 요청"),window.currentGPS=null,Re())}else console.warn("⚠️ exifr 라이브러리 로딩 실패 → 브라우저 위치 요청"),window.currentGPS=null,Re()}catch(i){console.error("GPS 추출 오류:",i),window.currentGPS=null,Re()}const a=new FileReader;a.onload=i=>{var r;return nn((r=i.target)==null?void 0:r.result,we)},a.readAsDataURL(t)}e.target.value=""}async function nn(e,t){t.disabled=!0,Ie=!1,(k.speaking||k.pending)&&k.cancel(),me(),kt(),y={imageDataUrl:e,description:""},Y.src=e,Y.classList.remove("hidden"),le.classList.remove("hidden"),P.classList.add("hidden"),P.classList.remove("animate-in"),Z.classList.remove("hidden"),Ut.textContent="해설 준비 중...",ye.classList.add("hidden"),N.innerHTML="",_("loading");const n=["사진 속 이야기를 찾아내고 있어요...","곧 재미있는 이야기를 들려드릴게요!"];let o=0;Te.innerText=n[o];const a=window.setInterval(()=>{o=(o+1)%n.length,Te.innerText=n[o]},2e3);try{const i=await To(e),r=i.split(",")[1];y.imageDataUrl=i;const c=Bo(r);clearInterval(a),le.classList.add("hidden"),P.classList.remove("hidden"),P.classList.add("animate-in"),Z.classList.add("hidden"),ye.classList.remove("hidden");let d="";for await(const g of c){const m=g.text;if(m){y.description+=m,d+=m;const p=/[.?!]/g;let u;for(;(u=p.exec(d))!==null;){const b=d.substring(0,u.index+1).trim();if(d=d.substring(u.index+1),b){const v=document.createElement("span");v.textContent=b+" ",N.appendChild(v),pe(b,v)}}}}if(d.trim()){const g=d.trim(),m=document.createElement("span");m.textContent=g+" ",N.appendChild(m),pe(g,m)}await jn("detail")}catch(i){console.error("분석 오류:",i),clearInterval(a),le.classList.add("hidden"),Z.classList.add("hidden"),P.classList.remove("hidden");let r="이미지 해설 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.";N.innerText=r,_("disabled")}finally{t.disabled=!1}}async function eo(){if(!F)return s("음성 인식이 지원되지 않는 브라우저입니다.");if(pt)return F.stop();await wt("detail")&&(pt=!0,ce.classList.add("mic-listening"),F.start(),F.onresult=t=>{to(t.results[0][0].transcript)},F.onerror=t=>{console.error("Speech recognition error:",t.error),s({"no-speech":"음성을 듣지 못했어요. 다시 시도해볼까요?","not-allowed":"마이크 사용 권한이 필요합니다.","service-not-allowed":"마이크 사용 권한이 필요합니다."}[t.error]||"음성 인식 중 오류가 발생했습니다.")},F.onend=()=>{pt=!1,ce.classList.remove("mic-listening")})}async function to(e){Ie=!1,(k.speaking||k.pending)&&k.cancel(),me(),kt(),W.classList.add("bg-friendly"),ee.disabled=!0,y={imageDataUrl:null,description:""},Y.src="",Y.classList.add("hidden"),le.classList.remove("hidden"),P.classList.add("hidden"),P.classList.remove("animate-in"),Z.classList.remove("hidden"),Ut.textContent="답변 준비 중...",ye.classList.add("hidden"),N.innerHTML="",_("loading");const t=["어떤 질문인지 살펴보고 있어요...","친절한 답변을 준비하고 있어요!"];let n=0;Te.innerText=t[n];const o=window.setInterval(()=>{n=(n+1)%t.length,Te.innerText=t[n]},2e3);try{const a=Co(e);clearInterval(o),le.classList.add("hidden"),P.classList.remove("hidden"),P.classList.add("animate-in"),Z.classList.add("hidden"),ye.classList.remove("hidden");let i="";for await(const r of a){const c=r.text;if(c){y.description+=c,i+=c;const d=/[.?!]/g;let g;for(;(g=d.exec(i))!==null;){const m=i.substring(0,g.index+1).trim();if(i=i.substring(g.index+1),m){const p=document.createElement("span");p.textContent=m+" ",N.appendChild(p),pe(m,p)}}}}if(i.trim()){const r=i.trim(),c=document.createElement("span");c.textContent=r+" ",N.appendChild(c),pe(r,c)}}catch(a){console.error("답변 오류:",a),clearInterval(o),P.classList.remove("hidden"),N.innerText="답변 생성 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.",_("disabled")}}function no(){const e=localStorage.getItem("appLanguage")||"ko",n={ko:"ko-KR",en:"en-US",ja:"ja-JP","zh-CN":"zh-CN",fr:"fr-FR",de:"de-DE",es:"es-ES"}[e]||"ko-KR";let o=null;const a=Ht(n),i=a.priorities,r=a.excludeVoices,c=k.getVoices();for(const d of i){const g=c.find(m=>m.name.includes(d)&&!r.some(p=>m.name.includes(p)));if(g){o=g.name;break}}return!o&&i.length>0&&(o=i[0],console.log("🎤 [음성] getVoices() 빈 배열 → 기본값 사용:",o)),{voiceLang:n,voiceName:o}}async function oo(){var e,t;if(!(!y.description||!y.imageDataUrl)){ee.disabled=!0;try{window.currentGPS&&(y.latitude=window.currentGPS.latitude,y.longitude=window.currentGPS.longitude,y.locationName=window.currentGPS.locationName,console.log("📍 GPS 데이터 저장:",window.currentGPS));const n=no();y.voiceLang=n.voiceLang,y.voiceName=n.voiceName,console.log("🎤 음성 정보 저장:",n);const o=await Qt(y);s("보관함에 저장되었습니다.");try{console.log("📦 guides DB 저장 시작...");const a=localStorage.getItem("appLanguage")||"ko",i=await fetch("/api/guides/batch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language:a,guides:[{localId:o,title:y.title||"제목 없음",description:y.description,imageDataUrl:y.imageDataUrl,latitude:(e=y.latitude)==null?void 0:e.toString(),longitude:(t=y.longitude)==null?void 0:t.toString(),locationName:y.locationName,aiGeneratedContent:y.description,voiceLang:n.voiceLang,voiceName:n.voiceName}]})});if(i.ok){const r=await i.json();console.log(`✅ guides DB 저장 완료: ${r.success}/${r.total}개`)}else console.warn("⚠️ guides DB 저장 실패 (인증 필요 또는 서버 오류)")}catch(a){console.error("⚠️ guides DB 저장 오류 (IndexedDB는 저장됨):",a)}window.currentGPS=null}catch(n){console.error("Failed to save to archive:",n),s("저장에 실패했습니다. 저장 공간이 부족할 수 있습니다."),ee.disabled=!1}}}function se(e){typeof e=="boolean"?U=e:U=!U;const t=document.getElementById("downloadSelectedBtnContainer");console.log("🔵 [Selection Mode] Toggling:",U),console.log("🔵 [Selection Mode] Download container exists:",!!t),U?(D.classList.add("selection-mode"),jt.classList.add("hidden"),Ft.classList.remove("hidden"),t==null||t.classList.remove("hidden"),console.log("✅ [Selection Mode] Download button shown"),S=[],on()):(D.classList.remove("selection-mode"),jt.classList.remove("hidden"),Ft.classList.add("hidden"),t==null||t.classList.add("hidden"),console.log("❌ [Selection Mode] Download button hidden"),S=[],document.querySelectorAll(".archive-item").forEach(n=>{n.classList.remove("selected")}))}function on(){En.textContent=`${S.length}개 선택`;const e=document.getElementById("downloadSelectedBtn");e&&(S.length>0?(e.disabled=!1,e.classList.remove("opacity-50","cursor-not-allowed")):(e.disabled=!0,e.classList.add("opacity-50","cursor-not-allowed")))}async function ao(){if(S.length!==0&&confirm(`선택된 ${S.length}개 항목을 삭제하시겠습니까?`))try{await Gn([...S]),await Se(),se(!1),s(`${S.length}개 항목이 삭제되었습니다.`)}catch(e){console.error("Failed to delete items:",e),s("삭제 중 오류가 발생했습니다.")}}let he=[];async function io(){const e=await je();if(e.length===0)return s("공유할 항목이 없습니다.");const t=U&&S.length>0?S.map(n=>e.find(o=>o.id===n)).filter(Boolean):e;if(t.length===0)return s("선택된 항목이 없습니다.");if(t.length>20)return s("한 번에 최대 20개까지 공유할 수 있습니다. 선택을 줄여주세요.");he=t,St(),h.classList.remove("hidden")}function St(){w.innerHTML=`
            <!-- 헤더 -->
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">공유 링크 생성</h2>
                <button id="closeShareModalBtn" data-testid="button-close-share-modal" class="p-2 text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
            </div>
            
            <!-- 폼 -->
            <div class="p-6 space-y-6">
                <!-- 링크 이름 입력 (필수) -->
                <div>
                    <label for="shareLinkName" class="block text-sm font-medium text-gray-700 mb-2">
                        링크 이름 <span class="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="shareLinkName" 
                        data-testid="input-share-link-name"
                        placeholder="예: 내가 맛본 파리 최악의 음식들"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxlength="50"
                    >
                    <p class="text-xs text-gray-500 mt-1">사용자의 창의력을 발휘해보세요!</p>
                </div>
                
                <!-- 링크 복사 버튼 -->
                <div>
                    <button 
                        id="copyShareLinkBtn" 
                        data-testid="button-copy-share-link"
                        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-lg flex items-center justify-center gap-3"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        <span>링크 복사하기</span>
                    </button>
                    <p class="text-xs text-gray-500 mt-2 text-center">링크를 복사해서 원하는 곳에 공유하세요</p>
                </div>
            </div>
        `;const e=document.getElementById("closeShareModalBtn"),t=document.getElementById("copyShareLinkBtn");e&&(e.onclick=()=>{h.classList.add("hidden")}),t&&(t.onclick=()=>so()),h.addEventListener("click",n=>{n.target===h&&h.classList.add("hidden")})}async function so(){var t,n;const e=document.getElementById("shareLinkName").value.trim();if(!e)return s("링크 이름을 먼저 입력해주세요!");w.innerHTML=`
            <div class="p-6 text-center">
                <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-lg font-semibold">링크 생성 중...</p>
            </div>
        `;try{const o=new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"});let a="여행자",i="파리, 프랑스";try{const v=await fetch("/api/auth/user");if(v.ok){const T=await v.json();T.firstName?a=`${T.firstName}${T.lastName?" "+T.lastName:""}`.trim():T.email&&(a=T.email.split("@")[0])}}catch(v){console.warn("사용자 정보 로드 실패:",v)}(t=he[0])!=null&&t.locationName&&(i=he[0].locationName);const r=window.location.origin,c=localStorage.getItem("appLanguage")||"ko",d=bt(e,a,i,o,he,r,!1,c),g={name:e,htmlContent:d,guideIds:he.map(v=>v.id),thumbnail:((n=he[0])==null?void 0:n.imageDataUrl)||null,featured:!1},m=await fetch("/api/share/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)});if(!m.ok){const v=await m.json();throw new Error(v.error||"서버 오류가 발생했습니다")}const p=await m.json(),u=`${window.location.origin}/s/${p.id}`;let b=!1;try{await navigator.clipboard.writeText(u),b=!0}catch(v){console.warn("클립보드 복사 실패 (권한 없음):",v)}U&&se(!1),await Se(),w.innerHTML=`
                <div class="p-8 text-center">
                    <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">링크 생성 완료!</h3>
                    ${b?`
                        <p class="text-lg text-gray-700 mb-3">✅ 링크가 클립보드에 복사되었습니다</p>
                        <p class="text-base text-gray-600">카카오톡, 문자, 메신저 등<br>원하는 곳에 붙여넣기 하세요!</p>
                    `:`
                        <p class="text-base text-gray-700 mb-4">아래 링크를 복사해서 공유하세요:</p>
                        <div class="bg-gray-100 p-4 rounded-lg mb-3">
                            <p class="text-sm font-mono text-gray-800 break-all">${u}</p>
                        </div>
                        <button onclick="navigator.clipboard.writeText('${u}').then(() => alert('복사 완료!'))" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            링크 복사하기
                        </button>
                    `}
                </div>
            `,setTimeout(()=>{h.classList.add("hidden")},3e3)}catch(o){console.error("Share error:",o),h.classList.add("hidden"),s("❌ "+o.message)}}async function ro(){var n;const e=await je();if(e.length===0)return s("공유할 항목이 없습니다.");const t=S.map(o=>e.find(a=>a.id===o)).filter(Boolean);if(t.length===0)return s("선택된 항목이 없습니다.");if(t.length>20)return s("한 번에 최대 20개까지 공유할 수 있습니다.");s("공유 페이지 생성 중...");try{const o=new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"}),a=`내 여행 가이드 ${new Date().toLocaleDateString("ko-KR")}`,i=window.location.origin,r=localStorage.getItem("appLanguage")||"ko",c=bt(a,"여행자","파리, 프랑스",o,t,i,!1,r),d={name:a,htmlContent:c,guideIds:t.map(u=>u.id),thumbnail:((n=t[0])==null?void 0:n.imageDataUrl)||null,sender:"여행자",location:"파리, 프랑스",featured:!1},g=await fetch("/api/share/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!g.ok){const u=await g.json();throw new Error(u.error||"서버 오류가 발생했습니다")}const m=await g.json(),p=`${window.location.origin}/s/${m.id}`;window.open(p,"_blank"),U&&se(!1),await Se(),s("✅ 가이드 페이지가 열렸습니다!")}catch(o){console.error("Download guide error:",o),s("❌ "+o.message)}}async function an(){try{const e=await fetch(`/api/share/featured/list?t=${Date.now()}`);if(!e.ok)return;const n=(await e.json()).pages||[];co(n)}catch(e){console.warn("Featured gallery not available yet:",e),ve==null||ve.classList.add("hidden")}}function co(e){e.length>0?(ve.classList.remove("hidden"),In.innerHTML=e.map((t,n)=>{const o=t.thumbnail||"",a=`${window.location.origin}/s/${t.id}`,i=t.name||"공유 페이지";return`
                    <div class="flex flex-col gap-2">
                        <div onclick="handleFeaturedClick('${a}')" 
                           class="relative block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                           data-testid="featured-${t.id}">
                            ${o?`
                                <img src="${o}" alt="${i}" 
                                     class="w-full aspect-square object-cover">
                            `:`
                                <div class="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <span class="text-4xl">📍</span>
                                </div>
                            `}
                            <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/20 flex items-start justify-center pt-4 px-4">
                                <h3 class="text-white font-extrabold text-center leading-tight line-clamp-2" 
                                    style="font-size: clamp(1rem, 4.5vw, 1.5rem); text-shadow: 0 3px 15px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8);">
                                    ${i}
                                </h3>
                            </div>
                            <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-lg" data-testid="download-count-${t.id}">
                                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                <span class="text-xs font-bold text-gray-700">${t.downloadCount||0}</span>
                            </div>
                        </div>
                        <button 
                            onclick="event.stopPropagation(); handleFeaturedDownload('${a}', ${n})"
                            data-testid="button-download-featured-${n}"
                            class="w-full py-2 px-3 flex items-center justify-center rounded-full transition-all interactive-btn"
                            aria-label="링크 복사">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style="color: #4285F4;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                        </button>
                    </div>
                `}).join("")):ve.classList.add("hidden")}window.handleFeaturedDownload=async function(e,t){console.log("📥 Featured Gallery download clicked:",e,"index:",t);const n=_t(e);console.log("🌐 Translated URL for sharing:",n);let o=!1;try{await navigator.clipboard.writeText(n),o=!0,console.log("✅ Link copied to clipboard:",n)}catch(a){console.warn("클립보드 복사 실패 (권한 없음):",a)}if(n.replace(/'/g,"\\'"),w.innerHTML=`
            <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">링크 복사 완료!</h3>
                ${o?`
                    <p class="text-lg text-gray-700 mb-3">✅ 링크가 클립보드에 복사되었습니다</p>
                    <p class="text-base text-gray-600">카카오톡, 문자, 메신저 등<br>원하는 곳에 붙여넣기 하세요!</p>
                `:`
                    <p class="text-base text-gray-700 mb-4">아래 링크를 복사해서 공유하세요:</p>
                    <div class="bg-gray-100 p-4 rounded-lg mb-3">
                        <p class="text-sm font-mono text-gray-800 break-all">${n}</p>
                    </div>
                    <button id="manualCopyBtn" data-url="${n}"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        링크 복사하기
                    </button>
                `}
            </div>
        `,!o){const a=document.getElementById("manualCopyBtn");a&&(a.onclick=async()=>{try{await navigator.clipboard.writeText(n),a.textContent="복사 완료!",setTimeout(()=>{h.classList.add("hidden"),St()},1e3)}catch(i){alert("복사 실패: "+i.message)}})}h.classList.remove("hidden"),setTimeout(()=>{h.classList.add("hidden"),St()},3e3)},window.handleFeaturedClick=async function(e){console.log("🔵 Featured Gallery clicked:",e);const t=_t(e);console.log("🌐 Translated URL:",t);try{const n=await fetch("/api/auth/user");if(console.log("🔵 Auth status:",n.ok,n.status),n.ok)console.log("✅ Authenticated! Opening shared page in new window:",t),window.open(t,"_blank")||(console.error("❌ 팝업 차단됨! (Fallback: 현재 탭 리다이렉트)"),window.location.href=t);else{console.log("❌ Not authenticated, showing auth modal"),console.log("💾 Saving original URL to localStorage (no language param):",e),localStorage.setItem("pendingShareUrl",e),console.log("✅ Saved! localStorage value:",localStorage.getItem("pendingShareUrl"));const o=document.getElementById("authModal");o?(o.classList.remove("hidden"),console.log("📱 Auth modal displayed")):(console.error("❌ Auth modal not found, falling back to Kakao login"),window.location.href="/api/auth/kakao")}}catch(n){console.log("❌ Auth check failed, showing auth modal:",n),console.log("💾 Saving original URL to localStorage (no language param):",e),localStorage.setItem("pendingShareUrl",e),console.log("✅ Saved! localStorage value:",localStorage.getItem("pendingShareUrl"));const o=document.getElementById("authModal");o?(o.classList.remove("hidden"),console.log("📱 Auth modal displayed")):(console.error("❌ Auth modal not found, falling back to Kakao login"),window.location.href="/api/auth/kakao")}};async function Se(){try{const e=await je();an(),e.length===0?(D.classList.add("hidden"),Nt.classList.remove("hidden")):(Nt.classList.add("hidden"),D.classList.remove("hidden"),D.innerHTML=e.map(t=>`
                    <div class="archive-item relative ${S.includes(t.id)?"selected ring-2 ring-blue-500":""}" // ✅ .has → .includes 
                         data-id="${t.id}" 
                         data-testid="card-archive-${t.id}"
                         tabindex="0">
                        <div class="selection-checkbox">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        ${t.imageDataUrl?`
                            <img src="${t.imageDataUrl}" 
                                 alt="Archive item" 
                                 class="w-full aspect-square object-cover rounded-lg">
                        `:`
                            <div class="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                <span class="text-3xl">💭</span>
                            </div>
                        `}
                    </div>
                `).join(""))}catch(e){console.error("Archive render error:",e),D.innerHTML='<p class="text-red-500 col-span-full text-center text-sm">보관함을 불러오는 중 오류가 발생했습니다.</p>'}}function sn(e){const t=e.target.closest(".archive-item");if(!t)return;const n=t.dataset.id;if(U){const o=S.indexOf(n);o>-1?(S.splice(o,1),t.classList.remove("selected")):(S.push(n),t.classList.add("selected")),on()}else uo(n)}function lo(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),sn(e))}async function uo(e){try{const n=(await je()).find(c=>c.id===e);if(!n)return;Ie=!0,y={imageDataUrl:n.imageDataUrl,description:n.description,voiceLang:n.voiceLang||null,voiceName:n.voiceName||null},console.log("🎤 [보관함] 저장된 음성 정보:",n.voiceLang,n.voiceName),kt(!0),n.imageDataUrl?(Y.src=n.imageDataUrl,Y.classList.remove("hidden"),W.classList.remove("bg-friendly")):(Y.classList.add("hidden"),W.classList.add("bg-friendly")),le.classList.add("hidden"),P.classList.remove("hidden","animate-in"),Z.classList.add("hidden"),ye.classList.remove("hidden"),k.cancel(),me(),N.innerHTML="";const o=document.getElementById("locationInfo"),a=document.getElementById("locationName");n.locationName&&o&&a?(a.textContent=n.locationName,o.classList.remove("hidden")):o&&o.classList.add("hidden");const i=n.description||"";(i.match(/[^.?!]+[.?!]+/g)||[i]).forEach(c=>{if(!c)return;const d=document.createElement("span");d.textContent=c.trim()+" ",N.appendChild(d),pe(c.trim(),d)}),_("play")}catch(t){console.error("View archive item error:",t),s("항목을 불러오는 중 오류가 발생했습니다.")}}function pe(e,t){De.push({text:e,element:t}),$e||Bt()}async function Bt(){if(await Mn(),De.length===0){$e=!1,_("play"),z&&(z.classList.remove("speaking"),z=null);return}const{text:e,element:t}=De.shift();$e=!0,z&&z.classList.remove("speaking"),t.classList.add("speaking"),z=t;const n=new SpeechSynthesisUtterance(e),o=y.voiceLang,a=y.voiceName,i=localStorage.getItem("appLanguage")||"ko",c=o||{ko:"ko-KR",en:"en-US",ja:"ja-JP","zh-CN":"zh-CN",fr:"fr-FR",de:"de-DE",es:"es-ES"}[i]||"ko-KR";if(console.log("[TTS] 저장된 음성:",o,a,"→ 사용:",c),a){const g=k.getVoices().find(m=>m.name===a||m.name.includes(a));g&&(n.voice=g,n.lang=c,n.rate=.9,n.pitch=1,console.log("[TTS] 저장된 음성 사용:",g.name))}else{const d=Ht(c),g=d.priorities,m=d.excludeVoices,p=k.getVoices();let u=null;for(const b of g)if(u=p.find(v=>v.name.includes(b)&&!m.some(T=>v.name.includes(T))),u)break;u||(u=p.find(b=>b.lang.replace("_","-").startsWith(c.substring(0,2)))),n.voice=u||null,n.lang=c,n.rate=.9,n.pitch=1,console.log("[TTS] 언어:",c,"음성:",(u==null?void 0:u.name)||"default")}n.onend=()=>{t.classList.remove("speaking"),ae||Bt()},n.onerror=()=>{t.classList.remove("speaking"),ae||Bt()},_("pause"),k.speak(n)}function go(){const e=Date.now();if(e-Gt<300||(Gt=e,!y.description))return;if(k.paused){k.resume(),ae=!1,_("pause");return}if(k.speaking){ae?(k.resume(),ae=!1,_("pause")):(k.pause(),ae=!0,_("play"));return}me();const t=y.description.split(/[.?!]/).filter(o=>o.trim()),n=N.querySelectorAll("span");t.forEach((o,a)=>{o.trim()&&n[a]&&pe(o.trim(),n[a])})}function _(e){if(!A)return;const t=`
            <svg class="w-6 h-6" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
        `,n=`
            <svg class="w-6 h-6" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        `,o=`
            <svg class="w-6 h-6 animate-spin" fill="white" viewBox="0 0 20 20">
                <path d="M4 2a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" />
            </svg>
        `;switch(e){case"play":A.innerHTML=t,A.disabled=!1;break;case"pause":A.innerHTML=n,A.disabled=!1;break;case"loading":A.innerHTML=o,A.disabled=!0;break;case"disabled":A.innerHTML=t,A.disabled=!0;break}}function rn(){const e=localStorage.getItem("customImagePrompt")||vn,t=localStorage.getItem("customTextPrompt")||bn;xe&&(xe.value=e),ke&&(ke.value=t),console.log("📝 프롬프트 로드 완료 (이미지:",e.substring(0,50)+"...)")}const cn={faq:`<h4>Q1. 앱이 처음에 바로 안 열리거나 화면이 하얗게 나와요.</h4>
네트워크 상태를 확인해주세요. Wi-Fi나 모바일 데이터가 연결되어 있어야 정상적으로 사용할 수 있습니다.

<h4>Q2. 사진을 찍었는데 설명이 안 나와요.</h4>
사진이 너무 어둡거나 흐리면 AI가 인식하기 어려울 수 있습니다. 밝은 곳에서 선명하게 다시 찍어보세요.

<h4>Q3. 음성으로 질문하면 답변이 안 나와요.</h4>
마이크 권한이 허용되어 있는지 확인해주세요. 설정 → 앱 → 손안에 가이드 → 권한에서 마이크를 허용해주세요.

<h4>Q4. 저장한 가이드가 사라졌어요.</h4>
보관함에 저장된 가이드는 기기에 저장됩니다. 브라우저 캐시를 삭제하면 데이터가 사라질 수 있으니 주의해주세요.

<h4>Q5. 공유 링크가 작동하지 않아요.</h4>
링크가 만료되었거나 삭제되었을 수 있습니다. 새로운 공유 링크를 생성해주세요.`,terms:`<h4>1. 서비스 목적 및 범위</h4>
'손안에 가이드'는 AI 기반 여행 가이드 서비스로, 사진 인식을 통해 장소 정보와 설명을 제공합니다.

<h4>2. 서비스 이용</h4>
본 서비스는 만 14세 이상의 사용자가 이용할 수 있습니다. 서비스 이용 시 발생하는 데이터 요금은 사용자 부담입니다.

<h4>3. AI 생성 콘텐츠</h4>
AI가 생성한 정보는 참고용이며, 정확성을 보장하지 않습니다. 중요한 결정 시에는 공식 정보를 확인해주세요.

<h4>4. 서비스 변경 및 중단</h4>
서비스 개선을 위해 사전 공지 없이 기능이 변경될 수 있으며, 불가피한 경우 서비스가 일시 중단될 수 있습니다.

<h4>5. 책임 제한</h4>
서비스 이용으로 인해 발생한 손해에 대해 회사는 법적 책임을 지지 않습니다.`,privacy:`<h4>1. 개인 정보 수집 원칙</h4>
필수 정보만 최소한으로 수집하며, 사용자 동의 없이 제3자에게 제공하지 않습니다.

<h4>2. 수집하는 정보</h4>
- 로그인 정보 (소셜 로그인 시 이메일, 프로필)
- 위치 정보 (사진의 GPS 데이터, 선택적)
- 사용 기록 (서비스 개선 목적)

<h4>3. 정보 이용 목적</h4>
- 맞춤형 가이드 서비스 제공
- 서비스 품질 향상 및 통계 분석
- 고객 지원 및 문의 대응

<h4>4. 정보 보관 기간</h4>
서비스 이용 종료 시까지 보관하며, 탈퇴 요청 시 즉시 삭제합니다.

<h4>5. 사용자 권리</h4>
언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.`,thirdparty:`<h4>1. 연결된 계정 목록</h4>
- Google 로그인: 이메일, 프로필 정보 활용
- Kakao 로그인: 이메일, 닉네임 활용

<h4>2. 외부 서비스 연동</h4>
- Google Maps API: 위치 정보 표시
- Google Cloud Vision/Gemini: 이미지 분석 및 AI 응답

<h4>3. 데이터 공유 범위</h4>
외부 서비스에는 서비스 제공에 필요한 최소한의 데이터만 전달됩니다.

<h4>4. 연결 해제</h4>
각 소셜 계정의 연결된 앱 관리에서 접근 권한을 해제할 수 있습니다.`};function mo(){["faq","terms","privacy","thirdparty"].forEach(t=>{const n=document.querySelector(`#content-user-${t} .user-settings-content-body`);n&&cn[t]&&(n.innerHTML=cn[t])})}function Ve(e){const t=document.getElementById(`content-user-${e}`),n=document.getElementById(`icon-user-${e}`);t&&(t.classList.toggle("open"),n&&(n.style.transform=t.classList.contains("open")?"rotate(180deg)":""))}async function ho(){if(!I||!E)return;if(!("Notification"in window)||!("serviceWorker"in navigator)||!("PushManager"in window)){I.disabled=!0,E.textContent="이 브라우저는 알림을 지원하지 않습니다";return}const e=Notification.permission;if(e==="denied"){I.checked=!1,I.disabled=!0,E.textContent="알림이 차단되어 있습니다 (브라우저 설정에서 허용 필요)";return}try{const t=await navigator.serviceWorker.ready;if(await t.pushManager.getSubscription())I.checked=!0,E.textContent="알림이 켜져 있습니다";else if(await Le()&&e!=="denied"){I.checked=!0,E.textContent="알림 설정 중...";const a=await Notification.requestPermission();if(a==="granted")try{const r=ln("BEuc2WPE8n32XPc_uDZ_Na-vSgVvx_P4uRsSFuTYi-oD1kobkIBKtSFbtnneebC3wt8OnknpizRM98NCLnuHa38"),c=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:r});if((await fetch("/api/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({endpoint:c.endpoint,keys:{p256dh:btoa(String.fromCharCode.apply(null,new Uint8Array(c.getKey("p256dh")))),auth:btoa(String.fromCharCode.apply(null,new Uint8Array(c.getKey("auth"))))},userAgent:navigator.userAgent})})).ok)E.textContent="알림이 켜져 있습니다";else throw new Error("서버 구독 등록 실패")}catch(i){console.error("자동 푸시 구독 오류:",i),I.checked=!1,E.textContent="알림을 켜려면 토글을 누르세요"}else a==="denied"?(I.checked=!1,I.disabled=!0,E.textContent="알림이 차단되어 있습니다 (브라우저 설정에서 허용 필요)"):(I.checked=!1,E.textContent="알림을 켜려면 토글을 누르세요")}else I.checked=!1,E.textContent="로그인 후 알림을 받을 수 있습니다"}catch(t){console.error("푸시 상태 확인 오류:",t),I.checked=!1,E.textContent="알림 상태를 확인할 수 없습니다"}}function ln(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/-/g,"+").replace(/_/g,"/"),o=window.atob(n),a=new Uint8Array(o.length);for(let i=0;i<o.length;++i)a[i]=o.charCodeAt(i);return a}async function po(){if(!("Notification"in window)||!("serviceWorker"in navigator)||!("PushManager"in window)){s("이 브라우저는 푸시 알림을 지원하지 않습니다"),I.checked=!1;return}if(!await Le()){s("푸시 알림을 사용하려면 로그인이 필요합니다"),I.checked=!1,E.textContent="로그인 필요";return}if(I.checked){const t=await Notification.requestPermission();if(t!=="granted"){I.checked=!1,E.textContent=t==="denied"?"알림이 차단되어 있습니다 (브라우저 설정에서 허용 필요)":"알림 권한을 허용해주세요",s("알림 권한이 필요합니다");return}try{E.textContent="알림 설정 중...";const n=await navigator.serviceWorker.ready,a=ln("BEuc2WPE8n32XPc_uDZ_Na-vSgVvx_P4uRsSFuTYi-oD1kobkIBKtSFbtnneebC3wt8OnknpizRM98NCLnuHa38"),i=await n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:a});if((await fetch("/api/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({endpoint:i.endpoint,keys:{p256dh:btoa(String.fromCharCode.apply(null,new Uint8Array(i.getKey("p256dh")))),auth:btoa(String.fromCharCode.apply(null,new Uint8Array(i.getKey("auth"))))},userAgent:navigator.userAgent})})).ok)E.textContent="알림이 켜져 있습니다",s("푸시 알림이 활성화되었습니다");else throw new Error("서버 구독 등록 실패")}catch(n){console.error("푸시 구독 오류:",n),I.checked=!1,E.textContent="알림 설정에 실패했습니다",s("푸시 알림 설정에 실패했습니다")}}else try{E.textContent="알림 해제 중...";const n=await(await navigator.serviceWorker.ready).pushManager.getSubscription();n&&(await fetch("/api/push/unsubscribe",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({endpoint:n.endpoint})}),await n.unsubscribe()),E.textContent="알림이 꺼져 있습니다",s("푸시 알림이 비활성화되었습니다")}catch(t){console.error("푸시 구독 해제 오류:",t),E.textContent="알림 해제에 실패했습니다",s("알림 해제에 실패했습니다")}}function fo(){Pe&&Pe.classList.remove("hidden")}function Ge(){Pe&&Pe.classList.add("hidden")}async function wo(){const e=document.getElementById("user-qr-image");if(!e){s("QR 코드 이미지를 찾을 수 없습니다");return}async function t(){try{const n=await fetch("/api/profile/qr-copy-reward",{method:"POST",credentials:"include"});if(n.ok){const o=await n.json();if(o.success)return s(`QR 복사 완료! +2 크레딧 (잔액: ${o.balance})`),!0}}catch{console.log("QR 리워드 미지급 (비회원 또는 오류)")}return!1}try{const n=document.createElement("canvas");n.width=e.naturalWidth||250,n.height=e.naturalHeight||250,n.getContext("2d").drawImage(e,0,0),n.toBlob(async a=>{try{await navigator.clipboard.write([new ClipboardItem({"image/png":a})]),await t()||s("QR 코드가 복사되었습니다!"),setTimeout(Ge,3e3)}catch{const r=window.location.origin;await navigator.clipboard.writeText(r),await t()||s("앱 주소가 복사되었습니다!"),setTimeout(Ge,3e3)}},"image/png")}catch(n){console.error("QR 복사 실패:",n);try{const o=window.location.origin;await navigator.clipboard.writeText(o),await t()||s("앱 주소가 복사되었습니다!"),setTimeout(Ge,3e3)}catch{s("복사에 실패했습니다. 화면을 캡처해주세요."),setTimeout(Ge,3e3)}}}function yo(){Me&&(Me.classList.remove("hidden"),V&&(V.value=""),j&&j.classList.add("hidden"))}function dn(){Me&&Me.classList.add("hidden")}async function un(){const e=V==null?void 0:V.value;if(!e){j&&(j.textContent="비밀번호를 입력해주세요",j.classList.remove("hidden"));return}try{(await fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:e})})).ok?(localStorage.setItem("adminAuthenticated","true"),localStorage.setItem("adminAuthTime",Date.now().toString()),localStorage.setItem("adminPassword",e),dn(),s("관리자 인증 성공"),vo()):(j&&(j.textContent="잘못된 비밀번호입니다",j.classList.remove("hidden")),V&&(V.value=""))}catch(t){console.error("인증 오류:",t),j&&(j.textContent="인증 중 오류가 발생했습니다",j.classList.remove("hidden"))}}async function vo(){Oe();try{if((await fetch("/api/admin/featured")).ok){localStorage.setItem("adminAuthenticated","true"),localStorage.setItem("adminAuthTime",Date.now().toString()),G==null||G.classList.add("hidden"),H==null||H.classList.remove("hidden");const t=document.getElementById("adminDashboardLink");t&&t.classList.remove("hidden"),await gn()}else{localStorage.removeItem("adminAuthenticated"),localStorage.removeItem("adminAuthTime"),localStorage.removeItem("adminPassword"),te&&(te.value=""),G==null||G.classList.remove("hidden"),H==null||H.classList.add("hidden");const t=document.getElementById("adminDashboardLink");t&&t.classList.add("hidden")}}catch{localStorage.removeItem("adminAuthenticated"),localStorage.removeItem("adminAuthTime"),localStorage.removeItem("adminPassword"),te&&(te.value=""),G==null||G.classList.remove("hidden"),H==null||H.classList.add("hidden");const t=document.getElementById("adminDashboardLink");t&&t.classList.add("hidden")}rn(),ge(Rt)}async function bo(e){e.preventDefault();const t=te.value;try{if((await fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:t})})).ok){localStorage.setItem("adminAuthenticated","true"),localStorage.setItem("adminAuthTime",Date.now().toString()),localStorage.setItem("adminPassword",t),G.classList.add("hidden"),H.classList.remove("hidden"),s("관리자 인증 성공");const o=document.getElementById("adminDashboardLink");o&&o.classList.remove("hidden"),await gn()}else s("잘못된 비밀번호입니다."),te.value=""}catch(n){console.error("인증 오류:",n),s("인증 중 오류가 발생했습니다."),te.value=""}}async function gn(){await He();const e=document.getElementById("shareSearchInput");if(e){let t;e.addEventListener("input",n=>{clearTimeout(t),t=setTimeout(()=>{mn(n.target.value)},300)})}}async function mn(e){const t=document.getElementById("searchResults");if(t){if(!e||e.trim().length===0){t.innerHTML='<p class="text-sm text-gray-400 text-center py-4">검색어를 입력하세요</p>';return}try{t.innerHTML='<p class="text-sm text-gray-400 text-center py-4">검색 중...</p>';const n=await fetch(`/api/admin/all-shares?search=${encodeURIComponent(e)}`,{credentials:"include"});if(!n.ok)throw new Error("검색 실패");const o=await n.json();if(!o||o.length===0){t.innerHTML=`
                    <p class="text-sm text-gray-400 text-center py-4">
                        "<span class="font-semibold">${e}</span>" 검색 결과가 없습니다
                    </p>
                `;return}t.innerHTML=o.map(a=>`
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-yellow-400 transition-colors">
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 truncate">${a.name}</p>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="text-xs text-gray-500">${a.downloadCount||0}회 다운로드</span>
                            <span class="text-xs text-gray-400">${new Date(a.createdAt).toLocaleDateString()}</span>
                            ${a.featured?'<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Featured</span>':""}
                        </div>
                    </div>
                    ${a.featured?`
                        <span class="ml-3 px-3 py-1.5 bg-gray-200 text-gray-500 text-sm font-medium rounded cursor-not-allowed whitespace-nowrap">
                            이미 추가됨
                        </span>
                    `:`
                        <button 
                            onclick="addFeaturedById('${a.id}')" 
                            class="ml-3 px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition-colors whitespace-nowrap"
                            data-testid="button-add-featured-${a.id}">
                            추가
                        </button>
                    `}
                </div>
            `).join("")}catch(n){console.error("공유 페이지 검색 오류:",n),t.innerHTML='<p class="text-sm text-red-400 text-center py-4">검색 중 오류가 발생했습니다</p>'}}}async function He(){try{const e=await fetch("/api/admin/featured",{credentials:"include"});if(!e.ok)throw new Error("Failed to load featured");const t=await e.json(),n=document.getElementById("featuredList"),o=document.getElementById("featuredCount");if(o&&(o.textContent=t.length),!n)return;if(!t||t.length===0){n.innerHTML='<p class="text-sm text-gray-400">Featured 페이지가 없습니다</p>';return}n.innerHTML=t.map(a=>`
                <div class="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span class="text-sm font-medium text-gray-800">${a.name}</span>
                    <div class="flex items-center gap-2">
                        <button onclick="editFeatured('${a.id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            편집
                        </button>
                        <button onclick="removeFeatured('${a.id}')" class="text-red-500 hover:text-red-700 text-sm font-medium">
                            제거
                        </button>
                    </div>
                </div>
            `).join("")}catch(e){console.error("Featured 목록 로드 오류:",e);const t=document.getElementById("featuredList");t&&(t.innerHTML='<p class="text-sm text-red-400">로드 실패</p>')}}window.addFeaturedById=async function(e){if(!e){s("공유 페이지를 선택해주세요");return}try{const t=await fetch(`/api/admin/featured/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include"}),n=await t.json();if(t.ok){s("Featured에 추가되었습니다!"),await He();const o=document.getElementById("shareSearchInput");o&&o.value&&await mn(o.value)}else s(n.error||"Featured 추가 실패")}catch(t){console.error("Featured 추가 오류:",t),s("Featured 추가 중 오류 발생")}},window.removeFeatured=async function(e){if(confirm("Featured에서 제거하시겠습니까?"))try{const t=await fetch(`/api/admin/featured/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include"}),n=await t.json();t.ok?(s("Featured에서 제거되었습니다"),await He()):s(n.error||"Featured 제거 실패")}catch(t){console.error("Featured 제거 오류:",t),s("Featured 제거 중 오류 발생")}},window.editFeatured=async function(e){try{s("📝 편집 정보 불러오는 중...");const t=await fetch(`/api/admin/featured/${e}/data`,{credentials:"include"});if(!t.ok){const r=await t.json();throw new Error(r.error||"데이터 로드 실패")}const n=await t.json(),{page:o,guides:a}=n;console.log("📊 편집 데이터:",{page:o,guides:a,guidesCount:a==null?void 0:a.length}),document.getElementById("editTitle").value=o.name||"",document.getElementById("editSender").value=o.sender||"여행자",document.getElementById("editLocation").value=o.location||"미지정",document.getElementById("editDate").value=o.date||new Date(o.createdAt).toISOString().split("T")[0];const i=a.map((r,c)=>{const d=r.imageUrl||"",g=c===0,m=c===a.length-1;return`
                    <div class="guide-item flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-300 mb-2" data-guide-id="${r.id}">
                        <img src="${d}" alt="가이드 ${c+1}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
                        <span class="font-medium text-gray-700 flex-1">가이드 ${c+1}</span>
                        <div class="flex flex-col gap-1">
                            <button onclick="moveGuideUp(this)" ${g?"disabled":""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-bold" style="min-width: 40px; min-height: 36px;">▲</button>
                            <button onclick="moveGuideDown(this)" ${m?"disabled":""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-bold" style="min-width: 40px; min-height: 36px;">▼</button>
                        </div>
                    </div>
                `}).join("");document.getElementById("guideList").innerHTML=i,document.getElementById("editFeaturedModal").classList.remove("hidden"),document.getElementById("saveFeaturedBtn").onclick=async()=>{const r=document.getElementById("editTitle").value,c=document.getElementById("editSender").value,d=document.getElementById("editLocation").value,g=document.getElementById("editDate").value;if(!r||!c||!d||!g){s("❌ 모든 필드를 입력해주세요.");return}const m=document.querySelectorAll(".guide-item"),p=Array.from(m).map(u=>u.dataset.guideId);try{s("💾 저장 중...");const u=await fetch(`/api/admin/featured/${e}/regenerate`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({title:r,sender:c,location:d,date:g,guideIds:p})});if(!u.ok){const b=await u.json();throw new Error(b.error||"HTML 재생성 실패")}s("✅ Featured 페이지가 업데이트되었습니다!"),closeEditModal(),He()}catch(u){console.error("Featured 편집 오류:",u),s("❌ 편집 실패: "+u.message)}}}catch(t){console.error("Featured 편집 오류:",t),s("❌ 편집 실패: "+t.message)}},window.closeEditModal=function(){document.getElementById("editFeaturedModal").classList.add("hidden")},window.moveGuideUp=function(e){const t=e.closest(".guide-item"),n=t.previousElementSibling;n&&(t.parentNode.insertBefore(t,n),hn())},window.moveGuideDown=function(e){const t=e.closest(".guide-item"),n=t.nextElementSibling;n&&(t.parentNode.insertBefore(n,t),hn())};function hn(){const e=document.querySelectorAll(".guide-item");e.forEach((t,n)=>{const o=t.querySelector("span.font-medium");o&&(o.textContent=`가이드 ${n+1}`);const a=t.querySelector("button:first-of-type"),i=t.querySelector("button:last-of-type");a.disabled=n===0,i.disabled=n===e.length-1})}function xo(){const e=xe==null?void 0:xe.value.trim(),t=ke==null?void 0:ke.value.trim();if(!e||!t){s("모든 프롬프트를 입력해주세요.");return}localStorage.setItem("customImagePrompt",e),localStorage.setItem("customTextPrompt",t),console.log("💾 프롬프트 저장 완료"),s("프롬프트가 저장되었습니다.")}function ko(){confirm("프롬프트를 기본값으로 초기화하시겠습니까?")&&(localStorage.removeItem("customImagePrompt"),localStorage.removeItem("customTextPrompt"),rn(),s("프롬프트가 초기화되었습니다."))}function Lo(){if(!(mt!=null&&mt.value.trim()))return s("이미지 생성을 위한 프롬프트를 입력해주세요.");ne&&(ne.disabled=!0),s("멋진 이미지를 만들고 있어요...",3e3),setTimeout(()=>{s("이미지 생성이 완료되었습니다! (데모)"),ne&&(ne.disabled=!1)},4e3)}function Io(){if(!(ht!=null&&ht.value.trim()))return s("영상 제작을 위한 프롬프트를 입력해주세요.");oe&&(oe.disabled=!0),s("AI가 영상을 제작 중입니다 (약 10초 소요)...",8e3),setTimeout(()=>{s("영상이 완성되었습니다! (데모)"),oe&&(oe.disabled=!1)},9e3)}async function Eo(){var p,u,b;const e=document.getElementById("adminNotificationType"),t=document.getElementById("adminNotificationTitle"),n=document.getElementById("adminNotificationMessage"),o=document.getElementById("adminNotificationLink"),a=document.getElementById("adminSendNotificationBtn"),i=document.getElementById("adminNotificationResult"),r=e==null?void 0:e.value,c=(p=t==null?void 0:t.value)==null?void 0:p.trim(),d=(u=n==null?void 0:n.value)==null?void 0:u.trim(),g=((b=o==null?void 0:o.value)==null?void 0:b.trim())||null;if(!c||!d){s("제목과 내용을 입력해주세요.");return}const m=localStorage.getItem("adminPassword")||"";if(!m){s("관리자 인증이 필요합니다.");return}a&&(a.disabled=!0),s("알림 발송 중...");try{const v=await fetch("/api/admin/notifications/broadcast",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:r,title:c,message:d,link:g,adminPassword:m})}),T=await v.json();if(v.ok&&T.success)s(`알림 발송 완료! (푸시: ${T.pushSent}명)`),i&&(i.textContent=`✅ 발송 완료: 푸시 ${T.pushSent}명 성공, ${T.pushFailed}명 실패`,i.className="text-sm text-center text-green-600",i.classList.remove("hidden")),t&&(t.value=""),n&&(n.value=""),o&&(o.value="");else throw new Error(T.error||"알림 발송 실패")}catch(v){console.error("알림 발송 오류:",v),s("알림 발송에 실패했습니다."),i&&(i.textContent=`❌ 발송 실패: ${v.message}`,i.className="text-sm text-center text-red-600",i.classList.remove("hidden"))}finally{a&&(a.disabled=!1)}}_e==null||_e.addEventListener("click",en),fe==null||fe.addEventListener("click",()=>ie("shoot",Yn,800)),we==null||we.addEventListener("click",()=>L.click()),ce==null||ce.addEventListener("click",()=>ie("mic",eo,500)),ze==null||ze.addEventListener("click",()=>ie("archive",Ee,300)),L==null||L.addEventListener("change",Zn),Ke==null||Ke.addEventListener("click",()=>Ie?Ee():xt()),We==null||We.addEventListener("click",xt),et==null||et.addEventListener("click",Ee),lt==null||lt.addEventListener("click",Lt),(pn=document.getElementById("toggle-user-faq"))==null||pn.addEventListener("click",()=>Ve("faq")),(fn=document.getElementById("toggle-user-terms"))==null||fn.addEventListener("click",()=>Ve("terms")),(wn=document.getElementById("toggle-user-privacy"))==null||wn.addEventListener("click",()=>Ve("privacy")),(yn=document.getElementById("toggle-user-thirdparty"))==null||yn.addEventListener("click",()=>Ve("thirdparty")),I==null||I.addEventListener("change",po),tt==null||tt.addEventListener("click",()=>{window.open("https://youtu.be/JJ65XZvBgsk","_blank")}),nt==null||nt.addEventListener("click",fo),st==null||st.addEventListener("click",wo),ot==null||ot.addEventListener("click",yo),at==null||at.addEventListener("click",dn),it==null||it.addEventListener("click",un),V==null||V.addEventListener("keypress",e=>{e.key==="Enter"&&un()});const Be=document.getElementById("adminSettingsLanguageSelect"),So=localStorage.getItem("appLanguage")||"ko";Be&&(Be.value=So),Be==null||Be.addEventListener("change",e=>{const t=e.target.value;console.log("🌐 언어 변경:",t),localStorage.setItem("appLanguage",t);const n=window.location.hostname;document.cookie=`googtrans=/ko/${t}; path=/; domain=${n}`,document.cookie=`googtrans=/ko/${t}; path=/`,s(`언어가 ${{ko:"한국어",en:"English",ja:"日本語","zh-CN":"中文",fr:"Français",de:"Deutsch",es:"Español"}[t]}로 변경됩니다...`),setTimeout(()=>{window.location.reload()},500)});const Ct=document.getElementById("adminTestLogoutBtn");Ct==null||Ct.addEventListener("click",()=>{console.log("🔓 Test logout clicked"),confirm("로그아웃하시겠습니까? (테스트용)")&&(console.log("✅ User confirmed, logging out..."),window.location.href="/api/auth/logout")}),A==null||A.addEventListener("click",go),ee==null||ee.addEventListener("click",()=>ie("save",oo,500)),qe==null||qe.addEventListener("click",()=>P.classList.toggle("hidden")),Xe==null||Xe.addEventListener("click",async()=>{ie("share",async()=>{if(!U){s("이미지를 선택해주세요"),se(!0);return}if(S.length===0){s("이미지를 선택해주세요");return}await io()},600)}),Ye==null||Ye.addEventListener("click",async()=>{ie("delete",async()=>{if(!U){s("이미지를 선택해주세요"),se(!0);return}if(S.length===0){s("이미지를 선택해주세요");return}await ao()},600)});const Tt=document.getElementById("downloadSelectedBtn");Tt==null||Tt.addEventListener("click",async()=>{ie("download",async()=>{if(S.length===0){s("이미지를 선택해주세요");return}await ro()},600)}),Ze==null||Ze.addEventListener("click",()=>{Lt()}),Je==null||Je.addEventListener("click",()=>se(!1)),D==null||D.addEventListener("click",sn),D==null||D.addEventListener("keydown",lo),dt==null||dt.addEventListener("submit",bo),ut==null||ut.addEventListener("click",xo),gt==null||gt.addEventListener("click",ko),ne==null||ne.addEventListener("click",Lo),oe==null||oe.addEventListener("click",Io);const Mt=document.getElementById("adminSendNotificationBtn");Mt==null||Mt.addEventListener("click",Eo),C==null||C.addEventListener("click",()=>{console.log("❌ 인증 취소 - 모달 닫기"),l.classList.add("hidden"),l.classList.add("pointer-events-none"),l.classList.remove("pointer-events-auto"),localStorage.removeItem("pendingShareUrl"),console.log("🗑️ pendingShareUrl 삭제 완료")}),q==null||q.addEventListener("click",()=>{console.log("🔵 Google 로그인");const e=500,t=600,n=(window.screen.width-e)/2,o=(window.screen.height-t)/2,a=window.open("/api/auth/google","google_oauth",`width=${e},height=${t},left=${n},top=${o},toolbar=no,menubar=no,scrollbars=yes`);(!a||a.closed)&&(console.error("❌ 팝업이 차단되었습니다. 같은 탭으로 진행합니다."),window.location.href="/api/auth/google")}),re==null||re.addEventListener("click",()=>{console.log("🔵 Kakao 로그인");const e=500,t=600,n=(window.screen.width-e)/2,o=(window.screen.height-t)/2,a=window.open("/api/auth/kakao","kakao_oauth",`width=${e},height=${t},left=${n},top=${o},toolbar=no,menubar=no,scrollbars=yes`);(!a||a.closed)&&(console.error("❌ 팝업이 차단되었습니다. 같은 탭으로 진행합니다."),window.location.href="/api/auth/kakao")}),l==null||l.addEventListener("click",e=>{e.target===l&&(l.classList.add("hidden"),l.classList.add("pointer-events-none"),l.classList.remove("pointer-events-auto"))}),Qn(),window.addSampleImages=async function(){const e=[{id:"sample-1",imageDataUrl:"assets/sample1.png",description:"사모트라케의 니케. 기원전 190년경 제작된 헬레니즘 시대의 걸작입니다. 승리의 여신 니케가 배의 선수에 내려앉는 순간을 포착한 이 조각은 역동적인 움직임과 바람에 휘날리는 옷자락의 표현이 탁월합니다. 루브르 박물관 계단 위에서 관람객을 맞이하는 이 작품은 고대 그리스 조각의 정수를 보여줍니다."}];for(const t of e)try{await Qt(t)}catch(n){console.log("Sample already exists or error:",n)}await Se(),s("샘플 이미지가 추가되었습니다!"),console.log("✅ 샘플 이미지 추가 완료!")},window.addEventListener("hashchange",()=>{const e=window.location.hash;e==="#archive"?Ee():e===""||e==="#main"?xt():e==="#settings"?Lt():e==="#features"&&showFeaturesPage()}),"serviceWorker"in navigator&&(window.addEventListener("load",()=>{navigator.serviceWorker.register("/service-worker.js").then(e=>{console.log("SW registered: ",e),e.addEventListener("updatefound",()=>{const t=e.installing;t.addEventListener("statechange",()=>{if(t.state==="activated"){if(!navigator.serviceWorker.controller)return;console.log("🔄 새 버전 업데이트 완료, 페이지 새로고침..."),window.location.reload()}})})}).catch(e=>console.log("SW registration failed: ",e))}),navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker 업데이트됨, 페이지 새로고침..."),window.location.reload()}))});
