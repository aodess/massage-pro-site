// ===== MASSAGE PRO - MAIN JAVASCRIPT =====

// Global variables
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Default services
const defaultServices = {
    classic: { name: 'Классический массаж', price: 180, duration: 60, icon: 'fa-hand-paper' },
    sports: { name: 'Спортивный массаж', price: 220, duration: 60, icon: 'fa-dumbbell' },
    relax: { name: 'Релакс массаж', price: 200, duration: 75, icon: 'fa-spa' },
    deep: { name: 'Глубокий массаж', price: 250, duration: 60, icon: 'fa-fire' }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
    
    initializeApp();
});

function initializeApp() {
    loadContent();
    loadServices();
    initializeHeader();
    initializeCalendar();
    initializeMobileMenu();
    initializeBookingSystem();
}

// Load saved content
function loadContent() {
    const savedContent = localStorage.getItem('massageContent');
    if (savedContent) {
        const content = JSON.parse(savedContent);
        
        // Update business info
        if (content.businessName) {
            document.querySelector('.logo-text').textContent = content.businessName;
        }
        if (content.businessPhone) {
            document.getElementById('businessPhone').textContent = content.businessPhone;
            document.getElementById('phoneLink').href = `tel:${content.businessPhone.replace(/\D/g, '')}`;
        }
        if (content.businessAddress) {
            document.getElementById('businessAddress').textContent = content.businessAddress;
        }
        if (content.aboutText) {
            document.getElementById('aboutText').textContent = content.aboutText;
        }
        if (content.whatsappPhone) {
            document.getElementById('whatsappLink').href = `https://wa.me/${content.whatsappPhone}`;
        }
    }
    
    // Load profile image
    const savedImages = localStorage.getItem('massageImages');
    if (savedImages) {
        const images = JSON.parse(savedImages);
        if (images.profile && images.profile.length > 0) {
            const profileImg = document.getElementById('profileImage');
            const placeholder = document.getElementById('profilePlaceholder');
            profileImg.src = images.profile[0].optimized;
            profileImg.style.display = 'block';
            placeholder.style.display = 'none';
        }
    }
}

// Load services
function loadServices() {
    const savedServices = localStorage.getItem('massageServices');
    const services = savedServices ? JSON.parse(savedServices) : defaultServices;
    
    // Render services grid
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = Object.keys(services).map(key => {
        const service = services[key];
        return `
            <div class="service-card" data-service="${key}" onclick="selectServiceFromCard('${key}')">
                <i class="fas ${service.icon} service-icon"></i>
                <h3 class="service-name">${service.name}</h3>
                <div class="service-price">₪${service.price}</div>
                <div class="service-duration">${service.duration} минут</div>
            </div>
        `;
    }).join('');
    
    // Render service buttons for booking
    const serviceButtons = document.getElementById('serviceButtons');
    serviceButtons.innerHTML = Object.keys(services).map(key => {
        const service = services[key];
        return `
            <button class="service-btn" onclick="selectService('${key}')" data-service="${key}">
                <span class="service-btn-name">${service.name}</span>
                <span class="service-btn-price">₪${service.price}</span>
            </button>
        `;
    }).join('');
    
    window.services = services;
}

// Header scroll effect
function initializeHeader() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });
}

// Mobile menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function closeMobileMenu() {
    document.getElementById('navMenu').classList.remove('active');
}

// Service selection
function selectServiceFromCard(key) {
    selectedService = { key, ...services[key] };
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-select service in booking
    selectService(key);
}

