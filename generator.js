#!/usr/bin/env node

/**
 * Generatore di slide per corso AI - Template Based (Multi-Language)
 * Legge JSON puri e usa template per generare HTML
 *
 * Usage: node generator.js
 * Genera automaticamente tutte le lingue disponibili in chapters-order.json
 */

const fs = require('fs');
const path = require('path');

// Configurazione base
const TEMPLATES_DIR = './templates';
const SLIDE_TEMPLATES_DIR = './templates/slides';

// Messaggi ironici del personaggio (100+ messaggi per lingua)
const BUDDY_MESSAGES_IT = [
    { emoji: '👀', message: 'Ti vedo che ti sei distratto... torna qui!' },
    { emoji: '🤖', message: 'Questa parte è importante. Memorizza!' },
    { emoji: '☕', message: 'Caffè dopo. Ancora 3 slide!' },
    { emoji: '🦉', message: 'Occhio! Questo ritorna dopo.' },
    { emoji: '🧠', message: 'Brain.exe smesso? Respira e rileggi.' },
    { emoji: '⚡', message: 'Questa ti farà sembrare smart nei meeting.' },
    { emoji: '🎯', message: 'Focus! Slide densa incoming.' },
    { emoji: '💡', message: 'Plot twist: più semplice di quanto sembri.' },
    { emoji: '🔥', message: 'Hot take in arrivo. Attenzione.' },
    { emoji: '🚀', message: 'Quasi alla fine, dai!' },
    { emoji: '💬', message: 'No, non scrivere agli amici. Ancora 2 minuti.' },
    { emoji: '⌨️', message: 'Non aprire VS Code. Ancora non hai finito qui.' },
    { emoji: '🎮', message: 'ChatGPT può aspettare. Prima impara.' },
    { emoji: '📱', message: 'Slack ti chiama? Ignoralo. Sei in formazione.' },
    { emoji: '🐦', message: 'Twitter/X sarà lì dopo. Questa no.' },
    { emoji: '👨‍💻', message: 'Vedo che stai già aprendo un editor...' },
    { emoji: '🤯', message: 'Info overload? Normale. Respira e continua.' },
    { emoji: '📊', message: 'Questo sarà nel quiz. Sì, ci sarà un quiz.' },
    { emoji: '⏰', message: 'No multitasking. Sei developer, non kernel.' },
    { emoji: '🎓', message: 'Learning mode: ON. Hacking mode: OFF.' },
    { emoji: '💻', message: 'Chiudi Stack Overflow. Questa è teoria.' },
    { emoji: '🔍', message: 'Non cercare su Google ancora. Ascolta prima.' },
    { emoji: '🎧', message: 'Spotify può aspettare. Silenzio = focus.' },
    { emoji: '📧', message: 'Email? Possono aspettare 20 minuti.' },
    { emoji: '🎪', message: 'Focus! Non è un circo, è AI engineering.' },
    { emoji: '🧩', message: 'Pezzo del puzzle. Ti servirà dopo.' },
    { emoji: '⚠️', message: 'Attenzione: questo rompe assunzioni comuni.' },
    { emoji: '🎬', message: 'Plot twist tecnico in 3... 2... 1...' },
    { emoji: '🔒', message: 'Blocca le notifiche. Ora.' },
    { emoji: '👁️', message: 'Lo vedo che stai per aprire un\'altra tab.' },
    { emoji: '⏸️', message: 'Pausa mental break dopo. Ora concentrati.' },
    { emoji: '🎯', message: 'Obiettivo: finire questa sezione. Focus!' },
    { emoji: '💪', message: 'You got this. Ancora qualche slide.' },
    { emoji: '🧘', message: 'Zen mode. No chat, no code, solo slide.' },
    { emoji: '📖', message: 'Leggere > chattare. Sempre.' },
    { emoji: '🚫', message: 'No Reddit. No Twitter. No distrazioni.' },
    { emoji: '⚙️', message: 'Setup mental model prima. Code dopo.' },
    { emoji: '🎨', message: 'Apprezza l\'architettura. Poi implementa.' },
    { emoji: '🔮', message: 'Questo ti salverà in production. Trust me.' },
    { emoji: '📚', message: 'Knowledge stack overflow. Ma in senso buono.' },
    { emoji: '🏃', message: 'Non correre al codice. Capisci prima il perché.' },
    { emoji: '🎤', message: 'Shh. Ascolta. Questo è importante.' },
    { emoji: '🌟', message: 'Questa è la slide che userai nel CV.' },
    { emoji: '🎁', message: 'Regalo: knowledge che Google non ti dà.' },
    { emoji: '🧠', message: 'Brain buffer pieno? Respira. Rileggi.' },
    { emoji: '⚡', message: 'Lightning talk? No. Deep dive? Yes.' },
    { emoji: '🎯', message: 'Signal vs noise. Questa è signal puro.' },
    { emoji: '🔧', message: 'Tool mental prima. Tool vero dopo.' },
    { emoji: '📈', message: 'Skill++. Distraction--. Simple math.' },
    { emoji: '🎓', message: 'Pro tip: questa slide ritorna negli interview.' },
    { emoji: '💎', message: 'Gemma nascosta. Memorizza bene.' },
    { emoji: '🌊', message: 'Flow state. Mantienilo. No interruzioni.' },
    { emoji: '🎪', message: 'Non è magia. È solo buona ingegneria.' },
    { emoji: '🔬', message: 'Analizza ora. Copia-incolla mai.' },
    { emoji: '🎯', message: 'Bullseye. Questa è la core concept.' },
    { emoji: '⏱️', message: '5 minuti di focus > 2 ore di distraction.' },
    { emoji: '🧩', message: 'Puzzle piece #N. Serve per il quadro finale.' },
    { emoji: '🎬', message: 'Director\'s cut: la versione che serve davvero.' },
    { emoji: '🔐', message: 'Knowledge unlock: livello superiore.' },
    { emoji: '🎨', message: 'Pattern recognition in training... attendere.' },
    { emoji: '🚀', message: 'Countdown to enlightenment: focus mode on.' },
    { emoji: '💡', message: 'Aha moment incoming. Occhi aperti.' },
    { emoji: '🎓', message: 'Laurea in procrastination? No grazie.' },
    { emoji: '⚠️', message: 'Warning: concetto counter-intuitivo ahead.' },
    { emoji: '🧠', message: 'Neural network training. Il tuo, non GPT.' },
    { emoji: '🎯', message: 'Target acquired: fine sezione. Resisti!' },
    { emoji: '📡', message: 'Segnale importante. Rumore = zero.' },
    { emoji: '🔥', message: 'Fire content. Non lasciar raffreddare.' },
    { emoji: '🎪', message: 'Best practice, not best guess. Memorizza.' },
    { emoji: '⚙️', message: 'Mental model loading... 90% complete.' },
    { emoji: '🎬', message: 'Take #1. No rewind. Concentrati ora.' },
    { emoji: '🔬', message: 'Experiment mode OFF. Learning mode ON.' },
    { emoji: '🎯', message: 'Precision matters. Anche nell\'attenzione.' },
    { emoji: '🧘', message: 'Mindfulness > multitasking. Always.' },
    { emoji: '💻', message: 'Code dopo. Concepts prima. In quest\'ordine.' },
    { emoji: '🎓', message: 'Senior dev secret: leggono prima di codare.' },
    { emoji: '📊', message: 'Data point critico. Annota mentalmente.' },
    { emoji: '🔮', message: 'Previsione: userai questo entro 1 settimana.' },
    { emoji: '🎯', message: 'Focus laser. Slide laser. Match perfetto.' },
    { emoji: '⚡', message: 'High voltage content. Maneggiare con cura.' },
    { emoji: '🧠', message: 'Synapses firing. Keep momentum!' },
    { emoji: '🎪', message: 'Il trucco è non distrarsi. Proprio ora.' },
    { emoji: '🔧', message: 'Debug mentale: focus = true.' },
    { emoji: '💎', message: 'Rare knowledge. Non su Stack Overflow.' },
    { emoji: '🎬', message: 'Extended edition. Ogni frame conta.' },
    { emoji: '🚀', message: 'Launch sequence: apprendimento in corso.' },
    { emoji: '🎯', message: 'Questa è roba che i tutorial saltano.' },
    { emoji: '🔬', message: 'Deep tech. Not surface level. Focus.' },
    { emoji: '💡', message: 'Lightbulb moment in 3... 2... ora!' },
    { emoji: '🧩', message: 'Missing piece found. Assimila bene.' },
    { emoji: '⚙️', message: 'Architecture matters. Implementazione dopo.' },
    { emoji: '🎓', message: 'Questo separa junior da senior. Annota.' },
    { emoji: '🔥', message: 'Hot take warning. Mind = blown soon.' },
    { emoji: '📡', message: 'Broadcast importante. Ricevi bene?' },
    { emoji: '🎯', message: 'Zoom in su questa. È chiave.' },
    { emoji: '🧠', message: 'Bandwidth pieno? Buon segno. Continua.' },
    { emoji: '💻', message: 'Hands off keyboard. Eyes on screen.' },
    { emoji: '🎪', message: 'No spoiler: la fine ripaga. Fidati.' },
    { emoji: '⚡', message: 'Power concept. Richiede power focus.' },
    { emoji: '🔐', message: 'Unlock achievement: pattern compreso.' },
    { emoji: '🎬', message: 'Climax incoming. Attenzione massima.' },
    { emoji: '🧘', message: 'Respira. Assorbi. Procedi. Repeat.' },
    { emoji: '🎯', message: 'Critical hit su ignoranza. Nice!' },
    { emoji: '💎', message: 'Treasure found. Extract knowledge.' },
    { emoji: '🔬', message: 'Analisi profonda richiesta. Focus up!' },
    { emoji: '🚀', message: 'Ignition sequence. Learning trajectory: ↗️' },
    { emoji: '🎓', message: 'Curriculum vitae++. Ma solo se studi ora.' },
    { emoji: '⚙️', message: 'Sistema complesso. Attenzione ai dettagli.' },
    { emoji: '🔥', message: 'Spicy content. Handle with focus.' },
    { emoji: '💡', message: 'Eureka in arrivo. Preparati.' },
    { emoji: '🎯', message: 'Foundation slide. Saltarla = bad idea.' }
];

