// DOM Elements
let diceCount, rollButton, diceWrapper, totalResult, individualResults;
let rollSound, impactSound;
let isRolling = false;

// Initialize particles.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });

    // Initialize elements
    initializeElements();
    // Add event listeners
    addEventListeners();
    // Preload sounds
    preloadSounds();
});

function initializeElements() {
    diceCount = document.getElementById('diceCount');
    rollButton = document.getElementById('rollButton');
    diceWrapper = document.getElementById('diceWrapper');
    totalResult = document.getElementById('totalResult');
    individualResults = document.getElementById('individualResults');
    rollSound = document.getElementById('rollSound');
    impactSound = document.getElementById('impactSound');
}

function preloadSounds() {
    // Set volume for sounds
    if (rollSound) rollSound.volume = 0.6;
    if (impactSound) impactSound.volume = 0.4;
    
    // Preload sounds
    rollSound?.load();
    impactSound?.load();
}

function addEventListeners() {
    rollButton.addEventListener('click', () => {
        if (!isRolling) rollDice();
    });
    
    diceCount.addEventListener('input', () => {
        const value = parseInt(diceCount.value);
        if (value < 1) diceCount.value = 1;
        if (value > 5) diceCount.value = 5;
    });
}

function createDice() {
    const dice = document.createElement('div');
    dice.className = 'dice';
    
    // Create 9 dots (3x3 grid)
    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dice.appendChild(dot);
    }
    
    return dice;
}

function setDiceValue(dice, value) {
    // Clear previous value
    dice.setAttribute('data-value', value);
    
    // Reset all dots
    const dots = dice.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        dot.style.background = 'transparent';
    });
    
    // Set dots based on value with staggered animation
    const activeDots = [];
    switch (value) {
        case 1:
            activeDots.push(4); // Center
            break;
        case 2:
            activeDots.push(0, 8); // Top left, Bottom right
            break;
        case 3:
            activeDots.push(0, 4, 8); // Top left, Center, Bottom right
            break;
        case 4:
            activeDots.push(0, 2, 6, 8); // Corners
            break;
        case 5:
            activeDots.push(0, 2, 4, 6, 8); // Corners + Center
            break;
        case 6:
            activeDots.push(0, 2, 3, 5, 6, 8); // All sides
            break;
    }
    
    // Animate dots with staggered delay
    activeDots.forEach((dotIndex, i) => {
        setTimeout(() => {
            dots[dotIndex].style.background = '#333';
            dots[dotIndex].classList.add('active');
        }, i * 50);
    });
}

async function rollDice() {
    if (isRolling) return;
    isRolling = true;
    
    const numDice = parseInt(diceCount.value);
    const results = [];
    let total = 0;
    
    // Disable roll button during animation
    rollButton.disabled = true;
    
    // Clear previous dice
    diceWrapper.innerHTML = '';
    individualResults.innerHTML = '';
    totalResult.textContent = '?';
    
    // Play roll sound with fade in
    if (rollSound) {
        rollSound.currentTime = 0;
        rollSound.volume = 0.1;
        rollSound.play();
        // Fade in the sound
        let volume = 0.1;
        const fadeIn = setInterval(() => {
            if (volume < 0.6) {
                volume += 0.1;
                rollSound.volume = volume;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    }
    
    // Create and animate dice with staggered timing
    for (let i = 0; i < numDice; i++) {
        const dice = createDice();
        diceWrapper.appendChild(dice);
        
        // Stagger the start of each dice roll
        setTimeout(() => {
            // Animate rolling
            dice.classList.add('rolling');
            
            // Generate random values during animation
            const rollInterval = setInterval(() => {
                const tempValue = Math.floor(Math.random() * 6) + 1;
                setDiceValue(dice, tempValue);
            }, 100);
            
            // Stop rolling after animation
            setTimeout(() => {
                clearInterval(rollInterval);
                dice.classList.remove('rolling');
                
                const value = Math.floor(Math.random() * 6) + 1;
                setDiceValue(dice, value);
                results.push(value);
                
                // Update total and individual results
                total = results.reduce((sum, num) => sum + num, 0);
                
                // Create individual result element
                const resultElement = document.createElement('div');
                resultElement.className = 'individual-result';
                resultElement.textContent = value;
                individualResults.appendChild(resultElement);
                
                // Update total only after all dice have stopped
                if (results.length === numDice) {
                    setTimeout(() => {
                        totalResult.textContent = total;
                        
                        // Play impact sound
                        if (impactSound) {
                            impactSound.currentTime = 0;
                            impactSound.play();
                        }
                        
                        // Re-enable roll button
                        rollButton.disabled = false;
                        isRolling = false;
                    }, 200);
                }
            }, 1000 + Math.random() * 500); // Random timing for more natural feel
        }, i * 200); // Stagger start of each dice
    }
}
