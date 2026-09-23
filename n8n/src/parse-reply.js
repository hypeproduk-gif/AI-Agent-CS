// Ambil teks balasan Claude, deteksi token handoff, rapikan format untuk WhatsApp.

const HANDOFF_TOKEN = '[HANDOFF]';
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
  const reply = toWhatsApp(block.text.split(HANDOFF_TOKEN).join(''));
  return { reply: reply || FALLBACK_REPLY, needsHuman, apiError: null };
}
