// ===== УНИВЕРСАЛЬНЫЙ ЗАГРУЗЧИК ИЗОБРАЖЕНИЙ =====

class UniversalImageUploader {
    constructor() {
        this.imageManager = window.imageManager || new ImageManagerPro();
        this.initStyles();
    }

    // Создаем загрузчик для любой секции
    createUploader(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const uploaderId = `uploader_${Date.now()}`;
        
        container.innerHTML = `
            <div class="universal-uploader" id="${uploaderId}">
                ${options.title ? `<h4>${options.title}</h4>` : ''}
                
                <div class="upload-zone" ondrop="universalUploader.handleDrop(event, '${uploaderId}', '${options.category}')" 
                     ondragover="universalUploader.handleDragOver(event)"
                     ondragleave="universalUploader.handleDragLeave(event)">
                    <input type="file" id="file_${uploaderId}" 
                           accept="image/*" ${options.multiple ? 'multiple' : ''} 
                           onchange="universalUploader.handleFileSelect(this, '${uploaderId}', '${options.category}')"
                           style="display: none;">
                    
                    <div class="upload-content" onclick="document.getElementById('file_${uploaderId}').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p class="main-text">Перетащите изображения сюда</p>
                        <p class="sub-text">или нажмите для выбора</p>
                        <div class="upload-info">
                            <span><i class="fas fa-info-circle"></i> Максимум: ${this.formatFileSize(this.imageManager.maxFileSize)}</span>
                            <span>Форматы: JPG, PNG, WebP, GIF</span>
                        </div>
                    </div>
                </div>

                <div class="upload-preview" id="preview_${uploaderId}" style="display: none;">
                    <!-- Превью загруженных изображений -->
                </div>

                ${options.showGallery ? `
                <div class="uploaded-gallery" id="gallery_${uploaderId}">
                    ${this.renderGallery(options.category)}
                </div>` : ''}
            </div>
        `;

        // Сохраняем настройки для этого загрузчика
        this.uploaders = this.uploaders || {};
        this.uploaders[uploaderId] = {
            category: options.category || 'general',
            onUpload: options.onUpload,
            multiple: options.multiple || false,
            maxFiles: options.maxFiles || 10,
            container: containerId
        };
    }

