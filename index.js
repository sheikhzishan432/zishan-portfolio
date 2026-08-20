
// PARTICLES
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);
const pts=Array.from({length:50},()=>({
  x:Math.random()*canvas.width,y:Math.random()*canvas.height,
  vx:(Math.random()-.5)*0.3,vy:(Math.random()-.5)*0.3,
  r:Math.random()*1.5+0.5
}));
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function drawParticles(){
  if(prefersReducedMotion)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>canvas.width)p.vx*=-1;
    if(p.y<0||p.y>canvas.height)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(0,255,136,0.6)';ctx.fill();
  });
  pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
    const d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<120){
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle=`rgba(0,255,136,${0.15*(1-d/120)})`;
      ctx.lineWidth=0.5;ctx.stroke();
    }
  }));
  requestAnimationFrame(drawParticles);
}
drawParticles();

// CURSOR (desktop only)
const cur=document.getElementById('cur');
const ring=document.getElementById('cur-ring');
if(window.matchMedia('(pointer:fine)').matches){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
  (function anim(){rx+=(mx-rx)*0.1;ry+=(my-ry)*0.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim)})();
  document.querySelectorAll('a,.service-card,.proj-card,.stat,.contact-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.width='20px';cur.style.height='20px';cur.style.background='rgba(0,255,136,0.5)'});
    el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';cur.style.background='var(--green)'});
  });
}

// HAMBURGER MENU
const hamburger=document.getElementById('hamburger');
const mobileNav=document.getElementById('mobileNav');
hamburger.addEventListener('click',()=>{
  const isOpen=hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded',isOpen);
  document.body.style.overflow=mobileNav.classList.contains('open')?'hidden':'';
});
mobileNav.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  });
});

// SCROLL REVEAL
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('on'),i*80)});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// NAV ACTIVE
window.addEventListener('scroll',()=>{
  const sections=document.querySelectorAll('section[id]');
  const links=document.querySelectorAll('.nav-links a, .mobile-nav a');
  let current='home';
  sections.forEach(s=>{
    if(s.getBoundingClientRect().top<=200)current=s.id;
  });
  links.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+current)});
});

// CLOCK — always shows New Delhi (IST) time regardless of visitor's own timezone
function updateClock(){
  const now=new Date();
  const t=now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Asia/Kolkata'});
  const el=document.getElementById('clock');
  if(el)el.textContent='📍 New Delhi · '+t+' IST';
}
updateClock();
setInterval(updateClock,1000);

// CONTACT FORM — builds a pre-filled email since this is a static site with no backend
const contactForm=document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('cf-name').value.trim();
    const email=document.getElementById('cf-email').value.trim();
    const message=document.getElementById('cf-message').value.trim();
    const status=document.getElementById('cf-status');
    if(!name||!email||!message){
      status.textContent='Please fill in your name, email, and a short message.';
      status.style.color='#ff6b6b';
      return;
    }
    const subject=`Project inquiry from ${name}`;
    const body=`${message}\n\n—\n${name}\n${email}`;
    const mailto=`mailto:zishan7970@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href=mailto;
    status.style.color='#00ff88';
    status.textContent='Opening your email app to send this…';
  });
}
