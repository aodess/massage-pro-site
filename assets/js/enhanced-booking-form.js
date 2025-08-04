// ===== ENHANCED BOOKING FORM =====

class EnhancedBookingForm {
    constructor() {
        this.countryCodes = [
            { code: '+972', country: 'Израиль', flag: '🇮🇱' },
            { code: '+7', country: 'Россия', flag: '🇷🇺' },
            { code: '+380', country: 'Украина', flag: '🇺🇦' },
            { code: '+1', country: 'США', flag: '🇺🇸' },
            { code: '+44', country: 'Великобритания', flag: '🇬🇧' },
            { code: '+49', country: 'Германия', flag: '🇩🇪' },
            { code: '+33', country: 'Франция', flag: '🇫🇷' },
            { code: '+39', country: 'Италия', flag: '🇮🇹' },
            { code: '+34', country: 'Испания', flag: '🇪🇸' },
            { code: '+31', country: 'Нидерланды', flag: '🇳🇱' },
            { code: '+48', country: 'Польша', flag: '🇵🇱' },
            { code: '+420', country: 'Чехия', flag: '🇨🇿' },
            { code: '+90', country: 'Турция', flag: '🇹🇷' },
            { code: '+375', country: 'Беларусь', flag: '🇧🇾' },
            { code: '+7', country: 'Казахстан', flag: '🇰🇿' },
            { code: '+998', country: 'Узбекистан', flag: '🇺🇿' },
            { code: '+994', country: 'Азербайджан', flag: '🇦🇿' },
            { code: '+995', country: 'Грузия', flag: '🇬🇪' },
            { code: '+374', country: 'Армения', flag: '🇦🇲' }
        ];
        
        this.selectedCountryCode = '+972'; // По умолчанию Израиль
        this.captchaRequired = true;
        this.captchaValue = null;
        this.bookingAttempts = 0;
        this.lastBookingTime = 0;
        
        this.init();
    }

    init() {
        // Заменяем стандартное поле телефона на улучшенное
        this.enhancePhoneField();
        
        // Добавляем капчу
        this.addCaptcha();
        
        // Добавляем обработчики
        this.initEventHandlers();
        
        // Добавляем стили
        this.addStyles();
    }

    enhancePhoneField() {
        const phoneField = document.getElementById('clientPhone');
        if (!phoneField) return;
        
        // Создаем новую структуру для телефона
        const phoneGroup = phoneField.parentElement;
        phoneGroup.innerHTML = `
            <div class="phone-input-group">
                <div class="country-code-selector" id="countryCodeSelector">
                    <span class="selected-flag">${this.countryCodes[0].flag}</span>
                    <span class="selected-code">${this.countryCodes[0].code}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <input type="tel" 
                       id="clientPhone" 
                       placeholder="50-123-4567" 
                       required
                       pattern="[0-9-() ]+"
                       maxlength="15">
            </div>
            <div class="country-dropdown" id="countryDropdown">
                ${this.countryCodes.map(country => `
                    <div class="country-option" data-code="${country.code}">
                        <span class="country-flag">${country.flag}</span>
                        <span class="country-name">${country.country}</span>
                        <span class="country-code">${country.code}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Устанавливаем маску для ввода
        this.initPhoneMask();
    }

