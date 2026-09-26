// Tes logika Code node. Pakai: node n8n/test/run.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
for (const f of ['capi.js', 'recap.js', 'product-facts.js', 'prompts.js', 'order-config.js', 'tools.js', 'prepare-context.js', 'parse-reply.js', 'follow-up.js']) {
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
        case 'Scalev Update Order': return { data: { id: row && row.scalev_id } }; // respons PATCH tanpa order_id
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
  assert.strictEqual(body.notes, 'Beli 2 Gratis 2 (4 pcs) + bonus sunscreen + eyeliner');
  assert.strictEqual(body.customer_name, '[TEST AI] Sari');
  assert.strictEqual(body.metadata.ref, 'SG-ABCDE');
  assert.strictEqual(r.toolResults[0].link_pembayaran, undefined); // transfer pakai template rekening
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
  for (const k of ['DILARANG: basa-basi', 'baris kosong', 'huruf vokal dobel', "'Mantap'", "'Yeay'", 'patokan', 'kecamatan', 'supaya paket tidak nyasar di ekspedisi', 'prioritas pengiriman hari ini', 'saya tanyakan ke atasan saya dulu', 'Lengkapi data order dulu ya kak', 'Sudah benar kak? saya proses ya', 'CS Filomall-Beauty', '10.000 pcs', 'Jangan tanya kode pos/provinsi']) assert.ok(sys.includes(k), k);
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
  assert.strictEqual(body.notes, 'Beli 1 Gratis 1 (2 pcs) + bonus sunscreen + eyeliner');
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
  assert.strictEqual(log.total, '155530');
  assert.strictEqual(log.price, '139000');
  assert.strictEqual(log.method, 'cod');
  const capi = find('Meta Purchase (CAPI)');
  assert.strictEqual(capi.url, 'https://api.scalev.com/v3/stores/store_WQ9th267cKN4103Qini2iUW5/public/analytics/meta/events');
  const ev = capi.body.events[0];
  assert.strictEqual(ev.event_name, 'Purchase');
  assert.strictEqual(ev.event_id, 'SV900-Purchase');
  assert.strictEqual(ev.parameters.value, 139000);
  assert.strictEqual(ev.parameters.currency, 'IDR');
  const u = capi.body.user_data;
  assert.strictEqual(u.fbc, 'fb.1.1.abc');
  assert.strictEqual(u.fbp, 'fb.1.2.xyz');
  assert.strictEqual(u.client_ip_address, '1.2.3.4');
  assert.strictEqual(u.ph, '6281');
  assert.strictEqual(u.fn, 'sari');
  assert.strictEqual(capi.body.event_source_url, ATTR.landing_url);
  const leadsRow = find('Simpan Histori').body;
  assert.ok(leadsRow.first_chat_at && leadsRow.last_chat_at);
});

test('closing tanpa klik LP: Purchase tetap dikirim (pakai nomor HP), tanpa fbc', () => {
  const r = orderScenario(SALGLOW_ROW, { lp_attribution: [], aics_orders: [] });
  const capi = r.requests.find((q) => q.node === 'Meta Purchase (CAPI)').body;
  assert.strictEqual(capi.user_data.fbc, undefined);
  assert.strictEqual(capi.user_data.ph, '6281');
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
      { created_at: '2026-09-24T05:00:00Z', method: 'cod', total: '155530', price: '139000', ref: 'SG-A' },
      { created_at: '2026-09-24T09:00:00Z', method: 'transfer', total: '225000', price: '219000', ref: '' },
      { created_at: '2026-09-22T09:00:00Z', method: 'cod', total: '999', price: '999' },
    ],
  }, now);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r.counts)), { clicks: 3, newChats: 2, activeChats: 3, orders: 2, omzet: 380530, produk: 358000 });
  assert.ok(r.text.includes('Rasio closing / chat masuk: 100%'));
  assert.ok(r.text.includes('Omzet (total bayar): Rp380.530'));
  assert.ok(r.text.includes('COD 1 • Transfer 1'));
  assert.ok(r.text.includes('Closing dari iklan (ada kode ref): 1'));
});

