// ===== SMART CALENDAR SYSTEM =====
// Файл: assets/js/smart-calendar.js

class SmartCalendar {
    constructor() {
        this.bufferTime = 15; // 15 минут между записями
        this.workingDays = [1, 2, 3, 4, 5, 6]; // Пн-Сб (0 = Воскресенье)
        this.holidays = this.loadHolidays();
        this.specialHours = this.loadSpecialHours();
        this.blockLists = this.loadBlockLists();
        this.init();
    }

    init() {
        // Загрузка сохраненных данных
        this.loadSavedData();
        
        // Установка обработчиков
        this.setupEventListeners();
    }

    loadSavedData() {
        try {
            this.holidays = JSON.parse(localStorage.getItem('massageHolidays') || '[]');
            this.specialHours = JSON.parse(localStorage.getItem('massageSpecialHours') || '{}');
            this.blockLists = JSON.parse(localStorage.getItem('massageBlockLists') || '[]');
        } catch (error) {
            console.error('Error loading saved calendar data:', error);
        }
    }

    loadHolidays() {
        return JSON.parse(localStorage.getItem('massageHolidays') || '[]');
    }

    loadSpecialHours() {
        return JSON.parse(localStorage.getItem('massageSpecialHours') || '{}');
    }

    loadBlockLists() {
        return JSON.parse(localStorage.getItem('massageBlockLists') || '[]');
    }

    // Генерация доступных слотов с учетом всех факторов
    generateAvailableSlots(date, serviceDuration = 60) {
        const dateStr = this.formatDate(date);
        const dayOfWeek = date.getDay();
        
        // Проверки доступности дня
        if (!this.isDayAvailable(date)) {
            return [];
        }

        const workingHours = this.getWorkingHoursForDate(date);
        if (!workingHours) {
            return [];
        }

        const slots = [];
        const startTime = this.timeToMinutes(workingHours.start);
        const endTime = this.timeToMinutes(workingHours.end);
        const totalDuration = serviceDuration + this.bufferTime;

        // Генерация слотов с проверкой доступности
        for (let time = startTime; time <= endTime - serviceDuration; time += 30) {
            const slotStart = this.minutesToTime(time);
            const slotEnd = this.minutesToTime(time + serviceDuration);
            
            if (this.isSlotAvailable(dateStr, slotStart, serviceDuration)) {
                slots.push({
                    time: slotStart,
                    endTime: slotEnd,
                    duration: serviceDuration,
                    available: true,
                    type: this.getSlotType(time, startTime, endTime)
                });
            }
        }

        return slots;
    }

    // Проверка доступности конкретного слота
    isSlotAvailable(date, startTime, duration) {
        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = startMinutes + duration + this.bufferTime;

        // Проверка пересечений с существующими записями
        const existingBookings = this.getBookingsForDate(date);
        for (const booking of existingBookings) {
            const bookingStart = this.timeToMinutes(booking.time);
            const bookingEnd = bookingStart + booking.service.duration + this.bufferTime;
            
            if (this.hasTimeOverlap(startMinutes, endMinutes, bookingStart, bookingEnd)) {
                return false;
            }
        }

        // Проверка перерывов
        const breaks = this.getBreaksForDate(date);
        for (const breakPeriod of breaks) {
            const breakStart = this.timeToMinutes(breakPeriod.start);
            const breakEnd = this.timeToMinutes(breakPeriod.end);
            
            if (this.hasTimeOverlap(startMinutes, endMinutes, breakStart, breakEnd)) {
                return false;
            }
        }

        // Проверка заблокированных интервалов
        for (const block of this.blockLists) {
            if (block.date === date) {
                const blockStart = this.timeToMinutes(block.startTime);
                const blockEnd = this.timeToMinutes(block.endTime);
                
                if (this.hasTimeOverlap(startMinutes, endMinutes, blockStart, blockEnd)) {
                    return false;
                }
            }
        }

        return true;
    }

    // Проверка пересечения временных интервалов
    hasTimeOverlap(start1, end1, start2, end2) {
        return start1 < end2 && end1 > start2;
    }

    // Определение типа слота (утренний, дневной, вечерний)
    getSlotType(timeMinutes, startTime, endTime) {
        const morning = startTime + 4 * 60; // Первые 4 часа
        const evening = endTime - 3 * 60;   // Последние 3 часа
        
        if (timeMinutes < morning) return 'morning';
        if (timeMinutes > evening) return 'evening';
        return 'day';
    }

