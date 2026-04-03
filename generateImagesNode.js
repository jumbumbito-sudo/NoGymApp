const https = require('https');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR);
}

// Strict Coherent Base Prompt
const STYLE_PROMPT = "pure flat 2D graphic vector, faceless silhouette, isolated on a deep solid navy blue background. character is colored entirely in neon turquoise cyan #00e5ff. purely clean minimal UI. no face, no gradient, no realism. absolute clean edges. exact orthographic side profile view.";

function getPrompt(genderStr, excerciseStr) {
    return encodeURIComponent(`${STYLE_PROMPT} A faceless athletic ${genderStr} silhouette ${excerciseStr}`);
}

const imagesToGenerate = [
    // --- FEMALE (Mujer) ---
    { id: 'img_f_warm1', p: getPrompt('woman', 'doing a shoulder stretch, standing straight, very rigid side profile') },
    { id: 'img_f_warm2', p: getPrompt('woman', 'doing a torso twist shoulder stretch, side profile') },
    { id: 'img_f_jacks1', p: getPrompt('woman', 'standing perfectly straight, arms down, simple side profile') },
    { id: 'img_f_jacks2', p: getPrompt('woman', 'jumping jack pose in the air, legs apart, arms up, side profile') },
    { id: 'img_f_plank1', p: getPrompt('woman', 'doing a perfect straight forearm plank on the floor, side view') },
    { id: 'img_f_plank2', p: getPrompt('woman', 'doing a perfect straight forearm plank on the floor, side view') },
    { id: 'img_f_pushups1', p: getPrompt('woman', 'doing a pushup in the high plank position, side view') },
    { id: 'img_f_pushups2', p: getPrompt('woman', 'doing a pushup with chest lowered horizontally near the floor, side view') },
    { id: 'img_f_weights1', p: getPrompt('woman', 'standing straight holding a dumbbell, side profile') },
    { id: 'img_f_weights2', p: getPrompt('woman', 'in a deep squat position holding a dumbbell, side profile') },
    { id: 'img_f_chair1', p: getPrompt('woman', 'standing up straight in front of a flat geometric chair, side profile') },
    { id: 'img_f_chair2', p: getPrompt('woman', 'sitting down directly on a flat geometric chair, side profile') },
    { id: 'img_f_treadmill1', p: getPrompt('woman', 'walking on a minimal flat treadmill, right leg forward, side view') },
    { id: 'img_f_treadmill2', p: getPrompt('woman', 'walking on a minimal flat treadmill, left leg forward, side view') },
    { id: 'img_f_bike1', p: getPrompt('woman', 'riding an exercise stationary bike, side profile') },
    { id: 'img_f_bike2', p: getPrompt('woman', 'riding an exercise stationary bike, side profile') },
    { id: 'img_f_stretch1', p: getPrompt('woman', 'standing straight touching knees gently, side profile') },
    { id: 'img_f_stretch2', p: getPrompt('woman', 'bending down touching the toes, flexibility stretch, side profile') },
    
    // Novedades Mujer
    { id: 'img_f_escoba1', p: getPrompt('woman', 'standing straight holding a broomstick horizontally behind neck, side profile') },
    { id: 'img_f_escoba2', p: getPrompt('woman', 'twisting torso holding a broomstick horizontally behind neck, side profile') },

    // --- MALE (Hombre) ---
    { id: 'img_m_warm1', p: getPrompt('man', 'doing a shoulder stretch, standing straight, very rigid side profile') },
    { id: 'img_m_warm2', p: getPrompt('man', 'doing a torso twist shoulder stretch, side profile') },
    { id: 'img_m_jacks1', p: getPrompt('man', 'standing perfectly straight, arms down, simple side profile') },
    { id: 'img_m_jacks2', p: getPrompt('man', 'jumping jack pose in the air, legs apart, arms up, side profile') },
    { id: 'img_m_plank1', p: getPrompt('man', 'doing a perfect straight forearm plank on the floor, side view') },
    { id: 'img_m_plank2', p: getPrompt('man', 'doing a perfect straight forearm plank on the floor, side view') },
    { id: 'img_m_pushups1', p: getPrompt('man', 'doing a pushup in the high plank position, side view') },
    { id: 'img_m_pushups2', p: getPrompt('man', 'doing a pushup with chest lowered horizontally near the floor, side view') },
    { id: 'img_m_weights1', p: getPrompt('man', 'standing straight holding a dumbbell, side profile') },
    { id: 'img_m_weights2', p: getPrompt('man', 'in a deep squat position holding a dumbbell, side profile') },
    { id: 'img_m_chair1', p: getPrompt('man', 'standing up straight in front of a flat geometric chair, side profile') },
    { id: 'img_m_chair2', p: getPrompt('man', 'sitting down directly on a flat geometric chair, side profile') },
    { id: 'img_m_treadmill1', p: getPrompt('man', 'walking on a minimal flat treadmill, right leg forward, side view') },
    { id: 'img_m_treadmill2', p: getPrompt('man', 'walking on a minimal flat treadmill, left leg forward, side view') },
    { id: 'img_m_bike1', p: getPrompt('man', 'riding an exercise stationary bike, side profile') },
    { id: 'img_m_bike2', p: getPrompt('man', 'riding an exercise stationary bike, side profile') },
    { id: 'img_m_stretch1', p: getPrompt('man', 'standing straight touching knees gently, side profile') },
    { id: 'img_m_stretch2', p: getPrompt('man', 'bending down touching the toes, flexibility stretch, side profile') },
    
    // Novedades Hombre
    { id: 'img_m_escoba1', p: getPrompt('man', 'standing straight holding a broomstick horizontally behind neck, side profile') },
    { id: 'img_m_escoba2', p: getPrompt('man', 'twisting torso holding a broomstick horizontally behind neck, side profile') }
];

async function downloadImage(item) {
    const url = `https://image.pollinations.ai/prompt/${item.p}?width=800&height=800&seed=42&nologo=true`;
    const dest = path.join(ASSETS_DIR, `${item.id}.png`);
    
    return new Promise((resolve, reject) => {
        let retries = 0;
        const attempt = () => {
            https.get(url, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    https.get(res.headers.location, attemptDownload);
                    return;
                }
                attemptDownload(res);
            }).on('error', (err) => reject(err));
        };

        const attemptDownload = (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Generated successfully: ${item.id}.png`);
                resolve();
            });
            file.on('error', (err) => {
                fs.unlink(dest, () => reject(err));
            });
        };
        attempt();
    });
}

function extractTimeRemaining(index, total) {
    const rm = total - index;
    const mins = Math.floor((rm * 30) / 60);
    return mins;
}

async function runGenerations() {
    console.log(`Starting NO-GYM Coherent Image Engine. Total images: ${imagesToGenerate.length}`);
    for(let i = 0; i < imagesToGenerate.length; i++) {
        const img = imagesToGenerate[i];
        console.log(`[${i+1}/${imagesToGenerate.length}] Descargando ${img.id}... (Tiempo restante estimado: ${extractTimeRemaining(i, imagesToGenerate.length)} minutos)`);
        try {
            await downloadImage(img);
        } catch(e) {
            console.log(`Error on ${img.id}:`, e.message);
            // Wait 60 extra seconds maliciously for 429 errors
            if (e.message.includes('429')) {
                console.log('429 Hit. Enfriando la API por 60 segundos extra...');
                await new Promise(r => setTimeout(r, 60000));
            }
        }
        // 30 Seconds explicit cooldown to avoid API limits gracefully
        await new Promise(r => setTimeout(r, 30000));
    }
    console.log("All finished. Sleep well :)");
}

runGenerations();
