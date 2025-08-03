// ===== ADVANCED NOTIFICATION SYSTEM =====
// Файл: assets/js/notifications.js

class NotificationSystem {
    constructor() {
        this.templates = this.loadTemplates();
        this.scheduledNotifications = this.loadScheduledNotifications();
        this.clientPreferences = this.loadClientPreferences();
        this.businessInfo = this.loadBusinessInfo();
        this.init();
    }

    init() {
        // Проверка запланированных уведомлений
        this.checkScheduledNotifications();
        
        // Запуск периодической проверки
        setInterval(() => this.checkScheduledNotifications(), 60000); // Каждую минуту
    }

    // Загрузка шаблонов сообщений
    loadTemplates() {
        const defaultTemplates = {
            booking_confirmation: {
                title: "Подтверждение записи",
                template: `🎉 *Запись подтверждена!*

Здравствуйте, {{clientName}}!

📅 *Дата:* {{date}}
⏰ *Время:* {{time}}
💆‍♀️ *Услуга:* {{serviceName}}
⏱ *Длительность:* {{duration}} мин
💰 *Стоимость:* {{price}}

📍 *Адрес:* {{address}}
📞 *Телефон:* {{phone}}

{{#notes}}
📝 *Ваши пожелания:* {{notes}}
{{/notes}}

Ждем вас в {{businessName}}!

_Для отмены или переноса записи ответьте на это сообщение._`,
                variables: ['clientName', 'date', 'time', 'serviceName', 'duration', 'price', 'address', 'phone', 'notes', 'businessName']
            },

            reminder_24h: {
                title: "Напоминание за 24 часа",
                template: `⏰ *Напоминание о записи*

{{clientName}}, напоминаем о вашей записи:

📅 *Завтра* в {{time}}
💆‍♀️ {{serviceName}}
📍 {{address}}

{{#preparation}}
📋 *Подготовка к сеансу:*
{{preparation}}
{{/preparation}}

До встречи в {{businessName}}!

_Если планы изменились, сообщите нам заранее._`,
                variables: ['clientName', 'time', 'serviceName', 'address', 'preparation', 'businessName']
            },

            reminder_2h: {
                title: "Напоминание за 2 часа",
                template: `🔔 *Скоро ваш сеанс массажа*

{{clientName}}, ваш сеанс начнется через 2 часа:

⏰ *В {{time}}*
📍 {{address}}

🚗 *Рекомендуем выехать заранее*
🧘‍♀️ *Настройтесь на расслабление*

Ждем вас в {{businessName}}!`,
                variables: ['clientName', 'time', 'address', 'businessName']
            },

            thank_you: {
                title: "Благодарность после сеанса",
                template: `🙏 *Спасибо за посещение!*

{{clientName}}, благодарим за доверие!

⭐ *Как прошел сеанс?* Будем рады вашей обратной связи.

🔄 *Следующий сеанс* рекомендуем через {{recommendedInterval}}

📅 *Записаться снова:* {{bookingLink}}

{{businessName}} - ваше здоровье наша забота!`,
                variables: ['clientName', 'recommendedInterval', 'bookingLink', 'businessName']
            },

            birthday_greeting: {
                title: "Поздравление с днем рождения",
                template: `🎉 *С Днем Рождения!*

{{clientName}}, поздравляем вас с праздником!

🎁 *Специальное предложение:* скидка 20% на любой массаж в течение недели

📅 *Для записи:* {{phone}}

Желаем здоровья и прекрасного настроения!

{{businessName}} 💝`,
                variables: ['clientName', 'phone', 'businessName']
            },

            cancellation_client: {
                title: "Отмена записи клиентом",
                template: `❌ *Запись отменена*

{{clientName}}, ваша запись на {{date}} в {{time}} отменена.

💔 *Жаль, что не увидимся*

📅 *Для новой записи:* {{bookingLink}}
📞 *Или звоните:* {{phone}}

{{businessName}}`,
                variables: ['clientName', 'date', 'time', 'bookingLink', 'phone', 'businessName']
            },

            reschedule_notification: {
                title: "Перенос записи",
                template: `🔄 *Запись перенесена*

{{clientName}}, ваша запись перенесена:

❌ *Было:* {{oldDate}} в {{oldTime}}
✅ *Стало:* {{newDate}} в {{newTime}}

💆‍♀️ *Услуга:* {{serviceName}}
📍 *Адрес:* {{address}}

Ждем вас в {{businessName}}!`,
                variables: ['clientName', 'oldDate', 'oldTime', 'newDate', 'newTime', 'serviceName', 'address', 'businessName']
            },

            special_offer: {
                title: "Специальное предложение",
                template: `🎁 *Специальное предложение!*

{{clientName}}, только для вас:

{{offerText}}

⏳ *Предложение действует до:* {{offerEndDate}}

📅 *Записаться:* {{bookingLink}}
📞 *Телефон:* {{phone}}

{{businessName}}`,
                variables: ['clientName', 'offerText', 'offerEndDate', 'bookingLink', 'phone', 'businessName']
            }
        };

        return JSON.parse(localStorage.getItem('notificationTemplates') || JSON.stringify(defaultTemplates));
    }

