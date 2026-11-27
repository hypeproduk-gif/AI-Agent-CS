// Stick rig. o: {x,y (feet), s, la, ra, lb, rb (elbow bends), ll, rl (leg angles), face, look, helmet, belly, coat, toga, lean, hold:fn(ctx,handR), holdL}
function limb(c,x,y,a,b,len,lw){const ex=x+Math.sin(a)*len*.5,ey=y+Math.cos(a)*len*.5;const hx=ex+Math.sin(a+b)*len*.5,hy=ey+Math.cos(a+b)*len*.5;line(c,[[x,y],[ex,ey],[hx,hy]],lw);return [hx,hy]}
function drawStick(c,o){
 const s=o.s||1,lw=13*s;c.save();c.translate(o.x,o.y);c.rotate(o.lean||0);c.scale(s,s);const L=13;
 shadow(c,0,0,90);
 const hip=[0,-150],neck=[0,-330],hr=78;
 // legs
 line(c,[hip,[Math.sin(o.ll??-.25)*150,hip[1]+Math.cos(o.ll??-.25)*150]],L);
 line(c,[hip,[Math.sin(o.rl??.25)*150,hip[1]+Math.cos(o.rl??.25)*150]],L);
 if(o.toga){poly(c,[[-55,-330],[55,-330],[75,-120],[-75,-120]],'#f4efe2',9);line(c,[[-50,-320],[60,-150]],7,'#b03a2e')}
 if(o.coat){poly(c,[[-50,-330],[50,-330],[70,-110],[-70,-110]],'#ffffff',9);line(c,[[0,-330],[0,-110]],6)}
 // torso
 line(c,[neck,hip],L);
 if(o.glad){ // belt + skirt
  poly(c,[[-48,-175],[48,-175],[60,-105],[-60,-105]],'#c8553d',9);line(c,[[-50,-178],[50,-178]],14,'#e3b23c')}
 if(o.belly>0){const b=o.belly;ell(c,14*b,-235,40+70*b,55+50*b,'#f6d7b0',10)}
 // arms
 const sh=[0,-300];
 const hl=limb(c,sh[0],sh[1],o.la??-.45,o.lb??.2,190,L);
 const hrp=limb(c,sh[0],sh[1],o.ra??.45,o.rb??-.2,190,L);
 if(o.holdL)o.holdL(c,hl);if(o.hold)o.hold(c,hrp);
 // head
 const hy=neck[1]-hr+8;
 circ(c,0,hy,hr,'#fff',L);
 face(c,0,hy,o.face||'happy',o.look||0,o.t||0);
 if(o.helmet){c.beginPath();c.arc(0,hy+4,hr+6,Math.PI*1.02,Math.PI*1.98);c.closePath();c.fillStyle='#e3b23c';c.fill();c.lineWidth=10;c.strokeStyle=INK;c.stroke();
  line(c,[[-hr-8,hy+4],[hr+8,hy+4]],12);
  c.beginPath();c.ellipse(0,hy-hr-18,22,40,0,Math.PI,0);c.fillStyle='#c8302a';c.fill();c.lineWidth=9;c.stroke();
  for(let i=-3;i<=3;i++)line(c,[[i*14,hy-hr-20],[i*14+4,hy-hr-50+Math.abs(i)*6]],0.1)}
 if(o.sweat){const ph=(o.t*2)%1;c.save();c.globalAlpha=1-ph;poly(c,[[hr-5,hy-30+ph*60],[hr+8,hy-8+ph*60],[hr-18,hy-8+ph*60]],'#7fd3ff',5);c.restore()}
 c.restore();
}
function face(c,x,y,f,look,t){
 const ex=24,ey=-8,lx=look*10;
 if(f==='shock'){circ(c,x-ex+lx,y+ey,17,'#fff',7);circ(c,x+ex+lx,y+ey,17,'#fff',7);circ(c,x-ex+lx,y+ey,7,INK,0);circ(c,x+ex+lx,y+ey,7,INK,0);ell(c,x+lx,y+32,13,18,INK,0)}
 else if(f==='disgust'){line(c,[[x-ex-12,y+ey-6],[x-ex+10,y+ey+4],[x-ex-12,y+ey+12]],7);line(c,[[x+ex+12,y+ey-6],[x+ex-10,y+ey+4],[x+ex+12,y+ey+12]],7);
  line(c,[[x-26,y+38],[x-13,y+30],[x,y+38],[x+13,y+30],[x+26,y+38]],7);ell(c,x-44,y+18,13,8,'rgba(120,200,80,.6)',0);ell(c,x+44,y+18,13,8,'rgba(120,200,80,.6)',0)}
 else if(f==='angry'){circ(c,x-ex+lx,y+ey,7,INK,0);circ(c,x+ex+lx,y+ey,7,INK,0);line(c,[[x-ex-16,y+ey-22],[x-ex+10,y+ey-12]],8);line(c,[[x+ex+16,y+ey-22],[x+ex-10,y+ey-12]],8);line(c,[[x-18,y+36],[x+18,y+36]],8)}
 else if(f==='think'){circ(c,x-ex+8,y+ey-6,7,INK,0);circ(c,x+ex+8,y+ey-6,7,INK,0);line(c,[[x-6,y+34],[x+16,y+30]],8)}
 else if(f==='eat'){const m=Math.abs(Math.sin(t*18));c.beginPath();c.arc(x-ex,y+ey+4,10,Math.PI*1.1,Math.PI*1.9);c.lineWidth=7;c.strokeStyle=INK;c.stroke();c.beginPath();c.arc(x+ex,y+ey+4,10,Math.PI*1.1,Math.PI*1.9);c.stroke();ell(c,x,y+34,16,4+12*m,INK,0)}
 else if(f==='proud'){c.beginPath();c.arc(x-ex,y+ey+4,10,Math.PI*1.1,Math.PI*1.9);c.lineWidth=7;c.strokeStyle=INK;c.stroke();c.beginPath();c.arc(x+ex,y+ey+4,10,Math.PI*1.1,Math.PI*1.9);c.stroke();c.beginPath();c.arc(x,y+20,24,.15*Math.PI,.85*Math.PI);c.lineWidth=8;c.stroke()}
 else {circ(c,x-ex+lx,y+ey,8,INK,0);circ(c,x+ex+lx,y+ey,8,INK,0);c.beginPath();c.arc(x+lx,y+18,22,.15*Math.PI,.85*Math.PI);c.lineWidth=8;c.strokeStyle=INK;c.stroke()}
}
function sword(c,h,ang){c.save();c.translate(h[0],h[1]);c.rotate(ang);rrect(c,-8,-150,16,140,4,'#dfe6ee',7);line(c,[[-26,-10],[26,-10]],12,'#7a4a2a');line(c,[[-26,-10],[26,-10]],0.1);rrect(c,-7,-10,14,34,4,'#7a4a2a',6);c.restore()}
function shield(c,h){c.save();c.translate(h[0],h[1]);rrect(c,-55,-80,110,160,30,'#c8302a',9);circ(c,0,0,16,'#e3b23c',7);c.restore()}
function bowl(c,x,y,s=1,steam=0,t=0,fill='#e9cf9c'){c.save();c.translate(x,y);c.scale(s,s);ell(c,0,0,95,26,fill,9);c.beginPath();c.moveTo(-95,0);c.quadraticCurveTo(-90,80,0,85);c.quadraticCurveTo(90,80,95,0);c.fillStyle='#b5653b';c.fill();c.lineWidth=9;c.strokeStyle=INK;c.stroke();
 for(let i=0;i<7;i++)circ(c,-60+i*20,-4+rnd(i)*8,6,'#f6e4bd',3);
 if(steam){c.save();c.globalAlpha=.7*steam;for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;c.beginPath();const bx=-40+i*40;c.moveTo(bx,-30-ph*40);c.bezierCurveTo(bx-20,-60-ph*80,bx+20,-90-ph*80,bx,-130-ph*90);c.lineWidth=9;c.strokeStyle='#fff';c.lineCap='round';c.stroke()}c.restore()}
 c.restore()}
