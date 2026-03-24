// ============================================================
// TESTIMONIALS RENDERING
// ============================================================
async function loadAndRenderRatings() {
  const firestoreRatings = await fetchFirestoreRatings();
  const allRatings = [...firestoreRatings, ...(typeof TESTIMONIALS_DATA !== 'undefined' ? TESTIMONIALS_DATA : [])];
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
  if (!track) return;
  
  let displayData = data || [];
  if (displayData.length === 0) {
    displayData = typeof TESTIMONIALS_DATA !== 'undefined' ? TESTIMONIALS_DATA : [];
  }
  
  if (displayData.length === 0) return;

  // مسح المحتوى القديم
  track.innerHTML = "";
  
  // 🎯 تقسيم التقييمات إلى 3 مجموعات
  const group1 = [];
  const group2 = [];
  const group3 = [];
  
  displayData.forEach((t, index) => {
    if (index % 3 === 0) group1.push(t);
    else if (index % 3 === 1) group2.push(t);
    else group3.push(t);
  });
  
  // دالة لإنشاء بطاقة تقييم
  const createCard = (t) => {
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
    
    return card;
  };
  
  // 🎯 إنشاء 3 مسارات متحركة
  const container = document.createElement('div');
  container.classList.add('marquee-container');
  
  // المسار الأول: من اليمين لليسار
  const track1 = document.createElement('div');
  track1.classList.add('marquee-track', 'marquee-rtl');
  group1.forEach(t => track1.appendChild(createCard(t)));
  // تكرار البطاقات لضمان حركة سلسة
  group1.forEach(t => track1.appendChild(createCard(t)));
  container.appendChild(track1);
  
  // المسار الثاني: من اليسار لليمين
  const track2 = document.createElement('div');
  track2.classList.add('marquee-track', 'marquee-ltr');
  group2.forEach(t => track2.appendChild(createCard(t)));
  group2.forEach(t => track2.appendChild(createCard(t)));
  container.appendChild(track2);
  
  // المسار الثالث: من اليمين لليسار
  const track3 = document.createElement('div');
  track3.classList.add('marquee-track', 'marquee-rtl');
  group3.forEach(t => track3.appendChild(createCard(t)));
  group3.forEach(t => track3.appendChild(createCard(t)));
  container.appendChild(track3);
  
  track.appendChild(container);
  
  console.log(`✅ تم عرض ${displayData.length} تقييم بنجاح في 3 مسارات متحركة`);
}

function goToSlide(index) {
  // ✅ تعطيل منطق التنقل بين الشرائح - لا يوجد سلايدر بعد الآن
  return;
}

function updateSliderPosition() {
  // ✅ تعطيل منطق السلايدر القديم - النظام الجديد يستخدم Marquee
  return;
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
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ تم تحميل الصفحة');
  
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
