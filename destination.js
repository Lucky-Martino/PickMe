// DOM Elements
const elements = {
    destinationType: null,
    pickButton: null,
    destinationCard: null,
    destinationName: null,
    destinationTypeSpan: null,
    destinationRegion: null,
    destinationDescription: null,
    destinationHighlights: null,
    destinationAttractions: null,
    learnMore: null,
    pickAgain: null,
    pickSound: null,
    revealSound: null,
    shareButton: null,
    shareModal: null,
    closeShareModal: null,
    copyLink: null,
    shareButtons: null
};

// Destination data
const destinations = {
    countries: [
        {
            name: "Japan",
            region: "East Asia",
            description: "A fascinating blend of ancient traditions and cutting-edge technology, Japan offers visitors an unforgettable cultural experience. From serene temples to bustling modern cities, the country presents a perfect harmony between old and new.",
            highlights: "• 21 UNESCO World Heritage sites including Mount Fuji and ancient Kyoto\n• Four distinct seasons with cherry blossoms in spring and vibrant autumn colors\n• World-renowned cuisine with regional specialties and traditional tea ceremonies\n• Efficient public transportation system and bullet trains",
            attractions: "• Tokyo: Shibuya Crossing, Senso-ji Temple, Tokyo Skytree\n• Kyoto: Fushimi Inari Shrine, Arashiyama Bamboo Forest, Kinkaku-ji\n• Osaka: Dotonbori, Osaka Castle, Universal Studios Japan\n• Nara: Great Buddha, Deer Park, Todaiji Temple",
            moreInfo: "https://www.japan.travel/en/"
        },
        {
            name: "New Zealand",
            region: "Oceania",
            description: "A country of breathtaking landscapes and unique Maori culture, New Zealand offers everything from snow-capped mountains to pristine beaches. Known for its friendly locals (Kiwis) and outdoor adventures, it's a paradise for nature lovers and thrill-seekers alike.",
            highlights: "• Diverse landscapes including fjords, glaciers, and volcanic regions\n• Rich Maori cultural heritage and traditions\n• Famous filming locations for Lord of the Rings and The Hobbit\n• World-class hiking trails and extreme sports",
            attractions: "• Milford Sound: Scenic cruises, kayaking, and wildlife spotting\n• Rotorua: Geothermal wonders, Maori cultural experiences\n• Queenstown: Bungee jumping, skiing, and adventure sports\n• Hobbiton: Movie set tours and Middle-earth experience",
            moreInfo: "https://www.newzealand.com/int/"
        },
        {
            name: "Morocco",
            region: "North Africa",
            description: "A gateway to Africa, Morocco blends Arab, Berber, and European influences in its culture, architecture, and cuisine. From the Sahara Desert to the Atlas Mountains, the country offers diverse experiences and landscapes.",
            highlights: "• Historic medinas with traditional souks and craftsmen\n• Sahara Desert experiences with camel treks and camping\n• Atlas Mountains for hiking and visiting Berber villages\n• Coastal cities with beautiful beaches and fresh seafood",
            attractions: "• Marrakech: Djemaa el-Fna, Majorelle Garden, historic medina\n• Fez: World's largest car-free urban area, leather tanneries\n• Chefchaouen: The famous blue city in the Rif Mountains\n• Sahara: Merzouga and Erg Chebbi sand dunes",
            moreInfo: "https://www.visitmorocco.com/en"
        }
    ],
    cities: [
        {
            name: "Barcelona",
            region: "Catalonia, Spain",
            description: "A vibrant Mediterranean city that perfectly blends history, art, and modern culture. Barcelona's unique character comes from its Gothic architecture, modernist masterpieces, bustling markets, and beach lifestyle.",
            highlights: "• Gaudi's architectural wonders throughout the city\n• Rich Catalan culture and cuisine\n• Combination of beach and city life\n• Thriving arts and music scene",
            attractions: "• Sagrada Familia: Gaudi's masterpiece basilica\n• Park Güell: Whimsical park with amazing city views\n• Gothic Quarter: Medieval streets and historic buildings\n• Las Ramblas: Famous pedestrian boulevard\n• La Boqueria Market: Fresh food and local specialties",
            moreInfo: "https://www.barcelonaturisme.com/wv3/en/"
        },
        {
            name: "Kyoto",
            region: "Kansai, Japan",
            description: "The cultural heart of Japan, Kyoto served as the imperial capital for over 1000 years. The city preserves Japan's traditional architecture, gardens, and customs while embracing modern conveniences.",
            highlights: "• Over 1,600 Buddhist temples and 400 Shinto shrines\n• Traditional tea ceremonies and geisha culture\n• Seasonal festivals and cherry blossom viewing\n• Traditional Japanese gardens and architecture",
            attractions: "• Kinkaku-ji: The Golden Pavilion\n• Fushimi Inari Shrine: Thousands of torii gates\n• Arashiyama: Bamboo grove and monkey park\n• Gion: Historic geisha district\n• Nijo Castle: Former shogunate residence",
            moreInfo: "https://kyoto.travel/en/"
        },
        {
            name: "Prague",
            region: "Bohemia, Czech Republic",
            description: "Known as the 'City of a Hundred Spires,' Prague preserves its medieval charm with Gothic architecture, cobblestone streets, and centuries-old traditions. The city offers a perfect blend of history, culture, and modern entertainment.",
            highlights: "• Well-preserved medieval architecture\n• Rich history spanning over 1,000 years\n• Famous Czech beer culture and breweries\n• Vibrant arts and music scene",
            attractions: "• Charles Bridge: Historic bridge with statues\n• Prague Castle: Largest ancient castle complex\n• Old Town Square: Medieval astronomical clock\n• Jewish Quarter: Historic synagogues and cemetery\n• Letna Park: Panoramic city views",
            moreInfo: "https://www.prague.eu/en"
        }
    ],
    places: [
        {
            name: "Machu Picchu",
            region: "Cusco Region, Peru",
            description: "This ancient Incan citadel, set high in the Andes Mountains, stands as a testament to Incan engineering and architecture. Built in the 15th century and later abandoned, it was brought to international attention in 1911.",
            highlights: "• UNESCO World Heritage Site\n• Remarkable stone architecture built without mortar\n• Precise astronomical alignments\n• Surrounded by dramatic mountain landscapes\n• Complex agricultural terrace system",
            attractions: "• Temple of the Sun: Sacred astronomical observatory\n• Intihuatana Stone: Ancient ritual stone\n• Royal Tomb: Ceremonial rock chamber\n• Gate of the Sun: Main entrance to the citadel\n• Agricultural Terraces: Ancient farming techniques",
            moreInfo: "https://www.machupicchu.gob.pe/"
        },
        {
            name: "Petra",
            region: "Ma'an Governorate, Jordan",
            description: "The 'Rose City' carved into rose-colored rock faces, Petra was the capital of the Nabataean Kingdom. This archaeological wonder combines Eastern traditions with Hellenistic architecture.",
            highlights: "• UNESCO World Heritage Site\n• Ancient water conduit system\n• Remarkable rock-cut architecture\n• Blend of various architectural styles\n• Night tours under starlight",
            attractions: "• The Treasury: Iconic facade carved in rock\n• The Monastery: Largest monument in Petra\n• Royal Tombs: Elaborate burial chambers\n• Siq: Natural gorge entrance\n• High Place of Sacrifice: Ancient ritual site",
            moreInfo: "https://www.visitpetra.jo/"
        },
        {
            name: "Great Barrier Reef",
            region: "Queensland, Australia",
            description: "The world's largest coral reef system, stretching over 2,300 kilometers along Australia's northeast coast. This natural wonder hosts an incredible diversity of marine life and offers unique underwater experiences.",
            highlights: "• World's largest living structure\n• Home to thousands of species of marine life\n• Crystal clear waters with high visibility\n• Perfect for diving and snorkeling\n• Beautiful island resorts",
            attractions: "• Whitehaven Beach: Pure silica sand\n• Heart Reef: Natural heart-shaped formation\n• Green Island: Coral cay with rainforest\n• Hardy Reef: Popular diving location\n• Low Isles: Historic lighthouse and reef",
            moreInfo: "https://www.greatbarrierreef.org/"
        }
    ]
};

