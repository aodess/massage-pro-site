// Добавляем в начало simple-booking.js для автоматической миграции
(function() {
    // Проверяем и мигрируем старые данные
    const images = JSON.parse(localStorage.getItem('massageImages') || '{}');
    let needsMigration = false;
    
    // Проверяем каждую категорию изображений
    Object.keys(images).forEach(category => {
        images[category].forEach(img => {
            // Если есть только data, дублируем в optimized
            if (img.data && !img.optimized) {
                img.optimized = img.data;
                needsMigration = true;
            }
            // Если есть только optimized, дублируем в data
            else if (img.optimized && !img.data) {
                img.data = img.optimized;
                needsMigration = true;
            }
        });
    });
    
    if (needsMigration) {
        localStorage.setItem('massageImages', JSON.stringify(images));
        console.log('Images migrated to new format');
    }
})();
// ===== SIMPLE BOOKING SYSTEM =====

// Global variables
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Services data
let services = {};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 500);
    
    initializeApp();
});

function initializeApp() {
    loadContent();
    loadServices();
    initializeHeader();
    initializeCalendar();
    initializeMobileMenu();
    initializePhoneInput();
}

// Load saved content
function loadContent() {
    const savedContent = localStorage.getItem('massageContent');
    if (savedContent) {
        const content = JSON.parse(savedContent);
        
        // Update business info
        if (content.businessName) {
            const logoTexts = document.querySelectorAll('.logo-text');
            logoTexts.forEach(el => el.textContent = content.businessName);
        }
        if (content.businessPhone) {
            const phoneEl = document.getElementById('businessPhone');
            if (phoneEl) phoneEl.textContent = content.businessPhone;
            const phoneLink = document.getElementById('phoneLink');
            if (phoneLink) phoneLink.href = `tel:${content.businessPhone.replace(/\D/g, '')}`;
        }
        if (content.businessAddress) {
            const addressEl = document.getElementById('businessAddress');
            if (addressEl) addressEl.textContent = content.businessAddress;
        }
        if (content.aboutText) {
            const aboutEl = document.getElementById('aboutText');
            if (aboutEl) aboutEl.textContent = content.aboutText;
        }
        if (content.whatsappPhone) {
            const whatsappLink = document.getElementById('whatsappLink');
            if (whatsappLink) whatsappLink.href = `https://wa.me/${content.whatsappPhone}`;
        }
    }
    
    // Load profile image
    const savedImages = localStorage.getItem('massageImages');
    if (savedImages) {
        const images = JSON.parse(savedImages);
        if (images.profile && images.profile.length > 0) {
            const profileImg = document.getElementById('profileImage');
            const placeholder = document.getElementById('profilePlaceholder');
            if (profileImg && placeholder) {
                profileImg.src = images.profile[0].data;
                profileImg.style.display = 'block';
                placeholder.style.display = 'none';
            }
        }
    }
}

// Load services
function loadServices() {
    const savedServices = localStorage.getItem('massageServices');
    services = savedServices ? JSON.parse(savedServices) : {
        classic: { name: 'Классический массаж', price: 180, duration: 60, icon: 'fa-hand-paper' },
        sports: { name: 'Спортивный массаж', price: 220, duration: 60, icon: 'fa-dumbbell' },
        relax: { name: 'Релакс массаж', price: 200, duration: 75, icon: 'fa-spa' },
        deep: { name: 'Глубокий массаж', price: 250, duration: 60, icon: 'fa-fire' }
    };
    
    // Render services grid
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesGrid.innerHTML = Object.keys(services).map(key => {
            const service = services[key];
            return `
                <div class="service-card" onclick="quickSelectService('${key}')">
                    <i class="fas ${service.icon} service-icon"></i>
                    <h3 class="service-name">${service.name}</h3>
                    <div class="service-price">${service.price}</div>
                    <div class="service-duration">${service.duration} минут</div>
                </div>
            `;
        }).join('');
    }
    
    // Render service selection in booking
    const serviceSelect = document.getElementById('serviceSelect');
    if (serviceSelect) {
        serviceSelect.innerHTML = Object.keys(services).map(key => {
            const service = services[key];
            return `
                <div class="service-option" onclick="selectService('${key}')" data-service="${key}">
                    <span class="service-option-name">${service.name}</span>
                    <span class="service-option-price">${service.price}</span>
                </div>
            `;
        }).join('');
    }
}

// Quick select service from services section
function quickSelectService(key) {
    selectedService = { key, ...services[key] };
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    
    // Show first step and select service
    showStep(1);
    selectService(key);
}

