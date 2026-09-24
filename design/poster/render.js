const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:+(process.argv[3]||1)});
  await p.goto('file://'+__dirname+'/poster.html',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  await p.waitForTimeout(500);
  const m=await p.evaluate(()=>[...document.querySelectorAll('.title,.subtitle,.url .txt,.footer .t span')].map(e=>{const r=document.createRange();r.selectNodeContents(e);return [e.className,r.getBoundingClientRect().width|0,getComputedStyle(e).fontSize]}));
  console.log(JSON.stringify(m), await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').length));
  await p.screenshot({path:process.argv[2]||'out.png'});
  await b.close();
})();
