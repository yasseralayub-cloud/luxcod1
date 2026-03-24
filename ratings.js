/* ============================================================
   LuxCod - Ratings System (Firebase Firestore Integration)
   ============================================================ */

let currentRating = 0;

// Initialize Rating System
function initRatings() {
    console.log('🔄 Initializing ratings system...');
    
    const ratingStars = document.getElementById("ratingStars");
    if (!ratingStars) {
        console.warn('⚠️ ratingStars element not found');
        return;
    }
    
    const stars = ratingStars.querySelectorAll(".fa-star");
    console.log(`✅ Found ${stars.length} rating stars`);
    
    stars.forEach(star => {
        star.addEventListener("click", () => {
            currentRating = parseInt(star.getAttribute("data-rating"));
            console.log(`⭐ Rating selected: ${currentRating}`);
            updateStars();
        });
        
        star.addEventListener("mouseover", () => {
            const hoverRating = parseInt(star.getAttribute("data-rating"));
            stars.forEach(s => {
                if (parseInt(s.getAttribute("data-rating")) <= hoverRating) {
                    s.style.color = "#fbbf24";
                } else {
                    s.style.color = "#666";
                }
            });
        });
    });
    
    ratingStars.addEventListener("mouseleave", updateStars);

    // Load initial ratings
    loadAndRenderRatings();
    
    console.log('✅ Ratings system initialized');
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

// Submit Rating
async function submitRating() {
    console.log('📝 Attempting to submit rating...');
    
    const name = document.getElementById("ratingName").value.trim();
    const comment = document.getElementById("ratingComment").value.trim();
    const errorDiv = document.getElementById("ratingError");
    const successDiv = document.getElementById("ratingSuccess");
    
    // Validation
    if (!name || !comment || currentRating === 0) {
        const message = currentLang === 'ar' 
            ? 'يرجى ملء جميع الحقول واختيار تقييم.' 
            : 'Please fill all fields and select a rating.';
        
        console.warn('❌ Validation failed:', { name: !!name, comment: !!comment, rating: currentRating });
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    // Check for profanity
    if (typeof hasProfanity === 'function' && hasProfanity(comment)) {
        const message = currentLang === 'ar'
            ? 'التعليق يحتوي على كلمات غير مناسبة. يرجى تعديل تعليقك.'
            : 'Comment contains inappropriate words. Please edit your comment.';
        
        console.warn('❌ Profanity detected in comment');
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    try {
        errorDiv.style.display = "none";
        
        // Check Firebase initialization
        if (!window.firebaseDB) {
            throw new Error("Firebase DB not initialized");
        }

        console.log('💾 Saving rating to Firestore...');
        
        const ratingData = {
            name: name,
            comment: comment,
            stars: currentRating,
            date: new Date().toISOString(),
            approved: true
        };
        
        const docRef = await window.firebaseDB.collection("ratings").add(ratingData);
        
        console.log('✅ Rating saved successfully:', docRef.id);
        
        successDiv.textContent = currentLang === "ar" 
            ? "شكراً لتقييمك! تم إضافة تقييمك بنجاح" 
            : "Thank you for your rating! Your review has been added successfully";
        successDiv.style.display = "block";
        
        // Clear form
        document.getElementById("ratingName").value = "";
        document.getElementById("ratingComment").value = "";
        currentRating = 0;
        updateStars();
        
        // Refresh the testimonials slider
        console.log('🔄 Refreshing testimonials...');
        if (typeof renderTestimonials === 'function') {
            await renderTestimonials();
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successDiv.style.display = "none";
        }, 3000);
        
    } catch (error) {
        console.error("❌ Rating error:", error);
        errorDiv.textContent = currentLang === "ar" 
            ? "حدث خطأ. يرجى المحاولة مرة أخرى" 
            : "An error occurred. Please try again";
        errorDiv.style.display = "block";
    }
}

// Load and Render Ratings from Firestore to Testimonials Slider
async function loadAndRenderRatings() {
    try {
        console.log('📥 Loading ratings from Firestore...');
        
        if (!window.firebaseDB) {
            console.warn('⚠️ Firebase DB not initialized yet');
            return;
        }

        const snapshot = await window.firebaseDB.collection("ratings")
            .orderBy("date", "desc")
            .limit(10)
            .get();
        
        console.log(`✅ Loaded ${snapshot.docs.length} ratings`);
        
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

        // Update the global TESTIMONIALS_DATA if it exists
        if (ratings.length > 0) {
            console.log('📊 Updating testimonials display...');
            window.TESTIMONIALS_DATA = ratings;
            
            if (typeof renderTestimonials === 'function') {
                await renderTestimonials();
            }
        } else {
            console.log('ℹ️ No ratings found, using default testimonials');
        }
        
    } catch (error) {
        console.error("❌ Error loading ratings:", error);
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 DOM Content Loaded - Initializing ratings...');
    
    // Wait a bit for Firebase to initialize
    setTimeout(() => {
        initRatings();
        
        const submitBtn = document.getElementById("ratingSubmitBtn") ||
                         document.querySelector("button[data-ar='إرسال التقييم']");
        
        if (submitBtn) {
            console.log('✅ Submit button found, attaching listener');
            submitBtn.addEventListener("click", (e) => {
                e.preventDefault();
                submitRating();
            });
        } else {
            console.warn('⚠️ Submit button not found');
        }
    }, 500);
});

console.log("✅ Ratings System with Firebase Firestore loaded successfully");
