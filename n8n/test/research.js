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
console.log(`${passed} tes lulus`);
