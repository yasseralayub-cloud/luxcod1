/* ============================================================
   LuxCod - Rating System
   ============================================================ */

'use strict';

let userRatings = {};

// ============================================================
// CREATE RATING MODAL
// ============================================================
function createRatingModal() {
  const modal = document.createElement('div');
  modal.id = 'ratingModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content rating-modal">
      <button class="modal-close" onclick="closeRatingModal()">
        <i class="fa-solid fa-times"></i>
      </button>
      
      <h2 data-ar="قيّم خدماتنا" data-en="Rate Our Services">قيّم خدماتنا</h2>
      <p class="rating-subtitle" data-ar="ساعدنا في التحسن برأيك الصريح" data-en="Help us improve with your honest feedback">ساعدنا في التحسن برأيك الصريح</p>

      <form id="ratingForm" onsubmit="submitRating(event)">
        <div class="form-group">
          <label data-ar="الاسم (اختياري)" data-en="Name (Optional)">الاسم (اختياري)</label>
          <input type="text" id="ratingName" placeholder="أحمد محمد">
        </div>

        <div class="form-group">
          <label data-ar="التقييم" data-en="Rating">التقييم</label>
          <div class="star-rating" id="starRating">
            ${[1, 2, 3, 4, 5].map(i => `
              <button type="button" class="star" data-value="${i}" onclick="setRating(${i})">
                <i class="fa-solid fa-star"></i>
              </button>
            `).join('')}
          </div>
          <div class="rating-value" id="ratingValue">
            <span data-ar="اختر التقييم" data-en="Select Rating">اختر التقييم</span>
          </div>
        </div>

        <div class="form-group">
          <label data-ar="تعليقك" data-en="Your Comment">تعليقك</label>
          <textarea id="ratingComment" placeholder="أخبرنا برأيك..." rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label class="checkbox">
            <input type="checkbox" id="ratingPublish" checked>
            <span data-ar="نشر التقييم على الموقع" data-en="Publish rating on website">نشر التقييم على الموقع</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-full">
          <span data-ar="إرسال التقييم" data-en="Submit Rating">إرسال التقييم</span>
        </button>

        <div id="ratingError" class="auth-error"></div>
        <div id="ratingSuccess" class="auth-success"></div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeRatingModal();
  });
}

function openRatingModal() {
  if (!currentUser) {
    openAuthModal('signup');
    return;
  }

  let modal = document.getElementById('ratingModal');
  if (!modal) {
    createRatingModal();
    modal = document.getElementById('ratingModal');
  }
  modal.classList.add('active');
}

function closeRatingModal() {
  const modal = document.getElementById('ratingModal');
  if (modal) modal.classList.remove('active');
}

// ============================================================
// RATING HANDLER
// ============================================================
let selectedRating = 0;

function setRating(value) {
  selectedRating = value;
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, i) => {
    if (i < value) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });

  const labels = ['', '1 - سيء جداً', '2 - سيء', '3 - متوسط', '4 - جيد', '5 - ممتاز'];
  const labelsEn = ['', '1 - Very Bad', '2 - Bad', '3 - Average', '4 - Good', '5 - Excellent'];
  const label = currentLang === 'ar' ? labels[value] : labelsEn[value];
  
  document.getElementById('ratingValue').textContent = label;
}

async function submitRating(e) {
  e.preventDefault();

  if (selectedRating === 0) {
    document.getElementById('ratingError').textContent = 
      currentLang === 'ar' ? 'يرجى اختيار تقييم' : 'Please select a rating';
    return;
  }

  const name = document.getElementById('ratingName').value || currentUser.displayName || 'عميل';
  const comment = document.getElementById('ratingComment').value;
  const publish = document.getElementById('ratingPublish').checked;

  try {
    document.getElementById('ratingError').textContent = '';
    document.getElementById('ratingSuccess').textContent = '';

    const ratingData = {
      userId: currentUser.uid,
      name: name,
      email: currentUser.email,
      rating: selectedRating,
      comment: comment,
      publish: publish,
      createdAt: new Date(),
      approved: false
    };

    // Save to Firestore
    const docRef = await firebase.firestore().collection('ratings').add(ratingData);

    // Update user ratings array
    const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
    await userRef.update({
      ratings: firebase.firestore.FieldValue.arrayUnion(docRef.id)
    });

    document.getElementById('ratingSuccess').textContent = 
      currentLang === 'ar' 
        ? 'شكراً! تم إرسال تقييمك بنجاح. سيتم نشره بعد المراجعة.' 
        : 'Thank you! Your rating has been submitted successfully. It will be published after review.';

    // Reset form
    setTimeout(() => {
      document.getElementById('ratingForm').reset();
      selectedRating = 0;
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      setTimeout(closeRatingModal, 1500);
    }, 2000);

  } catch (error) {
    console.error('Rating error:', error);
    document.getElementById('ratingError').textContent = 
      currentLang === 'ar' ? 'حدث خطأ في إرسال التقييم' : 'Error submitting rating';
  }
}

// ============================================================
// LOAD PUBLISHED RATINGS
// ============================================================
async function loadPublishedRatings() {
  try {
    const snapshot = await firebase.firestore()
      .collection('ratings')
      .where('publish', '==', true)
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const ratings = [];
    snapshot.forEach(doc => {
      ratings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return ratings;
  } catch (error) {
    console.error('Error loading ratings:', error);
    return [];
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Create modal if it doesn't exist
  if (!document.getElementById('ratingModal')) {
    createRatingModal();
  }
});
