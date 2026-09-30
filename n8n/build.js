// Bangun workflow n8n dari src/*.js → ai-agent-cs.workflow.json
// Pakai: node n8n/build.js

const fs = require('fs');
const path = require('path');

const src = (name) => fs.readFileSync(path.join(__dirname, 'src', name), 'utf8');

// Baca profil store dari order-config.js (dipakai untuk URL yang butuh ID store).
const vm = require('vm');
const STORES = vm.runInNewContext(src('order-config.js') + '\nSTORES');
const META = vm.runInNewContext(src('capi.js') + '\n({ pixel: META_PIXEL_ID, version: META_API_VERSION })');

const DATA_TABLE = {
  __rl: true,
  value: '5NtAx8FqnvweihCl',
  mode: 'list',
  cachedResultName: 'leads_context',
  cachedResultUrl: '/projects/lXkS0POUoL9p5cWT/datatables/5NtAx8FqnvweihCl',
};
// ID tabel & credential akun n8n (bukan rahasia) supaya import tidak perlu pilih ulang.
const PROJECT_ID = 'lXkS0POUoL9p5cWT';
const TABLE_IDS = {
  leads_context: '5NtAx8FqnvweihCl',
  lp_attribution: 'fTIpNCrWZuUOFBDN',
  aics_orders: 'Gmyy03S7gVyztvRB',
};
const CREDENTIALS = {
  anthropic: { httpHeaderAuth: { id: 'FccOVLW0D1ArKZsy', name: 'Anthropic API' } },
  wablas: { httpHeaderAuth: { id: '3vqlBx8OYvAWsX7x', name: 'Wablas' } },
  scalev: { httpHeaderAuth: { id: '3nbV3AIwVIWymgsu', name: 'Scalev' } },
  storefront: { httpHeaderAuth: { id: 'sX2zfXi3kev1C1NZ', name: 'Scalev Storefront' } },
  telegram: { telegramApi: { id: 'zlj3gcoqYjwXs3yb', name: 'Telegram account' } },
  meta: { httpQueryAuth: { id: 'W8dP10pnhXyMNutz', name: 'Meta CAPI' } }, // Query Auth: name access_token
};
const tableRef = (name) => ({
  __rl: true, value: TABLE_IDS[name], mode: 'list', cachedResultName: name,
  cachedResultUrl: `/projects/${PROJECT_ID}/datatables/${TABLE_IDS[name]}`,
});

function credentialFor(n) {
  if (n.type === 'n8n-nodes-base.telegram') return CREDENTIALS.telegram;
  if (n.type !== 'n8n-nodes-base.httpRequest') return null;
  const url = String(n.parameters.url || '');
  if (url.includes('anthropic.com')) return CREDENTIALS.anthropic;
  if (url.includes('graph.facebook.com')) return CREDENTIALS.meta;
  if (url.includes('wablas.com')) return CREDENTIALS.wablas;
  if (url.includes('/public/analytics/')) return CREDENTIALS.storefront;
  if (url.includes('scalev.com')) return CREDENTIALS.scalev;
  return null;
}

// Tanam credential & ID tabel ke semua node sebelum ditulis.
function finalize(wf) {
  for (const n of wf.nodes) {
    const cred = credentialFor(n);
    if (cred) n.credentials = cred;
    const t = n.parameters.dataTableId;
    if (t && TABLE_IDS[t.cachedResultName]) n.parameters.dataTableId = tableRef(t.cachedResultName);
  }
  return wf;
}
const ORDERS_TABLE = tableRef('aics_orders');
const ATTRIBUTION_TABLE = tableRef('lp_attribution');
const TELEGRAM_CHAT_ID = '-5439732568';
const WEBHOOK_PATH = 'f8a25d64-d657-498a-a177-71a844693f42';

const prepareCode = [
  src('product-facts.js'),
  src('prompts.js'),
  src('order-config.js'),
  src('tools.js'),
  src('prepare-context.js'),
  `const body = $('Webhook').first().json.body;
const first = items.length ? items[0].json : null;
const row = first && first.phone ? first : null;
const ctx = prepareContext(body, row);
return ctx ? [{ json: ctx }] : [];`,
].join('\n');

// Kode rantai tool Scalev. Setiap node menyimpan state + body request berikutnya.
const scalevLib = [src('order-config.js'), src('scalev.js')].join('\n');
const toolCode = (body) => [scalevLib, body].join('\n');

const startCode = toolCode(`const ctx = $('Siapkan Konteks').first().json;
const toolUse = ($input.first().json.content || []).find((c) => c.type === 'tool_use');
return [{ json: startTool(toolUse, ctx) }];`);

const locationCode = toolCode(`const state = pickLocation($('Mulai Tool').first().json, $input.first().json);
return [{ json: state }];`);

const postalCode = toolCode(`const state = pickPostalCode($('Pilih Lokasi').first().json, $input.first().json);
return [{ json: { ...state, next: state.ok ? warehouseRequest(state) : null } }];`);

const warehouseCode = toolCode(`const state = pickWarehouse($('Pilih Kode Pos').first().json, $input.first().json);
return [{ json: { ...state, next: state.ok ? courierRequest(state) : null } }];`);

const courierCode = toolCode(`const ctx = $('Siapkan Konteks').first().json;
const state = checkSummaryTotal(pickCourier($('Pilih Gudang').first().json, $input.first().json), ctx);
const wantsOrder = state.ok && state.tool === 'buat_order';
return [{ json: { ...state, createOrder: wantsOrder, next: wantsOrder ? orderRequest(state, ctx) : null } }];`);

const resultCode = toolCode(`const ctx = $('Siapkan Konteks').first().json;
const first = $('Claude').first().json;
const state = ['Hitung Ongkir', 'Pilih Lokasi', 'Mulai Tool'].map((n) => $(n)).find((n) => n.isExecuted).first().json;
const sent = ['Scalev Update Order', 'Scalev Buat Order'].map((n) => $(n)).find((n) => n.isExecuted);
const orderResponse = sent ? sent.first().json : null;
const { block, order } = toolResult(state, orderResponse);
const req = ctx.requestBody;
return [{ json: {
  order,
  requestBody: {
    ...req,
    tool_choice: { type: 'none' },
    messages: req.messages.concat([
      { role: 'assistant', content: first.content },
      { role: 'user', content: [block] },
    ]),
  },
} }];`);

