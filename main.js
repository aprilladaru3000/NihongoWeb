// Responsive Navigation
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkIcon = document.getElementById('dark-icon');
const lightIcon = document.getElementById('light-icon');

// Check for saved dark mode preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  document.documentElement.classList.add('dark');
  darkIcon.classList.add('hidden');
  lightIcon.classList.remove('hidden');
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    
    if (isDark) {
      darkIcon.classList.add('hidden');
      lightIcon.classList.remove('hidden');
    } else {
      darkIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
    }
  });
}

// Progress Bar
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Smooth scroll for anchor links
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const ctaLinks = document.querySelectorAll('a[href="#kontak"], a[href="#program"]');
[...navLinks, ...ctaLinks].forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth' });
      // Close mobile nav if open
      if (navMenu && !navMenu.classList.contains('hidden')) {
        navMenu.classList.add('hidden');
      }
    }
  });
});

// Intersection Observer for fade-in animations
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

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Form submission with loading state
const contactForm = document.querySelector('form');
const submitText = document.getElementById('submit-text');
const submitLoading = document.getElementById('submit-loading');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const pesan = document.getElementById('pesan').value;
    
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, pesan })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Success animation
        contactForm.style.transform = 'scale(1.02)';
        setTimeout(() => {
          contactForm.style.transform = 'scale(1)';
        }, 200);
        
        alert('Terima kasih! Pesan Anda berhasil dikirim.');
        contactForm.reset();
      } else {
        alert('Gagal mengirim pesan: ' + (data.message || 'Terjadi kesalahan.'));
      }
    } catch (err) {
      alert('Gagal mengirim pesan: ' + err.message);
    } finally {
      // Hide loading state
      submitText.classList.remove('hidden');
      submitLoading.classList.add('hidden');
    }
  });
}

// Add hover effects to cards
document.querySelectorAll('.card-hover').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Add click ripple effect to buttons
document.querySelectorAll('button, .btn-hover').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  button, .btn-hover {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Escape key to close mobile menu
  if (e.key === 'Escape' && navMenu && !navMenu.classList.contains('hidden')) {
    navMenu.classList.add('hidden');
  }
  
  // Ctrl/Cmd + K to toggle dark mode
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    darkModeToggle.click();
  }
});

// Add focus indicators for accessibility
document.querySelectorAll('a, button, input, textarea').forEach(element => {
  element.addEventListener('focus', function() {
    this.style.outline = '2px solid #e60012';
    this.style.outlineOffset = '2px';
  });
  
  element.addEventListener('blur', function() {
    this.style.outline = '';
    this.style.outlineOffset = '';
  });
});

// Preload images for better performance
const imagesToPreload = ['hero.jpg', 'worker.jpg', 'worker2.jpg'];
imagesToPreload.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Add page load animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ===== FITUR INTERAKTIF =====

// Kalkulator Biaya Kursus
const kelasSelect = document.getElementById('kelas-select');
const jumlahPeserta = document.getElementById('jumlah-peserta');
const totalBiaya = document.getElementById('total-biaya');

function updateKalkulator() {
  const hargaKelas = parseInt(kelasSelect.value) || 0;
  const jumlah = parseInt(jumlahPeserta.value) || 1;
  const total = hargaKelas * jumlah;
  
  if (hargaKelas === 0) {
    totalBiaya.textContent = 'Gratis';
  } else {
    totalBiaya.textContent = 'Rp' + total.toLocaleString();
  }
}

if (kelasSelect && jumlahPeserta) {
  kelasSelect.addEventListener('change', updateKalkulator);
  jumlahPeserta.addEventListener('input', updateKalkulator);
}

// Quiz Bahasa Jepang
const quizData = [
  {
    question: "Apa arti 'Konnichiwa' dalam bahasa Indonesia?",
    options: ["Selamat pagi", "Selamat siang", "Selamat malam", "Terima kasih"],
    correct: 1
  },
  {
    question: "Huruf Jepang yang digunakan untuk menulis kata serapan disebut...",
    options: ["Hiragana", "Katakana", "Kanji", "Romaji"],
    correct: 1
  },
  {
    question: "Apa arti 'Arigatou gozaimasu'?",
    options: ["Selamat datang", "Terima kasih", "Maaf", "Sampai jumpa"],
    correct: 1
  },
  {
    question: "JLPT N5 adalah level...",
    options: ["Paling dasar", "Menengah", "Lanjutan", "Mahir"],
    correct: 0
  },
  {
    question: "Apa arti 'Sensei' dalam bahasa Indonesia?",
    options: ["Murid", "Guru", "Teman", "Keluarga"],
    correct: 1
  }
];

let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;

const startQuizBtn = document.getElementById('start-quiz');
const quizStart = document.getElementById('quiz-start');
const quizQuestion = document.getElementById('quiz-question');
const quizResult = document.getElementById('quiz-result');

if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    quizStarted = true;
    currentQuestion = 0;
    userAnswers = [];
    showQuestion();
  });
}

