const SHOTS=[];const IMPACTS=[0.93,1.32,2.26,3.02,4.03,7.0,7.47,8.75,10.03,13.37,16.35,19.16,21.5,24.57,25.49];
const G={glad:1,helmet:1};
// 0 arena clash
SHOTS.push({start:0,end:1.75,tr:'whip',draw(c,lt,t){arena(c,t);
 const lunge=kf(lt,[[0,0],[.85,1],[1.0,.7],[1.3,1]]);const fall=prog(lt,1.32,.3);
 drawStick(c,{...G,x:300+lunge*90,y:1420,s:1.05,la:-1.2,ra:2.4-lunge*1.2,rb:-.3,face:'angry',t,hold:(c,h)=>sword(c,h,1.2-lunge*1.4),holdL:(c,h)=>shield(c,h)});
 drawStick(c,{...G,x:800-lunge*40,y:1420,s:1.05,lean:fall*1.2,la:-2.2+lunge,ra:.6,face:lt>1.32?'shock':'angry',t,holdL:(c,h)=>sword(c,h,-1.0+lunge*.9)});
 burst(c,560,1050,170,prog(lt,.9,.3));burst(c,760,1200,140,prog(lt,1.32,.3),'#fff')}});
// 1 real painting
SHOTS.push({start:1.75,end:2.22,tr:'cut',draw(c,lt,t){spiral(c,t,'#2a160f','#3a2015');polaroid(c,'s1_2',lt,'Rome, to the death',-.04);realTag(c,lt)}});
// 2 bowl slam
SHOTS.push({start:2.22,end:2.75,tr:'whip',draw(c,lt,t){kitchen(c,t);table(c);const d=kf(lt,[[0,-700],[.06,0]],eOut);const sq=1+.15*Math.max(0,1-(lt-.06)*6)*(lt>.06);
 c.save();c.translate(540,1150+d);c.scale(sq,2-sq);bowl(c,0,0,2.4,1,t);c.restore();burst(c,540,1050,330,prog(lt,.04,.35))}});
// 3 not meat
SHOTS.push({start:2.75,end:3.95,tr:'whip',draw(c,lt,t){sky(c,'#ffd6a5','#fff1dc');const p=eBack(prog(lt,0,.25));c.save();c.translate(560,820);c.scale(p,p);c.rotate(Math.sin(t*6)*.05);drumstick(c,0,0,2.1);c.restore();stampX(c,540,820,prog(lt,.27,.35));
 drawStick(c,{...G,x:540,y:1500,s:.8,face:'angry',t,la:-.3,ra:.3,lean:Math.sin(t*20)*.06*(lt>.3)})}});
// 4 real barley
SHOTS.push({start:3.95,end:5.55,tr:'whip',draw(c,lt,t){spiral(c,t*.3,'#e3b23c','#f2cf6a');polaroid(c,'s2_2',lt,'barley porridge',.04);realTag(c,lt,880,280);for(let i=0;i<6;i++)stalk(c,(i*190+60)%W,((lt*500+i*300)%2200)-200,1,i)}});
// 5 barley men
SHOTS.push({start:5.55,end:6.6,tr:'whip',draw(c,lt,t){arena(c,t);for(let i=0;i<12;i++)stalk(c,(i*97)%W,((lt*700+i*260)%2100)-250,.9,i*.7+lt);
 drawStick(c,{...G,x:540,y:1470,s:1.25,la:-2.6,ra:2.6,lb:.3,rb:-.3,face:'proud',t,hold:(c,h)=>stalk(c,h[0],h[1]-100,1.3,.2),holdL:(c,h)=>stalk(c,h[0],h[1]-100,1.3,-.2)});
 drawStick(c,{toga:1,x:150,y:1520,s:.6,ra:2.1,face:'happy',t});drawStick(c,{toga:1,x:930,y:1520,s:.6,la:-2.1,face:'happy',t})}});
// 6 real mosaic
SHOTS.push({start:6.6,end:7.44,tr:'whip',draw(c,lt,t){spiral(c,t*.3,'#8a4f2c','#9e5d35');polaroid(c,'s4_1',lt,'real roman mosaic',-.05);realTag(c,lt);burst(c,540,820,300,prog(lt,.38,.35))}});
// 7 beans
SHOTS.push({start:7.44,end:8.72,tr:'whip',draw(c,lt,t){spiral(c,t*.3,'#5aaa46','#6dbd57');polaroid(c,'s3_0',lt,'fava beans',.05);realTag(c,lt,880,280)}});
// 8 lentils
SHOTS.push({start:8.72,end:10.0,tr:'whip',draw(c,lt,t){spiral(c,t*.3,'#c8553d','#d6684f');polaroid(c,'lentil',lt,'lentils',-.04)}});
// 9 porridge pot
SHOTS.push({start:10.0,end:11.2,tr:'whip',draw(c,lt,t){kitchen(c,t);pot(c,540,1080,t,1.5);const st=kf(lt,[[0,0],[1.2,6.28]],x=>x);line(c,[[540+Math.cos(st)*120,980+Math.sin(st)*25],[640,600]],22,'#7a4a2a')}});
// 10 every single day
SHOTS.push({start:11.2,end:12.29,tr:'whip',draw(c,lt,t){kitchen(c,t);table(c,1250);const day=1+Math.floor(Math.pow(lt/1.09,2)*364);calendar(c,540,560,t,Math.min(365,day));
 drawStick(c,{...G,x:540,y:1500,s:1,face:'eat',t,la:-.5,ra:-2.2+Math.abs(Math.sin(t*14))*.6,rb:.4,hold:(c,h)=>{}});bowl(c,540,1270,1.2,1,t)}});
