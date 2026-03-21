// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8wFMz6xtLVtkpfVRac_wM6Ucaan6VOVk",
  authDomain: "luxcode-167ee.firebaseapp.com",
  projectId: "luxcode-167ee",
  storageBucket: "luxcode-167ee.firebasestorage.app",
  messagingSenderId: "1090399047900",
  appId: "1:1090399047900:web:dc39a3feb818e05217a419",
  measurementId: "G-PW8TY4VSV8"
};

// Initialize Firebase with error handling
function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK not loaded');
      return false;
    }
    
    // Check if already initialized
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized successfully');
    } else {
      console.log('✅ Firebase already initialized');
    }
    
    // Get Firebase services
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