const parseCode = [
  src('product-facts.js'),
  src('parse-reply.js'),
  `const ctx = $('Siapkan Konteks').first().json;
const parsed = parseReply($input.first().json);
const orderMade = $('Hasil Tool').isExecuted && $('Hasil Tool').first().json.order;
if (!orderMade && /prioritas pengiriman|orderan kakak sudah saya (catat|masukkan)|data order sudah masuk/i.test(parsed.reply)) {
  // Claude mengaku order sudah masuk padahal tidak ada order dibuat -> jangan kirim, minta admin cek.
  parsed.reply = 'Bentar ya kak, saya cek dulu ke atasan saya 🙏';
  parsed.needsHuman = true;
  parsed.apiError = 'Bot mengklaim order masuk tanpa membuat order di Scalev';
}
const order = $('Hasil Tool').isExecuted ? $('Hasil Tool').first().json.order : null;
const stored = $('Get row(s)').first().json || {};
const leadRes = $('Scalev Lead Order').isExecuted ? $('Scalev Lead Order').first().json : {};
const lead = (leadRes && leadRes.data) || leadRes || {};
const history = ctx.messages.concat([{ role: 'assistant', content: parsed.reply }]);
return [{
  json: {
    phone: ctx.phone,
    name: ctx.name,
    incoming: ctx.incoming,
    active_product: ctx.active_product,
    ref: ctx.ref,
    isClosing: ctx.isClosing,
    needsHuman: parsed.needsHuman,
    infoAdmin: parsed.infoAdmin,
    testimoni: parsed.sendTestimoni ? pickTestimonials(ctx.active_product, parsed.testimoniTopics) : [],
    // Error API (bukan permintaan lead) cukup dinotif, bot tidak dijeda.
    pauseBot: parsed.needsHuman && !parsed.apiError,
    apiError: parsed.apiError,
    reply: parsed.reply,
    history: JSON.stringify(history),
    order,
    orderText: order ? (order.revision ? 'REVISI ' : '') + order.orderId + ' (' + (order.method === 'cod' ? 'COD' : 'Transfer') + ', Rp' + order.total.toLocaleString('id-ID') + ')' : '',
    scalev_id: order ? order.id : (lead.id ? 'lead:' + lead.id : (stored.scalev_id || '')),
    last_order_id: order ? order.orderId : (lead.order_id || stored.last_order_id || ''),
    last_order_at: order ? new Date().toISOString() : (stored.last_order_at || ''),
    first_chat_at: stored.first_chat_at || new Date().toISOString(),
    last_chat_at: new Date().toISOString(),
    // Notif closing hanya saat order benar-benar dibuat di Scalev.
    notify: Boolean(order) || parsed.needsHuman || parsed.infoAdmin,
  },
}];`,
].join('\n');

const capiCode = [src('capi.js'), `const d = $('Olah Balasan').first().json;
const rows = $input.all().map((i) => i.json).filter((r) => r && r.ref);
const attribution = rows.find((r) => r.ref === d.ref) || null;
return [{ json: { body: purchaseEvent(d.order, d.phone, attribution), matched: Boolean(attribution) } }];`].join('\n');

const column = (id) => ({
  id, displayName: id, required: false, defaultMatch: false,
  display: true, type: 'string', readOnly: false, removed: false,
});

const node = (name, type, typeVersion, x, parameters, extra = {}) => ({
  parameters, type, typeVersion, position: [x, extra.y || 0], name, ...extra, y: undefined,
});

const SCALEV_API = 'https://api.scalev.com/v3';
const scalevHttp = (name, x, method, urlPath, bodyExpr) => node(name, 'n8n-nodes-base.httpRequest', 4.5, x, {
  method,
  url: (urlPath.includes('{{') ? '=' : '') + SCALEV_API + urlPath,
  authentication: 'genericCredentialType',
  genericAuthType: 'httpHeaderAuth',
  ...(bodyExpr ? { sendBody: true, specifyBody: 'json', jsonBody: bodyExpr } : {}),
  options: { response: { response: { neverError: true } }, timeout: 20000 },
}, { y: 300, onError: 'continueRegularOutput' });

