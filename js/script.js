/* ==========================================================================
   Kahani Coffee House — script.js
   Features:
   1. Responsive hamburger navigation
   2. Menu category filter (dynamic show/hide)
   3. Gallery lightbox modal
   4. Testimonial carousel/slider
   5. Contact form validation (client-side)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1. Hamburger navigation menu
     ------------------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Toggle the mobile menu open/closed
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the mobile menu once a link is chosen
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     2. Menu category filter
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  if (filterButtons.length && menuItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        const category = btn.dataset.filter;

        menuItems.forEach(function (item) {
          const matches = category === 'all' || item.dataset.category === category;
          item.style.display = matches ? '' : 'none';
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     3. Gallery lightbox modal
     ------------------------------------------------------------------ */
  const galleryButtons = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.modal-overlay');

  if (galleryButtons.length && modal) {
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalClose = modal.querySelector('.modal-close');

    function openModal(item) {
      const title = item.dataset.title || '';
      const desc = item.dataset.desc || '';
      const colorA = item.style.getPropertyValue('--tile-a');
      const colorB = item.style.getPropertyValue('--tile-b');

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalImage.style.setProperty('--tile-a', colorA);
      modalImage.style.setProperty('--tile-b', colorB);

      modal.classList.add('is-open');
      modalClose.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    galleryButtons.forEach(function (item) {
      item.addEventListener('click', function () { openModal(item); });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ------------------------------------------------------------------
     4. Testimonial carousel
     ------------------------------------------------------------------ */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsWrap = document.querySelector('.slider-dots');

  if (slides.length && dotsWrap) {
    let current = 0;
    let timer;

    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('button');

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    resetTimer();
  }

  /* ------------------------------------------------------------------
     5. Contact form validation
     ------------------------------------------------------------------ */
  const form = document.querySelector('.contact-form');

  if (form) {
    const status = form.querySelector('.form-status');

    const validators = {
      name: function (v) { return v.trim().length >= 2 || 'Please share your name (at least 2 characters).'; },
      email: function (v) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(v.trim()) || 'Enter a valid email address, like you@example.com.';
      },
      phone: function (v) {
        if (!v.trim()) return true; // optional field
        return /^[0-9+\-\s()]{7,}$/.test(v.trim()) || 'Enter a valid phone number.';
      },
      message: function (v) { return v.trim().length >= 10 || 'Tell us a little more (at least 10 characters).'; }
    };

    function showError(field, message) {
      const wrap = field.closest('.field');
      const errorEl = wrap.querySelector('.field-error');
      if (message === true) {
        wrap.classList.remove('has-error');
        errorEl.textContent = '';
      } else {
        wrap.classList.add('has-error');
        errorEl.textContent = message;
      }
    }

    function validateField(field) {
      const rule = validators[field.name];
      if (!rule) return true;
      const result = rule(field.value);
      showError(field, result);
      return result === true;
    }

    Object.keys(validators).forEach(function (name) {
      const field = form.querySelector('[name="' + name + '"]');
      if (field) {
        field.addEventListener('blur', function () { validateField(field); });
        field.addEventListener('input', function () {
          if (field.closest('.field').classList.contains('has-error')) validateField(field);
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      Object.keys(validators).forEach(function (name) {
        const field = form.querySelector('[name="' + name + '"]');
        if (field && !validateField(field)) isValid = false;
      });

      if (isValid) {
        status.textContent = 'Thank you — your message has been noted. We will reply within a day.';
        status.classList.add('is-visible');
        form.reset();
        Object.keys(validators).forEach(function (name) {
          const field = form.querySelector('[name="' + name + '"]');
          if (field) showError(field, true);
        });
      } else {
        status.classList.remove('is-visible');
        const firstError = form.querySelector('.has-error input, .has-error textarea');
        if (firstError) firstError.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Footer year (small DOM-manipulation touch, used on every page)
     ------------------------------------------------------------------ */
  const yearEl = document.querySelector('.current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
