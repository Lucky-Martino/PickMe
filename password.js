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
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const uppercase = document.getElementById('uppercase');
    const lowercase = document.getElementById('lowercase');
    const numbers = document.getElementById('numbers');
    const symbols = document.getElementById('symbols');
    const generateBtn = document.getElementById('generatePassword');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyPassword');
    const saveBtn = document.getElementById('savePassword');
    const resultsSection = document.getElementById('resultsSection');
    const passwordHistory = document.getElementById('passwordHistory');
    const clearHistory = document.getElementById('clearHistory');

    // Character sets
    const CHARS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // State
    let savedPasswords = [];

    // Load saved passwords
    function loadSavedPasswords() {
        const saved = localStorage.getItem('savedPasswords');
        if (saved) {
            savedPasswords = JSON.parse(saved);
            updatePasswordHistory();
        }
    }

    // Save passwords to localStorage
    function savePasswords() {
        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const container = generateBtn.parentElement;
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        container.insertBefore(errorDiv, generateBtn);
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Show success message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const container = generateBtn.parentElement;
        const existingSuccess = container.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        container.insertBefore(successDiv, generateBtn);
        setTimeout(() => {
            successDiv.remove();
        }, 2000);
    }

    // Generate password
    function generatePassword() {
        let chars = '';
        let password = '';

        // Validate at least one option is selected
        if (!uppercase.checked && !lowercase.checked && !numbers.checked && !symbols.checked) {
            showError('Please select at least one character type');
            return;
        }

        // Build character set
        if (uppercase.checked) chars += CHARS.uppercase;
        if (lowercase.checked) chars += CHARS.lowercase;
        if (numbers.checked) chars += CHARS.numbers;
        if (symbols.checked) chars += CHARS.symbols;

        // Generate password
        const length = parseInt(passwordLength.value);
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Ensure password contains at least one character from each selected type
        let finalPassword = password;
        if (uppercase.checked && !/[A-Z]/.test(finalPassword)) {
            const pos = Math.floor(Math.random() * length);
            finalPassword = finalPassword.substring(0, pos) + 
                          CHARS.uppercase.charAt(Math.floor(Math.random() * CHARS.uppercase.length)) +
                          finalPassword.substring(pos + 1);
        }
        if (lowercase.checked && !/[a-z]/.test(finalPassword)) {
            const pos = Math.floor(Math.random() * length);
            finalPassword = finalPassword.substring(0, pos) + 
                          CHARS.lowercase.charAt(Math.floor(Math.random() * CHARS.lowercase.length)) +
                          finalPassword.substring(pos + 1);
        }
        if (numbers.checked && !/[0-9]/.test(finalPassword)) {
            const pos = Math.floor(Math.random() * length);
            finalPassword = finalPassword.substring(0, pos) + 
                          CHARS.numbers.charAt(Math.floor(Math.random() * CHARS.numbers.length)) +
                          finalPassword.substring(pos + 1);
        }
        if (symbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(finalPassword)) {
            const pos = Math.floor(Math.random() * length);
            finalPassword = finalPassword.substring(0, pos) + 
                          CHARS.symbols.charAt(Math.floor(Math.random() * CHARS.symbols.length)) +
                          finalPassword.substring(pos + 1);
        }

        passwordOutput.value = finalPassword;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Copy password
    function copyPassword() {
        passwordOutput.select();
        document.execCommand('copy');
        showSuccess('Password copied to clipboard!');
    }

    // Save password
    function saveCurrentPassword() {
        const password = passwordOutput.value;
        if (!password) {
            showError('No password to save');
            return;
        }

        const timestamp = new Date().toLocaleString();
        savedPasswords.unshift({ password, timestamp });
        savePasswords();
        updatePasswordHistory();
        showSuccess('Password saved!');
    }

    // Update password history
    function updatePasswordHistory() {
        passwordHistory.innerHTML = '';
        savedPasswords.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'password-item';
            historyItem.innerHTML = `
                <div class="password-info">
                    <div class="password-text">${item.password}</div>
                    <div class="password-timestamp">${item.timestamp}</div>
                </div>
                <div class="password-actions">
                    <button onclick="copyHistoryPassword(${index})" class="action-button-small">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="deleteHistoryPassword(${index})" class="action-button-small">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            passwordHistory.appendChild(historyItem);
        });
    }

    // Copy history password
    window.copyHistoryPassword = function(index) {
        const password = savedPasswords[index].password;
        navigator.clipboard.writeText(password).then(() => {
            showSuccess('Password copied!');
        }).catch(() => {
            showError('Failed to copy password');
        });
    }

    // Delete history password
    window.deleteHistoryPassword = function(index) {
        savedPasswords.splice(index, 1);
        savePasswords();
        updatePasswordHistory();
    }

    // Event listeners
    passwordLength.addEventListener('input', () => {
        lengthValue.textContent = passwordLength.value;
    });

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    saveBtn.addEventListener('click', saveCurrentPassword);
    clearHistory.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved passwords?')) {
            savedPasswords = [];
            savePasswords();
            updatePasswordHistory();
        }
    });

    // Initialize
    loadSavedPasswords();
});
