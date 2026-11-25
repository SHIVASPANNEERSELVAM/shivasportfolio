
(()=>{'use strict';
const layer=document.createElement('div');layer.className='ambient-field';layer.setAttribute('aria-hidden','true');const canvas=document.createElement('canvas');layer.append(canvas);document.body.prepend(layer);const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),coarse=matchMedia('(pointer:coarse)');let w=0,h=0,raf=0,last=0,time=0,scroll=scrollY,px=.5,py=.5,tx=.5,ty=.5;
const particles=Array.from({length:48},(_,i)=>({x:((i*73.31)%100)/100,y:((i*37.17)%100)/100,z:.25+(i%5)*.18,r:i%4===0?1.7:.8}));
const enabled=()=>!reduced.matches&&!document.documentElement.classList.contains('motion-off')&&!document.hidden;
function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw();start()}
function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
function draw(){ctx.clearRect(0,0,w,h);const moving=enabled(),t=moving?time:0,s=moving?scroll:0;
glow(w*(.85+Math.sin(t*.12)*.08)+(px-.5)*24,h*.28,Math.max(w*.46,400),'rgba(158,30,49,.16)');
glow(w*.07,h*(.78+Math.cos(t*.1)*.12),Math.max(w*.35,320),'rgba(96,39,110,.12)');
glow(w*.8,h*.94,Math.max(w*.3,280),'rgba(192,67,31,.09)');
const lanes=w<700?5:9;
for(let i=0;i<lanes;i++){ctx.beginPath();for(let j=0;j<=42;j++){const v=j/42,y=v*h,x=w*.84+Math.sin(v*3.7+t*.17+i*.1+s*.00015)*w*.16+i*14+(px-.5)*20;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle='rgba(255,'+(70+i*5)+',68,'+(.025+(i%3)*.009)+')';ctx.lineWidth=.7;ctx.stroke()}
const count=w<700?22:particles.length,points=[];
for(let i=0;i<count;i++){const p=particles[i],x=(p.x*w+Math.sin(t*.12+i)*12+(px-.5)*p.z*24+w)%w,y=((p.y*h-t*(3+p.z*4)-s*p.z*.06)%h+h)%h;points.push({x,y});ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(255,139,108,'+(.14+p.z*.17)+')';ctx.fill()}
if(w>700){for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<125){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='rgba(220,93,77,'+(.05*(1-d/125))+')';ctx.lineWidth=.6;ctx.stroke()}}}
}
function tick(now){raf=0;if(!enabled())return;if(now-last>32){time+=Math.min((now-last)/1000,.05);last=now;px+=(tx-px)*.035;py+=(ty-py)*.035;draw()}raf=requestAnimationFrame(tick)}
function start(){if(enabled()&&!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
function sync(){cancelAnimationFrame(raf);raf=0;draw();start()}
addEventListener('resize',resize,{passive:true});addEventListener('scroll',()=>{scroll=scrollY},{passive:true});addEventListener('pointermove',e=>{if(!coarse.matches&&enabled()){tx=e.clientX/w;ty=e.clientY/h}},{passive:true});
new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);resize();
})();
