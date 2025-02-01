document.addEventListener('DOMContentLoaded', function() {
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

    // DOM Elements
    const minNumber = document.getElementById('minNumber');
    const maxNumber = document.getElementById('maxNumber');
    const resultCount = document.getElementById('resultCount');
    const generateButton = document.getElementById('generateNumbers');
    const resultsSection = document.getElementById('resultsSection');
    const numbersGrid = document.getElementById('numbersGrid');
    const copyResults = document.getElementById('copyResults');
    const shareResults = document.getElementById('shareResults');
    const favoriteNumber = document.getElementById('favoriteNumber');
    const addFavorite = document.getElementById('addFavorite');
    const favoritesList = document.getElementById('favoritesList');
    const includeFavorites = document.getElementById('includeFavorites');
    const historyList = document.getElementById('historyList');
    const exportHistory = document.getElementById('exportHistory');
    const clearHistory = document.getElementById('clearHistory');

    // State
    let currentResults = [];
    let favoriteNumbers = new Set();
    let generationHistory = [];

    // Load saved data
    function loadSavedData() {
        const savedFavorites = localStorage.getItem('favoriteNumbers');
        if (savedFavorites) {
            favoriteNumbers = new Set(JSON.parse(savedFavorites));
            updateFavoritesList();
        }

        const savedHistory = localStorage.getItem('numberHistory');
        if (savedHistory) {
            generationHistory = JSON.parse(savedHistory);
            updateHistoryList();
        }
    }

    // Save data
    function saveData() {
        localStorage.setItem('favoriteNumbers', JSON.stringify([...favoriteNumbers]));
        localStorage.setItem('numberHistory', JSON.stringify(generationHistory));
    }

    // Add favorite number
    function addFavoriteNumber() {
        const num = parseInt(favoriteNumber.value);
        if (isNaN(num)) {
            showError('Please enter a valid number');
            return;
        }

        if (favoriteNumbers.has(num)) {
            showError('This number is already in favorites');
            return;
        }

        favoriteNumbers.add(num);
        favoriteNumber.value = '';
        updateFavoritesList();
        saveData();
    }

    // Update favorites list
    function updateFavoritesList() {
        favoritesList.innerHTML = '';
        [...favoriteNumbers].sort((a, b) => a - b).forEach(num => {
            const tag = document.createElement('div');
            tag.className = 'favorite-tag';
            tag.innerHTML = `
                ${num}
                <button onclick="removeFavorite(${num})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            favoritesList.appendChild(tag);
        });
    }

    // Remove favorite
    window.removeFavorite = function(num) {
        favoriteNumbers.delete(num);
        updateFavoritesList();
        saveData();
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const container = generateButton.parentElement;
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        container.insertBefore(errorDiv, generateButton);
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Generate random number between min and max (inclusive)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate unique random numbers
    function generateUniqueNumbers(min, max, count) {
        const numbers = new Set();
        
        // Add favorite numbers if requested
        if (includeFavorites.checked) {
            favoriteNumbers.forEach(num => {
                if (num >= min && num <= max) {
                    numbers.add(num);
                }
            });
        }

        // Generate additional random numbers if needed
        while (numbers.size < count) {
            numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
        }

        return Array.from(numbers).sort((a, b) => a - b);
    }

    // Display results
    function displayResults(numbers) {
        numbersGrid.innerHTML = '';
        
        numbers.forEach(number => {
            const numberCard = document.createElement('div');
            numberCard.className = 'number-card';
            numberCard.innerHTML = `
                <div class="number-value">${number}</div>
            `;
            numbersGrid.appendChild(numberCard);
        });

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Add to history
    function addToHistory(numbers) {
        const timestamp = new Date().toLocaleString();
        generationHistory.unshift({
            timestamp,
            numbers: [...numbers],
            min: parseInt(minNumber.value),
            max: parseInt(maxNumber.value)
        });
        updateHistoryList();
        saveData();
    }

    // Update history list
    function updateHistoryList() {
        historyList.innerHTML = '';
        generationHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>
                    <div class="history-timestamp">${item.timestamp}</div>
                    <div class="history-numbers">${item.numbers.join(', ')}</div>
                    <div class="history-range">Range: ${item.min} - ${item.max}</div>
                </div>
                <div class="history-actions-group">
                    <button onclick="copyHistoryItem(${index})">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="removeHistoryItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    // Export history to Excel
    function exportHistoryToExcel() {
        const ws_data = generationHistory.map(item => ({
            'Timestamp': item.timestamp,
            'Numbers': item.numbers.join(', '),
            'Range': `${item.min} - ${item.max}`
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'Number History');
        
        const filename = `random-numbers-history-${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, filename);
    }

    // Copy history item
    window.copyHistoryItem = function(index) {
        const numbers = generationHistory[index].numbers.join(', ');
        navigator.clipboard.writeText(numbers).then(() => {
            showSuccess('Copied to clipboard!');
        }).catch(err => {
            showError('Failed to copy');
        });
    }

    // Remove history item
    window.removeHistoryItem = function(index) {
        generationHistory.splice(index, 1);
        updateHistoryList();
        saveData();
    }

    // Generate numbers
    function generateNumbers() {
        const min = parseInt(minNumber.value);
        const max = parseInt(maxNumber.value);
        const count = parseInt(resultCount.value);

        // Validation
        if (isNaN(min) || isNaN(max) || isNaN(count)) {
            showError('Please enter valid numbers');
            return;
        }

        if (min >= max) {
            showError('Maximum number must be greater than minimum number');
            return;
        }

        if (count < 1) {
            showError('Number of results must be at least 1');
            return;
        }

        const numbers = generateUniqueNumbers(min, max, count);
        if (numbers) {
            currentResults = numbers;
            displayResults(numbers);
            addToHistory(numbers);
        }
    }

    // Copy results
    function copyResultsToClipboard() {
        const text = currentResults.join(', ');
        navigator.clipboard.writeText(text).then(() => {
            const button = copyResults;
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            showError('Failed to copy results');
        });
    }

    // Share results
    function shareResultsHandler() {
        const text = `Random Numbers Generated:\n${currentResults.join(', ')}`;

        if (navigator.share) {
            navigator.share({
                title: 'Random Numbers',
                text: text
            }).catch(console.error);
        } else {
            copyResultsToClipboard();
        }
    }

    // Input validation
    function validateNumberInput(input) {
        const value = parseInt(input.value);
        if (isNaN(value)) {
            input.value = input.getAttribute('min') || 0;
        }
    }

    // Event listeners
    generateButton.addEventListener('click', generateNumbers);
    copyResults.addEventListener('click', copyResultsToClipboard);
    shareResults.addEventListener('click', shareResultsHandler);
    
    [minNumber, maxNumber, resultCount].forEach(input => {
        input.addEventListener('blur', () => validateNumberInput(input));
    });

    addFavorite.addEventListener('click', addFavoriteNumber);
    favoriteNumber.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFavoriteNumber();
        }
    });

    exportHistory.addEventListener('click', exportHistoryToExcel);
    clearHistory.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history?')) {
            generationHistory = [];
            updateHistoryList();
            saveData();
        }
    });

    // Initialize
    loadSavedData();
});
