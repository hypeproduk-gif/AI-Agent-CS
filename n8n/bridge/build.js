// Bangun workflow bridge crypto → ../bridge-crypto.workflow.json
// Pakai: node n8n/bridge/build.js
const fs = require('fs');
const path = require('path');
const code = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');
const TG = { telegramApi: { id: 'GvWCKSvWULLSOTrP', name: 'Telegram account' } };

let x = 0;
const node = (name, type, typeVersion, parameters, extra = {}) =>
  ({ id: `bridge-${String(++x).padStart(2, '0')}`, name, type, typeVersion, position: [x * 220, 0], parameters, ...extra });
const tgSend = (name, text) => node(name, 'n8n-nodes-base.telegram', 1.2,
  { chatId: '={{ $json.chatId }}', text, additionalFields: { parse_mode: 'Markdown', appendAttribution: false } }, { credentials: TG });
const ifNode = (name, left) => node(name, 'n8n-nodes-base.if', 2.2, {
  conditions: { options: { version: 2, typeValidation: 'loose', caseSensitive: true, leftValue: '' }, combinator: 'and',
    conditions: [{ id: name, leftValue: left, rightValue: true, operator: { type: 'boolean', operation: 'true', singleValue: true } }] },
  looseTypeValidation: true, options: {} });

