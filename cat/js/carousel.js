class DynamicCarousel {
    constructor(containerId, cardsData) {
        this.containerId = containerId;
        this.cardsData = cardsData;
        this.currentSlide = 0;
        this.totalSlides = cardsData.length;
        this.isTransitioning = false;
        this.actualPosition = 0;
        this.totalExtendedCards = this.totalSlides * 3;
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn(`Contenedor del carrusel '${this.containerId}' no encontrado.`);
            return;
        }
        this.generateHTML();
        this.setupEventListeners();

        setTimeout(() => {
            this.actualPosition = this.totalSlides;
            this.updateCarousel();
            this.positionNavigationButtons();
            this.toggleNavigationForScreen();
        }, 0);

        this.updateActiveCard();
    }

    generateHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const carouselHTML = `
            <div class="carousel-wrapper">
                <div class="carousel-track" id="carouselTrack">
                    ${this.generateCards()}
                </div>
            </div>
            <div class="carousel-navigation" id="carouselNavigationDesktop">
                <button class="carousel-btn carousel-btn-prev" id="prevBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <button class="carousel-btn carousel-btn-next" id="nextBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                </button>
            </div>
        `;
        container.innerHTML = carouselHTML;

        if (!document.getElementById('carouselNavigationMobile')) {
            const navMobile = document.createElement('div');
            navMobile.className = 'carousel-navigation-mobile';
            navMobile.id = 'carouselNavigationMobile';
            navMobile.innerHTML = `
                <button class="carousel-btn carousel-btn-prev" id="prevBtnMobile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <button class="carousel-btn carousel-btn-next" id="nextBtnMobile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                </button>
            `;
            document.body.appendChild(navMobile);
        }

        setTimeout(() => {
            this.actualPosition = this.totalSlides;
            this.updateCarousel();
            this.positionNavigationButtons();
            this.toggleNavigationForScreen();
        }, 0);

        this.updateActiveCard();
    }

    toggleNavigationForScreen() {
        const navDesktop = document.getElementById('carouselNavigationDesktop');
        const navMobile = document.getElementById('carouselNavigationMobile');
        if (!navDesktop || !navMobile) return;
        if (window.innerWidth <= 480) {
            navDesktop.style.display = 'none';
            navMobile.style.display = 'flex';
        } else {
            navDesktop.style.display = 'flex';
            navMobile.style.display = 'none';
        }
    }

    positionNavigationButtons() {
        const container = document.getElementById(this.containerId);
        const navigation = document.querySelector('.carousel-navigation');

        if (!container || !navigation) return;

        const containerRect = container.getBoundingClientRect();

        navigation.style.position = 'fixed';
        navigation.style.top = (containerRect.bottom + 20) + 'px';
        navigation.style.left = containerRect.left + 'px';
        navigation.style.width = 'auto';
        navigation.style.right = 'auto';
        navigation.style.bottom = 'auto';
    }

    generateCards() {
        const extendedCards = [...this.cardsData, ...this.cardsData, ...this.cardsData];
        return extendedCards.map((card, index) => {
            const originalIndex = index % this.totalSlides;
            const isActive = originalIndex === this.currentSlide;
            return `
                <div class="card-container">
                    <div class="card-location-title">${card.location}</div>
                    <div class="card ${card.isSpecial ? 'card--special' : ''} ${isActive ? 'card--active' : ''}"
                         style="background-image: url('${card.image}')"
                         data-index="${originalIndex}"
                         data-position="${index}">
                        <div class="card-content">
                            ${card.isSpecial && isActive ? `
                                <div class="card-special-text">${card.specialText || ''}</div>
                                <div class="card-special-text2">${card.specialText2 || ''}</div>
                            ` : ''}
                            <div class="card-buttons">
                                <button class="btn--card-primary" onclick="saveSelectedCardAndGoToPopup(${originalIndex})">
                                    ${card.primaryButtonText}
                                </button>
                                ${!card.isSpecial && card.secondaryAction ? `
                                <button class="btn--card-secondary" onclick="handleCardAction('${card.secondaryAction}', ${originalIndex})">
                                    <img src="/components/img/icons/add_circle.svg" alt="Add">
                                    ${card.secondaryButtonText}
                                </button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtnMobile = document.getElementById('prevBtnMobile');
        const nextBtnMobile = document.getElementById('nextBtnMobile');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        if (prevBtnMobile) prevBtnMobile.addEventListener('click', () => this.previousSlide());
        if (nextBtnMobile) nextBtnMobile.addEventListener('click', () => this.nextSlide());

        this.addTouchSupport();

        window.addEventListener('resize', () => {
            this.positionNavigationButtons();
            this.toggleNavigationForScreen();
        });
        window.addEventListener('scroll', () => this.positionNavigationButtons());
    }

    nextSlide() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.actualPosition++;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();

        setTimeout(() => {
            this.isTransitioning = false;

            if (this.actualPosition >= this.totalExtendedCards - this.totalSlides) {
                this.actualPosition = this.totalSlides;
                this.updateCarousel();
            }
        }, 500);
    }

    previousSlide() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.actualPosition--;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();

        setTimeout(() => {
            this.isTransitioning = false;

            if (this.actualPosition < 0) {
                this.actualPosition = this.totalSlides - 1;
                this.updateCarousel();
            }
        }, 500);
    }

    updateCarousel() {
        const track = document.getElementById('carouselTrack');
        if (!track) return;

        const cardWidth = 316;
        const baseTranslateX = -this.actualPosition * cardWidth;

        track.style.transform = `translateX(${baseTranslateX}px)`;
        track.style.transition = this.isTransitioning ? 'transform 0.5s ease-in-out' : 'none';

        this.updateActiveCard();

        setTimeout(() => {
            this.positionNavigationButtons();
        }, 10);
    }

    updateActiveCard() {
        const cards = document.querySelectorAll('.card');
        const locationTextDiv = document.querySelector('.location-text');
        let activeLocation = '';

        cards.forEach((card, index) => {
            const originalIndex = index % this.totalSlides;
            const isActive = originalIndex === this.currentSlide;
            card.classList.toggle('card--active', isActive);

            if (isActive) {
                const fullLocation = this.cardsData[originalIndex].location;
                activeLocation = fullLocation.replace(/^\d+\s*/, '').split(' ')[0];

                const cardData = this.cardsData[originalIndex];
                if (cardData.isSpecial) {
                    const cardContent = card.querySelector('.card-content');
                    const cardButtons = card.querySelector('.card-buttons');
                    let specialText = cardContent.querySelector('.card-special-text');
                    let specialText2 = cardContent.querySelector('.card-special-text2');
                    if (!specialText && cardData.specialText) {
                        specialText = document.createElement('div');
                        specialText.className = 'card-special-text';
                        specialText.textContent = cardData.specialText;
                        cardContent.insertBefore(specialText, cardButtons);
                    }
                    if (!specialText2 && cardData.specialText2) {
                        specialText2 = document.createElement('div');
                        specialText2.className = 'card-special-text2';
                        specialText2.textContent = cardData.specialText2;
                        cardContent.insertBefore(specialText2, cardButtons);
                    }
                }
            } else {

                const cardContent = card.querySelector('.card-content');
                let specialText = cardContent.querySelector('.card-special-text');
                let specialText2 = cardContent.querySelector('.card-special-text2');
                if (specialText) specialText.remove();
                if (specialText2) specialText2.remove();
            }
        });

        if (locationTextDiv) {
            locationTextDiv.textContent = activeLocation;
        }
    }

    addTouchSupport() {
        let startX = 0;
        let isDragging = false;

        const track = document.getElementById('carouselTrack');
        if (!track) return;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const currentX = e.changedTouches[0].clientX;
            const diffX = startX - currentX;
            const threshold = 50;

            if (diffX > threshold) {
                this.nextSlide();
            } else if (diffX < -threshold) {
                this.previousSlide();
            }
        });
    }
}

