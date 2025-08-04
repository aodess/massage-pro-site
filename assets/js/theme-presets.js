// ===== THEME PRESETS =====

class ThemeManager {
    constructor() {
        this.themes = {
            default: {
                name: 'Классическая',
                colors: {
                    primary: '#ff6b35',
                    secondary: '#1a1a1a',
                    accent: '#ffd700',
                    bgDark: '#0a0a0a',
                    textLight: '#ffffff',
                    textGray: '#a0a0a0'
                }
            },
            ocean: {
                name: 'Океан',
                colors: {
                    primary: '#00b4d8',
                    secondary: '#0077b6',
                    accent: '#90e0ef',
                    bgDark: '#03045e',
                    textLight: '#caf0f8',
                    textGray: '#90e0ef'
                }
            },
            nature: {
                name: 'Природа',
                colors: {
                    primary: '#52b788',
                    secondary: '#2d6a4f',
                    accent: '#95d5b2',
                    bgDark: '#1b5e20',
                    textLight: '#d8f3dc',
                    textGray: '#b7e4c7'
                }
            },
            luxury: {
                name: 'Люкс',
                colors: {
                    primary: '#d4af37',
                    secondary: '#b8860b',
                    accent: '#ffd700',
                    bgDark: '#1a1613',
                    textLight: '#f5f5dc',
                    textGray: '#d4af37'
                }
            }
        };
        
        this.currentTheme = this.loadCurrentTheme();
        this.applyTheme(this.currentTheme);
    }

    loadCurrentTheme() {
        return localStorage.getItem('massageTheme') || 'default';
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        Object.keys(theme.colors).forEach(key => {
            const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(cssVar, theme.colors[key]);
        });
        
        // Update gradient
        root.style.setProperty('--gradient', `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`);
        
        this.currentTheme = themeName;
        localStorage.setItem('massageTheme', themeName);
    }

    getThemesList() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            name: this.themes[key].name,
            colors: this.themes[key].colors,
            active: key === this.currentTheme
        }));
    }
}

// Initialize theme manager
window.themeManager = new ThemeManager();