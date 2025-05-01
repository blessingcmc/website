// Main application logic for Blessings Chinese Medicine Clinic

class App {
    constructor() {
        this.currentLang = 'zh';
        this.isMobile = window.deviceDetector && window.deviceDetector.isMobile;
    }

    init() {
        // Initialize language switcher
        this.initLangSwitcher();
        
        // Initialize content based on current page
        const pageId = this.getCurrentPageId();
        if (pageId) {
            this.initContent(pageId);
        }
        
        // Initialize navigation
        this.initNavigation();
        
        // Load language first
        this.loadLanguage(this.currentLang).then(() => {
            // Initialize treatments after content is loaded
            this.initTreatments();
            
            // Initialize appropriate version based on device detection
            if (window.deviceDetector) {
                this.initAppropriateVersion();
            } else {
                // Fallback if device detector is not available
                if (window.innerWidth <= 768) {
                    this.initMobileDropdowns();
                } else {
                    this.initDesktopDropdowns();
                }
            }
        });
        
        // Language switcher
        const langSwitch = document.getElementById('lang-switch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
                this.loadLanguage(this.currentLang).then(() => {
                    // Re-initialize treatments after language switch
                    this.initTreatments();
                    
                    // Re-initialize appropriate version after language switch
                    if (window.deviceDetector) {
                        this.initAppropriateVersion();
                    }
                });
            });
        };

        // Mobile menu toggle - only initialize for desktop, mobile version will handle this differently
        if (!window.deviceDetector || !window.deviceDetector.isMobile) {
            const menuToggle = document.querySelector('.menu-toggle');
            const navbarMenu = document.querySelector('.navbar ul');
            
            if (menuToggle && navbarMenu) {
                menuToggle.addEventListener('click', () => {
                    menuToggle.classList.toggle('active');
                    navbarMenu.classList.toggle('active');
                });

                // Close menu when clicking a link
                document.querySelectorAll('.navbar a').forEach(link => {
                    link.addEventListener('click', () => {
                        menuToggle.classList.remove('active');
                        navbarMenu.classList.remove('active');
                    });
                });
            }
        }
    }

    getCurrentPageId() {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('.')[0];
        return page || 'home';
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

    initHomeContent() {
        // Existing code to initialize home content
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
                    if (this.isMobile) {
                        menuToggle.classList.remove('active');
                        navUl.classList.remove('active');
                    }
                });
            });
        }
    }

    async loadLanguage(lang) {
        try {
            // Update the fetch path to work with Live Server
            const response = await fetch(`./lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Update all text content
            document.querySelector('#home h1').textContent = data.home.welcome;
            document.querySelector('#home p').textContent = data.home.contact;
            
            document.querySelector('#practitioners h2').textContent = data.practitioners.title;
            document.querySelector('#practitioners .practitioner p').textContent = data.practitioners.description;
            
            document.querySelector('#treatments h2').textContent = data.treatments.title;
            document.querySelector('#treatments p').textContent = data.treatments.description;
            
            document.querySelector('#contact h2').textContent = data.contact.title;
            document.querySelector('#contact p').textContent = data.contact.description;
            document.querySelector('.address').textContent = data.contact.address;
            document.querySelector('.phone').textContent = data.contact.phone;

            // Update navigation text
            const navLinks = document.querySelectorAll('.navbar ul li a');
            navLinks[0].textContent = data.navigation.home;
            navLinks[1].textContent = data.navigation.practitioners;
            navLinks[2].textContent = data.navigation.treatments;
            navLinks[3].textContent = data.navigation.contact;

            // Update language button
            document.getElementById('lang-switch').textContent = 
                this.currentLang === 'en' ? '中文' : 'EN';

            // Update practitioners section
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
                                <h3 class="doctor-name">${doctor.name}</h3>
                                <p class="doctor-bio">${doctor.bio}</p>
                                ${doctor.items ? `
                                    <div class="doctor-specialties">
                                        <h4>擅長項目</h4>
                                        <p class="specialties-text">${doctor.items}</p>
                                    </div>
                                ` : ''}
                                ${doctor.opening_hours ? `
                                    <div class="doctor-schedule">
                                        <h4>應診時間</h4>
                                        <p class="schedule-text">${doctor.opening_hours}</p>
                                    </div>
                                ` : ''}
                                <div class="doctor-social">
                                    <a href="https://instagram.com/${doctor.instagramLink}" class="instagram-link" target="_blank">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                </div>
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

            // Update treatments section
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

    /**
     * Initialize the appropriate version based on device type
     */
    initAppropriateVersion() {
        if (window.deviceDetector.isMobile) {
            // Load mobile-specific functionality if available
            if (typeof mobileMenuHandler !== 'undefined') {
                mobileMenuHandler.init();
            } else {
                // Fallback to standard mobile initialization
                this.initMobileDropdowns();
            }
        } else {
            // For desktop, initialize standard dropdowns
            this.initDesktopDropdowns();
        }
    }

    /**
     * Initialize desktop-specific dropdowns
     */
    initDesktopDropdowns() {
        const sections = ['practitioners', 'treatments'];
        
        sections.forEach(section => {
            const nav = document.querySelector(`.${section}-nav`);
            if (!nav) return;
            
            // Make sure navigation is visible on desktop
            nav.style.height = 'auto';
            nav.style.overflow = 'visible';
            
            // Add click handlers to navigation buttons
            const navButtons = nav.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active states
                    navButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update content
                    const sectionType = section === 'practitioners' ? 'doctor' : 'treatment';
                    const targetId = btn.dataset[sectionType];
                    
                    if (targetId) {
                        const items = document.querySelectorAll(`.${sectionType === 'doctor' ? 'practitioner' : 'treatment'}`);
                        items.forEach(item => item.classList.remove('active'));
                        
                        const targetItem = document.querySelector(`.${sectionType === 'doctor' ? 'practitioner' : 'treatment'}[data-${sectionType}="${targetId}"]`);
                        if (targetItem) {
                            targetItem.classList.add('active');
                        }
                    }
                });
            });
        });
    }

    initLangSwitcher() {
        // Initialize language switcher
    }

    initPractitioners() {
        // Initialize practitioners
    }

    initContact() {
        // Initialize contact
    }
}

// Create a global instance and initialize

const app = new App();
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});

// Add scroll-based animations
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;

    // Toggle navbar transparency
    if (scrollPosition > 50) {
        navbar.classList.remove('transparent');
    } else {
        navbar.classList.add('transparent');
    }

    // Animate sections when they come into view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition > (sectionTop - window.innerHeight / 1.5)) {
            section.querySelector('.section-heading')?.classList.add('visible');
            section.querySelector('.section-text')?.classList.add('visible');
        }
    });
}

// Initialize animations
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});