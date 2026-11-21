// Aplikasi Kelas 6 — dua mode dari bank soal yang sama:
//  MODE "harian": Les di Rumah Kelas 6 — 100 hari × 10 soal × 4 mapel, level naik di hari 36 & 71.
//  MODE "drill" : Siap Ujian Kelas 6 — paket drill bertahap, simulasi ujian bertimer, drill topik lemah, hitung mundur ujian.
const MODE = window.MODE || "harian";
// DEMO: penanda kecil di pilihan benar (titik abu di pojok kanan bawah) untuk rekam layar.
const DM = (q, j) => (window.DEMO && j === q.jawab ? " dm" : "");
const HEMAT = MODE === "hemat", DRILL = MODE !== "harian"; // "hemat": versi ringkas drill, 320 soal
const PRODUK = DRILL ? "Siap Ujian Kelas 6" : "Les di Rumah Kelas 6";
const MAPEL = { MTK: ["Matematika", "🔢"], BIND: ["Bahasa Indonesia", "📖"], BING: ["Bahasa Inggris", "🇬🇧"], IPA: ["IPA", "🔬"] };
const PER_HARI = 10, HARI = 100, PER_PAKET = HEMAT ? 10 : 25, N_SIM = HEMAT ? 3 : 10, N_TOPIK = HEMAT ? 10 : 15, SIM_N = 40, SIM_MENIT = 60;
const LEVEL = [null, { nama: "Level 1 · Dasar", mulai: 1 }, { nama: "Level 2 · Menengah", mulai: 36 }, { nama: "Level 3 · Mahir (HOTS)", mulai: 71 }];
const BANK = {}; for (const k in MAPEL) BANK[k] = GEN[k]();
const BYID = {}; for (const k in BANK) BANK[k].forEach((q) => (BYID[q.id] = q));
const $ = (s) => document.querySelector(s); const app = $("#app");
const SKEY = window.DEMO ? "sd6demo" : HEMAT ? "sd6x" : DRILL ? "sd6d" : "sd6h";
const store = { get() { try { return JSON.parse(localStorage.getItem(SKEY) || "{}"); } catch { return {}; } }, set(v) { try { localStorage.setItem(SKEY, JSON.stringify(v)); } catch {} } };
let ST = Object.assign({ nama: "", hasil: {}, salah: {}, draft: {}, sim: {}, streak: 0, last: "" }, store.get());
const save = () => store.set(ST);
const today = () => new Date().toISOString().slice(0, 10);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rngPick = (arr, n, seed) => { const r = CORE.rng(seed), x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x.slice(0, n); };

// ---------- Mode harian ----------
const levelHari = (d) => (d >= 71 ? 3 : d >= 36 ? 2 : 1);
function soalHari(m, d) { const lv = levelHari(d); const pool = BANK[m].filter((q) => q.level === lv); const i = (d - LEVEL[lv].mulai) * PER_HARI; return pool.slice(i, i + PER_HARI); }
const hariSelesai = (d) => Object.keys(MAPEL).every((m) => ST.hasil[m + d]);
const hariAktif = () => { for (let d = 1; d <= HARI; d++) if (!hariSelesai(d)) return d; return HARI; };
let pilihHari = null;

// ---------- Mode drill ----------
const NP = HEMAT ? 8 : 40, PAKET = { MTK: NP, BIND: NP, BING: NP, IPA: NP }; // penuh: 1–14 dasar, 15–28 menengah, 29–40 HOTS · hemat: 1–3, 4–6, 7–8
const LV_MULAI = HEMAT ? [0, 1, 4, 7] : [0, 1, 15, 29], LV_TXT = HEMAT ? "1–3 Dasar · 4–6 Menengah · 7–8 HOTS" : "1–14 Dasar · 15–28 Menengah · 29–40 HOTS";
const paketLevel = (k) => (k >= LV_MULAI[3] ? 3 : k >= LV_MULAI[2] ? 2 : 1);
function soalPaket(m, k) { const lv = paketLevel(k); const pool = BANK[m].filter((q) => q.level === lv); const start = (k - LV_MULAI[lv]) * PER_PAKET; return pool.slice(start, start + PER_PAKET); }
function soalSim(m, n) { // m = kode mapel atau "MIX"; n = nomor simulasi 1–N_SIM
  if (m === "MIX") return Object.keys(MAPEL).flatMap((k, i) => rngPick(BANK[k], SIM_N / 4, 9000 + n * 13 + i));
  const B = BANK[m], a = rngPick(B.filter((q) => q.level === 1), 12, n * 101), b = rngPick(B.filter((q) => q.level === 2), 16, n * 103), c = rngPick(B.filter((q) => q.level === 3), 12, n * 107);
  return [...a, ...b, ...c];
}
const hariLagi = () => { if (!ST.ujian) return null; return Math.ceil((new Date(ST.ujian) - new Date(today())) / 864e5); };

function gate() {
  watermark(); $("#homeBtn").hidden = true;
  if (!window.PREVIEW && !window.NOKODE && !ST.kode && (window.KODE_HASH || (location.protocol.startsWith("http") && !/localhost|127\.0\.0\.1/.test(location.hostname)))) { aktivasi(); return false; }
  if (!ST.setuju) { tentang(true); return false; }
  if (!ST.nama) { setup(); return false; }
  return true;
}
const menuBawah = (extra) => `<div class="grid">${extra || ""}<button class="btn sec" id="review" ${Object.keys(ST.salah).length ? "" : "disabled"}>🔁 Ulang soal salah (${Object.keys(ST.salah).length})</button><button class="btn sec" id="rapor">📊 Rapor</button><button class="btn sec" id="materi">📘 Materi</button><button class="btn sec" id="cetak">🖨️ Cetak soal & materi</button><button class="btn sec" id="ortu">👪 Panduan orang tua</button><button class="btn sec" id="ttg">ℹ️ Tentang & hak cipta</button></div><div class="foot">© ${PEMBUAT}<br>Lisensi penggunaan pribadi · Dilarang menyebarluaskan</div>`;
function pasangMenu() { $("#review").onclick = review; $("#rapor").onclick = rapor; $("#cetak").onclick = cetakMenu; $("#materi").onclick = () => materi(); $("#ttg").onclick = () => tentang(); $("#ortu").onclick = ortu; }

