// Batch resi harian: order yang sudah confirmed & belum punya resi -> generate AWB sekaligus.

const RESI_LOOKBACK_DAYS = 3; // transfer yang baru dibayar 1-2 hari kemudian tetap ikut

// Kandidat dari tabel aics_orders (baris lama tanpa scalev_id dilewati).
function resiCandidates(rows, now = Date.now()) {
  const seen = new Set();
  return rows.filter((r) => {
    if (!r || !r.scalev_id || seen.has(r.scalev_id)) return false;
    seen.add(r.scalev_id);
    const at = Date.parse(r.created_at);
    return !Number.isNaN(at) && now - at < RESI_LOOKBACK_DAYS * 86400000;
  });
}

// Isi paket + pembayaran + nominal, contoh "2 salepglowing, sunscreen, eyeliner, COD, 149.500".
function packingText(row) {
  const pkg = (PACKAGES.SalGlow || {})[row.paket] || {};
  const method = row.method === 'cod' ? 'COD' : 'TRANSFER';
  return `${pkg.pcs || '?'} salepglowing, sunscreen, eyeliner, ${method}, ${Number(row.total || 0).toLocaleString('id-ID')}`;
}

// Siap resi: status confirmed (COD otomatis; transfer setelah admin konfirmasi pembayaran) dan belum ada resi.
function readyForResi(order) {
  const o = (order && order.data) || order || {};
  return o.status === 'confirmed' && !o.shipment_receipt;
}

function resiReport(response, orders) {
  const r = (response && response.data) || response || {};
  const ok = Object.entries(r.successes || {});
  const fail = Object.entries(r.failures || {});
  const name = (id) => (orders.find((o) => o.scalev_id === id || o.order_id === id) || {}).order_id || id;
  const lines = ['🧾 BATCH RESI HARIAN', '', `✅ Resi terbit: ${ok.length}`];
  ok.forEach(([id, resi]) => lines.push(`• ${name(id)}: ${resi}`));
  if (fail.length) {
    lines.push('', `⚠️ Gagal: ${fail.length}`);
    fail.forEach(([id, msg]) => lines.push(`• ${name(id)}: ${msg}`));
  }
  if (!ok.length && !fail.length) lines.push('', `Respons Scalev: ${JSON.stringify(response).slice(0, 300)}`);
  lines.push('', 'Silakan print semua label di Mengantar/Scalev.');
  return lines.join('\n');
}

// Laporan saat tidak ada order yang siap dibuatkan resi (tetap dikirim supaya admin tahu batch jalan).
function resiEmptyReport(cands, checks) {
  const lines = ['🧾 BATCH RESI', '', 'Tidak ada order siap resi (confirmed & belum ada resi).'];
  const real = cands.filter((c) => c && c.scalev_id);
  if (real.length) {
    lines.push('', 'Order AI 3 hari terakhir:');
    real.forEach((c, i) => {
      const o = (checks[i] && (checks[i].data || checks[i])) || {};
      lines.push(`• ${c.order_id} (${c.method}): ${o.status || '?'}${o.shipment_receipt ? ', resi ' + o.shipment_receipt : ''}`);
    });
  }
  return lines.join('\n');
}

// Resi manual per store (mis. Filomall Beauty): semua order confirmed tanpa resi dari list Scalev.
const FILOMALL_STORE_ID = 2709;
function storeResiOrders(responses, storeId = FILOMALL_STORE_ID) {
  const seen = new Set();
  const out = [];
  for (const res of responses) {
    const d = (res && res.data) || res || {};
    const list = Array.isArray(d.results) ? d.results : Array.isArray(d) ? d : [];
    for (const o of list) {
      const sid = (o.store && o.store.id) || o.store_id;
      if (!o || !o.id || seen.has(o.id) || Number(sid) !== storeId || !readyForResi(o)) continue;
      seen.add(o.id);
      out.push({ scalev_id: o.id, order_id: o.order_id || o.id });
    }
  }
  return out;
}
