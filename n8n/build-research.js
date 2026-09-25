// Bangun workflow riset produk mingguan → product-research.workflow.json
// Pakai: node n8n/build-research.js

const fs = require('fs');
const path = require('path');

const research = fs.readFileSync(path.join(__dirname, 'src', 'product-research.js'), 'utf8');

// Actor Apify (ganti kalau pakai actor lain; sesuaikan input-nya juga).
const ACTORS = {
  shopee: 'REPLACE_WITH_SHOPEE_ACTOR', // cari "Shopee" di apify.com/store, pilih yang support shopee.co.id
  tiktok: 'REPLACE_WITH_TIKTOK_CC_ACTOR', // cari "TikTok Creative Center top products"
  ads: 'apify~facebook-ads-scraper',
};

const buildQueries = `${research}
const ACTORS = ${JSON.stringify(ACTORS, null, 2)};
const out = [];
for (const kw of RESEARCH.keywords) {
  out.push({ json: { source: 'shopee', kw, actor: ACTORS.shopee,
    input: { keyword: kw, country: 'id', sortBy: 'sales', maxItems: 40 } } });
  const q = encodeURIComponent(kw);
  out.push({ json: { source: 'ads', kw, actor: ACTORS.ads,
    input: { startUrls: [{ url: \`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=\${RESEARCH.country}&q=\${q}&search_type=keyword_unordered\` }], resultsLimit: 100, activeStatus: 'active' } } });
}
out.push({ json: { source: 'tiktok', kw: '', actor: ACTORS.tiktok,
  input: { country: RESEARCH.country, period: 7, maxItems: 200 } } });
return out;`;

const scoreCode = `${research}
const queries = $('Susun Query').all();
const results = $input.all();
const raw = { shopee: {}, ads: {}, tiktok: [] };
const failed = [];
results.forEach((r, i) => {
  const q = queries[i].json;
  const body = r.json.body ?? r.json;
  const items = Array.isArray(body) ? body : [];
  if (r.json.error || !Array.isArray(body)) failed.push(q.source + (q.kw ? ':' + q.kw : ''));
  if (q.source === 'tiktok') raw.tiktok = items;
  else raw[q.source][q.kw] = items;
});
const rows = productResearch(raw);
let text = researchReport(rows);
if (failed.length) text += '\\n\\n⚠️ Gagal ambil: ' + failed.join(', ');
return [{ json: { text, rows } }];`;

let id = 0;
const node = (name, type, typeVersion, x, parameters, extra = {}) =>
  ({ parameters, type, typeVersion, position: [x, extra.y || 0], name, id: `aics-research-${++id}`, ...extra.more });

const nodes = [
  node('Tiap Senin 07:00', 'n8n-nodes-base.scheduleTrigger', 1.2, 0,
    { rule: { interval: [{ field: 'cronExpression', expression: '0 7 * * 1' }] } }),
  node('Tes Sekarang', 'n8n-nodes-base.manualTrigger', 1, 0, {}, { y: 200 }),
  node('Susun Query', 'n8n-nodes-base.code', 2, 250, { jsCode: buildQueries }),
  node('Apify Run', 'n8n-nodes-base.httpRequest', 4.2, 500, {
    method: 'POST',
    url: '=https://api.apify.com/v2/acts/{{ $json.actor }}/run-sync-get-dataset-items?timeout=280',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendBody: true,
    specifyBody: 'json',
    jsonBody: '={{ JSON.stringify($json.input) }}',
    options: {
      timeout: 300000,
      batching: { batch: { batchSize: 3, batchInterval: 2000 } },
      response: { response: { fullResponse: true } },
    },
  }, { more: { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2 } }),
  node('Skor Produk', 'n8n-nodes-base.code', 2, 750, { jsCode: scoreCode }),
  node('Kirim Laporan', 'n8n-nodes-base.telegram', 1.2, 1000, {
    chatId: '-5439732568',
    text: '={{ $json.text }}',
    additionalFields: { appendAttribution: false, disable_web_page_preview: true },
  }, { more: { credentials: { telegramApi: { id: 'GvWCKSvWULLSOTrP', name: 'Telegram account' } } } }),
];

const link = (to) => ({ main: [[{ node: to, type: 'main', index: 0 }]] });
const wf = {
  name: 'Riset Produk Mingguan',
  nodes,
  connections: {
    'Tiap Senin 07:00': link('Susun Query'),
    'Tes Sekarang': link('Susun Query'),
    'Susun Query': link('Apify Run'),
    'Apify Run': link('Skor Produk'),
    'Skor Produk': link('Kirim Laporan'),
  },
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
};

fs.writeFileSync(path.join(__dirname, 'product-research.workflow.json'), JSON.stringify(wf, null, 2) + '\n');
console.log('wrote product-research.workflow.json');

// ---------- Workflow 2: Ad Library → LP & konten ----------
const adToLp = research + '\n' + fs.readFileSync(path.join(__dirname, 'src', 'ad-to-lp.js'), 'utf8');

const queryCode = `const f = $json;
const brief = { keyword: f.keyword, product: f.produk || '', price: f.harga || '', wa: f.whatsapp, code: f.kode || 'LP' };
const q = encodeURIComponent(brief.keyword);
return [{ json: { brief, actor: ${JSON.stringify(ACTORS.ads)},
  input: { startUrls: [{ url: \`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ID&q=\${q}&search_type=keyword_unordered\` }], resultsLimit: 200, activeStatus: 'active' } } }];`;

