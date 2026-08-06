#!/usr/bin/env bash
# Detecta o IP LAN do PC e grava EXPO_PUBLIC_API_URL em frontend/.env.
# Usado por `make start` / `make start-frontend` — celular físico (Expo Go) na mesma Wi‑Fi.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_ENV="${ROOT_DIR}/frontend/.env"
PORT="${API_PORT:-3000}"

pick_lan_ip() {
  local candidate
  for candidate in $(hostname -I 2>/dev/null); do
    case "$candidate" in
      127.*|169.254.*|172.17.*|172.18.*|172.19.*|172.20.*)
        continue
        ;;
      *)
        echo "$candidate"
        return 0
        ;;
    esac
  done

  ip -4 route get 1.1.1.1 2>/dev/null | awk '{for (i = 1; i <= NF; i++) if ($i == "src") print $(i + 1)}'
}

if [ ! -f "$FRONTEND_ENV" ]; then
  echo ">> frontend/.env ausente — rode: make setup" >&2
  exit 1
fi

IP="$(pick_lan_ip || true)"
if [ -z "${IP:-}" ]; then
  echo ">> Não foi possível detectar IP LAN (hostname -I / ip route)." >&2
  echo ">> Defina EXPO_PUBLIC_API_URL manualmente em frontend/.env" >&2
  exit 1
fi

API_URL="http://${IP}:${PORT}"

if grep -q '^EXPO_PUBLIC_API_URL=' "$FRONTEND_ENV"; then
  sed -i "s|^EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${API_URL}|" "$FRONTEND_ENV"
else
  printf '\nEXPO_PUBLIC_API_URL=%s\n' "$API_URL" >> "$FRONTEND_ENV"
fi

echo ">> EXPO_PUBLIC_API_URL=${API_URL} (IP LAN detectado — celular na mesma Wi‑Fi)"
