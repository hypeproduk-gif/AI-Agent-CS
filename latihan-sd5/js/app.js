// Aplikasi latihan harian: 100 hari x 10 soal x 4 mapel. Level naik di hari 36 dan 71.
const MAPEL = { MTK: ["Matematika", "🔢"], BIND: ["Bahasa Indonesia", "📖"], BING: ["Bahasa Inggris", "🇬🇧"], IPA: ["IPA", "🔬"] };
const PER_HARI = 10, HARI = 100;
const LEVEL = [null, { nama: "Level 1 · Dasar", mulai: 1 }, { nama: "Level 2 · Menengah", mulai: 36 }, { nama: "Level 3 · Mahir (HOTS)", mulai: 71 }];
const BANK = {}; for (const k in MAPEL) BANK[k] = GEN[k]();
const $ = (s) => document.querySelector(s); const app = $("#app");
const store = { get() { try { return JSON.parse(localStorage.getItem("sd5") || "{}"); } catch { return {}; } }, set(v) { try { localStorage.setItem("sd5", JSON.stringify(v)); } catch {} } };
let ST = Object.assign({ nama: "", hasil: {}, salah: {}, streak: 0, last: "" }, store.get());
const save = () => store.set(ST);
const levelHari = (d) => (d >= 71 ? 3 : d >= 36 ? 2 : 1);
// Soal hari ke-d: level 1 = 350 soal untuk hari 1-35, level 2 = 350 untuk hari 36-70, level 3 = 300 untuk hari 71-100
function soalHari(m, d) { const lv = levelHari(d); const pool = BANK[m].filter((q) => q.level === lv); const i = (d - LEVEL[lv].mulai) * PER_HARI; return pool.slice(i, i + PER_HARI); }
const hariSelesai = (d) => Object.keys(MAPEL).every((m) => ST.hasil[m + d]);
const hariAktif = () => { for (let d = 1; d <= HARI; d++) if (!hariSelesai(d)) return d; return HARI; };
let pilihHari = null;
const today = () => new Date().toISOString().slice(0, 10);
function home() {
  $("#homeBtn").hidden = true;
  if (!window.PREVIEW && !ST.kode && location.protocol.startsWith("http") && !/localhost|127\.0\.0\.1/.test(location.hostname)) return aktivasi();
  if (!ST.nama) return setup();
  const d = pilihHari || hariAktif(); const lv = levelHari(d);
  const selesai = Array.from({ length: HARI }, (_, i) => hariSelesai(i + 1)).filter(Boolean).length;
  const salahN = Object.values(ST.salah).length;
  app.innerHTML = `
  <div class="card"><div class="row"><div><div class="mut">Halo, ${esc(ST.nama)} 👋</div><b style="font-size:22px">Hari ke-${d}</b> <span class="lvl l${lv}">${LEVEL[lv].nama}</span></div><div style="text-align:right"><div class="big">🔥${ST.streak}</div><div class="mut">hari beruntun</div></div></div>
  <div class="mut" style="margin:10px 0 4px">Progres ${selesai}/${HARI} hari</div><div class="bar"><i style="width:${selesai}%"></i></div></div>
  <div class="grid">${Object.entries(MAPEL).map(([k, [n, ic]]) => { const h = ST.hasil[k + d]; return `<button class="mapel ${h ? "done" : ""}" data-m="${k}"><span class="ic">${ic}</span><b>${n}</b><small>${h ? `✅ Nilai ${h.nilai} · ulangi` : `${PER_HARI} soal · ±10 menit`}</small></button>`; }).join("")}</div>
  <div class="card" style="margin-top:14px"><b>Pilih hari</b> <span class="mut">(hijau = selesai)</span><div class="days" style="margin-top:8px">${Array.from({ length: HARI }, (_, i) => `<button class="${hariSelesai(i + 1) ? "d" : ""} ${i + 1 === d ? "c" : ""}" data-d="${i + 1}">${i + 1}</button>`).join("")}</div>
  <div class="mut" style="margin-top:8px">Hari 1–35: Level 1 · Hari 36–70: Level 2 · Hari 71–100: Level 3</div></div>
  <div class="grid"><button class="btn sec" id="review" ${salahN ? "" : "disabled"}>🔁 Ulang soal salah (${salahN})</button><button class="btn sec" id="rapor">📊 Rapor</button><button class="btn sec" id="cetak">🖨️ Cetak soal hari ini</button><button class="btn sec" id="ortu">👪 Panduan orang tua</button></div>`;
  app.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => kuis(b.dataset.m, soalHari(b.dataset.m, d), d)));
  app.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { pilihHari = +b.dataset.d; home(); }));
  $("#review").onclick = review; $("#rapor").onclick = rapor; $("#cetak").onclick = () => cetak(d); $("#ortu").onclick = ortu;
}
// ---- Kode akses ----
async function cekKode(kode) {
  try { const r = await fetch("/api/verify", { method: "POST", body: JSON.stringify({ kode }) }); return (await r.json()).ok; } catch { return false; }
}
function aktivasi() {
  $("#homeBtn").hidden = true;
  app.innerHTML = `<div class="card"><h2>🔐 Masukkan Kode Akses</h2><p>Kode akses dikirim setelah pembelian. Cukup sekali aktivasi per perangkat.</p>
  <input id="kd" placeholder="SD5-XXXX-XXXX" autocapitalize="characters"><br><br><button class="btn full" id="ak">Aktifkan</button><p id="msg" class="mut"></p></div>`;
  $("#ak").onclick = async () => { const k = $("#kd").value.trim().toUpperCase(); $("#msg").textContent = "Memeriksa..."; if (await cekKode(k)) { ST.kode = k; save(); home(); } else $("#msg").textContent = "❌ Kode tidak valid. Periksa lagi atau hubungi penjual."; };
}
function setup() {
  app.innerHTML = `<div class="card"><h2>Selamat datang! 🎉</h2><p>Latihan 10 soal per mapel setiap hari selama 100 hari: <b>4.000 soal</b> Matematika, Bahasa Indonesia, Bahasa Inggris, dan IPA sesuai Kurikulum Merdeka kelas 5. Tingkat kesulitan naik di hari ke-36 dan ke-71.</p>
  <label>Nama anak<input id="nm" placeholder="contoh: Rafi"></label><br><br><button class="btn full" id="go">Mulai Belajar</button></div>`;
  $("#go").onclick = () => { const v = $("#nm").value.trim(); if (v) { ST.nama = v; save(); home(); } };
}
function kuis(m, soal, d, isReview) {
  $("#homeBtn").hidden = false; let i = 0, benar = 0; const log = [];
  const show = () => {
    const q = soal[i];
    app.innerHTML = `<div class="card"><div class="row"><b>${MAPEL[q.mapel][1]} ${MAPEL[q.mapel][0]}</b><span class="mut">${i + 1}/${soal.length}</span></div><div class="bar" style="margin:8px 0"><i style="width:${(i / soal.length) * 100}%"></i></div>
    <span class="lvl l${q.level}">${q.topik}</span><div class="q">${q.q}</div>${q.img ? `<div class="img">${q.img}</div>` : ""}
    ${q.opsi.map((o, j) => `<button class="opt" data-j="${j}"><b>${"ABCD"[j]}.</b> ${o}</button>`).join("")}<div id="fb"></div></div>`;
    app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => jawab(+b.dataset.j)));
  };
  const jawab = (j) => {
    const q = soal[i]; const ok = j === q.jawab; if (ok) benar++;
    log.push({ id: q.id, ok, topik: q.topik, mapel: q.mapel });
    if (ok) delete ST.salah[q.id]; else ST.salah[q.id] = 1;
    app.querySelectorAll(".opt").forEach((b, k) => { b.disabled = true; if (k === q.jawab) b.classList.add("ok"); else if (k === j) b.classList.add("no"); });
    $("#fb").innerHTML = `<div class="bahas"><b>${ok ? "✅ Benar! Hebat!" : "❌ Belum tepat."}</b><br>${q.bahas}</div><br><button class="btn full" id="nx">${i + 1 < soal.length ? "Lanjut ➜" : "Lihat hasil"}</button>`;
    $("#nx").onclick = () => { i++; i < soal.length ? show() : selesai(); }; $("#nx").scrollIntoView({ behavior: "smooth", block: "nearest" });
    save();
  };
  const selesai = () => {
    const nilai = Math.round((benar / soal.length) * 100);
    if (!isReview) {
      ST.hasil[m + d] = { nilai, log, tgl: today() };
      if (ST.last !== today()) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); ST.streak = ST.last === y ? ST.streak + 1 : 1; ST.last = today(); }
    }
    save();
    const bintang = nilai >= 90 ? "⭐⭐⭐" : nilai >= 70 ? "⭐⭐" : nilai >= 50 ? "⭐" : "💪";
    app.innerHTML = `<div class="card" style="text-align:center"><div class="big">${bintang}</div><h2>Nilai ${nilai}</h2><p>${benar} dari ${soal.length} soal benar.</p><p class="mut">${nilai >= 70 ? "Keren! Pertahankan ya." : "Tidak apa-apa, soal yang salah tersimpan di menu Ulang Soal Salah."}</p><button class="btn full" id="bk">Kembali ke beranda</button></div>`;
    $("#bk").onclick = home;
  };
  show();
}
function review() {
  const all = Object.values(BANK).flat(); const ids = new Set(Object.keys(ST.salah));
  const s = all.filter((q) => ids.has(q.id)).slice(0, 10); if (s.length) kuis(null, s, 0, true);
}
function rapor() {
  $("#homeBtn").hidden = false; const tp = {};
  for (const h of Object.values(ST.hasil)) for (const l of h.log) { const k = MAPEL[l.mapel][0] + " — " + l.topik; tp[k] = tp[k] || [0, 0]; tp[k][1]++; if (l.ok) tp[k][0]++; }
  const rata = (m) => { const v = Object.entries(ST.hasil).filter(([k]) => k.startsWith(m) && !isNaN(k.slice(m.length))).map(([, h]) => h.nilai); return v.length ? Math.round(v.reduce((a, b) => a + b) / v.length) : "-"; };
  const lemah = Object.entries(tp).filter(([, v]) => v[1] >= 3).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 8);
  app.innerHTML = `<div class="card"><h2>📊 Rapor ${esc(ST.nama)}</h2><table><tr><th>Mapel</th><th>Rata-rata</th></tr>${Object.entries(MAPEL).map(([k, [n]]) => `<tr><td>${n}</td><td><b>${rata(k)}</b></td></tr>`).join("")}</table></div>
  <div class="card"><h3>Topik yang perlu dilatih lagi</h3>${lemah.length ? `<table>${lemah.map(([k, v]) => `<tr><td>${k}</td><td>${Math.round((v[0] / v[1]) * 100)}% benar</td></tr>`).join("")}</table>` : `<p class="mut">Kerjakan minimal beberapa hari dulu agar terlihat polanya.</p>`}</div>
  <div class="card"><button class="btn sec" id="rst">Hapus semua progres</button></div>`;
  $("#rst").onclick = () => { if (confirm("Hapus semua progres?")) { ST = { nama: "", hasil: {}, salah: {}, streak: 0, last: "", kode: ST.kode }; save(); home(); } };
}
function ortu() {
  $("#homeBtn").hidden = false;
  app.innerHTML = `<div class="card"><h2>👪 Panduan Orang Tua</h2><ol>
  <li><b>Rutin 30–40 menit sehari.</b> 4 mapel × 10 soal. Lebih efektif daripada les 2× seminggu yang panjang.</li>
  <li><b>Biarkan anak membaca pembahasan</b> setiap selesai menjawab — di situ belajarnya terjadi.</li>
  <li><b>Akhir pekan:</b> buka “Ulang soal salah” dan “Rapor”, lalu fokuskan bantuan pada topik dengan persentase terendah.</li>
  <li><b>Level naik bertahap:</b> hari 1–35 dasar, 36–70 menengah, 71–100 mahir/soal cerita (HOTS).</li>
  <li><b>Cetak</b> jika anak lebih suka mengerjakan di kertas; kunci jawaban ada di halaman terakhir.</li></ol>
  <h3>Cakupan materi</h3><p class="mut">Matematika: bilangan cacah, pecahan, desimal, persen, KPK–FPB, perbandingan & skala, kecepatan & debit, sudut, luas, volume kubus–balok, penyajian data.<br>Bahasa Indonesia: ide pokok, kalimat utama/penjelas, paragraf deduktif–induktif, informasi teks, fakta–opini, sinonim–antonim, kata baku, imbuhan, majas, huruf kapital, kata tanya.<br>Bahasa Inggris: vocabulary, numbers, days & months, telling time, prepositions, jobs, places, simple present/continuous/past, comparison, reading.<br>IPA: cahaya & mata, bunyi & telinga, ekosistem & rantai makanan, magnet, listrik, energi, bumi & siklus air, organ tubuh.</p></div>`;
}
function cetak(d) {
  let h = "", kunci = "";
  for (const [k, [n]] of Object.entries(MAPEL)) {
    const s = soalHari(k, d);
    h += `<h2>${n} — Hari ke-${d} (${LEVEL[levelHari(d)].nama})</h2><p>Nama: ______________ Tanggal: ________</p>` + s.map((q, i) => `<div class="pq"><b>${i + 1}.</b> ${q.q}${q.img ? `<div>${q.img}</div>` : ""}<div>${q.opsi.map((o, j) => `${"abcd"[j]}. ${o}`).join("&nbsp;&nbsp;&nbsp; ")}</div></div>`).join("");
    kunci += `<p><b>${n}:</b> ${s.map((q, i) => `${i + 1}${"abcd"[q.jawab]}`).join(", ")}</p>`;
  }
  $("#print").innerHTML = h + `<h2>Kunci Jawaban Hari ke-${d}</h2>` + kunci; window.print();
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
$("#homeBtn").onclick = () => { pilihHari = null; home(); };
home();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
