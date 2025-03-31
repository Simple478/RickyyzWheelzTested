// DOM Elements
const wheelCanvas = document.getElementById('wheelCanvas');
const nameInput = document.getElementById('nameInput');
const shuffleButton = document.getElementById('shuffleButton');
const clearButton = document.getElementById('clearButton');
const durationInput = document.getElementById('durationInput');
const winnerDialog = document.getElementById('winnerDialog');
const winnerName = document.getElementById('winnerName');
const closeDialogBtn = document.getElementById('closeDialog');
const removeWinnerBtn = document.getElementById('removeWinner');
const overlay = document.getElementById('overlay');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const previousWinnersDiv = document.getElementById('previousWinners');
const welcomePopup = document.getElementById('welcomePopup');
const closeWelcomeBtn = document.getElementById('closeWelcome');
const errorPopup = document.getElementById('errorPopup');
const tickSound = document.getElementById('tickSound');
const celebrationSound = document.getElementById('celebrationSound');

// Wheel configuration
const colors = [
    '#e74c3c', // Red
    '#3498db', // Blue
    '#f1c40f', // Yellow
    '#9b59b6', // Purple
    '#e67e22', // Orange
    '#1abc9c', // Cyan
    '#34495e', // Dark Blue
    '#d35400', // Dark Orange
    '#7f8c8d', // Gray
    '#c0392b'  // Dark Red
];
let options = [];
let currentRotation = 0;
let isSpinning = false;
let previousWinners = [];
let lastWinner = null;
let tickInterval;

// Show welcome popup on load
document.addEventListener('DOMContentLoaded', () => {
    welcomePopup.style.display = 'block';
    overlay.style.display = 'block';
    initCanvas();
    updatePreviousWinners();
});

// Close welcome popup
closeWelcomeBtn.addEventListener('click', () => {
    welcomePopup.style.display = 'none';
    overlay.style.display = 'none';
});

// Initialize canvas
function initCanvas() {
    let size;
    if (window.innerWidth >= 768) {
        // Desktop - larger wheel
        size = Math.min(600, Math.min(window.innerWidth, window.innerHeight) * 0.7);
    } else {
        // Mobile - smaller wheel
        size = Math.min(320, Math.min(window.innerWidth, window.innerHeight) * 0.8);
    }
    
    const dpr = window.devicePixelRatio || 1;
    
    wheelCanvas.width = size * dpr;
    wheelCanvas.height = size * dpr;
    wheelCanvas.style.width = `${size}px`;
    wheelCanvas.style.height = `${size}px`;
    
    const ctx = wheelCanvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    drawWheel();
}

// Draw the wheel
function drawWheel() {
    const ctx = wheelCanvas.getContext('2d');
    const size = wheelCanvas.width / (window.devicePixelRatio || 1);
    const center = size / 2;
    const radius = center - 5;
    
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    
    if (options.length === 0) {
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1e1e';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#555';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        ctx.fillText('Add options to begin', center, center);
    } else {
        const segmentAngle = (Math.PI * 2) / options.length;
        
        for (let i = 0; i < options.length; i++) {
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, i * segmentAngle, (i + 1) * segmentAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(i * segmentAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            const textLength = options[i].length;
            const fontSize = window.innerWidth >= 768 ? 
                (textLength > 15 ? 14 : textLength > 10 ? 16 : 18) :
                (textLength > 15 ? 8 : textLength > 10 ? 10 : 12);
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 2;
            
            const text = options[i].length > 10 ? options[i].substring(0, 8) + '...' : options[i];
            ctx.fillText(text, radius - 15, 5);
            ctx.restore();
        }
    }
    
    ctx.beginPath();
    ctx.arc(center, center, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--primary-green)';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Spin', center, center);
}

