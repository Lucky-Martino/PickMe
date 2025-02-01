class TeamCreator {
    constructor() {
        this.members = [];
        this.currentTeams = [];
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.memberInput = document.getElementById('memberName');
        this.addButton = document.getElementById('addMember');
        this.fileUpload = document.getElementById('fileUpload');
        this.fileInfo = document.getElementById('fileInfo');
        this.membersList = document.getElementById('membersList');
        this.groupCount = document.getElementById('groupCount');
        this.groupSize = document.getElementById('groupSize');
        this.groupBy = document.getElementById('groupBy');
        this.generateButton = document.getElementById('generateTeams');
        this.resultsSection = document.getElementById('resultsSection');
        this.teamsGrid = document.getElementById('teamsGrid');
        this.exportFormat = document.getElementById('exportFormat');
        this.exportButton = document.getElementById('exportResults');
        this.shareButton = document.getElementById('shareResults');
        this.shareModal = document.getElementById('shareModal');
        this.closeShare = document.getElementById('closeShare');
        this.clearListButton = document.getElementById('clearList');
        
        // Initialize share buttons
        const shareOptions = document.querySelectorAll('.share-option');
        shareOptions.forEach(button => {
            button.addEventListener('click', () => this.handleShare(button.dataset.platform));
        });
    }

    showError(message) {
        if (!this.memberInput) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const container = this.memberInput.closest('.manual-input');
        if (!container) return;
        
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        container.appendChild(errorDiv);
        this.memberInput.classList.add('input-error');
        
        setTimeout(() => {
            errorDiv.remove();
            this.memberInput.classList.remove('input-error');
        }, 3000);
    }

    addMember(name = null) {
        const memberName = name || this.memberInput.value.trim();
        
        if (!memberName) {
            this.showError('Please enter a member name');
            return;
        }
        
        if (this.members.includes(memberName)) {
            this.showError('Member already exists');
            return;
        }
        
        this.members.push(memberName);
        if (!name) {
            this.memberInput.value = '';
        }
        
        this.updateMembersList();
        this.updateButtonStates();
    }

    updateButtonStates() {
        const hasMembers = this.members.length > 0;
        this.generateButton.disabled = !hasMembers;
        this.clearListButton.style.display = hasMembers ? 'inline-flex' : 'none';
        
        if (hasMembers) {
            this.generateButton.classList.add('active');
        } else {
            this.generateButton.classList.remove('active');
        }
    }

    updateMembersList() {
        if (!this.membersList) return;
        
        this.membersList.innerHTML = '';
        this.members.forEach((member, index) => {
            const memberElement = document.createElement('div');
            memberElement.className = 'member-item';
            memberElement.innerHTML = `
                <span class="member-name">${member}</span>
                <div class="member-actions">
                    <button class="edit-btn" onclick="teamCreator.editMember(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="remove-btn" onclick="teamCreator.removeMember(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            this.membersList.appendChild(memberElement);
        });
    }

    initializeEventListeners() {
        this.memberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addMember();
            }
        });
        
        this.addButton.addEventListener('click', () => this.addMember());
        
        this.clearListButton.addEventListener('click', () => {
            this.members = [];
            this.currentTeams = [];
            this.updateMembersList();
            this.updateButtonStates();
            this.resultsSection.style.display = 'none';
        });
        
        this.groupBy.addEventListener('change', () => {
            const isCountBased = this.groupBy.value === 'count';
            document.querySelector('.group-count-setting').style.display = isCountBased ? 'block' : 'none';
            document.querySelector('.group-size-setting').style.display = isCountBased ? 'none' : 'block';
        });
        
        this.generateButton.addEventListener('click', () => this.generateTeams());
        this.exportButton.addEventListener('click', () => this.exportResults());
        this.shareButton.addEventListener('click', () => this.shareModal.style.display = 'block');
        this.closeShare.addEventListener('click', () => this.shareModal.style.display = 'none');
        
        window.addEventListener('click', (e) => {
            if (e.target === this.shareModal) {
                this.shareModal.style.display = 'none';
            }
        });
    }

    removeMember(index) {
        this.members.splice(index, 1);
        this.updateMembersList();
        this.updateButtonStates();
    }

    editMember(index) {
        const memberElement = this.membersList.children[index];
        const memberNameSpan = memberElement.querySelector('.member-name');
        const currentName = memberNameSpan.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'edit-input';
        
        memberNameSpan.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', () => this.finishEdit(input, index, currentName));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.finishEdit(input, index, currentName);
            }
        });
    }

    finishEdit(input, index, currentName) {
        const newName = input.value.trim();
        if (newName && newName !== currentName) {
            this.members[index] = newName;
            this.updateMembersList();
        } else {
            input.replaceWith(document.createElement('span').className = 'member-name', input.value = currentName);
        }
    }

    generateTeams() {
        if (this.members.length < 2) {
            this.showError('Add at least 2 members to generate teams');
            return;
        }
        
        const isCountBased = this.groupBy.value === 'count';
        const shuffledMembers = [...this.members].sort(() => Math.random() - 0.5);
        let teams = [];
        
        if (isCountBased) {
            const numTeams = parseInt(this.groupCount.value);
            if (numTeams < 2 || numTeams > this.members.length) {
                this.showError(`Number of teams should be between 2 and ${this.members.length}`);
                return;
            }
            
            teams = Array(numTeams).fill().map(() => []);
            shuffledMembers.forEach((member, index) => {
                teams[index % numTeams].push(member);
            });
        } else {
            const teamSize = parseInt(this.groupSize.value);
            if (teamSize < 2 || teamSize > this.members.length) {
                this.showError(`Team size should be between 2 and ${this.members.length}`);
                return;
            }
            
            for (let i = 0; i < shuffledMembers.length; i += teamSize) {
                teams.push(shuffledMembers.slice(i, i + teamSize));
            }
        }
        
        this.currentTeams = teams;
        this.displayTeams(teams);
        this.resultsSection.style.display = 'block';
    }

    displayTeams(teams) {
        this.teamsGrid.innerHTML = '';
        teams.forEach((team, index) => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            teamCard.innerHTML = `
                <h3>Team ${index + 1}</h3>
                <ul>
                    ${team.map(member => `<li>${member}</li>`).join('')}
                </ul>
            `;
            this.teamsGrid.appendChild(teamCard);
        });
    }

    exportResults() {
        if (!this.currentTeams.length) return;
        
        const format = this.exportFormat.value;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `teams_${timestamp}`;
        
        switch (format) {
            case 'pdf':
                this.exportToPDF(filename);
                break;
            case 'excel':
                this.exportToExcel(filename);
                break;
            case 'csv':
                this.exportToCSV(filename);
                break;
            case 'text':
                this.exportToText(filename);
                break;
        }
    }

    exportToPDF(filename) {
        const element = document.createElement('div');
        element.innerHTML = `
            <h2>Generated Teams</h2>
            ${this.teamsGrid.innerHTML}
        `;
        
        html2pdf()
            .from(element)
            .save(`${filename}.pdf`);
    }

    exportToExcel(filename) {
        const wb = XLSX.utils.book_new();
        const ws_data = this.currentTeams.map((team, index) => [`Team ${index + 1}`, ...team]);
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'Teams');
        XLSX.writeFile(wb, `${filename}.xlsx`);
    }

    exportToCSV(filename) {
        let csv = this.currentTeams.map((team, index) => 
            [`Team ${index + 1}`, ...team].join(',')
        ).join('\\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    }

    exportToText(filename) {
        let text = this.currentTeams.map((team, index) => 
            `Team ${index + 1}:\\n${team.join('\\n')}`
        ).join('\\n\\n');
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.txt`;
        link.click();
    }

    handleShare(platform) {
        const teamsText = this.getTeamsText();
        const encodedText = encodeURIComponent(teamsText);
        const title = encodeURIComponent('My PickMe Teams');
        
        switch (platform) {
            case 'email':
                window.location.href = `mailto:?subject=${title}&body=${encodedText}`;
                break;
                
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodedText}`, '_blank');
                break;
                
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedText}`, '_blank');
                break;
                
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${window.location.href}`, '_blank');
                break;
                
            case 'linkedin':
                window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${title}&summary=${encodedText}`, '_blank');
                break;
                
            case 'telegram':
                window.open(`https://t.me/share/url?url=${window.location.href}&text=${encodedText}`, '_blank');
                break;
                
            case 'copy':
                navigator.clipboard.writeText(teamsText)
                    .then(() => this.showShareSuccess('Text copied to clipboard!'))
                    .catch(() => this.showShareError('Failed to copy text'));
                break;
        }
        
        // Close the modal after sharing
        this.shareModal.style.display = 'none';
    }
    
    getTeamsText() {
        if (!this.currentTeams.length) return '';
        
        let text = 'Teams Generated by PickMe:\n\n';
        this.currentTeams.forEach((team, index) => {
            text += `Team ${index + 1}:\n`;
            team.forEach(member => text += `- ${member}\n`);
            text += '\n';
        });
        return text;
    }
    
    showShareSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    showShareError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();
        
        this.fileInfo.textContent = `Processing: ${file.name}`;
        
        reader.onload = (e) => {
            try {
                if (fileExtension === 'csv') {
                    this.processCSV(e.target.result);
                } else {
                    this.processExcel(e.target.result);
                }
                this.fileInfo.textContent = `Successfully imported: ${file.name}`;
            } catch (error) {
                this.fileInfo.textContent = `Error processing file: ${error.message}`;
            }
        };
        
        if (fileExtension === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    processCSV(csv) {
        const lines = csv.split(/\\r?\\n/);
        const names = lines.map(line => line.trim()).filter(line => line);
        this.processNames(names);
    }

    processExcel(data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        const names = jsonData.flat().map(item => String(item).trim()).filter(item => item);
        this.processNames(names);
    }

    processNames(names) {
        names.forEach(name => {
            if (!this.members.includes(name)) {
                this.members.push(name);
            }
        });
        this.updateMembersList();
        this.updateButtonStates();
    }
}

const teamCreator = new TeamCreator();

document.addEventListener('DOMContentLoaded', () => {
    teamCreator.fileUpload.addEventListener('change', teamCreator.handleFileUpload.bind(teamCreator));
});
