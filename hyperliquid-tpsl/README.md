# Hyperliquid Auto TP/SL

Bot memantau posisi perps kamu dan otomatis memasang Take Profit & Stop Loss
(trigger order reduce-only) untuk setiap posisi yang belum punya TP/SL.

## Setup
1. Hyperliquid → More → API → buat **API Wallet** (tidak bisa withdraw, lebih aman).
2. `pip install -r requirements.txt`
3. `cp .env.example .env`, isi key & alamat, lalu:
   ```bash
   set -a; source .env; set +a
   python tpsl_bot.py
   ```
4. Tes dulu di **testnet** (`HL_TESTNET=true`, faucet di app.hyperliquid-testnet.xyz), baru ganti `false`.

## Cara kerja
- TP = entry ± `TP_PCT`%, SL = entry ∓ `SL_PCT`% (otomatis menyesuaikan long/short).
- Order disimpan di server Hyperliquid → tetap aktif walau bot dimatikan.
- Kalau kamu menambah size posisi, hapus TP/SL lama agar bot memasang ulang sesuai size baru.

⚠️ Jangan pernah commit file `.env`. Trading leverage berisiko tinggi.
