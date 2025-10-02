// Progress Tracking JavaScript
(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('aa_logged_in') === 'true';
    if (!isLoggedIn) {
        window.location.replace('auth.html');
        return;
    }
    
    // DOM elements
    const progressOverview = document.querySelector('.progress-overview');
    const subjectProgress = document.querySelector('.subject-progress');
    const quizHistory = document.querySelector('.quiz-history');
    const goalsGrid = document.querySelector('.goals-grid');
    
    // Sample progress data
    const progressData = {
        totalHours: 24,
        totalQuizzes: 8,
        averageScore: 85,
        subjects: [
            { name: 'Matematika SMA', progress: 80, color: '#2563eb' },
            { name: 'Fisika SMA', progress: 70, color: '#f59e0b' },
            { name: 'Kimia SMA', progress: 65, color: '#10b981' },
            { name: 'Inggris SMA', progress: 50, color: '#ef4444' }
        ],
        quizHistory: [
            { date: '2024-01-15', subject: 'Matematika SMA', score: 5, total: 5 },
            { date: '2024-01-14', subject: 'Fisika SMA', score: 4, total: 5 },
            { date: '2024-01-13', subject: 'Kimia SMA', score: 3, total: 5 },
            { date: '2024-01-12', subject: 'Matematika SMA', score: 4, total: 5 },
            { date: '2024-01-11', subject: 'Inggris SMA', score: 2, total: 5 },
            { date: '2024-01-10', subject: 'Fisika SMA', score: 3, total: 5 }
        ],
        goals: [
            { title: 'Selesaikan 10 Quiz', current: 8, target: 10, icon: '' },
            { title: 'Baca 20 Materi', current: 12, target: 20, icon: '' },
            { title: 'Dapatkan Skor Sempurna', current: 2, target: 5, icon: '' }
        ]
    };
    
    // Initialize progress tracking
    function initProgress() {
        loadProgressOverview();
        loadSubjectProgress();
        loadQuizHistory();
        loadGoals();
        startAnimations();
    }
    
    // Load progress overview
    function loadProgressOverview() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            animateNumber(statNumbers[0], progressData.totalHours);
            animateNumber(statNumbers[1], progressData.totalQuizzes);
            animateNumber(statNumbers[2], progressData.averageScore, '%');
        }
    }
    
    // Load subject progress
    function loadSubjectProgress() {
        subjectProgress.innerHTML = '';

        progressData.subjects.forEach(subject => {
            const progressItem = document.createElement('div');
            progressItem.className = 'progress-item';

            progressItem.innerHTML = `
                <div class="progress-header">
                    <span>${subject.name}</span>
                    <span>${subject.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%; background: ${subject.color}"></div>
                </div>
            `;

            subjectProgress.appendChild(progressItem);

            // Animate progress bar
            setTimeout(() => {
                const progressFill = progressItem.querySelector('.progress-fill');
                progressFill.style.width = subject.progress + '%';
            }, 500);
        });
    }
    
    // Load quiz history
    function loadQuizHistory() {
        quizHistory.innerHTML = '';

        progressData.quizHistory.forEach(quiz => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const date = new Date(quiz.date);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const scoreClass = quiz.score === quiz.total ? 'perfect' :
                              quiz.score >= quiz.total * 0.8 ? 'good' :
                              quiz.score >= quiz.total * 0.6 ? 'average' : 'poor';

            historyItem.innerHTML = `
                <div class="history-date">${formattedDate}</div>
                <div class="history-subject">${quiz.subject}</div>
                <div class="history-score ${scoreClass}">${quiz.score}/${quiz.total}</div>
            `;

            quizHistory.appendChild(historyItem);
        });
    }
    
    // Load goals
    function loadGoals() {
        goalsGrid.innerHTML = '';

        progressData.goals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';

            const progress = (goal.current / goal.target) * 100;

            goalItem.innerHTML = `
                <div class="goal-icon">${goal.icon}</div>
                <div class="goal-title">${goal.title}</div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <span>${goal.current}/${goal.target}</span>
                </div>
            `;

            goalsGrid.appendChild(goalItem);

            // Animate progress bar
            setTimeout(() => {
                const progressFill = goalItem.querySelector('.progress-fill');
                progressFill.style.width = progress + '%';
            }, 800);
        });
    }
    
    // Animate number counting
    function animateNumber(element, target, suffix = '') {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }
    
    // Start animations
    function startAnimations() {
        // Animate progress overview cards
        const overviewCards = document.querySelectorAll('.progress-overview .card');
        overviewCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Animate progress charts
        const chartCards = document.querySelectorAll('.progress-charts .card');
        chartCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 600 + (index * 200));
        });
        
        // Animate goals
        const goalItems = document.querySelectorAll('.goal-item');
        goalItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 1000 + (index * 150));
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
    initProgress();
    
    console.log('Progress tracking system loaded successfully!');
})();
