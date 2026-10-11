// Bikin n8n/shopee-trending.workflow.json (mode bookmarklet) + bookmarklet siap pasang.
// Pakai: node shopee-trending/build-n8n.js https://n8n-kamu.com/webhook/shopee-trending

const fs = require('fs');
const path = require('path');

const webhook = process.argv[2] || 'https://GANTI-N8N-KAMU/webhook/shopee-trending';
const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8').replace(/module\.exports[\s\S]*$/, '');
const MODEL = 'claude-haiku-4-5-20251001';
const anthropic = { httpHeaderAuth: { id: 'Rg3kLQlwRT919UB4', name: 'Anthropic API' } };
const claudeNode = (id, name, x, body) => ({
  parameters: {
    method: 'POST', url: 'https://api.anthropic.com/v1/messages', authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
    sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
    sendBody: true, specifyBody: 'json', jsonBody: body, options: { response: { response: { neverError: true } }, timeout: 120000 },
  },
  type: 'n8n-nodes-base.httpRequest', typeVersion: 4.5, position: [x, 0], name, id, retryOnFail: true, maxTries: 2, credentials: anthropic,
});

const prepare = `// Ubah kartu produk mentah dari bookmarklet jadi permintaan ekstraksi ke Claude.
let body = $input.first().json.body;
if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
const cards = (body && body.cards) || [];
if (!cards.length) return [];
const list = cards.map((c, i) => \`#\${i}\\nlink: \${c.h}\\n\${c.t}\`).join('\\n---\\n');
const requestBody = {
  model: '${MODEL}',
  max_tokens: 16000,
  messages: [{ role: 'user', content:
    'Ini kartu produk dari dasbor Shopee Affiliate. Ubah tiap kartu jadi JSON. Balas HANYA array JSON tanpa teks lain: ' +
    '[{"i":nomor,"name":"nama produk","shop":"nama toko atau kosong","price":harga_rupiah_angka,"sales":total_terjual_angka,' +
    '"rate":persen_komisi_desimal_mis_0.1,"rating":angka_atau_0}]. ' +
    'Konversi "1,2RB+" jadi 1200, "10RB" jadi 10000, "1JT" jadi 1000000. Kalau ada rentang harga pakai yang terendah.\\n\\n' + list }],
};
return [{ json: { requestBody, cards } }];`;

const rank = `// Simpan snapshot hari ini (static data workflow, 30 hari terakhir) lalu ranking 1d/3d/7d.
${lib}
const { cards } = $('Siapkan Ekstraksi').first().json;
const res = $input.first().json;
const raw = (res.content && res.content[0] && res.content[0].text) || '[]';
let parsed = [];
try { parsed = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1)); } catch (e) {}
const items = parsed.map((p) => {
  const c = cards[p.i] || {};
  const m = (c.h || '').match(/-i\\.(\\d+)\\.(\\d+)|product\\/(\\d+)\\/(\\d+)|itemId=(\\d+)/);
  const id = m ? (m[2] || m[4] || m[5]) : String(p.name || '').toLowerCase().slice(0, 80);
  return { id, name: p.name, shop: p.shop || '', price: Number(p.price) || 0, sales: Number(p.sales) || 0,
    rate: Number(p.rate) > 1 ? Number(p.rate) / 100 : Number(p.rate) || 0, rating: Number(p.rating) || 0, link: c.h, image: c.img };
}).filter((r) => r.id && r.name);
if (!items.length) return [{ json: { text: '⚠️ Shopee Trending: produk gagal dibaca dari halaman. Coba scroll daftar produk dulu lalu klik bookmark lagi.', ideas: null } }];

const store = $getWorkflowStaticData('global');
const date = new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
const snaps = (store.snapshots || []).filter((s) => s.date !== date);
const prev = (store.snapshots || []).find((s) => s.date === date);
const merged = new Map((prev ? prev.items : []).map((r) => [r.id, r]));
for (const r of items) merged.set(r.id, r); // klik berkali-kali di hari yang sama = digabung
snaps.push({ date, items: [...merged.values()] });
store.snapshots = snaps.slice(-30);

const rep = report(store.snapshots, [1, 3, 7], 10);
const best = Object.values(rep.periods).pop().slice(0, 5).map((r) => \`- \${r.name} (Rp\${r.price}, \${r.reason})\`).join('\\n');
const ideas = {
  model: '${MODEL}', max_tokens: 1200,
  messages: [{ role: 'user', content: 'Kamu strategist konten affiliate Shopee (TikTok/Reels/Shopee Video). Untuk tiap produk berikut beri 1 baris hook + 1 baris angle konten, singkat, bahasa Indonesia santai, tanpa markdown:\\n' + best }],
};
return [{ json: { text: toText(rep) + \`\\n\\n(\${merged.size} produk tersimpan hari ini, riwayat \${store.snapshots.length} hari)\`, ideas } }];`;