// Initialize particles.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing...');
    
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

    initializeElements();
    addEventListeners();
    preloadSounds();
});

function initializeElements() {
    console.log('Initializing elements...');
    
    // Initialize all DOM elements
    elements.destinationType = document.getElementById('destinationType');
    elements.pickButton = document.getElementById('pickButton');
    elements.destinationCard = document.getElementById('destinationCard');
    elements.destinationName = document.getElementById('destinationName');
    elements.destinationTypeSpan = document.getElementById('destinationTypeSpan');
    elements.destinationRegion = document.getElementById('destinationRegion');
    elements.destinationDescription = document.getElementById('destinationDescription');
    elements.destinationHighlights = document.getElementById('destinationHighlights');
    elements.destinationAttractions = document.getElementById('destinationAttractions');
    elements.learnMore = document.getElementById('learnMore');
    elements.pickAgain = document.getElementById('pickAgain');
    elements.pickSound = document.getElementById('pickSound');
    elements.revealSound = document.getElementById('revealSound');
    elements.shareButton = document.getElementById('shareButton');
    elements.shareModal = document.getElementById('shareModal');
    elements.closeShareModal = document.getElementById('closeShareModal');
    elements.copyLink = document.getElementById('copyLink');
    elements.shareButtons = document.querySelectorAll('.share-button[data-platform]');

    // Debug check for elements
    Object.entries(elements).forEach(([key, element]) => {
        if (!element && key !== 'thumbnails' && key !== 'shareButtons') {
            console.error(`Element not found: ${key}`);
        }
    });

    console.log('Elements initialized:', elements);
}

