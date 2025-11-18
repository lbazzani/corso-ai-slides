# Deploy CorsoAI

Script per deployare il sito delle slide su xpylon-azure e configurare nginx.

## Prerequisiti

- Accesso SSH al server `xpylon-azure` (configurato in `~/.ssh/config` o usando user@host)
- Permessi sudo sul server
- DNS di `corsoai.bazzani.info` che punta al server
- Aver eseguito `node generator.js` per generare le slide

## Setup Iniziale (solo la prima volta)

### 1. Configura nginx sul server

```bash
./deploy/configure-server.sh
```

Questo script:
- Copia i file di configurazione sul server
- Installa nginx e certbot (se necessario)
- Configura il virtual host per `corsoai.bazzani.info`
- Richiede e configura il certificato SSL con Let's Encrypt

**Nota:** Assicurati che il DNS punti già al server prima di richiedere il certificato SSL.

## Deploy delle Slide (Multi-Lingua)

### Deploy singola lingua

```bash
# Deploy italiano (default)
./deploy/deploy.sh

# Deploy inglese
./deploy/deploy.sh --lang=en

# Dry run (test senza copiare)
./deploy/deploy.sh --lang=it --dry-run
```

### Deploy tutte le lingue

```bash
# Deploy IT + EN
./deploy/deploy-all.sh

# Dry run tutte le lingue
./deploy/deploy-all.sh --dry-run
```

## Cosa viene copiato

- `output/{lang}/` - Tutte le slide generate per la lingua selezionata
- `assets/` - CSS e risorse statiche (condivise tra lingue)

**Struttura sul server:**
```
/home/xpilon/CorsoAi/
├── it/
│   ├── index.html
│   └── capitoli/
├── en/
│   ├── index.html
│   └── chapters/
└── assets/
    └── css/
```

## Cosa viene escluso

- File sorgente JSON (`slides/`, `guides/`)
- Template (`templates/`)
- Script di generazione (`generator.js`)
- Dipendenze (`node_modules/`)

## File di Configurazione

- `nginx-corsoai.conf` - Configurazione nginx per il virtual host
- `setup-nginx.sh` - Script da eseguire sul server per configurare nginx
- `configure-server.sh` - Script da eseguire in locale per automatizzare il setup
- `deploy.sh` - Script per il deploy dei file HTML

## Note

- Lo script usa `rsync` con `--delete`, quindi i file rimossi localmente verranno eliminati anche sul server
- Il certificato SSL si rinnova automaticamente tramite certbot
- Il sito sarà disponibile su `https://corsoai.bazzani.info`
