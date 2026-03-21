/* ============================================================
   LuxCod - User Dashboard
   ============================================================ */

'use strict';

// ============================================================
// CREATE USER DASHBOARD
// ============================================================
function createUserDashboard() {
  const dashboard = document.createElement('div');
  dashboard.id = 'userDashboard';
  dashboard.className = 'user-dashboard';
  dashboard.innerHTML = `
    <div class="dashboard-overlay" onclick="closeDashboard()"></div>
    <div class="dashboard-content">
      <div class="dashboard-header">
        <h2 data-ar="لوحة التحكم" data-en="Dashboard">لوحة التحكم</h2>
        <button class="dashboard-close" onclick="closeDashboard()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <div class="dashboard-tabs">
        <button class="dashboard-tab active" data-tab="profile" onclick="switchDashboardTab('profile')">
          <i class="fa-solid fa-user"></i>
          <span data-ar="الملف الشخصي" data-en="Profile">الملف الشخصي</span>
        </button>
        <button class="dashboard-tab" data-tab="orders" onclick="switchDashboardTab('orders')">
          <i class="fa-solid fa-shopping-cart"></i>
          <span data-ar="طلباتي" data-en="My Orders">طلباتي</span>
        </button>
        <button class="dashboard-tab" data-tab="ratings" onclick="switchDashboardTab('ratings')">
          <i class="fa-solid fa-star"></i>
          <span data-ar="تقييماتي" data-en="My Ratings">تقييماتي</span>
        </button>
      </div>

      <div class="dashboard-body">
        <!-- PROFILE TAB -->
        <div class="dashboard-tab-content active" data-tab="profile">
          <div class="profile-section">
            <div class="profile-avatar">
              <i class="fa-solid fa-user-circle"></i>
            </div>
            <div class="profile-info">
              <div class="info-item">
                <span class="label" data-ar="الاسم" data-en="Name">الاسم:</span>
                <span class="value" id="profileName">-</span>
              </div>
              <div class="info-item">
                <span class="label" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني:</span>
                <span class="value" id="profileEmail">-</span>
              </div>
              <div class="info-item">
                <span class="label" data-ar="تاريخ الانضمام" data-en="Joined">تاريخ الانضمام:</span>
                <span class="value" id="profileJoined">-</span>
              </div>
              <div class="info-item">
                <span class="label" data-ar="إجمالي الطلبات" data-en="Total Orders">إجمالي الطلبات:</span>
                <span class="value" id="profileOrdersCount">0</span>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button class="btn btn-outline" onclick="logout()">
              <i class="fa-solid fa-sign-out-alt"></i>
              <span data-ar="تسجيل خروج" data-en="Logout">تسجيل خروج</span>
            </button>
          </div>
        </div>

        <!-- ORDERS TAB -->
        <div class="dashboard-tab-content" data-tab="orders">
          <div id="ordersList" class="orders-list">
            <div class="empty-state">
              <i class="fa-solid fa-inbox"></i>
              <p data-ar="لا توجد طلبات حالياً" data-en="No orders yet">لا توجد طلبات حالياً</p>
            </div>
          </div>
        </div>

        <!-- RATINGS TAB -->
        <div class="dashboard-tab-content" data-tab="ratings">
          <div id="ratingsList" class="ratings-list">
            <div class="empty-state">
              <i class="fa-solid fa-star"></i>
              <p data-ar="لم تقيّم بعد" data-en="No ratings yet">لم تقيّم بعد</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dashboard);
}

function openDashboard() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  let dashboard = document.getElementById('userDashboard');
  if (!dashboard) {
    createUserDashboard();
    dashboard = document.getElementById('userDashboard');
  }

  dashboard.classList.add('active');
  loadDashboardData();
}

function closeDashboard() {
  const dashboard = document.getElementById('userDashboard');
  if (dashboard) dashboard.classList.remove('active');
}

function switchDashboardTab(tab) {
  document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dashboard-tab-content').forEach(c => c.classList.remove('active'));

  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.querySelector(`.dashboard-tab-content[data-tab="${tab}"]`).classList.add('active');

  if (tab === 'orders') loadDashboardOrders();
  if (tab === 'ratings') loadDashboardRatings();
}

// ============================================================
// LOAD DASHBOARD DATA
// ============================================================
async function loadDashboardData() {
  if (!currentUser) return;

  try {
    // Load user profile
    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data() || {};

    document.getElementById('profileName').textContent = currentUser.displayName || 'عميل';
    document.getElementById('profileEmail').textContent = currentUser.email;

    const joinedDate = new Date(currentUser.metadata.creationTime);
    document.getElementById('profileJoined').textContent = joinedDate.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US');

    // Load orders count
    const ordersSnapshot = await firebase.firestore()
      .collection('service_orders')
      .where('userId', '==', currentUser.uid)
      .get();

    document.getElementById('profileOrdersCount').textContent = ordersSnapshot.size;

    // Load orders
    await loadDashboardOrders();
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

async function loadDashboardOrders() {
  try {
    const snapshot = await firebase.firestore()
      .collection('service_orders')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const ordersList = document.getElementById('ordersList');
    
    if (snapshot.empty) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-inbox"></i>
          <p data-ar="لا توجد طلبات حالياً" data-en="No orders yet">لا توجد طلبات حالياً</p>
        </div>
      `;
      return;
    }

    let html = '';
    snapshot.forEach(doc => {
      const order = doc.data();
      const statusColor = order.status === 'completed' ? '#10b981' : order.status === 'pending' ? '#f59e0b' : '#ef4444';
      const statusText = order.status === 'completed' ? (currentLang === 'ar' ? 'مكتمل' : 'Completed') 
                       : order.status === 'pending' ? (currentLang === 'ar' ? 'قيد الانتظار' : 'Pending')
                       : (currentLang === 'ar' ? 'ملغى' : 'Cancelled');

      html += `
        <div class="order-card">
          <div class="order-header">
            <h3>${order.serviceName}</h3>
            <span class="order-status" style="background-color: ${statusColor};">${statusText}</span>
          </div>
          <div class="order-details">
            <p><strong>${currentLang === 'ar' ? 'السعر:' : 'Price:'}</strong> ${order.finalPrice} ريال</p>
            <p><strong>${currentLang === 'ar' ? 'التاريخ:' : 'Date:'}</strong> ${new Date(order.createdAt.toDate()).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</p>
            ${order.details ? `<p><strong>${currentLang === 'ar' ? 'التفاصيل:' : 'Details:'}</strong> ${order.details}</p>` : ''}
          </div>
        </div>
      `;
    });

    ordersList.innerHTML = html;
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

