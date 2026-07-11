#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# DevNexa Global — Database Backup Script
# Usage: bash backup.sh [label]
# Backups saved to: /var/backups/devnexa/
# ─────────────────────────────────────────────────────────────────────────────

set -e

BACKUP_DIR="/var/backups/devnexa"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LABEL="${1:-manual}"
BACKUP_FILE="$BACKUP_DIR/devnexadb_${LABEL}_${TIMESTAMP}.sql.gz"

mkdir -p $BACKUP_DIR

echo "Backing up MySQL database..."

# Load env if available
if [ -f /opt/devnexa-global/.env ]; then
    source /opt/devnexa-global/.env
fi

MYSQL_USER="${MYSQL_USER:-devnexa_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-devnexa_password_2026}"
MYSQL_DATABASE="${MYSQL_DATABASE:-devnexadb}"

docker exec devnexa-mysql mysqldump \
    -u$MYSQL_USER -p$MYSQL_PASSWORD \
    $MYSQL_DATABASE | gzip > $BACKUP_FILE

echo "✓ Backup saved: $BACKUP_FILE"
echo "  Size: $(du -sh $BACKUP_FILE | cut -f1)"

# ── Retention: Keep last 30 backups ─────────────────────
ls -t $BACKUP_DIR/*.sql.gz 2>/dev/null | tail -n +31 | xargs rm -f --
echo "✓ Old backups cleaned (keeping latest 30)"
