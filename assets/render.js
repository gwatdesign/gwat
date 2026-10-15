/* Applies window.SITE content to the current page. Runs before app.js so animations pick up the new markup. */
(function(){const S=window.SITE;if(!S)return;
const page=(document.querySelector('[data-page]')||{}).dataset?.page;
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const q=s=>document.querySelector(s);
if(page==='home'&&S.home){const h=S.home;
  if(h.eyebrow&&q('.hero .eyebrow'))q('.hero .eyebrow').textContent=h.eyebrow;
  if(h.title&&q('#ht'))q('#ht').innerHTML=esc(h.title).replace(/\n/g,'<br>');
  if(h.lead&&q('.hero .lead'))q('.hero .lead').textContent=h.lead;
  if(h.statement&&q('#stmt'))q('#stmt').textContent=h.statement;
  const n=(S.web||[]).length;const c=q('.stats3d [data-count]');if(c&&n){c.dataset.count=n;c.textContent=fa(n)}
  const more=q('.shead .more[href="web.html"]');if(more&&n)more.firstChild.textContent=`همه‌ی ${fa(n)} پروژه‌ی سایت `;}
if(page==='web'&&S.web&&q('#cases')){
  q('#cases').innerHTML=S.web.map((w,i)=>{const im=w.img||{};const num=fa(String(i+1).padStart(2,'0'));
    const shots=im.d?`<div class="browser"><div class="bar"><i></i><i></i><i></i><span>${esc(w.id)}</span></div><img src="${esc(im.d)}" alt="${esc(w.title)}" loading="lazy"></div>${im.m?`<div class="phone"><img src="${esc(im.m)}" alt="" loading="lazy"></div>`:''}`
      :im.poster?`<img src="${esc(im.poster)}" alt="${esc(w.title)}" style="width:min(260px,70%);border-radius:18px;border:1px solid var(--line-2);box-shadow:0 30px 70px -20px #000">`:'';
    const live=w.url?`<a class="beam solid" href="${esc(w.url)}"${/^https?:/.test(w.url)?' target="_blank" rel="noopener"':''}>مشاهده‌ی سایت زنده <span aria-hidden="true">←</span></a>`:'';
    return `<article class="glass case rv" id="${esc(w.id)}"><div class="case-top"><div>
      <span class="num">${num} · ${esc(w.year||'')}${w.tag?' · '+esc(w.tag):''}</span><h2>${esc(w.title)}</h2>${w.desc?`<p>${esc(w.desc)}</p>`:''}
      ${(w.did||[]).length?`<ul class="did">${w.did.map(d=>`<li>${esc(d)}</li>`).join('')}</ul>`:''}
      ${(w.chips||[]).length?`<div class="chips">${w.chips.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`:''}
      ${(w.stats||[]).length?`<div class="stats">${w.stats.map(([b,s])=>`<div><b>${esc(fa(b))}</b><span>${esc(s)}</span></div>`).join('')}</div>`:''}
      ${live}</div><div class="shots"${im.d?'':' style="display:grid;place-items:center;min-height:260px"'}>${shots}</div></div>
      ${(w.shots||[]).length?`<div class="thumbs" data-set="${esc(w.id)}"></div>`:''}</article>`}).join('\n');}
if(page==='home'&&(S.reviews||[]).length&&q('#reviews')){q('#reviews').hidden=false;
  q('#rvGrid').innerHTML=S.reviews.map(r=>`<figure class="glass rv-card rv"><svg class="qm" viewBox="0 0 40 30" aria-hidden="true"><path d="M0 30V17C0 7 6 1 16 0v6c-5 1-8 5-8 10h8v14zm24 0V17c0-10 6-16 16-17v6c-5 1-8 5-8 10h8v14z"/></svg><blockquote>${esc(r.text)}</blockquote><figcaption><span class="av">${esc((r.name||'?').trim().charAt(0))}</span><div><b>${esc(r.name)}</b><small>${esc(r.role||'')}</small></div>${r.project?`<span class="pj">${esc(r.project)}</span>`:''}</figcaption></figure>`).join('');}
if(page==='contact'&&S.contact){const c=S.contact;
  if(c.telegram&&q('#tg'))q('#tg').textContent=c.telegram;if(c.instagram&&q('#ig'))q('#ig').textContent=c.instagram;
  const f=document.querySelectorAll('.facts b');if(f[0]&&c.response)f[0].textContent=c.response;if(f[1]&&c.build)f[1].textContent=c.build;}
})();
