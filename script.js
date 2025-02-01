// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server
            // For now, we'll just show an alert
            alert(`Thank you ${name}! Your message has been received. We'll contact you at ${email} soon.`);
            
            // Clear the form
            contactForm.reset();
        });
    }
});

// Add smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to feature cards when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Add active state to navigation links based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Add animation to cards when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.info-card, .group-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Handle join button clicks
document.addEventListener('DOMContentLoaded', function() {
    const joinButtons = document.querySelectorAll('.join-button');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupName = this.parentElement.querySelector('h2').textContent;
            alert(`You have joined ${groupName}!`);
            this.textContent = 'Joined';
            this.style.backgroundColor = '#7f8c8d';
            this.disabled = true;
        });
    });
});

// Handle create group button
document.addEventListener('DOMContentLoaded', function() {
    const createGroupButton = document.querySelector('.group-controls .action-button:last-child');
    if (createGroupButton) {
        createGroupButton.addEventListener('click', function() {
            const groupName = prompt('Enter group name:');
            if (groupName) {
                const groupsGrid = document.querySelector('.groups-grid');
                const newGroupCard = document.createElement('div');
                newGroupCard.className = 'group-card';
                newGroupCard.innerHTML = `
                    <h2>${groupName}</h2>
                    <p>Members: 1</p>
                    <button class="join-button">Join</button>
                `;
                groupsGrid.prepend(newGroupCard);
                
                // Add animation
                newGroupCard.style.opacity = '0';
                newGroupCard.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    newGroupCard.style.opacity = '1';
                    newGroupCard.style.transform = 'translateY(0)';
                }, 10);
            }
        });
    }
});

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const settingsModal = document.getElementById('settingsModal');
    const aboutModal = document.getElementById('aboutModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const languageSelect = document.getElementById('languageSelect');

    // Function to open modal
    const openModal = (modal) => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    // Function to close modal
    const closeModal = (modal) => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    // Event listeners for buttons
    settingsBtn.addEventListener('click', () => openModal(settingsModal));
    aboutBtn.addEventListener('click', () => openModal(aboutModal));

    // Close button event listeners
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Language selection
    if (languageSelect) {
        // Load saved language
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
            document.documentElement.lang = savedLanguage;
        }

        // Handle language change
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            localStorage.setItem('preferredLanguage', selectedLanguage);
            document.documentElement.lang = selectedLanguage;
            
            // Reload page with new language
            // Note: In a real application, you would implement proper
            // internationalization here instead of reloading
            location.reload();
        });
    }
});
