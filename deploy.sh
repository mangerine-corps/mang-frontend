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

# Only reinstall if dependencies actually changed
if git diff HEAD@{1} HEAD --name-only 2>/dev/null | grep -q "package-lock.json"; then
  echo ">>> Dependencies changed — installing..."
  npm ci
else
  echo ">>> No dependency changes — skipping install."
fi

echo ">>> Building application..."
export CI=true
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

echo ">>> Reloading PM2 process..."
pm2 restart 0

echo ">>> Done. App is live."
