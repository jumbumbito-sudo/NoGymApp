const https = require('https');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR);
}

// ESTILO ORIGINAL MUJER (Sólido Turquesa)
const STYLE_F = "Modern professional 2D fitness illustration, flat cyan-turquoise #00e5ff human silhouette, clean sharp white contour outline, solid dark navy blue #0a192f background. Fitbit health app icon style. masterpiece, perfect anatomical proportions, clean vector art, high-end clinical design.";

// NUEVO ESTILO HOMBRE (Solo Trazos Neón)
const STYLE_M = "Modern professional 2D fitness illustration, hollow glowing cyan outline only, no fill, empty body interior, solid dark navy blue #0a192f background. Fitbit health app icon style. masterpiece, perfect anatomical proportions, clean vector art, high-end clinical design.";

function getPrompt(genderStr, excerciseStr, seed, useSide = false) {
    const isFemale = genderStr.includes('woman') || genderStr.includes('female');
    const base = isFemale ? STYLE_F : STYLE_M;
    const view = useSide ? "SIDE PROFILE VIEW." : "EXACT FRONT VIEW FACING FORWARD.";
    return encodeURIComponent(`${base} ${view} A clean 2D vector ${genderStr} in athletic pose: ${excerciseStr}. high contrast, sharp focus, masterpiece, medical accuracy, flat color, seed ${seed}`);
}

