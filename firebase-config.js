// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD46R7Mei7ANhzqSyihJVtxO6YQsiZls8s",
  authDomain: "luxcod-ratings.firebaseapp.com",
  projectId: "luxcod-ratings",
  storageBucket: "luxcod-ratings.firebasestorage.app",
  messagingSenderId: "195575730935",
  appId: "1:195575730935:web:7598414c4134e71f04b9f2",
  measurementId: "G-HB3PTKE582"
};

// Initialize Firebase with error handling
function initializeFirebase() {
  try {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK not loaded');
      return false;
    }
    
    // Check if already initialized
    let app;
    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized successfully');
    } else {
      app = firebase.app();
      console.log('✅ Firebase already initialized');
    }
    
    // Get Firebase services (using compat namespaced API)
    window.firebaseAuth = firebase.auth();
    window.firebaseDB = firebase.firestore();
    window.firebaseStorage = firebase.storage();
    
    // Global firebase reference
    window.firebase = firebase;
    
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
}

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}
