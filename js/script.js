document.addEventListener('DOMContentLoaded', () => {
  // Fade-in animation using IntersectionObserver
  const faders = document.querySelectorAll('.fade-in');
  const options = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, options);

  faders.forEach(fader => appearOnScroll.observe(fader));
});

// Toggle function for the hamburger menu on mobile
function toggleNav() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}