import os, re, html
D = os.path.dirname(os.path.abspath(__file__))
fonts = open(f'{D}/fonts/fonts.css').read()

CSS = fonts + """
*{box-sizing:border-box;margin:0;padding:0}
body{background:#222}
.c{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:'Poppins',sans-serif;background:var(--bg);color:var(--fg)}
.dark{--bg:radial-gradient(120% 80% at 80% 0,#4a2d27 0,#1E1B19 62%);--fg:#fff;--hl:#FFD23F;--em:#FFD23F}
.yellow{--bg:linear-gradient(170deg,#FFD23F,#FFE680);--fg:#1E1B19;--hl:#fff;--em:#E5392F}
.red{--bg:linear-gradient(170deg,#E5392F,#F2574B);--fg:#fff;--hl:#FFD23F;--em:#FFD23F}
.pink{--bg:linear-gradient(170deg,#FFC2CF,#FFE3E9);--fg:#1E1B19;--hl:#FFD23F;--em:#E5392F}
.mint{--bg:linear-gradient(170deg,#BFE8CF,#E5F7EC);--fg:#1E1B19;--hl:#FFD23F;--em:#E5392F}
.cream{--bg:linear-gradient(170deg,#FFF5E4,#FFE6C6);--fg:#1E1B19;--hl:#FFD23F;--em:#E5392F}
.logo{position:absolute;left:48px;top:44px;background:#fff;border-radius:22px;padding:14px 22px;z-index:9;box-shadow:0 6px 18px rgba(0,0,0,.18)}
.logo img{width:300px;display:block}
.h{position:absolute;left:54px;right:54px;font-family:'Anton';text-transform:uppercase;font-size:92px;line-height:1.04;letter-spacing:.5px;z-index:5}
.h.s{font-size:78px}.h.xs{font-size:62px}
.h mark{background:var(--hl);color:#1E1B19;padding:0 14px;border-radius:10px;-webkit-box-decoration-break:clone;box-decoration-break:clone;line-height:1.2}
.h em{font-style:normal;color:var(--em)}
.ph{position:absolute;border-radius:34px;border:8px solid #fff;box-shadow:0 14px 34px rgba(0,0,0,.28);background-color:#fff;background-repeat:no-repeat;z-index:3}
.stk{position:absolute;z-index:8;font-family:'Anton';text-transform:uppercase;font-size:44px;letter-spacing:1px;padding:8px 24px;border-radius:14px;border:5px solid #1E1B19;box-shadow:7px 7px 0 #1E1B19;background:#FFD23F;color:#1E1B19;transform:rotate(-3deg)}
.stk.r{background:#E5392F;color:#fff}.stk.m{background:#BFE8CF}.stk.w{background:#fff}.stk.k{background:#1E1B19;color:#FFD23F;border-color:#FFD23F;box-shadow:7px 7px 0 #E5392F}
.cap{position:absolute;left:54px;right:54px;bottom:62px;font-weight:700;font-size:32px;line-height:1.3;text-align:center;z-index:6}
.cap small{display:block;font-size:24px;font-weight:600;opacity:.85;margin-top:8px}
.cb{position:absolute;z-index:7;background:#fff;color:#1E1B19;border:5px solid #1E1B19;border-radius:26px;box-shadow:7px 7px 0 #1E1B19;padding:18px 24px;font-weight:800;font-size:31px;line-height:1.25}
.cb b{color:#E5392F}
.pill{display:inline-block;background:#fff;color:#1E1B19;border:4px solid #1E1B19;border-radius:99px;font-weight:800;font-size:30px;padding:8px 26px}
.mock{position:absolute;z-index:4;background:#fff;border:7px solid #fff;border-radius:18px;box-shadow:0 18px 40px rgba(0,0,0,.35);overflow:hidden}
.mock img{display:block;width:100%}
.led{position:absolute;left:54px;right:54px;background:#111;border:10px solid #3a3330;border-radius:46px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.4);z-index:4}
.led b{display:block;font-family:'Anton';font-weight:400;font-size:330px;line-height:1.05;color:#ff3b30;text-shadow:0 0 36px rgba(255,59,48,.75);letter-spacing:6px}
.led span{display:block;font-family:'Anton';font-size:58px;color:#FFD23F;text-transform:uppercase;padding-bottom:26px;letter-spacing:1.5px}
.chat{position:absolute;left:70px;right:70px;background:#fff;color:#1E1B19;border:6px solid #1E1B19;border-radius:44px;box-shadow:12px 12px 0 #1E1B19;overflow:hidden;z-index:4}
.chat .top{background:#075E54;color:#fff;padding:22px 30px;font-weight:800;font-size:34px}
.chat .top i{font-style:normal;font-weight:500;font-size:24px;display:block;opacity:.85}
.chat .body{background:#ECE5DD;padding:30px;min-height:360px}
.bub{max-width:78%;background:#fff;border-radius:22px;padding:16px 22px;font-size:34px;line-height:1.3;margin-bottom:18px;box-shadow:0 2px 0 rgba(0,0,0,.12)}
.bub.me{background:#DCF8C6;margin-left:auto}
.bub time{display:block;text-align:right;font-size:22px;color:#889;margin-top:4px}
.qc{position:absolute;left:60px;right:60px;z-index:4}
.alt1,.alt2{padding:30px 40px;font-size:44px;line-height:1.25;font-weight:700;border:6px solid #1E1B19}
.alt1{background:#fff;color:#8a7a70;border-radius:36px 36px 0 0;text-decoration:line-through;text-decoration-color:#E5392F;text-decoration-thickness:5px}
.alt2{background:#CFF0DB;color:#1E1B19;border-top:0;border-radius:0 0 36px 36px;box-shadow:10px 10px 0 #1E1B19}
.lab{font-family:'Anton';text-transform:uppercase;font-size:34px;letter-spacing:1px;padding:4px 16px;border-radius:10px;display:inline-block;margin-bottom:10px;text-decoration:none}
.spl{position:absolute;z-index:4;top:380px;width:470px}
.spl .ph{position:relative;height:420px;width:100%;margin-bottom:20px}
.spl ul{list-style:none}
.spl li{background:#fff;color:#1E1B19;border:4px solid #1E1B19;border-radius:18px;font-weight:800;font-size:27px;line-height:1.25;padding:12px 18px;margin-bottom:12px;box-shadow:5px 5px 0 #1E1B19}
.rep{position:absolute;z-index:4;left:54px;right:54px}
.rep div{background:#fff;color:#1E1B19;border:5px solid #1E1B19;border-radius:40px;padding:16px 36px;font-weight:800;font-size:46px;margin-bottom:20px;width:max-content;box-shadow:7px 7px 0 #1E1B19}
.rep div:nth-child(even){margin-left:auto;background:#FFD23F}
.face{position:absolute;width:210px;z-index:5}
.fold{position:absolute;left:70px;right:70px;background:#fff;color:#1E1B19;border:6px solid #1E1B19;border-radius:36px;box-shadow:12px 12px 0 #E5392F;z-index:4;overflow:hidden}
.fold .bar{background:#E8EAED;padding:16px 26px;font-weight:700;font-size:28px;border-bottom:5px solid #1E1B19}
.fold .row{padding:20px 28px;font-size:34px;font-weight:700;border-bottom:3px dashed #cfc3b0;display:flex;gap:18px;align-items:center}
.fold .row s{opacity:.55}
.fold .row::before{content:"PDF";background:#E5392F;color:#fff;font-size:22px;font-weight:800;padding:4px 10px;border-radius:8px}
.types{position:absolute;z-index:4;left:54px;width:500px}
.types div{background:#fff;color:#1E1B19;border:5px solid #1E1B19;border-radius:22px;box-shadow:6px 6px 0 #1E1B19;font-weight:800;font-size:28px;line-height:1.2;padding:12px 18px;margin-bottom:14px}
.types div i{font-style:normal;display:inline-flex;width:40px;height:40px;border-radius:50%;background:#E5392F;color:#fff;align-items:center;justify-content:center;margin-right:12px;font-family:'Anton';font-size:24px}
"""

