// ===== PROFESSIONAL IMAGE MANAGEMENT SYSTEM =====
// Файл: assets/js/image-manager-pro.js

class ImageManagerPro {
    constructor() {
        this.categories = {
            profile: {
                name: 'Фото профиля',
                max: 1,
                dimensions: { width: 400, height: 400 },
                quality: 0.9,
                formats: ['image/jpeg', 'image/png', 'image/webp']
            },
            gallery: {
                name: 'Галерея работ',
                max: 12,
                dimensions: { width: 800, height: 600 },
                quality: 0.8,
                formats: ['image/jpeg', 'image/png', 'image/webp']
            },
            cabinet: {
                name: 'Фото кабинета',
                max: 6,
                dimensions: { width: 1200, height: 800 },
                quality: 0.85,
                formats: ['image/jpeg', 'image/png', 'image/webp']
            },
            certificates: {
                name: 'Сертификаты',
                max: 8,
                dimensions: { width: 1000, height: 1400 },
                quality: 0.9,
                formats: ['image/jpeg', 'image/png', 'image/webp']
            },
            logo: {
                name: 'Логотип',
                max: 1,
                dimensions: { width: 300, height: 120 },
                quality: 1.0,
                formats: ['image/png', 'image/svg+xml']
            },
            before_after: {
                name: 'До/После',
                max: 10,
                dimensions: { width: 800, height: 600 },
                quality: 0.8,
                formats: ['image/jpeg', 'image/png', 'image/webp']
            }
        };
        
        this.compressionWorker = null;
        this.init();
    }

    init() {
        // Загрузка сохраненных изображений
        this.loadSavedImages();
        
        // Добавление стилей
        this.addImageManagerStyles();
    }

    // Главная функция загрузки изображений
    async uploadImages(files, category, options = {}) {
        const results = [];
        const categoryConfig = this.categories[category];
        
        if (!categoryConfig) {
            throw new Error(`Неизвестная категория: ${category}`);
        }

        // Проверка лимитов
        const existingImages = this.getImagesForCategory(category);
        const totalAfterUpload = existingImages.length + files.length;
        
        if (totalAfterUpload > categoryConfig.max) {
            throw new Error(`Превышен лимит: максимум ${categoryConfig.max} изображений для категории "${categoryConfig.name}"`);
        }

        // Показ прогресса
        this.showUploadProgress();

        // Обработка каждого файла
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.updateProgress((i / files.length) * 100, `Обработка ${file.name}...`);
            
            try {
                const result = await this.processImage(file, category, options);
                results.push(result);
            } catch (error) {
                results.push({
                    filename: file.name,
                    success: false,
                    error: error.message
                });
            }
        }

        // Сохранение результатов
        await this.saveProcessedImages(results, category);
        
        // Скрытие прогресса
        this.hideUploadProgress();
        
