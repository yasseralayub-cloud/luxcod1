// ============================================================
// GLOBAL VARIABLES
// ============================================================
let currentSlide = 0;
let isAnimatingSlider = false;
let sliderInterval;
let currentLang = localStorage.getItem('lang') || 'ar';

// ============================================================
// TESTIMONIALS DATA (التعليقات الأصلية)
// ============================================================
const TESTIMONIALS_DATA = [
  {
    name_ar: "أحمد محمد",
    name_en: "Ahmed Mohammed",
    role_ar: "مالك متجر إلكتروني",
    role_en: "E-commerce Owner",
    comment_ar: "زيادة المبيعات بنسبة 300% بعد إعادة تصميم الموقع. فريق LuxCod احترافي جداً!",
    comment_en: "300% increase in sales after website redesign. LuxCod team is very professional!",
    stars: 5,
    avatar: "أح"
  },
  {
    name_ar: "فاطمة علي",
    name_en: "Fatima Ali",
    role_ar: "مديرة تسويق رقمي",
    role_en: "Digital Marketing Manager",
    comment_ar: "الموقع سريع جداً وجميل. عملاؤنا أحبوه من أول نظرة!",
    comment_en: "The website is very fast and beautiful. Our clients loved it at first sight!",
    stars: 5,
    avatar: "فع"
  },
  {
    name_ar: "محمود حسن",
    name_en: "Mahmoud Hassan",
    role_ar: "صاحب شركة استشارات",
    role_en: "Consulting Firm Owner",
    comment_ar: "أفضل استثمار قمت به. الموقع يعمل 24/7 ويجلب لي عملاء جدد كل يوم.",
    comment_en: "Best investment I made. The website works 24/7 and brings me new clients daily.",
    stars: 5,
    avatar: "مح"
  }
];

// ============================================================
// TESTIMONIALS RENDERING
// ============================================================
async function loadAndRenderRatings() {
  const firestoreRatings = await fetchFirestoreRatings();
  // دمج التعليقات الجديدة من Firestore مع التعليقات الأصلية
  const allRatings = [...firestoreRatings, ...TESTIMONIALS_DATA];
  renderTestimonials(allRatings);
}

async function fetchFirestoreRatings() {
  if (!window.firebaseDB) return [];
  try {
    const snapshot = await window.firebaseDB.collection("ratings")
      .orderBy("date", "desc") // الأحدث أولاً للتعليقات الجديدة
      .limit(10)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name_ar: data.name || "عميل",
        name_en: data.name || "Client",
        role_ar: "عميل LuxCod",
        role_en: "LuxCod Client",
        comment_ar: data.comment || "",
        comment_en: data.comment || "",
        stars: data.stars || 5,
        avatar: (data.name || "").slice(0, 2).toUpperCase()
      };
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return [];
  }
}

function renderTestimonials(data) {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  
  if (!track) return;
  
  const displayData = data || TESTIMONIALS_DATA;
  track.innerHTML = "";
  
  displayData.forEach((t, index) => {
    const name = currentLang === 'ar' ? t.name_ar : t.name_en;
    const role = currentLang === 'ar' ? t.role_ar : t.role_en;
    const comment = currentLang === 'ar' ? t.comment_ar : t.comment_en;
    const starsCount = t.stars || 5;

    const card = document.createElement('div');
    card.classList.add('testimonial-card');
    
    let starsHTML = '';
    for (let i = 0; i < starsCount; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    card.innerHTML = `
      <div class="testimonial-inner">
        <div class="testimonial-stars">
          ${starsHTML}
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
    `;
    track.appendChild(card);
  });

  // Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    displayData.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentSlide) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetSliderInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  updateSliderPosition();
}

function goToSlide(index) {
  if (isAnimatingSlider) return;
  isAnimatingSlider = true;

  const track = document.getElementById('testimonialsTrack');
  const slideCount = track ? track.children.length : 0;
  
  currentSlide = (index + slideCount) % slideCount;
  updateSliderPosition();

  setTimeout(() => { isAnimatingSlider = false; }, 500);
}

function updateSliderPosition() {
  const track = document.getElementById('testimonialsTrack');
  if (!track || track.children.length === 0) return;

  const dir = currentLang === 'en' ? 1 : -1;
  track.style.transform = `translateX(${dir * currentSlide * 100}%)`;

  // Update dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function initSlider() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetSliderInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetSliderInterval();
    });
  }
}

function resetSliderInterval() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}

// ============================================================
// LANGUAGE SWITCHING
// ============================================================
function updateLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-en', currentLang === 'en');
  
  // تحديث النصوص في الموقع
  document.querySelectorAll('[data-ar]').forEach(el => {
    const text = currentLang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const placeholder = currentLang === 'ar' ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
        if (placeholder) el.placeholder = placeholder;
    } else {
        // الحفاظ على الأيقونات إذا وجدت
        const icon = el.querySelector('i');
        if (icon) {
            const btnText = el.querySelector('.btn-text');
            if (btnText) btnText.textContent = text;
        } else {
            el.textContent = text;
        }
    }
  });

  loadAndRenderRatings();
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('lang', currentLang);
      updateLanguage();
    });
  }

  updateLanguage();
  initSlider();
  resetSliderInterval();
});

// نافذة الواتساب والأرقام الإحصائية (إعادة المنطق الأصلي)
// ... (أي كود إضافي للأرقام المتحركة إذا كان موجوداً في الأصل)