const imagesToGenerate = [
    // --- REGENERACIÓN MUJER (Recuperando el estilo original) ---
    { id: 'img_f_warm_head1', p: getPrompt('woman', 'standing perfectly still, looking straight forward at camera', 901) },
    { id: 'img_f_warm_head2', p: getPrompt('woman', 'standing, head rotated fully 90 degrees to face side', 902) },
    { id: 'img_f_warm_arms1', p: getPrompt('woman', 'standing, arms hanging straight down at sides', 903) },
    { id: 'img_f_warm_arms2', p: getPrompt('woman', 'standing, both arms raised straight up above head', 904) },
    { id: 'img_f_warm_torso1', p: getPrompt('woman', 'standing, feet fixed forward, upper torso twisted 45 degrees to the side', 905) },
    { id: 'img_f_warm_torso2', p: getPrompt('woman', 'standing, feet fixed forward, upper torso twisted 45 degrees to the other side', 906) },
    { id: 'img_f_warm_legs1', p: getPrompt('woman', 'standing, lifting one knee up to 90 degrees in front', 907) },
    { id: 'img_f_warm_legs2', p: getPrompt('woman', 'standing, lifting other knee up to 90 degrees in front', 908) },
    { id: 'img_f_jacks1', p: getPrompt('woman', 'standing, feet together, arms at sides', 909) },
    { id: 'img_f_jacks2', p: getPrompt('woman', 'jumping, feet apart, arms up in X shape', 910) },
    { id: 'img_f_plank1', p: getPrompt('woman', 'horizontal forearm plank on floor, straight line, side view', 911, true) },
    { id: 'img_f_plank2', p: getPrompt('woman', 'horizontal forearm plank on floor, straight line, side view', 912, true) },
    { id: 'img_f_pushups1', p: getPrompt('woman', 'leaning against a wall at 45 degree angle, arms straight, palms flat on wall, side view', 913, true) },
    { id: 'img_f_pushups2', p: getPrompt('woman', 'leaning against a wall at 45 degree angle, arms bent at elbows, chest touching wall, side view', 914, true) },
    { id: 'img_f_weights1', p: getPrompt('woman', 'standing, holding dumbbells, curling arms up to shoulders', 915) },
    { id: 'img_f_weights2', p: getPrompt('woman', 'standing, holding dumbbells, performing a deep squat', 916) },
    { id: 'img_f_chair1', p: getPrompt('woman', 'standing in front of a chair, side view', 917, true) },
    { id: 'img_f_chair2', p: getPrompt('woman', 'sitting fully on a chair, back straight, side view', 918, true) },
    { id: 'img_f_treadmill1', p: getPrompt('woman', 'walking, left leg stepping forward, side view', 919, true) },
    { id: 'img_f_treadmill2', p: getPrompt('woman', 'walking, right leg stepping forward, side view', 920, true) },
    { id: 'img_f_bike1', p: getPrompt('woman', 'sitting on a bike, pedaling with one knee up, side view', 921, true) },
    { id: 'img_f_bike2', p: getPrompt('woman', 'sitting on a bike, pedaling with other knee up, side view', 922, true) },
    { id: 'img_f_stretch1', p: getPrompt('woman', 'standing, reaching hands up to sky', 923) },
    { id: 'img_f_stretch2', p: getPrompt('woman', 'standing, bending down to touch toes with hands', 924, true) },
    { id: 'img_f_escoba1', p: getPrompt('woman', 'standing, holding a long stick behind her neck, facing camera', 925) },
    { id: 'img_f_escoba2', p: getPrompt('woman', 'standing, rotating torso while holding stick, side view', 926, true) },
    { id: 'img_f_backpack1', p: getPrompt('woman', 'standing wearing a backpack, side view', 927, true) },
    { id: 'img_f_backpack2', p: getPrompt('woman', 'squatting with a backpack, side view', 928, true) },
    { id: 'img_f_backpack_row1', p: getPrompt('woman', 'bent over, holding backpack by handle hanging down, side view', 929, true) },
    { id: 'img_f_backpack_row2', p: getPrompt('woman', 'bent over, pulling backpack up to chest in a row, side view', 930, true) },
    { id: 'img_f_stairs1', p: getPrompt('woman', 'stepping up onto a block step, side view', 931, true) },
    { id: 'img_f_stairs2', p: getPrompt('woman', 'standing on top of a step, side view', 932, true) },
    { id: 'img_f_bands1', p: getPrompt('woman', 'pulling resistance bands apart horizontally, facing camera', 933) },
    { id: 'img_f_bands2', p: getPrompt('woman', 'pulling bands upwards to shoulders, facing camera', 934) },
    { id: 'img_f_gero_warm1', p: getPrompt('elderly woman', 'sitting on a chair facing forward, shoulder circles', 935) },
    { id: 'img_f_gero_warm2', p: getPrompt('elderly woman', 'sitting on a chair facing forward, neck tilt', 936) },
    { id: 'img_f_gero_legs1', p: getPrompt('elderly woman', 'sitting facing forward, marching feet', 937) },
    { id: 'img_f_gero_legs2', p: getPrompt('elderly woman', 'sitting, straightening one leg out forward parallel to floor, side view', 938, true) },
    { id: 'img_f_gero_sitstand1', p: getPrompt('elderly woman', 'sitting on the edge of a chair, side view', 939, true) },
    { id: 'img_f_gero_sitstand2', p: getPrompt('elderly woman', 'standing up fully from chair, side view', 940, true) },
    { id: 'img_f_gero_balance1', p: getPrompt('elderly woman', 'standing, holding chair back for support, side view', 941, true) },
    { id: 'img_f_gero_balance2', p: getPrompt('elderly woman', 'standing on one leg with chair support, side view', 942, true) },
    { id: 'img_f_gero_stretch1', p: getPrompt('elderly woman', 'sitting, leaning down reaching for ankles, side view', 943, true) },
    { id: 'img_f_gero_stretch2', p: getPrompt('elderly woman', 'sitting facing forward, stretching shoulder arm across chest', 944) },

    // --- CONTINUACIÓN HOMBRE (Solo Trazos Neón - Si ya están bien, el script las salta) ---
    { id: 'img_m_warm_head1', p: getPrompt('man', 'standing perfectly still, looking straight forward at camera', 1001) },
    { id: 'img_m_warm_head2', p: getPrompt('man', 'standing, head rotated fully 90 degrees to face side', 1002) },
    { id: 'img_m_warm_arms1', p: getPrompt('man', 'standing, arms hanging straight down at sides', 1003) },
    { id: 'img_m_warm_arms2', p: getPrompt('man', 'standing, both arms raised straight up above head', 1004) },
    { id: 'img_m_warm_torso1', p: getPrompt('man', 'standing, feet fixed forward, upper torso twisted 45 degrees to side', 1005) },
    { id: 'img_m_warm_torso2', p: getPrompt('man', 'standing, feet fixed forward, upper torso twisted 45 degrees to other side', 1006) },
    { id: 'img_m_warm_legs1', p: getPrompt('man', 'standing, lifting one knee up to 90 degrees in front', 1007) },
    { id: 'img_m_warm_legs2', p: getPrompt('man', 'standing, lifting other knee up to 90 degrees in front', 1008) },
    { id: 'img_m_jacks1', p: getPrompt('man', 'standing, feet together, arms at sides', 1009) },
    { id: 'img_m_jacks2', p: getPrompt('man', 'jumping, feet apart, arms up in X shape', 1010) },
    { id: 'img_m_plank1', p: getPrompt('man', 'horizontal forearm plank on floor, side view', 1011, true) },
    { id: 'img_m_plank2', p: getPrompt('man', 'horizontal forearm plank on floor, side view', 1012, true) },
    { id: 'img_m_pushups1', p: getPrompt('man', 'leaning against a wall at 45 degree angle, arms straight, palms flat on wall, side view', 1013, true) },
    { id: 'img_m_pushups2', p: getPrompt('man', 'leaning against a wall at 45 degree angle, arms bent at elbows, side view', 1014, true) },
    { id: 'img_m_weights1', p: getPrompt('man', 'standing, holding dumbbells, curling arms', 1015) },
    { id: 'img_m_weights2', p: getPrompt('man', 'performing a deep squat, holding weights', 1016) },
    { id: 'img_m_chair1', p: getPrompt('man', 'standing in front of a chair, side view', 1017, true) },
    { id: 'img_m_chair2', p: getPrompt('man', 'sitting on a chair, side view', 1018, true) },
    { id: 'img_m_treadmill1', p: getPrompt('man', 'walking, side view', 1019, true) },
    { id: 'img_m_treadmill2', p: getPrompt('man', 'walking, side view', 1020, true) },
    { id: 'img_m_bike1', p: getPrompt('man', 'cycling, side view', 1021, true) },
    { id: 'img_m_bike2', p: getPrompt('man', 'cycling, side view', 1022, true) },
    { id: 'img_m_stretch1', p: getPrompt('man', 'stretching arms up', 1023) },
    { id: 'img_m_stretch2', p: getPrompt('man', 'touching toes, side view', 1024, true) },
    { id: 'img_m_escoba1', p: getPrompt('man', 'holding stick behind neck facing camera', 1025) },
    { id: 'img_m_escoba2', p: getPrompt('man', 'rotating torso holding stick, side view', 1026, true) },
    { id: 'img_m_backpack1', p: getPrompt('man', 'wearing backpack, side view', 1027, true) },
    { id: 'img_m_backpack2', p: getPrompt('man', 'squatting with backpack, side view', 1028, true) },
    { id: 'img_m_backpack_row1', p: getPrompt('man', 'rowing backpack, side view', 1029, true) },
    { id: 'img_m_backpack_row2', p: getPrompt('man', 'rowing backpack, side view', 1030, true) },
    { id: 'img_m_stairs1', p: getPrompt('man', 'stepping up block, side view', 1031, true) },
    { id: 'img_m_stairs2', p: getPrompt('man', 'standing on step, side view', 1032, true) },
    { id: 'img_m_bands1', p: getPrompt('man', 'pulling band facing camera', 1033) },
    { id: 'img_m_bands2', p: getPrompt('man', 'curling band facing camera', 1034) },
    { id: 'img_m_gero_warm1', p: getPrompt('elderly man', 'sitting on chair facing forward, shoulder circles', 1035) },
    { id: 'img_m_gero_warm2', p: getPrompt('elderly man', 'sitting on chair facing forward, neck tilt', 1036) },
    { id: 'img_m_gero_legs1', p: getPrompt('elderly man', 'sitting facing forward, marching feet', 1037) },
    { id: 'img_m_gero_legs2', p: getPrompt('elderly man', 'sitting straightening leg forward, side view', 1038, true) },
    { id: 'img_m_gero_sitstand1', p: getPrompt('elderly man', 'sitting on chair, side view', 1039, true) },
    { id: 'img_m_gero_sitstand2', p: getPrompt('elderly man', 'standing up side view', 1040, true) },
    { id: 'img_m_gero_balance1', p: getPrompt('elderly man', 'holding chair side view', 1041, true) },
    { id: 'img_m_gero_balance2', p: getPrompt('elderly man', 'standing one leg side view', 1042, true) },
    { id: 'img_m_gero_stretch1', p: getPrompt('elderly man', 'sitting stretching to feet side view', 1043, true) },
    { id: 'img_m_gero_stretch2', p: getPrompt('elderly man', 'sitting stretching shoulder facing forward', 1044) }
];

