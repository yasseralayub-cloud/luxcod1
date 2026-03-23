/* ============================================================
   LuxCod - WhatsApp Integration
   ============================================================ */

'use strict';

const WHATSAPP_NUMBER = '966506572881';

const SERVICE_MESSAGES = {
  'website-design': {
    ar: 'مرحباً، أنا مهتم بخدمة تصميم المواقع الاحترافية. أود معرفة المزيد والحصول على عرض سعر.',
    en: 'Hello, I\'m interested in your professional website design service. I would like to know more and get a quote.'
  },
  'landing-page': {
    ar: 'مرحباً، أنا مهتم بخدمة صفحات الهبوط عالية التحويل. أود معرفة المزيد عن هذه الخدمة.',
    en: 'Hello, I\'m interested in your high-converting landing page service. I would like to learn more about this.'
  },
  'ui-ux-optimization': {
    ar: 'مرحباً، أنا مهتم بخدمة تحسين UI/UX. هل يمكنكم مساعدتي في تحسين موقعي الحالي؟',
    en: 'Hello, I\'m interested in your UI/UX optimization service. Can you help me improve my current website?'
  },
  'integrations': {
    ar: 'مرحباً، أنا مهتم بخدمة التكاملات الذكية (واتساب، خرائط، وسائل تواصل). أود معرفة المزيد.',
    en: 'Hello, I\'m interested in your smart integrations service (WhatsApp, Maps, Social Media). Tell me more.'
  },
  'whatsapp-bot': {
    ar: 'مرحباً، أنا مهتم ببوت الرد التلقائي للواتساب. كيف يمكنني الحصول على هذه الخدمة؟',
    en: 'Hello, I\'m interested in your WhatsApp bot service. How can I get started with this?'
  }
};

// Open WhatsApp Chat
function openWhatsAppChat(serviceType = null) {
  let message = 'مرحباً، أنا مهتم بخدماتكم';
  
  if (serviceType && SERVICE_MESSAGES[serviceType]) {
    message = SERVICE_MESSAGES[serviceType][currentLang] || SERVICE_MESSAGES[serviceType]['ar'];
  }

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // WhatsApp URL
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
}

// Open Service Order Modal (Alternative)
function openServiceOrderModal(serviceType) {
  // For now, redirect to WhatsApp
  openWhatsAppChat(serviceType);
}

console.log('✅ WhatsApp Integration loaded successfully');
