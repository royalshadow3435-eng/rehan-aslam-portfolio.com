(function(){
var q=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
// Staggered scroll reveal (shared by every page)
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target,d=+t.dataset.i;
if(isNaN(d)){d=Math.max(0,q('.rv',t.parentNode).indexOf(t))}
t.style.transitionDelay=(d%6)*.1+'s';t.classList.add('in');io.unobserve(t);
setTimeout(function(){t.style.transitionDelay=''},1500)})},{threshold:.12});
window.observeReveal=function(els){els.forEach(function(el){io.observe(el)})};
observeReveal(q('.rv'));
// Counters
if(q('.stats').length){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
var el=e.target,b=q('b',el)[0],to=parseFloat(el.dataset.to),d=+el.dataset.d||0,s=el.dataset.s,t0=null;
(function step(t){t0=t0||t;var p=Math.min((t-t0)/1800,1),v=to*(1-Math.pow(1-p,3));b.textContent=v.toFixed(d)+(p<1?'':s);if(p<1)requestAnimationFrame(step)})(performance.now())})},{threshold:.6});
q('.stats div').forEach(function(el){co.observe(el)})}
// Testimonials
var tr=q('.track')[0];
if(tr){var dots=q('.dots button'),n=dots.length,cur=0,timer;
function go(i){cur=(i+n)%n;tr.style.transform='translateX(-'+cur*100+'%)';dots.forEach(function(d,k){d.classList.toggle('on',k===cur)})}
function auto(){clearInterval(timer);timer=setInterval(function(){go(cur+1)},6000)}
dots.forEach(function(d,k){d.addEventListener('click',function(){go(k);auto()})});
tr.addEventListener('click',function(){go(cur+1);auto()});auto()}
// Marquee: duplicate track for endless loop
var m=q('.mq')[0],mt=q('.mqt')[0];if(m&&mt)m.appendChild(mt.cloneNode(true));
// Mobile menu
var bg=q('.burger')[0],menu=q('#menu')[0];
bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
})();
