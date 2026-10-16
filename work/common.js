/* shared: Persian digits, toast, portfolio notice popup, گوات tag (needs ../../assets/sig.js) */
window.fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
window.toman=n=>fa(Number(n).toLocaleString('en-US').replace(/,/g,'٬'))+' تومان';
(function(){
  const S=window.SIG,mark=S?`<svg viewBox="0 0 ${S.w} ${S.h}" aria-hidden="true">${S.fill.map(d=>`<path d="${d}"/>`).join('')}<circle cx="${S.dot[0]}" cy="${S.dot[1]}" r="3.2"/></svg>`:'';
  const name=document.body.dataset.site||'این سایت';
  document.body.insertAdjacentHTML('beforeend',`<div class="gw-tag" aria-label="گوات">${mark}گوات</div><div class="gw-toast" role="status" aria-live="polite"></div>
  <div class="gw-note" role="dialog" aria-modal="true" aria-labelledby="gwT"><div class="gw-card"><div class="gw-ic" aria-hidden="true">✦</div><h2 id="gwT">این سایت یک نمونه‌کار است</h2>
  <p>${name} یک کسب‌وکار خیالی است. این سایت فقط برای نمایش طراحی و انیمیشن ساخته شده و قیمت‌ها، فرم‌ها و اطلاعاتش واقعی نیستند.</p>
  <button type="button" id="gwOk">متوجه شدم، ببینم</button><div class="gw-md">${mark}گوات</div></div></div>`);
  let tt;window.toast=m=>{const t=document.querySelector('.gw-toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3000)};
  const w=document.querySelector('.gw-note'),ok=document.getElementById('gwOk'),key='gw-note-'+location.pathname;
  let seen=false;try{seen=sessionStorage.getItem(key)==='1'}catch(e){}
  const close=()=>{w.classList.remove('on');document.documentElement.style.overflow='';try{sessionStorage.setItem(key,'1')}catch(e){}};
  ok.onclick=close;w.addEventListener('click',e=>{if(e.target===w)close()});addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(w.classList.contains('on'))close();else if(window.parent!==window)window.parent.postMessage('gw-close','*')});
  if(!seen&&!/[?&]shot\b/.test(location.search)&&location.hash!=='#shot')setTimeout(()=>{w.classList.add('on');document.documentElement.style.overflow='hidden';setTimeout(()=>ok.focus(),300)},1300);
  /* reveal helper */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  document.documentElement.classList.add('js');document.querySelectorAll('.rv').forEach(e=>io.observe(e));
})();
