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
### Tracking per platform (Sub ID)
Di Shopee Affiliate → Custom Link, buat 3 link untuk produk yang sama dengan Sub ID `fb`, `ig`, `threads`:
```bash
python autopost.py --video v.mp4 --shopee-fb LINK_FB --shopee-ig LINK_IG --shopee-threads LINK_TH --produk "..."
```
Setelah 2–4 minggu, bandingkan komisi per Sub ID di laporan Shopee Affiliate.

Batch dari CSV (`batch.csv.example`, kolom judul boleh kosong):
```bash
tail -n +2 batch.csv | while IFS=, read video fb ig th produk judul; do
  python autopost.py --video "$video" --shopee-fb "$fb" --shopee-ig "$ig" --shopee-threads "$th" \
    --produk "$produk" ${judul:+--judul "$judul"}; done
```
Hasil (video, thumbnail, caption.json) tersimpan di `output/<waktu>/`.

Catatan: link di caption IG tidak bisa diklik, jadi link Shopee ditaruh di komentar pertama + "link di bio".
Pastikan Anda punya hak pakai video Pinterest yang direpost.

## Web app (tanpa terminal)
`app.py` = halaman web: upload video / link Pinterest → preview thumbnail + caption (bisa diedit) → centang FB/IG/Threads → Posting.
Folder video publik ikut disajikan di `/media/`, jadi isi `PUBLIC_BASE_URL=https://domain-anda/media`.

```bash
python app.py                     # buka http://IP:8090, login password = APP_PASSWORD
sudo cp autopost-web.service /etc/systemd/system/ && sudo systemctl enable --now autopost-web
```
