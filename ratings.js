/* ============================================================
   LuxCod - Ratings System (Fixed & Robust Version)
   ============================================================ */

let currentRating = 0;

// Initialize Rating System
function initRatings() {
    console.log('🔄 Initializing ratings system...');
    
    const ratingStars = document.getElementById("ratingStars");
    if (!ratingStars) {
        console.error('❌ CRITICAL: ratingStars element not found');
        return;
    }
    
    const stars = ratingStars.querySelectorAll(".fa-star");
    
    stars.forEach(star => {
        // Remove existing listeners to prevent duplicates
        const newStar = star.cloneNode(true);
        star.parentNode.replaceChild(newStar, star);
        
        newStar.addEventListener("click", (e) => {
            e.stopPropagation();
            currentRating = parseInt(newStar.getAttribute("data-rating"));
            console.log(`⭐ Rating selected: ${currentRating}`);
            updateStars();
        });
        
        newStar.addEventListener("mouseover", () => {
            const hoverRating = parseInt(newStar.getAttribute("data-rating"));
            const allStars = document.querySelectorAll("#ratingStars .fa-star");
            allStars.forEach(s => {
                if (parseInt(s.getAttribute("data-rating")) <= hoverRating) {
                    s.style.color = "#fbbf24";
                } else {
                    s.style.color = "#666";
                }
            });
        });
    });
    
    ratingStars.addEventListener("mouseleave", updateStars);

    // Initial load
    loadAndRenderRatings();
    
    console.log('✅ Ratings system initialization complete');
}

function updateStars() {
    const stars = document.querySelectorAll("#ratingStars .fa-star");
    stars.forEach(star => {
        const rating = parseInt(star.getAttribute("data-rating"));
        if (rating <= currentRating) {
            star.style.color = "#fbbf24";
        } else {
            star.style.color = "#666";
        }
    });
}

// Global submit function (exposed to window)
async function submitRating() {
    console.log('🚀 submitRating function called');
    
    const nameEl = document.getElementById("ratingName");
    const commentEl = document.getElementById("ratingComment");
    const errorDiv = document.getElementById("ratingError");
    const successDiv = document.getElementById("ratingSuccess");
    const submitBtn = document.getElementById("ratingSubmitBtn");
    
    if (!nameEl || !commentEl) {
        console.error('❌ Form elements not found');
        return;
    }

    const name = nameEl.value.trim();
    const comment = commentEl.value.trim();
    
    // Reset messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validation
    if (!name || !comment || currentRating === 0) {
        const message = currentLang === 'ar' 
            ? 'يرجى ملء جميع الحقول واختيار تقييم.' 
            : 'Please fill all fields and select a rating.';
        
        showError(message);
        return;
    }
    
    // Profanity Filter
    if (typeof hasProfanity === 'function' && hasProfanity(comment)) {
        const message = currentLang === 'ar'
            ? 'عذراً، التعليق يحتوي على كلمات غير مسموح بها. يرجى تعديله.'
            : 'Sorry, the comment contains inappropriate words. Please edit it.';
        
        showError(message);
        return;
    }
    
    try {
        // Disable button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        }

        // Check Firebase
        if (!window.firebaseDB) {
            // Try one last time to get it from global firebase
            if (window.firebase && typeof window.firebase.firestore === 'function') {
                window.firebaseDB = window.firebase.firestore();
            } else {
                throw new Error("Firestore not initialized");
            }
        }

        const ratingData = {
            name: name,
            comment: comment,
            stars: currentRating,
            date: new Date().toISOString(),
            approved: true
        };
        
        console.log('💾 Saving to Firestore:', ratingData);
        
        await window.firebaseDB.collection("ratings").add(ratingData);
        
        console.log('✅ Success! Rating added.');
        
        // Show success
        successDiv.textContent = currentLang === "ar" 
            ? "شكراً لك! تم نشر تقييمك بنجاح." 
            : "Thank you! Your review has been published.";
        successDiv.style.display = "block";
        
        // Clear form
        nameEl.value = "";
        commentEl.value = "";
        currentRating = 0;
        updateStars();
        
        // الحل الصحيح: استدعاء دالة التحميل والعرض فوراً بعد نجاح الإرسال
        console.log('🔄 جاري تحديث قائمة التقييمات...');
        if (typeof loadAndRenderRatings === 'function') {
            await loadAndRenderRatings();
        } else if (typeof renderTestimonials === 'function') {
            await renderTestimonials();
        }
        
        // Hide success after delay
        setTimeout(() => {
            successDiv.style.display = "none";
        }, 5000);
        
    } catch (error) {
        console.error("❌ Firestore Error:", error);
        showError(currentLang === "ar" 
            ? "حدث خطأ أثناء الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً." 
            : "Database connection error. Please try again later.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.textContent = currentLang === 'ar' ? 'إرسال التقييم' : 'Submit Rating';
        }
    }
}

function showError(msg) {
    const errorDiv = document.getElementById("ratingError");
    if (errorDiv) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    console.warn('⚠️ User Error:', msg);
}

// Load ratings
async function loadAndRenderRatings() {
    try {
        if (!window.firebaseDB) return;

        const snapshot = await window.firebaseDB.collection("ratings")
            .orderBy("date", "asc")
            .limit(50)
            .get();
        
        const ratings = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            ratings.push({
                id: doc.id,
                name_ar: data.name,
                name_en: data.name,
                role_ar: "عميل",
                role_en: "Client",
                comment_ar: data.comment,
                comment_en: data.comment,
                stars: data.stars || 5,
                avatar: data.name.charAt(0).toUpperCase()
            });
        });

        if (ratings.length > 0) {
            window.TESTIMONIALS_DATA = ratings;
            if (typeof renderTestimonials === 'function') {
                console.log('🔄 Re-rendering testimonials with new data...');
                await renderTestimonials();
            }
        }
    } catch (e) {
        console.error("Error loading ratings:", e);
    }
}

// Attach to window for global access
window.submitRating = submitRating;

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Wait for potential firebase-config initialization
    setTimeout(initRatings, 1000);
    
    const btn = document.getElementById("ratingSubmitBtn");
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            submitRating();
        });
    }
});
