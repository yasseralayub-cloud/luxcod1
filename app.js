/* ============================================================
   LuxCod - Main Application JavaScript
   ============================================================ */

'use strict';

// ---- STATE ----
let currentLang = 'ar';
let currentSlide = 0;
let sliderInterval = null;
let isAnimatingSlider = false;

// ============================================================
// LANGUAGE SYSTEM
// ============================================================
function setLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;
  const body = document.body;

  if (lang === 'en') {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    body.classList.add('lang-en');
    body.classList.remove('lang-ar');
    document.getElementById('langToggle').textContent = 'AR';
  } else {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    body.classList.remove('lang-en');
    body.classList.add('lang-ar');
    document.getElementById('langToggle').textContent = 'EN';
  }

  // Update all translatable elements
  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null && text !== '') {
      el.textContent = text;
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute('data-' + lang + '-placeholder') || '';
  });

  // Update page title
  document.title = lang === 'ar'
    ? 'LuxCod | نبني تجارب رقمية تنمو بها أعمالك'
    : 'LuxCod | We Build Digital Experiences That Grow Your Business';

  // Re-render dynamic content
  renderPortfolio();
  renderTestimonials();

  // Update WhatsApp float tooltip
  const waTooltip = document.querySelector('.wa-tooltip');
  if (waTooltip) {
    waTooltip.textContent = lang === 'ar' ? 'تحدث معنا الآن!' : 'Chat with us now!';
  }

  // Save preference
  localStorage.setItem('luxcod-lang', lang);
}

// ============================================================
// NAVBAR
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ============================================================
// HERO CANVAS ANIMATION
// ============================================================
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(201,169,110,${this.opacity})`
        : `rgba(139,92,246,${this.opacity})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,169,110,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  const resizeObserver = new ResizeObserver(() => {
    resize();
    initParticles();
  });
  resizeObserver.observe(canvas.parentElement);
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }

    requestAnimationFrame(update);
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  const revealElements = [
    '.why-card',
    '.service-card',
    '.portfolio-card',
    '.check-item',
    '.contact-method',
    '.section-header',
    '.contact-form-wrap',
    '.contact-info'
  ];

  const allReveal = document.querySelectorAll(revealElements.join(','));
  allReveal.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 0.08 + 's';
  });

  let countersDone = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  allReveal.forEach(el => observer.observe(el));

  // Counter observer
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersDone) {
        countersDone = true;
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });
    counterObserver.observe(heroStats);
  }
}

// ============================================================
// PORTFOLIO RENDER
// ============================================================
function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid || typeof PORTFOLIO_DATA === 'undefined') return;

  const icons = ['fa-laptop-code', 'fa-spa', 'fa-star'];
  const colors = ['#c9a96e', '#8b5cf6', '#ef4444'];

  grid.innerHTML = PORTFOLIO_DATA.map((project, i) => {
    const name = currentLang === 'ar' ? project.name_ar : project.name_en;
    const desc = currentLang === 'ar' ? project.desc_ar : project.desc_en;
    const category = currentLang === 'ar' ? project.category_ar : project.category_en;
    const color = project.color || colors[i % colors.length];
    const icon = icons[i % icons.length];

    const linkBtn = project.url
      ? `<a href="${project.url}" target="_blank" rel="noopener" class="portfolio-link">
           <span>${currentLang === 'ar' ? 'زيارة الموقع' : 'Visit Site'}</span>
           <i class="fa-solid fa-arrow-up-right-from-square"></i>
         </a>`
      : `<span class="portfolio-no-link">
           <i class="fa-solid fa-clock"></i>
           <span>${currentLang === 'ar' ? 'قريباً' : 'Coming Soon'}</span>
         </span>`;

    return `
      <div class="portfolio-card reveal">
        <div class="portfolio-thumb">
          <div class="portfolio-thumb-bg" style="background: radial-gradient(circle at center, ${color} 0%, transparent 70%)"></div>
          <div class="portfolio-thumb-icon">
            <i class="fa-solid ${icon}"></i>
          </div>
          <span class="portfolio-category">${category}</span>
        </div>
        <div class="portfolio-body">
          <h3>${name}</h3>
          <p>${desc}</p>
          ${linkBtn}
        </div>
      </div>
    `;
  }).join('');

  // Re-observe new elements
  const newCards = grid.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  newCards.forEach(card => observer.observe(card));
}

