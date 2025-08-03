// ===== MASSAGE PRO - MAIN JAVASCRIPT =====

// Global Variables
let currentBookingStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Available time slots (can be customized)
const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
];

// Services data
const services = {
    classic: {
        name: 'Классический массаж',
        price: 180,
        duration: 60,
        icon: 'fas fa-hand-paper'
    },
    sports: {
        name: 'Спортивный массаж',
        price: 220,
        duration: 60,
        icon: 'fas fa-dumbbell'
    },
    relax: {
        name: 'Релакс массаж',
        price: 200,
        duration: 75,
        icon: 'fas fa-spa'
    },
    deep: {
        name: 'Глубокий массаж',
        price: 250,
        duration: 60,
        icon: 'fas fa-fire'
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    showLoadingScreen();
    setTimeout(() => {
        hideLoadingScreen();
        initializeHeader();
        initializeNavigation();
        initializeBookingSystem();
        initializeAnimations();
        initializeMobileMenu();
        generateCalendar();
        loadBookings();
    }, 2000);
}

// Loading Screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Header functionality
function initializeHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Update active nav link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(hash) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${hash}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos <= bottom) {
            updateActiveNavLink(`#${section.id}`);
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
}

// Booking System
function initializeBookingSystem() {
    // Service selection
    document.querySelectorAll('.service-option').forEach(option => {
        option.addEventListener('click', function() {
            selectServiceOption(this);
        });
    });
    
    // Calendar navigation
    const prevButton = document.querySelector('.calendar-nav.prev');
    const nextButton = document.querySelector('.calendar-nav.next');
    
    if (prevButton) prevButton.addEventListener('click', prevMonth);
    if (nextButton) nextButton.addEventListener('click', nextMonth);
    
    // Form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('input', validateContactForm);
    }
}

// Service Selection Functions
function selectService(serviceKey, serviceName, price) {
    selectedService = {
        key: serviceKey,
        name: serviceName,
        price: price,
        duration: services[serviceKey].duration
    };
    
    // Update service selector in booking form
    const serviceOptions = document.querySelectorAll('.service-option');
    serviceOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.service === serviceKey) {
            option.classList.add('selected');
        }
    });
    
    // Enable next step button
    enableNextStepButton();
    
    // Auto scroll to booking section
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function selectServiceOption(element) {
    // Remove previous selection
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Get service data
    const serviceKey = element.dataset.service;
    selectedService = {
        key: serviceKey,
        name: services[serviceKey].name,
        price: services[serviceKey].price,
        duration: services[serviceKey].duration
    };
    
    enableNextStepButton();
}

// Booking Steps Navigation
function nextBookingStep() {
    if (currentBookingStep < 4) {
        // Validate current step
        if (validateCurrentStep()) {
            hideCurrentStep();
            currentBookingStep++;
            showCurrentStep();
            updateStepIndicators();
            
            if (currentBookingStep === 4) {
                generateBookingSummary();
            }
        }
    }
}

function prevBookingStep() {
    if (currentBookingStep > 1) {
        hideCurrentStep();
        currentBookingStep--;
        showCurrentStep();
        updateStepIndicators();
    }
}

function hideCurrentStep() {
    const currentStepElement = document.querySelector(`.booking-step.step-${currentBookingStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
    }
}

function showCurrentStep() {
    const currentStepElement = document.querySelector(`.booking-step.step-${currentBookingStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Generate time slots when showing step 2
    if (currentBookingStep === 2) {
        generateTimeSlots();
    }
}

function updateStepIndicators() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentBookingStep) {
            step.classList.add('active');
        }
    });
}

function validateCurrentStep() {
    switch(currentBookingStep) {
        case 1:
            return selectedService !== null;
        case 2:
            return selectedDate !== null && selectedTime !== null;
        case 3:
            return validateContactForm();
        default:
            return true;
    }
}

function enableNextStepButton() {
    const nextButton = document.querySelector('.step-1 .next-step-btn');
    if (nextButton) {
        nextButton.disabled = false;
    }
}

// Calendar Functions
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarTitle = document.getElementById('calendarTitle');
    
    if (!calendarGrid || !calendarTitle) return;
    
    // Update title
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('calendar-day-header');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.color = 'var(--text-gray)';
        dayHeader.style.fontSize = '0.8rem';
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    // Adjust first day (Monday = 0, Sunday = 6)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add empty cells for previous month
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        
        const currentDate = new Date(currentYear, currentMonth, day);
        
        // Check if day is in the past
        if (currentDate < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('unavailable');
        } else {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(currentYear, currentMonth, day));
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function selectDate(year, month, day) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
        dayEl.classList.remove('selected');
    });
    
    // Add selection to clicked day
    event.target.classList.add('selected');
    
    selectedDate = new Date(year, month, day);
    generateTimeSlots();
    
    // Enable next step if time is also selected
    if (selectedTime) {
        enableStep2NextButton();
    }
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    timeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = time;
        
        // Check if slot is available (simplified - always available for demo)
        timeSlot.classList.add('available');
        timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

