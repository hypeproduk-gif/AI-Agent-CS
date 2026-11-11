const {chromium}=require('playwright');const O=__dirname+'/../preview/';
(async()=>{const b=await chromium.launch();
let p=await b.newPage({viewport:{width:1700,height:1400},deviceScaleFactor:1});
await p.goto('file://'+__dirname+'/creatives.html');await p.waitForTimeout(900);
await (await p.$('#mock')).screenshot({path:O+'preview-produk.png'});
for(const [id,n] of [['a1','creative-1-jam-2147'],['a2','creative-2-malam-pagi'],['a3','creative-3-rak-bekal-besok'],['a4','creative-4-coret-keputusan']])
  await (await p.$('#'+id)).screenshot({path:O+n+'.png'});
p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/lp-preview.html');await p.waitForTimeout(600);
await p.evaluate(()=>document.getElementById('sticky').remove());
await p.screenshot({path:O+'preview-lp-mobile.png',fullPage:true});
await b.close();})();