// 11 why
SHOTS.push({start:12.29,end:13.33,tr:'whip',draw(c,lt,t){sky(c,'#8fd3ff','#e4f6ff');cloud(c,250,400,1.2);cloud(c,820,300,.8);rrect(c,-100,1500,W+200,600,0,'#f2d29b',10);
 drawStick(c,{...G,x:540,y:1470,s:1.3,face:'think',t,ra:-2.6,rb:1.9,la:-.4});qmark(c,820,520,prog(lt,.02,.35))}});
// 12 fat armor
SHOTS.push({start:13.33,end:16.85,tr:'whip',draw(c,lt,t){arena(c,t);const b=eEl(prog(lt,.04,.8));const sw=kf(lt,[[0,0],[2.7,0],[3.02,1],[3.2,.6]]);const bounce=prog(lt,3.02,.5);
 drawStick(c,{...G,x:430,y:1440,s:1.15,belly:b,face:lt>3.0?'proud':'happy',t,la:-.6,ra:.6});
 drawStick(c,{...G,x:880-sw*90,y:1440,s:1.0,face:lt>3.05?'shock':'angry',lean:-bounce*.3,t,la:-1.6-sw,lb:.2,holdL:(c,h)=>sword(c,h,-1.3-sw*.8+bounce*2)});
 burst(c,560,1260,220,prog(lt,3.02,.35));if(lt>.1&&lt<2.9){c.save();c.globalAlpha=clamp((lt-.1)*3);txt(c,'+ fat',230,880,80,'#ffd23f','Poppins',700,14);c.restore()}}});
// 13 weirder
SHOTS.push({start:16.85,end:17.8,tr:'whip',draw(c,lt,t){spiral(c,t,'#7b3fbf','#9b5fdf');const z=lerp(1.6,2.4,eIO(clamp(lt/.95)));drawStick(c,{...G,x:540,y:800+330*z,s:z,face:'shock',t})}});
// 14 drank ash
SHOTS.push({start:17.8,end:19.88,tr:'whip',draw(c,lt,t){arena(c,t);const drink=prog(lt,1.1,.25);const gross=lt>1.36;
 drawStick(c,{...G,x:540,y:1450,s:1.25,sweat:1,face:gross?'disgust':'happy',t,la:-.5,ra:lerp(.6,-2.5,drink),rb:lerp(-.2,-1.2,drink),lean:gross?Math.sin(t*30)*.04:0,hold:(c,h)=>cup(c,h[0],h[1]-60,1,'#8f8f8f',drink*-1.1)});
 if(gross){c.save();c.globalAlpha=.18;c.fillStyle='#7fbf3f';c.fillRect(0,0,W,H);c.restore()}burst(c,540,620,220,prog(lt,1.36,.35),'#9a9a9a')}});
// 15 burnt plant
SHOTS.push({start:19.88,end:21.0,tr:'whip',draw(c,lt,t){kitchen(c,t);table(c,1300);const bn=eIO(prog(lt,.15,.8));plant(c,540,1300,2,bn);if(bn<.95)fire(c,540,1310,1.3*(1-bn*.6),t);cup(c,860,1220,1,'#8f8f8f')}});
// 16 stronger bones
SHOTS.push({start:21.0,end:22.12,tr:'whip',draw(c,lt,t){spiral(c,t*.5,'#3fa7d6','#5bbbe6');const fl=eBack(prog(lt,.5,.3));c.save();c.translate(540,820);c.rotate(-.15+Math.sin(t*10)*.03);bone(c,0,0,1.6+fl*.35);
 // arms flexing
 line(c,[[-300,0],[-380,-140]],22);line(c,[[300,0],[380,-140]],22);circ(c,-380,-160,40,'#fff',10);circ(c,380,-160,40,'#fff',10);c.restore();
 for(let i=0;i<5;i++)sparkle(c,540+Math.cos(i*1.3+t*2)*380,820+Math.sin(i*1.7+t*2)*260,30+20*fl,'#ffd23f')}});
// 17 scientist
SHOTS.push({start:22.12,end:23.7,tr:'whip',draw(c,lt,t){digsite(c,t);skeleton(c,540,1220,1.0,0);const wx=kf(lt,[[0,1250],[1.2,820]],eOut);
 drawStick(c,{coat:1,x:wx,y:1420,s:1.05,face:'happy',t,ll:Math.sin(t*12)*.4,rl:-Math.sin(t*12)*.4,ra:-1.8,rb:.5,la:-.4,hold:(c,h)=>magnifier(c,h[0]-20,h[1]-60,.45)})}});
// 18 found in skeletons
SHOTS.push({start:23.7,end:25.33,tr:'whip',draw(c,lt,t){digsite(c,t);const gl=prog(lt,.87,.3);skeleton(c,540,1000,1.45,gl);magnifier(c,540+Math.sin(t*3)*120,960,1.2);
 if(gl>0){c.save();c.globalAlpha=gl;txt(c,'plant ash',540,600,96,'#9dffcf','Poppins',700,16);c.restore()}burst(c,540,1000,260,prog(lt,.87,.35),'#9dffcf')}});
// 19 would you
SHOTS.push({start:25.33,end:27.2,tr:'cut',draw(c,lt,t){arena(c,t);const pt=eBack(prog(lt,.1,.3));
 drawStick(c,{...G,x:540,y:1470,s:1.35,face:'proud',t,la:-.6,ra:lerp(.5,-1.25,pt),rb:-.1,holdL:(c,h)=>bowl(c,h[0],h[1]-20,.8,1,t)})}});
