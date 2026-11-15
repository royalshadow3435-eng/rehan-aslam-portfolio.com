(function(){
var f=document.getElementById('cf'),n=document.getElementById('note'),btn=f.querySelector('button[type=submit]'),label=btn.textContent,TO='royalshadow3435@gmail.com',busy=false;
function say(m,ok){n.className='note'+(ok?' ok':'');n.textContent=m;if(m){try{n.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}}}
function mail(d){var to=(window.SITE&&SITE.contact&&SITE.contact.email)||TO;
var body='Name: '+d.name+'\nEmail: '+d.email+'\nProject type: '+d.type+'\nBudget: '+d.budget+'\n\n'+d.message;
window.location.href='mailto:'+to+'?subject='+encodeURIComponent('Project enquiry: '+d.type)+'&body='+encodeURIComponent(body)}
f.addEventListener('submit',function(e){e.preventDefault();if(busy)return;
if(!f.checkValidity()){f.reportValidity();say('Please complete the highlighted fields.');return}
var fd=new FormData(f),d={};['name','email','type','budget','message','website'].forEach(function(k){d[k]=(fd.get(k)||'').toString().trim()});
busy=true;btn.disabled=true;btn.textContent='Sending...';say('');
fetch('api.php?a=message',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
.then(function(r){return r.json().then(function(j){if(!r.ok||!j.ok){var x=new Error(j.error||'failed');x.soft=r.status>=400&&r.status<500;throw x}return j})})
.then(function(){say('Thank you, '+d.name.split(' ')[0]+'! Your message has been sent. I will reply within one day.',true);f.reset()})
.catch(function(x){if(x.soft){say(x.message)}else{say('We could not send your message directly, so your email app is opening with it ready to send.');mail(d)}})
.then(function(){busy=false;btn.disabled=false;btn.textContent=label})});
f.addEventListener('input',function(){if(n.textContent&&!n.classList.contains('ok'))say('')});
})();
