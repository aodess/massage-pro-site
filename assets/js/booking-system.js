// ===== MASSAGE PRO - ADVANCED BOOKING SYSTEM =====

class BookingSystem {
    constructor() {
        this.bookings = this.loadBookings();
        this.schedule = this.loadSchedule();
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCalendar();
        this.setupPhoneValidation();
        this.setupWhatsAppIntegration();
    }

    // Load data from localStorage
    loadBookings() {
        return JSON.parse(localStorage.getItem('massageBookings') || '[]');
    }

    loadSchedule() {
        const defaultSchedule = {
            workingHours: { start: '09:00', end: '21:00' },
            breaks: [{ start: '13:00', end: '14:00' }],
            closedDays: [], // Array of dates in YYYY-MM-DD format
            slotDuration: 60 // minutes
        };
        return JSON.parse(localStorage.getItem('massageSchedule') || JSON.stringify(defaultSchedule));
    }

    loadSettings() {
        const defaultSettings = {
            businessName: 'MASSAGE PRO',
            phone: '+972-50-123-4567',
            address: 'ул. Дизенгоф 125, Тель-Авив',
            whatsappPhone: '972501234567',
            bookingAdvanceDays: 30,
            autoConfirm: true
        };
        return JSON.parse(localStorage.getItem('massageSettings') || JSON.stringify(defaultSettings));
    }

    // Save data to localStorage
    saveBookings() {
        localStorage.setItem('massageBookings', JSON.stringify(this.bookings));
    }

    saveSchedule() {
        localStorage.setItem('massageSchedule', JSON.stringify(this.schedule));
    }

    saveSettings() {
        localStorage.setItem('massageSettings', JSON.stringify(this.settings));
    }

    // Generate available time slots for a specific date
    generateTimeSlots(date) {
        const dateStr = this.formatDate(date);
        const dayOfWeek = date.getDay();
        
        // Check if date is closed
        if (this.schedule.closedDays.includes(dateStr)) {
            return [];
        }

        const slots = [];
        const workStart = this.timeToMinutes(this.schedule.workingHours.start);
        const workEnd = this.timeToMinutes(this.schedule.workingHours.end);
        const slotDuration = this.schedule.slotDuration;

        for (let time = workStart; time < workEnd; time += slotDuration) {
            const timeStr = this.minutesToTime(time);
            
            // Check if slot is during break
            if (!this.isDuringBreak(timeStr)) {
                // Check if slot is available (not booked)
                if (this.isSlotAvailable(dateStr, timeStr)) {
                    slots.push({
                        time: timeStr,
                        available: true,
                        date: dateStr
                    });
                }
            }
        }

        return slots;
    }

    // Check if time slot is available
    isSlotAvailable(date, time) {
        return !this.bookings.some(booking => 
            booking.date === date && 
            booking.time === time && 
            booking.status !== 'cancelled'
        );
    }

    // Check if time is during break
    isDuringBreak(time) {
        const timeMinutes = this.timeToMinutes(time);
        
        return this.schedule.breaks.some(breakPeriod => {
            const breakStart = this.timeToMinutes(breakPeriod.start);
            const breakEnd = this.timeToMinutes(breakPeriod.end);
            return timeMinutes >= breakStart && timeMinutes < breakEnd;
        });
    }

    // Enhanced calendar generation
    generateEnhancedCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const calendarTitle = document.getElementById('calendarTitle');
        
        if (!calendarGrid || !calendarTitle) return;

        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        calendarGrid.innerHTML = '';

        // Day headers
        const dayHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header-day';
            header.textContent = day;
            header.style.cssText = `
                font-weight: 700;
                color: var(--text-gray);
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                padding: 0.5rem;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;
            calendarGrid.appendChild(header);
        });

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Adjust first day (Monday = 0)
        const adjustedFirstDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // Empty cells for previous month
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        // Days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDate = new Date(currentYear, currentMonth, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                <div class="day-indicator"></div>
            `;

            // Style the day
            if (currentDate < today) {
                dayElement.classList.add('past');
            } else if (currentDate > new Date().setDate(today.getDate() + this.settings.bookingAdvanceDays)) {
                dayElement.classList.add('future-blocked');
            } else {
                const slots = this.generateTimeSlots(currentDate);
                const bookedSlots = this.getBookedSlotsForDate(this.formatDate(currentDate));
                
                if (slots.length === 0) {
                    dayElement.classList.add('unavailable');
                } else {
                    dayElement.classList.add('available');
                    
                    // Add availability indicator
                    const indicator = dayElement.querySelector('.day-indicator');
                    const availableSlots = slots.length;
                    const totalPossibleSlots = this.getTotalPossibleSlots();
                    
                    if (bookedSlots.length > 0) {
                        dayElement.classList.add('has-bookings');
                    }
                    
                    if (availableSlots < totalPossibleSlots * 0.3) {
                        indicator.classList.add('busy');
                    } else if (availableSlots < totalPossibleSlots * 0.7) {
                        indicator.classList.add('moderate');
                    } else {
                        indicator.classList.add('free');
                    }
                    
                    dayElement.addEventListener('click', () => this.selectDate(currentDate, dayElement));
                }
            }