function preloadSounds() {
    if (elements.pickSound) {
        elements.pickSound.volume = 0.6;
        elements.pickSound.load();
    }
    if (elements.revealSound) {
        elements.revealSound.volume = 0.4;
        elements.revealSound.load();
    }
}

function addEventListeners() {
    console.log('Adding event listeners...');
    
    if (elements.destinationType) {
        elements.destinationType.addEventListener('change', () => {
            elements.destinationCard.classList.add('hidden');
        });
    }
    
    if (elements.pickButton) {
        elements.pickButton.addEventListener('click', pickDestination);
    }
    
    if (elements.pickAgain) {
        elements.pickAgain.addEventListener('click', pickDestination);
    }
    
    if (elements.shareButton) {
        elements.shareButton.addEventListener('click', shareDestinationModal);
    }
    
    if (elements.closeShareModal) {
        elements.closeShareModal.addEventListener('click', closeShareModal);
    }
    
    if (elements.copyLink) {
        elements.copyLink.addEventListener('click', copyDestinationLink);
    }
    
    elements.shareButtons?.forEach(button => {
        button.addEventListener('click', () => shareDestination(button.dataset.platform));
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.shareModal) {
            closeShareModal();
        }
    });
}

function getCurrentDestination() {
    if (!elements.destinationType || !elements.destinationName) return null;
    
    const type = elements.destinationType.value;
    const name = elements.destinationName.textContent;
    return destinations[type]?.find(d => d.name === name);
}

function pickDestination() {
    console.log('Pick destination clicked');
    
    if (!elements.destinationType || !elements.destinationCard) {
        console.error('Required elements not found');
        return;
    }

    // Play pick sound
    if (elements.pickSound) {
        elements.pickSound.currentTime = 0;
        elements.pickSound.play().catch(e => console.log('Sound play error:', e));
    }

    // Hide current destination
    if (elements.destinationCard) {
        elements.destinationCard.classList.add('hidden');
    }

    // Get selected type and available destinations
    const selectedType = elements.destinationType.value;
    console.log('Selected type:', selectedType);
    
    const availableDestinations = destinations[selectedType];
    console.log('Available destinations:', availableDestinations);

    if (!availableDestinations || availableDestinations.length === 0) {
        console.error('No destinations available for type:', selectedType);
        return;
    }

    // Pick random destination
    const randomIndex = Math.floor(Math.random() * availableDestinations.length);
    const destination = availableDestinations[randomIndex];
    console.log('Selected destination:', destination);

    // Update UI after a short delay
    setTimeout(() => {
        updateDestinationUI(destination, selectedType);
    }, 300);
}

