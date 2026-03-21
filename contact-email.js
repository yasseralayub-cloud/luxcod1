/* ============================================================
   LuxCod - Contact Email System (using EmailJS)
   ============================================================ */

'use strict';

// Initialize EmailJS
(function() {
  emailjs.init("YOUR_PUBLIC_KEY"); // Will be replaced with actual key
})();

// ============================================================
// SEND CONTACT EMAIL
// ============================================================
async function sendContactEmail(name, phone, message) {
  try {
    const response = await emailjs.send(
      "YOUR_SERVICE_ID", // Will be replaced
      "YOUR_TEMPLATE_ID", // Will be replaced
      {
        to_email: "luxcode3@gmail.com",
        from_name: name,
        from_email: "noreply@luxcod.com",
        phone: phone,
        message: message,
        reply_to: phone // For WhatsApp follow-up
      }
    );

    console.log('Email sent successfully:', response);
    return { success: true, message: 'تم إرسال الرسالة بنجاح' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'حدث خطأ في إرسال الرسالة' };
  }
}

// ============================================================
// ALTERNATIVE: FIREBASE CLOUD FUNCTION
// ============================================================
// If you want to use Firebase Cloud Functions instead:

async function sendContactEmailViaFirebase(name, phone, message) {
  try {
    const response = await firebase.functions().httpsCallable('sendContactEmail')({
      name: name,
      phone: phone,
      message: message,
      timestamp: new Date().toISOString()
    });

    console.log('Email sent via Firebase:', response.data);
    return { success: true, message: 'تم إرسال الرسالة بنجاح' };
  } catch (error) {
    console.error('Firebase function error:', error);
    return { success: false, message: 'حدث خطأ في إرسال الرسالة' };
  }
}

// ============================================================
// SAVE CONTACT TO FIRESTORE
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
      read: false
    });

    console.log('Contact message saved to Firestore');
    return { success: true };
  } catch (error) {
    console.error('Firestore error:', error);
    return { success: false };
  }
}

// ============================================================
// COMBINED SEND FUNCTION
// ============================================================
async function sendContactMessage(name, phone, message) {
  try {
    // Save to Firestore
    await saveContactMessage(name, phone, message);

    // Send email notification
    // Using Firebase Cloud Function (recommended)
    const emailResult = await sendContactEmailViaFirebase(name, phone, message);

    return emailResult;
  } catch (error) {
    console.error('Contact error:', error);
    return { 
      success: false, 
      message: currentLang === 'ar' 
        ? 'حدث خطأ في إرسال الرسالة' 
        : 'Error sending message'
    };
  }
}
