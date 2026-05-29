#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f backend-api/.env ]; then
  cp backend-api/.env.example backend-api/.env
fi

docker compose build app queue-worker scheduler
docker compose run --rm app composer install
docker compose run --rm app php artisan key:generate --force
docker compose run --rm app php artisan l5-swagger:generate
docker compose run --rm app sh -c "chmod -R 777 storage bootstrap/cache"
