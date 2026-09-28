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
];
// Tata ulang posisi supaya rapi
const pos = { 'Balas Error': [660, 200], 'Tolak Biaya Tinggi': [1540, 200], 'Batal': [2200, 200] };
nodes.forEach((n) => { if (pos[n.name]) n.position = pos[n.name]; });

const link = (...pairs) => pairs.reduce((c, [a, b, out = 0]) => {
  c[a] ??= { main: [] }; (c[a].main[out] ??= []).push({ node: b, type: 'main', index: 0 }); return c;
}, {});
const connections = link(
  ['Telegram Trigger', 'Parse Perintah'], ['Parse Perintah', 'Perintah Valid?'],
  ['Perintah Valid?', 'Ambil Quote LI.FI', 0], ['Perintah Valid?', 'Balas Error', 1],
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