// ============================================================
// TESTIMONIALS SLIDER
// ============================================================
function renderTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || typeof TESTIMONIALS_DATA === 'undefined') return;

  track.innerHTML = TESTIMONIALS_DATA.map(t => {
    const name = currentLang === 'ar' ? t.name_ar : t.name_en;
    const role = currentLang === 'ar' ? t.role_ar : t.role_en;
    const comment = currentLang === 'ar' ? t.comment_ar : t.comment_en;
    const stars = '★'.repeat(t.stars || 5);

    return `
      <div class="testimonial-card">
        <div class="testimonial-inner">
          <div class="testimonial-stars">
            ${Array(t.stars || 5).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <p class="testimonial-comment">"${comment}"</p>
          <div class="testimonial-author">
            <div class="author-avatar">${t.avatar || name.slice(0,2)}</div>
            <div class="author-info">
              <h4>${name}</h4>
              <span>${role}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = TESTIMONIALS_DATA.map((_, i) =>
      `<div class="dot ${i === currentSlide ? 'active' : ''}" data-index="${i}"></div>`
    ).join('');

    dotsContainer.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
        resetSliderInterval();
      });
    });
  }

  updateSliderPosition();
}

function goToSlide(index) {
  if (isAnimatingSlider) return;
  isAnimatingSlider = true;

  currentSlide = Math.max(0, Math.min(index, TESTIMONIALS_DATA.length - 1));
  updateSliderPosition();

  setTimeout(() => { isAnimatingSlider = false; }, 500);
}

function updateSliderPosition() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  const dir = currentLang === 'en' ? 1 : -1;
  track.style.transform = `translateX(${dir * currentSlide * 100}%)`;

  // Update dots
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function initSlider() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = currentSlide > 0 ? currentSlide - 1 : TESTIMONIALS_DATA.length - 1;
      goToSlide(newIndex);
      resetSliderInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = currentSlide < TESTIMONIALS_DATA.length - 1 ? currentSlide + 1 : 0;
      goToSlide(newIndex);
      resetSliderInterval();
    });
  }

  // Touch/swipe support
  const wrapper = document.querySelector('.testimonials-wrapper');
  if (wrapper) {
    let startX = 0;
    let isDragging = false;

    wrapper.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left
          const newIndex = currentLang === 'ar'
            ? (currentSlide > 0 ? currentSlide - 1 : TESTIMONIALS_DATA.length - 1)
            : (currentSlide < TESTIMONIALS_DATA.length - 1 ? currentSlide + 1 : 0);
          goToSlide(newIndex);
        } else {
          // Swipe right
          const newIndex = currentLang === 'ar'
            ? (currentSlide < TESTIMONIALS_DATA.length - 1 ? currentSlide + 1 : 0)
            : (currentSlide > 0 ? currentSlide - 1 : TESTIMONIALS_DATA.length - 1);
          goToSlide(newIndex);
        }
        resetSliderInterval();
      }
      isDragging = false;
    }, { passive: true });
  }

  startSliderInterval();
}

function startSliderInterval() {
  sliderInterval = setInterval(() => {
    const newIndex = currentSlide < TESTIMONIALS_DATA.length - 1 ? currentSlide + 1 : 0;
    goToSlide(newIndex);
  }, 5000);
}

function resetSliderInterval() {
  clearInterval(sliderInterval);
  startSliderInterval();
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Hide previous messages
    formSuccess.style.display = 'none';
    formError.style.display = 'none';

    // Show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    if (btnIcon) btnIcon.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formSuccess.style.display = 'flex';
        form.reset();
        // Scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      formError.style.display = 'flex';
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      if (btnIcon) btnIcon.style.display = 'inline';
    }
  });

  // Input focus effects
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').classList.remove('focused');
    });
  });
}

// ============================================================
// SCROLL TO TOP
// ============================================================
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// LANGUAGE TOGGLE
// ============================================================
function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    setLanguage(currentLang === 'ar' ? 'en' : 'ar');
  });
}

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// MICRO-INTERACTIONS
// ============================================================
function initMicroInteractions() {
  // Button ripple effect
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        top: ${e.clientY - rect.top - size/2}px;
        left: ${e.clientX - rect.left - size/2}px;
        transform: scale(0);
        animation: ripple 0.6s ease;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
    .nav-links a.active { color: var(--gold) !important; }
    .form-group.focused label { color: var(--gold); }
  `;
  document.head.appendChild(style);
}

// ============================================================
// LAZY LOADING IMAGES
// ============================================================
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved language preference
  const savedLang = localStorage.getItem('luxcod-lang') || 'ar';

  // Initialize all modules
  initNavbar();
  initHeroCanvas();
  initScrollReveal();
  initSlider();
  initContactForm();
  initScrollTop();
  initLangToggle();
  initSmoothScroll();
  initMicroInteractions();
  initLazyLoading();

  // Render dynamic content
  renderPortfolio();
  renderTestimonials();

  // Apply saved language (after render)
  if (savedLang !== 'ar') {
    setLanguage(savedLang);
  }

  // Animate hero stats on load
  setTimeout(animateCounters, 1000);

  // Performance: preconnect hints
  ['https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'].forEach(url => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });

  console.log('%cLuxCod ✦ Premium Digital Agency', 'color: #c9a96e; font-size: 16px; font-weight: bold;');
});
