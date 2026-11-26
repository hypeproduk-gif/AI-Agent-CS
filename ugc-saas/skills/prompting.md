# Aturan Prompt Video UGC

Model video cenderung menghasilkan gambar yang terlalu rapi: wajah di tengah, kulit licin, cahaya studio. Untuk iklan UGC itu justru merugikan. Prompt harus **sengaja memasukkan ketidaksempurnaan** yang biasa muncul di video HP.

## Lima modifier yang selalu ada

| Modifier | Mencegah |
|----------|----------|
| `nuansa handheld, sedikit goyangan kamera` | Gambar kaku seperti pakai tripod |
| `candid` | Kesan adegan yang disiapkan |
| `tekstur kulit natural` | Kulit plastik khas AI |
| `framing tidak sempurna` | Subjek selalu di tengah |
| pencahayaan sesuai lokasi | Cahaya studio bawaan model |

**Pengecualian:** angle Podcast Clip memakai `kamera statis di tripod, tanpa goyangan`. Empat modifier lainnya tetap dipakai.

## Kamus pencahayaan

| Lokasi | Pilihan |
|--------|---------|
| Dapur | cahaya jendela pagi dari samping · lampu gantung dapur hangat |
| Mobil | cahaya mendung lewat kaca depan · matahari sore dari jendela samping |
| Kamar mandi | lampu cermin wastafel · lampu plafon kuning |
| Kamar tidur | cahaya pagi tembus gorden · lampu tidur hangat |
| Meja kerja malam | lampu meja hangat dari samping + cahaya layar kebiruan |
| Gym | lampu neon plafon, agak keras · cahaya jendela besar |
| Luar ruangan | langit mendung merata · matahari sore, sedikit silau |
| Setup podcast | ring light lembut dari depan · cahaya jendela dari samping |

Gunakan satu kombinasi yang sama di semua shot yang lokasinya sama.

## Menyebut aset

Flow mengenali gambar yang diunggah dari **nama file yang ditulis di kalimat prompt** — tanpa tanda kurung atau simbol khusus.

> creator.png duduk di jok mobil memegang botol-tumbler.jpg ...

- Ejaan harus sama persis dengan file yang diunggah, termasuk huruf besar-kecil dan ekstensi.
- `creator.png` disebut di semua shot. Lupa sekali = wajah bisa berubah.
- File produk disebut setiap kali produk ada di frame. Lupa = model mengarang produk lain.
- Beri nama file yang deskriptif (`serum-vitc.jpg`), bukan `IMG_2231.jpg`.
- `model.png` hanya untuk membuat gambar kreator, tidak dipakai di Flow.

## Kunci produk — larangan ketat

Produk di video **harus identik** dengan foto produk. Perubahan sekecil apa pun dilarang:
- bentuk, ukuran relatif, dan proporsi
- warna (termasuk gradasi, transparansi, dan finishing doff/glossy)
- posisi, ukuran, jenis huruf, dan isi semua teks, logo, dan label
- jumlah dan letak komponen (tutup, tombol, engsel, tali, stiker)
- tekstur dan bahan

Cara menulisnya di setiap prompt Flow yang menampilkan produk:
1. Sebut nama file foto produk yang dipakai di shot itu.
2. Deskripsikan produk persis seperti di foto: warna, bentuk, bahan, letak teks/logo. Jangan menambah detail yang tidak ada di foto, dan jangan mengarang isi label.
3. Tutup dengan kalimat kunci: **"Produk harus identik dengan [nama file]: bentuk, warna, teks, logo, dan posisinya tidak boleh berubah sedikit pun. Jangan menambah, menghapus, atau memindahkan teks dan logo."**
4. Jaga gerakan produk sederhana (pegang, angkat, putar pelan) dan produk mengisi 30–40% frame, karena gerakan rumit dan produk kecil adalah penyebab utama produk berubah bentuk.

Di briefing Agent, tambahkan kalimat kunci yang sama untuk semua shot.

## Panjang dialog

±3 kata per detik.

| Durasi | Batas kata |
|--------|-----------|
| 6 dtk | 18 |
| 8 dtk | 24 |
| 10 dtk | 30 |

Lebih dari batas → bicara terburu-buru dan terdengar membaca naskah. Jauh di bawah batas → ada jeda kosong yang canggung.

## Gaya bahasa

Tulis seperti orang mengirim voice note ke teman.

**Terdengar asli**
- "Jujur aku nggak nyangka bakal sebagus ini."
- "Oke, ini harus aku ceritain."
- "Udah dua minggu, dan bedanya kerasa."
- "Awalnya aku ragu, tapi..."
- "Kalian harus coba sendiri."

**Terdengar iklan — hindari**
- "Hadir dengan formula terbaru..."
- "Rasakan sensasinya..."
- "Teruji klinis..."
- "Dapatkan sekarang juga..."

**CTA yang aman**: "Linknya di bawah ya." · "Aku taruh linknya di keranjang kuning." · "Coba aja dulu, nggak rugi."
**CTA yang merusak**: "Beli sekarang" · "Order hari ini" · "Kunjungi website kami" · menyebut kode diskon di dialog.

## Adegan yang rawan glitch

| Adegan | Masalah | Cara aman |
|--------|---------|-----------|
| Makan / minum | Makanan hilang, gerakan mulut aneh | Pegang produk ke kamera sambil tersenyum, tanpa mengonsumsi |
| Memakai makeup | Warna pindah tempat, belepotan | Tunjukkan hasil jadi, bukan proses aplikasi |
| Tangan memegang benda rumit | Jari berlebih, produk berubah bentuk | Satu gerakan sederhana: ambil, pegang, putar, atau taruh |
| Tulisan di kemasan | Huruf rusak | Produk mengisi 30–40% frame, resolusi minimal 720p |
| Memakai kacamata / aksesori wajah | Frame melengkung, lensa berubah | Gerakan pelan, satu kali, kedua tangan |
| Overlay komentar TikTok | Teks acak | Tulis instruksi singkat di prompt, tapi tambahkan teks aslinya di CapCut |
| Sudut pandang orang pertama (POV) | Proporsi tangan aneh | Satu interaksi tangan per shot |

## Template final per shot

```
Video UGC vertikal, creator.png [posisi] di [lokasi spesifik], memakai [pakaian identik].
[Satu aksi]. [file-produk + cara dipegang + warna/bentuk/bahan].
Berbicara langsung ke kamera: "[dialog sesuai batas kata]."
Nuansa handheld, sedikit goyangan kamera, candid, tekstur kulit natural, framing tidak sempurna, [pencahayaan].
Vertikal 9:16, [durasi] detik.
```

Untuk shot yang menampilkan produk, tambahkan kalimat kunci produk di akhir prompt.

Semakin spesifik isi tiap kurung, semakin kecil peluang hasilnya terlihat generik.
