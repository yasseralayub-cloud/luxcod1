/* ============================================================
   LuxCod - Payment System (PayPal, Apple Pay, Bank Transfer)
   ============================================================ */

'use strict';

// PayPal Configuration
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID"; // Replace with actual ID
const PAYPAL_CURRENCY = "SAR"; // Saudi Riyal

// ============================================================
// CREATE PAYMENT MODAL
// ============================================================
function createPaymentModal() {
  const modal = document.createElement('div');
  modal.id = 'paymentModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content payment-modal">
      <button class="modal-close" onclick="closePaymentModal()">
        <i class="fa-solid fa-times"></i>
      </button>
      
      <h2 data-ar="اختر طريقة الدفع" data-en="Choose Payment Method">اختر طريقة الدفع</h2>
      
      <div class="payment-methods">
        <!-- PAYPAL -->
        <div class="payment-method-card">
          <div class="payment-header">
            <i class="fa-brands fa-paypal"></i>
            <h3 data-ar="PayPal" data-en="PayPal">PayPal</h3>
          </div>
          <p data-ar="ادفع بأمان عبر PayPal" data-en="Pay securely via PayPal">ادفع بأمان عبر PayPal</p>
          <button class="btn btn-primary btn-full" onclick="initPayPalPayment()">
            <span data-ar="الدفع عبر PayPal" data-en="Pay with PayPal">الدفع عبر PayPal</span>
          </button>
        </div>

        <!-- APPLE PAY -->
        <div class="payment-method-card disabled">
          <div class="payment-header">
            <i class="fa-brands fa-apple"></i>
            <h3 data-ar="Apple Pay" data-en="Apple Pay">Apple Pay</h3>
            <span class="badge-coming" data-ar="قريباً" data-en="Coming Soon">قريباً</span>
          </div>
          <p data-ar="قريباً - ادفع عبر Apple Pay" data-en="Coming Soon - Pay via Apple Pay">قريباً - ادفع عبر Apple Pay</p>
          <button class="btn btn-outline btn-full" disabled>
            <span data-ar="غير متاح حالياً" data-en="Not Available Yet">غير متاح حالياً</span>
          </button>
        </div>

        <!-- BANK TRANSFER -->
        <div class="payment-method-card">
          <div class="payment-header">
            <i class="fa-solid fa-building-columns"></i>
            <h3 data-ar="تحويل بنكي" data-en="Bank Transfer">تحويل بنكي</h3>
          </div>
          <p data-ar="حول الأموال مباشرة إلى حسابنا البنكي" data-en="Transfer directly to our bank account">حول الأموال مباشرة إلى حسابنا البنكي</p>
          <button class="btn btn-primary btn-full" onclick="showBankTransferDetails()">
            <span data-ar="تفاصيل التحويل" data-en="Transfer Details">تفاصيل التحويل</span>
          </button>
        </div>
      </div>

      <!-- BANK TRANSFER DETAILS -->
      <div id="bankDetails" class="bank-details" style="display: none;">
        <h3 data-ar="تفاصيل التحويل البنكي" data-en="Bank Transfer Details">تفاصيل التحويل البنكي</h3>
        <div class="bank-info">
          <p style="color: var(--gold); font-size: 16px; text-align: center; padding: 30px 0;">
            <i class="fa-solid fa-info-circle" style="margin-right: 10px;"></i>
            <span data-ar="سيتم إرسال تفاصيل الحساب بعد طلب الخدمة" data-en="Account details will be sent after service request">سيتم إرسال تفاصيل الحساب بعد طلب الخدمة</span>
          </p>
        </div>
      </div>

      <!-- PAYPAL CONTAINER -->
      <div id="paypalContainer" style="display: none; margin-top: 20px;"></div>
    </div>
  `;

  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePaymentModal();
  });
}

function openPaymentModal() {
  let modal = document.getElementById('paymentModal');
  if (!modal) {
    createPaymentModal();
    modal = document.getElementById('paymentModal');
  }
  modal.classList.add('active');
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.remove('active');
}

// ============================================================
// PAYPAL INTEGRATION
// ============================================================
function initPayPalPayment() {
  const container = document.getElementById('paypalContainer');
  container.style.display = 'block';
  container.innerHTML = `
    <div class="paypal-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p data-ar="جاري تحضير الدفع..." data-en="Preparing payment...">جاري تحضير الدفع...</p>
    </div>
  `;

  // Load PayPal script if not already loaded
  if (!window.paypal) {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${PAYPAL_CURRENCY}`;
    script.onload = () => renderPayPalButtons();
    document.head.appendChild(script);
  } else {
    renderPayPalButtons();
  }
}

function renderPayPalButtons() {
  const container = document.getElementById('paypalContainer');
  container.innerHTML = '';

  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: "500.00", // Default amount in SAR
            currency_code: PAYPAL_CURRENCY
          },
          description: "LuxCod Website Design Service"
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(orderData) {
        console.log('PayPal order captured:', orderData);
        savePaymentRecord('paypal', orderData.id, orderData.purchase_units[0].amount.value);
        showPaymentSuccess();
      });
    },
    onError: function(err) {
      console.error('PayPal error:', err);
      alert(currentLang === 'ar' ? 'حدث خطأ في الدفع' : 'Payment error occurred');
    }
  }).render('#paypalContainer');
}

// ============================================================
// BANK TRANSFER
// ============================================================
function showBankTransferDetails() {
  const details = document.getElementById('bankDetails');
  details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

function copyBankDetails() {
  const text = `
اسم البنك: البنك الأهلي السعودي
رقم الحساب: 1234567890
رقم IBAN: SA0320000001234567890
باسم: LuxCod Digital Agency
  `.trim();

  navigator.clipboard.writeText(text).then(() => {
    alert(currentLang === 'ar' ? 'تم نسخ التفاصيل' : 'Details copied');
  });
}

// ============================================================
// SAVE PAYMENT RECORD
// ============================================================
async function savePaymentRecord(method, transactionId, amount) {
  try {
    await firebase.firestore().collection('payments').add({
      userId: currentUser ? currentUser.uid : 'anonymous',
      method: method,
      transactionId: transactionId,
      amount: amount,
      currency: PAYPAL_CURRENCY,
      status: 'completed',
      createdAt: new Date()
    });

    console.log('Payment recorded');
  } catch (error) {
    console.error('Error saving payment:', error);
  }
}

// ============================================================
// PAYMENT SUCCESS
// ============================================================
function showPaymentSuccess() {
  const modal = document.getElementById('paymentModal');
  const content = modal.querySelector('.modal-content');
  
  const successDiv = document.createElement('div');
  successDiv.className = 'payment-success';
  successDiv.innerHTML = `
    <div class="success-icon">
      <i class="fa-solid fa-check-circle"></i>
    </div>
    <h3 data-ar="تم الدفع بنجاح!" data-en="Payment Successful!">تم الدفع بنجاح!</h3>
    <p data-ar="شكراً لك. سيتم التواصل معك قريباً." data-en="Thank you. We'll contact you soon.">شكراً لك. سيتم التواصل معك قريباً.</p>
    <button class="btn btn-primary" onclick="closePaymentModal()">
      <span data-ar="إغلاق" data-en="Close">إغلاق</span>
    </button>
  `;

  content.innerHTML = '';
  content.appendChild(successDiv);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('paymentModal')) {
    createPaymentModal();
  }
});
