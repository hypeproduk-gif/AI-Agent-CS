// Tes skor riset produk. Pakai: node n8n/test/research.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'product-research.js'), 'utf8'), ctx);
const { productResearch, researchReport, toNumber, RESEARCH } = vm.runInContext('({ productResearch, researchReport, toNumber, RESEARCH })', ctx);

const now = Date.parse('2026-09-25T00:00:00Z');
const daysAgo = (d) => Math.floor((now - d * 864e5) / 1000);
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('ok -', name); };

test('parse angka format Indonesia', () => {
  assert.strictEqual(toNumber('Rp89.000'), 89000);
  assert.strictEqual(toNumber('10,5RB'), 10500);
  assert.strictEqual(toNumber('1,2jt'), 1200000);
  assert.strictEqual(toNumber(1234), 1234);
});

const cfg = { ...RESEARCH, keywords: ['pembersih kerak', 'celana korset'] };
const raw = {
  shopee: {
    'pembersih kerak': [
      { name: 'Pembersih Kerak Kamar Mandi', price: 8900000000, sold: 5000, shopid: 1 },
      { name: 'Cairan Pembersih Kerak', price: '99.000', sold: 3000, shopid: 2 },
      { name: 'Pembersih Kerak Keramik', price: 120000, sold: 2000, shopid: 3 },
    ],
    'celana korset': [{ name: 'Korset', price: 25000, sold: 50, shopid: 9 }],
  },
  ads: {
    'pembersih kerak': [
      { id: '1', page_name: 'A', ad_delivery_start_time: daysAgo(45) },
      { id: '2', page_name: 'B', ad_delivery_start_time: daysAgo(40) },
      { id: '3', page_name: 'C', ad_delivery_start_time: daysAgo(2) },
    ],
  },
  tiktok: [{ product_name: 'Pembersih Kerak Toilet', rank: 5, post_change: 120 }],
};

test('skor & urutan keyword', () => {
  const rows = productResearch(raw, cfg, now);
  assert.strictEqual(rows[0].keyword, 'pembersih kerak');
  assert.strictEqual(rows[0].provenAds, 2);
  assert.strictEqual(rows[0].advertisers, 3);
  assert.strictEqual(rows[0].priceMedian, 99000);
  assert.strictEqual(rows[0].tiktokHits, 1);
  assert.ok(rows[0].score > 60, 'skor ' + rows[0].score);
  assert.ok(rows[1].notes.includes('harga terlalu murah'));
  assert.ok(rows[0].provenExamples[0].includes('ads/library/?id=1'));
});

test('laporan Telegram', () => {
  const text = researchReport(productResearch(raw, cfg, now), cfg);
  assert.ok(text.includes('1. pembersih kerak'));
  assert.ok(text.includes('Rp99.000'));
});

test('workflow ter-build', () => {
  require('child_process').execFileSync('node', [path.join(__dirname, '..', 'build-research.js')]);
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'product-research.workflow.json'), 'utf8'));
  for (const n of wf.nodes.filter((n) => n.type.endsWith('.code'))) new Function('$', '$input', n.parameters.jsCode);
  assert.deepStrictEqual(Object.keys(wf.connections).length, 5);
});

// ---------- Ad Library → LP ----------
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'ad-to-lp.js'), 'utf8'), ctx);
const { pickWinners, lpRequest, parseLpReply, renderLp, contentReport, chunkText } =
  vm.runInContext('({ pickWinners, lpRequest, parseLpReply, renderLp, contentReport, chunkText })', ctx);

const apifyAds = [
  { ad_archive_id: '1', page_name: 'Brand Store', start_date: daysAgo(60), collation_count: 12, snapshot: { body: { text: 'Tikus kabur dalam 3 hari! COD 99rb dapat 3 pcs' } } },
  { ad_archive_id: '2', page_name: 'Brand Store', start_date: daysAgo(45), collation_count: 3, snapshot: { body: { text: 'Tikus kabur dalam 3 hari! COD 99rb dapat 3 pcs' } } },
  { ad_archive_id: '3', page_name: 'Amanah', start_date: daysAgo(35), snapshot: { cards: [{ body: 'Usir tikus tanpa racun' }] } },
  { ad_archive_id: '4', page_name: 'Baru', start_date: daysAgo(2), snapshot: { body: { text: 'Promo baru' } } },
  { ad_archive_id: '5', page_name: 'Kosong', start_date: daysAgo(90), snapshot: {} },
];

test('pilih winner: gabung duplikat, urut paling lama', () => {
  const p = pickWinners(apifyAds, now);
  assert.strictEqual(p.proven, 2);
  assert.strictEqual(p.winners[0].page, 'Brand Store');
  assert.strictEqual(p.winners[0].days, 60);
  assert.strictEqual(p.winners[0].variants, 15);
  assert.strictEqual(p.winners[1].body, 'Usir tikus tanpa racun');
});