test('workflow rekap: jadwal 23:55 WIB, urutan node benar', () => {
  const wf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'rekap-harian.workflow.json'), 'utf8'));
  assert.strictEqual(wf.settings.timezone, 'Asia/Jakarta');
  assert.strictEqual(wf.nodes.find((n) => n.name === 'Tiap Malam 23:55').parameters.rule.interval[0].expression, '55 23 * * *');
  new Function('$', wf.nodes.find((n) => n.name === 'Hitung Rekap').parameters.jsCode);
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
  assert.strictEqual(lead.body.customer_name, '[TEST AI] Sari');
  assert.strictEqual(lead.body.customer_phone, '6281');
  assert.ok(r.req('Claude').body.messages, 'Claude tetap dapat requestBody');
  assert.strictEqual(r.req('Simpan Histori').body.scalev_id, 'lead-uuid');
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV-LEAD');
  assert.strictEqual(r.req('Telegram Admin'), undefined);
  const again = scenario({ message: 'harganya?', row: SALGLOW_ROW, first: text('ok') });
  assert.strictEqual(again.req('Scalev Lead Order'), undefined);
});

const ORDER_INPUT = { paket: 'B1G1', kecamatan: 'Wonokromo', kota: 'Kota Surabaya', nama: 'Sari', alamat: 'Jl. Mawar 5 RT 1/2', kelurahan: 'Jagir', patokan: 'depan masjid' };

test('order dari lead: PATCH order lead, notif ORDER FIX + CAPI', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'lead-uuid', last_order_id: 'SV-LEAD' };
  const r = scenario({ message: 'oke proses', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'transfer' }) });
  const up = r.req('Scalev Update Order');
  assert.strictEqual(up.method, 'PATCH');
  assert.strictEqual(up.url, 'https://api.scalev.com/v3/orders/lead-uuid');
  assert.strictEqual(up.body.store_unique_id, undefined);
  assert.strictEqual(up.body.metadata, undefined);
  assert.strictEqual(up.body.payment_method, 'bank_transfer');
  assert.strictEqual(r.req('Scalev Buat Order'), undefined);
  assert.ok(r.req('Telegram Admin').body.includes('ORDER FIX MASUK SCALEV'));
  assert.ok(r.req('Meta Purchase (CAPI)'));
  assert.strictEqual(r.req('Simpan Histori').body.last_order_id, 'SV-LEAD');
});

test('revisi transfer -> COD: PATCH order yang sama, notif REVISI, tanpa CAPI dobel', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'uuid-1', last_order_id: 'SV123', last_order_at: new Date(Date.now() - 3600000).toISOString() };
  const r = scenario({ message: 'kak ganti cod aja', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  const up = r.req('Scalev Update Order');
  assert.strictEqual(up.url, 'https://api.scalev.com/v3/orders/uuid-1');
  assert.strictEqual(up.body.payment_method, 'cod');
  assert.ok(up.body.other_income > 0);
  assert.strictEqual(r.toolResults[0].revisi, true);
  assert.ok(r.req('Telegram Admin').body.includes('ORDER DIREVISI'));
  assert.ok(r.req('Telegram Admin').body.includes('REVISI SV123 (COD'));
  assert.strictEqual(r.req('Catat Order').body.order_id, 'SV123');
  assert.strictEqual(r.req('Meta Purchase (CAPI)'), undefined);
  // COD -> transfer: biaya COD dihapus
  const back = scenario({ message: 'transfer aja deh', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'transfer' }) });
  assert.strictEqual(back.req('Scalev Update Order').body.other_income, 0);
});

test('order lama (> 6 jam) -> order baru, bukan PATCH', () => {
  const row = { ...SALGLOW_ROW, scalev_id: 'uuid-old', last_order_id: 'SV001', last_order_at: new Date(Date.now() - 24 * 3600000).toISOString() };
  const r = scenario({ message: 'mau order lagi', row, first: toolUse('buat_order', { ...ORDER_INPUT, pembayaran: 'cod' }) });
  assert.strictEqual(r.req('Scalev Update Order'), undefined);
  assert.ok(r.req('Scalev Buat Order'));
});

test('prompt: kandungan & rekening transfer', () => {
  const sys = prepareContext({ phone: '1', message: 'isinya apa' }, null).requestBody.system;
  for (const k of ['Niacinamide', 'Alpha Arbutin', 'Vitamin C', 'BCA 3890171132', 'Mandiri 1780000592416', 'BRI 657301021749531', 'BNI 0903702142', 'a.n N Hamidah', 'REVISI ORDER']) assert.ok(sys.includes(k), k);
});
console.log(`${passed} tes lulus (final)`);
