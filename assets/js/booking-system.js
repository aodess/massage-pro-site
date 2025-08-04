// ===== BOOKING SYSTEM =====

class BookingSystem {
    constructor() {
        this.bookings = this.loadBookings();
        this.settings = this.loadSettings();
    }

    loadBookings() {
        return JSON.parse(localStorage.getItem('massageBookings') || '[]');
    }

    loadSettings() {
        return JSON.parse(localStorage.getItem('massageSettings') || JSON.stringify({
            workStart: '09:00',
            workEnd: '21:00',
            defaultDuration: 60
        }));
    }

    saveBookings() {
        localStorage.setItem('massageBookings', JSON.stringify(this.bookings));
    }

    createBooking(bookingData) {
        const booking = {
            ...bookingData,
            id: this.generateBookingId(),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        this.bookings.push(booking);
        this.saveBookings();

        return booking;
    }

    generateBookingId() {
        return 'BK' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    getBookingsForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.bookings.filter(booking => 
            booking.date === dateStr && 
            booking.status === 'confirmed'
        );
    }

    isTimeSlotAvailable(date, time, duration = 60) {
        const bookings = this.getBookingsForDate(date);
        const requestedStart = this.timeToMinutes(time);
        const requestedEnd = requestedStart + duration;

        for (const booking of bookings) {
            const bookingStart = this.timeToMinutes(booking.time);
            const bookingEnd = bookingStart + (booking.service?.duration || 60);

            // Check for overlap
            if (requestedStart < bookingEnd && requestedEnd > bookingStart) {
                return false;
            }
        }

        return true;
    }

    getAvailableTimeSlots(date, serviceDuration = 60) {
        const slots = [];
        const startTime = this.timeToMinutes(this.settings.workStart);
        const endTime = this.timeToMinutes(this.settings.workEnd);

        for (let time = startTime; time <= endTime - serviceDuration; time += 30) {
            const timeStr = this.minutesToTime(time);
            if (this.isTimeSlotAvailable(date, timeStr, serviceDuration)) {
                slots.push(timeStr);
            }
        }

        return slots;
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

    cancelBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'cancelled';
            this.saveBookings();
            return true;
        }
        return false;
    }

    getUpcomingBookings(days = 7) {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + days);

        return this.bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= today && 
                   bookingDate <= future && 
                   booking.status === 'confirmed';
        }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    }

    getBookingStats() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const stats = {
            total: this.bookings.length,
            confirmed: this.bookings.filter(b => b.status === 'confirmed').length,
            cancelled: this.bookings.filter(b => b.status === 'cancelled').length,
            today: this.bookings.filter(b => b.date === today.toISOString().split('T')[0]).length,
            thisMonth: this.bookings.filter(b => {
                const date = new Date(b.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length,
            revenue: {
                total: 0,
                thisMonth: 0
            }
        };

        // Calculate revenue
        this.bookings.forEach(booking => {
            if (booking.status === 'confirmed' && booking.service) {
                stats.revenue.total += booking.service.price || 0;
                
                const date = new Date(booking.date);
                if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                    stats.revenue.thisMonth += booking.service.price || 0;
                }
            }
        });

        return stats;
    }
}

// Initialize global booking system
window.bookingSystem = new BookingSystem();