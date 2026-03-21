/* ============================================================
   LuxCod - Firebase Authentication System
   ============================================================ */

'use strict';

let currentUser = null;

// ============================================================
// AUTH STATE LISTENER
// ============================================================
function initAuthListener() {
  firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI();
    if (user) {
      console.log('User logged in:', user.email);
      loadUserRatings();
    }
  });
}

// ============================================================
// UPDATE AUTH UI
// ============================================================
function updateAuthUI() {
  const authContainer = document.getElementById('authContainer');
  if (!authContainer) return;

  if (currentUser) {
    authContainer.innerHTML = `
      <div class="user-menu">
        <span class="user-email">${currentUser.email}</span>
        <button class="btn btn-sm btn-outline" onclick="logout()">
          <i class="fa-solid fa-sign-out-alt"></i>
          <span>${currentLang === 'ar' ? 'تسجيل خروج' : 'Logout'}</span>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button class="btn btn-sm btn-primary" onclick="openAuthModal('login')">
        <i class="fa-solid fa-sign-in-alt"></i>
        <span>${currentLang === 'ar' ? 'دخول' : 'Login'}</span>
      </button>
      <button class="btn btn-sm btn-outline" onclick="openAuthModal('signup')">
        <i class="fa-solid fa-user-plus"></i>
        <span>${currentLang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}</span>
      </button>
    `;
  }
}

// ============================================================
// AUTH MODAL
// ============================================================
function createAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content auth-modal">
      <button class="modal-close" onclick="closeAuthModal()">
        <i class="fa-solid fa-times"></i>
      </button>
      
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login" onclick="switchAuthTab('login')">
          <span data-ar="دخول" data-en="Login">دخول</span>
        </button>
        <button class="auth-tab" data-tab="signup" onclick="switchAuthTab('signup')">
          <span data-ar="إنشاء حساب" data-en="Sign Up">إنشاء حساب</span>
        </button>
      </div>

      <!-- LOGIN FORM -->
      <form id="loginForm" class="auth-form active" onsubmit="handleLogin(event)">
        <h3 data-ar="تسجيل الدخول" data-en="Login">تسجيل الدخول</h3>
        
        <div class="form-group">
          <label data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</label>
          <input type="email" id="loginEmail" placeholder="your@email.com" required>
        </div>

        <div class="form-group">
          <label data-ar="كلمة المرور" data-en="Password">كلمة المرور</label>
          <input type="password" id="loginPassword" placeholder="••••••••" required>
        </div>

        <button type="submit" class="btn btn-primary btn-full">
          <span data-ar="دخول" data-en="Login">دخول</span>
        </button>

        <div id="loginError" class="auth-error"></div>
      </form>

      <!-- SIGNUP FORM -->
      <form id="signupForm" class="auth-form" onsubmit="handleSignup(event)">
        <h3 data-ar="إنشاء حساب جديد" data-en="Create Account">إنشاء حساب جديد</h3>
        
        <div class="form-group">
          <label data-ar="الاسم الكامل" data-en="Full Name">الاسم الكامل</label>
          <input type="text" id="signupName" placeholder="أحمد محمد" required>
        </div>

        <div class="form-group">
          <label data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</label>
          <input type="email" id="signupEmail" placeholder="your@email.com" required>
        </div>

        <div class="form-group">
          <label data-ar="كلمة المرور" data-en="Password">كلمة المرور</label>
          <input type="password" id="signupPassword" placeholder="••••••••" required>
        </div>

        <div class="form-group">
          <label data-ar="تأكيد كلمة المرور" data-en="Confirm Password">تأكيد كلمة المرور</label>
          <input type="password" id="signupPasswordConfirm" placeholder="••••••••" required>
        </div>

        <button type="submit" class="btn btn-primary btn-full">
          <span data-ar="إنشاء الحساب" data-en="Create Account">إنشاء الحساب</span>
        </button>

        <div id="signupError" class="auth-error"></div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });
}

function openAuthModal(tab = 'login') {
  let modal = document.getElementById('authModal');
  if (!modal) {
    createAuthModal();
    modal = document.getElementById('authModal');
  }
  modal.classList.add('active');
  switchAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}Form`).classList.add('active');
}

// ============================================================
// LOGIN HANDLER
// ============================================================
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');

  try {
    errorDiv.textContent = '';
    await firebase.auth().signInWithEmailAndPassword(email, password);
    closeAuthModal();
  } catch (error) {
    errorDiv.textContent = getErrorMessage(error.code);
  }
}

// ============================================================
// SIGNUP HANDLER
// ============================================================
async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const errorDiv = document.getElementById('signupError');

  try {
    errorDiv.textContent = '';

    if (password !== passwordConfirm) {
      throw new Error('passwords-dont-match');
    }

    if (password.length < 6) {
      throw new Error('password-too-short');
    }

    const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
    
    // Save user profile
    await userCred.user.updateProfile({ displayName: name });
    
    // Save to Firestore
    await firebase.firestore().collection('users').doc(userCred.user.uid).set({
      name: name,
      email: email,
      createdAt: new Date(),
      ratings: []
    });

    closeAuthModal();
  } catch (error) {
    errorDiv.textContent = getErrorMessage(error.code || error.message);
  }
}

// ============================================================
// LOGOUT
// ============================================================
async function logout() {
  try {
    await firebase.auth().signOut();
    updateAuthUI();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// ============================================================
// ERROR MESSAGES
// ============================================================
function getErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': currentLang === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already in use',
    'auth/weak-password': currentLang === 'ar' ? 'كلمة المرور ضعيفة جداً' : 'Password is too weak',
    'auth/invalid-email': currentLang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email',
    'auth/user-not-found': currentLang === 'ar' ? 'المستخدم غير موجود' : 'User not found',
    'auth/wrong-password': currentLang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Wrong password',
    'passwords-dont-match': currentLang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
    'password-too-short': currentLang === 'ar' ? 'كلمة المرور قصيرة جداً (6 أحرف على الأقل)' : 'Password too short (minimum 6 characters)'
  };
  return messages[code] || (currentLang === 'ar' ? 'حدث خطأ ما' : 'An error occurred');
}

// ============================================================
// LOAD USER RATINGS
// ============================================================
async function loadUserRatings() {
  if (!currentUser) return;
  
  try {
    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
    if (userDoc.exists && userDoc.data().ratings) {
      window.userRatings = userDoc.data().ratings;
    }
  } catch (error) {
    console.error('Error loading ratings:', error);
  }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  initAuthListener();
});
