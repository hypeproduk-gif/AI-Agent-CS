// Riset produk: gabungkan data Shopee, TikTok Creative Center, dan Meta Ad Library
// per keyword, lalu beri skor potensi convert di iklan Meta.
// Data mentah datang dari actor Apify; nama field tiap actor beda-beda, jadi dinormalisasi dulu.

const RESEARCH = {
  keywords: [
    'pembersih kerak', 'penghilang noda sofa', 'coating motor', 'bantal ortopedi',
    'alat pijat leher', 'serum ketiak', 'busy board', 'sisir bulu kucing',
    'alat potong sayur', 'celana korset',
  ],
  country: 'ID',
  priceMin: 79000,
  priceMax: 249000,
  provenDays: 30, // iklan aktif ≥ 30 hari = kemungkinan profit
  saturatedPages: 40, // lebih dari ini advertiser = pasar padat
  topN: 10,
};

const pick = (o, keys) => {
  for (const k of keys) {
    const v = k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
};

function toNumber(v) {
  if (typeof v === 'number') return v;
  if (v == null) return 0;
  let s = String(v).toLowerCase().replace(/rp|\s|\+/g, '');
  let mult = 1;
  if (/rb$|k$/.test(s)) { mult = 1e3; s = s.replace(/rb$|k$/, ''); }
  else if (/jt$|m$/.test(s)) { mult = 1e6; s = s.replace(/jt$|m$/, ''); }
  // "10,5" (desimal ID) vs "10.500" (ribuan ID)
  if (mult > 1) s = s.replace(',', '.');
  else s = s.replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n * mult : 0;
}

function toTime(v) {
  if (v == null || v === '') return NaN;
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v;
  if (/^\d+$/.test(String(v))) return toTime(Number(v));
  return Date.parse(v);
}

function normShopee(it) {
  let price = toNumber(pick(it, ['price', 'price_min', 'item_basic.price', 'priceMin', 'current_price']));
  if (price > 1e8) price = price / 1e5; // API Shopee menyimpan harga ×100000
  return {
    name: String(pick(it, ['name', 'title', 'item_basic.name']) || ''),
    price,
    soldMonth: toNumber(pick(it, ['sold', 'monthly_sold', 'item_basic.sold', 'soldCount'])),
    soldTotal: toNumber(pick(it, ['historical_sold', 'item_basic.historical_sold', 'totalSold', 'sold_text'])),
    shop: String(pick(it, ['shopid', 'shop_id', 'item_basic.shopid', 'shopName', 'shop_name']) || ''),
    url: pick(it, ['url', 'link', 'productUrl']) || '',
  };
}

function normTikTok(it) {
  return {
    name: String(pick(it, ['name', 'product_name', 'keyword', 'title', 'first_ecom_category.value']) || ''),
    rank: toNumber(pick(it, ['rank', 'ranking'])) || 999,
    growth: toNumber(pick(it, ['post_change', 'popularity_change', 'growth', 'change'])),
    ctr: toNumber(pick(it, ['ctr'])),
    cvr: toNumber(pick(it, ['cvr'])),
  };
}

function normAd(it) {
  const start = toTime(pick(it, ['ad_delivery_start_time', 'start_date', 'startDate', 'snapshot.start_date']));
  const stop = toTime(pick(it, ['ad_delivery_stop_time', 'end_date', 'endDate']));
  return {
    page: String(pick(it, ['page_name', 'pageName', 'snapshot.page_name', 'page_id', 'pageId']) || ''),
    start,
    stop,
    active: pick(it, ['is_active', 'isActive']) !== false,
    title: String(pick(it, ['ad_creative_link_title', 'snapshot.title', 'snapshot.body.text', 'title']) || ''),
    url: pick(it, ['ad_snapshot_url', 'url', 'adLibraryUrl']) ||
      (pick(it, ['id', 'ad_archive_id', 'adArchiveID']) ? `https://www.facebook.com/ads/library/?id=${pick(it, ['id', 'ad_archive_id', 'adArchiveID'])}` : ''),
  };
}

const median = (a) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const matches = (text, kw) => {
  const t = text.toLowerCase();
  return kw.toLowerCase().split(/\s+/).filter((w) => w.length > 2).every((w) => t.includes(w));
};

// raw: { shopee: {kw: items[]}, tiktok: items[], ads: {kw: items[]} }
function scoreKeyword(kw, raw, cfg = RESEARCH, now = Date.now()) {
  const shopee = (raw.shopee[kw] || []).map(normShopee).filter((p) => p.price > 0);
  const ads = (raw.ads[kw] || []).map(normAd);
  const tiktok = (raw.tiktok || []).map(normTikTok).filter((t) => matches(t.name, kw));

  const soldMonth = shopee.reduce((a, p) => a + (p.soldMonth || 0), 0);
  const price = median(shopee.map((p) => p.price));
  const byShop = {};
  for (const p of shopee) byShop[p.shop] = (byShop[p.shop] || 0) + (p.soldMonth || p.soldTotal || 0);
  const shopSales = Object.values(byShop).sort((a, b) => b - a);
  const shopTotal = shopSales.reduce((a, b) => a + b, 0);
  const topShare = shopTotal ? (shopSales[0] + (shopSales[1] || 0)) / shopTotal : 0;

  const ageDays = (a) => ((Number.isFinite(a.stop) ? a.stop : now) - a.start) / 864e5;
  const activeAds = ads.filter((a) => a.active);
  const proven = activeAds.filter((a) => Number.isFinite(a.start) && ageDays(a) >= cfg.provenDays);
  const pages = new Set(activeAds.map((a) => a.page).filter(Boolean)).size;

  // Skor 0–100
  const demand = Math.min(30, Math.log10(soldMonth + 1) * 7.5); // 10rb/bln ≈ 30
  const trend = tiktok.length ? Math.min(20, 10 + Math.max(0, tiktok[0].growth) / 10 + (tiktok[0].rank <= 20 ? 5 : 0)) : 0;
  const proof = Math.min(25, proven.length * 5);
  const priceFit = price >= cfg.priceMin && price <= cfg.priceMax ? 15 : price > 0 && price < cfg.priceMin ? 5 : 8;
  const openMarket = topShare < 0.6 ? 10 : topShare < 0.8 ? 5 : 0;
  const saturation = pages > cfg.saturatedPages ? -10 : 0;
  const score = Math.round(Math.max(0, demand + trend + proof + priceFit + openMarket + saturation));

  const notes = [];
  if (!shopee.length) notes.push('data Shopee kosong');
  if (proven.length) notes.push(`${proven.length} iklan jalan ≥${cfg.provenDays} hari`);
  if (pages > cfg.saturatedPages) notes.push('advertiser padat');
  if (price && price < cfg.priceMin) notes.push('harga terlalu murah untuk ads');
  if (topShare >= 0.8) notes.push('dikuasai 1–2 toko');
  if (tiktok.length) notes.push(`TikTok rank #${tiktok[0].rank}`);

  return {
    keyword: kw, score, soldMonth: Math.round(soldMonth), priceMedian: Math.round(price),
    topShopShare: Math.round(topShare * 100), activeAds: activeAds.length, provenAds: proven.length,
    advertisers: pages, tiktokHits: tiktok.length, notes: notes.join('; '),
    provenExamples: proven.sort((a, b) => a.start - b.start).slice(0, 3).map((a) => a.url),
    topProduct: shopee.sort((a, b) => b.soldMonth - a.soldMonth)[0]?.name || '',
  };
}

function productResearch(raw, cfg = RESEARCH, now = Date.now()) {
  return cfg.keywords.map((kw) => scoreKeyword(kw, raw, cfg, now)).sort((a, b) => b.score - a.score);
}

function researchReport(rows, cfg = RESEARCH) {
  const idr = (n) => 'Rp' + Math.round(n || 0).toLocaleString('id-ID');
  const lines = ['🔎 Riset Produk Mingguan (Shopee × TikTok × Meta Ads)', ''];
  rows.slice(0, cfg.topN).forEach((r, i) => {
    lines.push(`${i + 1}. ${r.keyword} — skor ${r.score}`);
    lines.push(`   Shopee: ${r.soldMonth.toLocaleString('id-ID')} terjual/bln · median ${idr(r.priceMedian)} · top2 toko ${r.topShopShare}%`);
    lines.push(`   Meta: ${r.activeAds} iklan aktif · ${r.provenAds} ≥${cfg.provenDays} hari · ${r.advertisers} advertiser`);
    if (r.notes) lines.push(`   ${r.notes}`);
    for (const u of r.provenExamples) lines.push(`   ${u}`);
  });
  return lines.join('\n');
}