function home() {
  if (!gate()) return;
  if (DRILL) return homeDrill();
  const d = pilihHari || hariAktif(); const lv = levelHari(d);
  const selesai = Array.from({ length: HARI }, (_, i) => hariSelesai(i + 1)).filter(Boolean).length;
  app.innerHTML = `
  <div class="card"><div class="row"><div><div class="mut">Halo, ${esc(ST.nama)} 👋</div><b style="font-size:22px">Hari ke-${d}</b> <span class="lvl l${lv}">${LEVEL[lv].nama}</span></div><div style="text-align:right"><div class="big">🔥${ST.streak}</div><div class="mut">hari beruntun</div></div></div>
  <div class="mut" style="margin:10px 0 4px">Progres ${selesai}/${HARI} hari</div><div class="bar"><i style="width:${selesai}%"></i></div></div>
  <details class="card"><summary><b>📌 Cara pakai (1 menit)</b></summary><ol style="margin:8px 0 0;padding-left:20px">
  <li>Kerjakan <b>4 mapel</b> di bawah setiap hari. Satu mapel = 10 soal, ±10 menit.</li>
  <li>Klik mapel → <b>scroll</b> dan pilih jawaban. Benar/salah dan pembahasan langsung muncul. Jawaban tersimpan otomatis.</li>
  <li>Setelah 10 soal terjawab, klik <b>Selesai & lihat nilai</b>. Kartu mapel jadi hijau ✅.</li>
  <li>Jika 4 mapel sudah hijau, aplikasi pindah ke <b>hari berikutnya</b> (kerjakan besok, 1 hari 1 sesi). Level naik di hari 36 dan 71.</li>
  <li>Bingung materinya? Buka <b>📘 Materi</b>. Akhir pekan, buka <b>🔁 Ulang soal salah</b> dan <b>📊 Rapor</b>.</li></ol></details>
  <div class="grid">${Object.entries(MAPEL).map(([k, [n, ic]]) => { const h = ST.hasil[k + d], dr = ST.draft[k + d]; const nb = dr ? dr.log.filter((l) => l.ok).length : 0; return `<button class="mapel ${h ? "done" : ""}" data-m="${k}"><span class="ic">${ic}</span><b>${n}</b><small>${h ? `✅ Nilai ${h.nilai} · lihat jawaban` : dr ? `⏳ ${Object.keys(dr.pil).length}/${PER_HARI} dijawab · ${nb} benar · lanjutkan` : `${PER_HARI} soal · ±10 menit`}</small></button>`; }).join("")}</div>
  <div class="card" style="margin-top:14px"><b>Pilih hari</b> <span class="mut">(hijau = selesai)</span><div class="days" style="margin-top:8px">${Array.from({ length: HARI }, (_, i) => `<button class="${hariSelesai(i + 1) ? "d" : ""} ${i + 1 === d ? "c" : ""}" data-d="${i + 1}">${i + 1}</button>`).join("")}</div>
  <div class="mut" style="margin-top:8px">Hari 1–35: Level 1 · Hari 36–70: Level 2 · Hari 71–100: Level 3</div></div>${menuBawah()}`;
  app.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => kuis(soalHari(b.dataset.m, d), { key: b.dataset.m + d, title: `${MAPEL[b.dataset.m][1]} ${MAPEL[b.dataset.m][0]} · Hari ke-${d}` })));
  app.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { pilihHari = +b.dataset.d; home(); }));
  pasangMenu();
}

