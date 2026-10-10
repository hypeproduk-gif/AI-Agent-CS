#!/usr/bin/env node
// Agent harian: ambil produk dari Shopee Affiliate Open API, simpan snapshot, ranking tren 1d/3d/7d.
// Env: SHOPEE_APP_ID, SHOPEE_SECRET, (opsional) KEYWORDS, PAGES, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ANTHROPIC_API_KEY
// Pakai: node index.js            → fetch + simpan + laporan
//        node index.js --report   → laporan dari snapshot yang ada saja

const fs = require('fs');
const path = require('path');
const { signHeader, toRow, report, toText } = require('./lib');

const DATA = path.join(__dirname, 'data');
const ENDPOINT = 'https://open-api.affiliate.shopee.co.id/graphql';
const env = process.env;

async function gql(query) {
  const payload = JSON.stringify({ query });
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: signHeader(env.SHOPEE_APP_ID, env.SHOPEE_SECRET, payload) },
    body: payload,
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// sortType 2 = terlaris, 5 = komisi tertinggi. Gabung keduanya + keyword niche (KEYWORDS="skincare,dapur").
async function fetchProducts() {
  const pages = Number(env.PAGES || 3);
  const keywords = (env.KEYWORDS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const queries = [];
  for (const sortType of [2, 5]) for (const kw of keywords.length ? keywords : [null]) queries.push({ sortType, kw });

  const items = new Map();
  for (const { sortType, kw } of queries) {
    for (let page = 1; page <= pages; page++) {
      const args = [`sortType: ${sortType}`, `page: ${page}`, 'limit: 50', kw ? `keyword: ${JSON.stringify(kw)}` : ''].filter(Boolean).join(', ');
      const data = await gql(`{ productOfferV2(${args}) { nodes { itemId productName shopName priceMin sales commissionRate ratingStar imageUrl productLink offerLink } pageInfo { hasNextPage } } }`);
      for (const n of data.productOfferV2.nodes) items.set(String(n.itemId), toRow(n));
      if (!data.productOfferV2.pageInfo.hasNextPage) break;
    }
  }
  return [...items.values()];
}

function loadSnapshots() {
  return fs.readdirSync(DATA).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort()
    .slice(-30).map((f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')));
}

// Opsional: Claude memberi angle konten untuk top 5 periode 7d (atau periode terpanjang yang ada).
async function contentIdeas(rep) {
  if (!env.ANTHROPIC_API_KEY) return '';
  const rows = Object.values(rep.periods).pop().slice(0, 5).map((r) => `- ${r.name} (Rp${r.price}, ${r.reason})`).join('\n');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: env.CLAUDE_MODEL || 'claude-haiku-4-5',
      max_tokens: 1200,
      messages: [{ role: 'user', content: `Kamu strategist konten affiliate Shopee (TikTok/Reels/Shopee Video). Untuk tiap produk berikut beri 1 baris hook + 1 baris angle konten, singkat, bahasa Indonesia santai:\n${rows}` }],
    }),
  });
  const json = await res.json();
  return json.content ? `\n\n💡 Ide konten (top 5):\n${json.content[0].text}` : '';
}

async function telegram(text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  for (let i = 0; i < text.length; i += 4000) {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: text.slice(i, i + 4000), disable_web_page_preview: true }),
    });
  }
}

(async () => {
  fs.mkdirSync(DATA, { recursive: true });
  if (!process.argv.includes('--report')) {
    const date = new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10); // WIB
    const items = await fetchProducts();
    fs.writeFileSync(path.join(DATA, `${date}.json`), JSON.stringify({ date, items }));
    console.error(`snapshot ${date}: ${items.length} produk`);
  }
  const snaps = loadSnapshots();
  if (!snaps.length) throw new Error('Belum ada snapshot di data/');
  const rep = report(snaps, [1, 3, 7], Number(env.TOP || 10));
  fs.writeFileSync(path.join(DATA, 'latest-report.json'), JSON.stringify(rep, null, 2));
  const text = toText(rep) + (await contentIdeas(rep));
  console.log(text);
  await telegram(text);
})().catch((e) => { console.error(e); process.exit(1); });
