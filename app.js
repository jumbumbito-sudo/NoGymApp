document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const mainHeader = document.getElementById('main-header');
    
    // Sections
    const formSection = document.getElementById('form-section');
    const loadingSection = document.getElementById('loading-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const playerSection = document.getElementById('player-section');
    const completionSection = document.getElementById('completion-section');
    const profileSection = document.getElementById('profile-section');
    const communitySection = document.getElementById('community-section');
    const statisticsSection = document.getElementById('statistics-section');

    // Form
    const form = document.getElementById('workout-form');

    // Dashboard
    const dayTitle = document.getElementById('current-day-title');
    const exercisesList = document.getElementById('daily-exercise-list');
    const startWorkoutBtn = document.getElementById('start-workout-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Player
    const closePlayerBtn = document.getElementById('close-player-btn');
    const playerProgress = document.getElementById('player-progress');
    const frame1 = document.getElementById('visual-frame-1');
    const frame2 = document.getElementById('visual-frame-2');
    const exName = document.getElementById('exercise-name');
    const exDesc = document.getElementById('exercise-desc');
    const exTimerDisplay = document.getElementById('exercise-timer');
    const timerToggleBtn = document.getElementById('timer-toggle-btn');
    const timerSkipBtn = document.getElementById('timer-skip-btn');

    // Completion
    const completeDayBtn = document.getElementById('complete-day-btn');

    // Profile Elements
    const headerProfileBtn = document.getElementById('header-profile-btn');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const uploadPhoto = document.getElementById('upload-photo');
    const signupUploadPhoto = document.getElementById('signup-upload-photo');
    const mainProfileImg = document.getElementById('main-profile-img');
    const signupProfileImg = document.getElementById('signup-profile-img');
    const navAvatar = document.getElementById('nav-avatar');

    // Community Elements
    const headerCommunityBtn = document.getElementById('header-community-btn');
    const closeCommunityBtn = document.getElementById('close-community-btn');
    const postMsgBtn = document.getElementById('post-msg-btn');
    const communityMsg = document.getElementById('community-msg');
    const communityFeed = document.getElementById('community-feed');

    // Statistics Elements
    const headerStatsBtn = document.getElementById('header-stats-btn');
    const closeStatsBtn = document.getElementById('close-stats-btn');

    // State Variables
    let currentDay = 1;
    let currentRoutine = [];
    let activeExerciseIndex = 0;
    
    // Timer & Animation Variables
    let currentRemainingTime = 0; // seconds
    let timerInterval = null;
    let animationInterval = null;
    let isTimerRunning = false;

    // Form Variables to keep globally for Nutrition Plan
    let userProfile = {};
    let globalEquip = [];
    let globalHealth = [];

    function saveData() {
        const data = {
            userProfile,
            currentDay,
            globalEquip,
            globalHealth
        };
        localStorage.setItem('nogym_data', JSON.stringify(data));
    }

    function loadData() {
        const saved = localStorage.getItem('nogym_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data && data.userProfile && data.userProfile.name) {
                    userProfile = data.userProfile;
                    currentDay = data.currentDay || 1;
                    globalEquip = data.globalEquip || [];
                    globalHealth = data.globalHealth || [];

                    dayTitle.textContent = `Día ${currentDay}: Progreso Activo`;
                    populateProfileView(globalHealth); 
                    currentRoutine = generateDailyRoutine(userProfile.lvl, globalEquip, userProfile.gender, globalHealth);
                    renderDashboard();

                    // Pre-fill form just in case they edit profile
                    document.getElementById('fullname').value = userProfile.name;
                    document.getElementById('gender').value = userProfile.gender;
                    document.getElementById('age').value = userProfile.age;
                    document.getElementById('height').value = userProfile.height;
                    document.getElementById('weight').value = userProfile.weight;
                    document.getElementById('fitness-level').value = userProfile.lvl;
                    document.getElementById('lifestyle').value = userProfile.lifestyle;
                    document.getElementById('time').value = userProfile.time;
                    
                    formSection.classList.remove('active');
                    formSection.classList.add('hidden');
                    headerProfileBtn.classList.remove('hidden');
                    headerCommunityBtn.classList.remove('hidden');
                    headerStatsBtn.classList.remove('hidden');
                    mainHeader.classList.remove('hidden');
                    dashboardSection.classList.remove('hidden');
                    setTimeout(() => dashboardSection.classList.add('active'), 50);
                }
            } catch(e) {
                console.error("Error al cargar localStorage", e);
            }
        }
    }

    // --- FORM SUBMISSION ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        globalEquip = formData.getAll('equip'); 
        globalHealth = formData.getAll('health');

        userProfile = {
            name: document.getElementById('fullname').value,
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            lvl: document.getElementById('fitness-level').value,
            lifestyle: document.getElementById('lifestyle').value,
            time: parseInt(document.getElementById('time').value) || 15,
            bodyType: formData.get('body-type')
        };

        if(!userProfile.bodyType) {
            alert("Por favor selecciona tu contextura física.");
            return;
        }

        switchView(formSection, loadingSection);
        
        // Simular IA Processing y Llenar Perfil
        populateProfileView(globalHealth);
        setTimeout(() => {
            currentRoutine = generateDailyRoutine(userProfile.lvl, globalEquip, userProfile.gender, globalHealth);
            renderDashboard();
            headerProfileBtn.classList.remove('hidden'); // show avatar
            headerCommunityBtn.classList.remove('hidden'); // show community button
            headerStatsBtn.classList.remove('hidden'); // show stats button
            saveData(); // Guardar progreso incial
            switchView(loadingSection, dashboardSection);
        }, 2000);
    });

    // --- PROFILE LOGIC ---
    headerProfileBtn.addEventListener('click', () => {
        // En que seccion estabamos? (puede que en dashboard o logrando algo)
        // Para simplificar, asumimos que viene del dashboard.
        switchView(document.querySelector('section.active'), profileSection);
    });

    closeProfileBtn.addEventListener('click', () => {
        switchView(profileSection, dashboardSection);
    });

    editProfileBtn.addEventListener('click', () => {
        headerProfileBtn.classList.add('hidden');
        switchView(profileSection, formSection);
    });

    // Image Upload
    function handleImageUpload(file) {
        if(file) {
            const tempUrl = URL.createObjectURL(file);
            mainProfileImg.src = tempUrl;
            signupProfileImg.src = tempUrl;
            navAvatar.src = tempUrl;
        }
    }
    uploadPhoto.addEventListener('change', (e) => handleImageUpload(e.target.files[0]));
    signupUploadPhoto.addEventListener('change', (e) => handleImageUpload(e.target.files[0]));

    // --- COMMUNITY LOGIC ---
    headerCommunityBtn.addEventListener('click', () => {
        switchView(document.querySelector('section.active'), communitySection);
    });

    closeCommunityBtn.addEventListener('click', () => {
        switchView(communitySection, dashboardSection);
    });

    postMsgBtn.addEventListener('click', () => {
        const text = communityMsg.value.trim();
        if(!text) return;

        const post = document.createElement('div');
        post.className = 'post-card';
        const initial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
        const uName = userProfile.name || 'Usuario';
        
        post.innerHTML = `
            <div class="post-header">
                ${navAvatar.src.startsWith('http') ? `<span class="mock-avatar">${initial}</span>` : `<img src="${navAvatar.src}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;">`}
                <div>
                    <strong>${uName}</strong>
                    <small>Ahora mismo</small>
                </div>
            </div>
            <p>${text}</p>
        `;
        
        communityFeed.prepend(post);
        communityMsg.value = '';
    });

    // --- STATISTICS LOGIC ---
    headerStatsBtn.addEventListener('click', () => {
        switchView(document.querySelector('section.active'), statisticsSection);
    });

    closeStatsBtn.addEventListener('click', () => {
        switchView(statisticsSection, dashboardSection);
    });

    function populateProfileView(healthArr) {
        document.getElementById('profile-name').textContent = userProfile.name;
        
        // Actualizar el Avatar por Defecto para que muestre sus Iniciales si no ha subido foto
        const cleanName = encodeURIComponent(userProfile.name);
        const autoAvatar = `https://ui-avatars.com/api/?name=${cleanName}&background=0a192f&color=00e5ff`;
        
        // Solo cambiamos al de letras si no subió ya una foto manualizada
        if (!mainProfileImg.src.startsWith('blob:')) {
            mainProfileImg.src = autoAvatar;
            navAvatar.src = autoAvatar;
        }

        document.getElementById('p-weight').textContent = userProfile.weight + 'kg';
        document.getElementById('p-height').textContent = userProfile.height + 'cm';
        document.getElementById('p-age').textContent = userProfile.age;
        document.getElementById('p-lvl').textContent = userProfile.lvl.charAt(0).toUpperCase() + userProfile.lvl.slice(1);
        document.getElementById('p-body').textContent = userProfile.bodyType.charAt(0).toUpperCase() + userProfile.bodyType.slice(1);
        
        const hList = healthArr.length > 0 ? healthArr.join(', ') : 'Ninguna (Saludable)';
        document.getElementById('p-health').textContent = hList.charAt(0).toUpperCase() + hList.slice(1);

        // Calculate IMC (BMI)
        const w = parseFloat(userProfile.weight);
        const h = parseFloat(userProfile.height) / 100;
        const imc = (w / (h * h)).toFixed(1);
        
        let imcLabel = '';
        if(imc < 18.5) imcLabel = '(Bajo)';
        else if(imc < 25) imcLabel = '(Óptimo)';
        else if(imc < 30) imcLabel = '(Sobrepeso)';
        else imcLabel = '(Obesidad)';
        
        document.getElementById('profile-imc').textContent = `Tu IMC: ${imc} ${imcLabel}`;
    }

    resetBtn.addEventListener('click', () => {
        switchView(dashboardSection, formSection);
    });

    // --- WORKOUT LOGIC ---
    startWorkoutBtn.addEventListener('click', () => {
        activeExerciseIndex = 0;
        mainHeader.classList.add('hidden'); // Hide header during workout
        loadExerciseIntoPlayer();
        switchView(dashboardSection, playerSection);
    });

    closePlayerBtn.addEventListener('click', () => {
        pauseTimer();
        stopAnimation();
        mainHeader.classList.remove('hidden');
        switchView(playerSection, dashboardSection);
    });

    // --- PLAYER LOGIC ---
    function loadExerciseIntoPlayer() {
        const ex = currentRoutine[activeExerciseIndex];
        
        playerProgress.textContent = `Ejercicio ${activeExerciseIndex + 1} de ${currentRoutine.length}`;
        exName.textContent = ex.name;
        exDesc.textContent = ex.tip;
        
        // Setup Images (Start and End frames)
        frame1.src = ex.frames[0];
        frame2.src = ex.frames[1];
        
        // Reset classes
        frame1.classList.add('active');
        frame2.classList.remove('active');
        
        // Start animation toggle
        startAnimation();

        // Reset timer
        pauseTimer();
        currentRemainingTime = ex.duration;
        updateTimerDisplay();
        
        timerToggleBtn.textContent = 'Comenzar';
        timerToggleBtn.style.background = 'linear-gradient(135deg, var(--turquoise), var(--dark-turquoise))';
        timerToggleBtn.style.color = '#000';
        timerToggleBtn.style.border = 'none';
    }

    function startAnimation() {
        stopAnimation(); // clear any previous
        let showFrame1 = true;
        animationInterval = setInterval(() => {
            if(showFrame1) {
                frame1.classList.remove('active');
                frame2.classList.add('active');
            } else {
                frame2.classList.remove('active');
                frame1.classList.add('active');
            }
            showFrame1 = !showFrame1;
        }, 2000); // 2000ms duration for each movement phase
    }

    function stopAnimation() {
        if(animationInterval) clearInterval(animationInterval);
    }

    timerToggleBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    timerSkipBtn.addEventListener('click', () => {
        nextExercise();
    });

    function startTimer() {
        if (currentRemainingTime <= 0) return;
        
        isTimerRunning = true;
        timerToggleBtn.textContent = 'Pausar';
        timerToggleBtn.style.background = 'transparent';
        timerToggleBtn.style.border = '1px solid var(--error)';
        timerToggleBtn.style.color = 'var(--error)';

        timerInterval = setInterval(() => {
            currentRemainingTime--;
            updateTimerDisplay();

            if (currentRemainingTime <= 0) {
                pauseTimer();
                setTimeout(nextExercise, 1000);
            }
        }, 1000);
    }

    function pauseTimer() {
        isTimerRunning = false;
        clearInterval(timerInterval);
        if (currentRemainingTime > 0) {
            timerToggleBtn.textContent = 'Reanudar';
            timerToggleBtn.style.background = 'linear-gradient(135deg, var(--turquoise), var(--dark-turquoise))';
            timerToggleBtn.style.color = '#000';
            timerToggleBtn.style.border = 'none';
        }
    }

    function updateTimerDisplay() {
        const m = Math.floor(currentRemainingTime / 60).toString().padStart(2, '0');
        const s = (currentRemainingTime % 60).toString().padStart(2, '0');
        exTimerDisplay.textContent = `${m}:${s}`;
        
        const ex = currentRoutine[activeExerciseIndex];
        const progressFill = document.getElementById('exercise-progress-fill');
        if (progressFill && ex) {
            const percentage = ((ex.duration - currentRemainingTime) / ex.duration) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    function nextExercise() {
        pauseTimer();
        stopAnimation();
        if (activeExerciseIndex < currentRoutine.length - 1) {
            activeExerciseIndex++;
            loadExerciseIntoPlayer();
        } else {
            finishWorkout();
        }
    }

    function finishWorkout() {
        generateNutritionPlan();
        switchView(playerSection, completionSection);
    }

    function generateNutritionPlan() {
        const textEl = document.getElementById('nutrition-text');
        
        let baseStrategy = "";
        if (userProfile.bodyType === "delgado") {
            baseStrategy = "<strong>Objetivo: Ganar Masa Muscular (Superávit Calórico).</strong><br>Necesitas comer raciones un poco más grandes. Aumenta tus <em>carbohidratos complejos</em> (avena, papa, arroz integral) y consume mucha <em>proteína</em> (huevos, pollo, carnes) para nutrir esos músculos nuevos.";
        } else if (userProfile.bodyType === "robusto") {
            baseStrategy = "<strong>Objetivo: Pérdida de Grasa (Déficit Calórico).</strong><br>Tus porciones deben privilegiar <em>vegetales fibrosos</em> para llenarte rápido (brócoli, espinacas) y proteína magra (pechuga, pescados). Controla y reduce el azúcar de mesa y las harinas refinadas al mínimo.";
        } else {
            baseStrategy = "<strong>Objetivo: Recomposición Corporal.</strong><br>Mantendrás tus músculos mientras bajas porcentaje de grasa. Equilibra tu plato: 50% vegetales, 25% proteína y solo un 25% de carbohidratos (como arroz, papa o pan integral).";
        }

        const formData = new FormData(form);
        const healthSelected = formData.getAll('health');
        
        let healthTips = "";
        if (healthSelected.includes('diabetes')) {
            healthTips += "<br><span style='color: #FFB300;'>⚠️ Por diabetes:</span> Elimina carbohidratos simples (pan blanco, dulces, jugos). Prioriza fibras para no causar picos de insulina.";
        }
        if (healthSelected.includes('hipertension')) {
            healthTips += "<br><span style='color: #FFB300;'>⚠️ Por hipertensión:</span> Cuida los embutidos y alimentos ultraprocesados por su alto nivel de sodio (sal). Aumenta tu potasio natural (plátano verde, tomates, aguacate).";
        }
        if (healthSelected.includes('articulaciones')) {
            healthTips += "<br><span style='color: #FFB300;'>⚠️ Cuidado Articular:</span> Incrementa el consumo de omega-3 (sardinas, atún, nueces) para reducir la inflamación articular, y un buen suplemento de colágeno o vitamina C.";
        }

        // --- WEEKEND PLAN ---
        let wPlan = "<br><br><div style='padding-top:10px; border-top:1px solid rgba(255,255,255,0.2);'><h4 style='color:var(--turquoise); margin-bottom:5px;'>🌲 Plan de Fin de Semana Recomendado</h4><p style='font-size:0.9rem; line-height:1.4;'>";
        
        if (userProfile.lifestyle === 'sedentario') {
            wPlan += "Como pasas más de 8 horas sentado al día, te receto urgentemente <strong>Grounding (Conexión a tierra)</strong>: Quítate los zapatos en un parque o jardín y camina sobre la hierba o tierra por al menos 20 minutos mientras tomas el Sol de la mañana. Esto descarga tensiones nerviosas y reactiva tu circulación.";
        } else if (userProfile.lifestyle === 'mixto') {
            wPlan += "Ya que te mueves esporádicamente, el fin de semana planifica una <strong>Caminata Ligera (Trekking suave)</strong> por la naturaleza o un cerro amigable cercano. Te oxigenará los pulmones a lo grande.";
        } else {
            wPlan += "Tienes una vida activa muy pesada. Tu cuerpo no necesita más desgaste articular este fin de semana, necesita relajarse. Te recomiendo una sesión de <strong>Natación Suave (Piscina)</strong> o un paseo muy tranquilo al aire libre para que tu sistema nervioso descanse activamente.";
        }

        if (healthSelected.includes('rodillas') || healthSelected.includes('articulaciones') || healthSelected.includes('espalda')) {
            wPlan += "<br><em>Importante:</em> Como tienes dolencias físicas, evita deportes de impacto (como jugar fútbol o básquet) este fin de semana. El agua (natación) es tu mejor amiga para quitar presión de tu espalda baja y rodillas.";
        }
        wPlan += "</p></div>";

        textEl.innerHTML = baseStrategy + healthTips + wPlan;
    }

    completeDayBtn.addEventListener('click', () => {
        currentDay++;
        dayTitle.textContent = `Día ${currentDay}: Progreso Activo`;
        mainHeader.classList.remove('hidden');

        // Regenerar la rutina para que el sistema mezcle los ejercicios basados en el nuevo currentDay
        currentRoutine = generateDailyRoutine(userProfile.lvl, globalEquip, userProfile.gender, globalHealth);
        renderDashboard();
        saveData(); // Guardar progreso persistente

        switchView(completionSection, dashboardSection);
    });

    // --- HELPERS ---
    function switchView(hideEl, showEl) {
        hideEl.classList.remove('active');
        setTimeout(() => {
            hideEl.classList.add('hidden');
            showEl.classList.remove('hidden');
            setTimeout(() => {
                showEl.classList.add('active');
            }, 50);
        }, 400);
    }

    // --- MOCK IA LOGIC ---
    function generateDailyRoutine(lvl, equip, gender, health) {
        const routine = [];
        let repTime = lvl === 'avanzado' ? 60 : 45; // seconds per set

        // Flags medicos expandidos
        const isEspalda = health.includes('espalda');
        const isRodilla = health.includes('rodillas');
        const isHiper = health.includes('hipertension');
        const isAsma = health.includes('asma');
        const isHombro = health.includes('hombros');

        // Solo usamos imagenes generadas (treadmill y weights se reutilizan)
        const images = {
            mujer: {
                warmupArms: ['assets/img_f_warm1.png', 'assets/img_f_warm2.png'],
                warmupLegs: ['assets/img_f_stretch1.png', 'assets/img_f_stretch2.png'],
                escoba: ['assets/img_f_escoba1.png', 'assets/img_f_escoba2.png'],
                bike: ['assets/img_bike1.png', 'assets/img_bike2.png'],
                eliptica: ['assets/img_treadmill1.png', 'assets/img_treadmill2.png'],
                treadmill: ['assets/img_treadmill1.png', 'assets/img_treadmill2.png'],
                jacks: ['assets/img_f_jacks1.png', 'assets/img_f_jacks2.png'],
                weights: ['assets/img_weights1.png', 'assets/img_weights2.png'],
                chair: ['assets/img_chair1.png', 'assets/img_chair2.png'],
                mochila: ['assets/img_weights1.png', 'assets/img_weights2.png'], // Usa pesas
                pushups: ['assets/img_pushups1.png', 'assets/img_pushups2.png'],
                plank: ['assets/img_plank1.png', 'assets/img_plank2.png'],
                stretch: ['assets/img_stretch1.png', 'assets/img_stretch2.png']
            },
            hombre: {
                warmupArms: ['assets/img_m_warm_arms1.png', 'assets/img_m_warm_arms2.png'],
                warmupLegs: ['assets/img_m_warm_legs1.png', 'assets/img_m_warm_legs2.png'],
                escoba: ['assets/img_m_escoba1.png', 'assets/img_m_escoba2.png'],
                bike: ['assets/img_m_bike1.png', 'assets/img_m_bike2.png'],
                eliptica: ['assets/img_treadmill1.png', 'assets/img_treadmill2.png'],
                treadmill: ['assets/img_treadmill1.png', 'assets/img_treadmill2.png'],
                jacks: ['assets/img_m_jacks1.png', 'assets/img_m_jacks2.png'],
                weights: ['assets/img_m_weights1.png', 'assets/img_m_weights2.png'],
                chair: ['assets/img_m_chair1.png', 'assets/img_m_chair2.png'],
                mochila: ['assets/img_m_weights1.png', 'assets/img_m_weights2.png'],
                pushups: ['assets/img_m_pushups1.png', 'assets/img_m_pushups2.png'],
                plank: ['assets/img_m_plank1.png', 'assets/img_m_plank2.png'],
                stretch: ['assets/img_m_warm_legs1.png', 'assets/img_m_warm_legs2.png']
            }
        };

        const gImg = images[gender] || images['mujer']; // Backup fallback
        const isSenior = parseInt(userProfile.age) >= 60;
        const isBeginner = lvl === 'principiante';
        const useAsistedImgs = isSenior || isBeginner;

        const seniorImgs = {
            squat: ['assets/elder_squat1.png', 'assets/elder_squat2.png'],
            pushup: ['assets/elder_pushup1.png', 'assets/elder_pushup2.png'],
            plank: ['assets/elder_plank1.png', 'assets/elder_plank2.png'],
            rot: ['assets/elder_rot1.png', 'assets/elder_rot2.png']
        };

        const hasEscoba = equip.includes('escoba');
        const hasGradas = equip.includes('gradas');
        
        // 1. Warmup Dividido en Series Variadas
        if (hasEscoba) {
            routine.push({
                type: 'warmup',
                name: 'Calentamiento con Escoba (1/3): Rotación de Torso',
                tip: 'Toma el palo de escoba tras la nuca y gira suavemente de lado a lado para soltar lumbares.',
                duration: 60,
                frames: gImg.escoba || gImg.warmupArms
            });
        } else {
            let warmupName = isSenior ? 'Calentamiento (1/3): Rotación Sentado' : 'Calentamiento (1/3): Círculos de Brazos';
            let warmupTip = isSenior ? 'Siéntate en una silla firme. Gira tu torso lentamente de un lado a otro para no forzar la espalda baja.' : 'Rotaciones muy amplias. Empieza pequeño y agranda el círculo.';
            routine.push({
                type: 'warmup',
                name: warmupName,
                tip: warmupTip,
                duration: 60,
                frames: isSenior ? seniorImgs.rot : gImg.warmupArms
            });
        }

        if (hasGradas) {
            routine.push({
                type: 'warmup',
                name: 'Calentamiento (2/3): Escalón Ligeramente',
                tip: 'Sube y baja el primer escalón lentamente para irrigar los gemelos y rodillas.',
                duration: 60,
                frames: gImg.warmupLegs
            });
        } else {
            routine.push({
                type: 'warmup',
                name: 'Calentamiento (2/3): Desplantes Cortos (Piernas)',
                tip: 'Flexiona ligeramente tus rodillas. Pequeños pasos frontales para calentar cuádriceps.',
                duration: 60,
                frames: gImg.warmupLegs
            });
        }

        routine.push({
            type: 'warmup',
            name: 'Calentamiento (3/3): Activación Cardiovascular',
            tip: 'Pequeños saltitos simulando saltar cuerda a ritmo muy suave.',
            duration: 60,
            frames: gImg.jacks
        });

        const hasBolsas = equip.includes('bolsas');
        const hasBike = equip.includes('bici');
        const hasEliptica = equip.includes('eliptica');
        const hasTreadmill = equip.includes('caminadora');
        const hasWeights = equip.includes('pesas-ligeras') || equip.includes('pesas-medias') || equip.includes('pesas-pesadas');
        const hasChair = equip.includes('silla');
        const hasMochila = equip.includes('mochila');

        // Construir Bloques del Circuito
        let circuitBlock = [];
        const dayMod = currentDay % 3; // Varía el entrenamiento en ciclos de 3 días

        // 2. Cardio Inicial (bloque con variación diaria)
        let cardioOptions = [];
        if (hasBike) cardioOptions.push({ type: 'work', name: 'Bicicleta Estática', tip: 'Empuja desde el glúteo. Mantén abdomen firme.', duration: 120, frames: gImg.bike });
        if (hasEliptica) cardioOptions.push({ type: 'work', name: 'Rodador Elíptico / Caminadora', tip: 'Movimiento fluido y acompasado.', duration: 120, frames: gImg.treadmill });
        if (hasTreadmill && !hasEliptica) cardioOptions.push({ type: 'work', name: 'Caminadora', tip: isRodilla ? 'Sin inclinación extrema.' : 'Paso constante y rápido.', duration: 120, frames: gImg.treadmill });
        
        // Cardio base siempre disponible
        cardioOptions.push({ type: 'work', name: 'Jumping Jacks (Tijeras)', tip: isRodilla ? 'Modificación: No saltes. Pasos laterales.' : (isAsma ? 'Hazlo a paso ligero y controla respiración.' : 'Aterriza suave en las puntas.'), duration: repTime, frames: gImg.jacks });
        cardioOptions.push({ type: 'work', name: 'Jumping Jacks (Variación de Ritmo)', tip: 'Haz 5 jacks rápidos y descansa 2 segundos.', duration: repTime, frames: gImg.jacks });
        
        circuitBlock.push(cardioOptions[currentDay % cardioOptions.length]);

        // 3. Main Work (bloque de Fuerza con variación)
        let strengthOptions = [];
        if (hasMochila) {
            strengthOptions.push({ type: 'work', name: 'Sentadilla Frontal (Mochila)', tip: 'Sujeta la mochila contra tu pecho y baja profundo.', duration: repTime, frames: gImg.mochila });
            strengthOptions.push({ type: 'work', name: 'Peso Muerto (Mochila)', tip: 'Inclina el tronco cuidando espalda recta.', duration: repTime, frames: gImg.mochila });
        }
        if (hasWeights || hasBolsas) {
            let eqName = hasWeights ? "Mancuernas" : "Fundas";
            let eqTip = isRodilla ? 'Baja poco.' : 'Rodillas hacia afuera.';
            if (isHombro && (hasWeights || hasBolsas)) eqTip += ' No levantes pesas por encima del cuello.';
            strengthOptions.push({ type: 'work', name: `Sentadillas con ${eqName}`, tip: eqTip, duration: repTime, frames: gImg.weights });
            strengthOptions.push({ type: 'work', name: `Peso Muerto con ${eqName}`, tip: 'Flexiona ligeramente las rodillas, empuja glúteos atrás.', duration: repTime, frames: gImg.weights });
        } 
        if (hasChair || useAsistedImgs) {
            let squatName = isBeginner ? 'Sentadilla Asistida (Silla)' : 'Sentadilla Tocando Silla';
            if(isSenior) squatName = 'Sentadilla Asistida (Adulto Mayor)';
            
            let squatTip = isSenior ? 'Apóyate siempre en el respaldo de la silla al bajar y subir.' : 'Controla la bajada hasta casi sentarte.';
            strengthOptions.push({ type: 'work', name: squatName, tip: squatTip, duration: repTime, frames: useAsistedImgs ? seniorImgs.squat : gImg.chair });
            
            if(!isSenior) {
                let dipName = lvl === 'principiante' ? 'Fondos en Silla (Rodillas dobladas)' : 'Fondos en Silla (Piernas estiradas)';
                strengthOptions.push({ type: 'work', name: dipName, tip: isHombro ? 'Cuidado: No bajes más allá de 90°.' : 'Baja el peso apuntando codos atrás.', duration: repTime, frames: gImg.chair });
            }
        } 
        
        // PROGRESIÓN DE FLEXIONES
        let pushName = 'Flexiones Rápidas';
        let pushTip = 'Cuerpo recto como tabla.';
        if (useAsistedImgs) {
            pushName = isSenior ? 'Flexiones en Pared (Impacto Cero)' : 'Flexiones Apoyando Rodillas';
            pushTip = isSenior ? 'Apóyate de pie frente a una pared a un paso de distancia.' : 'Mantén las rodillas en el piso para restar peso corporal. Baja poco si te cuesta.';
        } else if (lvl === 'intermedio') {
            pushName = 'Flexiones Estándar (Pushups)';
        } else {
            pushName = 'Flexiones Declinadas o Lentas';
            pushTip = 'Baja en 3 segundos y sube en 1 segundo explosivo.';
        }
        strengthOptions.push({ type: 'work', name: pushName, tip: isHombro ? 'Apóyate en pared oblicua para cuidar hombros.' : pushTip, duration: repTime, frames: useAsistedImgs ? seniorImgs.pushup : gImg.pushups });

        circuitBlock.push(strengthOptions[currentDay % strengthOptions.length]);
        if(strengthOptions.length > 1) {
             circuitBlock.push(strengthOptions[(currentDay + 1) % strengthOptions.length]); // Añade segundo ejercicio de fuerza diferente
        }

        // PROGRESIÓN DE CORE / PLANCHAS
        let coreName = '';
        let coreTip = '';
        if (useAsistedImgs) {
            coreName = isSenior ? 'Plancha de Rodillas (Adaptada)' : 'Plancha Apoyando Rodillas';
            coreTip = isSenior ? 'Ve a tu propio ritmo. Si el suelo es difícil, hazlo apoyado en la cama.' : 'Apoya brazos y rodillas. Aprieta el abdomen hacia adentro.';
        } else if (lvl === 'intermedio') {
            coreName = 'Plancha Abdominal Larga';
            coreTip = 'Apoya antebrazos y puntas de pies. Cuerpo alineado horizontal.';
        } else {
            coreName = 'Plancha Dinámica (Mountain Climbers)';
            coreTip = 'Acelera el ritmo llevando rodillas al pecho sin levantar la cadera excesivamente.';
        }
        
        let coreOptions = [
            { type: 'work', name: coreName, tip: coreTip, duration: lvl === 'avanzado' ? 60 : 30, frames: useAsistedImgs ? seniorImgs.plank : gImg.plank },
            { type: 'work', name: 'Plancha Lateral Contigua', tip: 'Gira apoyando un solo brazo para impactar oblicuos.', duration: lvl === 'avanzado' ? 45 : 20, frames: useAsistedImgs ? seniorImgs.plank : gImg.plank },
        ];
        circuitBlock.push(coreOptions[currentDay % coreOptions.length]);

        // Calcular repeticiones de circuito necesarias
        const requestedTimeSecs = (userProfile.time || 15) * 60;
        const warmupCooldownTime = 120; // 60s warm + 60s stretch
        const circuitTime = circuitBlock.reduce((acc, curr) => acc + curr.duration, 0);
        
        let rounds = Math.max(1, Math.round((requestedTimeSecs - warmupCooldownTime) / circuitTime));

        // Insertar rondas al programa final con Progresión Terapéutica y Carga Adaptativa
        for(let r = 1; r <= rounds; r++) {
            circuitBlock.forEach(ex => {
                let deepEx = { ...ex };
                let customTip = deepEx.tip;
                let customName = deepEx.name;

                // Modificadores terapéuticos consistentes en cada ronda
                if (isRodilla && (customName.includes("Sentadilla") || customName.includes("Jacks") || customName.includes("Gradas") || customName.includes("Muerto"))) {
                    customTip = "⚠️ Rodilla: Rango corto. No bajes de 45° y evita impacto. " + customTip;
                }
                if (isEspalda && customName.includes("Muerto")) {
                    customTip = "⚠️ Espalda: Dobla más las rodillas y mantén el peso muy cerca del cuerpo. " + customTip;
                }
                if (isHombro && customName.includes("Flexiones")) {
                    customTip = "⚠️ Hombro: Restringe la bajada, no bajes más de 90° de flexión. " + customTip;
                }
                
                // Sobrecarga progresiva: Adaptar según el número de ronda
                let isCardio = customName.includes("Bicicleta") || customName.includes("Elíptica") || customName.includes("Caminadora") || customName.includes("Jacks");
                
                if (!isCardio) { // Solo escalamos fuerza y core
                    if (r === 1) {
                        customName = `${customName} (Serie 1: Biomecánica sin peso)`;
                        customTip = `Fase de Adaptación: Trabaja SOLO CON TU PESO CORPORAL. Enfócate 100% en la técnica muscular correcta. ` + customTip;
                    } else if (r === 2) {
                        if (hasWeights || hasMochila || hasBolsas) {
                            customName = `${customName} (Serie 2: Carga Unilateral/Ligera)`;
                            customTip = `Progresión: Agarra UNA SOLA mancuerna/bolsa o pontela de lado. Tu abdomen trabajará para estabilizar. ` + customTip;
                        } else {
                            customName = `${customName} (Serie 2: Tensión Lenta)`;
                            customTip = `Progresión de Tensión: Baja muy lentamente (excéntrica de 3 a 5 segs). Siente el ardor. ` + customTip;
                        }
                    } else {
                        if (hasWeights || hasMochila || hasBolsas) {
                            customName = `${customName} (Serie ${r}: Carga Bilateral Completa)`;
                            customTip = `Desafío Físico: Usa tu máxima carga equipada de forma simétrica. ` + customTip;
                        } else {
                            customName = `${customName} (Serie ${r}: Isometría y Potencia)`;
                            customTip = `Congela 2 segundos la postura en el punto de máximo esfuerzo (abajo) en cada rep. ` + customTip;
                        }
                    }
                } else {
                    customName = `${customName} (Ronda ${r})`;
                    if (r > 1) customTip = "Mantén la respiración o sube levemente la velocidad/resistencia. " + customTip;
                }

                deepEx.name = customName;
                deepEx.tip = customTip;
                routine.push(deepEx);
            });
            // Descanso entre rondas
            if (r < rounds) {
                routine.push({ type: 'rest', name: `Descanso Activo (Fin de Ronda ${r})`, tip: 'Hidrátate, sacude brazos y piernas. ¡No te sientes!', duration: 30, frames: gImg.warmup });
            }
        }

        // 5. Cooldown
        routine.push({
            type: 'warmup', 
            name: hasEscoba ? 'Estiramiento Final (Palo de Escoba)' : 'Estiramiento Final', 
            tip: hasEscoba ? 'Palo tras nuca, estira torso a los lados. Respira.' : 'Toca tus pies, respira profundo y baja pulsaciones.', 
            duration: 60,
            frames: gImg.stretch
        });

        return routine;
    }

    function renderDashboard() {
        exercisesList.innerHTML = '';
        
        // Agrupar rutinas
        const grouped = [];
        currentRoutine.forEach(ex => {
            if (ex.type === 'rest') return; // Hide rest periods from dashboard to keep it clean

            // Extraer nombre base quitando "(Serie...)", "(Ronda...)", "(1/3"...
            let baseName = ex.name.replace(/\s*\([\d/Serionda]+.*?\)/gi, '').trim();
            if (baseName.includes('Calentamiento')) baseName = 'Fase de Calentamiento';

            let existing = grouped.find(g => g.baseName === baseName);
            if (existing) {
                existing.count += 1;
                existing.totalDuration += ex.duration;
            } else {
                grouped.push({
                    baseName: baseName,
                    count: 1,
                    totalDuration: ex.duration,
                    type: ex.type,
                    originalName: ex.name
                });
            }
        });

        grouped.forEach((g, idx) => {
            const m = Math.floor(g.totalDuration / 60);
            const s = g.totalDuration % 60;
            const timeStr = m > 0 ? `${m}m ${s > 0 ? s+'s' : ''}` : `${s}s`;

            let imgUrl = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=150&q=80"; // Default
            const lname = g.baseName.toLowerCase();

            if (lname.includes('sentadilla') || lname.includes('silla') || lname.includes('gradas')) {
                const arr = [
                    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=150&q=80"
                ];
                imgUrl = arr[idx % arr.length];
            } else if (lname.includes('flexiones') || lname.includes('plancha') || lname.includes('core')) {
                const arr = [
                    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=150&q=80"
                ];
                imgUrl = arr[idx % arr.length];
            } else if (lname.includes('calentamiento') || lname.includes('estiramiento')) {
                const arr = [
                    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1552674605-171ff3ea36f0?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=150&q=80"
                ];
                imgUrl = arr[idx % arr.length];
            } else if (lname.includes('jacks') || lname.includes('bicicleta') || lname.includes('caminadora') || lname.includes('elíptica') || lname.includes('tijeras')) {
                const arr = [
                    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80"
                ];
                imgUrl = arr[idx % arr.length];
            } else if (lname.includes('muerto') || lname.includes('mochila') || lname.includes('peso')) {
                const arr = [
                    "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=150&q=80"
                ];
                imgUrl = arr[idx % arr.length];
            }

            const item = document.createElement('div');
            item.className = `ex-preview-item ${g.type}`;
            item.style.alignItems = "center";
            item.innerHTML = `
                <img src="${imgUrl}" style="width: 80px; height: 80px; min-width: 80px; object-fit: cover; border-radius: 12px; margin-right: 15px; box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);">
                <div class="ex-info" style="flex: 1;">
                    <strong style="font-size: 1.15rem; display: block; margin-bottom: 5px;">${idx + 1}. ${g.baseName}</strong>
                    <span style="display: block; font-size: 0.9rem; color: var(--text-sec);">
                        ⏱️ Total: ${timeStr} 
                        <br>
                        🔄 Concentración: ${g.count} Series
                    </span>
                </div>
            `;
            exercisesList.appendChild(item);
        });
    }

    // Inicialización automática desde Memoria
    loadData();
});
