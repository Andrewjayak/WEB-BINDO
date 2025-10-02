// Calendar JavaScript
(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('aa_logged_in') === 'true';
    if (!isLoggedIn) {
        window.location.replace('auth.html');
        return;
    }
    
    // Calendar data
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // DOM elements
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Sample events data
    const eventsData = {
        '2024-01-15': [
            { title: 'Matematika SMA', time: '16:00', type: 'class', room: 'Ruang A' }
        ],
        '2024-01-16': [
            { title: 'Fisika SMA', time: '16:00', type: 'class', room: 'Ruang B' }
        ],
        '2024-01-17': [
            { title: 'Quiz Matematika', time: '18:00', type: 'quiz', room: 'Online' }
        ],
        '2024-01-20': [
            { title: 'Ujian Tengah Semester', time: '08:00', type: 'exam', room: 'Ruang Ujian' }
        ]
    };
    
    // Month names
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    // Day names
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    // Initialize calendar
    function initCalendar() {
        setupEventListeners();
        renderCalendar();
        setupTabs();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    // Setup tabs
    function setupTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Render calendar
    function renderCalendar() {
        // Update month display
        currentMonthElement.textContent = monthNames[currentMonth] + ' ' + currentYear;
        
        // Clear calendar days
        calendarDays.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Check if this day has events
            const dateString = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
            const events = eventsData[dateString];
            
            if (events) {
                dayElement.classList.add('has-events');
                dayElement.innerHTML = '<span class="day-number">' + day + '</span><div class="day-events"></div>';
                
                // Add click event to show event details
                dayElement.addEventListener('click', () => showEventDetails(dateString, events));
            }
            
            // Highlight today
            const today = new Date();
            if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Show event details
    function showEventDetails(dateString, events) {
        const date = new Date(dateString);
        const formattedDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = '<div class="modal-content"><div class="modal-header"><h3>Jadwal ' + formattedDate + '</h3><button class="modal-close">&times;</button></div><div class="modal-body"></div></div>';
        
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
    
    // Handle logout
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('aa_logged_in');
        localStorage.removeItem('aa_user');
        window.location.replace('auth.html');
    });
    
    // Initialize when page loads
    initCalendar();
    
    console.log('Calendar system loaded successfully!');
})();
