const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav&&nav.classList.toggle('scrolled',scrollY>20),{passive:true});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*60+'ms';io.observe(el)});
// counters
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,t=+el.dataset.count,p=el.dataset.prefix||'',s=el.dataset.suffix||'';let st=null;const f=ts=>{st??=ts;const k=Math.min((ts-st)/1200,1),v=Math.round(t*(1-Math.pow(1-k,3)));el.textContent=p+v+s;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f);cio.unobserve(el)}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
// filters
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));const f=b.dataset.f;document.querySelectorAll('.grid .card, .cases-row .card, .wins-row .win-tile').forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.cat!=='all'&&c.dataset.cat!==f))}));
// accordion
document.querySelectorAll('.acc-head').forEach(h=>h.addEventListener('click',()=>{const it=h.parentElement,open=it.classList.contains('open');document.querySelectorAll('.acc-item').forEach(x=>{x.classList.remove('open');x.querySelector('.acc-head').setAttribute('aria-expanded','false')});if(!open){it.classList.add('open');h.setAttribute('aria-expanded','true')}}));

// wins carousel arrows
const wr=document.getElementById('winsRow');document.querySelectorAll('.wins-btn').forEach(b=>b.addEventListener('click',()=>wr&&wr.scrollBy({left:(+b.dataset.dir)*wr.clientWidth*0.8,behavior:'smooth'})));