// Select service in booking
function selectService(key) {
    selectedService = { key, ...services[key] };
    
    // Update UI
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    const selectedOption = document.querySelector(`[data-service="${key}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// Navigation between steps
function showStep(step) {
    currentStep = step;
    
    // Update step indicators
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < step) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Show current step
    document.querySelectorAll('.booking-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update navigation
    const navActions = document.getElementById('navigationActions');
    if (step === 4) {
        navActions.style.display = 'none';
    } else {
        navActions.style.display = 'flex';
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = 
                (step === 1 && !selectedService) ||
                (step === 2 && !selectedDate) ||
                (step === 3 && !selectedTime);
        }
    }
    
    // Initialize step-specific content
    if (step === 2) {
        renderCalendar();
    } else if (step === 3) {
        showTimeSlots();
    } else if (step === 4) {
        showSummary();
    }
}

function nextStep() {
    if (currentStep < 4) {
        showStep(currentStep + 1);
    }
}

function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Calendar functionality
function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    const monthEl = document.getElementById('currentMonth');
    if (monthEl) {
        monthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let html = '';
    
    // Day headers
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells before first day
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day disabled"></div>';
    }
    
    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isToday = date.getTime() === today.getTime();
        const isPast = date < today;
        const isWeekend = date.getDay() === 0;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isPast || isWeekend) {
            classes += ' disabled';
        } else {
            classes += ' available';
        }
        
        if (selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === currentMonth && 
            selectedDate.getFullYear() === currentYear) {
            classes += ' selected';
        }
        
        const onclick = !isPast && !isWeekend ? `onclick="selectDate(${day})"` : '';
        
        html += `<div class="${classes}" ${onclick} data-date="${day}">${day}</div>`;
    }
    
    const calendarGrid = document.getElementById('calendarGrid');
    if (calendarGrid) {
        calendarGrid.innerHTML = html;
    }
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
    renderCalendar();
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// Time slots
function showTimeSlots() {
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const timeGrid = document.getElementById('timeGrid');
    
    if (!timeGrid) return;
    
    // Get existing bookings for selected date
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    const dateStr = selectedDate.toISOString().split('T')[0];
    const bookedTimes = bookings
        .filter(b => b.date === dateStr && b.status === 'confirmed')
        .map(b => b.time);
    
    timeGrid.innerHTML = timeSlots.map(time => {
        const isBooked = bookedTimes.includes(time);
        const classes = `time-slot ${isBooked ? 'disabled' : ''}`;
        const onclick = !isBooked ? `onclick="selectTime('${time}')"` : '';
        
        return `
            <div class="${classes}" ${onclick} data-time="${time}">
                ${time}
            </div>
        `;
    }).join('');
}

function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    const selectedSlot = document.querySelector(`[data-time="${time}"]`);
    if (selectedSlot) {
        selectedSlot.classList.add('selected');
    }
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// Summary
function showSummary() {
    const summary = document.getElementById('bookingSummary');
    if (!summary || !selectedDate || !selectedService || !selectedTime) return;
    
    const dateStr = selectedDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    summary.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Услуга:</span>
            <span class="summary-value">${selectedService.name}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Дата:</span>
            <span class="summary-value">${dateStr}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Время:</span>
            <span class="summary-value">${selectedTime}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Длительность:</span>
            <span class="summary-value">${selectedService.duration} мин</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><strong>Стоимость:</strong></span>
            <span class="summary-value"><strong>${selectedService.price}</strong></span>
        </div>
    `;
}

// Phone input
function initializePhoneInput() {
    const phoneInput = document.getElementById('clientPhone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        
        if (value.length > 0) formatted = value.substring(0, 2);
        if (value.length > 2) formatted += '-' + value.substring(2, 5);
        if (value.length > 5) formatted += '-' + value.substring(5, 9);
        
        e.target.value = formatted;
    });
}

// Confirm booking
function confirmBooking() {
    const phone = document.getElementById('clientPhone').value;
    
    if (!phone || phone.length < 11) {
        alert('Пожалуйста, введите номер телефона');
        return;
    }
    
    const booking = {
        id: 'BK' + Date.now(),
        service: selectedService,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        client: {
            phone: '+972' + phone.replace(/\D/g, ''),
            name: 'Клиент'
        },
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('massageBookings', JSON.stringify(bookings));
    
    // Send WhatsApp notification
    sendWhatsAppNotification(booking);
    
    // Show success
    showSuccessModal(booking);
    
    // Reset form
    resetBooking();
}

function sendWhatsAppNotification(booking) {
    const businessInfo = JSON.parse(localStorage.getItem('massageContent') || '{}');
    const whatsappPhone = businessInfo.whatsappPhone || '972501234567';
    
    const dateStr = new Date(booking.date).toLocaleDateString('ru-RU');
    const message = `Новая запись!
    
Телефон: ${booking.client.phone}
Услуга: ${booking.service.name}
Дата: ${dateStr}
Время: ${booking.time}`;
    
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 500);
}

function showSuccessModal(booking) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    if (modal && message) {
        const dateStr = new Date(booking.date).toLocaleDateString('ru-RU');
        message.textContent = `Ваша запись на ${dateStr} в ${booking.time} успешно создана!`;
        
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetBooking() {
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    currentStep = 1;
    
    const phoneInput = document.getElementById('clientPhone');
    if (phoneInput) phoneInput.value = '';
    
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    showStep(1);
}

// Header and navigation
function initializeHeader() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
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
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}

// Make functions global
window.quickSelectService = quickSelectService;
window.selectService = selectService;
window.showStep = showStep;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.changeMonth = changeMonth;
window.selectDate = selectDate;
window.selectTime = selectTime;
window.confirmBooking = confirmBooking;
window.closeModal = closeModal;