function selectService(key) {
    selectedService = { key, ...services[key] };
    
    // Update UI
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-service="${key}"]`).classList.add('selected');
    
    // Update summary
    updateBookingSummary();
    
    // Enable next button
    checkStepCompletion();
}

// Calendar
function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const today = new Date();
    
    let html = '';
    
    // Day headers
    dayNames.forEach(day => {
        html += `<div class="calendar-header">${day}</div>`;
    });
    
    // Empty cells before first day
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day disabled"></div>';
    }
    
    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' disabled';
        
        html += `<div class="${classes}" ${!isPast ? `onclick="selectDate(${day})"` : ''} data-date="${day}">
                    ${day}
                 </div>`;
    }
    
    document.getElementById('calendarGrid').innerHTML = html;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function selectDate(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
    
    // Update UI
    document.querySelectorAll('.calendar-day').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`[data-date="${day}"]`).classList.add('selected');
    
    // Show time slots
    showTimeSlots();
    updateBookingSummary();
    checkStepCompletion();
}

function showTimeSlots() {
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    
    const timeSlotsSection = document.getElementById('timeSlots');
    timeSlotsSection.style.display = 'block';
    
    const timeGrid = document.getElementById('timeGrid');
    timeGrid.innerHTML = timeSlots.map(time => {
        const isAvailable = checkTimeAvailability(selectedDate, time);
        return `
            <button class="time-slot ${!isAvailable ? 'disabled' : ''}" 
                    onclick="selectTime('${time}')" 
                    data-time="${time}"
                    ${!isAvailable ? 'disabled' : ''}>
                ${time}
            </button>
        `;
    }).join('');
}

function checkTimeAvailability(date, time) {
    // Check existing bookings
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    const dateStr = date.toISOString().split('T')[0];
    
    return !bookings.some(booking => 
        booking.date === dateStr && 
        booking.time === time && 
        booking.status === 'confirmed'
    );
}

function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`[data-time="${time}"]`).classList.add('selected');
    
    updateBookingSummary();
    checkStepCompletion();
}

// Booking system
function initializeBookingSystem() {
    // Form validation
    const form = document.getElementById('bookingForm');
    form.addEventListener('input', () => {
        checkStepCompletion();
    });
}

function nextStep() {
    if (currentStep === 1) {
        showStep(2);
    }
}

function previousStep() {
    if (currentStep === 2) {
        showStep(1);
    }
}

function showStep(step) {
    document.querySelectorAll('.booking-step').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    currentStep = step;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (step === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'inline-flex';
        confirmBtn.style.display = 'none';
    } else if (step === 2) {
        prevBtn.style.display = 'inline-flex';
        nextBtn.style.display = 'none';
        confirmBtn.style.display = 'inline-flex';
    }
    
    checkStepCompletion();
}

function checkStepCompletion() {
    const nextBtn = document.getElementById('nextBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (currentStep === 1) {
        nextBtn.disabled = !selectedService || !selectedDate || !selectedTime;
    } else if (currentStep === 2) {
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        confirmBtn.disabled = !name || !phone;
    }
}

function updateBookingSummary() {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    const summary = document.getElementById('bookingSummary');
    const dateStr = selectedDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    summary.innerHTML = `
        <h4>Детали записи:</h4>
        <div class="summary-item">
            <span>Услуга:</span>
            <span>${selectedService.name}</span>
        </div>
        <div class="summary-item">
            <span>Дата:</span>
            <span>${dateStr}</span>
        </div>
        <div class="summary-item">
            <span>Время:</span>
            <span>${selectedTime}</span>
        </div>
        <div class="summary-item">
            <span>Длительность:</span>
            <span>${selectedService.duration} мин</span>
        </div>
        <div class="summary-item">
            <span><strong>Стоимость:</strong></span>
            <span><strong>₪${selectedService.price}</strong></span>
        </div>
    `;
}

function confirmBooking() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const notes = document.getElementById('clientNotes').value.trim();
    
    if (!name || !phone) return;
    
    const booking = {
        id: 'BK' + Date.now(),
        service: selectedService,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        client: { name, phone, notes },
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('massageBookings', JSON.stringify(bookings));
    
    // Send WhatsApp notification
    sendWhatsAppNotification(booking);
    
    // Show success modal
    showSuccessModal(booking);
    
    // Reset form
    resetBookingForm();
}

function sendWhatsAppNotification(booking) {
    const businessInfo = JSON.parse(localStorage.getItem('massageContent') || '{}');
    const whatsappPhone = businessInfo.whatsappPhone || '972501234567';
    
    const dateStr = new Date(booking.date).toLocaleDateString('ru-RU');
    const message = `Новая запись!
    
Клиент: ${booking.client.name}
Телефон: ${booking.client.phone}
Услуга: ${booking.service.name}
Дата: ${dateStr}
Время: ${booking.time}
${booking.client.notes ? `Примечания: ${booking.client.notes}` : ''}`;
    
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 500);
}

function showSuccessModal(booking) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    const dateStr = new Date(booking.date).toLocaleDateString('ru-RU');
    message.textContent = `Ваша запись на ${dateStr} в ${booking.time} успешно создана! Мы отправили подтверждение в WhatsApp.`;
    
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

function resetBookingForm() {
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    currentStep = 1;
    
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    showStep(1);
    renderCalendar();
    document.getElementById('timeSlots').style.display = 'none';
    document.getElementById('bookingSummary').innerHTML = '';
}