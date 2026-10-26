# Generator Creative Meta Ads

Brief produk → 15 creative unik (6 CEP × 15 angle psikologi) (gambar **9:16** + **4:5**) + primary text panjang/pendek + 3 headline + description.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...        # opsional: foto scene AI sebagai background
python3 ads/generate.py ads/briefs/contoh-salglow.txt --foto produk.png --jumlah 15
# hanya angle tertentu:
python3 ads/generate.py ads/briefs/x.txt --foto x.png --jumlah 6 --angle fomo,regret_trigger,value_shock
```

Hasil di `ads/output/<produk>/`:
- `01-9x16.png`, `01-4x5.png`, … — siap upload (Reels/Stories & Feed)
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
