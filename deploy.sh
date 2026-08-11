#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Pulling latest main..."
git fetch origin main
git reset --hard origin/main

echo "==> Installing dependencies..."
npm ci

echo "==> Building..."
npm run build

echo "==> Reloading PM2 (zero-downtime)..."
pm2 reload horecahost --update-env

echo "==> Done."
pm2 status horecahost