async function downloadImage(item) {
    const url = `https://image.pollinations.ai/prompt/${item.p}?width=800&height=800&nologo=true`;
    const dest = path.join(ASSETS_DIR, `${item.id}.png`);
    
    // SKIP IF ALREADY EXISTS (Para las de hombre ya bien hechas)
    // Pero forzaremos las de mujer primero borrándolas si queremos estar seguros
    if (fs.existsSync(dest) && item.id.startsWith('img_m_')) {
        console.log(`Skipping existing: ${item.id}.png`);
        return;
    }

    return new Promise((resolve, reject) => {
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
                reject(new Error(`Failed download: ${res.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Vector Match: ${item.id}.png`);
                resolve();
            });
            file.on('error', (err) => {
                fs.unlink(dest, () => reject(err));
            });
        };
        attempt();
    });
}

async function runGenerations() {
    console.log(`MODO RECUPERACIÓN ACTIVADO. Total: ${imagesToGenerate.length}`);
    for(let i = 0; i < imagesToGenerate.length; i++) {
        const img = imagesToGenerate[i];
        console.log(`[${i+1}/${imagesToGenerate.length}] Analizando ${img.id}...`);
        try {
            await downloadImage(img);
        } catch(e) {
            console.log(`Error ${img.id}:`, e.message);
            if (e.message.includes('429')) {
                console.log('API Limit. Cooling 120s...');
                await new Promise(r => setTimeout(r, 120000));
            }
        }
        await new Promise(r => setTimeout(r, 45000));
    }
    console.log("RESTAURACIÓN COMPLETADA.");
}

runGenerations();