const nodes = [
  node('Telegram Trigger', 'n8n-nodes-base.telegramTrigger', 1.2, { updates: ['message'], additionalFields: {} },
    { credentials: TG, webhookId: 'bridge-crypto-tg' }),
  node('Parse Perintah', 'n8n-nodes-base.code', 2, { jsCode: code('parse.js') }),
  ifNode('Perintah Valid?', '={{ $json.ok }}'),
  tgSend('Balas Error', '=❌ {{ $json.error }}'),
  node('Ambil Quote LI.FI', 'n8n-nodes-base.httpRequest', 4.2, {
    url: 'https://li.quest/v1/quote', sendQuery: true, queryParameters: { parameters: [
      { name: 'fromChain', value: '={{ $json.fromChain }}' }, { name: 'toChain', value: '={{ $json.toChain }}' },
      { name: 'fromToken', value: '={{ $json.token }}' }, { name: 'toToken', value: '={{ $json.toToken }}' },
      { name: 'fromAmount', value: '={{ $json.fromAmount }}' }, { name: 'fromAddress', value: '={{ $json.wallet }}' },
      { name: 'slippage', value: '={{ $env.BRIDGE_SLIPPAGE || 0.005 }}' }, { name: 'order', value: 'CHEAPEST' },
    ] }, options: {} }),
  node('Ringkas Quote', 'n8n-nodes-base.code', 2, { jsCode: code('summarize.js') }),
  ifNode('Biaya Aman?', '={{ $json.pass }}'),
  tgSend('Tolak Biaya Tinggi', '={{ $json.msg }}\n\n⛔ Dibatalkan: potongan melebihi batas.'),
  node('Minta Persetujuan', 'n8n-nodes-base.telegram', 1.2, {
    operation: 'sendAndWait', chatId: '={{ $json.chatId }}', message: '={{ $json.msg }}\n\nEksekusi bridge ini?',
    approvalOptions: { values: { approvalType: 'double', approveLabel: '✅ Eksekusi', disapproveLabel: '❌ Batal' } },
    options: { limitWaitTime: { values: { limitType: 'afterTimeInterval', resumeAmount: 5, resumeUnit: 'minutes' } } },
  }, { credentials: TG, webhookId: 'bridge-crypto-approve' }),
  ifNode('Disetujui?', '={{ $json.data.approved }}'),
  node('Eksekusi via Signer', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'POST', url: '={{ $env.BRIDGE_SIGNER_URL }}/execute',
    sendHeaders: true, headerParameters: { parameters: [{ name: 'x-signer-secret', value: '={{ $env.BRIDGE_SIGNER_SECRET }}' }] },
    sendBody: true, specifyBody: 'json', jsonBody: `={{ JSON.stringify((q => ({ chainId: q.fromChain, approvalAddress: q.approvalAddress,
  fromTokenAddress: q.fromTokenAddress, fromAmount: q.fromAmount, transactionRequest: q.transactionRequest }))($('Ringkas Quote').first().json)) }}`,
    options: { timeout: 180000 } }),
  node('Siapkan Polling', 'n8n-nodes-base.set', 3.4, { assignments: { assignments: [
    { id: 'a1', name: 'txHash', value: '={{ $json.txHash }}', type: 'string' },
    { id: 'a2', name: 'chatId', value: "={{ $('Ringkas Quote').first().json.chatId }}", type: 'string' },
    { id: 'a3', name: 'tool', value: "={{ $('Ringkas Quote').first().json.tool }}", type: 'string' },
    { id: 'a4', name: 'fromChain', value: "={{ $('Ringkas Quote').first().json.fromChain }}", type: 'number' },
    { id: 'a5', name: 'toChain', value: "={{ $('Ringkas Quote').first().json.toChain }}", type: 'number' },
  ] }, options: {} }),
  tgSend('Info Tx Terkirim', '=🚀 Tx terkirim: `{{ $json.txHash }}`\nMemantau status bridge…'),
  node('Tunggu 30 dtk', 'n8n-nodes-base.wait', 1.1, { amount: 30 }, { webhookId: 'bridge-crypto-wait' }),
  node('Cek Status LI.FI', 'n8n-nodes-base.httpRequest', 4.2, {
    url: 'https://li.quest/v1/status', sendQuery: true, queryParameters: { parameters: [
      { name: 'txHash', value: "={{ $('Siapkan Polling').first().json.txHash }}" },
      { name: 'bridge', value: "={{ $('Siapkan Polling').first().json.tool }}" },
      { name: 'fromChain', value: "={{ $('Siapkan Polling').first().json.fromChain }}" },
      { name: 'toChain', value: "={{ $('Siapkan Polling').first().json.toChain }}" },
    ] }, options: { response: { response: { neverError: true } } } }),
  node('Evaluasi Status', 'n8n-nodes-base.code', 2, { jsCode: code('status.js') }),
  ifNode('Selesai?', '={{ $json.done }}'),
  tgSend('Lapor Hasil', `={{ $json.status === 'DONE' ? '✅ Bridge selesai' : '⚠️ Bridge ' + $json.status }}{{ $json.substatus ? ' (' + $json.substatus + ')' : '' }}\nTx asal: \`{{ $json.txHash }}\`\nTx tujuan: \`{{ $json.receiving || '-' }}\``),
  tgSend('Batal', '=🛑 Bridge dibatalkan.'),
  // --- Arbitrase ---
  ifNode('Mode Arb?', "={{ $json.mode === 'arb' }}"),
  node('Kirim ke Executor', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'POST', url: '={{ $env.BRIDGE_SIGNER_URL }}/arb',
    sendHeaders: true, headerParameters: { parameters: [{ name: 'x-signer-secret', value: '={{ $env.BRIDGE_SIGNER_SECRET }}' }] },
    sendBody: true, specifyBody: 'json', jsonBody: `={{ JSON.stringify({ token: $json.token, fromChain: $json.fromChain, toChain: $json.toChain,
  capital: $json.capital, minProfit: $json.minProfit, chatId: $json.chatId, callbackUrl: $env.BRIDGE_PROGRESS_URL }) }}`,
    options: { response: { response: { neverError: true } } } }),
  node('Balas Arb', 'n8n-nodes-base.telegram', 1.2, { chatId: "={{ $('Parse Perintah').first().json.chatId }}",
    text: "={{ $json.accepted ? '⏳ Arb diterima, mengecek ulang profit…' : '❌ ' + ($json.error || 'Executor tidak merespons') }}",
    additionalFields: { appendAttribution: false } }, { credentials: TG }),
  node('Webhook Progres', 'n8n-nodes-base.webhook', 2.1, { httpMethod: 'POST', path: 'bridge-arb-progress', options: {} },
    { webhookId: 'bridge-arb-progress' }),
  ifNode('Secret Valid?', "={{ $json.headers['x-signer-secret'] === $env.BRIDGE_SIGNER_SECRET }}"),
  node('Kirim Progres', 'n8n-nodes-base.telegram', 1.2, { chatId: '={{ $json.body.chatId }}', text: '={{ $json.body.text }}',
    additionalFields: { parse_mode: 'Markdown', appendAttribution: false } }, { credentials: TG }),
];
// Tata ulang posisi supaya rapi
const pos = { 'Balas Error': [660, 200], 'Tolak Biaya Tinggi': [1540, 200], 'Batal': [2200, 200],
  'Mode Arb?': [880, -250], 'Kirim ke Executor': [1100, -250], 'Balas Arb': [1320, -250],
  'Webhook Progres': [220, 450], 'Secret Valid?': [440, 450], 'Kirim Progres': [660, 450] };
nodes.forEach((n) => { if (pos[n.name]) n.position = pos[n.name]; });

