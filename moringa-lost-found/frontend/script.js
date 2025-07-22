// Sample data for demonstration
const sampleItems = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "electronics",
        status: "found",
        description: "Black iPhone 13 Pro found near the cafeteria. Screen has minor scratches but fully functional.",
        location: "Cafeteria",
        date: "2024-01-15",
        contact: "found@moringaschool.com",
        image: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=iPhone+13+Pro"
    },
    {
        id: 2,
        name: "Student ID Card",
        category: "documents",
        status: "lost",
        description: "Lost my student ID card somewhere between the library and main building. Name: John Doe.",
        location: "Library to Main Building",
        date: "2024-01-14",
        contact: "john.doe@student.moringaschool.com",
        image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Student+ID"
    },
    {
        id: 3,
        name: "Black Backpack",
        category: "accessories",
        status: "found",
        description: "Black Jansport backpack with laptop compartment. Contains some textbooks and a water bottle.",
        location: "Gymnasium",
        date: "2024-01-13",
        contact: "security@moringaschool.com",
        image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Backpack"
    },
    {
        id: 4,
        name: "MacBook Air",
        category: "electronics",
        status: "lost",
        description: "Silver MacBook Air 2022 model. Has stickers on the back. Last seen in the study area.",
        location: "Study Area",
        date: "2024-01-12",
        contact: "jane.smith@student.moringaschool.com",
        image: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=MacBook+Air"
    },
    {
        id: 5,
        name: "Water Bottle",
        category: "accessories",
        status: "found",
        description: "Blue Hydro Flask water bottle with stickers. Found in the parking lot.",
        location: "Parking Lot",
        date: "2024-01-11",
        contact: "maintenance@moringaschool.com",
        image: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Water+Bottle"
    },
    {
        id: 6,
        name: "Textbook Set",
        category: "books",
        status: "lost",
        description: "Set of programming textbooks: JavaScript, Python, and Data Structures. In a blue bag.",
        location: "Classroom 205",
        date: "2024-01-10",
        contact: "mike.wilson@student.moringaschool.com",
        image: "https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Textbooks"
    }
];

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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayItems(sampleItems);
    setupEventListeners();
    setupMobileMenu();
});

// Event Listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);
    statusFilter.addEventListener('change', filterItems);
    dateFilter.addEventListener('change', filterItems);

    // Form submission
    reportForm.addEventListener('submit', handleReportSubmit);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === reportModal) {
            closeReportModal();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Display items in the grid
function displayItems(items) {
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
}

// Create individual item card
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const statusClass = item.status === 'lost' ? 'status-lost' : 'status-found';
    const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    
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
                    <span>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
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
}

// Filter items based on search criteria
function filterItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const date = dateFilter.value;

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
}

// Search button click handler
function searchItems() {
    filterItems();
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Modal functions
function showReportModal() {
    reportModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeReportModal() {
    reportModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    reportForm.reset();
}

// Handle report form submission
function handleReportSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(reportForm);
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
}

// Show message to user
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    // Insert at top of page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Scroll to search section
function scrollToSearch() {
    document.getElementById('search').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Load more items (pagination simulation)
function loadMoreItems() {
    const loadMoreBtn = document.querySelector('.load-more button');
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
}

// Update active navigation link based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add some interactive animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
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
}

// Initialize animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Handle image upload preview
document.getElementById('report-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create preview element
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

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && reportModal.style.display === 'block') {
        closeReportModal();
    }
});

// Add search input placeholder with keyboard shortcut hint
searchInput.placeholder = 'Search items... (Ctrl+K)';
