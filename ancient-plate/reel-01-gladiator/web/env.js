const IMG={};['s1_1','s1_2','s2_2','s3_0','s4_1','lentil'].forEach(k=>{const i=new Image();i.src='img/'+k+'.jpg';IMG[k]=i});
function sky(c,top='#5ec8f2',bot='#bfeaff'){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(-200,-200,W+400,H+400)}
function sun(c,x,y,t){c.save();c.translate(x,y);c.rotate(t*.3);for(let i=0;i<12;i++){c.rotate(Math.PI/6);rrect(c,95,-10,50,20,10,'#ffd23f',7)}c.restore();circ(c,x,y,80,'#ffd23f',10)}
function cloud(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.arc(-60,10,45,0,7);c.arc(0,-15,60,0,7);c.arc(60,10,45,0,7);c.fillStyle='#fff';c.fill();c.restore()}
function arena(c,t,ground=1350){sky(c);sun(c,850,330,t);cloud(c,220+t*20,300,1);cloud(c,700-t*15,520,.7);
 // colosseum wall
 rrect(c,-100,620,W+200,ground-620,0,'#e7b47a',10);
 for(let r=0;r<3;r++)for(let i=0;i<9;i++){const x=-40+i*135,y=660+r*200;c.beginPath();c.moveTo(x,y+170);c.lineTo(x,y+60);c.arc(x+45,y+60,45,Math.PI,0);c.lineTo(x+90,y+170);c.closePath();c.fillStyle='#8a4f2c';c.fill();c.lineWidth=8;c.strokeStyle=INK;c.stroke()}
 line(c,[[-100,850],[W+100,850]],10);line(c,[[-100,1050],[W+100,1050]],10);
 // crowd dots
 for(let i=0;i<40;i++){const x=(i*61)%W,b=Math.sin(t*12+i)*6;circ(c,x+15,1240+b-(i%3)*18,14,['#f4efe2','#c8553d','#e3b23c'][i%3],5)}
 rrect(c,-100,ground,W+200,H-ground+200,0,'#f2d29b',10);
 for(let i=0;i<30;i++)circ(c,rnd(i)*W,ground+40+rnd(i+9)*500,4+rnd(i+3)*5,'#d9b47a',0)}
function kitchen(c,t){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5a2e1f');g.addColorStop(1,'#2a160f');c.fillStyle=g;c.fillRect(-200,-200,W+400,H+400);
 for(let r=0;r<8;r++)for(let i=0;i<6;i++)rrect(c,(r%2)*90-60+i*190,120+r*120,180,110,10,'#6e3a26',6);
 // torch glow
 const gl=c.createRadialGradient(540,900,50,540,900,900);gl.addColorStop(0,'rgba(255,170,60,'+(.35+.05*Math.sin(t*20))+')');gl.addColorStop(1,'rgba(255,120,40,0)');c.fillStyle=gl;c.fillRect(0,0,W,H);
 rrect(c,-100,1150,W+200,900,0,'#8b5a3c',10);line(c,[[-100,1190],[W+100,1190]],8,'#6b4029')}
