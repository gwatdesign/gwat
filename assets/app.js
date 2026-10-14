(function(){
document.documentElement.classList.add('js');
const page=(document.querySelector('[data-page]')||{}).dataset?.page||'home';
if(page!=='home') document.documentElement.classList.add('sub');
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
window.fa=fa;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const arrow='<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 7H2M6 3 2 7l4 4"/></svg>';
window.ICON_ARROW=arrow;

/* logo: Mahmood's own signature (assets/sig.js) */
window.markSVG=function(id){id=id||'k';const S=window.SIG;return `<defs><linearGradient id="${id}G" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stop-color="#f6e6bd"/><stop offset=".35" stop-color="#c9a45c"/><stop offset=".6" stop-color="#8a6a32"/><stop offset=".8" stop-color="#f1d79a"/><stop offset="1" stop-color="#b08a45"/></linearGradient></defs><g class="sig-fill" fill="url(#${id}G)">${S.fill.map(d=>`<path d="${d}"/>`).join('')}<circle cx="${S.dot[0]}" cy="${S.dot[1]}" r="3.2"/></g>`};
window.sigLine=function(){return SIG.line.map(d=>`<path class="sig-line" d="${d}" pathLength="1"/>`).join('')};
document.querySelectorAll('svg[data-mark]').forEach((s,i)=>{s.setAttribute('viewBox',`0 0 ${SIG.w} ${SIG.h}`);s.innerHTML=markSVG('m'+i)});

/* chrome: loader, nav, mobile sheet, footer, toast */
const links=[['index.html','خانه','home'],['web.html','نمونه‌کار سایت','web'],['graphic.html','نمونه‌کار گرافیک','graphic'],['about.html','درباره و لوگو','about'],['contact.html','تماس','contact']];
const cur=k=>k===page?' aria-current="page"':'';
document.body.insertAdjacentHTML('afterbegin',`
<div id="loader" aria-hidden="true"><svg viewBox="0 0 ${SIG.w} ${SIG.h}">${sigLine()}${markSVG('ld')}</svg><div class="cnt"><span id="pct">۰</span>٪</div></div>
<nav class="nav" aria-label="منوی اصلی"><div class="nav-in">
  <a class="brand" href="index.html"><img src="assets/img/mark.svg" alt=""><b>گوات</b></a>
  ${links.slice(1).map(([h,t,k])=>`<a class="l" href="${h}"${cur(k)}>${t}</a>`).join('')}
  <span style="display:flex;gap:6px;align-items:center"><a class="beam" href="contact.html">شروع پروژه</a>
  <button class="menu-btn" type="button" aria-label="باز کردن منو" id="mb"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 5h12M2 11h12"/></svg></button></span>
</div></nav>
<div class="sheet" id="sheet" aria-hidden="true"><button class="menu-btn x" type="button" aria-label="بستن منو" id="mx"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3l10 10M13 3 3 13"/></svg></button>
  ${links.map(([h,t,k],i)=>`<a href="${h}"${cur(k)} style="transition-delay:${i*50}ms">${t}</a>`).join('')}</div>`);
document.body.insertAdjacentHTML('beforeend',`
<footer><div class="wrap foot">
  <span>© ${fa(1405)} · گوات · طراحی و ساخت وب</span>
  <nav aria-label="پیوندهای پایین صفحه">${links.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}</nav>
  <span class="sig">Made By M.D</span>
</div></footer>
<div id="toast" role="status" aria-live="polite"><i>✓</i><span></span></div>`);

(function(){const el=document.getElementById('pct');const t0=performance.now(),D=page==='home'?1350:450;(function tick(t){const p=Math.min(1,(t-t0)/D);el.textContent=fa(Math.round(p*100));if(p<1)requestAnimationFrame(tick)})(t0)})();

const sheet=document.getElementById('sheet');
document.getElementById('mb').onclick=()=>{sheet.classList.add('on');sheet.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
const closeSheet=()=>{sheet.classList.remove('on');sheet.setAttribute('aria-hidden','true');document.body.style.overflow=''};
document.getElementById('mx').onclick=closeSheet;
addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});

/* toast with per-action icon */
let tt;window.toast=function(msg,icon){const t=document.getElementById('toast');t.querySelector('span').textContent=msg;const i=t.querySelector('i');i.textContent=icon||'✓';i.style.animation='none';i.offsetWidth;i.style.animation='';t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200)};

