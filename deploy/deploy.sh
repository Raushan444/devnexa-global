#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# DevNexa Global — Rolling Deploy Script
# Usage: bash deploy.sh [branch]
# ─────────────────────────────────────────────────────────────────────────────

set -e

APP_DIR="/opt/devnexa-global"
BRANCH="${1:-main}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "═══════════════════════════════════════════════════"
echo "  DevNexa Global — Deploying branch: $BRANCH"
echo "  Timestamp: $TIMESTAMP"
echo "═══════════════════════════════════════════════════"

cd $APP_DIR

# ── Pull Latest Code ────────────────────────────────────
echo "[1/5] Pulling latest code..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# ── Take Database Backup Before Deploying ───────────────
echo "[2/5] Taking pre-deploy database backup..."
bash $APP_DIR/deploy/backup.sh pre-deploy-$TIMESTAMP || echo "WARNING: Backup failed, continuing..."

# ── Build New Images ────────────────────────────────────
echo "[3/5] Building Docker images..."
docker-compose build --no-cache --parallel

# ── Rolling Restart ─────────────────────────────────────
echo "[4/5] Performing rolling restart..."
docker-compose up -d --remove-orphans

# Wait for backend health
echo "  Waiting for backend health check..."
for i in {1..30}; do
    if curl -sf http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "  ✓ Backend is healthy"
        break
    fi
    echo "  Attempt $i/30..."
    sleep 5
done

# ── Cleanup Old Images ──────────────────────────────────
echo "[5/5] Cleaning up old Docker images..."
docker image prune -f

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Deployment complete!"
echo "  App: https://devnexa.global"
echo "  API: https://devnexa.global/api/"
echo "═══════════════════════════════════════════════════"
