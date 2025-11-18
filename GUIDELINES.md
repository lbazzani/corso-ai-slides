# Linee Guida per la Creazione delle Slide

## Principi Fondamentali

### 1. Contestualizzazione Temporale
- **Siamo a fine 2025**: Tutti i dati devono essere aggiornati al 2025
- **SEMPRE parlare di previsioni per il 2026**: MAI dire "il 2025 è l'anno di...", SEMPRE dire "il 2026 sarà l'anno di..."
- **Dati attuali**: Usare dati del 2025 come "stato attuale"
- **Dati storici**: 2024, 2023 come confronto
- **Previsioni**: SEMPRE 2026, 2027, 2028
- Citare sempre l'anno di riferimento dei dati

**Esempi Corretti:**
- ✅ "Il 2026 sarà l'anno degli AI agents"
- ✅ "Entro il 2026, il 70% degli ISV integrerà GenAI"
- ✅ "Nel 2025 abbiamo visto..., nel 2026 vedremo..."

**Esempi Sbagliati:**
- ❌ "Il 2025 è l'anno degli agents"
- ❌ "Quest'anno vedremo..."
- ❌ Qualsiasi riferimento al 2025 come futuro

### 2. Visualizzazione delle Slide
- **Una slide = Un concetto**: Ogni slide deve presentare un'unica idea chiave
- **Altezza controllata**: Il contenuto deve essere visibile senza scrollare
- **Font size adeguati**: Titoli grandi, testo leggibile
- **Spazi bianchi**: Non sovraccaricare la slide

### 3. Codice
- **Snippet piccoli**: Dividere il codice in blocchi di max 15-20 righe
- **Spiegazioni**: Ogni snippet deve avere un commento/descrizione
- **Altezza massima scrollabile**: Il codice ha `max-height` con scroll automatico
- **Sintassi chiara**: Usare commenti per guidare la lettura
- **Esempi pratici**: Codice funzionante, non pseudocodice

### 4. Filo Logico e Step
- **Struttura narrativa**: Ogni capitolo deve raccontare una storia
- **Progressione**: Dal generale allo specifico
- **Collegamenti**: Ogni slide deve collegarsi alla precedente e alla successiva
- **Sezioni chiare**: Dividere il capitolo in sezioni tematiche

#### Concetto di Step
Per capitoli tecnici o di approfondimento, organizzare il contenuto in **step** (macro-sezioni):
- **Step 1-2**: Introduzione e contesto (mercato, why, overview)
- **Step centrali**: Contenuti tecnici progressivi (da basics a advanced)
- **Step finale**: Futuro, trend, best practices

**Visualizzazione Step:**
- Ogni step appare nella navigation bar in alto
- Progress indicator mostra avanzamento nello step corrente
- Esempio di step: "Introduzione → Mercato → Fondamenti → Librerie → ML → Futuro"

**Struttura JSON con Step:**
```json
{
  "number": 4,
  "title": "Python per Data Science",
  "description": "Dalle basi alle librerie avanzate",
  "steps": [
    {"name": "Introduzione", "slides": [0, 1]},
    {"name": "Mercato del Lavoro", "slides": [2, 3, 4, 5]},
    {"name": "Python Fundamentals", "slides": [6, 7, 8]},
    {"name": "NumPy", "slides": [9, 10, 11]},
    {"name": "Pandas", "slides": [12, 13, 14, 15]},
    {"name": "Visualizzazione", "slides": [16, 17, 18]},
    {"name": "Machine Learning", "slides": [19, 20, 21, 22]},
    {"name": "Futuro", "slides": [23, 24]}
  ],
  "slides": [...]
}
```

### 5. Fonti e Citazioni
- **MAI valutazioni sommarie**: Ogni affermazione deve avere una fonte
- **Fonti autorevoli**: Gartner, IDC, aziende ufficiali, paper accademici, analisti riconosciuti
- **Dati precisi**: Anno di fondazione, fatturato, metriche, percentuali
- **Sempre citare**: Testo della citazione, nome fonte, URL
- **Multiple fonti**: Una slide può (e deve) avere più citazioni se tratta più argomenti

### 6. Dati e Metriche
Quando menzioni un'azienda o tecnologia, includi:
- **Anno di fondazione**
- **Fatturato** (anno di riferimento)
- **Valutazione** (se startup)
- **Numero utenti** (se disponibile)
- **Market share** (se rilevante)
- **Crescita YoY** (se significativa)

Esempio:
```json
{
  "content": "<h2>OpenAI</h2><p>Fondata nel <strong>2015</strong></p><p>Valutazione: <strong>$157B</strong> (Ottobre 2024)</p><p>Fatturato: <strong>$3.7B</strong> annualizzato (2024)</p>",
  "citations": [
    {
      "text": "OpenAI valutazione $157B, fatturato $3.7B annualizzato 2024",
      "source": "TechCrunch",
      "url": "https://techcrunch.com/..."
    }
  ]
}
```

### 7. Immagini e Loghi
- **Cartella images**: Tutti i file visuali in `assets/images/`
- **Loghi aziende**: Per i big player (OpenAI, Anthropic, Google, etc.)
- **Diagrammi**: Per architetture e flussi
- **Screenshot**: Per esempi di interfacce
- **Formato**: PNG o SVG preferito, WebP per foto
- **Dimensioni**: Ottimizzate per web (max 200KB)
- **Alt text**: Sempre presente per accessibilità

### 8. Struttura Slide - Concetto e Stimolo
Ogni slide deve:
- Presentare un **concetto chiaro**
- Stimolare **ragionamenti** e domande
- Fornire **contesto** e **dati**
- Collegare teoria e pratica
- Provocare riflessione critica

