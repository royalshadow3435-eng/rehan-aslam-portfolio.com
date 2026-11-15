(function(){
var q=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var P=[],grid=q('#grid')[0],tabs=q('.tab'),lb=q('#lb')[0],last=null,cur='All';
function col(c){return (window.COL||{})[c]||['var(--or)','var(--ord)']}
function render(cat){cur=cat;grid.innerHTML='';
var L=P.filter(function(p){return cat==='All'||p.cat===cat});
if(!L.length){grid.innerHTML='<p style="color:var(--mut)">No projects in this category yet.</p>';return}
L.forEach(function(p,i){var c=col(p.cat),a=document.createElement('button');a.type='button';a.className='pc rv';a.dataset.i=i;
a.style.setProperty('--a',c[0]);a.style.setProperty('--b2',c[1]);
a.innerHTML='<div class="th"><span></span></div><div class="pi"><h3></h3><p></p></div>';
if(p.image){var im=document.createElement('img');im.src=p.image;im.alt=p.title;im.loading='lazy';q('.th',a)[0].insertBefore(im,q('span',a)[0])}
q('span',a)[0].textContent=p.cat;q('h3',a)[0].textContent=p.title;q('p',a)[0].textContent=p.short;
a.addEventListener('click',function(){openLb(p,a)});grid.appendChild(a)});
observeReveal(q('.pc',grid))}
tabs.forEach(function(t){t.addEventListener('click',function(){
if(t.getAttribute('aria-pressed')==='true')return;
tabs.forEach(function(x){x.setAttribute('aria-pressed',x===t)});
grid.classList.add('out');setTimeout(function(){render(t.dataset.cat);grid.classList.remove('out')},320)})});
function openLb(p,from){last=from;var c=col(p.cat),i=q('.lbi',lb)[0];lb.style.setProperty('--a',c[0]);lb.style.setProperty('--b2',c[1]);
i.style.background=p.image?'url("'+p.image.replace(/"/g,'%22')+'") center/cover':'';
q('#lbc')[0].textContent=p.cat;q('#lbt')[0].textContent=p.title;q('#lbd')[0].textContent=p.desc;
lb.classList.add('show');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';q('.x',lb)[0].focus()}
function closeLb(){lb.classList.remove('show');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';if(last)last.focus()}
lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('x'))closeLb()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('show'))closeLb()});
document.addEventListener('siteready',function(){P=((window.SITE||{}).projects)||[];render('All')});
})();
