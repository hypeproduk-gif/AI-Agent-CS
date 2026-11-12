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
  watermark();
  $("#homeBtn").hidden = true;
  if (!window.PREVIEW && !ST.kode && (window.KODE_HASH || (location.protocol.startsWith("http") && !/localhost|127\.0\.0\.1/.test(location.hostname)))) return aktivasi();
  if (!ST.setuju) return tentang(true);
  if (!ST.nama) return setup();
  const d = pilihHari || hariAktif(); const lv = levelHari(d);
  const selesai = Array.from({ length: HARI }, (_, i) => hariSelesai(i + 1)).filter(Boolean).length;
  const salahN = Object.values(ST.salah).length;
  app.innerHTML = `
  <div class="card"><div class="row"><div><div class="mut">Halo, ${esc(ST.nama)} 👋</div><b style="font-size:22px">Hari ke-${d}</b> <span class="lvl l${lv}">${LEVEL[lv].nama}</span></div><div style="text-align:right"><div class="big">🔥${ST.streak}</div><div class="mut">hari beruntun</div></div></div>
  <div class="mut" style="margin:10px 0 4px">Progres ${selesai}/${HARI} hari</div><div class="bar"><i style="width:${selesai}%"></i></div></div>
  <details class="card"><summary><b>📌 Cara pakai (1 menit)</b></summary><ol style="margin:8px 0 0;padding-left:20px">
  <li>Kerjakan <b>4 mapel</b> di bawah setiap hari. Satu mapel = 10 soal, ±10 menit.</li>
  <li>Klik mapel → <b>scroll</b> dan pilih jawaban. Benar/salah dan pembahasan langsung muncul. <b>Baca pembahasannya.</b></li>
  <li>Setelah 10 soal terjawab, klik <b>Selesai & lihat nilai</b>. Kartu mapel jadi hijau ✅.</li>
  <li>Jika 4 mapel sudah hijau, aplikasi otomatis pindah ke <b>hari berikutnya</b> (kerjakan besok, 1 hari 1 sesi). Level naik di hari 36 dan 71.</li>
  <li>Bingung materinya? Buka <b>📘 Materi</b> dulu. Akhir pekan, buka <b>🔁 Ulang soal salah</b> dan <b>📊 Rapor</b>.</li>
  <li>Ingin di kertas? Pakai <b>🖨️ Cetak</b>.</li></ol></details>
  <div class="grid">${Object.entries(MAPEL).map(([k, [n, ic]]) => { const h = ST.hasil[k + d], dr = (ST.draft || {})[k + d]; const nb = dr ? dr.log.filter((l) => l.ok).length : 0; return `<button class="mapel ${h ? "done" : ""}" data-m="${k}"><span class="ic">${ic}</span><b>${n}</b><small>${h ? `✅ Nilai ${h.nilai} · lihat jawaban` : dr ? `⏳ ${Object.keys(dr.pil).length}/${PER_HARI} dijawab · ${nb} benar · lanjutkan` : `${PER_HARI} soal · ±10 menit`}</small></button>`; }).join("")}</div>
  <div class="card" style="margin-top:14px"><b>Pilih hari</b> <span class="mut">(hijau = selesai)</span><div class="days" style="margin-top:8px">${Array.from({ length: HARI }, (_, i) => `<button class="${hariSelesai(i + 1) ? "d" : ""} ${i + 1 === d ? "c" : ""}" data-d="${i + 1}">${i + 1}</button>`).join("")}</div>
  <div class="mut" style="margin-top:8px">Hari 1–35: Level 1 · Hari 36–70: Level 2 · Hari 71–100: Level 3</div></div>
  <div class="grid"><button class="btn sec" id="review" ${salahN ? "" : "disabled"}>🔁 Ulang soal salah (${salahN})</button><button class="btn sec" id="rapor">📊 Rapor</button><button class="btn sec" id="materi">📘 Materi</button><button class="btn sec" id="cetak">🖨️ Cetak soal & materi</button><button class="btn sec" id="ortu">👪 Panduan orang tua</button><button class="btn sec" id="ttg">ℹ️ Tentang & hak cipta</button></div><div class="foot">© ${PEMBUAT}<br>Lisensi penggunaan pribadi · Dilarang menyebarluaskan</div>`;
  app.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => kuis(b.dataset.m, soalHari(b.dataset.m, d), d)));
  app.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { pilihHari = +b.dataset.d; home(); }));
  $("#review").onclick = review; $("#rapor").onclick = rapor; $("#cetak").onclick = cetakMenu; $("#materi").onclick = () => materi(); $("#ttg").onclick = () => tentang(); $("#ortu").onclick = ortu;
}
// ---- Kode akses ----
async function sha(t) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function cekKode(kode) {
  // Versi satu file (Scalev): hash kode tertanam di halaman. Versi Netlify: cek ke server.
  if (window.KODE_HASH) { try { return window.KODE_HASH.includes(await sha(kode)); } catch { return false; } }
  try { const r = await fetch("/api/verify", { method: "POST", body: JSON.stringify({ kode }) }); return (await r.json()).ok; } catch { return false; }
}
// ---- Kunci lisensi lintas perangkat (Google Apps Script, opsional) ----
// Isi dengan URL Web App dari tools/lisensi-apps-script.gs. Kosong = hanya terkunci di perangkat ini.
const LISENSI_URL = "";
const devId = () => ST.dev || (ST.dev = Math.random().toString(36).slice(2, 10));
async function server(aksi, data) {
  if (!LISENSI_URL) return null;
  try { const r = await fetch(LISENSI_URL, { method: "POST", body: JSON.stringify(Object.assign({ aksi, kode: await sha(ST.kode), dev: devId() }, data || {})) }); return await r.json(); } catch { return null; }
}
function watermark() {
  // Watermark hanya di latar (di balik kartu putih) + label lisensi di header, tidak menutupi soal.
  document.getElementById("lic").textContent = ST.nama ? `Lisensi: ${ST.nama}${ST.kode ? " · " + ST.kode : ""}` : "";
  let w = document.getElementById("wm"); if (!ST.nama) { if (w) w.remove(); return; }
  if (!w) { w = document.createElement("div"); w.id = "wm"; document.body.appendChild(w); }
  const t = `Lisensi: ${esc(ST.nama)}${ST.kode ? " · " + ST.kode : ""}`;
  w.innerHTML = Array.from({ length: 14 }, () => `<span>${t}</span>`).join("");
}
function aktivasi() {
  $("#homeBtn").hidden = true;
  app.innerHTML = `<div class="card"><h2>🔐 Masukkan Kode Akses</h2><p>Kode akses ada di <b>halaman member (LMS) Toolkit Parenting</b> setelah pembayaran terkonfirmasi. Cukup sekali aktivasi per perangkat.</p><p class="mut">Belum bisa masuk halaman member? Cek email dari Scalev (juga folder spam/promosi), atau hubungi admin Toolkit Parenting dengan nomor pesanan.</p>
  <input id="kd" placeholder="Kode dari halaman member" autocapitalize="characters"><br><br><button class="btn full" id="ak">Aktifkan</button><p id="msg" class="mut"></p></div>`;
  $("#ak").onclick = async () => { const k = $("#kd").value.trim().toUpperCase(); $("#msg").textContent = "Memeriksa..."; if (await cekKode(k)) {
    ST.kode = k; const r = await server("cek");
    if (r && r.ok === false) { ST.kode = ""; $("#msg").textContent = "❌ " + r.pesan; return; }
    if (r && r.nama) { ST.nama = r.nama; ST.namaServer = 1; } save(); home(); } else $("#msg").textContent = "❌ Kode tidak valid. Periksa lagi atau hubungi penjual."; };
}
const PEMBUAT = "Toolkit Parenting (toolkitparenting.my.id)";
const LEGAL = `<div class="legal"><b>⚖️ Hak Cipta & Lisensi Penggunaan</b><br>© ${new Date().getFullYear()} ${PEMBUAT}. Seluruh soal, materi, gambar, dan aplikasi ini dilindungi <b>Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta</b>.
<ul><li>Lisensi ini <b>hanya untuk penggunaan pribadi</b> oleh satu keluarga pembeli. Mencetak untuk anak sendiri diperbolehkan.</li>
<li><b>Dilarang</b> menyebarkan, membagikan kode akses, menggandakan, mengunggah ulang, menjual kembali, atau memakai untuk bimbel/les berbayar tanpa izin tertulis.</li>
<li>Pasal 9 UU Hak Cipta: penggandaan, pendistribusian, dan pengumuman ciptaan hanya boleh dilakukan pencipta/pemegang hak cipta atau dengan izinnya.</li>
<li>Pasal 113 ayat (3): pelanggaran hak ekonomi untuk penggunaan secara komersial diancam <b>pidana penjara paling lama 4 tahun dan/atau denda paling banyak Rp1.000.000.000</b>.</li>
<li>Setiap kode akses tercatat atas nama pembeli dan tertera pada hasil cetak. Kode yang terbukti disebarkan dapat dinonaktifkan tanpa pengembalian dana.</li></ul></div>`;
function tentang(first) {
  $("#homeBtn").hidden = !!first;
  app.innerHTML = `<div class="card"><h2>📚 Tentang Produk Ini</h2><p><i>Kerjakan, langsung dikoreksi, langsung dibahas. 4 mapel, 40 menit sehari.</i></p><p><b>Les di Rumah Kelas 5</b> adalah program belajar mandiri di rumah sebagai alternatif les bulanan. Isinya <b>4.000 soal</b> (1.000 per mapel) Matematika, Bahasa Indonesia, Bahasa Inggris, dan IPA yang disusun mengikuti <b>Kurikulum Merdeka Fase C (kelas 5)</b>, lengkap dengan pembahasan dan ringkasan materi.</p>
  <p>Anak cukup belajar <b>±40 menit sehari selama 100 hari</b>. Tingkat kesulitan naik bertahap: hari 1–35 dasar, 36–70 menengah, 71–100 mahir (HOTS).</p>
  <p><b>Dibuat oleh:</b> ${PEMBUAT}.</p>${LEGAL}
  ${first ? `<label style="display:flex;gap:8px;margin-top:12px"><input type="checkbox" id="agr" style="width:auto"> Saya memahami dan menyetujui ketentuan penggunaan pribadi di atas.</label><br><button class="btn full" id="ok" disabled>Lanjut</button>` : ""}</div>`;
  if (first) { $("#agr").onchange = (e) => ($("#ok").disabled = !e.target.checked); $("#ok").onclick = () => { ST.setuju = 1; save(); home(); }; }
}
function materi(m) {
  $("#homeBtn").hidden = false;
  if (!m) { app.innerHTML = `<div class="card"><h2>📘 Materi</h2><p class="mut">Ringkasan materi kelas 5. Baca dulu sebelum latihan.</p><div class="grid">${Object.entries(MAPEL).map(([k, [n, ic]]) => `<button class="mapel" data-mm="${k}"><span class="ic">${ic}</span><b>${n}</b><small>${MATERI[k].length} bab</small></button>`).join("")}</div></div>`;
    app.querySelectorAll("[data-mm]").forEach((b) => (b.onclick = () => materi(b.dataset.mm))); return; }
  app.innerHTML = `<div class="card mat"><div class="row"><h2>${MAPEL[m][1]} Materi ${MAPEL[m][0]}</h2></div><button class="btn sec" id="pm">🖨️ Cetak materi</button>${MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join("")}</div>`;
  $("#pm").onclick = () => cetakHTML(`<h2>Materi ${MAPEL[m][0]} Kelas 5</h2>` + MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join(""));
  scrollTo(0, 0);
}
function cetakMenu() {
  $("#homeBtn").hidden = false; const d = pilihHari || hariAktif();
  app.innerHTML = `<div class="card"><h2>🖨️ Cetak</h2><p><button class="btn full" id="c1">Soal hari ke-${d} (4 mapel + kunci)</button></p>
  <label>Cetak semua soal satu mapel<select id="cm">${Object.entries(MAPEL).map(([k, [n]]) => `<option value="${k}">${n}</option>`).join("")}</select></label>
  <label>Level<select id="cl"><option value="1">Level 1 (350 soal)</option><option value="2">Level 2 (350 soal)</option><option value="3">Level 3 (300 soal)</option></select></label><br><br>
  <button class="btn full sec" id="c2">Cetak soal + kunci jawaban</button><br><br><button class="btn full sec" id="c3">Cetak semua materi 4 mapel</button>
  <p class="mut">Tips: pilih “Simpan sebagai PDF” di jendela cetak untuk menyimpan file.</p></div>`;
  $("#c1").onclick = () => cetak(d);
  $("#c2").onclick = () => { const m = $("#cm").value, lv = +$("#cl").value; cetakSoal(`${MAPEL[m][0]} — Level ${lv}`, BANK[m].filter((q) => q.level === lv)); };
  $("#c3").onclick = () => cetakHTML(Object.keys(MAPEL).map((m) => `<h2>Materi ${MAPEL[m][0]} Kelas 5</h2>` + MATERI[m].map(([j, isi], i) => `<h3>${i + 1}. ${j}</h3>${isi}`).join("")).join(""));
}
function cetakHTML(h) {
  $("#print").innerHTML = h + `<div class="wm">© ${PEMBUAT} · Lisensi pribadi ${esc(ST.nama || "")} ${ST.kode ? "· " + ST.kode : ""} · Dilarang disebarluaskan (UU No. 28 Th. 2014)</div>`; window.print();
}
function cetakSoal(judul, s) {
  cetakHTML(`<h2>${judul}</h2><p>Nama: ______________ Tanggal: ________</p>` + s.map((q, i) => `<div class="pq"><b>${i + 1}.</b> ${q.q}${q.img ? `<div>${q.img}</div>` : ""}<div>${q.opsi.map((o, j) => `${"abcd"[j]}. ${o}`).join("&nbsp;&nbsp;&nbsp; ")}</div></div>`).join("") + `<h2>Kunci Jawaban — ${judul}</h2><p>${s.map((q, i) => `${i + 1}${"abcd"[q.jawab]}`).join(", ")}</p>`);
}
function setup() {
  app.innerHTML = `<div class="card"><h2>Selamat datang! 🎉</h2><p>Latihan 10 soal per mapel setiap hari selama 100 hari: <b>4.000 soal</b> Matematika, Bahasa Indonesia, Bahasa Inggris, dan IPA sesuai Kurikulum Merdeka kelas 5. Tingkat kesulitan naik di hari ke-36 dan ke-71.</p>
  <label><b>Nama ANAK yang akan belajar</b> (bukan nama ayah/ibu)<input id="nm" placeholder="contoh: Rafi Pratama"></label><p class="mut">👧🧒 Isi dengan nama siswa kelas 5 yang akan mengerjakan soal. Nama ini tampil di rapor dan sertifikat belajar anak.</p><p class="mut">⚠️ Nama dikunci sebagai pemilik lisensi dan tercetak di setiap lembar. Pastikan sudah benar.</p><br><br><button class="btn full" id="go">Mulai Belajar</button></div>`;
  $("#go").onclick = async () => { const v = $("#nm").value.trim(); if (!v) return; if (!confirm(`Nama anak: "${v}"\n\nPastikan ini nama ANAK, bukan nama orang tua. Nama tidak bisa diubah. Lanjutkan?`)) return; const r = await server("kunci", { nama: v }); ST.nama = (r && r.nama) || v; save(); home(); };
}
function bumpStreak() { if (ST.last !== today()) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); ST.streak = ST.last === y ? ST.streak + 1 : 1; ST.last = today(); } }
function kuis(m, soal, d, isReview, ulang) {
  $("#homeBtn").hidden = false; ST.draft = ST.draft || {};
  const key = isReview ? null : m + d, done = key && !ulang ? ST.hasil[key] : null;
  // Pulihkan jawaban: dari hasil (sudah selesai) atau draft (dikerjakan sebagian)
  const src = done && done.pil ? done : key && !ulang && ST.draft[key] ? ST.draft[key] : null;
  const pil = src ? Object.assign({}, src.pil) : {}; const log = src ? src.log.slice() : [];
  if (key && ulang) delete ST.draft[key];
  app.innerHTML = `<div class="card"><div class="row"><b>${m ? MAPEL[m][1] + " " + MAPEL[m][0] + " · Hari ke-" + d : "🔁 Ulang soal salah"}</b><span class="mut" id="cnt">0/${soal.length} dijawab</span></div><div class="bar" style="margin-top:8px"><i id="pg" style="width:0"></i></div>
  <div id="skor" class="mut" style="margin-top:8px"></div>${done ? `<button class="btn sec" id="ulang" style="margin-top:10px">🔄 Ulangi dari awal</button>` : ""}</div>
  <div class="card">${soal.map((q, i) => `<div class="qi" id="q${i}"><span class="lvl l${q.level}">${i + 1}. ${q.topik}</span><div class="q">${q.q}</div>${q.img ? `<div class="img">${q.img}</div>` : ""}${q.opsi.map((o, j) => `<button class="opt" data-i="${i}" data-j="${j}"><b>${"ABCD"[j]}.</b> ${o}</button>`).join("")}<div class="fb"></div></div>`).join("")}
  <br><button class="btn full" id="fin" disabled>Selesai & lihat nilai</button></div>`;
  const tampil = (i) => { const q = soal[i], j = pil[i], ok = j === q.jawab, box = $("#q" + i);
    box.querySelectorAll(".opt").forEach((x, k) => { x.disabled = true; if (k === q.jawab) x.classList.add("ok"); else if (k === j) x.classList.add("no"); });
    box.querySelector(".fb").innerHTML = `<div class="bahas"><b>${ok ? "✅ Benar!" : "❌ Belum tepat."}</b> ${q.bahas}</div>`; };
  const update = () => { const n = Object.keys(pil).length, benar = Object.entries(pil).filter(([i, j]) => soal[i].jawab === j).length;
    $("#cnt").textContent = `${n}/${soal.length} dijawab`; $("#pg").style.width = (n / soal.length) * 100 + "%";
    $("#skor").innerHTML = n ? `${done ? "Skor" : "Skor sementara"}: <b>${benar} benar</b> dari ${n} soal${n < soal.length ? " · jawaban tersimpan otomatis, bisa dilanjutkan nanti" : ""}` : "";
    $("#fin").disabled = n < soal.length || !!done; if (done) $("#fin").textContent = `✅ Sudah selesai · Nilai ${done.nilai}`; };
  Object.keys(pil).forEach((i) => tampil(+i)); update();
  const first = soal.findIndex((_, i) => !(i in pil)); if (Object.keys(pil).length && first > 0 && !done) setTimeout(() => $("#q" + first).scrollIntoView({ block: "start" }), 50); else scrollTo(0, 0);
  if (done) $("#ulang").onclick = () => kuis(m, soal, d, false, true);
  app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
    const i = +b.dataset.i, j = +b.dataset.j, q = soal[i]; if (i in pil) return; pil[i] = j; const ok = j === q.jawab;
    log.push({ id: q.id, ok, topik: q.topik, mapel: q.mapel }); if (ok) delete ST.salah[q.id]; else ST.salah[q.id] = 1;
    if (key) { ST.draft[key] = { pil, log, tgl: today() }; bumpStreak(); }
    save(); tampil(i); update();
  }));
  $("#fin").onclick = () => {
    const benar = log.filter((l) => l.ok).length, nilai = Math.round((benar / soal.length) * 100);
    if (key) { ST.hasil[key] = { nilai, log, pil, tgl: today() }; delete ST.draft[key]; bumpStreak(); }
    save(); const bintang = nilai >= 90 ? "⭐⭐⭐" : nilai >= 70 ? "⭐⭐" : nilai >= 50 ? "⭐" : "💪";
    app.innerHTML = `<div class="card" style="text-align:center"><div class="big">${bintang}</div><h2>Nilai ${nilai}</h2><p>${benar} dari ${soal.length} soal benar.</p><p class="mut">${nilai >= 70 ? "Keren! Pertahankan ya." : "Tidak apa-apa, soal yang salah tersimpan di menu Ulang Soal Salah."}</p><button class="btn full" id="bk">Kembali ke beranda</button></div>`;
    $("#bk").onclick = home; scrollTo(0, 0);
  };
}
function review() {
  const all = Object.values(BANK).flat(); const ids = new Set(Object.keys(ST.salah));
  const s = all.filter((q) => ids.has(q.id)).slice(0, 10); if (s.length) kuis(null, s, 0, true);
}
function rapor() {
  $("#homeBtn").hidden = false; const tp = {};
  for (const h of [...Object.values(ST.hasil), ...Object.values(ST.draft || {})]) for (const l of h.log) { const k = MAPEL[l.mapel][0] + " — " + l.topik; tp[k] = tp[k] || [0, 0]; tp[k][1]++; if (l.ok) tp[k][0]++; }
  const rata = (m) => { const v = [...Object.entries(ST.hasil), ...Object.entries(ST.draft || {})].filter(([k]) => k.startsWith(m) && !isNaN(k.slice(m.length))).map(([, h]) => h.nilai != null ? h.nilai : Math.round((h.log.filter((l) => l.ok).length / h.log.length) * 100)); return v.length ? Math.round(v.reduce((a, b) => a + b) / v.length) : "-"; };
  const lemah = Object.entries(tp).filter(([, v]) => v[1] >= 3).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 8);
  app.innerHTML = `<div class="card"><h2>📊 Rapor ${esc(ST.nama)}</h2><table><tr><th>Mapel</th><th>Rata-rata</th></tr>${Object.entries(MAPEL).map(([k, [n]]) => `<tr><td>${n}</td><td><b>${rata(k)}</b></td></tr>`).join("")}</table></div>
  <div class="card"><h3>Topik yang perlu dilatih lagi</h3>${lemah.length ? `<table>${lemah.map(([k, v]) => `<tr><td>${k}</td><td>${Math.round((v[0] / v[1]) * 100)}% benar</td></tr>`).join("")}</table>` : `<p class="mut">Kerjakan minimal beberapa hari dulu agar terlihat polanya.</p>`}</div>
  <div class="card"><button class="btn sec" id="rst">Hapus nilai & progres</button><p class="mut">Nama anak terkunci sebagai pemilik lisensi dan tidak ikut terhapus.</p></div>`;
  $("#rst").onclick = () => { if (confirm("Hapus semua nilai dan progres? Nama tetap tersimpan.")) { ST = { nama: ST.nama, hasil: {}, salah: {}, draft: {}, streak: 0, last: "", kode: ST.kode, setuju: ST.setuju }; save(); home(); } };
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
  cetakHTML(h + `<h2>Kunci Jawaban Hari ke-${d}</h2>` + kunci);
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
$("#homeBtn").onclick = () => { pilihHari = null; home(); };
home();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