    // Обработка перетаскивания
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    async handleDrop(e, uploaderId, category) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        await this.processFiles(files, uploaderId, category);
    }

    // Обработка выбора файлов
    async handleFileSelect(input, uploaderId, category) {
        const files = Array.from(input.files);
        await this.processFiles(files, uploaderId, category);
    }

    // Обработка файлов
    async processFiles(files, uploaderId, category) {
        const settings = this.uploaders[uploaderId];
        const preview = document.getElementById(`preview_${uploaderId}`);
        
        // Фильтруем только изображения
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showNotification('Выберите изображения', 'error');
            return;
        }

        // Проверяем лимит файлов
        if (!settings.multiple && imageFiles.length > 1) {
            imageFiles.length = 1;
        }

        preview.style.display = 'block';
        preview.innerHTML = '<div class="upload-progress">Загрузка...</div>';

        const results = [];
        for (const file of imageFiles) {
            const previewItem = this.createPreviewItem(file);
            preview.appendChild(previewItem);

            try {
                const result = await this.imageManager.uploadImage(file, category);
                if (result.success) {
                    previewItem.classList.add('success');
                    results.push(result);
                    
                    // Callback после успешной загрузки
                    if (settings.onUpload) {
                        settings.onUpload(result);
                    }
                } else {
                    previewItem.classList.add('error');
                    previewItem.querySelector('.status').textContent = result.error;
                }
            } catch (error) {
                previewItem.classList.add('error');
                previewItem.querySelector('.status').textContent = 'Ошибка загрузки';
            }
        }

        // Обновляем галерею
        if (settings.showGallery) {
            this.updateGallery(uploaderId, category);
        }

        // Очищаем превью через 3 секунды
        setTimeout(() => {
            preview.style.display = 'none';
            preview.innerHTML = '';
        }, 3000);

        this.showNotification(`Загружено ${results.length} из ${imageFiles.length} файлов`, 'success');
    }

    // Создание превью элемента
    createPreviewItem(file) {
        const item = document.createElement('div');
        item.className = 'preview-item';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            item.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <div class="preview-info">
                    <span class="filename">${file.name}</span>
                    <span class="filesize">${this.formatFileSize(file.size)}</span>
                    <span class="status">Загрузка...</span>
                </div>
                <div class="preview-progress"></div>
            `;
        };
        reader.readAsDataURL(file);
        
        return item;
    }

    // Рендер галереи
    renderGallery(category) {
        const images = this.imageManager.getImages(category);
        if (!images || images.length === 0) {
            return '<p class="no-images">Нет загруженных изображений</p>';
        }

        return `
            <div class="image-grid">
                ${images.map(img => `
                    <div class="image-item" data-id="${img.id}">
                        <img src="${img.data}" alt="${img.filename}">
                        <div class="image-actions">
                            <button onclick="universalUploader.setAsPrimary('${category}', '${img.id}')" 
                                    title="Сделать основным">
                                <i class="fas fa-star"></i>
                            </button>
                            <button onclick="universalUploader.deleteImage('${category}', '${img.id}')" 
                                    title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="image-info">
                            <span>${img.filename}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Обновление галереи
    updateGallery(uploaderId, category) {
        const gallery = document.getElementById(`gallery_${uploaderId}`);
        if (gallery) {
            gallery.innerHTML = this.renderGallery(category);
        }
    }

    // Установка основного изображения
    setAsPrimary(category, imageId) {
        const images = this.imageManager.getImages(category);
        
        // Сначала убираем primary у всех
        images.forEach(img => img.primary = false);
        
        // Устанавливаем primary для выбранного
        const image = images.find(img => img.id === imageId);
        if (image) {
            image.primary = true;
            
            // Сохраняем изменения
            const allImages = JSON.parse(localStorage.getItem('massageImages') || '{}');
            allImages[category] = images;
            localStorage.setItem('massageImages', JSON.stringify(allImages));
            
            this.showNotification('Основное изображение установлено', 'success');
            
            // Обновляем все галереи этой категории
            Object.keys(this.uploaders).forEach(uploaderId => {
                if (this.uploaders[uploaderId].category === category) {
                    this.updateGallery(uploaderId, category);
                }
            });
        }
    }

    // Удаление изображения
    deleteImage(category, imageId) {
        if (confirm('Удалить это изображение?')) {
            this.imageManager.deleteImage(category, imageId);
            
            // Обновляем все галереи этой категории
            Object.keys(this.uploaders).forEach(uploaderId => {
                if (this.uploaders[uploaderId].category === category) {
                    this.updateGallery(uploaderId, category);
                }
            });
            
            this.showNotification('Изображение удалено', 'success');
        }
    }

    // Форматирование размера файла
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Уведомления
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `upload-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

    // Добавление стилей
    initStyles() {
        if (document.getElementById('universal-uploader-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'universal-uploader-styles';
        style.textContent = `
            .universal-uploader {
                margin: 1rem 0;
            }

            .upload-zone {
                border: 2px dashed var(--border);
                border-radius: 10px;
                padding: 2rem;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
                background: rgba(255, 255, 255, 0.02);
            }

            .upload-zone:hover {
                border-color: var(--primary);
                background: rgba(255, 107, 53, 0.05);
            }

            .upload-zone.drag-over {
                border-color: var(--primary);
                background: rgba(255, 107, 53, 0.1);
                transform: scale(1.02);
            }

            .upload-content i {
                font-size: 3rem;
                color: var(--primary);
                margin-bottom: 1rem;
            }

            .upload-content .main-text {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .upload-content .sub-text {
                color: var(--text-gray);
                margin-bottom: 1rem;
            }

            .upload-info {
                display: flex;
                gap: 2rem;
                justify-content: center;
                font-size: 0.85rem;
                color: var(--text-gray);
            }

            .upload-preview {
                margin-top: 1rem;
            }

            .preview-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                position: relative;
                overflow: hidden;
            }

            .preview-item img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 4px;
            }

            .preview-info {
                flex: 1;
            }

            .preview-info span {
                display: block;
                font-size: 0.85rem;
            }

            .preview-info .filename {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }

            .preview-info .filesize {
                color: var(--text-gray);
            }

            .preview-info .status {
                color: var(--primary);
                margin-top: 0.25rem;
            }

            .preview-item.success .status {
                color: #10b981;
            }

            .preview-item.error .status {
                color: #ef4444;
            }

            .preview-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--primary);
                width: 0;
                transition: width 0.3s ease;
            }

            .preview-item.success .preview-progress {
                width: 100%;
                background: #10b981;
            }

            .image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .image-item {
                position: relative;
                aspect-ratio: 1;
                border-radius: 8px;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.05);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .image-item:hover {
                transform: scale(1.05);
            }

            .image-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .image-actions {
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                gap: 0.5rem;
                padding: 0.5rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-item:hover .image-actions {
                opacity: 1;
            }

            .image-actions button {
                background: rgba(0, 0, 0, 0.8);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .image-actions button:hover {
                background: var(--primary);
            }

            .image-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 0.5rem;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                font-size: 0.75rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-item:hover .image-info {
                opacity: 1;
            }

            .no-images {
                text-align: center;
                color: var(--text-gray);
                padding: 2rem;
            }

            .upload-notification {
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
            }

            .upload-notification.show {
                transform: translateX(0);
            }

            .upload-notification.success {
                background: #10b981;
            }

            .upload-notification.error {
                background: #ef4444;
            }

            .upload-notification i {
                font-size: 1.2rem;
            }

            @media (max-width: 768px) {
                .image-grid {
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                }
                
                .upload-notification {
                    left: 20px;
                    right: 20px;
                    transform: translateY(-100px);
                }
                
                .upload-notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация
window.universalUploader = new UniversalImageUploader();