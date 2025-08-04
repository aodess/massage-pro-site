// ===== NOTIFICATION SYSTEM =====

class NotificationSystem {
    constructor() {
        this.templates = this.loadTemplates();
    }

    loadTemplates() {
        return {
            adminNotification: {
                template: `Новая запись!

Клиент: {{clientName}}
Телефон: {{clientPhone}}
Услуга: {{serviceName}}
Дата: {{date}}
Время: {{time}}
{{#notes}}Примечания: {{notes}}{{/notes}}`
            },
            clientConfirmation: {
                template: `Здравствуйте, {{clientName}}!

Ваша запись подтверждена:
📅 {{date}}
⏰ {{time}}
💆 {{serviceName}}
💰 ₪{{price}}

Адрес: {{address}}

Ждем вас!

MASSAGE PRO`
            }
        };
    }

    sendBookingNotification(booking) {
        const businessInfo = JSON.parse(localStorage.getItem('massageContent') || '{}');
        const whatsappPhone = businessInfo.whatsappPhone || '972501234567';
        
        // Admin notification
        const adminMessage = this.formatMessage(this.templates.adminNotification.template, {
            clientName: booking.client.name,
            clientPhone: booking.client.phone,
            serviceName: booking.service.name,
            date: new Date(booking.date).toLocaleDateString('ru-RU'),
            time: booking.time,
            notes: booking.client.notes
        });
        
        // Client notification
        const clientMessage = this.formatMessage(this.templates.clientConfirmation.template, {
            clientName: booking.client.name,
            date: new Date(booking.date).toLocaleDateString('ru-RU'),
            time: booking.time,
            serviceName: booking.service.name,
            price: booking.service.price,
            address: businessInfo.businessAddress || 'ул. Дизенгоф 125, Тель-Авив'
        });
        
        // Send to admin
        this.openWhatsApp(whatsappPhone, adminMessage);
        
        // Optionally send to client (uncomment if needed)
        // setTimeout(() => {
        //     this.openWhatsApp(booking.client.phone, clientMessage);
        // }, 2000);
        
        return { adminMessage, clientMessage };
    }

    formatMessage(template, data) {
        let message = template;
        
        // Replace variables
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            message = message.replace(regex, data[key] || '');
        });
        
        // Handle conditionals
        message = message.replace(/{{#(\w+)}}(.*?){{\/\1}}/g, (match, key, content) => {
            return data[key] ? content : '';
        });
        
        // Clean up empty lines
        message = message.replace(/\n\s*\n/g, '\n');
        
        return message.trim();
    }

    openWhatsApp(phone, message) {
        const cleanPhone = phone.replace(/\D/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    scheduleReminder(booking) {
        // This would require a backend service to actually send scheduled messages
        // For now, we'll just store the reminder info
        const reminders = JSON.parse(localStorage.getItem('scheduledReminders') || '[]');
        
        // Reminder 24 hours before
        const reminderDate = new Date(booking.date + ' ' + booking.time);
        reminderDate.setHours(reminderDate.getHours() - 24);
        
        reminders.push({
            bookingId: booking.id,
            scheduledFor: reminderDate.toISOString(),
            type: '24h',
            sent: false
        });
        
        localStorage.setItem('scheduledReminders', JSON.stringify(reminders));
    }
}

// Initialize global notification system
window.notificationSystem = new NotificationSystem();