/* persian digits for marked nodes */
document.querySelectorAll('[data-fa]').forEach(n=>n.textContent=fa(n.textContent));

/* reveal */
const rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});rv.forEach(e=>io.observe(e));
  const bo=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('paused',!e.isIntersecting)));document.querySelectorAll('.beam').forEach(b=>bo.observe(b));
}else rv.forEach(e=>e.classList.add('in'));

/* glass spotlight + tilt */
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
document.querySelectorAll('.glass').forEach(g=>g.addEventListener('pointermove',e=>{const r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')}));
if(fine&&!reduce)document.querySelectorAll('.tilt').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*6}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='')});

/* lightbox (used by graphic + web pages) */
window.lightbox=function(items){
  let i=0;const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','نمایش بزرگ');
  lb.innerHTML=`<button class="lb-x" type="button" aria-label="بستن">✕</button><button class="lb-p" type="button" aria-label="قبلی">›</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" type="button" aria-label="بعدی">‹</button>`;
  document.body.appendChild(lb);const img=lb.querySelector('img'),cap=lb.querySelector('figcaption');
  const show=k=>{i=(k+items.length)%items.length;const it=items[i];img.style.opacity=0;img.onload=()=>img.style.opacity=1;img.src=it.src;img.alt=it.title;cap.innerHTML=`<b>${it.title}</b><span>${it.meta||''}</span><em>${fa(i+1)} / ${fa(items.length)}</em>`};
  const close=()=>{lb.classList.remove('on');document.body.style.overflow=''};
  lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=()=>show(i-1);lb.querySelector('.lb-n').onclick=()=>show(i+1);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i+1);if(e.key==='ArrowRight')show(i-1)});
  let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(d>0?i+1:i-1)});
  return k=>{show(k);lb.classList.add('on');document.body.style.overflow='hidden'};
};
})();

/* ===== motion layer: progress, cursor, curtain, split words, magnetic, scroll-3D, subpage 3D ===== */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const page=(document.querySelector('[data-page]')||{}).dataset?.page||'home';
document.body.insertAdjacentHTML('beforeend','<div id="prog" aria-hidden="true"></div><div id="curtain" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="orb" aria-hidden="true"></div><div class="orb b" aria-hidden="true"></div>');
const prog=document.getElementById('prog');
/* split headings into words */
document.querySelectorAll('.split,.phead h1,.shead h2,.cta h2,.case h2').forEach(el=>{
  el.classList.add('split');let i=0;
  [...el.childNodes].forEach(nd=>{if(nd.nodeType!==3)return;const frag=document.createDocumentFragment();
    nd.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(' '));return}
      const o=document.createElement('span');o.className='wd';o.innerHTML=`<span class="wi" style="--i:${i++}">${w}</span>`;frag.appendChild(o)});nd.replaceWith(frag)});
});
const hero=document.querySelector('.hero h1.split');if(hero)hero.style.setProperty('--sd',page==='home'?'1500ms':'0ms');
document.querySelectorAll('.phead h1.split').forEach(h=>h.style.setProperty('--sd','550ms'));
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});document.querySelectorAll('.split').forEach(e=>io.observe(e))}
else document.querySelectorAll('.split').forEach(e=>e.classList.add('in'));