const ifNode = (name, x, y, leftValue) => node(name, 'n8n-nodes-base.if', 2.2, x, {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
    conditions: [{ id: name, leftValue, rightValue: true, operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and',
  },
  looseTypeValidation: true,
  options: {},
}, { y });

const nodes = [
  node('Webhook', 'n8n-nodes-base.webhook', 2.1, 0,
    { httpMethod: 'POST', path: WEBHOOK_PATH, options: {} },
    { webhookId: WEBHOOK_PATH }),

  node('Hanya Chat Lead', 'n8n-nodes-base.filter', 2.2, 220, {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
      conditions: [
        {
          id: 'not-from-me',
          leftValue: '={{ $json.body.isFromMe }}',
          rightValue: true,
          operator: { type: 'boolean', operation: 'notEquals' },
        },
        {
          id: 'not-group',
          leftValue: '={{ $json.body.isGroup }}',
          rightValue: true,
          operator: { type: 'boolean', operation: 'notEquals' },
        },
      ],
      combinator: 'and',
    },
    looseTypeValidation: true,
    options: {},
  }),

  node('Get row(s)', 'n8n-nodes-base.dataTable', 1.1, 440, {
    operation: 'get',
    dataTableId: DATA_TABLE,
    filters: { conditions: [{ keyName: 'phone', keyValue: '={{ $json.body.phone }}' }] },
  }, { alwaysOutputData: true }),

  node('Siapkan Konteks', 'n8n-nodes-base.code', 2, 660, { jsCode: prepareCode }),

  ifNode('Bot Dijeda?', 900, 0, '={{ $json.paused === true }}'),
  node('Simpan Saat Jeda', 'n8n-nodes-base.dataTable', 1.1, 1100, {
    operation: 'upsert',
    dataTableId: DATA_TABLE,
    filters: { conditions: [{ keyName: 'phone', keyValue: '={{ $json.phone }}' }] },
    columns: {
      mappingMode: 'defineBelow',
      value: { phone: '={{ $json.phone }}', history: '={{ $json.history }}', last_chat_at: '={{ new Date().toISOString() }}' },
      matchingColumns: [],
      schema: ['phone', 'history', 'last_chat_at'].map(column),
      attemptToConvertTypes: false,
      convertFieldsToString: false,
    },
    options: {},
  }),
  node('Claude', 'n8n-nodes-base.httpRequest', 4.5, 880, {
    method: 'POST',
    url: 'https://api.anthropic.com/v1/messages',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
    sendBody: true,
    specifyBody: 'json',
    jsonBody: "={{ JSON.stringify($('Siapkan Konteks').first().json.requestBody) }}",
    options: { response: { response: { neverError: true } }, timeout: 30000 },
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2 }),

  ifNode('Lead Baru?', 900, -150, '={{ $json.newLead === true }}'),
  scalevHttp('Scalev Lead Order', 1000, 'POST', '/orders', '={{ JSON.stringify($json.leadOrder) }}'),
  // Order lead berstatus draft (Created), bukan pending/confirmed.
  scalevHttp('Scalev Status Draft', 1100, 'POST', '/orders/change-status', "={{ JSON.stringify({ ids: [($json.data || $json).id], status: 'draft' }) }}"),

  ifNode('Pakai Tool?', 1000, 0, "={{ $json.stop_reason === 'tool_use' }}"),
  node('Mulai Tool', 'n8n-nodes-base.code', 2, 1000, { jsCode: startCode }, { y: 300 }),
  ifNode('Tool OK?', 1100, 300, '={{ $json.ok }}'),
  scalevHttp('Scalev Lokasi', 1200, 'GET', "/locations?search={{ encodeURIComponent($json.search || '') }}&page_size=25"),
  node('Pilih Lokasi', 'n8n-nodes-base.code', 2, 1400, { jsCode: locationCode }, { y: 300 }),
  ifNode('Lokasi OK?', 1600, 300, '={{ $json.ok }}'),
  scalevHttp('Scalev Kode Pos', 1800, 'GET', '/locations/{{ $json.location.id }}/postal-codes'),
  node('Pilih Kode Pos', 'n8n-nodes-base.code', 2, 1900, { jsCode: postalCode }, { y: 450 }),
  scalevHttp('Scalev Gudang', 1800, 'POST', '/shipping-costs/search-warehouse', '={{ JSON.stringify($json.next) }}'),
  node('Pilih Gudang', 'n8n-nodes-base.code', 2, 2000, { jsCode: warehouseCode }, { y: 300 }),
  scalevHttp('Scalev Kurir', 2200, 'POST', '/shipping-costs/search-courier-service', '={{ JSON.stringify($json.next || {}) }}'),
  node('Hitung Ongkir', 'n8n-nodes-base.code', 2, 2400, { jsCode: courierCode }, { y: 300 }),
  ifNode('Buat Order?', 2600, 300, '={{ $json.createOrder }}'),
  ifNode('Revisi Order?', 2700, 300, "={{ Boolean($json.patchId) }}"),
  // Resi lama dibatalkan dulu sebelum order direvisi (gagal = belum ada resi, lanjut saja).
  scalevHttp('Scalev Batal Resi', 2800, 'POST', '/orders/cancel-awb', "={{ JSON.stringify({ ids: [$json.patchId] }) }}"),
  scalevHttp('Scalev Update Order', 2800, 'PATCH', "/orders/{{ $('Hitung Ongkir').first().json.patchId }}", "={{ JSON.stringify($('Hitung Ongkir').first().json.next) }}"),
  // Order lead (draft) yang sudah lengkap: COD -> confirmed (siap resi), transfer -> pending (menunggu pembayaran).
  scalevHttp('Scalev Status Order', 2900, 'POST', '/orders/change-status', "={{ JSON.stringify({ ids: [$('Hitung Ongkir').first().json.patchId], status: $('Hitung Ongkir').first().json.input.pembayaran === 'cod' ? 'confirmed' : 'pending', payment_method: $('Hitung Ongkir').first().json.input.pembayaran === 'cod' ? 'cod' : 'bank_transfer' }) }}"),
  scalevHttp('Scalev Buat Order', 2800, 'POST', '/orders', '={{ JSON.stringify($json.next) }}'),
  node('Hasil Tool', 'n8n-nodes-base.code', 2, 3000, { jsCode: resultCode }, { y: 300 }),
  node('Claude Lanjutan', 'n8n-nodes-base.httpRequest', 4.5, 3200, {
    method: 'POST',
    url: 'https://api.anthropic.com/v1/messages',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
    sendBody: true,
    specifyBody: 'json',
    jsonBody: '={{ JSON.stringify($json.requestBody) }}',
    options: { response: { response: { neverError: true } }, timeout: 30000 },
  }, { y: 300, onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2 }),
  node('Olah Balasan', 'n8n-nodes-base.code', 2, 3400, { jsCode: parseCode }),

  ifNode('Perlu Notif?', 3600, 0, '={{ $json.notify }}'),

  node('Telegram Admin', 'n8n-nodes-base.telegram', 1.2, 3800, {
    chatId: TELEGRAM_CHAT_ID,
    text: "={{ $json.order ? ($json.order.revision ? '✏️ *ORDER DIREVISI DI MODERN STORE*' : ($json.order.method === 'cod' ? '🛒 *ORDER FIX MASUK MODERN STORE* (COD)' : '⏳ *ORDER TRANSFER — MENUNGGU PEMBAYARAN*\\nBelum closing. Ubah ke confirmed di Scalev setelah bukti transfer masuk.')) : ($json.apiError ? '⚠️ *BOT ERROR*' : ($json.needsHuman ? '🟠 *BUTUH CS MANUSIA*' : '🔵 *PERTANYAAN UNTUK ADMIN* (bot tetap lanjut)')) }}\n\n" +
      "{{ $json.order ? '🧾 Order: ' + $json.orderText + '\\n📦 Packing: ' + $json.order.packing + '\\n' : '' }}" +
      '📱 Nomor: {{ $json.phone }}\n👤 Nama: {{ $json.order ? $json.order.name : $json.name }}\n🛍️ Produk: {{ $json.active_product }}\n🔗 Ref LP: {{ $json.ref || \'-\' }}\n' +
      "💬 Chat Terakhir: {{ $json.incoming }}\n🤖 Balasan AI: {{ $json.order ? 'template ' + ($json.order.method === 'cod' ? 'COD, nominal COD Rp' : 'transfer, total Rp') + $json.order.total.toLocaleString('id-ID') : $json.reply }}" +
      "{{ $json.apiError ? '\\n⚠️ Error API: ' + $json.apiError : '' }}" +
      "{{ $json.pauseBot ? '\\n\\nBot dijeda 30 menit untuk nomor ini, lalu aktif lagi otomatis. Untuk aktifkan lebih cepat: set kolom handoff = false di leads_context.' : '' }}",
    additionalFields: {},
  }, { onError: 'continueRegularOutput' }),

  node('Kirim WhatsApp', 'n8n-nodes-base.httpRequest', 4.5, 4000, {
    method: 'POST',
    url: 'https://jkt.wablas.com/api/send-message',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendBody: true,
    bodyParameters: {
      parameters: [
        { name: 'phone', value: "={{ $('Olah Balasan').item.json.phone }}" },
        { name: 'message', value: "={{ $('Olah Balasan').item.json.reply }}" },
      ],
    },
    options: {},
  }),

  ifNode('Order Baru?', 0, 0, "={{ Boolean($json.order) }}"),
  node('Catat Order', 'n8n-nodes-base.dataTable', 1.1, 0, {
    operation: 'upsert',
    dataTableId: ORDERS_TABLE,
    filters: { conditions: [{ keyName: 'order_id', keyValue: '={{ $json.order.orderId }}' }] },
    columns: {
      mappingMode: 'defineBelow',
      value: {
        order_id: '={{ $json.order.orderId }}',
        phone: '={{ $json.phone }}',
        paket: '={{ $json.order.paket }}',
        method: '={{ $json.order.method }}',
        price: '={{ String($json.order.price) }}',
        total: '={{ String($json.order.total) }}',
        ref: '={{ $json.ref }}',
        created_at: '={{ new Date().toISOString() }}',
        scalev_id: '={{ $json.order.id }}',
      },
      matchingColumns: [],
      schema: ['order_id', 'phone', 'paket', 'method', 'price', 'total', 'ref', 'created_at', 'scalev_id'].map(column),
      attemptToConvertTypes: false,
      convertFieldsToString: true,
    },
    options: {},
  }, { onError: 'continueRegularOutput' }),
  // Purchase ke Meta hanya untuk COD (transfer belum dibayar = belum closing).
  ifNode('Order Pertama?', 0, 0, "={{ $json.order.revision !== true && $json.order.method === 'cod' }}"),
  node('Cari Atribusi', 'n8n-nodes-base.dataTable', 1.1, 0, {
    operation: 'get',
    dataTableId: ATTRIBUTION_TABLE,
    filters: { conditions: [{ keyName: 'ref', keyValue: "={{ $('Olah Balasan').item.json.ref || '-' }}" }] },
  }, { alwaysOutputData: true, onError: 'continueRegularOutput' }),
  node('Siapkan CAPI', 'n8n-nodes-base.code', 2, 0, { jsCode: capiCode }),
  node('Meta Purchase (CAPI)', 'n8n-nodes-base.httpRequest', 4.5, 0, {
    method: 'POST',
    url: `https://graph.facebook.com/${META.version}/${META.pixel}/events`,
    authentication: 'genericCredentialType',
    genericAuthType: 'httpQueryAuth',
    sendBody: true,
    specifyBody: 'json',
    jsonBody: '={{ JSON.stringify($json.body) }}',
    options: { response: { response: { neverError: true, fullResponse: true } }, timeout: 20000 },
  }, { onError: 'continueRegularOutput' }),
  ifNode('Kirim Testimoni?', 0, 0, "={{ ($('Olah Balasan').item.json.testimoni || []).length > 0 }}"),
  node('Pecah Testimoni', 'n8n-nodes-base.code', 2, 0, {
    jsCode: `const d = $('Olah Balasan').first().json;
return d.testimoni.map((image) => ({ json: { phone: d.phone, image } }));`,
  }),
  node('Kirim Gambar', 'n8n-nodes-base.httpRequest', 4.5, 0, {
    method: 'POST',
    url: 'https://jkt.wablas.com/api/send-image',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendBody: true,
    bodyParameters: {
      parameters: [
        { name: 'phone', value: '={{ $json.phone }}' },
        { name: 'image', value: '={{ $json.image }}' },
        { name: 'caption', value: '' },
      ],
    },
    options: { batching: { batch: { batchSize: 1, batchInterval: 1500 } } },
  }, { onError: 'continueRegularOutput' }),
  // Setelah foto terakhir: 1x pertanyaan lanjutan supaya lead diarahkan ke order.
  node('Jeda Pertanyaan', 'n8n-nodes-base.wait', 1.1, 0, { amount: 3 }, { executeOnce: true, webhookId: 'aics-jeda-pertanyaan' }),
  node('Tanya Lanjut', 'n8n-nodes-base.httpRequest', 4.5, 0, {
    method: 'POST',
    url: 'https://jkt.wablas.com/api/send-message',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendBody: true,
    bodyParameters: {
      parameters: [
        { name: 'phone', value: "={{ $('Olah Balasan').first().json.phone }}" },
        { name: 'message', value: 'Ini testimoni dari pembeli yang kondisinya mirip kakak 😊 Ada lagi yang mau ditanyakan sebelum order, kak?' },
      ],
    },
    options: {},
  }, { executeOnce: true, onError: 'continueRegularOutput' }),
  node('Simpan Histori', 'n8n-nodes-base.dataTable', 1.1, 4200, {
    operation: 'upsert',
    dataTableId: DATA_TABLE,
    filters: { conditions: [{ keyName: 'phone', keyValue: "={{ $('Olah Balasan').item.json.phone }}" }] },
    columns: {
      mappingMode: 'defineBelow',
      value: {
        phone: "={{ $('Olah Balasan').item.json.phone }}",
        active_product: "={{ $('Olah Balasan').item.json.active_product }}",
        history: "={{ $('Olah Balasan').item.json.history }}",
        handoff: "={{ $('Olah Balasan').item.json.pauseBot ? new Date().toISOString() : 'false' }}",
        ref: "={{ $('Olah Balasan').item.json.ref }}",
        scalev_id: "={{ $('Olah Balasan').item.json.scalev_id }}",
        last_order_id: "={{ $('Olah Balasan').item.json.last_order_id }}",
        last_order_at: "={{ $('Olah Balasan').item.json.last_order_at }}",
        first_chat_at: "={{ $('Olah Balasan').item.json.first_chat_at }}",
        last_chat_at: "={{ $('Olah Balasan').item.json.last_chat_at }}",
      },
      matchingColumns: [],
      schema: ['phone', 'active_product', 'history', 'handoff', 'ref', 'scalev_id', 'last_order_id', 'last_order_at', 'first_chat_at', 'last_chat_at'].map(column),
      attemptToConvertTypes: false,
      convertFieldsToString: false,
    },
    options: {},
  }),
];

