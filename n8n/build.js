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
  src('prompts.js'),
  src('prepare-context.js'),
  `const body = $('Webhook').first().json.body;
const first = items.length ? items[0].json : null;
const row = first && first.phone ? first : null;
const ctx = prepareContext(body, row);
return ctx ? [{ json: ctx }] : [];`,
].join('\n');

const parseCode = [
  src('parse-reply.js'),
  `const ctx = $('Siapkan Konteks').first().json;
const parsed = parseReply($input.first().json);
const history = ctx.messages.concat([{ role: 'assistant', content: parsed.reply }]);
return [{
  json: {
    phone: ctx.phone,
    name: ctx.name,
    incoming: ctx.incoming,
    active_product: ctx.active_product,
    isClosing: ctx.isClosing,
    needsHuman: parsed.needsHuman,
    apiError: parsed.apiError,
    reply: parsed.reply,
    history: JSON.stringify(history),
    notify: ctx.isClosing || parsed.needsHuman,
  },
}];`,
].join('\n');

const column = (id) => ({
  id, displayName: id, required: false, defaultMatch: false,
  display: true, type: 'string', readOnly: false, removed: false,
});

const node = (name, type, typeVersion, x, parameters, extra = {}) => ({
  parameters, type, typeVersion, position: [x, 0], name, ...extra,
});

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

  node('Olah Balasan', 'n8n-nodes-base.code', 2, 1100, { jsCode: parseCode }),

  node('Perlu Notif?', 'n8n-nodes-base.if', 2.2, 1320, {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
      conditions: [{
        id: 'notify',
        leftValue: '={{ $json.notify }}',
        rightValue: true,
        operator: { type: 'boolean', operation: 'true', singleValue: true },
      }],
      combinator: 'and',
    },
    looseTypeValidation: true,
    options: {},
  }),

  node('Telegram Admin', 'n8n-nodes-base.telegram', 1.2, 1540, {
    chatId: TELEGRAM_CHAT_ID,
    text: "={{ $json.needsHuman ? '🟠 *BUTUH CS MANUSIA*' : '🟢 *CLOSING BARU*' }}\n\n" +
      '📱 Nomor: {{ $json.phone }}\n👤 Nama: {{ $json.name }}\n🛍️ Produk: {{ $json.active_product }}\n' +
      '💬 Chat Terakhir: {{ $json.incoming }}\n🤖 Balasan AI: {{ $json.reply }}' +
      "{{ $json.apiError ? '\\n⚠️ Error API: ' + $json.apiError : '' }}" +
      "{{ $json.needsHuman ? '\\n\\nBot dijeda untuk nomor ini. Set kolom handoff = false di leads_context untuk mengaktifkan lagi.' : '' }}",
    additionalFields: {},
  }, { onError: 'continueRegularOutput' }),

  node('Kirim WhatsApp', 'n8n-nodes-base.httpRequest', 4.5, 1760, {
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

  node('Simpan Histori', 'n8n-nodes-base.dataTable', 1.1, 1980, {
    operation: 'upsert',
    dataTableId: DATA_TABLE,
    filters: { conditions: [{ keyName: 'phone', keyValue: "={{ $('Olah Balasan').item.json.phone }}" }] },
    columns: {
      mappingMode: 'defineBelow',
      value: {
        phone: "={{ $('Olah Balasan').item.json.phone }}",
        active_product: "={{ $('Olah Balasan').item.json.active_product }}",
        history: "={{ $('Olah Balasan').item.json.history }}",
        handoff: "={{ String($('Olah Balasan').item.json.needsHuman) }}",
      },
      matchingColumns: [],
      schema: ['phone', 'active_product', 'history', 'handoff'].map(column),
      attemptToConvertTypes: false,
      convertFieldsToString: false,
    },
    options: {},
  }),
];

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
    'Siapkan Konteks': link('Claude'),
    Claude: link('Olah Balasan'),
    'Olah Balasan': link('Perlu Notif?'),
    'Perlu Notif?': link('Telegram Admin', 'Kirim WhatsApp'),
    'Telegram Admin': link('Kirim WhatsApp'),
    'Kirim WhatsApp': link('Simpan Histori'),
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

const out = path.join(__dirname, 'ai-agent-cs.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2) + '\n');
console.log('Wrote', path.relative(process.cwd(), out));
