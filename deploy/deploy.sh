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

# Verifica che i file esistano
if [ ! -d "$PROJECT_ROOT/output/it" ] || [ ! -d "$PROJECT_ROOT/output/en" ]; then
    echo "Errore: cartelle output/it/ o output/en/ non trovate. Esegui 'node generator.js' prima del deploy."
    exit 1
fi

# Crea directory remote se non esistono
if [[ -z "$DRY_RUN" ]]; then
    ssh "$REMOTE_HOST" "mkdir -p $REMOTE_PATH/{it,en}"
fi

# Deploy IT
echo -e "${BLUE}[1/4] Deploying IT...${NC}"
rsync -avz $DRY_RUN \
    --delete \
    "$PROJECT_ROOT/output/it/" \
    "$REMOTE_HOST:$REMOTE_PATH/it/"
echo ""

# Deploy EN
echo -e "${BLUE}[2/4] Deploying EN...${NC}"
rsync -avz $DRY_RUN \
    --delete \
    "$PROJECT_ROOT/output/en/" \
    "$REMOTE_HOST:$REMOTE_PATH/en/"
echo ""

# Deploy assets (condivisi tra lingue)
echo -e "${BLUE}[3/4] Deploying shared assets...${NC}"
rsync -avz $DRY_RUN \
    "$PROJECT_ROOT/assets" \
    "$REMOTE_HOST:$REMOTE_PATH/"
echo ""

# Deploy root index.html
echo -e "${BLUE}[4/4] Deploying root index.html...${NC}"
if [ -f "$PROJECT_ROOT/index.html" ]; then
    rsync -avz $DRY_RUN \
        "$PROJECT_ROOT/index.html" \
        "$REMOTE_HOST:$REMOTE_PATH/"
else
    echo -e "${YELLOW}Warning: index.html not found in project root${NC}"
fi
echo ""

# Imposta permessi
if [[ -z "$DRY_RUN" ]]; then
    echo -e "${GREEN}Impostazione permessi corretti sul server...${NC}"
    ssh "$REMOTE_HOST" "chmod -R 755 $REMOTE_PATH && find $REMOTE_PATH -type f -exec chmod 644 {} \;"

    echo -e "\n${GREEN}✓ Deploy completato con successo!${NC}"
    echo -e "Siti disponibili:"
    echo -e "  IT: https://corsoai.bazzani.info/it/"
    echo -e "  EN: https://corsoai.bazzani.info/en/"
    echo -e "  Root: https://corsoai.bazzani.info/"
else
    echo -e "${YELLOW}Dry run completato. Riesegui senza --dry-run per copiare i file.${NC}"
fi
