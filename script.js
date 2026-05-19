const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const deepBg = document.getElementById('deepBg');
const gridOverlay = document.getElementById('gridOverlay');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const loginScreen = document.getElementById('loginScreen');
const predictorScreen = document.getElementById('predictorScreen');
const displayId = document.getElementById('displayId');
const grid = document.getElementById('grid');

document.getElementById('authBtn').addEventListener('click', verifyId);
document.getElementById('predictBtn').addEventListener('click', generatePrediction);

function handleTilt(event) {
    const x = event.gamma; 
    const y = event.beta;  
    if (x === null || y === null) return;
    const moveDeepX = Math.max(-20, Math.min(20, x)) * 0.4;
    const moveDeepY = Math.max(-20, Math.min(20, y - 45)) * 0.4;
    const moveGridX = Math.max(-20, Math.min(20, x)) * 0.8;
    const moveGridY = Math.max(-20, Math.min(20, y - 45)) * 0.8;
    deepBg.style.transform = `translate(${moveDeepX}px, ${moveDeepY}px)`;
    gridOverlay.style.transform = `translate(${moveGridX}px, ${moveGridY}px)`;
}

function enableParallaxEngine() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(state => {
            if (state === 'granted') window.addEventListener('deviceorientation', handleTilt);
        });
    } else {
        window.addEventListener('deviceorientation', handleTilt);
    }
}

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
    if (idInput.length < 5) return alert('Invalid ID');
    enableParallaxEngine();
    loader.style.display = 'flex';
    setTimeout(() => {
        loader.style.display = 'none';
        displayId.innerText = idInput;
        loginScreen.classList.remove('active');
        predictorScreen.classList.add('active');
        initGrid();
    }, 2000);
}

function generatePrediction() {
    const mineCount = parseInt(document.getElementById('mineCount').value);
    loader.style.display = 'flex';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(c => c.classList.remove('star'));

    setTimeout(() => {
        loader.style.display = 'none';
        let count;
        switch(mineCount) {
            case 1: count = 5; break;
            case 3: count = 4; break;
            case 5: count = 3; break;
            case 7: count = 2; break;
            default: count = 3;
        }

        const indices = [];
        while(indices.length < count) {
            let r = Math.floor(Math.random() * 25);
            if(!indices.includes(r)) indices.push(r);
        }
        indices.forEach(i => cells[i].classList.add('star'));
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
    }, 1200);
}
