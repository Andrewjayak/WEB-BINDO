(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('aa_logged_in') === 'true';
    if (!isLoggedIn) {
        window.location.replace('auth.html');
        return;
    }
    
    // Sample leaderboard data
    const leaderboardData = [
        { name: 'Ahmad Rizki', subject: 'Matematika SMA', score: 5, total: 5, date: '2024-01-15' },
        { name: 'Siti Nurhaliza', subject: 'Matematika SMA', score: 4, total: 5, date: '2024-01-14' },
        { name: 'Budi Santoso', subject: 'Matematika SMA', score: 4, total: 5, date: '2024-01-13' },
        { name: 'Dewi Lestari', subject: 'Matematika SMA', score: 3, total: 5, date: '2024-01-12' },
        { name: 'Fajar Nugroho', subject: 'Matematika SMA', score: 3, total: 5, date: '2024-01-11' },
        { name: 'Gita Maharani', subject: 'Matematika SMA', score: 2, total: 5, date: '2024-01-10' },
        { name: 'Hendra Wijaya', subject: 'Matematika SMA', score: 2, total: 5, date: '2024-01-09' },
        { name: 'Indah Sari', subject: 'Matematika SMA', score: 1, total: 5, date: '2024-01-08' }
    ];
    
    // Sample achievements data
    const achievementsData = [
        {
            id: 'first_quiz',
            title: 'Pemula',
            description: 'Selesaikan quiz pertama',
            icon: '',
            earned: true,
            progress: 100
        },
        {
            id: 'perfect_score',
            title: 'Sempurna',
            description: 'Dapatkan skor sempurna (5/5)',
            icon: '',
            earned: false,
            progress: 0
        },
        {
            id: 'streak_3',
            title: 'Konsisten',
            description: 'Selesaikan 3 quiz berturut-turut',
            icon: '',
            earned: false,
            progress: 33
        },
        {
            id: 'speed_demon',
            title: 'Kilat',
            description: 'Selesaikan quiz dalam waktu < 2 menit',
            icon: '',
            earned: false,
            progress: 0
        },
        {
            id: 'math_master',
            title: 'Master Matematika',
            description: 'Selesaikan 10 quiz Matematika',
            icon: '',
            earned: false,
            progress: 20
        },
        {
            id: 'top_3',
            title: 'Podium',
            description: 'Masuk 3 besar leaderboard',
            icon: '',
            earned: false,
            progress: 0
        }
    ];
    
    // DOM elements
    const mathLeaderboard = document.getElementById('math-leaderboard');
    const achievements = document.getElementById('achievements');
    
    // Initialize leaderboard
    function initLeaderboard() {
        loadLeaderboard();
        loadAchievements();
    }
    
    // Load leaderboard data
    function loadLeaderboard() {
        mathLeaderboard.innerHTML = '';
        
        leaderboardData.forEach((student, index) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            
            const rank = index + 1;
            const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
            
            leaderboardItem.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">
                    ${rank}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${student.name}</div>
                    <div class="leaderboard-subject">${student.subject}</div>
                </div>
                <div class="leaderboard-score">
                    <div class="leaderboard-score-value">${student.score}</div>
                    <div class="leaderboard-score-total">/ ${student.total}</div>
                </div>
            `;
            
            mathLeaderboard.appendChild(leaderboardItem);
        });
    }
    
    // Load achievements
    function loadAchievements() {
        achievements.innerHTML = '';
        
        achievementsData.forEach(achievement => {
            const achievementCard = document.createElement('div');
            achievementCard.className = 'achievement-card';
            
            achievementCard.innerHTML = `
                <div class="achievement-icon">${achievement.icon || ''}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-progress">
                    <div class="achievement-progress-fill" style="width: ${achievement.progress}%"></div>
                </div>
                <div class="achievement-progress-text">${achievement.progress}%</div>
            `;
            
            achievements.appendChild(achievementCard);
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
    initLeaderboard();
    
    // Add some interactive effects
    document.addEventListener('DOMContentLoaded', () => {
        // Animate leaderboard items
        const leaderboardItems = document.querySelectorAll('.leaderboard-item');
        leaderboardItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Animate achievement cards
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, (leaderboardItems.length * 100) + (index * 150));
        });
    });
    
    console.log('Leaderboard system loaded successfully!');
})();