def pg(inner, theme, ident, extra=''):
    return f'<!doctype html><html><head><meta charset="utf-8"><base href="../"><style>{CSS}</style></head><body><div class="c {theme}" id="c">{extra}<div class="logo"><img src="img/logo.png"></div>{inner}</div></body></html>'

def H(t, top=176, cls='', ):
    return f'<div class="h {cls}" style="top:{top}px">{t}</div>'

def PH(img, x, y, w, h, size='cover', pos='50% 50%', rot=0, extra=''):
    return f'<div class="ph" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;background-image:url(img/{img});background-size:{size};background-position:{pos};transform:rotate({rot}deg);{extra}"></div>'

def STK(t, x, y, cls='', rot=-3, size=44):
    return f'<div class="stk {cls}" style="left:{x}px;top:{y}px;transform:rotate({rot}deg);font-size:{size}px">{t}</div>'

def CAP(t, small=''):
    return f'<div class="cap">{t}{"<small>"+small+"</small>" if small else ""}</div>'

def CB(t, x, y, w, rot=0):
    return f'<div class="cb" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg)">{t}</div>'

def MOCK(img, x, y, w, rot=-3):
    return f'<div class="mock" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg)"><img src="img/{img}"></div>'

BRAND = 'Workbook Pagi Tanpa Drama &middot; ToolkitParenting'
creatives = []
def add(n, ang, typ, theme, inner):
    creatives.append((n, ang, typ, theme, inner))