let tabM = "MTK";
function homeDrill() {
  const hl = hariLagi();
  const paketSelesai = Object.keys(ST.hasil).filter((k) => k.startsWith("P-")).length, totalPaket = Object.values(PAKET).reduce((a, b) => a + b, 0);
  const sisa = totalPaket - paketSelesai; const target = hl && hl > 0 ? Math.max(1, Math.ceil(sisa / hl)) : null;
  const nilai = Object.entries(ST.hasil).filter(([k]) => k.startsWith("P-")).map(([, h]) => h.nilai);
  const kesiapan = nilai.length ? Math.round(nilai.reduce((a, b) => a + b) / nilai.length) : 0;
  app.innerHTML = `
  <div class="card"><div class="row"><div><div class="mut">Halo, ${esc(ST.nama)} 👋</div><b style="font-size:20px">${hl == null ? "Atur tanggal ujian" : hl > 0 ? `Ujian ${hl} hari lagi` : hl === 0 ? "Ujian hari ini. Semangat!" : "Ujian sudah lewat"}</b></div><div style="text-align:right"><div class="big">🔥${ST.streak}</div><div class="mut">hari beruntun</div></div></div>
  <div class="row" style="margin-top:10px;gap:8px"><input type="date" id="tgl" value="${ST.ujian || ""}" style="flex:1"><button class="btn sec" id="sv">Simpan</button></div>
  ${target ? (target <= 3 ? `<p class="mut" style="margin-top:8px">🎯 Target: <b>${target} paket per hari</b> agar ${sisa} paket tersisa selesai sebelum ujian.</p>` : `<p class="mut" style="margin-top:8px">🎯 Waktu ${hl} hari: fokus <b>2 drill per topik sehari</b> sesuai materi ujian + <b>1 simulasi tiap akhir pekan</b>.</p>`) : ""}
  <div class="mut" style="margin:10px 0 4px">Kesiapan (rata-rata nilai paket): <b>${kesiapan}</b> · ${paketSelesai}/${totalPaket} paket</div><div class="bar"><i style="width:${(paketSelesai / totalPaket) * 100}%"></i></div></div>
  <details class="card"><summary><b>📌 Cara pakai (1 menit)</b></summary><ol style="margin:8px 0 0;padding-left:20px">
  <li>Isi <b>tanggal ujian</b> di atas. Aplikasi menghitung target paket per hari.</li>
  <li><b>📦 Paket Drill</b>: ${NP} paket per mapel, ${PER_PAKET} soal per paket, langsung dibahas. ${LV_TXT}.</li>
  <li><b>⏱️ Simulasi Ujian</b>: 40 soal, ${SIM_MENIT} menit, tanpa pembahasan sampai selesai (seperti ujian sungguhan).</li>
  <li><b>📚 Drill per Topik</b>: pilih topik yang keluar di UAS/PAS sekolah, ${N_TOPIK} soal per latihan.</li>
  <li><b>🎯 Drill Topik Lemah</b>: 10 soal otomatis dari topik dengan nilai terendah.</li>
  <li>Jawaban tersimpan otomatis. Akhir pekan, cek <b>📊 Rapor</b>.</li></ol></details>
  <div class="card"><b>📦 Paket Drill</b> <span class="mut">(warna = nilai)</span>
  <div class="grid" style="grid-template-columns:repeat(4,1fr);margin:10px 0">${Object.entries(MAPEL).map(([k, [n, ic]]) => `<button class="btn ${k === tabM ? "" : "sec"}" data-tab="${k}" style="padding:8px 4px;font-size:13px">${ic} ${n.split(" ").pop()}</button>`).join("")}</div>
  <div class="days" style="grid-template-columns:repeat(8,1fr)">${Array.from({ length: PAKET[tabM] }, (_, i) => { const h = ST.hasil[`P-${tabM}-${i + 1}`], dr = ST.draft[`P-${tabM}-${i + 1}`]; const bg = h ? (h.nilai >= 80 ? "#86efac" : h.nilai >= 60 ? "#fde68a" : "#fca5a5") : dr ? "#bfdbfe" : ""; return `<button data-p="${i + 1}" style="${bg ? "background:" + bg : ""}" title="${h ? "Nilai " + h.nilai : ""}">${i + 1}</button>`; }).join("")}</div>
  <div class="mut" style="margin-top:8px">${LV_TXT} · <span style="color:#16a34a">hijau ≥80</span> · <span style="color:#a16207">kuning 60–79</span> · <span style="color:#dc2626">merah &lt;60</span> · <span style="color:#1d4ed8">biru = belum selesai</span></div></div>
  <div class="card"><b>⏱️ Simulasi Ujian</b> <span class="mut">(40 soal · ${SIM_MENIT} menit)</span>
  <div class="grid" style="grid-template-columns:repeat(5,1fr);margin-top:10px">${["MIX", ...Object.keys(MAPEL)].map((m) => `<button class="btn sec" data-sm="${m}" style="padding:8px 2px;font-size:12px">${m === "MIX" ? "🧩 Campuran" : MAPEL[m][1] + " " + MAPEL[m][0].split(" ").pop()}</button>`).join("")}</div></div>
  ${menuBawah(`<button class="btn" id="topik" style="grid-column:1/-1">📚 Drill per Topik (pilih sesuai materi UAS/PAS)</button><button class="btn" id="lemah" style="grid-column:1/-1">🎯 Drill Topik Lemah (10 soal)</button>`)}`;
  $("#sv").onclick = () => { ST.ujian = $("#tgl").value || null; save(); home(); };
  app.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => { tabM = b.dataset.tab; home(); }));
  app.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => { const k = +b.dataset.p; kuis(soalPaket(tabM, k), { key: `P-${tabM}-${k}`, title: `${MAPEL[tabM][1]} ${MAPEL[tabM][0]} · Paket ${k} · ${["", "Dasar", "Menengah", "HOTS"][paketLevel(k)]}` }); }));
  app.querySelectorAll("[data-sm]").forEach((b) => (b.onclick = () => pilihSim(b.dataset.sm)));
  $("#lemah").onclick = drillLemah; $("#topik").onclick = () => pilihTopik(tabM);
  pasangMenu();
}
function pilihSim(m) {
  keluar(); const nm = m === "MIX" ? "🧩 Campuran 4 Mapel" : MAPEL[m][1] + " " + MAPEL[m][0];
  app.innerHTML = `<div class="card"><h2>⏱️ Simulasi ${nm}</h2><p class="mut">40 soal · ${SIM_MENIT} menit · pembahasan muncul setelah selesai. Kerjakan di tempat tenang, seperti ujian sungguhan.</p>
  <div class="grid" style="grid-template-columns:repeat(5,1fr)">${Array.from({ length: N_SIM }, (_, i) => { const h = ST.sim[`${m}-${i + 1}`]; return `<button class="btn ${h ? "" : "sec"}" data-n="${i + 1}" style="padding:10px 2px">${i + 1}${h ? `<br><small>${h.nilai}</small>` : ""}</button>`; }).join("")}</div></div>`;
  app.querySelectorAll("[data-n]").forEach((b) => (b.onclick = () => ujian(m, +b.dataset.n))); scrollTo(0, 0);
}
let timerId = null;
function ujian(m, n) {
  keluar(); clearInterval(timerId);
  const key = `${m}-${n}`, soal = soalSim(m, n), done = ST.sim[key];
  if (done) return reviewUjian(soal, done, `Simulasi ${m === "MIX" ? "Campuran" : MAPEL[m][0]} #${n}`, () => { delete ST.sim[key]; save(); ujian(m, n); });
  ST.simDraft = ST.simDraft || {}; const dr = ST.simDraft[key] || { pil: {}, mulai: Date.now() }; ST.simDraft[key] = dr; save();
  app.innerHTML = `<div class="card" style="position:sticky;top:58px;z-index:3"><div class="row"><b>⏱️ Simulasi ${m === "MIX" ? "Campuran" : MAPEL[m][0]} #${n}</b><b id="tm" style="font-size:20px"></b></div><div class="mut" id="cnt"></div></div>
  <div class="card">${soal.map((q, i) => `<div class="qi"><span class="lvl l${q.level}">${i + 1}. ${MAPEL[q.mapel][0]}</span><div class="q">${q.q}</div>${q.img ? `<div class="img">${q.img}</div>` : ""}${q.opsi.map((o, j) => `<button class="opt ${dr.pil[i] === j ? "pk" : ""}${DM(q, j)}" data-i="${i}" data-j="${j}"><b>${"ABCD"[j]}.</b> ${o}</button>`).join("")}</div>`).join("")}
  <br><button class="btn full" id="kumpul">Kumpulkan jawaban</button></div>`;
  const upd = () => { $("#cnt").textContent = `${Object.keys(dr.pil).length}/${soal.length} dijawab · jawaban tersimpan otomatis`; };
  const sisa = () => SIM_MENIT * 60 - Math.floor((Date.now() - dr.mulai) / 1000);
  const tick = () => { const s = sisa(); if (s <= 0) { clearInterval(timerId); alert("Waktu habis! Jawaban dikumpulkan otomatis."); return kumpul(); } $("#tm").textContent = `${String((s / 60) | 0).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; $("#tm").style.color = s < 300 ? "#dc2626" : ""; };
  app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => { const i = +b.dataset.i, j = +b.dataset.j; dr.pil[i] = j; b.parentNode.querySelectorAll(".opt").forEach((x) => x.classList.toggle("pk", x === b)); save(); upd(); }));
  const kumpul = () => { clearInterval(timerId); const benar = soal.filter((q, i) => dr.pil[i] === q.jawab).length, nilai = Math.round((benar / soal.length) * 100);
    const log = soal.map((q, i) => ({ id: q.id, ok: dr.pil[i] === q.jawab, topik: q.topik, mapel: q.mapel })); log.forEach((l) => (l.ok ? delete ST.salah[l.id] : (ST.salah[l.id] = 1)));
    ST.sim[key] = { nilai, pil: dr.pil, log, tgl: today(), menit: Math.min(SIM_MENIT, Math.ceil((Date.now() - dr.mulai) / 60000)) }; delete ST.simDraft[key]; bumpStreak(); save();
    reviewUjian(soal, ST.sim[key], `Simulasi ${m === "MIX" ? "Campuran" : MAPEL[m][0]} #${n}`, () => { delete ST.sim[key]; save(); ujian(m, n); }); };
  $("#kumpul").onclick = () => { const k = Object.keys(dr.pil).length; if (k < soal.length && !confirm(`Masih ada ${soal.length - k} soal kosong. Kumpulkan sekarang?`)) return; kumpul(); };
  upd(); tick(); timerId = setInterval(tick, 1000); scrollTo(0, 0);
}
function reviewUjian(soal, h, judul, ulang) {
  const benar = soal.filter((q, i) => h.pil[i] === q.jawab).length; const tp = {};
  soal.forEach((q, i) => { const k = MAPEL[q.mapel][0] + " — " + q.topik; tp[k] = tp[k] || [0, 0]; tp[k][1]++; if (h.pil[i] === q.jawab) tp[k][0]++; });
  const lemah = Object.entries(tp).filter(([, v]) => v[0] < v[1]).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 5);
  app.innerHTML = `<div class="card" style="text-align:center"><div class="mut">${judul}</div><div class="big">${h.nilai}</div><p>${benar} dari ${soal.length} benar · ${h.menit || "-"} menit</p>${lemah.length ? `<p class="mut">Perlu dilatih: ${lemah.map(([k]) => k).join(", ")}</p>` : ""}<button class="btn sec" id="ul">🔄 Ulangi simulasi ini</button></div>
  <div class="card"><b>Pembahasan</b>${soal.map((q, i) => { const j = h.pil[i], ok = j === q.jawab; return `<div class="qi"><span class="lvl l${q.level}">${i + 1}. ${q.topik}</span><div class="q">${q.q}</div>${q.img ? `<div class="img">${q.img}</div>` : ""}${q.opsi.map((o, k) => `<div class="opt ${k === q.jawab ? "ok" : k === j ? "no" : ""}"><b>${"ABCD"[k]}.</b> ${o}</div>`).join("")}<div class="bahas"><b>${j == null ? "⚪ Tidak dijawab." : ok ? "✅ Benar!" : "❌ Belum tepat."}</b> ${q.bahas}</div></div>`; }).join("")}</div>`;
  $("#ul").onclick = () => { if (confirm("Ulangi simulasi? Nilai lama akan diganti.")) ulang(); }; scrollTo(0, 0);
}
function pilihTopik(m) {
  keluar(); const tp = [...new Set(BANK[m].map((q) => q.topik))];
  const skor = (t) => { const ls = [...Object.values(ST.hasil), ...Object.values(ST.sim)].flatMap((h) => (h.log || []).filter((l) => l.mapel === m && l.topik === t)); return ls.length ? Math.round((ls.filter((l) => l.ok).length / ls.length) * 100) + "%" : "–"; };
  app.innerHTML = `<div class="card"><h2>📚 Drill per Topik</h2><p class="mut">Pilih topik yang sedang dipelajari di sekolah atau yang keluar di UAS/PAS. Tiap klik memberi ${N_TOPIK} soal acak dari topik itu, campuran dasar sampai HOTS.</p>
  <div class="grid" style="grid-template-columns:repeat(4,1fr);margin:10px 0">${Object.entries(MAPEL).map(([k, [n, ic]]) => `<button class="btn ${k === m ? "" : "sec"}" data-tm="${k}" style="padding:8px 4px;font-size:13px">${ic} ${n.split(" ").pop()}</button>`).join("")}</div>
  ${tp.map((t) => `<button class="opt" data-t="${esc(t)}"><b>${esc(t)}</b> <span class="mut">· ${BANK[m].filter((q) => q.topik === t).length} soal · nilai ${skor(t)}</span></button>`).join("")}</div>`;
  app.querySelectorAll("[data-tm]").forEach((b) => (b.onclick = () => pilihTopik(b.dataset.tm)));
  app.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => { const t = b.dataset.t; const sudah = new Set(Object.values(ST.hasil).flatMap((h) => (h.log || []).filter((l) => l.ok).map((l) => l.id)));
    const pool = BANK[m].filter((q) => q.topik === t), belum = pool.filter((q) => !sudah.has(q.id)); const soal = rngPick(belum.length >= N_TOPIK ? belum : pool, N_TOPIK, Date.now() % 100000).sort((a, b) => a.level - b.level);
    kuis(soal, { key: null, title: `📚 ${MAPEL[m][0]} · ${t}` }); }));
  scrollTo(0, 0);
}
function drillLemah() {
  const tp = {}; for (const h of [...Object.values(ST.hasil), ...Object.values(ST.draft), ...Object.values(ST.sim)]) for (const l of h.log || []) { const k = l.mapel + "|" + l.topik; tp[k] = tp[k] || [0, 0]; tp[k][1]++; if (l.ok) tp[k][0]++; }
  const lemah = Object.entries(tp).filter(([, v]) => v[1] >= 3).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 3).map(([k]) => k.split("|"));
  if (!lemah.length) return alert("Kerjakan beberapa paket dulu agar topik lemah terdeteksi.");
  const sudah = new Set(Object.values(ST.hasil).flatMap((h) => (h.log || []).filter((l) => l.ok).map((l) => l.id)));
  const pool = lemah.flatMap(([m, t]) => BANK[m].filter((q) => q.topik === t && !sudah.has(q.id)));
  const soal = rngPick(pool, 10, Date.now() % 100000);
  kuis(soal, { key: null, title: `🎯 Drill Topik Lemah: ${lemah.map(([m, t]) => t).join(", ")}` });
}

