import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import Database from "better-sqlite3";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const {
  ANTHROPIC_API_KEY,
  ADMIN_TOKEN,
  MODEL = "claude-sonnet-5-5",
  PORT = 3000,
  DB_PATH = path.join(__dirname, "data", "app.db"),
} = process.env;

if (!ANTHROPIC_API_KEY || !ADMIN_TOKEN || ADMIN_TOKEN.length < 16) {
  console.error("Set ANTHROPIC_API_KEY dan ADMIN_TOKEN (minimal 16 karakter) di .env");
  process.exit(1);
}

// ---------- Prompt (disimpan di server, tidak pernah dikirim ke browser) ----------
const SKILL = ["main", "prompting", "angles", "characters"]
  .map((n) => `##### FILE: ${n}.md\n` + fs.readFileSync(path.join(__dirname, "skills", `${n}.md`), "utf8"))
  .join("\n\n");
const SYSTEM = fs.readFileSync(path.join(__dirname, "prompt-template.txt"), "utf8").replace("{{SKILL}}", SKILL);

// ---------- Database ----------
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS licenses (
  key TEXT PRIMARY KEY,
  buyer TEXT,
  credits INTEGER NOT NULL,
  expires_at TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  ok INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`);

const q = {
  get: db.prepare("SELECT * FROM licenses WHERE key = ?"),
  take: db.prepare("UPDATE licenses SET credits = credits - 1 WHERE key = ? AND credits > 0 AND active = 1"),
  refund: db.prepare("UPDATE licenses SET credits = credits + 1 WHERE key = ?"),
  log: db.prepare("INSERT INTO usage (key, input_tokens, output_tokens, ok) VALUES (?, ?, ?, ?)"),
  insert: db.prepare("INSERT INTO licenses (key, buyer, credits, expires_at) VALUES (?, ?, ?, ?)"),
  list: db.prepare(`SELECT l.*, (SELECT COUNT(*) FROM usage u WHERE u.key = l.key AND u.ok = 1) AS used
                    FROM licenses l ORDER BY created_at DESC LIMIT 500`),
  update: db.prepare("UPDATE licenses SET credits = COALESCE(?, credits), active = COALESCE(?, active), expires_at = COALESCE(?, expires_at) WHERE key = ?"),
  stats: db.prepare(`SELECT COUNT(*) AS runs, COALESCE(SUM(input_tokens),0) AS input, COALESCE(SUM(output_tokens),0) AS output
                     FROM usage WHERE ok = 1 AND created_at >= datetime('now','-30 days')`),
};

function newKey() {
  const part = () => crypto.randomBytes(3).toString("hex").toUpperCase();
  return `UGC-${part()}-${part()}-${part()}`;
}

function checkLicense(key) {
  const lic = key && q.get.get(String(key).trim().toUpperCase());
  if (!lic) return { error: "Kode lisensi tidak ditemukan.", status: 404 };
  if (!lic.active) return { error: "Lisensi ini dinonaktifkan. Hubungi penjual.", status: 403 };
  if (lic.expires_at && new Date(lic.expires_at) < new Date()) return { error: "Masa berlaku lisensi sudah habis.", status: 403 };
  if (lic.credits <= 0) return { error: "Kredit habis. Beli paket kredit tambahan.", status: 402 };
  return { lic };
}

// ---------- App ----------
const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "8mb" }));
app.use(express.static(path.join(__dirname, "public")));

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

app.get("/api/license", rateLimit({ windowMs: 60_000, limit: 30 }), (req, res) => {
  const lic = q.get.get(String(req.query.key || "").trim().toUpperCase());
  if (!lic) return res.status(404).json({ error: "Kode lisensi tidak ditemukan." });
  res.json({ credits: lic.credits, active: !!lic.active, expiresAt: lic.expires_at });
});

app.post("/api/generate", rateLimit({ windowMs: 60_000, limit: 5 }), async (req, res) => {
  const { key, brief, image } = req.body || {};
  if (typeof brief !== "string" || brief.length < 10 || brief.length > 4000)
    return res.status(400).json({ error: "Brief tidak valid." });

  const chk = checkLicense(key);
  if (chk.error) return res.status(chk.status).json({ error: chk.error });
  const k = chk.lic.key;
  if (q.take.run(k).changes === 0) return res.status(402).json({ error: "Kredit habis." });

  const content = [];
  if (image?.data && /^image\/(jpeg|png|webp|gif)$/.test(image.type || ""))
    content.push({ type: "image", source: { type: "base64", media_type: image.type, data: image.data } });
  content.push({ type: "text", text: brief });

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });
    const text = msg.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    q.log.run(k, msg.usage?.input_tokens ?? null, msg.usage?.output_tokens ?? null, 1);
    res.json({ text, credits: q.get.get(k).credits });
  } catch (e) {
    q.refund.run(k); // generate gagal tidak memotong kredit
    q.log.run(k, null, null, 0);
    console.error("generate error:", e?.status, e?.message);
    res.status(502).json({ error: "Generate gagal, kredit tidak terpotong. Coba lagi sebentar." });
  }
});

// ---------- Admin ----------
function admin(req, res, next) {
  const t = req.get("x-admin-token") || "";
  const ok = t.length === ADMIN_TOKEN.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(ADMIN_TOKEN));
  if (!ok) return res.status(401).json({ error: "Token admin salah." });
  next();
}
app.use("/api/admin", rateLimit({ windowMs: 60_000, limit: 60 }), admin);

app.get("/api/admin/licenses", (req, res) => res.json({ licenses: q.list.all(), stats: q.stats.get() }));

app.post("/api/admin/licenses", (req, res) => {
  const { buyer = "", credits = 30, days = null, count = 1 } = req.body || {};
  const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
  const c = Math.max(parseInt(credits) || 0, 0);
  const exp = days ? new Date(Date.now() + parseInt(days) * 86400000).toISOString() : null;
  const keys = [];
  db.transaction(() => { for (let i = 0; i < n; i++) { const k = newKey(); q.insert.run(k, String(buyer).slice(0, 120), c, exp); keys.push(k); } })();
  res.json({ keys });
});

app.patch("/api/admin/licenses/:key", (req, res) => {
  const { addCredits, active, days } = req.body || {};
  const lic = q.get.get(req.params.key);
  if (!lic) return res.status(404).json({ error: "Tidak ditemukan." });
  const credits = addCredits != null ? lic.credits + parseInt(addCredits) : null;
  const exp = days != null ? new Date(Date.now() + parseInt(days) * 86400000).toISOString() : null;
  q.update.run(credits, active == null ? null : active ? 1 : 0, exp, lic.key);
  res.json(q.get.get(lic.key));
});

app.listen(PORT, () => console.log(`UGC Flow Studio jalan di http://localhost:${PORT}`));
