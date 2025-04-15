let currentLang = 'zh';

async function loadLanguage(lang) {
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
            currentLang === 'en' ? '中文' : 'EN';

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
                                <h4>適應症狀</h4>
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

document.addEventListener('DOMContentLoaded', () => {
    // Load language first
    loadLanguage(currentLang).then(() => {
        // Initialize treatments after content is loaded
        initTreatments();
    });
    
    // Language switcher
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'zh' : 'en';
            loadLanguage(currentLang).then(() => {
                // Re-initialize treatments after language switch
                initTreatments();
            });
        });
    }
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

function initTreatments() {
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