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
                            <a href="https://instagram.com/${doctor.instagramLink}" class="instagram-link" target="_blank">
                                <img src="assets/images/instagram-icon.png" alt="Instagram">
                            </a>
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

        // Update contact section
        document.querySelector('.mtr-directions').textContent = data.contact.transport.mtr;
        document.querySelector('.bus-directions').textContent = data.contact.transport.bus;

    } catch (error) {
        console.error('Error loading language file:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadLanguage(currentLang);
    
    // Language switcher
    document.getElementById('lang-switch').addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        loadLanguage(currentLang);
    });

    // Highlight active section in navbar
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar ul li a');

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 50) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
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