function saveSelectedCardAndGoToPopup(cardIndex) {
    try {
        const cardsData = window.carousel.cardsData;
        const selectedCard = cardsData[cardIndex];
        localStorage.setItem('selectedCardData', JSON.stringify(selectedCard));
        window.location.href = 'modal.html?popup=1';
    } catch (e) {
        alert('Error selecting card');
    }
}

function initializeCarousel() {
    const carouselContainer = document.getElementById('carousel-container');
    if (!carouselContainer) {
        return;
    }

    const cardsData = [
        {
            id: "xcaret",
            location: "1 Xcaret Full Day pass",
            image: "/components/img/step-images/xcaret_step1.jpg",
            primaryButtonText: "Select",
            secondaryButtonText: "Select",
            secondaryAction: "add-to-favorites",
            description: "CANCÚN XCARET PLUS",
            information: "Xcaret means \"small inlet\" in Maya. This Eco Park is full of Mexico; Mayan Culture, flora and fauna, archaeological tours, water attractions and it has a great swim with dolphin activity. All this located in Playa del Carmen, 45 minutes from Cancun Mexico in the heart of the Riviera Maya, where Xcaret is proof that development, conservation, culture and entertainment are not opposite concepts. Some of the attractions in Xcaret are: Underground rivers, Maya river, Paradise river, Beach, cove and ponds, Coral reef aquarium, Sea turtles, Manatee lagoon, Bee farm, Butterfly pavilion, etc.",
            itinerary: ["Departure from Cancun", "Arrival to Xcaret", "Orientation about the park’s layout", "Free time inside the park to enjoy the attractions", "Start Lunch Buffet", "Starts Mexican Show “Xcaret México Espectacular”", "Departure to Cancún", "Arrival in Cancún"],
            firstDeparture: ["07:00", "10:00", "10:05", "10:50", "12:00", "19:00", "21:40", "23:00"],
            secondDeparture: ["09:45", "12:00", "12:05", "11:50", "12:50", "19:00", "21:40", "23:00"],
            includes: ["Departure from Cancun", "Arrival to Xcaret", "Orientation about the park’s layout", "Free time inside the park to enjoy the attractions", "Start Lunch Buffet", "Starts Mexican Show “Xcaret México Espectacular”", "Departure to Cancún", "Arrival in Cancún"],
            duration: "Approximately 14 Hours",
            recommendations: "Towel, Comfortable shoes and clothes, chemical-free sunscreen, cash, camera, and insect repellent.",
            stepImages: {
                "step1": "/components/img/step-images/xcaret_step1.jpg",
                "step2": "/components/img/step-images/xcaret_step2.jpg",
                "step3": "/components/img/step-images/xcaret_step3.jpg",
                "step4": "/components/img/step-images/xcaret_step4.jpg"
            }
        },
        {
            id: "dolphin",
            location: "2 Dolphin Encounters (swim with dolphins)",
            image: "/components/img/step-images/dolphin_step1.jpg",
            primaryButtonText: "Select",
            secondaryButtonText: "Select",
            secondaryAction: "share",
            description: "DOLPHIN ENCOUNTER AT ISLA MUJERES",
            information: "The Dolphin Encounter Program is the ideal program for families traveling in Cancun. You and your children will be able to enjoy safe and fun activities that Dolphin Discovery Isla Mujeres has specifically designed for all ages. Whether you’re 1 or 80, you can enjoy the dolphins from a platform even if you’re not comfortable swimming. Our friendly dolphin will offer you a handshake, a kiss, and a hug. In addition, dolphins are known for their playful nature, something that doesn’t get left behind in Dolphin Discovery. Our dolphin will be excited to share with you their tricks, their games, and even their singing. You will also have a chance to pet them and swim with them in the place the dolphins call home, Cancun, Mexico. After your swim, enjoy our beach club, located in a natural environment in the beautiful Isla Mujeres",
            includes: ["Round trip Transportation in an air-conditioned vehicles", "Bilingual Tour Guide, Admission to Xcaret", "One buffet meal with unlimited drinks and 1 beer", "Snorkel equipment*", "Locker rental in the exclusive facilities of the “Plus area", "More than 20 activities to do and see : Underground rivers, Maya river, Paradise river, Beach, cove and ponds, Coral reef aquarium, Sea turtles, Manatee lagoon, Bee farm, Butterfly pavilion, etc", "10% off some optional activities", "Entrance to the night show “Xcaret México Espectacular” *Deposit required"],
            recommendations: "It is important to arrive 30 minutes before your program.If you have any physical or mental limitation, please call us before you purchase your program. Remember to use biodegradable sunscreen to protect your skin, the environment and marine species. Bring towels and cash for taxis, shopping, meals, etc.",
            stepImages: {
                "step1": "/components/img/step-images/dolphin_step1.jpg",
                "step2": "/components/img/step-images/dolphin_step2.jpg",
                "step3": "/components/img/step-images/dolphin_step3.jpg",
                "step4": "/components/img/step-images/dolphin_step4.jpg"
            }
        },
        {
            id: "chichen",
            location: "3 Chichen Itza Tickets",
            image: "/components/img/step-images/chichen_step1.jpg",
            primaryButtonText: "Select",
            secondaryButtonText: "Select",
            secondaryAction: "add-to-cart",
            description: "Visit the ancient Mayan city of Chichen Itza, a UNESCO World Heritage Site and one of the New 7 Wonders of the World. Explore the pyramids, temples, and cenotes.",
            information: "Visit the ancient Mayan city of Chichen Itza, a UNESCO World Heritage Site and one of the New 7 Wonders of the World. Explore the pyramids, temples, and cenotes.",
            itinerary: ["Pick up at your hotel", "Visit to Chichen Itza", "Swim in a cenote", "Lunch at a local restaurant", "Return to your hotel"],
            firstDeparture: ["07:00", "10:00", "10:05", "10:50", "12:00"],
            includes: ["Round trip Transportation in an air-conditioned vehicles", "Bilingual Tour Guide", "Admission to Xcaret", "One buffet meal with unlimited drinks and 1 beer", "Snorkel equipment*", "Locker rental in the exclusive facilities of the “Plus area", "More than 20 activities to do and see : Underground rivers, Maya river, Paradise river, Beach, cove and ponds, Coral reef aquarium, Sea turtles, Manatee lagoon, Bee farm, Butterfly pavilion, etc", "10% off some optional activities", "Entrance to the night show “Xcaret México Espectacular” *Deposit required"],
            duration: "Full day",
            recommendations: "Bring comfortable shoes, hat, sunscreen, and water.",
            stepImages: {
                "step1": "/components/img/step-images/chichen_step1.jpg",
                "step2": "/components/img/step-images/chichen_step2.jpg",
                "step3": "/components/img/step-images/chichen_step3.jpg",
                "step4": "/components/img/step-images/chichen_step4.jpg"
            }
        },
        {
            id: "tour",
            location: "4 Tour",
            image: "/components/img/step-images/tour.jpg",
            primaryButtonText: "Select",
            isSpecial: true,
            specialText: "Looking for a different tour?",
            specialText2: "No worries! Contact us and we'll be in touch.",
            description: "CHICHEN ITZÁ CON CENOTE",
            information: "This The Itza conquered the city toward the end of the Classic Period and introduced the cult of Kukulkan, militarism, and a series of new cultural elements associated with earlier traditions, giving rise to a unique style called Maya-Yucatecan. During this excursion, you will enjoy and learn about Mayan culture, visit a regional handicraft shop, enjoy the flavors of Yucatan dishes, and dive into a local cenote. Prepare for an unforgettable adventure. Wonderful place is considered a World Heritage Site by UNESCO and on July 7, 2007, it was named one of the New 7 Wonders of the World during the Official Declaration in Lisbon, Portugal.",
            includes: ["Customizable options."],
            duration: "Approximately 12 hours",
            recommendations: "Comfortable shoes, comfortable clothing, a hat, sunscreen, cash, camera, insect repellent, and water.",
            stepImages: {
                "step1": "/components/img/step-images/tour_step1.jpg",
                "step2": "/components/img/step-images/tour_step2.jpg",
                "step3": "/components/img/step-images/tour_step3.jpg",
                "step4": "/components/img/step-images/tour_step4.jpg"
            }
        }
    ];

    const carousel = new DynamicCarousel('carousel-container', cardsData);
    window.carousel = carousel;
    carousel.init();
    console.log(JSON.parse(localStorage.getItem('selectedCardData')));
}

document.addEventListener('DOMContentLoaded', initializeCarousel);

document.addEventListener('spaContentLoaded', (e) => {
    if (e.detail.pageUrl.includes('crvo/pages/landing-page.html') || e.detail.pageUrl.includes('cat/pages/landing-page.html')) {
        initializeCarousel();
    }
});