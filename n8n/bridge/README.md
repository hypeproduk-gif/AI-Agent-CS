# Bridge Crypto (n8n + LI.FI)

Alur: Telegram `/bridge 100 USDC arb base` → quote LI.FI (rute termurah) → cek batas potongan → tombol persetujuan di Telegram → signer lokal kirim tx (approve ERC20 bila perlu) → polling status tiap 30 detik (maks 30 menit) → laporan hasil.

Chain: eth, op, bsc, polygon, base, arb, avax, linea, scroll. Token: USDC, USDT, ETH, WETH, DAI, WBTC. Argumen ke-5 opsional = token tujuan (mis. `/bridge 0.1 ETH arb base USDC`).

## Env n8n
| Var | Isi |
|---|---|
| `BRIDGE_WALLET_ADDRESS` | alamat wallet pengirim |
| `BRIDGE_ALLOWED_CHAT_ID` | chat ID Telegram yang boleh memerintah |
| `BRIDGE_SIGNER_URL` | mis. `http://signer:8787` |
| `BRIDGE_SIGNER_SECRET` | sama dengan `SIGNER_SECRET` di signer |
| `BRIDGE_MAX_FEE_PCT` | batas potongan total %, default 1.5 |
| `BRIDGE_SLIPPAGE` | default 0.005 |

## Signer
Private key tidak pernah masuk n8n.
```
npm i ethers
PRIVATE_KEY=0x... SIGNER_SECRET=... RPC_42161=https://... RPC_8453=https://... MAX_FROM_AMOUNT=1000000000 node n8n/bridge/signer.js
```
Jalankan hanya di jaringan privat (jangan expose ke internet). Pakai wallet khusus berisi dana secukupnya.

## Build
`node n8n/bridge/build.js` → `n8n/bridge-crypto.workflow.json`, lalu import ke n8n.

# Arbitrase Bridge (scanner + `/arb`)

**Scanner** (`bridge-arb-scanner.workflow.json`, tiap 10 menit):
1. Ambil harga tiap token di tiap chain (LI.FI `/token`), cari selisih ≥ `ARB_MIN_SPREAD_PCT`.
2. Kandidat teratas disimulasi penuh: `USDC@A → token@B` (swap+bridge) lalu `token@B → USDC@B`.
3. Profit = hasil USDC **minimum** (slippage maksimum) − modal − gas kedua leg. Hanya yang ≥ `ARB_MIN_PROFIT_USD` dikirim ke Telegram, lengkap dengan perintah siap salin `/arb ETH arb base 1000`. Peluang yang sama tidak dikirim ulang dalam 30 menit.

**Eksekusi `/arb <token> <chainAsal> <chainTujuan> [modalUSD]`** (dijalankan executor di `signer.js`):
1. Simulasi ulang kedua leg → batal tanpa tx jika profit worst-case < minimum.
2. Leg 1 dikirim, dipantau sampai dana tiba.
3. Leg 2 di-quote ulang dengan jumlah token yang benar-benar diterima → hanya dijual jika tetap untung; jika rugi, token **ditahan** (tidak dijual rugi) dan Anda diberi tahu.
4. Progres dikirim ke Telegram lewat webhook `bridge-arb-progress`.

Batasan: profit tidak bisa dijamin mutlak. Harga bisa bergerak saat leg 1 di-bridge; yang dijamin adalah workflow tidak akan *menjual* dalam keadaan rugi. Risikonya bisa berupa token tertahan di chain tujuan.

| Env tambahan (n8n) | Isi |
|---|---|
| `BRIDGE_PROGRESS_URL` | URL produksi webhook `bridge-arb-progress` (dipakai executor) |
| `ARB_CAPITAL_USD` | modal default, 1000 |
| `ARB_MIN_PROFIT_USD` | profit bersih minimum, 5 |
| `ARB_MIN_SPREAD_PCT` | selisih harga minimum untuk disimulasi, 0.5 |
| `ARB_TOKENS` / `ARB_CHAINS` | default `ETH,WBTC,LINK,UNI,AAVE` / `arb,base,op,polygon,bsc` |
| `ARB_MAX_SIMULATIONS` | kandidat yang disimulasi per scan, 6 |
| `LIFI_API_KEY` | opsional, supaya tidak kena rate limit (set juga di signer) |

Executor butuh USDC di chain asal, native gas di **kedua** chain, dan `RPC_<chainId>` untuk keduanya. Hanya satu arb berjalan pada satu waktu.

## Mode otomatis (tanpa perintah)
Set `ARB_AUTO=true`: tiap 5 menit, peluang teratas langsung dikirim ke executor. Semua pengaman tetap berlaku (cek ulang sebelum tx, tahan token bila jual rugi, satu arb sekaligus).

Contoh modal kecil ($10, BNB + Polygon):
```
ARB_AUTO=true
ARB_CAPITAL_USD=10
ARB_MIN_PROFIT_USD=0.10
ARB_CHAINS=bsc,polygon
```
