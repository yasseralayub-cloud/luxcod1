/* ============================================================
   LuxCod - Contact Form Handler (Alternative Solution)
   Using FormSubmit.co - No external library needed
   ============================================================ */

'use strict';

// ============================================================
// SEND CONTACT MESSAGE VIA FORMSUBMIT
// ============================================================
async function sendContactMessage(name, phone, message) {
  try {
    console.log('📧 Sending message via FormSubmit...');
    
    // Create FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('message', message);
    formData.append('_captcha', 'false'); // Disable captcha
    formData.append('_next', window.location.href); // Redirect after submit
    
    // Send to FormSubmit
    const response = await fetch('https://formsubmit.co/ajax/luxcode3@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Message sent successfully!');
      return { 
        success: true, 
        message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
          ? 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.' 
          : 'Message sent successfully! We\'ll contact you soon.'
      };
    } else {
      throw new Error('Server responded with error');
    }
    
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return { 
      success: false, 
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.' 
        : 'Error sending message. Please try again or contact us via WhatsApp.',
      error: error
    };
  }
}

console.log('✅ Contact Form Handler loaded successfully');
