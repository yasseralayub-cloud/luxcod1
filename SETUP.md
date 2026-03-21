# LuxCod - Firebase & Authentication Setup Guide

## 🔧 Firebase Configuration

### Current Setup
- **Project ID:** `luxcode-167ee`
- **API Key:** `AIzaSyB8wFMz6xtLVtkpfVRac_wM6Ucaan6VOVk`
- **Auth Domain:** `luxcode-167ee.firebaseapp.com`
- **Database URL:** `https://luxcode-167ee.firebaseio.com`
- **Storage Bucket:** `luxcode-167ee.firebasestorage.app`

---

## 📧 Authentication Setup (مهم جداً)

### 1. Enable Email/Password Authentication

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروع `luxcode-167ee`
3. من القائمة الجانبية: **Authentication** → **Sign-in method**
4. فعّل **Email/Password**
5. تأكد من تفعيل **Email link (passwordless sign-in)** (اختياري)

### 2. Email Verification (تأكيد البريد)

عند التسجيل:
- يتلقى المستخدم بريد تحقق تلقائياً
- يجب تأكيد البريد قبل تسجيل الدخول
- الرابط يُرسل عبر Firebase مباشرة

### 3. Password Reset (إعادة تعيين كلمة المرور)

عند نسيان كلمة المرور:
- المستخدم يدخل بريده الإلكتروني
- يتلقى رابط إعادة تعيين تلقائياً
- يمكنه تعيين كلمة مرور جديدة مباشرة

---

## 🗄️ Firestore Database Setup

### Create Collections

#### 1. `users` Collection
```javascript
// Document ID: {user.uid}
{
  name: "string",           // اسم المستخدم
  email: "string",          // البريد الإلكتروني
  createdAt: "timestamp",   // تاريخ الإنشاء
  emailVerified: "boolean", // هل تم تأكيد البريد
  orders: ["array"],        // قائمة الطلبات
  ratings: ["array"]        // قائمة التقييمات
}
```

#### 2. `service_orders` Collection
```javascript
{
  userId: "string",           // معرف المستخدم
  userName: "string",         // اسم المستخدم
  userEmail: "string",        // بريد المستخدم
  serviceId: "string",        // معرف الخدمة
  serviceName: "string",      // اسم الخدمة
  details: "string",          // تفاصيل الطلب
  isUrgent: "boolean",        // هل الطلب عاجل
  basePrice: "string",        // السعر الأساسي
  finalPrice: "number",       // السعر النهائي
  status: "pending|completed|cancelled",
  createdAt: "timestamp",     // تاريخ الطلب
  language: "ar|en"           // لغة الطلب
}
```

#### 3. `ratings` Collection
```javascript
{
  userId: "string",           // معرف المستخدم
  userName: "string",         // اسم المستخدم
  rating: "number (1-5)",     // التقييم من 1 إلى 5
  comment: "string",          // التعليق
  approved: "boolean",        // هل تم الموافقة
  createdAt: "timestamp"      // تاريخ التقييم
}
```

---

## 🔐 Firestore Security Rules

اذهب إلى **Firestore Database** → **Rules** وأضف هذه القواعس:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users Collection - كل مستخدم يرى بيانته فقط
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    // Service Orders - الطلبات
    match /service_orders/{orderId} {
      // المستخدمون يمكنهم إنشاء طلبات
      allow create: if request.auth.uid != null;
      
      // كل مستخدم يرى طلباته فقط
      allow read: if request.auth.uid == resource.data.userId;
      
      // المسؤول يرى جميع الطلبات (استبدل ADMIN_UID بـ UID المسؤول الفعلي)
      allow read: if request.auth.uid == "ADMIN_UID";
      
      // فقط المالك يمكنه التحديث
      allow update: if request.auth.uid == resource.data.userId;
    }

    // Ratings - التقييمات
    match /ratings/{ratingId} {
      // المستخدمون يمكنهم إضافة تقييمات
      allow create: if request.auth.uid != null;
      
      // الجميع يرى التقييمات المنشورة
      allow read: if resource.data.approved == true;
      
      // كل مستخدم يرى تقييماته
      allow read: if request.auth.uid == resource.data.userId;
      
      // فقط المالك يمكنه التحديث
      allow update: if request.auth.uid == resource.data.userId;
    }

    // Default - رفض جميع الطلبات الأخرى
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📧 EmailJS Configuration

### Current Setup
| المفتاح | القيمة |
|--------|--------|
| Service ID | `service_tllf68q` |
| Template ID | `template_j8bjlhw` |
| Public Key | `njvn9St5gAnWLOI61` |
| Recipient Email | `luxcode3@gmail.com` |

### Email Template Variables