function selectTime(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked slot
    element.classList.add('selected');
    
    selectedTime = time;
    enableStep2NextButton();
}

function enableStep2NextButton() {
    const nextButton = document.querySelector('.step-2 .next-step-btn');
    if (nextButton && selectedDate && selectedTime) {
        nextButton.disabled = false;
    }
}

// Contact Form Validation
function validateContactForm() {
    const name = document.getElementById('clientName');
    const phone = document.getElementById('clientPhone');
    
    if (!name || !phone) return false;
    
    const isValid = name.value.trim().length > 0 && phone.value.trim().length > 0;
    
    // Enable/disable next button based on validation
    const nextButton = document.querySelector('.step-3 .next-step-btn');
    if (nextButton) {
        nextButton.disabled = !isValid;
    }
    
    return isValid;
}

// Booking Summary
function generateBookingSummary() {
    const summaryContainer = document.getElementById('bookingSummary');
    if (!summaryContainer) return;
    
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const notes = document.getElementById('clientNotes').value;
    
    const dateStr = selectedDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    summaryContainer.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Услуга</span>
            <span class="summary-value">${selectedService.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Дата</span>
            <span class="summary-value">${dateStr}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Время</span>
            <span class="summary-value">${selectedTime}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Продолжительность</span>
            <span class="summary-value">${selectedService.duration} минут</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Клиент</span>
            <span class="summary-value">${name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Телефон</span>
            <span class="summary-value">${phone}</span>
        </div>
        ${notes ? `
        <div class="summary-item">
            <span class="summary-label">Примечания</span>
            <span class="summary-value">${notes}</span>
        </div>
        ` : ''}
        <div class="summary-item">
            <span class="summary-label">Стоимость</span>
            <span class="summary-value summary-total">₪${selectedService.price}</span>
        </div>
    `;
}

// Confirm Booking
function confirmBooking() {
    const bookingData = {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        client: {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            notes: document.getElementById('clientNotes').value
        },
        timestamp: new Date().toISOString(),
        id: generateBookingId()
    };
    
    // Save booking to localStorage
    saveBooking(bookingData);
    
    // Send WhatsApp message (simplified)
    sendWhatsAppConfirmation(bookingData);
    
    // Show success modal
    showSuccessModal(bookingData);
    
    // Reset booking form
    resetBookingForm();
}

function generateBookingId() {
    return 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveBooking(bookingData) {
    let bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('massageBookings', JSON.stringify(bookings));
}

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    return bookings;
}

function sendWhatsAppConfirmation(bookingData) {
    const phone = bookingData.client.phone.replace(/\D/g, '');
    const message = `Здравствуйте, ${bookingData.client.name}!

Ваша запись на массаж подтверждена:
🗓 ${bookingData.date.toLocaleDateString('ru-RU')}
⏰ ${bookingData.time}
💆 ${bookingData.service.name}
💰 ₪${bookingData.service.price}

Адрес: ул. Дизенгоф 125, Тель-Авив
Ожидаем вас!

MASSAGE PRO`;
    
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab (for admin)
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
}

function showSuccessModal(bookingData) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    if (modal && message) {
        const dateStr = bookingData.date.toLocaleDateString('ru-RU');
        message.textContent = `Ваша запись на ${dateStr} в ${bookingData.time} успешно создана. Мы отправили подтверждение в WhatsApp.`;
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetBookingForm() {
    currentBookingStep = 1;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    
    // Reset UI
    document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
    document.querySelector('.booking-step.step-1').classList.add('active');
    
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active');
        if (index === 0) step.classList.add('active');
    });
    
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('contactForm').reset();
    
    // Reset buttons
    document.querySelector('.step-1 .next-step-btn').disabled = true;
    document.querySelector('.step-2 .next-step-btn').disabled = true;
    document.querySelector('.step-3 .next-step-btn').disabled = true;
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .contact-item, .credential-item, .stat-box').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-layer-1, .hero-layer-2, .hero-layer-3');
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Utility Functions
function formatPhoneNumber(phone) {
    // Simple phone formatting for Israeli numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('972')) {
        return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
        return `+972${cleaned.substring(1)}`;
    }
    return `+972${cleaned}`;
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^(\+972|972|0)?[5-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for global use
window.selectService = selectService;
window.nextBookingStep = nextBookingStep;
window.prevBookingStep = prevBookingStep;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.confirmBooking = confirmBooking;
window.closeModal = closeModal;

console.log('🔥 Massage Pro - Main JavaScript Loaded Successfully!');