/* ============================================
   ADDICT by Gatsby — JavaScript
   Navigation, scroll, menu filter, form, security
   ============================================ */

(function () {
  'use strict';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupNav();
    setupScrollReveal();
    setupMenuFilter();
    setupContactForm();
    setupSecurityHeaders();
  }

  // ============================================
  // NAVIGATION
  // ============================================
  function setupNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (!nav || !toggle || !links) return;

    // Scroll state
    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.scrollY;
      
      // Add/remove scrolled class
      if (currentScroll > scrollThreshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.contains('open');
      links.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', !isOpen);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    // Initial check
    handleScroll();
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================
  function setupScrollReveal() {
    // Add reveal class to elements
    const revealSelectors = [
      '.about__text',
      '.about__images',
      '.highlight-card',
      '.gallery__item',
      '.menu-category',
      '.contact-card',
      '.contact__form-wrap'
    ];

    const elements = document.querySelectorAll(revealSelectors.join(','));
    elements.forEach(function (el) {
      el.classList.add('reveal');
    });

    // Intersection Observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ============================================
  // MENU FILTER
  // ============================================
  function setupMenuFilter() {
    const filterBtns = document.querySelectorAll('.menu-nav__btn');
    const categories = document.querySelectorAll('.menu-category');

    if (!filterBtns.length || !categories.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = this.getAttribute('data-category');

        // Update active state
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Filter categories
        categories.forEach(function (cat) {
          if (category === 'all' || cat.getAttribute('data-category') === category) {
            cat.classList.remove('hidden');
            cat.style.animation = 'none';
            cat.offsetHeight; // trigger reflow
            cat.style.animation = '';
          } else {
            cat.classList.add('hidden');
          }
        });
      });
    });
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Rate limiting
    let lastSubmit = 0;
    const submitCooldown = 3000; // 3 seconds

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Rate limit check
      const now = Date.now();
      if (now - lastSubmit < submitCooldown) return;

      // Honeypot check (anti-spam)
      const honeypot = form.querySelector('#website');
      if (honeypot && honeypot.value) return;

      // Validate
      if (!validateForm(form)) return;

      // Sanitize inputs
      const formData = sanitizeFormData(form);

      // Simulate submission (replace with real endpoint)
      lastSubmit = now;
      
      // Show success
      const successEl = document.getElementById('formSuccess');
      if (successEl) {
        successEl.classList.add('visible');
        form.reset();
        
        // Hide after 5s
        setTimeout(function () {
          successEl.classList.remove('visible');
        }, 5000);
      }

      // Log sanitized data (replace with actual API call)
      console.log('Form submitted:', formData);
    });

    // Real-time validation
    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(this);
      });
      input.addEventListener('input', function () {
        if (this.parentElement.classList.contains('error')) {
          validateField(this);
        }
      });
    });
  }

  function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  function validateField(field) {
    const group = field.parentElement;
    const error = group.querySelector('.form-error');
    let message = '';

    if (!field.value.trim()) {
      message = 'Ce champ est requis';
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
      message = 'Veuillez entrer un email valide';
    }

    if (message) {
      group.classList.add('error');
      if (error) error.textContent = message;
      return false;
    } else {
      group.classList.remove('error');
      if (error) error.textContent = '';
      return true;
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function sanitizeFormData(form) {
    var data = {};
    var formData = new FormData(form);
    formData.forEach(function (value, key) {
      if (key === 'website') return; // Skip honeypot
      data[key] = sanitizeString(value);
    });
    return data;
  }

  function sanitizeString(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.trim();
  }

  // ============================================
  // SECURITY
  // ============================================
  function setupSecurityHeaders() {
    // Disable right-click on images (basic protection)
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('contextmenu', function (e) {
        // Allow but don't prevent — just a soft measure
      });
    });

    // Prevent clickjacking (already handled by meta tag)
    if (window.self !== window.top) {
      document.body.style.display = 'none';
    }

    // Console warning
    if (typeof console !== 'undefined') {
      console.log(
        '%c⚠ Addict by Gatsby',
        'color: #c9a96e; font-size: 20px; font-weight: bold;'
      );
      console.log(
        '%cCe navigateur est un outil de développement.',
        'color: #8a8780; font-size: 12px;'
      );
    }
  }

})();
