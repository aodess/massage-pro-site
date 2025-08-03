// ===== THEME PRESETS SYSTEM =====
// Файл: assets/js/theme-presets.js

class ThemeManager {
    constructor() {
        this.themes = {
            brutal: {
                name: 'Брутальный (по умолчанию)',
                colors: {
                    primary: '#ff6b35',
                    secondary: '#c1272d',
                    background: '#1a1a1a',
                    text: '#ffffff',
                    accent: '#ffd700'
                },
                fonts: {
                    heading: 'Bebas Neue',
                    body: 'Roboto'
                },
                description: 'Агрессивный дизайн с яркими акцентами'
            },
            
            gold: {
                name: 'Золотой люкс',
                colors: {
                    primary: '#d4af37',
                    secondary: '#b8860b',
                    background: '#1a1612',
                    text: '#f5f5dc',
                    accent: '#fff8dc'
                },
                fonts: {
                    heading: 'Playfair Display',
                    body: 'Montserrat'
                },
                description: 'Премиальный стиль с золотыми оттенками'
            },
            
            silver: {
                name: 'Серебряная элегантность',
                colors: {
                    primary: '#c0c0c0',
                    secondary: '#708090',
                    background: '#1c1c1c',
                    text: '#e8e8e8',
                    accent: '#dcdcdc'
                },
                fonts: {
                    heading: 'Oswald',
                    body: 'Lato'
                },
                description: 'Сдержанная элегантность в серых тонах'
            },
            
            crimson: {
                name: 'Багровая страсть',
                colors: {
                    primary: '#dc143c',
                    secondary: '#8b0000',
                    background: '#1a0a0a',
                    text: '#ffe4e1',
                    accent: '#ff69b4'
                },
                fonts: {
                    heading: 'Anton',
                    body: 'Open Sans'
                },
                description: 'Страстный дизайн в красных тонах'
            },
            
            ocean: {
                name: 'Океанская свежесть',
                colors: {
                    primary: '#00ced1',
                    secondary: '#20b2aa',
                    background: '#0a1a1a',
                    text: '#e0ffff',
                    accent: '#7fffd4'
                },
                fonts: {
                    heading: 'Russo One',
                    body: 'Poppins'
                },
                description: 'Свежий дизайн с морскими оттенками'
            },
            
            neon: {
                name: 'Неоновый киберпанк',
                colors: {
                    primary: '#ff00ff',
                    secondary: '#00ff00',
                    background: '#0a0a0a',
                    text: '#ffffff',
                    accent: '#00ffff'
                },
                fonts: {
                    heading: 'Orbitron',
                    body: 'Roboto'
                },
                description: 'Футуристический стиль с неоновыми цветами'
            }
        };
        
        this.currentTheme = 'brutal';
        this.init();
    }

    init() {
        // Загрузка сохраненной темы
        const savedTheme = localStorage.getItem('massageTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        // Применение темы при загрузке
        this.applyTheme(this.currentTheme);
    }

    // Применение темы
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        this.currentTheme = themeName;
        
        // Генерация CSS
        const css = this.generateThemeCSS(theme);
        
        // Применение CSS
        this.injectCSS(css);
        
        // Сохранение выбора
        localStorage.setItem('massageTheme', themeName);
        
        // Уведомление основного сайта
        this.notifyMainSite(theme, css);
    }

    // Генерация CSS для темы
    generateThemeCSS(theme) {
        const { colors, fonts } = theme;
        
        return `
            /* Theme: ${theme.name} */
            :root {
                /* Colors */
                --primary-dark: ${this.darken(colors.background, 10)};
                --secondary-dark: ${this.lighten(colors.background, 10)};
                --tertiary-dark: ${this.lighten(colors.background, 20)};
                --accent-orange: ${colors.primary};
                --accent-red: ${colors.secondary};
                --accent-gold: ${colors.accent};
                --text-light: ${colors.text};
                --text-gray: ${this.opacity(colors.text, 0.6)};
                --text-dark: ${this.darken(colors.text, 50)};
                
                /* Gradients */
                --gradient-primary: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                --gradient-secondary: linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%);
                --gradient-dark: linear-gradient(135deg, ${colors.background} 0%, ${this.lighten(colors.background, 10)} 50%, ${this.lighten(colors.background, 20)} 100%);
                --gradient-glass: linear-gradient(135deg, ${this.opacity(colors.text, 0.1)} 0%, ${this.opacity(colors.text, 0.05)} 100%);
                
                /* Shadows */
                --shadow-small: 0 2px 10px ${this.opacity(colors.background, 0.3)};
                --shadow-medium: 0 10px 30px ${this.opacity(colors.background, 0.4)};
                --shadow-large: 0 20px 60px ${this.opacity(colors.background, 0.5)};
                --shadow-glow: 0 0 30px ${this.opacity(colors.primary, 0.5)};
                
                /* Borders */
                --border-glass: 1px solid ${this.opacity(colors.text, 0.1)};
                --border-accent: 1px solid ${this.opacity(colors.primary, 0.3)};
                
                /* Fonts */
                --font-heading: '${fonts.heading}', sans-serif;
                --font-body: '${fonts.body}', sans-serif;
            }
            
            /* Apply fonts */
            body {
                font-family: var(--font-body);
                background: ${colors.background};
                color: ${colors.text};
            }
            
            h1, h2, h3, h4, h5, h6,
            .hero-title,
            .section-title,
            .logo,
            .stat-number,
            .service-name,
            .calendar-title {
                font-family: var(--font-heading) !important;
            }
            
            /* Special effects for neon theme */
            ${themeName === 'neon' ? this.getNeonEffects() : ''}
            
            /* Special effects for gold theme */
            ${themeName === 'gold' ? this.getGoldEffects() : ''}
            
            /* Special effects for ocean theme */
            ${themeName === 'ocean' ? this.getOceanEffects() : ''}
        `;
    }