/* cursor */
if(fine&&!reduce){document.body.insertAdjacentHTML('beforeend','<div id="cur"></div><div id="cur-r"></div>');
  const d=document.getElementById('cur'),r=document.getElementById('cur-r');let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate(${x}px,${y}px)`});
  (function l(){rx+=(x-rx)*.16;ry+=(y-ry)*.16;r.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(l)})();
  document.addEventListener('pointerover',e=>{const t=e.target.closest('a,button,label,.item,.ring-stage');r.classList.toggle('hov',!!t);
    const lbl=e.target.closest('.ring-stage')?'بکشید':e.target.closest('.item,.thumbs button,.shots img')?'بزرگ':'';r.classList.toggle('lbl',!!lbl);r.textContent=lbl})}

/* page transition curtain */
const cur=document.getElementById('curtain');
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||a.target||e.metaKey||e.ctrlKey)return;const h=a.getAttribute('href');
  if(!/^[\w-]+\.html(#[\w-]*)?$/.test(h)||reduce)return;const here=location.pathname.split('/').pop()||'index.html';if(h.split('#')[0]===here)return;
  e.preventDefault();cur.classList.add('on');setTimeout(()=>location.href=h,620)});
addEventListener('pageshow',()=>cur.classList.remove('on'));

/* magnetic + ripple buttons */
document.querySelectorAll('.beam').forEach(b=>{
  if(fine&&!reduce){b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')}
  b.addEventListener('pointerdown',e=>{const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),o=document.createElement('span');o.className='rip';o.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.appendChild(o);setTimeout(()=>o.remove(),700)})});

/* scroll-linked: progress, 3D browser frames, marquee velocity */
const frames=[...document.querySelectorAll('.browser')],mq=document.querySelector('.marq-t');let last=scrollY,vel=0,mx=0;
function onScroll(){const H=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${H>0?scrollY/H:0})`;
  if(!reduce)frames.forEach(f=>{const r=f.getBoundingClientRect();const c=(r.top+r.height/2)/innerHeight;const k=Math.max(-1,Math.min(1,(c-.5)*1.6));f.style.transform=`perspective(1200px) rotateX(${k*22}deg) rotateY(${k*-6}deg) scale(${1-Math.abs(k)*.06})`})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
if(mq&&!reduce){(function l(){const d=scrollY-last;last=scrollY;vel+=(d-vel)*.1;mx-=1.2+Math.abs(vel)*.6;const w=mq.scrollWidth/2;if(-mx>w)mx+=w;mq.style.animation='none';mq.style.transform=`translateX(${mx}px) skewX(${Math.max(-12,Math.min(12,vel*.6))}deg)`;requestAnimationFrame(l)})()}

/* 3D signature in sub-page headers */
if(page!=='home'&&window.GwatGL){const ph=document.querySelector('.phead');const target=page==='about'?document.getElementById('stage'):ph;
  if(target){const c=document.createElement('canvas');c.className=page==='about'?'stage-gl':'ph-gl';c.setAttribute('aria-hidden','true');target.prepend(c);
    const g=GwatGL(c,{fit:page==='about'?.86:.8,fitH:.9,particles:page==='about'?900:700,delay:page==='about'?.3:.55,grow:2.2,spin:false});
    if(g&&page==='about')target.classList.add('has-gl');
    if(g)addEventListener('scroll',()=>g.setScroll(Math.min(1,scrollY/Math.max(1,target.offsetHeight))*.6),{passive:true})}}
})();

