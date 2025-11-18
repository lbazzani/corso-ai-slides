# Sistema di Traduzione Multi-Lingua

Questo progetto supporta traduzioni automatiche tramite Ollama (LLM locale).

## Struttura Directory

```
/slides/
  it/             # JSON italiano (sorgente)
  en/             # JSON inglese (tradotti)
/guides/
  it/
  en/
/output/
  it/             # HTML generato italiano
    index.html
    capitolo/
  en/             # HTML generato inglese
    index.html
    chapter/
```

## Modelli Consigliati

### Per traduzioni IT→EN di alta qualità:

1. **mistral-small** (Consigliato) - Ottimo compromesso qualità/velocità
   ```bash
   ollama pull mistral-small
   ```

2. **gemma2:27b** - Versatile e affidabile
   ```bash
   ollama pull gemma2:27b
   ```

3. **aya:35b** - Qualità massima (richiede GPU potente)
   ```bash
   ollama pull aya:35b
   ```

## Workflow Completo

### 1. Setup Iniziale

```bash
# Verifica Ollama installato
ollama --version

# Installa modello consigliato
ollama pull mistral-small
```

### 2. Traduci i JSON

```bash
# Traduci tutti i file (slides + guides)
node translate.js

# Traduci singolo file
node translate.js --file=001-ai-generativa-stato-arte.json

# Forza ritraduzione (anche se già tradotto)
node translate.js --force

# Usa modello diverso
node translate.js --model=gemma2
```

### 3. Genera HTML Tradotto

```bash
# Genera slides italiane
node generator.js --lang=it

# Genera slides inglesi
node generator.js --lang=en
```

### 4. Deploy Multi-Lingua

```bash
# Deploy italiano
./deploy/deploy.sh --lang=it

# Deploy inglese
./deploy/deploy.sh --lang=en

# Deploy entrambi
./deploy/deploy-all.sh
```

## Campi JSON per Traduzioni

Ogni JSON ha due campi per tracciare le traduzioni:

```json
{
  "sourceLanguage": "it",
  "lastTranslated": "2025-01-18",
  "title": "Workshop: Sentiment Analysis con PyTorch",
  "slides": [...]
}
```

- **sourceLanguage**: Lingua sorgente del file ("it" o "en")
- **lastTranslated**: Data ultima traduzione (null se mai tradotto)

## Cosa Viene Tradotto

Lo script `translate.js` traduce:

✅ **Metadati:**
- `title`
- `description`
- `subtitle`

✅ **Step (workshop):**
- `steps[].name`

✅ **Slide:**
- `title`, `subtitle`, `description`
- `paragraphs[]`, `items[]`, `goals[]`, `benefits[]`, `challenges[]`
- `intro`, `explanation`
- `ironicClosing` (mantiene tono ironico)
- `leftColumn.title`, `leftColumn.items[]`
- `rightColumn.title`, `rightColumn.items[]`

❌ **Non Traduce:**
- `code.snippet` (codice rimane invariato)
- `citations[]` (citazioni originali)
- HTML tags (vengono preservati)

## Esempi di Traduzione

### Slide Normale

```json
// IT (slides/it/001-intro.json)
{
  "type": "text",
  "title": "Cosa Costruiremo",
  "paragraphs": [
    "<strong>Un classificatore di sentiment</strong>",
    "• Modello: DistilBERT fine-tuned"
  ],
  "ironicClosing": "PyTorch: quando TensorFlow è troppo mainstream."
}

// EN (slides/en/001-intro.json - generato automaticamente)
{
  "type": "text",
  "title": "What We'll Build",
  "paragraphs": [
    "<strong>A sentiment classifier</strong>",
    "• Model: DistilBERT fine-tuned"
  ],
  "ironicClosing": "PyTorch: when TensorFlow is too mainstream."
}
```

### Codice (non tradotto)

```json
// IT e EN identici
{
  "type": "code",
  "title": "Step 1: Install Dependencies",  // Tradotto
  "code": {
    "language": "bash",
    "snippet": "pip install torch transformers"  // NON tradotto
  }
}
```

## Performance e Tempi

Con **mistral-small** su CPU moderna:
- 1 slide semplice: ~5-10 secondi
- 1 slide complessa (workshop): ~20-30 secondi
- Capitolo completo (20 slide): ~5-10 minuti
- Intero corso (500+ slide): ~3-5 ore

Con **gemma2:27b** tempi simili.
Con **aya:35b** su GPU: ~50% più veloce.

## Troubleshooting

### Errore: "Ollama non trovato"
```bash
# Installa Ollama
# macOS/Linux: https://ollama.com
curl -fsSL https://ollama.com/install.sh | sh

# Verifica installazione
ollama --version
```

### Errore: "Model not found"
```bash
# Lista modelli installati
ollama list

# Installa modello mancante
ollama pull mistral-small
```

### Traduzione di bassa qualità
```bash
# Prova modello diverso
node translate.js --model=gemma2 --force

# Oppure usa modello più grande (richiede più risorse)
ollama pull aya:35b
node translate.js --model=aya --force
```

### Ollama lento o OOM
```bash
# Usa modello più piccolo
ollama pull gemma2:9b
node translate.js --model=gemma2:9b
```

## Ritradurre Dopo Modifiche

Se modifichi i JSON italiani, ritradurli:

```bash
# Ritraduce solo i file modificati
node translate.js

# Forza ritraduzione di tutti i file
node translate.js --force

# Ritraduce singolo file
node translate.js --file=009-workshop-pytorch-nlp.json --force
```

## Best Practices

1. **Traduci incrementalmente**: Traduci capitolo per capitolo per verificare qualità
2. **Verifica prima slide**: Controlla sempre le prime slide di ogni capitolo
3. **Mantieni tono**: Lo script cerca di preservare il tono ironico, verificalo comunque
4. **Codice intatto**: Verifica che snippet di codice non siano stati alterati
5. **HTML preservato**: Controlla che tag HTML (strong, em, etc.) siano intatti

## Script di Utilità

### Verifica Stato Traduzioni

```bash
# Mostra quali file sono stati tradotti
ls -la slides/en/
```

### Confronta Italiano vs Inglese

```bash
# Numero slide per capitolo
jq '.slides | length' slides/it/001-*.json
jq '.slides | length' slides/en/001-*.json
```

### Reset Traduzioni

```bash
# Rimuovi tutte le traduzioni
rm -rf slides/en/*.json guides/en/*.json

# Rimuovi HTML generato
rm -rf output/en/
```

## Aggiungere Nuove Lingue

Per aggiungere supporto per una nuova lingua (es: francese):

1. Crea directory:
   ```bash
   mkdir -p slides/fr guides/fr output/fr
   ```

2. Modifica `translate.js`:
   ```javascript
   const SOURCE_LANG = 'it';
   const TARGET_LANG = 'fr';  // Cambia qui
   ```

3. Esegui traduzione:
   ```bash
   node translate.js
   ```

4. Genera HTML:
   ```bash
   node generator.js --lang=fr
   ```

## Contatti e Supporto

Per problemi o domande:
- Verifica README principale del progetto
- Controlla documentazione Ollama: https://ollama.com/docs
- Issues GitHub del progetto

---

**Modello consigliato**: `mistral-small` (ottimo rapporto qualità/velocità)
**Tempo medio**: ~4 ore per tradurre intero corso con CPU moderna
