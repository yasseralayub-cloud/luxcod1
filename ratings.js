/* ============================================================
   LuxCod - Ratings System (Firebase Firestore Integration)
   ============================================================ */

let currentRating = 0;

// Initialize Rating System
function initRatings() {
    const ratingStars = document.getElementById("ratingStars");
    if (!ratingStars) return;
    const stars = ratingStars.querySelectorAll(".fa-star");
    
    stars.forEach(star => {
        star.addEventListener("click", () => {
            currentRating = parseInt(star.getAttribute("data-rating"));
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
    const name = document.getElementById("ratingName").value.trim();
    const comment = document.getElementById("ratingComment").value.trim();
    const errorDiv = document.getElementById("ratingError");
    const successDiv = document.getElementById("ratingSuccess");
    
    if (!name || !comment || currentRating === 0) {
        const message = currentLang === 'ar' ? 'يرجى ملء جميع الحقول واختيار تقييم.' : 'Please fill all fields and select a rating.';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    try {
        errorDiv.style.display = "none";
        
        if (!window.firebaseDB) {
            throw new Error("Firebase DB not initialized");
        }

        await window.firebaseDB.collection("ratings").add({
            name: name,
            comment: comment,
            stars: currentRating,
            date: new Date().toISOString(),
            approved: true // Auto-approve for now as requested
        });
        
        successDiv.textContent = currentLang === "ar" 
            ? "شكراً لتقييمك! تم إضافة تقييمك بنجاح" 
            : "Thank you for your rating! Your review has been added successfully";
        successDiv.style.display = "block";
        
        document.getElementById("ratingName").value = "";
        document.getElementById("ratingComment").value = "";
        currentRating = 0;
        updateStars();
        
        // Refresh the testimonials slider
        if (typeof renderTestimonials === 'function') {
            renderTestimonials();
        }
        
        setTimeout(() => {
            successDiv.style.display = "none";
        }, 3000);
    } catch (error) {
        console.error("Rating error:", error);
        errorDiv.textContent = currentLang === "ar" 
            ? "حدث خطأ. يرجى المحاولة مرة أخرى" 
            : "An error occurred. Please try again";
        errorDiv.style.display = "block";
    }
}

// Load and Render Ratings from Firestore to Testimonials Slider
async function loadAndRenderRatings() {
    try {
        if (!window.firebaseDB) return;

        const snapshot = await window.firebaseDB.collection("ratings")
            .orderBy("date", "desc")
            .limit(10)
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

        // Update the global TESTIMONIALS_DATA if it exists
        if (typeof TESTIMONIALS_DATA !== 'undefined' && ratings.length > 0) {
            // Merge with existing or replace? User said "better than external solution", 
            // likely wants to see their real ratings.
            window.TESTIMONIALS_DATA = ratings;
            if (typeof renderTestimonials === 'function') {
                renderTestimonials();
            }
        }
    } catch (error) {
        console.error("Error loading ratings:", error);
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initRatings();
    const submitBtn = document.querySelector("#ratingForm button");
    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            submitRating();
        });
    }
});

console.log("✅ Ratings System with Firebase Firestore linked successfully");
