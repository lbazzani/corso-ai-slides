#!/bin/bash

# Script da eseguire IN LOCALE per configurare nginx sul server remoto

set -e

REMOTE_HOST="xpylon-azure"
REMOTE_PATH="/home/xpilon/CorsoAi"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Configurazione nginx su $REMOTE_HOST ===${NC}\n"

# Verifica che i file di configurazione esistano
if [ ! -f "$SCRIPT_DIR/nginx-corsoai.conf" ] || [ ! -f "$SCRIPT_DIR/setup-nginx.sh" ]; then
    echo "Errore: File di configurazione mancanti"
    exit 1
fi

echo "1. Copio script di configurazione sul server..."
scp "$SCRIPT_DIR/nginx-corsoai.conf" "$SCRIPT_DIR/setup-nginx.sh" "$REMOTE_HOST:$REMOTE_PATH/"

echo -e "\n2. Eseguo setup nginx sul server..."
echo -e "${YELLOW}Ti verrà chiesta la password sudo sul server${NC}\n"

ssh -t "$REMOTE_HOST" "cd $REMOTE_PATH && sudo ./setup-nginx.sh"

echo -e "\n${GREEN}✓ Configurazione completata!${NC}"
echo -e "Verifica che il DNS di corsoai.bazzani.info punti al server"
echo -e "Poi visita: ${GREEN}https://corsoai.bazzani.info${NC}"
