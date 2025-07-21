// Main application entry point
// This file uses ES6 modules and should be loaded with type="module"

import { initUI, showReportModal, closeReportModal, scrollToSearch, loadMoreItems, updateActiveNav } from './ui.js';

// Global functions for HTML onclick handlers
window.showReportModal = showReportModal;
window.closeReportModal = closeReportModal;
window.scrollToSearch = scrollToSearch;
window.loadMoreItems = loadMoreItems;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.focus();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('report-modal');
            if (modal && modal.style.display === 'block') {
                closeReportModal();
            }
        }
    });

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);

    // Handle image upload preview
    const imageInput = document.getElementById('report-image');
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let preview = document.getElementById('image-preview');
                    if (!preview) {
                        preview = document.createElement('img');
                        preview.id = 'image-preview';
                        preview.style.maxWidth = '100%';
                        preview.style.maxHeight = '200px';
                        preview.style.marginTop = '10px';
                        preview.style.borderRadius = '8px';
                        e.target.parentNode.appendChild(preview);
                    }
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
