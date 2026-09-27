// Tes logika Code node. Pakai: node n8n/test/run.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
for (const f of ['capi.js', 'recap.js', 'report.js', 'product-facts.js', 'prompts.js', 'order-config.js', 'tools.js', 'prepare-context.js', 'parse-reply.js', 'follow-up.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8'), ctx);
}
const { prepareContext, parseReply, detectProduct, isClosingMessage, trimHistory, dailyRecap, dueFollowUp, followUpRequest, followUpText, appendFollowUp } =
  vm.runInContext('({ prepareContext, parseReply, detectProduct, isClosingMessage, trimHistory, dailyRecap, dueFollowUp, followUpRequest, followUpText, appendFollowUp })', ctx);

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
  assert.ok(parsed.system.includes("'Terima kasih sudah menghubungi'"));
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

test('mode handoff: bot diam tapi pesan tetap dicatat', () => {
  const r = prepareContext({ phone: '1', message: 'saya mau yg 139rb' }, { phone: '1', handoff: 'true', history: '[{"role":"user","content":"a"}]' });
  assert.strictEqual(r.paused, true);
  assert.deepStrictEqual(JSON.parse(r.history).map((m) => m.content), ['a', 'saya mau yg 139rb']);
});

test('jeda handoff otomatis selesai setelah 30 menit', () => {
  const recent = new Date(Date.now() - 10 * 60000).toISOString();
  const old = new Date(Date.now() - 31 * 60000).toISOString();
  assert.strictEqual(prepareContext({ phone: '1', message: 'x' }, { phone: '1', handoff: recent }).paused, true);
  assert.strictEqual(prepareContext({ phone: '1', message: 'x' }, { phone: '1', handoff: old }).paused, undefined);
  assert.strictEqual(prepareContext({ phone: '1', message: 'x' }, { phone: '1', handoff: 'false' }).paused, undefined);
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

const SALGLOW_ROW = { phone: '6281', active_product: 'SalGlow', history: JSON.stringify([{ role: 'user', content: 'data saya ...' }, { role: 'assistant', content: 'Baik kak, berikut ringkasan ordernya ya ... Total bayar sesuai di atas. Sudah benar kak? saya proses ya' }]) };
const LOCATIONS = { data: [
  { id: 11, subdistrict_name: 'Wonokromo', city_name: 'Kota Surabaya', province_name: 'Jawa Timur', display: 'Wonokromo, Kota Surabaya, Jawa Timur' },
  { id: 12, subdistrict_name: 'Wonokromo', city_name: 'Kab. Bantul', province_name: 'DIY', display: 'Wonokromo, Kab. Bantul, DIY' },
] };
const POSTAL = { data: [
  { postal_code: '60243', urban: 'Jagir' },
  { postal_code: '60244', urban: 'Ngagel Rejo' },
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
        case 'Scalev Kode Pos': return POSTAL;
        case 'Scalev Gudang': return WAREHOUSES;
        case 'Scalev Kurir': return COURIERS;
        case 'Scalev Buat Order': return order || { id: 'uuid-1', order_id: 'SV123', public_order_url: 'https://pay.example/SV123' };
        case 'Scalev Update Order': return { data: { id: 'patched' } }; // respons PATCH tanpa order_id
        case 'Scalev Lead Order': return { id: 'lead-uuid', order_id: 'SV-LEAD' };
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
  assert.strictEqual(res.biaya_cod, 'Rp5.000'); // 3% x 151.000
  assert.strictEqual(res.total, 'Rp156.000');
  assert.ok(!r.req('Scalev Buat Order'));
  assert.strictEqual(r.req('Kirim WhatsApp').body.message, 'Balasan akhir ke lead');
  const claude2 = r.req('Claude Lanjutan').body;
  assert.deepStrictEqual(claude2.tool_choice, { type: 'none' });
});

test('simulasi: buat order transfer → payload Scalev benar & tersimpan', () => {
  const r = scenario({ message: 'iya kak betul, proses ya',
    row: { ...SALGLOW_ROW, ref: 'SG-ABCDE' },
    first: toolUse('buat_order', { paket: 'B2G2', pembayaran: 'transfer', kecamatan: 'Wonokromo', kota: 'Kota Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5 RT 1/2', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
  const body = r.req('Scalev Buat Order').body;
  assert.strictEqual(r.req('Scalev Buat Order').url, 'https://api.scalev.com/v3/orders');
  assert.strictEqual(body.payment_method, 'bank_transfer');
  assert.strictEqual(body.courier_service_id, 3); // JNT termurah via mengantar (bukan lincah/SiCepat)
  assert.strictEqual(body.shipment_provider_code, 'mengantar');
  assert.strictEqual(body.warehouse_unique_id, 'wh_sby');
  assert.strictEqual(body.location_id, 11);
  assert.strictEqual(body.customer_phone, '6281');
  assert.strictEqual(body.other_income, undefined);
  assert.strictEqual(body.notes, '4 salepglowing, sunscreen, eyeliner, TRANSFER, 231.000');
  assert.strictEqual(body.customer_name, 'Sari');
  assert.strictEqual(body.metadata.ref, 'SG-ABCDE');
  assert.strictEqual(r.toolResults[0].link_pembayaran, undefined); // transfer pakai template rekening
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV123');
  assert.ok(r.req('Telegram Admin').body.includes('MENUNGGU PEMBAYARAN'));
  assert.strictEqual(r.req('Meta Purchase (CAPI)'), undefined); // transfer belum dibayar: bukan Purchase
  assert.ok(r.req('Telegram Admin').body.includes('SV123 (Transfer, Rp231.000)'));
  assert.ok(r.req('Telegram Admin').body.includes('📦 Packing: 4 salepglowing, sunscreen, eyeliner, TRANSFER, 231.000'));
});

test('simulasi: order COD menambah other_income 3%', () => {
  const r = scenario({ message: 'oke',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
  const body = r.req('Scalev Buat Order').body;
  assert.strictEqual(body.payment_method, 'cod');
  assert.strictEqual(body.courier_service_id, 3);
  assert.strictEqual(body.other_income, 5000);
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
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sa', alamat: 'Jl. Anggrek 7', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
  assert.strictEqual(r.toolResults[0].ok, false);
  assert.ok(r.toolResults[0].error.includes('variant not found'));
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, '');
});

test('simulasi: cegah order dobel dalam 6 jam', () => {
  const recent = { ...SALGLOW_ROW, last_order_id: 'SV999', last_order_at: new Date(Date.now() - 3600000).toISOString() };
  const r = scenario({ message: 'order lagi', row: recent,
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sa', alamat: 'Jl. Anggrek 7', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
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
  assert.deepStrictEqual(r.outputs['Hitung Ongkir'][0].totals, { price: 139000, shipping: 12000, codFee: 5000, total: 156000 });
});
test('order COD: tidak generate resi saat closing (batch harian), tidak pernah request pickup, scalev_id dicatat', () => {
  const r = scenario({ message: 'oke',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sa', alamat: 'Jl. Anggrek 7', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
  assert.ok(r.requests.every((q) => !q.url || !/generate-awb|pickup/i.test(q.url)));
  assert.strictEqual(r.req('Catat Order').body.scalev_id, 'uuid-1');
  const urls = mainWf().nodes.map((n) => n.parameters.url).filter(Boolean);
  assert.ok(urls.every((u) => !/pickup|generate-awb/i.test(u)));
});

test('batch resi harian: hanya order confirmed tanpa resi, isi paket di info kurir, 1 request generate', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'batch-resi.workflow.json'), 'utf8'));
  const code = (name) => wf.nodes.find((n) => n.name === name).parameters.jsCode;
  const now = new Date().toISOString();
  const rows = [
    { order_id: 'A1', scalev_id: 'u1', paket: 'B1G1', method: 'cod', total: '149500', created_at: now },
    { order_id: 'A2', scalev_id: 'u2', paket: 'B2G2', method: 'transfer', total: '225000', created_at: now },
    { order_id: 'A3', scalev_id: 'u3', paket: 'B1G1', method: 'transfer', total: '145000', created_at: now },
    { order_id: 'OLD', scalev_id: 'u4', paket: 'B1G1', method: 'cod', total: '1', created_at: '2020-01-01T00:00:00Z' },
    { order_id: 'NOID', paket: 'B1G1', method: 'cod', total: '1', created_at: now },
  ];
  const outs = {};
  const $ = (n) => ({ all: () => outs[n].map((json) => ({ json })) });
  outs['Ambil Order'] = rows;
  outs['Pilih Order Resi'] = new Function('$', code('Pilih Order Resi'))($).map((i) => i.json);
  assert.deepStrictEqual(outs['Pilih Order Resi'].map((o) => o.order_id), ['A1', 'A2', 'A3']);
  const cek = [{ data: { status: 'confirmed' } }, { status: 'confirmed', shipment_receipt: null }, { data: { status: 'pending' } }];
  outs['Cek Order'] = cek;
  outs['Siap Resi'] = new Function('$', code('Siap Resi'))($).map((i) => i.json);
  assert.deepStrictEqual(outs['Siap Resi'].map((o) => o.order_id), ['A1', 'A2']);
  assert.strictEqual(outs['Siap Resi'][0].packing, '2 salepglowing, sunscreen, eyeliner, COD, 149.500');
  assert.strictEqual(outs['Siap Resi'][1].packing, '4 salepglowing, sunscreen, eyeliner, TRANSFER, 225.000');
  const batch = new Function('$', code('Gabung Batch'))($);
  assert.deepStrictEqual(batch[0].json.ids, ['u1', 'u2']);
  const rep = new Function('$', '$input', code('Susun Laporan Resi'))($, { first: () => ({ json: { successes: { u1: 'JT001' }, failures: { u2: 'saldo kurang' } } }) });
  assert.ok(rep[0].json.text.includes('A1: JT001') && rep[0].json.text.includes('A2: saldo kurang'));
  const gen = wf.nodes.find((n) => n.name === 'Generate Resi Batch');
  assert.strictEqual(gen.parameters.url, 'https://api.scalev.com/v3/orders/generate-awb');
  assert.strictEqual(gen.credentials.httpHeaderAuth.name, 'Scalev');
});
test('error API: notif admin, balasan cadangan, bot TIDAK dijeda', () => {
  const r = scenario({ message: 'halo', first: { type: 'error', error: { type: 'authentication_error', message: 'Invalid bearer token' } } });
  assert.ok(r.req('Kirim WhatsApp').body.message.startsWith('Bentar ya kak'));
  assert.ok(r.req('Telegram Admin').body.includes('Invalid bearer token'));
  assert.ok(!r.req('Telegram Admin').body.includes('Bot dijeda'));
  assert.strictEqual(r.req('Simpan Histori').body.handoff, 'false');
});

test('permintaan handoff dari Claude tetap menjeda bot', () => {
  const r = scenario({ message: 'saya alergi', first: text('Tim CS kami bantu ya kak [HANDOFF]') });
  assert.ok(!Number.isNaN(Date.parse(r.req('Simpan Histori').body.handoff)));
  assert.ok(r.req('Telegram Admin').body.includes('Bot dijeda 30 menit'));
});

test('pertanyaan BPOM/testimoni: admin dikabari, bot TIDAK dijeda', () => {
  const r = scenario({ message: 'udah bpom? ada testimoni?', first: text('Detail BPOM & testimoni dikirim admin di chat ini ya kak. Kakak mau ambil paket yang mana? [INFO_ADMIN]') });
  assert.strictEqual(r.req('Kirim WhatsApp').body.message, 'Detail BPOM & testimoni dikirim admin di chat ini ya kak. Kakak mau ambil paket yang mana?');
  assert.ok(r.req('Telegram Admin').body.includes('PERTANYAAN UNTUK ADMIN'));
  assert.ok(!r.req('Telegram Admin').body.includes('Bot dijeda'));
  assert.strictEqual(r.req('Simpan Histori').body.handoff, 'false');
});

test('pesan saat dijeda: tidak panggil Claude, disimpan ke histori', () => {
  const paused = { ...SALGLOW_ROW, handoff: new Date().toISOString(), history: '[{"role":"user","content":"alergi"}]' };
  const r = scenario({ message: 'ya udah saya mau yg 139rb', row: paused, first: text('x') });
  assert.ok(!r.req('Claude'));
  assert.ok(!r.req('Kirim WhatsApp'));
  assert.ok(r.req('Simpan Saat Jeda').body.history.includes('saya mau yg 139rb'));
});
test('kata closing tanpa order TIDAK kirim notif Telegram', () => {
  const r = scenario({ message: 'oke saya ambil, cod ya', first: text('Siap kak, paketnya mau yang mana?') });
  assert.ok(!r.req('Telegram Admin'));
  assert.ok(r.req('Kirim WhatsApp'));
});

test('prompt jualan: alur, larangan klaim palsu, hitungan hemat benar', () => {
  const sys = prepareContext({ phone: '1', message: 'halo' }, null).requestBody.system;
  for (const k of ['PERTANYAAN/KEBERATAN', 'Mau yang mana kak?', 'SINYAL BELI', 'BIAYA COD', 'Ada lagi yang mau ditanyakan sebelum order', 'JANGAN jualan lagi', 'BPOM', 'Rp54.750/pcs', 'Rp69.500/pcs']) assert.ok(sys.includes(k), k);
  assert.strictEqual(219000 / 4, 54750);
  assert.strictEqual(139000 / 2, 69500);
});
test('alamat belum lengkap → order ditolak, tanpa notif', () => {
  const r = scenario({ message: 'kirim ke jagir ya',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sari', alamat: 'Jl. Jagir Sidomukti', patokan: '' }) });
  assert.ok(!r.req('Scalev Lokasi'));
  assert.ok(!r.req('Scalev Buat Order'));
  assert.ok(!r.req('Telegram Admin'));
  assert.ok(r.toolResults[0].error.includes('nomor rumah atau RT/RW'));
  assert.ok(r.toolResults[0].error.includes('patokan'));
});

test('lead cuma sebut kelurahan → kode pos & alamat resmi terisi, masuk ke order', () => {
  const ongkir = scenario({ message: 'kirim ke jagir',
    first: toolUse('cek_ongkir', { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Kel. Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya' }) });
  assert.strictEqual(ongkir.toolResults[0].kode_pos, '60243');
  assert.strictEqual(ongkir.toolResults[0].alamat_resmi, 'Kel. Jagir, Wonokromo, Kota Surabaya, Jawa Timur');
  assert.ok(ongkir.req('Scalev Kode Pos').url.endsWith('/locations/11/postal-codes'));
  assert.strictEqual(ongkir.req('Scalev Kurir').body.postal_code, '60243');

  const order = scenario({ message: 'iya betul',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'transfer', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sari', alamat: 'Jl. Jagir Sidomukti Gg. 3 No. 12', patokan: 'depan masjid Al Ikhlas' }) });
  const body = order.req('Scalev Buat Order').body;
  assert.strictEqual(body.address, 'Jl. Jagir Sidomukti Gg. 3 No. 12, Jagir (Patokan: depan masjid Al Ikhlas)');
  assert.strictEqual(body.postal_code, '60243');
  assert.ok(order.req('Telegram Admin').body.includes('ORDER TRANSFER'));
});

test('kode pos ambigu → kasih pilihan ke Claude', () => {
  const r = scenario({ message: 'ongkir ke wonokromo',
    first: toolUse('cek_ongkir', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya' }) });
  assert.strictEqual(r.toolResults[0].kode_pos, null);
  assert.deepStrictEqual(r.toolResults[0].pilihan_kode_pos, ['60243 (Jagir)', '60244 (Ngagel Rejo)']);
  assert.ok(r.toolResults[0].ok);
});

test('prompt: larangan basa-basi & syarat alamat', () => {
  const sys = prepareContext({ phone: '1', message: 'halo' }, null).requestBody.system;
  for (const k of ['DILARANG: basa-basi', 'baris kosong', 'huruf vokal dobel', "'Mantap'", "'Yeay'", 'patokan', 'kecamatan', 'supaya paket tidak nyasar di ekspedisi', 'prioritas pengiriman hari ini', 'saya tanyakan ke atasan saya dulu', 'Lengkapi data order dulu ya kak', 'Sudah benar kak? saya proses ya', 'CS Filomall-Beauty', '10.000 pcs', 'Jangan tanya provinsi', 'Kode pos:', 'dipisah koma']) assert.ok(sys.includes(k), k);
});
// Workflow dengan fakta produk terisi (BPOM + testimoni) untuk tes.
function withFacts(wf) {
  for (const n of wf.nodes) {
    if (n.parameters && typeof n.parameters.jsCode === 'string') {
      n.parameters.jsCode = n.parameters.jsCode
        .replace("bpom: '',", "bpom: 'NA18230100999',")
        .replace(/testimonials: \[[\s\S]*?\n    \],/, "testimonials: [{ url: 'https://x.test/t1.jpg', tags: ['flek'] }, { url: 'https://x.test/t2.jpg', tags: ['kusam'] }, { url: 'https://x.test/t3.jpg', tags: [] }, { url: 'https://x.test/t4.jpg', tags: ['flek', 'kusam'] }, { url: 'https://x.test/t5.jpg', tags: ['jerawat'] }],");
    }
  }
  return wf;
}

test('tanpa data testimoni: prompt tidak menyebutnya, gambar tidak dikirim', () => {
  const saved = vm.runInContext('FACTS.SalGlow.testimonials', ctx);
  vm.runInContext('FACTS.SalGlow.testimonials = []', ctx);
  try {
    const sys = prepareContext({ phone: '1', message: 'halo' }, null).requestBody.system;
    assert.ok(!sys.includes('TESTIMONI:'));
    assert.ok(!sys.includes('terdaftar dengan nomor'));
  } finally {
    ctx.__saved = saved;
    vm.runInContext('FACTS.SalGlow.testimonials = __saved', ctx);
  }
  const wf = mainWf();
  wf.nodes.forEach((n) => { if (n.parameters.jsCode) n.parameters.jsCode = n.parameters.jsCode.replace(/testimonials: \[[\s\S]*?\n    \],/, 'testimonials: [],'); });
  const r = simulate(wf, { webhookBody: { phone: '1', message: 'ada testimoni?' }, row: SALGLOW_ROW, http: (name) => (name === 'Claude' ? text('Aku kirimin ya kak [TESTIMONI]') : { status: true }) });
  assert.ok(!r.requests.some((q) => q.node === 'Kirim Gambar'));
  assert.strictEqual(r.requests.find((q) => q.node === 'Kirim WhatsApp').body.message, 'Aku kirimin ya kak');
});

test('24 testimoni Imgur terpasang, link langsung & unik, prompt menawarkan testimoni', () => {
  const list = vm.runInContext('FACTS.SalGlow.testimonials', ctx).map((t) => t.url);
  assert.strictEqual(list.length, 24);
  assert.strictEqual(new Set(list).size, 24);
  assert.ok(list.every((u) => /^https:\/\/i\.imgur\.com\/[A-Za-z0-9]{7}\.(jpeg|png)$/.test(u)));
  const sys = prepareContext({ phone: '1', message: 'halo' }, null).requestBody.system;
  assert.ok(sys.includes('[TESTIMONI]'));
});

test('dengan BPOM & testimoni: nomor BPOM di prompt, 3 foto dikirim setelah balasan', () => {
  const wf = withFacts(mainWf());
  const sent = [];
  const r = simulate(wf, {
    webhookBody: { phone: '6281', message: 'yakin aman? ada testimoni?', isFromMe: false, isGroup: false },
    row: SALGLOW_ROW,
    http: (name, { body }) => {
      if (name === 'Claude') {
        sent.push(body.system);
        return text('Sudah BPOM NA18230100999 kak, bisa dicek di cekbpom.pom.go.id. Aku kirimin beberapa testimoni ya [TESTIMONI]');
      }
      return { status: true };
    },
  });
  assert.ok(sent[0].includes('NA18230100999'));
  const imgs = r.requests.filter((q) => q.node === 'Kirim Gambar');
  assert.strictEqual(imgs.length, 3);
  assert.ok(imgs.every((q) => q.url === 'https://jkt.wablas.com/api/send-image' && q.body.phone === '6281' && q.body.image.startsWith('https://x.test/')));
  assert.strictEqual(new Set(imgs.map((q) => q.body.image)).size, 3);
  const find = (node) => r.requests.find((q) => q.node === node);
  assert.ok(!find('Kirim WhatsApp').body.message.includes('[TESTIMONI]'));
  assert.ok(find('Simpan Histori'));
});
test('BPOM belum ada: bot jujur, tidak klaim aman/bebas merkuri, kulit sensitif → tes tempel', () => {
  const sys = prepareContext({ phone: '1', message: 'udah bpom?' }, null).requestBody.system;
  assert.ok(sys.includes('belum terdaftar BPOM'));
  assert.ok(sys.includes('jangan mengelak'));
  assert.ok(sys.includes("JANGAN klaim 'bebas merkuri'"));
  assert.ok(sys.includes('tidak molor dan tidak lengket'));
  assert.ok(sys.includes('tes tempel'));
  assert.ok(!/aman untuk kulit sensitif[^']/.test(sys.replace("'aman untuk kulit sensitif'", '')));
});
test('testimoni relevan: [TESTIMONI:flek] kirim foto berlabel flek dulu', () => {
  const wf = withFacts(mainWf());
  const r = simulate(wf, {
    webhookBody: { phone: '6281', message: 'flek saya parah, ada bukti?', isFromMe: false, isGroup: false },
    row: SALGLOW_ROW,
    http: (name) => (name === 'Claude' ? text('Ada kak, aku kirimin yang mirip kondisi kakak ya [TESTIMONI:flek]') : { status: true }),
  });
  const imgs = r.requests.filter((q) => q.node === 'Kirim Gambar').map((q) => q.body.image);
  assert.strictEqual(imgs.length, 3);
  assert.deepStrictEqual(imgs.slice(0, 2).sort(), ['https://x.test/t1.jpg', 'https://x.test/t4.jpg']);
  assert.strictEqual(r.requests.find((q) => q.node === 'Kirim WhatsApp').body.message, 'Ada kak, aku kirimin yang mirip kondisi kakak ya');
});

test('parse token testimoni dengan beberapa topik', () => {
  const r = parseReply({ content: [{ type: 'text', text: 'Ini kak [TESTIMONI:bekas_jerawat, kusam]' }] });
  assert.strictEqual(JSON.stringify(r.testimoniTopics), JSON.stringify(['bekas_jerawat', 'kusam']));
  assert.strictEqual(r.reply, 'Ini kak');
});
test('alamat desa tanpa nomor/RT diterima kalau ada nama dusun + patokan', () => {
  const r = scenario({ message: 'ok',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Axela', alamat: 'Dsn Nganten', patokan: 'pagar putih hadap selatan, 3 rumah dari praktik dr Diana' }) });
  assert.ok(r.req('Scalev Buat Order'));
  const bad = scenario({ message: 'ok',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Axela', alamat: 'Sokosari Tuban', patokan: 'pagar putih' }) });
  assert.ok(!bad.req('Scalev Buat Order'));
});

test('balasan yang cuma berisi token testimoni tidak jadi pesan "sistem sibuk"', () => {
  const r = parseReply({ content: [{ type: 'text', text: '[TESTIMONI:flek]' }] });
  assert.strictEqual(r.reply, 'Ini beberapa testimoni pembeli ya kak.');
  assert.strictEqual(r.sendTestimoni, true);
});
test('workflow TEST: webhook & store terpisah dari produksi', () => {
  const prod = mainWf();
  const tst = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ai-agent-cs.test.workflow.json'), 'utf8'));
  const hook = (wf) => wf.nodes.find((n) => n.type === 'n8n-nodes-base.webhook').parameters.path;
  assert.notStrictEqual(hook(prod), hook(tst));
  assert.strictEqual(tst.name, 'AI Agent CS v2 (TEST)');
  const code = (wf) => wf.nodes.filter((n) => n.parameters.jsCode).map((n) => n.parameters.jsCode).join('\n');
  assert.ok(code(prod).includes("const STORE_PROFILE = 'prod';") && !code(prod).includes("STORE_PROFILE = 'test'"));
  assert.ok(code(tst).includes("const STORE_PROFILE = 'test';") && !code(tst).includes("STORE_PROFILE = 'prod'"));
  const r = simulate(tst, { webhookBody: { phone: '1', message: 'ok' }, row: SALGLOW_ROW,
    http: (name) => ({ Claude: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sa', alamat: 'Jl. A 1', patokan: 'depan masjid' }),
      'Claude Lanjutan': text('ok'), 'Scalev Lokasi': LOCATIONS, 'Scalev Kode Pos': POSTAL, 'Scalev Gudang': WAREHOUSES, 'Scalev Kurir': COURIERS,
      'Scalev Buat Order': { id: 'u', order_id: 'T1' } })[name] || { status: true } });
  const body = r.requests.find((q) => q.node === 'Scalev Buat Order').body;
  assert.strictEqual(body.store_unique_id, 'ISI_STORE_UNIQUE_ID_TES');
  assert.strictEqual(body.customer_name, '[TES BOT] Sa');
  assert.strictEqual(body.notes, '2 salepglowing, sunscreen, eyeliner, COD, 156.000');
  assert.ok(r.requests.find((q) => q.node === 'Telegram Admin').body.startsWith('🧪 *[TES]*'));
});
const ATTR = { ref: 'SG-ABCDE', fbc: 'fb.1.1.abc', fbp: 'fb.1.2.xyz', client_ip: '1.2.3.4', user_agent: 'UA', landing_url: 'https://filomallbeauty.myscalev.com/salglow-test-ai?fbclid=abc' };

function orderScenario(row, tables) {
  const first = toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5', patokan: 'depan masjid' });
  return simulate(mainWf(), {
    webhookBody: { phone: '6281', pushName: 'Sari', message: 'ok', isFromMe: false, isGroup: false },
    row, tables,
    http: (name) => ({ Claude: first, 'Claude Lanjutan': text('Oke kak, data order sudah masuk sistem.'), 'Scalev Lokasi': LOCATIONS,
      'Scalev Kode Pos': POSTAL, 'Scalev Gudang': WAREHOUSES, 'Scalev Kurir': COURIERS,
      'Scalev Buat Order': { id: 'uuid-9', order_id: 'SV900', public_order_url: 'x' } })[name] || { status: true },
  });
}

test('closing: order dicatat & Purchase CAPI dikirim dengan fbc/fbp/IP/UA dari LP', () => {
  const r = orderScenario({ ...SALGLOW_ROW, ref: 'SG-ABCDE' }, { lp_attribution: [ATTR], aics_orders: [] });
  const find = (n) => r.requests.find((q) => q.node === n);
  const log = find('Catat Order').body;
  assert.strictEqual(log.order_id, 'SV900');
  assert.strictEqual(log.total, '156000');
  assert.strictEqual(log.price, '139000');
  assert.strictEqual(log.method, 'cod');
  const capi = find('Meta Purchase (CAPI)');
  assert.strictEqual(capi.url, 'https://graph.facebook.com/v21.0/995011355669071/events');
  const ev = capi.body.data[0];
  const sha = (v) => require('crypto').createHash('sha256').update(v).digest('hex');
  assert.strictEqual(ev.event_name, 'Purchase');
  assert.strictEqual(ev.event_id, 'SV900-Purchase');
  assert.strictEqual(ev.action_source, 'website');
  assert.strictEqual(ev.event_source_url, ATTR.landing_url);
  assert.strictEqual(ev.custom_data.value, 139000);
  assert.strictEqual(ev.custom_data.currency, 'IDR');
  const u = ev.user_data;
  assert.strictEqual(u.fbc, 'fb.1.1.abc');
  assert.strictEqual(u.fbp, 'fb.1.2.xyz');
  assert.strictEqual(u.client_ip_address, '1.2.3.4');
  assert.strictEqual(u.ph[0], sha('6281'));
  assert.strictEqual(u.fn[0], sha('sari'));
  assert.strictEqual(u.country[0], sha('id'));
  assert.strictEqual(mainWf().nodes.find((n) => n.name === 'Meta Purchase (CAPI)').credentials.httpQueryAuth.name, 'Meta CAPI');
  const leadsRow = find('Simpan Histori').body;
  assert.ok(leadsRow.first_chat_at && leadsRow.last_chat_at);
});

test('closing tanpa klik LP: Purchase tetap dikirim (pakai nomor HP), tanpa fbc', () => {
  const r = orderScenario(SALGLOW_ROW, { lp_attribution: [], aics_orders: [] });
  const ev = r.requests.find((q) => q.node === 'Meta Purchase (CAPI)').body.data[0];
  assert.strictEqual(ev.user_data.fbc, undefined);
  assert.strictEqual(ev.action_source, 'chat');
  assert.strictEqual(ev.user_data.ph[0], require('crypto').createHash('sha256').update('6281').digest('hex'));
});

test('chat biasa: tidak ada Purchase & tidak dicatat sebagai order', () => {
  const r = scenario({ message: 'halo', first: text('Halo kak') });
  assert.ok(!r.requests.some((q) => q.node === 'Meta Purchase (CAPI)' || q.node === 'Catat Order'));
});

test('rekap harian: hitung klik, chat, closing, rasio, omzet (zona WIB)', () => {
  const now = new Date('2026-09-24T16:50:00Z'); // 23:50 WIB
  const r = dailyRecap({
    clicks: [{ clicked_at: '2026-09-24T02:00:00Z' }, { clicked_at: '2026-09-24T10:00:00Z' }, { clicked_at: '2026-09-24T12:00:00Z' }, { clicked_at: '2026-09-23T10:00:00Z' }],
    leads: [
      { first_chat_at: '2026-09-24T03:00:00Z', last_chat_at: '2026-09-24T15:00:00Z' },
      { first_chat_at: '2026-09-24T16:30:00Z', last_chat_at: '2026-09-24T16:40:00Z' }, // 23:30 WIB masih hari ini
      { first_chat_at: '2026-09-23T03:00:00Z', last_chat_at: '2026-09-24T05:00:00Z' },
      { first_chat_at: '2026-09-24T17:30:00Z', last_chat_at: '2026-09-24T17:30:00Z' }, // 00:30 WIB besok
    ],
    orders: [
      { phone: '1', created_at: '2026-09-24T05:00:00Z', method: 'cod', total: '155530', price: '139000', ref: 'SG-A' },
      { phone: '2', status: 'confirmed', created_at: '2026-09-24T09:00:00Z', method: 'transfer', total: '225000', price: '219000', ref: '' },
      { created_at: '2026-09-22T09:00:00Z', method: 'cod', total: '999', price: '999' },
    ],
  }, now);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r.counts)), { clicks: 3, newChats: 2, activeChats: 3, orders: 2, omzet: 380530, produk: 358000 });
  assert.ok(r.text.includes('Rasio closing / chat aktif: 66,7%'));
  assert.ok(r.text.includes('Closing: 2 pembeli • 2 order'));
  const dup = dailyRecap({ leads: [{ first_chat_at: now.toISOString(), last_chat_at: now.toISOString() }], orders: [
    { phone: '9', created_at: now.toISOString(), method: 'cod', total: '1' }, { phone: '9', status: 'confirmed', created_at: now.toISOString(), method: 'transfer', total: '1' }] }, now);
  assert.ok(dup.text.includes('Closing: 1 pembeli • 2 order') && dup.text.includes('Rasio closing / chat aktif: 100%'));
  assert.ok(r.text.includes('Omzet (total bayar): Rp380.530'));
  assert.ok(r.text.includes('COD 1 • Transfer lunas 1'));
  assert.ok(r.text.includes('Closing dari iklan (ada kode ref): 1'));
});

test('workflow rekap: jadwal 23:55 WIB, urutan node benar', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'rekap-harian.workflow.json'), 'utf8'));
  assert.strictEqual(wf.settings.timezone, 'Asia/Jakarta');
  assert.strictEqual(wf.nodes.find((n) => n.name === 'Tiap Malam 23:55').parameters.rule.interval[0].expression, '55 23 * * *');
  const code = (n) => wf.nodes.find((x) => x.name === n).parameters.jsCode;
  const now = new Date().toISOString();
  const outs = {
    'Ambil Klik LP': [], 'Ambil Leads': [{ first_chat_at: now, last_chat_at: now }],
    'Ambil Order': [
      { order_id: 'C1', phone: '1', scalev_id: 'u1', method: 'cod', total: '149500', price: '139000', created_at: now },
      { order_id: 'T1', phone: '2', scalev_id: 'u2', method: 'transfer', total: '145000', price: '139000', created_at: now },
      { order_id: 'T2', phone: '3', scalev_id: 'u3', method: 'transfer', total: '145000', price: '139000', created_at: now },
    ],
  };
  const $ = (n) => ({ all: () => outs[n].map((json) => ({ json })) });
  outs['Pilih Order Resi'] = new Function('$', code('Pilih Order Resi'))($).map((i) => i.json);
  outs['Cek Order'] = [{ data: { status: 'confirmed' } }, { data: { status: 'confirmed', payment_status: 'paid' } }, { data: { status: 'pending' } }];
  const text = new Function('$', code('Hitung Rekap'))($)[0].json.text;
  assert.ok(text.includes('Closing: 2 pembeli • 2 order (COD 1 • Transfer lunas 1)'), text);
  assert.ok(text.includes('Transfer menunggu pembayaran: 1'));
  // Tanpa order sama sekali: tetap 1 item placeholder supaya rekap tetap terkirim
  outs['Ambil Order'] = [];
  const ph = new Function('$', code('Pilih Order Resi'))($);
  assert.strictEqual(ph.length, 1);
  assert.strictEqual(wf.connections['Ambil Order'].main[0][0].node, 'Pilih Order Resi');
  assert.strictEqual(wf.connections['Cek Order'].main[0][0].node, 'Hitung Rekap');
});
test('kode #promo dari LP dikenali sebagai ref, produk tetap SalGlow', () => {
  const r = prepareContext({ phone: '1', message: 'Halo kak, mau tanya salep glowing filo #promo7Q2MX' }, null);
  assert.strictEqual(r.ref, 'PROMO7Q2MX');
  assert.strictEqual(r.active_product, 'SalGlow');
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lp-attribution.workflow.json'), 'utf8'));
  const code = wf.nodes.find((n) => n.name === 'Validasi').parameters.jsCode;
  const out = new Function('$input', code)({ first: () => ({ json: { body: { ref: 'PROMO7Q2MX' }, headers: {} } }) });
  assert.strictEqual(out[0].json.ref, 'PROMO7Q2MX');
});

test('follow-up: jadwal 1j/3j/.../36j, jam tenang, stop saat order/jeda/lead bicara', () => {
  const noon = Date.parse('2026-09-25T05:00:00Z'); // 12:00 WIB
  const hist = JSON.stringify([{ role: 'user', content: 'harganya?' }, { role: 'assistant', content: 'Rp139rb kak' }]);
  const row = (mins, extra = {}) => ({ phone: '1', history: hist, last_chat_at: new Date(noon - mins * 60000).toISOString(), ...extra });
  assert.strictEqual(dueFollowUp(row(30), noon), null);
  assert.strictEqual(dueFollowUp(row(61), noon).stage, 0);
  assert.strictEqual(dueFollowUp(row(400), noon).stage, 2); // tahap terlewat -> kirim satu, tahap terakhir yang lewat
  assert.strictEqual(dueFollowUp(row(60 * 50), noon), null); // lead lama tidak di-FU
  assert.strictEqual(dueFollowUp(row(61, { handoff: new Date(noon).toISOString() }), noon), null);
  assert.strictEqual(dueFollowUp(row(61, { last_order_at: new Date(noon - 3600000).toISOString() }), noon), null);
  assert.strictEqual(dueFollowUp(row(61, { history: JSON.stringify([{ role: 'user', content: 'halo' }]) }), noon), null);
  assert.strictEqual(dueFollowUp(row(61), Date.parse('2026-09-25T15:00:00Z')), null); // 22:00 WIB
  // FU ke-1 sudah terkirim -> tunggu sampai 1 jam
  const after1 = appendFollowUp(hist, 'kak, gimana?', 0, noon);
  assert.strictEqual(dueFollowUp(row(120, { history: after1 }), noon), null);
  assert.strictEqual(dueFollowUp(row(181, { history: after1 }), noon).stage, 1);
  const done = JSON.parse(hist).concat([{ role: 'assistant', content: 'x', fu: 5 }]);
  assert.strictEqual(dueFollowUp(row(60 * 40, { history: JSON.stringify(done) }), noon), null);
});

test('follow-up: request Claude diakhiri pesan user + SKIP tidak dikirim', () => {
  const hist = JSON.stringify([{ role: 'user', content: 'mahal ya' }, { role: 'assistant', content: 'ada paket hemat kak' }]);
  const req = followUpRequest({ phone: '1', history: hist }, { stage: 1, elapsedMinutes: 61 });
  assert.strictEqual(req.messages[req.messages.length - 1].role, 'user');
  assert.ok(req.messages[req.messages.length - 1].content.includes('1 jam'));
  assert.ok(req.system.includes('FOLLOW-UP') && req.system.includes('3-4 benefit'));
  assert.strictEqual(followUpText({ content: [{ type: 'text', text: 'SKIP' }] }), null);
  assert.strictEqual(followUpText({ error: { message: 'x' } }), null);
  assert.strictEqual(followUpText({ content: [{ type: 'text', text: 'Kak, masih kepikiran? 😊' }] }), 'Kak, masih kepikiran? 😊');
});

test('workflow follow-up: kode node jalan end-to-end', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'follow-up.workflow.json'), 'utf8'));
  const code = (name) => wf.nodes.find((n) => n.name === name).parameters.jsCode;
  const hist = JSON.stringify([{ role: 'user', content: 'halo' }, { role: 'assistant', content: 'halo kak' }]);
  const rows = [{ phone: '62811', history: hist, last_chat_at: new Date(Date.now() - 70 * 60000).toISOString() }, {}];
  const picked = new Function('$input', code('Pilih Lead FU'))({ all: () => rows.map((json) => ({ json })) });
  const h = (Date.now() / 3600000 + 7) % 24;
  if (h >= 21 || h < 7) { assert.strictEqual(picked.length, 0); return; }
  assert.strictEqual(picked.length, 1);
  const $ = () => ({ all: () => picked });
  const out = new Function('$', '$input', code('Olah FU'))($, { all: () => [{ json: { content: [{ type: 'text', text: 'Kak, ada yang bisa saya bantu lagi? 😊' }] } }] });
  assert.strictEqual(out[0].json.phone, '62811');
  assert.strictEqual(JSON.parse(out[0].json.history).pop().fu, 0);
  assert.strictEqual(wf.nodes.find((n) => n.name === 'Kirim FU').credentials.httpHeaderAuth.name, 'Wablas');
});

test('lead baru: order Scalev berisi nama + nomor WA, id disimpan', () => {
  const r = scenario({ message: 'halo kak', row: null, first: text('Halo juga kaak 😊') });
  const lead = r.req('Scalev Lead Order');
  assert.strictEqual(lead.url, 'https://api.scalev.com/v3/orders');
  assert.deepStrictEqual(Object.keys(lead.body).sort(), ['customer_name', 'customer_phone', 'notes', 'store_unique_id']);
  assert.strictEqual(lead.body.customer_name, 'Sari');
  assert.strictEqual(lead.body.customer_phone, '6281');
  assert.deepStrictEqual(r.req('Scalev Status Draft').body, { ids: ['lead-uuid'], status: 'draft' });
  assert.ok(r.req('Claude').body.messages, 'Claude tetap dapat requestBody');
  assert.strictEqual(r.req('Simpan Histori').body.scalev_id, 'lead:lead-uuid');
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV-LEAD');
  assert.strictEqual(r.req('Telegram Admin'), undefined);
  const again = scenario({ message: 'harganya?', row: SALGLOW_ROW, first: text('ok') });
  assert.strictEqual(again.req('Scalev Lead Order'), undefined);
});

const ORDER_INPUT = { paket: 'B1G1', kecamatan: 'Wonokromo', kota: 'Kota Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5 RT 1/2', kelurahan: 'Jagir', patokan: 'depan masjid' };

test('order dari lead: PATCH order lead, notif ORDER FIX + CAPI', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'lead:lead-uuid', last_order_id: 'SV-LEAD' };
  const r = scenario({ message: 'oke proses', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'transfer' }) });
  const up = r.req('Scalev Update Order');
  assert.strictEqual(up.method, 'PATCH');
  assert.strictEqual(up.url, 'https://api.scalev.com/v3/orders/lead-uuid');
  assert.strictEqual(up.body.store_unique_id, undefined);
  assert.strictEqual(up.body.metadata, undefined);
  assert.strictEqual(up.body.payment_method, 'bank_transfer');
  assert.deepStrictEqual(r.req('Scalev Status Order').body, { ids: ['lead-uuid'], status: 'pending', payment_method: 'bank_transfer' });
  assert.strictEqual(r.req('Scalev Buat Order'), undefined);
  assert.ok(r.req('Telegram Admin').body.includes('MENUNGGU PEMBAYARAN'));
  assert.strictEqual(r.req('Meta Purchase (CAPI)'), undefined);
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV-LEAD');
});

test('revisi transfer -> COD: PATCH order yang sama, notif REVISI, tanpa CAPI dobel', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'uuid-1', last_order_id: 'SV123', last_order_at: new Date(Date.now() - 3600000).toISOString() };
  const r = scenario({ message: 'kak ganti cod aja', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod', jenis_order: 'revisi' }) });
  const up = r.req('Scalev Update Order');
  assert.strictEqual(up.url, 'https://api.scalev.com/v3/orders/uuid-1');
  assert.deepStrictEqual(r.req('Scalev Batal Resi').body, { ids: ['uuid-1'] }); // resi lama dibatalkan dulu
  assert.strictEqual(up.body.payment_method, 'cod');
  assert.strictEqual(r.req('Scalev Status Order').body.status, 'confirmed');
  assert.ok(up.body.other_income > 0);
  assert.strictEqual(r.toolResults[0].revisi, true);
  assert.ok(r.req('Telegram Admin').body.includes('ORDER DIREVISI'));
  assert.ok(r.req('Telegram Admin').body.includes('REVISI SV123 (COD'));
  assert.strictEqual(r.req('Catat Order').body.order_id, 'SV123');
  assert.strictEqual(r.req('Meta Purchase (CAPI)'), undefined);
  // COD -> transfer: biaya COD dihapus
  const back = scenario({ message: 'transfer aja deh', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'transfer', jenis_order: 'revisi' }) });
  // Belum jelas revisi/baru -> AI wajib tanya dulu
  const ask = scenario({ message: 'mau order 2 paket', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  assert.strictEqual(ask.req('Scalev Update Order'), undefined);
  assert.strictEqual(ask.req('Scalev Buat Order'), undefined);
  assert.ok(ask.toolResults[0].error.includes('tambah order baru'));
  assert.ok(ask.req('Claude').body.system.includes('KONTEKS ORDER'));
  // Order baru -> POST, order lama tidak diubah
  const baru = scenario({ message: 'order baru kak', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod', jenis_order: 'baru' }) });
  assert.strictEqual(baru.req('Scalev Update Order'), undefined);
  assert.ok(baru.req('Scalev Buat Order'));
  assert.ok(baru.req('Telegram Admin').body.includes('ORDER FIX MASUK SCALEV'));
  assert.strictEqual(back.req('Scalev Update Order').body.other_income, 0);
});

test('order lama tanpa last_order_at tetap order baru (bukan PATCH order lama)', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'uuid-old', last_order_id: 'SV001', last_order_at: '' };
  const r = scenario({ message: 'mau order lagi', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  assert.strictEqual(r.req('Scalev Update Order'), undefined);
  assert.ok(r.req('Scalev Buat Order'));
});

test('order lama (> 6 jam) -> order baru, bukan PATCH', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'uuid-old', last_order_id: 'SV001', last_order_at: new Date(Date.now() - 24 * 3600000).toISOString() };
  const r = scenario({ message: 'mau order lagi', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  assert.strictEqual(r.req('Scalev Update Order'), undefined);
  assert.ok(r.req('Scalev Buat Order'));
});

test('prompt: kandungan & rekening transfer', () => {
  const sys = prepareContext({ phone: '1', message: 'isinya apa' }, null).requestBody.system;
  for (const k of ['Niacinamide', 'Alpha Arbutin', 'Vitamin A', 'BCA 3890171132', 'Mandiri 1780000592416', 'BRI 657301021749531', 'BNI 0903702142', 'a.n N Hamidah', 'REVISI ORDER']) assert.ok(sys.includes(k), k);
});
test('buat_order tanpa ringkasan sebelumnya ditolak (lead harus konfirmasi dulu)', () => {
  const row = { ...SALGLOW_ROW, history: JSON.stringify([{ role: 'user', content: 'mau B1G1' }, { role: 'assistant', content: 'Lengkapi data order dulu ya kak' }]) };
  const r = scenario({ message: 'midha, modern 129, rumah pojok, gununganyar tambak, gununganyar, 60293, surabaya, transfer', row,
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'transfer', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Midha', alamat: 'Modern 129', kelurahan: 'Jagir', patokan: 'rumah pojok' }) });
  assert.strictEqual(r.req('Scalev Buat Order'), undefined);
  assert.ok(r.toolResults[0].error.includes('ringkasan order'));
});
test('setelah ringkasan + lead bilang ok: tool_choice any; klaim order tanpa tool diblokir', () => {
  const ctx = prepareContext({ phone: '6281', message: 'ok' }, SALGLOW_ROW);
  assert.strictEqual(JSON.stringify(ctx.requestBody.tool_choice), '{"type":"any"}');
  assert.strictEqual(prepareContext({ phone: '6281', message: 'ok tapi ongkirnya berapa?' }, SALGLOW_ROW).requestBody.tool_choice, undefined);
  assert.strictEqual(prepareContext({ phone: '6281', message: 'ok' }, { ...SALGLOW_ROW, history: '[]' }).requestBody.tool_choice, undefined);
  const r = scenario({ message: 'ok', first: text('Siap kak.. orderan kakak sudah saya masukkan ke prioritas pengiriman hari ini..') });
  assert.ok(r.req('Kirim WhatsApp').body.message.startsWith('Bentar ya kak'));
  assert.ok(r.req('Telegram Admin').body.includes('BOT ERROR'));
});
test('total di ringkasan beda dengan hitungan sistem -> order tidak dibuat, minta ringkasan ulang', () => {
  const row = { ...SALGLOW_ROW, history: JSON.stringify([{ role: 'user', content: 'ganti cod' }, { role: 'assistant', content: 'Berikut ringkasan ordernya ...\nTotal bayar: Rp145.000\n\nSudah benar kak?' }]) };
  const r = scenario({ message: 'ok', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  assert.strictEqual(r.req('Scalev Buat Order'), undefined);
  assert.ok(r.toolResults[0].error.includes('Rp145.000'));
  const good = { ...SALGLOW_ROW, history: JSON.stringify([{ role: 'user', content: 'cod' }, { role: 'assistant', content: 'ringkasan order\nTotal bayar: Rp156.000\nSudah benar kak?' }]) };
  const ok = scenario({ message: 'ok', row: good, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  assert.ok(ok.req('Scalev Buat Order'));
  assert.ok(ok.req('Telegram Admin').body.includes('Nama: Sari'));
});
test('lead bilang "ganti cod aja" -> revisi walau Claude isi jenis_order baru', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'uuid-1', last_order_id: 'SV123', last_order_at: new Date(Date.now() - 120000).toISOString(),
    history: JSON.stringify([{ role: 'user', content: 'eh ganti cod aja deh' }, { role: 'assistant', content: 'ringkasan order\nTotal bayar sesuai\nSudah benar kak?' }]) };
  const r = scenario({ message: 'ok', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod', jenis_order: 'baru' }) });
  assert.strictEqual(r.req('Scalev Buat Order'), undefined);
  assert.strictEqual(r.req('Scalev Update Order').url, 'https://api.scalev.com/v3/orders/uuid-1');
  assert.ok(r.req('Telegram Admin').body.includes('ORDER DIREVISI'));
});
test('batch resi: jadwal 12 & 24, tidak ada order siap -> tetap kirim laporan', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'batch-resi.workflow.json'), 'utf8'));
  assert.strictEqual(wf.nodes.find((n) => n.name === 'Jam 12 & 24').parameters.rule.interval[0].expression, '0 0,12 * * *');
  const code = (n) => wf.nodes.find((x) => x.name === n).parameters.jsCode;
  const outs = { 'Pilih Order Resi': [{ order_id: 'A1', scalev_id: 'u1', method: 'transfer' }], 'Cek Order': [{ data: { status: 'pending' } }] };
  const $ = (n) => ({ all: () => outs[n].map((json) => ({ json })) });
  const r = new Function('$', code('Siap Resi'))($);
  assert.strictEqual(r[0].json.none, true);
  assert.ok(r[0].json.text.includes('A1 (transfer): pending'));
  assert.deepStrictEqual(wf.connections['Ada Order Siap?'].main[1][0].node, 'Kirim Laporan Resi');
});

test('laporan singkat 9/13/18: lead, closing, pending + alasan', () => {
  const now = new Date('2026-09-28T06:00:00Z'); // 13:00 WIB
  const today = '2026-09-28T02:00:00Z';
  const d = vm.runInContext('shortReportData', ctx)({
    leads: [
      { phone: '1', first_chat_at: today, last_chat_at: today, history: JSON.stringify([{ role: 'user', content: 'udah bpom?' }]) },
      { phone: '2', first_chat_at: today, last_chat_at: today, history: '[]' },
      { phone: '3', first_chat_at: '2026-09-27T02:00:00Z', last_chat_at: today, history: '[]' },
    ],
    orders: [{ phone: '2', method: 'cod', created_at: today }],
  }, now);
  assert.strictEqual(d.hour, 13);
  assert.strictEqual(d.newLeads, 2);
  assert.strictEqual(d.closing, 1);
  assert.deepStrictEqual(d.pending.map((p) => p.phone), ['1', '3']);
  const text = vm.runInContext('shortReportText', ctx)(d, { content: [{ type: 'text', text: '1|tanya BPOM, belum balas\n3|ragu harga' }] });
  assert.ok(text.includes('LAPORAN 1 SIANG'));
  assert.ok(text.includes('Lead baru: 2') && text.includes('Closing: 1 (COD 1'));
  assert.ok(text.includes('• 1: tanya BPOM, belum balas') && text.includes('• 3: ragu harga'));
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'laporan-singkat.workflow.json'), 'utf8'));
  assert.strictEqual(wf.nodes.find((n) => n.name === 'Jam 9, 13, 18').parameters.rule.interval[0].expression, '0 9,13,18 * * *');
  assert.strictEqual(wf.nodes.find((n) => n.name === 'Alasan Pending').credentials.httpHeaderAuth.name, 'Anthropic API');
});
test('nomor diblokir (Scalev FU) tidak dibalas & tidak disimpan', () => {
  assert.strictEqual(prepareContext({ phone: '6282125784683', message: 'Halo, pesanan Anda...' }, null), null);
  assert.strictEqual(prepareContext({ phone: '082125784683', message: 'x' }, null), null);
  const r = scenario({ message: 'x', row: null, first: text('Halo') });
  assert.ok(r.req('Kirim WhatsApp'));
});
console.log(`${passed} tes lulus (final)`);
