// ===== IMAGE MANAGER PRO =====

class ImageManagerPro {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        this.compressionQuality = 0.8;
    }

    async uploadImage(file, category = 'general') {
        try {
            // Validate file
            if (!this.validateFile(file)) {
                throw new Error('Invalid file type or size');
            }

            // Compress image
            const compressedImage = await this.compressImage(file);
            
            // Convert to base64
            const base64 = await this.fileToBase64(compressedImage);
            
            // Save to localStorage
            this.saveImage(base64, category, file.name);
            
            return {
                success: true,
                data: base64,
                filename: file.name
            };
        } catch (error) {
            console.error('Image upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            alert('Разрешены только изображения форматов: JPG, PNG, WebP');
            return false;
        }
        
        if (file.size > this.maxFileSize) {
            alert('Размер файла не должен превышать 5MB');
            return false;
        }
        
        return true;
    }

    async compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions (max 1200px)
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 1200;
                    
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension;
                            width = maxDimension;
                        } else {
                            width = (width / height) * maxDimension;
                            height = maxDimension;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type, this.compressionQuality);
                };
                
                img.onerror = reject;
            };
            
            reader.onerror = reject;
        });
    }

    async fileToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    saveImage(base64, category, filename) {
        const images = JSON.parse(localStorage.getItem('massageImages') || '{}');
        
        if (!images[category]) {
            images[category] = [];
        }
        
        images[category].push({
            id: 'img_' + Date.now(),
            data: base64,
            filename: filename,
            uploadedAt: new Date().toISOString()
        });
        
        localStorage.setItem('massageImages', JSON.stringify(images));
    }

    getImages(category) {
        const images = JSON.parse(localStorage.getItem('massageImages') || '{}');
        return images[category] || [];
    }

    deleteImage(category, imageId) {
        const images = JSON.parse(localStorage.getItem('massageImages') || '{}');
        
        if (images[category]) {
            images[category] = images[category].filter(img => img.id !== imageId);
            localStorage.setItem('massageImages', JSON.stringify(images));
            return true;
        }
        
        return false;
    }

    createGalleryHTML(images, category) {
        if (!images || images.length === 0) {
            return '<p style="text-align: center; color: var(--text-gray);">Нет загруженных изображений</p>';
        }
        
        return images.map(img => `
            <div class="gallery-item" data-id="${img.id}">
                <img src="${img.data}" alt="${img.filename}">
                <div class="gallery-item-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteGalleryImage('${category}', '${img.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize global image manager
window.imageManager = new ImageManagerPro();

// Helper functions for admin panel
window.uploadProfileImage = async function(input) {
    if (input.files && input.files[0]) {
        const result = await window.imageManager.uploadImage(input.files[0], 'profile');
        
        if (result.success) {
            // Show preview
            const preview = document.getElementById('profileImagePreview');
            const img = document.getElementById('profileImagePreviewImg');
            img.src = result.data;
            preview.style.display = 'block';
            
            // Show success message
            showSuccessMessage('Фото профиля загружено!');
        }
    }
};

window.uploadGalleryImage = async function(input) {
    if (input.files && input.files[0]) {
        const result = await window.imageManager.uploadImage(input.files[0], 'gallery');
        
        if (result.success) {
            loadGalleryImages();
            showSuccessMessage('Изображение добавлено в галерею!');
        }
    }
};

window.deleteGalleryImage = function(category, imageId) {
    if (confirm('Удалить это изображение?')) {
        window.imageManager.deleteImage(category, imageId);
        
        if (category === 'gallery') {
            loadGalleryImages();
        } else if (category === 'profile') {
            document.getElementById('profileImagePreview').style.display = 'none';
        }
        
        showSuccessMessage('Изображение удалено!');
    }
};

window.loadGalleryImages = function() {
    const container = document.getElementById('galleryImages');
    if (container) {
        const images = window.imageManager.getImages('gallery');
        container.innerHTML = window.imageManager.createGalleryHTML(images, 'gallery');
    }
};

window.showSuccessMessage = function(message) {
    const successMsg = document.getElementById('imageSuccess') || document.getElementById('contentSuccess');
    if (successMsg) {
        successMsg.textContent = message;
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
};