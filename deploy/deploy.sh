#!/bin/bash

# Deploy script per CorsoAI (Multi-Language)
# Copia solo i file HTML e assets necessari su xpylon-azure
#
# Usage: ./deploy/deploy.sh [--lang=it|en] [--dry-run]

set -e

# Parse arguments
DRY_RUN=""
LANG="it"

for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN="--dry-run"
            ;;
        --lang=*)
            LANG="${arg#*=}"
            ;;
    esac
done

# Configurazione
REMOTE_HOST="xpylon-azure"
REMOTE_PATH="/home/xpilon/CorsoAi"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_LANG_DIR="$PROJECT_ROOT/output/$LANG"

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploy CorsoAI ===${NC}"
echo -e "${GREEN}Lingua: ${LANG^^}${NC}\n"

if [[ -n "$DRY_RUN" ]]; then
    echo -e "${YELLOW}Modalità DRY RUN - nessun file sarà copiato${NC}\n"
fi

# Verifica che i file esistano
if [ ! -d "$OUTPUT_LANG_DIR" ]; then
    echo "Errore: cartella output/$LANG/ non trovata. Esegui 'node generator.js --lang=$LANG' prima del deploy."
    exit 1
fi

echo "Sincronizzazione file su $REMOTE_HOST:$REMOTE_PATH/$LANG"
echo ""

# Crea directory remota se non esiste
if [[ -z "$DRY_RUN" ]]; then
    ssh "$REMOTE_HOST" "mkdir -p $REMOTE_PATH/$LANG"
fi

# Rsync con le opzioni:
# -a: archive mode (preserva permessi, tempi, etc.)
# -v: verbose
# -z: comprimi durante il trasferimento
# --delete: rimuovi file sul server che non esistono più in locale

rsync -avz $DRY_RUN \
    --delete \
    "$OUTPUT_LANG_DIR/" \
    "$REMOTE_HOST:$REMOTE_PATH/$LANG/"

# Sync assets (solo una volta, condivisi tra lingue)
rsync -avz $DRY_RUN \
    "$PROJECT_ROOT/assets" \
    "$REMOTE_HOST:$REMOTE_PATH/"

if [[ -z "$DRY_RUN" ]]; then
    echo -e "\n${GREEN}Impostazione permessi corretti sul server...${NC}"
    ssh "$REMOTE_HOST" "chmod -R 755 $REMOTE_PATH && find $REMOTE_PATH -type f -exec chmod 644 {} \;"

    echo -e "\n${GREEN}✓ Deploy completato!${NC}"
    echo -e "Sito disponibile su: https://corsoai.bazzani.info/$LANG/"
else
    echo -e "\n${YELLOW}Dry run completato. Riesegui senza --dry-run per copiare i file.${NC}"
fi
