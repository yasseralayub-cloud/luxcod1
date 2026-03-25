/* ============================================================
   LuxCod - Ratings System (Firebase Firestore Integration)
   ============================================================ */

// Firebase App و Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// إعداد المشروع
const firebaseConfig = {
  apiKey: "AIzaSyD46R7Mei7ANhzqSyihJVtxO6YQsiZls8s",
  authDomain: "luxcod-ratings.firebaseapp.com",
  projectId: "luxcod-ratings",
  storageBucket: "luxcod-ratings.firebasestorage.app",
  messagingSenderId: "195575730935",
  appId: "1:195575730935:web:7598414c4134e71f04b9f2",
  measurementId: "G-HB3PTKE582"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ratingsCollection = collection(db, "ratings");

// قائمة الكلمات النابية (فلترة المحتوى)
const PROFANITY_LIST = [
    'كلب', 'حمار', 'غبي', 'حقير', 'تفه', 'لعن', 'كذاب', 'نصاب', 'سارق',
    'dog', 'donkey', 'stupid', 'bastard', 'curse', 'liar', 'scammer', 'thief',
    'شتم', 'سب', 'قذر', 'fuck', 'shit', 'asshole', 'bitch'
];

let currentRating = 0;

function containsProfanity(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return PROFANITY_LIST.some(word => lowerText.includes(word));
}

// Initialize Rating System
function initRatings() {
  console.log("initRatings called");
  const ratingStars = document.getElementById("ratingStars");
  if (!ratingStars) {
    console.log("ratingStars element not found");
    return;
  }
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

  loadAndRenderRatings();
  console.log("loadAndRenderRatings called from initRatings");
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
  console.log("submitRating called");
  const name = document.getElementById("ratingName").value.trim();
  const comment = document.getElementById("ratingComment").value.trim();
  const errorDiv = document.getElementById("ratingError");
  const successDiv = document.getElementById("ratingSuccess");
  
  if (!name || !comment || currentRating === 0) {
      console.log("Validation failed: name, comment, or rating missing");
      const message = currentLang === 'ar' ? 'يرجى ملء جميع الحقول واختيار تقييم.' : 'Please fill all fields and select a rating.';
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      successDiv.style.display = 'none';
      return;
  }

  if (containsProfanity(name) || containsProfanity(comment)) {
      const message = currentLang === 'ar' ? 'عذراً، لا يسمح باستخدام كلمات غير لائقة.' : 'Sorry, profanity is not allowed.';
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      successDiv.style.display = 'none';
      return;
  }
  
  try {
    errorDiv.style.display = "none";
    
    console.log("Attempting to add document to Firestore");
    await addDoc(ratingsCollection, {
      name: name,
      comment: comment,
      stars: currentRating,
      date: new Date().toISOString(),
      approved: true // Assuming auto-approval for now
    });
    
    successDiv.textContent = currentLang === "ar" 
      ? "شكراً لتقييمك! تم إضافة تقييمك بنجاح" 
      : "Thank you for your rating! Your review has been added successfully";
    successDiv.style.display = "block";
    
    document.getElementById("ratingName").value = "";
    document.getElementById("ratingComment").value = "";
    currentRating = 0;
    updateStars();
    
    loadAndRenderRatings();
    console.log("loadAndRenderRatings called after submit");
    
    setTimeout(() => {
      successDiv.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error("Rating submission error:", error);
    errorDiv.textContent = currentLang === "ar" 
      ? "حدث خطأ. يرجى المحاولة مرة أخرى" 
      : "An error occurred. Please try again";
    errorDiv.style.display = "block";
  }
}

// Load and Render Ratings from Firestore
async function loadAndRenderRatings() {
  console.log("loadAndRenderRatings called");
    const testimonialsSlider = document.querySelector(".testimonials-slider");
    // Check for both testimonialsSlider and testimonialsTrack
    const testimonialsTrack = document.getElementById("testimonialsTrack");
    if (!testimonialsTrack) {
      console.log("testimonialsTrack element not found");
      return;
    }

    testimonialsTrack.innerHTML = ""; // Clear existing testimonials
    const q = query(ratingsCollection, orderBy("date", "desc"), limit(10)); // Get latest 10
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(doc => {
        console.log("Rendering rating:", doc.data());
        const rating = doc.data();
        const avatar = rating.name.charAt(0).toUpperCase();
        const starsHTML = Array(rating.stars).fill('<i class="fas fa-star"></i>').join('') + Array(5 - rating.stars).fill('<i class="far fa-star"></i>').join('');

        const testimonialCard = document.createElement("div");
        testimonialCard.className = "testimonial-card";
        testimonialCard.innerHTML = `
            <div class="testimonial-header">
                <div class="avatar">${avatar}</div>
                <div class="name-role">
                    <h4>${rating.name}</h4>
                    <p class="role">Client</p>
                </div>
            </div>
            <div class="testimonial-body">
                <p>"${rating.comment}"</p>
            </div>
            <div class="testimonial-footer">
                <div class="stars">${starsHTML}</div>
            </div>
        `;
        testimonialsTrack.appendChild(testimonialCard);
    });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired in ratings.js");
    initRatings();
    const submitBtn = document.querySelector(".rating-box button"); // Changed selector to be more specific
    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent form submission
            submitRating();
        });
    }
});

console.log("✅ Ratings System with Firebase loaded successfully");
console.log("Firebase config:", firebaseConfig);
