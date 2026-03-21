# LuxCod - Setup Guide

## Firebase Configuration

البيانات موجودة بالفعل في `firebase-config.js`. لا تحتاج إلى أي إجراء إضافي.

### Firebase Features Enabled:
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Cloud Storage
- ✅ Cloud Functions (للبريد الإلكتروني)

---

## Email Configuration

### Option 1: EmailJS (الخيار الأسهل)
1. اذهب إلى [EmailJS](https://www.emailjs.com)
2. أنشئ حساب مجاني
3. أضف خدمة بريد (Gmail مثلاً)
4. انسخ `Service ID` و `Template ID` و `Public Key`
5. استبدل في `contact-email.js`:
   ```js
   emailjs.init("YOUR_PUBLIC_KEY");
   // في دالة sendContactEmail:
   emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {...})
   ```

### Option 2: Firebase Cloud Functions (الخيار الموصى به)
1. في Firebase Console، اذهب إلى Cloud Functions
2. أنشئ دالة جديدة:
   ```javascript
   exports.sendContactEmail = functions.https.onCall(async (data, context) => {
     const nodemailer = require('nodemailer');
     
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: 'your-email@gmail.com',
         pass: 'your-app-password' // استخدم App Password من Google
       }
     });

     const mailOptions = {
       from: 'your-email@gmail.com',
       to: 'luxcode3@gmail.com',
       subject: `رسالة جديدة من ${data.name}`,
       html: `
         <h2>رسالة جديدة من موقع LuxCod</h2>
         <p><strong>الاسم:</strong> ${data.name}</p>
         <p><strong>الهاتف:</strong> ${data.phone}</p>
         <p><strong>الرسالة:</strong></p>
         <p>${data.message}</p>
       `
     };

     await transporter.sendMail(mailOptions);
     return { success: true };
   });
   ```

---

## Payment Integration

### PayPal Setup:
1. اذهب إلى [PayPal Developer](https://developer.paypal.com)
2. أنشئ تطبيق جديد
3. انسخ `Client ID`
4. استبدل في `payments.js`:
   ```js
   const PAYPAL_CLIENT_ID = "YOUR_CLIENT_ID";
   ```

### Apple Pay:
- حالياً معلمة كـ "Coming Soon"
- يمكن تفعيلها لاحقاً

---

## Database Rules (Firestore)

ضع هذه القوانين في Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Ratings collection
    match /ratings/{document=**} {
      allow create: if request.auth != null;
      allow read: if true;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // Contacts collection
    match /contacts/{document=**} {
      allow create: if true;
      allow read, write: if false;
    }

    // Payments collection
    match /payments/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Authentication Rules

تم تفعيل:
- Email/Password Authentication
- User Profile Storage in Firestore
- Rating System with User Association

---

## Testing

### Test Account:
- Email: test@example.com
- Password: Test123456

### Test Features:
1. **Sign Up** - إنشاء حساب جديد
2. **Login** - تسجيل دخول
3. **Rate** - إضافة تقييم (يتطلب تسجيل دخول)
4. **Contact** - إرسال رسالة
5. **Payment** - اختيار طريقة دفع

---

## Important Notes

⚠️ **لا تشارك Firebase Config مع أحد** - إنه عام لكن يجب حمايته

✅ **استخدم Environment Variables** في الإنتاج

✅ **فعّل HTTPS** في الإنتاج

✅ **اختبر جميع الميزات** قبل النشر

---

## Support

للمساعدة:
- Firebase Documentation: https://firebase.google.com/docs
- EmailJS: https://www.emailjs.com/docs
- PayPal: https://developer.paypal.com/docs
