#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIP_NAME="ProviEmplea_2026_Evaluacion.zip"
ZIP_PATH="${ROOT_DIR}/${ZIP_NAME}"

cd "${ROOT_DIR}"

rm -f "${ZIP_PATH}"

zip -r "${ZIP_PATH}" . \
  -x "${ZIP_NAME}" \
  -x ".env" \
  -x ".env.local" \
  -x ".env.production" \
  -x "*/.env" \
  -x "*/.env.local" \
  -x "*/.env.production" \
  -x "*/node_modules/*" \
  -x "*/vendor/*" \
  -x "*/storage/app/private/*" \
  -x "*/storage/app/public/*" \
  -x "*/storage/framework/cache/*" \
  -x "*/storage/framework/sessions/*" \
  -x "*/storage/framework/testing/*" \
  -x "*/storage/framework/views/*" \
  -x "*/storage/logs/*" \
  -x "*/bootstrap/cache/*.php" \
  -x "*/database/*.sqlite" \
  -x "*/public/hot" \
  -x ".git/*" \
  -x "*/.git/*" \
  -x "*/.idea/*" \
  -x "*/.vscode/*" \
  -x "*/.DS_Store" \
  -x "*/.phpunit.result.cache"

echo "ZIP generado: ${ZIP_PATH}"
