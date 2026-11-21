#!/usr/bin/env bash
# Pakai: PASS='password-APP_PASSWORD' ./isi-antrean.sh api-minggu1.json
set -e
: "${PASS:?Isi dulu PASS='...'}"
F="${1:?nama file json}"
grep -q 'GANTI-DOMAIN\|\[ANGKA' "$F" && { echo "STOP: $F masih berisi GANTI-DOMAIN atau [ANGKA]. Edit dulu."; exit 1; }
curl -sS -u "x:$PASS" -H 'Content-Type: application/json' --data-binary @"$F" http://103.55.38.134:8090/api/threads; echo
