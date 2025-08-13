// Navigation toggle
    document.getElementById('nav-toggle').addEventListener('click', function() {
      const navMenu = document.getElementById('nav-menu');
      navMenu.classList.toggle('hidden');
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

    // Progress bar
    window.addEventListener('scroll', function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-bar').style.width = scrolled + '%';
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Calculator functionality
    const kelasSelect = document.getElementById('kelas-select');
    const jumlahPeserta = document.getElementById('jumlah-peserta');
    const totalBiaya = document.getElementById('total-biaya');

    function calculateTotal() {
      const hargaKelas = parseInt(kelasSelect.value) || 0;
      const jumlah = parseInt(jumlahPeserta.value) || 1;
      const total = hargaKelas * jumlah;
      totalBiaya.textContent = 'Rp' + total.toLocaleString('id-ID');
    }

    kelasSelect.addEventListener('change', calculateTotal);
    jumlahPeserta.addEventListener('input', calculateTotal);

    // Quiz functionality
    const quizData = [
      {
        question: "Apa arti dari 'Arigatou gozaimasu'?",
        options: ["Selamat pagi", "Terima kasih", "Selamat malam", "Sampai jumpa"],
        correct: 1
      },
      {
        question: "Huruf Hiragana untuk 'A' adalah:",
        options: ["あ", "か", "さ", "た"],
        correct: 0
      },
      {
        question: "Bagaimana cara mengatakan 'Saya' dalam bahasa Jepang?",
        options: ["Anata", "Watashi", "Kare", "Kanojo"],
        correct: 1
      },
      {
        question: "Apa arti dari 'Ohayou gozaimasu'?",
        options: ["Selamat siang", "Selamat malam", "Selamat pagi", "Selamat sore"],
        correct: 2
      },
      {
        question: "Huruf Hiragana untuk 'KA' adalah:",
        options: ["あ", "か", "さ", "た"],
        correct: 1
      }
    ];

    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];

    const quizStart = document.getElementById('quiz-start');
    const quizQuestion = document.getElementById('quiz-question');
    const quizResult = document.getElementById('quiz-result');
    const startQuizBtn = document.getElementById('start-quiz');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const questionOptions = document.getElementById('question-options');
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const quizScore = document.getElementById('quiz-score');
    const quizFeedback = document.getElementById('quiz-feedback');
    const restartBtn = document.getElementById('restart-quiz');

    startQuizBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', prevQuestion);
    restartBtn.addEventListener('click', restartQuiz);

    function startQuiz() {
      quizStart.classList.add('hidden');
      quizQuestion.classList.remove('hidden');
      currentQuestion = 0;
      score = 0;
      userAnswers = [];
      showQuestion();
    }

    function showQuestion() {
      const question = quizData[currentQuestion];
      questionNumber.textContent = currentQuestion + 1;
      questionText.textContent = question.question;
      
      questionOptions.innerHTML = '';
      question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.innerHTML = `
          <label class="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#e60012] transition-colors">
            <input type="radio" name="answer" value="${index}" class="mr-3 text-[#e60012] focus:ring-[#e60012]">
            <span>${option}</span>
          </label>
        `;
        questionOptions.appendChild(optionDiv);
      });

      // Show selected answer if exists
      if (userAnswers[currentQuestion] !== undefined) {
        const selectedRadio = document.querySelector(`input[value="${userAnswers[currentQuestion]}"]`);
        if (selectedRadio) {
          selectedRadio.checked = true;
        }
      }

      // Show/hide buttons
      prevBtn.classList.toggle('hidden', currentQuestion === 0);
      nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Selesai' : 'Selanjutnya';
    }

    function nextQuestion() {
      const selectedAnswer = document.querySelector('input[name="answer"]:checked');
      if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
        
        if (currentQuestion < quizData.length - 1) {
          currentQuestion++;
          showQuestion();
        } else {
          showResult();
        }
      } else {
        alert('Silakan pilih jawaban terlebih dahulu!');
      }
    }

    function prevQuestion() {
      if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
      }
    }

    function showResult() {
      // Calculate score
      score = 0;
      userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
          score++;
        }
      });

      quizQuestion.classList.add('hidden');
      quizResult.classList.remove('hidden');
      quizScore.textContent = score;

      // Feedback based on score
      let feedback = '';
      if (score >= 4) {
        feedback = 'Excellent! Anda memiliki pengetahuan bahasa Jepang yang baik.';
      } else if (score >= 3) {
        feedback = 'Good! Terus belajar untuk meningkatkan kemampuan Anda.';
      } else if (score >= 2) {
        feedback = 'Not bad! Masih perlu belajar lebih banyak lagi.';
      } else {
        feedback = 'Keep trying! Jangan menyerah, terus semangat belajar!';
      }
      quizFeedback.textContent = feedback;
    }

    function restartQuiz() {
      quizResult.classList.add('hidden');
      quizStart.classList.remove('hidden');
      currentQuestion = 0;
      score = 0;
      userAnswers = [];
    }

    // Form submission
    const contactForm = document.querySelector('form');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      submitText.classList.add('hidden');
      submitLoading.classList.remove('hidden');
      
      // Simulate form submission
      setTimeout(() => {
        alert('Pesan Anda telah terkirim! Kami akan segera merespons.');
        submitText.classList.remove('hidden');
        submitLoading.classList.add('hidden');
        contactForm.reset();
      }, 2000);
    });

    // Add fade-in animation to sections on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });