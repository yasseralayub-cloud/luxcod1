/* ============================================================
   LuxCod - Firebase Authentication System (Fixed & Enhanced)
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
    updateAuthButtons();
    
    if (user) {
      console.log('✅ User logged in:', user.email);
    } else {
      console.log('❌ User logged out');
    }
  });
}

// ============================================================
// UPDATE AUTH UI
// ============================================================
function updateAuthUI() {
  const authContainer = document.getElementById('authContainer');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  
  if (currentUser) {
    // Hide direct buttons
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    
    // Show user menu
    if (authContainer) {
      authContainer.style.display = 'flex';
      authContainer.innerHTML = `
        <div class="user-menu">
          <span class="user-email">${currentUser.email}</span>
          <button class="btn btn-sm btn-outline" onclick="logout()" style="display: inline-flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-sign-out-alt"></i>
            <span>${currentLang === 'ar' ? 'خروج' : 'Logout'}</span>
          </button>
        </div>
      `;
    }
  } else {
    // Show direct buttons
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (signupBtn) signupBtn.style.display = 'inline-flex';
    
    // Hide user menu
    if (authContainer) authContainer.style.display = 'none';
  }
}

// ============================================================
// UPDATE AUTH BUTTONS (Rate, Pay, Dashboard)
// ============================================================
function updateAuthButtons() {
  const rateBtn = document.getElementById('rateBtn');
  const payBtn = document.getElementById('payBtn');
  const dashboardBtn = document.getElementById('dashboardBtn');

  if (currentUser) {
    if (rateBtn) rateBtn.style.display = 'inline-flex';
    if (payBtn) payBtn.style.display = 'inline-flex';
    if (dashboardBtn) dashboardBtn.style.display = 'inline-flex';
  } else {
    if (rateBtn) rateBtn.style.display = 'none';
    if (payBtn) payBtn.style.display = 'none';
    if (dashboardBtn) dashboardBtn.style.display = 'none';
  }
}

// ============================================================
// CREATE AUTH MODAL
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
      <div id="authContent"></div>
    </div>
  `;

  document.body.appendChild(modal);
  
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

  const content = document.getElementById('authContent');
  
  if (tab === 'login') {
    content.innerHTML = getLoginForm();
  } else if (tab === 'signup') {
    content.innerHTML = getSignupForm();
  } else if (tab === 'forgot') {
    content.innerHTML = getForgotPasswordForm();
  }

  modal.classList.add('active');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

// ============================================================
// PASSWORD VISIBILITY TOGGLE
// ============================================================
function togglePasswordVisibility(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  
  if (!input || !toggle) return;
  
  if (input.type === 'password') {
    input.type = 'text';
    toggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    toggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
}

// ============================================================
// LOGIN FORM
// ============================================================
function getLoginForm() {
  return `
    <div class="auth-header">
      <h2>${currentLang === 'ar' ? 'تسجيل الدخول' : 'Login'}</h2>
      <p>${currentLang === 'ar' ? 'أدخل بيانات حسابك' : 'Enter your credentials'}</p>
    </div>

    <form id="loginForm" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label>${currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
        <input type="email" id="loginEmail" placeholder="your@email.com" required>
      </div>

      <div class="form-group">
        <label>${currentLang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
        <div class="password-input-group">
          <input type="password" id="loginPassword" placeholder="••••••••" required>
          <button type="button" id="loginPasswordToggle" class="password-toggle" onclick="togglePasswordVisibility('loginPassword', 'loginPasswordToggle')">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-full">
        <i class="fa-solid fa-sign-in-alt"></i>
        <span>${currentLang === 'ar' ? 'دخول' : 'Login'}</span>
      </button>

      <div id="loginError" class="auth-error"></div>
      <div id="loginSuccess" class="auth-success"></div>
    </form>

    <div class="auth-divider">
      <span>${currentLang === 'ar' ? 'أو' : 'or'}</span>
    </div>

    <div class="auth-links">
      <button type="button" class="link-btn" onclick="openAuthModal('signup')">
        ${currentLang === 'ar' ? 'إنشاء حساب جديد' : 'Create new account'}
      </button>
      <button type="button" class="link-btn" onclick="openAuthModal('forgot')">
        ${currentLang === 'ar' ? 'هل نسيت كلمة المرور؟' : 'Forgot password?'}
      </button>
    </div>
  `;
}

// ============================================================
// SIGNUP FORM
// ============================================================
function getSignupForm() {
  return `
    <div class="auth-header">
      <h2>${currentLang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}</h2>
      <p>${currentLang === 'ar' ? 'انضم إلينا اليوم' : 'Join us today'}</p>
    </div>

    <form id="signupForm" onsubmit="handleSignup(event)">
      <div class="form-group">
        <label>${currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
        <input type="text" id="signupName" placeholder="${currentLang === 'ar' ? 'أحمد محمد' : 'John Doe'}" required>
      </div>

      <div class="form-group">
        <label>${currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
        <input type="email" id="signupEmail" placeholder="your@email.com" required>
      </div>

      <div class="form-group">
        <label>${currentLang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
        <div class="password-input-group">
          <input type="password" id="signupPassword" placeholder="••••••••" required minlength="6">
          <button type="button" id="signupPasswordToggle" class="password-toggle" onclick="togglePasswordVisibility('signupPassword', 'signupPasswordToggle')">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
        <small>${currentLang === 'ar' ? 'يجب أن تكون 6 أحرف على الأقل' : 'At least 6 characters'}</small>
      </div>

      <div class="form-group">
        <label>${currentLang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
        <div class="password-input-group">
          <input type="password" id="signupPasswordConfirm" placeholder="••••••••" required minlength="6">
          <button type="button" id="signupPasswordConfirmToggle" class="password-toggle" onclick="togglePasswordVisibility('signupPasswordConfirm', 'signupPasswordConfirmToggle')">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-full">
        <i class="fa-solid fa-user-plus"></i>
        <span>${currentLang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}</span>
      </button>

      <div id="signupError" class="auth-error"></div>
      <div id="signupSuccess" class="auth-success"></div>
    </form>

    <div class="auth-divider">
      <span>${currentLang === 'ar' ? 'أو' : 'or'}</span>
    </div>

    <div class="auth-links">
      <button type="button" class="link-btn" onclick="openAuthModal('login')">
        ${currentLang === 'ar' ? 'لديك حساب بالفعل؟ دخول' : 'Already have account? Login'}
      </button>
    </div>
  `;
}

// ============================================================
// FORGOT PASSWORD FORM
// ============================================================
function getForgotPasswordForm() {
  return `
    <div class="auth-header">
      <h2>${currentLang === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}</h2>
      <p>${currentLang === 'ar' ? 'أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين' : 'Enter your email to receive reset link'}</p>
    </div>

    <form id="forgotForm" onsubmit="handleForgotPassword(event)">
      <div class="form-group">
        <label>${currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
        <input type="email" id="forgotEmail" placeholder="your@email.com" required>
      </div>

      <button type="submit" class="btn btn-primary btn-full">
        <i class="fa-solid fa-envelope"></i>
        <span>${currentLang === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}</span>
      </button>

      <div id="forgotError" class="auth-error"></div>
      <div id="forgotSuccess" class="auth-success"></div>
    </form>

    <div class="auth-divider">
      <span>${currentLang === 'ar' ? 'أو' : 'or'}</span>
    </div>

    <div class="auth-links">
      <button type="button" class="link-btn" onclick="openAuthModal('login')">
        ${currentLang === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
      </button>
    </div>
  `;
}

// ============================================================
// HANDLE LOGIN
// ============================================================
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  const successDiv = document.getElementById('loginSuccess');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  errorDiv.textContent = '';
  successDiv.textContent = '';
  submitBtn.disabled = true;

  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password);
    
    if (!result.user.emailVerified) {
      errorDiv.textContent = currentLang === 'ar'
        ? '⚠️ يرجى تأكيد بريدك الإلكتروني أولاً'
        : '⚠️ Please verify your email first';
      submitBtn.disabled = false;
      return;
    }

    successDiv.textContent = currentLang === 'ar'
      ? '✅ تم تسجيل الدخول بنجاح!'
      : '✅ Logged in successfully!';

    setTimeout(() => {
      closeAuthModal();
      submitBtn.disabled = false;
    }, 1500);

  } catch (error) {
    submitBtn.disabled = false;
    let message = error.message;
    
    if (error.code === 'auth/user-not-found') {
      message = currentLang === 'ar' ? '❌ البريد الإلكتروني غير موجود' : '❌ Email not found';
    } else if (error.code === 'auth/wrong-password') {
      message = currentLang === 'ar' ? '❌ كلمة المرور غير صحيحة' : '❌ Wrong password';
    } else if (error.code === 'auth/too-many-requests') {
      message = currentLang === 'ar' ? '❌ محاولات كثيرة. حاول لاحقاً' : '❌ Too many attempts. Try later';
    }
    
    errorDiv.textContent = message;
  }
}

// ============================================================
// HANDLE SIGNUP
// ============================================================
async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const errorDiv = document.getElementById('signupError');
  const successDiv = document.getElementById('signupSuccess');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  errorDiv.textContent = '';
  successDiv.textContent = '';
  submitBtn.disabled = true;

  if (password !== passwordConfirm) {
    errorDiv.textContent = currentLang === 'ar'
      ? '❌ كلمات المرور غير متطابقة'
      : '❌ Passwords do not match';
    submitBtn.disabled = false;
    return;
  }

  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = result.user;

    await user.updateProfile({ displayName: name });
    await user.sendEmailVerification({
      url: window.location.origin + window.location.pathname
    });

    await firebase.firestore().collection('users').doc(user.uid).set({
      name: name,
      email: email,
      createdAt: new Date(),
      emailVerified: false
    });

    successDiv.innerHTML = `
      <div style="text-align: center;">
        <p style="margin-bottom: 10px;">✅ ${currentLang === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!'}</p>
        <p style="font-size: 14px; color: var(--gold);">
          ${currentLang === 'ar' 
            ? '📧 تحقق من بريدك الإلكتروني لتأكيد الحساب' 
            : '📧 Check your email to verify account'}
        </p>
      </div>
    `;

    setTimeout(() => {
      closeAuthModal();
      openAuthModal('login');
      submitBtn.disabled = false;
    }, 3000);

  } catch (error) {
    submitBtn.disabled = false;
    let message = error.message;
    
    if (error.code === 'auth/email-already-in-use') {
      message = currentLang === 'ar' ? '❌ البريد الإلكتروني مستخدم بالفعل' : '❌ Email already in use';
    } else if (error.code === 'auth/weak-password') {
      message = currentLang === 'ar' ? '❌ كلمة المرور ضعيفة جداً' : '❌ Password is too weak';
    }
    
    errorDiv.textContent = message;
  }
}

// ============================================================
// HANDLE FORGOT PASSWORD
// ============================================================
async function handleForgotPassword(e) {
  e.preventDefault();

  const email = document.getElementById('forgotEmail').value.trim();
  const errorDiv = document.getElementById('forgotError');
  const successDiv = document.getElementById('forgotSuccess');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  errorDiv.textContent = '';
  successDiv.textContent = '';
  submitBtn.disabled = true;

  try {
    await firebase.auth().sendPasswordResetEmail(email, {
      url: window.location.origin + window.location.pathname
    });

    successDiv.innerHTML = `
      <div style="text-align: center;">
        <p style="margin-bottom: 10px;">✅ ${currentLang === 'ar' ? 'تم إرسال الرابط بنجاح!' : 'Reset link sent successfully!'}</p>
        <p style="font-size: 14px; color: var(--gold);">
          ${currentLang === 'ar' 
            ? '📧 تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور' 
            : '📧 Check your email to reset password'}
        </p>
      </div>
    `;

    setTimeout(() => {
      closeAuthModal();
      submitBtn.disabled = false;
    }, 3000);

  } catch (error) {
    submitBtn.disabled = false;
    let message = error.message;
    
    if (error.code === 'auth/user-not-found') {
      message = currentLang === 'ar' ? '❌ البريد الإلكتروني غير موجود' : '❌ Email not found';
    }
    
    errorDiv.textContent = message;
  }
}

// ============================================================
// LOGOUT
// ============================================================
async function logout() {
  try {
    await firebase.auth().signOut();
    console.log('✅ Logged out successfully');
    closeAuthModal();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// ============================================================
// INITIALIZE
// ============================================================
function initAuthSystem() {
  if (!document.getElementById('authModal')) {
    createAuthModal();
  }
  initAuthListener();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthSystem);
} else {
  initAuthSystem();
}

console.log('✅ Enhanced Authentication System loaded');
