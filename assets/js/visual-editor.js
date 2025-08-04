// ===== VISUAL EDITOR =====

class VisualEditor {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.init();
    }

    loadTheme() {
        return JSON.parse(localStorage.getItem('massageTheme') || JSON.stringify({
            colors: {
                primary: '#ff6b35',
                secondary: '#1a1a1a',
                accent: '#ffd700',
                bgDark: '#0a0a0a',
                bgSection: '#1a1a1a',
                textLight: '#ffffff',
                textGray: '#a0a0a0',
                success: '#10b981',
                danger: '#ef4444'
            },
            fonts: {
                primary: 'Roboto',
                heading: 'Bebas Neue',
                size: {
                    base: '16px',
                    h1: '3rem',
                    h2: '2.5rem',
                    h3: '2rem'
                }
            },
            layout: {
                containerWidth: '1200px',
                sectionPadding: '5rem',
                borderRadius: '15px'
            }
        }));
    }

    init() {
        this.createEditorUI();
        this.applyTheme();
        this.initColorPickers();
        this.initFontControls();
        this.initLayoutControls();
    }

    createEditorUI() {
        const editorHTML = `
            <div class="visual-editor-panel" id="visualEditor">
                <div class="editor-header">
                    <h3>Визуальный редактор</h3>
                    <button class="btn btn-sm" onclick="visualEditor.toggleEditor()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="editor-tabs">
                    <button class="editor-tab active" onclick="visualEditor.showTab('colors')">
                        <i class="fas fa-palette"></i> Цвета
                    </button>
                    <button class="editor-tab" onclick="visualEditor.showTab('fonts')">
                        <i class="fas fa-font"></i> Шрифты
                    </button>
                    <button class="editor-tab" onclick="visualEditor.showTab('layout')">
                        <i class="fas fa-th-large"></i> Макет
                    </button>
                    <button class="editor-tab" onclick="visualEditor.showTab('presets')">
                        <i class="fas fa-magic"></i> Шаблоны
                    </button>
                </div>
                
                <div class="editor-content">
                    <!-- Colors Tab -->
                    <div class="editor-tab-content active" id="colorsTab">
                        <h4>Основные цвета</h4>
                        <div class="color-controls">
                            <div class="color-control">
                                <label>Основной цвет</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorPrimary" value="${this.currentTheme.colors.primary}">
                                    <input type="text" value="${this.currentTheme.colors.primary}" 
                                           onchange="visualEditor.updateColorFromText('primary', this.value)">
                                </div>
                            </div>
                            <div class="color-control">
                                <label>Вторичный цвет</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorSecondary" value="${this.currentTheme.colors.secondary}">
                                    <input type="text" value="${this.currentTheme.colors.secondary}"
                                           onchange="visualEditor.updateColorFromText('secondary', this.value)">
                                </div>
                            </div>
                            <div class="color-control">
                                <label>Акцентный цвет</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorAccent" value="${this.currentTheme.colors.accent}">
                                    <input type="text" value="${this.currentTheme.colors.accent}"
                                           onchange="visualEditor.updateColorFromText('accent', this.value)">
                                </div>
                            </div>
                            <div class="color-control">
                                <label>Фон темный</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorBgDark" value="${this.currentTheme.colors.bgDark}">
                                    <input type="text" value="${this.currentTheme.colors.bgDark}"
                                           onchange="visualEditor.updateColorFromText('bgDark', this.value)">
                                </div>
                            </div>
                            <div class="color-control">
                                <label>Фон секций</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorBgSection" value="${this.currentTheme.colors.bgSection}">
                                    <input type="text" value="${this.currentTheme.colors.bgSection}"
                                           onchange="visualEditor.updateColorFromText('bgSection', this.value)">
                                </div>
                            </div>
                            <div class="color-control">
                                <label>Текст светлый</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorTextLight" value="${this.currentTheme.colors.textLight}">
                                    <input type="text" value="${this.currentTheme.colors.textLight}"
                                           onchange="visualEditor.updateColorFromText('textLight', this.value)">
                                </div>
                            </div>
                            <div class="color-control">
                                <label>Текст серый</label>
                                <div class="color-input-group">
                                    <input type="color" id="colorTextGray" value="${this.currentTheme.colors.textGray}">
                                    <input type="text" value="${this.currentTheme.colors.textGray}"
                                           onchange="visualEditor.updateColorFromText('textGray', this.value)">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Fonts Tab -->
                    <div class="editor-tab-content" id="fontsTab">
                        <h4>Настройки шрифтов</h4>
                        <div class="font-controls">
                            <div class="font-control">
                                <label>Основной шрифт</label>
                                <select id="fontPrimary" onchange="visualEditor.updateFont('primary', this.value)">
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                    <option value="Lato">Lato</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Poppins">Poppins</option>
                                    <option value="Arial">Arial</option>
                                </select>
                            </div>
                            <div class="font-control">
                                <label>Шрифт заголовков</label>
                                <select id="fontHeading" onchange="visualEditor.updateFont('heading', this.value)">
                                    <option value="Bebas Neue">Bebas Neue</option>
                                    <option value="Oswald">Oswald</option>
                                    <option value="Russo One">Russo One</option>
                                    <option value="Playfair Display">Playfair Display</option>
                                    <option value="Roboto">Roboto</option>
                                </select>
                            </div>
                            <div class="font-control">
                                <label>Базовый размер</label>
                                <input type="range" id="fontSize" min="14" max="20" value="16"
                                       onchange="visualEditor.updateFontSize('base', this.value + 'px')">
                                <span id="fontSizeValue">16px</span>
                            </div>
                            <div class="font-control">
                                <label>H1 размер</label>
                                <input type="range" id="fontSizeH1" min="2" max="5" step="0.1" value="3"
                                       onchange="visualEditor.updateFontSize('h1', this.value + 'rem')">
                                <span id="fontSizeH1Value">3rem</span>
                            </div>
                            <div class="font-control">
                                <label>H2 размер</label>
                                <input type="range" id="fontSizeH2" min="1.5" max="4" step="0.1" value="2.5"
                                       onchange="visualEditor.updateFontSize('h2', this.value + 'rem')">
                                <span id="fontSizeH2Value">2.5rem</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Layout Tab -->
                    <div class="editor-tab-content" id="layoutTab">
                        <h4>Настройки макета</h4>
                        <div class="layout-controls">
                            <div class="layout-control">
                                <label>Ширина контейнера</label>
                                <input type="range" id="containerWidth" min="900" max="1400" step="50" value="1200"
                                       onchange="visualEditor.updateLayout('containerWidth', this.value + 'px')">
                                <span id="containerWidthValue">1200px</span>
                            </div>
                            <div class="layout-control">
                                <label>Отступы секций</label>
                                <input type="range" id="sectionPadding" min="2" max="8" step="0.5" value="5"
                                       onchange="visualEditor.updateLayout('sectionPadding', this.value + 'rem')">
                                <span id="sectionPaddingValue">5rem</span>
                            </div>
                            <div class="layout-control">
                                <label>Скругление углов</label>
                                <input type="range" id="borderRadius" min="0" max="30" value="15"
                                       onchange="visualEditor.updateLayout('borderRadius', this.value + 'px')">
                                <span id="borderRadiusValue">15px</span>
                            </div>
                            <div class="layout-control">
                                <label>Анимации</label>
                                <label class="switch">
                                    <input type="checkbox" id="enableAnimations" checked 
                                           onchange="visualEditor.toggleAnimations(this.checked)">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Presets Tab -->
                    <div class="editor-tab-content" id="presetsTab">
                        <h4>Готовые темы</h4>
                        <div class="theme-presets">
                            <div class="theme-preset" onclick="visualEditor.applyPreset('default')">
                                <div class="preset-colors">
                                    <span style="background: #ff6b35;"></span>
                                    <span style="background: #1a1a1a;"></span>
                                    <span style="background: #ffd700;"></span>
                                </div>
                                <span>Классическая</span>
                            </div>
                            <div class="theme-preset" onclick="visualEditor.applyPreset('ocean')">
                                <div class="preset-colors">
                                    <span style="background: #00b4d8;"></span>
                                    <span style="background: #0077b6;"></span>
                                    <span style="background: #90e0ef;"></span>
                                </div>
                                <span>Океан</span>
                            </div>
                            <div class="theme-preset" onclick="visualEditor.applyPreset('nature')">
                                <div class="preset-colors">
                                    <span style="background: #52b788;"></span>
                                    <span style="background: #2d6a4f;"></span>
                                    <span style="background: #95d5b2;"></span>
                                </div>
                                <span>Природа</span>
                            </div>
                            <div class="theme-preset" onclick="visualEditor.applyPreset('luxury')">
                                <div class="preset-colors">
                                    <span style="background: #d4af37;"></span>
                                    <span style="background: #1a1613;"></span>
                                    <span style="background: #ffd700;"></span>
                                </div>
                                <span>Люкс</span>
                            </div>
                            <div class="theme-preset" onclick="visualEditor.applyPreset('dark')">
                                <div class="preset-colors">
                                    <span style="background: #e74c3c;"></span>
                                    <span style="background: #000000;"></span>
                                    <span style="background: #ecf0f1;"></span>
                                </div>
                                <span>Темная</span>
                            </div>
                            <div class="theme-preset" onclick="visualEditor.applyPreset('purple')">
                                <div class="preset-colors">
                                    <span style="background: #9b59b6;"></span>
                                    <span style="background: #2c3e50;"></span>
                                    <span style="background: #e74c3c;"></span>
                                </div>
                                <span>Фиолетовая</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-secondary" onclick="visualEditor.resetTheme()">
                        <i class="fas fa-undo"></i> Сбросить
                    </button>
                    <button class="btn btn-success" onclick="visualEditor.saveTheme()">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                </div>
            </div>
            
            <button class="visual-editor-toggle" onclick="visualEditor.toggleEditor()">
                <i class="fas fa-paint-brush"></i>
            </button>
        `;

        // Добавляем редактор в body
        const editorContainer = document.createElement('div');
        editorContainer.innerHTML = editorHTML;
        document.body.appendChild(editorContainer);

        // Добавляем стили
        this.addEditorStyles();
    }

    toggleEditor() {
        const editor = document.getElementById('visualEditor');
        editor.classList.toggle('open');
    }

    showTab(tabName) {
        // Обновляем табы
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Обновляем контент
        document.querySelectorAll('.editor-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    initColorPickers() {
        Object.keys(this.currentTheme.colors).forEach(colorKey => {
            const picker = document.getElementById('color' + colorKey.charAt(0).toUpperCase() + colorKey.slice(1));
            if (picker) {
                picker.addEventListener('change', (e) => {
                    this.updateColor(colorKey, e.target.value);
                });
            }
        });
    }

    updateColor(colorKey, value) {
        this.currentTheme.colors[colorKey] = value;
        this.applyTheme();
        
        // Обновляем текстовое поле
        const textInput = event.target.nextElementSibling;
        if (textInput) {
            textInput.value = value;
        }
    }

    updateColorFromText(colorKey, value) {
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            this.currentTheme.colors[colorKey] = value;
            this.applyTheme();
            
            // Обновляем color picker
            const picker = document.getElementById('color' + colorKey.charAt(0).toUpperCase() + colorKey.slice(1));
            if (picker) {
                picker.value = value;
            }
        }
    }

    initFontControls() {
        // Устанавливаем текущие значения
        document.getElementById('fontPrimary').value = this.currentTheme.fonts.primary;
        document.getElementById('fontHeading').value = this.currentTheme.fonts.heading;
        
        // Размеры шрифтов
        const baseSizeValue = parseInt(this.currentTheme.fonts.size.base);
        document.getElementById('fontSize').value = baseSizeValue;
        document.getElementById('fontSizeValue').textContent = this.currentTheme.fonts.size.base;
    }

    updateFont(type, value) {
        this.currentTheme.fonts[type] = value;
        this.applyTheme();
        
        // Загружаем новый шрифт если нужно
        this.loadGoogleFont(value);
    }

    updateFontSize(type, value) {
        this.currentTheme.fonts.size[type] = value;
        document.getElementById('fontSize' + (type === 'base' ? '' : type.toUpperCase()) + 'Value').textContent = value;
        this.applyTheme();
    }

    initLayoutControls() {
        // Устанавливаем текущие значения
        const containerWidth = parseInt(this.currentTheme.layout.containerWidth);
        document.getElementById('containerWidth').value = containerWidth;
        document.getElementById('containerWidthValue').textContent = this.currentTheme.layout.containerWidth;
        
        const sectionPadding = parseFloat(this.currentTheme.layout.sectionPadding);
        document.getElementById('sectionPadding').value = sectionPadding;
        document.getElementById('sectionPaddingValue').textContent = this.currentTheme.layout.sectionPadding;
        
        const borderRadius = parseInt(this.currentTheme.layout.borderRadius);
        document.getElementById('borderRadius').value = borderRadius;
        document.getElementById('borderRadiusValue').textContent = this.currentTheme.layout.borderRadius;
    }

    updateLayout(property, value) {
        this.currentTheme.layout[property] = value;
        document.getElementById(property + 'Value').textContent = value;
        this.applyTheme();
    }

    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    applyPreset(presetName) {
        const presets = {
            default: {
                primary: '#ff6b35',
                secondary: '#1a1a1a',
                accent: '#ffd700',
                bgDark: '#0a0a0a',
                bgSection: '#1a1a1a',
                textLight: '#ffffff',
                textGray: '#a0a0a0'
            },
            ocean: {
                primary: '#00b4d8',
                secondary: '#0077b6',
                accent: '#90e0ef',
                bgDark: '#03045e',
                bgSection: '#0a1628',
                textLight: '#caf0f8',
                textGray: '#90e0ef'
            },
            nature: {
                primary: '#52b788',
                secondary: '#2d6a4f',
                accent: '#95d5b2',
                bgDark: '#081c15',
                bgSection: '#1b5e20',
                textLight: '#d8f3dc',
                textGray: '#b7e4c7'
            },
            luxury: {
                primary: '#d4af37',
                secondary: '#1a1613',
                accent: '#ffd700',
                bgDark: '#0a0908',
                bgSection: '#1a1613',
                textLight: '#f5f5dc',
                textGray: '#d4af37'
            },
            dark: {
                primary: '#e74c3c',
                secondary: '#000000',
                accent: '#ecf0f1',
                bgDark: '#000000',
                bgSection: '#1a1a1a',
                textLight: '#ecf0f1',
                textGray: '#95a5a6'
            },
            purple: {
                primary: '#9b59b6',
                secondary: '#2c3e50',
                accent: '#e74c3c',
                bgDark: '#1a1a2e',
                bgSection: '#2c3e50',
                textLight: '#ecf0f1',
                textGray: '#95a5a6'
            }
        };

        if (presets[presetName]) {
            Object.assign(this.currentTheme.colors, presets[presetName]);
            this.applyTheme();
            this.updateColorInputs();
        }
    }

    updateColorInputs() {
        Object.keys(this.currentTheme.colors).forEach(colorKey => {
            const picker = document.getElementById('color' + colorKey.charAt(0).toUpperCase() + colorKey.slice(1));
            if (picker) {
                picker.value = this.currentTheme.colors[colorKey];
                if (picker.nextElementSibling) {
                    picker.nextElementSibling.value = this.currentTheme.colors[colorKey];
                }
            }
        });
    }

    applyTheme() {
        const root = document.documentElement;
        
        // Применяем цвета
        Object.keys(this.currentTheme.colors).forEach(colorKey => {
            root.style.setProperty('--' + this.camelToKebab(colorKey), this.currentTheme.colors[colorKey]);
        });
        
        // Применяем шрифты
        root.style.setProperty('--font-primary', `'${this.currentTheme.fonts.primary}', sans-serif`);
        root.style.setProperty('--font-heading', `'${this.currentTheme.fonts.heading}', sans-serif`);
        
        // Применяем размеры шрифтов
        root.style.setProperty('--font-size-base', this.currentTheme.fonts.size.base);
        root.style.setProperty('--font-size-h1', this.currentTheme.fonts.size.h1);
        root.style.setProperty('--font-size-h2', this.currentTheme.fonts.size.h2);
        root.style.setProperty('--font-size-h3', this.currentTheme.fonts.size.h3);
        
        // Применяем макет
        root.style.setProperty('--container-width', this.currentTheme.layout.containerWidth);
        root.style.setProperty('--section-padding', this.currentTheme.layout.sectionPadding);
        root.style.setProperty('--border-radius', this.currentTheme.layout.borderRadius);
        
        // Обновляем градиент
        root.style.setProperty('--gradient', `linear-gradient(135deg, ${this.currentTheme.colors.primary}, ${this.darkenColor(this.currentTheme.colors.primary, 20)})`);
    }

    camelToKebab(str) {
        return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = ((num >> 8) & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
    }

    loadGoogleFont(fontName) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    saveTheme() {
        localStorage.setItem('massageTheme', JSON.stringify(this.currentTheme));
        this.showNotification('Тема успешно сохранена!', 'success');
    }

    resetTheme() {
        if (confirm('Сбросить все настройки темы?')) {
            this.applyPreset('default');
            this.currentTheme.fonts = {
                primary: 'Roboto',
                heading: 'Bebas Neue',
                size: { base: '16px', h1: '3rem', h2: '2.5rem', h3: '2rem' }
            };
            this.currentTheme.layout = {
                containerWidth: '1200px',
                sectionPadding: '5rem',
                borderRadius: '15px'
            };
            this.applyTheme();
            this.initFontControls();
            this.initLayoutControls();
            this.showNotification('Тема сброшена!', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `editor-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    addEditorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Visual Editor Panel */
            .visual-editor-panel {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                height: 100vh;
                background: var(--secondary);
                box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
                transition: right 0.3s ease;
                z-index: 10000;
                overflow-y: auto;
            }

            .visual-editor-panel.open {
                right: 0;
            }

            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border);
            }

            .editor-header h3 {
                margin: 0;
            }

            .editor-tabs {
                display: flex;
                border-bottom: 1px solid var(--border);
            }

            .editor-tab {
                flex: 1;
                padding: 1rem;
                background: none;
                border: none;
                color: var(--text-gray);
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }

            .editor-tab.active {
                color: var(--primary);
                border-bottom: 2px solid var(--primary);
            }

            .editor-tab:hover {
                color: var(--text-light);
            }

            .editor-content {
                padding: 1.5rem;
            }

            .editor-tab-content {
                display: none;
            }

            .editor-tab-content.active {
                display: block;
            }

            .editor-tab-content h4 {
                margin-bottom: 1.5rem;
                color: var(--text-light);
            }

            /* Color Controls */
            .color-controls,
            .font-controls,
            .layout-controls {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .color-control,
            .font-control,
            .layout-control {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .color-control label,
            .font-control label,
            .layout-control label {
                font-size: 0.9rem;
                color: var(--text-gray);
            }

            .color-input-group {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .color-input-group input[type="color"] {
                width: 50px;
                height: 35px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            .color-input-group input[type="text"],
            .font-control select,
            .layout-control input[type="range"] {
                flex: 1;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                border-radius: 5px;
                color: var(--text-light);
            }

            input[type="range"] {
                -webkit-appearance: none;
                height: 5px;
                background: var(--border);
                outline: none;
                opacity: 0.7;
                transition: opacity 0.2s;
            }

            input[type="range"]:hover {
                opacity: 1;
            }

            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 15px;
                height: 15px;
                background: var(--primary);
                cursor: pointer;
                border-radius: 50%;
            }

            /* Theme Presets */
            .theme-presets {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }

            .theme-preset {
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .theme-preset:hover {
                border-color: var(--primary);
                transform: translateY(-2px);
            }

            .preset-colors {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .preset-colors span {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            /* Toggle Button */
            .visual-editor-toggle {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background: var(--primary);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
                transition: all 0.3s ease;
                z-index: 9999;
            }

            .visual-editor-toggle:hover {
                transform: translateY(-50%) scale(1.1);
            }

            /* Switch */
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--border);
                transition: .4s;
                border-radius: 24px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: var(--primary);
            }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            /* Actions */
            .editor-actions {
                padding: 1.5rem;
                border-top: 1px solid var(--border);
                display: flex;
                gap: 1rem;
                position: sticky;
                bottom: 0;
                background: var(--secondary);
            }

            .editor-actions button {
                flex: 1;
            }

            /* Notifications */
            .editor-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                padding: 1rem 2rem;
                background: var(--secondary);
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transition: transform 0.3s ease;
                z-index: 10001;
            }

            .editor-notification.show {
                transform: translateX(-50%) translateY(0);
            }

            .editor-notification.success {
                background: var(--success);
            }

            .editor-notification.info {
                background: var(--primary);
            }

            /* No animations mode */
            body.no-animations * {
                animation: none !important;
                transition: none !important;
            }

            /* Update CSS variables usage */
            body {
                font-family: var(--font-primary, 'Roboto', sans-serif);
                font-size: var(--font-size-base, 16px);
            }

            h1, .hero-title {
                font-family: var(--font-heading, 'Bebas Neue', cursive);
                font-size: var(--font-size-h1, 3rem);
            }

            h2, .section-title {
                font-family: var(--font-heading, 'Bebas Neue', cursive);
                font-size: var(--font-size-h2, 2.5rem);
            }

            h3 {
                font-family: var(--font-heading, 'Bebas Neue', cursive);
                font-size: var(--font-size-h3, 2rem);
            }

            .container {
                max-width: var(--container-width, 1200px);
            }

            section {
                padding: var(--section-padding, 5rem) 0;
            }

            .card, .service-card, .booking-widget {
                border-radius: var(--border-radius, 15px);
            }

            @media (max-width: 768px) {
                .visual-editor-panel {
                    width: 100%;
                    right: -100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация только в админ-панели
if (window.location.pathname.includes('admin-panel.html')) {
    window.visualEditor = new VisualEditor();
}