# ---------------- ANGLE 1: remote control ----------------
add(1,1,'P','dark', H('Capek jadi <mark>&quot;remote control&quot;</mark> anak?') +
  '<div style="position:absolute;left:50%;top:480px;transform:translateX(-50%) rotate(-2deg);width:330px;background:#f4f1ec;border:8px solid #1E1B19;border-radius:60px;padding:34px 30px;z-index:4;box-shadow:12px 12px 0 #E5392F">' +
  ''.join(f'<div style="background:{c};border:5px solid #1E1B19;border-radius:99px;font-family:Anton;font-size:42px;text-align:center;padding:12px;margin-bottom:20px;color:#1E1B19">{t}</div>' for t,c in [('Bangun','#7CC0FF'),('Mandi','#8EE0A8'),('Baju','#FFD23F'),('Sepatu','#FF9B6B'),('Tas','#FFC2CF')]) + '</div>' +
  STK('Pencet lagi...', 640, 560, 'r', 5) + STK('Dan lagi...', 650, 820, '', -4) +
  CAP('Bukan anaknya yang lambat. Sistemnya yang belum ada.'))
add(2,1,'E','yellow', H('Chart rutinitas: anak cek <mark>sendiri</mark>',cls='s') +
  PH('chart-laki.jpg',60,360,960,282,'cover','50% 50%',-1) + PH('bab4.jpg',60,690,520,400,'200%','72% 70%',1) +
  CB('Versi <b>balita</b>: bergambar',610,700,410,2) + CB('Versi <b>SD</b>: checklist',610,860,410,-2) + CB('Siap cetak (Bonus 1)',610,1000,410,1) +
  CAP('&quot;Habis ini apa, Ma?&quot; dijawab chart, bukan suaramu.'))
add(3,1,'M','mint', H('Anak lihat chart, <em>bukan</em> nunggu disuruh',cls='s') +
  PH('bab4.jpg',60,500,960,590,'175%','78% 62%',0) + STK('Mami tinggal tersenyum',80,520,'',-3,38) +
  CAP('Instruksi diulang makin jarang karena anak membaca chart sendiri.',BRAND))

# ---------------- ANGLE 2: kaus kaki ----------------
add(4,2,'P','red', H('&quot;Kaus kaki sebelah mana?!&quot;',cls='') +
  PH('bab1.jpg',60,520,960,570,'190%','100% 100%',0) + STK('06.30',70,470,'w',-4,70) +
  CAP('Bukan kamu yang kurang sabar. Barang-barangnya belum punya rumah.'))
add(5,2,'E','cream', H('Satu titik dekat pintu: <mark>Stasiun Siap Berangkat</mark>',cls='s') +
  PH('stasiun.jpg',60,470,960,620,'cover','50% 55%',0) + STK('Malam ini, sudah ada di sini',120,1000,'r',-2,36) +
  CAP('Tas, sepatu, kunci, helm, payung. Pagi tinggal ambil dari satu tempat.'))
add(6,2,'M','pink', H('Dulu cari-cari. <em>Sekarang</em> tinggal ambil.',cls='s') +
  '<div class="spl" style="left:60px"><span class="lab" style="background:#E5392F;color:#fff">Dulu</span>' + PH('bab1.jpg',0,0,470,420,'330%','72% 100%').replace('position:absolute','position:relative') + '<ul><li>Cari kunci jam 06.50</li><li>Sepatu sebelah hilang</li></ul></div>' +
  '<div class="spl" style="left:550px"><span class="lab" style="background:#1F8F5F;color:#fff">Sekarang</span>' + PH('stasiun.jpg',0,0,470,420,'260%','55% 65%').replace('position:absolute','position:relative') + '<ul><li>Semua di satu titik</li><li>Anak ambil sendiri</li></ul></div>' +
  CAP(BRAND))