// ===== UX IMPROVEMENTS =====

// Автопереход на следующий шаг после выбора
function autoProgressToNextStep() {
    setTimeout(() => {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn && !nextBtn.disabled) {
            nextStep();
        }
    }, 600);
}

// Обновляем функции выбора для автопрогресса
const originalSelectService = window.selectService;
window.selectService = function(key) {
    originalSelectService(key);
    
    // Добавляем анимацию успеха
    const selectedOption = document.querySelector(`[data-service="${key}"]`);
    if (selectedOption) {
        selectedOption.classList.add('success-animation');
    }
    
    // Автопереход
    autoProgressToNextStep();
};

const originalSelectDate = window.selectDate;
window.selectDate = function(day) {
    originalSelectDate(day);
    
    // Добавляем анимацию
    const selectedDay = document.querySelector(`.calendar-day.selected`);
    if (selectedDay) {
        selectedDay.classList.add('success-animation');
    }
    
    // Автопереход
    autoProgressToNextStep();
};

const originalSelectTime = window.selectTime;
window.selectTime = function(time) {
    originalSelectTime(time);
    
    // Добавляем анимацию
    const selectedSlot = document.querySelector(`[data-time="${time}"]`);
    if (selectedSlot) {
        selectedSlot.classList.add('success-animation');
    }
    
    // Автопереход
    autoProgressToNextStep();
};

// Добавляем индикацию количества свободных слотов
function updateCalendarWithSlots() {
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    
    document.querySelectorAll('.calendar-day.available').forEach(dayEl => {
        const day = parseInt(dayEl.dataset.date);
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Подсчитываем занятые слоты
        const bookedSlots = bookings.filter(b => 
            b.date === dateStr && 
            b.status === 'confirmed'
        ).length;
        
        const totalSlots = 11; // Всего слотов в день
        const availableSlots = totalSlots - bookedSlots;
        
        // Добавляем атрибут для CSS
        dayEl.setAttribute('data-slots', availableSlots);
        
        // Добавляем класс если мало слотов
        if (availableSlots > 0 && availableSlots <= 3) {
            dayEl.classList.add('few-slots');
        }
    });
}

// Обновляем renderCalendar чтобы вызывать updateCalendarWithSlots
const originalRenderCalendar = window.renderCalendar;
window.renderCalendar = function() {
    originalRenderCalendar();
    setTimeout(updateCalendarWithSlots, 100);
};

// Добавляем подсказки при наведении
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем плавную прокрутку к активному шагу
    const originalShowStep = window.showStep;
    window.showStep = function(step) {
        originalShowStep(step);
        
        // Прокручиваем к форме бронирования
        setTimeout(() => {
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    };
});

// Улучшаем отображение занятых слотов
const originalShowTimeSlots = window.showTimeSlots;
window.showTimeSlots = function() {
    originalShowTimeSlots();
    
    // Добавляем подсказки для занятых слотов
    document.querySelectorAll('.time-slot.disabled').forEach(slot => {
        slot.title = 'Время занято';
    });
    
    document.querySelectorAll('.time-slot:not(.disabled)').forEach(slot => {
        slot.title = 'Нажмите для выбора';
    });
};

// Добавляем индикатор загрузки при отправке
const originalConfirmBooking = window.confirmBooking;
window.confirmBooking = function() {
    const confirmBtn = document.querySelector('.booking-actions .btn-success');
    if (confirmBtn) {
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        confirmBtn.disabled = true;
        
        setTimeout(() => {
            originalConfirmBooking();
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }, 1000);
    } else {
        originalConfirmBooking();
    }
};

console.log('UX improvements loaded');

// Автосохранение состояния бронирования
class BookingAutosave {
    constructor() {
        this.storageKey = 'bookingDraft';
        this.saveInterval = null;
    }
    
    start() {
        // Сохраняем каждые 5 секунд
        this.saveInterval = setInterval(() => this.save(), 5000);
        
        // Восстанавливаем при загрузке
        this.restore();
    }
    
    save() {
        const draft = {
            service: window.selectedService,
            date: window.selectedDate,
            time: window.selectedTime,
            step: window.currentStep,
            timestamp: Date.now()
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(draft));
    }
    
    restore() {
        const draft = localStorage.getItem(this.storageKey);
        if (!draft) return;
        
        const data = JSON.parse(draft);
        // Проверяем, что черновик не старше 1 часа
        if (Date.now() - data.timestamp > 3600000) {
            localStorage.removeItem(this.storageKey);
            return;
        }
        
        // Восстанавливаем состояние
        if (data.service) {
            window.selectedService = data.service;
            selectService(data.service.key);
        }
        if (data.date) {
            window.selectedDate = new Date(data.date);
        }
        if (data.time) {
            window.selectedTime = data.time;
        }
    }
    
    clear() {
        localStorage.removeItem(this.storageKey);
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }
    }
}

// Инициализируем автосохранение
const bookingAutosave = new BookingAutosave();
bookingAutosave.start();


