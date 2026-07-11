#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# DevNexa Global — Database Restore Script
# Usage: bash restore.sh <backup_file.sql.gz>
# ─────────────────────────────────────────────────────────────────────────────

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "Usage: bash restore.sh /var/backups/devnexa/devnexadb_XXXX.sql.gz"
    echo ""
    echo "Available backups:"
    ls -lht /var/backups/devnexa/*.sql.gz 2>/dev/null || echo "  No backups found."
    exit 1
fi

# Load env
if [ -f /opt/devnexa-global/.env ]; then
    source /opt/devnexa-global/.env
fi

MYSQL_USER="${MYSQL_USER:-devnexa_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-devnexa_password_2026}"
MYSQL_DATABASE="${MYSQL_DATABASE:-devnexadb}"

echo "⚠️  WARNING: This will overwrite the current database!"
echo "   Restore from: $BACKUP_FILE"
read -p "   Type 'yes' to confirm: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo "Restoring database..."
gunzip -c $BACKUP_FILE | docker exec -i devnexa-mysql \
    mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE

echo "✓ Database restored from: $BACKUP_FILE"
echo "  Restarting backend..."
docker-compose -f /opt/devnexa-global/docker-compose.yml restart backend
echo "✓ Backend restarted."