const BUDDY_MESSAGES_EN = [
    { emoji: '👀', message: 'I see you got distracted... back here!' },
    { emoji: '🤖', message: 'This part is important. Memorize!' },
    { emoji: '☕', message: 'Coffee later. 3 more slides!' },
    { emoji: '🦉', message: 'Heads up! This comes back later.' },
    { emoji: '🧠', message: 'Brain.exe stopped? Breathe and re-read.' },
    { emoji: '⚡', message: 'This will make you sound smart in meetings.' },
    { emoji: '🎯', message: 'Focus! Dense slide incoming.' },
    { emoji: '💡', message: 'Plot twist: simpler than it looks.' },
    { emoji: '🔥', message: 'Hot take incoming. Pay attention.' },
    { emoji: '🚀', message: 'Almost there, come on!' },
    { emoji: '💬', message: 'No, don\'t text friends. 2 more minutes.' },
    { emoji: '⌨️', message: 'Don\'t open VS Code. Not done here yet.' },
    { emoji: '🎮', message: 'ChatGPT can wait. Learn first.' },
    { emoji: '📱', message: 'Slack calling? Ignore it. You\'re learning.' },
    { emoji: '🐦', message: 'Twitter/X will be there later. This won\'t.' },
    { emoji: '👨‍💻', message: 'I see you opening an editor already...' },
    { emoji: '🤯', message: 'Info overload? Normal. Breathe and continue.' },
    { emoji: '📊', message: 'This will be on the test. Yes, there\'s a test.' },
    { emoji: '⏰', message: 'No multitasking. You\'re a dev, not a kernel.' },
    { emoji: '🎓', message: 'Learning mode: ON. Hacking mode: OFF.' },
    { emoji: '💻', message: 'Close Stack Overflow. This is theory.' },
    { emoji: '🔍', message: 'Don\'t Google yet. Listen first.' },
    { emoji: '🎧', message: 'Spotify can wait. Silence = focus.' },
    { emoji: '📧', message: 'Emails? They can wait 20 minutes.' },
    { emoji: '🎪', message: 'Focus! Not a circus, it\'s AI engineering.' },
    { emoji: '🧩', message: 'Puzzle piece. You\'ll need this later.' },
    { emoji: '⚠️', message: 'Warning: this breaks common assumptions.' },
    { emoji: '🎬', message: 'Technical plot twist in 3... 2... 1...' },
    { emoji: '🔒', message: 'Lock notifications. Now.' },
    { emoji: '👁️', message: 'I see you about to open another tab.' },
    { emoji: '⏸️', message: 'Mental break after. Focus now.' },
    { emoji: '🎯', message: 'Goal: finish this section. Focus!' },
    { emoji: '💪', message: 'You got this. Few more slides.' },
    { emoji: '🧘', message: 'Zen mode. No chat, no code, just slides.' },
    { emoji: '📖', message: 'Reading > chatting. Always.' },
    { emoji: '🚫', message: 'No Reddit. No Twitter. No distractions.' },
    { emoji: '⚙️', message: 'Build mental model first. Code later.' },
    { emoji: '🎨', message: 'Appreciate the architecture. Then implement.' },
    { emoji: '🔮', message: 'This will save you in production. Trust me.' },
    { emoji: '📚', message: 'Knowledge stack overflow. But the good kind.' },
    { emoji: '🏃', message: 'Don\'t rush to code. Understand why first.' },
    { emoji: '🎤', message: 'Shh. Listen. This is important.' },
    { emoji: '🌟', message: 'This is the slide you\'ll put on your CV.' },
    { emoji: '🎁', message: 'Gift: knowledge Google won\'t give you.' },
    { emoji: '🧠', message: 'Brain buffer full? Breathe. Re-read.' },
    { emoji: '⚡', message: 'Lightning talk? No. Deep dive? Yes.' },
    { emoji: '🎯', message: 'Signal vs noise. This is pure signal.' },
    { emoji: '🔧', message: 'Mental tool first. Real tool later.' },
    { emoji: '📈', message: 'Skill++. Distraction--. Simple math.' },
    { emoji: '🎓', message: 'Pro tip: this slide shows up in interviews.' },
    { emoji: '💎', message: 'Hidden gem. Memorize well.' },
    { emoji: '🌊', message: 'Flow state. Maintain it. No interruptions.' },
    { emoji: '🎪', message: 'Not magic. Just good engineering.' },
    { emoji: '🔬', message: 'Analyze now. Copy-paste never.' },
    { emoji: '🎯', message: 'Bullseye. This is the core concept.' },
    { emoji: '⏱️', message: '5 min focus > 2 hours distracted.' },
    { emoji: '🧩', message: 'Puzzle piece #N. Needed for final picture.' },
    { emoji: '🎬', message: 'Director\'s cut: the version that matters.' },
    { emoji: '🔐', message: 'Knowledge unlock: next level.' },
    { emoji: '🎨', message: 'Pattern recognition training... please wait.' },
    { emoji: '🚀', message: 'Countdown to enlightenment: focus mode on.' },
    { emoji: '💡', message: 'Aha moment incoming. Eyes open.' },
    { emoji: '🎓', message: 'PhD in procrastination? No thanks.' },
    { emoji: '⚠️', message: 'Warning: counter-intuitive concept ahead.' },
    { emoji: '🧠', message: 'Neural network training. Yours, not GPT.' },
    { emoji: '🎯', message: 'Target acquired: section end. Resist!' },
    { emoji: '📡', message: 'Important signal. Noise = zero.' },
    { emoji: '🔥', message: 'Fire content. Don\'t let it cool.' },
    { emoji: '🎪', message: 'Best practice, not best guess. Memorize.' },
    { emoji: '⚙️', message: 'Mental model loading... 90% complete.' },
    { emoji: '🎬', message: 'Take #1. No rewind. Focus now.' },
    { emoji: '🔬', message: 'Experiment mode OFF. Learning mode ON.' },
    { emoji: '🎯', message: 'Precision matters. Also in attention.' },
    { emoji: '🧘', message: 'Mindfulness > multitasking. Always.' },
    { emoji: '💻', message: 'Code later. Concepts first. In that order.' },
    { emoji: '🎓', message: 'Senior dev secret: they read before coding.' },
    { emoji: '📊', message: 'Critical data point. Mental note it.' },
    { emoji: '🔮', message: 'Prediction: you\'ll use this within 1 week.' },
    { emoji: '🎯', message: 'Laser focus. Laser slide. Perfect match.' },
    { emoji: '⚡', message: 'High voltage content. Handle with care.' },
    { emoji: '🧠', message: 'Synapses firing. Keep momentum!' },
    { emoji: '🎪', message: 'The trick is not getting distracted. Right now.' },
    { emoji: '🔧', message: 'Mental debug: focus = true.' },
    { emoji: '💎', message: 'Rare knowledge. Not on Stack Overflow.' },
    { emoji: '🎬', message: 'Extended edition. Every frame counts.' },
    { emoji: '🚀', message: 'Launch sequence: learning in progress.' },
    { emoji: '🎯', message: 'This is stuff tutorials skip.' },
    { emoji: '🔬', message: 'Deep tech. Not surface level. Focus.' },
    { emoji: '💡', message: 'Lightbulb moment in 3... 2... now!' },
    { emoji: '🧩', message: 'Missing piece found. Assimilate well.' },
    { emoji: '⚙️', message: 'Architecture matters. Implementation later.' },
    { emoji: '🎓', message: 'This separates junior from senior. Note it.' },
    { emoji: '🔥', message: 'Hot take warning. Mind = blown soon.' },
    { emoji: '📡', message: 'Important broadcast. Receiving well?' },
    { emoji: '🎯', message: 'Zoom in on this. It\'s key.' },
    { emoji: '🧠', message: 'Bandwidth full? Good sign. Continue.' },
    { emoji: '💻', message: 'Hands off keyboard. Eyes on screen.' },
    { emoji: '🎪', message: 'No spoiler: the end pays off. Trust.' },
    { emoji: '⚡', message: 'Power concept. Requires power focus.' },
    { emoji: '🔐', message: 'Unlock achievement: pattern understood.' },
    { emoji: '🎬', message: 'Climax incoming. Maximum attention.' },
    { emoji: '🧘', message: 'Breathe. Absorb. Proceed. Repeat.' },
    { emoji: '🎯', message: 'Critical hit on ignorance. Nice!' },
    { emoji: '💎', message: 'Treasure found. Extract knowledge.' },
    { emoji: '🔬', message: 'Deep analysis required. Focus up!' },
    { emoji: '🚀', message: 'Ignition sequence. Learning trajectory: ↗️' },
    { emoji: '🎓', message: 'CV++. But only if you study now.' },
    { emoji: '⚙️', message: 'Complex system. Mind the details.' },
    { emoji: '🔥', message: 'Spicy content. Handle with focus.' },
    { emoji: '💡', message: 'Eureka incoming. Get ready.' },
    { emoji: '🎯', message: 'Foundation slide. Skipping = bad idea.' }
];

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

