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