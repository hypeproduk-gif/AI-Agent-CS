"""Auto trader perpetual Hyperliquid + TP/SL otomatis.

Strategi: EMA cross di candle yang sudah close.
- EMA cepat memotong ke atas EMA lambat (dan RSI < 70)  -> LONG
- EMA cepat memotong ke bawah EMA lambat (dan RSI > 30) -> SHORT
Bisa banyak coin (COINS=BTC,ETH). Maks 1 posisi per coin. Setelah entry, TP/SL dipasang oleh tpsl_bot.tick().
"""
import os
import time

from tpsl_bot import ACCOUNT, POLL, SZ_DECIMALS, TESTNET, exchange, info, tick

COINS = [c.strip().upper() for c in os.environ.get("COINS", os.environ.get("COIN", "BTC")).split(",") if c.strip()]
INTERVAL = os.environ.get("INTERVAL", "15m")
MARGIN_USD = float(os.environ.get("MARGIN_USD", "5"))
LEVERAGE = int(os.environ.get("LEVERAGE", "3"))
EMA_FAST = int(os.environ.get("EMA_FAST", "9"))
EMA_SLOW = int(os.environ.get("EMA_SLOW", "21"))
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
    closes = [float(c["c"]) for c in candles[:-1]]  # buang candle yang belum close
    fast, slow = ema(closes, EMA_FAST), ema(closes, EMA_SLOW)
    r = rsi(closes)
    if fast[-2] <= slow[-2] and fast[-1] > slow[-1] and r < 70:
        return "long", closes[-1]
    if fast[-2] >= slow[-2] and fast[-1] < slow[-1] and r > 30:
        return "short", closes[-1]
    return None, closes[-1]


def has_position(coin):
    for ap in info.user_state(ACCOUNT)["assetPositions"]:
        if ap["position"]["coin"] == coin and float(ap["position"]["szi"]) != 0:
            return True
    return False


def open_position(coin, side, px):
    notional = max(MARGIN_USD * LEVERAGE, MIN_NOTIONAL)
    sz = round(notional / px, SZ_DECIMALS[coin])
    res = exchange.market_open(coin, side == "long", sz, None, 0.01)
    print(f"[{coin}] OPEN {side.upper()} size {sz} (~${notional:.2f}): {res}")


if __name__ == "__main__":
    print(f"Auto trader {','.join(COINS)} {INTERVAL} ({'TESTNET' if TESTNET else 'MAINNET'}) "
          f"margin ${MARGIN_USD} x{LEVERAGE} per coin")
    for coin in COINS:
        exchange.update_leverage(LEVERAGE, coin, is_cross=False)
    last_candle = {}
    while True:
        try:
            candle_id = int(time.time() * 1000) // INTERVAL_MS
            for coin in COINS:
                if last_candle.get(coin) == candle_id or has_position(coin):
                    continue
                side, px = signal(coin)
                last_candle[coin] = candle_id  # cek sinyal 1x per candle
                if side:
                    open_position(coin, side, px)
                    time.sleep(3)
            tick()  # pasang TP/SL untuk posisi yang belum punya
        except Exception as e:
            print("error:", e)
        time.sleep(POLL)
