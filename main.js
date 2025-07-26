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
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
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
        alert('Terima kasih! Pesan Anda berhasil dikirim.');
        contactForm.reset();
      } else {
        alert('Gagal mengirim pesan: ' + (data.message || 'Terjadi kesalahan.'));
      }
    } catch (err) {
      alert('Gagal mengirim pesan: ' + err.message);
    }
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