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
