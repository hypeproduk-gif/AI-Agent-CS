// Tes logika Code node. Pakai: node n8n/test/run.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
for (const f of ['prompts.js', 'order-config.js', 'tools.js', 'prepare-context.js', 'parse-reply.js']) {
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

// ===== Simulasi workflow penuh (HTTP tiruan) =====
const { simulate } = require('./simulate');
const mainWf = () => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ai-agent-cs.workflow.json'), 'utf8'));

const SALGLOW_ROW = { phone: '6281', active_product: 'SalGlow', history: '[]' };
const LOCATIONS = { data: [
  { id: 11, subdistrict_name: 'Wonokromo', city_name: 'Kota Surabaya', province_name: 'Jawa Timur', display: 'Wonokromo, Kota Surabaya, Jawa Timur' },
  { id: 12, subdistrict_name: 'Wonokromo', city_name: 'Kab. Bantul', province_name: 'DIY', display: 'Wonokromo, Kab. Bantul, DIY' },
] };
const WAREHOUSES = { data: [
  { warehouse: { id: 7, unique_id: 'wh_jkt', name: 'Gudang Jakarta', warehouse_address: { city: 'Jakarta Barat' } } },
  { warehouse: { id: 8, unique_id: 'wh_sby', name: 'Gudang Surabaya', warehouse_address: { city: 'Kota Surabaya' } } },
] };
const svc = (id, courier, provider, cost, isCod) => ({
  cost, etd: '2-3 hari', is_cod: isCod, shipment_provider_code: provider,
  courier_service: { id, name: 'REG', code: 'reg', courier: { code: courier.toLowerCase(), name: courier } },
});
const COURIERS = { data: [
  svc(1, 'SiCepat', 'mengantar', 9000, true),
  svc(2, 'J&T', 'lincah', 10000, true),
  svc(3, 'J&T', 'mengantar', 12000, true),
  svc(4, 'J&T', 'mengantar', 15000, false),
] };
const toolUse = (name, input) => ({ stop_reason: 'tool_use', content: [
  { type: 'text', text: 'Sebentar kak saya cek ya' },
  { type: 'tool_use', id: 'tu_1', name, input },
] });
const text = (t) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: t }] });

function scenario({ message, row = SALGLOW_ROW, first, order }) {
  const toolResults = [];
  const r = simulate(mainWf(), {
    webhookBody: { phone: '6281', pushName: 'Sari', message, isFromMe: false, isGroup: false },
    row,
    http: (name, { body }) => {
      switch (name) {
        case 'Claude': return first;
        case 'Claude Lanjutan':
          toolResults.push(JSON.parse(body.messages[body.messages.length - 1].content[0].content));
          return text('Balasan akhir ke lead');
        case 'Scalev Lokasi': return LOCATIONS;
        case 'Scalev Gudang': return WAREHOUSES;
        case 'Scalev Kurir': return COURIERS;
        case 'Scalev Buat Order': return order || { id: 'uuid-1', order_id: 'SV123', public_order_url: 'https://pay.example/SV123' };
        default: return { status: true };
      }
    },
  });
  r.toolResults = toolResults;
  r.req = (node) => r.requests.find((q) => q.node === node);
  return r;
}

