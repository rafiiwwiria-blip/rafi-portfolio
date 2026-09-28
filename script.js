const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link, .nav-contact');
const yearLabel = document.querySelector('#current-year');
const certificateRows = document.querySelectorAll('.certificate-row');
const certificateModal = document.querySelector('#certificate-modal');
const certificateModalClose = document.querySelector('.certificate-modal-close');
let certificateTrigger = null;
let modalCloseTimer = null;

if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

function closeCertificateModal() {
  if (!certificateModal || certificateModal.hidden) return;
  certificateModal.classList.remove('is-open');
  certificateModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  window.clearTimeout(modalCloseTimer);
  modalCloseTimer = window.setTimeout(() => {
    certificateModal.hidden = true;
    certificateTrigger?.focus();
  }, 180);
}

function openCertificateModal(trigger) {
  if (!certificateModal) return;
  window.clearTimeout(modalCloseTimer);
  certificateTrigger = trigger;
  certificateModal.hidden = false;
  certificateModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => certificateModal.classList.add('is-open'));
  certificateModalClose?.focus();
}

certificateRows.forEach((row) => {
  row.addEventListener('click', () => openCertificateModal(row));
  row.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openCertificateModal(row);
  });
});

certificateModalClose?.addEventListener('click', closeCertificateModal);
certificateModal?.addEventListener('click', (event) => {
  if (event.target === certificateModal) closeCertificateModal();
});

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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCertificateModal();
});

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = decodeURIComponent(link.hash.slice(1));
  const target = document.getElementById(targetId);
  if (!target) return;

  event.preventDefault();
  if (window.location.hash !== link.hash) {
    window.history.pushState(null, '', link.hash);
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

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