### 9. Frase Finale Ironica
- **Separata nel JSON**: Campo `ironicClosing`
- **Tono**: Ironica ma mai ridicola
- **Professionale**: Mantiene credibilità
- **Memorabile**: Deve rimanere impressa
- **Collegata**: Si riferisce al contenuto della slide

Esempio:
```json
{
  "content": "<h2>Il Mercato AI</h2><p>$62B nel 2025, $150B previsti per 2026</p>",
  "ironicClosing": "Quando i miliardi si contano come i click, forse non è più hype",
  "citations": [...]
}
```

### 10. Formato JSON delle Slide

#### Struttura Base
```json
{
  "number": 1,
  "title": "Titolo del Capitolo",
  "description": "Breve descrizione del capitolo",
  "slides": [...]
}
```

#### Slide Semplice
```json
{
  "content": "<h1>Titolo</h1><p>Contenuto principale</p>",
  "ironicClosing": "Frase ironica finale",
  "citations": [
    {
      "text": "Descrizione dato citato",
      "source": "Nome fonte autorevole",
      "url": "https://fonte-autorevole.com/articolo"
    }
  ]
}
```

#### Slide con Immagine
```json
{
  "content": "<h2>Titolo</h2><img src='../../assets/images/logo-openai.png' alt='Logo OpenAI' class='slide-image'><p>Contenuto</p>",
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

#### Slide con Codice
```json
{
  "content": "<h2>Esempio LangChain</h2><p>Creare una chain base:</p><pre><code class='language-python'># Importa componenti\nfrom langchain import LLMChain\nfrom langchain.llms import OpenAI\n\n# Crea chain\nchain = LLMChain(\n    llm=OpenAI(),\n    prompt=prompt_template\n)</code></pre><p>La chain combina LLM e prompt template</p>",
  "ironicClosing": "Due righe di codice che valgono miliardi",
  "citations": [...]
}
```

#### Slide con Due Colonne
```json
{
  "content": "<h2>Confronto</h2><div class='two-column'><div><h3>Open Source</h3><p>Vantaggi...</p></div><div><h3>Enterprise</h3><p>Vantaggi...</p></div></div>",
  "ironicClosing": "Scegliere è sempre più difficile di quanto sembri",
  "citations": [...]
}
```

### 11. Checklist Pre-Pubblicazione

Prima di generare un capitolo, verifica:

- [ ] Tutte le date sono aggiornate (fine 2025)
- [ ] Le previsioni parlano del 2026
- [ ] Ogni affermazione ha una citazione
- [ ] I dati includono anno di fondazione/fatturato
- [ ] Le fonti sono autorevoli
- [ ] Ogni slide ha una frase ironica separata
- [ ] Il codice è diviso in snippet piccoli
- [ ] Le immagini sono nella cartella assets/images/
- [ ] C'è un filo logico tra le slide
- [ ] Ogni slide stimola ragionamenti
- [ ] L'altezza è controllata (no scroll)
- [ ] Il tono è professionale ma non noioso

### 12. Esempi di Fonti Autorevoli

**Accettabili:**
- Gartner, IDC, Forrester (analyst firms)
- TechCrunch, VentureBeat, The Information (tech news autorevoli)
- Blog ufficiali aziende (OpenAI, Anthropic, Google, Microsoft)
- Paper accademici (arXiv, conference proceedings)
- Financial reports (SEC filings, investor relations)
- Statista, CB Insights (data providers)

**Da evitare:**
- Blog personali senza credenziali
- Siti aggregatori senza fonte primaria
- Social media (tranne account ufficiali)
- Articoli senza autore identificabile
- Siti con chiaro bias commerciale

### 13. Tono e Stile

**Professionale ma Accessibile:**
- Usa termini tecnici ma spiegali
- Evita jargon inutile
- Sii diretto e conciso
- Mantieni credibilità

**Ironico ma Non Ridicolo:**
- L'ironia deve far sorridere, non ridere
- Deve essere intelligente, non sarcastica
- Collegata al contenuto, non random
- Professionale, adatta a un corso enterprise

**Esempi Buoni:**
- "Quando i miliardi si contano come i click, forse non è più hype"
- "Il primo a fare il boom. Ancora il più popolare."
- "Microsoft porta gli agent nell'enterprise (e lo fa bene)"

**Esempi Cattivi:**
- "LOL questi LLM sono pazzi!" ❌
- "Chi non usa AI è un dinosauro" ❌
- "Haha OpenAI goes brrrr" ❌

### 14. Organizzazione dei File

```
CorsoAI/
├── assets/
│   ├── css/
│   │   └── style.css
│   └── images/
│       ├── logos/
│       │   ├── openai.png
│       │   ├── anthropic.png
│       │   └── google.png
│       ├── diagrams/
│       │   └── agent-architecture.png
│       └── screenshots/
│           └── example.png
├── slides/
│   ├── chapter-01.json
│   ├── chapter-02.json
│   └── chapter-XX.json
├── templates/
│   ├── slide.html
│   └── main-index.html
├── output/
│   ├── chapter-1/
│   └── chapter-2/
├── generator.js
├── GUIDELINES.md          # Questo file
└── README.md
```

### 15. Processo di Creazione

1. **Ricerca**: Raccogliere dati autorevoli e aggiornati
2. **Outline**: Creare la struttura del capitolo
3. **Draft**: Scrivere contenuto con citazioni
4. **Review**: Verificare checklist
5. **Immagini**: Aggiungere loghi e diagrammi
6. **Test**: Generare e verificare nel browser
7. **Iterate**: Aggiustare spacing e leggibilità

---

**Ricorda**: Queste slide sono per sviluppatori professionisti che vogliono imparare senza perdere tempo. Devono essere dense di informazioni utili, supportate da dati reali, e piacevoli da leggere.
