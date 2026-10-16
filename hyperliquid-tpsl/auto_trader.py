"""Auto trader perpetual Hyperliquid + TP/SL otomatis.

Strategi: EMA cross di candle yang sudah close.
- EMA cepat memotong ke atas EMA lambat (dan RSI < 70)  -> LONG
- EMA cepat memotong ke bawah EMA lambat (dan RSI > 30) -> SHORT
Bisa banyak coin (COINS=BTC,ETH). Maks 1 posisi per coin. Setelah entry, TP/SL dipasang oleh tpsl_bot.tick().
"""
import os
import time

from notify import notify
from tpsl_bot import ACCOUNT, POLL, SZ_DECIMALS, TESTNET, exchange, info, tick

COINS = [c.strip().upper() for c in os.environ.get("COINS", os.environ.get("COIN", "BTC")).split(",") if c.strip()]
INTERVAL = os.environ.get("INTERVAL", "15m")
MARGIN_USD = float(os.environ.get("MARGIN_USD", "5"))
LEVERAGE = int(os.environ.get("LEVERAGE", "3"))
EMA_FAST = int(os.environ.get("EMA_FAST", "9"))
EMA_SLOW = int(os.environ.get("EMA_SLOW", "21"))
# cross = entry hanya saat EMA berpotongan (jarang); trend = entry kapan saja searah tren (sering)
ENTRY_MODE = os.environ.get("ENTRY_MODE", "cross").lower()
HEARTBEAT_MIN = int(os.environ.get("HEARTBEAT_MIN", "60"))  # laporan rutin ke Telegram, 0 = mati
MIN_NOTIONAL = 10.5  # minimum order Hyperliquid $10

INTERVAL_MS = {"1m": 60, "5m": 300, "15m": 900, "1h": 3600, "4h": 14400}[INTERVAL] * 1000


def ema(values, n):
    k, out = 2 / (n + 1), values[0]
    series = []
    for v in values:
        out = v * k + out * (1 - k)
        series.append(out)
    return series


def rsi(values, n=14):
    gains = losses = 0.0
    for a, b in zip(values[-n - 1:-1], values[-n:]):
        d = b - a
        gains += max(d, 0)
        losses += max(-d, 0)
    return 100.0 if losses == 0 else 100 - 100 / (1 + gains / losses)


def signal(coin):
    now = int(time.time() * 1000)
    candles = info.candles_snapshot(coin, INTERVAL, now - INTERVAL_MS * 200, now)
    closes = [float(c["c"]) for c in candles if c["t"] + INTERVAL_MS <= now]  # hanya candle yang sudah close
    fast, slow = ema(closes, EMA_FAST), ema(closes, EMA_SLOW)
    r = rsi(closes)
    up_now, up_prev = fast[-1] > slow[-1], fast[-2] > slow[-2]
    side = None
    if ENTRY_MODE == "trend":
        if up_now and r < 70:
            side = "long"
        elif not up_now and r > 30:
            side = "short"
    else:
        if up_now and not up_prev and r < 70:
            side = "long"
        elif not up_now and up_prev and r > 30:
            side = "short"
    print(f"[{coin}] close {closes[-1]} EMA{EMA_FAST}={fast[-1]:.4f} EMA{EMA_SLOW}={slow[-1]:.4f} "
          f"RSI={r:.0f} -> {side or 'tidak ada sinyal'}")
    return side, closes[-1]


def open_coins():
    return {ap["position"]["coin"] for ap in info.user_state(ACCOUNT)["assetPositions"]
            if float(ap["position"]["szi"]) != 0}


def report_closed(coin):
    fills = [f for f in info.user_fills(ACCOUNT) if f["coin"] == coin]
    if not fills:
        return notify(f"🔒 [{coin}] posisi tertutup")
    last = max(fills, key=lambda f: f["time"])
    pnl = float(last.get("closedPnl", 0)) - float(last.get("fee", 0))
    notify(f"{'🟢 PROFIT' if pnl >= 0 else '🔴 LOSS'} [{coin}] posisi tertutup @ {last['px']}\n"
           f"PnL: {pnl:+.4f} USDC")


def open_position(coin, side, px):
    notional = max(MARGIN_USD * LEVERAGE, MIN_NOTIONAL)
    sz = round(notional / px, SZ_DECIMALS[coin])
    res = exchange.market_open(coin, side == "long", sz, None, 0.01)
    ok = res.get("status") == "ok" and "error" not in str(res.get("response"))
    notify(f"{'🚀' if ok else '⚠️'} [{coin}] OPEN {side.upper()} size {sz} (~${notional:.2f})"
           + ("" if ok else f"\n{res}"))


if __name__ == "__main__":
    notify(f"🤖 Auto trader jalan: {','.join(COINS)} {INTERVAL} mode {ENTRY_MODE} ({'TESTNET' if TESTNET else 'MAINNET'}) "
           f"margin ${MARGIN_USD} x{LEVERAGE} per coin")
    for coin in COINS:
        exchange.update_leverage(LEVERAGE, coin, is_cross=False)
    last_candle = {}
    prev_open = open_coins()
    last_error = None
    last_beat = time.time()
    while True:
        try:
            now_open = open_coins()
            for coin in prev_open - now_open:
                report_closed(coin)
            candle_id = int(time.time() * 1000) // INTERVAL_MS
            for coin in COINS:
                if last_candle.get(coin) == candle_id or coin in now_open:
                    continue
                side, px = signal(coin)
                last_candle[coin] = candle_id  # cek sinyal 1x per candle
                if side:
                    open_position(coin, side, px)
                    time.sleep(3)
            tick()  # pasang TP/SL untuk posisi yang belum punya
            prev_open = open_coins()
            last_error = None
            if HEARTBEAT_MIN and time.time() - last_beat >= HEARTBEAT_MIN * 60:
                value = float(info.user_state(ACCOUNT)["marginSummary"]["accountValue"])
                notify(f"💓 Bot masih jalan. Posisi terbuka: {', '.join(sorted(prev_open)) or 'tidak ada'}\n"
                       f"Saldo akun: {value:.2f} USDC")
                last_beat = time.time()
        except Exception as e:
            if str(e) != last_error:  # jangan spam error yang sama
                notify(f"⚠️ error: {e}")
                last_error = str(e)
        time.sleep(POLL)
