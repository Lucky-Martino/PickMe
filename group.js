// DOM Elements
let memberInput, addButton, fileUpload, fileInfo, membersList, groupCount, 
    groupSize, groupBy, generateButton, resetButton, resultsSection, 
    groupsGrid, exportFormat, exportButton, shareButton, shareModal, 
    closeShare, clearListButton;

// State
let members = [];
let currentGroups = [];

// Initialize DOM Elements
function initializeElements() {
    memberInput = document.getElementById('memberName');
    addButton = document.getElementById('addMember');
    fileUpload = document.getElementById('fileUpload');
    fileInfo = document.getElementById('fileInfo');
    membersList = document.getElementById('membersList');
    groupCount = document.getElementById('groupCount');
    groupSize = document.getElementById('groupSize');
    groupBy = document.getElementById('groupBy');
    generateButton = document.getElementById('generateGroups');
    resetButton = document.getElementById('resetGroups');
    resultsSection = document.getElementById('resultsSection');
    groupsGrid = document.getElementById('groupsGrid');
    exportFormat = document.getElementById('exportFormat');
    exportButton = document.getElementById('exportResults');
    shareButton = document.getElementById('shareResults');
    shareModal = document.getElementById('shareModal');
    closeShare = document.getElementById('closeShare');
    clearListButton = document.getElementById('clearList');
}

// Show error message
function showError(message) {
    if (!memberInput) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const container = memberInput.closest('.manual-input');
    if (!container) return;
    
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    container.appendChild(errorDiv);
    memberInput.classList.add('input-error');
    
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.remove();
        }
        if (memberInput) {
            memberInput.classList.remove('input-error');
        }
    }, 3000);
}

// Add member
function addMember(name) {
    if (!name || typeof name !== 'string') {
        showError('Please enter a name');
        return false;
    }

    name = name.trim();
    
    // Basic validation
    if (!name) {
        showError('Please enter a name');
        return false;
    }

    if (name.length < 2) {
        showError('Name must be at least 2 characters long');
        return false;
    }

    if (name.length > 50) {
        showError('Name cannot be longer than 50 characters');
        return false;
    }

    // Check for invalid characters
    const nameRegex = /^[a-zA-Z0-9\s\-'.]+$/;
    if (!nameRegex.test(name)) {
        showError('Name contains invalid characters. Only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed.');
        return false;
    }
    
    if (members.includes(name)) {
        showError('This member is already in the list');
        return false;
    }
    
    members.push(name);
    updateMembersList();
    
    if (memberInput) {
        memberInput.value = '';
        memberInput.focus();
        memberInput.classList.remove('input-error');
        const container = memberInput.closest('.manual-input');
        if (container) {
            const existingError = container.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    }
    
    updateButtonStates();
    return true;
}

// Update button states
function updateButtonStates() {
    if (addButton && memberInput) {
        addButton.disabled = !memberInput.value.trim();
    }

    if (generateButton) {
        generateButton.disabled = members.length < 2;
    }

    if (clearListButton) {
        clearListButton.disabled = members.length === 0;
    }

    if (resetButton) {
        resetButton.style.display = members.length >= 2 ? 'block' : 'none';
    }

    if (resultsSection) {
        resultsSection.style.display = 'none';
    }

    if (groupCount) {
        const maxGroups = Math.floor(members.length / 2) || 2;
        groupCount.max = maxGroups;
        if (parseInt(groupCount.value) > maxGroups) {
            groupCount.value = maxGroups;
        }
        groupCount.disabled = members.length < 2;
    }

    if (groupSize) {
        const maxSize = members.length - 1 || 2;
        groupSize.max = maxSize;
        if (parseInt(groupSize.value) > maxSize) {
            groupSize.value = maxSize;
        }
        groupSize.disabled = members.length < 2;
    }
}

// Update members list
function updateMembersList() {
    if (!membersList) return;
    
    membersList.innerHTML = '';
    members.forEach((name, index) => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'member-actions';
        
        const editButton = document.createElement('button');
        editButton.className = 'action-button-small edit';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.onclick = () => editMember(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button-small delete';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.onclick = () => removeMember(index);
        
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        
        memberItem.appendChild(nameSpan);
        memberItem.appendChild(actionsDiv);
        membersList.appendChild(memberItem);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    if (addButton && memberInput) {
        addButton.onclick = () => addMember(memberInput.value);
        
        memberInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addMember(memberInput.value);
            }
        };

        memberInput.oninput = () => {
            const name = memberInput.value.trim();
            if (addButton) {
                addButton.disabled = !name;
            }
            memberInput.classList.remove('input-error');
            const container = memberInput.closest('.manual-input');
            if (container) {
                const existingError = container.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
        };
    }

    if (clearListButton) {
        clearListButton.onclick = () => {
            if (members.length === 0) {
                showError('No members to clear');
                return;
            }
            
            if (confirm('Are you sure you want to clear all members?')) {
                members = [];
                updateMembersList();
                updateButtonStates();
                if (resultsSection) {
                    resultsSection.style.display = 'none';
                }
                if (resetButton) {
                    resetButton.style.display = 'none';
                }
            }
        };
    }
}

// Remove member
function removeMember(index) {
    members.splice(index, 1);
    updateMembersList();
    updateButtonStates();
    
    // Hide results and reset button if less than 2 members
    if (members.length < 2) {
        resultsSection.style.display = 'none';
        resetButton.style.display = 'none';
    }
}

// Edit member
function editMember(index) {
    const name = members[index];
    const newName = prompt('Edit member name:', name);
    
    if (newName && newName.trim()) {
        const trimmedName = newName.trim();
        
        if (trimmedName === name) {
            return; // No change
        }
        
        if (members.includes(trimmedName)) {
            showError('This name already exists');
            return;
        }
        
        members[index] = trimmedName;
        updateMembersList();
        
        // Update groups if they exist
        if (currentGroups.length > 0) {
            generateGroups();
        }
    }
}

// Generate groups
function generateGroups() {
    const totalMembers = members.length;
    let numGroups;
    let membersPerGroup;

    if (groupBy.value === 'count') {
        numGroups = parseInt(groupCount.value);
        
        // Validate number of groups
        if (numGroups < 2) {
            showError('Number of groups must be at least 2');
            return;
        }
        if (numGroups > totalMembers) {
            showError('Number of groups cannot be more than the number of members');
            return;
        }
        
        membersPerGroup = Math.floor(totalMembers / numGroups);
    } else {
        membersPerGroup = parseInt(groupSize.value);
        
        // Validate members per group
        if (membersPerGroup < 2) {
            showError('Members per group must be at least 2');
            return;
        }
        if (membersPerGroup > totalMembers) {
            showError('Members per group cannot be more than total members');
            return;
        }
        
        numGroups = Math.ceil(totalMembers / membersPerGroup);
    }

    // Additional validation
    if (totalMembers < 2) {
        showError('Add at least 2 members to generate groups');
        return;
    }

    // Shuffle members
    const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
    
    // Create groups
    currentGroups = Array.from({ length: numGroups }, () => []);
    
    // Distribute members evenly
    shuffledMembers.forEach((member, index) => {
        const groupIndex = index % numGroups;
        currentGroups[groupIndex].push(member);
    });

    // Show results
    displayGroups(currentGroups);
    resetButton.style.display = 'block';
    resultsSection.style.display = 'block';
}

// Add input validation for group settings
groupCount.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 2) {
        this.value = 2;
    }
    if (members.length > 0 && value > members.length) {
        this.value = members.length;
    }
});