# ---------------- ANGLE 3: bekal ----------------
add(7,3,'P','dark', H('Jam 05.30. <mark>Bekal apa ya?</mark>') +
  PH('bab5.jpg',60,470,960,620,'200%','92% 78%',0) + STK('05.30',70,430,'r',-4,70) +
  CAP('Bukan kamu yang kurang kreatif. Keputusannya terlalu banyak di pagi hari.'))
add(8,3,'E','mint', H('Checklist malam <mark>15 menit</mark>',cls='') +
  MOCK('pg-checklist.jpg',60,340,520,-3) + CB('<b>Blok 1</b> Baju',620,380,400,2) + CB('<b>Blok 2</b> Tas &amp; barang',620,530,400,-2) + CB('<b>Blok 3</b> Makanan',620,680,400,2) + CB('<b>Blok 4</b> Cek besok',620,830,400,-1) +
  CAP('Malam capek? Ada versi 5 menit.',BRAND))
add(9,3,'M','yellow', H('30 ide sarapan &amp; bekal <em>5 menit</em>',cls='s') +
  PH('bonus3.jpg',140,430,800,540,'cover','50% 50%',-2) + STK('Bonus printable',60,380,'r',-4,40) +
  CAP('Lengkap dengan apa yang disiapkan malamnya. Tinggal rotasi tiap minggu.',BRAND))

# ---------------- ANGLE 4: teriak ----------------
add(10,4,'P','dark', H('Di motor, kamu <mark>diam</mark>.',cls='') +
  '<div class="rep" style="top:430px"><div>Ayo cepat!</div><div>Ayo cepat!</div><div>Ayo cepat!</div><div>Ayo cepat!</div><div>Ayo cepat!</div></div>' +
  f'<img class="face" src="img/mood1.png" style="left:420px;top:960px">' + STK('Sudah 5x pagi ini',60,1000,'r',-4,40) +
  CAP('Rasa bersalah ikut berangkat kerja. Bukan kamu yang kurang sabar.'))
add(11,4,'E','pink', H('Skrip pengganti <mark>teriak</mark>',cls='') +
  '<div class="qc" style="top:400px"><div class="alt1">&quot;Cepetan! Kamu lambat banget!&quot;</div><div class="alt2">&quot;Kira-kira bisa selesai sebelum lagu ini habis, nggak?&quot;</div></div>' +
  STK('Alih-alih',70,360,'w',-4,38) + STK('Coba',760,680,'m',3,40) + CB('6 momen genting<br>+ skrip untuk dirimu',60,880,520,-2) +
  CAP('Kalimat siap pakai, di dalam Bab 4.',BRAND))
add(12,4,'M','yellow', H('Tahu harus bilang apa saat <em>hampir meledak</em>',cls='s') +
  PH('bab4.jpg',60,520,960,570,'170%','62% 55%',0) + CB('&quot;Mami butuh tarik napas sebentar.&quot;',90,880,560,-2) +
  CAP('Tarik napas tiga kali, lalu bicara lagi.',BRAND))

# ---------------- ANGLE 5: timeline ----------------
add(13,5,'P','dark', H('06.45. Anak <mark>belum</mark> bangun.') +
  PH('mami-duluan.jpg',60,520,960,570,'190%','0% 100%',0) + STK('Waktu terus jalan',620,470,'r',3,44) +
  CAP('Bukan anaknya yang lambat. Urutan paginya belum ada.'))
add(14,5,'E','yellow', H('Timeline <em>45 menit</em>: anak bangun &rarr; berangkat',cls='s') +
  PH('bab3.jpg',60,470,960,620,'cover','88% 50%',0) + CB('Dihitung dari <b>anak dibangunkan</b>',60,1000,560,-2) +
  CAP('Versi balita, anak SD, dan dua anak beda usia.',BRAND))
add(15,5,'M','mint', H('Saat Mami <mark>siap duluan</mark>, perhatianmu utuh',cls='s') +
  PH('mami-duluan.jpg',60,470,960,620,'200%','5% 40%',0) +
  CAP('Mandi dan berpakaian sebelum anak dibangunkan.',BRAND))

