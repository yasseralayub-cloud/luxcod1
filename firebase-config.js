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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other scripts
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;
