/* ============================================================
   LuxCod - Contact Email System (using EmailJS - FIXED v2)
   ============================================================ */

'use strict';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = "njvn9St5gAnWLOI61";
const EMAILJS_SERVICE_ID = "service_tllf68q";
const EMAILJS_TEMPLATE_ID = "template_j8bjlhw";

// Flag to track initialization
let emailjsReady = false;

// ============================================================
// WAIT FOR EMAILJS TO LOAD
// ============================================================
function waitForEmailJS() {
  return new Promise((resolve) => {
    if (typeof emailjs !== 'undefined') {
      // EmailJS already loaded
      if (!emailjsReady) {
        try {
          emailjs.init(EMAILJS_PUBLIC_KEY);
          emailjsReady = true;
          console.log('✅ EmailJS initialized successfully (immediate)');
        } catch (error) {
          console.error('❌ Failed to initialize EmailJS:', error);
        }
      }
      resolve();
    } else {
      // Wait for EmailJS to load
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkInterval = setInterval(() => {
        attempts++;
        
        if (typeof emailjs !== 'undefined') {
          clearInterval(checkInterval);
          try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            emailjsReady = true;
            console.log('✅ EmailJS initialized successfully (after wait)');
          } catch (error) {
            console.error('❌ Failed to initialize EmailJS:', error);
          }
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('❌ EmailJS failed to load after 5 seconds');
          resolve(); // Continue anyway
        }
      }, 100);
    }
  });
}

// Initialize EmailJS on script load
waitForEmailJS();

// ============================================================
// SEND CONTACT EMAIL VIA EMAILJS
// ============================================================
async function sendContactEmail(name, phone, message) {
  try {
    console.log('📧 Attempting to send email via EmailJS...');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('EmailJS Ready:', emailjsReady);
    
    // Ensure EmailJS is ready
    if (typeof emailjs === 'undefined') {
      console.error('❌ EmailJS library not available');
      throw new Error('EmailJS library not loaded');
    }
    
    // Ensure initialized
    if (!emailjsReady) {
      console.warn('⚠️ EmailJS not initialized, attempting initialization...');
      await waitForEmailJS();
    }
    
    // Prepare email parameters - Match template variables
    const templateParams = {
      name: name,
      title: message,
      phone: phone,
      to_email: "luxcode3@gmail.com"
    };
    
    console.log('📤 Sending with parameters:', templateParams);
    
    // Send email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email sent successfully!');
    console.log('Response:', response);
    
    return { 
      success: true, 
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.' 
        : 'Message sent successfully! We\'ll contact you soon.'
    };
    
  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    
    // Provide detailed error message
    let errorMsg = error.message || 'Unknown error';
    
    if (error.status === 422) {
      errorMsg = 'Invalid template parameters';
    } else if (error.status === 401) {
      errorMsg = 'Invalid EmailJS credentials';
    } else if (error.status === 404) {
      errorMsg = 'Service or template not found';
    }
    
    console.error('Final error message:', errorMsg);
    
    return { 
      success: false, 
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? `حدث خطأ: ${errorMsg}. يرجى المحاولة مرة أخرى.` 
        : `Error: ${errorMsg}. Please try again.`,
      error: error
    };
  }
}

// ============================================================
// COMBINED SEND FUNCTION
// ============================================================
async function sendContactMessage(name, phone, message) {
  try {
    console.log('🚀 Starting contact message send process...');
    
    // Send email
    const emailResult = await sendContactEmail(name, phone, message);
    
    console.log('📬 Email result:', emailResult);
    
    return emailResult;
    
  } catch (error) {
    console.error('❌ Contact message error:', error);
    return { 
      success: false, 
      message: typeof currentLang !== 'undefined' && currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.' 
        : 'Error sending message. Please try again.',
      error: error
    };
  }
}

// ============================================================
// EXPORT FUNCTIONS
// ============================================================
console.log('✅ Contact Email System loaded successfully');
console.log('📋 Available functions: sendContactEmail(), sendContactMessage()');

