// Logika murni: tanda tangan API, hitung tren dari snapshot, skor "worth it" untuk konten affiliate.

// Shopee Affiliate Open API: Signature = SHA256(appId + timestamp + payload + secret)
function signHeader(appId, secret, payload, ts = Math.floor(Date.now() / 1000)) {
  const sig = require('crypto').createHash('sha256').update(`${appId}${ts}${payload}${secret}`).digest('hex');
  return `SHA256 Credential=${appId}, Timestamp=${ts}, Signature=${sig}`;
}

const num = (v) => Number(v) || 0;

// Ubah node productOfferV2 jadi baris snapshot ringkas.
function toRow(n) {
  return {
    id: String(n.itemId),
    name: n.productName,
    shop: n.shopName,
    price: num(n.priceMin),
    sales: num(n.sales), // kumulatif dari Shopee
    rate: num(n.commissionRate), // 0.1 = 10%
    rating: num(n.ratingStar),
    link: n.offerLink || n.productLink,
    image: n.imageUrl,
  };
}

// snapshots: [{ date: 'YYYY-MM-DD', items: [row] }] urut lama → baru.
// Penjualan per periode = sales hari ini − sales N hari lalu (pakai snapshot terdekat yang ada).
function trend(snapshots, days) {
  const latest = snapshots[snapshots.length - 1];
  const target = new Date(latest.date);
  target.setUTCDate(target.getUTCDate() - days);
  const base = [...snapshots].reverse().find((s) => new Date(s.date) <= target)
    || (snapshots.length > 1 ? snapshots[0] : null);
  const prev = new Map((base ? base.items : []).map((r) => [r.id, r]));
  const span = base ? Math.max(1, (new Date(latest.date) - new Date(base.date)) / 864e5) : 0;

  return latest.items.map((r) => {
    const p = prev.get(r.id);
    const sold = p ? Math.max(0, r.sales - p.sales) : null; // null = belum ada data pembanding
    const commission = r.price * r.rate;
    const growth = p && p.sales > 0 ? sold / p.sales : null;
    return {
      ...r,
      sold,
      perDay: sold === null ? null : sold / span,
      commission,
      potential: sold === null ? null : sold * commission, // estimasi omzet komisi pasar periode ini
      growth,
      baseDate: base ? base.date : null,
    };
  });
}

// Skor 0-100: potensi komisi (45%), momentum penjualan (25%), komisi/klik (15%), rating (10%), harga ramah impuls (5%).
function score(rows) {
  const has = rows.filter((r) => r.sold !== null);
  const pool = has.length ? has : rows;
  const logNorm = (key) => {
    const max = Math.max(...pool.map((r) => Math.log1p(num(r[key]))), 1e-9);
    return (r) => Math.log1p(num(r[key])) / max;
  };
  const nPot = logNorm(has.length ? 'potential' : 'sales');
  const nMom = logNorm(has.length ? 'perDay' : 'sales');
  const nCom = logNorm('commission');
  const priceFit = (p) => (p <= 0 ? 0 : p <= 150000 ? 1 : Math.max(0, 1 - Math.log10(p / 150000)));

  return pool
    .map((r) => {
      const s = 0.45 * nPot(r) + 0.25 * nMom(r) + 0.15 * nCom(r) + 0.1 * Math.max(0, (r.rating - 4) / 1) + 0.05 * priceFit(r.price);
      return { ...r, score: Math.round(s * 1000) / 10, reason: reason(r) };
    })
    .sort((a, b) => b.score - a.score);
}

function reason(r) {
  const out = [];
  if (r.sold !== null) out.push(`terjual ${fmt(r.sold)} (${fmt(Math.round(r.perDay))}/hari)`);
  out.push(`komisi ${(r.rate * 100).toFixed(1)}% ≈ Rp${fmt(Math.round(r.commission))}/order`);
  if (r.growth !== null && r.growth >= 0.1) out.push(`naik ${(r.growth * 100).toFixed(0)}%`);
  if (r.rating >= 4.8) out.push(`rating ${r.rating}`);
  return out.join(' · ');
}

const fmt = (n) => Math.round(num(n)).toLocaleString('id-ID');

function report(snapshots, periods = [1, 3, 7], top = 10) {
  const latest = snapshots[snapshots.length - 1];
  const out = { date: latest.date, periods: {} };
  for (const d of periods) out.periods[`${d}d`] = score(trend(snapshots, d)).slice(0, top);
  return out;
}

function toText(rep) {
  const lines = [`🔥 Produk Trending Shopee — ${rep.date}`];
  for (const [k, rows] of Object.entries(rep.periods)) {
    const noBase = rows.length && rows[0].sold === null;
    lines.push('', `== ${k}${noBase ? ' (belum ada snapshot pembanding, pakai total terjual)' : ''} ==`);
    rows.forEach((r, i) => {
      lines.push(`${i + 1}. [${r.score}] ${r.name} — Rp${fmt(r.price)}`, `   ${r.reason}`);
      if (r.potential) lines.push(`   potensi komisi pasar: Rp${fmt(r.potential)}`);
      lines.push(`   ${r.link}`);
    });
  }
  return lines.join('\n');
}

module.exports = { signHeader, toRow, trend, score, report, toText };