# ---------------- ANGLE 6: dua anak ----------------
add(16,6,'P','red', H('Kakak minta dibantu. Adik minta baju. <mark>Sekarang.</mark>',cls='s') +
  PH('bab1.jpg',60,500,960,590,'190%','100% 100%',0) + STK('Dua-duanya!',70,450,'w',-3,52) +
  CAP('Bukan kamu yang kurang cekatan. Dua anak butuh urutan yang berselang.'))
add(17,6,'E','cream', H('Berselang, <em>bukan</em> bersamaan',cls='') +
  MOCK('pg-duaanak.jpg',60,340,520,-3) + CB('Kakak <b>mandiri</b> duluan',620,400,400,2) + CB('Adik dibangunkan <b>belakangan</b>',620,600,400,-2) + CB('Kamu tidak mengurus dua anak di langkah yang sama',620,830,400,2) +
  CAP(BRAND))
add(18,6,'M','pink', H('Kakak mandiri, Mami <em>fokus</em> ke adik',cls='s') +
  PH('cover.jpg',60,470,960,620,'125%','50% 78%',0) +
  CAP('Pagi dua anak yang lebih teratur.',BRAND))

# ---------------- ANGLE 7: pengasuh izin ----------------
add(19,7,'P','dark', H('Jam 05.40. WA <mark>pengasuh</mark> masuk.') +
  '<div class="chat" style="top:420px"><div class="top">Mbak Siti<i>online</i></div><div class="body"><div class="bub">Bu, maaf hari ini saya nggak bisa datang &#128591;<time>05.40</time></div><div class="bub me">Oh... ya sudah, nggak apa-apa<time>05.41</time></div><div class="bub" style="background:#fff3cd">...dan sekarang aku harus gimana?<time>05.41</time></div></div></div>' +
  CAP('Bukan kamu yang kurang siap. Pagimu belum punya rencana B.'))
add(20,7,'E','mint', H('Siapkan <mark>rencana B</mark> sebelum panik',cls='') +
  MOCK('pg-templates.jpg',60,340,520,-3) + CB('Daftar <b>Pendamping Cadangan</b>',620,400,400,2) + CB('Template pesan ke <b>sekolah</b>',620,620,400,-2) + CB('Template pesan ke <b>atasan</b>',620,820,400,2) +
  CAP(BRAND))
add(21,7,'M','yellow', H('Pengasuh izin pun, pagi <em>tidak ambruk</em>',cls='s') +
  PH('bab5.jpg',60,470,960,620,'200%','92% 78%',0) +
  CAP('Langkahnya sudah diputuskan sebelum panik datang.',BRAND))

# ---------------- ANGLE 8: telat bangun ----------------
add(22,8,'P','dark',  H('Bangun 06.40. Berangkat <mark>07.00</mark>.',cls='') +
  '<div class="led" style="top:470px"><b>06.40</b><span>Alarm tidak berbunyi</span></div>' + STK('20 menit!',640,350,'r',4,50) +
  CAP('Bukan kamu yang malas. Pagi darurat belum pernah kamu siapkan.'))
add(23,8,'E','pink', H('Pagi darurat <mark>20 menit</mark>',cls='') +
  MOCK('pg-darurat.jpg',60,340,520,-3) + CB('Hanya yang <b>wajib</b>, sisanya dilepas',620,400,400,2) + CB('Ada <b>stok pagi darurat</b>',620,640,400,-2) + CB('Tetap berangkat <b>tepat waktu</b>?<br>Dicoba dulu',620,830,400,2) +
  CAP(BRAND))
add(24,8,'M','cream', H('Telat bangun <em>tidak</em> membatalkan sistemmu',cls='s') +
  PH('penutup.jpg',60,470,960,620,'175%','12% 88%',0) +
  CAP('Malam nanti jalankan lagi checklist. Besok kembali ke timeline.',BRAND))

# ---------------- ANGLE 9: suami ----------------
add(25,9,'P','dark', H('&quot;Bisa bantu pagi ini?&quot; <mark>&quot;Bantu apa?&quot;</mark>',cls='s') +
  '<div class="chat" style="top:470px"><div class="top">Suami<i>online</i></div><div class="body"><div class="bub me">Bisa bantu pagi ini? &#128591;<time>06.14</time></div><div class="bub">Bantu apa?<time>06.15</time></div><div class="bub me" style="background:#fff3cd">Anak belum mandi, bekal belum, tas belum siap<time>06.15</time></div><div class="bub">Aku lagi meeting ya...<time>06.16</time></div></div></div>' +
  CAP('Yang hilang bukan niatnya. Yang hilang: kejelasannya.'))
