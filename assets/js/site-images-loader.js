// ===== SITE IMAGES LOADER =====

class SiteImagesLoader {
    constructor() {
        this.images = this.loadAllImages();
        this.init();
    }

    loadAllImages() {
        return JSON.parse(localStorage.getItem('massageImages') || '{}');
    }

    init() {
        // Загружаем изображения при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            this.applyHeroBackground();
            this.applyLogo();
            this.applySectionBackgrounds();
            this.loadCertificates();
            this.loadInteriorGallery();
            this.applyProfileImage();
        });
    }

    // Применяем фон главной страницы
    applyHeroBackground() {
        const heroImages = this.images.hero || [];
        const primaryImage = heroImages.find(img => img.primary) || heroImages[0];
        
        if (primaryImage) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                // ИСПРАВЛЕНО: Используем правильное поле данных
                const imageData = primaryImage.data || primaryImage.optimized;
                
                // Создаем стиль с фоновым изображением
                const style = document.createElement('style');
                style.textContent = `
                    .hero {
                        position: relative;
                        background-image: linear-gradient(rgba(10, 10, 10, 0.7), rgba(26, 26, 26, 0.8)), 
                                          url('${imageData}');
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                    }
                    
                    @media (max-width: 768px) {
                        .hero {
                            background-attachment: scroll;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Применяем логотип
    applyLogo() {
        const logoImages = this.images.logo || [];
        const primaryLogo = logoImages.find(img => img.primary) || logoImages[0];
        
        if (primaryLogo) {
            // Находим все элементы с логотипом
            const logoElements = document.querySelectorAll('.logo-text');
            logoElements.forEach(element => {
                // ИСПРАВЛЕНО: Используем правильное поле данных
                const imageData = primaryLogo.data || primaryLogo.optimized;
                
                // Заменяем текст на изображение
                element.innerHTML = `<img src="${imageData}" alt="Logo" style="height: 40px; width: auto;">`;
            });
        }
    }

    // Применяем фоны секций
    applySectionBackgrounds() {
        const sectionImages = this.images.sections || [];
        
        // Маппинг секций к классам
        const sectionMapping = {
            'services': '.services',
            'about': '.about',
            'booking': '.booking',
            'contact': '.contact'
        };

        sectionImages.forEach(img => {
            // ИСПРАВЛЕНО: Используем правильное поле данных
            const imageData = img.data || img.optimized;
            
            // Ищем в имени файла название секции
            const filename = img.filename.toLowerCase();
            Object.keys(sectionMapping).forEach(sectionName => {
                if (filename.includes(sectionName)) {
                    const section = document.querySelector(sectionMapping[sectionName]);
                    if (section) {
                        section.style.backgroundImage = `linear-gradient(rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.95)), url('${imageData}')`;
                        section.style.backgroundSize = 'cover';
                        section.style.backgroundPosition = 'center';
                        section.style.backgroundAttachment = 'fixed';
                    }
                }
            });
        });
    }

    // Загружаем сертификаты
    loadCertificates() {
        const certificates = this.images.certificates || [];
        
        if (certificates.length > 0) {
            // Находим секцию "Обо мне"
            const aboutSection = document.querySelector('.about-content');
            
            if (aboutSection) {
                // Создаем блок для сертификатов
                const certificatesBlock = document.createElement('div');
                certificatesBlock.className = 'certificates-gallery';
                certificatesBlock.innerHTML = `
                    <h3 style="text-align: center; margin: 3rem 0 2rem; grid-column: 1/-1;">Сертификаты и дипломы</h3>
                    <div class="certificates-grid">
                        ${certificates.map(cert => {
                            // ИСПРАВЛЕНО: Используем правильное поле данных
                            const imageData = cert.data || cert.optimized;
                            return `
                                <div class="certificate-item" onclick="siteImagesLoader.showCertificate('${cert.id}')">
                                    <img src="${imageData}" alt="${cert.filename}">
                                    <div class="certificate-overlay">
                                        <i class="fas fa-search-plus"></i>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                
                // Добавляем после about-content
                aboutSection.parentNode.insertBefore(certificatesBlock, aboutSection.nextSibling);
                
                // Добавляем стили
                this.addCertificatesStyles();
            }
        }
    }

    // Загружаем галерею интерьера
    loadInteriorGallery() {
        const interiorImages = this.images.interior || [];
        
        if (interiorImages.length > 0) {
            // Находим секцию контактов
            const contactSection = document.querySelector('#contact');
            
            if (contactSection) {
                // Создаем галерею
                const galleryBlock = document.createElement('div');
                galleryBlock.className = 'interior-gallery-section';
                galleryBlock.innerHTML = `
                    <div class="container">
                        <h3 class="section-title" style="margin-bottom: 2rem;">Наш кабинет</h3>
                        <div class="interior-gallery">
                            ${interiorImages.map((img, index) => {
                                // ИСПРАВЛЕНО: Используем правильное поле данных
                                const imageData = img.data || img.optimized;
                                return `
                                    <div class="interior-item ${index === 0 ? 'large' : ''}" 
                                         onclick="siteImagesLoader.showInteriorImage('${img.id}')">
                                        <img src="${imageData}" alt="${img.filename}">
                                        <div class="interior-overlay">
                                            <i class="fas fa-expand"></i>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
                
                // Вставляем перед секцией контактов
                contactSection.parentNode.insertBefore(galleryBlock, contactSection);
                
                // Добавляем стили
                this.addInteriorStyles();
            }
        }
    }

    // Применяем фото профиля
    applyProfileImage() {
        const profileImages = this.images.profile || [];
        const primaryImage = profileImages.find(img => img.primary) || profileImages[0];
        
        if (primaryImage) {
            const profileImg = document.getElementById('profileImage');
            const placeholder = document.getElementById('profilePlaceholder');
            
            if (profileImg && placeholder) {
                // ИСПРАВЛЕНО: Используем правильное поле данных
                const imageData = primaryImage.data || primaryImage.optimized;
                
                profileImg.src = imageData;
                profileImg.style.display = 'block';
                placeholder.style.display = 'none';
            }
        }
    }

    // Показ сертификата в модальном окне
    showCertificate(imageId) {
        const certificates = this.images.certificates || [];
        const certificate = certificates.find(img => img.id === imageId);
        
        if (certificate) {
            // ИСПРАВЛЕНО: Используем правильное поле данных
            const imageData = certificate.data || certificate.optimized;
            this.showImageModal(imageData, certificate.filename);
        }
    }

    // Показ изображения интерьера
    showInteriorImage(imageId) {
        const interiorImages = this.images.interior || [];
        const image = interiorImages.find(img => img.id === imageId);
        
        if (image) {
            // ИСПРАВЛЕНО: Используем правильное поле данных
            const imageData = image.data || image.optimized;
            this.showImageModal(imageData, image.filename);
        }
    }

    // Модальное окно для изображений
    showImageModal(imageSrc, imageAlt) {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="image-modal-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </span>
                <img src="${imageSrc}" alt="${imageAlt}">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Закрытие по клику на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Анимация появления
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Стили для сертификатов
    addCertificatesStyles() {
        if (document.getElementById('certificates-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'certificates-styles';
        style.textContent = `
            .certificates-gallery {
                padding: 3rem 0;
            }

            .certificates-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .certificate-item {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.05);
                aspect-ratio: 3/4;
            }

            .certificate-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
            }

            .certificate-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .certificate-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 107, 53, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .certificate-item:hover .certificate-overlay {
                opacity: 1;
            }

            .certificate-overlay i {
                font-size: 2rem;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    // Стили для галереи интерьера
    addInteriorStyles() {
        if (document.getElementById('interior-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'interior-styles';
        style.textContent = `
            .interior-gallery-section {
                padding: 5rem 0;
                background: var(--bg-section);
            }

            .interior-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                grid-auto-flow: dense;
            }

            .interior-item {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                aspect-ratio: 1;
            }

            .interior-item.large {
                grid-column: span 2;
                grid-row: span 2;
            }

            .interior-item:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .interior-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .interior-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .interior-item:hover .interior-overlay {
                opacity: 1;
            }

            .interior-overlay i {
                font-size: 2rem;
                color: white;
            }

            /* Модальное окно */
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 2rem;
            }

            .image-modal.show {
                opacity: 1;
            }

            .image-modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            }

            .image-modal-content img {
                max-width: 100%;
                max-height: 90vh;
                border-radius: 10px;
            }

            .image-modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                transition: color 0.3s ease;
            }

            .image-modal-close:hover {
                color: var(--primary);
            }

            @media (max-width: 768px) {
                .interior-item.large {
                    grid-column: span 1;
                    grid-row: span 1;
                }
                
                .certificates-grid {
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация
window.siteImagesLoader = new SiteImagesLoader();
