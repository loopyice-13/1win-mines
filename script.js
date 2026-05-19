// ── 1. TELEGRAM CONTEXT INITIALIZATION ────────────────────────────
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand(); // Maximizes webview window canvas height inside Telegram chat UI
}

// Dom Queries
const deepBg = document.getElementById('deepBg');
const gridOverlay = document.getElementById('gridOverlay');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const loginScreen = document.getElementById('loginScreen');
const predictorScreen = document.getElementById('predictorScreen');
const displayId = document.getElementById('displayId');
const grid = document.getElementById('grid');

// UI Buttons Event Listeners
document.getElementById('authBtn').addEventListener('click', verifyId);
document.getElementById('predictBtn').addEventListener('click', generatePrediction);


// ── 2. CINEMATIC MULTI-LAYER PARALLAX (TILT ENGINE) ────────────────
// Handles device orientation tracking across vectors
function handleTilt(event) {
    // gamma: left-to-right tilt [-90,90], beta: front-to-back tilt [-180,180]
    const x = event.gamma; 
    const y = event.beta;  

    if (x === null || y === null) return;

    // Constrain absolute max mapping thresholds
    const maxTiltX = 25;
    const maxTiltY = 25;

    let tiltX = Math.max(-maxTiltX, Math.min(maxTiltX, x));
    let tiltY = Math.max(-maxTiltY, Math.min(maxTiltY, y - 45)); // Offset normal 45deg viewing posture hold

    // Deep background layer moving slowest (Multiplier: 0.4)
    const moveDeepX = tiltX * 0.4;
    const moveDeepY = tiltY * 0.4;

    // Foreground structural grid overlay layer moving faster (Multiplier: 0.9)
    const moveGridX = tiltX * 0.9;
    const moveGridY = tiltY * 0.9;

    // Apply smooth calculated transformations
    deepBg.style.transform = `translate(${moveDeepX}px, ${moveDeepY}px)`;
    gridOverlay.style.transform = `translate(${moveGridX}px, ${moveGridY}px)`;
}

// Request Device Orientation Permissions safely for modern mobile sandboxes
function enableParallaxEngine() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS Webkit Requirement path
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleTilt);
                }
            })
            .catch(console.error);
    } else {
        // Android & Standard Web view initialization path
        window.addEventListener('deviceorientation', handleTilt);
    }
}


// ── 3. CORE BOT LOGIC FUNCTIONS ───────────────────────────────────
function initGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
}

function verifyId() {
    const idInput = document.getElementById('userId').value.trim();
    if (idInput.length < 5) {
        if(tg && tg.showAlert) {
            tg.showAlert('Authentication Failed: 1Win User ID must be at least 5 digits.');
        } else {
            alert('Authentication Failed: 1Win User ID must be at least 5 digits.');
        }
        return;
    }

    // Initialize Tilt Engine as user engages interface interaction
    enableParallaxEngine();

    // Trigger Multi-Stage Cinematic Terminal Pipeline loading simulation
    loader.style.display = 'flex';
    loaderText.innerText = "Querying Server Node...";

    setTimeout(() => {
        loaderText.innerText = "Syncing ID Base: " + idInput;
        setTimeout(() => {
            loaderText.innerText = "Injecting AI Vector Algorithms...";
            setTimeout(() => {
                loader.style.display = 'none';
                displayId.innerText = idInput;
                loginScreen.classList.remove('active');
                predictorScreen.classList.add('active');
                initGrid();
                
                if (tg && tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
            }, 900);
        }, 900);
    }, 1100);
}

function generatePrediction() {
    const mineCount = parseInt(document.getElementById('mineCount').value);
    
    loader.style.display = 'flex';
    loaderText.innerText = "Scanning Hash Sequence...";
    
    // Wipe prior dashboard stars clear
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('star'));

    setTimeout(() => {
        loader.style.display = 'none';
        
        // Dynamically weigh risk distribution logic
        let starsToReveal = 4;
        if (mineCount === 1) starsToReveal = 5;
        if (mineCount === 5) starsToReveal = 3;
        if (mineCount >= 7) starsToReveal = 2;

        const uniqueIndices = new Set();
        while (uniqueIndices.size < starsToReveal) {
            uniqueIndices.add(Math.floor(Math.random() * 25));
        }

        uniqueIndices.forEach(index => {
            cells[index].classList.add('star');
        });

        // Trigger native vibration click feedback
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    }, 1200);
}
