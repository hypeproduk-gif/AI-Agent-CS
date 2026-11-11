const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('file://'+__dirname+'/lp-preview.html');await p.waitForTimeout(500);
console.log(await p.evaluate(()=>[getComputedStyle(document.querySelector('.btn')).color, document.documentElement.scrollWidth, document.body.scrollHeight]));
await p.screenshot({path:'/tmp/claude-0/qa/lp.png',fullPage:true});await b.close()})();
