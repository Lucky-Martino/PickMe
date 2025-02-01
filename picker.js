document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const participantsList = document.getElementById('participantsList');
    const participantInput = document.getElementById('participantName');
    const addButton = document.getElementById('addParticipant');
    const spinButton = document.getElementById('spinButton');
    const wheel = document.getElementById('wheel');
    const winnerDisplay = document.getElementById('winnerDisplay');
    const winnersList = document.getElementById('winnersList');
    const fileUpload = document.getElementById('fileUpload');
    const fileInfo = document.getElementById('fileInfo');
    const winnerCount = document.getElementById('winnerCount');
    const editModal = document.getElementById('editModal');
    const editNameInput = document.getElementById('editNameInput');
    const shareModal = document.getElementById('shareModal');
    const pageWinnersList = document.getElementById('pageWinnersList');
    const pageWinnerResults = document.getElementById('pageWinnerResults');
    const saveFormatModal = document.getElementById('saveFormatModal');
    const saveListButton = document.getElementById('saveList');
    const closeSaveFormat = document.getElementById('closeSaveFormat');
    
    // State
    let participants = [];
    let currentWinners = [];
    let isSpinning = false;
    let editingParticipant = null;

    // Clear any existing data
    localStorage.removeItem('pickmeParticipants');
    localStorage.removeItem('currentWinners');
    
    // Reset UI
    updateParticipantsList();
    updateWheel();
    if (winnerDisplay) {
        winnerDisplay.classList.remove('show');
    }
    if (pageWinnerResults) {
        pageWinnerResults.classList.remove('show');
    }

    // Add spin button event listener
    if (spinButton) {
        spinButton.addEventListener('click', spinWheel);
    }

    // Add participant
    function addParticipant(name) {
        name = name.trim();
        if (!name) {
            showError('Please enter a name');
            return;
        }
        
        if (participants.includes(name)) {
            showError('This name is already in the list');
            return;
        }
        
        participants.push(name);
        updateParticipantsList();
        participantInput.value = '';
        
        // Update winner count max value
        if (winnerCount) {
            winnerCount.max = participants.length;
            if (parseInt(winnerCount.value) > participants.length) {
                winnerCount.value = participants.length;
            }
        }

        updateWheel();
        saveToLocalStorage();
        if (spinButton) {
            spinButton.disabled = participants.length < 2;
        }
    }

    // Event listeners for adding participants
    if (addButton) {
        addButton.addEventListener('click', () => {
            addParticipant(participantInput.value);
        });
    }

    if (participantInput) {
        participantInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addParticipant(participantInput.value);
            }
        });
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (participantInput) {
            const container = participantInput.closest('.participant-input-container');
            if (container) {
                const existingError = container.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                container.appendChild(errorDiv);
                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);
            }
        }
    }

    // Update participants list
    function updateParticipantsList() {
        if (!participantsList) return;
        
        participantsList.innerHTML = '';
        participants.forEach((name, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${name}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-button-small edit" onclick="editParticipant(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-button-small delete" onclick="removeParticipant(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            participantsList.appendChild(row);
        });
    }

    // Make functions available globally
    window.removeParticipant = function(index) {
        participants.splice(index, 1);
        updateParticipantsList();
        updateWheel();
        saveToLocalStorage();
        if (spinButton) {
            spinButton.disabled = participants.length < 2;
        }
    };

    window.editParticipant = function(index) {
        editingParticipant = index;
        if (editNameInput && editModal && participants[index]) {
            editNameInput.value = participants[index];
            editModal.classList.add('show');
        }
    };

    // Save edited name
    document.getElementById('saveEdit').addEventListener('click', function() {
        const newName = editNameInput.value.trim();
        if (newName && editingParticipant !== null) {
            if (participants.includes(newName) && newName !== participants[editingParticipant]) {
                alert('This name already exists');
                return;
            }

            participants[editingParticipant] = newName;
            updateParticipantsList();
            updateWheel();
            saveToLocalStorage();
        }
        editModal.classList.remove('show');
        editingParticipant = null;
    });

    // Handle file upload
    fileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        fileInfo.textContent = `Processing: ${fileName}`;

        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                if (fileExtension === 'csv') {
                    // Handle CSV
                    const text = e.target.result;
                    const names = text.split(/\r?\n/)
                        .map(name => name.trim())
                        .filter(name => name.length > 0);
                    processNames(names);
                } else {
                    // Handle Excel
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const names = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
                        .flat()
                        .map(name => String(name).trim())
                        .filter(name => name.length > 0);
                    processNames(names);
                }
                fileInfo.textContent = `Successfully added participants from ${fileName}`;
                setTimeout(() => {
                    fileInfo.textContent = '';
                }, 3000);
            } catch (error) {
                fileInfo.textContent = 'Error processing file. Please check the format.';
                console.error('Error processing file:', error);
            }
        };

        if (fileExtension === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });

    // Process names from file
    function processNames(names) {
        names.forEach(name => addParticipant(name));
    }

    // Save list to local storage
    function saveToLocalStorage() {
        localStorage.setItem('pickmeParticipants', JSON.stringify(participants));
    }

    // Load list from local storage
    function loadFromLocalStorage() {
        const saved = localStorage.getItem('pickmeParticipants');
        if (saved) {
            const savedParticipants = JSON.parse(saved);
            savedParticipants.forEach(name => addParticipant(name));
        }
    }

    // Save list functionality
    saveListButton.addEventListener('click', function() {
        if (participants.length === 0) {
            showError('No participants to save');
            return;
        }
        saveFormatModal.classList.add('show');
    });

    closeSaveFormat.addEventListener('click', function() {
        saveFormatModal.classList.remove('show');
    });

    document.querySelectorAll('.format-option').forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            saveParticipantsList(format);
            saveFormatModal.classList.remove('show');
        });
    });

    function saveParticipantsList(format) {
        if (participants.length === 0) {
            showError('No participants to save');
            return;
        }

        let content, filename, type;

        switch (format) {
            case 'excel':
                // Create workbook
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(
                    participants.map((name, index) => ({ 'No.': index + 1, 'Name': name }))
                );
                XLSX.utils.book_append_sheet(wb, ws, 'Participants');
                content = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                filename = 'participants.xlsx';
                type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                
                // Convert to blob
                const buf = new ArrayBuffer(content.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < content.length; i++) {
                    view[i] = content.charCodeAt(i) & 0xFF;
                }
                content = new Blob([buf], { type });
                break;

            case 'csv':
                content = participants.map((name, index) => `${index + 1},${name}`).join('\n');
                content = 'No.,Name\n' + content;
                content = new Blob([content], { type: 'text/csv' });
                filename = 'participants.csv';
                break;

            case 'txt':
                content = participants.map((name, index) => `${index + 1}. ${name}`).join('\n');
                content = new Blob([content], { type: 'text/plain' });
                filename = 'participants.txt';
                break;
        }

        // Create download link and trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // Reset wheel
    document.getElementById('resetWheel').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset? This will clear all participants.')) {
            participants = [];
            participantsList.innerHTML = '';
            currentWinners = [];
            winnersList.innerHTML = '';
            winnerDisplay.classList.remove('show');
            updateWheel();
            saveToLocalStorage();
            spinButton.disabled = true;
        }
    });

    // Update wheel segments
    function updateWheel() {
        wheel.innerHTML = '<div class="wheel-center"></div><div class="wheel-pointer"></div>';
        
        if (participants.length > 0) {
            const segmentAngle = 360 / participants.length;
            participants.forEach((name, index) => {
                const segment = document.createElement('div');
                segment.className = 'wheel-segment';
                segment.style.transform = `rotate(${index * segmentAngle}deg)`;
                segment.style.backgroundColor = `hsl(${index * (360 / participants.length)}, 70%, 60%)`;
                
                const label = document.createElement('span');
                label.className = 'segment-label';
                label.textContent = name;
                label.style.transform = `rotate(${segmentAngle / 2}deg)`;
                
                segment.appendChild(label);
                wheel.appendChild(segment);
            });
            
            if (spinButton) {
                spinButton.disabled = false;
            }
        } else {
            if (spinButton) {
                spinButton.disabled = true;
            }
        }
    }

    // Spin wheel
    function spinWheel() {
        if (participants.length === 0) {
            showError('Please add at least one participant');
            return;
        }

        const numWinners = parseInt(winnerCount.value);
        
        if (isNaN(numWinners) || numWinners < 1) {
            showError('Please enter a valid number of winners (minimum 1)');
            winnerCount.value = 1;
            return;
        }

        if (numWinners > participants.length) {
            showError(`Cannot pick ${numWinners} winners from ${participants.length} participants`);
            winnerCount.value = participants.length;
            return;
        }
        
        if (isSpinning) {
            showError('Please wait for the current spin to complete');
            return;
        }
        
        isSpinning = true;
        currentWinners = [];
        winnersList.innerHTML = '';
        winnerDisplay.classList.remove('show');
        
        // Get unique winners
        const availableParticipants = [...participants];
        const displayAllAtOnce = document.getElementById('displayAllWinners').checked;
        
        for (let i = 0; i < numWinners; i++) {
            const winnerIndex = Math.floor(Math.random() * availableParticipants.length);
            currentWinners.push(availableParticipants.splice(winnerIndex, 1)[0]);
        }

        if (displayAllAtOnce) {
            // Show all winners after one spin
            spinWheelAnimation(currentWinners[0], () => {
                showWinners(currentWinners);
                isSpinning = false;
            });
        } else {
            // Show winners one by one
            let currentIndex = 0;
            const showNextWinner = () => {
                if (currentIndex < currentWinners.length) {
                    spinWheelAnimation(currentWinners[currentIndex], () => {
                        showWinners([currentWinners[currentIndex]]);
                        currentIndex++;
                        if (currentIndex < currentWinners.length) {
                            // Add "Next Winner" button if there are more winners
                            const nextButton = document.createElement('button');
                            nextButton.className = 'next-winner-button';
                            nextButton.innerHTML = '<i class="fas fa-arrow-right"></i> Next Winner';
                            nextButton.onclick = () => {
                                nextButton.remove();
                                showNextWinner();
                            };
                            winnerDisplay.appendChild(nextButton);
                        } else {
                            isSpinning = false;
                        }
                    });
                }
            };
            showNextWinner();
        }
    }

    // Add event listener for winner count input
    winnerCount.addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value < 1) {
            this.value = 1;
        } else if (value > participants.length) {
            this.value = participants.length;
        }
    });

    // Spin wheel animation
    function spinWheelAnimation(winner, callback) {
        const segmentAngle = 360 / participants.length;
        const winnerIndex = participants.indexOf(winner);
        const targetRotation = 360 - (winnerIndex * segmentAngle) + Math.random() * segmentAngle;
        const totalRotation = 1440 + targetRotation; // 4 full spins + target rotation
        
        wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        wheel.style.transform = `rotate(${totalRotation}deg)`;
        
        const spinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
        spinSound.play().catch(() => {});
        
        setTimeout(() => {
            const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
            winSound.play().catch(() => {});
            callback();
        }, 4000);
    }

    // Show winners
    function showWinners(winners) {
        // Show winners in overlay and prepare page display
        const winnersList = document.getElementById('winnersList');
        const pageWinnersList = document.getElementById('pageWinnersList');
        winnersList.innerHTML = '';
        pageWinnersList.innerHTML = '';
        
        winners.forEach((winner, index) => {
            // Create winner item for overlay
            const winnerItem = document.createElement('div');
            winnerItem.className = 'winner-item';
            winnerItem.style.animationDelay = `${index * 0.2}s`;
            winnerItem.innerHTML = `
                <span class="winner-number">${index + 1}.</span>
                <span class="winner-name">${winner}</span>
            `;
            winnersList.appendChild(winnerItem);
            
            // Create identical winner item for page display
            const pageWinnerItem = document.createElement('div');
            pageWinnerItem.className = 'winner-item';
            pageWinnerItem.style.animationDelay = `${index * 0.2}s`;
            pageWinnerItem.innerHTML = `
                <span class="winner-number">${index + 1}.</span>
                <span class="winner-name">${winner}</span>
            `;
            pageWinnersList.appendChild(pageWinnerItem);
        });

        const winnerDisplay = document.getElementById('winnerDisplay');
        const pageWinnerResults = document.getElementById('pageWinnerResults');
        
        winnerDisplay.classList.add('show');
        pageWinnerResults.classList.remove('show');
        
        playWinSound();
        createConfetti();
    }

    // Close overlay handler
    document.querySelector('.close-overlay').addEventListener('click', function() {
        const winnerDisplay = document.getElementById('winnerDisplay');
        const pageWinnerResults = document.getElementById('pageWinnerResults');
        
        winnerDisplay.classList.remove('show');
        pageWinnerResults.classList.add('show');
        stopConfetti();
    });

    // Pick Again button handlers (both overlay and page)
    document.getElementById('pickAgain').addEventListener('click', function() {
        const winnerDisplay = document.getElementById('winnerDisplay');
        const pageWinnerResults = document.getElementById('pageWinnerResults');
        
        winnerDisplay.classList.remove('show');
        pageWinnerResults.classList.remove('show');
        stopConfetti();
    });

    document.getElementById('pagePickAgain').addEventListener('click', function() {
        const pageWinnerResults = document.getElementById('pageWinnerResults');
        pageWinnerResults.classList.remove('show');
    });

    // Share Results button handlers (both overlay and page)
    document.getElementById('pageShareResults').addEventListener('click', function() {
        shareModal.classList.add('show');
    });

    // Event listeners
    // spinButton.addEventListener('click', spinWheel);

    // Share results
    document.getElementById('shareResults').addEventListener('click', function() {
        shareModal.classList.add('show');
    });

    document.getElementById('closeShare').addEventListener('click', function() {
        shareModal.classList.remove('show');
    });

    // Share buttons
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const text = `Check out the winners: ${currentWinners.join(', ')}`;
            let url;

            switch(platform) {
                case 'facebook':
                    url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
                    break;
                case 'twitter':
                    url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    break;
                case 'whatsapp':
                    url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    break;
                case 'email':
                    url = `mailto:?subject=Lucky Winners&body=${encodeURIComponent(text)}`;
                    break;
            }

            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Initialize
    spinButton.disabled = participants.length < 2;
});

// Add wheel styles
const style = document.createElement('style');
style.textContent = `
    .wheel-segment {
        position: absolute;
        width: 50%;
        height: 2px;
        left: 50%;
        top: 50%;
        transform-origin: left;
        color: white;
    }

    .wheel-segment span {
        position: absolute;
        left: 100%;
        transform: translateX(-50%) rotate(90deg);
        white-space: nowrap;
        font-size: 14px;
        padding: 5px;
    }

    .confetti-piece {
        position: absolute;
        width: 10px;
        height: 10px;
        animation: confetti-fall 3s linear infinite;
    }

    @keyframes confetti-fall {
        0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function playWinSound() {
    const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    winSound.play().catch(() => {});
}

function stopConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
}

function createConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        confetti.appendChild(piece);
    }
}

function stopConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
}

function createConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        confetti.appendChild(piece);
    }
}
