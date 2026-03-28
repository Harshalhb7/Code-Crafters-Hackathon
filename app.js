/* ═══════════════════════════════════════════════════
   JalSetu — Smart Irrigation System
   JavaScript: Screen Navigation, Animations, i18n
   ───────────────────────────────────────────────────
   This file handles:
   1. Language selection & translations
   2. Screen-to-screen navigation (SPA style)
   3. Sprinkler water animation
   4. Login validation
   5. Dashboard decision switching
   6. Time-based greeting
═══════════════════════════════════════════════════ */

// ─── State ───
let currentLang = 'en';
let currentScreen = 'screen-language';


// ═══════════════════════════════════════════════════
//  TRANSLATIONS
//  All UI text in English, Hindi, and Marathi
// ═══════════════════════════════════════════════════
const translations = {
    en: {
        langPrompt:       'Choose your language',
        introTagline:     'Smart Farming, Better Water Decisions',
        introSub:         'Save water. Grow more. Farm smarter.',
        btnGetStarted:    'Get Started',
        loginTitle:       'Welcome, Farmer!',
        loginDesc:        'Enter your mobile number to continue',
        mobileLabel:      '📱 Mobile Number',
        inputHint:        'Enter 10 digit number',
        btnLogin:         'Login',
        loginFooter:      'No password needed. Just your phone number.',
        dashGreeting:     'Good Morning, Farmer!',
        labelSoil:        'Soil',
        labelWeather:     'Weather',
        labelCrop:        'Crop',
        labelTemp:        'Temperature',
        valueSoil:        'Dry',
        valueWeather:     'No Rain',
        valueCrop:        'Wheat',
        valueTemp:        '34°C',
        titleInsights:    '💡 Insights',
        insight1:         'Soil moisture is very low — irrigation needed',
        insight2:         'Rain expected in 5 hours — but not enough',
        insight3:         'Wheat crop needs water every 3 days',
        statWaterLabel:   'Water Saved',
        statEffLabel:     'Efficiency',
        statSessionsLabel:'Irrigations',
        titleActions:     '🎯 Quick Actions',
        actionIrrigate:   'Irrigate',
        actionWait:       'Wait',
        actionStop:       "Don't Irrigate",
        footerText:       'JalSetu — Smart Irrigation for Every Farmer 🌱',
        // Decision texts
        decIrrigateTitle:  'Irrigate Now',
        decIrrigateReason: 'Soil is dry & no rain expected',
        decWaitTitle:      'Wait for Rain',
        decWaitReason:     'Rain expected soon — save water',
        decStopTitle:      'Do Not Irrigate',
        decStopReason:     'Soil is wet & rain is coming',
        confidence:        'Confidence',
        // Greeting variants
        greetingMorning:  'Good Morning, Farmer!',
        greetingAfternoon:'Good Afternoon, Farmer!',
        greetingEvening:  'Good Evening, Farmer!',
        // Validation
        errorMobile:      'Please enter a valid 10-digit number',
    },
    hi: {
        langPrompt:       'अपनी भाषा चुनें',
        introTagline:     'स्मार्ट खेती, बेहतर पानी के फैसले',
        introSub:         'पानी बचाएं। ज़्यादा उगाएं। होशियारी से खेती करें।',
        btnGetStarted:    'शुरू करें',
        loginTitle:       'स्वागत है, किसान!',
        loginDesc:        'आगे बढ़ने के लिए अपना मोबाइल नंबर डालें',
        mobileLabel:      '📱 मोबाइल नंबर',
        inputHint:        '10 अंकों का नंबर डालें',
        btnLogin:         'लॉगिन',
        loginFooter:      'पासवर्ड की ज़रूरत नहीं। बस आपका फ़ोन नंबर।',
        dashGreeting:     'सुप्रभात, किसान!',
        labelSoil:        'मिट्टी',
        labelWeather:     'मौसम',
        labelCrop:        'फसल',
        labelTemp:        'तापमान',
        valueSoil:        'सूखी',
        valueWeather:     'बारिश नहीं',
        valueCrop:        'गेहूं',
        valueTemp:        '34°C',
        titleInsights:    '💡 जानकारी',
        insight1:         'मिट्टी में नमी बहुत कम है — सिंचाई जरूरी है',
        insight2:         '5 घंटे में बारिश की उम्मीद — लेकिन पर्याप्त नहीं',
        insight3:         'गेहूं की फसल को हर 3 दिन पानी चाहिए',
        statWaterLabel:   'पानी बचाया',
        statEffLabel:     'दक्षता',
        statSessionsLabel:'सिंचाई',
        titleActions:     '🎯 त्वरित कार्य',
        actionIrrigate:   'सिंचाई करें',
        actionWait:       'इंतज़ार',
        actionStop:       'सिंचाई न करें',
        footerText:       'जलसेतु — हर किसान के लिए स्मार्ट सिंचाई 🌱',
        decIrrigateTitle:  'अभी सिंचाई करें',
        decIrrigateReason: 'मिट्टी सूखी है और बारिश की उम्मीद नहीं',
        decWaitTitle:      'बारिश का इंतज़ार करें',
        decWaitReason:     'बारिश जल्द ही आने वाली है — पानी बचाएं',
        decStopTitle:      'सिंचाई न करें',
        decStopReason:     'मिट्टी गीली है और बारिश आ रही है',
        confidence:        'विश्वास',
        greetingMorning:  'सुप्रभात, किसान!',
        greetingAfternoon:'नमस्ते, किसान!',
        greetingEvening:  'शुभ संध्या, किसान!',
        errorMobile:      'कृपया 10 अंकों का वैध नंबर डालें',
    },
    mr: {
        langPrompt:       'तुमची भाषा निवडा',
        introTagline:     'स्मार्ट शेती, पाण्याचे चांगले निर्णय',
        introSub:         'पाणी वाचवा. अधिक पिकवा. शहाणपणाने शेती करा.',
        btnGetStarted:    'सुरू करा',
        loginTitle:       'स्वागत आहे, शेतकरी!',
        loginDesc:        'पुढे जाण्यासाठी तुमचा मोबाइल नंबर टाका',
        mobileLabel:      '📱 मोबाइल नंबर',
        inputHint:        '10 अंकी नंबर टाका',
        btnLogin:         'लॉगिन',
        loginFooter:      'पासवर्डची गरज नाही. फक्त तुमचा फोन नंबर.',
        dashGreeting:     'सुप्रभात, शेतकरी!',
        labelSoil:        'माती',
        labelWeather:     'हवामान',
        labelCrop:        'पीक',
        labelTemp:        'तापमान',
        valueSoil:        'कोरडी',
        valueWeather:     'पाऊस नाही',
        valueCrop:        'गहू',
        valueTemp:        '34°C',
        titleInsights:    '💡 माहिती',
        insight1:         'मातीत ओलावा खूप कमी आहे — सिंचन आवश्यक',
        insight2:         '5 तासांत पावसाची शक्यता — पण पुरेसा नाही',
        insight3:         'गव्हाच्या पिकाला दर 3 दिवसांनी पाणी लागते',
        statWaterLabel:   'पाणी वाचवले',
        statEffLabel:     'कार्यक्षमता',
        statSessionsLabel:'सिंचन',
        titleActions:     '🎯 जलद कृती',
        actionIrrigate:   'सिंचन करा',
        actionWait:       'थांबा',
        actionStop:       'सिंचन नको',
        footerText:       'जलसेतु — प्रत्येक शेतकऱ्यासाठी स्मार्ट सिंचन 🌱',
        decIrrigateTitle:  'आत्ता सिंचन करा',
        decIrrigateReason: 'माती कोरडी आहे आणि पावसाची शक्यता नाही',
        decWaitTitle:      'पावसाची वाट पहा',
        decWaitReason:     'लवकरच पाऊस येणार — पाणी वाचवा',
        decStopTitle:      'सिंचन करू नका',
        decStopReason:     'माती ओलसर आहे आणि पाऊस येत आहे',
        confidence:        'विश्वास',
        greetingMorning:  'सुप्रभात, शेतकरी!',
        greetingAfternoon:'नमस्कार, शेतकरी!',
        greetingEvening:  'शुभ संध्याकाळ, शेतकरी!',
        errorMobile:      'कृपया 10 अंकी वैध नंबर टाका',
    }
};


