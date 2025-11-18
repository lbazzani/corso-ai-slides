#!/usr/bin/env node

/**
 * Generatore di slide per corso AI - Template Based (Multi-Language)
 * Legge JSON puri e usa template per generare HTML
 *
 * Usage: node generator.js [--lang=it|en]
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const langArg = args.find(arg => arg.startsWith('--lang='));
const LANG = langArg ? langArg.split('=')[1] : 'it';

// Configurazione
const SLIDES_DIR = `./slides/${LANG}`;
const GUIDES_DIR = `./guides/${LANG}`;
const TEMPLATES_DIR = './templates';
const SLIDE_TEMPLATES_DIR = './templates/slides';
const OUTPUT_DIR = `./output/${LANG}`;

// Legge un template
function readTemplate(templatePath) {
    return fs.readFileSync(templatePath, 'utf8');
}

// Template engine semplice (sostituisce {{var}} e gestisce {{#if}} {{#each}})
function renderTemplate(template, data) {
    let result = template;

    // {{#if condition}}...{{/if}}
    result = result.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
        return data[condition] ? content : '';
    });

    // {{#each array}}...{{/each}} - supporta anche dot notation
    result = result.replace(/{{#each\s+([\w.]+)}}([\s\S]*?){{\/each}}/g, (match, arrayPath, content) => {
        // Risolvi il path (es: "items" o "leftColumn.items")
        const parts = arrayPath.split('.');
        let array = data;
        for (const part of parts) {
            array = array?.[part];
        }

        if (!Array.isArray(array)) return '';
        return array.map(item => {
            let itemContent = content;
            // Sostituisci {{this}} con il valore se è stringa
            if (typeof item === 'string') {
                itemContent = itemContent.replace(/{{this}}/g, item);
            } else {
                // Sostituisci {{property}} con item.property
                Object.keys(item).forEach(key => {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    itemContent = itemContent.replace(regex, item[key] || '');
                });
            }
            return itemContent;
        }).join('');
    });

    // {{variable}} semplici e {{object.property}} annidate
    // Prima gestisci le proprietà annidate (dot notation)
    result = result.replace(/{{([\w.]+)}}/g, (match, path) => {
        // Se contiene un punto, è una dot notation
        if (path.includes('.')) {
            const parts = path.split('.');
            let value = data;
            for (const part of parts) {
                value = value?.[part];
            }
            return value || '';
        }
        // Altrimenti lascia che venga gestito dopo
        return match;
    });

    // Poi gestisci le variabili semplici
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key] || '');
    });

    return result;
}

// Renderizza una slide usando il template appropriato
function renderSlideContent(slideData) {
    const templatePath = path.join(SLIDE_TEMPLATES_DIR, `${slideData.type}.html`);

    if (!fs.existsSync(templatePath)) {
        console.warn(`�  Template non trovato per tipo: ${slideData.type}`);
        return `<p>Template mancante: ${slideData.type}</p>`;
    }

    const template = readTemplate(templatePath);
    let content = renderTemplate(template, slideData);

    // Aggiungi citazioni se presenti
    if (slideData.citations && slideData.citations.length > 0) {
        const citations = slideData.citations.map(c =>
            `<div class="citation">
                <p>${escapeHtml(c.text)}</p>
                <a href="${c.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.source)}</a>
            </div>`
        ).join('\n');
        content += `<div class="citations">${citations}</div>`;
    }

    // Aggiungi frase ironica se presente
    if (slideData.ironicClosing) {
        content += `<div class="ironic-closing">${escapeHtml(slideData.ironicClosing)}</div>`;
    }

    return content;
}

// Determina lo step corrente in base all'indice della slide
function getCurrentStep(steps, slideIndex) {
    if (!steps || steps.length === 0) return null;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const startSlide = step.slides[0];
        const endSlide = step.slides[step.slides.length - 1];

        if (slideIndex >= startSlide && slideIndex <= endSlide) {
            return {
                index: i,
                name: step.name,
                progress: ((slideIndex - startSlide + 1) / (endSlide - startSlide + 1)) * 100
            };
        }
    }
    return null;
}

// Genera navigation bar con supporto step
function generateNavBar(allChapters, currentChapter, slideIndex = null) {
    const homeButton = `<a href="../index.html" class="nav-home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
        </a>`;

    const langSelector = `<div class="lang-selector">
            <button class="lang-btn" onclick="toggleLangMenu(event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span class="current-lang">${LANG.toUpperCase()}</span>
            </button>
            <div class="lang-menu" id="langMenu">
                <a href="#" onclick="switchLanguage('it', event)" class="${LANG === 'it' ? 'active' : ''}">🇮🇹 Italiano</a>
                <a href="#" onclick="switchLanguage('en', event)" class="${LANG === 'en' ? 'active' : ''}">🇬🇧 English</a>
            </div>
        </div>`;

    // Se il capitolo ha step e abbiamo l'indice della slide, mostra gli step
    if (currentChapter.steps && currentChapter.steps.length > 0 && slideIndex !== null) {
        const currentStep = getCurrentStep(currentChapter.steps, slideIndex);

        const stepsHtml = currentChapter.steps.map((step, idx) => {
            const isActive = currentStep && idx === currentStep.index;
            const isPast = currentStep && idx < currentStep.index;
            const className = isActive ? 'step-item active' : (isPast ? 'step-item completed' : 'step-item');

            return `<div class="${className}">
                <span class="step-number">${idx + 1}</span>
                <span class="step-name">${step.name}</span>
            </div>`;
        }).join('');

        const progressBar = currentStep ?
            `<div class="step-progress-bar">
                <div class="step-progress-fill" style="width: ${currentStep.progress}%"></div>
            </div>` : '';

        return `<nav class="top-navigation">
            ${homeButton}
            <div class="nav-steps">
                ${stepsHtml}
            </div>
            ${progressBar}
            ${langSelector}
        </nav>`;
    }

    // Altrimenti mostra solo il titolo del capitolo
    return `<nav class="top-navigation">
        ${homeButton}
        <div class="nav-title">
            <span class="chapter-name">${currentChapter.number}. ${currentChapter.title}</span>
        </div>
        ${langSelector}
    </nav>`;
}

// Genera una singola slide
function generateSlide(slideData, slideIndex, totalSlides, chapterData, allChapters) {
    const template = readTemplate(path.join(TEMPLATES_DIR, 'slide.html'));

    const hasPrev = slideIndex > 0;
    const hasNext = slideIndex < totalSlides - 1;

    const slideContent = renderSlideContent(slideData);
    const navBar = generateNavBar(allChapters, chapterData, slideIndex);

    const data = {
        navBar: navBar,
        content: slideContent,
        chapterTitle: chapterData.title,
        chapterNumber: chapterData.number,
        slideNumber: slideIndex + 1,
        totalSlides: totalSlides,
        prevSlide: hasPrev ? `slide-${slideIndex}.html` : '',
        nextSlide: hasNext ? `slide-${slideIndex + 2}.html` : '',
        prevSlideClass: hasPrev ? '' : 'disabled',
        nextSlideClass: hasNext ? '' : 'disabled',
        indexLink: '../index.html'
    };

    // Sostituisce placeholders
    let result = template;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key]);
    });

    return result;
}

// Genera tutte le slide di un capitolo
function generateChapter(chapterFile, allChapters, sourceDir = SLIDES_DIR) {
    const chapterPath = path.join(sourceDir, chapterFile);
    const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

    // Estrai slug dal nome file (es: ai-generativa.json -> ai-generativa)
    const slug = chapterFile.replace('.json', '');
    chapterData.slug = slug;

    // Crea cartella per il capitolo
    const chapterDir = path.join(OUTPUT_DIR, slug);
    if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir, { recursive: true });
    }

    // Genera ogni slide
    chapterData.slides.forEach((slide, index) => {
        const slideHtml = generateSlide(slide, index, chapterData.slides.length, chapterData, allChapters);
        fs.writeFileSync(path.join(chapterDir, `slide-${index + 1}.html`), slideHtml);
    });

    console.log(` Capitolo ${chapterData.number}: "${chapterData.title}" generato (${chapterData.slides.length} slide)`);

    return chapterData;
}

// Genera l'indice principale del corso
function generateMainIndex(chapters, guides = []) {
    const template = readTemplate(path.join(TEMPLATES_DIR, 'main-index.html'));

    // Carica traduzioni
    const translations = JSON.parse(fs.readFileSync('./translations.json', 'utf8'));
    const t = translations[LANG];

    // Mappa icone tematiche per ogni capitolo
    const chapterIcons = {
        'storia-ai': '📖',
        'ai-generativa-stato-arte': '📖',
        'llm-transformer-fondamenti': '📖',
        'ai-energia-sostenibilita': '📖',
        'python-data-science': '📖',
        'pytorch-tensorflow-ml': '📖',
        'embeddings-vector-db-rag': '📖',
        'ai-agentica-framework': '📖',
        'workshop-crewai': '📖',
        'workshop-pytorch-nlp': '📖',
        'workshop-tensorflow-nlp': '📖'
    };

    const chaptersList = chapters.map(chapter => {
        const icon = chapterIcons[chapter.slug] || '📖';
        return `<li class="chapter-item">
            <a href="${chapter.slug}/slide-1.html">
                <span class="chapter-icon">${icon}</span>
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-slides">${chapter.slides.length} ${t.slides}</span>
            </a>
        </li>`;
    }).join('\n');

    const guidesList = guides.map(guide =>
        `<li class="guide-item">
            <a href="${guide.slug}/slide-1.html">
                <span class="guide-icon">📚</span>
                <span class="guide-title">${guide.title}</span>
                <span class="guide-slides">${guide.slides.length} ${t.slides}</span>
            </a>
        </li>`
    ).join('\n');

    const langSelector = `<div class="lang-selector">
            <button class="lang-btn" onclick="toggleLangMenu(event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span class="current-lang">${LANG.toUpperCase()}</span>
            </button>
            <div class="lang-menu" id="langMenu">
                <a href="#" onclick="switchLanguage('it', event)" class="${LANG === 'it' ? 'active' : ''}">🇮🇹 Italiano</a>
                <a href="#" onclick="switchLanguage('en', event)" class="${LANG === 'en' ? 'active' : ''}">🇬🇧 English</a>
            </div>
        </div>`;

    const data = {
        lang: t.lang,
        courseTitle: t.courseTitle,
        authorBio: t.authorBio,
        chaptersTitle: t.chaptersTitle,
        chaptersIntro: t.chaptersIntro,
        guidesTitle: t.guidesTitle,
        guidesIntro: t.guidesIntro,
        allRightsReserved: t.allRightsReserved,
        updatedMaterial: t.updatedMaterial,
        chaptersList: chaptersList,
        guidesList: guidesList || '',
        guidesDisplay: guides.length > 0 ? '' : 'display: none;',
        totalChapters: chapters.length,
        totalGuides: guides.length,
        langSelector: langSelector
    };

    let result = template;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key]);
    });

    return result;
}

// Escape HTML per sicurezza
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Main
function main() {
    console.log(`=🤖 Generatore di Slide per Corso AI (Template-Based)\n`);
    console.log(`📚 Lingua: ${LANG.toUpperCase()}\n`);

    // Verifica che esistano le directory necessarie
    [SLIDES_DIR, GUIDES_DIR, TEMPLATES_DIR, OUTPUT_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Carica l'ordine dei capitoli dal file di configurazione
    const chaptersOrderConfig = JSON.parse(fs.readFileSync('./chapters-order.json', 'utf8'));
    const langConfig = chaptersOrderConfig[LANG];

    if (!langConfig) {
        console.error(`❌ Configurazione non trovata per la lingua "${LANG}" in chapters-order.json`);
        process.exit(1);
    }

    // Ordina i file secondo la configurazione
    const slideFiles = langConfig.chapters.map(slug => `${slug}.json`);
    const guideFiles = langConfig.guides.map(slug => `${slug}.json`);

    // Verifica che ci sia almeno un file (slides o guides)
    if (slideFiles.length === 0 && guideFiles.length === 0) {
        console.error(`❌ Nessun capitolo trovato per la lingua "${LANG}"`);
        console.error(`   Verifica chapters-order.json e che i file esistano in:`);
        console.error(`   - ${SLIDES_DIR}/`);
        console.error(`   - ${GUIDES_DIR}/`);
        process.exit(1);
    }

    // Prima passata: leggi tutti i capitoli per creare la nav
    const allChapters = slideFiles.map((file, index) => {
        const data = JSON.parse(fs.readFileSync(path.join(SLIDES_DIR, file), 'utf8'));
        const slug = file.replace('.json', '');
        return {
            number: index,  // Numero basato sulla posizione nell'ordine
            title: data.title,
            slug: slug,
            slides: data.slides
        };
    });

    // Prima passata: leggi tutte le guide
    const allGuides = guideFiles.map(file => {
        const data = JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8'));
        const slug = file.replace('.json', '');
        return {
            title: data.title,
            slug: slug,
            slides: data.slides
        };
    });

    // Seconda passata: genera ogni capitolo con la nav completa
    const chapters = slideFiles.map(file => generateChapter(file, allChapters, SLIDES_DIR));

    // Genera le guide
    const guides = guideFiles.map(file => generateChapter(file, allGuides, GUIDES_DIR));

    if (guides.length > 0) {
        console.log('\n📚 Guide tecniche:');
    }

    // Genera l'indice principale
    const mainIndexHtml = generateMainIndex(chapters, guides);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), mainIndexHtml);

    console.log(`\n✅ Indice principale generato: output/${LANG}/index.html`);

    // Genera index root (solo una volta, quando generi IT)
    if (LANG === 'it') {
        const rootIndexTemplate = readTemplate(path.join(TEMPLATES_DIR, 'index-root.html'));
        fs.writeFileSync('./index.html', rootIndexTemplate);
        console.log('✅ Index root generato: index.html');
    }

    const totalSlides = chapters.reduce((sum, c) => sum + c.slides.length, 0) + guides.reduce((sum, g) => sum + g.slides.length, 0);
    console.log(`\n<✓ Generazione completata! ${chapters.length} capitoli, ${guides.length} guide, ${totalSlides} slide totali`);
}

// Esegui
if (require.main === module) {
    main();
}

module.exports = { generateChapter, generateMainIndex };
