#!/bin/bash

# Deploy tutte le lingue disponibili
# Usage: ./deploy/deploy-all.sh [--dry-run]

set -e

DRY_RUN_ARG=""
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN_ARG="--dry-run"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Deploy Multi-Lingua ==="
echo ""

# Deploy italiano
echo "1/2 Deploying IT..."
"$SCRIPT_DIR/deploy.sh" --lang=it $DRY_RUN_ARG

echo ""
echo "---"
echo ""

# Deploy inglese
echo "2/2 Deploying EN..."
"$SCRIPT_DIR/deploy.sh" --lang=en $DRY_RUN_ARG

echo ""
echo "=== Deploy Completato ==="
echo "IT: https://corsoai.bazzani.info/it/"
echo "EN: https://corsoai.bazzani.info/en/"