    // Загрузка запланированных уведомлений
    loadScheduledNotifications() {
        return JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    }

    // Загрузка предпочтений клиентов
    loadClientPreferences() {
        return JSON.parse(localStorage.getItem('clientPreferences') || '{}');
    }

    // Загрузка информации о бизнесе
    loadBusinessInfo() {
        return JSON.parse(localStorage.getItem('massageContent') || JSON.stringify({
            businessName: 'MASSAGE PRO',
            phone: '+972-50-123-4567',
            address: 'ул. Дизенгоф 125, Тель-Авив',
            whatsappPhone: '972501234567',
            website: window.location.origin
        }));
    }

    // Создание персонализированного сообщения
    createMessage(templateKey, data) {
        const template = this.templates[templateKey];
        if (!template) {
            throw new Error(`Template ${templateKey} not found`);
        }

        let message = template.template;

        // Замена основных переменных
        const allData = {
            ...data,
            ...this.businessInfo,
            bookingLink: `${this.businessInfo.website}#booking`,
            currentDate: new Date().toLocaleDateString('ru-RU'),
            currentTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };

        // Простая замена переменных
        for (const [key, value] of Object.entries(allData)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            message = message.replace(regex, value || '');
        }

        // Обработка условных блоков {{#variable}}...{{/variable}}
        message = message.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (match, variable, content) => {
            return allData[variable] ? content : '';
        });

        // Очистка пустых строк
        message = message.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

