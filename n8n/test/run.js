// Tes logika Code node. Pakai: node n8n/test/run.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
for (const f of ['product-facts.js', 'prompts.js', 'order-config.js', 'tools.js', 'prepare-context.js', 'parse-reply.js']) {
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

const SALGLOW_ROW = { phone: '6281', active_product: 'SalGlow', history: '[]' };
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
  assert.ok(body.notes.includes('SG-ABCDE'));
  assert.strictEqual(r.toolResults[0].link_pembayaran, 'https://pay.example/SV123');
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV123');
  assert.ok(r.req('Telegram Admin').body.includes('ORDER FIX MASUK SCALEV'));
  assert.ok(r.req('Telegram Admin').body.includes('SV123 (Transfer, Rp231.000)'));
});

test('simulasi: order COD menambah other_income 3%', () => {
  const r = scenario({ message: 'oke',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
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
  assert.deepStrictEqual(r.outputs['Hitung Ongkir'][0].totals, { price: 139000, shipping: 12000, codFee: 4530, total: 155530 });
});
test('bot tidak pernah request pickup / generate AWB', () => {
  const r = scenario({ message: 'oke',
    first: toolUse('buat_order', { paket: 'B1G1', pembayaran: 'cod', kecamatan: 'Wonokromo', kota: 'Surabaya', nama: 'Sa', alamat: 'Jl. Anggrek 7', kelurahan: 'Jagir', patokan: 'depan masjid' }) });
  const scalevCalls = r.requests.filter((q) => q.url && q.url.includes('scalev.com'));
  assert.ok(scalevCalls.length >= 4);
  assert.ok(scalevCalls.every((q) => !/awb|pickup/i.test(q.url)));
  const urls = mainWf().nodes.map((n) => n.parameters.url).filter(Boolean);
  assert.ok(urls.every((u) => !/awb|pickup/i.test(u)));
});
test('error API: notif admin, balasan cadangan, bot TIDAK dijeda', () => {
  const r = scenario({ message: 'halo', first: { type: 'error', error: { type: 'authentication_error', message: 'Invalid bearer token' } } });
  assert.ok(r.req('Kirim WhatsApp').body.message.startsWith('Maaf kak'));
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
  for (const k of ['GALI MASALAH', 'EMPATI', 'KEBERATAN', 'CLOSING', 'BPOM', 'Rp54.750/pcs', 'Rp69.500/pcs']) assert.ok(sys.includes(k), k);
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
  assert.ok(order.req('Telegram Admin').body.includes('ORDER FIX'));
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
  for (const k of ['DILARANG basa-basi', 'patokan', 'JANGAN tanya kecamatan/kota/provinsi/kode pos']) assert.ok(sys.includes(k), k);
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

test('25 testimoni Imgur terpasang, link langsung & unik, prompt menawarkan testimoni', () => {
  const list = vm.runInContext('FACTS.SalGlow.testimonials', ctx).map((t) => t.url);
  assert.strictEqual(list.length, 25);
  assert.strictEqual(new Set(list).size, 25);
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
console.log(`${passed} tes lulus (final)`);