/* ===== live site viewer: sample sites open inside Gwat, in a device frame ===== */
(function(){
  const links=document.querySelectorAll('a[href^="work/"]');if(!links.length)return;
  const ic={desk:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="9" rx="1"/><path d="M5 14h6"/></svg>',
    tab:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="1.5" width="10" height="13" rx="1.5"/></svg>',
    phone:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="1.5" width="7" height="13" rx="1.5"/></svg>'};
  document.body.insertAdjacentHTML('beforeend',`<div class="lv" role="dialog" aria-modal="true" aria-labelledby="lvT" aria-hidden="true">
    <div class="lv-bar"><div class="lv-ttl"><b id="lvT"></b><span>نمونه‌کار زنده</span></div>
      <div class="lv-dev" role="group" aria-label="اندازه‌ی نمایش"><button type="button" data-d="desk">${ic.desk}دسکتاپ</button><button type="button" data-d="tab">${ic.tab}تبلت</button><button type="button" data-d="phone">${ic.phone}موبایل</button></div>
      <div class="lv-act"><button class="beam solid" type="button" id="lvX">بازگشت به گوات ✕</button></div></div>
    <div class="lv-stage"><div class="lv-frame" id="lvF"><span class="dots"><i></i><i></i><i></i></span><span class="url" id="lvU"></span><div class="lv-vp" id="lvVp"><iframe id="lvI" title="نمونه‌کار زنده" loading="eager"></iframe></div><div class="lv-load" id="lvL"><i></i></div></div></div>
    <div class="lv-hint">داخل قاب اسکرول و کلیک کنید · برای خروج Esc را بزنید</div></div>`);
  const lv=document.querySelector('.lv'),F=document.getElementById('lvF'),vp=document.getElementById('lvVp'),I=document.getElementById('lvI'),L=document.getElementById('lvL'),stage=lv.querySelector('.lv-stage');
  const DEV={desk:[1440,900],tab:[820,1180],phone:[390,844]};let dev='desk',last=null;
  function layout(){const sw=stage.clientWidth-(dev==='desk'?0:30),sh=stage.clientHeight-(dev==='desk'?0:30);const [vw,vh0]=DEV[dev];
    const small=innerWidth<=640;if(small){F.className='lv-frame';F.style.width=sw+'px';F.style.height=sh+'px';vp.style.top='0';vp.style.width=sw+'px';vp.style.height=sh+'px';I.style.width=sw+'px';I.style.height=sh+'px';I.style.transform='none';return}
    const bar=dev==='desk'?28:0;let s,fw,fh,vh;
    if(dev==='desk'){s=Math.min(1,sw/vw);fw=Math.min(sw,vw*s);fh=sh;vh=(fh-bar)/s}else{s=Math.min(1,(sh-bar)/vh0,sw/vw);fw=vw*s;fh=vh0*s;vh=vh0}
    F.className='lv-frame '+dev;F.style.width=fw+'px';F.style.height=fh+'px';vp.style.top=bar+'px';vp.style.width=fw+'px';vp.style.height=(fh-bar)+'px';
    I.style.width=vw+'px';I.style.height=vh+'px';I.style.transform=`scale(${s})`}
  function setDev(d){dev=d;lv.querySelectorAll('.lv-dev button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.d===d));layout()}
  lv.querySelectorAll('.lv-dev button').forEach(b=>b.onclick=()=>setDev(b.dataset.d));
  function open(href,title){last=document.activeElement;document.getElementById('lvT').textContent=title;document.getElementById('lvU').textContent=title;L.classList.remove('off');I.onload=()=>setTimeout(()=>L.classList.add('off'),300);I.src=href;
    lv.classList.add('on');lv.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';setDev(innerWidth<=640?'phone':'desk');setTimeout(()=>document.getElementById('lvX').focus(),250);
    try{history.pushState({lv:1},'')}catch(e){}}
  function close(fromPop){if(!lv.classList.contains('on'))return;lv.classList.remove('on');lv.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';setTimeout(()=>{I.src='about:blank'},450);if(last)last.focus();
    if(!fromPop){try{if(history.state&&history.state.lv)history.back()}catch(e){}}}
  document.getElementById('lvX').onclick=()=>close();
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  addEventListener('popstate',()=>close(true));
  addEventListener('message',e=>{if(e.data==='gw-close')close()});
  addEventListener('resize',()=>{if(lv.classList.contains('on'))layout()});
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const art=a.closest('.case');open(a.getAttribute('href'),art?art.querySelector('h2').textContent.trim():'نمونه‌کار')},true));
})();
