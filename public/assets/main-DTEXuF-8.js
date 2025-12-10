(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))C(p);new MutationObserver(p=>{for(const v of p)if(v.type==="childList")for(const c of v.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&C(c)}).observe(document,{childList:!0,subtree:!0});function L(p){const v={};return p.integrity&&(v.integrity=p.integrity),p.referrerPolicy&&(v.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?v.credentials="include":p.crossOrigin==="anonymous"?v.credentials="omit":v.credentials="same-origin",v}function C(p){if(p.ep)return;p.ep=!0;const v=L(p);fetch(p.href,v)}})();const Nn=`당신은 세계 최고의 여행 예능 방송 진행자이자, 역사와 문화 해설 전문가입니다. 제공된 이미지(미술 작품, 건축/풍경, 음식 중 택일)를 분석하여, 다음 지침에 따라 한국어 나레이션 스크립트를 작성해야 합니다.

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
음식: 음식명, 유래, 맛의 특징을 명시한 후, 식재료 특징, 추천하는 섭취 방법/음료, 술을 제안합니다.`,jn=`당신은 세계 최고의 여행 가이드 도슨트입니다. 사용자의 질문에 한국어로 전문적으로 답변해주세요.

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
- 인사말, 마무리 멘트 금지`;async function*Fn(x){try{const f=await fetch("/api/gemini",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)});if(!f.ok||!f.body){const p=await f.json().catch(()=>({error:`서버 오류: ${f.status}`}));throw new Error(p.error||"서버에서 응답을 받을 수 없습니다.")}const L=f.body.getReader(),C=new TextDecoder;for(;;){const{done:p,value:v}=await L.read();if(p)break;yield{text:C.decode(v,{stream:!0})}}}catch(f){console.error("Netlify 함수 fetch 오류:",f),yield{text:`
[오류: 서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.]`}}}function Vn(){const x=localStorage.getItem("appLanguage")||"ko";if(x==="ko")return"";const L={en:"English",ja:"日本語 (Japanese)","zh-CN":"中文 (Chinese)",fr:"Français (French)",de:"Deutsch (German)",es:"Español (Spanish)"}[x]||"English";return console.log("🌐 [언어설정] 선택된 언어:",L),`

[중요: 반드시 ${L} 언어로만 응답하세요. 한국어를 사용하지 마세요.]`}function zo(x){const f=localStorage.getItem("customImagePrompt")||Nn,L=Vn(),C=f+L,p=localStorage.getItem("appLanguage")||"ko";return console.log("🔍 [프롬프트확인] 사용중인 이미지 프롬프트:",f.substring(0,50)+"..."),console.log("🌐 [언어지시] 추가됨:",L?"예":"아니오 (한국어)"),Fn({base64Image:x,prompt:p==="ko"?"이 이미지를 분석하고 한국어로 생생하게 설명해주세요.":"Analyze this image and describe it vividly.",systemInstruction:C})}function Ko(x){const f=localStorage.getItem("customTextPrompt")||jn,L=Vn(),C=f+L;return console.log("🔍 [프롬프트확인] 사용중인 텍스트 프롬프트:",f.substring(0,50)+"..."),console.log("🌐 [언어지시] 추가됨:",L?"예":"아니오 (한국어)"),Fn({prompt:x,systemInstruction:C})}function qo(x,f=1024,L=1024){return new Promise((C,p)=>{const v=new Image;v.onload=()=>{let{width:c,height:T}=v;if(c<=f&&T<=L){C(x);return}c>T?c>f&&(T=Math.round(T*(f/c)),c=f):T>L&&(c=Math.round(c*(L/T)),T=L);const Q=document.createElement("canvas");Q.width=c,Q.height=T;const ge=Q.getContext("2d");if(!ge)return p(new Error("Canvas context를 가져올 수 없습니다."));ge.drawImage(v,0,0,c,T);const Ne=parseFloat(localStorage.getItem("imageQuality"))||.9;console.log(`📊 [압축테스트] 사용 품질: ${Ne}, 크기: ${c}x${T}`);const ae=Q.toDataURL("image/jpeg",Ne),z=Math.round(ae.length*3/4/1024);console.log(`📊 [압축결과] 최종 크기: ${z}KB`),C(ae)},v.onerror=c=>{console.error("이미지 로딩 오류:",c),p(new Error("최적화를 위해 이미지를 로드하는 데 실패했습니다."))},v.src=x})}document.addEventListener("DOMContentLoaded",()=>{var An,Dn,Un,$n;LanguageHelper.bindLanguageSelect("languageSelect");const x=document.getElementById("camera-feed"),f=document.getElementById("capture-canvas"),L=document.getElementById("upload-input"),C=document.getElementById("toastContainer"),p=document.getElementById("shareModal"),v=document.getElementById("shareModalContent");document.getElementById("closeShareModalBtn");const c=document.getElementById("authModal"),T=document.getElementById("closeAuthModalBtn"),Q=document.getElementById("googleLoginBtn"),ge=document.getElementById("kakaoLoginBtn"),Ne=document.getElementById("featuresPage"),ae=document.getElementById("mainPage"),z=document.getElementById("detailPage"),Gt=document.getElementById("archivePage"),_t=document.getElementById("settingsPage"),Ze=document.getElementById("startCameraFromFeaturesBtn"),zt=document.getElementById("cameraStartOverlay"),Kt=document.getElementById("mainLoader"),Rn=ae.querySelector(".footer-safe-area"),Le=document.getElementById("shootBtn"),Ie=document.getElementById("uploadBtn"),me=document.getElementById("micBtn"),et=document.getElementById("archiveBtn"),tt=document.getElementById("backBtn"),ie=document.getElementById("resultImage"),he=document.getElementById("loader"),A=document.getElementById("textOverlay"),j=document.getElementById("descriptionText"),se=document.getElementById("loadingHeader"),qt=se.querySelector("h1"),je=document.getElementById("loadingText"),Ee=document.getElementById("detailFooter"),D=document.getElementById("audioBtn"),nt=document.getElementById("textToggleBtn"),J=document.getElementById("saveBtn"),Y=document.getElementById("voiceModeLogo"),X=document.getElementById("voiceQueryInfo"),Fe=document.getElementById("voiceQueryText"),K=document.getElementById("detailMicBtn"),ot=document.getElementById("archiveBackBtn"),U=document.getElementById("archiveGrid"),Wt=document.getElementById("emptyArchiveMessage"),Se=document.getElementById("featuredGallery"),On=document.getElementById("featuredGrid"),Qt=document.getElementById("archiveHeader"),Jt=document.getElementById("selectionHeader"),at=document.getElementById("cancelSelectionBtn"),Hn=document.getElementById("selectionCount");document.getElementById("deleteSelectedBtn");const it=document.getElementById("profileBtn"),st=document.getElementById("archiveShareBtn"),rt=document.getElementById("archiveDeleteBtn"),ct=document.getElementById("archiveSettingsBtn"),lt=document.getElementById("settingsBackBtn"),dt=document.getElementById("userSettingsGuideBtn"),ut=document.getElementById("userSettingsQrBtn"),I=document.getElementById("user-push-toggle"),S=document.getElementById("user-push-status-text"),gt=document.getElementById("userSettingsAdminAuthBtn"),Ve=document.getElementById("user-admin-auth-modal"),O=document.getElementById("user-admin-password"),mt=document.getElementById("userAdminAuthCancelBtn"),ht=document.getElementById("userAdminAuthConfirmBtn"),F=document.getElementById("user-admin-auth-message"),Re=document.getElementById("user-qr-code-modal");document.getElementById("userQrCloseBtn");const pt=document.getElementById("user-copy-qr-button"),Z=document.getElementById("notificationModal"),Be=document.getElementById("notificationList"),ft=document.getElementById("emptyNotificationMessage"),wt=document.getElementById("closeNotificationModalBtn"),pe=document.getElementById("notificationBadge");let Yt=!1;const ee=document.getElementById("infographicModal"),Xt=document.getElementById("infographicImage"),vt=document.getElementById("closeInfographicModalBtn"),yt=document.getElementById("featureCard1"),te=document.getElementById("videoModal"),Ce=document.getElementById("featureVideo"),bt=document.getElementById("closeVideoModalBtn"),xt=document.getElementById("featureCard2"),Zt=document.getElementById("adminSettingsPage"),kt=document.getElementById("adminSettingsBackBtn"),H=document.getElementById("authSection"),Lt=document.getElementById("authForm"),re=document.getElementById("authPassword"),G=document.getElementById("adminPromptSettingsSection"),Te=document.getElementById("adminImagePromptTextarea"),Me=document.getElementById("adminTextPromptTextarea"),It=document.getElementById("adminSavePromptsBtn"),Et=document.getElementById("adminResetPromptsBtn"),St=document.getElementById("adminImageSynthesisPromptTextarea"),ce=document.getElementById("adminGenerateImageBtn"),Bt=document.getElementById("adminVideoGenerationPromptTextarea"),le=document.getElementById("adminGenerateVideoBtn"),en=window.SpeechRecognition||window.webkitSpeechRecognition;let E=en?new en:null,fe=!1,V=null,Oe=!1;const k=window.speechSynthesis;let He=[],Ge=!1,de=!1,q=null,tn=0,P=null,Ct=!1;const Gn={"ko-KR":{default:["Microsoft Heami","Yuna"]},"en-US":{default:["Samantha","Microsoft Zira","Google US English","English"]},"ja-JP":{default:["Kyoko","Microsoft Haruka","Google 日本語","Japanese"]},"zh-CN":{default:["Ting-Ting","Microsoft Huihui","Google 普通话","Chinese"]},"fr-FR":{default:["Thomas","Microsoft Hortense","Google français","French"]},"de-DE":{default:["Anna","Microsoft Hedda","Google Deutsch","German"]},"es-ES":{default:["Monica","Microsoft Helena","Google español","Spanish"]}};async function _n(){if(P)return P;if(Ct)return await new Promise(e=>setTimeout(e,500)),P||null;Ct=!0;try{const e=await fetch("/api/voice-configs");if(e.ok){const t=await e.json();P={};for(const n of t)P[n.langCode]||(P[n.langCode]={}),P[n.langCode][n.platform]={priorities:n.voicePriorities,excludeVoices:n.excludeVoices||[]};console.log("🔊 [Voice DB] 설정 로드 완료:",Object.keys(P))}}catch(e){console.warn("🔊 [Voice DB] 로드 실패, 기본값 사용:",e.message)}return Ct=!1,P}function zn(){const e=navigator.userAgent;return/iPhone|iPad|iPod|Mac/.test(e)?"ios":/Android/.test(e)?"android":/Windows/.test(e)?"windows":"default"}function nn(e){const t=zn();if(P&&P[e]){const o=P[e][t]||P[e].default;if(o)return{priorities:o.priorities,excludeVoices:o.excludeVoices}}const n=Gn[e];return n?{priorities:n[t]||n.default||n[Object.keys(n)[0]],excludeVoices:[]}:{priorities:[],excludeVoices:[]}}_n();let $={complete:!1,observer:null,timeoutId:null};function Kn(){if((localStorage.getItem("appLanguage")||"ko")==="ko"){$.complete=!0,console.log("[Translation] 한국어 - 번역 대기 불필요");return}if(document.body.classList.contains("translated-ltr")||document.body.classList.contains("translated-rtl")){$.complete=!0,console.log("[Translation] 이미 번역 완료됨");return}$.complete=!1,$.observer=new MutationObserver(n=>{var a;(document.body.classList.contains("translated-ltr")||document.body.classList.contains("translated-rtl"))&&(console.log("[Translation] 🌐 번역 완료 감지!"),$.complete=!0,(a=$.observer)==null||a.disconnect(),window.dispatchEvent(new CustomEvent("appTranslationComplete")))}),$.observer.observe(document.body,{attributes:!0,attributeFilter:["class"]}),$.timeoutId=setTimeout(()=>{var n;$.complete||(console.log("[Translation] 번역 타임아웃 - 원본 사용"),$.complete=!0,(n=$.observer)==null||n.disconnect(),window.dispatchEvent(new CustomEvent("appTranslationComplete",{detail:{timeout:!0}})))},3e3)}async function qn(){(localStorage.getItem("appLanguage")||"ko")==="ko"||$.complete||(console.log("[TTS] 번역 완료 대기 중..."),await new Promise(t=>{const n=()=>{window.removeEventListener("appTranslationComplete",n),t()};window.addEventListener("appTranslationComplete",n),setTimeout(t,3500)}))}Kn();let R="ko";function Wn(){if(R&&R!=="ko")return R;const e=document.cookie.split(";");for(const t of e){const[n,o]=t.trim().split("=");if(n==="googtrans"&&o){const a=o.match(/\/ko\/([a-z]{2}(-[A-Z]{2})?)/);if(a)return R=a[1],R}}return"ko"}async function Qn(){try{const e=await fetch("/api/profile/language");if(e.ok&&(R=(await e.json()).language||"ko",console.log("🌐 사용자 선호 언어 로드:",R),R!=="ko")){localStorage.setItem("appLanguage",R);const n=window.location.hostname;document.cookie=`googtrans=/ko/${R}; path=/; domain=${n}`,document.cookie=`googtrans=/ko/${R}; path=/`,console.log("🌐 DB 언어 → localStorage/쿠키 동기화 완료")}}catch(e){console.warn("언어 로드 실패:",e)}}function on(e){const t=Wn();return t==="ko"?e:`${e}?lang=${t}`}const an=new Map;function ne(e,t,n=500){const o=Date.now(),a=an.get(e)||0;return o-a<n?!1:(an.set(e,o),t(),!0)}let w={imageDataUrl:null,description:""},N=!1;const we={GUEST_DETAIL_LIMIT:3,GUEST_SHARE_LIMIT:999999,DETAIL_CREDIT_COST:2,SHARE_CREDIT_COST:0};function sn(){return{detail:parseInt(localStorage.getItem("guestDetailUsage")||"0"),share:parseInt(localStorage.getItem("guestShareUsage")||"0")}}function Jn(e){const t=e==="detail"?"guestDetailUsage":"guestShareUsage",n=parseInt(localStorage.getItem(t)||"0");localStorage.setItem(t,(n+1).toString())}function rn(){return localStorage.getItem("adminAuthenticated")==="true"}async function Pe(){try{const e=await fetch("/api/auth/user",{credentials:"include"});if(e.ok){const t=await e.json();return t&&(t.id||t.email)?(console.log("✅ 인증된 사용자:",t.email||t.id),t):t.authenticated?t.user:null}return null}catch(e){return console.error("Auth check error:",e),null}}async function Yn(){try{const e=await fetch("/api/profile/credits",{credentials:"include"});return e.ok&&(await e.json()).credits||0}catch(e){return console.error("Credits check error:",e),0}}function Xn(){const e=document.getElementById("authModal");e&&(e.classList.remove("hidden"),e.classList.remove("pointer-events-none"),e.classList.add("pointer-events-auto")),s("무료 체험이 끝났습니다. 로그인하면 35 크레딧을 드려요!")}function Zn(){s("크레딧이 부족합니다. 프로필에서 충전해주세요."),setTimeout(()=>{window.open("/profile.html","_blank")},1500)}async function _e(e="detail"){if(rn())return console.log("🔓 관리자 모드: 사용량 제한 없음"),!0;if(!await Pe()){const a=sn(),i=e==="detail"?we.GUEST_DETAIL_LIMIT:we.GUEST_SHARE_LIMIT,r=e==="detail"?a.detail:a.share;return r>=i?(console.log(`🔒 비가입자 ${e} 제한 초과: ${r}/${i}`),Xn(),!1):(console.log(`✅ 비가입자 ${e} 허용: ${r+1}/${i}`),!0)}const n=await Yn(),o=e==="detail"?we.DETAIL_CREDIT_COST:we.SHARE_CREDIT_COST;return n<o?(console.log(`🔒 크레딧 부족: ${n}/${o}`),Zn(),!1):(console.log(`✅ 크레딧 충분: ${n} (필요: ${o})`),!0)}async function cn(e="detail"){if(rn())return;if(await Pe())try{const n=e==="detail"?we.DETAIL_CREDIT_COST:we.SHARE_CREDIT_COST,o=e==="detail"?"AI 응답 생성":"공유페이지 생성";await fetch("/api/profile/use-credits",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({amount:n,description:o})}),console.log(`💳 크레딧 차감: -${n} (${o})`)}catch(n){console.error("크레딧 차감 오류:",n)}else{Jn(e);const n=sn();console.log(`📊 비가입자 사용량 업데이트: detail=${n.detail}, share=${n.share}`)}}let B=[],Tt=!1,ze="",Mt=null,Ae=!1;async function eo(){if(ze)return ze;try{return ze=(await(await fetch("/api/config")).json()).googleMapsApiKey,ze}catch(e){return console.error("Google Maps API 키 로드 실패:",e),""}}function ln(e){if(Tt){e&&e();return}eo().then(t=>{if(!t){console.error("Google Maps API 키가 없습니다.");return}const n=document.createElement("script");n.src=`https://maps.googleapis.com/maps/api/js?key=${t}&libraries=places`,n.async=!0,n.defer=!0,n.onload=()=>{Tt=!0,Mt=new google.maps.Geocoder,console.log("🗺️ Google Maps API 로드 완료"),e&&e()},n.onerror=()=>{console.error("Google Maps API 로드 실패")},document.head.appendChild(n)})}async function dn(e,t){return console.log("🔍 랜드마크 검색 시작:",e,t),!Tt||!window.google?(console.warn("⚠️ Google Maps가 로드되지 않음"),null):new Promise(n=>{const o=new google.maps.Map(document.createElement("div")),a=new google.maps.places.PlacesService(o),i=new google.maps.LatLng(e,t);console.log("🔍 Places Nearby Search 호출 (반경 100m)...");const r={location:i,radius:100,rankBy:google.maps.places.RankBy.PROMINENCE};a.nearbySearch(r,(u,d)=>{if(console.log("📡 Places API 응답:",d),d===google.maps.places.PlacesServiceStatus.OK&&u&&u.length>0){const l=u.find(m=>m.types.includes("tourist_attraction")||m.types.includes("museum")||m.types.includes("church")||m.types.includes("park")||m.types.includes("lodging")||m.types.includes("point_of_interest"))||u[0],g=l.name;console.log("🎯 근처 장소:",g,"(타입:",l.types.join(", ")+")"),n(g)}else{if(console.log("📍 Places API 실패, Geocoding으로 전환"),!Mt){console.warn("⚠️ Geocoder 초기화 안 됨"),n(null);return}Mt.geocode({location:{lat:e,lng:t}},(l,g)=>{var m;if(g==="OK"&&l[0]){const h=((m=l[0].address_components.find(b=>b.types.includes("locality")))==null?void 0:m.long_name)||l[0].formatted_address.split(",")[0];console.log("📍 도시 찾음:",h),n(h)}else console.warn("⚠️ 위치 정보 찾기 실패"),n(null)})}})})}const to="TravelGuideDB",no=2,oe="archive",Ke="shareLinks";let W;function oo(){return new Promise((e,t)=>{const n=indexedDB.open(to,no);n.onerror=o=>t("IndexedDB error: "+o.target.errorCode),n.onsuccess=o=>{W=o.target.result,e(W)},n.onupgradeneeded=o=>{const a=o.target.result;a.objectStoreNames.contains(oe)||a.createObjectStore(oe,{keyPath:"id"}),a.objectStoreNames.contains(Ke)||a.createObjectStore(Ke,{keyPath:"id"}).createIndex("featured","featured",{unique:!1})}})}function un(e){return new Promise(async(t,n)=>{if(!W)return n("DB not open");const o=e.id||`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,a={...e,id:o},u=W.transaction([oe],"readwrite").objectStore(oe).add(a);u.onsuccess=()=>t(u.result),u.onerror=d=>n("Error adding item: "+d.target.error)})}function qe(){return new Promise((e,t)=>{if(!W)return t("DB not open");const a=W.transaction([oe],"readonly").objectStore(oe).getAll();a.onsuccess=()=>e(a.result.reverse()),a.onerror=i=>t("Error getting items: "+i.target.error)})}function ao(e){return new Promise((t,n)=>{if(!W)return n("DB not open");const a=W.transaction([oe],"readwrite").objectStore(oe);let i=[];e.forEach(r=>{i.push(new Promise((u,d)=>{const l=a.delete(r);l.onsuccess=u,l.onerror=d}))}),Promise.all(i).then(t).catch(n)})}function Pt(e,t,n,o,a,i,r=!1,u="ko"){const d=h=>h.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),l=a.map((h,b)=>`
            <div class="gallery-item" data-id="${b}">
                <img src="${h.imageDataUrl||""}" alt="가이드 ${b+1}" loading="lazy">
                <p>가이드 ${b+1}</p>
            </div>
        `).join(""),g=JSON.stringify({language:u,items:a.map((h,b)=>({id:b,imageDataUrl:h.imageDataUrl||"",description:h.description||""}))}),m=h=>btoa(encodeURIComponent(h).replace(/%([0-9A-F]{2})/g,(b,y)=>String.fromCharCode("0x"+y)));return`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${d(e)} - 손안에 가이드</title>
    <link rel="manifest" href="data:application/json;base64,${m(JSON.stringify({name:e,short_name:e,start_url:".",display:"standalone",theme_color:"#4285F4"}))}">
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
            ${l}
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
    <script id="app-data" type="application/json">${g}<\/script>
    
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
                'ko-KR': ['Microsoft Heami', 'Yuna'],
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
            const userLang = localStorage.getItem('appLanguage') || 'ko'; // 🌐 현재 선택 언어 우선
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
            
            // 선택 언어에 맞는 음성 자동 선택 (🌐 현재 선택 언어 우선)
            const userLang = localStorage.getItem('appLanguage') || 'ko';
            const langCode = langCodeMap[userLang] || 'ko-KR';
            
            // ⭐ 2025-12-08: 한국어만 하드코딩 (Yuna/Sora 우선순위)
            if (userLang === 'ko') {
                const allVoices = synth.getVoices();
                const koVoices = allVoices.filter(v => v.lang.startsWith('ko'));
                // Yuna → Sora → 유나 → 소라 → Heami → 첫 번째 한국어 음성
                const targetVoice = koVoices.find(v => v.name.includes('Yuna'))
                                 || koVoices.find(v => v.name.includes('Sora'))
                                 || koVoices.find(v => v.name.includes('유나'))
                                 || koVoices.find(v => v.name.includes('소라'))
                                 || koVoices.find(v => v.name.includes('Heami'))
                                 || koVoices[0];
                currentUtterance.voice = targetVoice;
                currentUtterance.lang = 'ko-KR';
                currentUtterance.rate = 1.0;
                console.log('🎤 [한국어 하드코딩] 음성:', targetVoice?.name || 'default');
            } else {
                // 다른 6개 언어는 기존 DB 기반 유지
                const targetVoice = getVoiceForLanguage(userLang, synth.getVoices());
                currentUtterance.voice = targetVoice;
                currentUtterance.lang = langCode;
                currentUtterance.rate = 1.0;
                console.log('🎤 [음성재생]', langCode, '음성:', targetVoice?.name || 'default');
            }
            
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
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('✅ [SW] v10 등록 성공:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ [SW] 등록 실패:', error);
                    });
            });
        }
    <\/script>
