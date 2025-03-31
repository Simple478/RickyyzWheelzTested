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
window.addEventListener('load', () => {
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
    let size = Math.min(600, Math.min(window.innerWidth, window.innerHeight) * 0.7);
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
            ctx.font = `bold ${14 + Math.floor((options[i].length - 10) / 5)}px Arial`;
            ctx.fillText(options[i], radius - 15, 5);
            ctx.restore();
        }
    }
}

// Spin the wheel
function spinWheel() {
    // Logic goes here...
}

// Other functions go here...

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Logic goes here...
    });
});

// Event listeners
wheelCanvas.addEventListener('click', spinWheel);
shuffleButton.addEventListener('click', () => {
    // Logic goes here...
});
clearButton.addEventListener('click', () => {
    // Logic goes here...
});
closeDialogBtn.addEventListener('click', () => {
    // Logic goes here...
});
removeWinnerBtn.addEventListener('click', () => {
    // Logic goes here...
});
nameInput.addEventListener('input', () => {
    // Logic goes here...
});