add(26,9,'E','yellow', H('Cukup <mark>satu tugas tetap</mark> untuk suami',cls='s') +
  MOCK('pg-tugas.jpg',60,340,520,-3) + CB('Pilihan tugas sesuai <b>jam suami</b>',620,400,400,2) + CB('Contoh kalimat <b>mengajak bicara</b>',620,640,400,-2) + CB('<b>Template</b> pembagian tugas',620,860,400,2) +
  CAP(BRAND))
add(27,9,'M','mint', H('Remote control untuk <em>dua orang</em>? Tidak perlu.',cls='s') +
  PH('bab6.jpg',60,500,960,590,'175%','70% 68%',0) +
  CAP('Satu tugas yang benar-benar lepas dari pikiranmu.',BRAND))

# ---------------- ANGLE 10: challenge/kuis ----------------
add(28,10,'P','pink', H('Beli planner. Semangat hari pertama. Lalu <mark>tenggelam</mark>.',cls='s') +
  '<div class="fold" style="top:560px"><div class="bar">Downloads</div><div class="row">Planner_Pagi_FIX_final.pdf</div><div class="row">Ebook_Parenting_baru.pdf</div><div class="row">Jadwal_Anak_v3 (1).pdf</div><div class="row"><s>Workbook_dibaca_nanti.pdf</s></div></div>' + STK('Nanti, nanti...',620,500,'r',4,44) +
  CAP('Bukan kamu yang tidak disiplin. Terlalu banyak sekaligus.'))
add(29,10,'E','yellow', H('Kuis: tipe <em>kekacauan</em> pagimu?',cls='s') +
  '<div class="types" style="top:380px"><div><i>A</i>Mikir di Tempat</div><div><i>B</i>Cari-cari Barang</div><div><i>C</i>Tanpa Urutan</div><div><i>D</i>Remote Control</div><div><i>E</i>Rapuh Saat Meleset</div></div>' +
  MOCK('pg-hasil.jpg',590,370,420,3) + CAP('Hasil kuis langsung menunjuk bab yang dibaca duluan.',BRAND))
add(30,10,'M','cream', H('Satu perbaikan per hari, <em>7 hari</em>',cls='s') +
  PH('bab7.jpg',60,470,960,620,'200%','100% 70%',0) +
  CAP('Tidak ada hari yang &quot;gagal&quot;. Terlewat, lanjut besoknya.',BRAND))


DIM = {'bab1':(1672,941),'bab2':(1672,941),'bab3':(1672,941),'bab4':(1672,941),'bab5':(1672,941),'bab6':(1672,941),'bab7':(1671,941),'penutup':(1672,941),'mami-duluan':(1448,1086),'cover':(1054,1492),'hero-halo':(1672,941),'stasiun':(1448,1086)}
def PC(img, x, y, w, h, cx, cy, wf, rot=0, rel=False):
    iw, ih = DIM[img]
    rw = wf * iw; rh = rw * h / w
    if rh > ih: rh = ih; rw = rh * w / h
    x0 = min(max(cx * iw - rw / 2, 0), iw - rw); y0 = min(max(cy * ih - rh / 2, 0), ih - rh)
    sc = w / rw
    pos = 'relative' if rel else 'absolute'
    return f'<div class="ph" style="position:{pos};left:{x}px;top:{y}px;width:{w}px;height:{h}px;background-image:url(img/{img}.jpg);background-size:{iw*sc:.1f}px {ih*sc:.1f}px;background-position:{-x0*sc:.1f}px {-y0*sc:.1f}px;transform:rotate({rot}deg)"></div>'

NEW = {}
def over(n, ang, typ, theme, inner): NEW[n] = (n, ang, typ, theme, inner)

over(2,1,'E','yellow', H('Chart rutinitas: anak cek <mark>sendiri</mark>',cls='s') +
  PH('chart-laki.jpg',60,360,960,282,'cover','50% 50%',-1) + PC('bab4',60,690,520,400,.80,.60,.42,1) +
  CB('Versi <b>balita</b>: bergambar',610,700,410,2) + CB('Versi <b>SD</b>: checklist',610,860,410,-2) + CB('Siap cetak (Bonus 1)',610,1000,410,1) +
  CAP('&quot;Habis ini apa, Ma?&quot; dijawab chart, bukan suaramu.'))