// ---------- Kuis (paket/harian/review): jawaban tersimpan otomatis ----------
function bumpStreak() { if (ST.last !== today()) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); ST.streak = ST.last === y ? ST.streak + 1 : 1; ST.last = today(); } }
function kuis(soal, o, ulang) {
  keluar(); clearInterval(timerId);
  const key = o.key, done = key && !ulang ? ST.hasil[key] : null;
  const src = done && done.pil ? done : key && !ulang && ST.draft[key] ? ST.draft[key] : null;
  const pil = src ? Object.assign({}, src.pil) : {}; const log = src ? src.log.slice() : [];
  if (key && ulang) delete ST.draft[key];
  app.innerHTML = `<div class="card"><div class="row"><b>${o.title}</b><span class="mut" id="cnt"></span></div><div class="bar" style="margin-top:8px"><i id="pg" style="width:0"></i></div>
  <div id="skor" class="mut" style="margin-top:8px"></div>${done ? `<button class="btn sec" id="ulang" style="margin-top:10px">🔄 Ulangi dari awal</button>` : ""}</div>
  <div class="card">${soal.map((q, i) => `<div class="qi" id="q${i}"><span class="lvl l${q.level}">${i + 1}. ${q.topik}</span><div class="q">${q.q}</div>${q.img ? `<div class="img">${q.img}</div>` : ""}${q.opsi.map((x, j) => `<button class="opt${DM(q, j)}" data-i="${i}" data-j="${j}"><b>${"ABCD"[j]}.</b> ${x}</button>`).join("")}<div class="fb"></div></div>`).join("")}
  <br><button class="btn full" id="fin" disabled>Selesai & lihat nilai</button></div>`;
  const tampil = (i) => { const q = soal[i], j = pil[i], ok = j === q.jawab, box = $("#q" + i);
    box.querySelectorAll(".opt").forEach((x, k) => { x.disabled = true; if (k === q.jawab) x.classList.add("ok"); else if (k === j) x.classList.add("no"); });
    box.querySelector(".fb").innerHTML = `<div class="bahas"><b>${ok ? "✅ Benar!" : "❌ Belum tepat."}</b> ${q.bahas}</div>`; };
  const update = () => { const n = Object.keys(pil).length, benar = Object.entries(pil).filter(([i, j]) => soal[i].jawab === j).length;
    $("#cnt").textContent = `${n}/${soal.length} dijawab`; $("#pg").style.width = (n / soal.length) * 100 + "%";
    $("#skor").innerHTML = n ? `${done ? "Skor" : "Skor sementara"}: <b>${benar} benar</b> dari ${n} soal${n < soal.length && key ? " · jawaban tersimpan otomatis, bisa dilanjutkan nanti" : ""}` : "";
    $("#fin").disabled = n < soal.length || !!done; if (done) $("#fin").textContent = `✅ Sudah selesai · Nilai ${done.nilai}`; };
  Object.keys(pil).forEach((i) => tampil(+i)); update();
  const first = soal.findIndex((_, i) => !(i in pil)); if (Object.keys(pil).length && first > 0 && !done) setTimeout(() => { $("#q" + first).scrollIntoView({ block: "start" }); scrollBy(0, -80); }, 50); else scrollTo(0, 0);
  if (done) $("#ulang").onclick = () => kuis(soal, o, true);
  app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
    const i = +b.dataset.i, j = +b.dataset.j, q = soal[i]; if (i in pil) return; pil[i] = j; const ok = j === q.jawab;
    log.push({ id: q.id, ok, topik: q.topik, mapel: q.mapel }); if (ok) delete ST.salah[q.id]; else ST.salah[q.id] = 1;
    if (key) ST.draft[key] = { pil, log, tgl: today() }; bumpStreak();
    save(); tampil(i); update();
  }));
  $("#fin").onclick = () => {
    const benar = log.filter((l) => l.ok).length, nilai = Math.round((benar / soal.length) * 100);
    if (key) { ST.hasil[key] = { nilai, log, pil, tgl: today() }; delete ST.draft[key]; }
    save(); const bintang = nilai >= 90 ? "⭐⭐⭐" : nilai >= 70 ? "⭐⭐" : nilai >= 50 ? "⭐" : "💪";
    app.innerHTML = `<div class="card" style="text-align:center"><div class="big">${bintang}</div><h2>Nilai ${nilai}</h2><p>${benar} dari ${soal.length} soal benar.</p><p class="mut">${nilai >= 70 ? "Keren! Pertahankan ya." : "Tidak apa-apa, soal yang salah tersimpan di menu Ulang Soal Salah."}</p><button class="btn full" id="bk">Kembali ke beranda</button></div>`;
    $("#bk").onclick = home; scrollTo(0, 0);
  };
}
function review() { const s = Object.keys(ST.salah).map((id) => BYID[id]).filter(Boolean).slice(0, 10); if (s.length) kuis(s, { key: null, title: "🔁 Ulang soal salah" }); }

