// Cek kode akses: hanya hash SHA-256 yang tersimpan di server.
const crypto = require("crypto");
const codes = new Set(require("./codes.json"));
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  let kode = "";
  try { kode = String(JSON.parse(event.body || "{}").kode || "").trim().toUpperCase(); } catch {}
  const h = crypto.createHash("sha256").update(kode).digest("hex");
  const ok = codes.has(h);
  return { statusCode: ok ? 200 : 403, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok, token: ok ? h.slice(0, 16) : null }) };
};
