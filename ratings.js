/* ============================================================
   LuxCod - Ratings System (FIXED & SIMPLIFIED)
   ============================================================ */

'use strict';

let currentRating = 0;

// Initialize Rating System
function initRatings() {
  const ratingStars = document.getElementById('ratingStars');
  if (!ratingStars) return;

  const stars = ratingStars.querySelectorAll('.fa-star');
  
  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.getAttribute('data-rating'));
      updateStars();
    });
    
    star.addEventListener('mouseover', () => {
      const hoverRating = parseInt(star.getAttribute('data-rating'));
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-rating')) <= hoverRating) {
          s.style.color = '#fbbf24';
        } else {
          s.style.color = '#666';
        }
      });
    });
  });

  ratingStars.addEventListener('mouseleave', updateStars);
}

function updateStars() {
  const stars = document.querySelectorAll('#ratingStars .fa-star');
  stars.forEach(star => {
    const rating = parseInt(star.getAttribute('data-rating'));
    if (rating <= currentRating) {
      star.style.color = '#fbbf24';
    } else {
      star.style.color = '#666';
    }
  });
}

// Submit Rating
async function submitRating() {
  const name = document.getElementById('ratingName').value.trim();
  const comment = document.getElementById('ratingComment').value.trim();
  const errorDiv = document.getElementById('ratingError');
  const successDiv = document.getElementById('ratingSuccess');

  // Validation
  if (!name) {
    errorDiv.textContent = currentLang === 'ar' ? 'الاسم إجباري' : 'Name is required';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }

  if (currentRating === 0) {
    errorDiv.textContent = currentLang === 'ar' ? 'يرجى اختيار تقييم' : 'Please select a rating';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }

  if (!comment) {
    errorDiv.textContent = currentLang === 'ar' ? 'التعليق إجباري' : 'Comment is required';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }

  try {
    errorDiv.style.display = 'none';
    
    // Add new rating to TESTIMONIALS_DATA
    const newRating = {
      id: TESTIMONIALS_DATA.length + 1,
      name_ar: name,
      name_en: name,
      role_ar: 'عميل',
      role_en: 'Client',
      comment_ar: comment,
      comment_en: comment,
      stars: currentRating,
      avatar: name.charAt(0)
    };

    TESTIMONIALS_DATA.push(newRating);
    
    // Show success message
    successDiv.textContent = currentLang === 'ar' 
      ? 'شكراً لتقييمك! تم إضافة تقييمك بنجاح' 
      : 'Thank you for your rating! Your review has been added successfully';
    successDiv.style.display = 'block';

    // Reset form
    document.getElementById('ratingName').value = '';
    document.getElementById('ratingComment').value = '';
    currentRating = 0;
    updateStars();

    // Re-render testimonials
    renderTestimonials();

    // Hide success message after 3 seconds
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('Rating error:', error);
    errorDiv.textContent = currentLang === 'ar' 
      ? 'حدث خطأ. يرجى المحاولة مرة أخرى' 
      : 'An error occurred. Please try again';
    errorDiv.style.display = 'block';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initRatings);

console.log('✅ Ratings System loaded successfully');
