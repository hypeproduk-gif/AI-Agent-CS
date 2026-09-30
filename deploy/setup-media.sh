#!/usr/bin/env bash
# Sajikan foto testimoni dari VPS sendiri (Wablas gagal mengambil gambar dari imgur).
# Hasil: https://n8n.filodigital.my.id/media/testimoni/<file>
# Pakai: sudo bash setup-media.sh
set -euo pipefail
DOMAIN=n8n.filodigital.my.id
cd /opt/n8n
mkdir -p media/testimoni
for f in a1lUd6s.jpeg PKyNbKC.jpeg d6NRNvF.jpeg lpbKfeM.jpeg FJY2uQH.jpeg Dd7RITn.jpeg GnEmksa.jpeg bu6vcTC.jpeg ehgva5g.png oBjgkj6.jpeg xBsHtsu.jpeg RMBAETY.jpeg npyeJR2.jpeg X17RrHj.jpeg x06TLMG.jpeg JCBVQX0.jpeg hsHNEdF.jpeg 1MtF63B.jpeg ENKjMB0.jpeg SDlPu5R.jpeg YOCrdlT.jpeg H5YmA0w.jpeg vOdaTLV.jpeg zMF8qSr.jpeg; do
  [ -s "media/testimoni/$f" ] || curl -fsSL -A "Mozilla/5.0" -o "media/testimoni/$f" "https://i.imgur.com/$f" || echo "GAGAL unduh $f"
done
chmod -R a+rX media

cat > Caddyfile <<CADDY
$DOMAIN {
  handle_path /media/* {
    root * /srv/media
    file_server
  }
  reverse_proxy n8n:5678
}
CADDY

cat > docker-compose.yml <<YML
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    environment:
      - N8N_HOST=$DOMAIN
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://$DOMAIN/
      - N8N_PROXY_HOPS=1
      - N8N_LISTEN_ADDRESS=0.0.0.0
      - GENERIC_TIMEZONE=Asia/Jakarta
      - TZ=Asia/Jakarta
      - N8N_RUNNERS_ENABLED=true
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
    volumes:
      - n8n_data:/home/node/.n8n
  caddy:
    image: caddy:2
    restart: always
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./media:/srv/media:ro
      - caddy_data:/data
volumes:
  n8n_data:
  caddy_data:
YML

docker compose up -d
sleep 5
echo
echo "Jumlah foto: $(ls media/testimoni | wc -l) dari 24"
curl -s -o /dev/null -w "Tes foto: HTTP %{http_code} %{content_type}\n" "https://$DOMAIN/media/testimoni/a1lUd6s.jpeg"
