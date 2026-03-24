/* ============================================================
   LuxCod - Profanity Filter System
   ============================================================ */

// قائمة الكلمات النابية والمسيئة (يمكن توسيعها)
const PROFANITY_LIST = [
  // كلمات عربية نابية
  'كس', 'قحبة', 'زنا', 'ديوث', 'عاهرة', 'خنيث', 'ملعون', 'لعنة',
  'جنس', 'نيك', 'سحاق', 'لواط', 'شرموطة', 'منحرف', 'كافر',
  'يهودي', 'نصراني', 'شيعي', 'سني', 'وهابي', 'علماني',
  'حمار', 'بهيمة', 'كلب', 'خنزير', 'قرد', 'ثعبان',
  'ابن الكلب', 'ابن الزنا', 'ابن الحرام', 'يا قحبة', 'يا عاهرة',
  'شرموط', 'ديوث', 'خنيث', 'ملعون', 'لعين',
  
  // كلمات إنجليزية نابية
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap',
  'whore', 'slut', 'dick', 'cock', 'pussy', 'asshole', 'motherfucker',
  'nigger', 'faggot', 'retard', 'stupid', 'idiot', 'moron',
  'hell', 'dammit', 'piss', 'suck', 'sucks', 'sucking',
  
  // كلمات تمييزية ومسيئة
  'terrorist', 'extremist', 'racist', 'discrimination',
  'إرهابي', 'متطرف', 'عنصري', 'تمييز'
];

/**
 * فحص النص عن وجود كلمات نابية
 * @param {string} text - النص المراد فحصه
 * @returns {boolean} - true إذا كان يحتوي على كلمات نابية
 */
function hasProfanity(text) {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase().trim();
  
  for (let word of PROFANITY_LIST) {
    // البحث عن الكلمة كاملة أو كجزء من الكلمة
    const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
    if (regex.test(lowerText)) {
      return true;
    }
  }
  
  return false;
}

/**
 * تنظيف النص من الكلمات النابية بتغطيتها بنجوم
 * @param {string} text - النص المراد تنظيفه
 * @returns {string} - النص المنظف
 */
function filterProfanity(text) {
  if (!text || typeof text !== 'string') return text;
  
  let filteredText = text;
  
  for (let word of PROFANITY_LIST) {
    const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
    const replacement = '*'.repeat(word.length);
    filteredText = filteredText.replace(regex, replacement);
  }
  
  return filteredText;
}

/**
 * الحصول على قائمة الكلمات النابية الموجودة في النص
 * @param {string} text - النص المراد فحصه
 * @returns {array} - قائمة الكلمات النابية الموجودة
 */
function getProfanityWords(text) {
  if (!text || typeof text !== 'string') return [];
  
  const lowerText = text.toLowerCase();
  const foundWords = [];
  
  for (let word of PROFANITY_LIST) {
    const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
    if (regex.test(lowerText)) {
      foundWords.push(word);
    }
  }
  
  return [...new Set(foundWords)]; // إزالة التكرارات
}

/**
 * التحقق من صحة النص (بدون كلمات نابية وليس فارغاً)
 * @param {string} text - النص المراد التحقق منه
 * @returns {object} - {valid: boolean, message: string}
 */
function validateText(text, lang = 'ar') {
  if (!text || text.trim() === '') {
    return {
      valid: false,
      message: lang === 'ar' 
        ? 'النص لا يمكن أن يكون فارغاً' 
        : 'Text cannot be empty'
    };
  }
  
  if (hasProfanity(text)) {
    return {
      valid: false,
      message: lang === 'ar'
        ? 'النص يحتوي على كلمات غير مناسبة. يرجى تعديل تعليقك.'
        : 'Text contains inappropriate words. Please edit your comment.'
    };
  }
  
  return {
    valid: true,
    message: lang === 'ar' 
      ? 'النص صحيح' 
      : 'Text is valid'
  };
}

console.log('✅ Profanity Filter System loaded successfully');