groupSize.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 2) {
        this.value = 2;
    }
    if (members.length > 0 && value > members.length) {
        this.value = members.length;
    }
});

// Reset and regenerate
resetButton.addEventListener('click', generateGroups);

// Display groups
function displayGroups(groups) {
    groupsGrid.innerHTML = '';
    groups.forEach((group, index) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.innerHTML = `
            <h3>Group ${index + 1}</h3>
            <ul>
                ${group.map(member => `<li>${member}</li>`).join('')}
            </ul>
        `;
        groupsGrid.appendChild(groupCard);
    });
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Export functionality
async function exportResults() {
    const format = exportFormat.value;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `groups-${timestamp}`;

    switch (format) {
        case 'pdf':
            await exportToPDF(filename);
            break;
        case 'excel':
            exportToExcel(filename);
            break;
        case 'csv':
            exportToCSV(filename);
            break;
        case 'text':
            exportToText(filename);
            break;
    }
}

// Export to PDF
async function exportToPDF(filename) {
    const element = document.getElementById('groupsGrid');
    const opt = {
        margin: 1,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    await html2pdf().set(opt).from(element).save();
}

// Export to Excel
function exportToExcel(filename) {
    const wb = XLSX.utils.book_new();
    const ws_data = currentGroups.map((group, index) => ({
        'Group': `Group ${index + 1}`,
        'Members': group.join(', ')
    }));
    const ws = XLSX.utils.json_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Groups');
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Export to CSV
function exportToCSV(filename) {
    let csv = 'Group,Members\n';
    currentGroups.forEach((group, index) => {
        csv += `Group ${index + 1},"${group.join(', ')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
}

// Export to Text
function exportToText(filename) {
    let text = 'Generated Groups\n\n';
    currentGroups.forEach((group, index) => {
        text += `Group ${index + 1}:\n${group.join('\n')}\n\n`;
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
}

// Share functionality
function shareResults() {
    const text = currentGroups.map((group, index) => 
        `Group ${index + 1}:\n${group.join('\n')}`
    ).join('\n\n');

    if (navigator.share) {
        navigator.share({
            title: 'My Generated Groups',
            text: text
        }).catch(console.error);
    } else {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Groups copied to clipboard!');
        }).catch(console.error);
    }
}

// File upload handling
fileUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = function(e) {
        let data;
        if (fileExtension === 'csv') {
            data = e.target.result;
            processCSV(data);
        } else {
            data = new Uint8Array(e.target.result);
            processExcel(data);
        }
    };

    if (fileExtension === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }

    fileInfo.textContent = `File loaded: ${file.name}`;
});

function processCSV(csv) {
    const lines = csv.split('\n');
    const names = lines.map(line => line.trim()).filter(name => name);
    processNames(names);
}

function processExcel(data) {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const names = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
        .flat()
        .map(name => String(name).trim())
        .filter(name => name);
    processNames(names);
}

function processNames(names) {
    names.forEach(name => {
        if (!members.includes(name)) {
            members.push(name);
        }
    });
    updateMembersList();
    updateButtonStates();
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeEventListeners();
    updateButtonStates();

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
});
