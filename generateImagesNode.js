const https = require('https');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets', 'v2');

if (!fs.existsSync(path.join(__dirname, 'assets'))) {
    fs.mkdirSync(path.join(__dirname, 'assets'));
}
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
    { id: 'img_f_warm_head1', p: getPrompt('woman', 'standing straight, head tilted forward, side profile') },
    { id: 'img_f_warm_head2', p: getPrompt('woman', 'standing straight, head tilted backward, side profile') },
    { id: 'img_f_warm_arms1', p: getPrompt('woman', 'standing straight, rotating both arms in large circles, side profile') },
    { id: 'img_f_warm_arms2', p: getPrompt('woman', 'standing straight, arms extended horizontally, side profile') },
    { id: 'img_f_warm_torso1', p: getPrompt('woman', 'standing straight, twisting torso to the right, side profile') },
    { id: 'img_f_warm_torso2', p: getPrompt('woman', 'standing straight, twisting torso to the left, side profile') },
    { id: 'img_f_warm_legs1', p: getPrompt('woman', 'standing straight, lifting one knee high, side profile') },
    { id: 'img_f_warm_legs2', p: getPrompt('woman', 'standing straight, lifting other knee high, side profile') },
    
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
    { id: 'img_f_backpack1', p: getPrompt('woman', 'standing straight wearing a heavy backpack, side profile') },
    { id: 'img_f_backpack2', p: getPrompt('woman', 'doing a deep squat wearing a heavy backpack, side profile') },
    { id: 'img_f_backpack_row1', p: getPrompt('woman', 'bending forward holding a backpack by the top handle, arms extended down, side profile') },
    { id: 'img_f_backpack_row2', p: getPrompt('woman', 'bending forward pulling a backpack to her chest, one arm row, side profile') },
    { id: 'img_f_stairs1', p: getPrompt('woman', 'stepping up onto a square platform (stair step), right foot up, side profile') },
    { id: 'img_f_stairs2', p: getPrompt('woman', 'stepping up onto a square platform (stair step), left foot up, balanced posture, side profile') },
    { id: 'img_f_bands1', p: getPrompt('woman', 'standing straight pulling an elastic resistance band outwards with both hands, side profile') },
    { id: 'img_f_bands2', p: getPrompt('woman', 'standing straight pulling an elastic resistance band upwards to her chest, side profile') },
    { id: 'img_f_gero_warm1', p: getPrompt('elderly woman', 'sitting on a chair, rotating her shoulders gently, side profile') },
    { id: 'img_f_gero_warm2', p: getPrompt('elderly woman', 'sitting on a chair, tilted neck stretch, side profile') },
    { id: 'img_f_gero_legs1', p: getPrompt('elderly woman', 'sitting on a chair, feet flat on floor, side profile') },
    { id: 'img_f_gero_legs2', p: getPrompt('elderly woman', 'sitting on a chair, one leg extended fully forward, side profile') },
    { id: 'img_f_gero_sitstand1', p: getPrompt('elderly woman', 'sitting on the edge of a chair, arms crossed on chest, side profile') },
    { id: 'img_f_gero_sitstand2', p: getPrompt('elderly woman', 'halfway standing up from a chair, side profile') },
    { id: 'img_f_gero_balance1', p: getPrompt('elderly woman', 'standing straight holding a chair back for support, side profile') },
    { id: 'img_f_gero_balance2', p: getPrompt('elderly woman', 'standing on one leg while holding a chair back, side profile') },
    { id: 'img_f_gero_stretch1', p: getPrompt('elderly woman', 'sitting on a chair, leaning back with hands on lower back, side profile') },
    { id: 'img_f_gero_stretch2', p: getPrompt('elderly woman', 'sitting on a chair, reaching one arm across chest, side profile') },

    // --- MALE (Hombre) ---
    { id: 'img_m_warm_head1', p: getPrompt('man', 'standing straight, head tilted forward, side profile') },
    { id: 'img_m_warm_head2', p: getPrompt('man', 'standing straight, head tilted backward, side profile') },
    { id: 'img_m_warm_arms1', p: getPrompt('man', 'standing straight, rotating both arms in large circles, side profile') },
    { id: 'img_m_warm_arms2', p: getPrompt('man', 'standing straight, arms extended horizontally, side profile') },
    { id: 'img_m_warm_torso1', p: getPrompt('man', 'standing straight, twisting torso to the right, side profile') },
    { id: 'img_m_warm_torso2', p: getPrompt('man', 'standing straight, twisting torso to the left, side profile') },
    { id: 'img_m_warm_legs1', p: getPrompt('man', 'standing straight, lifting one knee high, side profile') },
    { id: 'img_m_warm_legs2', p: getPrompt('man', 'standing straight, lifting other knee high, side profile') },
    
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
    { id: 'img_m_warm_legs1', p: getPrompt('man', 'standing straight touching knees gently, side profile') },
    { id: 'img_m_warm_legs2', p: getPrompt('man', 'bending down touching the toes, flexibility stretch, side profile') },
    
    // Novedades Hombre
    { id: 'img_m_escoba1', p: getPrompt('man', 'standing straight holding a broomstick horizontally behind neck, side profile') },
    { id: 'img_m_escoba2', p: getPrompt('man', 'twisting torso holding a broomstick horizontally behind neck, side profile') },
    { id: 'img_m_backpack1', p: getPrompt('man', 'standing straight wearing a heavy backpack, side profile') },
    { id: 'img_m_backpack2', p: getPrompt('man', 'doing a deep squat wearing a heavy backpack, side profile') },
    { id: 'img_m_backpack_row1', p: getPrompt('man', 'bending forward holding a backpack by the top handle, arms extended down, side profile') },
    { id: 'img_m_backpack_row2', p: getPrompt('man', 'bending forward pulling a backpack to his chest, one arm row, side profile') },
    { id: 'img_m_stairs1', p: getPrompt('man', 'stepping up onto a square platform (stair step), right foot up, side profile') },
    { id: 'img_m_stairs2', p: getPrompt('man', 'stepping up onto a square platform (stair step), left foot up, balanced posture, side profile') },
    { id: 'img_m_bands1', p: getPrompt('man', 'standing straight pulling an elastic resistance band outwards with both hands, side profile') },
    { id: 'img_m_bands2', p: getPrompt('man', 'standing straight pulling an elastic resistance band upwards to his chest, side profile') },
    { id: 'img_m_gero_warm1', p: getPrompt('elderly man', 'sitting on a chair, rotating his shoulders gently, side profile') },
    { id: 'img_m_gero_warm2', p: getPrompt('elderly man', 'sitting on a chair, tilted neck stretch, side profile') },
    { id: 'img_m_gero_legs1', p: getPrompt('elderly man', 'sitting on a chair, feet flat on floor, side profile') },
    { id: 'img_m_gero_legs2', p: getPrompt('elderly man', 'sitting on a chair, one leg extended fully forward, side profile') },
    { id: 'img_m_gero_sitstand1', p: getPrompt('elderly man', 'sitting on the edge of a chair, arms crossed on chest, side profile') },
    { id: 'img_m_gero_sitstand2', p: getPrompt('elderly man', 'halfway standing up from a chair, side profile') },
    { id: 'img_m_gero_balance1', p: getPrompt('elderly man', 'standing straight holding a chair back for support, side profile') },
    { id: 'img_m_gero_balance2', p: getPrompt('elderly man', 'standing on one leg while holding a chair back, side profile') },
    { id: 'img_m_gero_stretch1', p: getPrompt('elderly man', 'sitting on a chair, leaning back with hands on lower back, side profile') },
    { id: 'img_m_gero_stretch2', p: getPrompt('elderly man', 'sitting on a chair, reaching one arm across chest, side profile') }
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
