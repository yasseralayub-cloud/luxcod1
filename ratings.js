// ============================================================
// LUXCOD RATINGS SYSTEM (FIREBASE INTEGRATION)
// ============================================================

// قائمة الكلمات النابية (فلترة المحتوى)
const PROFANITY_LIST = [
    'كلب', 'حمار', 'غبي', 'حقير', 'تفه', 'لعن', 'كذاب', 'نصاب', 'سارق',
    'dog', 'donkey', 'stupid', 'bastard', 'curse', 'liar', 'scammer', 'thief',
    'شتم', 'سب', 'قذر', 'fuck', 'shit', 'asshole', 'bitch'
];

let currentRatingValue = 5; // الافتراضي 5 نجوم

function containsProfanity(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return PROFANITY_LIST.some(word => lowerText.includes(word));
}

// تهيئة النجوم عند تحميل الصفحة
function initRatingStars() {
    const stars = document.querySelectorAll('#ratingStars i');
    if (!stars.length) return;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRatingValue = parseInt(star.getAttribute('data-rating'));
            updateStarsUI(currentRatingValue);
        });
        
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            updateStarsUI(hoverRating);
        });
    });

    const starsContainer = document.getElementById('ratingStars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', () => {
            updateStarsUI(currentRatingValue);
        });
    }
    
    // التفعيل الأولي لـ 5 نجوم
    updateStarsUI(5);
}

function updateStarsUI(rating) {
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach((s, i) => {
        if (i < rating) {
            s.classList.add('active');
            s.style.color = '#fbbf24';
        } else {
            s.classList.remove('active');
            s.style.color = '#666';
        }
    });
}

// إرسال التقييم إلى Firestore
async function submitRating() {
    const nameInput = document.getElementById('ratingName');
    const commentInput = document.getElementById('ratingComment');
    const errorDiv = document.getElementById('ratingError');
    const successDiv = document.getElementById('ratingSuccess');
    
    // إخفاء الرسائل السابقة
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';

    const name = nameInput ? nameInput.value.trim() : "";
    const comment = commentInput ? commentInput.value.trim() : "";
    
    // التحقق من البيانات
    if (!name || !comment) {
        showRatingError(window.currentLang === 'ar' ? "يرجى إدخال الاسم والتعليق." : "Please enter your name and comment.");
        return;
    }

    // التحقق من الكلمات النابية
    if (containsProfanity(name) || containsProfanity(comment)) {
        showRatingError(window.currentLang === 'ar' ? "عذراً، لا يسمح باستخدام كلمات غير لائقة." : "Sorry, profanity is not allowed.");
        return;
    }

    // التأكد من تهيئة Firebase
    if (!window.firebaseDB) {
        showRatingError(window.currentLang === 'ar' ? "خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً." : "Database connection error. Please try again later.");
        return;
    }

    try {
        await window.firebaseDB.collection("ratings").add({
            name: name,
            comment: comment,
            stars: currentRatingValue,
            date: new Date().toISOString(),
            approved: true
        });

        // نجاح الإرسال
        if (successDiv) {
            successDiv.textContent = window.currentLang === 'ar' ? "تم إرسال تقييمك بنجاح! شكراً لك." : "Rating submitted successfully! Thank you.";
            successDiv.style.display = 'block';
        }
        
        // مسح الحقول
        if (nameInput) nameInput.value = "";
        if (commentInput) commentInput.value = "";
        currentRatingValue = 5;
        updateStarsUI(5);

        // تحديث السلايدر إذا كان متاحاً
        if (typeof loadAndRenderRatings === 'function') {
            loadAndRenderRatings();
        }

        // إخفاء رسالة النجاح بعد فترة
        setTimeout(() => {
            if (successDiv) successDiv.style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error("Error adding rating: ", error);
        showRatingError(window.currentLang === 'ar' ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again.");
    }
}

function showRatingError(msg) {
    const errorDiv = document.getElementById('ratingError');
    if (errorDiv) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert(msg);
    }
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initRatingStars);
