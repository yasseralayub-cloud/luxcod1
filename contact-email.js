/* ============================================================
   LuxCod - Contact Email System (using EmailJS)
   ============================================================ */

'use strict';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = "njvn9St5gAnWLOI61";
const EMAILJS_SERVICE_ID = "service_tllf68q";
const EMAILJS_TEMPLATE_ID = "template_j8bjlhw";

// Initialize EmailJS
(function() {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log('✅ EmailJS initialized successfully');
})();

// ============================================================
// SEND CONTACT EMAIL VIA EMAILJS
// ============================================================
async function sendContactEmail(name, phone, message) {
  try {
    console.log('📧 Sending email via EmailJS...');
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: "luxcode3@gmail.com",
        from_name: name,
        from_phone: phone,
        message: message,
        reply_to: phone,
        timestamp: new Date().toLocaleString('ar-SA')
      }
    );

    console.log('✅ Email sent successfully:', response);
    return { 
      success: true, 
      message: currentLang === 'ar' 
        ? 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.' 
        : 'Message sent successfully! We\'ll contact you soon.'
    };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { 
      success: false, 
      message: currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.' 
        : 'Error sending message. Please try again.'
    };
  }
}

// ============================================================
// SAVE CONTACT TO FIRESTORE (BACKUP)
// ============================================================
async function saveContactMessage(name, phone, message) {
  try {
    await firebase.firestore().collection('contacts').add({
      name: name,
      phone: phone,
      message: message,
      userEmail: currentUser ? currentUser.email : 'anonymous',
      createdAt: new Date(),
      status: 'new',
      read: false,
      emailSent: true
    });

    console.log('✅ Contact message saved to Firestore');
    return { success: true };
  } catch (error) {
    console.error('❌ Firestore error:', error);
    return { success: false };
  }
}

// ============================================================
// COMBINED SEND FUNCTION
// ============================================================
async function sendContactMessage(name, phone, message) {
  try {
    // Send email first
    const emailResult = await sendContactEmail(name, phone, message);

    // Save to Firestore as backup
    await saveContactMessage(name, phone, message);

    return emailResult;
  } catch (error) {
    console.error('❌ Contact error:', error);
    return { 
      success: false, 
      message: currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة' 
        : 'Error sending message'
    };
  }
}

// ============================================================
// VALIDATE EMAIL (Optional)
// ============================================================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ============================================================
// VALIDATE PHONE (Optional)
// ============================================================
function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]{7,}$/;
  return re.test(phone);
}

console.log('✅ Contact Email System loaded successfully');