        return results;
    }

    // Обработка одного изображения
    async processImage(file, category, options = {}) {
        const categoryConfig = this.categories[category];
        
        // Валидация файла
        this.validateImageFile(file, categoryConfig);
        
        // Получение метаданных
        const metadata = await this.extractImageMetadata(file);
        
        // Создание превью
        const thumbnail = await this.createThumbnail(file);
        
        // Оптимизация основного изображения
        const optimizedImage = await this.optimizeImage(
            file, 
            categoryConfig.dimensions, 
            categoryConfig.quality,
            options
        );
        
        // Создание водяного знака (если нужно)
        const watermarkedImage = options.addWatermark ? 
            await this.addWatermark(optimizedImage, options.watermarkText) : 
            optimizedImage;
        
        return {
            id: this.generateImageId(),
            filename: file.name,
            originalSize: file.size,
            optimizedSize: watermarkedImage.size,
            category,
            metadata,
            thumbnail: await this.blobToBase64(thumbnail),
            optimized: await this.blobToBase64(watermarkedImage),
            compressionRatio: ((file.size - watermarkedImage.size) / file.size * 100).toFixed(1),
            uploadedAt: new Date().toISOString(),
            success: true
        };
    }

    // Валидация файла изображения
    validateImageFile(file, categoryConfig) {
        // Проверка типа файла
        if (!categoryConfig.formats.includes(file.type)) {
            throw new Error(`Неподдерживаемый формат. Разрешены: ${categoryConfig.formats.join(', ')}`);
        }
        
        // Проверка размера файла (макс 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Файл слишком большой. Максимальный размер: 10MB');
        }
        
        // Проверка расширения
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
        const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        if (!validExtensions.includes(extension)) {
            throw new Error(`Недопустимое расширение файла: ${extension}`);
        }
    }

    // Оптимизация изображения
    async optimizeImage(file, targetDimensions, quality, options = {}) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Вычисление новых размеров с сохранением пропорций
                const { width: newWidth, height: newHeight } = this.calculateDimensions(
                    img.width, 
                    img.height, 
                    targetDimensions.width, 
                    targetDimensions.height,
                    options.cropMode || 'contain'
                );
                
                canvas.width = size;
                canvas.height = size;
                
                // Центрированная обрезка
                const { sx, sy, sWidth, sHeight } = this.calculateCropCoordinates(
                    img.width, img.height, size, size
                );
                
                ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);
                canvas.toBlob(resolve, 'image/jpeg', 0.7);
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Добавление водяного знака
    async addWatermark(imageBlob, watermarkText = 'MASSAGE PRO') {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Рисование основного изображения
                ctx.drawImage(img, 0, 0);
                
                // Настройка водяного знака
                const fontSize = Math.max(img.width / 30, 16);
                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                
                // Позиционирование в правом нижнем углу
                const x = img.width - 20;
                const y = img.height - 20;
                
                // Рисование текста с обводкой
                ctx.strokeText(watermarkText, x, y);
                ctx.fillText(watermarkText, x, y);
                
                canvas.toBlob(resolve, 'image/jpeg', 0.9);
            };
            
            img.src = URL.createObjectURL(imageBlob);
        });
    }

    // Извлечение метаданных изображения
    async extractImageMetadata(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    aspectRatio: (img.width / img.height).toFixed(2),
                    megapixels: ((img.width * img.height) / 1000000).toFixed(1),
                    fileSize: file.size,
                    fileType: file.type,
                    fileName: file.name,
                    lastModified: new Date(file.lastModified).toISOString()
                });
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // Применение фильтров к изображению
    applyImageFilters(ctx, filters) {
        let filterString = '';
        
        if (filters.brightness) filterString += `brightness(${filters.brightness}%) `;
        if (filters.contrast) filterString += `contrast(${filters.contrast}%) `;
        if (filters.saturation) filterString += `saturate(${filters.saturation}%) `;
        if (filters.hue) filterString += `hue-rotate(${filters.hue}deg) `;
        if (filters.blur) filterString += `blur(${filters.blur}px) `;
        if (filters.grayscale) filterString += `grayscale(${filters.grayscale}%) `;
        
        ctx.filter = filterString.trim() || 'none';
    }

    // Вычисление размеров с сохранением пропорций
    calculateDimensions(originalWidth, originalHeight, targetWidth, targetHeight, mode = 'contain') {
        const aspectRatio = originalWidth / originalHeight;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let newWidth, newHeight;
        
        switch (mode) {
            case 'cover':
                if (aspectRatio > targetAspectRatio) {
                    newWidth = targetHeight * aspectRatio;
                    newHeight = targetHeight;
                } else {
                    newWidth = targetWidth;
                    newHeight = targetWidth / aspectRatio;
                }
                break;
                
            case 'contain':
            default:
                if (aspectRatio > targetAspectRatio) {
                    newWidth = targetWidth;
                    newHeight = targetWidth / aspectRatio;
                } else {
                    newWidth = targetHeight * aspectRatio;
                    newHeight = targetHeight;
                }
                break;
        }
        
        return { width: Math.round(newWidth), height: Math.round(newHeight) };
    }

    // Вычисление координат для обрезки
    calculateCropCoordinates(originalWidth, originalHeight, targetWidth, targetHeight) {
        const aspectRatio = targetWidth / targetHeight;
        const originalAspectRatio = originalWidth / originalHeight;
        
        let sx, sy, sWidth, sHeight;
        
        if (originalAspectRatio > aspectRatio) {
            // Исходное изображение шире целевого
            sHeight = originalHeight;
            sWidth = originalHeight * aspectRatio;
            sx = (originalWidth - sWidth) / 2;
            sy = 0;
        } else {
            // Исходное изображение выше целевого
            sWidth = originalWidth;
            sHeight = originalWidth / aspectRatio;
            sx = 0;
            sy = (originalHeight - sHeight) / 2;
        }
        
        return { sx, sy, sWidth, sHeight };
    }

    // Получение изображений для категории
    getImagesForCategory(category) {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        return allImages[category] || [];
    }

    // Загрузка сохраненных изображений
    loadSavedImages() {
        try {
            const savedImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
            return savedImages;
        } catch (error) {
            console.error('Error loading saved images:', error);
            return {};
        }
    }

    // Сохранение обработанных изображений
    async saveProcessedImages(results, category) {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        
        if (!allImages[category]) {
            allImages[category] = [];
        }
        
        // Добавление успешно обработанных изображений
        const successfulResults = results.filter(r => r.success);
        allImages[category].push(...successfulResults);
        
        localStorage.setItem('massageImages', JSON.stringify(allImages));
        
        // Обновление основного сайта
        this.notifyMainSite(allImages);
    }

    // Удаление изображения
    removeImage(category, imageId) {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        
        if (allImages[category]) {
            allImages[category] = allImages[category].filter(img => img.id !== imageId);
            localStorage.setItem('massageImages', JSON.stringify(allImages));
            this.notifyMainSite(allImages);
        }
    }

    // Перемещение изображения между категориями
    moveImage(imageId, fromCategory, toCategory) {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        
        if (!allImages[fromCategory]) return;
        
        const imageIndex = allImages[fromCategory].findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;
        
        const image = allImages[fromCategory][imageIndex];
        
        // Проверка лимитов целевой категории
        if (!allImages[toCategory]) {
            allImages[toCategory] = [];
        }
        
        const toCategoryConfig = this.categories[toCategory];
        if (allImages[toCategory].length >= toCategoryConfig.max) {
            throw new Error(`Целевая категория "${toCategoryConfig.name}" заполнена`);
        }
        
        // Перемещение
        allImages[fromCategory].splice(imageIndex, 1);
        allImages[toCategory].push({ ...image, category: toCategory });
        
        localStorage.setItem('massageImages', JSON.stringify(allImages));
        this.notifyMainSite(allImages);
    }

    // Уведомление основного сайта об изменениях
    notifyMainSite(imageData) {
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'updateImages',
                images: imageData
            }, '*');
        }
    }

    // UI функции
    showUploadProgress() {
        let progressModal = document.getElementById('imageUploadProgress');
        if (!progressModal) {
            progressModal = document.createElement('div');
            progressModal.id = 'imageUploadProgress';
            progressModal.className = 'image-upload-progress';
            progressModal.innerHTML = `
                <div class="upload-progress-content">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3 id="uploadProgressTitle">Загрузка изображений...</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" id="uploadProgressFill"></div>
                    </div>
                    <div id="uploadProgressText">0%</div>
                    <div id="uploadProgressStatus"></div>
                </div>
            `;
            document.body.appendChild(progressModal);
        }
        progressModal.style.display = 'flex';
    }

    updateProgress(percent, status = '') {
        const progressFill = document.getElementById('uploadProgressFill');
        const progressText = document.getElementById('uploadProgressText');
        const progressStatus = document.getElementById('uploadProgressStatus');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${Math.round(percent)}%`;
        if (progressStatus && status) progressStatus.textContent = status;
    }

    hideUploadProgress() {
        const progressModal = document.getElementById('imageUploadProgress');
        if (progressModal) {
            setTimeout(() => {
                progressModal.style.display = 'none';
            }, 500);
        }
    }

    // Создание галереи изображений
    createImageGallery(images, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = images.map(image => `
            <div class="image-gallery-item" data-id="${image.id}">
                <img src="${image.thumbnail}" alt="${image.filename}" loading="lazy">
                <div class="image-overlay">
                    <button class="image-action-btn" onclick="imageManager.viewImage('${image.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="image-action-btn" onclick="imageManager.downloadImage('${image.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="image-action-btn danger" onclick="imageManager.deleteImage('${image.id}', '${image.category}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="image-info">
                    <span class="image-name">${image.filename}</span>
                    <span class="image-size">${this.formatFileSize(image.optimizedSize)}</span>
                </div>
            </div>
        `).join('');
    }

    // Просмотр изображения
    viewImage(imageId) {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        let foundImage = null;
        
        // Поиск изображения во всех категориях
        for (const category in allImages) {
            const image = allImages[category].find(img => img.id === imageId);
            if (image) {
                foundImage = image;
                break;
            }
        }
        
        if (!foundImage) return;
        
        // Создание модального окна просмотра
        const modal = document.createElement('div');
        modal.className = 'image-view-modal';
        modal.innerHTML = `
            <div class="image-view-content">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${foundImage.optimized}" alt="${foundImage.filename}">
                <div class="image-details">
                    <h3>${foundImage.filename}</h3>
                    <p>Размер: ${foundImage.metadata.width}x${foundImage.metadata.height}</p>
                    <p>Сжатие: ${foundImage.compressionRatio}%</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Удаление изображения с подтверждением
    deleteImage(imageId, category) {
        if (confirm('Удалить это изображение?')) {
            this.removeImage(category, imageId);
            
            // Обновление UI
            const element = document.querySelector(`[data-id="${imageId}"]`);
            if (element) {
                element.style.animation = 'fadeOutScale 0.3s ease-out';
                setTimeout(() => element.remove(), 300);
            }
            
            this.showSuccessToast('Изображение удалено');
        }
    }

    // Скачивание изображения
    downloadImage(imageId) {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        let foundImage = null;
        
        for (const category in allImages) {
            const image = allImages[category].find(img => img.id === imageId);
            if (image) {
                foundImage = image;
                break;
            }
        }
        
        if (!foundImage) return;
        
        // Конвертация base64 в blob и скачивание
        fetch(foundImage.optimized)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = foundImage.filename;
                a.click();
                URL.revokeObjectURL(url);
            });
    }

    // Массовые операции
    async bulkResize(category, newDimensions) {
        const images = this.getImagesForCategory(category);
        const results = [];
        
        this.showUploadProgress();
        
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            this.updateProgress((i / images.length) * 100, `Изменение размера ${image.filename}...`);
            
            try {
                // Конвертация base64 обратно в blob
                const blob = await this.base64ToBlob(image.optimized);
                const file = new File([blob], image.filename, { type: 'image/jpeg' });
                
                // Повторная оптимизация с новыми размерами
                const optimized = await this.optimizeImage(file, newDimensions, 0.8);
                
                // Обновление данных
                image.optimized = await this.blobToBase64(optimized);
                image.optimizedSize = optimized.size;
                image.lastResized = new Date().toISOString();
                
                results.push({ id: image.id, success: true });
            } catch (error) {
                results.push({ id: image.id, success: false, error: error.message });
            }
        }
        
        // Сохранение изменений
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        allImages[category] = images;
        localStorage.setItem('massageImages', JSON.stringify(allImages));
        
        this.hideUploadProgress();
        this.notifyMainSite(allImages);
        
        return results;
    }

    // Экспорт всех изображений
    async exportImages(format = 'json') {
        const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(allImages, null, 2)], { type: 'application/json' });
            this.downloadBlob(blob, `massage-images-export-${Date.now()}.json`);
        }
    }

    // Импорт изображений
    async importImages(file) {
        try {
            const text = await file.text();
            const importedImages = JSON.parse(text);
            
            // Валидация структуры
            if (typeof importedImages !== 'object') {
                throw new Error('Неверный формат файла');
            }
            
            // Сохранение
            localStorage.setItem('massageImages', JSON.stringify(importedImages));
            this.notifyMainSite(importedImages);
            
            this.showSuccessToast('Изображения успешно импортированы');
        } catch (error) {
            alert('Ошибка при импорте: ' + error.message);
        }
    }

    // Утилиты
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    base64ToBlob(base64) {
        return fetch(base64).then(res => res.blob());
    }

    generateImageId() {
        return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Добавление стилей
    addImageManagerStyles() {
        if (document.getElementById('image-manager-styles')) return;

        const style = document.createElement('style');
        style.id = 'image-manager-styles';
        style.textContent = `
            .image-upload-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }

            .upload-progress-content {
                background: var(--secondary-dark);
                border-radius: 20px;
                padding: 3rem;
                text-align: center;
                max-width: 400px;
                width: 90%;
            }

            .upload-icon {
                font-size: 3rem;
                color: var(--accent-orange);
                margin-bottom: 1rem;
                animation: pulse 2s ease-in-out infinite;
            }

            .progress-bar {
                width: 100%;
                height: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                overflow: hidden;
                margin: 1rem 0;
            }

            .progress-fill {
                height: 100%;
                background: var(--gradient-primary);
                width: 0%;
                transition: width 0.3s ease;
            }

            .image-gallery-item {
                position: relative;
                aspect-ratio: 1;
                border-radius: 10px;
                overflow: hidden;
                background: var(--gradient-glass);
                border: 1px solid var(--border-glass);
                transition: all 0.3s ease;
            }

            .image-gallery-item:hover {
                transform: translateY(-5px);
                box-shadow: var(--shadow-medium);
            }

            .image-gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .image-overlay {
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

            .image-gallery-item:hover .image-overlay {
                opacity: 1;
            }

            .image-action-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .image-action-btn:hover {
                background: var(--accent-orange);
                transform: scale(1.1);
            }

            .image-action-btn.danger:hover {
                background: var(--danger);
            }

            .image-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                padding: 0.5rem;
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
            }

            .image-view-modal {
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
                padding: 2rem;
            }

            .image-view-content {
                max-width: 90vw;
                max-height: 90vh;
                position: relative;
            }

            .image-view-content img {
                max-width: 100%;
                max-height: 80vh;
                border-radius: 10px;
            }

            .image-details {
                background: rgba(0, 0, 0, 0.8);
                padding: 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                color: white;
            }

            .modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem;
            }

            .success-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 10000;
            }

            .success-toast.show {
                transform: translateY(0);
                opacity: 1;
            }

            @keyframes fadeOutScale {
                to {
                    opacity: 0;
                    transform: scale(0.8);
                }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Экспорт
window.ImageManagerPro = ImageManagerPro;

// Глобальный экземпляр
window.imageManager = new ImageManagerPro();

console.log('🖼️ Image Manager Pro Loaded Successfully!'); = newWidth;
                canvas.height = newHeight;
                
                // Применение фильтров если нужно
                if (options.filters) {
                    this.applyImageFilters(ctx, options.filters);
                }
                
                // Улучшение качества изображения
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Рисование изображения
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                // Конвертация в blob
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Создание миниатюры
    async createThumbnail(file, size = 150) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width