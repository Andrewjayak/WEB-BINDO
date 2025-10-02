// Quiz Interactive JavaScript
(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('aa_logged_in') === 'true';
    if (!isLoggedIn) {
        window.location.replace('auth.html');
        return;
    }
    
    // Quiz data - expanded with more questions
    const quizData = [
        {
            question: "Jika f(x) = 2x + 3 dan g(x) = x - 1, maka (f � g)(x) = ?",
            options: [
                "2x + 1",
                "2x + 5",
                "2x - 1",
                "2x + 2"
            ],
            correct: 0,
            explanation: "(f � g)(x) = f(g(x)) = f(x-1) = 2(x-1) + 3 = 2x - 2 + 3 = 2x + 1"
        },
        {
            question: "Fungsi f(x) = 3x - 2 memiliki invers. Berapakah f?�(x)?",
            options: [
                "(x + 2)/3",
                "(x - 2)/3",
                "3x + 2",
                "x/3 + 2"
            ],
            correct: 0,
            explanation: "Untuk mencari invers: y = 3x - 2, tukar x dan y: x = 3y - 2, selesaikan untuk y: y = (x + 2)/3"
        },
        {
            question: "Jika (f � g)(x) = 4x + 1 dan g(x) = 2x - 1, maka f(x) = ?",
            options: [
                "2x + 3",
                "2x - 3",
                "4x + 3",
                "4x - 3"
            ],
            correct: 0,
            explanation: "Karena (f � g)(x) = 4x + 1 dan g(x) = 2x - 1, maka f(2x - 1) = 4x + 1. Substitusi u = 2x - 1, maka x = (u + 1)/2, sehingga f(u) = 4((u + 1)/2) + 1 = 2u + 2 + 1 = 2u + 3"
        },
        {
            question: "Domain dari fungsi f(x) = v(x - 2) adalah...",
            options: [
                "x = 2",
                "x > 2",
                "x = 2",
                "x < 2"
            ],
            correct: 0,
            explanation: "Agar v(x - 2) terdefinisi, maka x - 2 = 0, sehingga x = 2"
        },
        {
            question: "Jika f(x) = x� - 4x + 3, maka nilai minimum fungsi tersebut adalah...",
            options: [
                "-1",
                "0",
                "1",
                "3"
            ],
            correct: 0,
            explanation: "Fungsi kuadrat f(x) = x� - 4x + 3 memiliki titik minimum di x = -b/2a = 4/2 = 2. Substitusi: f(2) = 4 - 8 + 3 = -1"
        },
        {
            question: "Fungsi f(x) = 2x + 1 dan g(x) = x - 3. Maka (g � f)(x) = ?",
            options: [
                "2x - 5",
                "2x - 1",
                "x - 1",
                "2x + 3"
            ],
            correct: 0,
            explanation: "(g � f)(x) = g(f(x)) = g(2x + 1) = (2x + 1) - 3 = 2x - 2"
        },
        {
            question: "Invers dari fungsi f(x) = (x - 1)/2 adalah...",
            options: [
                "2x + 1",
                "2x - 1",
                "(x + 1)/2",
                "x/2 + 1"
            ],
            correct: 0,
            explanation: "y = (x - 1)/2, tukar: x = (y - 1)/2, maka y = 2x + 1"
        },
        {
            question: "Jika f(x) = x� dan g(x) = 2x + 1, maka domain (f � g)(x) adalah...",
            options: [
                "Semua bilangan real",
                "x = -1/2",
                "x = -1/2",
                "x ? 0"
            ],
            correct: 0,
            explanation: "f � g adalah komposisi fungsi kuadrat, domainnya semua bilangan real"
        },
        {
            question: "Grafik fungsi f(x) = |x - 2| + 1 adalah...",
            options: [
                "Garis lurus",
                "Parabola",
                "V-shape",
                "Lingkaran"
            ],
            correct: 2,
            explanation: "Fungsi absolut |x - 2| menghasilkan bentuk V, ditambah 1 menggeser ke atas"
        },
        {
            question: "Titik potong sumbu y dari grafik f(x) = 3x - 6 adalah...",
            options: [
                "(0, 3)",
                "(0, -6)",
                "(6, 0)",
                "(3, 0)"
            ],
            correct: 1,
            explanation: "Untuk x = 0, f(0) = 3(0) - 6 = -6, jadi titik (0, -6)"
        }
    ];
    
    let currentQuestion = 0;
    let userAnswers = [];
    let score = 0;
    
    // DOM elements
    const questionText = document.getElementById('question-text');
    const quizOptions = document.getElementById('quiz-options');
    const progressFill = document.getElementById('quiz-progress');
    const progressText = document.getElementById('progress-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const quizQuestion = document.getElementById('quiz-question');
    const quizResults = document.getElementById('quiz-results');
    const finalScore = document.getElementById('final-score');
    const scoreMessage = document.getElementById('score-message');
    const retryBtn = document.getElementById('retry-btn');
    
    // Initialize quiz
    function initQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        score = 0;
        showQuestion();
        updateProgress();
    }
    
    // Show current question
    function showQuestion() {
        const question = quizData[currentQuestion];
        questionText.textContent = question.question;

        quizOptions.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.innerHTML =
                `<div class="option-letter">${letters[index]}</div>
                <input type="radio" name="answer" value="${index}" id="option-${index}">
                <label for="option-${index}">${option}</label>`;
            // Make entire option box clickable
            optionElement.addEventListener('click', () => {
                const radio = optionElement.querySelector('input[type="radio"]');
                radio.checked = true;
                // Trigger change event
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                // Update visual selection
                document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                optionElement.classList.add('selected');
                nextBtn.disabled = false;
            });
            quizOptions.appendChild(optionElement);
        });

        // Restore selection if answered
        const answered = userAnswers[currentQuestion];
        if (answered !== undefined) {
            const selectedOption = document.querySelector(`input[value="${answered}"]`);
            if (selectedOption) selectedOption.checked = true;
        }

        updateButtons();

        // Enable Next when a selection is made
        quizOptions.addEventListener('change', onSelectionChange, { once: true });
    }

    function onSelectionChange(){
        nextBtn.disabled = false;
    }
    
    // Update progress bar
    function updateProgress() {
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Pertanyaan ${currentQuestion + 1} dari ${quizData.length}`;
    }
    
    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentQuestion === 0;
        const hasAnswer = userAnswers[currentQuestion] !== undefined || !!document.querySelector('input[name="answer"]:checked');
        nextBtn.disabled = !hasAnswer;
        if (currentQuestion === quizData.length - 1) {
            nextBtn.textContent = 'Selesai';
        } else {
            nextBtn.textContent = 'Selanjutnya';
        }
    }
    
    // Save answer; return true if selected
    function saveAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            userAnswers[currentQuestion] = parseInt(selectedOption.value);
            return true;
        }
        return false;
    }
    
    // Calculate score
    function calculateScore() {
        score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizData[index].correct) {
                score++;
            }
        });
    }
    
    // Show results
    function showResults() {
        calculateScore();
        quizQuestion.style.display = 'none';
        quizResults.style.display = 'block';

        finalScore.textContent = score;

        let message = '';
        if (score === quizData.length) {
            message = 'Sempurna! Hebat sekali! 🎉';
        } else if (score >= quizData.length * 0.8) {
            message = 'Bagus sekali! Pertahankan. 👍';
        } else if (score >= quizData.length * 0.6) {
            message = 'Cukup baik! Tingkatkan lagi. 💪';
        } else {
            message = 'Perlu belajar lagi, tetap semangat! 🌟';
        }

        scoreMessage.textContent = message;

        // Animate score circle
        const percentage = (score / quizData.length) * 100;
        const angle = (percentage / 100) * 360;
        document.documentElement.style.setProperty('--score-angle', angle + 'deg');

        // Save score to localStorage
        const userScores = JSON.parse(localStorage.getItem('aa_quiz_scores') || '[]');
        userScores.push({
            subject: 'Matematika SMA',
            score: score,
            total: quizData.length,
            date: new Date().toISOString()
        });
        localStorage.setItem('aa_quiz_scores', JSON.stringify(userScores));

        // Animate results
        setTimeout(() => {
            quizResults.classList.add('fade-in-up');
        }, 100);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        const hasSelection = saveAnswer();
        if (!hasSelection){
            // Subtle feedback: shake question card
            quizQuestion.classList.add('shake');
            setTimeout(() => quizQuestion.classList.remove('shake'), 400);
            return;
        }
        
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            showQuestion();
            updateProgress();
        } else {
            showResults();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        const hasSelection = saveAnswer();
        currentQuestion--;
        showQuestion();
        updateProgress();
    });
    
    retryBtn.addEventListener('click', () => {
        quizQuestion.style.display = 'block';
        quizResults.style.display = 'none';
        initQuiz();
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('aa_logged_in');
        localStorage.removeItem('aa_user');
        window.location.replace('auth.html');
    });
    
    // Initialize quiz when page loads
    initQuiz();
    
    // Add interactive effects
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'answer') {
                document.querySelectorAll('.quiz-option').forEach(option => option.classList.remove('selected'));
                e.target.closest('.quiz-option').classList.add('selected');
                nextBtn.disabled = false;
            }
        });
    });
    
    console.log('Quiz system loaded successfully!');
})();


