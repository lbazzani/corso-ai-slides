# Schema JSON per Slide

## Struttura Capitolo

```json
{
  "number": "001",
  "title": "Titolo del Capitolo",
  "description": "Descrizione breve",
  "slides": [...]
}
```

## Tipi di Slide

### 1. Title Slide (intro capitolo)
```json
{
  "type": "title",
  "title": "Titolo Principale",
  "subtitle": "Sottotitolo o descrizione"
}
```

### 2. Text Slide (contenuto testuale)
```json
{
  "type": "text",
  "title": "Titolo della Slide",
  "content": [
    "Primo paragrafo di testo",
    "Secondo paragrafo di testo"
  ],
  "ironicClosing": "Frase ironica finale",
  "citations": [
    {
      "text": "Descrizione della citazione",
      "source": "Nome fonte",
      "url": "https://..."
    }
  ]
}
```

### 3. List Slide (elenco puntato)
```json
{
  "type": "list",
  "title": "Titolo della Slide",
  "intro": "Testo introduttivo (opzionale)",
  "items": [
    "Primo elemento",
    "Secondo elemento",
    "Terzo elemento"
  ],
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

### 4. Data Slide (metriche, numeri chiave)
```json
{
  "type": "data",
  "title": "Titolo della Slide",
  "metrics": [
    {
      "value": "$1.5 trilioni",
      "label": "Spesa AI globale 2025"
    },
    {
      "value": "$2 trilioni",
      "label": "Previsione per il 2026"
    }
  ],
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

### 5. Two Column Slide (confronto)
```json
{
  "type": "two-column",
  "title": "Titolo della Slide",
  "columns": [
    {
      "title": "Colonna Sinistra",
      "content": [
        "Punto 1",
        "Punto 2"
      ]
    },
    {
      "title": "Colonna Destra",
      "content": [
        "Punto 1",
        "Punto 2"
      ]
    }
  ],
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

### 6. Code Slide (esempio codice)
```json
{
  "type": "code",
  "title": "Titolo della Slide",
  "intro": "Spiegazione del codice",
  "code": {
    "language": "python",
    "snippet": "from langchain import LLMChain\n..."
  },
  "explanation": "Cosa fa questo codice",
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

### 7. Company Slide (profilo azienda)
```json
{
  "type": "company",
  "name": "OpenAI",
  "tagline": "Il Pioneer da $300 Miliardi",
  "logo": "openai.png",
  "facts": [
    {
      "label": "Fondata",
      "value": "Dicembre 2015"
    },
    {
      "label": "Revenue 2024",
      "value": "$3.7 miliardi"
    },
    {
      "label": "Valutazione",
      "value": "$300 miliardi"
    }
  ],
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

### 8. Comparison Slide (confronto prodotti/framework)
```json
{
  "type": "comparison",
  "title": "LLM Showdown: Coding",
  "items": [
    {
      "rank": "🏆",
      "name": "Claude",
      "description": "Precision, context awareness"
    },
    {
      "rank": "🥈",
      "name": "GPT-4o",
      "description": "Flessibilità, creatività"
    }
  ],
  "note": "Reality check: Claude costa 20x Gemini Flash",
  "ironicClosing": "Frase ironica",
  "citations": [...]
}
```

### 9. Image Slide (slide con immagine principale)
```json
{
  "type": "image",
  "title": "Titolo della Slide",
  "image": {
    "src": "diagram.png",
    "alt": "Descrizione immagine",
    "caption": "Caption dell'immagine"
  },
  "content": [
    "Testo esplicativo"
  ],
  "ironicClosing": "Frase ironica"
}
```

### 10. Summary Slide (riepilogo)
```json
{
  "type": "summary",
  "title": "Cosa Abbiamo Imparato",
  "items": [
    "✓ Primo punto chiave",
    "✓ Secondo punto chiave",
    "✓ Terzo punto chiave"
  ],
  "ironicClosing": "Frase finale ironica"
}
```

## Campi Comuni (opzionali per tutte le slide)

- `ironicClosing`: Frase ironica finale (string)
- `citations`: Array di citazioni (array)
- `highlight`: Evidenzia un concetto (string)
- `note`: Nota a margine (string)

## Esempio Completo

```json
{
  "number": "001",
  "title": "AI Generativa: Stato dell'Arte Fine 2025",
  "description": "Dati, numeri, player e previsioni per il 2026",
  "slides": [
    {
      "type": "title",
      "title": "AI Generativa",
      "subtitle": "Stato dell'Arte Fine 2025"
    },
    {
      "type": "data",
      "title": "Il Mercato: I Numeri del 2025",
      "metrics": [
        {
          "value": "$1.5 trilioni",
          "label": "Spesa AI globale 2025"
        },
        {
          "value": "$2 trilioni",
          "label": "Previsione per il 2026"
        }
      ],
      "ironicClosing": "Da 'interessante' a 'infrastruttura critica' in 24 mesi",
      "citations": [
        {
          "text": "Gartner: Worldwide AI spending will total $1.5 trillion in 2025",
          "source": "Gartner Press Release",
          "url": "https://..."
        }
      ]
    }
  ]
}
```

## Naming Convention

I file JSON devono seguire il pattern: `NNN-slug-title.json`

Esempi:
- `001-ai-generativa-stato-arte.json`
- `002-ai-agentica-framework.json`
- `003-rag-avanzato.json`

Il numero determina l'ordine nel corso.
