#!/bin/bash

set -e

# ── Config ────────────────────────────────────────────────────────────────────
SSH_USER="mangerine-app"
SSH_HOST="185.216.203.177"
SSH_PORT="22"
DEPLOY_SCRIPT="bash ~/htdocs/mang-frontend/deploy.sh"

# ── Deploy ────────────────────────────────────────────────────────────────────
echo "🚀 Deploying to $SSH_HOST..."

ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$DEPLOY_SCRIPT"

echo "✅ Deployment complete."