</body>
</html>`}function io(e,t){const n=new Blob([t],{type:"text/html;charset=utf-8"}),o=URL.createObjectURL(n),a=document.createElement("a");a.href=o,a.download=e,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(o)}window.downloadFeaturedHTML=async function(e){try{const o=W.transaction([Ke],"readonly").objectStore(Ke).get(e);o.onsuccess=()=>{const a=o.result;if(a){const i=window.location.origin,r=localStorage.getItem("appLanguage")||"ko",u=Pt(a.title,a.sender,a.location,a.date,a.guideItems,i,!1,r);io(`${a.title}-손안에가이드.html`,u),s("다운로드가 시작되었습니다.")}}}catch(t){console.error("Download error:",t),s("다운로드 중 오류가 발생했습니다.")}};function s(e,t=3e3){if(!C)return;const n=document.createElement("div");n.className="toast-notification",n.textContent=e,C.appendChild(n),requestAnimationFrame(()=>{n.classList.add("show")}),setTimeout(()=>{n.classList.remove("show"),n.addEventListener("transitionend",()=>{n.remove()})},t)}function ve(e){[Ne,ae,z,Gt,_t,Zt].forEach(t=>{t&&t.classList.toggle("visible",t===e)})}function At(){Ae=!1,k.cancel(),ye(),ve(ae),z.classList.remove("bg-friendly"),zt.classList.add("hidden"),Rn.classList.remove("hidden");const e=localStorage.getItem("cameraWasActive")==="true";V&&!Oe?wn():!V&&e&&(console.log("🔄 Restoring camera after Featured page visit"),fn())}function Dt(e=!1){Qe(),ve(z),J.disabled=e}async function De(){Qe(),k.cancel(),ye(),N&&ue(!1),ve(Gt),Ue()}async function Ut(){Qe(),Po(),Ao(),ve(_t)}function ye(){k.cancel(),He=[],Ge=!1,de=!1,q&&q.classList.remove("speaking"),q=null}let $t=null;async function so(){try{const e=await fetch("/api/notifications/unread-count",{credentials:"include"});return e.ok&&(await e.json()).count||0}catch(e){return console.warn("알림 수 조회 실패:",e),0}}async function Nt(){const e=await so();pe&&(e>0?(pe.textContent=e>99?"99+":e,pe.classList.remove("hidden")):pe.classList.add("hidden"))}async function gn(){try{const e=await fetch("/api/notifications",{credentials:"include"});return e.ok?await e.json():[]}catch(e){return console.warn("알림 목록 조회 실패:",e),[]}}function mn(e){if(!(!Be||!ft)){if(e.length===0){Be.classList.add("hidden"),ft.classList.remove("hidden");return}Be.classList.remove("hidden"),ft.classList.add("hidden"),Be.innerHTML=e.map(t=>{const n=t.isRead,o=co(new Date(t.createdAt)),a=ro(t.type);return`
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
            `}).join(""),Be.querySelectorAll(".notification-delete-btn").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation();const o=parseInt(t.dataset.notificationId);await lo(o),Nt();const a=await gn();mn(a)})})}}function ro(e){switch(e){case"reward":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';case"system":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';case"new_content":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>';case"event":return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>';case"urgent":return'<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';default:return'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>'}}function co(e){const n=new Date-e,o=Math.floor(n/1e3),a=Math.floor(o/60),i=Math.floor(a/60),r=Math.floor(i/24);return o<60?"방금 전":a<60?`${a}분 전`:i<24?`${i}시간 전`:r<7?`${r}일 전`:e.toLocaleDateString("ko-KR")}async function lo(e){try{await fetch(`/api/notifications/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include"})}catch(t){console.warn("알림 삭제 실패:",t)}}async function uo(){if(!Z)return;Z.classList.remove("hidden");const e=await gn();mn(e)}async function hn(){if(Z){Z.classList.add("hidden"),Yt=!1;try{await fetch("/api/notifications/mark-read",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include"}),pe&&pe.classList.add("hidden")}catch(e){console.warn("알림 읽음 처리 실패:",e)}}}function go(){Nt(),$t&&clearInterval($t),$t=setInterval(()=>{Nt()},3e4)}wt==null||wt.addEventListener("click",hn),Z==null||Z.addEventListener("click",e=>{e.target===Z&&hn()});function mo(e){ee&&Xt&&(Xt.src=e,ee.classList.remove("hidden"),document.body.style.overflow="hidden")}function pn(){ee&&(ee.classList.add("hidden"),document.body.style.overflow="")}vt==null||vt.addEventListener("click",pn),ee==null||ee.addEventListener("click",e=>{(e.target===ee||e.target.classList.contains("relative"))&&pn()}),yt==null||yt.addEventListener("click",()=>{mo("/images/infographic-feature1.png")});let be=null;function ho(){te&&Ce&&(te.classList.remove("hidden"),document.body.style.overflow="hidden",Ce.currentTime=0,Ce.play().catch(e=>console.log("Video play error:",e)),be&&clearTimeout(be),be=setTimeout(()=>{jt()},8e3))}function jt(){te&&Ce&&(te.classList.add("hidden"),document.body.style.overflow="",Ce.pause(),be&&(clearTimeout(be),be=null))}bt==null||bt.addEventListener("click",jt),te==null||te.addEventListener("click",e=>{(e.target===te||e.target.classList.contains("relative"))&&jt()}),xt==null||xt.addEventListener("click",()=>{ho()}),it==null||it.addEventListener("click",async()=>{if(!await Pe()){window.open("/profile.html","_blank");return}try{((await(await fetch("/api/notifications/unread-count",{credentials:"include"})).json()).count||0)>0?(Yt=!0,uo()):window.open("/profile.html","_blank")}catch(t){console.warn("알림 수 확인 실패:",t),window.open("/profile.html","_blank")}});async function po(){try{await Qn(),await oo()}catch(o){console.error("Failed to open database",o),s("데이터베이스를 열 수 없습니다. 앱이 정상적으로 작동하지 않을 수 있습니다.")}new URLSearchParams(window.location.search).get("auth")==="failed"&&(console.error("❌ OAuth 인증 실패 감지"),s("로그인에 실패했습니다. 다시 시도해주세요."),window.history.replaceState({},"",window.location.pathname+window.location.hash),localStorage.removeItem("pendingShareUrl")),console.log("🔍 Checking for pending share URL...");const t=localStorage.getItem("pendingShareUrl");console.log("📦 localStorage.pendingShareUrl:",t),t?(console.log("🎯 Opening pending share URL after auth:",t),localStorage.removeItem("pendingShareUrl"),console.log("🗑️ Removed from localStorage"),setTimeout(()=>{console.log("🚀 Opening page in new window:",t),window.open(t,"_blank")},500)):console.log("❌ No pending URL found"),window.location.hash==="#archive"&&(console.log("📁 Direct archive access detected"),De()),E&&(E.continuous=!1,E.lang=n(),E.interimResults=!1,E.maxAlternatives=1);function n(){const o=localStorage.getItem("appLanguage")||"ko";return{ko:"ko-KR",en:"en-US",ja:"ja-JP",zh:"zh-CN",fr:"fr-FR",de:"de-DE",es:"es-ES"}[o]||"ko-KR"}window.updateRecognitionLang=function(){E&&(E.lang=n(),console.log("🌐 음성 인식 언어 변경:",E.lang))},We(),window.addEventListener("focus",We),window.addEventListener("visibilitychange",()=>{document.hidden||We()}),window.addEventListener("message",o=>{if(o.origin!==window.location.origin){console.warn("⚠️ Unauthorized message origin:",o.origin);return}if(o.data.type==="oauth_success"){console.log("✅ OAuth 팝업 성공 메시지 수신!"),c==null||c.classList.add("hidden"),c==null||c.classList.add("pointer-events-none"),c==null||c.classList.remove("pointer-events-auto");const a=localStorage.getItem("pendingShareUrl");a?(console.log("🎯 Opening pending URL in new window:",a),localStorage.removeItem("pendingShareUrl"),window.open(a,"_blank")):(console.log("🔄 Refreshing Featured Gallery"),xn())}}),window.addEventListener("storage",o=>{o.key==="auth_success"&&o.newValue==="true"&&(console.log("🔔 Storage 이벤트 감지: auth_success = true"),We())}),go()}async function We(){if(console.log("🟡 Checking auth status..."),localStorage.getItem("auth_success")==="true"){console.log("✅ OAuth 인증 성공 플래그 감지!"),c==null||c.classList.add("hidden"),c==null||c.classList.add("pointer-events-none"),c==null||c.classList.remove("pointer-events-auto"),localStorage.removeItem("auth_success"),console.log("✅ Auth modal closed - OAuth redirect successful");const t=localStorage.getItem("pendingShareUrl");t&&(console.log("🎯 Opening pending share URL in new window:",t),localStorage.removeItem("pendingShareUrl"),window.open(t,"_blank"));return}try{const t=await fetch("/api/auth/user");if(console.log("🟡 Auth response:",t.ok,t.status),t.ok){console.log("🟡 Modal element:",c),c==null||c.classList.add("hidden"),c==null||c.classList.add("pointer-events-none"),c==null||c.classList.remove("pointer-events-auto"),console.log("✅ Auth modal closed - user is authenticated");const n=localStorage.getItem("pendingShareUrl");n&&(console.log("🎯 Opening pending share URL in new window:",n),localStorage.removeItem("pendingShareUrl"),window.open(n,"_blank"))}else console.log("⚪ Not authenticated, keeping modal state")}catch(t){console.log("⚠️ Auth check error:",t)}}async function fn(){if(ve(ae),zt.classList.add("hidden"),k&&!k.speaking){const e=new SpeechSynthesisUtterance("");k.speak(e),k.cancel()}Kt.classList.remove("hidden");try{V?wn():(await fo(),localStorage.setItem("cameraWasActive","true"))}catch(e){console.error(`Initialization error: ${e.message}`),console.log("⚠️ 카메라 초기화 실패, 업로드 기능은 사용 가능합니다."),s("카메라를 시작할 수 없습니다. 업로드 기능을 사용해주세요.")}finally{Kt.classList.add("hidden")}}function fo(){return new Promise(async(e,t)=>{if(V&&V.getTracks().forEach(i=>i.stop()),!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){const i=new Error("카메라 기능을 지원하지 않는 브라우저입니다.");return t(i)}const n={video:{facingMode:{ideal:"environment"}},audio:!1},o={video:!0,audio:!1};let a;try{a=await navigator.mediaDevices.getUserMedia(n)}catch(i){console.warn("Could not get camera with ideal constraints, falling back to basic.",i);try{a=await navigator.mediaDevices.getUserMedia(o)}catch(r){return t(r)}}V=a,x.srcObject=V,x.play().catch(i=>console.error("Video play failed:",i)),x.onloadedmetadata=()=>{[Le,Ie,me].forEach(i=>{i&&(i.disabled=!1)}),Oe=!0,e()},x.onerror=i=>t(new Error("Failed to load video stream."))})}function Qe(){V&&(V.getTracks().forEach(e=>e.enabled=!1),Oe=!1,localStorage.setItem("cameraWasActive","false"))}function wn(){V&&(V.getTracks().forEach(e=>e.enabled=!0),Oe=!0,x.play().catch(e=>console.error("Video resume play failed:",e)),localStorage.setItem("cameraWasActive","true"))}async function wo(){if(!x.videoWidth||!x.videoHeight||!await _e("detail"))return;f.width=x.videoWidth,f.height=x.videoHeight;const t=f.getContext("2d");t&&(t.drawImage(x,0,0,f.width,f.height),Je(),vn(f.toDataURL("image/jpeg"),Le))}async function Je(){if(!navigator.geolocation){console.warn("⚠️ 브라우저가 위치 정보를 지원하지 않습니다");return}try{const e=await new Promise((o,a)=>{navigator.geolocation.getCurrentPosition(o,a,{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})}),t=e.coords.latitude,n=e.coords.longitude;window.currentGPS={latitude:t,longitude:n,locationName:null},console.log("📍 브라우저 위치 추출 성공:",window.currentGPS),ln(async()=>{console.log("🗺️ callback 실행됨 (브라우저 GPS)");const o=await dn(t,n);console.log("🔎 랜드마크 검색 결과:",o),o&&(window.currentGPS.locationName=o,console.log("✅ 위치 이름 저장 완료:",o))})}catch(e){e.code===1?console.log("ℹ️ 사용자가 위치 권한을 거부했습니다"):console.error("위치 정보 오류:",e),window.currentGPS=null}}async function vo(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(t){if(!await _e("detail")){e.target.value="";return}try{if(window.exifr){const i=await exifr.gps(t);i&&i.latitude&&i.longitude?(window.currentGPS={latitude:i.latitude,longitude:i.longitude,locationName:null},console.log("📍 EXIF GPS 추출 성공:",window.currentGPS),ln(async()=>{console.log("🗺️ callback 실행됨 (EXIF GPS)");const r=await dn(i.latitude,i.longitude);console.log("🔎 랜드마크 검색 결과:",r),r&&(window.currentGPS.locationName=r,console.log("✅ 위치 이름 저장 완료:",r))})):(console.log("ℹ️ EXIF GPS 정보 없음 → 브라우저 위치 요청"),window.currentGPS=null,Je())}else console.warn("⚠️ exifr 라이브러리 로딩 실패 → 브라우저 위치 요청"),window.currentGPS=null,Je()}catch(i){console.error("GPS 추출 오류:",i),window.currentGPS=null,Je()}const a=new FileReader;a.onload=i=>{var r;return vn((r=i.target)==null?void 0:r.result,Ie)},a.readAsDataURL(t)}e.target.value=""}async function vn(e,t){t.disabled=!0,Ae=!1,(k.speaking||k.pending)&&k.cancel(),ye(),Dt(),z.classList.remove("bg-friendly"),Y&&Y.classList.add("hidden"),X&&X.classList.add("hidden"),w={imageDataUrl:e,description:""},ie.src=e,ie.classList.remove("hidden"),he.classList.remove("hidden"),A.classList.add("hidden"),A.classList.remove("animate-in"),se.classList.remove("hidden"),qt.textContent="해설 준비 중...",Ee.classList.add("hidden"),j.innerHTML="",_("loading");const n=["사진 속 이야기를 찾아내고 있어요...","곧 재미있는 이야기를 들려드릴게요!"];let o=0;je.innerText=n[o];const a=window.setInterval(()=>{o=(o+1)%n.length,je.innerText=n[o]},2e3);try{const i=await qo(e),r=i.split(",")[1];w.imageDataUrl=i;const u=zo(r);clearInterval(a),he.classList.add("hidden"),A.classList.remove("hidden"),A.classList.add("animate-in"),se.classList.add("hidden"),Ee.classList.remove("hidden");let d="";for await(const l of u){const g=l.text;if(g){w.description+=g,d+=g;const m=/[.?!]/g;let h;for(;(h=m.exec(d))!==null;){const b=d.substring(0,h.index+1).trim();if(d=d.substring(h.index+1),b){const y=document.createElement("span");y.textContent=b+" ",j.appendChild(y),ke(b,y)}}}}if(d.trim()){const l=d.trim(),g=document.createElement("span");g.textContent=l+" ",j.appendChild(g),ke(l,g)}await cn("detail")}catch(i){console.error("분석 오류:",i),clearInterval(a),he.classList.add("hidden"),se.classList.add("hidden"),A.classList.remove("hidden");let r="이미지 해설 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.";j.innerText=r,_("disabled")}finally{t.disabled=!1}}async function yo(){if(!E)return s("음성 인식이 지원되지 않는 브라우저입니다.");if(fe)return E.stop();await _e("detail")&&(fe=!0,me.classList.add("mic-listening"),E.start(),E.onresult=t=>{yn(t.results[0][0].transcript)},E.onerror=t=>{console.error("Speech recognition error:",t.error),s({"no-speech":"음성을 듣지 못했어요. 다시 시도해볼까요?","not-allowed":"마이크 사용 권한이 필요합니다.","service-not-allowed":"마이크 사용 권한이 필요합니다."}[t.error]||"음성 인식 중 오류가 발생했습니다.")},E.onend=()=>{fe=!1,me.classList.remove("mic-listening")})}async function bo(){if(!E)return s("음성 인식이 지원되지 않는 브라우저입니다.");if(fe)return E.stop();await _e("detail")&&(fe=!0,K==null||K.classList.add("mic-listening"),E.start(),E.onresult=t=>{yn(t.results[0][0].transcript)},E.onerror=t=>{console.error("Speech recognition error:",t.error),s({"no-speech":"음성을 듣지 못했어요. 다시 시도해볼까요?","not-allowed":"마이크 사용 권한이 필요합니다.","service-not-allowed":"마이크 사용 권한이 필요합니다."}[t.error]||"음성 인식 중 오류가 발생했습니다.")},E.onend=()=>{fe=!1,K==null||K.classList.remove("mic-listening")})}async function yn(e){Ae=!1,(k.speaking||k.pending)&&k.cancel(),ye(),Dt(),z.classList.add("bg-friendly"),J.disabled=!0,w={imageDataUrl:null,description:"",voiceQuery:e},ie.src="",ie.classList.add("hidden"),Y&&Y.classList.remove("hidden"),X&&Fe&&(Fe.textContent=e,X.classList.remove("hidden"));const t=document.getElementById("locationInfo");t&&t.classList.add("hidden"),he.classList.remove("hidden"),A.classList.add("hidden"),A.classList.remove("animate-in"),se.classList.remove("hidden"),qt.textContent="답변 준비 중...",Ee.classList.add("hidden"),j.innerHTML="",_("loading");const n=["어떤 질문인지 살펴보고 있어요...","친절한 답변을 준비하고 있어요!"];let o=0;je.innerText=n[o];const a=window.setInterval(()=>{o=(o+1)%n.length,je.innerText=n[o]},2e3);try{const i=Ko(e);clearInterval(a),he.classList.add("hidden"),A.classList.remove("hidden"),A.classList.add("animate-in"),se.classList.add("hidden"),Ee.classList.remove("hidden");let r="";for await(const u of i){const d=u.text;if(d){w.description+=d,r+=d;const l=/[.?!]/g;let g;for(;(g=l.exec(r))!==null;){const m=r.substring(0,g.index+1).trim();if(r=r.substring(g.index+1),m){const h=document.createElement("span");h.textContent=m+" ",j.appendChild(h),ke(m,h)}}}}if(r.trim()){const u=r.trim(),d=document.createElement("span");d.textContent=u+" ",j.appendChild(d),ke(u,d)}J.disabled=!1,await cn("detail")}catch(i){console.error("답변 오류:",i),clearInterval(a),A.classList.remove("hidden"),j.innerText="답변 생성 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.",_("disabled")}}function xo(){const e=localStorage.getItem("appLanguage")||"ko",n={ko:"ko-KR",en:"en-US",ja:"ja-JP","zh-CN":"zh-CN",fr:"fr-FR",de:"de-DE",es:"es-ES"}[e]||"ko-KR";let o=null;const a=nn(n),i=a.priorities,r=a.excludeVoices,u=k.getVoices();for(const d of i){const l=u.find(g=>g.name.includes(d)&&!r.some(m=>g.name.includes(m)));if(l){o=l.name;break}}return!o&&i.length>0&&(o=i[0],console.log("🎤 [음성] getVoices() 빈 배열 → 기본값 사용:",o)),{voiceLang:n,voiceName:o}}async function ko(){var e,t;if(w.description&&!(!w.imageDataUrl&&!w.voiceQuery)){J.disabled=!0;try{window.currentGPS&&(w.latitude=window.currentGPS.latitude,w.longitude=window.currentGPS.longitude,w.locationName=window.currentGPS.locationName,console.log("📍 GPS 데이터 저장:",window.currentGPS));const n=xo();w.voiceLang=n.voiceLang,w.voiceName=n.voiceName,console.log("🎤 음성 정보 저장:",n);const o=await un(w);s("보관함에 저장되었습니다.");try{console.log("📦 guides DB 저장 시작...");const a=localStorage.getItem("appLanguage")||"ko",i=await fetch("/api/guides/batch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language:a,guides:[{localId:o,title:w.voiceQuery||w.title||"제목 없음",description:w.description,imageDataUrl:w.imageDataUrl,latitude:(e=w.latitude)==null?void 0:e.toString(),longitude:(t=w.longitude)==null?void 0:t.toString(),locationName:w.locationName,aiGeneratedContent:w.description,voiceLang:n.voiceLang,voiceName:n.voiceName}]})});if(i.ok){const r=await i.json();console.log(`✅ guides DB 저장 완료: ${r.success}/${r.total}개`)}else console.warn("⚠️ guides DB 저장 실패 (인증 필요 또는 서버 오류)")}catch(a){console.error("⚠️ guides DB 저장 오류 (IndexedDB는 저장됨):",a)}window.currentGPS=null}catch(n){console.error("Failed to save to archive:",n),s("저장에 실패했습니다. 저장 공간이 부족할 수 있습니다."),J.disabled=!1}}}function ue(e){typeof e=="boolean"?N=e:N=!N;const t=document.getElementById("downloadSelectedBtnContainer");console.log("🔵 [Selection Mode] Toggling:",N),console.log("🔵 [Selection Mode] Download container exists:",!!t),N?(U.classList.add("selection-mode"),Qt.classList.add("hidden"),Jt.classList.remove("hidden"),t==null||t.classList.remove("hidden"),console.log("✅ [Selection Mode] Download button shown"),B=[],bn()):(U.classList.remove("selection-mode"),Qt.classList.remove("hidden"),Jt.classList.add("hidden"),t==null||t.classList.add("hidden"),console.log("❌ [Selection Mode] Download button hidden"),B=[],document.querySelectorAll(".archive-item").forEach(n=>{n.classList.remove("selected")}))}function bn(){Hn.textContent=`${B.length}개 선택`;const e=document.getElementById("downloadSelectedBtn");e&&(B.length>0?(e.disabled=!1,e.classList.remove("opacity-50","cursor-not-allowed")):(e.disabled=!0,e.classList.add("opacity-50","cursor-not-allowed")))}async function Lo(){if(B.length!==0&&confirm(`선택된 ${B.length}개 항목을 삭제하시겠습니까?`))try{await ao([...B]),await Ue(),ue(!1),s(`${B.length}개 항목이 삭제되었습니다.`)}catch(e){console.error("Failed to delete items:",e),s("삭제 중 오류가 발생했습니다.")}}let xe=[];async function Io(){const e=await qe();if(e.length===0)return s("공유할 항목이 없습니다.");const t=N&&B.length>0?B.map(n=>e.find(o=>o.id===n)).filter(Boolean):e;if(t.length===0)return s("선택된 항목이 없습니다.");if(t.length>20)return s("한 번에 최대 20개까지 공유할 수 있습니다. 선택을 줄여주세요.");xe=t,Ft(),p.classList.remove("hidden")}function Ft(){v.innerHTML=`
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
        `;const e=document.getElementById("closeShareModalBtn"),t=document.getElementById("copyShareLinkBtn");e&&(e.onclick=()=>{p.classList.add("hidden")}),t&&(t.onclick=()=>Eo()),p.addEventListener("click",n=>{n.target===p&&p.classList.add("hidden")})}async function Eo(){var t,n;const e=document.getElementById("shareLinkName").value.trim();if(!e)return s("링크 이름을 먼저 입력해주세요!");v.innerHTML=`
            <div class="p-6 text-center">
                <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-lg font-semibold">링크 생성 중...</p>
            </div>
        `;try{const o=new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"});let a="여행자",i="파리, 프랑스";try{const y=await fetch("/api/auth/user");if(y.ok){const M=await y.json();M.firstName?a=`${M.firstName}${M.lastName?" "+M.lastName:""}`.trim():M.email&&(a=M.email.split("@")[0])}}catch(y){console.warn("사용자 정보 로드 실패:",y)}(t=xe[0])!=null&&t.locationName&&(i=xe[0].locationName);const r=window.location.origin,u=localStorage.getItem("appLanguage")||"ko",d=Pt(e,a,i,o,xe,r,!1,u),l={name:e,htmlContent:d,guideIds:xe.map(y=>y.id),thumbnail:((n=xe[0])==null?void 0:n.imageDataUrl)||null,featured:!1},g=await fetch("/api/share/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!g.ok){const y=await g.json();throw new Error(y.error||"서버 오류가 발생했습니다")}const m=await g.json(),h=`${window.location.origin}/s/${m.id}`;let b=!1;try{await navigator.clipboard.writeText(h),b=!0}catch(y){console.warn("클립보드 복사 실패 (권한 없음):",y)}N&&ue(!1),await Ue(),v.innerHTML=`
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
                            <p class="text-sm font-mono text-gray-800 break-all">${h}</p>
                        </div>
                        <button onclick="navigator.clipboard.writeText('${h}').then(() => alert('복사 완료!'))" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            링크 복사하기
                        </button>
                    `}
                </div>
            `,setTimeout(()=>{p.classList.add("hidden")},3e3)}catch(o){console.error("Share error:",o),p.classList.add("hidden"),s("❌ "+o.message)}}async function So(){var n;const e=await qe();if(e.length===0)return s("공유할 항목이 없습니다.");const t=B.map(o=>e.find(a=>a.id===o)).filter(Boolean);if(t.length===0)return s("선택된 항목이 없습니다.");if(t.length>20)return s("한 번에 최대 20개까지 공유할 수 있습니다.");s("공유 페이지 생성 중...");try{const o=new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"}),a=`내 여행 가이드 ${new Date().toLocaleDateString("ko-KR")}`,i=window.location.origin,r=localStorage.getItem("appLanguage")||"ko",u=Pt(a,"여행자","파리, 프랑스",o,t,i,!1,r),d={name:a,htmlContent:u,guideIds:t.map(h=>h.id),thumbnail:((n=t[0])==null?void 0:n.imageDataUrl)||null,sender:"여행자",location:"파리, 프랑스",featured:!1},l=await fetch("/api/share/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!l.ok){const h=await l.json();throw new Error(h.error||"서버 오류가 발생했습니다")}const g=await l.json(),m=`${window.location.origin}/s/${g.id}`;window.open(m,"_blank"),N&&ue(!1),await Ue(),s("✅ 가이드 페이지가 열렸습니다!")}catch(o){console.error("Download guide error:",o),s("❌ "+o.message)}}async function xn(){try{const e=await fetch(`/api/share/featured/list?t=${Date.now()}`);if(!e.ok)return;const n=(await e.json()).pages||[];Bo(n)}catch(e){console.warn("Featured gallery not available yet:",e),Se==null||Se.classList.add("hidden")}}function Bo(e){e.length>0?(Se.classList.remove("hidden"),On.innerHTML=e.map((t,n)=>{const o=t.thumbnail||"",a=`${window.location.origin}/s/${t.id}`,i=t.name||"공유 페이지";return`
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
                `}).join("")):Se.classList.add("hidden")}window.handleFeaturedDownload=async function(e,t){console.log("📥 Featured Gallery download clicked:",e,"index:",t);const n=on(e);console.log("🌐 Translated URL for sharing:",n);let o=!1;try{await navigator.clipboard.writeText(n),o=!0,console.log("✅ Link copied to clipboard:",n)}catch(a){console.warn("클립보드 복사 실패 (권한 없음):",a)}if(n.replace(/'/g,"\\'"),v.innerHTML=`
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
        `,!o){const a=document.getElementById("manualCopyBtn");a&&(a.onclick=async()=>{try{await navigator.clipboard.writeText(n),a.textContent="복사 완료!",setTimeout(()=>{p.classList.add("hidden"),Ft()},1e3)}catch(i){alert("복사 실패: "+i.message)}})}p.classList.remove("hidden"),setTimeout(()=>{p.classList.add("hidden"),Ft()},3e3)},window.handleFeaturedClick=async function(e){console.log("🔵 Featured Gallery clicked:",e);const t=on(e);console.log("🌐 Translated URL:",t);try{const n=await fetch("/api/auth/user");if(console.log("🔵 Auth status:",n.ok,n.status),n.ok)console.log("✅ Authenticated! Opening shared page in new window:",t),window.open(t,"_blank")||(console.error("❌ 팝업 차단됨! (Fallback: 현재 탭 리다이렉트)"),window.location.href=t);else{console.log("❌ Not authenticated, showing auth modal"),console.log("💾 Saving original URL to localStorage (no language param):",e),localStorage.setItem("pendingShareUrl",e),console.log("✅ Saved! localStorage value:",localStorage.getItem("pendingShareUrl"));const o=document.getElementById("authModal");o?(o.classList.remove("hidden"),console.log("📱 Auth modal displayed")):(console.error("❌ Auth modal not found, falling back to Kakao login"),window.location.href="/api/auth/kakao")}}catch(n){console.log("❌ Auth check failed, showing auth modal:",n),console.log("💾 Saving original URL to localStorage (no language param):",e),localStorage.setItem("pendingShareUrl",e),console.log("✅ Saved! localStorage value:",localStorage.getItem("pendingShareUrl"));const o=document.getElementById("authModal");o?(o.classList.remove("hidden"),console.log("📱 Auth modal displayed")):(console.error("❌ Auth modal not found, falling back to Kakao login"),window.location.href="/api/auth/kakao")}};async function Ue(){try{const e=await qe();xn(),e.length===0?(U.classList.add("hidden"),Wt.classList.remove("hidden")):(Wt.classList.add("hidden"),U.classList.remove("hidden"),U.innerHTML=e.map(t=>`
                    <div class="archive-item relative ${B.includes(t.id)?"selected ring-2 ring-blue-500":""}"
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
                            <!-- 🎤 음성 가이드 카드: 로고 워터마크 + 키워드 표시 -->
                            <div class="w-full aspect-square bg-black rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                                <img src="/images/landing-logo.jpg" alt="내손가이드 로고" 
                                     class="absolute inset-0 w-full h-full object-cover opacity-10">
                                <div class="relative z-10 flex flex-col items-center justify-center p-3 text-center">
                                    <svg class="w-8 h-8 text-gemini-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                    <span class="text-white text-xs line-clamp-2">${t.voiceQuery||"음성 질문"}</span>
                                </div>
                            </div>
                        `}
                    </div>
                `).join(""))}catch(e){console.error("Archive render error:",e),U.innerHTML='<p class="text-red-500 col-span-full text-center text-sm">보관함을 불러오는 중 오류가 발생했습니다.</p>'}}function kn(e){const t=e.target.closest(".archive-item");if(!t)return;const n=t.dataset.id;if(N){const o=B.indexOf(n);o>-1?(B.splice(o,1),t.classList.remove("selected")):(B.push(n),t.classList.add("selected")),bn()}else To(n)}function Co(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),kn(e))}async function To(e){try{const n=(await qe()).find(d=>d.id===e);if(!n)return;Ae=!0,w={imageDataUrl:n.imageDataUrl,description:n.description,voiceLang:n.voiceLang||null,voiceName:n.voiceName||null,voiceQuery:n.voiceQuery||null},console.log("🎤 [보관함] 저장된 음성 정보:",n.voiceLang,n.voiceName,n.voiceQuery),Dt(!0);const o=!n.imageDataUrl&&n.voiceQuery;n.imageDataUrl?(ie.src=n.imageDataUrl,ie.classList.remove("hidden"),z.classList.remove("bg-friendly"),Y&&Y.classList.add("hidden"),X&&X.classList.add("hidden")):(ie.classList.add("hidden"),z.classList.add("bg-friendly"),Y&&Y.classList.remove("hidden"),o&&X&&Fe&&(Fe.textContent=n.voiceQuery,X.classList.remove("hidden"))),he.classList.add("hidden"),A.classList.remove("hidden","animate-in"),se.classList.add("hidden"),Ee.classList.remove("hidden"),k.cancel(),ye(),j.innerHTML="";const a=document.getElementById("locationInfo"),i=document.getElementById("locationName");!o&&n.locationName&&a&&i?(i.textContent=n.locationName,a.classList.remove("hidden")):a&&a.classList.add("hidden");const r=n.description||"";(r.match(/[^.?!]+[.?!]+/g)||[r]).forEach(d=>{if(!d)return;const l=document.createElement("span");l.textContent=d.trim()+" ",j.appendChild(l),ke(d.trim(),l)}),_("play")}catch(t){console.error("View archive item error:",t),s("항목을 불러오는 중 오류가 발생했습니다.")}}function ke(e,t){He.push({text:e,element:t}),Ge||Vt()}async function Vt(){if(await qn(),He.length===0){Ge=!1,_("play"),q&&(q.classList.remove("speaking"),q=null);return}const{text:e,element:t}=He.shift();Ge=!0,q&&q.classList.remove("speaking"),t.classList.add("speaking"),q=t;const n=new SpeechSynthesisUtterance(e),o=w.voiceLang,a=w.voiceName,i=localStorage.getItem("appLanguage")||"ko",u=o||{ko:"ko-KR",en:"en-US",ja:"ja-JP","zh-CN":"zh-CN",fr:"fr-FR",de:"de-DE",es:"es-ES"}[i]||"ko-KR";if(console.log("[TTS] 저장된 음성:",o,a,"→ 사용:",u),a){const l=k.getVoices().find(g=>g.name===a||g.name.includes(a));l&&(n.voice=l,n.lang=u,n.rate=.9,n.pitch=1,console.log("[TTS] 저장된 음성 사용:",l.name))}else{const d=k.getVoices();let l=null;if(u==="ko-KR"){const g=d.filter(m=>m.lang.startsWith("ko"));l=g.find(m=>m.name.includes("Yuna"))||g.find(m=>m.name.includes("Sora"))||g.find(m=>m.name.includes("유나"))||g.find(m=>m.name.includes("소라"))||g.find(m=>m.name.includes("Heami"))||g[0],console.log("🎤 [한국어 하드코딩] 음성:",(l==null?void 0:l.name)||"default")}else{const g=nn(u),m=g.priorities,h=g.excludeVoices;for(const b of m)if(l=d.find(y=>y.name.includes(b)&&!h.some(M=>y.name.includes(M))),l)break;l||(l=d.find(b=>b.lang.replace("_","-").startsWith(u.substring(0,2)))),console.log("[TTS] 언어:",u,"음성:",(l==null?void 0:l.name)||"default")}n.voice=l||null,n.lang=u,n.rate=.9,n.pitch=1}n.onend=()=>{t.classList.remove("speaking"),de||Vt()},n.onerror=()=>{t.classList.remove("speaking"),de||Vt()},_("pause"),k.speak(n)}function Mo(){const e=Date.now();if(e-tn<300||(tn=e,!w.description))return;if(k.paused){k.resume(),de=!1,_("pause");return}if(k.speaking){de?(k.resume(),de=!1,_("pause")):(k.pause(),de=!0,_("play"));return}ye();const t=w.description.split(/[.?!]/).filter(o=>o.trim()),n=j.querySelectorAll("span");t.forEach((o,a)=>{o.trim()&&n[a]&&ke(o.trim(),n[a])})}function _(e){if(!D)return;const t=`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.648c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
        `,n=`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
            </svg>
        `,o=`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        `;switch(e){case"play":D.innerHTML=t,D.disabled=!1;break;case"pause":D.innerHTML=n,D.disabled=!1;break;case"loading":D.innerHTML=o,D.disabled=!0;break;case"disabled":D.innerHTML=t,D.disabled=!0;break}}function Ln(){const e=localStorage.getItem("customImagePrompt")||Nn,t=localStorage.getItem("customTextPrompt")||jn;Te&&(Te.value=e),Me&&(Me.value=t),console.log("📝 프롬프트 로드 완료 (이미지:",e.substring(0,50)+"...)")}const In={faq:`<h4>Q1. 앱이 처음에 바로 안 열리거나 멈춘 것 같아요!</h4>
🚀 조금만 기다려주세요! 앱을 처음 실행할 때 최신 기능을 준비하느라 약 3초 정도의 로딩 시간이 필요할 수 있습니다. 만약 계속 반응이 없다면 브라우저를 새로고침해 주세요. 또한, 이 앱은 크롬(Chrome) 브라우저에 최적화되어 있습니다. AI가 최고의 설명을 들려드리기 위해서는 카메라, 마이크, 위치 정보 권한 승인이 반드시 필요하니 꼭 허용해 주세요!

<h4>Q2. AI 설명이 더 정확하게 나오게 하려면 어떻게 찍어야 하나요?</h4>
📸 AI에게 힌트를 주세요! 사진을 찍으실 때, 단순히 대상만 찍기보다 <strong>작품의 이름표(캡션)</strong>나 가게의 간판/현판 글자가 함께 나오도록 촬영해 보세요. 글자 정보를 포함하면 AI가 훨씬 더 정확하고 깊이 있는 해설을 들려드릴 수 있답니다.

<h4>Q3. 한국어 말고 다른 언어로도 들을 수 있나요?</h4>
🌍 설정이 필요할 수 있어요. 기본적으로 한국어에 최적화되어 있습니다. 만약 다른 언어를 선택하실 경우, 앱 내의 일부 음성 설명이 지원되지 않거나 매끄럽지 않을 수 있습니다. 원활한 청취를 위해 사용자님 <strong>모바일 기기의 '텍스트 읽어주기(TTS) 설정'</strong>을 해당 언어에 맞게 최적화해 주시는 것을 권장합니다.

<h4>Q4. 인터넷이 안 터지는 박물관이나 붐비는 여행지에서도 쓸 수 있나요?</h4>
✈️ 물론입니다! 한 번 열어본 <strong>공유 페이지(링크)</strong>는 인터넷 연결이 끊겨도 완벽하게 재생됩니다. 여행 떠나기 전이나 숙소에서 미리 링크를 열어두기만 하면, 데이터 걱정 없이 어디서든 나만의 가이드를 즐길 수 있어요.

<h4>Q5. 크레딧은 어떻게 사용되고, 충전은 어떻게 하나요?</h4>
💰 사진을 분석하고 해설을 만들 때마다 크레딧이 사용돼요. 처음 가입하시면 무료 크레딧을 드리고, 친구에게 이 앱을 추천해서 친구가 가입하면 두 분 모두에게 보너스 크레딧을 드립니다! 물론, 부족하면 언제든 프로필 페이지에서 충전할 수도 있어요.

<h4>Q6. 저장한 가이드 내용을 수정할 수 있나요?</h4>
😅 수정은 어려워요. 아쉽게도 한 번 만들어진 가이드는 내용 수정이 어렵습니다. 만약 설명이 마음에 들지 않는다면, 삭제 후 Q2번의 팁을 활용해 새로운 사진으로 다시 가이드를 생성해 보세요. 더 멋진 해설이 기다리고 있을지도 몰라요!`,terms:`<h4>1. 서비스 목적 및 범위</h4>
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
각 소셜 계정의 연결된 앱 관리에서 접근 권한을 해제할 수 있습니다.`};function Po(){["faq","terms","privacy","thirdparty"].forEach(t=>{const n=document.querySelector(`#content-user-${t} .user-settings-content-body`);n&&In[t]&&(n.innerHTML=In[t])})}function Ye(e){const t=document.getElementById(`content-user-${e}`),n=document.getElementById(`icon-user-${e}`);t&&(t.classList.toggle("open"),n&&(n.style.transform=t.classList.contains("open")?"rotate(180deg)":""))}async function Ao(){if(!I||!S)return;if(!("Notification"in window)||!("serviceWorker"in navigator)||!("PushManager"in window)){I.disabled=!0,S.textContent="이 브라우저는 알림을 지원하지 않습니다";return}const e=Notification.permission;if(e==="denied"){I.checked=!1,I.disabled=!0,S.textContent="알림이 차단되어 있습니다 (브라우저 설정에서 허용 필요)";return}try{const t=await navigator.serviceWorker.ready;if(await t.pushManager.getSubscription())I.checked=!0,S.textContent="알림이 켜져 있습니다";else if(await Pe()&&e!=="denied"){I.checked=!0,S.textContent="알림 설정 중...";const a=await Notification.requestPermission();if(a==="granted")try{const r=En("BEuc2WPE8n32XPc_uDZ_Na-vSgVvx_P4uRsSFuTYi-oD1kobkIBKtSFbtnneebC3wt8OnknpizRM98NCLnuHa38"),u=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:r});if((await fetch("/api/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({endpoint:u.endpoint,keys:{p256dh:btoa(String.fromCharCode.apply(null,new Uint8Array(u.getKey("p256dh")))),auth:btoa(String.fromCharCode.apply(null,new Uint8Array(u.getKey("auth"))))},userAgent:navigator.userAgent})})).ok)S.textContent="알림이 켜져 있습니다";else throw new Error("서버 구독 등록 실패")}catch(i){console.error("자동 푸시 구독 오류:",i),I.checked=!1,S.textContent="알림을 켜려면 토글을 누르세요"}else a==="denied"?(I.checked=!1,I.disabled=!0,S.textContent="알림이 차단되어 있습니다 (브라우저 설정에서 허용 필요)"):(I.checked=!1,S.textContent="알림을 켜려면 토글을 누르세요")}else I.checked=!1,S.textContent="로그인 후 알림을 받을 수 있습니다"}catch(t){console.error("푸시 상태 확인 오류:",t),I.checked=!1,S.textContent="알림 상태를 확인할 수 없습니다"}}function En(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/-/g,"+").replace(/_/g,"/"),o=window.atob(n),a=new Uint8Array(o.length);for(let i=0;i<o.length;++i)a[i]=o.charCodeAt(i);return a}async function Do(){if(!("Notification"in window)||!("serviceWorker"in navigator)||!("PushManager"in window)){s("이 브라우저는 푸시 알림을 지원하지 않습니다"),I.checked=!1;return}if(!await Pe()){s("푸시 알림을 사용하려면 로그인이 필요합니다"),I.checked=!1,S.textContent="로그인 필요";return}if(I.checked){const t=await Notification.requestPermission();if(t!=="granted"){I.checked=!1,S.textContent=t==="denied"?"알림이 차단되어 있습니다 (브라우저 설정에서 허용 필요)":"알림 권한을 허용해주세요",s("알림 권한이 필요합니다");return}try{S.textContent="알림 설정 중...";const n=await navigator.serviceWorker.ready,a=En("BEuc2WPE8n32XPc_uDZ_Na-vSgVvx_P4uRsSFuTYi-oD1kobkIBKtSFbtnneebC3wt8OnknpizRM98NCLnuHa38"),i=await n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:a});if((await fetch("/api/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({endpoint:i.endpoint,keys:{p256dh:btoa(String.fromCharCode.apply(null,new Uint8Array(i.getKey("p256dh")))),auth:btoa(String.fromCharCode.apply(null,new Uint8Array(i.getKey("auth"))))},userAgent:navigator.userAgent})})).ok)S.textContent="알림이 켜져 있습니다",s("푸시 알림이 활성화되었습니다");else throw new Error("서버 구독 등록 실패")}catch(n){console.error("푸시 구독 오류:",n),I.checked=!1,S.textContent="알림 설정에 실패했습니다",s("푸시 알림 설정에 실패했습니다")}}else try{S.textContent="알림 해제 중...";const n=await(await navigator.serviceWorker.ready).pushManager.getSubscription();n&&(await fetch("/api/push/unsubscribe",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({endpoint:n.endpoint})}),await n.unsubscribe()),S.textContent="알림이 꺼져 있습니다",s("푸시 알림이 비활성화되었습니다")}catch(t){console.error("푸시 구독 해제 오류:",t),S.textContent="알림 해제에 실패했습니다",s("알림 해제에 실패했습니다")}}function Uo(){Re&&Re.classList.remove("hidden")}function Sn(){Re&&Re.classList.add("hidden")}async function $o(){const e=window.location.origin;async function t(){try{const o=await fetch("/api/profile/qr-copy-reward",{method:"POST",credentials:"include"});if(o.ok){const a=await o.json();if(a.success)return s(`QR 복사 완료! +2 크레딧 (잔액: ${a.balance})`),!0}}catch{console.log("QR 리워드 미지급 (비회원 또는 오류)")}return!1}async function n(){await t()||s("앱 주소가 복사되었습니다!"),setTimeout(Sn,3e3)}if(navigator.clipboard&&navigator.clipboard.writeText)try{await navigator.clipboard.writeText(e),console.log("✅ 클립보드 복사 성공 (writeText)"),await n();return}catch(o){console.warn("writeText 실패, fallback 시도:",o)}try{const o=document.createElement("textarea");o.value=e,o.style.cssText="position:fixed;left:-9999px;top:-9999px;opacity:0;",document.body.appendChild(o),o.focus(),o.select();const a=document.execCommand("copy");if(document.body.removeChild(o),a){console.log("✅ 클립보드 복사 성공 (execCommand)"),await n();return}}catch(o){console.warn("execCommand 실패:",o)}s("복사에 실패했습니다. 화면을 캡처해주세요."),setTimeout(Sn,3e3)}function No(){Ve&&(Ve.classList.remove("hidden"),O&&(O.value=""),F&&F.classList.add("hidden"))}function Bn(){Ve&&Ve.classList.add("hidden")}async function Cn(){const e=O==null?void 0:O.value;if(!e){F&&(F.textContent="비밀번호를 입력해주세요",F.classList.remove("hidden"));return}try{(await fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:e})})).ok?(localStorage.setItem("adminAuthenticated","true"),localStorage.setItem("adminAuthTime",Date.now().toString()),localStorage.setItem("adminPassword",e),Bn(),s("관리자 인증 성공"),jo()):(F&&(F.textContent="잘못된 비밀번호입니다",F.classList.remove("hidden")),O&&(O.value=""))}catch(t){console.error("인증 오류:",t),F&&(F.textContent="인증 중 오류가 발생했습니다",F.classList.remove("hidden"))}}async function jo(){Qe();try{if((await fetch("/api/admin/featured")).ok){localStorage.setItem("adminAuthenticated","true"),localStorage.setItem("adminAuthTime",Date.now().toString()),H==null||H.classList.add("hidden"),G==null||G.classList.remove("hidden");const t=document.getElementById("adminDashboardLink");t&&t.classList.remove("hidden"),await Tn()}else{localStorage.removeItem("adminAuthenticated"),localStorage.removeItem("adminAuthTime"),localStorage.removeItem("adminPassword"),re&&(re.value=""),H==null||H.classList.remove("hidden"),G==null||G.classList.add("hidden");const t=document.getElementById("adminDashboardLink");t&&t.classList.add("hidden")}}catch{localStorage.removeItem("adminAuthenticated"),localStorage.removeItem("adminAuthTime"),localStorage.removeItem("adminPassword"),re&&(re.value=""),H==null||H.classList.remove("hidden"),G==null||G.classList.add("hidden");const t=document.getElementById("adminDashboardLink");t&&t.classList.add("hidden")}Ln(),ve(Zt)}async function Fo(e){e.preventDefault();const t=re.value;try{if((await fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:t})})).ok){localStorage.setItem("adminAuthenticated","true"),localStorage.setItem("adminAuthTime",Date.now().toString()),localStorage.setItem("adminPassword",t),H.classList.add("hidden"),G.classList.remove("hidden"),s("관리자 인증 성공");const o=document.getElementById("adminDashboardLink");o&&o.classList.remove("hidden"),await Tn()}else s("잘못된 비밀번호입니다."),re.value=""}catch(n){console.error("인증 오류:",n),s("인증 중 오류가 발생했습니다."),re.value=""}}async function Tn(){await Xe();const e=document.getElementById("shareSearchInput");if(e){let t;e.addEventListener("input",n=>{clearTimeout(t),t=setTimeout(()=>{Mn(n.target.value)},300)})}}async function Mn(e){const t=document.getElementById("searchResults");if(t){if(!e||e.trim().length===0){t.innerHTML='<p class="text-sm text-gray-400 text-center py-4">검색어를 입력하세요</p>';return}try{t.innerHTML='<p class="text-sm text-gray-400 text-center py-4">검색 중...</p>';const n=await fetch(`/api/admin/all-shares?search=${encodeURIComponent(e)}`,{credentials:"include"});if(!n.ok)throw new Error("검색 실패");const o=await n.json();if(!o||o.length===0){t.innerHTML=`
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
            `).join("")}catch(n){console.error("공유 페이지 검색 오류:",n),t.innerHTML='<p class="text-sm text-red-400 text-center py-4">검색 중 오류가 발생했습니다</p>'}}}async function Xe(){try{const e=await fetch("/api/admin/featured",{credentials:"include"});if(!e.ok)throw new Error("Failed to load featured");const t=await e.json(),n=document.getElementById("featuredList"),o=document.getElementById("featuredCount");if(o&&(o.textContent=t.length),!n)return;if(!t||t.length===0){n.innerHTML='<p class="text-sm text-gray-400">Featured 페이지가 없습니다</p>';return}n.innerHTML=t.map(a=>`
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
            `).join("")}catch(e){console.error("Featured 목록 로드 오류:",e);const t=document.getElementById("featuredList");t&&(t.innerHTML='<p class="text-sm text-red-400">로드 실패</p>')}}window.addFeaturedById=async function(e){if(!e){s("공유 페이지를 선택해주세요");return}try{const t=await fetch(`/api/admin/featured/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include"}),n=await t.json();if(t.ok){s("Featured에 추가되었습니다!"),await Xe();const o=document.getElementById("shareSearchInput");o&&o.value&&await Mn(o.value)}else s(n.error||"Featured 추가 실패")}catch(t){console.error("Featured 추가 오류:",t),s("Featured 추가 중 오류 발생")}},window.removeFeatured=async function(e){if(confirm("Featured에서 제거하시겠습니까?"))try{const t=await fetch(`/api/admin/featured/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include"}),n=await t.json();t.ok?(s("Featured에서 제거되었습니다"),await Xe()):s(n.error||"Featured 제거 실패")}catch(t){console.error("Featured 제거 오류:",t),s("Featured 제거 중 오류 발생")}},window.editFeatured=async function(e){try{s("📝 편집 정보 불러오는 중...");const t=await fetch(`/api/admin/featured/${e}/data`,{credentials:"include"});if(!t.ok){const r=await t.json();throw new Error(r.error||"데이터 로드 실패")}const n=await t.json(),{page:o,guides:a}=n;console.log("📊 편집 데이터:",{page:o,guides:a,guidesCount:a==null?void 0:a.length}),document.getElementById("editTitle").value=o.name||"",document.getElementById("editSender").value=o.sender||"여행자",document.getElementById("editLocation").value=o.location||"미지정",document.getElementById("editDate").value=o.date||new Date(o.createdAt).toISOString().split("T")[0];const i=a.map((r,u)=>{const d=r.imageUrl||"",l=u===0,g=u===a.length-1;return`
                    <div class="guide-item flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-300 mb-2" data-guide-id="${r.id}">
                        <img src="${d}" alt="가이드 ${u+1}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
                        <span class="font-medium text-gray-700 flex-1">가이드 ${u+1}</span>
                        <div class="flex flex-col gap-1">
                            <button onclick="moveGuideUp(this)" ${l?"disabled":""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-bold" style="min-width: 40px; min-height: 36px;">▲</button>
                            <button onclick="moveGuideDown(this)" ${g?"disabled":""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-bold" style="min-width: 40px; min-height: 36px;">▼</button>
                        </div>
                    </div>
                `}).join("");document.getElementById("guideList").innerHTML=i,document.getElementById("editFeaturedModal").classList.remove("hidden"),document.getElementById("saveFeaturedBtn").onclick=async()=>{const r=document.getElementById("editTitle").value,u=document.getElementById("editSender").value,d=document.getElementById("editLocation").value,l=document.getElementById("editDate").value;if(!r||!u||!d||!l){s("❌ 모든 필드를 입력해주세요.");return}const g=document.querySelectorAll(".guide-item"),m=Array.from(g).map(h=>h.dataset.guideId);try{s("💾 저장 중...");const h=await fetch(`/api/admin/featured/${e}/regenerate`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({title:r,sender:u,location:d,date:l,guideIds:m})});if(!h.ok){const b=await h.json();throw new Error(b.error||"HTML 재생성 실패")}s("✅ Featured 페이지가 업데이트되었습니다!"),closeEditModal(),Xe()}catch(h){console.error("Featured 편집 오류:",h),s("❌ 편집 실패: "+h.message)}}}catch(t){console.error("Featured 편집 오류:",t),s("❌ 편집 실패: "+t.message)}},window.closeEditModal=function(){document.getElementById("editFeaturedModal").classList.add("hidden")},window.moveGuideUp=function(e){const t=e.closest(".guide-item"),n=t.previousElementSibling;n&&(t.parentNode.insertBefore(t,n),Pn())},window.moveGuideDown=function(e){const t=e.closest(".guide-item"),n=t.nextElementSibling;n&&(t.parentNode.insertBefore(n,t),Pn())};function Pn(){const e=document.querySelectorAll(".guide-item");e.forEach((t,n)=>{const o=t.querySelector("span.font-medium");o&&(o.textContent=`가이드 ${n+1}`);const a=t.querySelector("button:first-of-type"),i=t.querySelector("button:last-of-type");a.disabled=n===0,i.disabled=n===e.length-1})}function Vo(){const e=Te==null?void 0:Te.value.trim(),t=Me==null?void 0:Me.value.trim();if(!e||!t){s("모든 프롬프트를 입력해주세요.");return}localStorage.setItem("customImagePrompt",e),localStorage.setItem("customTextPrompt",t),console.log("💾 프롬프트 저장 완료"),s("프롬프트가 저장되었습니다.")}function Ro(){confirm("프롬프트를 기본값으로 초기화하시겠습니까?")&&(localStorage.removeItem("customImagePrompt"),localStorage.removeItem("customTextPrompt"),Ln(),s("프롬프트가 초기화되었습니다."))}function Oo(){if(!(St!=null&&St.value.trim()))return s("이미지 생성을 위한 프롬프트를 입력해주세요.");ce&&(ce.disabled=!0),s("멋진 이미지를 만들고 있어요...",3e3),setTimeout(()=>{s("이미지 생성이 완료되었습니다! (데모)"),ce&&(ce.disabled=!1)},4e3)}function Ho(){if(!(Bt!=null&&Bt.value.trim()))return s("영상 제작을 위한 프롬프트를 입력해주세요.");le&&(le.disabled=!0),s("AI가 영상을 제작 중입니다 (약 10초 소요)...",8e3),setTimeout(()=>{s("영상이 완성되었습니다! (데모)"),le&&(le.disabled=!1)},9e3)}async function Go(){var m,h,b;const e=document.getElementById("adminNotificationType"),t=document.getElementById("adminNotificationTitle"),n=document.getElementById("adminNotificationMessage"),o=document.getElementById("adminNotificationLink"),a=document.getElementById("adminSendNotificationBtn"),i=document.getElementById("adminNotificationResult"),r=e==null?void 0:e.value,u=(m=t==null?void 0:t.value)==null?void 0:m.trim(),d=(h=n==null?void 0:n.value)==null?void 0:h.trim(),l=((b=o==null?void 0:o.value)==null?void 0:b.trim())||null;if(!u||!d){s("제목과 내용을 입력해주세요.");return}const g=localStorage.getItem("adminPassword")||"";if(!g){s("관리자 인증이 필요합니다.");return}a&&(a.disabled=!0),s("알림 발송 중...");try{const y=await fetch("/api/admin/notifications/broadcast",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:r,title:u,message:d,link:l,adminPassword:g})}),M=await y.json();if(y.ok&&M.success)s(`알림 발송 완료! (푸시: ${M.pushSent}명)`),i&&(i.textContent=`✅ 발송 완료: 푸시 ${M.pushSent}명 성공, ${M.pushFailed}명 실패`,i.className="text-sm text-center text-green-600",i.classList.remove("hidden")),t&&(t.value=""),n&&(n.value=""),o&&(o.value="");else throw new Error(M.error||"알림 발송 실패")}catch(y){console.error("알림 발송 오류:",y),s("알림 발송에 실패했습니다."),i&&(i.textContent=`❌ 발송 실패: ${y.message}`,i.className="text-sm text-center text-red-600",i.classList.remove("hidden"))}finally{a&&(a.disabled=!1)}}Ze==null||Ze.addEventListener("click",fn),Le==null||Le.addEventListener("click",()=>ne("shoot",wo,800)),Ie==null||Ie.addEventListener("click",()=>L.click()),me==null||me.addEventListener("click",()=>ne("mic",yo,500)),K==null||K.addEventListener("click",()=>ne("detailMic",bo,500)),et==null||et.addEventListener("click",()=>ne("archive",De,300)),L==null||L.addEventListener("change",vo),tt==null||tt.addEventListener("click",()=>Ae?De():At()),ot==null||ot.addEventListener("click",At),lt==null||lt.addEventListener("click",De),kt==null||kt.addEventListener("click",Ut),(An=document.getElementById("toggle-user-faq"))==null||An.addEventListener("click",()=>Ye("faq")),(Dn=document.getElementById("toggle-user-terms"))==null||Dn.addEventListener("click",()=>Ye("terms")),(Un=document.getElementById("toggle-user-privacy"))==null||Un.addEventListener("click",()=>Ye("privacy")),($n=document.getElementById("toggle-user-thirdparty"))==null||$n.addEventListener("click",()=>Ye("thirdparty")),I==null||I.addEventListener("change",Do),dt==null||dt.addEventListener("click",()=>{window.open("https://youtu.be/JJ65XZvBgsk","_blank")}),ut==null||ut.addEventListener("click",Uo),pt==null||pt.addEventListener("click",$o),gt==null||gt.addEventListener("click",No),mt==null||mt.addEventListener("click",Bn),ht==null||ht.addEventListener("click",Cn),O==null||O.addEventListener("keypress",e=>{e.key==="Enter"&&Cn()});const $e=document.getElementById("adminSettingsLanguageSelect"),_o=localStorage.getItem("appLanguage")||"ko";$e&&($e.value=_o),$e==null||$e.addEventListener("change",e=>{const t=e.target.value;console.log("🌐 언어 변경:",t),localStorage.setItem("appLanguage",t);const n=window.location.hostname;document.cookie=`googtrans=/ko/${t}; path=/; domain=${n}`,document.cookie=`googtrans=/ko/${t}; path=/`,s(`언어가 ${{ko:"한국어",en:"English",ja:"日本語","zh-CN":"中文",fr:"Français",de:"Deutsch",es:"Español"}[t]}로 변경됩니다...`),setTimeout(()=>{window.location.reload()},500)});const Rt=document.getElementById("adminTestLogoutBtn");Rt==null||Rt.addEventListener("click",()=>{console.log("🔓 Test logout clicked"),confirm("로그아웃하시겠습니까? (테스트용)")&&(console.log("✅ User confirmed, logging out..."),window.location.href="/api/auth/logout")}),D==null||D.addEventListener("click",Mo),J==null||J.addEventListener("click",()=>ne("save",ko,500)),nt==null||nt.addEventListener("click",()=>A.classList.toggle("hidden")),st==null||st.addEventListener("click",async()=>{ne("share",async()=>{if(!N){s("이미지를 선택해주세요"),ue(!0);return}if(B.length===0){s("이미지를 선택해주세요");return}await Io()},600)}),rt==null||rt.addEventListener("click",async()=>{ne("delete",async()=>{if(!N){s("이미지를 선택해주세요"),ue(!0);return}if(B.length===0){s("이미지를 선택해주세요");return}await Lo()},600)});const Ot=document.getElementById("downloadSelectedBtn");Ot==null||Ot.addEventListener("click",async()=>{ne("download",async()=>{if(B.length===0){s("이미지를 선택해주세요");return}await So()},600)}),ct==null||ct.addEventListener("click",()=>{Ut()}),at==null||at.addEventListener("click",()=>ue(!1)),U==null||U.addEventListener("click",kn),U==null||U.addEventListener("keydown",Co),Lt==null||Lt.addEventListener("submit",Fo),It==null||It.addEventListener("click",Vo),Et==null||Et.addEventListener("click",Ro),ce==null||ce.addEventListener("click",Oo),le==null||le.addEventListener("click",Ho);const Ht=document.getElementById("adminSendNotificationBtn");if(Ht==null||Ht.addEventListener("click",Go),T==null||T.addEventListener("click",()=>{console.log("❌ 인증 취소 - 모달 닫기"),c.classList.add("hidden"),c.classList.add("pointer-events-none"),c.classList.remove("pointer-events-auto"),localStorage.removeItem("pendingShareUrl"),console.log("🗑️ pendingShareUrl 삭제 완료")}),Q==null||Q.addEventListener("click",()=>{console.log("🔵 Google 로그인");const e=500,t=600,n=(window.screen.width-e)/2,o=(window.screen.height-t)/2,a=window.open("/api/auth/google","google_oauth",`width=${e},height=${t},left=${n},top=${o},toolbar=no,menubar=no,scrollbars=yes`);(!a||a.closed)&&(console.error("❌ 팝업이 차단되었습니다. 같은 탭으로 진행합니다."),window.location.href="/api/auth/google")}),ge==null||ge.addEventListener("click",()=>{console.log("🔵 Kakao 로그인");const e=500,t=600,n=(window.screen.width-e)/2,o=(window.screen.height-t)/2,a=window.open("/api/auth/kakao","kakao_oauth",`width=${e},height=${t},left=${n},top=${o},toolbar=no,menubar=no,scrollbars=yes`);(!a||a.closed)&&(console.error("❌ 팝업이 차단되었습니다. 같은 탭으로 진행합니다."),window.location.href="/api/auth/kakao")}),c==null||c.addEventListener("click",e=>{e.target===c&&(c.classList.add("hidden"),c.classList.add("pointer-events-none"),c.classList.remove("pointer-events-auto"))}),po(),window.addSampleImages=async function(){const e=[{id:"sample-1",imageDataUrl:"assets/sample1.png",description:"사모트라케의 니케. 기원전 190년경 제작된 헬레니즘 시대의 걸작입니다. 승리의 여신 니케가 배의 선수에 내려앉는 순간을 포착한 이 조각은 역동적인 움직임과 바람에 휘날리는 옷자락의 표현이 탁월합니다. 루브르 박물관 계단 위에서 관람객을 맞이하는 이 작품은 고대 그리스 조각의 정수를 보여줍니다."}];for(const t of e)try{await un(t)}catch(n){console.log("Sample already exists or error:",n)}await Ue(),s("샘플 이미지가 추가되었습니다!"),console.log("✅ 샘플 이미지 추가 완료!")},window.addEventListener("hashchange",()=>{const e=window.location.hash;e==="#archive"?De():e===""||e==="#main"?At():e==="#settings"?Ut():e==="#features"&&showFeaturesPage()}),"serviceWorker"in navigator){let e=!1;window.addEventListener("load",()=>{navigator.serviceWorker.register("/service-worker.js").then(n=>{console.log("SW registered: ",n),n.addEventListener("updatefound",()=>{const o=n.installing;o.addEventListener("statechange",()=>{if(o.state==="activated"&&!e){if(!navigator.serviceWorker.controller)return;console.log("🔄 새 버전 업데이트 완료")}})})}).catch(n=>console.log("SW registration failed: ",n))});const t="sw_reload_done";navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!e){if(sessionStorage.getItem(t)){console.log("🔄 Service Worker 업데이트됨 (이미 새로고침됨, 스킵)");return}console.log("🔄 Service Worker 업데이트됨, 페이지 새로고침..."),e=!0,sessionStorage.setItem(t,"true"),window.location.reload()}})}});