// ═══════════════════════════════════════════════════
//  LANGUAGE SELECTION
// ═══════════════════════════════════════════════════

/**
 * Called when a language button is clicked.
 * Stores the language, applies translations, and moves to intro screen.
 */
function selectLanguage(lang) {
    currentLang = lang;
    applyTranslations();
    goToScreen('screen-intro');
    // Start sprinkler animation when intro screen loads
    setTimeout(createSprinklerDrops, 500);
}

/**
 * Apply all translations for the selected language.
 * Maps translation keys to DOM element IDs.
 */
function applyTranslations() {
    const t = translations[currentLang];
    if (!t) return;

    // Language screen
    setText('lang-prompt-text', t.langPrompt);

    // Intro screen
    setText('intro-tagline', t.introTagline);
    setText('intro-sub', t.introSub);
    setText('btn-get-started-text', t.btnGetStarted);

    // Login screen
    setText('login-title', t.loginTitle);
    setText('login-desc', t.loginDesc);
    setText('mobile-label', t.mobileLabel);
    setText('input-hint', t.inputHint);
    setText('btn-login-text', t.btnLogin);
    setText('login-footer', t.loginFooter);

    // Dashboard
    updateDashboardGreeting();
    setText('label-soil', t.labelSoil);
    setText('label-weather', t.labelWeather);
    setText('label-crop', t.labelCrop);
    setText('label-temp', t.labelTemp);
    setText('value-soil', t.valueSoil);
    setText('value-weather', t.valueWeather);
    setText('value-crop', t.valueCrop);
    setText('value-temp', t.valueTemp);
    setText('title-insights', t.titleInsights);
    setText('insight-text-1', t.insight1);
    setText('insight-text-2', t.insight2);
    setText('insight-text-3', t.insight3);
    setText('stat-water-label', t.statWaterLabel);
    setText('stat-efficiency-label', t.statEffLabel);
    setText('stat-sessions-label', t.statSessionsLabel);
    setText('title-actions', t.titleActions);
    setText('action-irrigate-text', t.actionIrrigate);
    setText('action-wait-text', t.actionWait);
    setText('action-stop-text', t.actionStop);
    setText('dash-footer-text', t.footerText);
}

