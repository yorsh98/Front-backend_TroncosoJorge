#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

docker compose exec app php artisan migrate --seed
docker compose exec app php artisan l5-swagger:generate
docker compose up -d queue-worker scheduler