const winnerCode = `${adToLp}
const brief = $('Siapkan Query').first().json.brief;
const items = $input.all().map((i) => i.json).filter((j) => !j.error);
const picked = pickWinners(items);
if (!picked.winners.length) throw new Error('Tidak ada iklan untuk keyword: ' + brief.keyword);
return [{ json: { brief, picked, requestBody: lpRequest(brief, picked) } }];`;

const buildLpCode = `${adToLp}
const { brief, picked } = $('Pilih Winner').first().json;
const copy = parseLpReply($json);
const html = renderLp(copy, brief);
const slug = String(brief.code || brief.keyword).toLowerCase().replace(/[^a-z0-9]+/g, '-');
return [{
  json: { chunks: chunkText(contentReport(copy, brief, picked)), copy, fileName: 'lp-' + slug + '.html' },
  binary: { data: { data: Buffer.from(html).toString('base64'), mimeType: 'text/html', fileName: 'lp-' + slug + '.html' } },
}];`;

const splitCode = `return $json.chunks.map((text) => ({ json: { text } }));`;

id = 0;
const telegram = { credentials: { telegramApi: { id: 'GvWCKSvWULLSOTrP', name: 'Telegram account' } } };
const lpNodes = [
  node('Brief Produk', 'n8n-nodes-base.formTrigger', 2.2, 0, {
    formTitle: 'Riset Ad Library → LP & Konten',
    formDescription: 'Isi keyword produk. Hasil (LP + 5 naskah iklan) dikirim ke Telegram dalam ±3 menit.',
    formFields: { values: [
      { fieldLabel: 'keyword', placeholder: 'pengusir tikus', requiredField: true },
      { fieldLabel: 'produk', placeholder: 'Nama produkmu (opsional)' },
      { fieldLabel: 'harga', placeholder: 'Rp99.000 / 3 pcs' },
      { fieldLabel: 'whatsapp', placeholder: '6285xxxx', requiredField: true },
      { fieldLabel: 'kode', placeholder: 'Kode ref LP, mis. PT' },
    ] },
    options: {},
  }, { more: { webhookId: 'aics-ad-to-lp' } }),
  node('Siapkan Query', 'n8n-nodes-base.code', 2, 250, { jsCode: queryCode }),
  node('Ad Library (Apify)', 'n8n-nodes-base.httpRequest', 4.2, 500, {
    method: 'POST',
    url: '=https://api.apify.com/v2/acts/{{ $json.actor }}/run-sync-get-dataset-items?timeout=280',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendBody: true,
    specifyBody: 'json',
    jsonBody: '={{ JSON.stringify($json.input) }}',
    options: { timeout: 300000 },
  }, { more: { retryOnFail: true, maxTries: 2 } }),
  node('Pilih Winner', 'n8n-nodes-base.code', 2, 750, { jsCode: winnerCode }),
  node('Claude Copywriter', 'n8n-nodes-base.httpRequest', 4.2, 1000, {
    method: 'POST',
    url: 'https://api.anthropic.com/v1/messages',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
    sendBody: true,
    specifyBody: 'json',
    jsonBody: '={{ JSON.stringify($json.requestBody) }}',
    options: { timeout: 240000 },
  }, { more: { retryOnFail: true, maxTries: 2,
    credentials: { httpHeaderAuth: { id: 'Rg3kLQlwRT919UB4', name: 'Anthropic API' } } } }),
  node('Susun LP & Konten', 'n8n-nodes-base.code', 2, 1250, { jsCode: buildLpCode }),
  node('Kirim File LP', 'n8n-nodes-base.telegram', 1.2, 1500, {
    operation: 'sendDocument',
    chatId: '-5439732568',
    binaryData: true,
    binaryPropertyName: 'data',
    additionalFields: { caption: '=LP siap edit: {{ $json.fileName }} — ganti PIXEL_ID & placeholder foto/testimoni, upload bareng wa-redirect.js' },
  }, { more: telegram }),
  node('Pecah Pesan', 'n8n-nodes-base.code', 2, 1500, { jsCode: splitCode }, { y: 200 }),
  node('Kirim Konten', 'n8n-nodes-base.telegram', 1.2, 1750, {
    chatId: '-5439732568',
    text: '={{ $json.text }}',
    additionalFields: { appendAttribution: false, disable_web_page_preview: true },
  }, { y: 200, more: telegram }),
];

const lpWf = {
  name: 'Ad Library → LP & Konten',
  nodes: lpNodes,
  connections: {
    'Brief Produk': link('Siapkan Query'),
    'Siapkan Query': link('Ad Library (Apify)'),
    'Ad Library (Apify)': link('Pilih Winner'),
    'Pilih Winner': link('Claude Copywriter'),
    'Claude Copywriter': link('Susun LP & Konten'),
    'Susun LP & Konten': { main: [[{ node: 'Kirim File LP', type: 'main', index: 0 }, { node: 'Pecah Pesan', type: 'main', index: 0 }]] },
    'Pecah Pesan': link('Kirim Konten'),
  },
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
};
fs.writeFileSync(path.join(__dirname, 'ad-to-lp.workflow.json'), JSON.stringify(lpWf, null, 2) + '\n');
console.log('wrote ad-to-lp.workflow.json');
