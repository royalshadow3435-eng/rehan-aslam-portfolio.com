(function(){
var $=function(s){return document.querySelector(s)};
var S,CSRF='',DEF=false,sec='dash';
var CATS=['Poster Design','Logo Design','Color Grading & Design','Brochure Design','Menu Design','Packaging Design'];
var ICONS=['poster','logo','menu','pack','bro','card','star','tro','mic','hex','spk'];
var LBL={h1:'Main heading',h2:'Section heading',h3:'Sub heading',p:'Paragraph',cite:'Name or source',small:'Small text',span:'Label',a:'Button or link text',num:'Counter number'};
var NAV=[['Overview',[['dash','Dashboard']]],['Edit page text',[['p:home','Home page'],['p:portfolio','Portfolio page'],['p:about','About page'],['p:services','Services page'],['p:awards','Awards page'],['p:contact','Contact page'],['p:g','Header and footer']]],['Manage content',[['services','Services and prices'],['awards','Awards and achievements'],['projects','Portfolio projects']]],['Settings',[['contact','Contact details and social links'],['images','Profile photo'],['theme','Color theme'],['password','Login and password']]]];
var DESC={services:'Add, remove and price your services.',awards:'Add or remove awards.',projects:'Add projects and upload thumbnails.',contact:'Email, WhatsApp, Instagram, YouTube.',images:'Change the photo used on Home and About.',theme:'Switch the colors of the whole website.',password:'Change your username and password.'};
var LISTS={
services:{t:'Services and prices',i:'Each service appears on the Services page. Price is a number only, for example 140. Tick the box on one service to show it as the wide monthly plan card.',blank:{title:'New service',price:'100',desc:'',icon:'logo',plan:false,features:''},lab:function(o){return o.title+' ($'+o.price+')'},f:[['title','Service name'],['price','Starting price (number only)'],['desc','Description','area'],['icon','Icon','sel',ICONS],['plan','','check','Show as the wide monthly plan card'],['features','Plan benefits, one per line (wide plan card only)','area']]},
awards:{t:'Awards and achievements',i:'These appear on the Awards page, in this order.',blank:{title:'New award',year:'2026',org:'',desc:'',icon:'tro'},lab:function(o){return o.title+' ('+o.year+')'},f:[['title','Award name'],['year','Year'],['org','Presented by'],['desc','Why it matters','area'],['icon','Icon','sel',ICONS]]},
projects:{t:'Portfolio projects',i:'Projects appear on the Portfolio page. Tick "Show on Home page" to feature a project in the Home gallery (the first six are shown).',blank:{title:'New project',cat:CATS[0],short:'',desc:'',featured:false,image:''},lab:function(o){return o.title+' ('+o.cat+')'},f:[['title','Project title'],['cat','Category','sel',CATS],['short','One line description'],['featured','','check','Show on Home page'],['desc','Full description (shown when opened)','area'],['image','Thumbnail image','img']]}};
var THEMES=[['charcoal','Charcoal Orange',['#1c1d21','#ff6a1f','#2e7bff']],['midnight','Midnight Blue',['#0b1226','#4aa8ff','#22e3c9']],['purple','Slate Purple',['#1d1b27','#a78bfa','#f472b6']],['emerald','Emerald Dark',['#0f1a17','#34d399','#fbbf24']]];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function toast(m,e){var t=$('#toast');t.textContent=m;t.className='show'+(e?' err':'');clearTimeout(toast.t);toast.t=setTimeout(function(){t.className=''},3800)}
function api(a,body,form){var o={method:body?'POST':'GET',credentials:'same-origin',headers:{'X-CSRF':CSRF}};
if(form)o.body=body;else if(body){o.body=JSON.stringify(body);o.headers['Content-Type']='application/json'}
return fetch('../api.php?a='+a,o).then(function(r){return r.json().catch(function(){throw new Error('The server did not answer correctly. Check that PHP is enabled on your hosting.')}).then(function(j){if(!r.ok)throw new Error(j.error||'Something went wrong.');return j})})}
function save(m){return api('save',S).then(function(){toast(m||'Saved. Your live website is updated.')}).catch(function(e){toast(e.message,1)})}
function shrink(f){return new Promise(function(res){if(f.type==='image/gif'||!window.createImageBitmap)return res(f);
createImageBitmap(f).then(function(b){var k=Math.min(1,1600/Math.max(b.width,b.height)),c=document.createElement('canvas');c.width=Math.round(b.width*k);c.height=Math.round(b.height*k);c.getContext('2d').drawImage(b,0,0,c.width,c.height);
c.toBlob(function(x){res(x||f)},'image/webp',.88)}).catch(function(){res(f)})})}
function upload(f){return shrink(f).then(function(b){var fd=new FormData();fd.append('file',b,'image.webp');return api('upload',fd,true)}).then(function(j){return j.path})}
function nav(){$('#nav').innerHTML=NAV.map(function(g){return '<h4>'+g[0]+'</h4>'+g[1].map(function(i){return '<button data-s="'+i[0]+'"'+(i[0]===sec?' class="on"':'')+'>'+i[1]+'</button>'}).join('')}).join('')}
function bar(t,p,extra){return '<div class="bar"><div><h1>'+t+'</h1><p>'+p+'</p></div><div>'+(extra||'')+'<button class="b1" data-act="save">Save changes</button></div></div>'}
function dash(){var h='';NAV.slice(1).forEach(function(g){g[1].forEach(function(i){h+='<button class="dc" data-s="'+i[0]+'"><h3>'+i[1]+'</h3><p>'+(DESC[i[0]]||'Edit the words on this page.')+'</p></button>'})});
return '<div class="bar"><div><h1>Dashboard</h1><p>Pick what you want to change. Every save updates your live website straight away.</p></div></div>'+(DEF?'<button class="warn" data-s="password">You are still using the default login (admin / Admin@345). Click here to change it now.</button>':'')+'<div class="cards">'+h+'</div>'}
function textPage(pg){var keys=Object.keys(S.textmeta).filter(function(k){return k.indexOf(pg+'.')===0}).sort(function(a,b){return a.localeCompare(b,undefined,{numeric:true})});
var name=({g:'Header and footer'})[pg]||pg.charAt(0).toUpperCase()+pg.slice(1)+' page';
return bar(name+' text','Change the words shown on this page. The grey text in each label shows the original wording so you can find the right box.')+keys.map(function(k){var m=S.textmeta[k],v=S.text[k]==null?'':S.text[k],long=v.length>70||v.indexOf('\n')>-1;
return '<div class="panel"><label>'+(LBL[m.t]||'Text')+' <span style="font-weight:400">· '+esc(m.o)+'</span>'+(long?'<textarea rows="3" data-tk="'+k+'">'+esc(v)+'</textarea>':'<input data-tk="'+k+'" value="'+esc(v)+'">')+'</label></div>'}).join('')}
function fld(f,o,l,i){var a='data-l="'+l+'" data-i="'+i+'" data-k="'+f[0]+'"',v=o[f[0]],c=f[2],h;
if(c==='area')h='<textarea rows="3" '+a+'>'+esc(v)+'</textarea>';
else if(c==='sel')h='<select '+a+'>'+f[3].map(function(x){return '<option'+(x===v?' selected':'')+'>'+esc(x)+'</option>'}).join('')+'</select>';
else if(c==='check')return '<div class="w"><label class="chk"><input type="checkbox" '+a+(v?' checked':'')+'> '+f[3]+'</label></div>';
else if(c==='img')return '<div class="w"><label>'+f[1]+'</label><div class="imgf">'+(v?'<img src="../'+esc(v)+'" alt="">':'<div class="noimg">No image yet</div>')+'<input type="file" accept="image/*" data-up="1" '+a+'>'+(v?'<button class="b2" data-act="rmimg" '+a+'>Remove image</button>':'')+'</div></div>';
else h='<input value="'+esc(v)+'" '+a+'>';
return '<div'+(c==='area'?' class="w"':'')+'><label>'+f[1]+h+'</label></div>'}
function listView(l){var L=LISTS[l],A=S[l];
return bar(L.t,L.i,'<button class="b2" data-act="add" data-l="'+l+'">+ Add new</button>')+(A.length?'':'<p>Nothing here yet. Click "Add new".</p>')+A.map(function(o,i){var d='data-l="'+l+'" data-i="'+i+'"';
return '<div class="item"><div class="ih"><b>'+esc(L.lab(o))+'</b><span><button class="b2" data-act="up" '+d+'>Up</button><button class="b2" data-act="down" '+d+'>Down</button><button class="b2 rm" data-act="del" '+d+'>Remove</button></span></div><div class="fg">'+L.f.map(function(f){return fld(f,o,l,i)}).join('')+'</div></div>'}).join('')}
function contact(){var C=S.contact;return bar('Contact details and social links','These update the Contact page, the footer on every page and the contact form.')+'<div class="panel fg">'+[['email','Email address'],['whatsapp','WhatsApp (a number, or "Available on Request")'],['instagram','Instagram profile link (https://...)'],['youtube','YouTube channel link (https://...)']].map(function(f){return '<label>'+f[1]+'<input data-c="'+f[0]+'" value="'+esc(C[f[0]])+'"></label>'}).join('')+'</div>'}
function images(){var p=S.images.profile;return bar('Profile photo','This photo appears on the Home and About pages. Project thumbnails are changed under Portfolio projects.')+'<div class="panel"><div class="imgf">'+(p?'<img src="../'+esc(p)+'" alt="" style="width:160px;height:200px">':'<div class="noimg" style="width:160px;height:200px">Placeholder in use</div>')+'<input type="file" accept="image/*" data-up="1" data-l="images" data-k="profile">'+(p?'<button class="b2" data-act="rmimg" data-l="images" data-k="profile">Use placeholder</button>':'')+'</div><p style="color:var(--mut);margin-top:1rem">Choosing a file uploads it and updates the live website immediately.</p></div>'}
function theme(){return '<div class="bar"><div><h1>Color theme</h1><p>Click a theme. It changes the colors of every page of your live website straight away.</p></div></div><div class="themes">'+THEMES.map(function(t){return '<button class="th2'+(S.theme===t[0]?' on':'')+'" data-act="theme" data-id="'+t[0]+'">'+t[2].map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'<b>'+t[1]+'</b></button>'}).join('')+'</div>'}
function password(){return '<div class="bar"><div><h1>Login and password</h1><p>Choose your own username and a strong password (at least 8 characters).</p></div></div><div class="panel fg"><label class="w">Current password<input type="password" id="pc" autocomplete="current-password"></label><label>New username<input id="pu" value="admin"></label><label>New password<input type="password" id="pw" autocomplete="new-password"></label><label>Repeat new password<input type="password" id="pw2" autocomplete="new-password"></label><div class="w"><button class="b1" data-act="pw">Change login</button></div></div>'}
function show(s){sec=s;nav();var m=$('#main');
m.innerHTML=s==='dash'?dash():s.indexOf('p:')===0?textPage(s.slice(2)):LISTS[s]?listView(s):({contact:contact,images:images,theme:theme,password:password})[s]();window.scrollTo(0,0)}
function boot(){$('#login').hidden=true;$('#app').hidden=false;api('get').then(function(j){S=j;S.images=S.images||{};S.textmeta=S.textmeta||{};show('dash')}).catch(function(e){toast(e.message,1)})}
function handle(t){if(t.dataset.tk!=null)S.text[t.dataset.tk]=t.value;else if(t.dataset.c)S.contact[t.dataset.c]=t.value;else if(t.dataset.l&&t.dataset.i!=null&&!t.dataset.up)S[t.dataset.l][+t.dataset.i][t.dataset.k]=t.type==='checkbox'?t.checked:t.value}
var main=$('#main');
main.addEventListener('input',function(e){handle(e.target)});
main.addEventListener('change',function(e){var t=e.target;if(t.dataset.up&&t.files[0]){toast('Uploading...');upload(t.files[0]).then(function(p){if(t.dataset.l==='images')S.images[t.dataset.k]=p;else S[t.dataset.l][+t.dataset.i][t.dataset.k]=p;return save('Image uploaded. Your live website is updated.')}).then(function(){show(sec)}).catch(function(e){toast(e.message,1)})}else handle(t)});
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset;
if(d.s){show(d.s);return}
if(d.act==='save')save();
else if(d.act==='add'){S[d.l].push(JSON.parse(JSON.stringify(LISTS[d.l].blank)));show(sec);toast('Added at the bottom. Fill it in, then click Save changes.')}
else if(d.act==='del'){if(confirm('Remove this item? The change goes live when you click Save changes.')){S[d.l].splice(+d.i,1);show(sec)}}
else if(d.act==='up'||d.act==='down'){var a=S[d.l],i=+d.i,j=d.act==='up'?i-1:i+1;if(j>=0&&j<a.length){var x=a[i];a[i]=a[j];a[j]=x;show(sec)}}
else if(d.act==='rmimg'){if(d.l==='images')S.images[d.k]='';else S[d.l][+d.i][d.k]='';save('Image removed. Your live website is updated.').then(function(){show(sec)})}
else if(d.act==='theme'){S.theme=d.id;document.documentElement.dataset.theme=d.id;try{localStorage.th=d.id}catch(x){}save('Theme applied to your whole live website.').then(function(){show('theme')})}
else if(d.act==='pw'){var n=$('#pw').value;if(n!==$('#pw2').value){toast('The two new passwords do not match.',1);return}
api('password',{cur:$('#pc').value,user:$('#pu').value,pw:n}).then(function(){DEF=false;toast('Login changed. Use the new details next time.');show('password')}).catch(function(e){toast(e.message,1)})}});
$('#out').onclick=function(){api('logout',{}).then(function(){location.reload()})};
$('#lf').onsubmit=function(e){e.preventDefault();$('#lerr').textContent='';
api('login',{user:$('#lu').value,pass:$('#lp').value}).then(function(j){CSRF=j.csrf;DEF=j.def;boot()}).catch(function(x){$('#lerr').textContent=x.message})};
api('check').then(function(j){if(j.ok){CSRF=j.csrf;DEF=j.def;boot()}else $('#login').hidden=false}).catch(function(){$('#login').hidden=false;$('#lerr').textContent='Cannot reach the server. The Admin Panel needs PHP hosting (see README).'});
})();