// ---------- Kode akses, lisensi, watermark ----------
async function sha(t) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function cekKode(kode) {
  if (window.KODE_HASH) { try { return window.KODE_HASH.includes(await sha(kode)); } catch { return false; } }
  try { const r = await fetch("/api/verify", { method: "POST", body: JSON.stringify({ kode }) }); return (await r.json()).ok; } catch { return false; }
}
const LISENSI_URL = "";
const devId = () => ST.dev || (ST.dev = Math.random().toString(36).slice(2, 10));
async function server(aksi, data) { if (!LISENSI_URL) return null; try { const r = await fetch(LISENSI_URL, { method: "POST", body: JSON.stringify(Object.assign({ aksi, kode: await sha(ST.kode), dev: devId() }, data || {})) }); return await r.json(); } catch { return null; } }
function watermark() {
  document.getElementById("lic").textContent = ST.nama ? `Lisensi: ${ST.nama}${ST.kode ? " · " + ST.kode : ""}` : "";
  let w = document.getElementById("wm"); if (!ST.nama) { if (w) w.remove(); return; }
  if (!w) { w = document.createElement("div"); w.id = "wm"; document.body.appendChild(w); }
  const t = `Lisensi: ${esc(ST.nama)}${ST.kode ? " · " + ST.kode : ""}`; w.innerHTML = Array.from({ length: 14 }, () => `<span>${t}</span>`).join("");
}
function aktivasi() {
  $("#homeBtn").hidden = true;
  app.innerHTML = `<div class="card"><h2>🔐 Masukkan Kode Akses</h2><p>Kode akses ada di <b>halaman member (LMS) Toolkit Parenting</b> setelah pembayaran terkonfirmasi. Cukup sekali aktivasi per perangkat.</p><p class="mut">Belum bisa masuk halaman member? Cek email dari Scalev (juga folder spam/promosi), atau hubungi admin Toolkit Parenting dengan nomor pesanan.</p>
  <input id="kd" placeholder="Kode dari halaman member" autocapitalize="characters"><br><br><button class="btn full" id="ak">Aktifkan</button><p id="msg" class="mut"></p></div>`;
  $("#ak").onclick = async () => { const k = $("#kd").value.trim().toUpperCase(); $("#msg").textContent = "Memeriksa..."; if (await cekKode(k)) { ST.kode = k; const r = await server("cek"); if (r && r.ok === false) { ST.kode = ""; $("#msg").textContent = "❌ " + r.pesan; return; } if (r && r.nama) ST.nama = r.nama; save(); home(); } else $("#msg").textContent = "❌ Kode tidak valid. Periksa lagi atau hubungi penjual."; };
}
const PEMBUAT = "Toolkit Parenting (toolkitparenting.my.id)";
const LEGAL = `<div class="legal"><b>⚖️ Hak Cipta & Lisensi Penggunaan</b><br>© ${new Date().getFullYear()} ${PEMBUAT}. Seluruh soal, materi, gambar, dan aplikasi ini dilindungi <b>Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta</b>.
<ul><li>Lisensi ini <b>hanya untuk penggunaan pribadi</b> oleh satu keluarga pembeli. Mencetak untuk anak sendiri diperbolehkan.</li>
<li><b>Dilarang</b> menyebarkan, membagikan kode akses, menggandakan, mengunggah ulang, menjual kembali, atau memakai untuk bimbel/les berbayar tanpa izin tertulis.</li>
<li>Pasal 9 UU Hak Cipta: penggandaan, pendistribusian, dan pengumuman ciptaan hanya boleh dilakukan pencipta/pemegang hak cipta atau dengan izinnya.</li>
<li>Pasal 113 ayat (3): pelanggaran hak ekonomi untuk penggunaan secara komersial diancam <b>pidana penjara paling lama 4 tahun dan/atau denda paling banyak Rp1.000.000.000</b>.</li>
<li>Setiap kode akses tercatat atas nama pembeli dan tertera pada hasil cetak. Kode yang terbukti disebarkan dapat dinonaktifkan tanpa pengembalian dana.</li></ul></div>`;
function tentang(first) {
  if (first) $("#homeBtn").hidden = true; else keluar();
  const isi = DRILL
    ? `<p><i>Drill intensif menjelang ujian: paket bertahap, simulasi bertimer, langsung tahu topik lemah.</i></p><p><b>${PRODUK}</b> adalah program persiapan ujian akhir SD di rumah. Isinya <b>${HEMAT ? "320 soal pilihan</b> (80 per mapel)" : "4.000 soal</b> (1.000 per mapel)"} Matematika, Bahasa Indonesia, Bahasa Inggris, dan IPA kelas 6 Kurikulum Merdeka Fase C, termasuk pengulangan materi kelas 4–5 yang sering keluar di ujian, lengkap dengan pembahasan dan ringkasan materi.</p><p>Fitur: <b>${NP * 4} paket drill</b> (${NP} per mapel), <b>${N_SIM * 5} simulasi ujian bertimer</b>, drill topik lemah otomatis, dan hitung mundur ke tanggal ujian. Ini latihan, bukan soal ujian sebenarnya dan bukan jaminan nilai.</p>`
    : `<p><i>Kerjakan, langsung dikoreksi, langsung dibahas. 4 mapel, 40 menit sehari.</i></p><p><b>${PRODUK}</b> adalah program belajar mandiri di rumah sebagai alternatif les bulanan. Isinya <b>4.000 soal</b> (1.000 per mapel) Matematika, Bahasa Indonesia, Bahasa Inggris, dan IPA kelas 6 Kurikulum Merdeka Fase C, lengkap dengan pembahasan dan ringkasan materi.</p><p>Anak cukup belajar <b>±40 menit sehari selama 100 hari</b>. Tingkat kesulitan naik bertahap: hari 1–35 dasar, 36–70 menengah, 71–100 mahir (HOTS).</p>`;
  app.innerHTML = `<div class="card"><h2>📚 Tentang Produk Ini</h2>${isi}<p><b>Dibuat oleh:</b> ${PEMBUAT}.</p>${LEGAL}
  ${first ? `<label style="display:flex;gap:8px;margin-top:12px"><input type="checkbox" id="agr" style="width:auto"> Saya memahami dan menyetujui ketentuan penggunaan pribadi di atas.</label><br><button class="btn full" id="ok" disabled>Lanjut</button>` : ""}</div>`;
  if (first) { $("#agr").onchange = (e) => ($("#ok").disabled = !e.target.checked); $("#ok").onclick = () => { ST.setuju = 1; save(); home(); }; }
}
function setup() {
  app.innerHTML = `<div class="card"><h2>Selamat datang! 🎉</h2><p>${DRILL ? `Persiapan ujian SD kelas 6: <b>${HEMAT ? "320" : "4.000"} soal</b>, ${NP * 4} paket drill, dan ${N_SIM * 5} simulasi ujian bertimer.` : "Latihan 10 soal per mapel setiap hari selama 100 hari: <b>4.000 soal</b> kelas 6, level naik di hari ke-36 dan ke-71."}</p>
  <label><b>Nama ANAK yang akan belajar</b> (bukan nama ayah/ibu)<input id="nm" placeholder="contoh: Rafi Pratama"></label><p class="mut">👧🧒 Isi dengan nama siswa kelas 6 yang akan mengerjakan soal. Nama ini tampil di rapor.</p><p class="mut">⚠️ Nama dikunci sebagai pemilik lisensi dan tercetak di setiap lembar. Pastikan sudah benar.</p><br><button class="btn full" id="go">Mulai Belajar</button></div>`;
  $("#go").onclick = async () => { const v = $("#nm").value.trim(); if (!v) return; if (!confirm(`Nama anak: "${v}"\n\nPastikan ini nama ANAK, bukan nama orang tua. Nama tidak bisa diubah. Lanjutkan?`)) return; const r = await server("kunci", { nama: v }); ST.nama = (r && r.nama) || v; save(); home(); };
}
function materi(m) {
  keluar();
  if (!m) { app.innerHTML = `<div class="card"><h2>📘 Materi</h2><p class="mut">Ringkasan materi kelas 6 (dan pengulangan untuk ujian).</p><div class="grid">${Object.entries(MAPEL).map(([k, [n, ic]]) => `<button class="mapel" data-mm="${k}"><span class="ic">${ic}</span><b>${n}</b><small>${MATERI[k].length} bab</small></button>`).join("")}</div></div>`; app.querySelectorAll("[data-mm]").forEach((b) => (b.onclick = () => materi(b.dataset.mm))); return; }
  app.innerHTML = `<div class="card mat"><h2>${MAPEL[m][1]} Materi ${MAPEL[m][0]}</h2><button class="btn sec" id="pm">🖨️ Cetak materi</button>${MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join("")}</div>`;
  $("#pm").onclick = () => cetakHTML(`<h2>Materi ${MAPEL[m][0]} Kelas 6</h2>` + MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join("")); scrollTo(0, 0);
}
function cetakMenu() {
  keluar();
  if (HEMAT) {
    app.innerHTML = `<div class="card"><h2>🖨️ Cetak</h2><button class="btn full" id="ca">Cetak SEMUA soal (320 soal + kunci & pembahasan)</button><br><br><button class="btn full sec" id="c3">Cetak ringkasan materi 4 mapel</button>
    <p class="mut">Tips: pilih “Simpan sebagai PDF” di jendela cetak untuk menyimpan file. Urutan: 32 paket (per mapel), lalu kunci & pembahasan.</p></div>`;
    $("#ca").onclick = () => { let soal = "", kunci = ""; for (const m in MAPEL) for (let k = 1; k <= NP; k++) { const s = soalPaket(m, k), j = `${MAPEL[m][0]} · Paket ${k} (${["", "Dasar", "Menengah", "HOTS"][paketLevel(k)]})`;
      soal += `<h2 style="break-before:page">${j}</h2><p>Nama: ______________ Tanggal: ________ Nilai: ____</p>` + lembar(s); kunci += `<h3>${j}</h3>` + s.map((q, i) => `<p><b>${i + 1}. ${"abcd"[q.jawab].toUpperCase()}</b> — ${q.bahas}</p>`).join(""); }
      cetakHTML(soal + `<h2 style="break-before:page">Kunci Jawaban & Pembahasan</h2>` + kunci); };
    $("#c3").onclick = () => cetakHTML(Object.keys(MAPEL).map((m) => `<h2>Materi ${MAPEL[m][0]} Kelas 6</h2>` + MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join("")).join(""));
    return;
  }
  const pertama = DRILL ? `<label>Cetak paket drill<select id="pm2">${Object.entries(MAPEL).map(([k, [n]]) => `<option value="${k}">${n}</option>`).join("")}</select></label><label>Nomor paket<select id="pk">${Array.from({ length: NP }, (_, i) => `<option>${i + 1}</option>`).join("")}</select></label><br><br><button class="btn full" id="c1">Cetak paket (${PER_PAKET} soal + kunci)</button><br><br><label>Simulasi<select id="sm2"><option value="MIX">Campuran</option>${Object.entries(MAPEL).map(([k, [n]]) => `<option value="${k}">${n}</option>`).join("")}</select></label><label>Nomor<select id="sn">${Array.from({ length: N_SIM }, (_, i) => `<option>${i + 1}</option>`).join("")}</select></label><br><br><button class="btn full" id="c4">Cetak simulasi (40 soal + kunci)</button>` : `<p><button class="btn full" id="c1">Soal hari ke-${pilihHari || hariAktif()} (4 mapel + kunci)</button></p>`;
  app.innerHTML = `<div class="card"><h2>🖨️ Cetak</h2>${pertama}<hr style="margin:16px 0;border:0;border-top:1px solid var(--line)">
  <label>Cetak semua soal satu mapel<select id="cm">${Object.entries(MAPEL).map(([k, [n]]) => `<option value="${k}">${n}</option>`).join("")}</select></label>
  <label>Level<select id="cl">${[1, 2, 3].map((l) => `<option value="${l}">Level ${l} (${BANK.MTK.filter((q) => q.level === l).length} soal)</option>`).join("")}</select></label><br><br>
  <button class="btn full sec" id="c2">Cetak soal + kunci jawaban</button><br><br><button class="btn full sec" id="c3">Cetak semua materi 4 mapel</button>
  <p class="mut">Tips: pilih “Simpan sebagai PDF” di jendela cetak untuk menyimpan file.</p></div>`;
  if (DRILL) { $("#c1").onclick = () => { const m = $("#pm2").value, k = +$("#pk").value; cetakSoal(`${MAPEL[m][0]} — Paket ${k}`, soalPaket(m, k)); }; $("#c4").onclick = () => { const m = $("#sm2").value, n = +$("#sn").value; cetakSoal(`Simulasi ${m === "MIX" ? "Campuran" : MAPEL[m][0]} #${n}`, soalSim(m, n)); }; }
  else $("#c1").onclick = () => cetakHari(pilihHari || hariAktif());
  $("#c2").onclick = () => { const m = $("#cm").value, lv = +$("#cl").value; cetakSoal(`${MAPEL[m][0]} — Level ${lv}`, BANK[m].filter((q) => q.level === lv)); };
  $("#c3").onclick = () => cetakHTML(Object.keys(MAPEL).map((m) => `<h2>Materi ${MAPEL[m][0]} Kelas 6</h2>` + MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join("")).join(""));
}
function cetakHTML(h) { $("#print").innerHTML = h + `<div class="wm">© ${PEMBUAT} · Lisensi pribadi ${esc(ST.nama || "")} ${ST.kode ? "· " + ST.kode : ""} · Dilarang disebarluaskan (UU No. 28 Th. 2014)</div>`; window.print(); }
const lembar = (s) => s.map((q, i) => `<div class="pq"><b>${i + 1}.</b> ${q.q}${q.img ? `<div>${q.img}</div>` : ""}<div>${q.opsi.map((o, j) => `${"abcd"[j]}. ${o}`).join("&nbsp;&nbsp;&nbsp; ")}</div></div>`).join("");
function cetakSoal(judul, s) { cetakHTML(`<h2>${judul}</h2><p>Nama: ______________ Tanggal: ________</p>` + lembar(s) + `<h2>Kunci Jawaban — ${judul}</h2><p>${s.map((q, i) => `${i + 1}${"abcd"[q.jawab]}`).join(", ")}</p>`); }
function cetakHari(d) { let h = "", kunci = ""; for (const [k, [n]] of Object.entries(MAPEL)) { const s = soalHari(k, d); h += `<h2>${n} — Hari ke-${d}</h2><p>Nama: ______________ Tanggal: ________</p>` + lembar(s); kunci += `<p><b>${n}:</b> ${s.map((q, i) => `${i + 1}${"abcd"[q.jawab]}`).join(", ")}</p>`; } cetakHTML(h + `<h2>Kunci Jawaban Hari ke-${d}</h2>` + kunci); }
function rapor() {
  keluar(); const tp = {};
  const sumber = [...Object.values(ST.hasil), ...Object.values(ST.draft), ...Object.values(ST.sim)];
  for (const h of sumber) for (const l of h.log || []) { const k = MAPEL[l.mapel][0] + " — " + l.topik; tp[k] = tp[k] || [0, 0]; tp[k][1]++; if (l.ok) tp[k][0]++; }
  const rataM = (m) => { const ls = sumber.flatMap((h) => (h.log || []).filter((l) => l.mapel === m)); return ls.length ? Math.round((ls.filter((l) => l.ok).length / ls.length) * 100) : "-"; };
  const lemah = Object.entries(tp).filter(([, v]) => v[1] >= 3).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 8);
  const sims = Object.entries(ST.sim).sort((a, b) => (a[1].tgl < b[1].tgl ? -1 : 1));
  app.innerHTML = `<div class="card"><h2>📊 Rapor ${esc(ST.nama)}</h2><table><tr><th>Mapel</th><th>% benar</th></tr>${Object.entries(MAPEL).map(([k, [n]]) => `<tr><td>${n}</td><td><b>${rataM(k)}</b></td></tr>`).join("")}</table></div>
  ${DRILL ? `<div class="card"><h3>Riwayat simulasi ujian</h3>${sims.length ? `<table>${sims.map(([k, h]) => `<tr><td>${k.startsWith("MIX") ? "Campuran" : MAPEL[k.split("-")[0]][0]} #${k.split("-")[1]}</td><td>${h.tgl}</td><td><b>${h.nilai}</b></td></tr>`).join("")}</table>` : `<p class="mut">Belum ada simulasi. Coba 1 simulasi setiap akhir pekan.</p>`}</div>` : ""}
  <div class="card"><h3>Topik yang perlu dilatih lagi</h3>${lemah.length ? `<table>${lemah.map(([k, v]) => `<tr><td>${k}</td><td>${Math.round((v[0] / v[1]) * 100)}% benar</td></tr>`).join("")}</table>` : `<p class="mut">Kerjakan beberapa latihan dulu agar terlihat polanya.</p>`}</div>
  <div class="card"><button class="btn sec" id="rst">Hapus nilai & progres</button><p class="mut">Nama anak terkunci sebagai pemilik lisensi dan tidak ikut terhapus.</p></div>`;
  $("#rst").onclick = () => { if (confirm("Hapus semua nilai dan progres? Nama tetap tersimpan.")) { ST = { nama: ST.nama, hasil: {}, salah: {}, draft: {}, sim: {}, streak: 0, last: "", kode: ST.kode, setuju: ST.setuju, ujian: ST.ujian }; save(); home(); } };
}
function ortu() {
  keluar();
  const tips = DRILL
    ? `<li><b>Isi tanggal ujian</b> di beranda. Ikuti target paket per hari.</li><li><b>Hari biasa:</b> ${HEMAT ? "2–3 paket drill (±20–30 menit)" : "1–2 paket drill (±25–40 menit)"}. Baca pembahasan setiap soal.</li><li><b>Akhir pekan:</b> 1 simulasi ujian bertimer, lalu bahas soal yang salah bersama.</li><li>Setelah simulasi, klik <b>🎯 Drill Topik Lemah</b> untuk menambal topik dengan nilai terendah.</li><li>Seminggu sebelum ujian: ulang simulasi campuran dan baca 📘 Materi.</li>`
    : `<li><b>Rutin 30–40 menit sehari.</b> 4 mapel × 10 soal.</li><li><b>Biarkan anak membaca pembahasan</b> setiap selesai menjawab.</li><li><b>Akhir pekan:</b> buka “Ulang soal salah” dan “Rapor”, fokuskan bantuan pada topik terendah.</li><li><b>Level naik bertahap:</b> hari 1–35 dasar, 36–70 menengah, 71–100 HOTS.</li>`;
  app.innerHTML = `<div class="card"><h2>👪 Panduan Orang Tua</h2><ol>${tips}</ol>
  <h3>Cakupan materi</h3><p class="mut">Matematika: bilangan bulat, operasi campuran, pangkat & akar, pecahan–desimal–persen, KPK–FPB, perbandingan, kecepatan & debit, lingkaran, volume & luas permukaan (kubus, balok, prisma, tabung), koordinat, statistika.<br>Bahasa Indonesia: ide pokok, simpulan, informasi teks, konjungsi, kalimat efektif, kalimat langsung/tidak langsung, pidato–iklan–slogan, surat resmi, puisi, kata baku, imbuhan.<br>Bahasa Inggris: simple past, future, comparison, health problems, countries, directions, shapes, hobbies, shopping, reading.<br>IPA: tata surya, rotasi–revolusi–gerhana, perkembangbiakan, pubertas, perubahan wujud, pesawat sederhana & gaya, listrik statis, energi, pelestarian lingkungan, pengulangan kelas 4–5.</p></div>`;
}
// Tombol back HP/browser kembali ke beranda aplikasi, bukan keluar halaman.
function keluar() { $("#homeBtn").hidden = false; if (!(history.state && history.state.sub)) try { history.pushState({ sub: 1 }, ""); } catch {} }
window.addEventListener("popstate", () => { pilihHari = null; clearInterval(timerId); home(); scrollTo(0, 0); });
$("#homeBtn").onclick = () => { if (history.state && history.state.sub) return history.back(); pilihHari = null; clearInterval(timerId); home(); };
// ---------- Mode DEMO (untuk rekam layar konten): progres anak terisi otomatis dengan nilai wajar ----------
// Peluang benar per level: Dasar 80%, Menengah 65%, HOTS 45% (rata-rata kira-kira 65–75, seperti anak kelas 6 pada umumnya).
function seedDemo() {
  const r = CORE.rng(2611), PELUANG = [0, 0.8, 0.65, 0.45];
  const isi = (soal) => { const pil = {}, log = []; soal.forEach((q, i) => { const ok = r() < PELUANG[q.level]; pil[i] = ok ? q.jawab : (q.jawab + 1 + Math.floor(r() * 3)) % 4; log.push({ id: q.id, ok, topik: q.topik, mapel: q.mapel }); }); return { pil, log, benar: log.filter((l) => l.ok).length }; };
  ST = { nama: window.DEMO_NAMA || "Nama Anak", setuju: 1, hasil: {}, salah: {}, draft: {}, sim: {}, streak: 6, last: today(), demoSeed: 2, ujian: new Date(Date.now() + 12 * 864e5).toISOString().slice(0, 10) };
  const selesai = { MTK: 5, BIND: 4, BING: 4, IPA: 3 };
  for (const m in selesai) for (let k = 1; k <= selesai[m]; k++) { const s = soalPaket(m, k), h = isi(s); h.log.forEach((l) => (l.ok ? delete ST.salah[l.id] : (ST.salah[l.id] = 1))); ST.hasil[`P-${m}-${k}`] = { nilai: Math.round((h.benar / s.length) * 100), pil: h.pil, log: h.log, tgl: today() }; }
  { const s = soalPaket("MTK", 6), h = isi(s.slice(0, 4)); ST.draft["P-MTK-6"] = { pil: h.pil, log: h.log }; } // paket 6 sedang dikerjakan
  for (const [m, n, menit] of [["MIX", 1, 54], ["MTK", 1, 58]]) { const s = soalSim(m, n), h = isi(s); h.log.forEach((l) => { if (!l.ok) ST.salah[l.id] = 1; }); ST.sim[`${m}-${n}`] = { nilai: Math.round((h.benar / s.length) * 100), pil: h.pil, log: h.log, tgl: today(), menit }; }
  save();
}
if (window.DEMO && ST.demoSeed !== 2) seedDemo();
home();