/** Safely set text content of an element by ID */
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}


// ═══════════════════════════════════════════════════
//  SCREEN NAVIGATION (SPA)
// ═══════════════════════════════════════════════════

/**
 * Transition from current screen to the target screen.
 * Uses CSS opacity/visibility transitions for smooth fading.
 */
function goToScreen(targetId) {
    const current = document.getElementById(currentScreen);
    const target = document.getElementById(targetId);

    if (!current || !target || currentScreen === targetId) return;

    // Fade out current screen
    current.classList.remove('active');

    // Wait for fade-out, then show target
    setTimeout(() => {
        target.classList.add('active');
        currentScreen = targetId;

        // Trigger dashboard greeting update when dashboard loads
        if (targetId === 'screen-dashboard') {
            updateDashboardGreeting();
            animateCounters();
        }
    }, 300);
}


// ═══════════════════════════════════════════════════
//  SPRINKLER WATER EFFECT
//  Creates animated water droplets that fall across the intro screen
// ═══════════════════════════════════════════════════

function createSprinklerDrops() {
    const container = document.getElementById('sprinkler-container');
    if (!container) return;

    // Clear any existing drops
    container.innerHTML = '';

    // Create 30 water drops at random positions
    const dropCount = 30;
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('water-drop');

        // Randomize position, timing, and angle
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 2 + Math.random() * 2;
        const angle = -15 + Math.random() * 30;

        drop.style.left = `${left}%`;
        drop.style.setProperty('--delay', `${delay}s`);
        drop.style.setProperty('--duration', `${duration}s`);
        drop.style.setProperty('--angle', `${angle}deg`);

        container.appendChild(drop);
    }
}


// ═══════════════════════════════════════════════════
//  LOGIN HANDLER
// ═══════════════════════════════════════════════════

/**
 * Validates the mobile number and navigates to the dashboard.
 * Only checks for 10-digit numeric input.
 */