        return message;
    }

    // Отправка уведомления
    async sendNotification(type, bookingData, scheduleTime = null) {
        try {
            const message = this.createMessage(type, this.prepareBookingData(bookingData));
            
            if (scheduleTime) {
                // Запланированная отправка
                this.scheduleNotification(type, bookingData, scheduleTime);
            } else {
                // Немедленная отправка
                this.sendWhatsAppMessage(bookingData.client.phone, message);
            }

            // Логирование
            this.logNotification(type, bookingData.client.phone, message);

            return { success: true, message };
        } catch (error) {
            console.error('Notification sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Подготовка данных записи для шаблона
    prepareBookingData(booking) {
        const date = new Date(booking.date);
        return {
            clientName: booking.client.name,
            clientPhone: booking.client.phone,
            date: date.toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            dateShort: date.toLocaleDateString('ru-RU'),
            time: booking.time,
            serviceName: booking.service.name,
            duration: booking.service.duration,
            price: `₪${booking.service.price}`,
            notes: booking.client.notes,
            bookingId: booking.id,
            // Дополнительные данные
            dayOfWeek: date.toLocaleDateString('ru-RU', { weekday: 'long' }),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            season: this.getSeason(date),
            recommendedInterval: this.getRecommendedInterval(booking.service.name),
            preparation: this.getPreparationTips(booking.service.name)
        };
    }

    // Планирование уведомлений для записи
    scheduleBookingNotifications(booking) {
        const bookingDate = new Date(booking.date + 'T' + booking.time);
        
        // Подтверждение (сразу)
        this.sendNotification('booking_confirmation', booking);
        
        // Напоминание за 24 часа
        const reminder24h = new Date(bookingDate.getTime() - 24 * 60 * 60 * 1000);
        if (reminder24h > new Date()) {
            this.scheduleNotification('reminder_24h', booking, reminder24h);
        }
        
        // Напоминание за 2 часа
        const reminder2h = new Date(bookingDate.getTime() - 2 * 60 * 60 * 1000);
        if (reminder2h > new Date()) {
            this.scheduleNotification('reminder_2h', booking, reminder2h);
        }
        
        // Благодарность через 2 часа после сеанса
        const thankYou = new Date(bookingDate.getTime() + (booking.service.duration + 120) * 60 * 1000);
        this.scheduleNotification('thank_you', booking, thankYou);
    }

    // Планирование отправки уведомления
    scheduleNotification(type, bookingData, sendTime) {
        const notification = {
            id: this.generateNotificationId(),
            type,
            bookingData,
            sendTime: sendTime.toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        this.scheduledNotifications.push(notification);
        this.saveScheduledNotifications();
    }

    // Проверка и отправка запланированных уведомлений
    checkScheduledNotifications() {
        const now = new Date();
        
        this.scheduledNotifications.forEach(notification => {
            if (notification.status === 'scheduled') {
                const sendTime = new Date(notification.sendTime);
                
                if (sendTime <= now) {
                    this.executePendingNotification(notification.id);
                }
            }
        });
    }

    // Выполнение запланированного уведомления
    async executePendingNotification(notificationId) {
        const notification = this.scheduledNotifications.find(n => n.id === notificationId);
        if (!notification || notification.status !== 'scheduled') return;

        try {
            await this.sendNotification(notification.type, notification.bookingData);
            notification.status = 'sent';
            notification.sentAt = new Date().toISOString();
        } catch (error) {
            notification.status = 'failed';
            notification.error = error.message;
        }

        this.saveScheduledNotifications();
    }

    // Отправка в WhatsApp
    sendWhatsAppMessage(phone, message) {
        const cleanPhone = phone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        // Открытие в новой вкладке
        if (window.open(whatsappUrl, '_blank')) {
            this.showNotificationSentToast();
        }
    }

    // Показ уведомления об отправке
    showNotificationSentToast() {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <i class="fab fa-whatsapp"></i>
            <span>Сообщение отправлено в WhatsApp</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Логирование уведомлений
    logNotification(type, phone, message) {
        const log = {
            timestamp: new Date().toISOString(),
            type,
            phone,
            messageLength: message.length,
            status: 'sent'
        };

        const logs = JSON.parse(localStorage.getItem('notificationLogs') || '[]');
        logs.push(log);
        
        // Ограничение размера лога (последние 1000 записей)
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }

        localStorage.setItem('notificationLogs', JSON.stringify(logs));
    }

    // Массовая рассылка
    async sendMassNotification(templateKey, clientFilter = {}, customData = {}) {
        const clients = this.getFilteredClients(clientFilter);
        const results = [];
        
        for (const client of clients) {
            try {
                const data = {
                    clientName: client.name,
                    clientPhone: client.phone,
                    ...customData
                };
                
                const message = this.createMessage(templateKey, data);
                this.sendWhatsAppMessage(client.phone, message);
                
                results.push({
                    client: client.name,
                    phone: client.phone,
                    success: true
                });
                
                // Задержка между отправками
                await this.delay(2000);
            } catch (error) {
                results.push({
                    client: client.name,
                    phone: client.phone,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    // Получение отфильтрованных клиентов
    getFilteredClients(filter) {
        const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
        const uniqueClients = new Map();
        
        bookings.forEach(booking => {
            const key = booking.client.phone;
            if (!uniqueClients.has(key)) {
                uniqueClients.set(key, {
                    name: booking.client.name,
                    phone: booking.client.phone,
                    lastVisit: booking.date,
                    totalVisits: 1
                });
            } else {
                const client = uniqueClients.get(key);
                client.totalVisits++;
                if (booking.date > client.lastVisit) {
                    client.lastVisit = booking.date;
                }
            }
        });
        
        let clients = Array.from(uniqueClients.values());
        
        // Применение фильтров
        if (filter.minVisits) {
            clients = clients.filter(c => c.totalVisits >= filter.minVisits);
        }
        
        if (filter.lastVisitDays) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - filter.lastVisitDays);
            clients = clients.filter(c => new Date(c.lastVisit) >= cutoffDate);
        }
        
        return clients;
    }

    // Вспомогательные функции
    getSeason(date) {
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return 'весна';
        if (month >= 5 && month <= 7) return 'лето';
        if (month >= 8 && month <= 10) return 'осень';
        return 'зима';
    }

    getRecommendedInterval(serviceName) {
        const intervals = {
            'Классический массаж': '2-3 недели',
            'Спортивный массаж': '1-2 недели',
            'Релакс массаж': '3-4 недели',
            'Глубокий массаж': '2-3 недели'
        };
        return intervals[serviceName] || '2-3 недели';
    }

    getPreparationTips(serviceName) {
        const tips = {
            'Классический массаж': 'Не ешьте за 2 часа до сеанса. Примите душ перед процедурой.',
            'Спортивный массаж': 'Возьмите с собой спортивную форму. Не тренируйтесь за 4 часа до массажа.',
            'Релакс массаж': 'Отключите телефон на время процедуры. Настройтесь на расслабление.',
            'Глубокий массаж': 'Пейте больше воды за день до процедуры. После массажа отдохните 30 минут.'
        };
        return tips[serviceName] || '';
    }

    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Сохранение данных
    saveScheduledNotifications() {
        localStorage.setItem('scheduledNotifications', JSON.stringify(this.scheduledNotifications));
    }

    saveTemplates() {
        localStorage.setItem('notificationTemplates', JSON.stringify(this.templates));
    }

    saveClientPreferences() {
        localStorage.setItem('clientPreferences', JSON.stringify(this.clientPreferences));
    }

    // Управление шаблонами
    updateTemplate(templateKey, newTemplate) {
        this.templates[templateKey] = newTemplate;
        this.saveTemplates();
    }

    getTemplate(templateKey) {
        return this.templates[templateKey];
    }

    getAllTemplates() {
        return this.templates;
    }

    // Управление предпочтениями клиентов
    setClientPreference(phone, preferences) {
        this.clientPreferences[phone] = preferences;
        this.saveClientPreferences();
    }

    getClientPreference(phone) {
        return this.clientPreferences[phone] || {
            notifications: true,
            language: 'ru',
            preferredTime: 'morning'
        };
    }

    // Добавление стилей для уведомлений
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #25D366;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 50px;
                display: flex;
                align-items: center;
                gap: 0.8rem;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 10000;
            }

            .notification-toast.show {
                transform: translateY(0);
                opacity: 1;
            }

            .notification-toast i {
                font-size: 1.5rem;
            }

            @media (max-width: 768px) {
                .notification-toast {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация стилей при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const notificationSystem = new NotificationSystem();
    notificationSystem.addNotificationStyles();
});

// Экспорт
window.NotificationSystem = NotificationSystem;

console.log('💬 Notification System Loaded Successfully!');