const finish = `const base = $('Simpan & Ranking').first().json.text;
const r = $input.first().json;
const ideas = r.content && r.content[0] ? '\\n\\n💡 Ide konten (top 5):\\n' + r.content[0].text : '';
const text = base + ideas;
const parts = [];
for (let i = 0; i < text.length; i += 4000) parts.push({ json: { text: text.slice(i, i + 4000) } });
return parts;`;

const code = (id, name, x, jsCode) => ({ parameters: { jsCode }, type: 'n8n-nodes-base.code', typeVersion: 2, position: [x, 0], name, id });
const wf = {
  name: 'Shopee Trending (Bookmarklet)',
  nodes: [
    { parameters: { httpMethod: 'POST', path: 'shopee-trending', responseMode: 'onReceived', options: { allowedOrigins: '*' } }, type: 'n8n-nodes-base.webhook', typeVersion: 2.1, position: [0, 0], name: 'Terima Halaman', id: 'shp-01', webhookId: 'shopee-trending' },
    code('shp-02', 'Siapkan Ekstraksi', 220, prepare),
    claudeNode('shp-03', 'Claude Ekstraksi', 440, '={{ JSON.stringify($json.requestBody) }}'),
    code('shp-04', 'Simpan & Ranking', 660, rank),
    claudeNode('shp-05', 'Claude Ide Konten', 880, '={{ JSON.stringify($json.ideas) }}'),
    code('shp-06', 'Gabung Laporan', 1100, finish),
    { parameters: { chatId: '-5439732568', text: '={{ $json.text }}', additionalFields: { appendAttribution: false, disable_web_page_preview: true } }, type: 'n8n-nodes-base.telegram', typeVersion: 1.2, position: [1320, 0], name: 'Kirim Telegram', id: 'shp-07', credentials: { telegramApi: { id: 'GvWCKSvWULLSOTrP', name: 'Telegram account' } } },
  ],
  connections: {},
  settings: { executionOrder: 'v1' },
};
if (require.main === module) {
const order = wf.nodes.map((n) => n.name);
for (let i = 0; i < order.length - 1; i++) wf.connections[order[i]] = { main: [[{ node: order[i + 1], type: 'main', index: 0 }]] };
fs.writeFileSync(path.join(__dirname, '..', 'n8n', 'shopee-trending.workflow.json'), JSON.stringify(wf, null, 2) + '\n');

const bm = fs.readFileSync(path.join(__dirname, 'bookmarklet.js'), 'utf8')
  .replace(/^\/\/.*$/gm, '').replace('__WEBHOOK__', webhook).replace(/\s*\n\s*/g, ' ').trim();
const link = 'javascript:' + encodeURIComponent(bm);
fs.writeFileSync(path.join(__dirname, 'bookmarklet.txt'), link + '\n');
console.log('ok - n8n/shopee-trending.workflow.json + shopee-trending/bookmarklet.txt');
}
module.exports = { prepare, rank, finish };
