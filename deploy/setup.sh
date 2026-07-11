#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# DevNexa Global — Ubuntu VPS Initial Setup Script
# Run once on a fresh Ubuntu 22.04 LTS server
# Usage: sudo bash setup.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

DOMAIN="devnexa.global"
SSL_EMAIL="admin@devnexa.global"
APP_DIR="/opt/devnexa-global"

echo "═══════════════════════════════════════════════════"
echo "  DevNexa Global — Server Setup"
echo "═══════════════════════════════════════════════════"

# ── System Updates ─────────────────────────────────────
echo "[1/8] Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# ── Install Prerequisites ─────────────────────────────
echo "[2/8] Installing prerequisites..."
apt-get install -y -qq \
    curl wget git unzip \
    ca-certificates gnupg \
    lsb-release ufw \
    htop ncdu fail2ban

# ── Install Docker ─────────────────────────────────────
echo "[3/8] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | bash
    usermod -aG docker $SUDO_USER
fi

# ── Install Docker Compose ─────────────────────────────
echo "[4/8] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name"' | sed -E 's/.*"v([^"]+)".*/\1/')
    curl -SL "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# ── Install Nginx + Certbot ────────────────────────────
echo "[5/8] Installing Nginx and Certbot..."
apt-get install -y -qq nginx certbot python3-certbot-nginx

# ── Firewall Setup ─────────────────────────────────────
echo "[6/8] Configuring UFW Firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp  # Optional: remove in production
ufw --force enable

# ── Create Application Directory ──────────────────────
echo "[7/8] Setting up application directory..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/ssl
mkdir -p $APP_DIR/uploads
mkdir -p /var/backups/devnexa

# ── Obtain SSL Certificate ─────────────────────────────
echo "[8/8] Obtaining Let's Encrypt SSL certificate..."
systemctl stop nginx || true
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email $SSL_EMAIL \
    -d $DOMAIN \
    -d www.$DOMAIN || echo "WARNING: Certbot failed. Ensure DNS is pointed to this server."

# Copy certificates to app ssl directory
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $APP_DIR/ssl/
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $APP_DIR/ssl/
    echo "✓ SSL certificates copied."
fi

# ── Fail2ban Configuration ─────────────────────────────
cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
maxretry = 5
bantime = 3600

[nginx-http-auth]
enabled = true
maxretry = 3
bantime = 7200
EOF
systemctl enable fail2ban
systemctl start fail2ban

# ── Systemd Service for Docker Compose ────────────────
cat > /etc/systemd/system/devnexa.service << EOF
[Unit]
Description=DevNexa Global Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable devnexa.service

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "  Next: cd $APP_DIR && cp .env.example .env"
echo "  Fill in your .env values, then run: bash deploy.sh"
echo "═══════════════════════════════════════════════════"