    initPhoneMask() {
        const phoneInput = document.getElementById('clientPhone');
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            // Форматируем в зависимости от кода страны
            if (this.selectedCountryCode === '+972') {
                // Израильский формат: 50-123-4567
                if (value.length > 0) formattedValue = value.substring(0, 2);
                if (value.length > 2) formattedValue += '-' + value.substring(2, 5);
                if (value.length > 5) formattedValue += '-' + value.substring(5, 9);
            } else if (this.selectedCountryCode === '+7') {
                // Российский формат: 903 123-45-67
                if (value.length > 0) formattedValue = value.substring(0, 3);
                if (value.length > 3) formattedValue += ' ' + value.substring(3, 6);
                if (value.length > 6) formattedValue += '-' + value.substring(6, 8);
                if (value.length > 8) formattedValue += '-' + value.substring(8, 10);
            } else if (this.selectedCountryCode === '+1') {
                // Американский формат: (555) 123-4567
                if (value.length > 0) formattedValue = '(' + value.substring(0, 3);
                if (value.length > 3) formattedValue += ') ' + value.substring(3, 6);
                if (value.length > 6) formattedValue += '-' + value.substring(6, 10);
            } else {
                // Общий формат для остальных
                if (value.length > 0) formattedValue = value.substring(0, 3);
                if (value.length > 3) formattedValue += ' ' + value.substring(3, 6);
                if (value.length > 6) formattedValue += ' ' + value.substring(6, 10);
            }
            
            e.target.value = formattedValue;
        });
    }

    addCaptcha() {
        const form = document.getElementById('bookingForm');
        if (!form) return;
        
        // Добавляем контейнер для капчи перед кнопками
        const captchaHTML = `
            <div class="captcha-container" id="captchaContainer">
                <div class="captcha-box">
                    <div class="captcha-question" id="captchaQuestion"></div>
                    <input type="text" 
                           id="captchaAnswer" 
                           placeholder="Ваш ответ" 
                           class="captcha-input"
                           required>
                    <button type="button" class="captcha-refresh" onclick="enhancedBookingForm.generateCaptcha()">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                <div class="captcha-error" id="captchaError"></div>
            </div>
        `;
        
        const summaryElement = document.getElementById('bookingSummary');
        summaryElement.insertAdjacentHTML('afterend', captchaHTML);
        
        // Генерируем первую капчу
        this.generateCaptcha();
    }

    generateCaptcha() {
        const types = ['math', 'text', 'emoji'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'math':
                this.generateMathCaptcha();
                break;
            case 'text':
                this.generateTextCaptcha();
                break;
            case 'emoji':
                this.generateEmojiCaptcha();
                break;
        }
        
        // Очищаем поле ответа и ошибку
        document.getElementById('captchaAnswer').value = '';
        document.getElementById('captchaError').textContent = '';
    }

    generateMathCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operations = ['+', '-'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let result;
        let question;
        
        if (operation === '+') {
            result = num1 + num2;
            question = `${num1} + ${num2} = ?`;
        } else {
            // Убеждаемся, что результат положительный
            const bigger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            result = bigger - smaller;
            question = `${bigger} - ${smaller} = ?`;
        }
        
        this.captchaValue = result.toString();
        document.getElementById('captchaQuestion').innerHTML = `
            <i class="fas fa-calculator"></i> ${question}
        `;
    }

    generateTextCaptcha() {
        const questions = [
            { q: 'Напишите "ДА" большими буквами', a: 'ДА' },
            { q: 'Сколько дней в неделе? (цифрой)', a: '7' },
            { q: 'Первая буква слова "Массаж"?', a: 'М' },
            { q: 'Цвет неба в ясный день?', a: 'синий' },
            { q: 'Сколько часов в сутках? (цифрой)', a: '24' }
        ];
        
        const selected = questions[Math.floor(Math.random() * questions.length)];
        this.captchaValue = selected.a.toLowerCase();
        
        document.getElementById('captchaQuestion').innerHTML = `
            <i class="fas fa-question-circle"></i> ${selected.q}
        `;
    }

    generateEmojiCaptcha() {
        const emojis = [
            { emoji: '🌞', name: 'солнце' },
            { emoji: '🌙', name: 'луна' },
            { emoji: '⭐', name: 'звезда' },
            { emoji: '❤️', name: 'сердце' },
            { emoji: '🌺', name: 'цветок' }
        ];
        
        const selected = emojis[Math.floor(Math.random() * emojis.length)];
        this.captchaValue = selected.name;
        
        document.getElementById('captchaQuestion').innerHTML = `
            <span style="font-size: 2rem;">${selected.emoji}</span> 
            <span>Что это? (одним словом)</span>
        `;
    }

    verifyCaptcha() {
        const answer = document.getElementById('captchaAnswer').value.toLowerCase().trim();
        const errorElement = document.getElementById('captchaError');
        
        if (!answer) {
            errorElement.textContent = 'Пожалуйста, ответьте на вопрос';
            return false;
        }
        
        if (answer !== this.captchaValue) {
            errorElement.textContent = 'Неправильный ответ. Попробуйте еще раз';
            this.generateCaptcha();
            return false;
        }
        
        return true;
    }

    initEventHandlers() {
        // Обработчик выбора кода страны
        const selector = document.getElementById('countryCodeSelector');
        const dropdown = document.getElementById('countryDropdown');
        
        if (selector) {
            selector.addEventListener('click', () => {
                dropdown.classList.toggle('show');
            });
        }
        
        // Обработчик выбора страны
        document.addEventListener('click', (e) => {
            if (e.target.closest('.country-option')) {
                const option = e.target.closest('.country-option');
                const code = option.dataset.code;
                const country = this.countryCodes.find(c => c.code === code);
                
                if (country) {
                    this.selectedCountryCode = code;
                    document.querySelector('.selected-flag').textContent = country.flag;
                    document.querySelector('.selected-code').textContent = country.code;
                    dropdown.classList.remove('show');
                    
                    // Очищаем поле телефона при смене страны
                    document.getElementById('clientPhone').value = '';
                    this.initPhoneMask();
                }
            } else if (!e.target.closest('.country-code-selector')) {
                dropdown.classList.remove('show');
            }
        });
        
        // Перехватываем отправку формы
        const originalConfirmBooking = window.confirmBooking;
        window.confirmBooking = () => {
            // Проверяем защиту от спама
            const currentTime = Date.now();
            if (currentTime - this.lastBookingTime < 60000) { // 1 минута между попытками
                this.showNotification('Пожалуйста, подождите минуту перед следующей попыткой записи', 'warning');
                return;
            }
            
            // Проверяем капчу
            if (!this.verifyCaptcha()) {
                return;
            }
            
            // Получаем полный номер телефона
            const phoneNumber = this.selectedCountryCode + document.getElementById('clientPhone').value.replace(/\D/g, '');
            
            // Временно подменяем значение для отправки
            const originalPhone = document.getElementById('clientPhone').value;
            document.getElementById('clientPhone').value = phoneNumber;
            
            // Вызываем оригинальную функцию
            originalConfirmBooking();
            
            // Возвращаем значение обратно
            document.getElementById('clientPhone').value = originalPhone;
            
            // Обновляем время последней попытки
            this.lastBookingTime = currentTime;
            this.bookingAttempts++;
            
            // Генерируем новую капчу
            this.generateCaptcha();
        };
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `booking-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Phone Input Group */
            .phone-input-group {
                display: flex;
                gap: 0.5rem;
                position: relative;
            }

            .country-code-selector {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 120px;
            }

            .country-code-selector:hover {
                border-color: var(--primary);
            }

            .selected-flag {
                font-size: 1.5rem;
            }

            .selected-code {
                font-weight: 600;
            }

            .country-code-selector i {
                margin-left: auto;
                font-size: 0.8rem;
                color: var(--text-gray);
            }

            .country-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--secondary);
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-top: 0.5rem;
                max-height: 300px;
                overflow-y: auto;
                display: none;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .country-dropdown.show {
                display: block;
            }

            .country-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .country-option:hover {
                background: rgba(255, 107, 53, 0.1);
            }

            .country-flag {
                font-size: 1.5rem;
                width: 30px;
            }

            .country-name {
                flex: 1;
            }

            .country-code {
                color: var(--text-gray);
                font-size: 0.9rem;
            }

            /* Captcha Styles */
            .captcha-container {
                margin: 2rem 0;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 10px;
                border: 1px solid var(--border);
            }

            .captcha-box {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .captcha-question {
                flex: 1;
                font-size: 1.1rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .captcha-input {
                width: 150px;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                border-radius: 8px;
                color: var(--text-light);
                font-size: 1rem;
            }

            .captcha-input:focus {
                outline: none;
                border-color: var(--primary);
            }

            .captcha-refresh {
                padding: 0.75rem;
                background: var(--primary);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .captcha-refresh:hover {
                transform: rotate(180deg);
                background: #e55a2b;
            }

            .captcha-error {
                color: var(--danger);
                font-size: 0.9rem;
                margin-top: 0.5rem;
                display: block;
                min-height: 1.2rem;
            }

            /* Notifications */
            .booking-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--secondary);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 1rem;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 400px;
            }

            .booking-notification.show {
                transform: translateX(0);
            }

            .booking-notification.success {
                background: #10b981;
            }

            .booking-notification.warning {
                background: #f59e0b;
            }

            .booking-notification i {
                font-size: 1.2rem;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .country-code-selector {
                    min-width: 100px;
                    padding: 0.75rem 0.5rem;
                }

                .captcha-box {
                    flex-wrap: wrap;
                }

                .captcha-question {
                    width: 100%;
                    margin-bottom: 1rem;
                }

                .captcha-input {
                    flex: 1;
                }

                .booking-notification {
                    left: 20px;
                    right: 20px;
                    transform: translateY(-100px);
                }

                .booking-notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bookingForm')) {
        window.enhancedBookingForm = new EnhancedBookingForm();
    }
});