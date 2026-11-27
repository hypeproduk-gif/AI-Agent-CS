const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const off=document.createElement('canvas');off.width=W;off.height=H;const oc=off.getContext('2d');
const END=SHOTS[SHOTS.length-1].end;window.TOTAL_FRAMES=Math.round(END*FPS);
const WHIP=.13;
// grain
const gr=document.createElement('canvas');gr.width=540;gr.height=960;{const g=gr.getContext('2d'),d=g.createImageData(540,960);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0)}
// captions: 1-2 words, key words alone
const KEY=new Set(['this','meat','barley','men','beans','lentils','porridge','fat','blade','weirder','ash','bones','skeletons','you','death','gladiator']);
const clean=w=>w.toLowerCase().replace(/[^a-z0-9%']/g,'');
const CHUNKS=[];{let cur=null;WORDS.forEach((w,i)=>{const k=clean(w.w);const solo=KEY.has(k);if(cur&&!solo&&cur.n<2&&cur.line===w.line&&!cur.solo){cur.txt+=' '+k;cur.n++;cur.e=w.e}else{cur={txt:k,s:w.s,e:w.e,n:1,line:w.line,solo,hot:solo||w.w===w.w.toUpperCase()&&w.w.length>2};CHUNKS.push(cur)}});
 CHUNKS.forEach((c,i)=>{c.end=i+1<CHUNKS.length?CHUNKS[i+1].s:c.e+.4})}
function drawCaption(c,t){const ch=CHUNKS.find(k=>t>=k.s-.02&&t<k.end);if(!ch)return;const p=prog(t,ch.s-.02,.14);const s=lerp(.6,1,eBack(p));c.save();c.translate(540,1600);c.scale(s,s);c.rotate((CHUNKS.indexOf(ch)%2?1:-1)*.02);
 txt(c,ch.txt,0,0,ch.txt.length>9?104:124,ch.hot?'#ffd23f':'#fff','Poppins',700,22);c.restore()}
function shotAt(t){for(let i=0;i<SHOTS.length;i++)if(t<SHOTS[i].end)return i;return SHOTS.length-1}
function paint(i,t,dx,blur){const s=SHOTS[i],lt=t-s.start;oc.save();oc.setTransform(1,0,0,1,0,0);
 // camera: push-in + handheld drift
 const dur=s.end-s.start,z=1+.07*clamp(lt/dur)+.012*Math.sin(t*1.7);oc.translate(540+Math.sin(t*1.3)*8,960+Math.cos(t*1.1)*8);oc.rotate(Math.sin(t*.9)*.006);oc.scale(z,z);oc.translate(-540,-960);
 s.draw(oc,lt,t);oc.restore();
 if(!blur){ctx.drawImage(off,dx,0);return}
 const n=7;for(let k=0;k<n;k++){ctx.globalAlpha=k==0?1:1/(k+1);ctx.drawImage(off,dx+(k-n/2)*blur/n,0)}ctx.globalAlpha=1}
function renderFrame(f){const t=f/FPS;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 // shake
 let sh=0,fl=0;for(const im of IMPACTS){const d=t-im;if(d>=0&&d<.3){sh=Math.max(sh,(1-d/.3)*26);if(d<.08)fl=Math.max(fl,.45*(1-d/.08))}}
 ctx.save();ctx.translate((rnd(f)-.5)*sh*2,(rnd(f+99)-.5)*sh*2);
 const i=shotAt(t),s=SHOTS[i];
 const intoNext=s.tr==='whip'&&i<SHOTS.length-1&&s.end-t<WHIP;const fromPrev=i>0&&SHOTS[i-1].tr==='whip'&&t-s.start<WHIP;
 if(intoNext){const u=1-(s.end-t)/WHIP;paint(i,t,-eIO(u)*W*.5,90*u)}
 else if(fromPrev){const u=(t-s.start)/WHIP;paint(i,t,(1-eOut(u))*W*.5,90*(1-u))}
 else paint(i,t,0,0);
 ctx.restore();
 if(fl>0){ctx.fillStyle=`rgba(255,255,255,${fl})`;ctx.fillRect(0,0,W,H)}
 // vignette + grain
 const v=ctx.createRadialGradient(540,900,500,540,960,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(20,10,20,.38)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
 ctx.globalAlpha=.05;ctx.globalCompositeOperation='overlay';ctx.drawImage(gr,-(f*37)%200,-(f*53)%300,W+400,H+600);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 // brand bug
 ctx.save();ctx.globalAlpha=.75;txt(ctx,'ANCIENT PLATE',540,1760,34,'#fff','Lora',700,7);ctx.restore();
 drawCaption(ctx,t)}
function grab(q){return cv.toDataURL('image/jpeg',q)}
