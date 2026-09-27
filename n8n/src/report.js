// Laporan singkat 3x sehari (09:00, 13:00, 18:00 WIB): lead, closing, pending + alasan singkat.
// Memakai dayKey() dari recap.js.

const REPORT_MAX_PENDING = 25;

function lastMessages(raw, n = 4) {
  let list = [];
  try { list = JSON.parse(raw || '[]'); } catch (e) { list = []; }
  return (Array.isArray(list) ? list : []).slice(-n)
    .map((m) => `${m.role === 'user' ? 'Lead' : 'CS'}: ${String(m.content || '').replace(/\s+/g, ' ').slice(0, 160)}`)
    .join(' | ');
}

function shortReportData({ leads = [], orders = [] }, now = new Date()) {
  const today = dayKey(now.toISOString());
  const newLeads = leads.filter((l) => dayKey(l.first_chat_at) === today);
  const ordersToday = orders.filter((o) => dayKey(o.created_at) === today);
  const buyers = new Set(ordersToday.map((o) => o.phone));
  const cod = ordersToday.filter((o) => o.method === 'cod');
  const transfer = ordersToday.filter((o) => o.method !== 'cod');
  // Pending: chat aktif hari ini tapi belum order hari ini.
  const pending = leads
    .filter((l) => l.phone && dayKey(l.last_chat_at) === today && !buyers.has(l.phone))
    .slice(0, REPORT_MAX_PENDING)
    .map((l) => ({ phone: l.phone, chat: lastMessages(l.history) }));
  const hour = Number(new Date(now).toLocaleString('en-US', { timeZone: TZ, hour: '2-digit', hour12: false })) % 24;
  return { hour, newLeads: newLeads.length, closing: buyers.size, cod: cod.length, transfer: transfer.length, pending };
}

// Request ke Claude: 1 alasan singkat per lead pending.
function pendingReasonRequest(data) {
  const list = data.pending.map((p, i) => `${i + 1}. ${p.phone}: ${p.chat}`).join('\n');
  return {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: 'Kamu merangkum chat CS jualan salep. Untuk setiap lead, tulis alasan singkat (maks 6 kata) kenapa belum closing, berdasarkan chat terakhir. Contoh: "tanya BPOM, belum balas", "ragu harga", "belum isi alamat", "baru tanya harga". Jawab hanya dengan baris berformat: nomor|alasan',
    messages: [{ role: 'user', content: list }],
  };
}

function shortReportText(data, response) {
  const text = ((response && response.content) || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  const reasons = {};
  text.split('\n').forEach((line) => {
    const [phone, ...rest] = line.split('|');
    if (phone && rest.length) reasons[phone.replace(/\D/g, '')] = rest.join('|').trim();
  });
  const label = { 9: '9 pagi', 13: '1 siang', 18: '6 sore' }[data.hour] || `jam ${data.hour}`;
  const lines = [
    `📋 LAPORAN ${label.toUpperCase()}`,
    '',
    `💬 Lead baru: ${data.newLeads}`,
    `✅ Closing: ${data.closing} (COD ${data.cod} • Transfer ${data.transfer})`,
    `⏳ Pending: ${data.pending.length}`,
  ];
  data.pending.forEach((p) => lines.push(`• ${p.phone}: ${reasons[p.phone] || '-'}`));
  return lines.join('\n');
}
