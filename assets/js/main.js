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

  /* ============================================================
     ENRICHMENT MODULES — powered by niche open-source libraries
       · MapLibre GL JS (BSD-3) + OpenFreeMap ..... vector map
       · BaguetteBox.js (MIT) ..................... gallery lightbox
       · Keen Slider (MIT) ........................ testimonials carousel
       · Frappe Charts (MIT) ...................... donation donut chart
       · Iconoir (MIT) ............................ icons (inlined SVG)
     Each module is guarded so a page that omits a library (or a
     CDN that fails to load) degrades gracefully.
     ============================================================ */

  /* ── MapLibre GL JS + OpenFreeMap (key-free vector tiles) ── */
  function setupMaps() {
    if (typeof maplibregl === 'undefined') return;
    const nodes = document.querySelectorAll('[data-map]');
    if (!nodes.length) return;

    // Maufant, St Saviour, Jersey — [lng, lat] (approximate)
    const CENTRE = [-2.0632, 49.2098];
    const POPUP =
      '<strong>Maufant Variety Youth Centre</strong>' +
      'La Grande Route de St Martin<br>St Saviour, Jersey JE2 7GT';

    nodes.forEach((node) => {
      const map = new maplibregl.Map({
        container: node,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: CENTRE,
        zoom: 14,
        scrollZoom: false,
        attributionControl: { compact: true },
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

      const marker = new maplibregl.Marker({ color: '#12708C' })
        .setLngLat(CENTRE)
        .setPopup(new maplibregl.Popup({ offset: 30, closeButton: true }).setHTML(POPUP))
        .addTo(map);

      map.on('load', () => marker.togglePopup());
    });
  }

  /* ── BaguetteBox.js gallery lightbox ── */
  function setupGallery() {
    if (typeof baguetteBox === 'undefined') return;
    if (!document.querySelector('.gallery-grid')) return;

    baguetteBox.run('.gallery-grid', {
      animation: 'fadeIn',
      noScrollbars: true,
      buttons: true,
      captions: true,
      overlayBackgroundColor: 'rgba(7, 26, 40, 0.94)',
      filter: /^.+\.(svg|jpe?g|png|gif|webp)$/i,
    });
  }

  /* ── Keen Slider testimonials carousel ── */
  function setupTestimonials() {
    if (typeof KeenSlider === 'undefined') return;
    const el = document.querySelector('.testimonial-slider');
    if (!el) return;

    const dots = document.querySelector('.testimonial-dots');
    const total = el.querySelectorAll('.keen-slider__slide').length;

    const slider = new KeenSlider(el, {
      loop: true,
      slides: { perView: 1 },
      created(s) {
        if (!dots) return;
        dots.innerHTML = '';
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'testimonial-dot';
          dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
          dot.addEventListener('click', () => s.moveToIdx(i));
          dots.appendChild(dot);
        }
      },
      slideChanged(s) {
        if (!dots) return;
        const rel = s.track.details.rel;
        dots.querySelectorAll('.testimonial-dot').forEach((d, i) => {
          d.classList.toggle('testimonial-dot--active', i === rel);
        });
      },
    });

    const prev = document.querySelector('.testimonial-prev');
    const next = document.querySelector('.testimonial-next');
    if (prev) prev.addEventListener('click', () => slider.prev());
    if (next) next.addEventListener('click', () => slider.next());

    if (!prefersReduced) {
      let timer = null;
      const start = () => { timer = setInterval(() => slider.next(), 6500); };
      const stop = () => { clearInterval(timer); timer = null; };
      el.addEventListener('mouseenter', stop);
      el.addEventListener('mouseleave', start);
      el.addEventListener('focusin', stop);
      el.addEventListener('focusout', start);
      start();
    }
  }

  /* ── Frappe Charts donation donut ── */
  function setupImpactChart() {
    if (typeof frappe === 'undefined' || !frappe.Chart) return;
    const el = document.getElementById('impact-chart');
    if (!el) return;

    // Labels are kept short: Frappe Charts truncates legend text that
    // overflows the SVG width.
    const chart = new frappe.Chart(el, {
      type: 'donut',
      height: 250,
      radius: 88,
      colors: ['#3FA9BF', '#E8A33D', '#12708C', '#7FCBD9'],
      data: {
        labels: ['Sessions', 'Holidays', 'Equipment', 'Training'],
        datasets: [{ values: [40, 32, 20, 8] }],
      },
      tooltipOptions: {
        formatTooltipY: (d) => d + '%',
      },
    });

    // Frappe Charts v1.6.x redraws from a ResizeObserver that throws a
    // NotFoundError when the container is resized. Disconnect it; the SVG is
    // scaled by CSS (`max-width: 100%`) instead.
    if (chart && chart.resizeObserver && typeof chart.resizeObserver.disconnect === 'function') {
      chart.resizeObserver.disconnect();
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    setupRise();
    setupProgressBars();
    setupCounters();
    setupGalleryStagger();
    highlightActiveNav();

    // Enrichment modules
    setupMaps();
    setupGallery();
    setupTestimonials();
    setupImpactChart();
  });
})();
