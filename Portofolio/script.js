const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link, .nav-contact');
const yearLabel = document.querySelector('#current-year');

if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  siteNav.classList.remove('is-open');
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    siteNav.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.toggle('is-active', item === link));
      closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

if ('IntersectionObserver' in window) {
  const revealItems = document.querySelectorAll(
    '.section-heading, .about-layout, .about-facts, .skill-group, .project-card, .certificate-row, .contact-intro, .contact-details'
  );

  revealItems.forEach((item) => item.classList.add('reveal'));
  document.documentElement.classList.add('reveal-ready');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', isCurrent);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

