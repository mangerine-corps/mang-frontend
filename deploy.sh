#!/bin/bash

set -e

# Load nvm so npm/node are on PATH (needed when running via SSH or cron)
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

APP_DIR="$HOME/htdocs/mang-frontend"
PM2_APP="mang-dev-frontend"

echo ">>> Navigating to app directory..."
cd "$APP_DIR"

echo ">>> Pulling latest changes..."
git pull

echo ">>> Installing dependencies..."
npm ci

echo ">>> Building application..."
npm run build

echo ">>> Reloading PM2 process..."
pm2 restart 0

echo ">>> Done. App is live."
