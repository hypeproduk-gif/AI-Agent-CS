// Bangun workflow n8n dari src/*.js → ai-agent-cs.workflow.json
// Pakai: node n8n/build.js

const fs = require('fs');
const path = require('path');

const src = (name) => fs.readFileSync(path.join(__dirname, 'src', name), 'utf8');

const DATA_TABLE = {
  __rl: true,
  value: 'qZYFr5OtcUD8F8Co',
  mode: 'list',
  cachedResultName: 'leads_context',
  cachedResultUrl: '/projects/K2OXZkkoLw9p8qNz/datatables/qZYFr5OtcUD8F8Co',
};
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
const state = pickCourier($('Pilih Gudang').first().json, $input.first().json);
const wantsOrder = state.ok && state.tool === 'buat_order';
return [{ json: { ...state, createOrder: wantsOrder, next: wantsOrder ? orderRequest(state, ctx) : null } }];`);

const resultCode = toolCode(`const ctx = $('Siapkan Konteks').first().json;
const first = $('Claude').first().json;
const state = ['Hitung Ongkir', 'Pilih Lokasi', 'Mulai Tool'].map((n) => $(n)).find((n) => n.isExecuted).first().json;
const orderResponse = $('Scalev Buat Order').isExecuted ? $('Scalev Buat Order').first().json : null;
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
const order = $('Hasil Tool').isExecuted ? $('Hasil Tool').first().json.order : null;
const stored = $('Get row(s)').first().json || {};
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
    orderText: order ? order.orderId + ' (' + (order.method === 'cod' ? 'COD' : 'Transfer') + ', Rp' + order.total.toLocaleString('id-ID') + ')' : '',
    last_order_id: order ? order.orderId : (stored.last_order_id || ''),
    last_order_at: order ? new Date().toISOString() : (stored.last_order_at || ''),
    // Notif closing hanya saat order benar-benar dibuat di Scalev.
    notify: Boolean(order) || parsed.needsHuman || parsed.infoAdmin,
  },
}];`,
].join('\n');

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
      value: { phone: '={{ $json.phone }}', history: '={{ $json.history }}' },
      matchingColumns: [],
      schema: ['phone', 'history'].map(column),
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
    jsonBody: '={{ JSON.stringify($json.requestBody) }}',
    options: { response: { response: { neverError: true } }, timeout: 30000 },
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2 }),

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
    text: "={{ $json.order ? '🛒 *ORDER FIX MASUK SCALEV*' : ($json.apiError ? '⚠️ *BOT ERROR*' : ($json.needsHuman ? '🟠 *BUTUH CS MANUSIA*' : '🔵 *PERTANYAAN UNTUK ADMIN* (bot tetap lanjut)')) }}\n\n" +
      "{{ $json.order ? '🧾 Order: ' + $json.orderText + '\\n' : '' }}" +
      '📱 Nomor: {{ $json.phone }}\n👤 Nama: {{ $json.name }}\n🛍️ Produk: {{ $json.active_product }}\n🔗 Ref LP: {{ $json.ref || \'-\' }}\n' +
      '💬 Chat Terakhir: {{ $json.incoming }}\n🤖 Balasan AI: {{ $json.reply }}' +
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
        last_order_id: "={{ $('Olah Balasan').item.json.last_order_id }}",
        last_order_at: "={{ $('Olah Balasan').item.json.last_order_at }}",
      },
      matchingColumns: [],
      schema: ['phone', 'active_product', 'history', 'handoff', 'ref', 'last_order_id', 'last_order_at'].map(column),
      attemptToConvertTypes: false,
      convertFieldsToString: false,
    },
    options: {},
  }),
];

// Tata letak: baris atas alur chat, baris bawah alur tool Scalev.
const TOP = ['Webhook', 'Hanya Chat Lead', 'Get row(s)', 'Siapkan Konteks', 'Bot Dijeda?', 'Claude', 'Pakai Tool?'];
const BOTTOM = ['Mulai Tool', 'Tool OK?', 'Scalev Lokasi', 'Pilih Lokasi', 'Lokasi OK?', 'Scalev Kode Pos', 'Pilih Kode Pos',
  'Scalev Gudang', 'Pilih Gudang', 'Scalev Kurir', 'Hitung Ongkir', 'Buat Order?', 'Scalev Buat Order', 'Hasil Tool', 'Claude Lanjutan'];
const TAIL = ['Olah Balasan', 'Perlu Notif?', 'Telegram Admin', 'Kirim WhatsApp', 'Simpan Histori'];
const place = (names, x0, y) => names.forEach((name, i) => {
  nodes.find((n) => n.name === name).position = [x0 + i * 220, y];
});
place(TOP, 0, 0);
nodes.find((n) => n.name === 'Simpan Saat Jeda').position = [880, -200];
place(['Kirim Testimoni?', 'Pecah Testimoni', 'Kirim Gambar'], 1100 + (BOTTOM.length + 3) * 220, -200);
place(BOTTOM, 1100, 300);
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
    'Bot Dijeda?': link('Simpan Saat Jeda', 'Claude'),
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
    'Buat Order?': link('Scalev Buat Order', 'Hasil Tool'),
    'Scalev Buat Order': link('Hasil Tool'),
    'Hasil Tool': link('Claude Lanjutan'),
    'Claude Lanjutan': link('Olah Balasan'),
    'Olah Balasan': link('Perlu Notif?'),
    'Perlu Notif?': link('Telegram Admin', 'Kirim WhatsApp'),
    'Telegram Admin': link('Kirim WhatsApp'),
    'Kirim WhatsApp': { main: [[
      { node: 'Simpan Histori', type: 'main', index: 0 },
      { node: 'Kirim Testimoni?', type: 'main', index: 0 },
    ]] },
    'Kirim Testimoni?': link('Pecah Testimoni'),
    'Pecah Testimoni': link('Kirim Gambar'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

const out = path.join(__dirname, 'ai-agent-cs.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2) + '\n');
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
if (!data || !/^(SG|KK|KJN)-[A-Z0-9]{5}$/.test(data.ref || '')) return [];
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
fs.writeFileSync(attrOut, JSON.stringify(attrWorkflow, null, 2) + '\n');
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
fs.writeFileSync(setupOut, JSON.stringify(setupWorkflow, null, 2) + '\n');
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
fs.writeFileSync(testOut, JSON.stringify(ongkirTestWorkflow, null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), testOut));
