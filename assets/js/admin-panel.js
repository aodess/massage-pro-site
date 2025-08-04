// ===== ADMIN PANEL JAVASCRIPT =====

// Default admin password
const DEFAULT_PASSWORD = 'massage2025';

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Authentication
function checkAuth() {
    const authForm = document.getElementById('authForm');
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('adminPassword').value;
        const savedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;
        
        if (password === savedPassword) {
            // Save auth session
            sessionStorage.setItem('adminAuth', 'true');
            
            // Show admin panel
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('adminPanel').style.display = 'block';
            
            // Load dashboard
            loadDashboard();
            loadContent();
            loadServices();
            loadSettings();
            loadGalleryImages();
        } else {
            document.getElementById('authError').style.display = 'block';
            document.getElementById('adminPassword').value = '';
        }
    });
    
    // Check if already authenticated
    if (sessionStorage.getItem('adminAuth') === 'true') {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('adminPanel').style.display = 'block';
        loadDashboard();
        loadContent();
        loadServices();
        loadSettings();
        loadGalleryImages();
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('adminAuth');
    location.reload();
}

// Tab navigation
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Load tab data
    switch(tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'gallery':
            loadGalleryImages();
            break;
    }
}

// Dashboard
function loadDashboard() {
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate stats
    const totalBookings = bookings.length;
    const todayBookings = bookings.filter(b => b.date === today).length;
    
    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyBookings = bookings.filter(b => {
        const date = new Date(b.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const monthRevenue = monthlyBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);
    
    // Update stats
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('todayBookings').textContent = todayBookings;
    document.getElementById('monthRevenue').textContent = `₪${monthRevenue}`;
    
    // Load recent bookings
    const recentBookings = bookings.slice(-5).reverse();
    const tbody = document.getElementById('recentBookings');
    
    tbody.innerHTML = recentBookings.map(booking => {
        const date = new Date(booking.date).toLocaleDateString('ru-RU');
        const statusClass = booking.status === 'confirmed' ? 'confirmed' : 'cancelled';
        const statusText = booking.status === 'confirmed' ? 'Подтверждено' : 'Отменено';
        
        return `
            <tr>
                <td>${booking.client.name}</td>
                <td>${booking.service.name}</td>
                <td>${date}</td>
                <td>${booking.time}</td>
                <td><span class="booking-status ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="5" style="text-align: center;">Нет записей</td></tr>';
}

// Bookings
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    const tbody = document.getElementById('bookingsTable');
    
    tbody.innerHTML = bookings.map((booking, index) => {
        const date = new Date(booking.date).toLocaleDateString('ru-RU');
        const statusClass = booking.status === 'confirmed' ? 'confirmed' : 'cancelled';
        const statusText = booking.status === 'confirmed' ? 'Подтверждено' : 'Отменено';
        
        return `
            <tr>
                <td>${booking.id || `BK${index + 1}`}</td>
                <td>${booking.client.name}</td>
                <td>${booking.client.phone}</td>
                <td>${booking.service.name}</td>
                <td>${date}</td>
                <td>${booking.time}</td>
                <td><span class="booking-status ${statusClass}">${statusText}</span></td>
                <td>
                    ${booking.status === 'confirmed' ? 
                        `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${index})">
                            <i class="fas fa-times"></i> Отменить
                        </button>` : 
                        `<button class="btn btn-success btn-sm" onclick="restoreBooking(${index})">
                            <i class="fas fa-check"></i> Восстановить
                        </button>`
                    }
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="8" style="text-align: center;">Нет записей</td></tr>';
}

function cancelBooking(index) {
    if (confirm('Отменить эту запись?')) {
        const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
        bookings[index].status = 'cancelled';
        localStorage.setItem('massageBookings', JSON.stringify(bookings));
        loadBookings();
        showSuccessMessage('Запись отменена');
    }
}

function restoreBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
    bookings[index].status = 'confirmed';
    localStorage.setItem('massageBookings', JSON.stringify(bookings));
    loadBookings();
    showSuccessMessage('Запись восстановлена');
}

// Content management
function loadContent() {
    const content = JSON.parse(localStorage.getItem('massageContent') || '{}');
    
    document.getElementById('businessName').value = content.businessName || '';
    document.getElementById('businessPhone').value = content.businessPhone || '';
    document.getElementById('whatsappPhone').value = content.whatsappPhone || '';
    document.getElementById('businessAddress').value = content.businessAddress || '';
    document.getElementById('aboutText').value = content.aboutText || '';
    
    // Load profile image
    const images = JSON.parse(localStorage.getItem('massageImages') || '{}');
    if (images.profile && images.profile.length > 0) {
        const preview = document.getElementById('profileImagePreview');
        const img = document.getElementById('profileImagePreviewImg');
        img.src = images.profile[0].data || images.profile[0].optimized;
        preview.style.display = 'block';
    }
}

function saveContent() {
    const content = {
        businessName: document.getElementById('businessName').value,
        businessPhone: document.getElementById('businessPhone').value,
        whatsappPhone: document.getElementById('whatsappPhone').value,
        businessAddress: document.getElementById('businessAddress').value,
        aboutText: document.getElementById('aboutText').value
    };
    
    localStorage.setItem('massageContent', JSON.stringify(content));
    showSuccessMessage('Контент успешно сохранен!', 'contentSuccess');
}

// Services management
function loadServices() {
    const services = JSON.parse(localStorage.getItem('massageServices') || JSON.stringify({
        classic: { name: 'Классический массаж', price: 180, duration: 60, icon: 'fa-hand-paper' },
        sports: { name: 'Спортивный массаж', price: 220, duration: 60, icon: 'fa-dumbbell' },
        relax: { name: 'Релакс массаж', price: 200, duration: 75, icon: 'fa-spa' },
        deep: { name: 'Глубокий массаж', price: 250, duration: 60, icon: 'fa-fire' }
    }));
    
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = Object.keys(services).map(key => {
        const service = services[key];
        return `
            <div class="service-item">
                <div class="service-item-header">
                    <div>
                        <h4>${service.name}</h4>
                        <p style="color: var(--text-gray);">₪${service.price} • ${service.duration} минут</p>
                    </div>
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="editService('${key}')" style="margin-right: 0.5rem;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteService('${key}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addService() {
    const name = prompt('Название услуги:');
    if (!name) return;
    
    const price = prompt('Цена (₪):');
    if (!price || isNaN(price)) return;
    
    const duration = prompt('Длительность (минут):');
    if (!duration || isNaN(duration)) return;
    
    const services = JSON.parse(localStorage.getItem('massageServices') || '{}');
    const key = 'service_' + Date.now();
    
    services[key] = {
        name: name,
        price: parseInt(price),
        duration: parseInt(duration),
        icon: 'fa-star'
    };
    
    localStorage.setItem('massageServices', JSON.stringify(services));
    loadServices();
    showSuccessMessage('Услуга добавлена');
}

function editService(key) {
    const services = JSON.parse(localStorage.getItem('massageServices') || '{}');
    const service = services[key];
    
    const name = prompt('Название услуги:', service.name);
    if (!name) return;
    
    const price = prompt('Цена (₪):', service.price);
    if (!price || isNaN(price)) return;
    
    const duration = prompt('Длительность (минут):', service.duration);
    if (!duration || isNaN(duration)) return;
    
    services[key] = {
        ...service,
        name: name,
        price: parseInt(price),
        duration: parseInt(duration)
    };
    
    localStorage.setItem('massageServices', JSON.stringify(services));
    loadServices();
    showSuccessMessage('Услуга обновлена');
}

function deleteService(key) {
    if (confirm('Удалить эту услугу?')) {
        const services = JSON.parse(localStorage.getItem('massageServices') || '{}');
        delete services[key];
        localStorage.setItem('massageServices', JSON.stringify(services));
        loadServices();
        showSuccessMessage('Услуга удалена');
    }
}

// Settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('massageSettings') || '{}');
    
    document.getElementById('workStart').value = settings.workStart || '09:00';
    document.getElementById('workEnd').value = settings.workEnd || '21:00';
    document.getElementById('defaultDuration').value = settings.defaultDuration || 60;
}

function saveSettings() {
    const settings = {
        workStart: document.getElementById('workStart').value,
        workEnd: document.getElementById('workEnd').value,
        defaultDuration: parseInt(document.getElementById('defaultDuration').value)
    };
    
    // Update admin password if provided
    const newPassword = document.getElementById('newAdminPassword').value;
    if (newPassword) {
        localStorage.setItem('adminPassword', newPassword);
    }
    
    localStorage.setItem('massageSettings', JSON.stringify(settings));
    showSuccessMessage('Настройки сохранены!');
}

// Export/Import data
function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        bookings: JSON.parse(localStorage.getItem('massageBookings') || '[]'),
        services: JSON.parse(localStorage.getItem('massageServices') || '{}'),
        content: JSON.parse(localStorage.getItem('massageContent') || '{}'),
        settings: JSON.parse(localStorage.getItem('massageSettings') || '{}'),
        images: JSON.parse(localStorage.getItem('massageImages') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `massage-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Это заменит все текущие данные. Продолжить?')) {
                    localStorage.setItem('massageBookings', JSON.stringify(data.bookings || []));
                    localStorage.setItem('massageServices', JSON.stringify(data.services || {}));
                    localStorage.setItem('massageContent', JSON.stringify(data.content || {}));
                    localStorage.setItem('massageSettings', JSON.stringify(data.settings || {}));
                    localStorage.setItem('massageImages', JSON.stringify(data.images || {}));
                    
                    showSuccessMessage('Данные успешно импортированы!');
                    setTimeout(() => location.reload(), 1500);
                }
            } catch (error) {
                alert('Ошибка при импорте данных: ' + error.message);
            }
        };
        
        reader.readAsText(input.files[0]);
    }
}

// Helper functions
function showSuccessMessage(message, elementId = 'contentSuccess') {
    const successMsg = document.getElementById(elementId) || document.querySelector('.success-message');
    if (successMsg) {
        successMsg.textContent = message;
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
}