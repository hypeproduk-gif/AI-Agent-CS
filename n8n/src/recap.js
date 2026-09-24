// Rekap harian untuk Telegram: klik LP, chat masuk, closing, rasio, omzet.

const TZ = 'Asia/Jakarta';

function dayKey(value) {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return '';
  return new Date(t).toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
}

function pct(a, b) {
  return b ? (Math.round((a / b) * 1000) / 10).toString().replace('.', ',') + '%' : '-';
}

function idr(n) {
  return 'Rp' + Math.round(n || 0).toLocaleString('id-ID');
}

function dailyRecap({ clicks = [], leads = [], orders = [] }, now = new Date()) {
  const today = dayKey(now.toISOString());
  const clickToday = clicks.filter((c) => dayKey(c.clicked_at) === today);
  const newChats = leads.filter((l) => dayKey(l.first_chat_at) === today);
  const activeChats = leads.filter((l) => dayKey(l.last_chat_at) === today);
  const ordersToday = orders.filter((o) => dayKey(o.created_at) === today);
  const cod = ordersToday.filter((o) => o.method === 'cod');
  const omzet = ordersToday.reduce((s, o) => s + Number(o.total || 0), 0);
  const produk = ordersToday.reduce((s, o) => s + Number(o.price || 0), 0);
  const fromAds = ordersToday.filter((o) => o.ref).length;
  const tanggal = new Date(now).toLocaleDateString('id-ID', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const text = [
    `📊 *REKAP AI CS* — ${tanggal}`,
    '',
    `🖱️ Klik tombol WA (LP): ${clickToday.length}`,
    `💬 Chat masuk (lead baru): ${newChats.length}`,
    `🗨️ Chat aktif hari ini: ${activeChats.length}`,
    `🛒 Closing: ${ordersToday.length} (COD ${cod.length} • Transfer ${ordersToday.length - cod.length})`,
    '',
    `📈 Rasio closing / chat masuk: ${pct(ordersToday.length, newChats.length)}`,
    `📈 Rasio chat masuk / klik LP: ${pct(newChats.length, clickToday.length)}`,
    '',
    `💰 Omzet (total bayar): ${idr(omzet)}`,
    `🧴 Nilai produk: ${idr(produk)}`,
    `🎯 Closing dari iklan (ada kode ref): ${fromAds}`,
  ].join('\n');

  return { text, today, counts: { clicks: clickToday.length, newChats: newChats.length, activeChats: activeChats.length, orders: ordersToday.length, omzet, produk } };
}
