/* 3D explainer "what is a visual identity": layers fly in with scroll, then the system explodes into an axonometric stack */
(function(){
const sec=document.getElementById('bx');if(!sec)return;
const world=document.getElementById('bxWorld'),stage=document.getElementById('bxStage'),steps=[...document.querySelectorAll('#bxSteps li')],bar=document.getElementById('bxBar');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* layout grid on the base plate */
(function(){let o='';const W=960,H=600,m=48,g=16,c=12,cw=(W-2*m-g*(c-1))/c;
  for(let i=0;i<c;i++){const x=m+i*(cw+g);o+=`<rect class="gc" x="${x}" y="${m}" width="${cw}" height="${H-2*m}" fill="#e7a24b" opacity=".045"/>`}
  for(let y=m;y<=H-m;y+=24)o+=`<line class="gl" x1="${m}" y1="${y}" x2="${W-m}" y2="${y}" stroke="#e7a24b" stroke-opacity=".08"/>`;
  o+=`<rect x="${m}" y="${m}" width="${W-2*m}" height="${H-2*m}" fill="none" stroke="#e7a24b" stroke-opacity=".35" stroke-dasharray="6 6"/>`;
  o+=`<text x="${W-m}" y="${m-14}" fill="#e7a24b" font-size="13" text-anchor="end" font-family="Yekan Bakh">۱۲ ستون · حاشیه‌ی ۴۸</text>`;
  document.getElementById('bxGrid').innerHTML=o})();
/* dune pattern tile */
(function(){let o='<rect width="240" height="110" fill="#1a120c"/>';const cols=['#5a3a22','#8b5a2e','#c07a3d','#e7a24b'];
  for(let i=0;i<9;i++){const y=14+i*12;o+=`<path d="M-10 ${y} C30 ${y-10} 60 ${y+8} 100 ${y-2} S170 ${y-12} 250 ${y+2}" fill="none" stroke="${cols[i%4]}" stroke-width="5" stroke-linecap="round" opacity="${.55+.05*i}"/>`}
  o+='<circle cx="200" cy="26" r="11" fill="#e7a24b"/>';document.getElementById('bxPat').innerHTML=o})();

const order=['bx-plate','bx-pat','bx-logo','bx-sw','bx-type','bx-card','bx-pack','bx-story'];
const layers=[...world.querySelectorAll('.bx-l')].map(el=>({el,a:parseFloat(el.dataset.in||0),z:order.findIndex(c=>el.classList.contains(c))}));
const bounds=[0,.1,.2,.3,.4,.48,.66,1.01];
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
let mx=0,my=0,tx=0,ty=0,p=reduce?.62:0,sc=1;
function fit(){const w=stage.clientWidth,h=stage.clientHeight;sc=Math.min(w/(w<600?990:1080),h/720,1)}
fit();addEventListener('resize',fit);
if(!reduce&&matchMedia('(hover:hover)').matches)stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5});
stage.addEventListener('pointerleave',()=>{tx=0;ty=0});
function prog(){if(reduce)return;const r=sec.getBoundingClientRect();p=cl(-r.top/(r.height-innerHeight))}
addEventListener('scroll',prog,{passive:true});prog();
function render(){
  mx+=(tx-mx)*.08;my+=(ty-my)*.08;
  const e=ease(cl((p-.66)/.26));
  const gridT=cl((p-.4)/.08);
  world.style.setProperty('--grid',gridT);
  document.getElementById('bxGrid').style.opacity=.15+.85*Math.max(gridT,e);
  layers.forEach(L=>{
    const t=L.a===0?1:ease(cl((p-L.a)/.08));
    const z=lerp(L.z*2,L.z*95-260,e);
    L.el.style.opacity=L.a===0?1:t;
    L.el.style.transform=`translate3d(0,${(1-t)*120}px,${z-(1-t)*1100}px) rotateY(${(1-t)*-55}deg) rotateX(${(1-t)*25}deg) scale(${.6+.4*t})`;
    const own=L.a===0&&L.el.classList.contains('bx-plate')?cl((p-.4)/.04)*(1-cl((p-.48)/.04)):(t>0&&t<1?1:0);
    const justIn=cl(1-(p-L.a-.08)/.06);
    L.el.style.setProperty('--lab',Math.max(e,L.el.classList.contains('bx-plate')?own:(t>.2?justIn*(p>=L.a?1:0):0)));
  });
  const logo=world.querySelector('.bx-logo');logo.style.setProperty('--g',Math.max(1-cl(p/.1),e*.8));
  const rx=lerp(6,56,e)+my*-10,rz=lerp(0,-26,e),ry=mx*14;
  world.style.transform=`scale(${sc*lerp(1,.86,e)}) translateY(${lerp(0,30,e)}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
  let k=0;for(let i=0;i<bounds.length-1;i++)if(p>=bounds[i])k=i;
  steps.forEach((s,i)=>{s.classList.toggle('on',i===k);s.classList.toggle('done',i<k)});
  bar.style.transform=`scaleX(${p})`;
  if(!reduce)requestAnimationFrame(render);
}
render();
})();
