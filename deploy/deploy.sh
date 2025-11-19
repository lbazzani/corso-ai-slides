#!/bin/bash

# Deploy script per CorsoAI (Multi-Language)
# Copia tutti i file HTML e assets necessari su xpylon-azure (IT + EN)
#
# Usage: ./deploy/deploy.sh [--dry-run]

set -e

# Parse arguments
DRY_RUN=""

for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN="--dry-run"
            ;;
    esac
done

# Configurazione
REMOTE_HOST="xpylon-azure"
REMOTE_PATH="/home/xpilon/CorsoAi"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploy CorsoAI - Full Deployment ===${NC}"
if [[ -n "$DRY_RUN" ]]; then
    echo -e "${YELLOW}Modalità DRY RUN - nessun file sarà copiato${NC}"
fi
echo ""

# Verifica che la cartella output esista
if [ ! -d "$PROJECT_ROOT/output" ]; then
    echo "Errore: cartella output/ non trovata. Esegui 'node generator.js' prima del deploy."
    exit 1
fi

# Crea directory remote se non esiste
if [[ -z "$DRY_RUN" ]]; then
    ssh "$REMOTE_HOST" "mkdir -p $REMOTE_PATH"
fi

# Deploy tutto il contenuto di output/ (struttura identica a produzione)
echo -e "${BLUE}Deploying entire output/ directory...${NC}"
rsync -avz $DRY_RUN \
    --delete \
    "$PROJECT_ROOT/output/" \
    "$REMOTE_HOST:$REMOTE_PATH/"
echo ""

# Imposta permessi
if [[ -z "$DRY_RUN" ]]; then
    echo -e "${GREEN}Impostazione permessi corretti sul server...${NC}"
    ssh "$REMOTE_HOST" "chmod -R 755 $REMOTE_PATH && find $REMOTE_PATH -type f -exec chmod 644 {} \;"

    echo -e "\n${GREEN}✓ Deploy completato con successo!${NC}"
    echo -e "Sito disponibile:"
    echo -e "  https://corsoai.bazzani.info/"
    echo -e "  IT: https://corsoai.bazzani.info/it/"
    echo -e "  EN: https://corsoai.bazzani.info/en/"
else
    echo -e "${YELLOW}Dry run completato. Riesegui senza --dry-run per copiare i file.${NC}"
fi
