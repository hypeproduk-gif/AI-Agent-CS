const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const only = process.argv[2];
  for (const f of fs.readdirSync('html').sort()) {
    if (only && !f.startsWith(only)) continue;
    await pg.goto('file://' + process.cwd() + '/html/' + f);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(150);
    await pg.locator('#c').screenshot({ path: 'out/' + f.replace('.html', '.png') });
  }
  await b.close();
})();
