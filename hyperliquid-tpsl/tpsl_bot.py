"""Auto TP/SL untuk Hyperliquid perps.

Setiap POLL_SECONDS: cek semua posisi terbuka. Kalau posisi belum punya
order TP / SL, bot memasang trigger order reduce-only (market) berdasarkan
entry price +/- TP_PCT / SL_PCT. Order TP/SL tersimpan di server Hyperliquid,
jadi tetap jalan walau bot mati.
"""
import os
import time

import eth_account
from hyperliquid.exchange import Exchange
from hyperliquid.info import Info
from hyperliquid.utils import constants

from notify import notify


def env(name, default=None):
    v = os.environ.get(name, default)
    if v is None:
        raise SystemExit(f"Env {name} wajib diisi")
    return v


SECRET = env("HL_SECRET_KEY")
ACCOUNT = env("HL_ACCOUNT_ADDRESS")
TESTNET = env("HL_TESTNET", "true").lower() == "true"
TP_PCT = float(env("TP_PCT", "3.0"))
SL_PCT = float(env("SL_PCT", "1.5"))
POLL = int(env("POLL_SECONDS", "10"))

URL = constants.TESTNET_API_URL if TESTNET else constants.MAINNET_API_URL
info = Info(URL, skip_ws=True)
exchange = Exchange(eth_account.Account.from_key(SECRET), URL, account_address=ACCOUNT)
SZ_DECIMALS = {a["name"]: a["szDecimals"] for a in info.meta()["universe"]}


def round_px(coin, px):
    # Aturan Hyperliquid perps: maks 5 angka signifikan & maks (6 - szDecimals) desimal
    return round(float(f"{px:.5g}"), 6 - SZ_DECIMALS[coin])


def existing_tpsl(coin):
    kinds = set()
    for o in info.frontend_open_orders(ACCOUNT):
        if o["coin"] == coin and o.get("isTrigger") and o.get("reduceOnly"):
            t = o.get("orderType", "")
            if "Take Profit" in t:
                kinds.add("tp")
            elif "Stop" in t:
                kinds.add("sl")
    return kinds


def place(coin, is_long, size, trigger_px, kind):
    px = round_px(coin, trigger_px)
    res = exchange.order(
        coin,
        not is_long,  # posisi long ditutup dengan sell
        size,
        px,
        {"trigger": {"triggerPx": px, "isMarket": True, "tpsl": kind}},
        reduce_only=True,
    )
    ok = res.get("status") == "ok" and "error" not in str(res.get("response"))
    label = "Take Profit" if kind == "tp" else "Stop Loss"
    notify(f"{'✅' if ok else '⚠️'} [{coin}] pasang {label} @ {px}" + ("" if ok else f"\n{res}"))


def tick():
    for ap in info.user_state(ACCOUNT)["assetPositions"]:
        p = ap["position"]
        szi = float(p["szi"])
        if szi == 0:
            continue
        coin, entry, is_long, size = p["coin"], float(p["entryPx"]), szi > 0, abs(szi)
        have = existing_tpsl(coin)
        sign = 1 if is_long else -1
        if "tp" not in have:
            place(coin, is_long, size, entry * (1 + sign * TP_PCT / 100), "tp")
        if "sl" not in have:
            place(coin, is_long, size, entry * (1 - sign * SL_PCT / 100), "sl")


if __name__ == "__main__":
    print(f"Bot TP/SL jalan ({'TESTNET' if TESTNET else 'MAINNET'}) TP={TP_PCT}% SL={SL_PCT}%")
    while True:
        try:
            tick()
        except Exception as e:  # jaringan/API error: lanjut di loop berikutnya
            print("error:", e)
        time.sleep(POLL)