async function loadDashboardRatings() {
  try {
    const snapshot = await firebase.firestore()
      .collection('ratings')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const ratingsList = document.getElementById('ratingsList');

    if (snapshot.empty) {
      ratingsList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-star"></i>
          <p data-ar="لم تقيّم بعد" data-en="No ratings yet">لم تقيّم بعد</p>
        </div>
      `;
      return;
    }

    let html = '';
    snapshot.forEach(doc => {
      const rating = doc.data();
      const stars = '⭐'.repeat(rating.rating);

      html += `
        <div class="rating-card">
          <div class="rating-header">
            <div class="rating-stars">${stars}</div>
            <span class="rating-date">${new Date(rating.createdAt.toDate()).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</span>
          </div>
          <p class="rating-comment">${rating.comment}</p>
          <span class="rating-status ${rating.approved ? 'approved' : 'pending'}">
            ${rating.approved 
              ? (currentLang === 'ar' ? '✅ منشور' : '✅ Published')
              : (currentLang === 'ar' ? '⏳ قيد المراجعة' : '⏳ Under Review')}
          </span>
        </div>
      `;
    });

    ratingsList.innerHTML = html;
  } catch (error) {
    console.error('Error loading ratings:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('userDashboard')) {
    createUserDashboard();
  }
});

console.log('✅ User Dashboard loaded');
