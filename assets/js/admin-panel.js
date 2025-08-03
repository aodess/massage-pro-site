<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASSAGE PRO - Админ панель</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&family=Oswald:wght@400;700&family=Russo+One&family=Anton&family=Lato:wght@400;700&family=Open+Sans:wght@400;700&family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- Theme Styles -->
    <style id="themeStyles"></style>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #1a1a1a;
            --secondary: #2d2d2d;
            --accent: #ff6b35;
            --accent-hover: #e55a2b;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --text-light: #ffffff;
            --text-gray: #9ca3af;
            --border: rgba(255, 255, 255, 0.1);
            --gradient: linear-gradient(135deg, #ff6b35, #c1272d);
        }

        body {
            font-family: 'Roboto', sans-serif;
            background: var(--primary);
            color: var(--text-light);
            line-height: 1.6;
        }

        /* Auth Screen */
        .auth-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        }

        .auth-form {
            background: rgba(45, 45, 45, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .auth-logo {
            font-size: 2.5rem;
            font-weight: 900;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-gray);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border);
            border-radius: 10px;
            color: var(--text-light);
            font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent);
        }

        .auth-btn {
            width: 100%;
            background: var(--gradient);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .auth-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        }

        .error-msg {
            color: var(--danger);
            font-size: 0.9rem;
            margin-top: 1rem;
        }

        /* Admin Panel */
        .admin-panel {
            display: none;
            min-height: 100vh;
        }

        .admin-header {
            background: var(--secondary);
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .admin-logo {
            font-size: 1.5rem;
            font-weight: 700;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .admin-user {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .logout-btn {
            background: var(--danger);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
        }

        .admin-container {
            display: flex;
            min-height: calc(100vh - 80px);
        }

        .admin-sidebar {
            width: 280px;
            background: var(--secondary);
            border-right: 1px solid var(--border);
            padding: 2rem 0;
        }

        .sidebar-menu {
            list-style: none;
        }

        .sidebar-item {
            margin-bottom: 0.5rem;
        }

        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 2rem;
            color: var(--text-gray);
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .sidebar-link:hover,
        .sidebar-link.active {
            background: rgba(255, 107, 53, 0.1);
            color: var(--accent);
            border-right: 3px solid var(--accent);
        }

        .admin-content {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }

        .content-section {
            display: none;
        }

        .content-section.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        .section-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Cards */
        .admin-card {
            background: var(--secondary);
            border: 1px solid var(--border);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .card-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-light);
        }

        /* Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--gradient);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            color: white;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 900;
            display: block;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Forms */
        .admin-form {
            display: grid;
            gap: 1.5rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: var(--gradient);
            color: white;
        }

        .btn-secondary {
            background: var(--secondary);
            color: var(--text-light);
            border: 1px solid var(--border);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-danger {
            background: var(--danger);
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* Tables */
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            background: var(--secondary);
            border-radius: 15px;
            overflow: hidden;
        }

        .admin-table th,
        .admin-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }

        .admin-table th {
            background: rgba(255, 107, 53, 0.1);
            font-weight: 600;
            color: var(--accent);
        }

        .admin-table tr:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        /* Theme Selector */
        .theme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .theme-card {
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid transparent;
            border-radius: 15px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .theme-card:hover {
            border-color: var(--accent);
            transform: translateY(-5px);
        }

        .theme-card.active {
            border-color: var(--accent);
            background: rgba(255, 107, 53, 0.1);
        }

        .theme-preview {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            justify-content: center;
        }

        .color-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .theme-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .theme-description {
            font-size: 0.8rem;
            color: var(--text-gray);
        }

        /* Image Management */
        .image-categories {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .category-tab {
            padding: 0.5rem 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .category-tab.active {
            background: var(--accent);
            border-color: var(--accent);
        }

        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }

        .image-item {
            position: relative;
            aspect-ratio: 1;
            border-radius: 10px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border);
        }

        .image-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-actions {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .image-item:hover .image-actions {
            opacity: 1;
        }

        .image-action-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .image-action-btn:hover {
            background: var(--accent);
        }

        /* Notification Templates */
        .template-editor {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }

        .template-variables {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .variable-tag {
            background: var(--accent);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            cursor: pointer;
        }

        /* Mobile */
        @media (max-width: 768px) {
            .admin-container {
                flex-direction: column;
            }

            .admin-sidebar {
                width: 100%;
                padding: 1rem 0;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .theme-grid {
                grid-template-columns: 1fr;
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .success-msg {
            background: var(--success);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            display: none;
        }

        .success-msg.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
    </style>
</head>
<body>
    <!-- Auth Screen -->
    <div id="authScreen" class="auth-screen">
        <div class="auth-form">
            <div class="auth-logo">MASSAGE PRO</div>
            <h2>Вход в админ-панель</h2>
            <p style="color: var(--text-gray); margin-bottom: 2rem;">Введите пароль для доступа</p>
            
            <form id="authForm">
                <div class="form-group">
                    <label for="adminPassword">Пароль администратора</label>
                    <input type="password" id="adminPassword" placeholder="Введите пароль" required>
                </div>
                <button type="submit" class="auth-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    Войти
                </button>
            </form>
            <div id="authError" class="error-msg"></div>
        </div>
    </div>

    <!-- Admin Panel -->
    <div id="adminPanel" class="admin-panel">
        <!-- Header -->
        <header class="admin-header">
            <div class="admin-logo">MASSAGE PRO - АДМИН</div>
            <div class="admin-user">
                <span>Администратор</span>
                <button class="logout-btn" onclick="adminPanel.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Выйти
                </button>
            </div>
        </header>

        <div class="admin-container">
            <!-- Sidebar -->
            <nav class="admin-sidebar">
                <ul class="sidebar-menu">
                    <li class="sidebar-item">
                        <a class="sidebar-link active" onclick="adminPanel.showSection('dashboard')">
                            <i class="fas fa-chart-pie"></i>
                            Дашборд
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('bookings')">
                            <i class="fas fa-calendar-check"></i>
                            Записи
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('schedule')">
                            <i class="fas fa-clock"></i>
                            Расписание
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('content')">
                            <i class="fas fa-edit"></i>
                            Контент
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('images')">
                            <i class="fas fa-images"></i>
                            Изображения
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('services')">
                            <i class="fas fa-spa"></i>
                            Услуги
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('notifications')">
                            <i class="fas fa-bell"></i>
                            Уведомления
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('design')">
                            <i class="fas fa-paint-brush"></i>
                            Дизайн
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('analytics')">
                            <i class="fas fa-chart-line"></i>
                            Аналитика
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" onclick="adminPanel.showSection('settings')">
                            <i class="fas fa-cog"></i>
                            Настройки
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- Content -->
            <main class="admin-content">
                <!-- Dashboard -->
                <section id="dashboard" class="content-section active">
                    <h1 class="section-title">Панель управления</h1>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-number" id="totalBookings">0</span>
                            <span class="stat-label">Всего записей</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number" id="todayBookings">0</span>
                            <span class="stat-label">Записей сегодня</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number" id="monthRevenue">₪0</span>
                            <span class="stat-label">Доход за месяц</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number" id="avgRating">5.0</span>
                            <span class="stat-label">Средняя оценка</span>
                        </div>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">Ближайшие записи</h3>
                        <div id="upcomingBookings">
                            <!-- Будет заполнено JS -->
                        </div>
                    </div>
                </section>

                <!-- Bookings -->
                <section id="bookings" class="content-section">
                    <h1 class="section-title">Управление записями</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">Все записи</h3>
                        <div style="overflow-x: auto;">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Клиент</th>
                                        <th>Телефон</th>
                                        <th>Дата</th>
                                        <th>Время</th>
                                        <th>Услуга</th>
                                        <th>Сумма</th>
                                        <th>Статус</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody id="bookingsTable">
                                    <!-- Будет заполнено JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Schedule -->
                <section id="schedule" class="content-section">
                    <h1 class="section-title">Управление расписанием</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">Рабочее время</h3>
                        <form class="admin-form" id="scheduleForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Начало работы</label>
                                    <input type="time" id="workStart" value="09:00">
                                </div>
                                <div class="form-group">
                                    <label>Конец работы</label>
                                    <input type="time" id="workEnd" value="21:00">
                                </div>
                                <div class="form-group">
                                    <label>Длительность слота (мин)</label>
                                    <input type="number" id="slotDuration" value="60" min="15" max="180" step="15">
                                </div>
                            </div>
                            <button type="button" class="btn btn-success" onclick="adminPanel.saveSchedule()">
                                <i class="fas fa-save"></i>
                                Сохранить расписание
                            </button>
                        </form>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">Перерывы</h3>
                        <div id="breaksList">
                            <!-- Будет заполнено JS -->
                        </div>
                        <button type="button" class="btn btn-primary" onclick="adminPanel.addBreak()">
                            <i class="fas fa-plus"></i>
                            Добавить перерыв
                        </button>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">Праздники и выходные</h3>
                        <div id="holidaysList">
                            <!-- Будет заполнено JS -->
                        </div>
                        <button type="button" class="btn btn-primary" onclick="adminPanel.addHoliday()">
                            <i class="fas fa-calendar-times"></i>
                            Добавить выходной
                        </button>
                    </div>
                </section>

                <!-- Content -->
                <section id="content" class="content-section">
                    <h1 class="section-title">Управление контентом</h1>
                    
                    <div id="contentSuccess" class="success-msg">
                        Контент успешно сохранен!
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">📝 Текстовая информация</h3>
                        <form class="admin-form" id="contentForm">
                            <div class="form-group">
                                <label>Название салона</label>
                                <input type="text" id="businessName" placeholder="MASSAGE PRO">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Телефон</label>
                                    <input type="tel" id="businessPhone" placeholder="+972-50-123-4567">
                                </div>
                                <div class="form-group">
                                    <label>WhatsApp</label>
                                    <input type="tel" id="whatsappPhone" placeholder="972501234567">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Адрес</label>
                                <input type="text" id="businessAddress" placeholder="ул. Дизенгоф 125, Тель-Авив">
                            </div>
                            <div class="form-group">
                                <label>Описание "Обо мне"</label>
                                <textarea id="aboutText" rows="5" placeholder="Расскажите о себе..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Девиз/Слоган</label>
                                <input type="text" id="businessSlogan" placeholder="Восстановление • Релаксация • Здоровье">
                            </div>
                            <button type="button" class="btn btn-success" onclick="adminPanel.saveContent()">
                                <i class="fas fa-save"></i>
                                Сохранить контент
                            </button>
                        </form>
                    </div>
                </section>

                <!-- Images -->
                <section id="images" class="content-section">
                    <h1 class="section-title">Управление изображениями</h1>
                    
                    <div class="image-categories">
                        <div class="category-tab active" onclick="showImageCategory('all')">Все</div>
                        <div class="category-tab" onclick="showImageCategory('profile')">Профиль</div>
                        <div class="category-tab" onclick="showImageCategory('gallery')">Галерея</div>
                        <div class="category-tab" onclick="showImageCategory('cabinet')">Кабинет</div>
                        <div class="category-tab" onclick="showImageCategory('certificates')">Сертификаты</div>
                        <div class="category-tab" onclick="showImageCategory('logo')">Логотип</div>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">Загрузка изображений</h3>
                        <div class="form-group">
                            <label>Категория</label>
                            <select id="uploadCategory">
                                <option value="profile">Фото профиля</option>
                                <option value="gallery">Галерея работ</option>
                                <option value="cabinet">Фото кабинета</option>
                                <option value="certificates">Сертификаты</option>
                                <option value="logo">Логотип</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Выберите файлы</label>
                            <input type="file" id="imageUploadInput" accept="image/*" multiple>
                        </div>
                        <div class="form-row">
                            <label>
                                <input type="checkbox" id="addWatermark"> Добавить водяной знак
                            </label>
                            <label>
                                <input type="checkbox" id="autoOptimize" checked> Автооптимизация
                            </label>
                        </div>
                        <button type="button" class="btn btn-primary" onclick="uploadImages()">
                            <i class="fas fa-upload"></i>
                            Загрузить изображения
                        </button>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">Управление изображениями</h3>
                        <div class="image-grid" id="imageGrid">
                            <!-- Изображения будут загружены JS -->
                        </div>
                    </div>
                </section>

                <!-- Services -->
                <section id="services" class="content-section">
                    <h1 class="section-title">Управление услугами</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">Список услуг</h3>
                        <div id="servicesList">
                            <!-- Будет заполнено JS -->
                        </div>
                        <button type="button" class="btn btn-primary" onclick="adminPanel.addService()">
                            <i class="fas fa-plus"></i>
                            Добавить услугу
                        </button>
                    </div>
                </section>

                <!-- Notifications -->
                <section id="notifications" class="content-section">
                    <h1 class="section-title">Управление уведомлениями</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">Шаблоны сообщений</h3>
                        <div id="templatesList">
                            <!-- Шаблоны будут загружены JS -->
                        </div>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">Массовая рассылка</h3>
                        <form class="admin-form">
                            <div class="form-group">
                                <label>Шаблон сообщения</label>
                                <select id="massTemplate">
                                    <option value="special_offer">Специальное предложение</option>
                                    <option value="birthday_greeting">Поздравление с ДР</option>
                                    <option value="custom">Пользовательское</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Фильтр клиентов</label>
                                <select id="clientFilter">
                                    <option value="all">Все клиенты</option>
                                    <option value="regular">Постоянные (5+ визитов)</option>
                                    <option value="recent">Недавние (30 дней)</option>
                                    <option value="inactive">Неактивные (60+ дней)</option>
                                </select>
                            </div>
                            <button type="button" class="btn btn-primary" onclick="sendMassNotification()">
                                <i class="fab fa-whatsapp"></i>
                                Отправить рассылку
                            </button>
                        </form>
                    </div>
                </section>

                <!-- Design -->
                <section id="design" class="content-section">
                    <h1 class="section-title">Настройки дизайна</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">🎨 Выбор темы</h3>
                        <div class="theme-grid" id="themeGrid">
                            <!-- Темы будут загружены JS -->
                        </div>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">🎨 Пользовательские цвета</h3>
                        <form class="admin-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Основной цвет</label>
                                    <input type="color" id="customPrimary" value="#ff6b35">
                                </div>
                                <div class="form-group">
                                    <label>Дополнительный цвет</label>
                                    <input type="color" id="customSecondary" value="#c1272d">
                                </div>
                                <div class="form-group">
                                    <label>Цвет фона</label>
                                    <input type="color" id="customBackground" value="#1a1a1a">
                                </div>
                                <div class="form-group">
                                    <label>Цвет текста</label>
                                    <input type="color" id="customText" value="#ffffff">
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary" onclick="createCustomTheme()">
                                <i class="fas fa-palette"></i>
                                Создать тему
                            </button>
                        </form>
                    </div>
                </section>

                <!-- Analytics -->
                <section id="analytics" class="content-section">
                    <h1 class="section-title">Аналитика</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">📊 Статистика за период</h3>
                        <div class="form-row">
                            <input type="date" id="analyticsStart">
                            <input type="date" id="analyticsEnd">
                            <button class="btn btn-primary" onclick="loadAnalytics()">
                                <i class="fas fa-chart-line"></i>
                                Показать
                            </button>
                        </div>
                        <div id="analyticsData" style="margin-top: 2rem;">
                            <!-- Данные аналитики -->
                        </div>
                    </div>
                </section>

                <!-- Settings -->
                <section id="settings" class="content-section">
                    <h1 class="section-title">Настройки системы</h1>
                    
                    <div class="admin-card">
                        <h3 class="card-title">Общие настройки</h3>
                        <form class="admin-form" id="settingsForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Автоподтверждение записей</label>
                                    <select id="autoConfirm">
                                        <option value="true">Включено</option>
                                        <option value="false">Выключено</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Максимум дней для записи</label>
                                    <input type="number" id="maxBookingDays" value="30" min="1" max="365">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Новый пароль администратора</label>
                                <input type="password" id="newAdminPassword" placeholder="Оставьте пустым, чтобы не менять">
                            </div>
                            <button type="button" class="btn btn-success" onclick="adminPanel.saveSettings()">
                                <i class="fas fa-save"></i>
                                Сохранить настройки
                            </button>
                        </form>
                    </div>

                    <div class="admin-card">
                        <h3 class="card-title">💾 Резервное копирование</h3>
                        <div class="form-row">
                            <button type="button" class="btn btn-primary" onclick="adminPanel.exportData()">
                                <i class="fas fa-download"></i>
                                Экспорт данных
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('importFile').click()">
                                <i class="fas fa-upload"></i>
                                Импорт данных
                            </button>
                        </div>
                        <input type="file" id="importFile" accept=".json" style="display: none;" onchange="adminPanel.importData(this.files[0])">
                    </div>
                </section>
            </main>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/js/admin-panel.js"></script>
    <script src="assets/js/smart-calendar.js"></script>
    <script src="assets/js/notifications.js"></script>
    <script src="assets/js/image-manager-pro.js"></script>
    <script src="assets/js/theme-presets.js"></script>
    
    <script>
        // Initialize systems
        let smartCalendar;
        let notificationSystem;
        let imageManager;
        let themeManager;
        
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize all systems
            smartCalendar = new SmartCalendar();
            notificationSystem = new NotificationSystem();
            imageManager = window.imageManager || new ImageManagerPro();
            themeManager = window.themeManager || new ThemeManager();
            
            // Load themes
            loadThemes();
        });

        // Theme functions
        function loadThemes() {
            const themeGrid = document.getElementById('themeGrid');
            if (!themeGrid) return;
            
            const themes = themeManager.getThemesList();
            
            themeGrid.innerHTML = themes.map(theme => `
                <div class="theme-card ${theme.isActive ? 'active' : ''}" onclick="selectTheme('${theme.id}')">
                    <div class="theme-preview">
                        <div class="color-circle" style="background: ${theme.colors.primary}"></div>
                        <div class="color-circle" style="background: ${theme.colors.secondary}"></div>
                        <div class="color-circle" style="background: ${theme.colors.background}"></div>
                        <div class="color-circle" style="background: ${theme.colors.text}"></div>
                    </div>
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-description">${theme.description}</div>
                </div>
            `).join('');
        }

        function selectTheme(themeId) {
            themeManager.applyTheme(themeId);
            loadThemes(); // Refresh to show active state
        }

        function createCustomTheme() {
            const name = prompt('Название темы:');
            if (!name) return;
            
            const colors = {
                primary: document.getElementById('customPrimary').value,
                secondary: document.getElementById('customSecondary').value,
                background: document.getElementById('customBackground').value,
                text: document.getElementById('customText').value,
                accent: document.getElementById('customPrimary').value
            };
            
            const fonts = {
                heading: 'Bebas Neue',
                body: 'Roboto'
            };
            
            const themeId = themeManager.createCustomTheme(name, colors, fonts);
            themeManager.applyTheme(themeId);
            loadThemes();
        }

        // Image upload
        async function uploadImages() {
            const input = document.getElementById('imageUploadInput');
            const category = document.getElementById('uploadCategory').value;
            const addWatermark = document.getElementById('addWatermark').checked;
            const autoOptimize = document.getElementById('autoOptimize').checked;
            
            if (!input.files.length) {
                alert('Выберите файлы для загрузки');
                return;
            }
            
            try {
                const results = await imageManager.uploadImages(
                    Array.from(input.files),
                    category,
                    {
                        addWatermark: addWatermark,
                        watermarkText: 'MASSAGE PRO',
                        autoOptimize: autoOptimize
                    }
                );
                
                // Show results
                const successCount = results.filter(r => r.success).length;
                alert(`Загружено ${successCount} из ${results.length} изображений`);
                
                // Refresh image grid
                loadImages();
                
                // Clear input
                input.value = '';
            } catch (error) {
                alert('Ошибка при загрузке: ' + error.message);
            }
        }

        // Load images
        function loadImages() {
            const imageGrid = document.getElementById('imageGrid');
            if (!imageGrid) return;
            
            const allImages = imageManager.loadSavedImages();
            const images = [];
            
            // Collect all images from all categories
            for (const category in allImages) {
                allImages[category].forEach(img => {
                    images.push({ ...img, category });
                });
            }
            
            imageManager.createImageGallery(images, 'imageGrid');
        }

        // Show image category
        function showImageCategory(category) {
            const tabs = document.querySelectorAll('.category-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            const imageGrid = document.getElementById('imageGrid');
            if (!imageGrid) return;
            
            const allImages = imageManager.loadSavedImages();
            let images = [];
            
            if (category === 'all') {
                for (const cat in allImages) {
                    allImages[cat].forEach(img => {
                        images.push({ ...img, category: cat });
                    });
                }
            } else {
                images = allImages[category] || [];
            }
            
            imageManager.createImageGallery(images, 'imageGrid');
        }

        // Mass notification
        async function sendMassNotification() {
            const template = document.getElementById('massTemplate').value;
            const filterType = document.getElementById('clientFilter').value;
            
            if (!confirm('Отправить рассылку выбранным клиентам?')) return;
            
            let filter = {};
            switch(filterType) {
                case 'regular':
                    filter.minVisits = 5;
                    break;
                case 'recent':
                    filter.lastVisitDays = 30;
                    break;
                case 'inactive':
                    filter.lastVisitDays = 60;
                    filter.inactive = true;
                    break;
            }
            
            // Custom data for the template
            const customData = {
                offerText: 'Скидка 20% на все виды массажа до конца месяца!',
                offerEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
            };
            
            try {
                const results = await notificationSystem.sendMassNotification(template, filter, customData);
                alert(`Отправлено ${results.filter(r => r.success).length} из ${results.length} сообщений`);
            } catch (error) {
                alert('Ошибка при отправке: ' + error.message);
            }
        }

        // Analytics
        function loadAnalytics() {
            const start = document.getElementById('analyticsStart').value;
            const end = document.getElementById('analyticsEnd').value;
            
            if (!start || !end) {
                alert('Выберите период');
                return;
            }
            
            const bookings = JSON.parse(localStorage.getItem('massageBookings') || '[]');
            const filteredBookings = bookings.filter(b => {
                const date = new Date(b.date);
                return date >= new Date(start) && date <= new Date(end);
            });
            
            // Calculate analytics
            const analytics = {
                totalBookings: filteredBookings.length,
                totalRevenue: filteredBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0),
                avgBookingValue: 0,
                popularServices: {},
                busyDays: {}
            };
            
            analytics.avgBookingValue = analytics.totalRevenue / analytics.totalBookings || 0;
            
            // Popular services
            filteredBookings.forEach(booking => {
                const serviceName = booking.service?.name || 'Unknown';
                analytics.popularServices[serviceName] = (analytics.popularServices[serviceName] || 0) + 1;
            });
            
            // Busy days
            filteredBookings.forEach(booking => {
                const day = new Date(booking.date).toLocaleDateString('ru-RU', { weekday: 'long' });
                analytics.busyDays[day] = (analytics.busyDays[day] || 0) + 1;
            });
            
            // Display analytics
            const analyticsData = document.getElementById('analyticsData');
            analyticsData.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-number">${analytics.totalBookings}</span>
                        <span class="stat-label">Записей</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">₪${analytics.totalRevenue}</span>
                        <span class="stat-label">Общий доход</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">₪${Math.round(analytics.avgBookingValue)}</span>
                        <span class="stat-label">Средний чек</span>
                    </div>
                </div>
                
                <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Популярные услуги:</h4>
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                    ${Object.entries(analytics.popularServices)
                        .sort((a, b) => b[1] - a[1])
                        .map(([service, count]) => `
                            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                                <span>${service}</span>
                                <span style="color: var(--accent)">${count} записей</span>
                            </div>
                        `).join('')}
                </div>
                
                <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Загруженность по дням:</h4>
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                    ${Object.entries(analytics.busyDays)
                        .sort((a, b) => b[1] - a[1])
                        .map(([day, count]) => `
                            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                                <span>${day}</span>
                                <span style="color: var(--accent)">${count} записей</span>
                            </div>
                        `).join('')}
                </div>
            `;
        }

        // Load notification templates
        function loadNotificationTemplates() {
            const templatesList = document.getElementById('templatesList');
            if (!templatesList) return;
            
            const templates = notificationSystem.getAllTemplates();
            
            templatesList.innerHTML = Object.entries(templates).map(([key, template]) => `
                <div class="template-editor">
                    <h4>${template.title}</h4>
                    <textarea 
                        id="template_${key}" 
                        rows="10" 
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; color: var(--text-light); font-family: monospace;"
                        onchange="updateTemplate('${key}')"
                    >${template.template}</textarea>
                    <div class="template-variables">
                        ${template.variables.map(v => `
                            <span class="variable-tag" onclick="insertVariable('template_${key}', '{{${v}}}')">${v}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Update notification template
        function updateTemplate(key) {
            const textarea = document.getElementById(`template_${key}`);
            const template = notificationSystem.getTemplate(key);
            
            if (template && textarea) {
                template.template = textarea.value;
                notificationSystem.updateTemplate(key, template);
                adminPanel.showSuccessMessage('Шаблон обновлен');
            }
        }

        // Insert variable into template
        function insertVariable(textareaId, variable) {
            const textarea = document.getElementById(textareaId);
            if (!textarea) return;
            
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            
            textarea.value = text.substring(0, start) + variable + text.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start + variable.length, start + variable.length);
        }

        // Initialize on admin panel show
        window.addEventListener('adminPanelLoaded', function() {
            loadImages();
            loadNotificationTemplates();
            loadThemes();
        });
    </script>
</body>
</html>