    // Специальные эффекты для неоновой темы
    getNeonEffects() {
        return `
            .hero-title,
            .section-title .title-accent,
            .cta-button.primary {
                text-shadow: 0 0 10px currentColor,
                            0 0 20px currentColor,
                            0 0 30px currentColor,
                            0 0 40px currentColor;
            }
            
            .service-card:hover {
                box-shadow: 0 0 20px var(--accent-orange),
                           0 0 40px var(--accent-orange),
                           inset 0 0 20px var(--accent-orange);
            }
            
            .cta-button.primary {
                animation: neonPulse 2s ease-in-out infinite;
            }
            
            @keyframes neonPulse {
                0%, 100% {
                    box-shadow: 0 0 20px var(--accent-orange),
                               0 0 40px var(--accent-orange);
                }
                50% {
                    box-shadow: 0 0 30px var(--accent-orange),
                               0 0 60px var(--accent-orange);
                }
            }
        `;
    }

    // Специальные эффекты для золотой темы
    getGoldEffects() {
        return `
            .hero-title,
            .section-title {
                background: linear-gradient(
                    to right,
                    #b8860b 0%,
                    #ffd700 25%,
                    #b8860b 50%,
                    #ffd700 75%,
                    #b8860b 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: goldShine 3s linear infinite;
            }
            
            @keyframes goldShine {
                to {
                    background-position: 200% center;
                }
            }
            
            .service-card.featured {
                border: 2px solid #d4af37;
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
            }
            
            .cta-button.primary::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, #d4af37, #fff8dc, #d4af37);
                border-radius: 50px;
                opacity: 0;
                z-index: -1;
                transition: opacity 0.3s ease;
            }
            
            .cta-button.primary:hover::before {
                opacity: 1;
                animation: goldRotate 2s linear infinite;
            }
            
            @keyframes goldRotate {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
    }

    // Специальные эффекты для океанской темы
    getOceanEffects() {
        return `
            .hero-bg-layers::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="%2300ced1" opacity=".25"/><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="%2300ced1" opacity=".5"/><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="%2300ced1"/></svg>') no-repeat bottom;
                opacity: 0.3;
                animation: waves 10s ease-in-out infinite;
            }
            
            @keyframes waves {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-20px);
                }
            }
            
            .floating-element {
                background: radial-gradient(circle, rgba(0, 206, 209, 0.4) 0%, transparent 70%);
                animation: float 15s ease-in-out infinite, ripple 4s ease-in-out infinite;
            }
            
            @keyframes ripple {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.3;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.1;
                }
            }
        `;
    }

    // Внедрение CSS
    injectCSS(css) {
        let styleElement = document.getElementById('themeStyles');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'themeStyles';
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = css;
    }

    // Уведомление основного сайта
    notifyMainSite(theme, css) {
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'updateTheme',
                theme: {
                    name: theme.name,
                    colors: theme.colors,
                    fonts: theme.fonts,
                    css: css
                }
            }, '*');
        }
    }

    // Получение списка тем для UI
    getThemesList() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            name: this.themes[key].name,
            description: this.themes[key].description,
            colors: this.themes[key].colors,
            isActive: key === this.currentTheme
        }));
    }

    // Предпросмотр темы
    previewTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        // Временное применение темы
        const css = this.generateThemeCSS(theme);
        this.injectCSS(css);
        
        // Добавление класса предпросмотра
        document.body.classList.add('theme-preview');
    }

    // Отмена предпросмотра
    cancelPreview() {
        document.body.classList.remove('theme-preview');
        this.applyTheme(this.currentTheme);
    }

    // Создание пользовательской темы
    createCustomTheme(name, colors, fonts) {
        const customTheme = {
            name: name,
            colors: colors,
            fonts: fonts,
            description: 'Пользовательская тема'
        };
        
        // Сохранение пользовательской темы
        const customThemes = JSON.parse(localStorage.getItem('customThemes') || '{}');
        const themeId = 'custom_' + Date.now();
        customThemes[themeId] = customTheme;
        localStorage.setItem('customThemes', JSON.stringify(customThemes));
        
        // Добавление в список тем
        this.themes[themeId] = customTheme;
        
        return themeId;
    }

    // Утилиты для работы с цветами
    lighten(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    darken(color, percent) {
        return this.lighten(color, -percent);
    }

    opacity(color, alpha) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Экспорт темы
    exportTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        const exportData = {
            theme: theme,
            css: this.generateThemeCSS(theme),
            version: '1.0',
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `massage-pro-theme-${themeName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Импорт темы
    async importTheme(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            if (!importData.theme || !importData.theme.name) {
                throw new Error('Неверный формат файла темы');
            }
            
            const themeId = 'imported_' + Date.now();
            this.themes[themeId] = importData.theme;
            
            // Сохранение импортированной темы
            const importedThemes = JSON.parse(localStorage.getItem('importedThemes') || '{}');
            importedThemes[themeId] = importData.theme;
            localStorage.setItem('importedThemes', JSON.stringify(importedThemes));
            
            return themeId;
        } catch (error) {
            throw new Error('Ошибка при импорте темы: ' + error.message);
        }
    }
}

// Экспорт
window.ThemeManager = ThemeManager;

// Создание глобального экземпляра
window.themeManager = new ThemeManager();

console.log('🎨 Theme Manager Loaded Successfully!');