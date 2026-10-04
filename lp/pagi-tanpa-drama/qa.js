const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto('file://' + process.cwd() + '/dist/preview.html', { waitUntil: 'networkidle' }).catch(e => console.log('goto', e.message));
  await pg.waitForTimeout(800);
  const r = await pg.evaluate(() => ({
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    btn: [...document.querySelectorAll('.btn')].map(b => getComputedStyle(b).color + '|' + getComputedStyle(b).webkitTextFillColor),
    bad: [...document.querySelectorAll('img')].filter(i => i.naturalWidth && Math.abs(i.naturalWidth / i.naturalHeight - i.getBoundingClientRect().width / i.getBoundingClientRect().height) > 0.03).map(i => i.alt || i.src.slice(0, 30)),
    font: getComputedStyle(document.querySelector('h1')).fontFamily, fontsOk: document.fonts.check('20px Anton')
  }));
  console.log(JSON.stringify(r));
  await pg.screenshot({ path: '/tmp/th/lp-full.png', fullPage: true });
  await b.close();
})();
