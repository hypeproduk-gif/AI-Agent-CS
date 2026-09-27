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

const PAID_STATUSES = ['confirmed', 'in_process', 'ready', 'shipped', 'completed'];

// Closing: COD (tidak dibatalkan) atau transfer yang sudah dibayar/confirmed di Scalev.
function isClosing(o) {
  if (o.status === 'canceled' || o.status === 'closed') return false;
  if (o.method === 'cod') return true;
  return o.payment_status === 'paid' || o.payment_status === 'settled' || PAID_STATUSES.includes(o.status);
}

function dailyRecap({ clicks = [], leads = [], orders = [] }, now = new Date()) {
  const today = dayKey(now.toISOString());
  const clickToday = clicks.filter((c) => dayKey(c.clicked_at) === today);
  const newChats = leads.filter((l) => dayKey(l.first_chat_at) === today);
  const activeChats = leads.filter((l) => dayKey(l.last_chat_at) === today);
  const allToday = orders.filter((o) => dayKey(o.created_at) === today);
  const ordersToday = allToday.filter(isClosing);
  const waitingTransfer = allToday.filter((o) => !isClosing(o) && o.method !== 'cod' && o.status !== 'canceled');
  // Closing = pembeli unik (1 nomor = 1 closing; order dobel/tes dari nomor yang sama tidak menggelembungkan rasio).
  const buyers = new Set(ordersToday.map((o) => o.phone || o.order_id)).size;
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
    `🛒 Closing: ${buyers} pembeli • ${ordersToday.length} order (COD ${cod.length} • Transfer lunas ${ordersToday.length - cod.length})`,
    `⏳ Transfer menunggu pembayaran: ${waitingTransfer.length}`,
    '',
    `📈 Rasio closing / chat aktif: ${pct(buyers, activeChats.length)}`,
    `📈 Rasio chat masuk / klik LP: ${pct(newChats.length, clickToday.length)}`,
    '',
    `💰 Omzet (total bayar): ${idr(omzet)}`,
    `🧴 Nilai produk: ${idr(produk)}`,
    `🎯 Closing dari iklan (ada kode ref): ${fromAds}`,
  ].join('\n');

  return { text, today, counts: { clicks: clickToday.length, newChats: newChats.length, activeChats: activeChats.length, orders: ordersToday.length, omzet, produk } };
}
