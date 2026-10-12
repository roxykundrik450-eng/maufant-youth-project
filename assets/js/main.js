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
  }

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

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    setupRise();
    setupProgressBars();
    setupCounters();
    setupGalleryStagger();
    highlightActiveNav();
  });
})();
