/* ============================================================
   LuxCod - Services Ordering System
   ============================================================ */

'use strict';

const services = [
  {
    id: 'website-design',
    nameAr: 'تصميم موقع ويب',
    nameEn: 'Website Design',
    descriptionAr: 'موقع احترافي مخصص لعلامتك التجارية',
    descriptionEn: 'Professional custom website for your brand',
    priceAr: 'من 2,000 ريال',
    priceEn: 'From 2,000 SAR',
    deliveryAr: '2-3 أسابيع',
    deliveryEn: '2-3 weeks',
    icon: 'fa-globe'
  },
  {
    id: 'landing-page',
    nameAr: 'صفحة هبوط',
    nameEn: 'Landing Page',
    descriptionAr: 'صفحة عالية التحويل لحملاتك الإعلانية',
    descriptionEn: 'High-converting landing page for campaigns',
    priceAr: 'من 1,500 ريال',
    priceEn: 'From 1,500 SAR',
    deliveryAr: '1-2 أسابيع',
    deliveryEn: '1-2 weeks',
    icon: 'fa-rocket'
  },
  {
    id: 'ui-ux-optimization',
    nameAr: 'تحسين UX/UI',
    nameEn: 'UI/UX Optimization',
    descriptionAr: 'تحسين تجربة المستخدم لموقعك الحالي',
    descriptionEn: 'Improve user experience of your current site',
    priceAr: 'من 1,000 ريال',
    priceEn: 'From 1,000 SAR',
    deliveryAr: '1 أسبوع',
    deliveryEn: '1 week',
    icon: 'fa-paint-brush'
  },
  {
    id: 'integrations',
    nameAr: 'التكاملات',
    nameEn: 'Smart Integrations',
    descriptionAr: 'ربط موقعك بـ WhatsApp و Google Maps والمزيد',
    descriptionEn: 'Connect your site with WhatsApp, Maps & more',
    priceAr: 'من 500 ريال',
    priceEn: 'From 500 SAR',
    deliveryAr: '2-3 أيام',
    deliveryEn: '2-3 days',
    icon: 'fa-plug'
  }
];

