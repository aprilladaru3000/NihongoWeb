// Responsive Navigation
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
}

// Optional: Prevent default form submission and show alert (for demo only)
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah dikirim.');
    contactForm.reset();
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