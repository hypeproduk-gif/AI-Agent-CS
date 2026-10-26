# Generator Creative Meta Ads

Brief produk → 6 CEP × 15 angle psikologi = **90 creative unik** (gambar **9:16** + **4:5**) + primary text panjang/pendek + 3 headline + description.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export GEMINI_API_KEY=...           # opsional: foto scene UGC dari foto produk asli (aistudio.google.com)
python3 ads/generate.py ads/briefs/contoh-salglow.txt --foto produk.png --jumlah 15
# hemat: CEP tertentu saja, atau angle tertentu:
python3 ads/generate.py ads/briefs/x.txt --foto x.png --cep 1,3

python3 ads/generate.py ads/briefs/x.txt --foto x.png --jumlah 6 --angle fomo,regret_trigger,value_shock
```

Hasil di `ads/output/<produk>/`:
- `cep1-01-9x16.png`, `cep1-01-4x5.png` … `cep6-15-4x5.png` (180 gambar) — siap upload (Reels/Stories & Feed)
- `copy.md` — strategi + copy per creative
- `copy.csv` — kolom `cep` & `psych_angle` untuk membaca angle pemenang di Ads Manager; untuk bulk upload / tracking
- `plan.json` — bisa diedit lalu render ulang: `--dari-json ads/output/<produk>/plan.json`

## Cara kerja
1. Claude menganalisis brief → avatar, pain, keberatan, USP, offer.
2. Memetakan **6 CEP** (momen nyata saat target teringat butuh produk: kapan, di mana, dengan siapa, perasaan apa).
   Tiap creative = 1 CEP × 1 dari **15 angle psikologi**: `fomo`, `instant_gratification`, `curiosity_gap`, `shock_result`,
   `social_proof`, `authority`, `hidden_gem`, `relatable_pain`, `transformation`, `value_shock`, `curated_discovery`,
   `emotional_story`, `comparison_curiosity`, `demonstration_proof`, `regret_trigger`. Setiap angle punya pagar kejujuran
   (tidak ada angka viral, ahli, atau harga coret yang dikarang).
3. Variasi (awareness problem/solution/product × framework problem-solution, before-after,
   testimoni, comparison, offer, myth-buster, UGC callout) dengan 4 layout: hero, testimonial, split, comparison.
4. Hook yang sudah dipakai disimpan di `ads/output/_history.json` dan dilarang diulang → tiap produk/batch unik.
5. Gambar dirender dengan zona aman Reels (atas 14%, bawah 20% kosong).

## Tips brief (makin spesifik, makin convert)
Tulis: nama, harga & promo, target (siapa, momen masalahnya), fitur dengan angka, benefit, testimoni **asli**,
izin (BPOM/Halal), garansi/bonus, dan **larangan klaim**. Testimoni tidak akan dikarang bila tidak ada di brief.
Tanpa `--foto`, gambar berisi kotak **[PRODUK ASLI]** sebagai slot foto produk asli (tempel di Canva/CapCut).
Setiap creative juga punya **brief visual** untuk tim konten; bagian bertanda [PRODUK ASLI] wajib pakai foto/video produk asli.
Foto produk PNG transparan (remove.bg) memberi hasil paling rapi.

## Gambar AI (Gemini / Nano Banana)
Dengan `GEMINI_API_KEY` + `--foto`, foto produk asli dikirim sebagai referensi dan Gemini membuat foto **gaya UGC**
(iPhone, cahaya natural, orang & setting Indonesia) di momen CEP, dengan produk asli dipegang/dipakai — bukan produk karangan.
Tanpa `--foto`, scene dibuat tanpa produk dan muncul slot [PRODUK ASLI].
Model default `gemini-2.5-flash-image`; untuk kualitas lebih tinggi: `export IMAGE_MODEL=gemini-3-pro-image-preview`.

## Versi web lokal (dengan foto AI Gemini)
Mac: klik dua kali `ads/Buka Studio Iklan.command`, atau di Terminal: `python3 ads/app.py`.
Browser terbuka di http://localhost:8765. Isi API key sekali di kotak **API key** (disimpan di `ads/.env`, tidak ikut ter-commit).
Gambar AI tersimpan di `ads/output/<produk>/scenes/`.
