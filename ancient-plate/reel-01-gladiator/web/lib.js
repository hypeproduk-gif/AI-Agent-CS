const W=1080,H=1920,FPS=30,INK='#221c22';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const eIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const eOut=t=>1-Math.pow(1-t,3);
const eBack=t=>{const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const eEl=t=>t<=0?0:t>=1?1:Math.pow(2,-10*t)*Math.sin((t*10-.75)*2*Math.PI/3)+1;
const prog=(t,a,d)=>clamp((t-a)/d);
// keyframes: kf(t,[[t0,v0],[t1,v1],...],ease)
function kf(t,k,e=eIO){if(t<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(t<=k[i][0]){const u=(t-k[i-1][0])/(k[i][0]-k[i-1][0]);return lerp(k[i-1][1],k[i][1],e(u))}return k[k.length-1][1]}
function rnd(s){const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function circ(c,x,y,r,fill,lw=10,stroke=INK){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=stroke;c.stroke()}}
function ell(c,x,y,rx,ry,fill,lw=10,rot=0){c.beginPath();c.ellipse(x,y,rx,ry,rot,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=INK;c.stroke()}}
function rrect(c,x,y,w,h,r,fill,lw=10){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=INK;c.stroke()}}
function line(c,pts,lw=12,col=INK){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.lineWidth=lw;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';c.stroke()}
function poly(c,pts,fill,lw=10){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))c.lineTo(p[0],p[1]);c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=INK;c.lineJoin='round';c.stroke()}}
function shadow(c,x,y,rx){ell(c,x,y,rx,rx*.18,'rgba(34,28,34,.22)',0)}
function burst(c,x,y,r,t,col='#ffd23f'){if(t<0||t>1)return;const s=eOut(t)*r,a=1-t;c.save();c.globalAlpha=a;const n=12,pts=[];for(let i=0;i<n*2;i++){const ang=i*Math.PI/n+t;const rr=i%2?s*.5:s;pts.push([x+Math.cos(ang)*rr,y+Math.sin(ang)*rr])}poly(c,pts,col,8);c.restore();
 c.save();c.globalAlpha=a;for(let i=0;i<8;i++){const ang=i*Math.PI/4+.3;line(c,[[x+Math.cos(ang)*s*1.1,y+Math.sin(ang)*s*1.1],[x+Math.cos(ang)*s*1.45,y+Math.sin(ang)*s*1.45]],10)}c.restore()}
function txt(c,s,x,y,size,col='#fff',font='Poppins',weight=700,stroke=14,align='center'){c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.textBaseline='middle';c.lineJoin='round';if(stroke){c.lineWidth=stroke;c.strokeStyle=INK;c.strokeText(s,x,y)}c.fillStyle=col;c.fillText(s,x,y)}
function sparkle(c,x,y,r,col='#fff'){poly(c,[[x,y-r],[x+r*.25,y-r*.25],[x+r,y],[x+r*.25,y+r*.25],[x,y+r],[x-r*.25,y+r*.25],[x-r,y],[x-r*.25,y-r*.25]],col,5)}