function table(c,y=1150){rrect(c,-100,y,W+200,900,0,'#9c6440',10);for(let i=0;i<5;i++)line(c,[[-100,y+60+i*90],[W+100,y+60+i*90]],5,'#7b4a2e')}
function fire(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);for(let k=0;k<3;k++){const col=['#e8452c','#ff9f1c','#ffe066'][k],sc=1-k*.28;c.beginPath();const fl=Math.sin(t*25+k)*10;c.moveTo(-80*sc,0);c.bezierCurveTo(-90*sc,-80*sc,-20*sc,-120*sc,0+fl,-230*sc);c.bezierCurveTo(20*sc,-120*sc,90*sc,-80*sc,80*sc,0);c.closePath();c.fillStyle=col;c.fill();if(k==0){c.lineWidth=9;c.strokeStyle=INK;c.stroke()}}c.restore()}
function polaroid(c,key,t,label,rot=-.05,cx=540,cy=820,w=840,h=1000){const im=IMG[key];c.save();c.translate(cx,cy);c.rotate(rot+Math.sin(t*2)*.01);
 c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-w/2+22,-h/2+26,w,h+130);
 rrect(c,-w/2,-h/2,w,h+130,8,'#fffaf0',10);
 if(im&&im.width){const z=1.04+t*.12;const ar=im.width/im.height,iw=w-50,ih=h-50;let dw=iw,dh=iw/ar;if(dh<ih){dh=ih;dw=ih*ar}dw*=z;dh*=z;c.save();c.beginPath();c.rect(-iw/2,-h/2+25,iw,ih);c.clip();c.drawImage(im,-dw/2,-h/2+25+ih/2-dh/2,dw,dh);c.fillStyle='rgba(255,160,60,.12)';c.fillRect(-iw/2,-h/2,iw,ih+30);c.restore();c.lineWidth=6;c.strokeStyle=INK;c.strokeRect(-iw/2,-h/2+25,iw,ih)}
 if(label)txt(c,label,0,h/2+52,44,INK,'Lora',700,0);
 // tape
 c.save();c.rotate(.08);rrect(c,-90,-h/2-30,180,60,4,'rgba(255,230,150,.85)',0);c.restore();
 c.restore()}
function realTag(c,t,x=200,y=300){const p=eBack(prog(t,.08,.25));if(p<=0)return;c.save();c.translate(x,y);c.rotate(-.18);c.scale(p,p);rrect(c,-110,-42,220,84,14,'#e8452c',9);txt(c,'REAL',0,4,54,'#fff','Poppins',700,0);c.restore()}
function drumstick(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.rotate(-.5);line(c,[[0,40],[0,200]],34,INK);line(c,[[0,40],[0,200]],20,'#fff');circ(c,-16,210,20,'#fff',8);circ(c,16,210,20,'#fff',8);ell(c,0,-40,110,140,'#b8652e',10);ell(c,-30,-80,30,45,'#d98c4a',0);c.restore()}
function stampX(c,x,y,p){if(p<=0)return;const s=lerp(2.2,1,eOut(clamp(p*2)));c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=clamp(p*3);line(c,[[-200,-200],[200,200]],80,INK);line(c,[[200,-200],[-200,200]],80,INK);line(c,[[-200,-200],[200,200]],56,'#e8452c');line(c,[[200,-200],[-200,200]],56,'#e8452c');c.restore()}
function stalk(c,x,y,s,rot){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);line(c,[[0,0],[0,180]],10,'#a07a2c');for(let i=0;i<6;i++){ell(c,-14,20+i*22,13,22,'#e8c25a',5,.5);ell(c,14,20+i*22,13,22,'#e8c25a',5,-.5)}line(c,[[0,10],[0,-60]],4,'#a07a2c');c.restore()}
function pot(c,x,y,t,s=1){c.save();c.translate(x,y);c.scale(s,s);fire(c,0,170,.8,t);c.beginPath();c.moveTo(-230,-40);c.quadraticCurveTo(-240,170,0,175);c.quadraticCurveTo(240,170,230,-40);c.closePath();c.fillStyle='#4a4a52';c.fill();c.lineWidth=11;c.strokeStyle=INK;c.stroke();ell(c,0,-40,232,50,'#e9cf9c',11);
 for(let i=0;i<6;i++){const ph=(t*1.5+i/6)%1;circ(c,-150+rnd(i)*300,-40-ph*20,10+ph*16,'#f6e4bd',5)}
 c.restore()}
function calendar(c,x,y,t,day){c.save();c.translate(x,y);rrect(c,-170,-190,340,380,24,'#fff',11);rrect(c,-170,-190,340,95,24,'#e8452c',11);for(let i=-1;i<=1;i+=2)rrect(c,i*90-10,-215,20,60,8,'#888',7);
 txt(c,'DAY',0,-142,46,'#fff','Poppins',700,0);txt(c,String(day),0,40,150,INK,'Poppins',700,0);c.restore()}