function updateDestinationUI(destination, selectedType) {
    console.log('Updating UI with destination:', destination);

    try {
        // Update text content
        if (elements.destinationName) {
            elements.destinationName.textContent = destination.name;
        }
        if (elements.destinationTypeSpan) {
            elements.destinationTypeSpan.textContent = selectedType.slice(0, -1).charAt(0).toUpperCase() + selectedType.slice(1, -1);
        }
        if (elements.destinationRegion) {
            elements.destinationRegion.textContent = destination.region;
        }
        if (elements.destinationDescription) {
            elements.destinationDescription.textContent = destination.description;
        }
        if (elements.destinationHighlights) {
            elements.destinationHighlights.textContent = destination.highlights;
        }
        if (elements.destinationAttractions) {
            elements.destinationAttractions.textContent = destination.attractions;
        }
        if (elements.learnMore) {
            elements.learnMore.href = destination.moreInfo;
        }

        // Show destination card
        if (elements.destinationCard) {
            elements.destinationCard.classList.remove('hidden');
        }

        // Enable share button
        if (elements.shareButton) {
            elements.shareButton.disabled = false;
        }

        // Play reveal sound
        if (elements.revealSound) {
            elements.revealSound.currentTime = 0;
            elements.revealSound.play().catch(e => console.log('Sound play error:', e));
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function openShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.remove('hidden');
    }
}

function closeShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.add('hidden');
    }
}

function getShareableLink() {
    const destination = getCurrentDestination();
    if (!destination) return window.location.href;
    
    const url = new URL(window.location.href);
    url.searchParams.set('type', elements.destinationType.value);
    url.searchParams.set('name', destination.name);
    return url.toString();
}

function copyDestinationLink() {
    const link = getShareableLink();
    navigator.clipboard.writeText(link).then(() => {
        const button = elements.copyLink;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }).catch(console.error);
}

function shareDestination(platform) {
    const destination = getCurrentDestination();
    if (!destination) return;
    
    const link = getShareableLink();
    const text = `Check out this amazing destination: ${destination.name}!`;
    
    let shareUrl;
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function shareDestinationModal() {
    const shareModal = document.getElementById('shareModal');
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const currentDestination = document.querySelector('.destination-info');
    const destinationName = currentDestination.querySelector('h2').textContent;
    const destinationURL = window.location.href;
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Share ${destinationName}</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="share-buttons">
                <button onclick="shareToSocial('facebook', '${destinationURL}')" class="share-button">
                    <i class="fab fa-facebook"></i>
                    Facebook
                </button>
                <button onclick="shareToSocial('twitter', '${destinationURL}')" class="share-button">
                    <i class="fab fa-twitter"></i>
                    Twitter
                </button>
                <button onclick="shareToSocial('whatsapp', '${destinationURL}')" class="share-button">
                    <i class="fab fa-whatsapp"></i>
                    WhatsApp
                </button>
                <button onclick="shareToSocial('telegram', '${destinationURL}')" class="share-button">
                    <i class="fab fa-telegram"></i>
                    Telegram
                </button>
                <button onclick="shareToSocial('linkedin', '${destinationURL}')" class="share-button">
                    <i class="fab fa-linkedin"></i>
                    LinkedIn
                </button>
                <button onclick="shareToSocial('pinterest', '${destinationURL}')" class="share-button">
                    <i class="fab fa-pinterest"></i>
                    Pinterest
                </button>
                <button onclick="shareToSocial('reddit', '${destinationURL}')" class="share-button">
                    <i class="fab fa-reddit"></i>
                    Reddit
                </button>
                <button onclick="copyToClipboard('${destinationURL}')" class="share-button">
                    <i class="fas fa-link"></i>
                    Copy Link
                </button>
            </div>
        </div>
    `;
    
    shareModal.innerHTML = '';
    shareModal.appendChild(modalContent);
    shareModal.style.display = 'flex';
    
    // Close modal when clicking the close button
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.onclick = () => shareModal.style.display = 'none';
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === shareModal) {
            shareModal.style.display = 'none';
        }
    };
}

function shareToSocial(platform, url) {
    const text = 'Check out this amazing destination!';
    const title = document.querySelector('.destination-info h2').textContent;
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text + ' ' + title)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + title + ' ' + url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text + ' ' + title)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text + ' ' + title)}`;
            break;
        case 'reddit':
            shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const button = event.target.closest('.share-button');
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-link"></i> Copy Link';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