test('simulasi: cek ongkir COD pilih JNT Mengantar + fee 3%', () => {
  const r = scenario({ message: 'ongkir ke wonokromo surabaya cod berapa?',
    first: toolUse('cek_ongkir', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Kec. Wonokromo', kota: 'Surabaya' }) });
  assert.ok(r.req('Claude').body.tools.length === 2);
  assert.ok(r.req('Scalev Lokasi').url.includes('search=wonokromo'));
  assert.strictEqual(r.req('Scalev Gudang').body.destination_id, 11);
  assert.strictEqual(r.req('Scalev Kurir').body.warehouse_id, 8);
  assert.strictEqual(r.req('Scalev Kurir').body.payment_method, 'cod');
  const res = r.toolResults[0];
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.ongkir, 'Rp12.000');
  assert.strictEqual(res.biaya_cod, 'Rp4.530'); // 3% x 151.000
  assert.strictEqual(res.total, 'Rp155.530');
  assert.ok(!r.req('Scalev Buat Order'));
  assert.strictEqual(r.req('Kirim WhatsApp').body.message, 'Balasan akhir ke lead');
  const claude2 = r.req('Claude Lanjutan').body;
  assert.deepStrictEqual(claude2.tool_choice, { type: 'none' });
});

test('simulasi: buat order transfer → payload Scalev benar & tersimpan', () => {
  const r = scenario({ message: 'iya kak betul, proses ya',
    row: { ...SALGLOW_ROW, ref: 'SG-ABCDE' },
    first: toolUse('buat_order', { paket: 'B2G2', pembayaran: 'transfer', kecamatan: 'Wonokromo', kota: 'Kota Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5 RT 1/2' }) });
  const body = r.req('Scalev Buat Order').body;
  assert.strictEqual(r.req('Scalev Buat Order').url, 'https://api.scalev.com/v3/orders');
  assert.strictEqual(body.payment_method, 'bank_transfer');
  assert.strictEqual(body.courier_service_id, 3); // JNT termurah via mengantar (bukan lincah/SiCepat)
  assert.strictEqual(body.shipment_provider_code, 'mengantar');
  assert.strictEqual(body.warehouse_unique_id, 'wh_sby');
  assert.strictEqual(body.location_id, 11);
  assert.strictEqual(body.customer_phone, '6281');
  assert.strictEqual(body.other_income, undefined);
  assert.ok(body.notes.includes('SG-ABCDE'));
  assert.strictEqual(r.toolResults[0].link_pembayaran, 'https://pay.example/SV123');
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV123');
  assert.ok(r.req('Telegram Admin').body.includes('ORDER MASUK SCALEV'));
  assert.ok(r.req('Telegram Admin').body.includes('SV123 (Transfer, Rp231.000)'));
});

test('simulasi: order COD menambah other_income 3%', () => {
  const r = scenario({ message: 'oke',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5' }) });
  const body = r.req('Scalev Buat Order').body;
  assert.strictEqual(body.payment_method, 'cod');
  assert.strictEqual(body.courier_service_id, 3);
  assert.strictEqual(body.other_income, 4530);
  assert.strictEqual(body.other_income_name, 'Biaya COD 3%');
});

test('simulasi: lokasi ambigu → tanya lead, tidak lanjut ke Scalev', () => {
  const r = scenario({ message: 'ongkir ke wonokromo?',
    first: toolUse('cek_ongkir', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: '' }) });
  assert.strictEqual(r.toolResults[0].ok, false);
  assert.ok(r.toolResults[0].error.includes('Bantul'));
  assert.ok(!r.req('Scalev Gudang'));
  assert.ok(r.req('Kirim WhatsApp'));
});

test('simulasi: order gagal di Scalev → handoff', () => {
  const r = scenario({ message: 'oke',
    order: { error: { message: 'variant not found' } },
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'S', alamat: 'Jl. A' }) });
  assert.strictEqual(r.toolResults[0].ok, false);
  assert.ok(r.toolResults[0].error.includes('variant not found'));
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, '');
});

test('simulasi: cegah order dobel dalam 6 jam', () => {
  const recent = { ...SALGLOW_ROW, last_order_id: 'SV999', last_order_at: new Date(Date.now() - 3600000).toISOString() };
  const r = scenario({ message: 'order lagi', row: recent,
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'S', alamat: 'Jl. A' }) });
  assert.ok(!r.req('Scalev Buat Order'));
  assert.ok(r.toolResults[0].error.includes('SV999'));
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV999');
});

test('simulasi: chat biasa tanpa tool & produk non-SalGlow tanpa tools', () => {
  const r = scenario({ message: 'halo kak', first: text('Halo kak!') });
  assert.ok(!r.req('Scalev Lokasi'));
  assert.strictEqual(r.req('Kirim WhatsApp').body.message, 'Halo kak!');
  assert.ok(!r.req('Telegram Admin'));
  const k = scenario({ message: 'mau bikin cv', row: null, first: text('Bisa kak') });
  assert.strictEqual(k.req('Claude').body.tools, undefined);
});

test('simulasi: pesan dari admin sendiri diabaikan', () => {
  const r = simulate(mainWf(), { webhookBody: { phone: '1', message: 'x', isFromMe: true }, row: null, http: () => ({}) });
  assert.strictEqual(r.requests.length, 0);
});



test('workflow tes ongkir jalan dengan API tiruan & tidak membuat order', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tes-ongkir.workflow.json'), 'utf8'));
  wf.connections.Webhook = { main: [[{ node: 'Siapkan Konteks', type: 'main', index: 0 }]] };
  wf.nodes.push({ name: 'Webhook', type: 'n8n-nodes-base.webhook', parameters: {} });
  const r = simulate(wf, { webhookBody: {}, row: null, http: (name) => ({ 'Scalev Lokasi': LOCATIONS, 'Scalev Gudang': WAREHOUSES, 'Scalev Kurir': COURIERS })[name] });
  assert.ok(!r.requests.some((q) => q.url && q.url.endsWith('/orders')));
  assert.deepStrictEqual(r.outputs['Hitung Ongkir'][0].totals, { price: 139000, shipping: 12000, codFee: 4530, total: 155530 });
});
console.log(`${passed} tes lulus (final)`);
