// Bangun workflow riset produk mingguan → product-research.workflow.json
// Pakai: node n8n/build-research.js

const fs = require('fs');
const path = require('path');

const research = fs.readFileSync(path.join(__dirname, 'src', 'product-research.js'), 'utf8');

// Actor Apify (ganti kalau pakai actor lain; sesuaikan input-nya juga).
const ACTORS = {
  shopee: 'REPLACE_WITH_SHOPEE_ACTOR', // cari "Shopee" di apify.com/store, pilih yang support shopee.co.id
  tiktok: 'REPLACE_WITH_TIKTOK_CC_ACTOR', // cari "TikTok Creative Center top products"
  ads: 'curious_coder~facebook-ads-library-scraper',
};

const buildQueries = `${research}
const ACTORS = ${JSON.stringify(ACTORS, null, 2)};
const out = [];
for (const kw of RESEARCH.keywords) {
  out.push({ json: { source: 'shopee', kw, actor: ACTORS.shopee,
    input: { keyword: kw, country: 'id', sortBy: 'sales', maxItems: 40 } } });
  const q = encodeURIComponent(kw);
  out.push({ json: { source: 'ads', kw, actor: ACTORS.ads,
    input: { urls: [{ url: \`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=\${RESEARCH.country}&q=\${q}&search_type=keyword_unordered\` }], count: 100 } } });
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
