/**
 * MACHUDA — index-page.js
 * Homepage interactions: slider, nav scroll, FAQ, animations
 */

(function () {
  'use strict';

  /* ================================================================
     HERO SLIDER
     ================================================================ */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  let currentSlide = 0;
  let autoTimer = null;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAutoplay() {
    autoTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function stopAutoplay() {
    clearInterval(autoTimer);
  }

  if (slides.length > 0) {
    startAutoplay();
    prevBtn && prevBtn.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide - 1); startAutoplay(); });
    nextBtn && nextBtn.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide + 1); startAutoplay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAutoplay(); goToSlide(i); startAutoplay(); });
    });
  }

  /* ================================================================
     HEADER SCROLL EFFECT
     ================================================================ */
  const header = document.getElementById('site-header');
  const categoryBar = document.getElementById('category-bar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ================================================================
     SEARCH TOGGLE
     ================================================================ */
  const searchBtn = document.getElementById('btn-search');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchField = document.getElementById('search-field');

  searchBtn && searchBtn.addEventListener('click', () => {
    const isOpen = searchDropdown.classList.toggle('open');
    searchDropdown.setAttribute('aria-hidden', !isOpen);
    if (isOpen) {
      setTimeout(() => searchField && searchField.focus(), 300);
    }
  });

  // Close search on outside click
  document.addEventListener('click', (e) => {
    if (searchDropdown && !searchDropdown.contains(e.target) && e.target !== searchBtn) {
      searchDropdown.classList.remove('open');
      searchDropdown.setAttribute('aria-hidden', 'true');
    }
  });

  /* ================================================================
     MOBILE HAMBURGER
     ================================================================ */
  const hamburger = document.getElementById('hamburger');
  const gnb = document.getElementById('gnb-nav');

  hamburger && hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    if (gnb) {
      gnb.style.display = expanded ? 'none' : 'flex';
      gnb.style.flexDirection = 'column';
      gnb.style.position = 'fixed';
      gnb.style.top = '64px';
      gnb.style.left = '0';
      gnb.style.right = '0';
      gnb.style.bottom = '0';
      gnb.style.background = '#fff';
      gnb.style.padding = '20px';
      gnb.style.zIndex = '800';
      gnb.style.overflowY = 'auto';
      gnb.style.borderTop = '1px solid #e2e8f0';
      gnb.style.gap = '4px';
    }
  });

  /* ================================================================
     CATEGORY BAR — Active chip on click
     ================================================================ */
  const catChips = document.querySelectorAll('.cat-chip');
  catChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      catChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ================================================================
     FAQ ACCORDION
     ================================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question && question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        const fa = fi.querySelector('.faq-answer');
        if (fa) fa.classList.remove('open');
        const fq = fi.querySelector('.faq-question');
        if (fq) fq.setAttribute('aria-expanded', 'false');
      });
      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        if (answer) answer.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ================================================================
     SCROLL ANIMATIONS (IntersectionObserver)
     ================================================================ */
  const processSteps = document.querySelectorAll('.process-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  processSteps.forEach(step => stepObserver.observe(step));

  // Generic fade-in-up for sections
  const fadeTargets = document.querySelectorAll(
    '.section-head, .product-card, .case-card, .print-card, .review-card, .cat-bento-card, .trust-item, .faq-item'
  );
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Add fade-in-up class then observe
  fadeTargets.forEach((el, i) => {
    el.classList.add('fade-in-up');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    fadeObserver.observe(el);
  });

  /* ================================================================
     PRODUCT WISH BUTTON (Toggle)
     ================================================================ */
  const wishBtns = document.querySelectorAll('.product-wish');
  wishBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isWished = btn.textContent === '♥';
      btn.textContent = isWished ? '♡' : '♥';
      btn.style.color = isWished ? '' : 'var(--col-red)';
    });
  });

  /* ================================================================
     SMOOTH SCROLL for anchor links
     ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });



  /* ================================================================
     HEADER: Update category bar top offset on window resize
     ================================================================ */
  function updateCategoryBarTop() {
    if (categoryBar && header) {
      categoryBar.style.top = header.offsetHeight + 'px';
    }
  }
  window.addEventListener('resize', updateCategoryBarTop);
  updateCategoryBarTop();

  console.log('[MACHUDA] index-page.js loaded ✓');
})();
