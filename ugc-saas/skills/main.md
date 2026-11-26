# UGC Flow Studio — Alur Produksi

Panduan ini mengubah satu foto produk menjadi paket produksi video iklan bergaya kreator (UGC) yang siap dikerjakan di Google Flow. Tidak ada video yang dibuat di sini — yang dihasilkan adalah semua bahan yang dibutuhkan user untuk men-generate sendiri di Flow, lalu merakitnya di CapCut.

## Prinsip dasar

Iklan UGC laku karena **tidak terlihat seperti iklan**, tapi gambarnya tetap jernih dan HD seperti konten kreator masa kini. Penonton berhenti scroll untuk orang yang terasa nyata, bukan untuk produksi yang mulus. Setiap keputusan di paket ini — dialog, pencahayaan, framing, pilihan kreator — diarahkan ke satu tujuan: video yang terasa direkam sendiri oleh pengguna asli pakai HP.

Tiga pertanyaan yang selalu dijawab sebelum menulis:
1. **Siapa yang paling dipercaya membicarakan produk ini?** → menentukan arketipe kreator.
2. **Momen apa dalam hidup penonton yang membuat produk ini relevan?** → menentukan lokasi dan angle.
3. **Bukti apa yang bisa ditunjukkan dalam beberapa detik?** → menentukan shot produk.

## Input

| Data | Wajib? | Jika kosong |
|------|--------|-------------|
| Foto produk (bisa beberapa sisi: depan, belakang, samping, detail) | Ya | — |
| Nama + deskripsi singkat | Ya | Tanyakan |
| Angle iklan | Ya | Tanyakan, jangan diasumsikan |
| Kategori produk | Disarankan | Tebak dari foto & deskripsi |
| Profil kreator | Opsional | Pilih arketipe yang paling cocok dengan kategori |
| Durasi per shot | Opsional | 8 detik |
| Sudah punya foto kreator siap pakai | Opsional | Tidak — buat prompt gambar |

## Output — lima bagian

1. **Prompt gambar kreator** — untuk ChatGPT Images / Nano Banana. User mengunggah `model.png` (wajah influencer) sebagai referensi; hasil gambar disimpan sebagai `creator.png`.
2. **Shot list** — naskah untuk dibaca dan disetujui sebelum menghabiskan kredit.
3. **Prompt Flow per shot** — satu prompt per klip, sudah memuat nama file aset.
4. **Briefing Agent mode** — satu teks untuk menjalankan semua shot sekaligus bila Agent mode aktif.
5. **Skrip voiceover** — dengan timing, untuk ElevenLabs.

## 1. Prompt gambar kreator

Susunan kalimat, berurutan:

> Gunakan wajah dari model.png sebagai referensi, jaga wajahnya identik. Foto iPhone candid resolusi tinggi, fokus tajam di wajah, [gender] Indonesia usia [N] tahun, [warna kulit], [rambut + satu ketidakrapian], [riasan], memakai [pakaian spesifik — sebut bahan/warna]. [Posisi] di [lokasi nyata + 2 benda di latar]. Diambil dari [sudut kamera seolah dipegang sendiri]. [Sumber cahaya alami yang terang + arah]. Tekstur kulit asli dan jernih, tidak diretus berlebihan. Tanpa lampu studio.

Larangan: kata pujian fisik ("cantik", "tampan", "menawan", "sempurna"), latar polos, pose model, dan kata yang menurunkan kualitas (grain, retro, buram, kusam).

Lokasi dan pakaian di gambar ini mengikuti lokasi utama angle, supaya `creator.png` langsung cocok dipakai di shot pertama.

**Kenapa perlu prompt gambar:** Flow meniru gaya foto referensinya. Kalau referensinya foto studio, videonya cenderung ikut terlihat seperti iklan TV, bukan UGC. Prompt gambar mengubah foto model menjadi foto kreator bergaya HP candid dengan baju dan latar yang sesuai iklan.

**Kapan dilewati:** jika user sudah punya foto kreator yang candid gaya HP, bajunya sesuai, dan latarnya cocok dengan lokasi iklan, bagian ini dilewati. User cukup mengganti nama filenya menjadi `creator.png`. Tulis di bagian 1: "Dilewati — pakai foto kreator milikmu sebagai creator.png." 

## Foto produk dari beberapa sisi

