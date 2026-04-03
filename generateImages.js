const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = "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";
const ASSETS_DIR = path.join(__dirname, 'assets');

// Base style that all images will share
const STYLE_PROMPT = "Minimalist 2D vector flat illustration. Color palette: dark navy blue background, character illuminated entirely in shades of turquoise and light blue. Clean fitness app graphic style, no realistic details, simple geometric shapes.";

const prompts = [
    // --- CALENTAMIENTO (Hombre y Mujer) ---
    // Brazos
    { id: 'img_m_warm_arms1', p: `${STYLE_PROMPT} A man stretching his arms wide open to the sides.` },
    { id: 'img_m_warm_arms2', p: `${STYLE_PROMPT} A man crossing his arms over his chest stretching his shoulders.` },
    { id: 'img_f_warm_arms1', p: `${STYLE_PROMPT} A woman stretching her arms wide open to the sides.` },
    { id: 'img_f_warm_arms2', p: `${STYLE_PROMPT} A woman crossing her arms over her chest stretching her shoulders.` },
    // Piernas
    { id: 'img_m_warm_legs1', p: `${STYLE_PROMPT} A man standing straight with hands on hips.` },
    { id: 'img_m_warm_legs2', p: `${STYLE_PROMPT} A man bending down touching his toes to stretch his hamstrings.` },
    { id: 'img_f_warm_legs1', p: `${STYLE_PROMPT} A woman standing straight with hands on hips.` },
    { id: 'img_f_warm_legs2', p: `${STYLE_PROMPT} A woman bending down touching her toes to stretch her hamstrings.` }
];

async function generateImage(promptObj) {
    console.log(`Solicitando generación para: ${promptObj.id}...`);
    
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            model: "dall-e-3",
            prompt: promptObj.p,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        });

        const req = https.request({
            hostname: 'api.openai.com',
            path: '/v1/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Length': payload.length
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const response = JSON.parse(data);
                    const imageUrl = response.data[0].url;
                    downloadImage(imageUrl, path.join(ASSETS_DIR, `${promptObj.id}.png`))
                        .then(() => resolve())
                        .catch(reject);
                } else {
                    console.error("API Error Response:", data);
                    reject(new Error(`API Error: ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function downloadImage(url, dest) {
    console.log(`Descargando imagen a: ${dest}...`);
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR);
    }
    
    // Process sequentially to be safe with rate limits
    for (const prompt of prompts) {
        try {
            await generateImage(prompt);
            console.log(`Exito: ${prompt.id}`);
            // Pequeña pausa entre peticiones
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error(`Fallo en ${prompt.id}:`, e);
        }
    }
    console.log("¡Proceso Terminado!");
}

run();