over(3,1,'M','mint', H('Anak lihat chart, <em>bukan</em> nunggu disuruh',cls='s') +
  PC('bab4',60,500,960,590,.75,.62,.5) + STK('Mami tinggal tersenyum',80,520,'',-3,38) +
  CAP('Instruksi diulang makin jarang karena anak membaca chart sendiri.',BRAND))
over(4,2,'P','red', H('&quot;Kaus kaki sebelah mana?!&quot;') +
  PC('bab1',60,520,960,570,.55,.72,.5) + STK('06.30',70,470,'w',-4,70) +
  CAP('Bukan kamu yang kurang sabar. Barang-barangnya belum punya rumah.'))
over(6,2,'M','pink', H('Dulu cari-cari. <em>Sekarang</em> tinggal ambil.',cls='s') +
  '<div class="spl" style="left:60px"><span class="lab" style="background:#E5392F;color:#fff">Dulu</span>' + PC('bab1',0,0,470,420,.42,.72,.3,0,True) + '<ul><li>Cari kunci jam 06.50</li><li>Sepatu sebelah hilang</li></ul></div>' +
  '<div class="spl" style="left:550px"><span class="lab" style="background:#1F8F5F;color:#fff">Sekarang</span>' + PC('stasiun',0,0,470,420,.78,.70,.45,0,True) + '<ul><li>Semua di satu titik</li><li>Anak ambil sendiri</li></ul></div>' +
  CAP(BRAND))
over(7,3,'P','dark', H('Jam 05.30. <mark>Bekal apa ya?</mark>') +
  PC('bab5',60,470,960,620,.68,.72,.5) + STK('05.30',70,430,'r',-4,70) +
  CAP('Bukan kamu yang kurang kreatif. Keputusannya terlalu banyak di pagi hari.'))
over(10,4,'P','dark', H('Di motor, kamu <mark>diam</mark>.') +
  '<div class="rep" style="top:420px"><div>Ayo cepat!</div><div>Ayo cepat!</div><div>Ayo cepat!</div><div>Ayo cepat!</div></div>' +
  '<img class="face" src="img/mood1.png" style="left:720px;top:880px">' + STK('Sudah 5x pagi ini',60,930,'r',-4,44) +
  CAP('Rasa bersalah ikut berangkat kerja. Bukan kamu yang kurang sabar.'))
over(11,4,'E','pink', H('Skrip pengganti <mark>teriak</mark>') +
  '<div class="qc" style="top:420px"><div class="alt1">&quot;Cepetan! Kamu lambat banget!&quot;</div><div class="alt2">&quot;Kira-kira bisa selesai sebelum lagu ini habis, nggak?&quot;</div></div>' +
  STK('Alih-alih',70,380,'w',-4,38) + STK('Coba',780,740,'m',3,40) + CB('6 momen genting<br>+ skrip untuk dirimu sendiri',60,900,600,-2) +
  CAP('Kalimat siap pakai, di dalam Bab 4.',BRAND))
over(12,4,'M','yellow', H('Tahu harus bilang apa saat <em>hampir meledak</em>',cls='s') +
  PC('bab4',60,520,960,570,.72,.6,.5) + CB('&quot;Mami butuh tarik napas sebentar.&quot;',90,900,560,-2) +
  CAP('Tarik napas tiga kali, lalu bicara lagi.',BRAND))
over(13,5,'P','dark', H('06.45. Anak <mark>belum</mark> bangun.') +
  PC('mami-duluan',60,520,960,570,.625,.8,.75) + STK('Waktu terus jalan',620,470,'r',3,44) +
  CAP('Bukan anaknya yang lambat. Urutan paginya belum ada.'))
over(14,5,'E','yellow', H('Timeline <em>45 menit</em>: anak bangun &rarr; berangkat',cls='s') +
  PC('bab3',60,470,960,620,.78,.5,.45) + CB('Dihitung dari <b>anak dibangunkan</b>',60,1000,560,-2) +
  CAP('Versi balita, anak SD, dan dua anak beda usia.',BRAND))
over(15,5,'M','mint', H('Saat Mami <mark>siap duluan</mark>, perhatianmu utuh',cls='s') +
  PC('mami-duluan',60,470,960,620,.22,.32,.46) +
  CAP('Mandi dan berpakaian sebelum anak dibangunkan.',BRAND))
over(16,6,'P','red', H('Kakak minta dibantu. Adik minta baju. <mark>Sekarang.</mark>',cls='s') +
  PC('bab1',60,500,960,590,.62,.7,.55) + STK('Dua-duanya!',70,450,'w',-3,52) +
  CAP('Bukan kamu yang kurang cekatan. Dua anak butuh urutan yang berselang.'))
