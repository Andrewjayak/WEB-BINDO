// Library JavaScript
(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('aa_logged_in') === 'true';
    if (!isLoggedIn) {
        window.location.replace('auth.html');
        return;
    }
    
    // DOM elements
    const searchInput = document.getElementById('searchInput');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const categoryFilter = document.getElementById('categoryFilter');
    const libraryItems = document.querySelectorAll('.library-item');
    
    // Initialize library
    function initLibrary() {
        setupEventListeners();
        animateLibraryItems();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', handleSearch);
        
        // Filter tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => handleFilterTab(tab));
        });
        
        // Category filter
        categoryFilter.addEventListener('change', handleCategoryFilter);
        
        // Library item actions
        libraryItems.forEach(item => {
            const readBtn = item.querySelector('.btn-accent');
            const downloadBtn = item.querySelector('.btn-ghost');
            
            readBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                handleReadItem(item);
            });
            
            downloadBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                handleDownloadItem(item);
            });
        });
    }
    
    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        libraryItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('.item-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-match');
            } else {
                item.style.display = 'none';
                item.classList.remove('search-match');
            }
        });
    }
    
    // Handle filter tab
    function handleFilterTab(clickedTab) {
        // Remove active class from all tabs
        filterTabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
        
        // Get filter value
        const filterValue = clickedTab.getAttribute('data-filter');
        
        // Filter items
        filterItems(filterValue, categoryFilter.value);
    }
    
    // Handle category filter
    function handleCategoryFilter() {
        const activeTab = document.querySelector('.filter-tab.active');
        const filterValue = activeTab ? activeTab.getAttribute('data-filter') : 'all';
        
        filterItems(filterValue, categoryFilter.value);
    }
    
    // Filter items
    function filterItems(typeFilter, categoryFilter) {
        libraryItems.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemCategory = item.getAttribute('data-category');
            
            const typeMatch = typeFilter === 'all' || itemType === typeFilter;
            const categoryMatch = categoryFilter === 'all' || itemCategory === categoryFilter;
            
            if (typeMatch && categoryMatch) {
                item.style.display = 'block';
                item.classList.add('filter-match');
            } else {
                item.style.display = 'none';
                item.classList.remove('filter-match');
            }
        });
    }
    
    // Handle read item
    function handleReadItem(item) {
        const title = item.querySelector('h4').textContent;
        const type = item.getAttribute('data-type');
        
        // Show loading
        const btn = item.querySelector('.btn-accent');
        const originalText = btn.textContent;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;
        
        // Simulate loading
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Show success message
            showNotification(Membuka ..., 'success');
            
            // Redirect based on type
            if (type === 'quiz') {
                window.location.href = 'quiz.html';
            } else {
                // For other types, show a modal or redirect to viewer
                showItemViewer(item);
            }
        }, 1500);
    }
    
    // Handle download item
    function handleDownloadItem(item) {
        const title = item.querySelector('h4').textContent;
        
        // Show loading
        const btn = item.querySelector('.btn-ghost');
        const originalText = btn.textContent;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        btn.disabled = true;
        
        // Simulate download
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Show success message
            showNotification(${title} berhasil didownload!, 'success');
        }, 2000);
    }
    
    // Show item viewer
    function showItemViewer(item) {
        const title = item.querySelector('h4').textContent;
        const description = item.querySelector('.item-description').textContent;
        const image = item.querySelector('.item-image img').src;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = 
            <div class="modal-content">
                <div class="modal-header">
                    <h3></h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="" alt="" class="modal-image">
                    <p></p>
                    <div class="modal-actions">
                        <button class="btn btn-accent">Baca Sekarang</button>
                        <button class="btn btn-ghost">Download</button>
                    </div>
                </div>
            </div>
        ;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 
otification notification-;
        notification.innerHTML = 
            <i class="fas fa-"></i>
            <span></span>
        ;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Animate library items
    function animateLibraryItems() {
        libraryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('aa_logged_in');
        localStorage.removeItem('aa_user');
        window.location.replace('auth.html');
    });
    
    // Initialize when page loads
    initLibrary();
    
    console.log('Library system loaded successfully!');
})();
