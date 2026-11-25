
(()=>{'use strict';
const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
const aura=document.createElement('div');aura.className='cursor-aura';aura.setAttribute('aria-hidden','true');document.body.append(aura);
const cards=[...document.querySelectorAll('.capability-card,.certification-card,.work-card,.project-art')];cards.forEach(c=>c.classList.add('depth-card'));
let frame=0,x=0,y=0,px=0,py=0,active=false;
const enabled=()=>fine.matches&&!reduce.matches&&!document.documentElement.classList.contains('motion-off');
function draw(){frame=0;if(!active||!enabled())return;px+=(x-px)*.22;py+=(y-py)*.22;aura.style.transform='translate3d('+px+'px,'+py+'px,0)';if(Math.abs(x-px)+Math.abs(y-py)>.15)frame=requestAnimationFrame(draw)}
function hide(){active=false;aura.classList.remove('is-visible');cancelAnimationFrame(frame);frame=0}
document.addEventListener('pointermove',e=>{if(!enabled()||e.pointerType==='touch'){hide();return}x=e.clientX;y=e.clientY;if(!active){px=x;py=y;active=true}aura.classList.add('is-visible');const drag=!!e.target.closest('#scene'),link=!!e.target.closest('a,button,summary,input');aura.classList.toggle('is-link',link);aura.classList.toggle('is-drag',drag);aura.textContent=drag?'DRAG':'';if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
document.addEventListener('pointerdown',()=>aura.classList.add('is-pressed'));
document.addEventListener('pointerup',()=>aura.classList.remove('is-pressed'));
document.addEventListener('pointercancel',hide);document.documentElement.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});
function reset(){hide();cards.forEach(c=>{c.style.transform='';c.style.removeProperty('--light-x');c.style.removeProperty('--light-y')})}
new MutationObserver(()=>{if(!enabled())reset()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});fine.addEventListener('change',reset);reduce.addEventListener('change',reset);
cards.forEach(c=>{c.addEventListener('pointermove',e=>{if(!enabled()||e.pointerType==='touch')return;const b=c.getBoundingClientRect(),u=(e.clientX-b.left)/b.width,v=(e.clientY-b.top)/b.height;c.style.setProperty('--light-x',u*100+'%');c.style.setProperty('--light-y',v*100+'%');c.style.transform='perspective(1100px) rotateX('+((.5-v)*5)+'deg) rotateY('+((u-.5)*6)+'deg)';});c.addEventListener('pointerleave',()=>c.style.transform='')});
})();
