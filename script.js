const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

function enableTilt() {
    window.addEventListener('deviceorientation', (e) => {
        const moveX = Math.min(Math.max(e.gamma, -20), 20);
        const moveY = Math.min(Math.max(e.beta - 45, -20), 20);
        document.getElementById('deepBg').style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        document.getElementById('gridOverlay').style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

function verifyId() {
    const id = document.getElementById('userId').value;
    if (id.length < 5) return alert("Enter valid ID");
    enableTilt();
    document.getElementById('loader').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('displayId').innerText = id;
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('predictorScreen').classList.add('active');
        const grid = document.getElementById('grid');
        for(let i=0; i<25; i++) grid.innerHTML += '<div class="cell"></div>';
    }, 1500);
}

function generatePrediction() {
    const mineCount = parseInt(document.getElementById('mineCount').value);
    const cells = document.querySelectorAll('.cell');
    document.getElementById('loader').style.display = 'flex';
    cells.forEach(c => c.classList.remove('star'));

    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        // Prediction Logic: 1 mine = 5 stars, 3 mines = 4 stars, 5+ mines = 3 stars
        let starLimit = mineCount === 1 ? 5 : (mineCount === 3 ? 4 : 3);
        let indices = [];
        while(indices.length < starLimit) {
            let r = Math.floor(Math.random() * 25);
            if(!indices.includes(r)) indices.push(r);
        }
        indices.forEach(i => cells[i].classList.add('star'));
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    }, 1000);
            }