over(18,6,'M','pink', H('Kakak mandiri, Mami <em>fokus</em> ke adik',cls='s') +
  PC('cover',60,470,960,620,.5,.6,1.0) +
  CAP('Pagi dua anak yang lebih teratur.',BRAND))
over(21,7,'M','yellow', H('Pengasuh izin pun, pagi <em>tidak ambruk</em>',cls='s') +
  PC('bab5',60,470,960,620,.68,.72,.5) +
  CAP('Langkahnya sudah diputuskan sebelum panik datang.',BRAND))
over(24,8,'M','cream', H('Telat bangun <em>tidak</em> membatalkan sistemmu',cls='s') +
  PC('penutup',60,470,960,620,.30,.45,.55) +
  CAP('Malam nanti jalankan lagi checklist. Besok kembali ke timeline.',BRAND))
over(27,9,'M','mint', H('Remote control untuk <em>dua orang</em>? Tidak perlu.',cls='s') +
  PC('bab6',60,500,960,590,.72,.62,.55) +
  CAP('Satu tugas yang benar-benar lepas dari pikiranmu.',BRAND))
over(30,10,'M','cream', H('Satu perbaikan per hari, <em>7 hari</em>',cls='s') +
  PC('bab7',60,470,960,620,.75,.70,.5) +
  CAP('Tidak ada hari yang &quot;gagal&quot;. Terlewat, lanjut besoknya.',BRAND))

def MK(img, cbs, head, theme, n, ang, cap):
    inner = H(head, cls='s') + MOCK(img, 60, 405, 490, -3)
    ys = [440, 640, 840]
    for i, t in enumerate(cbs):
        inner += CB(t, 590, ys[i] if len(cbs) == 3 else 400 + i * 150, 430, 2 if i % 2 == 0 else -2)
    over(n, ang, 'E', theme, inner + CAP(cap, BRAND))
over_mk = [
 ('pg-checklist.jpg',['<b>Blok 1</b> Baju','<b>Blok 2</b> Tas &amp; barang','<b>Blok 3</b> Makanan','<b>Blok 4</b> Cek besok'],'Checklist malam <mark>15 menit</mark>','mint',8,3,'Malam capek? Ada versi 5 menit.'),
 ('pg-duaanak.jpg',['Kakak <b>mandiri</b> duluan','Adik dibangunkan <b>belakangan</b>','Tidak mengurus dua anak di langkah yang sama'],'Berselang, <em>bukan</em> bersamaan','cream',17,6,'Timeline dua anak beda usia.'),
 ('pg-templates.jpg',['Daftar <b>Pendamping Cadangan</b>','Template pesan ke <b>sekolah</b>','Template pesan ke <b>atasan</b>'],'Siapkan <mark>rencana B</mark> sebelum panik','mint',20,7,'Disimpan di HP, tinggal kirim.'),
 ('pg-darurat.jpg',['Hanya yang <b>wajib</b>, sisanya dilepas','Ada <b>stok pagi darurat</b>','Siap dipakai saat alarm terlewat'],'Pagi darurat <mark>20 menit</mark>','pink',23,8,'Hanya bisa jalan kalau checklist malam sudah dikerjakan.'),
 ('pg-tugas.jpg',['Pilihan tugas sesuai <b>jam suami</b>','Contoh kalimat <b>mengajak bicara</b>','<b>Template</b> pembagian tugas'],'Cukup <mark>satu tugas tetap</mark> untuk suami','yellow',26,9,'Jelas, utuh, dikerjakan setiap hari.'),
]
for im, cbs, head, th, n, ang, cap in over_mk: MK(im, cbs, head, th, n, ang, cap)
over(24,8,'M','cream', H('Telat bangun <em>tidak</em> membatalkan sistemmu',cls='s') +
  PC('penutup',60,470,960,620,.27,.45,.45) +
  CAP('Malam nanti jalankan lagi checklist. Besok kembali ke timeline.',BRAND))
creatives = [NEW.get(c[0], c) for c in creatives]

if __name__ == '__main__':
    os.makedirs(f'{D}/html', exist_ok=True)
    for n, a, t, th, inner in creatives:
        open(f'{D}/html/{n:02d}_A{a}_{t}.html', 'w').write(pg(inner, th, n))
    print(len(creatives))
