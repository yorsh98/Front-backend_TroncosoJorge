#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

docker compose up -d
docker compose exec app sh -c "chown -R www-data:www-data storage bootstrap/cache && chmod -R ug+rwX storage bootstrap/cache"
