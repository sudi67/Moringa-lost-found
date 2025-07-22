// UI Module - Handles all UI interactions and rendering

import { sampleItems, formatDate, getStatusClass, capitalizeFirst } from './data.js';

// DOM Elements
const itemsGrid = document.getElementById('items-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');
const dateFilter = document.getElementById('date-filter');
const reportModal = document.getElementById('report-modal');
const reportForm = document.getElementById('report-form');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Initialize UI
export const initUI = () => {
    displayItems(sampleItems);
    setupEventListeners();
    setupMobileMenu();
    addScrollAnimations();
    updateActiveNav();
};

// Display items in the grid
export const displayItems = (items) => {
    if (!itemsGrid) return;
    
    itemsGrid.innerHTML = '';
    
    if (items.length === 0) {
        itemsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>No items found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });
};

// Create individual item card
const createItemCard = (item) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const statusClass = getStatusClass(item.status);
    const statusText = capitalizeFirst(item.status);
    
    card.innerHTML = `
        <div class="item-image">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="item-content">
            <div class="item-header">
                <h3 class="item-title">${item.name}</h3>
                <span class="item-status ${statusClass}">${statusText}</span>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-details">
                <div class="item-detail">
                    <span>Category:</span>
                    <span>${capitalizeFirst(item.category)}</span>
                </div>
                <div class="item-detail">
                    <span>Location:</span>
                    <span>${item.location}</span>
                </div>
                <div class="item-detail">
                    <span>Date:</span>
                    <span>${formatDate(item.date)}</span>
                </div>
                <div class="item-detail">
                    <span>Contact:</span>
                    <span>${item.contact}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
};

// Setup event listeners
const setupEventListeners = () => {
    // Search functionality
    if (searchInput) searchInput.addEventListener('input', filterItems);
    if (categoryFilter) categoryFilter.addEventListener('change', filterItems);
    if (statusFilter) statusFilter.addEventListener('change', filterItems);
    if (dateFilter) dateFilter.addEventListener('change', filterItems);

    // Form submission
    if (reportForm) reportForm.addEventListener('submit', handleReportSubmit);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === reportModal) {
            closeReportModal();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Setup mobile menu
const setupMobileMenu = () => {
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
};

// Filter items based on search criteria
export const filterItems = () => {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const category = categoryFilter?.value || '';
    const status = statusFilter?.value || '';
    const date = dateFilter?.value || '';

    const filteredItems = sampleItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.description.toLowerCase().includes(searchTerm) ||
                            item.location.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || item.category === category;
        const matchesStatus = !status || item.status === status;
        const matchesDate = !date || item.date === date;

        return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });

    displayItems(filteredItems);
};

// Show message to user
export const showMessage = (text, type = 'info') => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    // Insert at top of page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
};

// Modal functions
export const showReportModal = () => {
    if (!reportModal) return;
    reportModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

export const closeReportModal = () => {
    if (!reportModal) return;
    reportModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (reportForm) reportForm.reset();
};

// Handle report form submission
const handleReportSubmit = (e) => {
    e.preventDefault();
    
    // Get form data
    const reportData = {
        type: document.getElementById('report-type').value,
        category: document.getElementById('report-category').value,
        name: document.getElementById('report-name').value,
        description: document.getElementById('report-description').value,
        location: document.getElementById('report-location').value,
        date: document.getElementById('report-date').value,
        email: document.getElementById('report-email').value,
        phone: document.getElementById('report-phone').value
    };

    // Show loading state
    const submitBtn = reportForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Add new item to the list
        const newItem = {
            id: sampleItems.length + 1,
            name: reportData.name,
            category: reportData.category,
            status: reportData.type,
            description: reportData.description,
            location: reportData.location,
            date: reportData.date,
            contact: reportData.email,
            image: `https://via.placeholder.com/300x200/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${encodeURIComponent(reportData.name)}`
        };
        
        sampleItems.unshift(newItem);
        displayItems(sampleItems);
        
        // Reset form and close modal
        reportForm.reset();
        closeReportModal();
        
        // Show success message
        showMessage('Report submitted successfully!', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
};

// Scroll to search section
export const scrollToSearch = () => {
    const searchSection = document.getElementById('search');
    if (searchSection) {
        searchSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Load more items (pagination simulation)
export const loadMoreItems = () => {
    const loadMoreBtn = document.querySelector('.load-more button');
    if (!loadMoreBtn) return;
    
    const originalText = loadMoreBtn.innerHTML;
    
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more items
    setTimeout(() => {
        // Add duplicate items for demonstration
        const moreItems = sampleItems.map(item => ({
            ...item,
            id: item.id + 100,
            name: `${item.name} (More)`,
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));
        
        sampleItems.push(...moreItems);
        displayItems(sampleItems);
        
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.disabled = false;
        
        showMessage('More items loaded!', 'success');
    }, 1000);
};

// Add scroll animations
const addScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.item-card, .stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
};

// Update active navigation link based on scroll position
export const updateActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};
