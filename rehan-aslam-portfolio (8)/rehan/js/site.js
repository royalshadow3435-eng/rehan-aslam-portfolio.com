(function(){
var d=document,r=d.documentElement,q=function(s,c){return [].slice.call((c||d).querySelectorAll(s))};
var IC=window.IC={poster:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',logo:'<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',menu:'<path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',pack:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',bro:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 5v14M15 5v14"/>',card:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h5M7 14h8"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',tro:'<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M8 20h8M10 17h4"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M9 21h6"/>',hex:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 8l4 2.3v4.4L12 17l-4-2.3v-4.4z"/>',spk:'<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>'};
window.COL={"Poster Design":["var(--or)","var(--ord)"],"Logo Design":["var(--bl)","var(--bld)"],"Color Grading & Design":["var(--c3)","var(--or)"],"Brochure Design":["var(--bld)","var(--bl)"],"Menu Design":["var(--or)","var(--c3)"],"Packaging Design":["var(--bg2)","var(--or)"]};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function lines(s){return String(s||'').split('\n').map(function(x){return x.trim()}).filter(Boolean)}
function rv(c){if(window.observeReveal)observeReveal(q('.rv',c))}
function apply(S){
 var T=S.text||{},C=S.contact||{},im=S.images||{};
 if(S.theme){r.dataset.theme=S.theme;try{localStorage.th=S.theme}catch(e){}}
 q('[data-t]').forEach(function(e){var v=T[e.dataset.t];if(v!=null)e.innerHTML=esc(v).replace(/\n/g,'<br>')});
 q('[data-tn]').forEach(function(e){var v=T[e.dataset.tn];if(v!=null&&v!==''){e.dataset.to=v;e.dataset.d=/\./.test(v)?1:0}});
 q('[data-img]').forEach(function(e){var p=im[e.dataset.img];if(p)e.src=p});
 q('[data-c]').forEach(function(e){var k=e.dataset.c,v=C[k.replace('text','')];if(!v)return;
  if(k==='email')e.href='mailto:'+v;else if(k==='emailtext'||k==='whatsapp')e.textContent=v;else if(/^https?:\/\//i.test(v))e.href=v});
 var g=q('#sg')[0];if(g){g.innerHTML=(S.services||[]).map(function(s){
  if(s.plan)return '<article class="rv sub"><div><span class="badge">Best value</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.desc)+'</p><div class="price"><small>Starting at</small>$'+esc(s.price)+'<small>/ month</small></div><a class="btn" href="contact.html">Start my subscription</a></div><ul>'+lines(s.features).map(function(f){return '<li>'+esc(f)+'</li>'}).join('')+'</ul></article>';
  return '<article class="rv card"><svg viewBox="0 0 24 24">'+(IC[s.icon]||IC.logo)+'</svg><h3>'+esc(s.title)+'</h3><p>'+esc(s.desc)+'</p><div class="price"><small>Starting at</small>$'+esc(s.price)+'</div><a class="more" href="contact.html">Request this design</a></article>'}).join('');rv(g)}
 var al=q('#al')[0];if(al){al.innerHTML=(S.awards||[]).map(function(a){return '<li class="rv"><span class="bdg"><svg viewBox="0 0 24 24">'+(IC[a.icon]||IC.tro)+'</svg></span><article class="ac"><span class="yr">'+esc(a.year)+'</span><h3>'+esc(a.title)+'</h3><p class="org">'+esc(a.org)+'</p><p>'+esc(a.desc)+'</p></article></li>'}).join('');rv(al)}
 var w=q('.work')[0];if(w){var f=(S.projects||[]).filter(function(p){return p.featured});if(!f.length)f=S.projects||[];
  w.innerHTML=f.slice(0,6).map(function(p){var c=COL[p.cat]||COL['Logo Design'];return '<a href="portfolio.html" class="rv t" style="--a:'+c[0]+';--b2:'+c[1]+'">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.title)+'" loading="lazy">':'')+'<span>'+esc(p.title)+'<small>'+esc(p.cat)+'</small></span></a>'}).join('');rv(w)}
 d.dispatchEvent(new Event('siteready'))}
function go(S){window.SITE=S;if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',function(){apply(S)});else apply(S)}
fetch('api.php?a=get',{cache:'no-store'}).then(function(r){return r.json()}).then(go).catch(function(){d.dispatchEvent(new Event('siteready'))});
})();
