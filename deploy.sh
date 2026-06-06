#!/bin/bash

set -e

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