// Funzione wrapper che aggiunge il personaggio ironico
function renderSlideContentWithBuddy(slideData, slideIndex = 0, LANG = 'it') {
    let content = renderSlideContent(slideData);

    // Seleziona l'array di messaggi in base alla lingua
    const messages = LANG === 'en' ? BUDDY_MESSAGES_EN : BUDDY_MESSAGES_IT;

    // Aggiungi personaggio ironico su ogni slide (tranne la prima)
    if (slideIndex > 0) {
        // Usa un seed basato su slideIndex per avere variabilità ma consistenza
        const messageIndex = (slideIndex * 7 + slideIndex % 13) % messages.length;
        const buddy = messages[messageIndex];
        content += `
            <div class="slide-buddy">${buddy.emoji}</div>
            <div class="slide-buddy-message">${buddy.message}</div>
        `;
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
function generateNavBar(allChapters, currentChapter, slideIndex = null, LANG) {
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

// Helper function to generate slide filename with cache-busting timestamp
function getSlideFilename(slideIndex, timestamp) {
    return `slide-${slideIndex}-${timestamp}.html`;
}

// Genera una singola slide
function generateSlide(slideData, slideIndex, totalSlides, chapterData, allChapters, LANG, timestamp) {
    const template = readTemplate(path.join(TEMPLATES_DIR, 'slide.html'));

    const hasPrev = slideIndex > 0;
    const hasNext = slideIndex < totalSlides - 1;

    const slideContent = renderSlideContentWithBuddy(slideData, slideIndex, LANG);
    const navBar = generateNavBar(allChapters, chapterData, slideIndex, LANG);

    const data = {
        navBar: navBar,
        content: slideContent,
        chapterTitle: chapterData.title,
        chapterNumber: chapterData.number,
        slideNumber: slideIndex + 1,
        totalSlides: totalSlides,
        prevSlide: hasPrev ? getSlideFilename(slideIndex, timestamp) : '',
        nextSlide: hasNext ? getSlideFilename(slideIndex + 2, timestamp) : '',
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
function generateChapter(chapterFile, allChapters, sourceDir, LANG, OUTPUT_DIR, timestamp) {
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

    // Pulisci vecchi file slide (mantieni solo i file che iniziano con slide- e finiscono con .html)
    if (fs.existsSync(chapterDir)) {
        const oldFiles = fs.readdirSync(chapterDir).filter(file => file.match(/^slide-\d+.*\.html$/));
        oldFiles.forEach(file => {
            fs.unlinkSync(path.join(chapterDir, file));
        });
    }

    // Genera ogni slide con cache-busting filename
    chapterData.slides.forEach((slide, index) => {
        const slideHtml = generateSlide(slide, index, chapterData.slides.length, chapterData, allChapters, LANG, timestamp);
        const filename = getSlideFilename(index + 1, timestamp);
        fs.writeFileSync(path.join(chapterDir, filename), slideHtml);
    });

    console.log(` Capitolo ${chapterData.number}: "${chapterData.title}" generato (${chapterData.slides.length} slide)`);

    return chapterData;
}

// Genera l'indice principale del corso
function generateMainIndex(chapters, guides = [], LANG, OUTPUT_DIR, timestamp) {
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
        const firstSlideFilename = getSlideFilename(1, timestamp);
        return `<li class="chapter-item">
            <a href="${chapter.slug}/${firstSlideFilename}">
                <span class="chapter-icon">${icon}</span>
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-slides">${chapter.slides.length} ${t.slides}</span>
            </a>
        </li>`;
    }).join('\n');

    const guidesList = guides.map(guide => {
        const firstSlideFilename = getSlideFilename(1, timestamp);
        return `<li class="guide-item">
            <a href="${guide.slug}/${firstSlideFilename}">
                <span class="guide-icon">📚</span>
                <span class="guide-title">${guide.title}</span>
                <span class="guide-slides">${guide.slides.length} ${t.slides}</span>
            </a>
        </li>`;
    }).join('\n');

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

// Genera le slide per una specifica lingua
function generateForLanguage(LANG, chaptersOrderConfig) {
    console.log(`\n📚 Lingua: ${LANG.toUpperCase()}`);
    console.log(`${'='.repeat(50)}`);

    // Genera timestamp per cache-busting (condiviso per tutte le slide di questa lingua)
    const timestamp = Date.now();
    console.log(`⏰ Cache-busting timestamp: ${timestamp}`);

    // Configurazione per questa lingua
    const SLIDES_DIR = `./slides/${LANG}`;
    const GUIDES_DIR = `./guides/${LANG}`;
    const OUTPUT_DIR = `./output/${LANG}`;

    // Verifica che esistano le directory necessarie
    [SLIDES_DIR, GUIDES_DIR, TEMPLATES_DIR, OUTPUT_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    const langConfig = chaptersOrderConfig[LANG];

    if (!langConfig) {
        console.error(`❌ Configurazione non trovata per la lingua "${LANG}" in chapters-order.json`);
        return { success: false };
    }

    // Ordina i file secondo la configurazione
    const slideFiles = langConfig.chapters.map(slug => `${slug}.json`);
    const guideFiles = langConfig.guides.map(slug => `${slug}.json`);

    // Filtra solo i file che esistono effettivamente
    const existingSlideFiles = slideFiles.filter(file => {
        const exists = fs.existsSync(path.join(SLIDES_DIR, file));
        if (!exists) {
            console.warn(`⚠️  Capitolo non trovato: ${file} (skipped)`);
        }
        return exists;
    });

    const existingGuideFiles = guideFiles.filter(file => {
        const exists = fs.existsSync(path.join(GUIDES_DIR, file));
        if (!exists) {
            console.warn(`⚠️  Guida non trovata: ${file} (skipped)`);
        }
        return exists;
    });

    // Verifica che ci sia almeno un file
    if (existingSlideFiles.length === 0 && existingGuideFiles.length === 0) {
        console.error(`❌ Nessun capitolo o guida trovata per la lingua "${LANG}"`);
        return { success: false };
    }

    // Prima passata: leggi tutti i capitoli per creare la nav
    const allChapters = existingSlideFiles.map((file, index) => {
        const data = JSON.parse(fs.readFileSync(path.join(SLIDES_DIR, file), 'utf8'));
        const slug = file.replace('.json', '');
        return {
            number: index,
            title: data.title,
            slug: slug,
            slides: data.slides
        };
    });

    // Prima passata: leggi tutte le guide
    const allGuides = existingGuideFiles.map(file => {
        const data = JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8'));
        const slug = file.replace('.json', '');
        return {
            title: data.title,
            slug: slug,
            slides: data.slides
        };
    });

    // Modifica temporanea delle variabili globali per questa lingua
    const originalGenerateChapter = generateChapter;
    const originalGenerateMainIndex = generateMainIndex;

    // Wrapper per passare le directory corrette e il timestamp
    const generateChapterWrapper = (file, allItems, dir) => {
        return originalGenerateChapter(file, allItems, dir, LANG, OUTPUT_DIR, timestamp);
    };

    const generateMainIndexWrapper = (chapters, guides) => {
        return originalGenerateMainIndex(chapters, guides, LANG, OUTPUT_DIR, timestamp);
    };

    // Seconda passata: genera ogni capitolo con la nav completa
    const chapters = existingSlideFiles.map(file => generateChapterWrapper(file, allChapters, SLIDES_DIR));

    // Genera le guide
    const guides = existingGuideFiles.map(file => generateChapterWrapper(file, allGuides, GUIDES_DIR));

    if (guides.length > 0) {
        console.log('\n📚 Guide tecniche generati');
    }

    // Genera l'indice principale
    const mainIndexHtml = generateMainIndexWrapper(chapters, guides);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), mainIndexHtml);

    console.log(`✅ Indice principale: output/${LANG}/index.html`);

    const totalSlides = chapters.reduce((sum, c) => sum + c.slides.length, 0) + guides.reduce((sum, g) => sum + g.slides.length, 0);
    console.log(`✓ ${chapters.length} capitoli, ${guides.length} guide, ${totalSlides} slide totali`);

    return { success: true, chapters: chapters.length, guides: guides.length, slides: totalSlides };
}

// Main
function main() {
    console.log(`🤖 Generatore di Slide per Corso AI (Template-Based)`);
    console.log(`${'='.repeat(50)}\n`);

    // Carica l'ordine dei capitoli dal file di configurazione
    const chaptersOrderConfig = JSON.parse(fs.readFileSync('./chapters-order.json', 'utf8'));
    const languages = Object.keys(chaptersOrderConfig);

    console.log(`🌐 Lingue disponibili: ${languages.join(', ')}`);

    // Genera per ogni lingua
    const results = {};
    for (const lang of languages) {
        const result = generateForLanguage(lang, chaptersOrderConfig);
        results[lang] = result;
    }

    // Genera index root
    const rootIndexTemplate = readTemplate(path.join(TEMPLATES_DIR, 'index-root.html'));
    fs.writeFileSync('./index.html', rootIndexTemplate);
    console.log(`\n✅ Index root generato: index.html`);

    // Copia index root e assets in output/ per testing locale con struttura identica a produzione
    console.log(`\n📦 Copia file comuni in output/ per testing locale...`);

    // Copia index.html in output/
    fs.writeFileSync('./output/index.html', rootIndexTemplate);
    console.log(`  ✓ output/index.html`);

    // Copia cartella assets in output/assets/
    const assetsSource = './assets';
    const assetsTarget = './output/assets';

    if (fs.existsSync(assetsSource)) {
        // Funzione ricorsiva per copiare directory
        function copyDirRecursive(src, dest) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }

            const entries = fs.readdirSync(src, { withFileTypes: true });

            for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);

                if (entry.isDirectory()) {
                    copyDirRecursive(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        }

        copyDirRecursive(assetsSource, assetsTarget);
        console.log(`  ✓ output/assets/`);
    }

    console.log(`\n💡 Puoi ora testare localmente servendo la cartella 'output/' (ha la stessa struttura di produzione)`);

    // Riepilogo finale
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✓ GENERAZIONE COMPLETATA\n`);
    for (const lang of languages) {
        if (results[lang].success) {
            console.log(`  ${lang.toUpperCase()}: ${results[lang].chapters} capitoli, ${results[lang].guides} guide, ${results[lang].slides} slide`);
        } else {
            console.log(`  ${lang.toUpperCase()}: ❌ Errore`);
        }
    }
}

// Esegui
if (require.main === module) {
    main();
}

module.exports = { generateChapter, generateMainIndex };
