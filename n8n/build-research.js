// Bangun workflow riset produk mingguan → product-research.workflow.json
// Pakai: node n8n/build-research.js

const fs = require('fs');
const path = require('path');

const research = fs.readFileSync(path.join(__dirname, 'src', 'product-research.js'), 'utf8');

// Actor Apify (ganti kalau pakai actor lain; sesuaikan input-nya juga).
// Grup Telegram "RISET PRODUK" (terpisah dari grup closing & rekap).
const RISET_CHAT = '-5440720207';

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
    input: { startUrls: [{ url: \`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=\${RESEARCH.country}&q=\${q}&search_type=keyword_unordered\` }], resultsLimit: 60, activeStatus: 'active' } } });
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
    chatId: RISET_CHAT,
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

const queryCode = `${fs.readFileSync(path.join(__dirname, 'src', 'ad-to-lp.js'), 'utf8')}
const f = $json;
let brief;
if (f.message) {
  if (!ALLOWED_CHATS.includes(String(f.message.chat.id))) return [];
  brief = parseRisetCommand(f.message.text);
  if (!brief) return [];
} else {
  brief = { limit: DEFAULT_LIMIT, keyword: f.keyword, product: f.produk || '', price: f.harga || '', wa: f.whatsapp || DEFAULT_WA, code: f.kode || 'LP' };
}
const target = adLibraryUrl(brief);
brief.mode = target.mode;
return [{ json: { brief, actor: ${JSON.stringify(ACTORS.ads)},
  input: { startUrls: [{ url: target.url }], resultsLimit: brief.limit, activeStatus: 'active' } } }];`;

const winnerCode = `${adToLp}
const brief = $('Siapkan Query').first().json.brief;
const items = $input.all().map((i) => i.json).filter((j) => !j.error);
const picked = pickWinners(items, Date.now(), brief.mode === 'page' ? 30 : LIST_LIMIT);
const raw = $input.all().map((i) => i.json);
let text;
if (picked.winners.length) {
  text = winnerList(picked, brief);
  // LP banyak kosong → kirim nama field supaya parser bisa disesuaikan.
  const noLp = picked.winners.filter((w) => !w.lpUrl).length;
  if (noLp > picked.winners.length / 2 && items[0]) {
    const snap = items[0].snapshot || {};
    const card = (snap.cards || [])[0] || {};
    text += '\\n\\n🔧 Diagnosa (kirim ke Claude): field=' + Object.keys(items[0]).slice(0, 30).join(',') +
      ' | snapshot=' + Object.keys(snap).slice(0, 40).join(',') + ' | card=' + Object.keys(card).join(',');
  }
}
else if (!items.length) {
  const err = raw.find((j) => j.error);
  const msg = err ? JSON.stringify(err.error).slice(0, 300) : '';
  const hint = /timeout|408|ETIMEDOUT|ECONNABORTED/i.test(msg)
    ? 'Apify terlalu lama (antre karena riset lain masih jalan). Tunggu 2 menit lalu kirim ulang perintahnya.'
    : /402|403|credit|usage|limit/i.test(msg) ? 'Saldo/kuota Apify habis. Cek Billing di apify.com.'
    : /401|token|auth/i.test(msg) ? 'Token Apify salah. Cek credential Apify di n8n.'
    : 'Coba sinonim lain atau kirim ulang perintahnya.';
  text = '⚠️ Riset "' + brief.keyword + '" belum dapat hasil.\\n' + hint + (msg ? '\\n(Detail: ' + msg + ')' : '');
} else {
  // Ada data tapi tidak terbaca → kirim nama field untuk diagnosa.
  const sample = items[0];
  text = 'Apify mengembalikan ' + items.length + ' data untuk "' + brief.keyword + '" tapi tidak terbaca.\\n' +
    'Field: ' + Object.keys(sample).slice(0, 40).join(', ') + '\\n' +
    'snapshot: ' + Object.keys(sample.snapshot || {}).slice(0, 40).join(', ') + '\\n' +
    'Contoh: ' + JSON.stringify(sample).slice(0, 1200);
}
// Telegram dikirim dengan parse_mode HTML → escape & < > supaya link LP tidak bikin 'Bad request'.
const escHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
return chunkText(text, 3500).map((t) => ({ json: { text: escHtml(t) } }));`;


id = 0;
const telegram = { credentials: { telegramApi: { id: 'GvWCKSvWULLSOTrP', name: 'Telegram account' } } };
const lpNodes = [
  node('Brief Produk', 'n8n-nodes-base.formTrigger', 2.2, 0, {
    formTitle: 'Riset Ad Library → LP & Konten',
    formDescription: 'Isi keyword produk. Daftar iklan winning (URL iklan, URL LP, nama produk) dikirim ke Telegram.',
    formFields: { values: [
      { fieldLabel: 'keyword', placeholder: 'pengusir tikus', requiredField: true },
    ] },
    options: {},
  }, { more: { webhookId: 'aics-ad-to-lp' } }),
  node('Perintah Telegram', 'n8n-nodes-base.telegramTrigger', 1.2, 0, { updates: ['message'], additionalFields: {} },
    { y: 200, more: { webhookId: 'aics-riset-telegram', ...telegram } }),
  node('Siapkan Query', 'n8n-nodes-base.code', 2, 250, { jsCode: queryCode }),
  node('Konfirmasi', 'n8n-nodes-base.telegram', 1.2, 500, {
    chatId: RISET_CHAT,
    text: '=⏳ Riset Ad Library "{{ $json.brief.keyword }}" ({{ $json.brief.limit }} iklan, {{ $json.brief.fresh ? "mulai tayang kurang dari 30 hari" : "aktif ≥30 hari" }}) dimulai… hasil ±2–3 menit lagi.',
    additionalFields: { appendAttribution: false, parse_mode: 'HTML' },
  }, { y: 200, more: telegram }),
  node('Ad Library (Apify)', 'n8n-nodes-base.httpRequest', 4.2, 500, {
    method: 'POST',
    url: '=https://api.apify.com/v2/acts/{{ $json.actor }}/run-sync-get-dataset-items?timeout=280',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpHeaderAuth',
    sendBody: true,
    specifyBody: 'json',
    jsonBody: '={{ JSON.stringify($json.input) }}',
    options: { timeout: 300000 },
  }, { more: { retryOnFail: true, maxTries: 2, waitBetweenTries: 5000, alwaysOutputData: true, onError: 'continueRegularOutput' } }),
  node('Pilih Winner', 'n8n-nodes-base.code', 2, 750, { jsCode: winnerCode }, { more: { alwaysOutputData: true } }),
  node('Kirim Konten', 'n8n-nodes-base.telegram', 1.2, 1000, {
    chatId: RISET_CHAT,
    text: '={{ $json.text }}',
    additionalFields: { appendAttribution: false, disable_web_page_preview: true, parse_mode: 'HTML' },
  }, { y: 200, more: telegram }),
];

const lpWf = {
  name: 'Riset Iklan Winning (Ad Library)',
  nodes: lpNodes,
  connections: {
    'Brief Produk': link('Siapkan Query'),
    'Perintah Telegram': link('Siapkan Query'),
    // Konfirmasi dulu supaya pesan "dimulai" terkirim sebelum hasil.
    'Siapkan Query': { main: [[{ node: 'Konfirmasi', type: 'main', index: 0 }, { node: 'Ad Library (Apify)', type: 'main', index: 0 }]] },
    'Ad Library (Apify)': link('Pilih Winner'),
    'Pilih Winner': link('Kirim Konten'),
  },
  settings: { executionOrder: 'v1', timezone: 'Asia/Jakarta' },
};
fs.writeFileSync(path.join(__dirname, 'ad-to-lp.workflow.json'), JSON.stringify(lpWf, null, 2) + '\n');
console.log('wrote ad-to-lp.workflow.json');
