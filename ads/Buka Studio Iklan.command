#!/bin/bash
# Klik dua kali: update otomatis ke versi terbaru, lalu buka Studio Iklan di browser.
cd "$(dirname "$0")"
U=https://raw.githubusercontent.com/hypeproduk-gif/AI-Agent-CS/claude/zen-curie-gae18v/ads
echo "Cek update..."
mkdir -p web
for f in app.py generate.py web/studio-iklan.html web/batch.html "Buka Studio Iklan.command"; do
  curl -fsSL "$U/${f// /%20}" -o "$f.new" && mv "$f.new" "$f" || rm -f "$f.new"
done
chmod +x "Buka Studio Iklan.command"
pip3 install -q pillow 2>/dev/null
lsof -ti tcp:8765 | xargs kill 2>/dev/null
python3 app.py
