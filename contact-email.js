/* ============================================================
   LuxCod - Contact Email System (using EmailJS - FIXED)
   ============================================================ */

'use strict';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = "njvn9St5gAnWLOI61";
const EMAILJS_SERVICE_ID = "service_tllf68q";
const EMAILJS_TEMPLATE_ID = "template_j8bjlhw";

// Initialize EmailJS immediately
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log('✅ EmailJS initialized successfully');
} else {
  console.warn('⚠️ EmailJS library not loaded yet');
}

// ============================================================
// SEND CONTACT EMAIL VIA EMAILJS
// ============================================================
async function sendContactEmail(name, phone, message) {
  try {
    console.log('📧 Sending email via EmailJS...');
    console.log('Service:', EMAILJS_SERVICE_ID);
    console.log('Template:', EMAILJS_TEMPLATE_ID);
    
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS library not loaded');
    }
    
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
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.' 
        : 'Message sent successfully! We\'ll contact you soon.'
    };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { 
      success: false, 
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.' 
        : 'Error sending message. Please try again.'
    };
  }
}

// ============================================================
// COMBINED SEND FUNCTION
// ============================================================
async function sendContactMessage(name, phone, message) {
  try {
    // Send email
    const emailResult = await sendContactEmail(name, phone, message);
    return emailResult;
  } catch (error) {
    console.error('❌ Contact error:', error);
    return { 
      success: false, 
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة' 
        : 'Error sending message'
    };
  }
}

console.log('✅ Contact Email System loaded successfully');