function showQuestion() {
  if (currentQuestion >= quizData.length) {
    showResult();
    return;
  }

  const question = quizData[currentQuestion];
  document.getElementById('question-number').textContent = currentQuestion + 1;
  document.getElementById('question-text').textContent = question.question;
  
  const optionsContainer = document.getElementById('question-options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = `w-full text-left p-3 rounded-lg border-2 transition-colors duration-300 ${
      userAnswers[currentQuestion] === index 
        ? 'border-[#e60012] bg-red-50 dark:bg-red-900/20' 
        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
    }`;
    button.textContent = option;
    button.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(button);
  });

  // Show/hide navigation buttons
  document.getElementById('prev-question').classList.toggle('hidden', currentQuestion === 0);
  document.getElementById('next-question').textContent = currentQuestion === quizData.length - 1 ? 'Selesai' : 'Selanjutnya';
  
  quizStart.classList.add('hidden');
  quizQuestion.classList.remove('hidden');
  quizResult.classList.add('hidden');
}

function selectOption(optionIndex) {
  userAnswers[currentQuestion] = optionIndex;
  
  // Update button styles
  const buttons = document.querySelectorAll('#question-options button');
  buttons.forEach((button, index) => {
    button.className = `w-full text-left p-3 rounded-lg border-2 transition-colors duration-300 ${
      index === optionIndex 
        ? 'border-[#e60012] bg-red-50 dark:bg-red-900/20' 
        : 'border-gray-200 dark:border-gray-600'
    }`;
  });
}

function showResult() {
  const correctAnswers = userAnswers.filter((answer, index) => answer === quizData[index].correct).length;
  const score = correctAnswers;
  
  document.getElementById('quiz-score').textContent = score;
  
  let feedback = '';
  if (score === 5) {
    feedback = 'Excellent! Anda sangat menguasai dasar bahasa Jepang! 🎉';
  } else if (score >= 3) {
    feedback = 'Bagus! Anda memiliki pemahaman yang baik tentang bahasa Jepang.';
  } else if (score >= 1) {
    feedback = 'Tidak buruk! Belajar lebih lanjut untuk meningkatkan kemampuan Anda.';
  } else {
    feedback = 'Jangan khawatir! Mari belajar bersama di Nihongo Kulon Progo! 📚';
  }
  
  document.getElementById('quiz-feedback').textContent = feedback;
  
  quizQuestion.classList.add('hidden');
  quizResult.classList.remove('hidden');
}

// Quiz navigation
document.getElementById('prev-question')?.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
});

document.getElementById('next-question')?.addEventListener('click', () => {
  if (userAnswers[currentQuestion] !== undefined) {
    currentQuestion++;
    showQuestion();
  } else {
    alert('Silakan pilih jawaban terlebih dahulu!');
  }
});

document.getElementById('restart-quiz')?.addEventListener('click', () => {
  quizStarted = false;
  currentQuestion = 0;
  userAnswers = [];
  quizStart.classList.remove('hidden');
  quizQuestion.classList.add('hidden');
  quizResult.classList.add('hidden');
});

// Testimonial Slider
const testimonials = [
  {
    text: "Belajar di Nihongo Kulon Progo sangat menyenangkan. Pengajar ramah dan materi mudah dipahami.",
    name: "Sarah Johnson",
    class: "Kelas Dasar (N5)",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
  },
  {
    text: "Sensei Ayumi sangat sabar mengajar. Sekarang saya sudah bisa bercakap-cakap dalam bahasa Jepang!",
    name: "Ahmad Rizki",
    class: "Kelas Menengah (N4-N3)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
  },
  {
    text: "Suasana belajar nyaman dan tidak membosankan. Saya berhasil lulus JLPT N5!",
    name: "Maria Garcia",
    class: "Persiapan JLPT",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
  },
  {
    text: "Kelas budaya Jepang sangat menarik. Saya belajar origami dan kaligrafi Jepang!",
    name: "Budi Santoso",
    class: "Kelas Budaya Jepang",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
  }
];

let currentTestimonial = 0;

function showTestimonial(index) {
  const testimonial = testimonials[index];
  document.getElementById('testimonial-text').textContent = testimonial.text;
  document.getElementById('testimonial-name').textContent = testimonial.name;
  document.getElementById('testimonial-class').textContent = testimonial.class;
  document.getElementById('testimonial-avatar').src = testimonial.avatar;
  
  // Update dots
  const dotsContainer = document.getElementById('testimonial-dots');
  dotsContainer.innerHTML = '';
  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `w-3 h-3 rounded-full transition-colors duration-300 ${
      i === index ? 'bg-[#e60012]' : 'bg-gray-300 dark:bg-gray-600'
    }`;
    dot.addEventListener('click', () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });
}

// Testimonial navigation
document.getElementById('prev-testimonial')?.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

document.getElementById('next-testimonial')?.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

// Auto-rotate testimonials
setInterval(() => {
  if (document.getElementById('testimonial-container')) {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }
}, 5000);

// Initialize testimonials
if (document.getElementById('testimonial-container')) {
  showTestimonial(0);
} 