test('fallback ke iklan terlama kalau belum ada yang ≥30 hari', () => {
  const p = pickWinners([apifyAds[3]], now);
  assert.strictEqual(p.proven, 0);
  assert.strictEqual(p.winners.length, 1);
});

const brief = { keyword: 'pengusir tikus', price: 'Rp99.000 / 3 pcs', wa: '085180108370', code: 'PT' };
const copy = {
  product: 'Pengusir Tikus Herbal', angle: 'tanpa racun, aman untuk anak',
  insights: ['penawaran 3 pcs'],
  lp: { headline: 'Tikus <pergi>', problems: ['berisik malam'], benefits: ['aman'], how_to_use: ['taruh'],
    offer: { title: 'Paket Hemat', price_text: 'Rp99.000' }, faq: [{ q: 'COD?', a: 'Bisa' }], cta: 'Pesan Sekarang' },
  ads: [{ angle: 'anak', hook: 'Ada suara di plafon?', script: 's', visual: 'v', primary_text: 'p', headline: 'h' }],
};

test('request Claude memuat iklan pesaing', () => {
  const r = lpRequest(brief, pickWinners(apifyAds, now));
  assert.ok(r.messages[0].content.includes('jalan 60 hari, 15 variasi'));
  assert.ok(r.system.includes('Jangan mengarang testimoni'));
});

test('parse balasan Claude & render LP', () => {
  const parsed = parseLpReply({ content: [{ type: 'text', text: 'Berikut:\n' + JSON.stringify(copy) }] });
  const html = renderLp(parsed, brief);
  assert.ok(html.includes('https://wa.me/6285180108370?text='));
  assert.ok(html.includes('Tikus &lt;pergi&gt;'));
  assert.ok(html.includes("product: 'PT'"));
  assert.ok(html.includes('[ISI TESTIMONI ASLI'));
});

test('laporan konten dipecah ≤ 4096 karakter', () => {
  const text = contentReport(copy, brief, pickWinners(apifyAds, now)) + '\n' + 'x'.repeat(5000);
  const parts = chunkText(text);
  assert.ok(parts.length >= 2 && parts.every((p) => p.length <= 4096));
  assert.ok(parts[0].includes('Hook: Ada suara di plafon?'));
});

test('workflow LP ter-build', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ad-to-lp.workflow.json'), 'utf8'));
  for (const n of wf.nodes.filter((n) => n.type.endsWith('.code'))) new Function('$', '$input', '$json', n.parameters.jsCode);
  assert.strictEqual(wf.nodes.length, 7);
  assert.ok(!wf.nodes.some((n) => String(n.parameters.url || '').includes('anthropic')));
  assert.ok(wf.nodes.some((n) => n.type === 'n8n-nodes-base.telegramTrigger'));
});
test('daftar winning: nama produk, URL iklan & LP', () => {
  const winnerList = vm.runInContext('winnerList', ctx);
  const ads = [
    { adArchiveID: '11', pageName: 'Brand Store', startDate: daysAgo(50), collationCount: 4,
      snapshot: { title: 'Pengusir Tikus Herbal | Bonus', link_url: 'https://toko.id/tikus', body: { text: 'COD 99rb' } } },
    { adArchiveID: '12', pageName: 'Amanah', startDate: daysAgo(40),
      snapshot: { cards: [{ title: 'Kamper Anti Tikus', link_url: 'https://amanah.id/lp', body: 'Usir tikus' }] } },
  ];
  const p = pickWinners(ads, now);
  const text = winnerList(p, { keyword: 'pengusir tikus' });
  assert.ok(text.includes('2 iklan jalan ≥30 hari'));
  assert.ok(text.includes('1. Pengusir Tikus Herbal'));
  assert.ok(text.includes('Iklan: https://www.facebook.com/ads/library/?id=11'));
  assert.ok(text.includes('LP: https://amanah.id/lp'));
  assert.ok(text.includes('• Kamper Anti Tikus'));
});

test('perintah /riset dari Telegram', () => {
  const parse = vm.runInContext('parseRisetCommand', ctx);
  const a = parse('/riset pengusir tikus');
  assert.strictEqual(a.keyword, 'pengusir tikus');
  assert.strictEqual(a.code, 'PT');
  assert.strictEqual(a.wa, '6285180108370');
  const b = parse('riset foam toilet | Rp99.000 3 pcs | ft2');
  assert.strictEqual(b.price, 'Rp99.000 3 pcs');
  assert.strictEqual(b.code, 'FT2');
  assert.strictEqual(parse('/riset@HypeBot sisir kucing').keyword, 'sisir kucing');
  assert.strictEqual(parse('halo'), null);
  assert.strictEqual(parse('/riset'), null);
});
console.log(`${passed} tes lulus`);