function handleLogin() {
    const input = document.getElementById('mobile-input');
    const hint = document.getElementById('input-hint');
    const value = input.value.trim();
    const t = translations[currentLang];

    // Validate: must be exactly 10 digits
    if (!/^\d{10}$/.test(value)) {
        hint.textContent = t.errorMobile;
        hint.classList.add('input-error');
        input.focus();

        // Remove error style after 3 seconds
        setTimeout(() => {
            hint.textContent = t.inputHint;
            hint.classList.remove('input-error');
        }, 3000);
        return;
    }

    // Valid — proceed to dashboard
    hint.classList.remove('input-error');
    goToScreen('screen-dashboard');
}

// Allow Enter key to submit login
document.addEventListener('DOMContentLoaded', () => {
    const mobileInput = document.getElementById('mobile-input');
    if (mobileInput) {
        mobileInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        });

        // Only allow numeric input
        mobileInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});


// ═══════════════════════════════════════════════════
//  DASHBOARD: TIME-BASED GREETING
// ═══════════════════════════════════════════════════

function updateDashboardGreeting() {
    const t = translations[currentLang];
    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) {
        greeting = t.greetingMorning;
    } else if (hour < 17) {
        greeting = t.greetingAfternoon;
    } else {
        greeting = t.greetingEvening;
    }

    setText('dash-greeting', greeting);
}


// ═══════════════════════════════════════════════════
//  DASHBOARD: DECISION SWITCHING
//  Users can tap the action buttons to simulate
//  different irrigation decisions.
// ═══════════════════════════════════════════════════

function setDecision(type) {
    const card = document.getElementById('decision-card');
    const emoji = document.getElementById('decision-emoji');
    const title = document.getElementById('decision-title');
    const reason = document.getElementById('decision-reason');
    const fill = document.getElementById('confidence-fill');
    const confText = document.getElementById('confidence-text');
    const t = translations[currentLang];

    // Remove old color classes
    card.classList.remove('decision-green', 'decision-yellow', 'decision-red');

    // Apply animation
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0.7';

    setTimeout(() => {
        switch (type) {
            case 'irrigate':
                card.classList.add('decision-green');
                emoji.textContent = '✅';
                title.textContent = t.decIrrigateTitle;
                reason.textContent = t.decIrrigateReason;
                fill.style.width = '87%';
                confText.textContent = `87% ${t.confidence}`;
                break;

            case 'wait':
                card.classList.add('decision-yellow');
                emoji.textContent = '⏳';
                title.textContent = t.decWaitTitle;
                reason.textContent = t.decWaitReason;
                fill.style.width = '72%';
                confText.textContent = `72% ${t.confidence}`;
                break;

            case 'stop':
                card.classList.add('decision-red');
                emoji.textContent = '🚫';
                title.textContent = t.decStopTitle;
                reason.textContent = t.decStopReason;
                fill.style.width = '94%';
                confText.textContent = `94% ${t.confidence}`;
                break;
        }

        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
    }, 200);
}


// ═══════════════════════════════════════════════════
//  DASHBOARD: ANIMATED COUNTERS
//  Animates the stat numbers when dashboard loads
// ═══════════════════════════════════════════════════

function animateCounters() {
    animateValue('stat-water-value', 0, 2400, 1500, ' L', true);
    animateValue('stat-efficiency-value', 0, 92, 1200, '%', false);
    animateValue('stat-sessions-value', 0, 14, 1000, '', false);
}

/**
 * Smoothly animates a number from start to end.
 * @param {string} id - Element ID
 * @param {number} start - Starting number
 * @param {number} end - Ending number
 * @param {number} duration - Animation duration in ms
 * @param {string} suffix - Text appended after the number
 * @param {boolean} useComma - Whether to format with commas
 */
function animateValue(id, start, end, duration, suffix, useComma) {
    const el = document.getElementById(id);
    if (!el) return;

    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);

        let display = useComma ? current.toLocaleString() : current.toString();
        el.textContent = display + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


// ═══════════════════════════════════════════════════
//  LOGOUT HANDLER
// ═══════════════════════════════════════════════════

function handleLogout() {
    // Clear mobile input
    const input = document.getElementById('mobile-input');
    if (input) input.value = '';

    // Navigate back to language screen
    goToScreen('screen-language');
}


// ═══════════════════════════════════════════════════
//  INIT — Run on page load
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Ensure only the language screen is visible initially
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-language').classList.add('active');
    currentScreen = 'screen-language';
});
