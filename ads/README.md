# Generator Creative Meta Ads

Brief produk → 6 creative unik (gambar **9:16** + **4:5**) + primary text panjang/pendek + 3 headline + description.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...        # opsional: foto scene AI sebagai background
python3 ads/generate.py ads/briefs/contoh-salglow.txt --foto produk.png --jumlah 6
```

Hasil di `ads/output/<produk>/`:
- `01-9x16.png`, `01-4x5.png`, … — siap upload (Reels/Stories & Feed)
- `copy.md` — strategi + copy per creative
- `copy.csv` — untuk bulk upload / tracking
- `plan.json` — bisa diedit lalu render ulang: `--dari-json ads/output/<produk>/plan.json`

## Cara kerja
1. Claude menganalisis brief → avatar, pain, keberatan, USP, offer.
2. Membuat N angle berbeda (awareness problem/solution/product × framework problem-solution, before-after,
   testimoni, comparison, offer, myth-buster, UGC callout) dengan 4 layout: hero, testimonial, split, comparison.
3. Hook yang sudah dipakai disimpan di `ads/output/_history.json` dan dilarang diulang → tiap produk/batch unik.
4. Gambar dirender dengan zona aman Reels (atas 14%, bawah 20% kosong).

## Tips brief (makin spesifik, makin convert)
Tulis: nama, harga & promo, target (siapa, momen masalahnya), fitur dengan angka, benefit, testimoni **asli**,
izin (BPOM/Halal), garansi/bonus, dan **larangan klaim**. Testimoni tidak akan dikarang bila tidak ada di brief.
Foto produk PNG transparan (remove.bg) memberi hasil paling rapi.
