const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const pg = await b.newPage();
  await pg.goto('file://' + process.cwd() + '/book.html');
  await pg.evaluate(() => document.fonts.ready);
  const bad = await pg.evaluate(() => {
    const res = [];
    document.querySelectorAll('.pg').forEach(p => {
      const i = p.querySelector('.in'); if (!i) return;
      const z = i.firstElementChild; let v = parseFloat(z.style.zoom) || 1;
      while (i.scrollHeight - i.clientHeight > 1 && v > 0.8) { v = +(v - 0.01).toFixed(2); z.style.zoom = v; }
      if (!p.className.includes('lic')) { while (v < 1.2 && i.scrollHeight - i.clientHeight <= 1) { z.style.zoom = +(v + 0.01).toFixed(2); v = +(v + 0.01).toFixed(2); } if (i.scrollHeight - i.clientHeight > 1) { v = +(v - 0.01).toFixed(2); z.style.zoom = v; } }
      const left = i.clientHeight - z.getBoundingClientRect().height;
      if (v < 1.0 || i.scrollHeight - i.clientHeight > 1) res.push({ n: p.dataset.n, zoom: v, over: i.scrollHeight - i.clientHeight });
      if (left > 150) res.push({ n: p.dataset.n, spare_px: Math.round(left) });
    });
    return res;
  });
  console.log('FIT', JSON.stringify(bad));
  await pg.pdf({ path: 'out/Pagi-Tanpa-Drama-Workbook.pdf', width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
