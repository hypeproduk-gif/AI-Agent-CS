"""Kirim notifikasi ke Telegram (opsional: aktif kalau TG_TOKEN & TG_CHAT_ID diisi)."""
import os

import requests

TG_TOKEN = os.environ.get("TG_TOKEN", "").strip()
TG_CHAT_ID = os.environ.get("TG_CHAT_ID", "").strip()


def notify(text):
    print(text)
    if not (TG_TOKEN and TG_CHAT_ID):
        return
    try:
        requests.post(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT_ID, "text": text},
            timeout=10,
        )
    except Exception as e:  # notifikasi gagal tidak boleh menghentikan bot
        print("telegram error:", e)
