// ===== SMART CALENDAR SYSTEM =====

class SmartCalendar {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDate = null;
        this.holidays = this.loadHolidays();
        this.workingDays = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
    }

    loadHolidays() {
        // Israeli holidays and special days
        return [
            '2025-04-13', // Pesach
            '2025-04-20', // Pesach end
            '2025-05-02', // Independence Day
            '2025-06-02', // Shavuot
            '2025-09-17', // Rosh Hashanah
            '2025-09-26', // Yom Kippur
            '2025-10-01', // Sukkot
            // Add more holidays as needed
        ];
    }

    render(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        let html = '<div class="smart-calendar">';
        
        // Header
        html += `
            <div class="calendar-header">
                <button class="calendar-nav-btn" onclick="smartCalendar.previousMonth('${containerId}')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="calendar-month-year">
                    ${monthNames[this.currentMonth]} ${this.currentYear}
                </div>
                <button class="calendar-nav-btn" onclick="smartCalendar.nextMonth('${containerId}')">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        // Days grid
        html += '<div class="calendar-days-grid">';
        
        // Day headers
        dayNames.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Calculate days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const dateStr = this.formatDate(date);
            const dayOfWeek = date.getDay();
            
            let classes = ['calendar-day'];
            let isClickable = false;

            // Check if date is today
            if (date.getTime() === today.getTime()) {
                classes.push('today');
            }

            // Check if date is in the past
            if (date < today) {
                classes.push('past');
            }
            // Check if it's a holiday
            else if (this.holidays.includes(dateStr)) {
                classes.push('holiday');
            }
            // Check if it's a working day
            else if (!this.workingDays.includes(dayOfWeek)) {
                classes.push('non-working');
            }
            // Check availability
            else {
                const availability = this.checkDateAvailability(date);
                if (availability.available) {
                    classes.push('available');
                    if (availability.slotsCount < 3) {
                        classes.push('few-slots');
                    }
                    isClickable = true;
                } else {
                    classes.push('fully-booked');
                }
            }

            // Check if selected
            if (this.selectedDate && this.formatDate(this.selectedDate) === dateStr) {
                classes.push('selected');
            }

            const onClick = isClickable && options.onDateSelect ? 
                `onclick="smartCalendar.selectDate(new Date(${date.getTime()}), '${containerId}', ${options.onDateSelect.name})"` : '';

            html += `
                <div class="${classes.join(' ')}" data-date="${dateStr}" ${onClick}>
                    <span class="day-number">${day}</span>
                    ${availability && availability.slotsCount > 0 ? 
                        `<span class="slots-indicator">${availability.slotsCount}</span>` : ''}
                </div>
            `;
        }

        html += '</div></div>';

        // Add styles if not already added
        this.addStyles();

        container.innerHTML = html;
    }

    checkDateAvailability(date) {
        if (!window.bookingSystem) {
            return { available: true, slotsCount: 12 };
        }

        const slots = window.bookingSystem.getAvailableTimeSlots(date);
        return {
            available: slots.length > 0,
            slotsCount: slots.length
        };
    }

    selectDate(date, containerId, callback) {
        this.selectedDate = date;
        this.render(containerId, { onDateSelect: callback });
        
        if (callback) {
            callback(date);
        }
    }

    previousMonth(containerId) {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.render(containerId, { onDateSelect: window.selectDate });
    }

    nextMonth(containerId) {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.render(containerId, { onDateSelect: window.selectDate });
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    addStyles() {
        if (document.getElementById('smart-calendar-styles')) return;

        const style = document.createElement('style');
        style.id = 'smart-calendar-styles';
        style.textContent = `
            .smart-calendar {
                background: var(--secondary);
                border-radius: 15px;
                padding: 1.5rem;
            }

            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .calendar-nav-btn {
                background: none;
                border: none;
                color: var(--primary);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            .calendar-nav-btn:hover {
                background: rgba(255, 107, 53, 0.1);
            }

            .calendar-month-year {
                font-size: 1.3rem;
                font-weight: 600;
            }

            .calendar-days-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.5rem;
            }

            .calendar-day-header {
                text-align: center;
                font-weight: 600;
                color: var(--text-gray);
                padding: 0.5rem;
                font-size: 0.9rem;
            }

            .calendar-day {
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                position: relative;
                transition: all 0.3s ease;
                cursor: default;
            }

            .calendar-day.available {
                background: rgba(255, 255, 255, 0.05);
                cursor: pointer;
            }

            .calendar-day.available:hover {
                background: rgba(255, 107, 53, 0.2);
                transform: scale(1.05);
            }

            .calendar-day.selected {
                background: var(--primary);
                color: white;
            }

            .calendar-day.today {
                border: 2px solid var(--primary);
            }

            .calendar-day.past,
            .calendar-day.holiday,
            .calendar-day.non-working {
                opacity: 0.3;
            }

            .calendar-day.fully-booked {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }

            .calendar-day.few-slots {
                background: rgba(251, 191, 36, 0.1);
            }

            .day-number {
                font-size: 1rem;
                font-weight: 500;
            }

            .slots-indicator {
                position: absolute;
                bottom: 2px;
                right: 2px;
                font-size: 0.7rem;
                background: var(--primary);
                color: white;
                padding: 0.1rem 0.3rem;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize global smart calendar
window.smartCalendar = new SmartCalendar();