const link = (...pairs) => pairs.reduce((c, [a, b, out = 0]) => {
  c[a] ??= { main: [] }; (c[a].main[out] ??= []).push({ node: b, type: 'main', index: 0 }); return c;
}, {});
const connections = link(
  ['Telegram Trigger', 'Parse Perintah'], ['Parse Perintah', 'Perintah Valid?'],
  ['Perintah Valid?', 'Mode Arb?', 0], ['Mode Arb?', 'Kirim ke Executor', 0], ['Mode Arb?', 'Ambil Quote LI.FI', 1],
  ['Kirim ke Executor', 'Balas Arb'], ['Webhook Progres', 'Secret Valid?'], ['Secret Valid?', 'Kirim Progres', 0], ['Perintah Valid?', 'Balas Error', 1],
  ['Ambil Quote LI.FI', 'Ringkas Quote'], ['Ringkas Quote', 'Biaya Aman?'],
  ['Biaya Aman?', 'Minta Persetujuan', 0], ['Biaya Aman?', 'Tolak Biaya Tinggi', 1],
  ['Minta Persetujuan', 'Disetujui?'], ['Disetujui?', 'Eksekusi via Signer', 0], ['Disetujui?', 'Batal', 1],
  ['Eksekusi via Signer', 'Siapkan Polling'], ['Siapkan Polling', 'Info Tx Terkirim'],
  ['Info Tx Terkirim', 'Tunggu 30 dtk'], ['Tunggu 30 dtk', 'Cek Status LI.FI'], ['Cek Status LI.FI', 'Evaluasi Status'],
  ['Evaluasi Status', 'Selesai?'], ['Selesai?', 'Lapor Hasil', 0], ['Selesai?', 'Tunggu 30 dtk', 1],
);
// "Batal" butuh chatId dari quote
nodes.find((n) => n.name === 'Batal').parameters.chatId = "={{ $('Ringkas Quote').first().json.chatId }}";

const wf = { name: 'Bridge Crypto (LI.FI)', nodes, connections, settings: { executionOrder: 'v1' }, active: false };
fs.writeFileSync(path.join(__dirname, '..', 'bridge-crypto.workflow.json'), JSON.stringify(wf, null, 2) + '\n');
console.log('OK:', nodes.length, 'nodes');

// ---------- Workflow scanner arbitrase ----------
x = 0;
const scanNodes = [
  node('Tiap 5 Menit', 'n8n-nodes-base.scheduleTrigger', 1.2, { rule: { interval: [{ field: 'minutes', minutesInterval: 5 }] } }),
  node('Scan Selisih Harga', 'n8n-nodes-base.code', 2, { jsCode: code('scan.js') }),
  node('Kirim Peluang', 'n8n-nodes-base.telegram', 1.2, { chatId: '={{ $json.chatId }}', text: '={{ $json.text }}',
    additionalFields: { parse_mode: 'Markdown', appendAttribution: false } }, { credentials: TG }),
  node('Mode Auto?', 'n8n-nodes-base.if', 2.2, { conditions: { options: { version: 2, typeValidation: 'loose', caseSensitive: true, leftValue: '' },
    combinator: 'and', conditions: [{ id: 'auto', leftValue: '={{ !!$json.auto }}', rightValue: true,
    operator: { type: 'boolean', operation: 'true', singleValue: true } }] }, looseTypeValidation: true, options: {} }),
  node('Eksekusi Otomatis', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'POST', url: '={{ $env.BRIDGE_SIGNER_URL }}/arb',
    sendHeaders: true, headerParameters: { parameters: [{ name: 'x-signer-secret', value: '={{ $env.BRIDGE_SIGNER_SECRET }}' }] },
    sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.auto) }}',
    options: { response: { response: { neverError: true } } } }),
  node('Tiap Hari 20:00', 'n8n-nodes-base.scheduleTrigger', 1.2, { rule: { interval: [{ field: 'days', triggerAtHour: 20 }] } }),
  node('Ringkasan Pantau', 'n8n-nodes-base.code', 2, { jsCode: code('monitor-summary.js') }),
  node('Kirim Ringkasan', 'n8n-nodes-base.telegram', 1.2, { chatId: '={{ $json.chatId }}', text: '={{ $json.text }}',
    additionalFields: { parse_mode: 'Markdown', appendAttribution: false } }, { credentials: TG }),
];
scanNodes.slice(-3).forEach((n, i) => { n.position = [220 * (i + 1), 300]; });
const scan = { name: 'Bridge Arb Scanner', nodes: scanNodes,
  connections: link(['Tiap 5 Menit', 'Scan Selisih Harga'], ['Scan Selisih Harga', 'Kirim Peluang'],
    ['Scan Selisih Harga', 'Mode Auto?'], ['Mode Auto?', 'Eksekusi Otomatis', 0],
    ['Tiap Hari 20:00', 'Ringkasan Pantau'], ['Ringkasan Pantau', 'Kirim Ringkasan']),
  settings: { executionOrder: 'v1' }, active: false };
fs.writeFileSync(path.join(__dirname, '..', 'bridge-arb-scanner.workflow.json'), JSON.stringify(scan, null, 2) + '\n');
console.log('OK scanner:', scanNodes.length, 'nodes');
