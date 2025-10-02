// dashboard.js - Professional dashboard functionality for Atomix Academy LMS

document.addEventListener('DOMContentLoaded', () => {
  // Example user data for progress and recent scores
  const progressStats = [
    { label: 'Mata Pelajaran Selesai', value: 6, total: 8 },
    { label: 'Jam Pembelajaran', value: 20, total: 24 },
    { label: 'Tingkat Kelulusan', value: 92, total: 100, isPercent: true },
    { label: 'Rating Siswa', value: 4.9, total: 5, isRating: true }
  ];

  const recentScores = [
    { subject: 'Matematika SMP', score: 85, date: '2024-06-01' },
    { subject: 'Fisika SMP', score: 78, date: '2024-05-28' },
    { subject: 'Bahasa Inggris SMP', score: 90, date: '2024-05-25' },
    { subject: 'Matematika SMA', score: 88, date: '2024-05-20' }
  ];

  // Render progress stats
  const progressContainer = document.getElementById('progress-stats');
  if (progressContainer) {
    progressContainer.innerHTML = '';
    progressStats.forEach(stat => {
      const statDiv = document.createElement('div');
      statDiv.classList.add('progress-stat');
      let displayValue = stat.value;
      if (stat.isPercent) displayValue = stat.value + '%';
      else if (stat.isRating) displayValue = stat.value.toFixed(1) + ' / 5';
      else displayValue = `${stat.value} / ${stat.total}`;
      statDiv.innerHTML = `
        <div class="stat-number">${displayValue}</div>
        <div class="stat-label">${stat.label}</div>
      `;
      progressContainer.appendChild(statDiv);
    });
  }

  // Render recent scores
  const scoresContainer = document.getElementById('recent-scores');
  if (scoresContainer) {
    scoresContainer.innerHTML = '';
    recentScores.forEach(score => {
      const scoreDiv = document.createElement('div');
      scoreDiv.classList.add('score-item');
      scoreDiv.innerHTML = `
        <div class="score-subject">${score.subject}</div>
        <div class="score-result">${score.score}%</div>
        <div class="score-date">${new Date(score.date).toLocaleDateString('id-ID')}</div>
      `;
      scoresContainer.appendChild(scoreDiv);
    });
  }

  // Logout functionality
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('aa_logged_in');
      window.location.href = 'index.html';
    });
  }

  // Update user name display
  const userNameDisplay = document.getElementById('user-name-display');
  const userName = document.getElementById('user-name');
  if (userNameDisplay && userName) {
    userNameDisplay.textContent = userName.textContent || 'Pengguna';
  }

  // Add interactive features to subject cards
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });

    card.addEventListener('click', function(e) {
      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      ripple.style.width = ripple.style.height = '20px';

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Add loading state
      this.classList.add('loading');
      setTimeout(() => {
        this.classList.remove('loading');
      }, 1000);
    });
  });

  // Add ripple animation CSS if not already present
  if (!document.querySelector('#ripple-style')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'ripple-style';
    rippleStyle.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(rippleStyle);
  }

  // Progress bar animation for subject cards
  document.querySelectorAll('.progress-fill').forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0';
    setTimeout(() => {
      fill.style.transition = 'width 1s ease';
      fill.style.width = width;
    }, 500);
  });

  // Schedule card interactions
  document.querySelectorAll('.schedule-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
  });

  // Feature card hover effects
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.feature-icon')?.style.transform = 'scale(1.1) rotate(5deg)';
    });

    card.addEventListener('mouseleave', function() {
      this.querySelector('.feature-icon')?.style.transform = 'scale(1) rotate(0deg)';
    });
  });

  console.log('Dashboard loaded with interactive features!');
});