في EmailJS Dashboard، تأكد من وجود هذه المتغيرات في القالب:
- `{{to_email}}` - البريد المستقبل
- `{{from_name}}` - اسم المرسل
- `{{from_phone}}` - هاتف المرسل
- `{{message}}` - محتوى الرسالة

### Test EmailJS

1. اذهب إلى [EmailJS Dashboard](https://dashboard.emailjs.com)
2. اختر **Email Services**
3. تأكد من ربط Gmail بشكل صحيح
4. اختبر إرسال بريد تجريبي

---

## 🚀 Testing Checklist

### Test Email Verification ✅
```
1. اضغط على "إنشاء حساب"
2. أدخل بريدك الإلكتروني وكلمة مرور
3. تحقق من صندوق البريد الوارد
4. اضغط على رابط التحقق
5. حاول تسجيل الدخول - يجب أن ينجح
```

### Test Password Reset ✅
```
1. اضغط على "هل نسيت كلمة المرور؟"
2. أدخل بريدك الإلكتروني
3. تحقق من صندوق البريد الوارد
4. اضغط على رابط إعادة التعيين
5. عيّن كلمة مرور جديدة
6. سجّل دخول بالكلمة الجديدة
```

### Test Service Orders ✅
```
1. سجّل دخول بحسابك
2. اضغط على "اطلب الآن" في أي خدمة
3. ملء النموذج واختر "طلب عاجل" (اختياري)
4. اضغط "تأكيد الطلب"
5. تحقق من:
   - ظهور رسالة نجاح
   - حفظ الطلب في Firestore
   - إرسال بريد إلى luxcode3@gmail.com
   - ظهور الطلب في لوحة التحكم
```

### Test User Dashboard ✅
```
1. سجّل دخول
2. اضغط على "لوحتي" (Dashboard)
3. تحقق من:
   - عرض بيانات الملف الشخصي
   - عرض جميع الطلبات
   - عرض التقييمات
   - إمكانية تسجيل الخروج
```

---

## 🐛 Troubleshooting

### Email Verification Not Sending
**الحل:**
1. تأكد من تفعيل Email/Password في Firebase
2. تحقق من صندوق البريد الوارد والرسائل غير المرغوبة
3. تأكد من أن البريد الإلكتروني صحيح

### Can't Login After Email Verification
**الحل:**
1. تحقق من أن البريد تم تأكيده (emailVerified = true)
2. تأكد من كلمة المرور صحيحة
3. حاول تسجيل الخروج وتسجيل الدخول مرة أخرى

### Password Reset Link Not Working
**الحل:**
1. تحقق من أن البريد الإلكتروني موجود في Firebase
2. تأكد من عدم انتهاء صلاحية الرابط (24 ساعة)
3. حاول إعادة طلب رابط جديد

### Orders Not Saving
**الحل:**
1. تحقق من Firestore Rules (انظر أعلاه)
2. تأكد من أن المستخدم مسجل دخول
3. افتح Developer Console وتحقق من الأخطاء
4. تأكد من أن Firestore Database مفعّل

### Emails Not Sending to Admin
**الحل:**
1. تحقق من بيانات EmailJS صحيحة
2. اذهب إلى EmailJS Dashboard وتحقق من الأخطاء
3. تأكد من أن Gmail مفعّل في EmailJS
4. تحقق من صندوق البريد الوارد والرسائل غير المرغوبة

---

## 📱 Features Overview

### Authentication ✅
- تسجيل دخول بالبريد الإلكتروني
- إنشاء حساب جديد
- تأكيد البريد الإلكتروني (Email Verification)
- إعادة تعيين كلمة المرور (Password Reset)
- رسائل خطأ واضحة وثنائية اللغة

### Service Ordering ✅
- طلب الخدمات (4 خدمات متاحة)
- خيار الطلب العاجل (+30% للسعر)
- حفظ الطلبات في Firestore
- إرسال إشعارات للإدارة عبر EmailJS

### User Dashboard ✅
- عرض الملف الشخصي
- تتبع الطلبات (مع الحالة والسعر)
- عرض التقييمات
- إدارة الحساب

### Ratings System ✅
- إضافة تقييمات (1-5 نجوم)
- تعليقات على الخدمات
- موافقة المسؤول قبل النشر

---

## 🔒 Security Best Practices

- ✅ جميع البيانات الحساسة محمية بـ Firestore Rules
- ✅ كل مستخدم يرى بيانته فقط
- ✅ البريد الإلكتروني يجب تأكيده قبل الاستخدام
- ✅ كلمات المرور محمية بـ Firebase Authentication
- ✅ لا تشارك Firebase Config مع أحد

---

## 📞 Support & Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **EmailJS Docs:** https://www.emailjs.com/docs
- **Firebase Console:** https://console.firebase.google.com
- **Admin Email:** luxcode3@gmail.com

---

**آخر تحديث:** مارس 2026
**الإصدار:** 2.0 - Enhanced Authentication
