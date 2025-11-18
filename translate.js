#!/usr/bin/env node

/**
 * Script di traduzione con OpenAI API
 * Traduce JSON dall'italiano all'inglese usando GPT-4o-mini
 *
 * Usage: node translate.js [--model=gpt-4o-mini] [--file=001-ai-generativa.json]
 *
 * Richiede OPENAI_API_KEY in environment o file .env
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse arguments
const args = process.argv.slice(2);
const modelArg = args.find(arg => arg.startsWith('--model='));
const fileArg = args.find(arg => arg.startsWith('--file='));
const forceArg = args.includes('--force');

const MODEL = modelArg ? modelArg.split('=')[1] : 'gpt-4o-mini';
const SINGLE_FILE = fileArg ? fileArg.split('=')[1] : null;

const SOURCE_LANG = 'it';
const TARGET_LANG = 'en';

const SLIDES_SOURCE_DIR = `./slides/${SOURCE_LANG}`;
const SLIDES_TARGET_DIR = `./slides/${TARGET_LANG}`;
const GUIDES_SOURCE_DIR = `./guides/${SOURCE_LANG}`;
const GUIDES_TARGET_DIR = `./guides/${TARGET_LANG}`;

// Carica .env se esiste
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv();

// Verifica API key
function checkApiKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY non trovata!');
        console.error('');
        console.error('Opzioni:');
        console.error('1. Crea file .env con: OPENAI_API_KEY=sk-...');
        console.error('2. Esporta variabile: export OPENAI_API_KEY=sk-...');
        console.error('');
        console.error('Ottieni API key da: https://platform.openai.com/api-keys');
        return false;
    }
    return true;
}

// Chiama OpenAI API per tradurre testo
function translateText(text, context = '') {
    return new Promise((resolve, reject) => {
        if (!text || text.trim() === '') {
            resolve(text);
            return;
        }

        const apiKey = process.env.OPENAI_API_KEY;

        const systemPrompt = `You are a professional technical translator specializing in AI, ML, and software development documentation.
Translate from Italian to English maintaining:
- Technical accuracy
- Professional tone
- Code snippets unchanged
- HTML tags unchanged
- Ironic/humorous tone when present

${context ? `Context: ${context}` : ''}

Translate ONLY the text, do not add explanations or comments.`;

        const payload = JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Translate this Italian text to English:\n\n${text}` }
            ],
            temperature: 0.3,  // Low temp for consistent translations
            max_tokens: 4000
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);

                    if (response.error) {
                        console.error(`   ⚠️  API Error: ${response.error.message}`);
                        resolve(text); // Fallback al testo originale
                        return;
                    }

                    const translation = response.choices[0]?.message?.content?.trim();
                    resolve(translation || text);
                } catch (err) {
                    console.error(`   ⚠️  Parse Error: ${err.message}`);
                    resolve(text);
                }
            });
        });

        req.on('error', (err) => {
            console.error(`   ⚠️  Request Error: ${err.message}`);
            resolve(text); // Fallback al testo originale
        });

        req.write(payload);
        req.end();
    });
}

// Traduce una slide
async function translateSlide(slide, slideType) {
    const translated = { ...slide };

    // Traduci campi comuni
    if (slide.title) {
        console.log(`     - title: "${slide.title.substring(0, 50)}..."`);
        translated.title = await translateText(slide.title, `Slide type: ${slideType}`);
    }

    if (slide.subtitle) {
        console.log(`     - subtitle`);
        translated.subtitle = await translateText(slide.subtitle, `Slide type: ${slideType}`);
    }

    if (slide.description) {
        console.log(`     - description`);
        translated.description = await translateText(slide.description, `Slide type: ${slideType}`);
    }

    // Traduci arrays di testo (paragraphs, items, etc.)
    for (const field of ['paragraphs', 'items', 'goals', 'benefits', 'challenges']) {
        if (slide[field] && Array.isArray(slide[field])) {
            console.log(`     - ${field} (${slide[field].length} items)`);
            translated[field] = await Promise.all(
                slide[field].map(item =>
                    typeof item === 'string' ? translateText(item, `Slide field: ${field}`) : Promise.resolve(item)
                )
            );
        }
    }

    // Traduci intro
    if (slide.intro) {
        console.log(`     - intro`);
        translated.intro = await translateText(slide.intro);
    }

    // Traduci explanation
    if (slide.explanation) {
        console.log(`     - explanation`);
        translated.explanation = await translateText(slide.explanation);
    }

    // Traduci ironicClosing
    if (slide.ironicClosing) {
        console.log(`     - ironicClosing`);
        translated.ironicClosing = await translateText(slide.ironicClosing, 'This is an ironic/humorous closing remark');
    }

    // Gestisci leftColumn e rightColumn
    if (slide.leftColumn) {
        translated.leftColumn = { ...slide.leftColumn };
        if (slide.leftColumn.title) {
            translated.leftColumn.title = await translateText(slide.leftColumn.title);
        }
        if (slide.leftColumn.items) {
            translated.leftColumn.items = await Promise.all(
                slide.leftColumn.items.map(item => translateText(item, 'Column item'))
            );
        }
    }

    if (slide.rightColumn) {
        translated.rightColumn = { ...slide.rightColumn };
        if (slide.rightColumn.title) {
            translated.rightColumn.title = await translateText(slide.rightColumn.title);
        }
        if (slide.rightColumn.items) {
            translated.rightColumn.items = await Promise.all(
                slide.rightColumn.items.map(item => translateText(item, 'Column item'))
            );
        }
    }

    // Il codice NON viene tradotto (mantieni code.snippet originale)
    // Le citazioni non vengono tradotte (mantieni citations originali)

    return translated;
}

// Traduce step names
async function translateSteps(steps) {
    if (!steps) return steps;

    return Promise.all(steps.map(async step => ({
        ...step,
        name: await translateText(step.name, 'Workshop step name')
    })));
}

// Traduce un intero file JSON
async function translateJsonFile(sourceFile, targetFile) {
    console.log(`\n📄 ${path.basename(sourceFile)}`);

    try {
        const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

        // Controlla se già tradotto e se forzare
        if (data.lastTranslated && !forceArg) {
            console.log(`   ⏭️  Già tradotto (${data.lastTranslated}). Usa --force per ritradurre.`);
            return false;
        }

        const translated = {
            ...data,
            sourceLanguage: TARGET_LANG,
            lastTranslated: new Date().toISOString().split('T')[0]
        };

        // Traduci metadati principali
        console.log(`   📝 Metadati:`);
        if (data.title) {
            console.log(`     - title`);
            translated.title = await translateText(data.title, 'Chapter title');
        }
        if (data.description) {
            console.log(`     - description`);
            translated.description = await translateText(data.description, 'Chapter description');
        }

        // Traduci steps (per workshop)
        if (data.steps) {
            console.log(`   🔄 Steps:`);
            translated.steps = await translateSteps(data.steps);
        }

        // Traduci tutte le slide
        if (data.slides && Array.isArray(data.slides)) {
            console.log(`   📊 Slides (${data.slides.length} totali):`);
            translated.slides = [];
            for (let idx = 0; idx < data.slides.length; idx++) {
                const slide = data.slides[idx];
                console.log(`     [${idx + 1}/${data.slides.length}] ${slide.type}`);
                translated.slides.push(await translateSlide(slide, slide.type));
            }
        }

        // Salva file tradotto
        fs.writeFileSync(targetFile, JSON.stringify(translated, null, 2));
        console.log(`   ✅ Tradotto → ${targetFile}`);
        return true;

    } catch (err) {
        console.error(`   ❌ Errore: ${err.message}`);
        return false;
    }
}

// Main
async function main() {
    console.log('=🌐 Traduttore Automatico con OpenAI\n');
    console.log(`📚 ${SOURCE_LANG.toUpperCase()} → ${TARGET_LANG.toUpperCase()}`);
    console.log(`🤖 Modello: ${MODEL}`);
    console.log(`💰 Costo stimato: $0.15/M input + $0.60/M output tokens\n`);

    // Verifica API key
    if (!checkApiKey()) {
        process.exit(1);
    }

    // Crea directory target se non esistono
    [SLIDES_TARGET_DIR, GUIDES_TARGET_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    let translated = 0;
    let skipped = 0;
    let errors = 0;

    // Traduci singolo file o tutti
    if (SINGLE_FILE) {
        // Cerca prima in slides, poi in guides
        let sourceFile = path.join(SLIDES_SOURCE_DIR, SINGLE_FILE);
        let targetFile = path.join(SLIDES_TARGET_DIR, SINGLE_FILE);

        if (!fs.existsSync(sourceFile)) {
            sourceFile = path.join(GUIDES_SOURCE_DIR, SINGLE_FILE);
            targetFile = path.join(GUIDES_TARGET_DIR, SINGLE_FILE);
        }

        if (!fs.existsSync(sourceFile)) {
            console.error(`❌ File non trovato: ${SINGLE_FILE}`);
            console.error(`   Cercato in: slides/${SOURCE_LANG}/ e guides/${SOURCE_LANG}/`);
            process.exit(1);
        }

        const success = await translateJsonFile(sourceFile, targetFile);
        if (success) translated++;
        else skipped++;

    } else {
        // Traduci tutti i file slides
        console.log('📚 SLIDES:\n');
        const slideFiles = fs.readdirSync(SLIDES_SOURCE_DIR)
            .filter(f => f.endsWith('.json'))
            .sort();

        for (const file of slideFiles) {
            const sourceFile = path.join(SLIDES_SOURCE_DIR, file);
            const targetFile = path.join(SLIDES_TARGET_DIR, file);

            const success = await translateJsonFile(sourceFile, targetFile);
            if (success) translated++;
            else if (fs.existsSync(targetFile)) skipped++;
            else errors++;
        }

        // Traduci tutti i file guides
        if (fs.existsSync(GUIDES_SOURCE_DIR)) {
            console.log('\n\n📚 GUIDES:\n');
            const guideFiles = fs.readdirSync(GUIDES_SOURCE_DIR)
                .filter(f => f.endsWith('.json'))
                .sort();

            for (const file of guideFiles) {
                const sourceFile = path.join(GUIDES_SOURCE_DIR, file);
                const targetFile = path.join(GUIDES_TARGET_DIR, file);

                const success = await translateJsonFile(sourceFile, targetFile);
                if (success) translated++;
                else if (fs.existsSync(targetFile)) skipped++;
                else errors++;
            }
        }
    }

    // Summary
    console.log('\n\n=== RIEPILOGO ===');
    console.log(`✅ Tradotti: ${translated}`);
    console.log(`⏭️  Saltati (già tradotti): ${skipped}`);
    if (errors > 0) {
        console.log(`❌ Errori: ${errors}`);
    }

    console.log('\n💡 Suggerimenti:');
    console.log('   • Traduci singolo file: node translate.js --file=001-ai-generativa.json');
    console.log('   • Forza ritraduzione: node translate.js --force');
    console.log('   • Modello alternativo: node translate.js --model=gpt-3.5-turbo');
    console.log('   • Genera slides EN: node generator.js --lang=en');
}

// Esegui
if (require.main === module) {
    main().catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
}

module.exports = { translateText, translateJsonFile };
