#!/usr/bin/env bash
# Pasang n8n self-hosted (Docker + HTTPS otomatis via Caddy) di VPS Ubuntu.
# Pakai: sudo bash install-n8n.sh n8n.domainanda.com
set -euo pipefail
DOMAIN="${1:?Pakai: sudo bash install-n8n.sh n8n.domainanda.com}"
[ "$(id -u)" = 0 ] || { echo "Jalankan dengan sudo"; exit 1; }

IP=$(curl -fsS4 https://api.ipify.org || true)
DNS=$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)
if [ -n "$IP" ] && [ "$DNS" != "$IP" ]; then
  echo "⚠️  $DOMAIN mengarah ke '${DNS:-tidak ada}', bukan IP VPS ini ($IP)."
  echo "   Buat record A di DNS dulu, tunggu beberapa menit, lalu jalankan ulang."
  exit 1
fi

command -v docker >/dev/null || curl -fsSL https://get.docker.com | sh
if ! swapon --show | grep -q .; then # swap 2GB supaya VPS RAM kecil tidak kehabisan memori
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
command -v ufw >/dev/null && { ufw allow 22/tcp; ufw allow 80/tcp; ufw allow 443/tcp; ufw --force enable; } || true

mkdir -p /opt/n8n && cd /opt/n8n
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
    command: caddy reverse-proxy --from $DOMAIN --to n8n:5678
    volumes:
      - caddy_data:/data
volumes:
  n8n_data:
  caddy_data:
YML
docker compose up -d
echo
echo "✅ Selesai. Buka https://$DOMAIN (tunggu ±1 menit untuk sertifikat HTTPS), lalu buat akun admin."
echo "   Update n8n nanti: cd /opt/n8n && docker compose pull && docker compose up -d"
