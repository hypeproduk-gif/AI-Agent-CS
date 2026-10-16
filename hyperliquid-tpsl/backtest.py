"""Backtest strategi auto_trader pada data harga MAINNET asli (tanpa uang, tanpa API key).

Pakai pengaturan dari .env yang sama (COINS, INTERVAL, ENTRY_MODE, TP_PCT, SL_PCT, dll).
Asumsi: entry di harga close candle sinyal, fee taker 0.045% x2, kalau TP & SL tersentuh
di candle yang sama dianggap kena SL (konservatif).
"""
import os
import time

from hyperliquid.info import Info
from hyperliquid.utils import constants

COINS = [c.strip().upper() for c in os.environ.get("COINS", "BTC,ETH,SOL,HYPE").split(",") if c.strip()]
INTERVAL = os.environ.get("INTERVAL", "5m")
ENTRY_MODE = os.environ.get("ENTRY_MODE", "cross").lower()
EMA_FAST = int(os.environ.get("EMA_FAST", "9"))
EMA_SLOW = int(os.environ.get("EMA_SLOW", "21"))
TP = float(os.environ.get("TP_PCT", "1.0")) / 100
SL = float(os.environ.get("SL_PCT", "0.5")) / 100
NOTIONAL = max(float(os.environ.get("MARGIN_USD", "2.1")) * int(os.environ.get("LEVERAGE", "5")), 10.5)
DAYS = float(os.environ.get("BT_DAYS", "7"))
FEE = 0.00045

INTERVAL_MS = {"1m": 60, "5m": 300, "15m": 900, "1h": 3600, "4h": 14400}[INTERVAL] * 1000
info = Info(constants.MAINNET_API_URL, skip_ws=True)


def ema(values, n):
    k, out, series = 2 / (n + 1), values[0], []
    for v in values:
        out = v * k + out * (1 - k)
        series.append(out)
    return series


def rsi_at(closes, i, n=14):
    gains = losses = 0.0
    for j in range(i - n + 1, i + 1):
        d = closes[j] - closes[j - 1]
        gains += max(d, 0)
        losses += max(-d, 0)
    return 100.0 if losses == 0 else 100 - 100 / (1 + gains / losses)


def run(coin):
    now = int(time.time() * 1000)
    start = now - int(DAYS * 86400 * 1000) - INTERVAL_MS * 100
    candles = []
    while start < now:  # API maks 5000 candle per request
        batch = info.candles_snapshot(coin, INTERVAL, start, now)
        if not batch:
            break
        candles += [c for c in batch if not candles or c["t"] > candles[-1]["t"]]
        start = batch[-1]["t"] + INTERVAL_MS
        if len(batch) < 2:
            break
    candles = [c for c in candles if c["t"] + INTERVAL_MS <= now]
    o = [float(c["o"]) for c in candles]
    h = [float(c["h"]) for c in candles]
    lo = [float(c["l"]) for c in candles]
    cl = [float(c["c"]) for c in candles]
    fast, slow = ema(cl, EMA_FAST), ema(cl, EMA_SLOW)

    trades, pos = [], None
    for i in range(max(EMA_SLOW, 15) + 50, len(cl)):
        if pos:
            side, entry = pos
            tp = entry * (1 + TP) if side == "long" else entry * (1 - TP)
            sl = entry * (1 - SL) if side == "long" else entry * (1 + SL)
            hit_sl = lo[i] <= sl if side == "long" else h[i] >= sl
            hit_tp = h[i] >= tp if side == "long" else lo[i] <= tp
            if hit_sl or hit_tp:
                pct = -SL if hit_sl else TP
                trades.append(NOTIONAL * pct - NOTIONAL * FEE * 2)
                pos = None
            continue
        up_now, up_prev = fast[i] > slow[i], fast[i - 1] > slow[i - 1]
        r = rsi_at(cl, i)
        if ENTRY_MODE == "trend":
            side = "long" if up_now and r < 70 else "short" if not up_now and r > 30 else None
        else:
            side = ("long" if up_now and not up_prev and r < 70
                    else "short" if not up_now and up_prev and r > 30 else None)
        if side:
            pos = (side, cl[i])
    return trades, len(candles)


if __name__ == "__main__":
    print(f"Backtest {DAYS:g} hari, {INTERVAL}, mode {ENTRY_MODE}, TP {TP*100:g}% SL {SL*100:g}%, "
          f"posisi ${NOTIONAL:.2f} per trade\n")
    total = []
    for coin in COINS:
        t, n = run(coin)
        total += t
        wins = sum(1 for x in t if x > 0)
        print(f"{coin:5} {len(t):4} trade | menang {wins:3} ({(wins / len(t) * 100) if t else 0:4.0f}%) "
              f"| PnL {sum(t):+.3f} USDC  ({n} candle)")
    wins = sum(1 for x in total if x > 0)
    print(f"\nTOTAL {len(total)} trade | menang {wins} ({(wins / len(total) * 100) if total else 0:.0f}%) "
          f"| PnL {sum(total):+.3f} USDC (sudah termasuk fee)")