function cup(c,x,y,s=1,fillc='#8f8f8f',tilt=0){c.save();c.translate(x,y);c.rotate(tilt);c.scale(s,s);poly(c,[[-70,-90],[70,-90],[52,90],[-52,90]],'#c8703f',10);ell(c,0,-90,70,18,fillc,9);line(c,[[-58,-20],[58,-20]],7,'#8a4520');c.restore()}
function plant(c,x,y,s,burn){c.save();c.translate(x,y);c.scale(s,s);const col=burn>0?`rgb(${lerp(90,60,burn)},${lerp(170,55,burn)},${lerp(70,50,burn)})`:'#5aaa46';const h=1-burn*.85;line(c,[[0,0],[0,-260*h]],12,col);for(let i=0;i<4;i++){if(i/4>h)continue;ell(c,-40,-60-i*55,48,20,col,7,.4);ell(c,40,-80-i*55,48,20,col,7,-.4)}
 if(burn>0)ell(c,0,10,70+burn*90,20+burn*30,'#9a9a9a',8);c.restore()}
function bone(c,x,y,s,rot=0){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.beginPath();c.moveTo(-150,-25);c.lineTo(150,-25);c.arc(170,-35,32,Math.PI*.8,Math.PI*.2,false);c.arc(170,35,32,-Math.PI*.2,Math.PI*1.2,false);c.lineTo(-150,25);c.arc(-170,35,32,Math.PI*.2,Math.PI*1.8,false);c.arc(-170,-35,32,Math.PI*1.2,-Math.PI*.2+Math.PI*2,false);c.closePath();c.fillStyle='#fff8e6';c.fill();c.lineWidth=10;c.strokeStyle=INK;c.stroke();c.restore()}
function skeleton(c,x,y,s,glow){c.save();c.translate(x,y);c.scale(s,s);if(glow>0){const g=c.createRadialGradient(0,0,20,0,0,420);g.addColorStop(0,`rgba(140,255,200,${.6*glow})`);g.addColorStop(1,'rgba(140,255,200,0)');c.fillStyle=g;c.fillRect(-450,-450,900,900)}
 circ(c,-260,0,70,'#fff8e6',10);circ(c,-280,-10,14,INK,0);circ(c,-245,-10,14,INK,0);line(c,[[-190,0],[180,0]],14,'#fff8e6');line(c,[[-190,0],[180,0]],4,INK);
 for(let i=0;i<5;i++){ell(c,-120+i*40,0,14,70,null,9)}line(c,[[180,0],[340,-60]],14);line(c,[[180,0],[340,60]],14);line(c,[[-130,0],[-40,-110]],12);line(c,[[-130,0],[-40,110]],12);c.restore()}
function digsite(c,t){sky(c,'#f2a65a','#ffe0a8');sun(c,830,420,t);rrect(c,-100,900,W+200,1200,0,'#d9a45f',10);ell(c,540,1220,470,170,'#a8733d',10);for(let i=0;i<20;i++)circ(c,rnd(i)*W,950+rnd(i+4)*800,5+rnd(i+1)*6,'#b8834d',0)}
function magnifier(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);line(c,[[120,120],[260,260]],40,INK);line(c,[[120,120],[260,260]],26,'#7a4a2a');c.beginPath();c.arc(0,0,170,0,7);c.fillStyle='rgba(200,240,255,.25)';c.fill();c.lineWidth=26;c.strokeStyle=INK;c.stroke();c.lineWidth=14;c.strokeStyle='#e3b23c';c.stroke();c.restore()}
function spiral(c,t,a='#e8452c',b='#ffd23f'){c.fillStyle=a;c.fillRect(-200,-200,W+400,H+400);c.save();c.translate(540,800);c.rotate(t*3);for(let i=0;i<16;i++){c.rotate(Math.PI/8);if(i%2){c.beginPath();c.moveTo(0,0);c.lineTo(1600,-160);c.lineTo(1600,160);c.closePath();c.fillStyle=b;c.fill()}}c.restore()}
function qmark(c,x,y,p){if(p<=0)return;c.save();c.translate(x,y);c.scale(eBack(clamp(p)),eBack(clamp(p)));c.rotate(Math.sin(p*8)*.1);txt(c,'?',0,0,240,'#ffd23f','Poppins',700,20);c.restore()}