            calendarGrid.appendChild(dayElement);
        }

        // Add CSS for calendar styling
        this.addCalendarStyles();
    }

    addCalendarStyles() {
        if (document.getElementById('calendar-dynamic-styles')) return;

        const style = document.createElement('style');
        style.id = 'calendar-dynamic-styles';
        style.textContent = `
            .calendar-day {
                position: relative;
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                border: 1px solid transparent;
            }

            .calendar-day.available {
                background: var(--gradient-glass);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .calendar-day.available:hover {
                background: rgba(255, 107, 53, 0.1);
                border-color: var(--accent-orange);
                transform: scale(1.05);
            }

            .calendar-day.selected {
                background: var(--gradient-primary);
                border-color: transparent;
                color: white;
                box-shadow: var(--shadow-glow);
                transform: scale(1.1);
            }

            .calendar-day.past {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .calendar-day.unavailable {
                opacity: 0.5;
                cursor: not-allowed;
                background: var(--tertiary-dark);
            }

            .calendar-day.has-bookings::before {
                content: '';
                position: absolute;
                top: 2px;
                right: 2px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--accent-orange);
            }

            .day-number {
                font-weight: 600;
                margin-bottom: 2px;
            }

            .day-indicator {
                width: 20px;
                height: 3px;
                border-radius: 2px;
                opacity: 0.7;
            }

            .day-indicator.free {
                background: #4ade80;
            }

            .day-indicator.moderate {
                background: #fbbf24;
            }

            .day-indicator.busy {
                background: #ef4444;
            }

            .calendar-header-day {
                background: var(--gradient-glass);
                backdrop-filter: blur(10px);
            }
        `;
        document.head.appendChild(style);
    }

    selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection
        element.classList.add('selected');
        selectedDate = date;

        // Generate and display time slots
        this.displayTimeSlots(date);
        this.checkStep2Completion();
    }

    displayTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;

        const slots = this.generateTimeSlots(date);
        timeSlotsContainer.innerHTML = '';

        if (slots.length === 0) {
            timeSlotsContainer.innerHTML = `
                <div class="no-slots-message">
                    <i class="fas fa-calendar-times"></i>
                    <p>На эту дату нет свободных слотов</p>
                </div>
            `;
            return;
        }

        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot available';
            slotElement.textContent = slot.time;
            slotElement.addEventListener('click', () => this.selectTime(slot.time, slotElement));
            timeSlotsContainer.appendChild(slotElement);
        });
    }

    selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selection
        element.classList.add('selected');
        selectedTime = time;
        this.checkStep2Completion();
    }

    checkStep2Completion() {
        const nextButton = document.querySelector('.step-2 .next-step-btn');
        if (nextButton && selectedDate && selectedTime) {
            nextButton.disabled = false;
        }
    }

    // Enhanced phone validation
    setupPhoneValidation() {
        const phoneInput = document.getElementById('clientPhone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Israeli phone number
            if (value.length > 0) {
                if (value.startsWith('972')) {
                    value = '+' + value;
                } else if (value.startsWith('0')) {
                    value = '+972' + value.substring(1);
                } else if (!value.startsWith('+972')) {
                    value = '+972' + value;
                }
            }
            
            e.target.value = value;
            this.validatePhone(value);
        });

        phoneInput.addEventListener('blur', (e) => {
            this.validatePhone(e.target.value);
        });
    }

    validatePhone(phone) {
        const phoneInput = document.getElementById('clientPhone');
        const isValid = this.isValidIsraeliPhone(phone);
        
        if (phoneInput) {
            phoneInput.style.borderColor = isValid ? 'var(--accent-orange)' : '#ef4444';
        }
        
        return isValid;
    }

    isValidIsraeliPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        // Israeli mobile: 972 + 5X/7X + 7 digits
        return /^972[57]\d{8}$/.test(cleaned) || /^05[0-9]\d{7}$/.test(cleaned);
    }

    // WhatsApp Integration
    setupWhatsAppIntegration() {
        this.whatsappTemplates = {
            confirmation: (booking) => `🎉 *Запись подтверждена!*

Здравствуйте, ${booking.client.name}!

📅 *Дата:* ${this.formatDateRussian(new Date(booking.date))}
⏰ *Время:* ${booking.time}
💆 *Услуга:* ${booking.service.name}
⏱ *Длительность:* ${booking.service.duration} мин
💰 *Стоимость:* ₪${booking.service.price}

📍 *Адрес:* ${this.settings.address}

${booking.client.notes ? `📝 *Ваши пожелания:* ${booking.client.notes}` : ''}

Ждем вас в ${this.settings.businessName}!

_Для отмены или переноса записи ответьте на это сообщение._`,

            reminder: (booking) => `⏰ *Напоминание о записи*

Здравствуйте, ${booking.client.name}!

Напоминаем о вашей записи:
📅 *Завтра* в ${booking.time}
💆 ${booking.service.name}

📍 ${this.settings.address}

До встречи в ${this.settings.businessName}!`,

            cancellation: (booking) => `❌ *Запись отменена*

${booking.client.name}, ваша запись на ${this.formatDateRussian(new Date(booking.date))} в ${booking.time} отменена.

Для новой записи посетите наш сайт или напишите нам.

${this.settings.businessName}`
        };
    }

    sendWhatsAppMessage(phone, message) {
        const cleanPhone = phone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        // Open in new tab after short delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 500);
    }

    // Create new booking
    async createBooking(bookingData) {
        try {
            // Generate unique ID
            const booking = {
                ...bookingData,
                id: this.generateBookingId(),
                status: 'confirmed',
                createdAt: new Date().toISOString(),
                date: this.formatDate(bookingData.date),
                client: {
                    ...bookingData.client,
                    phone: this.formatPhone(bookingData.client.phone)
                }
            };

            // Add to bookings array
            this.bookings.push(booking);
            this.saveBookings();

            // Send WhatsApp confirmation
            if (this.settings.autoConfirm) {
                const message = this.whatsappTemplates.confirmation(booking);
                this.sendWhatsAppMessage(booking.client.phone, message);
            }

            // Analytics (optional)
            this.trackBookingEvent('booking_created', booking);

            return { success: true, booking };
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, error: error.message };
        }
    }

    // Get bookings for specific date
    getBookedSlotsForDate(date) {
        return this.bookings.filter(booking => 
            booking.date === date && booking.status === 'confirmed'
        );
    }

    // Utility functions
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    formatDateRussian(date) {
        return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('972')) {
            return `+${cleaned}`;
        }
        return `+972${cleaned.replace(/^0/, '')}`;
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    generateBookingId() {
        return 'MP_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    getTotalPossibleSlots() {
        const workStart = this.timeToMinutes(this.schedule.workingHours.start);
        const workEnd = this.timeToMinutes(this.schedule.workingHours.end);
        const slotDuration = this.schedule.slotDuration;
        
        let totalSlots = Math.floor((workEnd - workStart) / slotDuration);
        
        // Subtract break slots
        this.schedule.breaks.forEach(breakPeriod => {
            const breakStart = this.timeToMinutes(breakPeriod.start);
            const breakEnd = this.timeToMinutes(breakPeriod.end);
            const breakSlots = Math.floor((breakEnd - breakStart) / slotDuration);
            totalSlots -= breakSlots;
        });
        
        return totalSlots;
    }

    // Setup event listeners
    setupEventListeners() {
        // Override the original calendar generation
        if (window.generateCalendar) {
            window.generateCalendar = () => this.generateEnhancedCalendar();
        }

        // Enhanced confirm booking
        if (window.confirmBooking) {
            const originalConfirmBooking = window.confirmBooking;
            window.confirmBooking = async () => {
                const bookingData = {
                    service: selectedService,
                    date: selectedDate,
                    time: selectedTime,
                    client: {
                        name: document.getElementById('clientName').value,
                        phone: document.getElementById('clientPhone').value,
                        notes: document.getElementById('clientNotes').value
                    }
                };

                const result = await this.createBooking(bookingData);
                
                if (result.success) {
                    this.showEnhancedSuccessModal(result.booking);
                    if (typeof resetBookingForm === 'function') {
                        resetBookingForm();
                    }
                } else {
                    this.showErrorModal(result.error);
                }
            };
        }
    }

    showEnhancedSuccessModal(booking) {
        const modal = document.getElementById('successModal');
        const message = document.getElementById('successMessage');
        
        if (modal && message) {
            const dateStr = this.formatDateRussian(new Date(booking.date));
            message.innerHTML = `
                <div class="success-details">
                    <p><strong>Номер записи:</strong> ${booking.id}</p>
                    <p><strong>Дата и время:</strong> ${dateStr}, ${booking.time}</p>
                    <p><strong>Услуга:</strong> ${booking.service.name}</p>
                    <p><strong>Стоимость:</strong> ₪${booking.service.price}</p>
                    <br>
                    <p>📱 Подтверждение отправлено в WhatsApp</p>
                    <p>📧 Напоминание будет отправлено за день до визита</p>
                </div>
            `;
            modal.classList.add('show');
        }
    }

    showErrorModal(error) {
        alert(`Ошибка при создании записи: ${error}`);
    }

    // Initialize calendar on load
    initializeCalendar() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.generateEnhancedCalendar(), 100);
            });
        } else {
            setTimeout(() => this.generateEnhancedCalendar(), 100);
        }
    }

    // Analytics tracking (optional)
    trackBookingEvent(eventName, data) {
        // You can integrate with Google Analytics, Facebook Pixel, etc.
        console.log(`📊 Analytics: ${eventName}`, data);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter_1: data.service?.name,
                custom_parameter_2: data.client?.phone,
                value: data.service?.price
            });
        }
    }
}

// Initialize the booking system
const bookingSystem = new BookingSystem();

// Export for global access
window.bookingSystem = bookingSystem;

console.log('🗓️ Advanced Booking System Loaded Successfully!');