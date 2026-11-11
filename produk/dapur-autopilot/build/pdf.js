const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.join(__dirname,'dapur-autopilot.html'));await p.waitForTimeout(800);
await p.pdf({path:path.join(__dirname,'..','output','Dapur-Autopilot-ToolkitParenting.pdf'),preferCSSPageSize:true,printBackground:true});
await b.close();console.log('pdf ok')})();
