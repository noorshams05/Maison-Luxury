/* Maison — catalog, navigation and private inquiries */
(function () {
'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const preloader=document.getElementById('preloader');
if(preloader){preloader.classList.add('done');}
const nav=document.getElementById('nav'), toggle=document.getElementById('navToggle'), menu=document.getElementById('mobileMenu');
function navState(){nav.classList.toggle('scrolled',window.scrollY>40);}navState();window.addEventListener('scroll',navState,{passive:true});
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
if('IntersectionObserver' in window&&!reduced){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.05});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
const hero=document.getElementById('heroBg');if(hero&&!reduced){let scheduled=false;window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{if(window.scrollY<window.innerHeight*1.2)hero.style.transform=`translate3d(0,${window.scrollY*.16}px,0)`;scheduled=false;});}},{passive:true});}
const form=document.getElementById('quoteForm');if(!form)return;
const quote=document.getElementById('quote'),message=document.getElementById('qMsg');
function selectProduct(product){message.value="I'm interested in: "+product+".\n\n";quote.scrollIntoView({behavior:reduced?'auto':'smooth'});document.getElementById('qName').focus({preventScroll:true});}
document.querySelectorAll('.product-cta[data-product]').forEach(btn=>btn.addEventListener('click',()=>selectProduct(btn.dataset.product)));
const cards=Array.from(document.querySelectorAll('.product-card')), filters=Array.from(document.querySelectorAll('[data-filter]')),search=document.getElementById('productSearch'),more=document.getElementById('loadMore'),count=document.getElementById('productCount');let category='all',limit=9;
function filterCatalog(){const query=search.value.trim().toLowerCase();const matches=cards.filter(c=>(category==='all'||c.dataset.category===category)&&c.dataset.search.includes(query));cards.forEach(c=>c.hidden=true);matches.slice(0,limit).forEach(c=>c.hidden=false);count.textContent=`Showing ${Math.min(limit,matches.length)} of ${matches.length} pieces`;more.hidden=matches.length<=limit;document.getElementById('noProducts').hidden=matches.length!==0;}
filters.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.filter;limit=9;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));filterCatalog();}));search.addEventListener('input',()=>{limit=9;filterCatalog();});more.addEventListener('click',()=>{limit+=9;filterCatalog();});filterCatalog();
document.querySelectorAll('[data-category-link]').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.categoryLink;limit=9;search.value='';filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));filterCatalog();document.getElementById('shop').scrollIntoView({behavior:reduced?'auto':'smooth'});}));
const slides=Array.from(document.querySelectorAll('.featured-slide'));let slideIndex=0,playing=!reduced,timer;
const pause=document.getElementById('slidePause'),stage=document.querySelector('.featured-stage');
function displaySlide(delta){slideIndex=(slideIndex+delta+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==slideIndex);document.getElementById('slideCount').textContent=String(slideIndex+1).padStart(2,'0')+' / '+slides.length;}
function stopRotation(){clearInterval(timer);}
function startRotation(){stopRotation();if(playing&&!document.hidden)timer=setInterval(()=>{if(!document.getElementById('productDialog').open)displaySlide(1);},6000);}
function pauseLabel(){pause.textContent=playing?'Pause':'Play';pause.setAttribute('aria-label',playing?'Pause product rotation':'Play product rotation');}
if(slides.length){document.getElementById('slidePrev').addEventListener('click',()=>{displaySlide(-1);startRotation();});document.getElementById('slideNext').addEventListener('click',()=>{displaySlide(1);startRotation();});pause.addEventListener('click',()=>{playing=!playing;pauseLabel();startRotation();});stage.addEventListener('mouseenter',stopRotation);stage.addEventListener('mouseleave',startRotation);stage.addEventListener('focusin',stopRotation);stage.addEventListener('focusout',startRotation);document.addEventListener('visibilitychange',startRotation);pauseLabel();startRotation();}
const dialog=document.getElementById('productDialog');let currentProduct;
document.querySelectorAll('[data-preview], [data-featured-preview]').forEach(btn=>btn.addEventListener('click',()=>{currentProduct=window.MAISON_PRODUCTS.find(p=>p.id===(btn.dataset.preview||btn.dataset.featuredPreview));document.getElementById('dialogImage').src=currentProduct.image;document.getElementById('dialogImage').alt=currentProduct.name+' — '+currentProduct.detail;document.getElementById('dialogCollection').textContent=currentProduct.collection;document.getElementById('dialogName').textContent=currentProduct.name;document.getElementById('dialogDetail').textContent=currentProduct.detail;dialog.showModal();}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});document.getElementById('dialogQuote').addEventListener('click',()=>{dialog.close();selectProduct(currentProduct.name+' — '+currentProduct.detail);});
const TEAM_EMAIL='sarahi@msluxuryhomes.com',FORM_ENDPOINT=window.MAISON_FORM_ENDPOINT||'';
const note=document.getElementById('formNote'),fallback=document.getElementById('quoteEmailFallback'),submit=form.querySelector('[type="submit"]');
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;if(document.getElementById('qWebsite').value)return;
const data=Object.fromEntries(new FormData(form));Object.keys(data).forEach(k=>data[k]=String(data[k]).trim());
const body=['Maison private quote request','',...Object.entries(data).filter(([k])=>k!=='website').map(([k,v])=>k+': '+(v||'—'))].join('\n');const mailto='mailto:'+TEAM_EMAIL+'?subject='+encodeURIComponent('Maison Quote Request — '+data.name)+'&body='+encodeURIComponent(body);fallback.href=mailto;
if(!FORM_ENDPOINT){note.textContent='Your inquiry is ready. Complete sending it in your email app using the link below.';fallback.textContent='Open email with my quote request';fallback.focus();return;}
submit.disabled=true;submit.textContent='Sending…';try{const res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)});if(!res.ok)throw new Error('Delivery failed');note.textContent='Thank you — your inquiry has been sent to the Maison team.';note.classList.add('sent');form.reset();fallback.href='mailto:'+TEAM_EMAIL;fallback.textContent='Contact Sarahi directly';}catch{note.textContent='Your inquiry could not be sent. Your details are preserved; use the email link below.';fallback.textContent='Email my quote request';}finally{submit.disabled=false;submit.textContent='Send Quote Request';}
});
})();