// Tata letak: baris atas alur chat, baris bawah alur tool Scalev.
const TOP = ['Webhook', 'Hanya Chat Lead', 'Get row(s)', 'Siapkan Konteks', 'Bot Dijeda?', 'Lead Baru?', 'Claude', 'Pakai Tool?'];
const BOTTOM = ['Mulai Tool', 'Tool OK?', 'Scalev Lokasi', 'Pilih Lokasi', 'Lokasi OK?', 'Scalev Kode Pos', 'Pilih Kode Pos',
  'Scalev Gudang', 'Pilih Gudang', 'Scalev Kurir', 'Hitung Ongkir', 'Buat Order?', 'Revisi Order?', 'Scalev Buat Order', 'Hasil Tool', 'Claude Lanjutan'];
const TAIL = ['Olah Balasan', 'Perlu Notif?', 'Telegram Admin', 'Kirim WhatsApp', 'Simpan Histori'];
const place = (names, x0, y) => names.forEach((name, i) => {
  nodes.find((n) => n.name === name).position = [x0 + i * 220, y];
});
place(TOP, 0, 0);
nodes.find((n) => n.name === 'Simpan Saat Jeda').position = [880, -200];
place(['Kirim Testimoni?', 'Pecah Testimoni', 'Kirim Gambar', 'Jeda Pertanyaan', 'Tanya Lanjut'], 1100 + (BOTTOM.length + 3) * 220, -200);
place(['Order Baru?', 'Catat Order'], 1100 + (BOTTOM.length + 1) * 220, -400);
nodes.find((n) => n.name === 'Scalev Batal Resi').position = [1100 + 12 * 220, 480];
place(['Order Pertama?', 'Cari Atribusi', 'Siapkan CAPI', 'Meta Purchase (CAPI)'], 1100 + (BOTTOM.length + 2) * 220, -600);
place(BOTTOM, 1100, 300);
nodes.find((n) => n.name === 'Scalev Lead Order').position = [1320, -200];
nodes.find((n) => n.name === 'Scalev Status Draft').position = [1540, -200];
nodes.find((n) => n.name === 'Scalev Status Order').position = [1100 + 14 * 220, 480];
nodes.find((n) => n.name === 'Scalev Update Order').position = [1100 + 13 * 220, 480];
place(TAIL, 1100 + BOTTOM.length * 220, 0);

nodes.forEach((n, i) => { n.id = `aics-${String(i + 1).padStart(2, '0')}`; });

const link = (...targets) => ({ main: targets.map((t) => (t ? [{ node: t, type: 'main', index: 0 }] : [])) });

