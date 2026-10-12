/* ============================================================
   MAUFANT YOUTH PROJECT — main.js
   Registered Charity No. 340 | AJC505 | St Saviour, Jersey

   Interactions: nav scroll state, mobile menu, rise animations,
   campaign progress bar, impact counters, gallery stagger,
   footer year, next-session helper
   ============================================================ */

(function () {
  'use strict';

  /* ── Navigation: scroll-aware (transparent over hero, solid on scroll) ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu toggle ── */
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('nav__links--open');
      toggle.classList.toggle('nav__toggle--open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close on link click
    links.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && links.classList.contains('nav__links--open')) {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('nav__links--open')) {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Reduced-motion preference ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── IntersectionObserver: rise animations ── */
  function setupRise() {
    if (prefersReduced) {
      document.querySelectorAll('.rise, .stagger').forEach(el => {
        el.classList.add('rise--visible', 'stagger--visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rise--visible', 'stagger--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.rise, .stagger').forEach(el => observer.observe(el));
  }

  /* ── Progress bar fill ── */
  function setupProgressBars() {
    if (prefersReduced) {
      document.querySelectorAll('.progress').forEach(bar => {
        bar.classList.add('progress--animated');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('progress--animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('.progress').forEach(bar => observer.observe(bar));
  }

  /* ── Counter animation ── */
  function setupCounters() {
    if (prefersReduced) {
      document.querySelectorAll('[data-count]').forEach(el => {
        el.textContent = formatNumber(parseInt(el.dataset.count, 10)) + (el.dataset.suffix || '');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    // Text like "9–18" (with an en dash suffix) is a label, not a number to count up.
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) {
      el.textContent = suffix;
      return;
    }

    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const current = Math.round(eased * target);
      el.textContent = formatNumber(current) + (progress >= 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  /* ── Gallery stagger ── */
  function setupGalleryStagger() {
    if (prefersReduced) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('stagger--visible');
            }, i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    galleryItems.forEach(item => observer.observe(item));
  }

  /* ── Smooth scroll for in-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active nav link highlighting ── */
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('nav__link--active');
      }
    });
  }

  /* ── Footer year ── */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ── Newsletter form: honest static demo handling ── */
  document.querySelectorAll('.footer__newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('.footer__newsletter-btn');
      if (!input || !btn) return;
      const original = btn.textContent;
      btn.textContent = input.value && input.checkValidity() ? 'Thanks!' : 'Add email';
      setTimeout(() => { btn.textContent = original; }, 2200);
      if (input.value && input.checkValidity()) input.value = '';
    });
  });

  /* ============================================================
     ENRICHMENT MODULES — powered by open-source libraries
     Each module is guarded so a page that omits a library (or a
     CDN that fails to load) degrades gracefully.
     ============================================================ */

  /* ── Lucide icon system ── */
  function setupIcons() {
    if (typeof lucide === 'undefined' || !lucide.createIcons) return;
    lucide.createIcons();
  }

  /* ── GLightbox photo gallery ── */
  function setupGallery() {
    if (typeof GLightbox === 'undefined') return;
    if (!document.querySelector('.glightbox')) return;
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      zoomable: true,
      draggable: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
    });
  }

  /* ── Swiper testimonials carousel ── */
  function setupTestimonials() {
    if (typeof Swiper === 'undefined') return;
    const el = document.querySelector('.testimonial-swiper');
    if (!el) return;

    new Swiper(el, {
      loop: true,
      autoHeight: true,
      spaceBetween: 24,
      grabCursor: true,
      keyboard: { enabled: true },
      a11y: { enabled: true, prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial' },
      autoplay: prefersReduced ? false : { delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.testimonial-pagination', clickable: true },
      navigation: { nextEl: '.testimonial-next', prevEl: '.testimonial-prev' },
    });
  }

  /* ── Chart.js donation transparency chart ── */
  function setupImpactChart() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('impact-chart');
    if (!canvas) return;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Sessions & snacks', 'Holiday programme', 'Equipment & venue', 'Volunteer training'],
        datasets: [{
          data: [40, 32, 20, 8],
          backgroundColor: ['#3FA9BF', '#E8A33D', '#12708C', '#7FCBD9'],
          borderColor: 'rgba(255, 255, 255, 0.16)',
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        animation: prefersReduced ? false : { animateRotate: true, duration: 1400, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(242, 247, 248, 0.82)',
              font: { family: "'Inter', sans-serif", size: 12 },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          tooltip: {
            backgroundColor: '#071A28',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { family: "'Inter', sans-serif", weight: '600' },
            bodyFont: { family: "'IBM Plex Mono', monospace", size: 13 },
            callbacks: {
              label: (ctx) => ' ' + ctx.parsed + '% of spending',
            },
          },
        },
      },
    });
  }

  /* ── Leaflet + OpenStreetMap interactive map(s) ── */
  function setupMaps() {
    if (typeof L === 'undefined') return;
    const nodes = document.querySelectorAll('[data-map]');
    if (!nodes.length) return;

    const CENTRE = [49.2098, -2.0632]; // Maufant, St Saviour, Jersey (approx.)
    const POPUP =
      '<strong>Maufant Variety Youth Centre</strong>' +
      'La Grande Route de St Martin<br>St Saviour, Jersey JE2 7GT';

    nodes.forEach((node) => {
      const map = L.map(node, {
        center: CENTRE,
        zoom: 14,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(CENTRE).addTo(map).bindPopup(POPUP).openPopup();
    });
  }

  /* ── Just-validate: contact form ── */
  function setupFormValidation() {
    if (typeof JustValidate === 'undefined') return;
    const form = document.getElementById('contact-form');
    if (!form) return;

    const success = document.getElementById('contact-success');

    const validator = new JustValidate(form, {
      errorFieldCssClass: 'just-validate-error-field',
      errorLabelCssClass: 'just-validate-error-label',
      focusInvalidField: true,
      lockForm: false,
    });

    validator
      .addField('#firstName', [{ rule: 'required', errorMessage: 'Please enter your first name' }])
      .addField('#lastName', [{ rule: 'required', errorMessage: 'Please enter your last name' }])
      .addField('#email', [
        { rule: 'required', errorMessage: 'Please enter your email address' },
        { rule: 'email', errorMessage: 'That email address does not look right' },
      ])
      .addField('#subject', [{ rule: 'required', errorMessage: 'Please choose a topic' }])
      .addField('#message', [
        { rule: 'required', errorMessage: 'Please tell us a little more' },
        { rule: 'minLength', value: 10, errorMessage: 'A little more detail helps us help you' },
      ])
      .onSuccess(() => {
        // Static site: no backend. Show an honest confirmation instead of faking a send.
        if (success) {
          success.classList.add('form-success--visible');
          success.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
        }
        form.reset();
        validator.refresh(); // clear field states
      });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    setupRise();
    setupProgressBars();
    setupCounters();
    setupGalleryStagger();
    highlightActiveNav();

    // Enrichment modules
    setupIcons();
    setupGallery();
    setupTestimonials();
    setupImpactChart();
    setupMaps();
    setupFormValidation();
  });
})();