// Spin the wheel
function spinWheel() {
    if (isSpinning || options.length < 2) {
        if (options.length < 2) alert("Please enter at least 2 options!");
        return;
    }
    
    // Check time limit
    const duration = parseInt(durationInput.value) || 3;
    if (duration > 20) {
        showError("Time cannot be over 20 seconds");
        durationInput.value = 20;
        return;
    }
    
    isSpinning = true;
    
    // Play tick sound during spin
    tickSound.currentTime = 0;
    tickSound.loop = true;
    tickSound.play();
    
    // Start tick sound effect
    tickInterval = setInterval(() => {
        tickSound.currentTime = 0;
        tickSound.play();
    }, 200);
    
    const durationMs = duration * 1000;
    
    // Minimum 2 full rotations (720 degrees) - ALWAYS CLOCKWISE
    const minRotations = 2;
    // Additional random rotations (1-3)
    const additionalRotations = 1 + Math.floor(Math.random() * 3);
    const totalRotations = minRotations + additionalRotations;
    const baseRotation = (Math.PI * 2 * totalRotations);
    
    // Calculate the target segment, avoiding the last winner
    let availableOptions = [...options];
    if (lastWinner && availableOptions.length > 1) {
        availableOptions = availableOptions.filter(option => option !== lastWinner);
    }
    
    // Select a random winner from available options
    const winner = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const winnerIndex = options.indexOf(winner);
    
    // Calculate the angle needed to land on the target segment (clockwise)
    const segmentAngle = (Math.PI * 2) / options.length;
    
    // Add randomness to the landing position within the segment
    const segmentRandomness = Math.random() * segmentAngle * 0.9; // 90% of segment width
    const targetAngle = segmentAngle * winnerIndex + segmentRandomness;
    
    // The wheel points to the top (1.5π) at rest, so we calculate the offset
    const finalRotation = baseRotation + (Math.PI * 1.5 - targetAngle);
    
    // Apply the spin with fast start and gradual slowdown
    wheelCanvas.style.transition = `transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
    wheelCanvas.style.transform = `rotate(${finalRotation}rad)`;
    currentRotation = finalRotation;
    
    setTimeout(() => {
        isSpinning = false;
        lastWinner = winner;
        
        // Stop tick sound
        clearInterval(tickInterval);
        tickSound.pause();
        
        // Play celebration sound
        celebrationSound.currentTime = 0;
        celebrationSound.play();
        
        // Show confetti
        createConfetti();
        
        showWinner(winner);
    }, durationMs);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = -10 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        
        const animationDuration = Math.random() * 3 + 2;
        
        // Animate confetti
        confetti.animate([
            { top: -10 + 'px', opacity: 1, transform: `rotate(0deg) translateX(${Math.random() * 100 - 50}px)` },
            { top: window.innerHeight + 'px', opacity: 0, transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 200 - 100}px)` }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

// Show error popup
function showError(message) {
    errorPopup.textContent = `⚠️ ${message}`;
    errorPopup.style.display = 'block';
    setTimeout(() => {
        errorPopup.style.display = 'none';
    }, 3000);
}

// Show the winner
function showWinner(winner) {
    winnerName.textContent = winner;
    
    // Add winner to previous winners list
    previousWinners.unshift(winner);
    updatePreviousWinners();
    
    overlay.style.display = 'block';
    winnerDialog.style.display = 'block';
}

// Update the previous winners display
function updatePreviousWinners() {
    previousWinnersDiv.textContent = previousWinners.length > 0
        ? previousWinners.join('\n')
        : 'No winners yet';
}

// Close winner dialog
function closeWinnerDialog() {
    overlay.style.display = 'none';
    winnerDialog.style.display = 'none';
}

// Remove winner from options
function removeWinner() {
    const winner = winnerName.textContent;
    options = options.filter(option => option !== winner);
    nameInput.value = options.join('\n');
    closeWinnerDialog();
    drawWheel();
}

// Shuffle options
function shuffleOptions() {
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    nameInput.value = options.join('\n');
    drawWheel();
}

// Clear all options
function clearOptions() {
    options = [];
    nameInput.value = '';
    drawWheel();
}

// Update options from textarea
function updateOptions() {
    options = nameInput.value.split('\n')
        .map(option => option.trim())
        .filter(option => option.length > 0)
        .slice(0, 100);
    nameInput.value = options.join('\n');
    drawWheel();
}

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}Tab`).classList.add('active');
    });
});

// Event listeners
wheelCanvas.addEventListener('click', spinWheel);
shuffleButton.addEventListener('click', shuffleOptions);
clearButton.addEventListener('click', clearOptions);
closeDialogBtn.addEventListener('click', closeWinnerDialog);
removeWinnerBtn.addEventListener('click', removeWinner);
nameInput.addEventListener('input', updateOptions);

// Handle Enter key in textarea
nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const start = nameInput.selectionStart;
        const end = nameInput.selectionEnd;
        nameInput.value = nameInput.value.substring(0, start) + '\n' + nameInput.value.substring(end);
        nameInput.selectionStart = nameInput.selectionEnd = start + 1;
        updateOptions();
    }
});

// Validate duration input
durationInput.addEventListener('change', () => {
    const duration = parseInt(durationInput.value);
    if (duration > 20) {
        showError("Time cannot be over 20 seconds");
        durationInput.value = 20;
    }
});

window.addEventListener('resize', initCanvas);
