// Follow-up otomatis untuk lead yang tidak membalas.
// Tahap FU dicatat di entri histori ({ role: 'assistant', fu: <tahap>, at: <ISO> }), tanpa kolom baru.

const FU_MINUTES = [5, 60, 180, 360, 720, 1440, 2160]; // 5m, 1j, 3j, 6j, 12j, 24j, 36j
const FU_MAX_AGE_MINUTES = 48 * 60; // lead lebih lama dari ini tidak di-FU (juga saat pertama aktif)
const FU_QUIET_HOURS = [21, 7]; // jam WIB tanpa FU (21:00-06:59)
const FU_ORDER_DAYS = 14; // sudah order dalam 14 hari -> tidak di-FU

function wibHour(now) {
  return (new Date(now).getUTCHours() + 7) % 24;
}

// Tahap FU berikutnya yang jatuh tempo, atau null.
function dueFollowUp(row, now = Date.now()) {
  if (!row || !row.phone || isPaused(row, now)) return null;
  if (row.last_order_at && now - Date.parse(row.last_order_at) < FU_ORDER_DAYS * 86400000) return null;
  const [quietFrom, quietTo] = FU_QUIET_HOURS;
  const hour = wibHour(now);
  if (hour >= quietFrom || hour < quietTo) return null;

  const history = parseHistory(row.history);
  const last = history[history.length - 1];
  if (!last || last.role !== 'assistant') return null; // lead yang terakhir bicara -> bot yang harus jawab, bukan FU

  const lastChat = Date.parse(row.last_chat_at);
  if (Number.isNaN(lastChat)) return null;
  const elapsed = (now - lastChat) / 60000;
  if (elapsed < 0 || elapsed >= FU_MAX_AGE_MINUTES) return null;

  const sent = typeof last.fu === 'number' ? last.fu + 1 : 0; // jumlah FU yang sudah terkirim
  if (sent >= FU_MINUTES.length || elapsed < FU_MINUTES[sent]) return null;
  // Kalau beberapa tahap terlewat (mis. jam tenang), kirim satu saja: tahap terakhir yang sudah lewat.
  let stage = sent;
  while (stage + 1 < FU_MINUTES.length && elapsed >= FU_MINUTES[stage + 1]) stage++;
  return { stage, elapsedMinutes: Math.round(elapsed), previous: sent };
}

function waitLabel(minutes) {
  return minutes < 60 ? `${minutes} menit` : `${Math.round(minutes / 60)} jam`;
}

const FU_RULE =
  "FOLLOW-UP: Lead belum membalas chat terakhirmu. Tulis 1 pesan follow-up yang natural seperti CS manusia, singkat (maks 30 kata), dan BERBEDA dari semua pesanmu sebelumnya (jangan ulang kalimat/benefit yang sama). " +
  "Lihat pesan terakhir lead: kalau ada kendala (harga, ragu hasil, BPOM, kulit sensitif, ongkir, belum sempat, dll), follow-up menyentuh kendala itu dengan sudut pandang baru. " +
  "Kalau lead belum menyebut kendala apa pun, berikan 3-4 benefit Salep Glowing FILO dalam poin singkat (pilih yang belum pernah kamu sebut), lalu 1 pertanyaan ringan. " +
  "Kalau sebelumnya lead sedang mengisi data order, ingatkan pelan-pelan untuk melengkapi datanya. " +
  "Makin lama lead diam, makin ringan nadanya; jangan memaksa atau menagih. Tawarkan paket hanya kalau lead sebelumnya sudah menunjukkan minat beli. " +
  "Kalau lead sudah menolak tegas atau minta berhenti dihubungi, balas persis: SKIP";

function followUpRequest(row, due) {
  const product = row.active_product || DEFAULT_PRODUCT;
  const messages = trimHistory(parseHistory(row.history));
  messages.push({
    role: 'user',
    content: `[SISTEM, bukan dari lead] Lead belum membalas selama ${waitLabel(due.elapsedMinutes)}. Tulis follow-up ke-${due.stage + 1} dari ${FU_MINUTES.length}.`,
  });
  return {
    model: MODEL,
    max_tokens: 300,
    system: buildSystemPrompt(product) + ' ' + FU_RULE,
    messages,
  };
}

// Teks FU dari respons Claude, atau null kalau tidak perlu dikirim.
function followUpText(response) {
  const parsed = parseReply(response);
  if (parsed.apiError || parsed.needsHuman) return null;
  const text = parsed.reply.trim();
  if (!text || /^SKIP\b/i.test(text)) return null;
  return text;
}

function appendFollowUp(rawHistory, text, stage, now = Date.now()) {
  const history = parseHistory(rawHistory);
  history.push({ role: 'assistant', content: text, fu: stage, at: new Date(now).toISOString() });
  return JSON.stringify(history.slice(-MAX_HISTORY * 2));
}