User boleh mengunggah beberapa foto produk, misalnya `nama-produk-depan.jpg`, `nama-produk-belakang.jpg`, `nama-produk-samping.jpg`, `nama-produk-detail.jpg`.
- Untuk setiap shot yang menampilkan produk, pilih **satu** foto yang sisinya paling sesuai dengan cara produk dipegang atau dilihat di shot itu (produk diangkat ke kamera → depan; diputar → samping; close-up label → detail).
- Sebut nama file yang dipilih di prompt Flow shot itu, dan tulis di shot list: "Foto produk: [nama file] — alasan singkat".
- Di briefing Agent, daftarkan semua foto produk sebagai aset dengan keterangan sisinya.
- Arahkan aksi supaya produk menghadap kamera dengan sisi yang sama seperti foto yang dipilih; hindari memutar produk ke sisi yang tidak ada fotonya.

## 2. Shot list

Format tiap shot:

```
Shot N — [fungsi shot]
Lokasi   : ...
Aksi     : satu aksi saja
Produk   : tampil / tidak — bagaimana
Foto     : nama file produk yang dipakai (jika tampil)
Dialog   : "..."
```

Aturan naskah:
- **Kalimat pertama = hook.** Harus tetap menarik walau dibaca sebagai caption tanpa suara.
- **Nama produk tidak disebut di Shot 1.** Penonton belum peduli; perkenalkan setelah masalahnya terasa.
- **Spesifik mengalahkan umum.** "Kulitku lebih bagus" lemah; "jerawat di dagu tinggal satu" kuat.
- **Kecepatan bicara ±3 kata per detik.** 8 detik ≈ 24 kata, 10 detik ≈ 30 kata.
- **CTA santai.** "Linknya di bawah ya" — bukan "beli sekarang", "order hari ini", atau kode diskon (taruh di caption).
- Klaim harus bisa dipertanggungjawabkan. Jangan menulis klaim medis atau angka hasil yang tidak diberikan user.

## 3. Prompt Flow per shot

```
Video UGC vertikal, creator.png [posisi] di [lokasi], memakai [pakaian]. [Satu aksi].
[Jika produk tampil: nama-file-produk + cara dipegang + deskripsi warna/bentuk/bahan].
Berbicara langsung ke kamera: "[dialog]."
[Modifier gaya: 4K HD, fokus tajam, wajah identik dengan creator.png]. [Pencahayaan lokasi yang terang]. Vertikal 9:16, [durasi] detik.
```

- `creator.png` disebut di **setiap** prompt — tanpa itu wajah kreator berganti.
- File produk disebut di setiap shot yang menampilkan produk, disertai deskripsi visual yang menguatkan referensi.
- Pakaian ditulis ulang identik di tiap shot.

## 4. Briefing Agent mode

```
Aku sedang membuat iklan UGC vertikal [N] shot untuk [produk].

Aset:
- creator.png — kreator
- [file-produk] — produk ([deskripsi visual singkat])

Buat shot berikut secara berurutan:

Shot 1: [lokasi]. creator.png [aksi]. Berbicara ke kamera: "[dialog]." [cahaya], [modifier]. 9:16, [durasi] detik.
...

Jaga wajah, rambut, dan pakaian creator.png identik di semua shot. Semua shot vertikal 9:16.
```

Catatan untuk user: brief ini hanya jalan di Agent mode. Di mode biasa, satu prompt = satu klip, jadi pakai prompt per shot.

## 5. Skrip voiceover

```
VOICEOVER — [Produk]
Total ±[N] detik

[Shot 1 · 0–8 dtk]
"..."
[Shot 2 · 8–16 dtk]
"..."

ElevenLabs: Stability 0.45–0.55 · Similarity 0.75 · Style 0.25–0.35
Karakter suara: ngobrol, hangat, sedikit tidak rapi — bukan penyiar.
```

Timing dihitung dari durasi per shot yang dipilih.

## Ringkas jadi 3 shot

Jika user meminta 3 shot untuk angle yang aslinya lebih panjang:
- Shot 1 — hook + masalah
- Shot 2 — produk masuk (penemuan / demo / pemakaian)
- Shot 3 — hasil + CTA

Ciri khas visual angle tetap dipertahankan.

## Batasan yang perlu disampaikan ke user

- Suara kreator bisa berbeda antar klip di Flow. Solusinya voiceover terpisah di ElevenLabs.
- Tulisan kecil di kemasan sering rusak. Buat produk besar di frame.
- Adegan makan, minum, dan memakai makeup rawan glitch — tunjukkan sebelum dan sesudah, bukan prosesnya.
- Agent mode masih eksperimental; prompt per shot adalah cadangan yang selalu bisa dipakai.
