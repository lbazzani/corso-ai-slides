#!/bin/bash

# Script di configurazione nginx per corsoai.bazzani.info
# Da eseguire SUL SERVER xpylon-azure

set -e

# Verifica che lo script sia eseguito come root
if [[ $EUID -ne 0 ]]; then
   echo "Questo script deve essere eseguito come root (usa sudo)"
   exit 1
fi

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Setup nginx per corsoai.bazzani.info ===${NC}\n"

# Verifica che nginx sia installato
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}nginx non trovato. Installazione...${NC}"
    apt update
    apt install -y nginx
fi

# Verifica che certbot sia installato
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}certbot non trovato. Installazione...${NC}"
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Directory del corso
CORSO_DIR="/home/xpilon/CorsoAi"
if [ ! -d "$CORSO_DIR" ]; then
    echo -e "${RED}Errore: Directory $CORSO_DIR non trovata${NC}"
    exit 1
fi

if [ ! -f "$CORSO_DIR/index.html" ]; then
    echo -e "${YELLOW}Attenzione: $CORSO_DIR/index.html non trovato${NC}"
    echo "Assicurati di aver eseguito il deploy prima di proseguire"
    read -p "Vuoi continuare comunque? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Copia configurazione nginx
NGINX_CONF="/etc/nginx/sites-available/corsoai.bazzani.info"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/nginx-corsoai.conf" ]; then
    echo -e "${GREEN}Copio configurazione nginx...${NC}"
    cp "$SCRIPT_DIR/nginx-corsoai.conf" "$NGINX_CONF"
else
    echo -e "${RED}Errore: File nginx-corsoai.conf non trovato in $SCRIPT_DIR${NC}"
    exit 1
fi

# Abilita il sito
if [ ! -L "/etc/nginx/sites-enabled/corsoai.bazzani.info" ]; then
    echo -e "${GREEN}Abilito il sito...${NC}"
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
fi

# Test configurazione nginx (temporaneamente rimuovi le righe SSL se i certificati non esistono ancora)
if [ ! -f "/etc/letsencrypt/live/corsoai.bazzani.info/fullchain.pem" ]; then
    echo -e "${YELLOW}Certificati SSL non ancora presenti, creo configurazione temporanea...${NC}"

    # Crea versione temporanea solo HTTP
    cat > /etc/nginx/sites-available/corsoai.bazzani.info.tmp << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name corsoai.bazzani.info;

    root /home/xpilon/CorsoAi;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

    cp /etc/nginx/sites-available/corsoai.bazzani.info.tmp "$NGINX_CONF"
    rm /etc/nginx/sites-available/corsoai.bazzani.info.tmp
fi

# Test configurazione
echo -e "${GREEN}Test configurazione nginx...${NC}"
nginx -t

# Ricarica nginx
echo -e "${GREEN}Ricarico nginx...${NC}"
systemctl reload nginx

# Configura SSL con Let's Encrypt
echo -e "\n${GREEN}Configurazione SSL con Let's Encrypt...${NC}"
echo -e "${YELLOW}Assicurati che il DNS di corsoai.bazzani.info punti a questo server!${NC}\n"

read -p "Procedo con la richiesta del certificato SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d corsoai.bazzani.info

    # Ripristina la configurazione completa con SSL
    if [ -f "$SCRIPT_DIR/nginx-corsoai.conf" ]; then
        cp "$SCRIPT_DIR/nginx-corsoai.conf" "$NGINX_CONF"
        nginx -t && systemctl reload nginx
    fi

    echo -e "\n${GREEN}✓ Configurazione completata!${NC}"
    echo -e "Sito disponibile su: ${GREEN}https://corsoai.bazzani.info${NC}"
else
    echo -e "\n${YELLOW}Certificato SSL non configurato.${NC}"
    echo "Sito disponibile su: http://corsoai.bazzani.info"
    echo "Per configurare SSL in seguito, esegui: sudo certbot --nginx -d corsoai.bazzani.info"
fi

# Auto-renewal certbot
if command -v certbot &> /dev/null; then
    echo -e "\n${GREEN}Verifica auto-renewal certbot...${NC}"
    systemctl status certbot.timer --no-pager || echo "Timer certbot non attivo (installalo con: systemctl enable certbot.timer)"
fi

echo -e "\n${GREEN}=== Setup completato ===${NC}"