    // Проверка доступности дня
    isDayAvailable(date) {
        const dayOfWeek = date.getDay();
        const dateStr = this.formatDate(date);
        
        // Проверка рабочих дней
        if (!this.workingDays.includes(dayOfWeek)) {
            return false;
        }
        
        // Проверка праздников
        if (this.holidays.includes(dateStr)) {
            return false;
        }
        
        // Проверка прошедших дней
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            return false;
        }
        
        return true;
    }

    // Получение рабочих часов для конкретной даты
    getWorkingHoursForDate(date) {
        const dateStr = this.formatDate(date);
        
        // Проверка особых часов для конкретного дня
        if (this.specialHours[dateStr]) {
            return this.specialHours[dateStr];
        }
        
        // Стандартные рабочие часы
        const schedule = JSON.parse(localStorage.getItem('massageSchedule') || '{}');
        return schedule.workingHours || { start: '09:00', end: '21:00' };
    }

    // Получение перерывов для даты
    getBreaksForDate(date) {
        const schedule = JSON.parse(localStorage.getItem('massageSchedule') || '{}');
        return schedule.breaks || [];
    }

    // Получение записей для даты
    getBookingsForDate(date) {
        const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
        return bookings.filter(booking => 
            booking.date === date && 
            booking.status === 'confirmed'
        );
    }

    // Блокировка временного интервала
    blockTimeSlot(date, startTime, endTime, reason = '') {
        this.blockLists.push({
            date,
            startTime,
            endTime,
            reason,
            createdAt: new Date().toISOString()
        });
        this.saveBlockLists();
    }

    // Установка особых рабочих часов
    setSpecialHours(date, startTime, endTime) {
        this.specialHours[date] = { start: startTime, end: endTime };
        this.saveSpecialHours();
    }

    // Добавление праздника
    addHoliday(date, name = '') {
        this.holidays.push(date);
        this.saveHolidays();
    }

    // Автоматическая оптимизация расписания
    optimizeSchedule(date) {
        const bookings = this.getBookingsForDate(date);
        const optimized = [];
        
        // Сортировка записей по времени
        bookings.sort((a, b) => 
            this.timeToMinutes(a.time) - this.timeToMinutes(b.time)
        );
        
        // Проверка возможности сжатия интервалов
        for (let i = 0; i < bookings.length - 1; i++) {
            const current = bookings[i];
            const next = bookings[i + 1];
            
            const currentEnd = this.timeToMinutes(current.time) + current.service.duration;
            const nextStart = this.timeToMinutes(next.time);
            const gap = nextStart - currentEnd;
            
            if (gap > this.bufferTime + 30) { // Если зазор больше необходимого
                optimized.push({
                    suggestion: 'compress',
                    currentBooking: current.id,
                    nextBooking: next.id,
                    possibleGain: gap - this.bufferTime
                });
            }
        }
        
        return optimized;
    }

    // Предложение альтернативного времени
    suggestAlternativeSlots(requestedDate, requestedTime, serviceDuration) {
        const alternatives = [];
        
        // Поиск ближайших доступных слотов в тот же день
        const sameDay = this.generateAvailableSlots(requestedDate, serviceDuration);
        const requestedMinutes = this.timeToMinutes(requestedTime);
        
        // Сортировка по близости к запрошенному времени
        sameDay.sort((a, b) => {
            const diffA = Math.abs(this.timeToMinutes(a.time) - requestedMinutes);
            const diffB = Math.abs(this.timeToMinutes(b.time) - requestedMinutes);
            return diffA - diffB;
        });
        
        alternatives.push(...sameDay.slice(0, 3));
        
        // Поиск в соседние дни
        for (let i = 1; i <= 7; i++) {
            const nextDate = new Date(requestedDate);
            nextDate.setDate(nextDate.getDate() + i);
            
            const nextDaySlots = this.generateAvailableSlots(nextDate, serviceDuration);
            if (nextDaySlots.length > 0) {
                // Находим слоты близкие к запрошенному времени
                nextDaySlots.sort((a, b) => {
                    const diffA = Math.abs(this.timeToMinutes(a.time) - requestedMinutes);
                    const diffB = Math.abs(this.timeToMinutes(b.time) - requestedMinutes);
                    return diffA - diffB;
                });
                
                alternatives.push(...nextDaySlots.slice(0, 2).map(slot => ({
                    ...slot,
                    date: nextDate,
                    dateStr: this.formatDate(nextDate)
                })));
            }
            
            if (alternatives.length >= 8) break;
        }
        
        return alternatives.slice(0, 8);
    }

    // Генерация улучшенного календаря
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
            
            const dateStr = this.formatDate(currentDate);
            const isHoliday = this.holidays.includes(dateStr);
            const hasSpecialHours = !!this.specialHours[dateStr];
            
            dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                <div class="day-indicators">
                    ${isHoliday ? '<i class="fas fa-ban holiday-icon"></i>' : ''}
                    ${hasSpecialHours ? '<i class="fas fa-clock special-hours-icon"></i>' : ''}
                </div>
                <div class="day-booking-count"></div>
            `;

            // Style the day
            if (currentDate < today) {
                dayElement.classList.add('past');
            } else if (isHoliday) {
                dayElement.classList.add('holiday');
            } else if (currentDate > new Date().setDate(today.getDate() + 30)) {
                dayElement.classList.add('future-blocked');
            } else {
                const slots = this.generateAvailableSlots(currentDate, 60);
                const bookedSlots = this.getBookingsForDate(dateStr);
                
                if (slots.length === 0) {
                    dayElement.classList.add('unavailable');
                } else {
                    dayElement.classList.add('available');
                    
                    // Add booking count
                    if (bookedSlots.length > 0) {
                        dayElement.classList.add('has-bookings');
                        const countElement = dayElement.querySelector('.day-booking-count');
                        countElement.textContent = bookedSlots.length;
                        countElement.style.display = 'block';
                    }
                    
                    // Add availability indicator
                    const availableSlots = slots.length;
                    const totalPossibleSlots = this.getTotalPossibleSlots();
                    const occupancyRate = (totalPossibleSlots - availableSlots) / totalPossibleSlots;
                    
                    if (occupancyRate > 0.8) {
                        dayElement.classList.add('busy');
                    } else if (occupancyRate > 0.5) {
                        dayElement.classList.add('moderate');
                    } else {
                        dayElement.classList.add('free');
                    }
                    
                    dayElement.addEventListener('click', () => this.selectDate(currentDate, dayElement));
                }
            }

            calendarGrid.appendChild(dayElement);
        }

        // Add calendar styles if not exists
        this.addCalendarStyles();
    }

    selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection
        element.classList.add('selected');
        window.selectedDate = date;

        // Generate and display time slots
        this.displayTimeSlots(date);
        this.checkStep2Completion();
    }

    displayTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;

        const serviceDuration = window.selectedService ? window.selectedService.duration : 60;
        const slots = this.generateAvailableSlots(date, serviceDuration);
        
        timeSlotsContainer.innerHTML = '';

        if (slots.length === 0) {
            timeSlotsContainer.innerHTML = `
                <div class="no-slots-message">
                    <i class="fas fa-calendar-times"></i>
                    <p>На эту дату нет свободных слотов</p>
                    <button class="btn btn-secondary" onclick="suggestAlternatives()">
                        Предложить другое время
                    </button>
                </div>
            `;
            return;
        }

        // Group slots by type
        const morningSlots = slots.filter(s => s.type === 'morning');
        const daySlots = slots.filter(s => s.type === 'day');
        const eveningSlots = slots.filter(s => s.type === 'evening');

        let html = '';
        
        if (morningSlots.length > 0) {
            html += '<div class="time-slots-group"><h5>Утро</h5><div class="time-slots-row">';
            morningSlots.forEach(slot => {
                html += this.createTimeSlotHTML(slot);
            });
            html += '</div></div>';
        }
        
        if (daySlots.length > 0) {
            html += '<div class="time-slots-group"><h5>День</h5><div class="time-slots-row">';
            daySlots.forEach(slot => {
                html += this.createTimeSlotHTML(slot);
            });
            html += '</div></div>';
        }
        
        if (eveningSlots.length > 0) {
            html += '<div class="time-slots-group"><h5>Вечер</h5><div class="time-slots-row">';
            eveningSlots.forEach(slot => {
                html += this.createTimeSlotHTML(slot);
            });
            html += '</div></div>';
        }
        
        timeSlotsContainer.innerHTML = html;

        // Add click handlers
        timeSlotsContainer.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', () => this.selectTime(slot.dataset.time, slot));
        });
    }

    createTimeSlotHTML(slot) {
        return `<div class="time-slot available" data-time="${slot.time}">
            <span class="slot-time">${slot.time}</span>
            <span class="slot-duration">${slot.duration} мин</span>
        </div>`;
    }

    selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selection
        element.classList.add('selected');
        window.selectedTime = time;
        this.checkStep2Completion();
    }

    checkStep2Completion() {
        const nextButton = document.querySelector('.step-2 .next-step-btn');
        if (nextButton && window.selectedDate && window.selectedTime) {
            nextButton.disabled = false;
        }
    }

    addCalendarStyles() {
        if (document.getElementById('smart-calendar-styles')) return;

        const style = document.createElement('style');
        style.id = 'smart-calendar-styles';
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

            .calendar-day.holiday {
                background: rgba(239, 68, 68, 0.1);
                border-color: rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }

            .calendar-day.busy {
                background: rgba(239, 68, 68, 0.1);
            }

            .calendar-day.moderate {
                background: rgba(251, 191, 36, 0.1);
            }

            .calendar-day.free {
                background: rgba(74, 222, 128, 0.1);
            }

            .day-indicators {
                position: absolute;
                top: 2px;
                right: 2px;
                display: flex;
                gap: 2px;
            }

            .holiday-icon,
            .special-hours-icon {
                font-size: 0.6rem;
                opacity: 0.7;
            }

            .holiday-icon {
                color: #ef4444;
            }

            .special-hours-icon {
                color: #3b82f6;
            }

            .day-booking-count {
                position: absolute;
                bottom: 2px;
                right: 2px;
                background: var(--accent-orange);
                color: white;
                font-size: 0.7rem;
                font-weight: bold;
                padding: 0.1rem 0.3rem;
                border-radius: 10px;
                display: none;
            }

            .time-slots-group {
                margin-bottom: 1.5rem;
            }

            .time-slots-group h5 {
                color: var(--text-gray);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.5rem;
            }

            .time-slots-row {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 0.5rem;
            }

            .time-slot {
                padding: 0.8rem;
                background: var(--gradient-glass);
                border: 1px solid var(--border-glass);
                border-radius: 10px;
                text-align: center;
                cursor: pointer;
                transition: all var(--transition-medium);
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
            }

            .slot-time {
                font-weight: 600;
                font-size: 1rem;
            }

            .slot-duration {
                font-size: 0.7rem;
                color: var(--text-gray);
            }

            .no-slots-message {
                text-align: center;
                padding: 3rem;
                color: var(--text-gray);
            }

            .no-slots-message i {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.5;
            }

            .no-slots-message p {
                margin-bottom: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Утилиты
    formatDate(date) {
        return date.toISOString().split('T')[0];
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

    // Сохранение данных
    saveBlockLists() {
        localStorage.setItem('massageBlockLists', JSON.stringify(this.blockLists));
    }

    saveSpecialHours() {
        localStorage.setItem('massageSpecialHours', JSON.stringify(this.specialHours));
    }

    saveHolidays() {
        localStorage.setItem('massageHolidays', JSON.stringify(this.holidays));
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Глобальная функция для предложения альтернатив
        window.suggestAlternatives = () => {
            if (window.selectedDate && window.selectedService) {
                const alternatives = this.suggestAlternativeSlots(
                    window.selectedDate,
                    '10:00', // Предпочтительное время по умолчанию
                    window.selectedService.duration
                );
                
                this.showAlternativesModal(alternatives);
            }
        };
    }

    showAlternativesModal(alternatives) {
        // Создание модального окна с альтернативами
        const modal = document.createElement('div');
        modal.className = 'alternatives-modal';
        modal.innerHTML = `
            <div class="alternatives-content">
                <h3>Альтернативное время</h3>
                <div class="alternatives-list">
                    ${alternatives.map(alt => `
                        <div class="alternative-slot" data-date="${alt.dateStr || this.formatDate(window.selectedDate)}" data-time="${alt.time}">
                            <span class="alt-date">${alt.date ? this.formatDateRussian(alt.date) : 'Сегодня'}</span>
                            <span class="alt-time">${alt.time}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">Закрыть</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Добавление обработчиков
        modal.querySelectorAll('.alternative-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const date = new Date(slot.dataset.date);
                const time = slot.dataset.time;
                
                // Выбор альтернативного времени
                window.selectedDate = date;
                window.selectedTime = time;
                
                // Обновление UI
                this.generateEnhancedCalendar();
                modal.remove();
            });
        });
    }

    formatDateRussian(date) {
        return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }
}

// Экспорт для использования
window.SmartCalendar = SmartCalendar;

console.log('📅 Smart Calendar System Loaded Successfully!');