// Tes logika Code node. Pakai: node n8n/test/run.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
for (const f of ['prompts.js', 'prepare-context.js', 'parse-reply.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8'), ctx);
}
const { prepareContext, parseReply, detectProduct, isClosingMessage, trimHistory } =
  vm.runInContext('({ prepareContext, parseReply, detectProduct, isClosingMessage, trimHistory })', ctx);

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('ok -', name); };

test('deteksi produk dari chat pertama', () => {
  assert.strictEqual(detectProduct('mau info produk kit nikah dong'), 'KitJelangNikah');
  assert.strictEqual(detectProduct('bikin CV ATS bisa?'), 'KarierKit');
  assert.strictEqual(detectProduct('halo kak'), null);
  assert.strictEqual(prepareContext({ phone: '1', message: 'halo kak' }, null).active_product, 'SalGlow');
});

test('kode ref LP menentukan produk & disimpan', () => {
  const r = prepareContext({ phone: '1', message: 'Halo kak, mau info ya (kode: KJN-7Q2MX)' }, null);
  assert.strictEqual(r.active_product, 'KitJelangNikah');
  assert.strictEqual(r.ref, 'KJN-7Q2MX');
  const next = prepareContext({ phone: '1', message: 'harganya?' }, { phone: '1', active_product: 'KitJelangNikah', ref: 'KJN-7Q2MX' });
  assert.strictEqual(next.ref, 'KJN-7Q2MX');
});

test('override produk kalau lead ganti topik', () => {
  const row = { phone: '1', active_product: 'SalGlow', history: '[]' };
  const r = prepareContext({ phone: '1', message: 'kak kalau bikin CV ada juga?' }, row);
  assert.strictEqual(r.active_product, 'KarierKit');
  assert.strictEqual(r.switchedFrom, 'SalGlow');
  assert.ok(r.requestBody.system.includes('pindah topik dari SalGlow ke KarierKit'));
  const same = prepareContext({ phone: '1', message: 'oke kak' }, row);
  assert.strictEqual(same.active_product, 'SalGlow');
  assert.strictEqual(same.switchedFrom, null);
});

test('keyword closing tidak salah tangkap', () => {
  assert.ok(isClosingMessage('oke saya ambil 2 ya'));
  assert.ok(isClosingMessage('udah transfer kak'));
  assert.ok(isClosingMessage('gas kak'));
  assert.ok(isClosingMessage('bisa COD?'));
  assert.ok(!isClosingMessage('lagi banyak tugas nih'));
  assert.ok(!isClosingMessage('bisa transfer bank apa aja?'));
  assert.ok(!isClosingMessage('kodenya apa kak'));
});

test('pesan gambar tidak bikin error', () => {
  const r = prepareContext({ phone: '62812', message: '', messageType: 'image' }, null);
  assert.strictEqual(r.incoming, '[Lead mengirim gambar]');
});

test('system prompt aman untuk JSON (ada kutip & enter)', () => {
  const r = prepareContext({ phone: '62812', message: 'halo "kak"\nada?' }, null);
  const parsed = JSON.parse(JSON.stringify(r.requestBody));
  assert.ok(parsed.system.includes("'apa aja'"));
  assert.strictEqual(parsed.messages[0].content, 'halo "kak"\nada?');
});

test('histori dipotong & selalu diawali user', () => {
  const long = [];
  for (let i = 0; i < 30; i++) long.push({ role: i % 2 ? 'assistant' : 'user', content: String(i) });
  const t = trimHistory(long.concat([{ role: 'user', content: 'baru' }]));
  assert.ok(t.length <= 20);
  assert.strictEqual(t[0].role, 'user');
  for (let i = 1; i < t.length; i++) assert.notStrictEqual(t[i].role, t[i - 1].role);
});

test('produk terkunci dari data sebelumnya', () => {
  const row = { phone: '62812', active_product: 'KarierKit', history: '[{"role":"user","content":"a"},{"role":"assistant","content":"b"}]' };
  const r = prepareContext({ phone: '62812', message: 'oke lanjut' }, row);
  assert.strictEqual(r.active_product, 'KarierKit');
  assert.strictEqual(r.messages.length, 3);
});

test('mode handoff membuat bot diam', () => {
  assert.strictEqual(prepareContext({ phone: '1', message: 'halo' }, { phone: '1', handoff: 'true' }), null);
});

test('parse balasan: markdown bold jadi WhatsApp bold + token handoff', () => {
  const r = parseReply({ content: [{ type: 'text', text: 'Untuk alergi, **tim CS** bantu ya kak [HANDOFF]' }] });
  assert.strictEqual(r.reply, 'Untuk alergi, *tim CS* bantu ya kak');
  assert.strictEqual(r.needsHuman, true);
});

test('parse balasan: error API pakai fallback', () => {
  const r = parseReply({ type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } });
  assert.strictEqual(r.needsHuman, true);
  assert.strictEqual(r.apiError, 'Overloaded');
});

test('workflow hasil build valid & tanpa secret', () => {
  require('../build.js');
  const raw = fs.readFileSync(path.join(__dirname, '..', 'ai-agent-cs.workflow.json'), 'utf8');
  const wf = JSON.parse(raw);
  assert.ok(!/sk-ant-|uS17XUwe/.test(raw));
  const names = new Set(wf.nodes.map((n) => n.name));
  for (const [from, c] of Object.entries(wf.connections)) {
    assert.ok(names.has(from), from);
    c.main.flat().forEach((t) => assert.ok(names.has(t.node), t.node));
  }
  // Code node harus bisa di-parse sebagai body fungsi
  wf.nodes.filter((n) => n.type === 'n8n-nodes-base.code')
    .forEach((n) => new Function('$', '$input', 'items', n.parameters.jsCode));
});

console.log(`\n${passed} tes lulus`);

test('LP attribution workflow: validasi ref & ambil IP', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lp-attribution.workflow.json'), 'utf8'));
  const code = wf.nodes.find((n) => n.name === 'Validasi').parameters.jsCode;
  const run = (json) => new Function('$input', code)({ first: () => ({ json }) });
  const ok = run({ body: JSON.stringify({ ref: 'KJN-7Q2MX', fbc: 'fb.1.1.abc' }), headers: { 'cf-connecting-ip': '1.2.3.4' } });
  assert.strictEqual(ok[0].json.ref, 'KJN-7Q2MX');
  assert.strictEqual(ok[0].json.client_ip, '1.2.3.4');
  assert.strictEqual(ok[0].json.fbp, '');
  assert.deepStrictEqual(run({ body: { ref: 'hack' } }), []);
});
console.log(`${passed} tes lulus (total)`);