// ============================================================
// CREATE SERVICE ORDER MODAL
// ============================================================
function createServiceOrderModal() {
  const modal = document.createElement('div');
  modal.id = 'serviceOrderModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content service-order-modal">
      <button class="modal-close" onclick="closeServiceOrderModal()">
        <i class="fa-solid fa-times"></i>
      </button>
      
      <div id="serviceOrderContent"></div>
    </div>
  `;

  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeServiceOrderModal();
  });
}

function openServiceOrderModal(serviceId) {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  const service = services.find(s => s.id === serviceId);
  if (!service) return;

  let modal = document.getElementById('serviceOrderModal');
  if (!modal) {
    createServiceOrderModal();
    modal = document.getElementById('serviceOrderModal');
  }

  const content = document.getElementById('serviceOrderContent');
  content.innerHTML = `
    <div class="service-order-header">
      <i class="fa-solid ${service.icon}"></i>
      <h2>${currentLang === 'ar' ? service.nameAr : service.nameEn}</h2>
    </div>

    <div class="service-order-details">
      <div class="detail-item">
        <span class="label" data-ar="السعر" data-en="Price">السعر:</span>
        <span class="value">${currentLang === 'ar' ? service.priceAr : service.priceEn}</span>
      </div>
      <div class="detail-item">
        <span class="label" data-ar="المدة" data-en="Delivery">المدة:</span>
        <span class="value">${currentLang === 'ar' ? service.deliveryAr : service.deliveryEn}</span>
      </div>
      <div class="detail-item">
        <span class="label" data-ar="الوصف" data-en="Description">الوصف:</span>
        <span class="value">${currentLang === 'ar' ? service.descriptionAr : service.descriptionEn}</span>
      </div>
    </div>

    <form id="serviceOrderForm" onsubmit="submitServiceOrder(event, '${serviceId}')">
      <div class="form-group">
        <label data-ar="تفاصيل إضافية" data-en="Additional Details">تفاصيل إضافية</label>
        <textarea id="serviceDetails" placeholder="${currentLang === 'ar' ? 'أخبرنا عن متطلباتك...' : 'Tell us your requirements...'}" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label class="checkbox">
          <input type="checkbox" id="serviceUrgent" />
          <span data-ar="طلب عاجل (إضافة 30% للسعر)" data-en="Urgent Request (Add 30% to price)">طلب عاجل (إضافة 30% للسعر)</span>
        </label>
      </div>

      <button type="submit" class="btn btn-primary btn-full">
        <i class="fa-solid fa-check"></i>
        <span data-ar="تأكيد الطلب" data-en="Confirm Order">تأكيد الطلب</span>
      </button>

      <div id="serviceOrderError" class="auth-error"></div>
      <div id="serviceOrderSuccess" class="auth-success"></div>
    </form>
  `;

  modal.classList.add('active');
}

function closeServiceOrderModal() {
  const modal = document.getElementById('serviceOrderModal');
  if (modal) modal.classList.remove('active');
}

// ============================================================
// SUBMIT SERVICE ORDER
// ============================================================
async function submitServiceOrder(e, serviceId) {
  e.preventDefault();

  const service = services.find(s => s.id === serviceId);
  const details = document.getElementById('serviceDetails').value.trim();
  const isUrgent = document.getElementById('serviceUrgent').checked;
  const errorDiv = document.getElementById('serviceOrderError');
  const successDiv = document.getElementById('serviceOrderSuccess');

  errorDiv.textContent = '';
  successDiv.textContent = '';

  try {
    const orderData = {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      userEmail: currentUser.email,
      serviceId: serviceId,
      serviceName: currentLang === 'ar' ? service.nameAr : service.nameEn,
      details: details,
      isUrgent: isUrgent,
      basePrice: service.priceAr.split(' ')[1],
      finalPrice: isUrgent ? parseInt(service.priceAr.split(' ')[1]) * 1.3 : service.priceAr.split(' ')[1],
      status: 'pending',
      createdAt: new Date(),
      language: currentLang
    };

    // Save to Firestore
    const docRef = await firebase.firestore().collection('service_orders').add(orderData);

    // Send email notification
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: "luxcode3@gmail.com",
        from_name: orderData.userName,
        from_phone: currentUser.email,
        message: `
طلب خدمة جديد:
الخدمة: ${orderData.serviceName}
العميل: ${orderData.userName}
البريد: ${orderData.userEmail}
عاجل: ${isUrgent ? 'نعم' : 'لا'}
السعر: ${orderData.finalPrice} ريال
التفاصيل: ${details}
        `
      }
    );

    // Update user orders array
    const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
    await userRef.update({
      orders: firebase.firestore.FieldValue.arrayUnion(docRef.id)
    });

    successDiv.textContent = currentLang === 'ar'
      ? '✅ تم استقبال طلبك بنجاح! سنتواصل معك قريباً.'
      : '✅ Your order has been received! We\'ll contact you soon.';

    setTimeout(() => {
      closeServiceOrderModal();
      if (window.loadUserOrders) loadUserOrders();
    }, 2000);

  } catch (error) {
    console.error('Order error:', error);
    errorDiv.textContent = currentLang === 'ar'
      ? '❌ حدث خطأ. يرجى المحاولة مرة أخرى.'
      : '❌ An error occurred. Please try again.';
  }
}

// ============================================================
// LOAD USER ORDERS
// ============================================================
async function loadUserOrders() {
  if (!currentUser) return;

  try {
    const snapshot = await firebase.firestore()
      .collection('service_orders')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    window.userOrders = orders;
    return orders;
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// ============================================================
// GET SERVICE BY ID
// ============================================================
function getService(serviceId) {
  return services.find(s => s.id === serviceId);
}

// ============================================================
// GET ALL SERVICES
// ============================================================
function getAllServices() {
  return services;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('serviceOrderModal')) {
    createServiceOrderModal();
  }
});

console.log('✅ Services Ordering System loaded');
