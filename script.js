/**
 * Precision & Co — Premium Website JavaScript
 * Handles: Scroll reveals, counters, navbar behavior, 
 * testimonial carousel, mobile menu, and micro-interactions
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // NAVBAR SCROLL BEHAVIOR
  // ═══════════════════════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  const topBar = document.getElementById('top-bar');
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    
    // Add scrolled class for glass effect enhancement
    if (scrollY > 60) {
      if (navbar) navbar.classList.add('navbar--scrolled');
      if (topBar) topBar.classList.add('top-bar--hidden');
    } else {
      if (navbar) navbar.classList.remove('navbar--scrolled');
      if (topBar) topBar.classList.remove('top-bar--hidden');
    }

    // Hide/show navbar on scroll direction
    if (scrollY > 300) {
      if (scrollY > lastScrollY + 5) {
        if (navbar) navbar.classList.add('navbar--hidden');
      } else if (scrollY < lastScrollY - 5) {
        if (navbar) navbar.classList.remove('navbar--hidden');
      }
    } else {
      if (navbar) navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ═══════════════════════════════════════════════════════════
  // MOBILE HAMBURGER MENU
  // ═══════════════════════════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = this.classList.toggle('navbar__hamburger--active');
      mainNav.classList.toggle('navbar__nav--open');
      this.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);

      if (window.lenis) {
        if (isOpen) {
          window.lenis.stop();
        } else {
          window.lenis.start();
        }
      }
    });

    // Close menu on link click
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('navbar__hamburger--active');
        mainNav.classList.remove('navbar__nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        if (window.lenis) {
          window.lenis.start();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ACTIVE NAV LINK HIGHLIGHTING
  // ═══════════════════════════════════════════════════════════
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__menu .nav-link').forEach(link => {
    link.classList.remove('nav-link--active');
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('nav-link--active');
    }
  });

  // ═══════════════════════════════════════════════════════════
  // SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ═══════════════════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-scale');
  
  if (revealElements.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // If user prefers reduced motion, show everything immediately
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Get stagger delay
            const el = entry.target;
            const staggerClasses = Array.from(el.classList).filter(function (c) {
              return c.startsWith('stagger-');
            });
            
            if (staggerClasses.length > 0) {
              const staggerNum = parseInt(staggerClasses[0].replace('stagger-', ''), 10);
              const delay = (staggerNum - 1) * 120; // 120ms stagger
              setTimeout(function () {
                el.classList.add('is-visible');
              }, delay);
            } else {
              el.classList.add('is-visible');
            }
            
            revealObserver.unobserve(el);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════
  const counters = document.querySelectorAll('.stats-bar__stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(function (counter) {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2500; // ms
      const startTime = performance.now();

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.round(easedProgress * target);

        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counters when stats section is visible
  const statsBar = document.getElementById('stats-bar');
  if (statsBar && counters.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(statsBar);
  }

  // ═══════════════════════════════════════════════════════════
  // TESTIMONIAL CAROUSEL
  // ═══════════════════════════════════════════════════════════
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    const dots = dotsContainer.querySelectorAll('.testimonials__dot');
    let currentSlide = 0;
    let autoplayInterval;
    const totalSlides = cards.length;

    function getSlideWidth() {
      if (window.innerWidth <= 768) return 100;
      if (window.innerWidth <= 1024) return 50;
      return 33.333;
    }

    function updateCarousel(animate) {
      const slideWidth = getSlideWidth();
      const translateX = -currentSlide * slideWidth;
      
      if (animate !== false) {
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      } else {
        track.style.transition = 'none';
      }
      
      track.style.transform = 'translateX(' + translateX + '%)';

      // Update dots
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('testimonials__dot--active', idx === currentSlide);
      });

      // Update button states
      prevBtn.classList.toggle('testimonials__btn--disabled', currentSlide === 0);
      nextBtn.classList.toggle('testimonials__btn--disabled', currentSlide >= totalSlides - (window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3));
    }

    function nextSlide() {
      const maxSlide = window.innerWidth <= 768 ? totalSlides - 1 : window.innerWidth <= 1024 ? totalSlides - 2 : 0;
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = currentSlide <= 0 ? 0 : currentSlide - 1;
      updateCarousel();
    }

    nextBtn.addEventListener('click', function () {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', function () {
      prevSlide();
      resetAutoplay();
    });

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        currentSlide = idx;
        updateCarousel();
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Initialize
    updateCarousel(false);
    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', function () {
      clearInterval(autoplayInterval);
    });
    track.addEventListener('mouseleave', startAutoplay);

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        currentSlide = 0;
        updateCarousel(false);
      }, 250);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // NAV DROPDOWN (Desktop hover, Mobile click)
  // ═══════════════════════════════════════════════════════════
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  dropdowns.forEach(function (dropdown) {
    const link = dropdown.querySelector('.nav-link');
    
    // Mobile: toggle on click
    if (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          dropdown.classList.toggle('nav-dropdown--open');
        }
      });
    }
  });

  // ═══════════════════════════════════════════════════════════
  // ACTIVE NAV LINK ON SCROLL
  // ═══════════════════════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('nav-link--active');
          const href = link.getAttribute('href');
          if (href === '#' + sectionId) {
            link.classList.add('nav-link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateActiveNav();
      });
    }
  }, { passive: true });

  // ═══════════════════════════════════════════════════════════
  // FORM HANDLING
  // ═══════════════════════════════════════════════════════════
  const ctaForm = document.getElementById('cta-form');
  
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.cta-form__submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span class="btn-loading"></span> Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(function () {
        submitBtn.innerHTML = '✓ Enquiry Sent Successfully';
        submitBtn.classList.add('cta-form__submit--success');
        
        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('cta-form__submit--success');
          ctaForm.reset();
        }, 3000);
      }, 1500);
    });

    // Premium input focus effects
    ctaForm.querySelectorAll('.cta-form__input, .cta-form__select, .cta-form__textarea').forEach(function (input) {
      input.addEventListener('focus', function () {
        this.parentElement.classList.add('cta-form__group--focused');
      });
      input.addEventListener('blur', function () {
        this.parentElement.classList.remove('cta-form__group--focused');
        if (this.value) {
          this.parentElement.classList.add('cta-form__group--filled');
        } else {
          this.parentElement.classList.remove('cta-form__group--filled');
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // HERO SCROLL PARALLAX (subtle)
  // ═══════════════════════════════════════════════════════════
  const hero = document.getElementById('hero');
  const heroVisual = hero ? hero.querySelector('.hero__visual') : null;

  if (hero && heroVisual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const parallax = scrollY * 0.15;
        heroVisual.style.transform = 'translateY(' + parallax + 'px)';
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════════
  // GOLD SHIMMER ON SECTION LABELS
  // ═══════════════════════════════════════════════════════════
  const sectionLines = document.querySelectorAll('.section-label__line');
  sectionLines.forEach(function (line) {
    const lineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-label__line--animate');
        }
      });
    }, { threshold: 0.5 });
    lineObserver.observe(line);
  });

  // ═══════════════════════════════════════════════════════════
  // PAGE LOAD ANIMATION
  // ═══════════════════════════════════════════════════════════
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    
    // Animate hero elements with stagger
    setTimeout(function () {
      const heroContent = document.querySelector('.hero__content');
      if (heroContent) heroContent.classList.add('is-visible');
    }, 300);

    setTimeout(function () {
      const heroVisualEl = document.querySelector('.hero__visual');
      if (heroVisualEl) heroVisualEl.classList.add('is-visible');
    }, 600);
  });

  // ═══════════════════════════════════════════════════════════
  // UNIQUE SERVICE PAGE ANIMATIONS
  // ═══════════════════════════════════════════════════════════
  
  // Audit Page Animations
  const auditGrid = document.getElementById('audit-grid');
  if (auditGrid) {
    const cards = auditGrid.querySelectorAll('.audit-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('animate'), 100 * i);
    });
    
    setTimeout(() => {
      const line = document.getElementById('audit-timeline-line');
      if(line) line.classList.add('animate');
      
      const steps = document.querySelectorAll('.audit-step');
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('animate'), 300 * i);
      });
    }, 600);
  }

  // Tax Page Animations
  const taxNodes = document.getElementById('tax-nodes');
  if (taxNodes) {
    const nodes = taxNodes.querySelectorAll('.tax-node');
    nodes.forEach((node, i) => {
      setTimeout(() => node.classList.add('animate'), 200 * i);
    });
  }

  // Consulting Page Animations
  const consultingBento = document.getElementById('consulting-bento');
  if (consultingBento) {
    const boxes = consultingBento.querySelectorAll('.consulting-box');
    boxes.forEach((box, i) => {
      setTimeout(() => box.classList.add('animate'), 300 * i);
    });
  }

  // Risk Page Animations
  const riskGrid = document.getElementById('risk-grid');
  if (riskGrid) {
    const cards = riskGrid.querySelectorAll('.risk-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('animate'), 150 * i);
    });
  }

  // VCFO Page Animations
  const vcfoDash = document.getElementById('vcfo-dash');
  if (vcfoDash) {
    setTimeout(() => {
      vcfoDash.classList.add('animate');
      const path = document.getElementById('vcfo-chart-path');
      if (path) path.classList.add('animate');
    }, 300);
  }

  // ═══════════════════════════════════════════════════════════
  // INTERACTIVE ACCORDIONS (Services & Industries)
  // ═══════════════════════════════════════════════════════════
  const accordionHeaders = document.querySelectorAll('.accordion-header, .panel-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Close others in the same group (optional, but good for UX)
      const parentList = this.closest('.premium-accordion, .accordion-list');
      if (parentList) {
        const otherContents = parentList.querySelectorAll('.accordion-content, .panel-content');
        otherContents.forEach(content => {
          if (content !== this.nextElementSibling) {
            content.style.display = 'none';
            const icon = content.previousElementSibling.querySelector('span, .toggle-icon');
            if(icon) icon.textContent = '+';
          }
        });
      }

      const content = this.nextElementSibling;
      const icon = this.querySelector('span, .toggle-icon');
      
      if (content.style.display === 'block') {
        content.style.display = 'none';
        if(icon) icon.textContent = '+';
      } else {
        content.style.display = 'block';
        if(icon) icon.textContent = '−'; // minus sign
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD MOCKUP TABS
  // ═══════════════════════════════════════════════════════════
  const dashTabs = document.querySelectorAll('.dash-sidebar span');
  const dashMetrics = document.querySelectorAll('.dash-metric strong');
  const dashChartPath = document.querySelector('.animated-chart path');

  if (dashTabs.length > 0) {
    const mockData = [
      { t1: "Overview", v1: "Active", v2: "Stable", p: "M0,30 Q20,10 40,25 T80,10 T100,5" },
      { t1: "Budgeting", v1: "₹1.2Cr", v2: "On Track", p: "M0,20 Q20,25 40,15 T80,5 T100,20" },
      { t1: "Cash Flow", v1: "+14%", v2: "Positive", p: "M0,30 Q10,30 20,20 T50,10 T100,0" },
      { t1: "KPIs", v1: "98%", v2: "Efficiency", p: "M0,10 Q20,10 40,5 T80,15 T100,5" },
      { t1: "Fundraising", v1: "Series A", v2: "Preparing", p: "M0,30 Q30,30 50,15 T80,5 T100,0" }
    ];

    dashTabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        dashTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Update mock data
        if (dashMetrics.length >= 2 && mockData[index]) {
          dashMetrics[0].textContent = mockData[index].v1;
          dashMetrics[1].textContent = mockData[index].v2;
          dashChartPath.setAttribute('d', mockData[index].p);
          
          // Re-trigger animation
          dashChartPath.style.animation = 'none';
          dashChartPath.offsetHeight; /* trigger reflow */
          dashChartPath.style.animation = null; 
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // INTRO VIDEO LOGIC
  // ═══════════════════════════════════════════════════════════
  const introOverlay = document.getElementById('intro-overlay');
  const introVideo = document.getElementById('intro-video');
  const skipIntroBtn = document.getElementById('skip-intro-btn');

  if (introOverlay && introVideo && skipIntroBtn) {
    if (sessionStorage.getItem('introPlayed')) {
      // Intro already played in this session, hide it immediately
      introOverlay.style.display = 'none';
      if(introOverlay.parentNode) {
          introOverlay.parentNode.removeChild(introOverlay);
      }
    } else {
      sessionStorage.setItem('introPlayed', 'true');
      
      // Disable scrolling while intro plays
      document.body.style.overflow = 'hidden';

      const hideIntro = () => {
        introOverlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        introVideo.pause(); // Stop video if skipping
        
        // Remove element after transition finishes
        setTimeout(() => {
          if(introOverlay.parentNode) {
              introOverlay.parentNode.removeChild(introOverlay);
          }
        }, 800);
      };

      // Auto-play the video
      introVideo.play().catch(e => {
          console.log("Auto-play prevented by browser.", e);
      });

      // Hide when video ends naturally
      introVideo.addEventListener('ended', hideIntro);
      
      // Hide when user clicks skip
      skipIntroBtn.addEventListener('click', hideIntro);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // WHATSAPP CONSULTATION POPUP MODAL
  // ═══════════════════════════════════════════════════════════
  function createWhatsAppModal() {
    if (document.getElementById('whatsapp-consultation-modal')) return;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'whatsapp-consultation-modal';
    modalDiv.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      display: none; align-items: center; justify-content: center;
      background: rgba(7, 19, 34, 0.85); backdrop-filter: blur(8px);
      padding: 16px; font-family: system-ui, -apple-system, sans-serif;
    `;

    modalDiv.innerHTML = `
      <div style="
        width: 100%; max-width: 580px; background-color: #0b1426;
        border: 1px solid rgba(200, 164, 94, 0.3); border-radius: 24px;
        padding: 36px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        position: relative; overflow: hidden; color: #f8fafc;
      ">
        <button id="wa-modal-close" type="button" style="
          position: absolute; top: 20px; right: 20px; border: none; background: transparent;
          color: #c8a45e; font-size: 24px; cursor: pointer; line-height: 1; padding: 4px 8px;
        ">&times;</button>
        
        <form id="wa-consultation-form" style="display: flex; flex-direction: column; gap: 20px;">
          <div id="wa-status-msg" style="display:none; padding:10px; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); color:#34d399; border-radius:10px; font-size:12px; text-align:center; font-weight:600;"></div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 11px; font-weight: 800; color: #c8a45e; letter-spacing: 0.1em; text-transform: uppercase;">FULL NAME</label>
              <input type="text" id="wa-fullname" required placeholder="Enter your full name" style="
                background: #0b1426; border: none; border-bottom: 1px solid #334155;
                color: #ffffff; padding: 8px 0; font-size: 14px; outline: none; transition: border-color 0.2s;
              ">
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 11px; font-weight: 800; color: #c8a45e; letter-spacing: 0.1em; text-transform: uppercase;">PHONE NUMBER</label>
              <input type="text" id="wa-phone" required placeholder="Enter your phone number" style="
                background: #0b1426; border: none; border-bottom: 1px solid #334155;
                color: #ffffff; padding: 8px 0; font-size: 14px; outline: none; transition: border-color 0.2s;
              ">
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 11px; font-weight: 800; color: #c8a45e; letter-spacing: 0.1em; text-transform: uppercase;">EMAIL ADDRESS</label>
            <input type="email" id="wa-email" placeholder="Enter your email address" style="
              background: #0b1426; border: none; border-bottom: 1px solid #334155;
              color: #ffffff; padding: 8px 0; font-size: 14px; outline: none; transition: border-color 0.2s;
            ">
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 11px; font-weight: 800; color: #c8a45e; letter-spacing: 0.1em; text-transform: uppercase;">SERVICE OF INTEREST</label>
            <div style="position: relative;">
              <select id="wa-service" style="
                width: 100%; background: #0b1426; border: none; border-bottom: 1px solid #334155;
                color: #ffffff; padding: 8px 0; font-size: 14px; outline: none; appearance: none; cursor: pointer;
              ">
                <option value="Audit & Assurance" style="background:#0b1426; color:#fff;">Audit & Assurance</option>
                <option value="Taxation" style="background:#0b1426; color:#fff;">Taxation</option>
                <option value="Business Advisory" style="background:#0b1426; color:#fff;">Business Advisory</option>
                <option value="Virtual CFO" style="background:#0b1426; color:#fff;">Virtual CFO</option>
                <option value="Accounting & Bookkeeping" style="background:#0b1426; color:#fff;">Accounting & Bookkeeping</option>
                <option value="Company Law & ROC" style="background:#0b1426; color:#fff;">Company Law & ROC</option>
                <option value="Startup Advisory" style="background:#0b1426; color:#fff;">Startup Advisory</option>
                <option value="Regulatory Compliance" style="background:#0b1426; color:#fff;">Regulatory Compliance</option>
                <option value="Transaction Advisory" style="background:#0b1426; color:#fff;">Transaction Advisory</option>
                <option value="Risk Advisory" style="background:#0b1426; color:#fff;">Risk Advisory</option>
                <option value="Valuation" style="background:#0b1426; color:#fff;">Valuation</option>
                <option value="Wealth Advisory" style="background:#0b1426; color:#fff;">Wealth Advisory</option>
              </select>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 11px; font-weight: 800; color: #c8a45e; letter-spacing: 0.1em; text-transform: uppercase;">YOUR MESSAGE</label>
            <textarea id="wa-message" rows="3" placeholder="Briefly describe your requirements..." style="
              background: #0b1426; border: none; border-bottom: 1px solid #334155;
              color: #ffffff; padding: 8px 0; font-size: 14px; outline: none; resize: none; font-family: inherit;
            "></textarea>
          </div>

          <div style="padding-top: 10px;">
            <button type="submit" style="
              width: 100%; padding: 16px; background-color: #c8a45e; color: #0b1426;
              border: none; border-radius: 12px; font-size: 14px; font-weight: 800;
              letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
              box-shadow: 0 10px 25px -5px rgba(200, 164, 94, 0.3); transition: all 0.2s;
            ">SEND MESSAGE</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modalDiv);

    const closeBtn = document.getElementById('wa-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modalDiv.style.display = 'none';
      });
    }

    modalDiv.addEventListener('click', function(e) {
      if (e.target === modalDiv) modalDiv.style.display = 'none';
    });

    const form = document.getElementById('wa-consultation-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('wa-fullname').value.trim();
        const phone = document.getElementById('wa-phone').value.trim();
        const email = document.getElementById('wa-email').value.trim();
        const service = document.getElementById('wa-service').value;
        const message = document.getElementById('wa-message').value.trim();
        const statusMsg = document.getElementById('wa-status-msg');

        if (!fullName || !phone) {
          alert('Please enter your full name and phone number.');
          return;
        }

        const waText = `Hello Precision & Co.,\n\nI would like to book a consultation.\n\n*Full Name:* ${fullName}\n*Phone Number:* ${phone}\n*Email Address:* ${email || 'N/A'}\n*Service of Interest:* ${service}\n*Message:* ${message || 'No details provided.'}`;

        const whatsappUrl = `https://wa.me/919618757596?text=${encodeURIComponent(waText)}`;
        
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.textContent = 'Redirecting to WhatsApp...';
        }

        window.open(whatsappUrl, '_blank');

        setTimeout(function() {
          modalDiv.style.display = 'none';
          if (statusMsg) statusMsg.style.display = 'none';
          form.reset();
        }, 800);
      });
    }
  }

  window.openWhatsAppConsultationModal = function() {
    createWhatsAppModal();
    const modal = document.getElementById('whatsapp-consultation-modal');
    if (modal) modal.style.display = 'flex';
  };

  // Bind click handlers to "Book Consultation" links/buttons across website
  document.addEventListener('DOMContentLoaded', function() {
    createWhatsAppModal();
    document.addEventListener('click', function(e) {
      const target = e.target.closest('a, button');
      if (target) {
        const text = (target.textContent || '').trim().toLowerCase();
        if (text.includes('book consultation') || text.includes('book a consultation') || target.getAttribute('data-consultation-modal') === 'true') {
          e.preventDefault();
          window.openWhatsAppConsultationModal();
        }
      }
    });
  });

})();
