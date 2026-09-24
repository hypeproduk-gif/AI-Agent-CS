// Ambil teks balasan Claude, deteksi token handoff, rapikan format untuk WhatsApp.

const HANDOFF_TOKEN = '[HANDOFF]'; // bot dijeda sementara, CS manusia ambil alih
const INFO_TOKEN = '[INFO_ADMIN]'; // admin cukup dikabari, bot tetap lanjut jualan
const FALLBACK_REPLY =
  'Maaf kak, sistem kami lagi sibuk sebentar. Tim CS akan segera membalas chat kakak ya 🙏';

function toWhatsApp(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/^#+\s*/gm, '')
    .trim();
}

function parseReply(response) {
  const block = response && Array.isArray(response.content)
    ? response.content.find((c) => c.type === 'text')
    : null;

  if (!block || !block.text) {
    const error = (response && response.error && response.error.message) || 'Respons Claude kosong';
    return { reply: FALLBACK_REPLY, needsHuman: true, apiError: error };
  }

  const needsHuman = block.text.includes(HANDOFF_TOKEN);
  const infoAdmin = block.text.includes(INFO_TOKEN);
  const sendTestimoni = block.text.includes('[TESTIMONI]');
  const clean = [HANDOFF_TOKEN, INFO_TOKEN, '[TESTIMONI]'].reduce((t, tok) => t.split(tok).join(''), block.text);
  const reply = toWhatsApp(clean);
  return { reply: reply || FALLBACK_REPLY, needsHuman, infoAdmin, sendTestimoni, apiError: null };
}
