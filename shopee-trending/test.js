// Pakai: node shopee-trending/test.js
const assert = require('assert');
const { signHeader, trend, score, report, toText } = require('./lib');

const item = (id, sales, price = 50000, rate = 0.1, rating = 4.9) => ({ id: String(id), name: `P${id}`, price, sales, rate, rating, link: `https://s.shopee.co.id/${id}` });
const snaps = [
  { date: '2026-10-01', items: [item(1, 1000), item(2, 5000), item(3, 100)] },
  { date: '2026-10-07', items: [item(1, 1500), item(2, 5050), item(3, 400)] },
  { date: '2026-10-08', items: [item(1, 1600), item(2, 5060), item(3, 900, 30000, 0.15)] },
];

assert.match(signHeader('123', 'sec', '{}', 1700000000), /^SHA256 Credential=123, Timestamp=1700000000, Signature=[0-9a-f]{64}$/);

const d1 = trend(snaps, 1);
assert.deepStrictEqual(d1.map((r) => r.sold), [100, 10, 500]);
const d7 = trend(snaps, 7);
assert.deepStrictEqual(d7.map((r) => r.sold), [600, 60, 800]);
assert.strictEqual(d7[0].baseDate, '2026-10-01');

const ranked = score(d1);
assert.strictEqual(ranked[0].id, '3'); // penjualan & komisi tinggi menang
assert.strictEqual(ranked[2].id, '2'); // total besar tapi stagnan kalah

const single = report([snaps[0]]);
assert.strictEqual(single.periods['1d'][0].id, '2'); // tanpa pembanding → total terjual
assert.ok(toText(report(snaps)).includes('== 7d =='));
console.log('ok - shopee-trending');
