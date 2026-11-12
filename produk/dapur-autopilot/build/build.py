# -*- coding: utf-8 -*-
"""Build PDF Dapur Autopilot via Chromium (Playwright).  python3 build.py"""
import os, html, collections, subprocess
from content import R, DAYS, STOK, RENCANA_B
from illus import bento

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "output")
TITLE = "Dapur Autopilot"

def box(): return '<span class="box"></span>'
def e(s): return html.escape(s)

# ---------- ikon garis sederhana (inline SVG, stroke currentColor) ----------
ICON = {
 "moon": '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
 "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 "box": '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 11h18M12 11v8"/>',
 "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "bolt": '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
 "bulb": '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
 "check": '<path d="m5 12 4.5 4.5L19 7"/>',
 "cart": '<path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
 "snow": '<path d="M12 2v20M4 6l16 12M20 6 4 18"/>',
}
def ic(name, cls="ic"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{ICON[name]}</svg>'

def aksi(teks, kolom, baris=3):
    head = "".join(f"<th>{e(k)}</th>" for k in kolom)
    rows = "".join("<tr>" + "".join('<td class="fill"></td>' for _ in kolom) + "</tr>" for _ in range(baris))
    return f'''<div class="aksi"><div class="aksi-h">{ic("bolt")}<span>Aksi Hari Ini</span></div>
<p class="aksi-t">{teks}</p><table class="isian"><tr>{head}</tr>{rows}</table></div>'''

def tip(t): return f'<div class="tip">{ic("bulb")}<div>{t}</div></div>'

def alt(pairs):
    rows = "".join(f'<tr><td class="a">{e(a)}</td><td class="c">{e(c)}</td></tr>' for a, c in pairs)
    return f'<table class="alt"><tr><th>Alih-alih…</th><th>Coba…</th></tr>{rows}</table>'

def chapter(no, kicker, title, lead, body):
    return f'''<section class="chapter">
<div class="ch-head"><div class="ch-no">{no:02d}</div><div><div class="kicker">{kicker}</div>
<h1>{title}</h1><p class="lead">{lead}</p></div></div>{body}</section>'''

# =============================== HALAMAN ===============================
cover = f'''<section class="cover">
 <div class="cv-night"><div class="cv-moon">{ic("moon","bigic")}</div><div class="cv-lbl">21.00 · masak sekali</div></div>
 <div class="cv-day"><div class="cv-sun">{ic("sun","bigic")}</div><div class="cv-lbl r">06.00 · bekal tinggal pindah</div></div>
 <div class="cv-bento"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i></div>
 <div class="cv-text">
   <div class="cv-kick">Sistem dapur 4 minggu untuk Mami yang kerja</div>
   <div class="cv-title">Dapur<br><em>Autopilot</em></div>
   <div class="cv-sub">Masak sekali di malam hari. Bekal pagi tinggal dipindah.<br>Tanpa mikir “besok masak apa” lagi.</div>
   <div class="cv-chips"><span>20 pasangan menu malam → bekal</span><span>Belanja 1× seminggu</span><span>Rencana B 10 menit</span></div>
 </div>
 <div class="cv-brand"><span class="logo-mark"></span><span>Toolkit<b>Parenting</b></span></div>
</section>'''

lisensi = f'''<section class="page-license">
 <div class="brand-row"><span class="logo-mark"></span><span>Toolkit<b>Parenting</b></span></div>
 <h2 class="lic-title">Produk Original ToolkitParenting</h2>
 <p class="muted">Terima kasih sudah membeli versi original. Dukungan Mami membuat kami bisa terus membuat alat bantu yang praktis untuk orang tua Indonesia.</p>
 <div class="lic-grid">
  <div class="lic ok"><h3>{ic("check")} Boleh</h3><ul><li>Dipakai dan dicetak untuk keluarga sendiri</li><li>Dicetak berulang kali (kalender, daftar belanja, label)</li><li>Disimpan di HP, tablet, laptop pribadi</li></ul></div>
  <div class="lic no"><h3>✕ Dilarang</h3><ul><li>Dibagikan ke grup WA, Telegram, Drive publik</li><li>Dijual ulang atau dijadikan bonus produk lain</li><li>Diakui sebagai karya sendiri / diubah lalu disebarkan</li></ul></div>
 </div>
 <p class="small">Dilindungi Undang-Undang No. 28 Tahun 2014 tentang Hak Cipta. Kalau Mami menerima file ini dari orang lain, yuk dukung kami dengan membeli versi original.</p>
 <p class="small">© 2026 ToolkitParenting. Seluruh hak dilindungi.</p>
</section>'''

pembuka = f'''<section class="chapter">
<div class="kicker">Pembuka</div><h1 class="big">Halo, Mami.</h1>
<p class="lead">Buku ini bukan kumpulan resep. Resep di internet sudah jutaan, dan masalahnya tidak pernah di situ.</p>
<p>Masalahnya ada di jam 21.47, saat Mami berdiri di depan kulkas yang terbuka dengan kepala yang sudah penuh dari kantor. Dan di jam 05.40, saat alarm bunyi, nasi belum dimasak, dan anak butuh bekal sejam lagi.</p>
<p><b>Dapur Autopilot adalah sistem</b> yang memindahkan semua keputusan dapur ke satu waktu yang tenang (Minggu sore), lalu membuat setiap masakan malam otomatis jadi bekal pagi. Mami tetap masak. Bedanya, Mami tidak perlu mikir, tidak perlu masak dua kali, dan punya cadangan saat hari kacau.</p>
<div class="pillars">
 <div><span class="pn">1</span><b>1 Masak = 2 Makan</b><p>Masak malam disisihkan untuk bekal, pagi tinggal ubah bentuk.</p></div>
 <div><span class="pn">2</span><b>Hari Tetap</b><p>Senin ayam, Selasa telur… Tidak ada lagi “masak apa ya”.</p></div>
 <div><span class="pn">3</span><b>Rencana B</b><p>10 menu 10 menit dari stok, untuk hari lembur dan hari kacau.</p></div>
</div>
<h2>Janji jujur kami</h2>
<p>Buku ini membantu Mami <b>mengurangi bingung, belanja, dan waktu masak</b>. Kami tidak menjanjikan anak pasti menghabiskan bekal setiap hari, atau angka gizi tertentu. Anak tetap anak. Tapi Mami akan punya sistem, bukan lagi untung-untungan setiap pagi.</p>
<h2>Cara memakai buku ini</h2>
<table class="plain"><tr><th>Waktu</th><th>Yang dikerjakan</th></tr>
<tr><td><b>Hari 1–3</b></td><td>Baca Bab 1–3 (±10 menit/bab). Kerjakan Aksi Hari Ini.</td></tr>
<tr><td><b>Minggu pertama</b></td><td>Cetak Kalender Minggu 1 + Daftar Belanja Minggu 1. Belanja & prep 60 menit (Bab 4).</td></tr>
<tr><td><b>Senin</b></td><td>Mulai pasangan menu #1. Ikuti kartu di Bab 5.</td></tr>
<tr><td><b>Setelah 4 minggu</b></td><td>Ulang dari Minggu 1 dengan menu yang paling disukai anak (Tracker di Bonus).</td></tr></table>
<h2>Isi buku</h2>
<table class="toc">
<tr><td>01</td><td>Capeknya Bukan di Masak, Tapi di Mikir</td></tr>
<tr><td>02</td><td>Hari Tetap: Kalender Tema Mingguan</td></tr>
<tr><td>03</td><td>Belanja Sekali Seminggu + Stok Dapur Wajib</td></tr>
<tr><td>04</td><td>Prep Minggu 60 Menit</td></tr>
<tr><td>05</td><td>20 Pasangan Menu Malam → Bekal</td></tr>
<tr><td>06</td><td>Pagi 15 Menit: Urutan Kerja Bekal</td></tr>
<tr><td>07</td><td>Anak Pilih-pilih & Bosan Bekal</td></tr>
<tr><td>08</td><td>Hari Kacau: Rencana B 10 Menit</td></tr>
<tr><td>★</td><td>Bonus Printable: Kalender, Daftar Belanja, Label Kulkas, Tracker Anak</td></tr>
</table></section>'''

bab1 = chapter(1, "Fondasi", "Capeknya Bukan di Masak, Tapi di Mikir",
 "Kenapa dapur terasa berat padahal masaknya cuma 30 menit, dan rumus yang mengubah semuanya.", f'''
<div class="timeline">
 <div><b>21.47</b><span>Anak sudah tidur, laptop baru ditutup. Buka kulkas: setengah ayam, dua wortel, telur. Lima menit berdiri. Tutup lagi. <i>“Besok aja deh, pagi beli lauk.”</i></span></div>
 <div><b>05.40</b><span>Alarm bunyi. Nasi belum dimasak, lauk belum ada. Kakak minta nugget, nugget habis.</span></div>
 <div class="hot"><b>06.32</b><span><i>“Mamiii, kotak bekal aku mana?”</i> Bekal akhirnya nasi + telur ceplok, ketiga kalinya minggu ini.</span></div>
</div>
<p>Kalau ini terasa familier, masalahnya <b>bukan karena Mami kurang rajin.</b> Yang menguras bukan masaknya, tapi puluhan keputusan kecil yang harus diambil di jam paling capek: masak apa, bahannya ada atau tidak, bisa dibuat bekal atau tidak.</p>
<h2>Tiga titik bocor di dapur ibu kerja</h2>
<table class="plain"><tr><th>Titik bocor</th><th>Kejadiannya</th><th>Yang buku ini ubah</th></tr>
<tr><td><b>Mikir menu</b></td><td>Tiap malam mulai dari nol</td><td>Hari Tetap (Bab 2)</td></tr>
<tr><td><b>Bahan tidak ada</b></td><td>Kurang satu bahan, rencana batal</td><td>Belanja + stok wajib (Bab 3)</td></tr>
<tr><td><b>Masak dua kali</b></td><td>Malam masak, pagi masak lagi</td><td>Rumus 1 Masak 2 Makan (bab ini)</td></tr></table>
<h2>Rumus 1 Masak = 2 Makan</h2>
<div class="formula"><span>Masak malam<br><small>porsi + 1</small></span><i>→</i><span>Sisihkan<br><small>sebelum dihidangkan</small></span><i>→</i><span>Rak Bekal<br><small>kulkas</small></span><i>→</i><span>Ubah bentuk<br><small>pagi ≤10 menit</small></span></div>
<p>Kenapa <b>ubah bentuk</b>, bukan dipanaskan ulang? Supaya anak tidak merasa makan sisa semalam, dan Mami tidak masak dari nol. Ayam kecap malam jadi onigiri. Bola daging jadi mie goreng. Perkedel mentah digoreng pagi, masih anget.</p>
<table class="plain"><tr><th>Malam ini</th><th>Disisihkan</th><th>Besok pagi jadi</th></tr>
<tr><td>Ayam kecap</td><td>±100 g ayam, cincang</td><td><b>Onigiri ayam kecap</b></td></tr>
<tr><td>Sup ayam jagung</td><td>Ayam + jagung, tanpa kuah</td><td><b>Nasi goreng ayam jagung</b></td></tr>
<tr><td>Chicken katsu</td><td>1 potong katsu</td><td><b>Katsu sando</b></td></tr>
<tr><td>Perkedel tahu</td><td>Adonan mentah</td><td><b>Nugget tahu bentuk bintang</b></td></tr></table>
{alt([("“Besok pagi aja mikir bekalnya”", "Putuskan bekal saat masak malam, sekali jalan"),
      ("Masak pas-pasan untuk makan malam", "Masak porsi + 1"),
      ("Menyisihkan setelah makan (sudah diacak-acak)", "Sisihkan sebelum dihidangkan, langsung tutup"),
      ("Bekal = lauk sama persis", "Lauk sama, bentuk beda")])}
{tip("<b>Catatan aman:</b> dinginkan sebentar (maks ±1–2 jam di suhu ruang), simpan di wadah tertutup di kulkas, lalu panaskan sampai benar-benar panas di pagi hari sebelum masuk kotak bekal.")}
{aksi("Malam ini, apa pun yang Mami masak, tambah satu porsi dan sisihkan untuk bekal besok. Belum perlu sistem lain.", ["Malam ini masak", "Yang disisihkan", "Besok jadi apa", "Menit pagi"], 2)}''')

hari_rows = "".join(f'<tr><td><span class="dot" style="background:{v["warna"]}"></span><b>{k}</b></td><td>{v["tema"]}</td><td>{" · ".join(x["bekal"] for x in R if x["hari"]==k)}</td></tr>' for k, v in DAYS.items())
bab2 = chapter(2, "Nol Keputusan", "Hari Tetap: Kalender Tema Mingguan",
 "Batasi pilihan, bukan rasa. Satu tema per hari menghapus pertanyaan “masak apa” selamanya.", f'''
<p>Restoran tidak bingung tiap malam karena menunya sudah tetap. Dapur rumah juga bisa begitu. <b>Hari Tetap</b> mengunci <i>jenis protein</i> per hari, sementara resepnya berputar 4 minggu. Hasilnya, Mami tidak perlu memutuskan apa-apa, dan anak tetap tidak bosan.</p>
<table class="plain"><tr><th>Hari</th><th>Tema</th><th>Bekal di 4 minggu</th></tr>{hari_rows}
<tr><td><b>Sabtu–Minggu</b></td><td>Bebas</td><td>Makan di luar, masak santai, atau prep (Bab 4)</td></tr></table>
<h2>Kenapa urutannya begini</h2>
<div class="cards2">
 <div class="card"><b>Senin = Ayam</b><p>Hari paling berat. Ayam paling mudah diterima anak dan paling fleksibel diubah bentuk.</p></div>
 <div class="card"><b>Selasa = Telur</b><p>Paling murah dan cepat, menyeimbangkan belanja ayam di hari Senin.</p></div>
 <div class="card"><b>Rabu = Ikan & Udang</b><p>Ikan dibeli beku saat belanja mingguan, jadi tetap aman sampai pertengahan minggu.</p></div>
 <div class="card"><b>Kamis = Daging</b><p>Daging giling cepat matang dan cocok dijadikan bola, perkedel, atau saus.</p></div>
 <div class="card wide"><b>Jumat Seru = Tahu-Tempe / Anak Pilih</b><p>Anggaran paling ringan di akhir minggu. Anak ikut memilih bentuk atau topping, jadi ada hari yang mereka tunggu.</p></div>
</div>
{tip("Tempel kalender Hari Tetap (Bonus 1) di pintu kulkas. Saat suami atau ART yang memasak, mereka juga tidak perlu bertanya.")}
{alt([("Bikin menu baru tiap minggu dari nol", "Pakai rotasi 4 minggu, ganti 1 menu yang tidak disukai saja"),
      ("Tema terlalu ketat (“harus resep ini”)", "Tema protein tetap, resep boleh ditukar dalam tema yang sama"),
      ("Menyesuaikan menu dengan mood malam itu", "Menu ikut kalender, mood ikut belakangan 😉")])}
{aksi("Tulis 1 menu andalan keluarga untuk setiap Hari Tetap. Ini cadangan kalau menu buku belum cocok.", ["Hari", "Tema", "Menu andalan keluarga kami"], 5)}''')

stok_html = "".join(f'<div class="stok"><h3>{k}</h3><ul>' + "".join(f"<li>{box()} {e(i)}</li>" for i in v) + "</ul></div>" for k, v in STOK.items())
bab3 = chapter(3, "Satu Kali Jalan", "Belanja Sekali Seminggu + Stok Dapur Wajib",
 "Rencana masak gagal paling sering karena satu bahan kurang. Bab ini menutup celah itu.", f'''
<p>Dapur Autopilot memakai dua lapis bahan:</p>
<div class="cards2">
 <div class="card"><b>{ic("cart","ic s")} Belanja mingguan</b><p>Protein, sayur, dan bahan khusus menu minggu itu. Daftarnya sudah jadi di Bonus 2, per minggu, per kategori.</p></div>
 <div class="card"><b>{ic("box","ic s")} Stok wajib</b><p>Bumbu, bahan kering, dan isi freezer yang selalu ada. Ini juga bahan baku Rencana B.</p></div>
</div>
<h2>Checklist Stok Dapur Wajib</h2>
<div class="stok-grid">{stok_html}</div>
<h2>Aturan belanja</h2>
<table class="plain"><tr><th>Aturan</th><th>Kenapa</th></tr>
<tr><td><b>Belanja Sabtu / Minggu pagi</b></td><td>Prep bisa langsung dikerjakan sore harinya</td></tr>
<tr><td><b>Ikan & udang beli beku</b></td><td>Aman sampai Rabu; pindahkan ke kulkas Selasa malam</td></tr>
<tr><td><b>Belanja online? Simpan keranjangnya</b></td><td>4 keranjang tersimpan = 4 minggu belanja dalam 2 menit</td></tr>
<tr><td><b>Cek stok wajib sebelum berangkat</b></td><td>Cukup 3 menit dengan checklist di atas</td></tr></table>
{tip("Kalau belanja di aplikasi, simpan Daftar Belanja Minggu 1–4 sebagai 4 keranjang “Favorit”. Minggu kelima dan seterusnya tinggal ulang.")}
{aksi("Cek dapur dengan Checklist Stok Wajib. Tulis yang kurang. Itu daftar belanja pertama Mami.", ["Yang kurang", "Kategori", "Sudah dibeli"], 4)}''')

bab4 = chapter(4, "Investasi 1 Jam", "Prep Minggu 60 Menit",
 "Satu jam di hari Minggu membeli lima pagi yang tenang. Ini urutan kerjanya, menit per menit.", f'''
<table class="plain timeline-t"><tr><th>Menit</th><th>Kerjakan</th><th>Hasil</th></tr>
<tr><td><b>00–05</b></td><td>Rebus telur (6 ayam + 10 puyuh). Nyalakan timer.</td><td>Telur rebus untuk Jumat & cadangan</td></tr>
<tr><td><b>05–20</b></td><td>Cuci & potong sayur minggu ini (wortel, buncis, brokoli, kol). Simpan di wadah berlabel.</td><td>Sayur siap tumis 5 hari</td></tr>
<tr><td><b>20–30</b></td><td>Potong & marinasi protein Senin. Bagi protein lain per porsi, beri label hari.</td><td>Senin malam tinggal masak</td></tr>
<tr><td><b>30–45</b></td><td>Bumbu dasar: tumis 15 siung bawang putih + 10 bawang merah cincang dengan minyak. Goreng 10 siung bawang putih iris.</td><td>1 toples bumbu dasar + bawang goreng</td></tr>
<tr><td><b>45–55</b></td><td>(Minggu ke-4) Buat adonan nugget ikan, kukus, bekukan. (Minggu lain) Rebus makaroni / masak nasi untuk freezer.</td><td>Stok Rencana B</td></tr>
<tr><td><b>55–60</b></td><td>Tata kulkas pakai sistem zona (lihat bawah). Tempel kalender minggu ini.</td><td>Semua orang tahu letak barang</td></tr></table>
<h2>Sistem Zona Kulkas</h2>
<div class="zones">
 <div class="z z1"><b>Rak atas · BEKAL BESOK</b><span>Hanya untuk sisihan malam. Pagi tinggal ambil semua yang ada di sini.</span></div>
 <div class="z z2"><b>Rak tengah · MALAM INI</b><span>Protein dan sayur untuk menu malam ini, sudah dipotong.</span></div>
 <div class="z z3"><b>Rak bawah · MINGGU INI</b><span>Bahan hari-hari berikutnya, berlabel nama hari.</span></div>
 <div class="z z4"><b>Pintu · BUMBU DASAR</b><span>Toples bumbu, mentega, saus, mayo.</span></div>
</div>
{tip("Label kulkas siap cetak ada di Bonus 3. Rak “Bekal Besok” adalah kunci sistem ini: pagi hari Mami tidak membuka-buka wadah, cukup ambil.")}
{tip("Bumbu dasar tumis tahan ±5–7 hari di kulkas dalam toples bersih tertutup. Selalu ambil dengan sendok kering.")}
{aksi("Jadwalkan Prep Minggu pertama Mami. Tentukan jam dan siapa yang membantu.", ["Hari & jam prep", "Yang membantu", "Tugas mereka"], 2)}''')

def pic(x):
    f = os.path.join(HERE, "img", f"menu-{x['no']:02d}.jpg")
    if os.path.exists(f):
        import base64
        return f'<img src="data:image/jpeg;base64,{base64.b64encode(open(f,"rb").read()).decode()}">'
    return bento(x["no"], DAYS[x["hari"]]["warna"])

def card(x):
    d = DAYS[x["hari"]]
    bahan = "".join(f"<li>{box()} <span>{e(n)}</span><em>{e(q)}</em></li>" for n, q, _ in x["bahan"])
    ms = "".join(f"<li>{e(s)}</li>" for s in x["malam_steps"])
    ps = "".join(f"<li>{e(s)}</li>" for s in x["pagi_steps"])
    return f'''<div class="rcard">
<div class="rc-top" style="--c:{d['warna']}"><span class="rc-no">#{x['no']:02d}</span><span class="rc-day">Minggu {x['minggu']} · {x['hari']} · {d['tema']}</span><span class="rc-min">{ic("clock","ic s")} pagi {x['menit']} mnt</span></div>
<div class="rc-hero"><div class="rc-names"><div class="rc-m">{ic("moon","ic s")}<span>Malam ini</span><b>{e(x['malam'])}</b></div><div class="rc-arrow">↓ jadi bekal besok</div><div class="rc-b">{ic("sun","ic s")}<b>{e(x['bekal'])}</b></div></div><div class="rc-img">{pic(x)}</div></div>
<div class="rc-body">
 <div class="rc-col"><h4>Bahan <small>(3–4 orang + 1 bekal)</small></h4><ul class="bahan">{bahan}</ul></div>
 <div class="rc-col"><h4>{ic("moon","ic xs")} Malam</h4><ol>{ms}</ol>
  <div class="sisih"><b>Sisihkan ke Rak Bekal:</b> {e(x['sisihkan'])}</div>
  <h4>{ic("sun","ic xs")} Pagi</h4><ol>{ps}</ol></div>
</div>
<div class="rc-tip">{ic("bulb","ic xs")} {e(x['tip'])}</div></div>'''

cards = ""
for w in range(1, 5):
    items = [x for x in R if x["minggu"] == w]
    cards += f'<div class="week-sep"><span>Minggu {w}</span></div>' + "".join(card(x) for x in items)
gallery = '<h2>Isi kotak bekal anak 4 minggu ke depan</h2><div class="gal">' + "".join(
    f'<div><div class="gi">{pic(x)}</div><b>#{x["no"]:02d}</b> {e(x["bekal"])}</div>' for x in R) + '</div>'
bab5 = chapter(5, "Inti Sistem", "20 Pasangan Menu Malam → Bekal",
 "Setiap kartu = satu masakan malam yang sudah dirancang untuk jadi bekal besok pagi dalam ≤10 menit.", f'''
<p>Cara membaca kartu: <b>bulan</b> = makan malam keluarga, <b>matahari</b> = bekal besok. Kotak “Sisihkan” memberi tahu persis apa yang masuk Rak Bekal sebelum makanan dihidangkan. Porsi untuk 2 dewasa + 2 anak; sesuaikan jika perlu.</p>
{tip("Bumbu standar (garam, merica, gula, minyak, bawang) tidak ditulis ulang di setiap kartu karena sudah ada di Stok Wajib (Bab 3).")}
{gallery}{cards}''')

bab6 = chapter(6, "Pagi Tenang", "Pagi 15 Menit: Urutan Kerja Bekal",
 "Pagi bukan untuk masak. Pagi untuk merakit. Ini urutan supaya 15 menit cukup, termasuk buah dan minum.", f'''
<h2>Malam sebelumnya · 3 menit</h2>
<ul class="check">
 <li>{box()} Sisihan sudah ada di Rak Bekal Besok, wadah tertutup</li>
 <li>{box()} Kotak bekal & botol minum sudah dicuci, ditaruh di meja dapur</li>
 <li>{box()} Rice cooker diisi beras + air, timer disetel (atau nasi dari freezer dipindah ke kulkas)</li>
 <li>{box()} Cek kartu menu besok: perlu teflon? air fryer? siapkan di kompor</li>
</ul>
<h2>Pagi · 15 menit</h2>
<table class="plain timeline-t"><tr><th>Jam</th><th>Kerjakan</th><th>Sambil…</th></tr>
<tr><td><b>05.45</b></td><td>Ambil semua isi Rak Bekal. Nyalakan teflon.</td><td>Rebus air untuk teh/kopi Mami</td></tr>
<tr><td><b>05.47</b></td><td>Ubah bentuk sesuai kartu (langkah “Pagi”).</td><td>—</td></tr>
<tr><td><b>05.55</b></td><td>Angkat, diamkan 3–5 menit supaya uap hilang.</td><td>Potong buah, isi botol minum</td></tr>
<tr><td><b>06.00</b></td><td>Masukkan kotak, tutup rapat, masuk tas anak.</td><td>Selesai. Sisanya urusan seragam 😅</td></tr></table>
{tip("Kenapa didiamkan 3–5 menit? Makanan yang ditutup saat masih beruap membuat bekal lembek dan basah. Tapi jangan terlalu lama di suhu ruang; begitu uap hilang, tutup.")}
<h2>Formula kotak bekal</h2>
<div class="bento-f"><div class="bf1"><b>½ karbo</b><span>nasi, roti, mie</span></div><div class="bf2"><b>¼ lauk</b><span>dari kartu menu</span></div><div class="bf3"><b>¼ sayur/buah</b><span>timun, buah potong</span></div></div>
<p class="muted center">Ini panduan visual sederhana, bukan aturan gizi ketat. Untuk kebutuhan khusus anak, konsultasikan dengan dokter anak atau ahli gizi.</p>
{alt([("Memasak lauk bekal dari nol di pagi hari", "Rakit dari Rak Bekal; masak hanya langkah “Pagi”"),
      ("Bangun lalu mikir “bekal apa ya”", "Kartu menu besok sudah dicek semalam"),
      ("Mencuci kotak bekal di pagi hari", "Cuci saat anak pulang sekolah atau malam")])}
{aksi("Besok pagi, catat jam mulai dan selesai membuat bekal. Kita ukur kemajuannya sendiri.", ["Tanggal", "Mulai", "Selesai", "Total menit"], 3)}''')

bab7 = chapter(7, "Realita", "Anak Pilih-pilih & Bosan Bekal",
 "Sistem terbaik pun bertemu anak yang bilang “nggak mau”. Ini cara menghadapinya tanpa masak menu terpisah.", f'''
<h2>Aturan “1 Aman + 1 Baru”</h2>
<p>Setiap kotak berisi <b>minimal 1 makanan yang anak pasti mau</b> (nasi kepal, buah favorit, nugget). Menu baru masuk di sampingnya dalam porsi kecil. Kalau menu baru tidak dimakan, anak tetap kenyang dan Mami tidak perlu panik.</p>
<h2>Ganti bentuk, bukan menu</h2>
<table class="plain"><tr><th>Anak bilang…</th><th>Coba ubah…</th></tr>
<tr><td>“Bosan nasi”</td><td>Nasi kepal, sushi roll, nasi dalam wrap</td></tr>
<tr><td>“Nggak mau sayur”</td><td>Wortel parut di saus, sayur di adonan perkedel/telur gulung</td></tr>
<tr><td>“Lauknya keras”</td><td>Potong kecil, suwir, belah dua (bakso)</td></tr>
<tr><td>“Nggak sempat habis”</td><td>Porsi lebih kecil, tusuk bento supaya cepat dimakan</td></tr>
<tr><td>“Mau yang kayak temen”</td><td>Jumat Seru: biarkan anak memilih bentuk/topping</td></tr></table>
<h2>Libatkan anak 5 menit</h2>
<ul class="check">
 <li>{box()} Anak memilih bentuk cetakan atau topping hari Jumat</li>
 <li>{box()} Anak memberi nilai bekal pakai Tracker Bintang (Bonus 4)</li>
 <li>{box()} Menu bintang 3 masuk rotasi bulan depan, bintang 1 diganti dalam tema yang sama</li>
</ul>
{tip("Bekal yang pulang masih utuh adalah data, bukan kegagalan. Catat di tracker, lalu ubah satu hal saja minggu depan: bentuk, ukuran, atau saus.")}
{tip("Kalau Mami khawatir soal berat badan, alergi, atau pola makan anak yang sangat terbatas, bicarakan dengan dokter anak. Buku ini membantu urusan dapur, bukan pengganti saran medis.")}
{aksi("Tanya anak: 3 makanan yang PASTI mereka mau di bekal. Ini daftar “Aman” Mami.", ["Nama anak", "Aman #1", "Aman #2", "Aman #3"], 2)}''')

rb = "".join(f'<div class="rb"><div class="rb-n">{i+1:02d}</div><div><b>{e(n)}</b><p>{e(c)}</p><small>{ic("box","ic xs")} {e(s)}</small></div></div>' for i, (n, c, s) in enumerate(RENCANA_B))
bab8 = chapter(8, "Rencana B", "Hari Kacau: Rencana B 10 Menit",
 "Lembur, anak demam, lupa belanja. Sistem yang bagus bukan yang tidak pernah gagal, tapi yang punya cadangan.", f'''
<h2>Pohon keputusan malam hari</h2>
<div class="tree">
 <div class="q">Pulang lewat dari 19.30 atau energi habis?</div>
 <div class="branches">
  <div><span class="yes">Ya</span><p>Makan malam beli/pesan. <b>Bekal besok = Rencana B</b> dari stok. Tidak perlu merasa bersalah, sistemnya memang dirancang untuk ini.</p></div>
  <div><span class="no">Tidak</span><p>Masak sesuai kartu. Jangan lupa sisihkan.</p></div>
 </div>
 <div class="q">Lupa menyisihkan / sisihan habis?</div>
 <div class="branches"><div><span class="yes">→</span><p>Pagi: pilih 1 dari 10 menu Rencana B di bawah. Semua ≤10 menit, semua dari Stok Wajib.</p></div></div>
 <div class="q">Menu hari ini batal (bahan rusak / habis)?</div>
 <div class="branches"><div><span class="yes">→</span><p>Tukar dengan menu lain di tema yang sama dari minggu lain. Contoh: Senin minggu 1 ↔ Senin minggu 3.</p></div></div>
</div>
<h2>10 Menu Rencana B</h2>
<div class="rb-grid">{rb}</div>
{tip("Anak sakit dan tidak sekolah? Pakai sisihan untuk makan siangnya di rumah. Untuk menu saat sakit, ikuti arahan dokter.")}
{aksi("Tandai 3 menu Rencana B favorit keluarga dan pastikan bahannya ada di stok minggu ini.", ["Menu Rencana B", "Bahan yang perlu ada", "Sudah ada"], 3)}''')

# ------------------------------- BONUS -------------------------------
def kalender(w):
    rows = ""
    for x in [y for y in R if y["minggu"] == w]:
        d = DAYS[x["hari"]]
        rows += f'<tr><td class="kd" style="border-left:5px solid {d["warna"]}"><b>{x["hari"]}</b><small>{d["tema"]}</small></td><td>{e(x["malam"])}</td><td><b>{e(x["bekal"])}</b></td><td class="c">{box()}</td></tr>'
    return f'<div class="kal"><h3>Minggu {w}</h3><table class="plain"><tr><th>Hari</th><th>{ic("moon","ic xs")} Malam</th><th>{ic("sun","ic xs")} Bekal besok</th><th>Beres</th></tr>{rows}</table></div>'

def belanja(w):
    cats = {"P": "Protein", "S": "Sayur & Buah", "R": "Roti, Susu & Karbo", "B": "Bumbu & Kering"}
    agg = collections.OrderedDict((c, collections.OrderedDict()) for c in cats)
    for x in [y for y in R if y["minggu"] == w]:
        for n, q, c in x["bahan"]:
            agg[c].setdefault(n, []).append(q)
    cols = ""
    for c, items in agg.items():
        lis = "".join(f'<li>{box()} <span>{e(n)}</span><em>{e(" + ".join(q))}</em></li>' for n, q in items.items())
        cols += f'<div class="bl"><h3>{cats[c]}</h3><ul class="bahan">{lis}</ul></div>'
    return f'''<section class="chapter bonus"><div class="kicker">Bonus 2 · Daftar Belanja</div><h1>Belanja Minggu {w}</h1>
<p class="muted">Sudah digabung dari 5 kartu menu minggu ini. Cek juga Stok Wajib (Bab 3) sebelum berangkat.</p>
<div class="bl-grid">{cols}</div>
<div class="note-lines"><b>Tambahan minggu ini:</b><div></div><div></div><div></div></div></section>'''

bonus1 = f'''<section class="chapter bonus"><div class="kicker">Bonus 1 · Tempel di Kulkas</div><h1>Kalender Dapur 4 Minggu</h1>
<p class="muted">Cetak, tempel di pintu kulkas, centang setiap malam setelah menyisihkan bekal.</p>
<div class="kal-grid">{"".join(kalender(w) for w in range(1,5))}</div></section>
<section class="chapter bonus"><div class="kicker">Bonus 1 · Versi Kosong</div><h1>Kalender Menu Keluarga Kami</h1>
<p class="muted">Untuk bulan kelima dan seterusnya, isi dengan menu bintang 3 dari Tracker.</p>
<table class="plain blank"><tr><th>Hari</th><th>Tema</th><th>{ic("moon","ic xs")} Malam</th><th>{ic("sun","ic xs")} Bekal besok</th><th>Disisihkan</th></tr>
{"".join(f'<tr><td><b>{k}</b></td><td>{v["tema"]}</td><td></td><td></td><td></td></tr>' for k,v in DAYS.items())}</table>
<table class="plain blank"><tr><th>Hari</th><th>Tema</th><th>{ic("moon","ic xs")} Malam</th><th>{ic("sun","ic xs")} Bekal besok</th><th>Disisihkan</th></tr>
{"".join(f'<tr><td><b>{k}</b></td><td>{v["tema"]}</td><td></td><td></td><td></td></tr>' for k,v in DAYS.items())}</table></section>'''

bonus2 = "".join(belanja(w) for w in range(1, 5))

labels = [("BEKAL BESOK", "Jangan dimakan malam ini 🙏", "#1F4E4A"), ("MALAM INI", "Sudah dipotong, tinggal masak", "#C99A3B"),
          ("MINGGU INI", "Ambil sesuai hari", "#4F8A8B"), ("BUMBU DASAR", "Ambil pakai sendok kering", "#D65A3A"),
          ("RENCANA B", "Stok darurat freezer", "#6E8F5E"), ("SENIN", "Hari Ayam", "#C99A3B"),
          ("SELASA", "Hari Telur", "#E2B33C"), ("RABU", "Hari Ikan & Udang", "#4F8A8B"),
          ("KAMIS", "Hari Daging", "#D65A3A"), ("JUMAT", "Jumat Seru", "#6E8F5E")]
lbl = "".join(f'<div class="lbl" style="--c:{c}"><b>{t}</b><span>{s}</span></div>' for t, s, c in labels)
bonus3 = f'''<section class="chapter bonus"><div class="kicker">Bonus 3 · Gunting & Tempel</div><h1>Label Zona Kulkas & Wadah</h1>
<p class="muted">Cetak di kertas stiker atau kertas biasa + selotip bening. Gunting di garis putus-putus.</p>
<div class="lbl-grid">{lbl}{lbl}</div>
<div class="sticker"><div class="st-k">Tempel di pintu kulkas</div><div class="st-t">Malam ini masak apa?</div><div class="st-s">Lihat kalender. Masak porsi + 1. <b>Sisihkan dulu</b>, baru hidangkan.</div></div></section>'''

stars = "☆ ☆ ☆"
trk_rows = "".join(f'<tr><td>#{x["no"]:02d}</td><td>{e(x["bekal"])}</td><td class="st">{stars}</td><td class="st">{stars}</td><td></td></tr>' for x in R)
bonus4 = f'''<section class="chapter bonus"><div class="kicker">Bonus 4 · Diisi Bersama Anak</div><h1>Tracker Bintang Bekal</h1>
<p class="muted">Setelah anak pulang, minta mereka mewarnai bintang. 3 bintang = masuk rotasi bulan depan.</p>
<table class="plain trk"><tr><th>#</th><th>Bekal</th><th>Anak 1</th><th>Anak 2</th><th>Catatan (diubah apa?)</th></tr>{trk_rows}</table></section>'''

penutup = f'''<section class="chapter closing">
<div class="kicker">Penutup</div><h1 class="big">Sistem ini hanya bekerja<br>kalau <em>dikerjakan</em>.</h1>
<p class="lead">Mami tidak perlu sempurna di minggu pertama. Mami cuma perlu mulai.</p>
<p>Membaca buku ini sampai habis tidak mengubah apa pun di dapur. Yang mengubah adalah satu porsi yang Mami sisihkan malam ini. Lalu satu label yang ditempel di rak kulkas. Lalu satu Minggu sore yang dipakai prep 60 menit. Pelan-pelan, pagi yang dulu seperti perang berubah jadi 15 menit merakit bekal sambil minum teh.</p>
<h2>Mulai malam ini, 3 langkah super kecil</h2>
<div class="steps3">
 <div><span>1</span><b>Kosongkan rak atas kulkas</b><p>Tulis “BEKAL BESOK” di kertas, tempel. 2 menit.</p></div>
 <div><span>2</span><b>Sisihkan 1 porsi</b><p>Dari apa pun yang dimasak atau dibeli malam ini.</p></div>
 <div><span>3</span><b>Cetak Kalender Minggu 1</b><p>Tempel di pintu kulkas. Selesai.</p></div>
</div>
<div class="promise"><h3>Janji kecil untuk diri sendiri</h3>
<p>Mulai tanggal <span class="line"></span>, aku akan mencoba Dapur Autopilot selama 4 minggu.</p>
<p>Kalau ada hari yang gagal, aku pakai Rencana B dan <b>tidak menyalahkan diri sendiri</b>.</p>
<p>Alasan aku melakukan ini: <span class="line long"></span></p>
<p class="sign">Tanda tangan: <span class="line"></span></p></div>
<p class="muted center">Dengan sayang, Tim ToolkitParenting · Alat bantu praktis untuk orang tua Indonesia</p>
</section>'''

body = "".join([cover, lisensi, pembuka, bab1, bab2, bab3, bab4, bab5, bab6, bab7, bab8, bonus1, bonus2, bonus3, bonus4, penutup])
css = open(os.path.join(HERE, "style.css"), encoding="utf-8").read()
fonts = open(os.path.join(HERE, "fonts", "fonts.css"), encoding="utf-8").read()
doc = f'<!doctype html><html lang="id"><head><meta charset="utf-8"><title>{TITLE}</title><style>{fonts}\n{css}</style></head><body>{body}</body></html>'
open(os.path.join(HERE, "dapur-autopilot.html"), "w", encoding="utf-8").write(doc)

subprocess.run(["node", os.path.join(HERE, "pdf.js")], check=True)
