# CorsoAI - AI Course Slides Generator

Sistema di generazione slide HTML per corsi su Intelligenza Artificiale con supporto multilingua (IT/EN).

## 🎯 Caratteristiche

- 📚 **Template-based**: Sistema modulare con template Handlebars-style
- 🌍 **Multilingua**: Supporto IT/EN con traduzione automatica via OpenAI
- 🎨 **Syntax Highlighting**: Prism.js per evidenziare codice
- 📱 **Responsive**: Navigazione touch/swipe per mobile
- 🔄 **Riordinamento facile**: Configurazione centralizzata in `chapters-order.json`
- 🚀 **Deploy automatizzato**: Script per deployment su server remoto

## 📂 Struttura

```
CorsoAI/
├── slides/              # JSON capitoli (IT/EN)
├── guides/              # JSON guide tecniche (IT/EN)
├── templates/           # Template HTML
├── assets/css/          # Stili CSS
├── output/             # HTML generato (IT/EN) [gitignored]
├── deploy/             # Script deployment
├── generator.js        # Generatore slide
├── translate.js        # Traduttore OpenAI
├── chapters-order.json # Configurazione ordine capitoli
└── translations.json   # Traduzioni UI

```

## 🚀 Quick Start

### 1. Genera le slide

```bash
# Genera slide italiane
node generator.js

# Genera slide inglesi
node generator.js --lang=en
```

### 2. Traduci contenuti

Richiede `OPENAI_API_KEY` in file `.env`:

```bash
# Crea .env con la tua API key
echo "OPENAI_API_KEY=sk-..." > .env

# Traduci singolo file
node translate.js --file=storia-ai.json

# Traduci tutti i file
node translate.js

# Forza ritraduzione
node translate.js --force
```

### 3. Deploy

```bash
# Deploy italiano
./deploy/deploy.sh

# Deploy inglese
./deploy/deploy.sh --lang=en

# Deploy entrambe le lingue
./deploy/deploy-all.sh
```

## 📖 Capitoli Disponibili

**IT:**
- Storia dell'AI
- AI Generativa
- AI Agentica
- Workshop CrewAI
- AI ed Energia
- LLM e Transformer
- Python per Data Science
- Embeddings, Vector DB e RAG
- PyTorch & TensorFlow
- Workshop PyTorch NLP
- Workshop TensorFlow NLP

**Guide:**
- Python Fundamentals
- NumPy Fundamentals
- Pandas Fundamentals
- JavaScript & Node.js Fundamentals
- Next.js Fundamentals
- Jupyter Notebook Fundamentals

## 🔧 Riordinare Capitoli

Modifica `chapters-order.json`:

```json
{
  "it": {
    "chapters": [
      "storia-ai",
      "ai-generativa-stato-arte",
      ...
    ]
  }
}
```

Poi rigenera: `node generator.js`

## 🛠️ Tecnologie

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Template Engine**: Custom Handlebars-style
- **Syntax Highlighting**: Prism.js
- **Traduzione**: OpenAI GPT-4o-mini API
- **Deploy**: rsync + nginx

## 📄 Licenza

© 2025 Lorenzo Bazzani

## 👤 Autore

**Lorenzo Bazzani**  
Cloud Infrastructure & Generative AI Consultant

- LinkedIn: [lorenzo-bazzani](https://it.linkedin.com/in/lorenzo-bazzani)
- Website: [bazzani.info](https://bazzani.info)
- Email: lorenzo@bazzani.info
