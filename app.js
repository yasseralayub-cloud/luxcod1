// ============================================================
// GLOBAL VARIABLES
// ============================================================
let currentSlide = 0;
let isAnimatingSlider = false;
let sliderInterval;
let currentLang = localStorage.getItem('lang') || 'ar';

// ============================================================
// TESTIMONIALS DATA
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
  const allRatings = [...firestoreRatings, ...TESTIMONIALS_DATA];
  renderTestimonials(allRatings);
}

async function fetchFirestoreRatings() {
  if (!window.firebaseDB) return [];
  try {
    const snapshot = await window.firebaseDB.collection("ratings")
      .orderBy("date", "asc")
      .limit(50)
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
    console.error("خطأ في جلب التقييمات:", error);
    return [];
  }
}

function renderTestimonials(data) {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  
  if (!track) return;
  
  let displayData = data || [];
  if (displayData.length === 0) {
    displayData = TESTIMONIALS_DATA;
  }
  
  if (displayData.length === 0) return;

  // مسح المحتوى القديم
  track.innerHTML = "";
  
  // الحل الاحترافي: استخدام appendChild داخل حلقة التكرار
  displayData.forEach(t => {
    const name = currentLang === 'ar' ? t.name_ar : t.name_en;
    const role = currentLang === 'ar' ? t.role_ar : t.role_en;
    const comment = currentLang === 'ar' ? t.comment_ar : t.comment_en;
    const starsCount = t.stars || 5;

    // إنشاء عنصر البطاقة
    const card = document.createElement('div');
    card.classList.add('testimonial-card');
    
    // إنشاء النجوم
    let starsHTML = '';
    for (let i = 0; i < starsCount; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    // إنشاء محتوى البطاقة
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
    
    // ✅ أهم سطر: إضافة البطاقة إلى المسار باستخدام appendChild
    track.appendChild(card);
  });

  // Dots - مسح القديم وإضافة الجديد
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    displayData.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentSlide) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    });
    
    // إضافة مستمعات الأحداث للنقاط
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
        resetSliderInterval();
      });
    });
  }

  // ابدأ من آخر عنصر (أحدث تقييم)
  currentSlide = Math.max(0, displayData.length - 1);
  updateSliderPosition();
  
  console.log(`✅ تم عرض ${displayData.length} تقييم بنجاح`);
}

function goToSlide(index) {
  if (isAnimatingSlider) return;
  isAnimatingSlider = true;

  const track = document.getElementById('testimonialsTrack');
  const slideCount = track ? track.children.length : 0;
  if (slideCount === 0) return;

  currentSlide = Math.max(0, Math.min(index, slideCount - 1));
  updateSliderPosition();

  setTimeout(() => { isAnimatingSlider = false; }, 500);
}

function updateSliderPosition() {
  const track = document.getElementById('testimonialsTrack');
  if (!track || track.children.length === 0) return;

  // استخدام الاتجاه الصحيح بناءً على اللغة
  const dir = currentLang === 'en' ? -1 : 1;
  
  // التأكد من أن currentSlide ضمن النطاق
  const slideCount = track.children.length;
  if (currentSlide >= slideCount) currentSlide = slideCount - 1;
  if (currentSlide < 0) currentSlide = 0;

  // تحريك السلايدر
  track.style.transform = `translateX(${dir * currentSlide * 100}%)`;

  // تحديث النقاط
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function initSlider() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const track = document.getElementById('testimonialsTrack');
      const slideCount = track ? track.children.length : 0;
      const newIndex = currentSlide > 0 ? currentSlide - 1 : (slideCount > 0 ? slideCount - 1 : 0);
      goToSlide(newIndex);
      resetSliderInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const track = document.getElementById('testimonialsTrack');
      const slideCount = track ? track.children.length : 0;
      const newIndex = currentSlide < slideCount - 1 ? currentSlide + 1 : 0;
      goToSlide(newIndex);
      resetSliderInterval();
    });
  }
}

function resetSliderInterval() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    const track = document.getElementById('testimonialsTrack');
    const slideCount = track ? track.children.length : 0;
    if (slideCount > 1) {
      goToSlide(currentSlide < slideCount - 1 ? currentSlide + 1 : 0);
    }
  }, 5000);
}

// ============================================================
// LANGUAGE SWITCHING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('lang', currentLang);
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      document.body.classList.toggle('lang-en', currentLang === 'en');
      
      // إعادة تحميل التقييمات بلغة جديدة
      loadAndRenderRatings();
      updateAllText();
    });
  }
  
  // تعيين اللغة الأولية
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  if (currentLang === 'en') document.body.classList.add('lang-en');
  
  // تحميل التقييمات
  setTimeout(() => {
    loadAndRenderRatings();
    initSlider();
  }, 1000);
  
  // تحديث التقييمات كل 30 ثانية
  setInterval(() => {
    loadAndRenderRatings();
  }, 30000);
});

// ============================================================
// TEXT UPDATES (PLACEHOLDER)
// ============================================================
function updateAllText() {
  // يتم تحديث النصوص هنا إذا لزم الأمر
}
