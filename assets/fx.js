/* extra effects: gold sparks (click burst + cursor trail), eyebrow scramble, counters, depth parallax */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
if(reduce)return;
/* sparks canvas */
const cv=document.createElement('canvas');cv.id='sparks';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
const ctx=cv.getContext('2d');let W,H,dpr;const P=[];
function size(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}size();addEventListener('resize',size);
function add(x,y,n,sp,life,sz){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=sp*(.3+Math.random());P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.3,l:life*(.6+Math.random()*.6),t:0,s:sz*(.5+Math.random())})}if(!run){run=true;requestAnimationFrame(loop)}}
let run=false,lx=0,ly=0;
function loop(){ctx.clearRect(0,0,W,H);for(let i=P.length-1;i>=0;i--){const p=P[i];p.t++;p.x+=p.vx;p.y+=p.vy;p.vy+=.06;p.vx*=.97;const k=1-p.t/p.l;if(k<=0){P.splice(i,1);continue}
  ctx.globalAlpha=k;ctx.fillStyle=k>.6?'#fff4d6':'#c9a45c';ctx.beginPath();ctx.arc(p.x,p.y,p.s*k,0,7);ctx.fill()}
  ctx.globalAlpha=1;if(P.length)requestAnimationFrame(loop);else run=false}
addEventListener('pointerdown',e=>add(e.clientX,e.clientY,22,4.2,46,2.6));
if(fine)addEventListener('pointermove',e=>{const d=Math.hypot(e.clientX-lx,e.clientY-ly);if(d>14){lx=e.clientX;ly=e.clientY;add(lx,ly,1,.6,34,1.6)}});
/* eyebrow scramble */
const chars='ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';
const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;io.unobserve(en.target);const el=en.target,txt=el.dataset.t;let f=0;const N=22;
  (function tick(){f++;el.textContent=[...txt].map((c,i)=>c===' '||c==='·'||i<(f/N)*txt.length?c:chars[Math.random()*chars.length|0]).join('');if(f<N)requestAnimationFrame(tick);else el.textContent=txt})()}),{rootMargin:'0px 0px -10% 0px'});
document.querySelectorAll('.eyebrow').forEach(el=>{if(el.children.length)return;el.dataset.t=el.textContent;io.observe(el)});
/* counters */
const co=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;co.unobserve(en.target);const el=en.target,to=+el.dataset.count,suf=el.dataset.suf||'';const t0=performance.now(),D=1600;
  (function t(n){const k=Math.min(1,(n-t0)/D),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=window.fa?fa(v)+suf:v+suf;if(k<1)requestAnimationFrame(t)})(t0)}));
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));
/* depth parallax inside featured cards */
if(fine)document.querySelectorAll('.fcard').forEach(c=>{const b=c.querySelector('.browser'),ph=c.querySelector('.phone');c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;if(ph)ph.style.translate=`${x*-26}px ${y*-18}px`;if(b)b.style.translate=`${x*10}px ${y*8}px`});c.addEventListener('pointerleave',()=>{if(ph)ph.style.translate='';if(b)b.style.translate=''})});
})();
