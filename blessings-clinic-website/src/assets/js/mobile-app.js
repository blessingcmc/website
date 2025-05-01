// Consolidated mobile application logic for Blessings Chinese Medicine Clinic

class MobileApp {
    constructor() {
        this.currentLang = 'zh';
    }

    init() {
        // Initialize language switcher
        this.initLangSwitcher();
        
        // Mobile hamburger menu logic
        (function() {
            const menuToggle = document.getElementById('menu-toggle');
            const navMenu = document.getElementById('mobile-nav-menu');
            const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];
            let menuOpen = false;

            function openMenu() {
                navMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
                menuOpen = true;
            }
            function closeMenu() {
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
                menuOpen = false;
            }
            if (menuToggle && navMenu) {
                menuToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (menuOpen) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                });
                navLinks.forEach(link => {
                    link.addEventListener('click', closeMenu);
                });
                // Close menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (menuOpen && !navMenu.contains(e.target) && e.target !== menuToggle) {
                        closeMenu();
                    }
                });
                // Accessibility: close on Escape
                document.addEventListener('keydown', function(e) {
                    if (menuOpen && e.key === 'Escape') {
                        closeMenu();
                    }
                });
            }
        })();
        
        // Initialize content based on current page
        const pageId = this.getCurrentPageId();
        if (pageId) {
            this.initContent(pageId);
        }
        
        // Initialize navigation
        this.initNavigation();
        
        // Load language
        this.loadLanguage(this.currentLang).then(() => {
            // Initialize treatments after content is loaded
            this.initTreatments();
            
            // Initialize mobile dropdowns
            this.initMobileDropdowns();
        });
    }

    getCurrentPageId() {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('.')[0];
        return page.replace('mobile-', '') || 'home';
    }

    initContent(pageId) {
        // Load content for the current page
        switch (pageId) {
            case 'home':
                this.initHomeContent();
                break;
            case 'practitioners':
                this.initPractitioners();
                break;
            case 'treatments':
                this.initTreatments();
                break;
            case 'contact':
                this.initContact();
                break;
            default:
                this.initHomeContent();
        }
    }

    updateI18nElements() {
        if (!this.languageData) return;
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            // Support nested keys like 'home.welcome'
            const value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, this.languageData);
            if (value !== undefined) {
                el.textContent = value;
            }
        });
    }

    initHomeContent() {
        // Get the main home container
        const homeMain = document.querySelector('main.home');
        if (!homeMain) return;

        // Clear existing content
        homeMain.innerHTML = '';

        // Create hero image element
        const heroImg = document.createElement('img');
        heroImg.src = 'assets/images/home.jpg';
        heroImg.alt = 'Blessings Chinese Medicine Clinic';
        heroImg.className = 'hero-image';
        heroImg.style.width = '100%';
        heroImg.style.height = 'auto';
        homeMain.appendChild(heroImg);

        // Create welcome message element
        let welcomeMsg = '';
        if (this.languageData && this.languageData.home && this.languageData.home.welcome) {
            welcomeMsg = this.languageData.home.welcome;
        } else {
            welcomeMsg = 'Welcome to Blessings Chinese Medicine Clinic!';
        }
        const welcomeElem = document.createElement('div');
        welcomeElem.className = 'welcome-message';
        welcomeElem.setAttribute('data-i18n', 'home.welcome');
        welcomeElem.textContent = welcomeMsg;
        homeMain.appendChild(welcomeElem);
        // Update i18n content for any injected elements
        this.updateI18nElements();
    }

    initNavigation() {
        // Hamburger menu functionality for mobile
        const menuToggle = document.querySelector('.menu-toggle');
        const navUl = document.querySelector('.navbar ul');
        
        if (menuToggle && navUl) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navUl.classList.toggle('active');
            });
            
            // Close mobile menu when a link is clicked
            const navLinks = document.querySelectorAll('.navbar ul li a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navUl.classList.remove('active');
                });
            });
        }
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`./lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.languageData = data; // Store for use in other functions
            this.updateI18nElements();
            
            // Update text content only for elements that exist on the current page
            // Update clinic name in navbar
            const clinicName = document.querySelector('.clinic-name[data-i18n="navbar.clinicName"]');
            if (clinicName && data.navbar && data.navbar.clinicName) {
                clinicName.textContent = data.navbar.clinicName;
            }

            const homeHeading = document.querySelector('#home h1');
            if (homeHeading) homeHeading.textContent = data.home.welcome;
            
            const homeParagraph = document.querySelector('#home p');
            if (homeParagraph) homeParagraph.textContent = data.home.contact;
            
            const practitionersHeading = document.querySelector('#practitioners h2');
            if (practitionersHeading) practitionersHeading.textContent = data.practitioners.title;
            
            const practitionerParagraph = document.querySelector('#practitioners .practitioner p');
            if (practitionerParagraph) practitionerParagraph.textContent = data.practitioners.description;
            
            const treatmentsHeading = document.querySelector('#treatments h2');
            if (treatmentsHeading) treatmentsHeading.textContent = data.treatments.title;
            
            const treatmentsParagraph = document.querySelector('#treatments p');
            if (treatmentsParagraph) treatmentsParagraph.textContent = data.treatments.description;
            
            const contactHeading = document.querySelector('#contact h2');
            if (contactHeading) contactHeading.textContent = data.contact.title;
            
            const contactParagraph = document.querySelector('#contact p');
            if (contactParagraph) contactParagraph.textContent = data.contact.description;
            
            const addressElement = document.querySelector('.address');
            if (addressElement) addressElement.textContent = data.contact.address;
            
            const phoneElement = document.querySelector('.phone');
            if (phoneElement) phoneElement.textContent = data.contact.phone;

            // Update navigation text
            const navLinks = document.querySelectorAll('.navbar ul li a');
            if (navLinks.length > 0) {
                navLinks[0].textContent = data.navigation.home;
                navLinks[1].textContent = data.navigation.practitioners;
                navLinks[2].textContent = data.navigation.treatments;
                navLinks[3].textContent = data.navigation.contact;
            }

            // Update language button
            const langSwitch = document.getElementById('lang-switch');
            if (langSwitch) {
                langSwitch.textContent = this.currentLang === 'en' ? '中文' : 'EN';
            }

            // Update practitioners section if on practitioners page
            if (document.querySelector('.practitioner-content')) {
                const practitioners = data.practitioners;
                const practitionerContent = document.querySelector('.practitioner-content');
                practitionerContent.innerHTML = ''; // Clear existing content
                
                practitioners.doctors.forEach(doctorId => {
                    const doctor = practitioners[doctorId];
                    const doctorElement = `
                        <div class="practitioner ${doctorId === 'agnes' ? 'active' : ''}" data-doctor="${doctorId}">
                            <div class="practitioner-info">
                                <img src="assets/images/doctors/${doctorId}.jpg" alt="${doctor.name}">
                                <div class="info-text">
                                    <h3 class="doctor-name">${doctor.name} <a href="https://instagram.com/${doctor.instagramLink}" class="instagram-link" target="_blank">
                                            <i class="fab fa-instagram"></i>
                                        </a></h3>
                                    <p class="doctor-bio">${doctor.bio}</p>
                                    ${doctor.items ? `
                                        <div class="doctor-specialties">
                                            <h4>${data.practitioners.itemtitle}</h4>
                                            <p class="specialties-text">${doctor.items}</p>
                                        </div>
                                    ` : ''}
                                    ${doctor.opening_hours ? `
                                        <div class="doctor-schedule">
                                            <h4>${data.practitioners.timetitle}</h4>
                                            <p class="schedule-text">${doctor.opening_hours}</p>
                                        </div>
                                    ` : ''}
                                    
                                </div>
                            </div>
                        </div>
                    `;
                    practitionerContent.insertAdjacentHTML('beforeend', doctorElement);
                });

                // Update practitioners navigation buttons with full names
                const navButtons = document.querySelectorAll('.nav-btn');
                navButtons.forEach(btn => {
                    const doctorId = btn.dataset.doctor;
                    if (practitioners[doctorId]) {
                        btn.textContent = practitioners[doctorId].name;
                    }
                });

                // Add event listeners for practitioner navigation
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const doctorId = btn.dataset.doctor;
                        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                        document.querySelectorAll('.practitioner').forEach(p => p.classList.remove('active'));
                        btn.classList.add('active');
                        document.querySelector(`.practitioner[data-doctor="${doctorId}"]`).classList.add('active');
                    });
                });
            }

            // Update treatments section if on treatments page
            if (document.querySelector('.treatment-content')) {
                const treatments = data.treatments;
                const treatmentContent = document.querySelector('.treatment-content');
                treatmentContent.innerHTML = ''; // Clear existing content
                
                const treatmentIds = ['decoction', 'acupuncture', 'moxibustion', 'structural', 'therapy'];
                
                treatmentIds.forEach(treatmentId => {
                    const treatment = treatments[treatmentId];
                    const treatmentElement = `
                        <div class="treatment ${treatmentId === 'decoction' ? 'active' : ''}" data-treatment="${treatmentId}">
                            <div class="treatment-info">
                                <img src="assets/images/treatments/${treatmentId}.jpg" alt="${treatment.name}">
                                <div class="info-text">
                                    <h3 class="treatment-name">${treatment.name}</h3>
                                    <p class="treatment-description">${treatment.description}</p>
                                    <div class="treatment-details">
                                        <h4>${treatments.usage}</h4>
                                        <p class="symptoms-text">${treatment.symptoms}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    treatmentContent.insertAdjacentHTML('beforeend', treatmentElement);
                });

                // Update treatment navigation buttons with names
                const treatmentButtons = document.querySelectorAll('.treatments-nav .nav-btn');
                treatmentButtons.forEach(btn => {
                    const treatmentId = btn.dataset.treatment;
                    if (treatments[treatmentId]) {
                        btn.textContent = treatments[treatmentId].name;
                    }
                });
            }

            // Return a promise that resolves when content is loaded
            return Promise.resolve();
        } catch (error) {
            console.error('Error loading language file:', error);
            return Promise.reject(error);
        }
    }

    initTreatments() {
        const treatmentBtns = document.querySelectorAll('.treatments-nav .nav-btn');
        const treatments = document.querySelectorAll('.treatment');

        treatmentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTreatment = btn.getAttribute('data-treatment');

                // Remove active class from all buttons and treatments
                treatmentBtns.forEach(b => b.classList.remove('active'));
                treatments.forEach(t => t.classList.remove('active'));

                // Add active class to clicked button and corresponding treatment
                btn.classList.add('active');
                const activeContent = document.querySelector(`.treatment[data-treatment="${targetTreatment}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }

    initMobileDropdowns() {
        const sections = ['practitioners', 'treatments'];
        
        sections.forEach(section => {
            const nav = document.querySelector(`.${section}-nav`);
            if (!nav) return;

            // Find the first nav button text to use as default
            const firstButton = nav.querySelector('.nav-btn');
            if (!firstButton) return;

            // Create and insert dropdown button with first option text
            const dropdown = document.createElement('button');
            dropdown.className = 'dropdown-button';
            dropdown.textContent = firstButton.textContent;
            dropdown.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-controls', `${section}-nav`);
            nav.parentNode.insertBefore(dropdown, nav);

            // Toggle dropdown
            dropdown.addEventListener('click', () => {
                const isActive = dropdown.classList.toggle('active');
                nav.classList.toggle('active');
                dropdown.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });

            // Update dropdown text when option selected
            const navButtons = nav.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    dropdown.textContent = btn.textContent;
                    dropdown.classList.remove('active');
                    nav.classList.remove('active');
                    dropdown.setAttribute('aria-expanded', 'false');
                });
            });
        });
    }

    initLangSwitcher() {
        const langSwitch = document.getElementById('lang-switch');
        if (langSwitch) {
            // Set initial button text based on current language
            langSwitch.textContent = this.currentLang === 'en' ? '中文' : 'EN';
            langSwitch.onclick = () => {
                this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
                langSwitch.textContent = this.currentLang === 'en' ? '中文' : 'EN';
                this.loadLanguage(this.currentLang);
            };
        }
    }

    initPractitioners() {
        // Initialize practitioners if needed
    }

    initContact() {
        // Use language data for contact section
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return;

        // Try to get contact data from the loaded language JSON
        let data = this.languageData || {};
        let contact = data.contact || {};
        // Fallbacks if not present
        const address = contact.address || '';
        const phone = contact.phone || '';
        const time = contact.time || '';
        const mapLabel = contact.map || '地圖 Map';

        contactInfo.innerHTML = `
            <p class="address" data-i18n="contact.address">${address}</p>
            <a href="https://www.map.gov.hk/gm/map/s/S/1502015145" 
            target="_blank" 
            class="map-link">
            <i class="fas fa-map-marker-alt"></i> <span data-i18n="contact.map">${mapLabel}</span>
            </a>
            <p class="phone" data-i18n="contact.phone">${phone}</p>
            <p class="time" data-i18n="contact.time">${time}</p>
        `;
    }
}


// Create a global instance and initialize
const mobileApp = new MobileApp();
document.addEventListener('DOMContentLoaded', function() {
    mobileApp.init();
});
