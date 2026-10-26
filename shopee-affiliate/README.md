# Shopee Affiliate Autopost

Alur: **Pinterest / video sendiri → thumbnail → headline + caption AI (Claude) → posting Facebook Page + Instagram Reels + Threads**.

## Setup
```bash
cd shopee-affiliate
pip install -r requirements.txt   # butuh juga ffmpeg terpasang
cp .env.example .env              # isi token
```
- **Meta**: buat App di developers.facebook.com, hubungkan Page + akun IG Business/Creator,
  ambil Page Access Token jangka panjang (izin `pages_manage_posts`, `instagram_content_publish`, `instagram_basic`).
- **Instagram** hanya menerima video dari URL publik → `PUBLIC_DIR` harus disajikan di `PUBLIC_BASE_URL`.

## Pakai
```bash
python autopost.py --pin https://pin.it/xxxx --shopee https://s.shopee.co.id/xxxx --produk "Serum Vitamin C" --dry-run
python autopost.py --pin ... --shopee ... --produk "..."          # posting FB + IG
```
Batch dari CSV (`batch.csv.example`):
```bash
tail -n +2 batch.csv | while IFS=, read pin shopee produk judul; do
  python autopost.py --pin "$pin" --shopee "$shopee" --produk "$produk" ${judul:+--judul "$judul"}; done
```
Hasil (video, thumbnail, caption.json) tersimpan di `output/<waktu>/`.

Catatan: link di caption IG tidak bisa diklik, jadi link Shopee ditaruh di komentar pertama + "link di bio".
Pastikan Anda punya hak pakai video Pinterest yang direpost.