const workflow = {
  name: 'AI Agent CS v2',
  nodes,
  pinData: {},
  connections: {
    Webhook: link('Hanya Chat Lead'),
    'Hanya Chat Lead': link('Get row(s)'),
    'Get row(s)': link('Siapkan Konteks'),
    'Siapkan Konteks': link('Bot Dijeda?'),
    'Bot Dijeda?': link('Simpan Saat Jeda', 'Lead Baru?'),
    'Lead Baru?': link('Scalev Lead Order', 'Claude'),
    'Scalev Lead Order': link('Scalev Status Draft'),
    'Scalev Status Draft': link('Claude'),
    Claude: link('Pakai Tool?'),
    'Pakai Tool?': link('Mulai Tool', 'Olah Balasan'),
    'Mulai Tool': link('Tool OK?'),
    'Tool OK?': link('Scalev Lokasi', 'Hasil Tool'),
    'Scalev Lokasi': link('Pilih Lokasi'),
    'Pilih Lokasi': link('Lokasi OK?'),
    'Lokasi OK?': link('Scalev Kode Pos', 'Hasil Tool'),
    'Scalev Kode Pos': link('Pilih Kode Pos'),
    'Pilih Kode Pos': link('Scalev Gudang'),
    'Scalev Gudang': link('Pilih Gudang'),
    'Pilih Gudang': link('Scalev Kurir'),
    'Scalev Kurir': link('Hitung Ongkir'),
    'Hitung Ongkir': link('Buat Order?'),
    'Buat Order?': link('Revisi Order?', 'Hasil Tool'),
    'Revisi Order?': link('Scalev Batal Resi', 'Scalev Buat Order'),
    'Scalev Batal Resi': link('Scalev Update Order'),
    'Scalev Update Order': link('Scalev Status Order'),
    'Scalev Status Order': link('Hasil Tool'),
    'Scalev Buat Order': link('Hasil Tool'),
    'Hasil Tool': link('Claude Lanjutan'),
    'Claude Lanjutan': link('Olah Balasan'),
    'Olah Balasan': { main: [[
      { node: 'Perlu Notif?', type: 'main', index: 0 },
      { node: 'Order Baru?', type: 'main', index: 0 },
    ]] },
    'Order Baru?': { main: [[
      { node: 'Catat Order', type: 'main', index: 0 },
      { node: 'Order Pertama?', type: 'main', index: 0 },
    ], []] },
    'Order Pertama?': link('Cari Atribusi'),
    'Cari Atribusi': link('Siapkan CAPI'),
    'Siapkan CAPI': link('Meta Purchase (CAPI)'),
    'Perlu Notif?': link('Telegram Admin', 'Kirim WhatsApp'),
    'Telegram Admin': link('Kirim WhatsApp'),
    'Kirim WhatsApp': { main: [[
      { node: 'Simpan Histori', type: 'main', index: 0 },
      { node: 'Kirim Testimoni?', type: 'main', index: 0 },
    ]] },
    'Kirim Testimoni?': link('Pecah Testimoni'),
    'Pecah Testimoni': link('Kirim Gambar'),
    'Kirim Gambar': link('Jeda Pertanyaan'),
    'Jeda Pertanyaan': link('Tanya Lanjut'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

const out = path.join(__dirname, 'ai-agent-cs.workflow.json');
fs.writeFileSync(out, JSON.stringify(finalize(workflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), out));

// Workflow kedua: terima atribusi dari LP (lp/wa-redirect.js) → Data Table lp_attribution.
const ATTR_FIELDS = [
  'ref', 'product', 'fbclid', 'fbc', 'fbp', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'landing_url', 'referrer', 'user_agent', 'client_ip', 'clicked_at',
];

const attrCode = `const req = $input.first().json;
let data = req.body;
if (typeof data === 'string') {
  try { data = JSON.parse(data); } catch (e) { data = {}; }
}
if (!data || !/^((SG|KK|KJN)-|PROMO)[A-Z0-9]{5}$/.test(data.ref || '')) return [];
const h = req.headers || {};
data.client_ip = h['cf-connecting-ip'] || h['x-real-ip'] || '';
const out = {};
for (const k of ${JSON.stringify(ATTR_FIELDS)}) out[k] = String(data[k] || '').slice(0, 1000);
return [{ json: out }];`;

const attrWorkflow = {
  name: 'AI Agent CS - LP Attribution',
  nodes: [
    node('LP Webhook', 'n8n-nodes-base.webhook', 2.1, 0, {
      httpMethod: 'POST',
      path: 'lp-attribution',
      responseMode: 'onReceived',
      options: { allowedOrigins: '*', rawBody: false },
    }, { webhookId: 'lp-attribution' }),
    node('Validasi', 'n8n-nodes-base.code', 2, 220, { jsCode: attrCode }),
    node('Simpan Atribusi', 'n8n-nodes-base.dataTable', 1.1, 440, {
      operation: 'insert',
      dataTableId: { __rl: true, value: '', mode: 'list', cachedResultName: 'lp_attribution' },
      columns: {
        mappingMode: 'autoMapInputData',
        value: {},
        matchingColumns: [],
        schema: ATTR_FIELDS.map(column),
        attemptToConvertTypes: false,
        convertFieldsToString: true,
      },
      options: {},
    }),
  ].map((n, i) => ({ ...n, id: `aics-attr-${i + 1}` })),
  pinData: {},
  connections: {
    'LP Webhook': link('Validasi'),
    Validasi: link('Simpan Atribusi'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

const attrOut = path.join(__dirname, 'lp-attribution.workflow.json');
fs.writeFileSync(attrOut, JSON.stringify(finalize(attrWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), attrOut));

// Workflow ketiga: jalankan manual sekali untuk melihat ID store & varian Scalev
// yang perlu diisi di n8n/src/order-config.js.
const setupSummary = `const out = [];
const stores = $('Daftar Store').all();
for (const [i, item] of $input.all().entries()) {
  const store = (stores[i] || stores[0]).json;
  for (const p of item.json.data || []) {
    const variants = p.variants || p.product_variants || p.variant_list || [];
    const base = {
      store_id: store.id, store_unique_id: store.unique_id, store_name: store.name,
      product_id: p.id, product: p.name,
    };
    if (!variants.length) {
      out.push({ json: { ...base, catatan: 'varian tidak ditemukan', field_produk: Object.keys(p).join(', ') } });
    }
    for (const v of variants) {
      out.push({ json: { ...base, variant: v.fullname || v.name, variant_id: v.id,
        variant_unique_id: v.unique_id || v.uuid, price: v.price } });
    }
  }
}
return out;`;

const setupWorkflow = {
  name: 'AI Agent CS - Scalev Setup',
  nodes: [
    node('Jalankan Manual', 'n8n-nodes-base.manualTrigger', 1, 0, {}),
    { ...scalevHttp('Ambil Store', 220, 'GET', '/stores/simplified?page_size=50'), position: [220, 0] },
    node('Daftar Store', 'n8n-nodes-base.splitOut', 1, 440, { fieldToSplitOut: 'data', options: {} }),
    { ...scalevHttp('Ambil Produk', 660, 'GET', '/stores/{{ $json.id }}/products?page_size=100'), position: [660, 0] },
    node('Ringkas ID', 'n8n-nodes-base.code', 2, 880, { jsCode: setupSummary }),
  ].map((n, i) => ({ ...n, id: `aics-setup-${i + 1}` })),
  pinData: {},
  connections: {
    'Jalankan Manual': link('Ambil Store'),
    'Ambil Store': link('Daftar Store'),
    'Daftar Store': link('Ambil Produk'),
    'Ambil Produk': link('Ringkas ID'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

const setupOut = path.join(__dirname, 'scalev-setup.workflow.json');
fs.writeFileSync(setupOut, JSON.stringify(finalize(setupWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), setupOut));

// Workflow keempat: tes cek ongkir ke Scalev asli tanpa membuat order.
// Ubah input di node "Input Tes" lalu Execute.
const byName = Object.fromEntries(nodes.map((n) => [n.name, n]));
const testChain = ['Tool OK?', 'Scalev Lokasi', 'Pilih Lokasi', 'Lokasi OK?', 'Scalev Kode Pos', 'Pilih Kode Pos', 'Scalev Gudang', 'Pilih Gudang', 'Scalev Kurir', 'Hitung Ongkir'];
const ongkirTestWorkflow = {
  name: 'AI Agent CS - Tes Ongkir',
  nodes: [
    node('Jalankan Manual', 'n8n-nodes-base.manualTrigger', 1, 0, {}),
    node('Siapkan Konteks', 'n8n-nodes-base.code', 2, 220, {
      jsCode: "return [{ json: { phone: '6280000000000', active_product: 'SalGlow', ref: '', lastOrder: null } }];",
    }),
    node('Mulai Tool', 'n8n-nodes-base.code', 2, 440, {
      jsCode: toolCode(`// Ubah input tes di sini
const input = { paket: 'B1G1', pembayaran: 'cod', kelurahan: 'Jagir', kecamatan: 'Wonokromo', kota: 'Surabaya' };
return [{ json: startTool({ id: 'tes', name: 'cek_ongkir', input }, $('Siapkan Konteks').first().json) }];`),
    }),
    ...testChain.map((name, i) => ({ ...byName[name], position: [660 + i * 220, 0] })),
  ].map((n, i) => ({ ...n, id: `aics-tes-${i + 1}` })),
  pinData: {},
  connections: {
    'Jalankan Manual': link('Siapkan Konteks'),
    'Siapkan Konteks': link('Mulai Tool'),
    'Mulai Tool': link('Tool OK?'),
    'Tool OK?': link('Scalev Lokasi'),
    'Scalev Lokasi': link('Pilih Lokasi'),
    'Pilih Lokasi': link('Lokasi OK?'),
    'Lokasi OK?': link('Scalev Kode Pos'),
    'Scalev Kode Pos': link('Pilih Kode Pos'),
    'Pilih Kode Pos': link('Scalev Gudang'),
    'Scalev Gudang': link('Pilih Gudang'),
    'Pilih Gudang': link('Scalev Kurir'),
    'Scalev Kurir': link('Hitung Ongkir'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};
const testOut = path.join(__dirname, 'tes-ongkir.workflow.json');
fs.writeFileSync(testOut, JSON.stringify(finalize(ongkirTestWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), testOut));

// Workflow kelima: salinan TEST dari bot utama. Webhook, nama, dan store Scalev terpisah
// supaya uji coba tidak mengganggu nomor & store produksi.
const TEST_WEBHOOK_PATH = 'aics-test-7c1e2b90';
const testWorkflow = JSON.parse(JSON.stringify(workflow));
testWorkflow.name = 'AI Agent CS v2 (TEST)';
for (const n of testWorkflow.nodes) {
  n.id = n.id.replace(/^aics-/, 'aics-test-');
  if (n.type === 'n8n-nodes-base.webhook') {
    n.parameters.path = TEST_WEBHOOK_PATH;
    n.webhookId = TEST_WEBHOOK_PATH;
  }
  if (typeof n.parameters.jsCode === 'string') {
    n.parameters.jsCode = n.parameters.jsCode.replace("const STORE_PROFILE = 'prod';", "const STORE_PROFILE = 'test';");
  }
  if (n.name === 'Telegram Admin') n.parameters.text = n.parameters.text.replace('={{ ', "=🧪 *[TES]* {{ ");
}
const testOutMain = path.join(__dirname, 'ai-agent-cs.test.workflow.json');
fs.writeFileSync(testOutMain, JSON.stringify(finalize(testWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), testOutMain));

// Workflow keenam: rekap harian ke Telegram (23:55 WIB) + tombol tes manual.
const recapCode = [src('recap.js'), `const rows = (name) => $(name).all().map((i) => i.json).filter((r) => r && Object.keys(r).length);
// Status terbaru dari Scalev (hasil node Cek Order) -> transfer baru dihitung closing kalau sudah dibayar/confirmed.
const cands = $('Pilih Order Resi').all().map((i) => i.json);
const status = {};
$('Cek Order').all().forEach((item, i) => {
  const o = (item.json && item.json.data) || item.json || {};
  if (cands[i] && cands[i].scalev_id) status[cands[i].scalev_id] = { status: o.status, payment_status: o.payment_status };
});
const orders = rows('Ambil Order').map((o) => ({ ...o, ...(status[o.scalev_id] || {}) }));
const recap = dailyRecap({ clicks: rows('Ambil Klik LP'), leads: rows('Ambil Leads'), orders });
return [{ json: recap }];`].join('\n');

const getAll = (name, x, table) => node(name, 'n8n-nodes-base.dataTable', 1.1, x, {
  operation: 'get',
  dataTableId: table,
  returnAll: true,
}, { alwaysOutputData: true, executeOnce: true });

const resiLib = [src('order-config.js'), src('resi.js')].join('\n');
const resiPickCode = resiLib + `
const rows = $('Ambil Order').all().map((i) => i.json);
const list = resiCandidates(rows).map((r) => ({ json: r }));
// Tetap 1 item supaya rekap tetap terkirim walau tidak ada order (Cek Order -> 404, diabaikan).
return list.length ? list : [{ json: { scalev_id: '', placeholder: true } }];`;
const resiReadyCode = resiLib + `
const cands = $('Pilih Order Resi').all().map((i) => i.json);
const checks = $('Cek Order').all().map((i) => i.json);
const ready = checks.map((c, i) => (cands[i] && cands[i].scalev_id && readyForResi(c) ? { json: { ...cands[i], packing: packingText(cands[i]) } } : null)).filter(Boolean);
return ready.length ? ready : [{ json: { none: true, text: resiEmptyReport(cands, checks) } }];`;
const resiBatchCode = `const orders = $('Siap Resi').all().map((i) => i.json);
return [{ json: { ids: orders.map((o) => o.scalev_id) } }];`;
const resiReportCode = resiLib + `
return [{ json: { text: resiReport($input.first().json, $('Siap Resi').all().map((i) => i.json)) } }];`;

// Workflow laporan singkat: 09:00, 13:00, 18:00 WIB.
const reportLib = [src('recap.js'), src('report.js')].join('\n');
const reportDataCode = reportLib + `
const rows = (name) => $(name).all().map((i) => i.json).filter((r) => r && Object.keys(r).length);
const data = shortReportData({ leads: rows('Ambil Leads'), orders: rows('Ambil Order') });
return [{ json: { data, requestBody: pendingReasonRequest(data) } }];`;
const reportTextCode = reportLib + `
const d = $('Siapkan Laporan').first().json.data;
const res = $('Alasan Pending').isExecuted ? $('Alasan Pending').first().json : null;
return [{ json: { text: shortReportText(d, res) } }];`;
const reportWorkflow = {
  name: 'AI Agent CS - Laporan Singkat',
  nodes: [
    node('Jam 9, 13, 18', 'n8n-nodes-base.scheduleTrigger', 1.2, 0, {
      rule: { interval: [{ field: 'cronExpression', expression: '0 9,13,18 * * *' }] },
    }),
    { ...node('Tes Laporan', 'n8n-nodes-base.manualTrigger', 1, 0, {}), position: [0, 200] },
    getAll('Ambil Leads', 220, DATA_TABLE),
    getAll('Ambil Order', 440, ORDERS_TABLE),
    node('Siapkan Laporan', 'n8n-nodes-base.code', 2, 660, { jsCode: reportDataCode }),
    ifNode('Ada Pending?', 880, 0, '={{ $json.data.pending.length > 0 }}'),
    node('Alasan Pending', 'n8n-nodes-base.httpRequest', 4.5, 1100, {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.requestBody) }}',
      options: { response: { response: { neverError: true } }, timeout: 30000 },
    }, { onError: 'continueRegularOutput' }),
    node('Susun Laporan', 'n8n-nodes-base.code', 2, 1320, { jsCode: reportTextCode }),
    node('Kirim Laporan', 'n8n-nodes-base.telegram', 1.2, 1540, {
      chatId: TELEGRAM_CHAT_ID,
      text: '={{ $json.text }}',
      additionalFields: { appendAttribution: false },
    }),
  ].map((n, i) => ({ ...n, id: `aics-report-${i + 1}` })),
  pinData: {},
  connections: {
    'Jam 9, 13, 18': link('Ambil Leads'),
    'Tes Laporan': link('Ambil Leads'),
    'Ambil Leads': link('Ambil Order'),
    'Ambil Order': link('Siapkan Laporan'),
    'Siapkan Laporan': link('Ada Pending?'),
    'Ada Pending?': link('Alasan Pending', 'Susun Laporan'),
    'Alasan Pending': link('Susun Laporan'),
    'Susun Laporan': link('Kirim Laporan'),
  },
  active: false,
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
  tags: [],
};
const reportOut = path.join(__dirname, 'laporan-singkat.workflow.json');
fs.writeFileSync(reportOut, JSON.stringify(finalize(reportWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), reportOut));

// Workflow batch resi: jam 12 siang & 12 malam WIB.
const resiWorkflow = {
  name: 'AI Agent CS - Batch Resi',
  nodes: [
    node('Jam 12 & 24', 'n8n-nodes-base.scheduleTrigger', 1.2, 0, {
      rule: { interval: [{ field: 'cronExpression', expression: '0 0,12 * * *' }] },
    }),
    { ...node('Tes Resi', 'n8n-nodes-base.manualTrigger', 1, 0, {}), position: [0, 200] },
    getAll('Ambil Order', 220, ORDERS_TABLE),
    node('Pilih Order Resi', 'n8n-nodes-base.code', 2, 440, { jsCode: resiPickCode }),
    { ...scalevHttp('Cek Order', 660, 'GET', "/orders/{{ $json.scalev_id || 'none' }}"), position: [660, 0] },
    node('Siap Resi', 'n8n-nodes-base.code', 2, 880, { jsCode: resiReadyCode }),
    { ...ifNode('Ada Order Siap?', 1100, 0, '={{ $json.none !== true }}') },
    { ...scalevHttp('Info Kurir', 1320, 'PATCH', "/orders/{{ $json.scalev_id }}/shipment", '={{ JSON.stringify({ courier_additional_info: $json.packing }) }}'), position: [1320, 0] },
    node('Gabung Batch', 'n8n-nodes-base.code', 2, 1540, { jsCode: resiBatchCode }),
    { ...scalevHttp('Generate Resi Batch', 1760, 'POST', '/orders/generate-awb', '={{ JSON.stringify($json) }}'), position: [1760, 0] },
    node('Susun Laporan Resi', 'n8n-nodes-base.code', 2, 1980, { jsCode: resiReportCode }),
    node('Kirim Laporan Resi', 'n8n-nodes-base.telegram', 1.2, 2200, {
      chatId: TELEGRAM_CHAT_ID,
      text: '={{ $json.text }}',
      additionalFields: { appendAttribution: false },
    }, { onError: 'continueRegularOutput' }),
  ].map((n, i) => ({ ...n, id: `aics-resi-${i + 1}` })),
  pinData: {},
  connections: {
    'Jam 12 & 24': link('Ambil Order'),
    'Tes Resi': link('Ambil Order'),
    'Ambil Order': link('Pilih Order Resi'),
    'Pilih Order Resi': link('Cek Order'),
    'Cek Order': link('Siap Resi'),
    'Siap Resi': link('Ada Order Siap?'),
    'Ada Order Siap?': link('Info Kurir', 'Kirim Laporan Resi'),
    'Info Kurir': link('Gabung Batch'),
    'Gabung Batch': link('Generate Resi Batch'),
    'Generate Resi Batch': link('Susun Laporan Resi'),
    'Susun Laporan Resi': link('Kirim Laporan Resi'),
  },
  active: false,
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
  tags: [],
};
const resiOut = path.join(__dirname, 'batch-resi.workflow.json');
fs.writeFileSync(resiOut, JSON.stringify(finalize(resiWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), resiOut));

const recapWorkflow = {
  name: 'AI Agent CS - Rekap Harian',
  nodes: [
    node('Tiap Malam 23:55', 'n8n-nodes-base.scheduleTrigger', 1.2, 0, {
      rule: { interval: [{ field: 'cronExpression', expression: '55 23 * * *' }] },
    }),
    { ...node('Tes Sekarang', 'n8n-nodes-base.manualTrigger', 1, 0, {}), position: [0, 200] },
    getAll('Ambil Klik LP', 220, ATTRIBUTION_TABLE),
    getAll('Ambil Leads', 440, DATA_TABLE),
    getAll('Ambil Order', 660, ORDERS_TABLE),
    node('Hitung Rekap', 'n8n-nodes-base.code', 2, 1320, { jsCode: recapCode }),
    node('Kirim Rekap', 'n8n-nodes-base.telegram', 1.2, 1540, {
      chatId: TELEGRAM_CHAT_ID,
      text: '={{ $json.text }}',
      additionalFields: { parse_mode: 'Markdown', appendAttribution: false },
    }),
    // Status terbaru order dari Scalev untuk rekap (transfer lunas / dibatalkan).
    node('Pilih Order Resi', 'n8n-nodes-base.code', 2, 880, { jsCode: resiPickCode }),
    { ...scalevHttp('Cek Order', 1540, 'GET', "/orders/{{ $json.scalev_id || 'none' }}"), position: [1100, 0] },
  ].map((n, i) => ({ ...n, id: `aics-recap-${i + 1}` })),
  pinData: {},
  connections: {
    'Tiap Malam 23:55': link('Ambil Klik LP'),
    'Tes Sekarang': link('Ambil Klik LP'),
    'Ambil Klik LP': link('Ambil Leads'),
    'Ambil Leads': link('Ambil Order'),
    'Ambil Order': link('Pilih Order Resi'),
    'Pilih Order Resi': link('Cek Order'),
    'Cek Order': link('Hitung Rekap'),
    'Hitung Rekap': link('Kirim Rekap'),
  },
  active: false,
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
  tags: [],
};
const recapOut = path.join(__dirname, 'rekap-harian.workflow.json');
fs.writeFileSync(recapOut, JSON.stringify(finalize(recapWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), recapOut));

// Workflow ketujuh: follow-up otomatis lead yang tidak membalas (cek tiap 1 jam).
const fuLib = ['product-facts.js', 'prompts.js', 'order-config.js', 'tools.js', 'prepare-context.js', 'parse-reply.js', 'follow-up.js'].map(src).join('\n');
const fuPickCode = fuLib + `
const now = Date.now();
return $input.all().map((i) => i.json).filter((r) => r && r.phone).map((row) => {
  const due = dueFollowUp(row, now);
  return due ? { json: { phone: row.phone, stage: due.stage, history: row.history, requestBody: followUpRequest(row, due) } } : null;
}).filter(Boolean);`;
const fuParseCode = fuLib + `
const leads = $('Pilih Lead FU').all();
return $input.all().map((item, i) => {
  const lead = leads[i].json;
  const text = followUpText(item.json);
  return text ? { json: { phone: lead.phone, reply: text, history: appendFollowUp(lead.history, text, lead.stage) } } : null;
}).filter(Boolean);`;

const followUpWorkflow = {
  name: 'AI Agent CS - Follow Up',
  nodes: [
    node('Tiap 1 Jam', 'n8n-nodes-base.scheduleTrigger', 1.2, 0, {
      rule: { interval: [{ field: 'hours', hoursInterval: 1 }] },
    }),
    getAll('Ambil Leads', 220, DATA_TABLE),
    node('Pilih Lead FU', 'n8n-nodes-base.code', 2, 440, { jsCode: fuPickCode }),
    node('Claude FU', 'n8n-nodes-base.httpRequest', 4.5, 660, {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.requestBody) }}',
      options: { response: { response: { neverError: true } }, timeout: 30000 },
    }, { onError: 'continueRegularOutput' }),
    node('Olah FU', 'n8n-nodes-base.code', 2, 880, { jsCode: fuParseCode }),
    node('Kirim FU', 'n8n-nodes-base.httpRequest', 4.5, 1100, {
      method: 'POST',
      url: 'https://jkt.wablas.com/api/send-message',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      bodyParameters: {
        parameters: [
          { name: 'phone', value: '={{ $json.phone }}' },
          { name: 'message', value: '={{ $json.reply }}' },
        ],
      },
      options: { batching: { batch: { batchSize: 1, batchInterval: 2000 } } },
    }),
    node('Simpan FU', 'n8n-nodes-base.dataTable', 1.1, 1320, {
      operation: 'upsert',
      dataTableId: DATA_TABLE,
      filters: { conditions: [{ keyName: 'phone', keyValue: "={{ $('Olah FU').item.json.phone }}" }] },
      columns: {
        mappingMode: 'defineBelow',
        value: { phone: "={{ $('Olah FU').item.json.phone }}", history: "={{ $('Olah FU').item.json.history }}" },
        matchingColumns: [],
        schema: ['phone', 'history'].map(column),
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
      options: {},
    }),
  ].map((n, i) => ({ ...n, id: `aics-fu-${i + 1}` })),
  pinData: {},
  connections: {
    'Tiap 1 Jam': link('Ambil Leads'),
    'Ambil Leads': link('Pilih Lead FU'),
    'Pilih Lead FU': link('Claude FU'),
    'Claude FU': link('Olah FU'),
    'Olah FU': link('Kirim FU'),
    'Kirim FU': link('Simpan FU'),
  },
  active: false,
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
  tags: [],
};
const fuOut = path.join(__dirname, 'follow-up.workflow.json');
fs.writeFileSync(fuOut, JSON.stringify(finalize(followUpWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), fuOut));

// Workflow kedelapan: hapus order tes di Scalev (manual). Isi daftar ORDER_ID di node "Daftar Order".
const TEST_ORDER_IDS = ['260927GXFGSJS', '260927ZAEKENZ', '260927LWLMRCX', '260927CECGRKR'];
const cleanupWorkflow = {
  name: 'AI Agent CS - Hapus Order Tes',
  nodes: [
    node('Jalankan', 'n8n-nodes-base.manualTrigger', 1, 0, {}),
    node('Daftar Order', 'n8n-nodes-base.code', 2, 220, {
      jsCode: `// Order ID Scalev (bukan UUID) yang mau dibatalkan lalu dihapus.
const ORDER_IDS = ${JSON.stringify(TEST_ORDER_IDS)};
return ORDER_IDS.map((order_id) => ({ json: { order_id } }));`,
    }),
    { ...scalevHttp('Cari Order', 440, 'GET', "/orders?search={{ $json.order_id }}&page_size=5"), position: [440, 0] },
    node('Ambil ID', 'n8n-nodes-base.code', 2, 660, {
      jsCode: `const wanted = $('Daftar Order').all().map((i) => i.json.order_id);
const ids = [];
const found = [];
for (const item of $input.all()) {
  const list = (item.json && (item.json.data && (item.json.data.results || item.json.data))) || [];
  for (const o of Array.isArray(list) ? list : []) {
    if (wanted.includes(o.order_id) && !ids.includes(o.id)) { ids.push(o.id); found.push(o.order_id); }
  }
}
return [{ json: { ids, found, missing: wanted.filter((w) => !found.includes(w)) } }];`,
    }),
    { ...scalevHttp('Batalkan', 880, 'POST', '/orders/change-status', "={{ JSON.stringify({ ids: $json.ids, status: 'canceled' }) }}"), position: [880, 0] },
    { ...scalevHttp('Hapus', 1100, 'POST', '/orders/delete', "={{ JSON.stringify({ ids: $('Ambil ID').first().json.ids }) }}"), position: [1100, 0] },
  ].map((n, i) => ({ ...n, id: `aics-clean-${i + 1}` })),
  pinData: {},
  connections: {
    Jalankan: link('Daftar Order'),
    'Daftar Order': link('Cari Order'),
    'Cari Order': link('Ambil ID'),
    'Ambil ID': link('Batalkan'),
    Batalkan: link('Hapus'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};
const cleanupOut = path.join(__dirname, 'hapus-order-tes.workflow.json');
fs.writeFileSync(cleanupOut, JSON.stringify(finalize(cleanupWorkflow), null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), cleanupOut));
